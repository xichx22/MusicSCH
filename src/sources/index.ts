import type { MusicSource } from './types'
import { localSource } from './local'
import { spotifySource } from './spotify'
import { appleMusicSource } from './appleMusic'

/**
 * 쓸 수 있는 음원 소스 목록.
 * 나중에 소스를 정하면 여기에 등록만 하면 된다. 나머지 화면은 안 고쳐도 된다.
 */
export const SOURCES: MusicSource[] = [localSource, spotifySource, appleMusicSource]

export function getSource(id: string): MusicSource {
  return SOURCES.find((s) => s.id === id) ?? localSource
}

export type { MusicSource, SearchResult } from './types'
