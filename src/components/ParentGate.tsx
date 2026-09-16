import { useRef, useState } from 'react'

/**
 * 아빠 화면 들어가는 문.
 * 오른쪽 아래 작은 점을 2.5초 꾹 눌러야 숫자판이 뜬다.
 * 지한이가 실수로 누를 일은 없다.
 */
export function ParentGate({ pin, onOpen }: { pin: string; onOpen: () => void }) {
  const [asking, setAsking] = useState(false)
  const [typed, setTyped] = useState('')
  const timer = useRef<number | null>(null)

  const start = () => {
    timer.current = window.setTimeout(() => setAsking(true), 2500)
  }
  const cancel = () => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = null
  }

  const push = (n: string) => {
    const next = typed + n
    if (next.length >= pin.length) {
      setTyped('')
      setAsking(false)
      if (next === pin) onOpen()
      return
    }
    setTyped(next)
  }

  if (!asking) {
    return (
      <button
        className="gate-dot"
        aria-label="아빠 화면"
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
      />
    )
  }

  return (
    <div className="gate-overlay" onClick={() => { setAsking(false); setTyped('') }}>
      <div className="gate-pad" onClick={(e) => e.stopPropagation()}>
        <p>아빠 화면 · 비밀번호 {'●'.repeat(typed.length).padEnd(pin.length, '○')}</p>
        <div className="gate-keys">
          {['1','2','3','4','5','6','7','8','9','','0',''].map((n, i) =>
            n ? <button key={i} onClick={() => push(n)}>{n}</button> : <span key={i} />,
          )}
        </div>
      </div>
    </div>
  )
}
