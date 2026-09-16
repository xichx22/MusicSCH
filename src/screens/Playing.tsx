import type { NowPlaying } from '../hooks/usePlayer'

/**
 * 재생 화면.
 * 여긴 우리가 만드는 화면이라 영상이 아예 없다. 안 움직이는 그림 한 장뿐이다.
 * 버튼도 '그만' 하나만 크게 둔다.
 */
export function Playing({ now, onStop }: { now: NowPlaying; onStop: () => void }) {
  return (
    <div className="screen playing">
      <div className="playing-art">{now.emoji}</div>
      <p className="playing-title">{now.title}</p>
      <button className="stop" onClick={onStop}>
        <span className="stop-icon">⏹️</span>
        <span className="stop-label">그만</span>
      </button>
    </div>
  )
}
