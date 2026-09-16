import type { MusicSource, SearchResult } from '../types'
import { api, getClientId, isLoggedIn } from './auth'
import {
  activateForMobile,
  ensureSdkPlayer,
  getMode,
  getPreferredDeviceId,
  onTrackEnd,
  pauseSdk,
  setSdkVolume,
  startDevicePolling,
  stopDevicePolling,
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
      limit: '12',
    })
    const res = await api<{ tracks: { items: SpotifyTrack[] } }>(`/search?${params}`)
    const items = res?.tracks?.items ?? []

    return items
      // 아이가 듣는 앱이라 성인 표시된 곡은 아예 뺀다.
      .filter((t) => !t.explicit)
      .map((t) => ({
        ref: t.uri,
        title: `${t.name} - ${t.artists.map((a) => a.name).join(', ')}`,
        durationSec: Math.round(t.duration_ms / 1000),
        // 가장 작은 앨범 이미지면 충분하다.
        thumbnail: t.album.images.at(-1)?.url,
      }))
  },

  async play(ref, onEnded) {
    const deviceId = await resolveDeviceId()

    onTrackEnd(onEnded)
    await api(`/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [ref] }),
    })

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

export { beginLogin, completeLoginFromUrl, isLoggedIn, logout, getClientId, setClientId, redirectUri } from './auth'
