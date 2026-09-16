import { useRef, useState } from 'react'
import type { Card } from '../types'
import { comboKey, type DB } from '../library/store'
import { getSource } from '../sources'
import { SpotifyRateLimitError } from '../sources/spotify'
import { setQuiet } from '../library/diag'

/** 스포티파이에 너무 몰아치지 않도록 한 번 물어보고 쉬는 시간(ms). */
const GAP_MS = 250
/** 연달아 이만큼 오류가 나면 뭔가 잘못된 것이니 멈춘다. */
const MAX_ERRORS = 3
/** 같은 조합을 너무 자주 불러 막혔을 때 다시 시도하는 횟수. */
const MAX_RETRIES = 4

interface Pair {
  character: Card
  topic: Card
}

function pairsOf(db: DB): Pair[] {
  const characters = db.cards.filter((c) => c.kind === 'character' && !c.hidden)
  const topics = db.cards.filter((c) => c.kind === 'topic' && !c.hidden)
  const out: Pair[] = []
  for (const character of characters) {
    for (const topic of topics) {
      if (topic.forCharacters && !topic.forCharacters.includes(character.id)) continue
      out.push({ character, topic })
    }
  }
  return out
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * 조합 점검.
 *
 * 카드 조합을 전부 스포티파이에 물어보고, 노래가 없는 조합은 지한이 화면에서
 * 감춘다. 무슨 조합에 음원이 있는지 내가 추측하는 것보다 실제로 물어보는 쪽이
 * 정확하다. 오류가 난 조합은 '없음' 으로 치지 않는다 (지우면 안 되니까).
 */
export function ComboCheck({ db, setDb }: { db: DB; setDb: (u: (d: DB) => DB) => void }) {
  const [running, setRunning] = useState(false)
  const [note, setNote] = useState('')
  // 돌고 있는 루프 안에서 읽어야 해서 state 가 아니라 ref 로 둔다.
  // state 는 루프가 시작될 때 값이 박혀버려서 멈추기 버튼이 안 먹는다.
  const stopRef = useRef(false)

  const checked = Object.keys(db.checks).length
  const withSongs = Object.values(db.checks).filter((c) => c.count > 0).length

  const run = async (onlyNew: boolean) => {
    const source = getSource(db.settings.searchSourceId)
    if (!(await source.isReady())) {
      setNote(source.readyHint())
      return
    }

    const all = pairsOf(db)
    const pairs = onlyNew
      ? all.filter(({ character, topic }) => !db.checks[comboKey(character.id, topic.id)])
      : all
    if (pairs.length === 0) {
      setNote('새로 확인할 조합이 없어.')
      return
    }
    setRunning(true)
    stopRef.current = false
    setQuiet(true)

    const found: Record<string, { at: number; count: number }> = {}
    let done = 0
    let hits = 0
    let errors = 0
    let stopped = ''

    for (const { character, topic } of pairs) {
      if (stopRef.current) {
        stopped = '중간에 멈췄어'
        break
      }
      let tries = 0
      let settled = false
      while (tries <= MAX_RETRIES && !settled && !stopRef.current) {
        try {
          const results = await source.search(`${character.word} ${topic.word}`)
          found[comboKey(character.id, topic.id)] = { at: Date.now(), count: results.length }
          if (results.length > 0) hits += 1
          errors = 0
          settled = true
        } catch (e) {
          // 너무 자주 불러서 막힌 건 실패가 아니다. 기다렸다 같은 조합을 다시 물어본다.
          if (e instanceof SpotifyRateLimitError) {
            tries += 1
            setNote(`${done}/${pairs.length} · 스포티파이가 ${e.retryAfterSec}초 쉬래, 기다리는 중`)
            await wait((e.retryAfterSec + 1) * 1000)
            continue
          }
          errors += 1
          if (errors >= MAX_ERRORS) {
            stopped = `오류가 계속 나서 멈췄어: ${e instanceof Error ? e.message : String(e)}`
          }
          break
        }
      }
      if (stopped) break
      done += 1
      setNote(`${done}/${pairs.length} 확인 · 노래 있는 조합 ${hits}개`)
      await wait(GAP_MS)
    }

    setQuiet(false)
    // 점검한 것만 덮어쓴다. 못 물어본 조합은 건드리지 않는다.
    setDb((d) => ({ ...d, checks: { ...d.checks, ...found } }))
    setRunning(false)
    setNote(
      `${stopped ? stopped + ' · ' : ''}${done}개 확인, 노래 있는 조합 ${hits}개, ` +
        `빈 조합 ${done - hits}개는 지한이 화면에서 감췄어`,
    )
  }

  return (
    <section>
      <h2>조합 점검</h2>
      <p className="hint">
        카드 조합을 전부 스포티파이에 물어보고, 노래가 없는 조합은 지한이 화면에서 감춘다.
        전체 {pairsOf(db).length}개 조합 · 확인한 것 {checked}개 (노래 있음 {withSongs}개).
        몇 분 걸리니 화면을 켜둔 채로 기다려줘.
      </p>
      {running ? (
        <button onClick={() => { stopRef.current = true }}>멈추기</button>
      ) : (
        <>
          <button onClick={() => void run(false)}>전부 점검하기</button>
          {checked > 0 && (
            <button onClick={() => void run(true)}>안 해본 것만</button>
          )}
        </>
      )}
      {checked > 0 && !running && (
        <button
          className="link"
          onClick={() => {
            setDb((d) => ({ ...d, checks: {} }))
            setNote('점검 결과를 지웠어. 모든 카드가 다시 보여.')
          }}
        >
          결과 지우기
        </button>
      )}
      {note && <p className="hint">{note}</p>}
      {checked > 0 && <ComboSummary db={db} />}
    </section>
  )
}

/** 캐릭터별로 어떤 주제에 노래가 있었는지 한눈에 보여준다. */
function ComboSummary({ db }: { db: DB }) {
  const characters = db.cards.filter((c) => c.kind === 'character' && !c.hidden)
  return (
    <ul className="combo">
      {characters.map((character) => {
        const hits = db.cards.filter(
          (t) => t.kind === 'topic' && (db.checks[comboKey(character.id, t.id)]?.count ?? 0) > 0,
        )
        return (
          <li key={character.id}>
            <strong>
              {character.emoji} {character.label ?? character.word} ({hits.length})
            </strong>
            <span>{hits.length ? hits.map((t) => t.label ?? t.word).join(', ') : '노래를 못 찾았어'}</span>
          </li>
        )
      })}
    </ul>
  )
}
