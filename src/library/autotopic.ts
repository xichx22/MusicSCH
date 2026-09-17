import { newId, comboKey, type DB } from './store'
import { mentions } from './match'
import { toKorean, KNOWN_WORDS } from './english'
// 그려둔 그림이 있는 카드에 앨범 사진을 덮어씌우면 안 된다.
import { hasIcon } from '../components/icons'
import type { Card } from '../types'

/** 제목에 흔해서 주제가 될 수 없는 말. */
const STOP = new Set([
  '노래', '동요', '송', '버전', 'ver', 'version', 'korean', 'inst', 'remix',
  '함께', '우리', '나는', '너는', '같이', '신나는', '즐거운', '재미있는',
  '메들리', '모음', '베스트', '인기', '연속', '듣기', '플레이', 'the', 'and', 'song', 'songs',
  // 영어 제목에서 남는 흔한 말
  'is', 'are', 'am', 'was', 'were', 'be', 'it', 'its', 'in', 'on', 'at', 'to', 'of',
  'for', 'with', 'my', 'me', 'we', 'you', 'your', 'our', 'they', 'he', 'she', 'his',
  'her', 'this', 'that', 'there', 'here', 'up', 'down', 'let', 'lets', 'all', 'oh',
  'day', 'from', 'about', 'what', 'when', 'where', 'who', 'how', 'can', 'will', 'just',
  'yeah', 'la', 'na', 'feat', 'ft', 'ost', 'mix', 'edit', 'live', 'intro', 'outro',
  // 앨범 이름에서 넘어오는 말. 주제가 아니라 묶음 이름이다.
  '율동동요', '창작동요', '창작동요제', '동요제', '인기동요', '놀이동요', '영어동요',
  '초등', '유아', '전집', '모음집', '컴필레이션', '스페셜', '에디션', '타이틀',
  '오리지널', '사운드트랙', '대표', '최신', '추천', '필수', '키즈',
  '학년', '교과서', '수록곡', '모음곡',
  // 제목에서 떨어져 나오는 토막. 카드 이름이 될 수 없다.
  '타고', '옆으로', '좋아요', '모두', '어디', '그대로', '올라갑니다', '내려갑니다',
  '하나', '해요', '해봐요', '가요', '와요', '봐요', '돼요', '이에요', '예요',
  '있나요', '아시나요', '노래해', '멈춰라', '기분이', '어때', '있어', '없어',
  '주세요', '가자', '하자', '보자', '한대요', '했어요', '해줘', '이야',
])

export interface Candidate {
  word: string
  count: number
  songIds: string[]
}

/**
 * 카드 이름으로 약한 말. 뜻은 알지만 그림이 안 그려진다.
 * '작은 별' 은 '작은' 이 아니라 '별' 이다.
 */
const WEAK = new Set([
  '작은', '큰', '빠른', '느린', '행복한', '용감한', '무서운', '졸린', '맛있는',
  '새', '좋은', '예쁜', '멋진', '신나는',
])

/** 한글 낱말이 영어 찌꺼기보다 카드 이름으로 낫다. */
function hangul(word: string): number {
  return /[가-힣]/.test(word) ? 1 : 0
}

/**
 * 카드 이름으로 더 나은 쪽이 앞에.
 * 많이 나온 말 > 아는 말 > 한글 > 긴 말.
 *
 * '아는 말' 을 길이보다 앞세운다. '정글 숲을 지나서' 에서 '지나서'(3) 가
 * '정글'(2) 을 이기면 안 된다.
 */
export function betterWord(a: Candidate, b: Candidate, known?: Set<string>): number {
  const weak = (w: string) => (WEAK.has(w) ? 1 : 0)
  const k = (w: string) => (known?.has(w) ? 1 : 0)
  /*
   * 약한 말은 몇 곡을 묶든 뒤로 보낸다. 'Little Star' 와 'Little Duck' 을
   * '작은' 한 장으로 묶느니 '별' 과 '오리' 두 장이 낫다.
   */
  return (
    weak(a.word) - weak(b.word) ||
    b.count - a.count ||
    k(b.word) - k(a.word) ||
    hangul(b.word) - hangul(a.word) ||
    b.word.length - a.word.length
  )
}

/** 카드 색을 돌아가며 쓴다. */
const COLORS = ['#FBDCD4', '#D7E3F7', '#FBE0E8', '#FAE8C6', '#CFEADD', '#EFE0C8', '#DED9F3', '#D8EFF3']

/**
 * 한 캐릭터에 카드가 이보다 많아지면 아이가 못 고른다.
 * 한 쪽에 6장씩 넘기니 5쪽까지다.
 */
