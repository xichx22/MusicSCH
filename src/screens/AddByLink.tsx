import { useState } from 'react'
import { comboKey, newId, type DB } from '../library/store'
import { getTrack, parseTrackId } from '../sources/spotify'
import type { Song } from '../types'

/**
 * 링크로 노래 넣기.
 *
 * 스포티파이 개발자 모드는 검색 할당량이 넉넉하지 않고, 떨어지면 며칠씩
 * 안 풀릴 수도 있다. 그동안 새 노래를 아예 못 넣으면 앱이 멈춘 것이나
 * 다름없다. 검색을 거치지 않고 아빠가 직접 곡을 붙일 길을 둔다.
 *
 * 스포티파이 앱에서 곡 > 공유 > 링크 복사 해서 붙여넣으면 된다.
 */
export function AddByLink({ db, setDb }: { db: DB; setDb: (u: (d: DB) => DB) => void }) {
  const characters = db.cards.filter((c) => c.kind === 'character' && !c.hidden)
  const topics = db.cards.filter((c) => c.kind === 'topic' && !c.hidden)

  const [characterId, setCharacterId] = useState(characters[0]?.id ?? '')
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '')
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const character = characters.find((c) => c.id === characterId)
  const topic = topics.find((c) => c.id === topicId)

  const add = async () => {
    const id = parseTrackId(link)
    if (!id) {
      setNote('링크를 못 알아보겠어. 스포티파이에서 곡 > 공유 > 링크 복사 한 걸 그대로 붙여넣어줘.')
      return
    }
    if (!character || !topic) return

    setBusy(true)
    // 제목과 앨범 그림은 있으면 좋고 없어도 된다. 할당량이 떨어져 있을 수 있다.
    const info = await getTrack(id)
    const ref = `spotify:track:${id}`
    const key = comboKey(character.id, topic.id)

    const song: Song = {
      id: newId(),
      title: info?.title ?? title.trim() ?? '',
      sourceId: 'spotify',
      ref,
      tags: [character.word, topic.word],
      combo: key,
      durationSec: info?.durationSec,
      emoji: topic.emoji,
      image: info?.image,
      playCount: 0,
      approved: true,
      addedAt: Date.now(),
    }
    if (!song.title) song.title = `${character.label ?? character.word} ${topic.label ?? topic.word}`

    setDb((d) => {
      if (d.songs.some((s) => s.sourceId === 'spotify' && s.ref === ref && s.combo === key)) return d
      return {
        ...d,
        songs: [...d.songs, song],
        // 이 조합에 노래가 생겼으니 지한이 화면에 카드를 다시 보여준다.
        checks: { ...d.checks, [key]: { at: Date.now(), count: 1 } },
      }
    })

    setBusy(false)
    setLink('')
    setTitle('')
    setNote(
      `넣었어: ${song.title}` +
        (info ? '' : ' (제목을 못 가져와서 카드 이름으로 넣었어. 아래 목록에서 고칠 수 있어)'),
    )
  }

  return (
    <section>
      <h2>링크로 노래 넣기</h2>
      <p className="hint">
        검색 할당량이 떨어져도 이걸로는 넣을 수 있다. 스포티파이 앱에서
        <strong> 곡 → 공유 → 링크 복사</strong> 한 다음 붙여넣어줘.
      </p>

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
        무슨 노래
        <select value={topicId} onChange={(e) => setTopicId(e.target.value)}>
          {topics.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label ?? c.word}
            </option>
          ))}
        </select>
      </label>

      <label>
        스포티파이 링크
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://open.spotify.com/track/..."
        />
      </label>

      <button disabled={busy || !link.trim() || !character || !topic} onClick={() => void add()}>
        {busy ? '넣는 중...' : '넣기'}
      </button>
      {note && <p className="hint">{note}</p>}
    </section>
  )
}
