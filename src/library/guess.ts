import { mentions } from './match'
import { toKorean } from './english'
import type { Card } from '../types'

/**
 * 곡 제목에 맞는 주제 카드 찾기.
 *
 * 앨범을 가져오면 곡 제목이 영어인 경우가 많다('Fire Truck Song').
 * 그래서 제목을 먼저 한글로 바꿔놓고 한글 카드와 맞춰본다. 별명
 * (alsoMatch)도 바꾸고 남은 글자에서 찾는다 — 'Car Wash Song' 은 이미
 * '세차' 가 됐으니 'car' 별명이 끼어들어 자동차가 되면 안 된다.
 */
export function guessTopic(trackName: string, character: Card, topics: Card[]): Card | null {
  const ko = toKorean(trackName)
  const lower = ko.toLowerCase()
  const hits: { card: Card; len: number }[] = []

  for (const t of topics) {
    if (t.forCharacters && !t.forCharacters.includes(character.id)) continue

    let len = 0
    if (mentions(ko, t.word)) len = t.word.length
    for (const alt of t.alsoMatch ?? []) {
      if (lower.includes(alt.toLowerCase())) len = Math.max(len, alt.length)
    }
    if (len > 0) hits.push({ card: t, len })
  }
  if (hits.length === 0) return null

  /*
   * 길게 맞은 쪽이 이긴다. '자동차 가족' 은 '가족'(2) 보다 '자동차'(3) 다.
   * 길이가 같으면 뭉뚱그린 카드가 양보한다 — 'Police Car Song' 은
   * 경찰차지 자동차가 아니다.
   */
  return hits.sort(
    (a, b) => b.len - a.len || Number(!!a.card.generic) - Number(!!b.card.generic),
  )[0].card
}
