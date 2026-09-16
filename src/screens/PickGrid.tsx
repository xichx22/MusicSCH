import { useState } from 'react'
import type { Card } from '../types'
import { PictureButton } from '../components/PictureButton'
import { HomeIcon, NextIcon, PrevIcon } from '../components/Icon'

/**
 * 한 화면에 보여줄 카드 수.
 * 주제는 6개가 한계지만, 첫 화면의 캐릭터는 늘 같은 자리에 다 보이는 편이
 * 아이가 외우기 좋다. 그래서 캐릭터 화면은 더 크게 잡아서 넘기지 않게 한다.
 */
const DEFAULT_PAGE_SIZE = 6

interface Props {
  cards: Card[]
  chosen?: Card
  onPick: (card: Card) => void
  onBack?: () => void
  pageSize?: number
}

/**
 * 그림 카드 고르는 화면. 캐릭터 고를 때랑 주제 고를 때 똑같이 쓴다.
 * 카드가 6개를 넘으면 스크롤 대신 페이지를 넘긴다.
 * 아이가 스크롤하다 잘린 카드를 누르는 것보다 큰 화살표 하나가 낫다.
 */
export function PickGrid({ cards, chosen, onPick, onBack, pageSize = DEFAULT_PAGE_SIZE }: Props) {
  const [page, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(cards.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const shown = cards.slice(safePage * pageSize, safePage * pageSize + pageSize)

  return (
    <div className="screen">
      {chosen && (
        <div className="chosen-strip">
          <PictureButton {...chosen} label={chosen.label ?? chosen.word} onClick={() => {}} static />
          <span className="plus">＋</span>
          <span className="question">?</span>
        </div>
      )}

      <div className="grid">
        {shown.map((c) => (
          <PictureButton key={c.id} {...c} label={c.label ?? c.word} onClick={() => onPick(c)} />
        ))}
      </div>

      <div className="bottom-row">
        {onBack && (
          <button className="back" onClick={onBack} aria-label="뒤로">
            <HomeIcon />
          </button>
        )}
        {pageCount > 1 && (
          <div className="pager">
            <button
              className="page-btn"
              onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
              aria-label="이전"
            >
              <PrevIcon />
            </button>
            <span className="page-dots">
              {Array.from({ length: pageCount }, (_, i) => (
                <span key={i} className={i === safePage ? 'dot on' : 'dot'} />
              ))}
            </span>
            <button
              className="page-btn"
              onClick={() => setPage((p) => (p + 1) % pageCount)}
              aria-label="더 보기"
            >
              <NextIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
