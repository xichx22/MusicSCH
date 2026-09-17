import { useState } from 'react'
import { comboKey, newId, type DB } from '../library/store'
import { getLinkTracks, parseLink, type BulkTrack } from '../sources/spotify'
import { RECOMMENDED_ALBUMS, albumUrl } from '../library/albums'
import { autoAssignTopics, autoSummary } from '../library/autotopic'
import { guessTopic } from '../library/guess'
import type { Card, Song } from '../types'

interface Planned {
  track: BulkTrack
  /** 자동으로 정한 주제. 못 정하면 null */
  topic: Card | null
}

/**
 * 링크로 노래 넣기.
 *
 * 스포티파이 개발자 모드는 검색 할당량이 넉넉하지 않고, 떨어지면 며칠씩
 * 안 풀릴 수도 있다. 그동안 새 노래를 아예 못 넣으면 앱이 멈춘 것이나
 * 다름없다. 검색을 거치지 않고 아빠가 직접 곡을 붙일 길을 둔다.
 *
 * 곡 하나씩 붙여넣는 건 손이 너무 많이 간다. 그래서 앨범이나 재생목록
 * 링크도 받는다. 링크 하나면 열댓 곡이 한 번에 들어오고, 곡 제목을 보고
 * 어느 주제 카드인지까지 알아서 정한다.
 */
export function AddByLink({ db, setDb }: { db: DB; setDb: (u: (d: DB) => DB) => void }) {
  const characters = db.cards.filter((c) => c.kind === 'character' && !c.hidden)
  const topics = db.cards.filter((c) => c.kind === 'topic' && !c.hidden)

  const [characterId, setCharacterId] = useState(characters[0]?.id ?? '')
  /**
   * 주제를 못 정한 곡을 어떻게 할지.
   *
   * 'auto'  제목을 보고 카드까지 만들어 바로 넣는다 (기본)
   * ''      아무 데도 안 넣고 [목록에서 카드 만들기] 에 모아둔다
   * 그 외   고른 카드 하나에 전부 넣는다
   */
  const [fallbackId, setFallbackId] = useState('auto')
  const [link, setLink] = useState('')
  const [plan, setPlan] = useState<Planned[] | null>(null)
  const [albumId, setAlbumId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const character = characters.find((c) => c.id === characterId)

  const guess = (trackName: string, forCharacter: Card) =>
    guessTopic(trackName, forCharacter, topics)

  const look = async () => {
    const parsed = parseLink(link)
    if (!parsed || !character) {
      setNote('링크를 못 알아보겠어. 스포티파이에서 곡·앨범·재생목록의 공유 → 링크 복사 한 걸 붙여넣어줘.')
      return
    }
    setBusy(true)
    setPlan(null)
    setAlbumId(parsed.kind === 'album' ? parsed.id : null)
    try {
      const tracks = await getLinkTracks(parsed)
      if (tracks.length === 0) {
        setNote('곡을 못 가져왔어. 링크가 맞는지, 할당량이 남았는지 봐줘.')
      } else {
        setPlan(tracks.map((track) => ({ track, topic: guess(track.trackName, character) })))
        const matched = tracks.filter((t) => guess(t.trackName, character)).length
        setNote(`${tracks.length}곡을 찾았어. 그중 ${matched}곡은 주제까지 알아서 정했어.`)
      }
    } catch (e) {
      setNote(e instanceof Error ? e.message : String(e))
    }
    setBusy(false)
  }

  const commit = () => {
    if (!plan || !character) return
    const auto = fallbackId === 'auto'
    const fallback = auto ? undefined : topics.find((t) => t.id === fallbackId)
    const added: Song[] = []
    const keys = new Set<string>()

    for (const { track, topic } of plan) {
      const target = topic ?? fallback
      if (!target) {
        /*
         * 주제를 못 정했다고 버리지 않는다. 캐릭터만 적어서 남겨두고,
         * 나중에 이 곡들을 보고 주제 카드를 만든다. 실제 있는 노래에서
         * 카드를 뽑는 편이, 카드를 먼저 정해두고 노래를 끼워 맞추는
         * 것보다 낫다.
         */
        added.push({
          id: newId(),
          title: track.name,
          sourceId: 'spotify',
          ref: track.ref,
          tags: [character.word],
          needsTopic: character.id,
          durationSec: track.durationSec,
          image: track.image,
          fromAlbum: albumId ?? undefined,
          playCount: 0,
          approved: true,
          addedAt: Date.now(),
        })
        continue
      }
      const key = comboKey(character.id, target.id)
      keys.add(key)
      added.push({
        id: newId(),
        title: track.name,
        sourceId: 'spotify',
        ref: track.ref,
        tags: [character.word, target.word],
        combo: key,
        durationSec: track.durationSec,
        emoji: target.emoji,
        image: track.image,
        fromAlbum: albumId ?? undefined,
        playCount: 0,
        approved: true,
        addedAt: Date.now(),
      })
    }

    if (added.length === 0) {
      setNote('넣을 곡이 없어.')
      return
    }

    const known = new Set(db.songs.map((s) => `${s.combo ?? s.needsTopic}|${s.ref}`))
    const fresh = added.filter((s) => !known.has(`${s.combo ?? s.needsTopic}|${s.ref}`))
    const checks = { ...db.checks }
    for (const k of keys) checks[k] = { at: Date.now(), count: 1 }

    let next: DB = { ...db, songs: [...db.songs, ...fresh], checks }
    const pending = fresh.filter((s) => s.needsTopic).length
    let summary = ''
    if (auto && next.songs.some((s) => s.needsTopic)) {
      // 주제를 못 정한 곡을 제목 보고 카드까지 만들어 바로 넣는다.
      const r = autoAssignTopics(next)
      next = r.db
      summary = autoSummary(r)
    }
    setDb(() => next)

    setPlan(null)
    setLink('')
    setNote(
      `${fresh.length}곡 넣었어.` +
        (pending === 0
          ? ''
          : auto
            ? ` 주제를 못 정한 ${pending}곡은 제목을 보고 카드를 만들어 넣었어. ${summary}`
            : ` 그중 ${pending}곡은 주제를 못 정해서 아래 [목록에서 카드 만들기] 에 모아뒀어.`),
    )
  }

  return (
    <section>
      <h2>링크로 노래 넣기</h2>
      <p className="hint">
        검색 할당량이 떨어져도 이걸로는 넣을 수 있다. 스포티파이에서
        <strong> 공유 → 링크 복사</strong> 한 걸 붙여넣어줘.
        <strong> 앨범이나 재생목록 링크를 넣으면 곡 전체가 한 번에</strong> 들어오고,
        곡 제목을 보고 어느 주제 카드인지까지 알아서 정한다.
      </p>

      <Recommended
        db={db}
        onPick={(a) => {
          setCharacterId(a.characterId)
          setLink(albumUrl(a.id))
          setPlan(null)
          setNote(`"${a.title}" 링크를 넣었어. [가져오기] 를 눌러줘.`)
        }}
        onRemove={(id, title) => {
          setDb((d) => ({ ...d, songs: d.songs.filter((x) => x.fromAlbum !== id) }))
          setNote(`"${title}" 로 넣었던 노래를 지웠어.`)
        }}
      />

      <label>
        누구 노래
        <select value={characterId} onChange={(e) => setCharacterId(e.target.value)}>
          {characters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label ?? c.word}
            </option>
          ))}
        </select>
      </label>

      <label>
        스포티파이 링크 (곡 · 앨범 · 재생목록)
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://open.spotify.com/album/..."
        />
      </label>

      <button disabled={busy || !link.trim() || !character} onClick={() => void look()}>
        {busy ? '가져오는 중...' : '가져오기'}
      </button>
      {note && <p className="hint">{note}</p>}

      {plan && (
        <>
          <ul className="plan">
            {plan.map(({ track, topic }, i) => (
              <li key={track.ref + i} className={topic ? '' : 'bad'}>
                <span className="plan-title">{track.name}</span>
                <span className="plan-topic">
                  {topic ? `→ ${topic.label ?? topic.word}` : '→ 주제를 못 정했어'}
                </span>
              </li>
            ))}
          </ul>

          <label>
            주제를 못 정한 곡은 어디에 넣을까
            <select value={fallbackId} onChange={(e) => setFallbackId(e.target.value)}>
              <option value="auto">알아서 정하기 (제목 보고 카드까지 만듦)</option>
              <option value="">나중에 정하기 (목록에 모아둠)</option>
              {topics
                .filter((t) => !t.forCharacters || !character || t.forCharacters.includes(character.id))
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label ?? t.word}
                  </option>
                ))}
            </select>
          </label>

          <button onClick={commit}>이대로 넣기</button>
          <button className="link" onClick={() => { setPlan(null); setNote('') }}>
            취소
          </button>
        </>
      )}
    </section>
  )
}

