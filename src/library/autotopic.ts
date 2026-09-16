import { newId, comboKey, type DB } from './store'
import { mentions } from './match'
import { toKorean } from './english'
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
  'yeah', 'la', 'na', 'feat', 'ft', 'ost', 'mix', 'edit', 'live', 'intro', 'outro',
])

export interface Candidate {
  word: string
  count: number
  songIds: string[]
}

/** 한글 낱말이 영어 찌꺼기보다 카드 이름으로 낫다. */
function hangul(word: string): number {
  return /[가-힣]/.test(word) ? 1 : 0
}

/** 카드 이름으로 더 나은 쪽이 앞에 오게. 많이 나온 말 > 한글 > 긴 말. */
export function betterWord(a: Candidate, b: Candidate): number {
  return b.count - a.count || hangul(b.word) - hangul(a.word) || b.word.length - a.word.length
}

/** 카드 색을 돌아가며 쓴다. */
const COLORS = ['#FBDCD4', '#D7E3F7', '#FBE0E8', '#FAE8C6', '#CFEADD', '#EFE0C8', '#DED9F3', '#D8EFF3']

/**
 * 한 캐릭터에 카드가 이보다 많아지면 아이가 못 고른다.
 * 한 쪽에 6장씩 넘기니 4쪽까지다.
 */
export const MAX_TOPICS = 24

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
  for (const [key, emoji] of EMOJI_HINTS) if (word.includes(key)) return emoji
  return '🎵'
}

/**
 * '세차송' 과 '세차' 는 같은 말로 친다.
 *
 * 동요 제목은 '-송' 으로 끝나는 게 흔하다. 그대로 두면 같은 주제가
 * 두 카드로 갈라지고, 그림 짐작도 빗나간다.
 */
function normalize(word: string): string {
  if (word.length >= 3 && word.endsWith('송')) return word.slice(0, -1)
  return word
}

/** 제목에서 쓸 만한 말을 뽑는다. 가수 이름과 흔한 말은 뺀다. */
export function wordsOf(title: string, characterWord: string): string[] {
  return [
    ...new Set(
      // 영어 제목은 먼저 한글로 바꾼다. 안 그러면 'Excavator' 카드가 생긴다.
      toKorean(
        // ' - 핑크퐁' 처럼 뒤에 붙은 가수 이름은 어느 곡에나 있어서 뽑을 말이 못 된다
        title.split(' - ')[0],
      )
        .split(/[\s!?,.·()[\]{}~"'’“”\-–—:;/0-9]+/)
        .map((w) => normalize(w.trim()))
        .filter((w) => w.length >= 2 && !STOP.has(w.toLowerCase()))
        .filter((w) => !mentions(characterWord, w) && !mentions(w, characterWord)),
    ),
  ]
}

/** 이 곡들에서 카드로 만들기 가장 좋은 말. */
export function pickBest(
  songs: { id: string; title: string }[],
  characterWord: string,
  cards: Card[],
): Candidate | null {
  const counter = new Map<string, string[]>()
  for (const song of songs) {
    for (const w of wordsOf(song.title, characterWord)) {
      counter.set(w, [...(counter.get(w) ?? []), song.id])
    }
  }
  const list = [...counter.entries()]
    .map(([word, songIds]) => ({ word, count: songIds.length, songIds }))
    .filter((c) => !cards.some((t) => t.kind === 'topic' && t.word === c.word))
    .sort(betterWord)
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
      const best = pickBest(mine, character.word, cards)
      if (!best || best.count < 2 || topicCount() >= MAX_TOPICS) break
      attach(new Set(best.songIds), character.id, addCard(character.id, best.word), best.word)
      made += 1
      mine = songs.filter((s) => s.needsTopic === character.id)
    }

    // 2. 한 곡짜리도 제목에서 이름을 지어 카드를 만든다
    while (mine.length > 0 && topicCount() < MAX_TOPICS) {
      const song = mine[0]
      const best = pickBest([song], character.word, cards)
      const word = best?.word ?? toKorean(song.title.split(' - ')[0]).slice(0, 10)
      attach(new Set([song.id]), character.id, addCard(character.id, word), word)
      single += 1
      mine = songs.filter((s) => s.needsTopic === character.id)
    }

    // 3. 그래도 남으면 한 카드에 모은다
    if (mine.length > 0) {
      const word = '그 밖의 노래'
      attach(new Set(mine.map((s) => s.id)), character.id, addCard(character.id, word), word)
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
