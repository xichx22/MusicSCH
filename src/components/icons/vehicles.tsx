/* 자동차·중장비 아이콘. 64 격자, 납작한 면으로만 그린다. */
import type { ReactElement } from 'react'

const D = '#3A3229' // 바퀴·눈 같은 진한 부분
const W = '#FFFDF8' // 창문·밝은 부분

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

export const VEHICLE_ICONS: Record<string, ReactElement> = {
  't-firetruck': (
    <>
      <rect x="6" y="28" width="34" height="18" rx="5" fill="#D9503F" />
      <rect x="38" y="20" width="20" height="26" rx="6" fill="#E8604E" />
      <rect x="42" y="25" width="12" height="9" rx="3" fill={W} />
      <g transform="rotate(-10 24 22)">
        <rect x="8" y="19" width="30" height="6" rx="3" fill="#B7BCC6" />
        <path d="M14 19 v6 M21 19 v6 M28 19 v6 M35 19 v6" stroke={W} strokeWidth="2" />
      </g>
      {wheels([18, 46])}
    </>
  ),
  't-police': (
    <>
      <rect x="6" y="30" width="52" height="16" rx="6" fill={W} stroke="#C9D2DD" strokeWidth="2" />
      <path d="M16 30 l6 -10 h20 l6 10 z" fill="#4A79C4" />
      <rect x="6" y="38" width="52" height="4" fill="#4A79C4" />
      <rect x="24" y="14" width="7" height="5" rx="2" fill="#D9503F" />
      <rect x="33" y="14" width="7" height="5" rx="2" fill="#4A79C4" />
      {wheels([19, 45], 47)}
    </>
  ),
  't-ambulance': (
    <>
      <rect x="6" y="20" width="36" height="24" rx="6" fill={W} stroke="#C9D2DD" strokeWidth="2" />
      <path d="M42 26 h8 l8 8 v10 h-16 z" fill="#DCE3EC" stroke="#C9D2DD" strokeWidth="2" />
      <rect x="44" y="29" width="9" height="7" rx="2" fill="#BFD4E8" />
      <rect x="6" y="36" width="36" height="5" fill="#D9503F" />
      <rect x="16" y="26" width="14" height="4" rx="2" fill="#D9503F" />
      <rect x="21" y="21" width="4" height="14" rx="2" fill="#D9503F" />
      {wheels([18, 47])}
    </>
  ),
  't-car': (
    <>
      <path d="M8 44 v-8 q0 -4 5 -6 l7 -8 q2 -2 5 -2 h14 q3 0 5 3 l6 7 q6 2 6 6 v8 z" fill="#E8A33D" />
      <path d="M24 24 h8 v8 h-13 z" fill={W} />
      <path d="M36 24 h6 l6 8 h-12 z" fill={W} />
      {wheels([19, 45], 46, 7)}
    </>
  ),
  't-bus': (
    <>
      <rect x="8" y="16" width="48" height="32" rx="9" fill="#3FA680" />
      <rect x="13" y="22" width="16" height="12" rx="4" fill={W} />
      <rect x="35" y="22" width="16" height="12" rx="4" fill={W} />
      <rect x="13" y="38" width="38" height="4" rx="2" fill="#2C7A5E" />
      {wheels([19, 45], 50)}
    </>
  ),
  't-dump': (
    <>
      <path d="M24 16 h30 q5 0 5 5 v19 H24 z" fill="#8A7256" />
      <path d="M28 21 h26 v14 H28 z" fill="#A08865" />
      <path d="M4 24 h16 q4 0 4 4 v14 H4 z" fill="#D9503F" />
      <rect x="7" y="27" width="12" height="9" rx="3" fill={W} />
      <rect x="2" y="40" width="58" height="4" rx="2" fill="#6F5B44" />
      {wheels([13, 38, 52])}
    </>
  ),
  't-roller': (
    <>
      <rect x="20" y="18" width="26" height="18" rx="5" fill="#E8A33D" />
      <rect x="25" y="22" width="14" height="9" rx="3" fill={W} />
      <rect x="6" y="36" width="22" height="18" rx="9" fill="#6E7683" />
      <rect x="11" y="41" width="12" height="8" rx="4" fill="#9AA3B0" />
      <circle cx="46" cy="47" r="8" fill={D} />
      <circle cx="46" cy="47" r="3" fill={W} />
    </>
  ),
  't-excavator': (
    <>
      <path d="M30 34 l6 -18 8 3 -4 16 z" fill="#E8A33D" />
      <path d="M40 34 l12 4 -3 9 -12 -4 z" fill="#C98130" />
      <rect x="6" y="28" width="24" height="16" rx="5" fill="#EFB752" />
      <rect x="10" y="32" width="11" height="8" rx="3" fill={W} />
      <rect x="4" y="46" width="34" height="10" rx="5" fill={D} />
      <circle cx="12" cy="51" r="3" fill={W} />
      <circle cx="30" cy="51" r="3" fill={W} />
    </>
  ),
  't-mixer': (
    <>
      <circle cx="38" cy="28" r="15" fill="#B7BCC6" />
      <path d="M28 20 l20 16" stroke={W} strokeWidth="3" />
      <path d="M32 15 l16 18" stroke={W} strokeWidth="3" />
      <rect x="6" y="28" width="20" height="16" rx="5" fill="#4A79C4" />
      <rect x="10" y="31" width="11" height="8" rx="3" fill={W} />
      {wheels([14, 36, 50])}
    </>
  ),
  't-crane': (
    <>
      <path d="M14 46 V14 h5 v32 z" fill="#E8A33D" />
      <path d="M16 16 h34 v5 h-34 z" fill="#E8A33D" />
      <path d="M46 21 v10" stroke={D} strokeWidth="3" />
      <rect x="40" y="31" width="12" height="9" rx="3" fill="#8A7256" />
      <rect x="6" y="46" width="30" height="10" rx="5" fill={D} />
      <circle cx="14" cy="51" r="3" fill={W} />
      <circle cx="28" cy="51" r="3" fill={W} />
    </>
  ),
  't-forklift': (
    <>
      <rect x="10" y="26" width="22" height="18" rx="5" fill="#EFB752" />
      <rect x="14" y="30" width="12" height="9" rx="3" fill={W} />
      <path d="M36 14 h5 v32 h-5 z" fill="#8A8F9B" />
      <path d="M41 40 h14 v5 h-14 z" fill="#8A8F9B" />
      <rect x="42" y="24" width="14" height="14" rx="2" fill="#B98B54" />
      {wheels([18, 32], 48, 5)}
    </>
  ),
  't-heavy': (
    <>
      <path d="M30 32 l7 -17 8 3 -5 15 z" fill="#E8A33D" />
      <path d="M40 32 l13 5 -4 9 -12 -5 z" fill="#C98130" />
      <rect x="6" y="26" width="24" height="18" rx="5" fill="#EFB752" />
      <rect x="10" y="30" width="11" height="9" rx="3" fill={W} />
      <rect x="4" y="46" width="36" height="10" rx="5" fill={D} />
      <circle cx="12" cy="51" r="3" fill={W} />
      <circle cx="32" cy="51" r="3" fill={W} />
    </>
  ),
  't-garbage': (
    <>
      <rect x="18" y="20" width="34" height="24" rx="5" fill="#5F9E6E" />
      <path d="M22 20 v-5 h12 v5" fill="none" stroke="#3F7A4E" strokeWidth="3" />
      <rect x="6" y="28" width="14" height="16" rx="5" fill="#4E8A5C" />
      {wheels([14, 32, 48])}
    </>
  ),
  't-tow': (
    <>
      <rect x="6" y="28" width="26" height="16" rx="5" fill="#4A79C4" />
      <rect x="10" y="31" width="12" height="9" rx="3" fill={W} />
      <path d="M32 40 v-6 h8 l14 -12 v6 l-12 12 z" fill="#8A8F9B" />
      <circle cx="53" cy="24" r="4" fill="#E8A33D" />
      {wheels([16, 42])}
    </>
  ),
  't-monster': (
    <>
      <path d="M12 22 h40 q4 0 4 5 v11 H8 V27 q0 -5 4 -5 z" fill="#B34A4A" />
      <rect x="16" y="26" width="14" height="8" rx="3" fill={W} />
      <rect x="34" y="26" width="14" height="8" rx="3" fill={W} />
      <circle cx="17" cy="46" r="11" fill={D} />
      <circle cx="47" cy="46" r="11" fill={D} />
      <circle cx="17" cy="46" r="4.5" fill="#B7BCC6" />
      <circle cx="47" cy="46" r="4.5" fill="#B7BCC6" />
    </>
  ),
  't-tractor': (
    <>
      <rect x="18" y="20" width="18" height="18" rx="5" fill="#6AA84F" />
      <rect x="22" y="24" width="10" height="9" rx="3" fill={W} />
      <path d="M36 30 h14 v10 H36 z" fill="#5A9142" />
      <circle cx="46" cy="44" r="12" fill={D} />
      <circle cx="46" cy="44" r="5" fill="#B7BCC6" />
      <circle cx="18" cy="48" r="7" fill={D} />
      <circle cx="18" cy="48" r="3" fill="#B7BCC6" />
    </>
  ),
  't-train': (
    <>
      <path d="M14 18 h24 q6 0 6 6 v20 H8 V24 q0 -6 6 -6 z" fill="#7C6CD8" />
      <rect x="14" y="24" width="10" height="10" rx="3" fill={W} />
      <rect x="28" y="24" width="10" height="10" rx="3" fill={W} />
      <rect x="44" y="30" width="14" height="14" rx="4" fill="#6355BC" />
      <rect x="16" y="10" width="8" height="8" rx="3" fill="#6355BC" />
      {wheels([16, 32, 50], 50, 5)}
    </>
  ),
  't-plane': (
    <>
      <path d="M6 34 l18 -4 12 -18 h7 l-5 20 12 -2 5 -7 h5 l-3 10 3 10 h-5 l-5 -7 -12 -2 5 20 h-7 L24 38 z" fill="#57A8E0" />
      <circle cx="40" cy="31" r="2.6" fill={W} />
      <circle cx="47" cy="30" r="2.6" fill={W} />
    </>
  ),
  't-ship': (
    <>
      <path d="M6 40 h52 l-7 12 q-1 2 -4 2 H17 q-3 0 -4 -2 z" fill="#4A79C4" />
      <rect x="18" y="26" width="28" height="14" rx="3" fill={W} />
      <circle cx="26" cy="33" r="3" fill="#57A8E0" />
      <circle cx="38" cy="33" r="3" fill="#57A8E0" />
      <rect x="28" y="12" width="6" height="14" rx="2" fill="#D9503F" />
    </>
  ),
  't-heli': (
    <>
      <path d="M8 30 h40 v-4 l12 10 -12 10 v-4 H18 q-10 0 -10 -6 z" fill="#6F7EA8" />
      <rect x="16" y="26" width="12" height="10" rx="3" fill={W} />
      <rect x="8" y="14" width="44" height="4" rx="2" fill={D} />
      <rect x="28" y="16" width="4" height="8" rx="2" fill={D} />
      <path d="M14 46 h26" stroke={D} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
}
