import { useMemo, useState } from 'react'
import type { DB } from '../library/store'
import { repairCards } from '../library/repair'
import { toKorean } from '../library/english'

/**
 * 카드 다시 정리하기.
 *
 * 번역과 정리 규칙은 계속 좋아지는데 이미 만든 카드는 옛날 규칙 그대로다.
 * 그래서 'Rescue' 같은 영어 카드와 '그 밖의 노래' 가 여러 장 쌓인다.
 * 이 버튼이 알아서 만든 카드를 전부 풀어서 처음부터 다시 정한다.
 */
export function FixCards({ db, setDb }: { db: DB; setDb: (u: (d: DB) => DB) => void }) {
  const [asking, setAsking] = useState(false)
  const [note, setNote] = useState('')

  const made = useMemo(
    () => db.cards.filter((c) => c.kind === 'topic' && c.id.startsWith('t-made-')),
    [db.cards],
  )

  /** 고쳐야 티가 나는 카드 — 영어가 남았거나 '그 밖의 노래' 인 것. */
  const bad = made.filter(
    (c) => /[A-Za-z]/.test(c.word) || c.word === '그 밖의 노래' || toKorean(c.word) !== c.word,
  )

  if (made.length === 0) return null

  const run = () => {
    const r = repairCards(db)
    setDb(() => r.db)
    setAsking(false)
    setNote(
      `${r.removed}장을 풀어서 ${r.moved}곡을 다시 정했어.` +
        (r.toSeed ? ` 그중 ${r.toSeed}곡은 원래 있던 카드(소방차·버스 같은 것)로 들어갔어.` : ''),
    )
  }

  return (
    <section>
      <h2>카드 다시 정리하기</h2>
      <p className="hint">
        번역이랑 정리 규칙이 좋아져도 <strong>이미 만든 카드는 옛날 그대로</strong>다.
        그래서 영어 카드와 &lsquo;그 밖의 노래&rsquo; 가 쌓인다. 이걸 누르면 알아서 만든 카드
        {made.length}장을 전부 풀어서 처음부터 다시 정한다.
        소방차·버스처럼 원래 있던 카드와 거기 붙은 곡은 건드리지 않는다.
      </p>
      {bad.length > 0 && (
        <p className="hint">
          고쳐야 할 것 같은 카드 {bad.length}장:{' '}
          <strong>{bad.slice(0, 8).map((c) => c.word).join(', ')}</strong>
          {bad.length > 8 && ` 외 ${bad.length - 8}장`}
        </p>
      )}
      {asking ? (
        <>
          <button onClick={run}>그래, 다시 정리해</button>
          <button className="link" onClick={() => setAsking(false)}>
            그만두기
          </button>
        </>
      ) : (
        <button onClick={() => setAsking(true)}>카드 {made.length}장 다시 정리하기</button>
      )}
      {note && <p className="hint">{note}</p>}
    </section>
  )
}
