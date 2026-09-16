import type { Card, Settings } from '../types'

/*
 * 카드 목록.
 *
 * 1차로 캐릭터를 고르고, 2차로 그 캐릭터에 맞는 주제를 고른다.
 * 포코는 타요에만, 크롱은 뽀로로에만 나오는 식이다.
 *
 * 여기에는 일부러 넉넉하게 깔아둔다. 실제로 음원이 있는지는 아빠 화면의
 * '조합 점검' 이 스포티파이에 전부 물어봐서 없는 조합을 자동으로 숨긴다.
 * 내가 추측해서 빼는 것보다 실제로 물어보는 쪽이 정확하다.
 */

/** 자동차·중장비 노래가 있는 캐릭터들 */
const VEHICLE = ['c-pororo', 'c-tayo', 'c-tomtomi', 'c-cheetahboo', 'c-pinkfong']
/** 생활 습관 노래가 있는 캐릭터들 */
const HABIT = ['c-pororo', 'c-bebefinn', 'c-pinkfong', 'c-tomtomi', 'c-cheetahboo']
/** 배우는 노래(숫자·색깔·동물 등) */
const LEARN = ['c-pinkfong', 'c-bebefinn', 'c-tomtomi', 'c-cheetahboo', 'c-twinkle']

export const SEED_CARDS: Card[] = [
  /* ---------- 1차: 누구 노래? ---------- */
  { id: 'c-pororo', kind: 'character', word: '뽀로로', emoji: '🐧', color: '#4aa3ff' },
  { id: 'c-tayo', kind: 'character', word: '타요', emoji: '🚌', color: '#3fc4a0' },
  { id: 'c-bebefinn', kind: 'character', word: '베베핀', emoji: '👶', color: '#ffb02e' },
  { id: 'c-pinkfong', kind: 'character', word: '핑크퐁', emoji: '🦈', color: '#ff6fae' },
  { id: 'c-tomtomi', kind: 'character', word: '톰토미', emoji: '🐻', color: '#ff7a5c' },
  { id: 'c-cheetahboo', kind: 'character', word: '치타부', emoji: '🐆', color: '#c78b3d' },
  // 스포티파이 아티스트 이름이 '동요 Twinkle Little Studio' 라서 검색어는 영어로 둔다.
  { id: 'c-twinkle', kind: 'character', word: 'Twinkle Little Studio', label: '동요', emoji: '✨', color: '#7c6cff' },

  /* ---------- 2차: 자동차 · 중장비 ---------- */
  { id: 't-firetruck', kind: 'topic', word: '소방차', emoji: '🚒', color: '#ff5a4d', forCharacters: VEHICLE },
  { id: 't-police', kind: 'topic', word: '경찰차', emoji: '🚓', color: '#4a6bff', forCharacters: VEHICLE },
  { id: 't-ambulance', kind: 'topic', word: '구급차', emoji: '🚑', color: '#ff8fa3', forCharacters: VEHICLE },
  { id: 't-car', kind: 'topic', word: '자동차', emoji: '🚗', color: '#4aa3ff', forCharacters: VEHICLE },
  { id: 't-bus', kind: 'topic', word: '버스', emoji: '🚌', color: '#3fc4a0', forCharacters: VEHICLE },
  { id: 't-dump', kind: 'topic', word: '덤프트럭', emoji: '🚛', color: '#e0a24a', forCharacters: VEHICLE },
  { id: 't-roller', kind: 'topic', word: '로드롤러', emoji: '🛞', color: '#8a8f9e', forCharacters: VEHICLE },
  { id: 't-excavator', kind: 'topic', word: '굴착기', emoji: '🚜', color: '#ffb02e', forCharacters: VEHICLE },
  { id: 't-porclain', kind: 'topic', word: '포크레인', emoji: '⛏️', color: '#d98324', forCharacters: VEHICLE },
  { id: 't-mixer', kind: 'topic', word: '레미콘', emoji: '🚚', color: '#a0785a', forCharacters: VEHICLE },
  { id: 't-crane', kind: 'topic', word: '크레인', emoji: '🏗️', color: '#f0a500', forCharacters: VEHICLE },
  { id: 't-forklift', kind: 'topic', word: '지게차', emoji: '📦', color: '#c17f3d', forCharacters: VEHICLE },
  { id: 't-heavy', kind: 'topic', word: '중장비', emoji: '🚧', color: '#e07b39', forCharacters: VEHICLE },
  { id: 't-garbage', kind: 'topic', word: '청소차', emoji: '🗑️', color: '#5f9e6e', forCharacters: VEHICLE },
  { id: 't-tow', kind: 'topic', word: '견인차', emoji: '🛻', color: '#7a8aa0', forCharacters: VEHICLE },
  { id: 't-monster', kind: 'topic', word: '몬스터트럭', emoji: '🛞', color: '#b34a4a', forCharacters: VEHICLE },
  { id: 't-tractor', kind: 'topic', word: '트랙터', emoji: '🚜', color: '#6aa84f', forCharacters: VEHICLE },
  { id: 't-train', kind: 'topic', word: '기차', emoji: '🚂', color: '#7c6cff', forCharacters: VEHICLE },
  { id: 't-plane', kind: 'topic', word: '비행기', emoji: '✈️', color: '#57c7ff', forCharacters: VEHICLE },
  { id: 't-ship', kind: 'topic', word: '배', emoji: '🚢', color: '#4a8fd9', forCharacters: VEHICLE },
  { id: 't-heli', kind: 'topic', word: '헬리콥터', emoji: '🚁', color: '#6f7ea8', forCharacters: VEHICLE },

  /* ---------- 2차: 생활 습관 ---------- */
  { id: 't-brush', kind: 'topic', word: '양치', emoji: '🪥', color: '#3fc4a0', forCharacters: HABIT },
  { id: 't-bath', kind: 'topic', word: '목욕', emoji: '🛁', color: '#57c7ff', forCharacters: HABIT },
  { id: 't-sleep', kind: 'topic', word: '자장가', label: '잠자기', emoji: '🌙', color: '#7c6cff', forCharacters: HABIT },
  { id: 't-meal', kind: 'topic', word: '밥', emoji: '🍚', color: '#e8b33c', forCharacters: HABIT },
  { id: 't-wash', kind: 'topic', word: '손씻기', emoji: '🧼', color: '#5ec5d6', forCharacters: HABIT },
  { id: 't-potty', kind: 'topic', word: '응가', emoji: '🚽', color: '#a0785a', forCharacters: HABIT },
  { id: 't-birthday', kind: 'topic', word: '생일', emoji: '🎂', color: '#ffb02e' },
  { id: 't-hello', kind: 'topic', word: '인사', emoji: '👋', color: '#ff9f43', forCharacters: HABIT },
  { id: 't-hospital', kind: 'topic', word: '병원', emoji: '🏥', color: '#ff8fa3', forCharacters: HABIT },
  { id: 't-family', kind: 'topic', word: '가족', emoji: '👨‍👩‍👧', color: '#ff7aa8', forCharacters: HABIT },

  /* ---------- 2차: 배우는 노래 ---------- */
  { id: 't-dino', kind: 'topic', word: '공룡', emoji: '🦕', color: '#6aa84f', forCharacters: LEARN },
  { id: 't-animal', kind: 'topic', word: '동물', emoji: '🐘', color: '#9b8579', forCharacters: LEARN },
  { id: 't-shark', kind: 'topic', word: '상어', emoji: '🦈', color: '#4a8fd9', forCharacters: LEARN },
  { id: 't-number', kind: 'topic', word: '숫자', emoji: '🔢', color: '#5b6bff', forCharacters: LEARN },
  { id: 't-color', kind: 'topic', word: '색깔', emoji: '🎨', color: '#e05fa0', forCharacters: LEARN },
  { id: 't-fruit', kind: 'topic', word: '과일', emoji: '🍎', color: '#e5484d', forCharacters: LEARN },
  { id: 't-job', kind: 'topic', word: '직업', emoji: '👷', color: '#f0a500', forCharacters: LEARN },
  { id: 't-bug', kind: 'topic', word: '곤충', emoji: '🐛', color: '#7cb342', forCharacters: LEARN },
  { id: 't-sea', kind: 'topic', word: '바다', emoji: '🐳', color: '#3a7bd5', forCharacters: LEARN },
  { id: 't-space', kind: 'topic', word: '우주', emoji: '🚀', color: '#5b4b8a', forCharacters: LEARN },
  { id: 't-xmas', kind: 'topic', word: '크리스마스', emoji: '🎄', color: '#2e8b57', forCharacters: LEARN },

  /* ---------- 2차: 타요 친구들 ---------- */
  { id: 't-poco', kind: 'topic', word: '포코', emoji: '👶', color: '#ffb02e', forCharacters: ['c-tayo'] },
  { id: 't-duke', kind: 'topic', word: '듀크', emoji: '🚙', color: '#7a5cff', forCharacters: ['c-tayo'] },
  { id: 't-logi', kind: 'topic', word: '로기', emoji: '🚛', color: '#5cb85c', forCharacters: ['c-tayo'] },
  { id: 't-haneul', kind: 'topic', word: '하늘이', emoji: '🚁', color: '#57c7ff', forCharacters: ['c-tayo'] },
  { id: 't-cery', kind: 'topic', word: '세리', emoji: '🚕', color: '#ffd23f', forCharacters: ['c-tayo'] },
  { id: 't-gani', kind: 'topic', word: '가니', emoji: '🚌', color: '#4aa3ff', forCharacters: ['c-tayo'] },
  { id: 't-rani', kind: 'topic', word: '라니', emoji: '🚐', color: '#ff7a9c', forCharacters: ['c-tayo'] },
  { id: 't-frank', kind: 'topic', word: '프랭크', emoji: '🚜', color: '#e0a24a', forCharacters: ['c-tayo'] },
  { id: 't-alice', kind: 'topic', word: '앨리스', emoji: '🚑', color: '#ff8fa3', forCharacters: ['c-tayo'] },
  { id: 't-toto', kind: 'topic', word: '토토', emoji: '🚗', color: '#8fbf5f', forCharacters: ['c-tayo'] },

  /* ---------- 2차: 뽀로로 친구들 ---------- */
  { id: 't-crong', kind: 'topic', word: '크롱', emoji: '🦖', color: '#6aa84f', forCharacters: ['c-pororo'] },
  { id: 't-eddy', kind: 'topic', word: '에디', emoji: '🦊', color: '#e07b39', forCharacters: ['c-pororo'] },
  { id: 't-loopy', kind: 'topic', word: '루피', emoji: '🦫', color: '#ff9fc4', forCharacters: ['c-pororo'] },
  { id: 't-petty', kind: 'topic', word: '패티', emoji: '🐧', color: '#ff6fae', forCharacters: ['c-pororo'] },
  { id: 't-poby', kind: 'topic', word: '포비', emoji: '🐻‍❄️', color: '#7fb3d5', forCharacters: ['c-pororo'] },
  { id: 't-harry', kind: 'topic', word: '해리', emoji: '🐤', color: '#ffd23f', forCharacters: ['c-pororo'] },

  /* ---------- 2차: 옛날 동요 ---------- */
  { id: 't-star', kind: 'topic', word: '작은별', emoji: '⭐', color: '#ffd23f', forCharacters: ['c-twinkle'] },
  { id: 't-bears', kind: 'topic', word: '곰세마리', emoji: '🐻', color: '#a0785a', forCharacters: ['c-twinkle'] },
  { id: 't-croc', kind: 'topic', word: '악어떼', emoji: '🐊', color: '#5cb85c', forCharacters: ['c-twinkle'] },
  { id: 't-calf', kind: 'topic', word: '송아지', emoji: '🐮', color: '#c9a227', forCharacters: ['c-twinkle'] },
  { id: 't-butterfly', kind: 'topic', word: '나비', emoji: '🦋', color: '#7c6cff', forCharacters: ['c-twinkle'] },
  { id: 't-rabbit', kind: 'topic', word: '산토끼', emoji: '🐰', color: '#d9b8a0', forCharacters: ['c-twinkle'] },
  { id: 't-frog', kind: 'topic', word: '개구리', emoji: '🐸', color: '#6aa84f', forCharacters: ['c-twinkle'] },
  { id: 't-bell', kind: 'topic', word: '학교종', emoji: '🔔', color: '#e8b33c', forCharacters: ['c-twinkle'] },
  { id: 't-elephant', kind: 'topic', word: '코끼리', emoji: '🐘', color: '#9b8579', forCharacters: ['c-twinkle'] },
  { id: 't-bicycle', kind: 'topic', word: '자전거', emoji: '🚲', color: '#4aa3ff', forCharacters: ['c-twinkle'] },
]

export const DEFAULT_SETTINGS: Settings = {
  dailyLimitMin: 30,
  maxVolume: 0.7,
  parentPin: '1234',
  searchSourceId: 'spotify',
  searchEnabled: true,
}
