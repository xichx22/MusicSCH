/*
 * 카드 조합의 낱말이 노래에 들어 있는지 보는 규칙.
 *
 * 한 군데에 모아둔다. 전에는 저장된 곡 고르기, 내 mp3 검색, 스포티파이
 * 검색이 각자 판단했고 서로 달랐다. 그래서 '뽀로로 소방차' 노래가
 * '뽀로로 자동차' 카드에도 딸려 나왔다.
 */

/**
 * 낱말 하나가 들어 있는가.
 *
 * 한 글자짜리는 아무 데나 들어맞는다. '배' 가 '배드카' 에 걸리는 식이다.
 * 그래서 한 글자는 앞뒤가 한글이 아닐 때만 인정한다.
 */
export function mentions(hay: string, word: string): boolean {
  if (word.length >= 2) return hay.includes(word)
  const safe = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^가-힣])${safe}([^가-힣]|$)`).test(hay)
}

/**
 * 낱말이 **전부** 들어 있는가.
 *
 * 하나라도 빠지면 다른 노래다. '뽀로로 소방차' 는 '뽀로로' 만 맞는다고
 * 자동차 카드에 나오면 안 된다.
 */
export function matchesAll(hay: string, words: string[]): boolean {
  return words.every((w) => mentions(hay, w))
}
