import { api, getAccessToken } from './auth'

/**
 * 재생 방식 두 가지.
 *  sdk    : 이 브라우저 자체를 스피커로 쓴다 (Web Playback SDK)
 *  device : 태블릿에 깔린 스포티파이 앱이나 스피커를 리모컨처럼 조종한다
 */
export type PlaybackMode = 'sdk' | 'device'

const LS_MODE = 'musicsch.spotify.mode'
const LS_DEVICE = 'musicsch.spotify.deviceId'
const SDK_SRC = 'https://sdk.scdn.co/spotify-player.js'

export interface SpotifyDevice {
  id: string
  name: string
  type: string
  is_active: boolean
}

export function getMode(): PlaybackMode {
  return (localStorage.getItem(LS_MODE) as PlaybackMode) ?? 'sdk'
}

export function setMode(mode: PlaybackMode): void {
  localStorage.setItem(LS_MODE, mode)
}

export function getPreferredDeviceId(): string {
  return localStorage.getItem(LS_DEVICE) ?? ''
}

export function setPreferredDeviceId(id: string): void {
  localStorage.setItem(LS_DEVICE, id)
}

export async function listDevices(): Promise<SpotifyDevice[]> {
  const res = await api<{ devices: SpotifyDevice[] }>('/me/player/devices')
  return res?.devices ?? []
}

/* ---------- Web Playback SDK ---------- */

// SDK 는 전역에 Spotify 를 심는다. 타입 정의가 따로 없어서 필요한 만큼만 적는다.
interface SdkPlayerState {
  paused: boolean
  position: number
  track_window?: { current_track?: { id: string | null } }
}

interface SdkPlayer {
  connect(): Promise<boolean>
  disconnect(): void
  pause(): Promise<void>
  setVolume(v: number): Promise<void>
  activateElement(): Promise<void>
  addListener(event: string, cb: (payload: never) => void): boolean
}

declare global {
  interface Window {
    Spotify?: { Player: new (opts: Record<string, unknown>) => SdkPlayer }
    onSpotifyWebPlaybackSDKReady?: () => void
  }
}

let sdkScript: Promise<void> | null = null
let player: SdkPlayer | null = null
let deviceIdPromise: Promise<string> | null = null
let activated = false
let endCallback: (() => void) | null = null
let lastState: { paused: boolean; trackId: string | null } | null = null

/** 곡이 끝났을 때 부를 함수를 등록한다. */
export function onTrackEnd(cb: (() => void) | null): void {
  endCallback = cb
}

function loadSdkScript(): Promise<void> {
  if (sdkScript) return sdkScript
  sdkScript = new Promise<void>((resolve, reject) => {
    if (window.Spotify) return resolve()
    window.onSpotifyWebPlaybackSDKReady = () => resolve()
    const tag = document.createElement('script')
    tag.src = SDK_SRC
    tag.async = true
    tag.onerror = () => reject(new Error('스포티파이 플레이어를 불러오지 못했어'))
    document.head.appendChild(tag)
  })
  return sdkScript
}

/** SDK 플레이어를 띄우고 device_id 를 받는다. 한 번만 만든다. */
export function ensureSdkPlayer(): Promise<string> {
  if (deviceIdPromise) return deviceIdPromise

  deviceIdPromise = (async () => {
    await loadSdkScript()
    if (!window.Spotify) throw new Error('스포티파이 플레이어를 불러오지 못했어')

    return await new Promise<string>((resolve, reject) => {
      const p = new window.Spotify!.Player({
        name: '지한이 노래',
        getOAuthToken: (cb: (t: string) => void) => {
          void getAccessToken().then((t) => t && cb(t))
        },
        volume: 0.5,
      })
      player = p

      p.addListener('ready', (({ device_id }: { device_id: string }) => resolve(device_id)) as never)
      p.addListener('initialization_error', (({ message }: { message: string }) => reject(new Error(message))) as never)
      p.addListener('authentication_error', (({ message }: { message: string }) => reject(new Error(message))) as never)
      p.addListener('account_error', (() => reject(new Error('Premium 계정이 아니야'))) as never)

      // 곡이 끝났는지 알아내기: 재생 중이었는데 멈췄고 처음으로 되돌아갔으면 끝난 것이다.
      p.addListener('player_state_changed', ((state: SdkPlayerState | null) => {
        if (!state) return
        const trackId = state.track_window?.current_track?.id ?? null
        const ended =
          lastState !== null &&
          lastState.trackId === trackId &&
          !lastState.paused &&
          state.paused &&
          state.position === 0
        lastState = { paused: state.paused, trackId }
        if (ended) endCallback?.()
      }) as never)

      void p.connect()
      window.setTimeout(() => reject(new Error('스포티파이 플레이어가 응답이 없어')), 15_000)
    })
  })()

  // 실패하면 다음에 다시 시도할 수 있게 캐시를 비운다.
  deviceIdPromise.catch(() => {
    deviceIdPromise = null
    player = null
  })

  return deviceIdPromise
}

/**
 * 모바일 브라우저는 소리를 내려면 사용자가 화면을 만진 그 순간에 한 번 깨워줘야 한다.
 * 지한이가 카드를 누른 바로 그 타이밍에 부른다.
 */
export async function activateForMobile(): Promise<void> {
  if (activated || !player) return
  try {
    await player.activateElement()
    activated = true
  } catch {
    // 데스크톱에서는 필요 없어서 실패해도 그냥 넘어간다.
  }
}

export async function setSdkVolume(v: number): Promise<void> {
  try {
    await player?.setVolume(v)
  } catch {
    /* 볼륨 조절을 못 받는 기기도 있다 */
  }
}

export async function pauseSdk(): Promise<void> {
  try {
    await player?.pause()
  } catch {
    /* 이미 멈춰 있으면 무시 */
  }
}

/* ---------- 리모컨 모드에서 곡 끝났는지 보기 ---------- */

let pollTimer: number | null = null

/** device 모드에서는 상태를 물어봐서 곡이 끝났는지 확인한다. */
export function startDevicePolling(): void {
  stopDevicePolling()
  let wasPlaying = false
  pollTimer = window.setInterval(() => {
    void api<{ is_playing: boolean; progress_ms: number } | null>('/me/player')
      .then((state) => {
        if (!state) return
        if (wasPlaying && !state.is_playing) {
          wasPlaying = false
          endCallback?.()
        } else if (state.is_playing) {
          wasPlaying = true
        }
      })
      .catch(() => {
        /* 잠깐 실패해도 다음 번에 다시 본다 */
      })
  }, 3000)
}

export function stopDevicePolling(): void {
  if (pollTimer !== null) window.clearInterval(pollTimer)
  pollTimer = null
}