export const MAX_TOPICS = 30

/** 이름을 못 지은 곡을 모아두는 카드. 캐릭터마다 한 장만 둔다. */
const REST = '그 밖의 노래'

/** 말에서 그림을 짐작한다. 못 찾으면 음표를 쓴다. */
const EMOJI_HINTS: [string, string][] = [
  ['공룡', '🦕'], ['상어', '🦈'], ['코끼리', '🐘'], ['토끼', '🐰'], ['곰', '🐻'], ['강아지', '🐶'],
  ['고양이', '🐱'], ['돼지', '🐷'], ['오리', '🦆'], ['나비', '🦋'], ['개구리', '🐸'], ['펭귄', '🐧'],
  ['소방', '🚒'], ['경찰', '🚓'], ['구급', '🚑'], ['구조', '🚨'], ['출동', '🚨'], ['트럭', '🚛'],
  ['버스', '🚌'], ['기차', '🚂'], ['지하철', '🚇'], ['택시', '🚕'], ['오토바이', '🏍️'],
  ['비행기', '✈️'], ['헬리콥터', '🚁'], ['로켓', '🚀'], ['우주', '🚀'], ['배', '🚢'], ['자전거', '🚲'],
  ['자동차', '🚗'], ['운전', '🚗'], ['경주', '🏁'], ['빠를', '🏁'], ['신호등', '🚦'], ['세차', '🧼'],
  ['포크레인', '⛏️'], ['굴착', '⛏️'], ['불도저', '🚜'], ['레미콘', '🚚'], ['중장비', '🚧'], ['공사', '🚧'],
  ['목욕', '🛁'], ['양치', '🪥'], ['잠', '🌙'], ['자장', '🌙'], ['생일', '🎂'], ['밥', '🍚'],
  ['과일', '🍎'], ['숫자', '🔢'], ['색깔', '🎨'], ['별', '⭐'], ['달', '🌙'], ['해', '☀️'],
  ['비', '🌧️'], ['눈', '❄️'], ['꽃', '🌸'], ['바다', '🌊'], ['숨바꼭질', '🙈'], ['놀이', '🎠'],
  ['가족', '👨‍👩‍👧'], ['엄마', '👩'], ['아빠', '👨'], ['아기', '👶'], ['인사', '👋'], ['크리스마스', '🎄'],
  ['청소', '🧹'], ['빨래', '🧺'], ['병원', '🏥'], ['공룡알', '🥚'],
  ['출발', '🏁'], ['빠른', '🏁'], ['모험', '🗺️'], ['졸린', '😴'], ['힘센', '💪'],
  ['터널', '🌉'], ['다리', '🌉'], ['주유소', '⛽'], ['사이렌', '🚨'], ['바퀴', '🛞'],
  ['엔진', '⚙️'], ['수리', '🔧'], ['친구', '🧑‍🤝‍🧑'], ['춤', '💃'], ['달리기', '🏃'],
  ['도우미', '🦺'], ['일하기', '👷'], ['공원', '🏞️'], ['학교', '🏫'], ['집', '🏠'],
  ['겨울', '⛄'], ['여름', '🏖️'], ['무지개', '🌈'], ['점프', '🤸'], ['깜짝', '🎉'],
]

export function guessEmoji(word: string): string {
  for (const [key, emoji] of EMOJI_HINTS) {
    // 한 글자 힌트는 딱 그 말일 때만. '도깨비' 가 '비' 때문에 🌧️ 가 됐다.
    if (key.length === 1 ? word === key : word.includes(key)) return emoji
  }
  return '🎵'
}

/** 아는 말 — 사전이 아는 한글 낱말 + 이미 카드가 된 말. */
export function knownWords(cards: Card[]): Set<string> {
  const out = new Set(KNOWN_WORDS)
  for (const c of cards) if (c.kind === 'topic' && c.word.length >= 2) out.add(c.word)
  return out
}

/*
 * 낱말 뒤에 붙는 조사. 이것만 떼어낸다.
 * '이' 는 뺐다 — '호랑이' '고양이' '원숭이' '어린이' 가 잘려버린다.
 */
const PARTICLES = new Set(['가', '은', '는', '을', '를', '의', '에', '도', '와', '과', '랑', '야', '들'])

