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
  { id: 'c-pororo', kind: 'character', word: '뽀로로', emoji: '🐧', color: '#CFE3F5' },
  { id: 'c-tayo', kind: 'character', word: '타요', emoji: '🚌', color: '#CBE9DC' },
  { id: 'c-bebefinn', kind: 'character', word: '베베핀', emoji: '👶', color: '#FAE2C4' },
  { id: 'c-pinkfong', kind: 'character', word: '핑크퐁', emoji: '🦈', color: '#F9D3E2' },
  { id: 'c-tomtomi', kind: 'character', word: '톰토미', emoji: '🐻', color: '#F6D8CC' },
  { id: 'c-cheetahboo', kind: 'character', word: '치타부', emoji: '🐆', color: '#FBE7B8' },
  // 스포티파이 아티스트 이름이 '동요 Twinkle Little Studio' 라서 검색어는 영어로 둔다.
  { id: 'c-twinkle', kind: 'character', word: 'Twinkle Little Studio', label: '동요', emoji: '✨', color: '#DCD6F2' },

  /* ---------- 2차: 자동차 · 중장비 ---------- */
  { id: 't-firetruck', kind: 'topic', word: '소방차', emoji: '🚒', color: '#FBDCD4', forCharacters: VEHICLE },
  { id: 't-police', kind: 'topic', word: '경찰차', emoji: '🚓', color: '#C6D8F2', forCharacters: VEHICLE },
  { id: 't-ambulance', kind: 'topic', word: '구급차', emoji: '🚑', color: '#F7CFDC', forCharacters: VEHICLE },
  { id: 't-car', kind: 'topic', word: '자동차', emoji: '🚗', color: '#FAE8C6', forCharacters: VEHICLE },
  { id: 't-bus', kind: 'topic', word: '버스', emoji: '🚌', color: '#CFEADD', forCharacters: VEHICLE },
  { id: 't-dump', kind: 'topic', word: '덤프트럭', emoji: '🚛', color: '#EFE0C8', forCharacters: VEHICLE },
  { id: 't-roller', kind: 'topic', word: '로드롤러', emoji: '🛞', color: '#D3D8E0', forCharacters: VEHICLE },
  { id: 't-excavator', kind: 'topic', word: '굴착기', emoji: '🚜', color: '#FAE4BE', forCharacters: VEHICLE },
  { id: 't-porclain', kind: 'topic', word: '포크레인', emoji: '⛏️', color: '#F6DCC0', forCharacters: VEHICLE },
  { id: 't-mixer', kind: 'topic', word: '레미콘', emoji: '🚚', color: '#D5DAE3', forCharacters: VEHICLE },
  { id: 't-crane', kind: 'topic', word: '크레인', emoji: '🏗️', color: '#FBE6BC', forCharacters: VEHICLE },
  { id: 't-forklift', kind: 'topic', word: '지게차', emoji: '📦', color: '#EFDFC6', forCharacters: VEHICLE },
  { id: 't-heavy', kind: 'topic', word: '중장비', emoji: '🚧', color: '#F7E1C2', forCharacters: VEHICLE },
  { id: 't-garbage', kind: 'topic', word: '청소차', emoji: '🗑️', color: '#D8EBDC', forCharacters: VEHICLE },
  { id: 't-tow', kind: 'topic', word: '견인차', emoji: '🛻', color: '#DDE3EC', forCharacters: VEHICLE },
  { id: 't-monster', kind: 'topic', word: '몬스터트럭', emoji: '🛞', color: '#F3D6D6', forCharacters: VEHICLE },
  { id: 't-tractor', kind: 'topic', word: '트랙터', emoji: '🚜', color: '#DCEBCF', forCharacters: VEHICLE },
  { id: 't-train', kind: 'topic', word: '기차', emoji: '🚂', color: '#DED9F3', forCharacters: VEHICLE },
  { id: 't-plane', kind: 'topic', word: '비행기', emoji: '✈️', color: '#D4EAF8', forCharacters: VEHICLE },
  { id: 't-ship', kind: 'topic', word: '배', emoji: '🚢', color: '#D5E2F5', forCharacters: VEHICLE },
  { id: 't-heli', kind: 'topic', word: '헬리콥터', emoji: '🚁', color: '#DCE1EE', forCharacters: VEHICLE },

  /* ---------- 2차: 생활 습관 ---------- */
  { id: 't-brush', kind: 'topic', word: '양치', emoji: '🪥', color: '#D2EDE6', forCharacters: HABIT },
  { id: 't-bath', kind: 'topic', word: '목욕', emoji: '🛁', color: '#D6ECF8', forCharacters: HABIT },
  { id: 't-sleep', kind: 'topic', word: '자장가', label: '잠자기', emoji: '🌙', color: '#E0DAF4', forCharacters: HABIT },
  { id: 't-meal', kind: 'topic', word: '밥', emoji: '🍚', color: '#F7E8CC', forCharacters: HABIT },
  { id: 't-wash', kind: 'topic', word: '손씻기', emoji: '🧼', color: '#D8EFF3', forCharacters: HABIT },
  { id: 't-potty', kind: 'topic', word: '응가', emoji: '🚽', color: '#E6E0D6', forCharacters: HABIT },
  { id: 't-birthday', kind: 'topic', word: '생일', emoji: '🎂', color: '#FBE0EB' },
  { id: 't-hello', kind: 'topic', word: '인사', emoji: '👋', color: '#FAE3C8', forCharacters: HABIT },
  { id: 't-hospital', kind: 'topic', word: '병원', emoji: '🏥', color: '#FBDEE0', forCharacters: HABIT },
  { id: 't-family', kind: 'topic', word: '가족', emoji: '👨‍👩‍👧', color: '#F8DEE9', forCharacters: HABIT },

  /* ---------- 2차: 배우는 노래 ---------- */
  { id: 't-dino', kind: 'topic', word: '공룡', emoji: '🦕', color: '#DCEBCF', forCharacters: LEARN },
  { id: 't-animal', kind: 'topic', word: '동물', emoji: '🐘', color: '#E8E0D6', forCharacters: LEARN },
  // 아기상어는 핑크퐁이 만든 노래다. 스포티파이에 '아기상어' 라는 아티스트는
  // 없고 Pinkfong 밑에 들어 있다. 그래서 캐릭터가 아니라 주제로 둔다.
  // 카드에는 '상어' 라고 쓰고 검색은 실제 제목인 '아기상어' 로 한다.
  { id: 't-shark', kind: 'topic', word: '아기상어', label: '상어', emoji: '🦈', color: '#D5E5F5', forCharacters: LEARN },
  { id: 't-number', kind: 'topic', word: '숫자', emoji: '🔢', color: '#DCDDF6', forCharacters: LEARN },
  { id: 't-color', kind: 'topic', word: '색깔', emoji: '🎨', color: '#F8DAEB', forCharacters: LEARN },
  { id: 't-fruit', kind: 'topic', word: '과일', emoji: '🍎', color: '#FBD9D5', forCharacters: LEARN },
  { id: 't-job', kind: 'topic', word: '직업', emoji: '👷', color: '#FAE6C0', forCharacters: LEARN },
  { id: 't-bug', kind: 'topic', word: '곤충', emoji: '🐛', color: '#DFEDCE', forCharacters: LEARN },
  { id: 't-sea', kind: 'topic', word: '바다', emoji: '🐳', color: '#D3E6F7', forCharacters: LEARN },
  { id: 't-space', kind: 'topic', word: '우주', emoji: '🚀', color: '#DFDAF0', forCharacters: LEARN },
  { id: 't-xmas', kind: 'topic', word: '크리스마스', emoji: '🎄', color: '#D5EAD8', forCharacters: LEARN },

  /* ---------- 2차: 타요 친구들 ---------- */
  { id: 't-poco', kind: 'topic', word: '포코', emoji: '👶', color: '#FAE6C6', forCharacters: ['c-tayo'] },
  { id: 't-duke', kind: 'topic', word: '듀크', emoji: '🚙', color: '#E1DCF5', forCharacters: ['c-tayo'] },
  { id: 't-logi', kind: 'topic', word: '로기', emoji: '🚛', color: '#D9EBD6', forCharacters: ['c-tayo'] },
  { id: 't-haneul', kind: 'topic', word: '하늘이', emoji: '🚁', color: '#D8EDF8', forCharacters: ['c-tayo'] },
  { id: 't-cery', kind: 'topic', word: '세리', emoji: '🚕', color: '#FBEBC8', forCharacters: ['c-tayo'] },
  { id: 't-gani', kind: 'topic', word: '가니', emoji: '🚌', color: '#D7E5F7', forCharacters: ['c-tayo'] },
  { id: 't-rani', kind: 'topic', word: '라니', emoji: '🚐', color: '#FADFE7', forCharacters: ['c-tayo'] },
  { id: 't-frank', kind: 'topic', word: '프랭크', emoji: '🚜', color: '#F2E2C6', forCharacters: ['c-tayo'] },
  { id: 't-alice', kind: 'topic', word: '앨리스', emoji: '🚑', color: '#FBE0E6', forCharacters: ['c-tayo'] },
  { id: 't-toto', kind: 'topic', word: '토토', emoji: '🚗', color: '#E2EED6', forCharacters: ['c-tayo'] },

  /* ---------- 2차: 뽀로로 친구들 ---------- */
  { id: 't-crong', kind: 'topic', word: '크롱', emoji: '🦖', color: '#DCEBCF', forCharacters: ['c-pororo'] },
  { id: 't-eddy', kind: 'topic', word: '에디', emoji: '🦊', color: '#F7E0CE', forCharacters: ['c-pororo'] },
  { id: 't-loopy', kind: 'topic', word: '루피', emoji: '🦫', color: '#FBE0EC', forCharacters: ['c-pororo'] },
  { id: 't-petty', kind: 'topic', word: '패티', emoji: '🐧', color: '#F9D6E6', forCharacters: ['c-pororo'] },
  { id: 't-poby', kind: 'topic', word: '포비', emoji: '🐻‍❄️', color: '#DCEAF6', forCharacters: ['c-pororo'] },
  { id: 't-harry', kind: 'topic', word: '해리', emoji: '🐤', color: '#FBEDC6', forCharacters: ['c-pororo'] },

  /* ---------- 2차: 옛날 동요 ---------- */
  { id: 't-star', kind: 'topic', word: '작은별', emoji: '⭐', color: '#FBECC2', forCharacters: ['c-twinkle'] },
  { id: 't-bears', kind: 'topic', word: '곰세마리', emoji: '🐻', color: '#EDE0D2', forCharacters: ['c-twinkle'] },
  { id: 't-croc', kind: 'topic', word: '악어떼', emoji: '🐊', color: '#D9ECD4', forCharacters: ['c-twinkle'] },
  { id: 't-calf', kind: 'topic', word: '송아지', emoji: '🐮', color: '#F3E6C8', forCharacters: ['c-twinkle'] },
  { id: 't-butterfly', kind: 'topic', word: '나비', emoji: '🦋', color: '#E2DCF4', forCharacters: ['c-twinkle'] },
  { id: 't-rabbit', kind: 'topic', word: '산토끼', emoji: '🐰', color: '#F2E6DE', forCharacters: ['c-twinkle'] },
  { id: 't-frog', kind: 'topic', word: '개구리', emoji: '🐸', color: '#DAEDD2', forCharacters: ['c-twinkle'] },
  { id: 't-bell', kind: 'topic', word: '학교종', emoji: '🔔', color: '#F8E8CA', forCharacters: ['c-twinkle'] },
  { id: 't-elephant', kind: 'topic', word: '코끼리', emoji: '🐘', color: '#E6E1DA', forCharacters: ['c-twinkle'] },
  { id: 't-bicycle', kind: 'topic', word: '자전거', emoji: '🚲', color: '#D8E6F7', forCharacters: ['c-twinkle'] },
]

export const DEFAULT_SETTINGS: Settings = {
  dailyLimitMin: 30,
  maxVolume: 0.7,
  parentPin: '1234',
  searchSourceId: 'spotify',
  searchEnabled: true,
}
