/*
 * 화살표 같은 건 이모지로 쓰면 기기마다 제각각이고(삼성에서는 파란 네모로
 * 나온다) 크기 조절도 안 된다. 직접 그려서 쓴다.
 */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/**
 * '뒤로' 는 사실 언제나 첫 화면(캐릭터 고르는 곳)으로 가는 버튼이다.
 * 왼쪽 화살표로 그리면 페이지 넘김의 '이전' 버튼과 똑같이 생겨서 헷갈린다.
 * 집 모양이면 아이도 한눈에 구별한다.
 */
export function HomeIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d={'M11 30 L32 12 L53 30'} {...stroke} />
      <path d={'M17 28 V50 H47 V28'} {...stroke} />
      <path d={'M26 50 V38 H38 V50'} {...stroke} />
    </svg>
  )
}

export function PrevIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d={'M38 16 L22 32 L38 48'} {...stroke} />
    </svg>
  )
}

export function NextIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d={'M26 16 L42 32 L26 48'} {...stroke} />
    </svg>
  )
}

export function StopIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="18" y="18" width="28" height="28" rx="7" fill="currentColor" />
    </svg>
  )
}
