import { useMemo, useState } from 'react'
import { newId, comboKey, type DB } from '../library/store'
import { autoAssignTopics, autoSummary, betterWord, guessEmoji, wordsOf } from '../library/autotopic'
import type { Card } from '../types'

/** 카드 색을 돌아가며 쓴다. */
const COLORS = ['#FBDCD4', '#D7E3F7', '#FBE0E8', '#FAE8C6', '#CFEADD', '#EFE0C8', '#DED9F3', '#D8EFF3']

interface Candidate {
  word: string
  count: number
  songIds: string[]
}

/**
 * 목록에서 카드 만들기.
 *
 * 카드를 먼저 정해두고 노래를 끼워 맞추면, 실제로 있지도 않은 카드가
 * 잔뜩 남는다. 반대로 간다. 넣어둔 노래의 제목을 보고 자주 나오는 말을
 * 뽑아 카드 후보로 내놓고, 아빠가 고르면 그 말이 든 곡을 한꺼번에 붙인다.
 */
export function BuildCards({ db, setDb }: { db: DB; setDb: (u: (d: DB) => DB) => void }) {
  const [note, setNote] = useState('')

  const pending = useMemo(() => db.songs.filter((s) => s.needsTopic), [db.songs])
  const characters = db.cards.filter((c) => c.kind === 'character')
  const topics = db.cards.filter((c) => c.kind === 'topic')

  /** 캐릭터별로, 아직 주제를 못 정한 곡 제목에서 자주 나오는 말을 뽑는다. */
  const candidates = useMemo(() => {
    const out = new Map<string, Candidate[]>()

    for (const character of characters) {
      const mine = pending.filter((s) => s.needsTopic === character.id)
      if (mine.length === 0) continue

      const counter = new Map<string, string[]>()
      for (const song of mine) {
        for (const w of wordsOf(song.title, character.word)) {
          counter.set(w, [...(counter.get(w) ?? []), song.id])
        }
      }

      const list = [...counter.entries()]
        .map(([word, songIds]) => ({ word, count: songIds.length, songIds }))
        // 한 곡에만 나오는 말은 카드로 만들 값어치가 없다
        .filter((c) => c.count >= 2)
        // 이미 있는 카드는 뺀다
        .filter((c) => !topics.some((t) => t.word === c.word))
        .sort(betterWord)
        .slice(0, 12)

      if (list.length > 0) out.set(character.id, list)
    }
    return out
  }, [pending, characters, topics])

  /** 이 말로 카드를 만들고, 그 말이 든 곡을 붙인다. */
  const makeCard = (character: Card, cand: Candidate) => {
    const topicId = `t-made-${newId()}`
    const color = COLORS[db.cards.length % COLORS.length]
    const ids = new Set(cand.songIds)
    const key = comboKey(character.id, topicId)

    setDb((d) => ({
      ...d,
      cards: [
        ...d.cards,
        {
          id: topicId,
          kind: 'topic',
          word: cand.word,
          emoji: guessEmoji(cand.word),
          color,
          // 이 캐릭터의 노래에서 뽑은 말이라 다른 캐릭터에는 안 보인다.
          forCharacters: [character.id],
        },
      ],
      songs: d.songs.map((s) =>
        ids.has(s.id)
          ? { ...s, combo: key, needsTopic: undefined, tags: [character.word, cand.word] }
          : s,
      ),
      checks: { ...d.checks, [key]: { at: Date.now(), count: cand.count } },
    }))
    setNote(`"${cand.word}" 카드를 만들고 ${cand.count}곡을 붙였어. 그림은 아래에서 바꿀 수 있어.`)
  }

  /**
   * 남은 곡을 전부 알아서 정한다.
   *
   * 1. 두 곡 이상에 나오는 말은 카드로 만들어 한꺼번에 붙인다
   * 2. 그러고도 남은 곡은 제목에서 고른 말로 한 곡짜리 카드를 만든다
   * 3. 카드가 너무 많아지면(아이가 못 고른다) 나머지는 '그 밖의 노래' 로 모은다
   */
  /** 남은 곡을 전부 알아서 정한다. */
  const autoAssign = () => {
    const r = autoAssignTopics(db)
    setDb(() => r.db)
    setNote(autoSummary(r))
  }

  /** 남은 곡 하나를 이미 있는 카드에 붙인다. */
  const assign = (songId: string, characterId: string, topicId: string) => {
    const character = characters.find((c) => c.id === characterId)
    const topic = topics.find((t) => t.id === topicId)
    if (!character || !topic) return
    const key = comboKey(character.id, topic.id)
    setDb((d) => ({
      ...d,
      songs: d.songs.map((s) =>
        s.id === songId
          ? { ...s, combo: key, needsTopic: undefined, tags: [character.word, topic.word] }
          : s,
      ),
      checks: { ...d.checks, [key]: { at: Date.now(), count: 1 } },
    }))
  }

  if (pending.length === 0) {
    return (
      <section>
        <h2>목록에서 카드 만들기</h2>
        {note && <p className="hint">{note}</p>}
        <p className="hint">주제를 못 정한 곡이 없어. 앨범을 더 넣으면 여기에 모인다.</p>
      </section>
    )
  }

  return (
    <section>
      <h2>목록에서 카드 만들기 ({pending.length}곡)</h2>
      <p className="hint">
        앨범을 통째로 가져오면 제목만으로 주제를 못 정하는 곡이 나온다. 버리지 않고 여기 모아둔다.
        <strong> 그 곡들의 제목에서 자주 나오는 말</strong>을 뽑아 카드 후보로 내놓으니,
        누르면 카드가 생기고 그 말이 든 곡이 한꺼번에 붙는다.
      </p>
      <button onClick={autoAssign}>남은 곡 알아서 다 정하기</button>
      {note && <p className="hint">{note}</p>}

      {[...candidates.entries()].map(([cid, list]) => {
        const character = characters.find((c) => c.id === cid)!
        return (
          <div key={cid} className="recommend-group">
            <strong>{character.label ?? character.word} — 카드로 만들 만한 말</strong>
            <div className="album-list">
              {list.map((c) => (
                <button key={c.word} className="album-btn" onClick={() => makeCard(character, c)}>
                  <span className="album-name">{c.word}</span>
                  <small>{c.count}곡</small>
                </button>
              ))}
            </div>
          </div>
        )
      })}

      <div className="recommend-group">
        <strong>아직 주제를 못 정한 곡</strong>
        <ul className="pending">
          {pending.slice(0, 40).map((s) => (
            <li key={s.id}>
              <span className="plan-title">{s.title}</span>
              <select
                value=""
                onChange={(e) => e.target.value && assign(s.id, s.needsTopic!, e.target.value)}
              >
                <option value="">카드 고르기</option>
                {topics
                  .filter((t) => !t.forCharacters || t.forCharacters.includes(s.needsTopic!))
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label ?? t.word}
                    </option>
                  ))}
              </select>
            </li>
          ))}
        </ul>
        {pending.length > 40 && <p className="hint">…그 외 {pending.length - 40}곡</p>}
      </div>
    </section>
  )
}
