import type { MusicSource, SearchResult } from '../types'
import { log } from '../../library/diag'
import { matchesAll } from '../../library/match'
import { api, getClientId, isLoggedIn } from './auth'
import {
  activateForMobile,
  ensureSdkPlayer,
  getMode,
  getPreferredDeviceId,
  listDevices,
  onTrackEnd,
  pauseSdk,
  resetSdkPlayer,
  setLastPlay,
  setPreferredDeviceId,
  setSdkVolume,
  startDevicePolling,
  stopDevicePolling,
  transferTo,
} from './player'

/**
 * 스포티파이 소스.
 *
 * 영상은 없다. 오디오만 나온다.
 * Premium 계정이어야 API 로 재생할 수 있다.
 */

interface SpotifyImage {
  url: string
  width: number | null
}

interface SpotifyArtist {
  name: string
  images: SpotifyImage[]
}

interface SpotifyTrack {
  uri: string
  name: string
  duration_ms: number
  explicit: boolean
  artists: { name: string }[]
  album: { name: string; images: SpotifyImage[] }
}

/** 스포티파이 검색이 허용하는 최대값 (2026년 2월부터 10). */
const SEARCH_LIMIT = 10

/** 카드에 쓸 사진 크기. 너무 크면 느리고 너무 작으면 흐리다. */
const ART_MAX_WIDTH = 400

let volume = 0.7

/** 스포티파이는 큰 것부터 준다. 카드에 알맞은 크기를 고른다. */
function pickImage(images: SpotifyImage[]): string | undefined {
  if (images.length === 0) return undefined
  const fit = images.filter((i) => (i.width ?? 0) <= ART_MAX_WIDTH)
  return (fit[0] ?? images[images.length - 1]).url
}

export interface ArtistArt {
  /** 스포티파이에서 찾은 아티스트 이름. 엉뚱한 걸 물어왔는지 아빠가 확인하라고 준다. */
  name: string
  image?: string
}

/**
 * 캐릭터 카드에 쓸 공식 아티스트 사진을 찾는다.
 *
 * 이모지로는 30개월이 '뽀로로' 를 못 알아본다. 공식 그림을 내려받아
 * 저장소에 넣으면 저작권 문제가 되니, 스포티파이가 API 로 주는 사진을
 * 그대로 쓴다.
 */
export async function findArtistArt(name: string): Promise<ArtistArt | null> {
  const params = new URLSearchParams({
    q: name,
    type: 'artist',
    market: 'KR',
    limit: String(SEARCH_LIMIT),
  })
  const res = await api<{ artists: { items: SpotifyArtist[] } }>(`/search?${params}`)
  const items = res?.artists?.items ?? []

  /*
   * 이름이 맞는 것만 쓴다. 예전에는 아무것도 안 맞으면 첫 결과를 그냥
   * 썼는데, '아기상어' 를 찾다가 뽀로로 사진이 붙었다. 아이 앱에서
   * 엉뚱한 사진은 사진이 없는 것보다 나쁘다. 뽀로로인 줄 알고 눌렀는데
   * 다른 노래가 나오기 때문이다. 못 찾으면 그냥 못 찾았다고 한다.
   */
  const norm = (v: string) => v.trim().toLowerCase().replace(/\s+/g, '')
  const want = norm(name)
  const chosen =
    items.find((a) => norm(a.name) === want) ??
    // '타요' -> '꼬마버스 타요'
    items.find((a) => norm(a.name).includes(want)) ??
    // 'Twinkle Little Studio' -> '동요 Twinkle Little Studio'
    items.find((a) => want.includes(norm(a.name)))

  if (!chosen) return null
  return { name: chosen.name, image: pickImage(chosen.images ?? []) }
}

/** 재생할 기기를 정한다. sdk 모드면 이 브라우저, device 모드면 골라둔 기기. */
async function resolveDeviceId(): Promise<string> {
  if (getMode() === 'sdk') {
    const id = await ensureSdkPlayer()
    await activateForMobile()
    return id
  }
  const preferred = getPreferredDeviceId()
  if (preferred) return preferred
  throw new Error('아빠 화면에서 재생할 기기를 먼저 골라줘')
}

