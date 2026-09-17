import { comboKey, type DB } from './store'
import { autoAssignTopics } from './autotopic'
import { guessTopic } from './guess'
import type { Card, Song } from '../types'

/** 알아서 만든 카드인지. 아빠가 만든 씨앗 카드는 손대지 않는다. */
function isMade(card: Card): boolean {
  return card.id.startsWith('t-made-')
}

export interface RepairResult {
  db: DB
  /** 다시 정한 곡 */
  moved: number
  /** 없앤 카드 */
  removed: number
  /** 씨앗 카드로 돌아간 곡 */
  toSeed: number
}

/**
 * 이미 만들어진 카드를 새 규칙으로 다시 정리한다.
 *
 * 번역과 정리 규칙은 계속 좋아지는데, 이미 만든 카드는 옛날 규칙으로
 * 남아 있다. 그래서 'Rescue' 같은 영어 카드와 '그 밖의 노래' 가 여러 장
 * 쌓였다. 알아서 만든 카드를 전부 풀어서 처음부터 다시 정한다.
 *
 * 씨앗 카드(소방차·버스처럼 원래 있던 것)와 거기 붙은 곡은 건드리지
 * 않는다. 아빠가 카드에 넣어둔 그림은 이름이 같은 새 카드로 옮겨준다.
 */
export function repairCards(d: DB): RepairResult {
  const made = d.cards.filter((c) => c.kind === 'topic' && isMade(c))
  if (made.length === 0) return { db: d, moved: 0, removed: 0, toSeed: 0 }

  const characters = d.cards.filter((c) => c.kind === 'character')
  const seedTopics = d.cards.filter((c) => c.kind === 'topic' && !isMade(c))

  // 알아서 만든 카드에 붙어 있던 곡은 어느 캐릭터 것이었는지만 남기고 푼다.
  const madeKeys = new Map<string, string>() // 조합열쇠 → 캐릭터id
  for (const character of characters) {
    for (const t of made) madeKeys.set(comboKey(character.id, t.id), character.id)
  }

  let moved = 0
  let toSeed = 0
  const checks = { ...d.checks }
  for (const k of madeKeys.keys()) delete checks[k]

  const songs: Song[] = d.songs.map((s) => {
    const characterId = s.combo ? madeKeys.get(s.combo) : undefined
    if (!characterId) return s
    moved += 1
    const character = characters.find((c) => c.id === characterId)!

    // 먼저 씨앗 카드에 맞는지 본다. 'Fire Truck Song' 은 소방차 카드로.
    const hit = guessTopic(s.title, character, seedTopics)
    if (hit) {
      toSeed += 1
      const key = comboKey(character.id, hit.id)
      checks[key] = { at: Date.now(), count: (checks[key]?.count ?? 0) + 1 }
      return { ...s, combo: key, needsTopic: undefined, tags: [character.word, hit.word] }
    }
    return { ...s, combo: undefined, needsTopic: character.id, tags: [character.word] }
  })

  // 아빠가 넣어둔 그림은 이름으로 기억해뒀다가 새 카드에 돌려준다.
  const art = new Map<string, string>()
  for (const c of made) if (c.image) art.set(c.word, c.image)

  const cleaned: DB = {
    ...d,
    cards: d.cards.filter((c) => !(c.kind === 'topic' && isMade(c))),
    songs,
    checks,
  }
  const redone = autoAssignTopics(cleaned)

  return {
    db: {
      ...redone.db,
      cards: redone.db.cards.map((c) =>
        c.kind === 'topic' && isMade(c) && !c.image && art.has(c.word)
          ? { ...c, image: art.get(c.word) }
          : c,
      ),
    },
    moved,
    removed: made.length,
    toSeed,
  }
}
