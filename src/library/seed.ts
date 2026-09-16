import type { Card, Settings } from '../types'

/**
 * 기본 카드.
 * 30개월한테는 한 화면에 6개까지가 딱 좋다. 스크롤은 안 만든다.
 * 사진을 쓰고 싶으면 아빠 화면에서 image 를 넣으면 이모지 대신 사진이 나온다.
 */
export const SEED_CARDS: Card[] = [
  { id: 'c-pororo', kind: 'character', word: '뽀로로', emoji: '🐧', color: '#4aa3ff' },
  { id: 'c-tayo', kind: 'character', word: '타요', emoji: '🚌', color: '#3fc4a0' },
  { id: 'c-poli', kind: 'character', word: '로보카폴리', emoji: '🚓', color: '#ff7a5c' },
  { id: 'c-pinkfong', kind: 'character', word: '핑크퐁', emoji: '🦈', color: '#ff6fae' },
  { id: 'c-cocomong', kind: 'character', word: '코코몽', emoji: '🐵', color: '#ffb02e' },
  { id: 'c-babyshark', kind: 'character', word: '아기상어', emoji: '🐟', color: '#7c6cff' },

  { id: 't-firetruck', kind: 'topic', word: '소방차', emoji: '🚒', color: '#ff5a4d' },
  { id: 't-car', kind: 'topic', word: '자동차', emoji: '🚗', color: '#4aa3ff' },
  { id: 't-brush', kind: 'topic', word: '양치', emoji: '🪥', color: '#3fc4a0' },
  { id: 't-bath', kind: 'topic', word: '목욕', emoji: '🛁', color: '#57c7ff' },
  { id: 't-sleep', kind: 'topic', word: '자장가', emoji: '🌙', color: '#7c6cff' },
  { id: 't-birthday', kind: 'topic', word: '생일', emoji: '🎂', color: '#ffb02e' },
]

export const DEFAULT_SETTINGS: Settings = {
  dailyLimitMin: 30,
  maxVolume: 0.7,
  parentPin: '1234',
  searchSourceId: 'spotify',
  searchEnabled: true,
}
