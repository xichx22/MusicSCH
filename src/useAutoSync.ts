import { useEffect, useRef } from 'react'
import type { DB } from './library/store'
import { applyShared, loadSync, pull, push, saveSync } from './library/sync'

/** 바뀐 뒤 이만큼 기다렸다 올린다. 앨범을 넣으면 한 번에 여러 번 바뀐다. */
const WAIT = 3000

/**
 * 두 기기 자동으로 맞추기.
 *
 * listen 기기(지한이 폰)는 열 때와 화면으로 돌아올 때 받아온다.
 * main 기기(아빠 태블릿)는 카드나 노래가 바뀌면 잠시 뒤 올린다.
 *
 * 파이가 꺼져 있거나 테일스케일이 안 켜져 있으면 조용히 넘어간다.
 * 동기화가 안 된다고 아이가 노래를 못 듣게 되면 안 된다.
 */
export function useAutoSync(db: DB, setDb: (u: (d: DB) => DB) => void): void {
  const latest = useRef(db)
  latest.current = db

  /** 받아온 직후에는 올리지 않는다. 안 그러면 둘이 공을 주고받는다. */
  const justPulled = useRef(false)
  const first = useRef(true)

  // 듣기 전용 기기 — 열 때, 그리고 화면으로 돌아올 때 받아온다.
  useEffect(() => {
    if (loadSync().role !== 'listen') return
    let alive = true

    const get = async () => {
      const cfg = loadSync()
      if (!cfg.url) return
      try {
        const r = await pull(cfg)
        if (!alive || !r.shared) return
        // 서버가 그대로면 건드리지 않는다.
        if (r.version === cfg.version) return
        justPulled.current = true
        setDb((d) => applyShared(d, r.shared!))
        saveSync({ ...loadSync(), version: r.version, at: r.updatedAt })
      } catch {
        /* 파이에 못 닿아도 기기 안 목록으로 그냥 논다 */
      }
    }

    void get()
    const onVisible = () => {
      if (document.visibilityState === 'visible') void get()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      alive = false
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [setDb])

  // 노래를 넣는 기기 — 바뀌면 잠시 뒤 올린다.
  useEffect(() => {
    if (loadSync().role !== 'main') return
    // 앱을 열자마자 올릴 필요는 없다. 진짜로 바뀌었을 때만.
    if (first.current) {
      first.current = false
      return
    }
    if (justPulled.current) {
      justPulled.current = false
      return
    }

    const t = setTimeout(async () => {
      const cfg = loadSync()
      if (!cfg.url) return
      try {
        let r = await push(cfg, latest.current)
        /*
         * 번호가 어긋나면 한 번만 맞춰서 다시 올린다. 노래를 넣는 기기는
         * 하나뿐이라, 어긋나는 건 거의 이 기기가 서버 번호를 잊었을 때다
         * (앱을 지웠다 깔았다든지). 손으로 누르는 [올리기] 는 그대로
         * 물어본다 — 그쪽은 사람이 보고 있으니까.
         */
        if (r.conflict) r = await push({ ...cfg, version: r.version }, latest.current)
        if (!r.conflict) saveSync({ ...loadSync(), version: r.version, at: r.updatedAt })
      } catch {
        /* 다음에 바뀔 때 다시 해본다 */
      }
    }, WAIT)
    return () => clearTimeout(t)
  }, [db.cards, db.songs, db.checks])
}
