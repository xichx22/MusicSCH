import { useState } from 'react'
import { comboKey, type DB } from '../library/store'
import { getSource } from '../sources'
import { findArtistArt, findTopicArt } from '../sources/spotify'
import { setQuiet } from '../library/diag'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * 카드 그림 관리.
 *
 * 이모지로는 아이가 '뽀로로' 를 못 알아본다. 공식 그림을 내려받아 저장소에
 * 넣으면 저작권 문제가 되니, 스포티파이가 API 로 주는 아티스트 사진을 쓴다.
 * 마음에 안 들면 아빠가 직접 주소를 넣거나 직접 찍은 사진을 쓸 수 있다.
 */
export function CardArt({ db, setDb }: { db: DB; setDb: (u: (d: DB) => DB) => void }) {
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const [matched, setMatched] = useState<Record<string, string>>({})
  // 이름이 맞는 아티스트를 못 찾은 카드. 붙어 있는 사진이 남의 것일 수 있다.
  const [unmatched, setUnmatched] = useState<Record<string, boolean>>({})

  const characters = db.cards.filter((c) => c.kind === 'character')
  const topics = db.cards.filter((c) => c.kind === 'topic' && !c.hidden)
  const topicsWithSongs = topics.filter((t) =>
    characters.some((c) => (db.checks[comboKey(c.id, t.id)]?.count ?? 0) > 0),
  )

  const fetchAll = async (onlyMissing: boolean) => {
    const source = getSource('spotify')
    if (!(await source.isReady())) {
      setNote(source.readyHint())
      return
    }

    const targets = onlyMissing ? characters.filter((c) => !c.image) : characters
    if (targets.length === 0) {
      setNote('사진이 없는 캐릭터가 없어.')
      return
    }

    setBusy(true)
    setQuiet(true)
    // 같은 사진이 두 카드에 붙으면 아이가 구별을 못 한다.
    const used = new Set(
      db.cards.filter((c) => c.image && !targets.some((t) => t.id === c.id)).map((c) => c.image!),
    )
    const images: Record<string, string> = {}
    const names: Record<string, string> = {}
    const missed: Record<string, boolean> = {}
    let found = 0
    let dup = 0

    for (const card of targets) {
      setNote(`${card.label ?? card.word} 찾는 중...`)
      try {
        const art = await findArtistArt(card.word)
        if (!art) {
          missed[card.id] = true
        } else {
          names[card.id] = art.name
          missed[card.id] = false
          if (art.image) {
            if (used.has(art.image)) {
              dup += 1
            } else {
              used.add(art.image)
              images[card.id] = art.image
              found += 1
            }
          }
        }
      } catch (e) {
        setNote(`${card.label ?? card.word} 에서 막혔어: ${e instanceof Error ? e.message : String(e)}`)
        break
      }
      await wait(300)
    }

    setQuiet(false)
    setMatched((m) => ({ ...m, ...names }))
    setUnmatched((m) => ({ ...m, ...missed }))
    setDb((d) => ({
      ...d,
      cards: d.cards.map((c) => (images[c.id] ? { ...c, image: images[c.id] } : c)),
    }))
    setBusy(false)
    const missCount = Object.values(missed).filter(Boolean).length
    setNote(
      `${targets.length}명 중 ${found}명 사진을 찾았어.` +
        (missCount ? ` ${missCount}명은 이름이 맞는 아티스트가 없어서 그냥 뒀어 (아래 ⚠️).` : '') +
        (dup ? ` 겹치는 사진 ${dup}개는 안 썼어.` : ''),
    )
  }

  /**
   * 주제 카드(소방차, 양치, 생일 ...) 그림.
   *
   * 검색해서 나온 첫 곡의 앨범 표지를 그냥 쓰면 안 된다. 소방차와 자동차가
   * 같은 '뽀로로 자동차 동요' 앨범에 들어 있어서 두 카드가 똑같아진다.
   * 앨범 이름에 그 낱말이 들어 있을 때만 쓰고, 그래도 겹치면 안 쓴다.
   * 구별 안 되는 그림보다는 이모지가 낫다.
   */
  const fetchTopicArt = async (onlyMissing: boolean) => {
    const source = getSource('spotify')
    if (!(await source.isReady())) {
      setNote(source.readyHint())
      return
    }
    const targets = onlyMissing ? topicsWithSongs.filter((t) => !t.image) : topicsWithSongs
    if (targets.length === 0) {
      setNote(
        topicsWithSongs.length === 0
          ? '먼저 조합 점검을 돌려줘. 어느 조합에 노래가 있는지 알아야 그림을 가져올 수 있어.'
          : '그림이 없는 주제 카드가 없어.',
      )
      return
    }

    setBusy(true)
    setQuiet(true)
    // 이미 쓰이고 있는 그림. 같은 그림이 두 카드에 붙으면 구별이 안 된다.
    const used = new Set(
      db.cards.filter((c) => c.image && !targets.some((t) => t.id === c.id)).map((c) => c.image!),
    )
    const images: Record<string, string> = {}
    const froms: Record<string, string> = {}
    let found = 0
    let dup = 0

    for (const topic of targets) {
      const character = characters.find((c) => (db.checks[comboKey(c.id, topic.id)]?.count ?? 0) > 0)
      if (!character) continue
      setNote(`${topic.label ?? topic.word} 찾는 중... (${found}개 찾음)`)
      try {
        const art = await findTopicArt(`${character.word} ${topic.word}`, topic.word)
        if (art) {
          if (used.has(art.image)) {
            dup += 1
          } else {
            used.add(art.image)
            images[topic.id] = art.image
            froms[topic.id] = art.from
            found += 1
          }
        }
      } catch (e) {
        setNote(`${topic.label ?? topic.word} 에서 막혔어: ${e instanceof Error ? e.message : String(e)}`)
        break
      }
      await wait(300)
    }

    setQuiet(false)
    setMatched((m) => ({ ...m, ...froms }))
    setDb((d) => ({
      ...d,
      cards: d.cards.map((c) => (images[c.id] ? { ...c, image: images[c.id] } : c)),
    }))
    setBusy(false)
    setNote(
      `주제 ${targets.length}개 중 ${found}개에 그림을 넣었어. ` +
        `나머지는 그 주제를 나타내는 앨범이 없어서${dup ? ` (겹치는 그림 ${dup}개 포함)` : ''} 이모지 그대로 뒀어. ` +
        `소방차·양치 같은 건 이모지가 오히려 잘 보여.`,
    )
  }

  /** 주제 카드 그림만 지운다. 캐릭터 사진은 그대로 둔다. */
  const clearTopicArt = () => {
    setDb((d) => ({
      ...d,
      cards: d.cards.map((c) => (c.kind === 'topic' ? { ...c, image: undefined } : c)),
    }))
    setNote('주제 카드 그림을 지웠어. 이모지로 돌아갔어.')
  }

  const setImage = (id: string, image: string) =>
    setDb((d) => ({
      ...d,
      cards: d.cards.map((c) => (c.id === id ? { ...c, image: image.trim() || undefined } : c)),
    }))

  const setWord = (id: string, word: string) =>
    setDb((d) => ({ ...d, cards: d.cards.map((c) => (c.id === id ? { ...c, word } : c)) }))

  const setHidden = (id: string, hidden: boolean) =>
    setDb((d) => ({ ...d, cards: d.cards.map((c) => (c.id === id ? { ...c, hidden } : c)) }))

  return (
    <section>
      <h2>캐릭터 그림</h2>
      <p className="hint">
        이모지로는 아이가 못 알아본다. 스포티파이가 주는 공식 아티스트 사진을 가져와서 쓴다.
        엉뚱한 사람이 나오면 검색어를 고치고 다시 받으면 된다. 직접 찍은 사진 주소를 넣어도 된다.
      </p>

      <button disabled={busy} onClick={() => void fetchAll(false)}>
        사진 가져오기
      </button>
      <button disabled={busy} onClick={() => void fetchAll(true)}>
        빠진 것만
      </button>
      <p className="hint">
        주제 카드는 <strong>앨범 이름에 그 낱말이 들어 있을 때만</strong> 그림을 쓴다.
        아무 앨범 표지나 가져오면 소방차와 자동차가 같은 그림이 돼서 아이가 구별을 못 한다.
        소방차·양치 같은 건 이모지가 오히려 잘 보이니 그냥 두는 게 낫다.
        <strong>조합 점검을 먼저 돌려야</strong> 동작한다 (지금 대상 {topicsWithSongs.length}개).
      </p>
      <button disabled={busy} onClick={() => void fetchTopicArt(false)}>
        주제 카드 그림도
      </button>
      <button disabled={busy} onClick={clearTopicArt}>
        주제 그림 지우기
      </button>

      {note && <p className="hint">{note}</p>}

      <ul className="art">
        {characters.map((c) => (
          <li key={c.id}>
            <span className="art-thumb" style={{ background: c.color }}>
              {c.image ? <img src={c.image} alt="" /> : <span>{c.emoji}</span>}
            </span>
            <div className="art-fields">
              <strong>
                {c.label ?? c.word}
                {c.hidden && <small> · 숨김</small>}
              </strong>
              {unmatched[c.id] ? (
                <small className="warn">
                  ⚠️ 이름이 맞는 아티스트를 못 찾았어. 지금 붙어 있는 사진은 남의 것일 수 있어 —
                  검색어를 고치거나 사진을 지워줘.
                </small>
              ) : (
                /*
                 * 이제는 이름이 맞는 아티스트만 쓰므로, 이름이 조금 달라도
                 * ('타요' -> '꼬마버스 타요') 정상이다. 주황색으로 칠하면
                 * 위의 진짜 경고와 구분이 안 된다.
                 */
                matched[c.id] && (
                  <small>스포티파이가 찾은 이름: {matched[c.id]}</small>
                )
              )}
              <input value={c.word} onChange={(e) => setWord(c.id, e.target.value)} placeholder="검색어" />
              <input
                value={c.image ?? ''}
                onChange={(e) => setImage(c.id, e.target.value)}
                placeholder="사진 주소 (비우면 그린 그림)"
              />
              <span className="art-row">
                <label className="row">
                  <input
                    type="checkbox"
                    checked={!c.hidden}
                    onChange={(e) => setHidden(c.id, !e.target.checked)}
                  />
                  지한이에게 보이기
                </label>
                {c.image && (
                  <button className="link" onClick={() => setImage(c.id, '')}>
                    사진 지우기
                  </button>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