async function startOn(deviceId: string, ref: string): Promise<void> {
  await api(`/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'PUT',
    body: JSON.stringify({ uris: [ref] }),
  })
}

function isDeviceNotFound(e: unknown): boolean {
  return e instanceof Error && e.message.includes('404')
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * 재생할 기기를 되살린다.
 *  1. 그 기기로 재생을 넘겨본다 (등록 직후엔 이걸로 깨어난다)
 *  2. 그래도 목록에 없으면, 켜져 있는 다른 기기로 보낸다
 */
/** 복구 과정에서 이 브라우저를 포기하고 다른 기기로 넘어갔는지. */
let fellBackToDevice: { name: string } | null = null

async function recoverDevice(deviceId: string): Promise<string> {
  fellBackToDevice = null
  try {
    await transferTo(deviceId)
    await wait(600)
    const devices = await listDevices()
    if (devices.some((d) => d.id === deviceId)) {
      log('기기 되살림', true, '재생을 넘겨서 깨웠어')
      return deviceId
    }
  } catch {
    /* 넘기기가 실패하면 다음 수단으로 */
  }

  // 브라우저 스피커가 통째로 죽었으면 한 번 다시 만들어 본다.
  if (getMode() === 'sdk') {
    resetSdkPlayer()
    try {
      const fresh = await ensureSdkPlayer()
      await activateForMobile()
      await transferTo(fresh)
      await wait(600)
      log('브라우저 스피커 다시 만듦', true, fresh.slice(0, 8) + '...')
      return fresh
    } catch {
      /* 이 브라우저로는 소리를 못 낸다. 다른 기기를 찾아본다 */
    }
  }

  const devices = await listDevices()
  const usable = devices.filter((d): d is typeof d & { id: string } => Boolean(d.id) && d.id !== deviceId)
  const chosen = usable.find((d) => d.is_active) ?? usable[0]

  log(
    '다른 기기 찾기',
    Boolean(chosen),
    devices.length
      ? `보이는 기기: ${devices.map((d) => `${d.name}${d.is_active ? '(켜짐)' : ''}`).join(', ')}`
      : '켜져 있는 스포티파이 기기가 하나도 없어',
  )

  if (!chosen) {
    throw new Error(
      '소리 낼 기기가 없어. 폰이나 태블릿에서 스포티파이 앱을 열고 아무 노래나 잠깐 틀었다 멈춘 다음 다시 눌러줘',
    )
  }

  // 다음부터는 이 기기를 먼저 쓴다.
  setPreferredDeviceId(chosen.id)
  fellBackToDevice = { name: chosen.name }
  return chosen.id
}

/** 링크에서 트랙 id 를 뽑는다. open.spotify.com 주소와 spotify:track: 둘 다 받는다. */
export function parseTrackId(input: string): string | null {
  const v = input.trim()
  const uri = v.match(/^spotify:track:([A-Za-z0-9]+)/)
  if (uri) return uri[1]
  const url = v.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?track\/([A-Za-z0-9]+)/)
  if (url) return url[1]
  // 아이디만 붙여넣은 경우
  if (/^[A-Za-z0-9]{22}$/.test(v)) return v
  return null
}

export interface TrackInfo {
  title: string
  image?: string
  durationSec?: number
}

/**
 * 트랙 하나의 정보를 가져온다.
 *
 * 검색 할당량이 떨어져도 이건 다른 바구니라 될 수 있다. 안 되면
 * null 을 주고, 부르는 쪽이 제목 없이도 넣을 수 있게 한다.
 */
export async function getTrack(id: string): Promise<TrackInfo | null> {
  try {
    const t = await api<SpotifyTrack>(`/tracks/${encodeURIComponent(id)}?market=KR`)
    if (!t) return null
    return {
      title: `${t.name} - ${t.artists.map((a) => a.name).join(', ')}`,
      image: pickImage(t.album.images),
      durationSec: Math.round(t.duration_ms / 1000),
    }
  } catch {
    return null
  }
}

export interface TopicArt {
  image: string
  /** 어느 앨범에서 가져왔는지. 아빠가 확인하라고 준다. */
  from: string
}

/**
 * 주제 카드(소방차, 양치, 생일 ...)에 쓸 그림.
 *
 * 그냥 검색해서 나온 첫 곡의 앨범 표지를 쓰면 안 된다. 소방차 노래와 자동차
 * 노래가 같은 '뽀로로 자동차 동요' 앨범에 들어 있으면 두 카드가 똑같아져서
 * 아이가 구별을 못 한다.
 *
 * 그래서 앨범 이름에 그 낱말이 들어 있을 때만 쓴다. 그 앨범이 그 주제에
 * 대한 앨범이라는 뜻이기 때문이다. 아니면 그림 없이 이모지를 그대로 둔다.
 */
export async function findTopicArt(query: string, topicWord: string): Promise<TopicArt | null> {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    market: 'KR',
    limit: String(SEARCH_LIMIT),
  })
  const res = await api<{ tracks: { items: SpotifyTrack[] } }>(`/search?${params}`)
  const items = res?.tracks?.items ?? []

  const match = items.find((t) => t.album.name.includes(topicWord))
  if (!match) return null

  const image = pickImage(match.album.images)
  return image ? { image, from: match.album.name } : null
}

export const spotifySource: MusicSource = {
  id: 'spotify',
  label: '스포티파이',
  canSearch: true,

  async isReady() {
    return Boolean(getClientId()) && isLoggedIn()
  },

  readyHint() {
    if (!getClientId()) return 'Client ID 를 넣고 로그인해줘.'
    if (!isLoggedIn()) return '스포티파이 로그인이 필요해.'
    return getMode() === 'sdk'
      ? '이 브라우저에서 바로 소리가 난다.'
      : '골라둔 스포티파이 기기에서 소리가 난다.'
  },

  async search(query: string): Promise<SearchResult[]> {
    const params = new URLSearchParams({
      q: query,
      type: 'track',
      market: 'KR',
      // 2026년 2월부터 검색 limit 최대값이 50 -> 10 으로 줄었다.
      // 넘기면 400 Invalid limit 이 난다. 어차피 아이에게는 4개까지만 보여준다.
      limit: String(SEARCH_LIMIT),
    })
    const res = await api<{ tracks: { items: SpotifyTrack[] } }>(`/search?${params}`)
    const items = res?.tracks?.items ?? []

    /*
     * 스포티파이 검색은 낱말을 다 만족시키지 않아도 결과를 준다.
     * '타요 견인차' 를 물었더니 송대관 유행가와 MC몽이 나왔다.
     * 그래서 받은 뒤에 우리가 다시 거른다. 제목이든 가수든 앨범이든
     * 어디엔가 낱말이 전부 들어 있어야 한다.
     *
     * 많이 걸러져서 0개가 되는 건 괜찮다. 조합 점검이 그 카드를 감춰준다.
     * 아이에게 엉뚱한 노래를 들려주는 것보다 없는 편이 낫다.
     */
    const words = query.split(/\s+/).filter(Boolean)
    const seen = new Set<string>()
    let offTopic = 0
    let duplicate = 0

    const kept = items.filter((t) => {
      // 아이가 듣는 앱이라 성인 표시된 곡은 아예 뺀다.
      if (t.explicit) return false

      const hay = [t.name, t.album.name, ...t.artists.map((a) => a.name)].join(' ')
      if (!matchesAll(hay, words)) {
        offTopic += 1
        return false
      }

      // 같은 제목이 앨범만 달리해서 여러 번 온다. 아이에게는 같은 카드 두 장이다.
      const key = t.name.trim().toLowerCase().replace(/\s+/g, '')
      if (seen.has(key)) {
        duplicate += 1
        return false
      }
      seen.add(key)
      return true
    })

    log(
      `스포티파이 검색 "${query}"`,
      kept.length > 0,
      `받은 곡 ${items.length}개 → 남은 곡 ${kept.length}개` +
        (offTopic ? ` (낱말 안 맞음 ${offTopic})` : '') +
        (duplicate ? ` (같은 제목 ${duplicate})` : ''),
    )

    return kept
      .map((t) => ({
        ref: t.uri,
        title: `${t.name} - ${t.artists.map((a) => a.name).join(', ')}`,
        durationSec: Math.round(t.duration_ms / 1000),
        // 가장 작은 앨범 이미지면 충분하다.
        thumbnail: pickImage(t.album.images),
      }))
  },

  async play(ref, onEnded) {
    onTrackEnd(onEnded)

    let deviceId = await resolveDeviceId()
    try {
      await startOn(deviceId, ref)
    } catch (e) {
      if (!isDeviceNotFound(e)) throw e
      // 스포티파이가 기기를 못 찾는다. 브라우저를 스피커로 막 등록했을 때,
      // 또는 저장해둔 기기가 꺼졌을 때 그렇다. 깨워보고, 안 되면 다른 기기로 간다.
      deviceId = await recoverDevice(deviceId)
      await startOn(deviceId, ref)
    }

    // 브라우저가 스피커 노릇을 했는지, 다른 기기로 넘어갔는지 남긴다.
    const onBrowser = getMode() === 'sdk' && !fellBackToDevice
    setLastPlay({
      how: onBrowser ? 'browser' : 'device',
      deviceName: fellBackToDevice?.name ?? (onBrowser ? '이 브라우저' : '골라둔 기기'),
      fellBack: getMode() === 'sdk' && fellBackToDevice !== null,
      at: Date.now(),
    })

    if (onBrowser) {
      stopDevicePolling()
      await setSdkVolume(volume)
    } else {
      startDevicePolling()
    }
  },

  stop() {
    onTrackEnd(null)
    stopDevicePolling()
    if (getMode() === 'sdk') {
      void pauseSdk()
      return
    }
    // 리모컨 모드: 이미 멈춰 있으면 오류가 나는데 신경 쓸 필요 없다.
    void api('/me/player/pause', { method: 'PUT' }).catch(() => {})
  },

  setVolume(v) {
    volume = Math.max(0, Math.min(1, v))
    if (getMode() === 'sdk') {
      void setSdkVolume(volume)
      return
    }
    // 어느 기기의 볼륨인지 같이 알려줘야 한다. 안 그러면 엉뚱한 기기가 줄어든다.
    const params = new URLSearchParams({ volume_percent: String(Math.round(volume * 100)) })
    const deviceId = getPreferredDeviceId()
    if (deviceId) params.set('device_id', deviceId)
    void api(`/me/player/volume?${params}`, { method: 'PUT' }).catch(() => {
      // 볼륨 조절을 아예 못 받는 기기가 있다. 그럴 땐 기기 자체 볼륨을 쓰면 된다.
    })
  },
}

export {
  beginLogin,
  completeLoginFromUrl,
  isLoggedIn,
  logout,
  getClientId,
  setClientId,
  redirectUri,
  SpotifyRateLimitError,
} from './auth'
