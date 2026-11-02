import { useSyncExternalStore } from 'react'

/** Mesmo corte usado pela mesa de trabalhos (`compact`) e pelo editorial. */
export const MOBILE_QUERY = '(max-width: 760px)'

export const isMobileViewport = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches

/** Dispositivo sem hover real (toque): não há `mouseenter`/`mouseleave` confiáveis. */
export const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function subscribe(notify: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY)
  mq.addEventListener('change', notify)
  return () => mq.removeEventListener('change', notify)
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, isMobileViewport, () => false)
}
