import type { MusicSource, SearchResult } from './types'
import { matchesAll } from '../library/match'

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

/**
 * 하위 경로에 배포될 수 있어서(GitHub Pages 등) 주소를 직접 쓰지 않고
 * 빌드할 때 정해지는 기준 경로를 붙여서 만든다.
 */
function url(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

/** 저장해둘 때 쓰는 값. 기준 경로가 바뀌어도 깨지지 않게 상대 경로로 둔다. */
export function localRef(file: string): string {
  return `songs/${file}`
}

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
    const res = await fetch(url('songs/manifest.json'), { cache: 'no-cache' })
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

  /**
   * 로컬 검색 = manifest 의 제목/태그에 낱말이 전부 들어 있는지 보기.
   * 하나만 맞아도 통과시키면 엉뚱한 카드에 노래가 딸려 나온다.
   */
  async search(query: string): Promise<SearchResult[]> {
    const words = query.split(/\s+/).filter(Boolean)
    const m = await loadManifest()
    return m
      .filter((entry) => matchesAll([entry.title, ...entry.tags].join(' '), words))
      .map((entry) => ({
        ref: localRef(entry.file),
        title: entry.title,
        durationSec: entry.durationSec,
      }))
  },

  async play(ref, onEnded) {
    const a = el()
    const src = url(ref)
    a.onended = onEnded
    if (a.src.endsWith(src)) {
      a.currentTime = 0
    } else {
      a.src = src
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
}
