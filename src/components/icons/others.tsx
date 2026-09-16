/* 캐릭터와 생활 습관 아이콘. 64 격자, 납작한 면으로만 그린다. */
import type { ReactElement } from 'react'

const D = '#3A3229'
const W = '#FFFDF8'

export const CHARACTER_ICONS: Record<string, ReactElement> = {
  'c-pororo': (
    <>
      <ellipse cx="32" cy="36" rx="19" ry="23" fill="#2F3A4A" />
      <ellipse cx="32" cy="40" rx="12" ry="17" fill={W} />
      <circle cx="25" cy="27" r="3.4" fill={W} />
      <circle cx="39" cy="27" r="3.4" fill={W} />
      <circle cx="25" cy="27" r="1.7" fill="#2F3A4A" />
      <circle cx="39" cy="27" r="1.7" fill="#2F3A4A" />
      <path d="M32 31 l5 4 -5 4 -5 -4 z" fill="#E8A33D" />
      <path d="M24 58 h7 M33 58 h7" stroke="#E8A33D" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  'c-tayo': (
    <>
      <rect x="9" y="16" width="46" height="32" rx="9" fill="#3FA680" />
      <rect x="14" y="22" width="16" height="12" rx="4" fill={W} />
      <rect x="34" y="22" width="16" height="12" rx="4" fill={W} />
      <rect x="14" y="38" width="36" height="4" rx="2" fill="#2C7A5E" />
      <circle cx="20" cy="50" r="6" fill={D} />
      <circle cx="44" cy="50" r="6" fill={D} />
      <circle cx="20" cy="50" r="2.4" fill={W} />
      <circle cx="44" cy="50" r="2.4" fill={W} />
    </>
  ),
  'c-bebefinn': (
    <>
      <circle cx="32" cy="30" r="19" fill="#F6D3A8" />
      <path d="M16 26 a16 14 0 0 1 32 0 a22 10 0 0 0 -32 0 z" fill="#8A5A34" />
      <circle cx="25" cy="31" r="2.6" fill={D} />
      <circle cx="39" cy="31" r="2.6" fill={D} />
      <path d="M28 38 q4 4 8 0" stroke={D} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M20 52 h24 a6 6 0 0 1 6 6 H14 a6 6 0 0 1 6 -6 z" fill="#E8A33D" />
    </>
  ),
  'c-pinkfong': (
    <>
      <path d="M8 38 q10 -20 28 -20 q16 0 20 14 q-4 14 -20 14 q-18 0 -28 -8 z" fill="#E86FA8" />
      <path d="M30 18 l6 -12 4 13 z" fill="#C74F88" />
      <path d="M54 30 l10 -6 -2 12 z" fill="#C74F88" />
      <circle cx="22" cy="32" r="3" fill={W} />
      <path d="M12 40 q8 3 16 2" stroke={W} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  ),
  'c-tomtomi': (
    <>
      <circle cx="17" cy="18" r="8" fill="#C98157" />
      <circle cx="47" cy="18" r="8" fill="#C98157" />
      <circle cx="32" cy="34" r="21" fill="#E09B6C" />
      <ellipse cx="32" cy="41" rx="12" ry="9" fill="#F7E2CE" />
      <circle cx="25" cy="30" r="2.8" fill={D} />
      <circle cx="39" cy="30" r="2.8" fill={D} />
      <ellipse cx="32" cy="38" rx="3.6" ry="2.8" fill={D} />
    </>
  ),
  'c-cheetahboo': (
    <>
      <path d="M14 20 l4 -10 8 7 z" fill="#D9A23C" />
      <path d="M50 20 l-4 -10 -8 7 z" fill="#D9A23C" />
      <circle cx="32" cy="34" r="21" fill="#EFC05B" />
      <circle cx="22" cy="24" r="2.6" fill="#8A5A21" />
      <circle cx="43" cy="26" r="2.2" fill="#8A5A21" />
      <circle cx="26" cy="44" r="2.2" fill="#8A5A21" />
      <circle cx="41" cy="43" r="2.6" fill="#8A5A21" />
      <circle cx="25" cy="32" r="3" fill={D} />
      <circle cx="39" cy="32" r="3" fill={D} />
      <path d="M32 38 l-4 3 h8 z" fill={D} />
    </>
  ),
  'c-twinkle': (
    <>
      <path d="M32 8 l6.6 14.8 16.2 1.8 -12.1 10.9 3.3 15.9 L32 43.6 18 51.4 21.3 35.5 9.2 24.6 25.4 22.8 z" fill="#7C6CD8" />
      <circle cx="52" cy="14" r="3" fill="#B3A9EC" />
      <circle cx="13" cy="47" r="2.4" fill="#B3A9EC" />
    </>
  ),
}

export const HABIT_ICONS: Record<string, ReactElement> = {
  't-brush': (
    <>
      <rect x="12" y="40" width="34" height="8" rx="4" fill="#E8A33D" transform="rotate(-28 29 44)" />
      <rect x="36" y="16" width="16" height="12" rx="4" fill="#57C7D6" transform="rotate(-28 44 22)" />
      <path d="M38 12 l3 6 M43 10 l3 6 M48 9 l3 6" stroke={W} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  't-bath': (
    <>
      <path d="M8 34 h48 v6 q0 10 -10 10 H18 q-10 0 -10 -10 z" fill={W} />
      <path d="M6 34 h52" stroke="#57A8E0" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 34 V16 q0 -6 6 -6" stroke="#8A8F9B" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="26" r="5" fill="#BFE4F5" />
      <circle cx="33" cy="20" r="3.5" fill="#BFE4F5" />
      <path d="M14 54 h8 M28 54 h8 M42 54 h8" stroke="#57A8E0" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  't-sleep': (
    <>
      <path d="M44 10 a24 24 0 1 0 12 34 a19 19 0 0 1 -12 -34 z" fill="#EFC05B" />
      <path d="M12 16 h10 l-10 12 h10" stroke="#B3A9EC" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M26 6 h7 l-7 9 h7" stroke="#B3A9EC" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  't-meal': (
    <>
      <ellipse cx="32" cy="38" rx="22" ry="14" fill={W} />
      <path d="M12 34 q20 -16 40 0 z" fill="#F0E4CE" />
      <path d="M16 18 v12 M22 18 v12 M19 30 v12" stroke="#8A7256" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 18 q5 4 0 12 v12" stroke="#8A7256" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  't-wash': (
    <>
      <path d="M20 44 V26 q0 -4 4 -4 t4 4 v-8 q0 -4 4 -4 t4 4 v8 q0 -4 4 -4 t4 4 v18 q0 8 -10 8 h-6 q-8 0 -8 -8 z" fill="#F6D3A8" />
      <circle cx="16" cy="18" r="5" fill="#BFE4F5" />
      <circle cx="48" cy="14" r="4" fill="#BFE4F5" />
      <circle cx="40" cy="8" r="3" fill="#BFE4F5" />
    </>
  ),
  't-potty': (
    <>
      <path d="M12 22 h30 v10 q0 10 -10 10 h-8 q-12 0 -12 -12 z" fill={W} />
      <path d="M42 22 h8 v8 h-8 z" fill="#D8DEE6" />
      <path d="M24 42 v10 h8 v-10" fill="#D8DEE6" />
      <path d="M14 20 h30" stroke="#57A8E0" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  't-birthday': (
    <>
      <rect x="10" y="32" width="44" height="20" rx="6" fill="#F6C6D8" />
      <path d="M10 40 q6 -6 11 0 t11 0 t11 0 t11 0 v-4 H10 z" fill={W} />
      <rect x="29" y="16" width="6" height="14" rx="3" fill="#57A8E0" />
      <path d="M32 6 q6 6 0 10 q-6 -4 0 -10 z" fill="#E8A33D" />
    </>
  ),
  't-hello': (
    <>
      <path d="M22 50 V26 q0 -4 4 -4 t4 4 v-10 q0 -4 4 -4 t4 4 v-4 q0 -4 4 -4 t4 4 v6 q0 -4 4 -4 t4 4 v18 q0 12 -12 12 z" fill="#F6D3A8" />
      <path d="M12 16 l6 6 M10 28 h8 M14 40 l6 -4" stroke="#E8A33D" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  't-hospital': (
    <>
      <rect x="10" y="16" width="44" height="38" rx="8" fill={W} />
      <rect x="27" y="24" width="10" height="26" rx="3" fill="#D9503F" />
      <rect x="19" y="32" width="26" height="10" rx="3" fill="#D9503F" />
    </>
  ),
  't-family': (
    <>
      <circle cx="18" cy="22" r="8" fill="#8A5A34" />
      <path d="M6 50 q0 -14 12 -14 t12 14 z" fill="#4A79C4" />
      <circle cx="42" cy="20" r="9" fill="#C98157" />
      <path d="M29 52 q0 -16 13 -16 t13 16 z" fill="#E86FA8" />
      <circle cx="32" cy="40" r="6" fill="#F6D3A8" />
      <path d="M24 56 q0 -9 8 -9 t8 9 z" fill="#EFC05B" />
    </>
  ),
}
