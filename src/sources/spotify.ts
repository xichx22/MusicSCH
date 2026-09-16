import type { MusicSource, SearchResult } from './types'

/**
 * 스포티파이 소스 (아직 안 켬).
 *
 * 켜려면 필요한 것:
 *  1. Spotify Premium 계정 (API 로 재생하려면 필수)
 *  2. developer.spotify.com 에서 앱 등록 -> Client ID
 *  3. PKCE 로그인 (scope: user-modify-playback-state, user-read-playback-state, streaming)
 *  4. 재생 방식 두 가지 중 하나
 *     a) Web Playback SDK 로 이 브라우저를 스피커로 만들기
 *     b) 태블릿에 깔린 스포티파이 앱을 리모컨처럼 조종하기
 *        -> PUT /v1/me/player/play  { uris: [ref], device_id }
 *        모바일에서는 (b)가 더 안정적이다.
 *  5. 검색: GET /v1/search?q=<검색어>&type=track&market=KR
 *
 * 켜기 전에 확인할 것: 스포티파이 앱에서 '뽀로로' 를 쳐봤을 때
 * 지한이가 들을 노래가 실제로 나오는지. 카탈로그에 없으면 이 소스는 의미가 없다.
 */
const NOT_READY = '스포티파이는 아직 안 켰어. src/sources/spotify.ts 참고.'

export const spotifySource: MusicSource = {
  id: 'spotify',
  label: '스포티파이 (미설정)',
  canSearch: true,

  async isReady() {
    return false
  },

  readyHint() {
    return NOT_READY
  },

  async search(_query: string): Promise<SearchResult[]> {
    throw new Error(NOT_READY)
  },

  async play(_ref: string, _onEnded: () => void) {
    throw new Error(NOT_READY)
  },

  stop() {},
  setVolume(_v: number) {},
  currentTimeSec() {
    return 0
  },
}
