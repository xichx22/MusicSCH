/** 아이가 누르는 그림 카드. */
export interface Card {
  id: string
  /** character = 누구 노래인지, topic = 무슨 노래인지 */
  kind: 'character' | 'topic'
  /** 검색어를 만들 때 붙는 말. 예: '뽀로로' + '소방차' -> '뽀로로 소방차' */
  word: string
  /**
   * 카드에 적을 글씨. 없으면 word 를 그대로 쓴다.
   * 검색어로는 영어 이름이 잘 맞지만 아빠가 보기엔 한글이 나은 경우에 쓴다.
   */
  label?: string
  /** 아이에게 보여줄 그림. image가 없으면 이모지를 쓴다. */
  emoji: string
  /** public/ 아래 사진 경로. 넣으면 이모지 대신 사진이 나온다. */
  image?: string
  color: string
  hidden?: boolean
  /**
   * 주제 카드만 해당. 어떤 캐릭터에서 보여줄지.
   * 없으면 모든 캐릭터에서 보여준다.
   * (포코는 타요에만, 크롱은 뽀로로에만 있으면 된다)
   */
  forCharacters?: string[]
}

/** 조합 점검 결과. 이 조합으로 검색했을 때 노래가 몇 개 나왔는지. */
export interface ComboCheck {
  at: number
  count: number
}

export interface Song {
  id: string
  title: string
  /** 어느 소스에서 온 곡인지. sources/index.ts 의 id 와 같다. */
  sourceId: string
  /** 그 소스가 곡을 다시 찾을 때 쓰는 값. 로컬은 파일 경로, 스트리밍은 트랙 uri. */
  ref: string
  /** 카드 조합과 맞춰볼 말들. 예: ['뽀로로', '소방차'] */
  tags: string[]
  durationSec?: number
  /** 재생 화면에 크게 띄울 그림 */
  emoji?: string
  /** 앨범 그림 같은 진짜 사진. 있으면 이모지 대신 이걸 보여준다. */
  image?: string
  playCount: number
  /**
   * 아빠가 확인한 곡인가?
   * true  = A목록. 카드만 누르면 바로 나온다.
   * false = B(검색)로 찾은 곡. 아빠가 확인해줘야 A로 올라간다.
   */
  approved: boolean
  addedAt: number
}

export interface Settings {
  /** 하루에 들을 수 있는 시간(분). 0이면 제한 없음. */
  dailyLimitMin: number
  /** 볼륨 상한 (0~1) */
  maxVolume: number
  /** 아빠 화면 잠금 숫자 */
  parentPin: string
  /** B(검색)에 쓸 소스. 아직 안 정했으면 'local'. */
  searchSourceId: string
  /** 검색을 아예 끄고 A목록만 쓰기 */
  searchEnabled: boolean
}

export interface UsageToday {
  date: string
  secondsPlayed: number
}
