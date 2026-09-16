/**
 * 음원 소스 인터페이스.
 *
 * 앱의 나머지 부분은 노래가 mp3 파일인지 스포티파이 트랙인지 전혀 모른다.
 * 소스를 바꾸고 싶으면 이 인터페이스를 구현한 파일 하나를 추가하고
 * sources/index.ts 에 등록하면 끝이다.
 *
 * 규칙: 어떤 소스도 영상을 띄우지 않는다. 오디오만 낸다.
 */
export interface SearchResult {
  ref: string
  title: string
  durationSec?: number
  /** 아이에게 보여줄 그림(있으면). 없으면 카드 이모지를 쓴다. */
  thumbnail?: string
}

export interface MusicSource {
  id: string
  label: string

  /** 지금 이 소스를 쓸 수 있는 상태인가? (로그인/구독/파일 준비 여부) */
  isReady(): Promise<boolean>

  /** 준비가 안 됐을 때 아빠에게 보여줄 안내 문구. */
  readyHint(): string

  /** 검색을 지원하는가? (B안) */
  canSearch: boolean

  /** B안: 카드 조합으로 만든 검색어로 새 노래 찾기. */
  search(query: string): Promise<SearchResult[]>

  /** 재생 시작. 곡이 끝나면 onEnded 를 부른다. */
  play(ref: string, onEnded: () => void): Promise<void>

  stop(): void

  /** 0 ~ 1 */
  setVolume(v: number): void

  /** 지금까지 재생된 초. 사용 시간 제한 계산에 쓴다. */
  currentTimeSec(): number
}
