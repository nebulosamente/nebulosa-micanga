import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react'
import { ED_AUTOPLAY_MS } from '../lib/carousel'

/** Avança o giro a cada ED_AUTOPLAY_MS enquanto `playing`; pula o passo se o usuário estiver arrastando. */
export function useCarouselAutoplay(
  playing: boolean,
  count: number,
  dragging: RefObject<boolean>,
  setIndex: Dispatch<SetStateAction<number>>,
) {
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      if (dragging.current) return
      setIndex((value) => (value + 1) % count)
    }, ED_AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [playing, count, dragging, setIndex])
}
