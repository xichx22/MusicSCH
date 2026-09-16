import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Card, Song } from './types'
import { comboKey, findApproved, load, newId, save, topicsFor, type DB } from './library/store'
import { log as logDiag } from './library/diag'
import { getSource } from './sources'
import { usePlayer, type NowPlaying } from './hooks/usePlayer'
import { PickGrid } from './screens/PickGrid'
import { Playing } from './screens/Playing'
import { Message } from './screens/Message'
import { Admin } from './screens/Admin'
import { PictureButton } from './components/PictureButton'
import { ParentGate } from './components/ParentGate'
import { HomeIcon } from './components/Icon'

/** 아이에게 한 번에 보여줄 노래 후보 수. 많으면 고르질 못한다. */
const MAX_CHOICES = 4

interface Choice {
  ref: string
  sourceId: string
  title: string
  emoji: string
  image?: string
  /** 검색으로 갓 찾은 곡인가 (아직 아빠 확인 전) */
  songId?: string
}

type Step =
  | { name: 'character' }
  | { name: 'topic'; character: Card }
  | { name: 'choose'; character: Card; topic: Card; choices: Choice[] }
  | { name: 'empty'; character: Card }
  | { name: 'limit' }
  | { name: 'admin' }

export default function App() {
  const [db, setDbState] = useState<DB>(load)
  const [step, setStep] = useState<Step>({ name: 'character' })
  const [busy, setBusy] = useState(false)

  const setDb = useCallback((updater: (d: DB) => DB) => {
    setDbState((prev) => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [])

  const limitReached =
    db.settings.dailyLimitMin > 0 && db.usage.secondsPlayed >= db.settings.dailyLimitMin * 60

  const onTick = useCallback(
    (sec: number) => setDb((d) => ({ ...d, usage: { ...d.usage, secondsPlayed: d.usage.secondsPlayed + sec } })),
    [setDb],
  )

  const { now, error, play, stop, clearError } = usePlayer(db.settings.maxVolume, onTick)

  // 하루 제한을 넘기면 재생을 멈추고 '오늘은 끝' 화면으로 보낸다.
  useEffect(() => {
    if (limitReached && now) {
      stop()
      setStep({ name: 'limit' })
    }
  }, [limitReached, now, stop])

  const characters = useMemo(() => db.cards.filter((c) => c.kind === 'character' && !c.hidden), [db.cards])

  const goHome = () => {
    stop()
    clearError()
    setStep({ name: 'character' })
  }

  /** 카드 두 장이 정해지면 A목록을 먼저 보고, 없으면 검색한다. */
  const resolve = async (character: Card, topic: Card) => {
    const words = [character.word, topic.word]
    const fallbackEmoji = character.emoji

    // A: 아빠가 확인해둔 노래
    const hits = findApproved(db.songs, words).slice(0, MAX_CHOICES)
    if (hits.length > 0) {
      const choices = hits.map<Choice>((s) => ({
        ref: s.ref,
        sourceId: s.sourceId,
        title: s.title,
        emoji: s.emoji ?? fallbackEmoji,
        image: s.image,
        songId: s.id,
      }))
      if (choices.length === 1) return start(choices[0])
      return setStep({ name: 'choose', character, topic, choices })
    }

    // B: 새 노래 찾아보기.
    // 고른 소스가 아직 준비가 안 됐으면(로그인 전 등) 내 음원에서라도 찾아본다.
    let source = getSource(db.settings.searchSourceId)
    if (!(await source.isReady())) {
      logDiag(`${source.label} 준비 안 됨`, false, source.readyHint())
      source = getSource('local')
    }
    if (!db.settings.searchEnabled || !source.canSearch || !(await source.isReady())) {
      logDiag('검색 못 함', false, db.settings.searchEnabled ? '쓸 수 있는 검색 소스가 없어' : '검색이 꺼져 있어')
      return setStep({ name: 'empty', character })
    }

    setBusy(true)
    try {
      const found = await source.search(words.join(' '))
      // 이 조합에 노래가 있는지 기억해둔다. 없으면 다음부터 카드를 감춘다.
      setDb((d) => ({
        ...d,
        checks: { ...d.checks, [comboKey(character.id, topic.id)]: { at: Date.now(), count: found.length } },
      }))
      const results = found.slice(0, MAX_CHOICES)
      if (results.length === 0) return setStep({ name: 'empty', character })

      // 검색으로 찾은 곡은 '확인 전' 상태로 저장해둔다. 아빠가 승인하면 A목록이 된다.
      const added: Song[] = results.map((r) => ({
        id: newId(),
        title: r.title,
        sourceId: source.id,
        ref: r.ref,
        tags: words,
        durationSec: r.durationSec,
        emoji: fallbackEmoji,
        image: r.thumbnail,
        playCount: 0,
        approved: false,
        addedAt: Date.now(),
      }))
      setDb((d) => {
        const known = new Set(d.songs.map((s) => `${s.sourceId}:${s.ref}`))
        return { ...d, songs: [...d.songs, ...added.filter((s) => !known.has(`${s.sourceId}:${s.ref}`))] }
      })
      const choices = added.map<Choice>((s) => ({
        ref: s.ref,
        sourceId: s.sourceId,
        title: s.title,
        emoji: s.emoji ?? fallbackEmoji,
        image: s.image,
        songId: s.id,
      }))
      if (choices.length === 1) return start(choices[0])
      setStep({ name: 'choose', character, topic, choices })
    } catch (e) {
      // 지한이에게는 늘 같은 화면을 보여주되, 진짜 이유는 아빠 화면에 남긴다.
      logDiag(`검색 실패 "${words.join(' ')}"`, false, e instanceof Error ? e.message : String(e))
      setStep({ name: 'empty', character })
    } finally {
      setBusy(false)
    }
  }

  const start = (choice: Choice) => {
    if (limitReached) return setStep({ name: 'limit' })
    if (choice.songId) {
      setDb((d) => ({
        ...d,
        songs: d.songs.map((s) => (s.id === choice.songId ? { ...s, playCount: s.playCount + 1 } : s)),
      }))
    }
    const target: NowPlaying = {
      sourceId: choice.sourceId,
      ref: choice.ref,
      title: choice.title,
      emoji: choice.emoji,
      image: choice.image,
    }
    void play(target)
  }

  if (step.name === 'admin') {
    return <Admin db={db} setDb={setDb} onClose={goHome} />
  }

  const gate = <ParentGate pin={db.settings.parentPin} onOpen={() => { stop(); setStep({ name: 'admin' }) }} />

  if (now) {
    return (
      <>
        <Playing now={now} onStop={goHome} />
        {gate}
      </>
    )
  }

  let body
  if (busy) {
    body = <Message emoji="🎵" text="노래 찾는 중..." />
  } else if (error) {
    body = <Message emoji="😢" text="노래를 틀 수 없어요" onBack={goHome} />
  } else if (step.name === 'limit') {
    body = <Message emoji="🌙" text="오늘은 여기까지!" />
  } else if (step.name === 'empty') {
    body = <Message emoji="🤔" text="그 노래는 아직 없어요" onBack={goHome} />
  } else if (step.name === 'choose') {
    body = (
      <div className="screen">
        <div className="chosen-strip">
          <PictureButton {...step.character} label={step.character.label ?? step.character.word} onClick={() => {}} static />
          <span className="plus">＋</span>
          <PictureButton {...step.topic} label={step.topic.label ?? step.topic.word} onClick={() => {}} static />
        </div>
        <div className="grid grid-2">
          {step.choices.map((c) => (
            <PictureButton
              key={`${c.sourceId}:${c.ref}`}
              id={`song:${c.ref}`}
              emoji={c.emoji}
              image={c.image}
              label={c.title}
              color="#E4DFF3"
              onClick={() => start(c)}
            />
          ))}
        </div>
        <div className="bottom-row">
          <button className="back" onClick={goHome} aria-label="뒤로">
            <HomeIcon />
          </button>
        </div>
      </div>
    )
  } else if (step.name === 'topic') {
    body = (
      <PickGrid
        key={step.character.id}
        cards={topicsFor(db, step.character.id)}
        chosen={step.character}
        onPick={(topic) => void resolve(step.character, topic)}
        onBack={goHome}
      />
    )
  } else {
    // 캐릭터는 첫 화면이라 넘기지 않고 한 번에 다 보여준다.
    body = (
      <PickGrid
        cards={characters}
        pageSize={9}
        onPick={(character) => setStep({ name: 'topic', character })}
      />
    )
  }

  return (
    <>
      {body}
      {gate}
    </>
  )
}
