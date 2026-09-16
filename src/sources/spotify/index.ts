import type { MusicSource, SearchResult } from '../types'
import { log } from '../../library/diag'
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

interface SpotifyTrack {
  uri: string
  name: string
  duration_ms: number
  explicit: boolean
  artists: { name: string }[]
  album: { images: { url: string; width: number }[] }
}

/** 스포티파이 검색이 허용하는 최대값 (2026년 2월부터 10). */
const SEARCH_LIMIT = 10

let volume = 0.7

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
async function recoverDevice(deviceId: string): Promise<string> {
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
  return chosen.id
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

    // 아이가 듣는 앱이라 성인 표시된 곡은 아예 뺀다.
    const kept = items.filter((t) => !t.explicit)
    log(
      `스포티파이 검색 "${query}"`,
      kept.length > 0,
      `받은 곡 ${items.length}개, 성인곡 제외 후 ${kept.length}개`,
    )

    return kept
      .map((t) => ({
        ref: t.uri,
        title: `${t.name} - ${t.artists.map((a) => a.name).join(', ')}`,
        durationSec: Math.round(t.duration_ms / 1000),
        // 가장 작은 앨범 이미지면 충분하다.
        thumbnail: t.album.images.at(-1)?.url,
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

    if (getMode() === 'sdk') {
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
