import { useState } from 'react'
import type { DB } from '../library/store'
import { newId } from '../library/store'
import type { Song } from '../types'
import { SOURCES, getSource } from '../sources'
import { loadManifest, localRef } from '../sources/local'
import { SpotifyPanel } from '../sources/spotify/Panel'
import { clear as clearDiag, entries as diagEntries } from '../library/diag'

interface Props {
  db: DB
  setDb: (updater: (db: DB) => DB) => void
  onClose: () => void
}

/** 아빠 화면. 지한이는 여기 못 들어온다. */
export function Admin({ db, setDb, onClose }: Props) {
  const [note, setNote] = useState('')
  const usedMin = Math.round(db.usage.secondsPlayed / 60)

  /** public/songs/manifest.json 을 다시 읽어서 새 곡을 A목록에 넣는다. */
  const importLocal = async () => {
    const entries = await loadManifest(true)
    let added = 0
    setDb((d) => {
      const known = new Set(d.songs.filter((s) => s.sourceId === 'local').map((s) => s.ref))
      const fresh: Song[] = entries
        .filter((e) => !known.has(localRef(e.file)))
        .map((e) => ({
          id: newId(),
          title: e.title,
          sourceId: 'local',
          ref: localRef(e.file),
          tags: e.tags,
          durationSec: e.durationSec,
          emoji: e.emoji,
          playCount: 0,
          approved: true,
          addedAt: Date.now(),
        }))
      added = fresh.length
      return { ...d, songs: [...d.songs, ...fresh] }
    })
    setNote(added ? `${added}곡 새로 넣었어` : '새로 들어온 곡은 없어')
  }

  const patchSong = (id: string, patch: Partial<Song>) =>
    setDb((d) => ({ ...d, songs: d.songs.map((s) => (s.id === id ? { ...s, ...patch } : s)) }))

  const removeSong = (id: string) =>
    setDb((d) => ({ ...d, songs: d.songs.filter((s) => s.id !== id) }))

  const pending = db.songs.filter((s) => !s.approved)
  const approved = db.songs.filter((s) => s.approved)

  return (
    <div className="admin">
      <header>
        <h1>아빠 화면</h1>
        <button onClick={onClose}>닫기</button>
      </header>

      <section>
        <h2>오늘 들은 시간</h2>
        <p>
          {usedMin}분 {db.settings.dailyLimitMin > 0 && `/ ${db.settings.dailyLimitMin}분`}
          <button
            className="link"
            onClick={() => setDb((d) => ({ ...d, usage: { ...d.usage, secondsPlayed: 0 } }))}
          >
            초기화
          </button>
        </p>
      </section>

      <section>
        <h2>설정</h2>
        <label>
          하루 제한 (분, 0이면 무제한)
          <input
            type="number"
            min={0}
            value={db.settings.dailyLimitMin}
            onChange={(e) =>
              setDb((d) => ({ ...d, settings: { ...d.settings, dailyLimitMin: Number(e.target.value) } }))
            }
          />
        </label>
        <label>
          최대 볼륨 ({Math.round(db.settings.maxVolume * 100)}%)
          <input
            type="range"
            min={0}
            max={100}
            value={db.settings.maxVolume * 100}
            onChange={(e) =>
              setDb((d) => ({ ...d, settings: { ...d.settings, maxVolume: Number(e.target.value) / 100 } }))
            }
          />
        </label>
        <label>
          검색에 쓸 음원 소스
          <select
            value={db.settings.searchSourceId}
            onChange={(e) =>
              setDb((d) => ({ ...d, settings: { ...d.settings, searchSourceId: e.target.value } }))
            }
          >
            {SOURCES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <p className="hint">{getSource(db.settings.searchSourceId).readyHint()}</p>
        <label className="row">
          <input
            type="checkbox"
            checked={db.settings.searchEnabled}
            onChange={(e) =>
              setDb((d) => ({ ...d, settings: { ...d.settings, searchEnabled: e.target.checked } }))
            }
          />
          검색 켜기 (끄면 아빠가 넣은 노래만 나옴)
        </label>
      </section>

      {db.settings.searchSourceId === 'spotify' && <SpotifyPanel />}

      <Diagnostics />

      <section>
        <h2>음원 불러오기</h2>
        <button onClick={importLocal}>public/songs 다시 읽기</button>
        {note && <p className="hint">{note}</p>}
      </section>

      {pending.length > 0 && (
        <section>
          <h2>확인 기다리는 노래 ({pending.length})</h2>
          <p className="hint">검색으로 찾은 노래야. 확인하면 다음부터 카드만 눌러도 바로 나와.</p>
          <SongList songs={pending} onPatch={patchSong} onRemove={removeSong} />
        </section>
      )}

      <section>
        <h2>지한이 노래 ({approved.length})</h2>
        <SongList songs={approved} onPatch={patchSong} onRemove={removeSong} />
      </section>
    </div>
  )
}

function SongList({
  songs,
  onPatch,
  onRemove,
}: {
  songs: Song[]
  onPatch: (id: string, patch: Partial<Song>) => void
  onRemove: (id: string) => void
}) {
  if (songs.length === 0) return <p className="hint">아직 없어.</p>
  return (
    <ul className="songs">
      {songs.map((s) => (
        <li key={s.id}>
          <div className="song-main">
            <strong>{s.title}</strong>
            <small>
              {s.sourceId} · {s.playCount}번 들음
            </small>
          </div>
          <input
            className="tags"
            value={s.tags.join(' ')}
            onChange={(e) => onPatch(s.id, { tags: e.target.value.split(/\s+/).filter(Boolean) })}
            placeholder="뽀로로 소방차"
          />
          <label className="row">
            <input
              type="checkbox"
              checked={s.approved}
              onChange={(e) => onPatch(s.id, { approved: e.target.checked })}
            />
            확인
          </label>
          <button className="link danger" onClick={() => onRemove(s.id)}>
            삭제
          </button>
        </li>
      ))}
    </ul>
  )
}

/**
 * 무슨 일이 있었는지 보여주는 칸.
 * "그 노래는 아직 없어요" 가 진짜 0건이어서였는지, 오류로 실패한 건지 여기서 갈린다.
 */
function Diagnostics() {
  const [rows, setRows] = useState(diagEntries)

  return (
    <section>
      <h2>
        무슨 일이 있었나
        <button className="link" onClick={() => setRows(diagEntries())}>
          새로고침
        </button>
        {rows.length > 0 && (
          <button
            className="link"
            onClick={() => {
              clearDiag()
              setRows([])
            }}
          >
            지우기
          </button>
        )}
      </h2>
      {rows.length === 0 ? (
        <p className="hint">아직 기록이 없어. 카드를 눌러보고 다시 와줘.</p>
      ) : (
        <ul className="diag">
          {rows.map((r) => (
            <li key={r.at} className={r.ok ? 'ok' : 'bad'}>
              <span className="diag-time">
                {new Date(r.at).toLocaleTimeString('ko-KR', { hour12: false })}
              </span>
              <span className="diag-what">
                {r.ok ? '✅' : '⚠️'} {r.what}
              </span>
              <span className="diag-detail">{r.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
