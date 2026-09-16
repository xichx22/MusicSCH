import { useCallback, useEffect, useRef, useState } from 'react'
import { getSource } from '../sources'
import { log as logDiag } from '../library/diag'

export interface NowPlaying {
  sourceId: string
  ref: string
  title: string
  emoji: string
  image?: string
}

/**
 * 재생 담당.
 * 실제로 소리를 내는 건 음원 소스이고, 여기서는 어느 소스든 똑같이 다룬다.
 * 1초마다 들은 시간을 올려서 하루 제한을 잰다.
 */
export function usePlayer(maxVolume: number, onTick: (sec: number) => void) {
  const [now, setNow] = useState<NowPlaying | null>(null)
  const [error, setError] = useState<string | null>(null)
  const tickRef = useRef(onTick)
  tickRef.current = onTick

  const stop = useCallback(() => {
    if (now) getSource(now.sourceId).stop()
    setNow(null)
  }, [now])

  const play = useCallback(
    async (target: NowPlaying) => {
      setError(null)
      const source = getSource(target.sourceId)
      try {
        source.setVolume(maxVolume)
        await source.play(target.ref, () => setNow(null))
        setNow(target)
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        logDiag(`재생 실패 "${target.title}"`, false, message)
        setNow(null)
        setError(message)
      }
    },
    [maxVolume],
  )

  useEffect(() => {
    if (!now) return
    const id = window.setInterval(() => tickRef.current(1), 1000)
    return () => window.clearInterval(id)
  }, [now])

  useEffect(() => {
    if (now) getSource(now.sourceId).setVolume(maxVolume)
  }, [now, maxVolume])

  return { now, error, play, stop, clearError: () => setError(null) }
}
