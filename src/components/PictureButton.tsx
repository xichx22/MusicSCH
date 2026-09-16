interface Props {
  emoji: string
  image?: string
  label: string
  color: string
  onClick: () => void
  /** 재생 화면의 큰 그림처럼, 누를 수 없는 표시용 */
  static?: boolean
  size?: 'normal' | 'huge'
}

/**
 * 아이가 누르는 그림 버튼.
 * 글씨는 아빠가 알아보라고 작게만 넣는다. 아이는 그림만 본다.
 * 움직이는 효과는 넣지 않는다 (누를 때 살짝 눌리는 것만).
 */
export function PictureButton({ emoji, image, label, color, onClick, static: isStatic, size }: Props) {
  const cls = ['pic', size === 'huge' ? 'pic-huge' : '', isStatic ? 'pic-static' : ''].filter(Boolean).join(' ')
  return (
    <button className={cls} style={{ background: color }} onClick={isStatic ? undefined : onClick} disabled={isStatic}>
      <span className="pic-art">
        {image ? <img src={image} alt="" /> : <span className="pic-emoji">{emoji}</span>}
      </span>
      <span className="pic-label">{label}</span>
    </button>
  )
}
