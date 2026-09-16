import { useEffect, useState } from 'react'
import { CardIcon } from './icons'

interface Props {
  id: string
  emoji: string
  image?: string
  label: string
  color: string
  onClick: () => void
  /** 재생 화면의 큰 그림처럼, 누를 수 없는 표시용 */
  static?: boolean
}

/**
 * 아이가 누르는 그림 카드.
 *
 * 흰 종이 타일 안에 동그란 색판을 두고 그 안에 그림을 넣는다. 카드마다
 * 배경색을 통째로 칠하면 원색이 여섯 개씩 부딪혀서 촌스러워진다.
 * 색은 동그라미에만 쓰고, 카드는 종이색으로 통일한다.
 *
 * 글씨는 아빠가 알아보라고 넣는 것이고 아이는 그림만 본다.
 * 움직이는 효과는 넣지 않는다 (누를 때 살짝 눌리는 것만).
 */
export function PictureButton({ id, emoji, image, label, color, onClick, static: isStatic }: Props) {
  // 사진을 못 불러오면 깨진 그림 대신 그려둔 아이콘으로 돌아간다.
  const [broken, setBroken] = useState(false)
  useEffect(() => setBroken(false), [image])
  const showImage = image && !broken

  return (
    <button
      className={`pic${isStatic ? ' pic-static' : ''}`}
      onClick={isStatic ? undefined : onClick}
      disabled={isStatic}
    >
      <span className="pic-art" style={{ background: color }}>
        {showImage ? (
          <img src={image} alt="" onError={() => setBroken(true)} />
        ) : (
          <CardIcon cardId={id} emoji={emoji} />
        )}
      </span>
      <span className="pic-label">{label}</span>
    </button>
  )
}