/**
 * 낱말 다듬기.
 *
 *  - '세차송' → '세차'. 동요 제목은 '-송' 으로 끝나는 게 흔하다.
 *    그대로 두면 같은 주제가 두 카드로 갈라지고 그림도 빗나간다.
 *  - '나비야' → '나비', '버스가' → '버스'. 아는 말 뒤에 조사 한 글자가
 *    붙은 것뿐이면 떼어낸다. 조사가 아니면 그냥 둔다 ('작은별' 은
 *    '작은' 이 아니고 '힘센차' 는 '힘센' 이 아니다).
 */
function normalize(word: string, known?: Set<string>): string {
  let w = word
  if (w.length >= 3 && w.endsWith('송')) w = w.slice(0, -1)
  // '바다에는' 처럼 두 개 붙기도 한다. 몇 번 더 본다.
  for (let i = 0; i < 3; i += 1) {
    if (known?.has(w)) break
    if (w.length < 2 || !PARTICLES.has(w.slice(-1))) break
    const rest = w.slice(0, -1)
    /*
     * 남는 쪽이 두 글자 이상이거나, 한 글자라도 아는 말이어야 뗀다.
     * '비야' → '비' 는 되고 '노을' → '노' 는 안 된다.
     */
    if (rest.length >= 2 || known?.has(rest)) w = rest
    else break
  }
  return w
}

