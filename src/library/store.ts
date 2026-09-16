import type { Card, Settings, Song, UsageToday } from '../types'
import { DEFAULT_SETTINGS, SEED_CARDS } from './seed'

const KEY = 'musicsch.v1'

interface DB {
  cards: Card[]
  songs: Song[]
  settings: Settings
  usage: UsageToday
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function empty(): DB {
  return {
    cards: SEED_CARDS,
    songs: [],
    settings: DEFAULT_SETTINGS,
    usage: { date: today(), secondsPlayed: 0 },
  }
}

export function load(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const db = { ...empty(), ...(JSON.parse(raw) as Partial<DB>) } as DB
    // 설정에 새 항목이 생겨도 기존 저장본이 깨지지 않게 채워준다.
    db.settings = { ...DEFAULT_SETTINGS, ...db.settings }
    if (db.usage?.date !== today()) db.usage = { date: today(), secondsPlayed: 0 }
    return db
  } catch {
    return empty()
  }
}

export function save(db: DB): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    // 저장이 안 돼도 앱은 계속 돌아가야 한다.
  }
}

export type { DB }

/**
 * A안 조회: 카드 조합에 맞는, 아빠가 승인한 곡 찾기.
 * 낱말이 많이 맞을수록 먼저, 같으면 많이 들은 순서.
 */
export function findApproved(songs: Song[], words: string[]): Song[] {
  return songs
    .filter((s) => s.approved)
    .map((s) => {
      const hay = [s.title, ...s.tags].join(' ')
      return { s, hits: words.filter((w) => hay.includes(w)).length }
    })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.s.playCount - a.s.playCount)
    .map((x) => x.s)
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}
