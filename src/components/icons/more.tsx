/*
 * 말로 찾는 아이콘.
 *
 * 알아서 만든 카드는 id 가 't-made-…' 라 id 로는 그림을 못 찾는다.
 * 그래서 카드에 적힌 말로도 찾게 한다. '세차' 카드는 어디서 생겼든
 * 같은 그림을 쓴다.
 *
 * 64 격자, 납작한 면으로만. 다른 아이콘과 같은 색을 쓴다.
 */
import type { ReactElement } from 'react'

const D = '#3A3229'
const W = '#FFFDF8'

const wheels = (xs: number[], y = 48, r = 6) => (
  <>
    {xs.map((x) => (
      <g key={x}>
        <circle cx={x} cy={y} r={r} fill={D} />
        <circle cx={x} cy={y} r={r * 0.4} fill={W} />
      </g>
    ))}
  </>
)

const TRUCK = (
  <>
    <rect x="24" y="20" width="34" height="24" rx="4" fill={W} stroke="#C9D2DD" strokeWidth="2" />
    <path d="M6 26 h14 q4 0 4 4 v14 H6 z" fill="#4A79C4" />
    <rect x="8" y="29" width="11" height="8" rx="3" fill="#BFD4E8" />
    {wheels([15, 34, 50])}
  </>
)

const RACECAR = (
  <>
    <path d="M4 40 h56 v-5 q0 -3 -4 -4 l-10 -2 -8 -7 q-2 -2 -5 -2 H20 q-3 0 -4 3 l-3 8 -6 2 q-3 1 -3 4 z" fill="#D9503F" />
    <path d="M22 24 h10 v6 H19 z" fill={W} />
    <rect x="46" y="22" width="12" height="4" rx="2" fill="#B43F31" />
    {wheels([18, 46], 44, 7)}
  </>
)

const STAR = <path d="M32 8 l7 16 17 1 -13 11 4 17 -15 -9 -15 9 4 -17 -13 -11 17 -1 z" fill="#E8A33D" />

const BEAR = (
  <>
    <circle cx="18" cy="18" r="7" fill="#A97C50" />
    <circle cx="46" cy="18" r="7" fill="#A97C50" />
    <circle cx="32" cy="34" r="20" fill="#C29260" />
    <ellipse cx="32" cy="42" rx="10" ry="8" fill="#EBD6BC" />
    <circle cx="24" cy="30" r="3" fill={D} />
    <circle cx="40" cy="30" r="3" fill={D} />
    <ellipse cx="32" cy="38" rx="4" ry="3" fill={D} />
  </>
)

const RABBIT = (
  <>
    <ellipse cx="23" cy="16" rx="5" ry="12" fill="#EFE2DA" />
    <ellipse cx="41" cy="16" rx="5" ry="12" fill="#EFE2DA" />
    <circle cx="32" cy="40" r="17" fill={W} stroke="#E2D5C0" strokeWidth="2" />
    <circle cx="26" cy="37" r="3" fill={D} />
    <circle cx="38" cy="37" r="3" fill={D} />
    <ellipse cx="32" cy="44" rx="3.5" ry="2.5" fill="#E094A8" />
  </>
)

