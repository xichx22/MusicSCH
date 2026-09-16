/**
 * 스포티파이 로그인 (PKCE).
 *
 * 브라우저에서만 도는 앱이라 client secret 을 쓸 수 없다. 그래서 PKCE 를 쓴다.
 * client secret 은 이 저장소 어디에도 넣지 않는다.
 */

const LS_CLIENT_ID = 'musicsch.spotify.clientId'
const LS_VERIFIER = 'musicsch.spotify.verifier'
const LS_TOKEN = 'musicsch.spotify.token'

/**
 * streaming            : Web Playback SDK 로 이 브라우저를 스피커로 쓰기
 * user-read-email/private : SDK 가 계정이 Premium 인지 확인할 때 필요
 * user-modify/read-playback-state : 재생 명령 보내기, 기기 목록 읽기
 */
export const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-modify-playback-state',
  'user-read-playback-state',
].join(' ')

interface StoredToken {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 저장이 안 돼도 앱은 돌아가야 한다 */
  }
}

export function getClientId(): string {
  try {
    return localStorage.getItem(LS_CLIENT_ID) ?? import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? ''
  } catch {
    return import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? ''
  }
}

export function setClientId(id: string): void {
  try {
    localStorage.setItem(LS_CLIENT_ID, id.trim())
  } catch {
    /* 무시 */
  }
}

/**
 * 스포티파이 대시보드에 등록해야 하는 주소.
 * 스포티파이는 https 만 받는다. 예외는 http://127.0.0.1:포트 뿐이고 localhost 는 안 된다.
 */
export function redirectUri(): string {
  // 하위 경로에 배포되면 그 경로까지 포함해야 한다. BASE_URL 은 항상 / 로 끝난다.
  return window.location.origin + import.meta.env.BASE_URL
}

function randomString(len: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const bytes = crypto.getRandomValues(new Uint8Array(len))
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function challenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return base64url(digest)
}

/** 스포티파이 로그인 화면으로 보낸다. 돌아오면 completeLoginFromUrl() 이 받는다. */
export async function beginLogin(): Promise<void> {
  const clientId = getClientId()
  if (!clientId) throw new Error('먼저 Client ID 를 넣어줘')

  const verifier = randomString(64)
  localStorage.setItem(LS_VERIFIER, verifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: await challenge(verifier),
    redirect_uri: redirectUri(),
  })
  window.location.assign(`https://accounts.spotify.com/authorize?${params}`)
}

async function requestToken(body: Record<string, string>): Promise<StoredToken | null> {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  })
  if (!res.ok) return null
  const json = (await res.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
  }
  const prev = read<StoredToken>(LS_TOKEN)
  const token: StoredToken = {
    accessToken: json.access_token,
    // 갱신할 때는 새 refresh_token 을 안 주는 경우가 있어서 예전 걸 그대로 쓴다.
    refreshToken: json.refresh_token ?? prev?.refreshToken ?? '',
    expiresAt: Date.now() + json.expires_in * 1000,
  }
  write(LS_TOKEN, token)
  return token
}

/**
 * 로그인하고 돌아왔을 때 주소에 붙은 code 를 토큰으로 바꾼다.
 * 앱 시작할 때 한 번 부르면 된다.
 */
export async function completeLoginFromUrl(): Promise<void> {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  if (!code) return

  const verifier = localStorage.getItem(LS_VERIFIER)
  localStorage.removeItem(LS_VERIFIER)

  // 주소창에서 code 를 지운다. 새로고침해도 같은 code 를 또 쓰지 않도록.
  url.searchParams.delete('code')
  url.searchParams.delete('state')
  window.history.replaceState({}, '', url.toString())

  if (!verifier) return
  await requestToken({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri(),
    client_id: getClientId(),
    code_verifier: verifier,
  })
}

export function isLoggedIn(): boolean {
  return Boolean(read<StoredToken>(LS_TOKEN)?.refreshToken)
}

export function logout(): void {
  try {
    localStorage.removeItem(LS_TOKEN)
  } catch {
    /* 무시 */
  }
}

/** 쓸 수 있는 access token 을 준다. 만료가 가까우면 알아서 갱신한다. */
export async function getAccessToken(): Promise<string | null> {
  const token = read<StoredToken>(LS_TOKEN)
  if (!token) return null
  // 30초 여유를 두고 미리 갱신한다.
  if (token.expiresAt - 30_000 > Date.now()) return token.accessToken
  if (!token.refreshToken) return null

  const fresh = await requestToken({
    grant_type: 'refresh_token',
    refresh_token: token.refreshToken,
    client_id: getClientId(),
  })
  return fresh?.accessToken ?? null
}

export class SpotifyAuthError extends Error {}

/**
 * 스포티파이 Web API 호출. 204(내용 없음)는 null 을 준다.
 *
 * 실패하면 스포티파이가 보내준 진짜 이유를 그대로 메시지에 담는다.
 * 뭉뚱그린 오류 문구는 원인을 못 찾게 만든다.
 */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  const token = await getAccessToken()
  if (!token) throw new SpotifyAuthError('스포티파이에 로그인이 안 돼 있어')

  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (res.ok) {
    if (res.status === 204) return null
    return (await res.json()) as T
  }

  // 스포티파이는 { error: { status, message, reason } } 로 이유를 알려준다.
  let reason = ''
  try {
    const body = (await res.json()) as { error?: { message?: string; reason?: string } }
    reason = [body.error?.message, body.error?.reason].filter(Boolean).join(' / ')
  } catch {
    /* 본문이 없거나 JSON 이 아니면 상태 코드만으로 간다 */
  }

  const endpoint = path.split('?')[0]
  const where = `${endpoint} → ${res.status}`
  const detail = reason ? `${where} · ${reason}` : where

  if (res.status === 401) throw new SpotifyAuthError(`로그인이 만료됐어. 다시 로그인해줘 (${detail})`)
  if (res.status === 403) throw new Error(`스포티파이가 거절했어 (${detail})`)
  if (res.status === 404) throw new Error(`대상을 못 찾았어 (${detail})`)
  if (res.status === 429) throw new Error(`스포티파이가 잠깐 쉬래 (${detail})`)
  throw new Error(`스포티파이 오류 (${detail})`)
}
