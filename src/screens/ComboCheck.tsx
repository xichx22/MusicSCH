import { useRef, useState } from 'react'
import type { Card } from '../types'
import { comboKey, type DB } from '../library/store'
import { getSource } from '../sources'
import { SpotifyRateLimitError } from '../sources/spotify'
import { setQuiet } from '../library/diag'

/**
 * 한 번 물어보고 쉬는 시간(ms).
 * 개발자 모드는 하루 할당량이 넉넉하지 않다. 238개 조합을 250ms 간격으로
 * 몰아쳤더니 한 번에 다 써버렸다. 천천히 간다.
 */
const GAP_MS = 700
/** 연달아 이만큼 오류가 나면 뭔가 잘못된 것이니 멈춘다. */
const MAX_ERRORS = 3
/** 같은 조합을 너무 자주 불러 막혔을 때 다시 시도하는 횟수. */
const MAX_RETRIES = 4
/**
 * 한 번에 물어볼 조합 수.
 * 238개를 한 번에 몰아쳤다가 할당량을 통째로 태웠고, 그 뒤로는 새 노래를
 * 며칠 못 찾았다. 조금씩 나눠서 하면 남은 할당량으로 지한이가 계속 쓸 수 있다.
 */
const BATCH = 40

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
    const todo = onlyNew
      ? all.filter(({ character, topic }) => !db.checks[comboKey(character.id, topic.id)])
      : all
    // 남은 할당량을 한 번에 태우지 않게 조금씩 끊는다.
    const pairs = todo.slice(0, BATCH)
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
          if (e instanceof SpotifyRateLimitError) {
            /*
             * 할당량을 다 쓴 것과 잠깐 너무 빨리 부른 것은 다르다.
             * 할당량은 기다렸다 다시 해도 안 풀리고, 재시도하면 더 깎인다.
             * 여기서 멈추고 지금까지 확인한 것만 저장한다.
             */
            if (e.quota) {
              stopped = '오늘 쓸 수 있는 양을 다 썼어. 여기까지 저장했으니 내일 [안 해본 것만] 으로 이어서 하면 돼'
              break
            }
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
    const left = todo.length - done
    setNote(
      `${stopped ? stopped + ' · ' : ''}${done}개 확인, 노래 있는 조합 ${hits}개, ` +
        `빈 조합 ${done - hits}개는 지한이 화면에서 감췄어.` +
        (left > 0 ? ` 아직 ${left}개 남았어 — [안 해본 것만] 으로 이어서 하면 돼.` : ''),
    )
  }

  return (
    <section>
      <h2>조합 점검</h2>
      <p className="hint">
        카드 조합을 전부 스포티파이에 물어보고, 노래가 없는 조합은 지한이 화면에서 감춘다.
        받은 결과는 제목·가수·앨범에 <strong>낱말이 전부 들어 있는 것만</strong> 남긴다.
        스포티파이 검색은 '타요 견인차' 에 송대관 유행가를 주기도 한다.
        전체 {pairsOf(db).length}개 조합 · 확인한 것 {checked}개 (노래 있음 {withSongs}개).
        스포티파이 할당량이 넉넉하지 않아 <strong>한 번에 {BATCH}개씩</strong>만 물어본다
        (약 {Math.ceil((BATCH * GAP_MS) / 60000)}분). 끝나면 <strong>안 해본 것만</strong> 을
        눌러 이어서 하면 된다. 할당량이 떨어지면 거기까지 저장하고 멈춘다.
        한꺼번에 다 하려다 할당량을 통째로 태우면 며칠 동안 새 노래를 못 찾는다.
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
