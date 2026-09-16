import type { Card } from '../types'
import { PictureButton } from '../components/PictureButton'

interface Props {
  cards: Card[]
  chosen?: Card
  onPick: (card: Card) => void
  onBack?: () => void
}

/** 그림 카드 고르는 화면. 캐릭터 고를 때랑 주제 고를 때 똑같이 쓴다. */
export function PickGrid({ cards, chosen, onPick, onBack }: Props) {
  return (
    <div className="screen">
      {chosen && (
        <div className="chosen-strip">
          <PictureButton {...chosen} label={chosen.word} onClick={() => {}} static />
          <span className="plus">＋</span>
          <span className="question">?</span>
        </div>
      )}
      <div className="grid">
        {cards.filter((c) => !c.hidden).map((c) => (
          <PictureButton key={c.id} {...c} label={c.word} onClick={() => onPick(c)} />
        ))}
      </div>
      {onBack && (
        <button className="back" onClick={onBack} aria-label="뒤로">
          ⬅️
        </button>
      )}
    </div>
  )
}
