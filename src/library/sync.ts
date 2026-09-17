import type { DB } from './store'
import type { Card, ComboCheck, Song } from '../types'

/*
 * 두 기기 맞추기.
 *
 * 라즈베리파이에 올려둔 작은 서버(server/sync-server.mjs)와 주고받는다.
 * 테일스케일 안에서만 닿으니 집 밖으로는 안 나간다.
 *
 * 카드·노래·조합점검만 오간다. 설정과 오늘 들은 시간은 기기마다 다르다
 * — 폰의 하루 제한과 스포티파이 기기 선택이 태블릿 것으로 덮이면 안 된다.
 */

const KEY = 'musicsch.sync'

export type SyncRole = 'off' | 'main' | 'listen'

export interface SyncConfig {
  /** 파이 주소. 예: https://xichx.tail433939.ts.net */
  url: string
  /**
   * 이 기기가 할 일.
   *
   * main   = 여기서 노래를 넣고 정리한다. 바뀌면 서버에 올린다.
   * listen = 듣기만 한다. 열 때마다 서버에서 받아온다.
   * off    = 안 쓴다.
   */
  role: SyncRole
  /** 서버에 TOKEN 을 걸었으면 같은 값 */
  token: string
  /** 마지막으로 주고받은 서버 번호 */
  version: number
  /** 마지막으로 주고받은 때 */
  at: number
}

export const EMPTY_SYNC: SyncConfig = { url: '', role: 'off', token: '', version: 0, at: 0 }

export function loadSync(): SyncConfig {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY_SYNC
    return { ...EMPTY_SYNC, ...(JSON.parse(raw) as Partial<SyncConfig>) }
  } catch {
    return EMPTY_SYNC
  }
}

export function saveSync(c: SyncConfig): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(c))
  } catch {
    /* 저장이 막혀 있어도 이번 실행에는 쓸 수 있다 */
  }
}

/** 주고받는 알맹이. 설정과 사용시간은 뺀다. */
export interface Shared {
  cards: Card[]
  songs: Song[]
  checks: Record<string, ComboCheck>
  seedVersion?: number
}

export function sharedOf(db: DB): Shared {
  return { cards: db.cards, songs: db.songs, checks: db.checks, seedVersion: db.seedVersion }
}

export function applyShared(db: DB, s: Shared): DB {
  return {
    ...db,
    cards: s.cards ?? db.cards,
    songs: s.songs ?? db.songs,
    checks: s.checks ?? db.checks,
    seedVersion: s.seedVersion ?? db.seedVersion,
  }
}

/** 주소 끝의 빗금과 실수로 붙은 /db 를 떼어낸다. */
export function cleanUrl(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/\/(db|health|version)$/, '')
}

async function call(c: SyncConfig, path: string, init?: RequestInit) {
  const base = cleanUrl(c.url)
  if (!base) throw new Error('파이 주소를 먼저 넣어줘')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (c.token) headers['X-Sync-Token'] = c.token

  let res: Response
  try {
    res = await fetch(`${base}${path}`, { ...init, headers })
  } catch {
    /*
     * 여기서 걸리는 건 거의 둘 중 하나다. 테일스케일이 꺼져 있거나,
     * 파이가 http 인데 앱이 https 라 브라우저가 막은 것.
     */
    throw new Error('파이에 못 닿아. 테일스케일이 켜져 있는지, 주소가 https 인지 봐줘')
  }
  if (res.status === 401) throw new Error('열쇠(TOKEN)가 안 맞아')
  if (!res.ok && res.status !== 409) {
    throw new Error(`파이가 거절했어 (${res.status})`)
  }
  return res
}

export interface PullResult {
  shared: Shared | null
  version: number
  updatedAt: number
}

/** 서버에 있는 걸 받아온다. 아직 아무도 안 올렸으면 shared 가 null 이다. */
export async function pull(c: SyncConfig): Promise<PullResult> {
  const res = await call(c, '/db')
  const body = (await res.json()) as { version: number; updatedAt: number; db: Shared | null }
  return { shared: body.db, version: body.version, updatedAt: body.updatedAt }
}

/** 받아올 게 있는지만 싸게 본다. */
export async function peek(c: SyncConfig): Promise<number> {
  const res = await call(c, '/version')
  const body = (await res.json()) as { version: number }
  return body.version
}

export interface PushResult {
  version: number
  updatedAt: number
  /** 그 사이에 다른 기기가 올려서 못 올렸다 */
  conflict?: boolean
}

/** 이 기기 것을 서버에 올린다. */
export async function push(c: SyncConfig, db: DB, force = false): Promise<PushResult> {
  const res = await call(c, '/db', {
    method: 'PUT',
    body: JSON.stringify({ version: c.version, force, db: sharedOf(db) }),
  })
  const body = (await res.json()) as { version: number; updatedAt: number }
  if (res.status === 409) return { ...body, conflict: true }
  return body
}

/** 주소가 맞는지만 확인한다. */
export async function health(c: SyncConfig): Promise<number> {
  const res = await call(c, '/health')
  const body = (await res.json()) as { version: number }
  return body.version
}
