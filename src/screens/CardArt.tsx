import { useState } from 'react'
import { comboKey, type DB } from '../library/store'
import { getSource } from '../sources'
import { findArtistArt } from '../sources/spotify'
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
    const images: Record<string, string> = {}
    const names: Record<string, string> = {}
    let found = 0

    for (const card of targets) {
      setNote(`${card.label ?? card.word} 찾는 중...`)
      try {
        const art = await findArtistArt(card.word)
        if (art) {
          names[card.id] = art.name
          if (art.image) {
            images[card.id] = art.image
            found += 1
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
    setDb((d) => ({
      ...d,
      cards: d.cards.map((c) => (images[c.id] ? { ...c, image: images[c.id] } : c)),
    }))
    setBusy(false)
    setNote(`${targets.length}명 중 ${found}명 사진을 찾았어. 아래에서 맞는지 확인해줘.`)
  }

  /**
   * 주제 카드(포코, 크롱, 소방차 ...) 그림.
   * 이건 아티스트가 아니라서 아티스트 사진이 없다. 대신 그 조합으로 찾은
   * 노래의 앨범 그림을 쓴다. 보통 그 캐릭터가 그려져 있다.
   * 조합 점검을 먼저 돌려야 어느 조합에 노래가 있는지 알 수 있다.
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
    const images: Record<string, string> = {}
    let found = 0

    for (const topic of targets) {
      const character = characters.find((c) => (db.checks[comboKey(c.id, topic.id)]?.count ?? 0) > 0)
      if (!character) continue
      setNote(`${topic.label ?? topic.word} 찾는 중... (${found}개 찾음)`)
      try {
        const results = await source.search(`${character.word} ${topic.word}`)
        const image = results.find((r) => r.thumbnail)?.thumbnail
        if (image) {
          images[topic.id] = image
          found += 1
        }
      } catch (e) {
        setNote(`${topic.label ?? topic.word} 에서 막혔어: ${e instanceof Error ? e.message : String(e)}`)
        break
      }
      await wait(300)
    }

    setQuiet(false)
    setDb((d) => ({
      ...d,
      cards: d.cards.map((c) => (images[c.id] ? { ...c, image: images[c.id] } : c)),
    }))
    setBusy(false)
    setNote(`주제 카드 ${targets.length}개 중 ${found}개에 그림을 넣었어.`)
  }

  const setImage = (id: string, image: string) =>
    setDb((d) => ({
      ...d,
      cards: d.cards.map((c) => (c.id === id ? { ...c, image: image.trim() || undefined } : c)),
    }))

  const setWord = (id: string, word: string) =>
    setDb((d) => ({ ...d, cards: d.cards.map((c) => (c.id === id ? { ...c, word } : c)) }))

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
        포코·크롱 같은 2차 카드는 아티스트가 아니라서 아티스트 사진이 없다. 대신 그 조합으로
        찾은 노래의 앨범 그림을 쓴다. <strong>조합 점검을 먼저 돌려야</strong> 동작한다
        (지금 그림 넣을 수 있는 주제 {topicsWithSongs.length}개).
      </p>
      <button disabled={busy} onClick={() => void fetchTopicArt(false)}>
        주제 카드 그림도
      </button>
      <button disabled={busy} onClick={() => void fetchTopicArt(true)}>
        빠진 것만
      </button>

      {note && <p className="hint">{note}</p>}

      <ul className="art">
        {characters.map((c) => (
          <li key={c.id}>
            <span className="art-thumb" style={{ background: c.color }}>
              {c.image ? <img src={c.image} alt="" /> : <span>{c.emoji}</span>}
            </span>
            <div className="art-fields">
              <strong>{c.label ?? c.word}</strong>
              {matched[c.id] && (
                <small className={matched[c.id] === c.word ? '' : 'warn'}>
                  스포티파이가 찾은 이름: {matched[c.id]}
                </small>
              )}
              <input value={c.word} onChange={(e) => setWord(c.id, e.target.value)} placeholder="검색어" />
              <input
                value={c.image ?? ''}
                onChange={(e) => setImage(c.id, e.target.value)}
                placeholder="사진 주소 (비우면 이모지)"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