export const WORD_ICONS: Record<string, ReactElement> = {
  /* ---------- 길 위에서 ---------- */
  트럭: TRUCK,
  화물차: TRUCK,
  불도저: (
    <>
      <path d="M5 46 V25 q0 -4 5 -4 h4 v25 z" fill="#C98130" />
      <path d="M13 34 h9" stroke="#C98130" strokeWidth="5" strokeLinecap="round" />
      <rect x="20" y="21" width="20" height="17" rx="4" fill="#E8A33D" />
      <rect x="24" y="24" width="11" height="9" rx="3" fill={W} />
      <rect x="40" y="27" width="14" height="11" rx="3" fill="#EFB752" />
      <rect x="16" y="40" width="40" height="13" rx="6.5" fill={D} />
      <circle cx="24" cy="46.5" r="3.5" fill={W} />
      <circle cx="48" cy="46.5" r="3.5" fill={W} />
    </>
  ),
  신호등: (
    <>
      <rect x="20" y="6" width="24" height="42" rx="7" fill="#4A4F58" />
      <circle cx="32" cy="17" r="6" fill="#D9503F" />
      <circle cx="32" cy="28" r="6" fill="#E8A33D" />
      <circle cx="32" cy="39" r="6" fill="#3FA680" />
      <rect x="29" y="48" width="6" height="12" rx="2" fill={D} />
    </>
  ),
  세차: (
    <>
      <path d="M10 46 v-7 q0 -3 4 -5 l6 -7 q2 -2 4 -2 h12 q3 0 4 2 l5 7 q5 2 5 5 v7 z" fill="#4A79C4" />
      <path d="M24 28 h7 v6 h-11 z" fill={W} />
      <path d="M35 28 h5 l5 6 h-10 z" fill={W} />
      {wheels([20, 44], 47, 6)}
      <circle cx="14" cy="16" r="4" fill="#9FD3F0" />
      <circle cx="30" cy="10" r="5" fill="#9FD3F0" />
      <circle cx="46" cy="16" r="4" fill="#9FD3F0" />
      <circle cx="54" cy="26" r="3" fill="#9FD3F0" />
    </>
  ),
  구조대: (
    <>
      <path d="M12 38 a20 20 0 0 1 40 0 z" fill="#D9503F" />
      <rect x="8" y="38" width="48" height="8" rx="4" fill="#B43F31" />
      <rect x="28" y="16" width="8" height="18" rx="2" fill={W} />
      <rect x="23" y="21" width="18" height="8" rx="2" fill={W} />
      <path d="M18 52 h28" stroke={D} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  출동: (
    <>
      <rect x="20" y="24" width="24" height="16" rx="6" fill="#D9503F" />
      <rect x="16" y="40" width="32" height="8" rx="3" fill="#4A4F58" />
      <path d="M32 8 v8 M14 14 l6 6 M50 14 l-6 6 M6 30 h8 M50 30 h8" stroke="#E8A33D" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  터널: (
    <>
      <path d="M6 48 V34 a26 26 0 0 1 52 0 v14 z" fill="#8A8F9B" />
      <path d="M18 48 V36 a14 14 0 0 1 28 0 v12 z" fill={D} />
      <rect x="6" y="48" width="52" height="8" rx="2" fill="#6E7683" />
      <path d="M22 52 h8 M34 52 h8" stroke={W} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  주유소: (
    <>
      <rect x="10" y="14" width="26" height="36" rx="5" fill="#D9503F" />
      <rect x="15" y="19" width="16" height="11" rx="3" fill={W} />
      <path d="M36 24 h8 q4 0 4 4 v14 q0 3 3 3 t3 -3 V24 l-5 -6" fill="none" stroke="#8A8F9B" strokeWidth="4" strokeLinecap="round" />
      <rect x="6" y="50" width="34" height="6" rx="3" fill="#B43F31" />
    </>
  ),
  경주용차: RACECAR,
  경주: RACECAR,
  스포츠카: RACECAR,
  출발: (
    <>
      <rect x="14" y="10" width="5" height="46" rx="2" fill={D} />
      <rect x="19" y="12" width="34" height="24" fill={W} stroke={D} strokeWidth="2" />
      <path d="M19 12 h8.5 v8 h-8.5 z M36 12 h8.5 v8 h-8.5 z M27.5 20 h8.5 v8 h-8.5 z M44.5 20 h8.5 v8 h-8.5 z M19 28 h8.5 v8 h-8.5 z M36 28 h8.5 v8 h-8.5 z" fill={D} />
    </>
  ),
  택시: (
    <>
      <path d="M8 44 v-8 q0 -4 5 -6 l7 -8 q2 -2 5 -2 h14 q3 0 5 3 l6 7 q6 2 6 6 v8 z" fill="#EFB752" />
      <path d="M24 24 h8 v8 h-13 z" fill={W} />
      <path d="M36 24 h6 l6 8 h-12 z" fill={W} />
      <rect x="26" y="12" width="14" height="7" rx="2" fill={D} />
      {wheels([19, 45], 46, 7)}
    </>
  ),
  지하철: (
    <>
      <path d="M14 10 h36 q6 0 6 6 v30 q0 6 -6 6 H14 q-6 0 -6 -6 V16 q0 -6 6 -6 z" fill="#3FA680" />
      <rect x="15" y="17" width="34" height="14" rx="4" fill={W} />
      <circle cx="19" cy="40" r="4" fill="#FBE0A0" />
      <circle cx="45" cy="40" r="4" fill="#FBE0A0" />
      <path d="M14 56 h10 M40 56 h10" stroke={D} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  오토바이: (
    <>
      <circle cx="15" cy="44" r="11" fill={D} />
      <circle cx="49" cy="44" r="11" fill={D} />
      <circle cx="15" cy="44" r="4" fill={W} />
      <circle cx="49" cy="44" r="4" fill={W} />
      <path d="M15 44 l12 -12 h14 l8 12" fill="none" stroke="#D9503F" strokeWidth="5" strokeLinecap="round" />
      <path d="M24 30 h12 l4 -6" fill="none" stroke={D} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  자전거: (
    <>
      <circle cx="16" cy="42" r="13" fill="none" stroke={D} strokeWidth="4" />
      <circle cx="48" cy="42" r="13" fill="none" stroke={D} strokeWidth="4" />
      <path d="M16 42 l10 -16 h12 l10 16 M26 26 h16" fill="none" stroke="#4A79C4" strokeWidth="4" strokeLinecap="round" />
      <path d="M38 26 l4 -8 h6" fill="none" stroke={D} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  사다리차: (
    <>
      <rect x="6" y="30" width="24" height="16" rx="5" fill="#D9503F" />
      <rect x="10" y="33" width="11" height="9" rx="3" fill={W} />
      <g transform="rotate(-28 34 30)">
        <rect x="26" y="26" width="34" height="8" rx="3" fill="#B7BCC6" />
        <path d="M33 26 v8 M41 26 v8 M49 26 v8" stroke={W} strokeWidth="2" />
      </g>
      {wheels([14, 30], 50, 5)}
    </>
  ),
  운전: (
    <>
      <circle cx="32" cy="32" r="22" fill="none" stroke={D} strokeWidth="6" />
      <circle cx="32" cy="32" r="7" fill="#D9503F" />
      <path d="M32 25 V12 M27 34 L14 44 M37 34 L50 44" stroke={D} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  /* ---------- 동물 ---------- */
  공룡: (
    <>
      <path d="M13 40 q-9 3 -9 -7" fill="none" stroke="#6AA84F" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="29" cy="38" rx="18" ry="11" fill="#6AA84F" />
      <path d="M38 34 q3 -16 12 -16 v10 q-5 1 -6 7 z" fill="#6AA84F" />
      <circle cx="50" cy="19" r="8" fill="#7CBB5C" />
      <circle cx="53" cy="17" r="2.4" fill={D} />
      <rect x="19" y="45" width="8" height="11" rx="4" fill="#5A9142" />
      <rect x="33" y="45" width="8" height="11" rx="4" fill="#5A9142" />
    </>
  ),
  아기상어: (
    <>
      <path d="M6 36 q14 -14 30 -12 q12 2 16 12 q-4 10 -16 12 q-16 2 -30 -12 z" fill="#57A8E0" />
      <path d="M28 22 l4 -12 8 12 z" fill="#4A79C4" />
      <path d="M6 36 l-4 -9 v18 z" fill="#4A79C4" />
      <circle cx="44" cy="33" r="2.8" fill={D} />
      <path d="M34 42 q6 3 12 1" stroke={W} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  코끼리: (
    <>
      <circle cx="34" cy="30" r="18" fill="#9AA3B0" />
      <ellipse cx="14" cy="28" rx="9" ry="12" fill="#8A94A2" />
      <path d="M34 44 q0 12 -8 14 q-6 2 -6 -4" fill="none" stroke="#9AA3B0" strokeWidth="8" strokeLinecap="round" />
      <circle cx="30" cy="26" r="2.8" fill={D} />
      <circle cx="43" cy="26" r="2.8" fill={D} />
    </>
  ),
  토끼: RABBIT,
  산토끼: RABBIT,
  나비: (
    <>
      <ellipse cx="18" cy="22" rx="13" ry="11" fill="#E8A33D" transform="rotate(-20 18 22)" />
      <ellipse cx="46" cy="22" rx="13" ry="11" fill="#E8A33D" transform="rotate(20 46 22)" />
      <ellipse cx="20" cy="42" rx="11" ry="9" fill="#D9503F" transform="rotate(20 20 42)" />
      <ellipse cx="44" cy="42" rx="11" ry="9" fill="#D9503F" transform="rotate(-20 44 42)" />
      <rect x="29" y="18" width="6" height="30" rx="3" fill={D} />
      <path d="M31 18 l-6 -8 M33 18 l6 -8" stroke={D} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  개구리: (
    <>
      <circle cx="19" cy="18" r="9" fill="#6AA84F" />
      <circle cx="45" cy="18" r="9" fill="#6AA84F" />
      <circle cx="19" cy="18" r="4" fill={W} />
      <circle cx="45" cy="18" r="4" fill={W} />
      <circle cx="19" cy="19" r="2" fill={D} />
      <circle cx="45" cy="19" r="2" fill={D} />
      <ellipse cx="32" cy="38" rx="21" ry="17" fill="#7CBB5C" />
      <path d="M22 42 q10 8 20 0" stroke={D} strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  곰: BEAR,
  곰세마리: BEAR,
  동물: (
    <>
      <circle cx="32" cy="40" r="14" fill="#C29260" />
      <circle cx="15" cy="26" r="7" fill="#C29260" />
      <circle cx="27" cy="16" r="7" fill="#C29260" />
      <circle cx="41" cy="16" r="7" fill="#C29260" />
      <circle cx="52" cy="26" r="7" fill="#C29260" />
    </>
  ),
  곤충: (
    <>
      <circle cx="32" cy="22" r="9" fill={D} />
      <ellipse cx="32" cy="40" rx="19" ry="17" fill="#D9503F" />
      <rect x="30" y="23" width="4" height="34" fill={D} />
      <circle cx="21" cy="36" r="3.5" fill={D} />
      <circle cx="43" cy="36" r="3.5" fill={D} />
      <circle cx="24" cy="47" r="3" fill={D} />
      <circle cx="40" cy="47" r="3" fill={D} />
    </>
  ),

  /* ---------- 하늘 · 바다 ---------- */
  로켓: (
    <>
      <path d="M32 4 q12 12 12 28 v10 H20 V32 Q20 16 32 4 z" fill={W} stroke="#C9D2DD" strokeWidth="2" />
      <circle cx="32" cy="26" r="6" fill="#57A8E0" />
      <path d="M20 34 l-10 12 h10 z M44 34 l10 12 H44 z" fill="#D9503F" />
      <path d="M26 42 h12 l-6 16 z" fill="#E8A33D" />
    </>
  ),
  우주: (
    <>
      <circle cx="30" cy="32" r="16" fill="#7C6CD8" />
      <ellipse cx="30" cy="32" rx="28" ry="8" fill="none" stroke="#E8A33D" strokeWidth="4" transform="rotate(-20 30 32)" />
      <circle cx="24" cy="26" r="4" fill="#9A8DE8" />
      <circle cx="37" cy="38" r="3" fill="#9A8DE8" />
      <circle cx="54" cy="12" r="3" fill="#E8A33D" />
    </>
  ),
  바다: (
    <>
      <path d="M4 16 q7 -6 13 0 t13 0 t13 0 t13 0" fill="none" stroke="#57A8E0" strokeWidth="5" strokeLinecap="round" />
      <path d="M4 28 q7 -6 13 0 t13 0 t13 0 t13 0" fill="none" stroke="#9FD3F0" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 46 q11 -13 25 -6 q6 3 8 6 q-2 3 -8 6 q-14 7 -25 -6 z" fill="#E8A33D" />
      <path d="M45 46 l11 -8 v16 z" fill="#E8A33D" />
      <circle cx="23" cy="44" r="2.6" fill={D} />
    </>
  ),
  별: STAR,
  작은별: STAR,
  무지개: (
    <>
      <path d="M6 48 A26 26 0 0 1 58 48" fill="none" stroke="#D9503F" strokeWidth="6" />
      <path d="M12 48 A20 20 0 0 1 52 48" fill="none" stroke="#E8A33D" strokeWidth="6" />
      <path d="M18 48 A14 14 0 0 1 46 48" fill="none" stroke="#3FA680" strokeWidth="6" />
      <path d="M24 48 A8 8 0 0 1 40 48" fill="none" stroke="#4A79C4" strokeWidth="6" />
      <circle cx="10" cy="52" r="6" fill={W} />
      <circle cx="54" cy="52" r="6" fill={W} />
    </>
  ),
  크리스마스: (
    <>
      <path d="M32 6 l13 16 h-7 l11 14 h-8 l10 14 H13 l10 -14 h-8 l11 -14 h-7 z" fill="#3FA680" />
      <rect x="28" y="50" width="8" height="8" rx="2" fill="#8A7256" />
      <circle cx="24" cy="36" r="3" fill="#D9503F" />
      <circle cx="40" cy="44" r="3" fill="#E8A33D" />
      <circle cx="32" cy="28" r="3" fill="#D9503F" />
    </>
  ),

  /* ---------- 배우기 ---------- */
  숫자: (
    <text x="32" y="45" textAnchor="middle" fontSize="34" fontWeight="800" letterSpacing="1">
      <tspan fill="#D9503F">1</tspan>
      <tspan fill="#E8A33D">2</tspan>
      <tspan fill="#4A79C4">3</tspan>
    </text>
  ),
  색깔: (
    <>
      <path d="M32 8 a24 24 0 1 0 0 48 q-6 0 -6 -5 t5 -6 q9 0 9 -7 t8 -7 h4 a10 10 0 0 0 4 -8 A24 24 0 0 0 32 8 z" fill={W} stroke="#C9D2DD" strokeWidth="2" />
      <circle cx="22" cy="20" r="4.5" fill="#D9503F" />
      <circle cx="15" cy="32" r="4.5" fill="#E8A33D" />
      <circle cx="20" cy="44" r="4.5" fill="#4A79C4" />
      <circle cx="38" cy="17" r="4.5" fill="#3FA680" />
    </>
  ),
  과일: (
    <>
      <path d="M32 18 q-14 -6 -20 6 q-6 14 8 30 q8 8 12 0 q4 8 12 0 q14 -16 8 -30 q-6 -12 -20 -6 z" fill="#D9503F" />
      <path d="M32 18 V8" stroke="#8A7256" strokeWidth="4" strokeLinecap="round" />
      <path d="M33 12 q10 -8 14 -2 q-8 6 -14 2 z" fill="#3FA680" />
    </>
  ),
  직업: (
    <>
      <path d="M10 42 a22 22 0 0 1 44 0 z" fill="#E8A33D" />
      <rect x="28" y="16" width="8" height="26" fill="#C98130" />
      <rect x="6" y="42" width="52" height="9" rx="4" fill="#EFB752" />
    </>
  ),
  친구: (
    <>
      <circle cx="21" cy="20" r="9" fill="#E8A33D" />
      <circle cx="44" cy="20" r="9" fill="#57A8E0" />
      <path d="M6 54 v-8 a15 15 0 0 1 30 0 v8 z" fill="#E8A33D" />
      <path d="M30 54 v-8 a15 15 0 0 1 30 0 v8 z" fill="#57A8E0" />
    </>
  ),
}

// '상어' 는 '아기상어' 와 같은 그림을 쓴다.
WORD_ICONS['상어'] = WORD_ICONS['아기상어']
