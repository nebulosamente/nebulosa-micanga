import type { CSSProperties } from 'react'

const INK = '#17141A'

export function Cloud() {
  return (
    <svg viewBox="0 0 240 100">
      <path d="M30,92 C2,90 -4,58 26,52 C24,22 66,12 86,34 C98,6 148,6 158,38 C190,24 226,42 214,70 C238,72 236,94 212,92Z" fill="#fff" />
      <path d="M30,92 C2,90 -4,58 26,52 C40,76 120,84 214,70 C238,72 236,94 212,92Z" fill="#DCCFF7" opacity=".7" />
    </svg>
  )
}

export type StickerKind = 'smile' | 'flower' | 'eye' | 'star' | 'heart' | 'bead' | 'tassel'

const flowerPetals = [0, 60, 120, 180, 240, 300]

/** Contas da coleção desenhadas como adesivo: contorno grosso, cor chapada. */
function StickerArt({ kind, tint }: { kind: StickerKind; tint?: string }) {
  switch (kind) {
    case 'smile':
      return (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill={tint ?? '#FFE14D'} stroke={INK} strokeWidth="5" />
          <ellipse cx="35" cy="40" rx="5" ry="8" fill={INK} />
          <ellipse cx="65" cy="40" rx="5" ry="8" fill={INK} />
          <path d="M26 58 Q50 84 74 58" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <circle cx="30" cy="22" r="6" fill="#fff" opacity=".7" />
        </svg>
      )
    case 'flower':
      return (
        <svg viewBox="0 0 100 100">
          {flowerPetals.map((deg) => (
            <circle
              key={deg}
              cx="50"
              cy="24"
              r="19"
              fill={tint ?? '#FF8CC4'}
              stroke={INK}
              strokeWidth="4.5"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="15" fill="#FFE14D" stroke={INK} strokeWidth="4.5" />
        </svg>
      )
    case 'eye':
      return (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="#1F3BD1" stroke={INK} strokeWidth="5" />
          <circle cx="50" cy="50" r="30" fill="#fff" stroke={INK} strokeWidth="4" />
          <circle cx="50" cy="50" r="18" fill="#14B1FF" stroke={INK} strokeWidth="4" />
          <circle cx="50" cy="50" r="8" fill={INK} />
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 100 100">
          <path
            d="M50 6 L61 37 L94 38 L68 58 L78 90 L50 71 L22 90 L32 58 L6 38 L39 37 Z"
            fill={tint ?? '#8C52FF'}
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'heart':
      return (
        <svg viewBox="0 0 100 100">
          <path
            d="M50 88 C10 58 6 28 28 18 C40 13 49 20 50 28 C51 20 60 13 72 18 C94 28 90 58 50 88Z"
            fill={tint ?? '#FF3D4D'}
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <ellipse cx="32" cy="34" rx="6" ry="9" fill="#fff" opacity=".55" transform="rotate(-30 32 34)" />
        </svg>
      )
    case 'bead':
      return (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill={tint ?? '#3DE877'} stroke={INK} strokeWidth="5" />
          <circle cx="50" cy="50" r="12" fill="#fff6e4" stroke={INK} strokeWidth="4" />
          <ellipse cx="30" cy="28" rx="9" ry="6" fill="#fff" opacity=".6" transform="rotate(-35 30 28)" />
        </svg>
      )
    case 'tassel':
      return (
        <svg viewBox="0 0 100 100">
          <rect x="43" y="4" width="14" height="22" rx="5" fill="#FFE14D" stroke={INK} strokeWidth="4.5" />
          <path
            d="M50 24 C28 30 22 58 18 92 L82 92 C78 58 72 30 50 24Z"
            fill={tint ?? '#2FD6C6'}
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path d="M38 50 L34 90 M50 46 L50 90 M62 50 L66 90" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity=".5" />
        </svg>
      )
  }
}

type StickerProps = {
  kind: StickerKind
  tint?: string
  className?: string
  style?: CSSProperties
}

export function Sticker({ kind, tint, className, style }: StickerProps) {
  return (
    <span className={className ? `stk ${className}` : 'stk'} style={style} aria-hidden="true">
      <StickerArt kind={kind} tint={tint} />
    </span>
  )
}
