import { useEffect, useState } from 'react'
import { beginLogin, getClientId, isLoggedIn, logout, redirectUri, setClientId } from './auth'
import {
  getLastPlay,
  getMode,
  getPreferredDeviceId,
  listDevices,
  setMode,
  setPreferredDeviceId,
  type PlaybackMode,
  type SpotifyDevice,
} from './player'

/** 아빠 화면의 스포티파이 설정 칸. */
export function SpotifyPanel() {
  const [clientId, setId] = useState(getClientId())
  const [mode, setModeState] = useState<PlaybackMode>(getMode())
  const [deviceId, setDeviceState] = useState(getPreferredDeviceId())
  const [devices, setDevices] = useState<SpotifyDevice[] | null>(null)
  const [note, setNote] = useState('')
  const loggedIn = isLoggedIn()

  useEffect(() => {
    setClientId(clientId)
  }, [clientId])

  const refreshDevices = async () => {
    setNote('기기 찾는 중...')
    try {
      const list = await listDevices()
      setDevices(list)
      setNote(list.length ? '' : '켜져 있는 스포티파이 기기가 없어. 태블릿에서 스포티파이 앱을 열고 아무 노래나 한 번 재생했다가 멈춰봐.')
    } catch (e) {
      setNote(e instanceof Error ? e.message : '기기를 못 불러왔어')
    }
  }

  return (
    <section>
      <h2>스포티파이</h2>

      <label>
        Client ID
        <input
          type="text"
          value={clientId}
          onChange={(e) => setId(e.target.value)}
          placeholder="developer.spotify.com 에서 만든 앱의 Client ID"
        />
      </label>

      <p className="hint">
        스포티파이 대시보드의 Redirect URI 에 <code>{redirectUri()}</code> 를 그대로 등록해야 해.
        스포티파이는 https 만 받고, 예외는 <code>http://127.0.0.1:포트</code> 뿐이야 (localhost 는 안 됨).
      </p>

      <p>
        상태: <strong>{loggedIn ? '로그인됨' : '로그인 안 됨'}</strong>{' '}
        {loggedIn ? (
          <button className="link" onClick={() => { logout(); location.reload() }}>로그아웃</button>
        ) : (
          <button onClick={() => void beginLogin().catch((e) => setNote(String(e.message)))}>로그인</button>
        )}
      </p>

      <label>
        재생 방식
        <select
          value={mode}
          onChange={(e) => {
            const next = e.target.value as PlaybackMode
            setMode(next)
            setModeState(next)
          }}
        >
          <option value="sdk">이 태블릿에서 바로 재생</option>
          <option value="device">다른 스포티파이 기기에서 재생 (리모컨)</option>
        </select>
      </label>

      <LastPlayNote mode={mode} />

      {mode === 'device' && (
        <>
          <button onClick={() => void refreshDevices()}>기기 목록 새로고침</button>
          {devices && devices.length > 0 && (
            <label>
              재생할 기기
              <select
                value={deviceId}
                onChange={(e) => {
                  setPreferredDeviceId(e.target.value)
                  setDeviceState(e.target.value)
                }}
              >
                <option value="">고르기</option>
                {/* id 가 없는 기기에는 재생을 보낼 수 없어서 목록에서 뺀다. */}
                {devices
                  .filter((d): d is SpotifyDevice & { id: string } => Boolean(d.id))
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.type}){d.is_active ? ' · 켜져 있음' : ''}
                    </option>
                  ))}
              </select>
            </label>
          )}
        </>
      )}

      {note && <p className="hint">{note}</p>}
    </section>
  )
}

/**
 * 마지막으로 어디서 소리가 났는지 보여준다.
 *
 * '이 태블릿에서 바로 재생' 으로 해뒀는데 폰의 스포티파이 앱이 뜨면
 * 아빠는 영문을 모른다. 브라우저 스피커가 안 돼서 넘어간 것이다.
 */
function LastPlayNote({ mode }: { mode: PlaybackMode }) {
  const last = getLastPlay()
  if (!last) return null

  const when = new Date(last.at).toLocaleTimeString('ko-KR', { hour12: false })

  if (last.fellBack) {
    return (
      <p className="hint">
        <strong>마지막 재생({when}): {last.deviceName}</strong>
        <br />
        이 브라우저로 소리를 내려다 실패해서 다른 기기로 넘어갔어. 그래서 스포티파이 앱이 뜬 거야.
        계속 이러면 재생 방식을 <strong>다른 스포티파이 기기에서 재생</strong> 으로 바꿔두는 게 낫다.
        그게 싫으면 태블릿에서 스포티파이 앱을 완전히 종료하고 다시 눌러봐 — 브라우저가 스피커를
        잡을 자리가 생긴다.
      </p>
    )
  }

  return (
    <p className="hint">
      마지막 재생({when}): <strong>{last.deviceName}</strong>
      {last.how === 'browser' && mode === 'sdk' && ' — 이 브라우저에서 잘 나오고 있어.'}
    </p>
  )
}
