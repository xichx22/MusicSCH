import type { Card, ComboCheck, Settings, Song, UsageToday } from '../types'
import { DEFAULT_SETTINGS, SEED_CARDS } from './seed'

const KEY = 'musicsch.v1'

interface DB {
  cards: Card[]
  songs: Song[]
  settings: Settings
  usage: UsageToday
  /** 조합 점검 결과. 열쇠는 `캐릭터id:주제id` */
  checks: Record<string, ComboCheck>
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
    checks: {},
  }
}

export function load(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const db = { ...empty(), ...(JSON.parse(raw) as Partial<DB>) } as DB
    // 설정에 새 항목이 생겨도 기존 저장본이 깨지지 않게 채워준다.
    db.settings = { ...DEFAULT_SETTINGS, ...db.settings }
    db.checks = db.checks ?? {}
    // 카드 묶음을 늘렸으면 저장본에 없는 새 카드를 넣어준다.
    // 아빠가 고쳐둔 카드는 그대로 두고, 새로 생긴 것만 더한다.
    const known = new Set(db.cards.map((c) => c.id))
    const added = SEED_CARDS.filter((c) => !known.has(c.id))
    if (added.length > 0) db.cards = [...db.cards, ...added]
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

export function comboKey(characterId: string, topicId: string): string {
  return `${characterId}:${topicId}`
}

/**
 * 이 캐릭터에서 보여줄 주제 카드.
 *
 * 아직 점검하지 않은 조합은 일단 보여준다. 점검해서 노래가 0개였던
 * 조합만 감춘다. 눌렀는데 아무것도 안 나오는 경험을 줄이면서도,
 * 내가 미리 지레짐작해서 빼버리지는 않으려는 것이다.
 */
export function topicsFor(db: DB, characterId: string): Card[] {
  return db.cards.filter((c) => {
    if (c.kind !== 'topic' || c.hidden) return false
    if (c.forCharacters && !c.forCharacters.includes(characterId)) return false
    const check = db.checks[comboKey(characterId, c.id)]
    return !check || check.count > 0
  })
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}
