import { useEffect, useState } from 'react'
import { isMobileViewport, MOBILE_QUERY } from './mobile'

/**
 * Só no mobile: devolve `true` quando o usuário rola para baixo (a barra sai da frente do conteúdo)
 * e `false` assim que rola para cima ou volta ao topo. No desktop fica sempre `false`.
 */
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    let last = window.scrollY
    let acc = 0
    let raf = 0

    const run = () => {
      raf = 0
      if (!isMobileViewport()) {
        setHidden(false)
        return
      }
      const y = Math.max(0, window.scrollY)
      const delta = y - last
      last = y
      if (y < 90) {
        acc = 0
        setHidden(false)
        return
      }
      // Acumula na direção atual para ignorar tremidas de 1-2px do dedo.
      acc = Math.sign(delta) === Math.sign(acc) ? acc + delta : delta
      if (acc > 28) setHidden(true)
      else if (acc < -14) setHidden(false)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run)
    }
    const onChange = () => setHidden(false)

    window.addEventListener('scroll', onScroll, { passive: true })
    mq.addEventListener('change', onChange)
    return () => {
      window.removeEventListener('scroll', onScroll)
      mq.removeEventListener('change', onChange)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return hidden
}