/** 제목에서 쓸 만한 말을 뽑는다. 가수 이름과 흔한 말은 뺀다. */
export function wordsOf(title: string, characterWord: string, known?: Set<string>): string[] {
  return [
    ...new Set(
      // 영어 제목은 먼저 한글로 바꾼다. 안 그러면 'Excavator' 카드가 생긴다.
      toKorean(
        // ' - 핑크퐁' 처럼 뒤에 붙은 가수 이름은 어느 곡에나 있어서 뽑을 말이 못 된다
        title.split(' - ')[0],
      )
        .split(/[\s!?,.·()[\]{}~"'’“”\-–—:;/0-9]+/)
        .map((w) => normalize(w.trim(), known))
        /*
         * 한글은 한 글자도 뜻이 있다 — 길·밥·배·별·눈·꽃. 다만 아는 말일
         * 때만 쓴다. '모두 다 같이' 의 '다' 가 카드가 되면 안 된다.
         */
        .filter((w) => (w.length >= 2 || (known?.has(w) ?? false)) && !STOP.has(w.toLowerCase()))
        .filter((w) => !mentions(characterWord, w) && !mentions(w, characterWord)),
    ),
  ]
}

/** 이 곡들에서 카드로 만들기 가장 좋은 말. */
export function pickBest(
  songs: { id: string; title: string }[],
  character: Card,
  cards: Card[],
): Candidate | null {
  const known = knownWords(cards)
  const counter = new Map<string, string[]>()
  for (const song of songs) {
    for (const w of wordsOf(song.title, character.word, known)) {
      counter.set(w, [...(counter.get(w) ?? []), song.id])
    }
  }
  const list = [...counter.entries()]
    .map(([word, songIds]) => ({ word, count: songIds.length, songIds }))
    /*
     * 이미 있는 카드 이름은 뺀다. 단 '이 캐릭터가 쓸 수 있는' 카드만 센다.
     * 숫자 카드는 핑크퐁·베베핀 것이라 타요에는 안 보인다. 그런데도
     * 빼버리면 타요의 'The Number Song' 이 이름을 못 얻는다.
     */
    .filter(
      (c) =>
        !cards.some(
          (t) =>
            t.kind === 'topic' &&
            t.word === c.word &&
            (!t.forCharacters || t.forCharacters.includes(character.id)),
        ),
    )
    .sort((a, b) => betterWord(a, b, known))
  return list[0] ?? null
}

export interface AutoResult {
  db: DB
  /** 여러 곡을 묶은 카드 수 */
  made: number
  /** 한 곡짜리 카드 수 */
  single: number
  /** '그 밖의 노래' 로 모은 곡 수 */
  rest: number
}

/**
 * 주제를 못 정한 곡을 전부 알아서 정한다.
 *
 * 1. 두 곡 이상 제목에 겹치는 말은 카드로 만들어 한꺼번에 붙인다
 * 2. 그러고도 남은 곡은 제목에서 고른 말로 한 곡짜리 카드를 만든다
 * 3. 카드가 너무 많아지면(아이가 못 고른다) 나머지는 '그 밖의 노래' 로 모은다
 */
export function autoAssignTopics(d: DB): AutoResult {
  const cards = [...d.cards]
  const songs = [...d.songs]
  const checks = { ...d.checks }
  let made = 0
  let single = 0
  let rest = 0

  const addCard = (characterId: string, word: string): string => {
    const id = `t-made-${newId()}`
    cards.push({
      id,
      kind: 'topic',
      word,
      emoji: guessEmoji(word),
      color: COLORS[cards.length % COLORS.length],
      // 이 캐릭터의 노래에서 뽑은 말이라 다른 캐릭터에는 안 보인다.
      forCharacters: [characterId],
    })
    return id
  }

  /*
   * '그 밖의 노래' 는 캐릭터마다 한 장이면 된다. 앨범을 넣을 때마다
   * 새로 만들었더니 같은 이름 카드가 네 장씩 쌓였다.
   */
  const restCard = (characterId: string): string => {
    const found = cards.find(
      (c) => c.kind === 'topic' && c.word === REST && c.forCharacters?.includes(characterId),
    )
    return found ? found.id : addCard(characterId, REST)
  }

  /*
   * 그림도 이모지도 못 붙이는 카드는 앨범 사진이라도 쓴다. 음표만 여러 장
   * 늘어서면 아이가 구분을 못 한다. 단 같은 사진이 두 장 붙으면 그것도
   * 구분이 안 되니, 이미 쓴 사진은 안 쓴다.
   */
  const usedArt = new Set(cards.map((c) => c.image).filter(Boolean) as string[])
  const dressUp = (topicId: string, songIds: Set<string>) => {
    const card = cards.find((c) => c.id === topicId)
    if (!card || card.image || hasIcon(card.id, card.word)) return
    const art = songs.find((s) => songIds.has(s.id) && s.image && !usedArt.has(s.image))?.image
    if (!art) return
    usedArt.add(art)
    const i = cards.indexOf(card)
    cards[i] = { ...card, image: art }
  }

  const attach = (songIds: Set<string>, characterId: string, topicId: string, word: string) => {
    const key = comboKey(characterId, topicId)
    const character = cards.find((c) => c.id === characterId)!
    let n = 0
    for (let i = 0; i < songs.length; i += 1) {
      if (!songIds.has(songs[i].id)) continue
      songs[i] = { ...songs[i], combo: key, needsTopic: undefined, tags: [character.word, word] }
      n += 1
    }
    checks[key] = { at: Date.now(), count: n }
  }

  for (const character of cards.filter((c) => c.kind === 'character')) {
    let mine = songs.filter((s) => s.needsTopic === character.id)
    if (mine.length === 0) continue

    // 씨앗 카드는 이 캐릭터에 '보일 수 있는' 것뿐이라 세면 안 된다.
    // 실제로 이 캐릭터의 노래가 붙어 있는 카드만 센다.
    const topicCount = () =>
      cards.filter(
        (c) => c.kind === 'topic' && songs.some((s) => s.combo === comboKey(character.id, c.id)),
      ).length

    // 1. 여러 곡에 겹치는 말부터
    for (;;) {
      const best = pickBest(mine, character, cards)
      if (!best || best.count < 2 || topicCount() >= MAX_TOPICS) break
      const ids = new Set(best.songIds)
      const topicId = addCard(character.id, best.word)
      attach(ids, character.id, topicId, best.word)
      dressUp(topicId, ids)
      made += 1
      mine = songs.filter((s) => s.needsTopic === character.id)
    }

    // 2. 한 곡짜리도 제목에서 이름을 지어 카드를 만든다
    while (mine.length > 0 && topicCount() < MAX_TOPICS) {
      const song = mine[0]
      const best = pickBest([song], character, cards)
      const word = best?.word ?? toKorean(song.title.split(' - ')[0]).slice(0, 10)
      const ids = new Set([song.id])
      const topicId = addCard(character.id, word)
      attach(ids, character.id, topicId, word)
      dressUp(topicId, ids)
      single += 1
      mine = songs.filter((s) => s.needsTopic === character.id)
    }

    // 3. 그래도 남으면 한 카드에 모은다
    if (mine.length > 0) {
      attach(new Set(mine.map((s) => s.id)), character.id, restCard(character.id), REST)
      rest += mine.length
    }
  }

  return { db: { ...d, cards, songs, checks }, made, single, rest }
}

/** 정리 결과를 아빠가 읽을 말로. */
export function autoSummary(r: AutoResult): string {
  return (
    `카드 ${r.made}개를 만들어 여러 곡을 묶고, ${r.single}곡은 한 곡짜리 카드로 넣었어.` +
    (r.rest ? ` 카드가 너무 많아져서 ${r.rest}곡은 '그 밖의 노래' 로 모았어.` : '') +
    ' 그림과 이름은 아래에서 고칠 수 있어.'
  )
}
