/** 노래가 없거나 시간이 다 됐을 때 보여주는 한 장짜리 화면. */
export function Message({
  emoji,
  text,
  onBack,
}: {
  emoji: string
  text: string
  onBack?: () => void
}) {
  return (
    <div className="screen message">
      <div className="message-art">{emoji}</div>
      <p className="message-text">{text}</p>
      {onBack && (
        <button className="back back-inline" onClick={onBack} aria-label="뒤로">
          ⬅️
        </button>
      )}
    </div>
  )
}
