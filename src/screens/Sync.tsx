import { useEffect, useRef, useState } from 'react'
import type { DB } from '../library/store'
import {
  applyShared,
  cleanUrl,
  health,
  loadSync,
  pull,
  push,
  saveSync,
  sharedOf,
  type SyncConfig,
  type SyncRole,
} from '../library/sync'

function when(at: number): string {
  if (!at) return '아직 없음'
  return new Date(at).toLocaleString('ko-KR')
}

/**
 * 두 기기 맞추기.
 *
 * 태블릿에서 노래를 넣고 정리하면 라즈베리파이에 올라가고, 폰은 열 때마다
 * 받아온다. 파이가 꺼져 있거나 테일스케일이 안 켜져 있어도 앱은 그냥
 * 돈다 — 기기 안에 있는 목록으로 계속 논다.
 */
export function Sync({ db, setDb }: { db: DB; setDb: (u: (d: DB) => DB) => void }) {
  const [cfg, setCfg] = useState<SyncConfig>(loadSync)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => saveSync(cfg), [cfg])

  const patch = (p: Partial<SyncConfig>) => setCfg((c) => ({ ...c, ...p }))

  const run = async (what: string, fn: () => Promise<string>) => {
    setBusy(true)
    setNote(`${what} 중...`)
    try {
      setNote(await fn())
    } catch (e) {
      setNote(e instanceof Error ? e.message : String(e))
    }
    setBusy(false)
  }

  const doCheck = () =>
    run('확인', async () => {
      const v = await health(cfg)
      return `파이랑 연결됐어. 서버에 올라와 있는 건 ${v === 0 ? '아직 없어' : `${v}번째 목록이야`}.`
    })

  const doPush = (force = false) =>
    run('올리기', async () => {
      const r = await push(cfg, db, force)
      if (r.conflict) {
        return (
          `그 사이에 다른 기기가 올렸어(서버 ${r.version}번). ` +
          `이 기기 것으로 덮어쓰려면 [덮어쓰기] 를, 저쪽 것을 받으려면 [내려받기] 를 눌러.`
        )
      }
      patch({ version: r.version, at: r.updatedAt })
      return `올렸어. 노래 ${db.songs.length}곡 · 카드 ${db.cards.length}장 (${r.version}번째)`
    })

  const doPull = () =>
    run('내려받기', async () => {
      const r = await pull(cfg)
      if (!r.shared) return '서버에 아직 아무것도 없어. 태블릿에서 [올리기] 를 먼저 눌러줘.'
      setDb((d) => applyShared(d, r.shared!))
      patch({ version: r.version, at: r.updatedAt })
      return `받았어. 노래 ${r.shared.songs.length}곡 · 카드 ${r.shared.cards.length}장 (${r.version}번째)`
    })

  /* 파일로 옮기기 — 파이가 없어도 되고, 백업으로도 쓴다. */
  const doExport = () => {
    const blob = new Blob([JSON.stringify(sharedOf(db))], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `지한이노래-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setNote(`파일로 내보냈어. 노래 ${db.songs.length}곡 · 카드 ${db.cards.length}장`)
  }

  const doImport = async (file: File) => {
    try {
      const shared = JSON.parse(await file.text())
      if (!Array.isArray(shared?.songs) || !Array.isArray(shared?.cards)) {
        setNote('이 파일은 지한이 노래 목록이 아닌 것 같아.')
        return
      }
      setDb((d) => applyShared(d, shared))
      setNote(`파일에서 가져왔어. 노래 ${shared.songs.length}곡 · 카드 ${shared.cards.length}장`)
    } catch {
      setNote('파일을 못 읽겠어.')
    }
  }

  return (
    <section>
      <h2>두 기기 맞추기</h2>
      <p className="hint">
        라즈베리파이에 올려둔 목록을 두 기기가 같이 본다. <strong>테일스케일 안</strong>에서만
        오가니 집 밖으로는 안 나간다. 파이가 꺼져 있어도 앱은 그냥 돈다 — 기기 안에 있는
        목록으로 계속 논다.
        <br />
        카드와 노래만 오간다. <strong>하루 제한·볼륨·스포티파이 기기</strong>는 기기마다 따로다.
      </p>

      <label>
        파이 주소
        <input
          type="text"
          value={cfg.url}
          onChange={(e) => patch({ url: e.target.value })}
          onBlur={(e) => patch({ url: cleanUrl(e.target.value) })}
          placeholder="https://xichx.tail433939.ts.net"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>

      <label>
        이 기기가 할 일
        <select value={cfg.role} onChange={(e) => patch({ role: e.target.value as SyncRole })}>
          <option value="off">안 씀</option>
          <option value="main">여기서 노래를 넣는다 (바뀌면 자동으로 올림)</option>
          <option value="listen">듣기만 한다 (열 때마다 자동으로 받음)</option>
        </select>
      </label>

      <label>
        열쇠 (서버에 TOKEN 을 걸었을 때만)
        <input
          type="text"
          value={cfg.token}
          onChange={(e) => patch({ token: e.target.value })}
          placeholder="안 걸었으면 비워둬"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>

      <button disabled={busy} onClick={() => void doCheck()}>
        연결 확인
      </button>
      <button disabled={busy} onClick={() => void doPush()}>
        지금 올리기
      </button>
      <button disabled={busy} onClick={() => void doPull()}>
        지금 내려받기
      </button>
      <button className="link" disabled={busy} onClick={() => void doPush(true)}>
        덮어쓰기
      </button>

      <p className="hint">
        마지막으로 맞춘 때: {when(cfg.at)}
        {cfg.version > 0 && ` (${cfg.version}번째)`}
      </p>
      {note && <p className="hint">{note}</p>}

      <div className="recommend-group">
        <strong>파이 없이 파일로 옮기기</strong>
        <p className="hint">
          한 번만 옮기면 될 때, 그리고 백업용. 내보낸 파일을 다른 기기에서 가져오면 똑같아진다.
        </p>
        <button onClick={doExport}>파일로 내보내기</button>
        <button onClick={() => fileRef.current?.click()}>파일에서 가져오기</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void doImport(f)
            e.target.value = ''
          }}
        />
      </div>
    </section>
  )
}
