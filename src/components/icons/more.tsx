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
  원숭이: (
    <>
      <circle cx="13" cy="28" r="8" fill="#A97C50" />
      <circle cx="51" cy="28" r="8" fill="#A97C50" />
      <circle cx="13" cy="28" r="4" fill="#EBC8B0" />
      <circle cx="51" cy="28" r="4" fill="#EBC8B0" />
      <circle cx="32" cy="32" r="19" fill="#A97C50" />
      <ellipse cx="32" cy="38" rx="14" ry="12" fill="#EBC8B0" />
      <circle cx="26" cy="29" r="3" fill={D} />
      <circle cx="38" cy="29" r="3" fill={D} />
      <circle cx="29" cy="37" r="1.8" fill={D} />
      <circle cx="35" cy="37" r="1.8" fill={D} />
      <path d="M26 43 q6 5 12 0" fill="none" stroke={D} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  펭귄: (
    <>
      <ellipse cx="32" cy="34" rx="18" ry="22" fill={D} />
      <ellipse cx="32" cy="38" rx="12" ry="17" fill={W} />
      <ellipse cx="11" cy="34" rx="5" ry="12" fill={D} transform="rotate(12 11 34)" />
      <ellipse cx="53" cy="34" rx="5" ry="12" fill={D} transform="rotate(-12 53 34)" />
      <circle cx="26" cy="24" r="3" fill={W} />
      <circle cx="38" cy="24" r="3" fill={W} />
      <circle cx="26" cy="24" r="1.6" fill={D} />
      <circle cx="38" cy="24" r="1.6" fill={D} />
      <path d="M28 30 h8 l-4 5 z" fill="#E8A33D" />
      <path d="M22 56 h10 l-4 4 h-10 z M42 56 h-10 l4 4 h10 z" fill="#E8A33D" />
    </>
  ),
  놀이: (
    <>
      <path d="M32 6 l24 14 v4 H8 v-4 z" fill="#D9503F" />
      <rect x="10" y="24" width="44" height="6" rx="3" fill="#E8A33D" />
      <path d="M18 30 v20 M32 30 v20 M46 30 v20" stroke="#8A7256" strokeWidth="4" strokeLinecap="round" />
      <circle cx="18" cy="42" r="6" fill="#4A79C4" />
      <circle cx="32" cy="46" r="6" fill="#3FA680" />
      <circle cx="46" cy="42" r="6" fill="#7C6CD8" />
      <rect x="8" y="52" width="48" height="6" rx="3" fill="#E8A33D" />
    </>
  ),
  안전: (
    <>
      <path d="M32 6 l22 8 v16 q0 16 -22 28 Q10 46 10 30 V14 z" fill="#3FA680" />
      <path d="M22 32 l7 8 14 -16" fill="none" stroke={W} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  감정: (
    <>
      <circle cx="20" cy="22" r="14" fill="#EFB752" />
      <circle cx="15" cy="18" r="2.4" fill={D} />
      <circle cx="25" cy="18" r="2.4" fill={D} />
      <path d="M13 26 q7 7 14 0" fill="none" stroke={D} strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="42" r="14" fill="#7FB5E8" />
      <circle cx="39" cy="38" r="2.4" fill={D} />
      <circle cx="49" cy="38" r="2.4" fill={D} />
      <path d="M37 50 q7 -7 14 0" fill="none" stroke={D} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  할로윈: (
    <>
      <path d="M32 16 q-22 0 -22 20 t22 22 q22 -2 22 -22 t-22 -20 z" fill="#E8A33D" />
      <path d="M30 16 q0 -8 8 -10 q-4 6 0 10 z" fill="#6AA84F" />
      <path d="M20 32 l8 -4 v8 z" fill={D} />
      <path d="M44 32 l-8 -4 v8 z" fill={D} />
      <path d="M20 44 h6 l3 4 4 -4 4 4 3 -4 h6 q-6 8 -13 8 t-13 -8 z" fill={D} />
    </>
  ),
  // 어린이날 하면 바람개비다.
  어린이날: (
    <>
      <rect x="30" y="26" width="5" height="32" rx="2" fill="#8A7256" />
      <path d="M32 26 V6 q13 0 13 13 z" fill="#D9503F" />
      <path d="M32 26 H52 q0 13 -13 13 z" fill="#E8A33D" />
      <path d="M32 26 v20 q-13 0 -13 -13 z" fill="#4A79C4" />
      <path d="M32 26 H12 q0 -13 13 -13 z" fill="#3FA680" />
      <circle cx="32" cy="26" r="4" fill={W} />
    </>
  ),
  숲: (
    <>
      <path d="M18 8 l11 18 h-6 l9 14 H8 l9 -14 h-6 z" fill="#3FA680" transform="translate(-2 0)" />
      <rect x="14" y="40" width="5" height="14" rx="2" fill="#8A7256" />
      <path d="M44 14 l12 20 h-7 l10 14 H29 l10 -14 h-7 z" fill="#4FBE8E" transform="translate(-2 0)" />
      <rect x="41" y="48" width="6" height="10" rx="2" fill="#8A7256" />
      <path d="M4 58 h56" stroke="#6AA84F" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  비: (
    <>
      <path d="M18 30 a12 12 0 0 1 24 -4 a10 10 0 0 1 2 20 H18 a8 8 0 0 1 0 -16 z" fill="#B7BCC6" />
      <path d="M18 50 l-3 8 M30 50 l-3 8 M42 50 l-3 8" stroke="#57A8E0" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  도레미: (
    <>
      <rect x="6" y="18" width="52" height="30" rx="4" fill={W} stroke="#C9D2DD" strokeWidth="2" />
      <path d="M6 26 h52 M6 33 h52 M6 40 h52" stroke="#C9D2DD" strokeWidth="2" />
      <circle cx="20" cy="40" r="5" fill="#D9503F" />
      <circle cx="34" cy="33" r="5" fill="#E8A33D" />
      <circle cx="48" cy="26" r="5" fill="#4A79C4" />
      <path d="M25 40 V22 M39 33 V15 M53 26 V8" stroke={D} strokeWidth="3" />
    </>
  ),
  슈퍼영웅: (
    <>
      <path d="M32 8 l20 8 v14 q0 16 -20 26 Q12 46 12 30 V16 z" fill="#4A79C4" />
      <path d="M32 18 l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1 z" fill="#EFB752" />
    </>
  ),
  머핀: (
    <>
      <path d="M14 30 h36 l-5 24 q-1 4 -5 4 H24 q-4 0 -5 -4 z" fill="#C98130" />
      <path d="M22 34 v20 M32 34 v20 M42 34 v20" stroke="#A96D26" strokeWidth="3" />
      <path d="M10 30 q2 -14 14 -14 q4 -8 12 -6 q10 0 10 10 q8 2 8 10 z" fill="#EBC8B0" />
      <circle cx="24" cy="24" r="2.6" fill="#D9503F" />
      <circle cx="38" cy="22" r="2.6" fill="#3FA680" />
      <circle cx="31" cy="28" r="2.6" fill="#4A79C4" />
    </>
  ),
  도깨비: (
    <>
      <path d="M14 20 q-4 -10 4 -12 q4 6 4 10 z" fill="#C98130" />
      <path d="M50 20 q4 -10 -4 -12 q-4 6 -4 10 z" fill="#C98130" />
      <circle cx="32" cy="34" r="20" fill="#D9503F" />
      <circle cx="24" cy="30" r="4" fill={W} />
      <circle cx="40" cy="30" r="4" fill={W} />
      <circle cx="24" cy="30" r="2" fill={D} />
      <circle cx="40" cy="30" r="2" fill={D} />
      <path d="M22 42 h20 l-4 6 h-12 z" fill={W} />
      <path d="M26 42 v6 M32 42 v6 M38 42 v6" stroke="#D9503F" strokeWidth="2" />
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
  알파벳: (
    <text x="32" y="44" textAnchor="middle" fontSize="30" fontWeight="800" letterSpacing="1">
      <tspan fill="#D9503F">A</tspan>
      <tspan fill="#3FA680">B</tspan>
      <tspan fill="#4A79C4">C</tspan>
    </text>
  ),
  눈: (
    <>
      <path d="M32 6 v52 M9 19 l46 26 M55 19 L9 45" stroke="#7FB5E8" strokeWidth="5" strokeLinecap="round" />
      <path d="M32 16 l-7 -7 M32 16 l7 -7 M32 48 l-7 7 M32 48 l7 7" stroke="#7FB5E8" strokeWidth="4" strokeLinecap="round" />
      <path d="M18 24 l-9 -1 M18 24 l1 -9 M46 40 l9 1 M46 40 l-1 9" stroke="#7FB5E8" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 24 l9 -1 M46 24 l-1 -9 M18 40 l-9 1 M18 40 l1 9" stroke="#7FB5E8" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  꽃: (
    <>
      <circle cx="32" cy="14" r="9" fill="#F2B8C6" />
      <circle cx="49" cy="26" r="9" fill="#F2B8C6" />
      <circle cx="43" cy="45" r="9" fill="#F2B8C6" />
      <circle cx="21" cy="45" r="9" fill="#F2B8C6" />
      <circle cx="15" cy="26" r="9" fill="#F2B8C6" />
      <circle cx="32" cy="31" r="9" fill="#EFB752" />
      <path d="M32 40 v18" stroke="#3FA680" strokeWidth="5" strokeLinecap="round" />
      <path d="M32 50 q-10 -6 -14 2 q10 6 14 -2 z" fill="#3FA680" />
    </>
  ),
  학교: (
    <>
      <path d="M32 6 l24 12 v6 H8 v-6 z" fill="#D9503F" />
      <rect x="12" y="24" width="40" height="30" rx="4" fill={W} stroke="#C9D2DD" strokeWidth="2" />
      <rect x="27" y="38" width="10" height="16" rx="2" fill="#8A7256" />
      <rect x="17" y="30" width="8" height="8" rx="2" fill="#7FB5E8" />
      <rect x="39" y="30" width="8" height="8" rx="2" fill="#7FB5E8" />
      <rect x="29" y="2" width="4" height="8" rx="2" fill="#E8A33D" />
      <path d="M6 54 h52" stroke="#8A7256" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
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
  길: (
    <>
      <path d="M22 58 q4 -26 0 -52 h20 q-4 26 0 52 z" fill="#8A8F9B" />
      <path d="M32 10 v8 M32 26 v8 M32 42 v8" stroke={W} strokeWidth="4" strokeLinecap="round" />
      <path d="M4 58 q6 -10 14 -10 M60 58 q-6 -10 -14 -10" fill="none" stroke="#6AA84F" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  다리: (
    <>
      <path d="M4 26 h56" stroke="#D9503F" strokeWidth="6" strokeLinecap="round" />
      <path d="M8 26 q24 -20 48 0" fill="none" stroke="#D9503F" strokeWidth="5" />
      <path d="M16 26 v-9 M32 26 v-13 M48 26 v-9" stroke="#D9503F" strokeWidth="4" strokeLinecap="round" />
      <path d="M10 26 v14 M54 26 v14" stroke="#B43F31" strokeWidth="5" strokeLinecap="round" />
      <path d="M4 44 q14 -6 28 0 t28 0" fill="none" stroke="#57A8E0" strokeWidth="5" strokeLinecap="round" />
      <path d="M4 54 q14 -6 28 0 t28 0" fill="none" stroke="#9FD3F0" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  수리: (
    <>
      {/* 드라이버 */}
      <g transform="rotate(45 32 32)">
        <rect x="28" y="4" width="8" height="9" rx="2" fill="#8A8F9B" />
        <rect x="25" y="13" width="14" height="21" rx="5" fill="#E8A33D" />
        <rect x="29" y="34" width="6" height="24" rx="2" fill="#B7BCC6" />
      </g>
      {/* 스패너 */}
      <g transform="rotate(-45 32 32)">
        <rect x="29" y="14" width="7" height="42" rx="3.5" fill="#6E7683" />
        <path d="M25 6 h5.5 v6 h3.5 V6 H39 v11 a7 7 0 0 1 -14 0 z" fill="#6E7683" />
      </g>
    </>
  ),
  점검: (
    <>
      <rect x="12" y="10" width="40" height="46" rx="6" fill={W} stroke="#C9D2DD" strokeWidth="2" />
      <rect x="24" y="5" width="16" height="9" rx="3" fill="#8A8F9B" />
      <path d="M20 26 l5 5 9 -11" fill="none" stroke="#3FA680" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 42 l5 5 9 -11" fill="none" stroke="#3FA680" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 27 h10 M38 43 h10" stroke="#C9D2DD" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  제설차: (
    <>
      <path d="M6 44 V26 q0 -4 5 -4 l5 4 v18 z" fill="#4A79C4" />
      <rect x="18" y="24" width="24" height="18" rx="5" fill="#E8A33D" />
      <rect x="22" y="28" width="12" height="9" rx="3" fill={W} />
      <rect x="42" y="30" width="14" height="12" rx="3" fill="#EFB752" />
      {wheels([26, 48], 48, 6)}
      <circle cx="14" cy="12" r="3" fill={W} />
      <circle cx="30" cy="8" r="3" fill={W} />
      <circle cx="46" cy="14" r="3" fill={W} />
    </>
  ),
  방향: (
    <>
      <rect x="29" y="18" width="6" height="40" rx="2" fill="#8A7256" />
      <path d="M32 12 h22 l6 7 -6 7 H32 z" fill="#E8A33D" />
      <path d="M32 30 H10 l-6 7 6 7 h22 z" fill="#3FA680" />
    </>
  ),
  반대말: (
    <>
      <path d="M40 16 h14 l-8 -8 M54 16 l-8 8" fill="none" stroke="#D9503F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 16 h30" stroke="#D9503F" strokeWidth="5" strokeLinecap="round" />
      <path d="M24 44 H10 l8 -8 M10 44 l8 8" fill="none" stroke="#4A79C4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M54 44 H24" stroke="#4A79C4" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  사랑: (
    <path d="M32 56 C 8 40 4 26 4 20 A 14 14 0 0 1 32 16 A 14 14 0 0 1 60 20 c0 6 -4 20 -28 36 z" fill="#D9503F" />
  ),
  정글: (
    <>
      <path d="M30 58 V26" stroke="#8A7256" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 28 q-14 -14 -26 -8 q10 14 26 8 z" fill="#3FA680" />
      <path d="M30 24 q14 -16 26 -8 q-10 14 -26 8 z" fill="#4FBE8E" />
      <path d="M30 16 q-8 -14 2 -14 q10 2 6 14 z" fill="#3FA680" />
      <path d="M6 58 q8 -8 18 -4" fill="none" stroke="#6AA84F" strokeWidth="5" strokeLinecap="round" />
      <path d="M58 58 q-8 -8 -18 -4" fill="none" stroke="#6AA84F" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  꼬리: (
    <>
      <ellipse cx="22" cy="42" rx="18" ry="14" fill="#C29260" />
      <path d="M38 36 q16 -6 14 -18 q-1 -8 -8 -6 q-6 2 -3 9" fill="none" stroke="#A97C50" strokeWidth="7" strokeLinecap="round" />
      <rect x="12" y="50" width="7" height="9" rx="3" fill="#A97C50" />
      <rect x="26" y="50" width="7" height="9" rx="3" fill="#A97C50" />
    </>
  ),
  반짝: (
    <>
      <path d="M26 6 l5 13 13 5 -13 5 -5 13 -5 -13 -13 -5 13 -5 z" fill="#E8A33D" />
      <path d="M47 30 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#EFB752" />
      <path d="M18 42 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" fill="#FBE0A0" />
    </>
  ),
  악어: (
    <>
      <path d="M4 40 h44 q10 0 12 -6 v12 q-2 6 -12 6 H4 z" fill="#6AA84F" />
      <path d="M6 40 l4 -6 4 6 4 -6 4 6 4 -6 4 6 4 -6 4 6" fill="none" stroke="#4E8A3A" strokeWidth="3" />
      <path d="M48 46 l-6 6 M40 46 l-6 6" stroke={W} strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="34" r="6" fill="#7CBB5C" />
      <circle cx="30" cy="33" r="2.5" fill={D} />
    </>
  ),
  송아지: (
    <>
      <circle cx="32" cy="34" r="20" fill={W} stroke="#E2D5C0" strokeWidth="2" />
      <path d="M12 22 q-6 -8 2 -10 q7 -1 8 7 z" fill="#C29260" />
      <path d="M52 22 q6 -8 -2 -10 q-7 -1 -8 7 z" fill="#C29260" />
      <ellipse cx="32" cy="44" rx="12" ry="9" fill="#EBC8B0" />
      <circle cx="27" cy="43" r="2.2" fill={D} />
      <circle cx="37" cy="43" r="2.2" fill={D} />
      <circle cx="24" cy="30" r="3" fill={D} />
      <circle cx="40" cy="30" r="3" fill={D} />
      <path d="M18 18 q8 -4 12 4 q-8 4 -12 -4 z" fill="#C29260" />
    </>
  ),
  돼지: (
    <>
      <circle cx="32" cy="34" r="20" fill="#F2B8C6" />
      <path d="M14 18 q-2 -10 8 -8 q4 1 4 8 z" fill="#E8A0B2" />
      <path d="M50 18 q2 -10 -8 -8 q-4 1 -4 8 z" fill="#E8A0B2" />
      <ellipse cx="32" cy="40" rx="11" ry="8" fill="#E8A0B2" />
      <circle cx="28" cy="40" r="2.4" fill={D} />
      <circle cx="36" cy="40" r="2.4" fill={D} />
      <circle cx="24" cy="28" r="3" fill={D} />
      <circle cx="40" cy="28" r="3" fill={D} />
    </>
  ),
  행복: (
    <>
      <circle cx="32" cy="32" r="24" fill="#EFB752" />
      <circle cx="23" cy="26" r="3.4" fill={D} />
      <circle cx="41" cy="26" r="3.4" fill={D} />
      <path d="M20 38 q12 12 24 0" fill="none" stroke={D} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  일어나기: (
    <>
      <circle cx="32" cy="36" r="19" fill={W} stroke="#C9D2DD" strokeWidth="3" />
      <path d="M32 26 v10 l7 5" fill="none" stroke={D} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 14 l6 6 M48 14 l-6 6" stroke="#D9503F" strokeWidth="5" strokeLinecap="round" />
      <path d="M12 8 a10 10 0 0 1 12 2 M52 8 a10 10 0 0 0 -12 2" fill="none" stroke="#D9503F" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  음악: (
    <>
      <path d="M24 44 V14 l24 -6 v30" fill="none" stroke={D} strokeWidth="5" strokeLinejoin="round" />
      <path d="M24 20 l24 -6" stroke={D} strokeWidth="5" />
      <circle cx="18" cy="46" r="8" fill="#D9503F" />
      <circle cx="42" cy="40" r="8" fill="#4A79C4" />
    </>
  ),
  노을: (
    <>
      <path d="M8 40 a24 24 0 0 1 48 0 z" fill="#E8A33D" />
      <path d="M4 40 h56" stroke="#D9503F" strokeWidth="5" strokeLinecap="round" />
      <path d="M4 48 q14 -5 28 0 t28 0" fill="none" stroke="#D9503F" strokeWidth="5" strokeLinecap="round" />
      <path d="M4 56 q14 -5 28 0 t28 0" fill="none" stroke="#E8A33D" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  힘센: (
    <>
      <rect x="20" y="28" width="24" height="8" rx="4" fill="#6E7683" />
      <rect x="12" y="18" width="11" height="28" rx="5" fill={D} />
      <rect x="41" y="18" width="11" height="28" rx="5" fill={D} />
      <rect x="4" y="25" width="9" height="14" rx="4" fill="#6E7683" />
      <rect x="51" y="25" width="9" height="14" rx="4" fill="#6E7683" />
    </>
  ),
  부릉부릉: (
    <>
      <path d="M22 44 v-7 q0 -3 4 -5 l5 -6 q2 -2 4 -2 h10 q3 0 4 2 l5 6 q4 2 4 5 v7 z" fill="#D9503F" />
      <path d="M33 27 h6 v6 h-10 z" fill={W} />
      <path d="M43 27 h4 l4 6 h-8 z" fill={W} />
      {wheels([31, 51], 47, 6)}
      <path d="M4 24 h12 M2 34 h14 M6 44 h10" stroke="#8A8F9B" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  '그 밖의 노래': (
    <>
      <path d="M18 40 V12 l20 -5 v28" fill="none" stroke="#8A8F9B" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="13" cy="42" r="6.5" fill="#B7BCC6" />
      <circle cx="33" cy="37" r="6.5" fill="#B7BCC6" />
      <circle cx="49" cy="50" r="5" fill="#CFD5DE" />
      <path d="M52 50 V30" stroke="#CFD5DE" strokeWidth="3.5" />
    </>
  ),
  엄마: (
    <>
      <path d="M32 4 a17 17 0 0 1 17 17 v14 h-34 V21 a17 17 0 0 1 17 -17 z" fill="#8A5A3C" />
      <circle cx="32" cy="23" r="14" fill="#F2D4BC" />
      <path d="M18 20 a14 14 0 0 1 28 0 q-7 -6 -14 -6 t-14 6 z" fill="#8A5A3C" />
      <circle cx="27" cy="24" r="2.6" fill={D} />
      <circle cx="37" cy="24" r="2.6" fill={D} />
      <path d="M28 30 q4 4 8 0" fill="none" stroke={D} strokeWidth="3" strokeLinecap="round" />
      <path d="M14 58 a18 18 0 0 1 36 0 z" fill="#E094A8" />
    </>
  ),
  아빠: (
    <>
      <circle cx="32" cy="23" r="14" fill="#F2D4BC" />
      <path d="M18 19 a14 14 0 0 1 28 0 q-7 -5 -14 -5 t-14 5 z" fill="#3A3229" />
      <circle cx="27" cy="24" r="2.6" fill={D} />
      <circle cx="37" cy="24" r="2.6" fill={D} />
      <path d="M28 30 q4 4 8 0" fill="none" stroke={D} strokeWidth="3" strokeLinecap="round" />
      <path d="M14 58 a18 18 0 0 1 36 0 z" fill="#4A79C4" />
    </>
  ),
  아기: (
    <>
      <circle cx="32" cy="32" r="20" fill="#F2D4BC" />
      <path d="M26 12 q6 -8 12 -2" fill="none" stroke="#C98130" strokeWidth="4" strokeLinecap="round" />
      <circle cx="24" cy="30" r="3" fill={D} />
      <circle cx="40" cy="30" r="3" fill={D} />
      <circle cx="18" cy="38" r="4" fill="#F2B8C6" />
      <circle cx="46" cy="38" r="4" fill="#F2B8C6" />
      <path d="M27 40 q5 5 10 0" fill="none" stroke={D} strokeWidth="3" strokeLinecap="round" />
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
