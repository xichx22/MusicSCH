/**
 * 진단 기록.
 *
 * 지한이에게는 늘 "그 노래는 아직 없어요" 한 장만 보여주지만,
 * 그 뒤에서 무슨 일이 있었는지는 아빠가 알아야 고칠 수 있다.
 * 검색이 정말 0건이었는지, 아니면 오류로 실패한 건지를 여기 남긴다.
 */
const KEY = 'musicsch.diag.v1'
const MAX = 12

export interface DiagEntry {
  at: number
  what: string
  ok: boolean
  detail: string
}

let quiet = false

/** 조합 점검처럼 수십 번 검색하는 동안에는 기록을 멈춘다. */
export function setQuiet(v: boolean): void {
  quiet = v
}

function read(): DiagEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as DiagEntry[]) : []
  } catch {
    return []
  }
}

export function log(what: string, ok: boolean, detail: string): void {
  if (quiet) return
  try {
    const next = [{ at: Date.now(), what, ok, detail }, ...read()].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* 기록에 실패해도 앱은 돌아가야 한다 */
  }
}

export function entries(): DiagEntry[] {
  return read()
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* 무시 */
  }
}
