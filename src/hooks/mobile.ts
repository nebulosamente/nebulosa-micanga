/** Mesmo corte usado pela mesa de trabalhos (`compact`) e pelo editorial. */
export const MOBILE_QUERY = '(max-width: 760px)'

export const isMobileViewport = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