/**
 * 웹에서 찾아둔 스포티파이 앨범 목록.
 *
 * 누르면 링크가 채워지고, 가져오기를 누르면 스포티파이에서 진짜 수록곡을
 * 받아온다. 곡 정보는 내 추측이 아니라 스포티파이가 주는 값이다.
 * 마음에 안 들면 앨범 단위로 되돌린다.
 */
function Recommended({
  db,
  onPick,
  onRemove,
}: {
  db: DB
  onPick: (a: (typeof RECOMMENDED_ALBUMS)[number]) => void
  onRemove: (albumId: string, title: string) => void
}) {
  const nameOf = (id: string) => {
    const c = db.cards.find((x) => x.id === id)
    return c ? (c.label ?? c.word) : id
  }
  const imported = (id: string) => db.songs.filter((s) => s.fromAlbum === id).length

  const groups = [...new Set(RECOMMENDED_ALBUMS.map((a) => a.characterId))]

  return (
    <div className="recommend">
      <p className="hint">
        웹에서 찾아둔 앨범이야. 누르면 링크가 채워지고, <strong>가져오기</strong> 를 누르면
        스포티파이에서 진짜 수록곡을 받아온다. 넣기 전에 목록을 보여주니 이상하면 그때 취소하면 돼.
        넣은 뒤에도 앨범별로 되돌릴 수 있다.
      </p>
      {groups.map((cid) => (
        <div key={cid} className="recommend-group">
          <strong>{nameOf(cid)}</strong>
          <div className="album-list">
            {RECOMMENDED_ALBUMS.filter((a) => a.characterId === cid).map((a) => {
              const n = imported(a.id)
              return (
                <div key={a.id} className="album-row">
                  <button className="album-btn" onClick={() => onPick(a)}>
                    <span className="album-name">
                      {a.title}
                      {a.note && <em>{a.note}</em>}
                    </span>
                    {n > 0 && <small>{n}곡 넣음</small>}
                  </button>
                  {n > 0 && (
                    <button className="album-undo" onClick={() => onRemove(a.id, a.title)}>
                      되돌리기
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
