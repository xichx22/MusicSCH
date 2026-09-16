import type { ReactElement } from 'react'
import { VEHICLE_ICONS } from './vehicles'
import { CHARACTER_ICONS, HABIT_ICONS } from './others'
import { WORD_ICONS } from './more'

/*
 * 카드 아이콘.
 *
 * 이모지는 기기마다 그림이 다르고(삼성·애플·구글 전부 다름) 서로 그림체가
 * 안 맞아서 모아두면 촌스럽다. 자주 쓰는 카드는 직접 그려서 한 벌로 맞춘다.
 * 아직 안 그린 카드는 이모지를 그대로 쓰되, 같은 동그라미 안에 같은 크기로
 * 넣어서 한 세트처럼 보이게 한다.
 */
const ICONS: Record<string, ReactElement> = {
  ...CHARACTER_ICONS,
  ...VEHICLE_ICONS,
  ...HABIT_ICONS,
  // 굴착기와 포크레인은 같은 기계다. 그림도 같이 쓴다.
  't-porclain': VEHICLE_ICONS['t-excavator'],
}

/* 두 글자 이상인 말만 '들어 있으면 같은 그림' 으로 친다. 한 글자는 너무 헐겁다. */
const LONG_WORDS = Object.keys(WORD_ICONS)
  .filter((w) => w.length >= 2)
  .sort((a, b) => b.length - a.length)

/**
 * 카드에 맞는 그림.
 *
 * id 로 먼저 찾고, 없으면 카드에 적힌 말로 찾는다. 알아서 만든 카드는
 * id 가 't-made-…' 라 id 로는 절대 못 찾기 때문이다. 그래도 없으면
 * 말 안에 든 낱말로 찾는다 ('경주용차' 안의 '경주').
 */
function iconFor(cardId: string, word?: string): ReactElement | undefined {
  if (cardId in ICONS) return ICONS[cardId]
  if (!word) return undefined
  if (word in WORD_ICONS) return WORD_ICONS[word]
  const hit = LONG_WORDS.find((w) => word.includes(w))
  return hit ? WORD_ICONS[hit] : undefined
}

export function hasIcon(cardId: string, word?: string): boolean {
  return iconFor(cardId, word) !== undefined
}

/** 그려둔 아이콘이 있으면 그걸, 없으면 이모지를 돌려준다. */
export function CardIcon({ cardId, word, emoji }: { cardId: string; word?: string; emoji: string }) {
  const drawn = iconFor(cardId, word)
  if (!drawn) return <span className="pic-emoji">{emoji}</span>
  return (
    <svg className="pic-icon" viewBox="0 0 64 64" aria-hidden="true">
      {drawn}
    </svg>
  )
}
