import type { MusicSource, SearchResult } from './types'

/**
 * 애플뮤직 소스 (아직 안 켬).
 *
 * 켜려면 필요한 것:
 *  1. 애플뮤직 구독 (구독자만 전곡 재생 가능)
 *  2. Apple Developer 에서 MusicKit developer token 발급
 *  3. MusicKit JS 붙이기 -> music.authorize() 로 사용자 로그인
 *  4. 검색: music.api.search(query, { types: ['songs'], l: 'ko', storefront: 'kr' })
 *  5. 재생: music.setQueue({ song: ref }) 후 music.play()
 *
 * 애플뮤직은 MusicKit JS 로 브라우저에서 전곡 재생이 되고 영상이 안 뜬다.
 * 한국 동요 카탈로그가 스포티파이보다 나을 수 있으니 둘 다 검색해보고 정하자.
 */
const NOT_READY = '애플뮤직은 아직 안 켰어. src/sources/appleMusic.ts 참고.'

export const appleMusicSource: MusicSource = {
  id: 'appleMusic',
  label: '애플뮤직 (미설정)',
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
  setVolume(_v: number) {},}
