import type { ReactElement } from 'react'
import { VEHICLE_ICONS } from './vehicles'
import { CHARACTER_ICONS, HABIT_ICONS } from './others'

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

export function hasIcon(cardId: string): boolean {
  return cardId in ICONS
}

/** 그려둔 아이콘이 있으면 그걸, 없으면 이모지를 돌려준다. */
export function CardIcon({ cardId, emoji }: { cardId: string; emoji: string }) {
  const drawn = ICONS[cardId]
  if (!drawn) return <span className="pic-emoji">{emoji}</span>
  return (
    <svg className="pic-icon" viewBox="0 0 64 64" aria-hidden="true">
      {drawn}
    </svg>
  )
}
