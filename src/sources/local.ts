import type { MusicSource, SearchResult } from './types'

/**
 * 로컬 mp3 소스 (A안).
 *
 * public/songs/ 안에 음원 파일을 넣고 manifest.json 에 적어두면 된다.
 * 구독료도, 인터넷도, 광고도 없다. 영상은 애초에 존재하지 않는다.
 */
export interface LocalManifestEntry {
  file: string
  title: string
  tags: string[]
  emoji?: string
  durationSec?: number
}

const MANIFEST_URL = '/songs/manifest.json'

let audio: HTMLAudioElement | null = null
let manifestCache: LocalManifestEntry[] | null = null

function el(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio()
    audio.preload = 'auto'
  }
  return audio
}

export async function loadManifest(force = false): Promise<LocalManifestEntry[]> {
  if (manifestCache && !force) return manifestCache
  try {
    const res = await fetch(MANIFEST_URL, { cache: 'no-cache' })
    if (!res.ok) throw new Error(String(res.status))
    const json = (await res.json()) as LocalManifestEntry[]
    manifestCache = Array.isArray(json) ? json : []
  } catch {
    manifestCache = []
  }
  return manifestCache
}

export const localSource: MusicSource = {
  id: 'local',
  label: '내 음원 (mp3)',
  canSearch: true,

  async isReady() {
    const m = await loadManifest()
    return m.length > 0
  },

  readyHint() {
    return 'public/songs/ 폴더에 mp3 를 넣고 manifest.json 에 적어줘.'
  },

  /** 로컬 검색 = manifest 의 제목/태그에 검색어의 낱말이 들어있는지 보기. */
  async search(query: string): Promise<SearchResult[]> {
    const words = query.split(/\s+/).filter(Boolean)
    const m = await loadManifest()
    return m
      .map((entry) => {
        const hay = [entry.title, ...entry.tags].join(' ')
        const hits = words.filter((w) => hay.includes(w)).length
        return { entry, hits }
      })
      .filter((x) => x.hits > 0)
      // 낱말이 많이 맞을수록 위로
      .sort((a, b) => b.hits - a.hits)
      .map(({ entry }) => ({
        ref: `/songs/${entry.file}`,
        title: entry.title,
        durationSec: entry.durationSec,
      }))
  },

  async play(ref, onEnded) {
    const a = el()
    a.onended = onEnded
    if (a.src.endsWith(ref)) {
      a.currentTime = 0
    } else {
      a.src = ref
    }
    await a.play()
  },

  stop() {
    const a = el()
    a.pause()
    a.onended = null
  },

  setVolume(v) {
    el().volume = Math.max(0, Math.min(1, v))
  },

  currentTimeSec() {
    return audio ? audio.currentTime : 0
  },
}
