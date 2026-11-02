/** px. Arrastar menos que isso não troca a foto. */
export const ED_DRAG_PX = 40
/** ms. Intervalo do giro automático. */
export const ED_AUTOPLAY_MS = 2800

/** Fração de --ch (altura da foto, que é 4/3 da largura) entre uma foto e a vizinha. */
const SLIDE_SPREAD = 0.56
/** px. Profundidade de cada passo para trás. */
const SLIDE_DEPTH_PX = 150
/** deg. Giro em Y de cada passo. */
const SLIDE_YAW_DEG = 24
/** deg. Cada foto vizinha pende um pouco, como figurinha colada. */
const SLIDE_TILT_DEG = 3
const SLIDE_SCALE_SIDE = 0.82
/** A partir desta distância a foto some. */
const SLIDE_HIDE_FROM = 3
const SLIDE_OPACITY_NEAR = 0.92
const SLIDE_OPACITY_FAR = 0.55

export function edSlidePose(index: number, active: number, count: number) {
  let delta = index - active
  if (delta > count / 2) delta -= count
  if (delta < -count / 2) delta += count
  const distance = Math.abs(delta)
  const current = delta === 0
  const tilt = current ? 0 : Math.sign(delta) * SLIDE_TILT_DEG
  return {
    current,
    transform: `translateX(calc(var(--ch) * ${(delta * SLIDE_SPREAD).toFixed(3)})) translateZ(${-distance * SLIDE_DEPTH_PX}px) rotateY(${-delta * SLIDE_YAW_DEG}deg) rotate(${tilt}deg) scale(${current ? 1 : SLIDE_SCALE_SIDE})`,
    opacity: distance >= SLIDE_HIDE_FROM ? 0 : current ? 1 : distance === 1 ? SLIDE_OPACITY_NEAR : SLIDE_OPACITY_FAR,
    zIndex: 10 - distance * 2,
    pointerEvents: distance >= SLIDE_HIDE_FROM ? ('none' as const) : ('auto' as const),
  }
}
