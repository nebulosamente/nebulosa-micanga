import { useEffect } from 'react'
import { MOBILE_QUERY, prefersReducedMotion } from './mobile'

const ON = 'reveal-on'

/**
 * Só no mobile: elementos com `data-reveal` entram suavemente quando chegam na tela.
 * O estado inicial escondido só existe sob a classe `reveal-on` (adicionada aqui), então sem JS
 * ou no desktop nada fica invisível. `data-reveal="<ms>"` define o atraso (efeito escalonado).
 */
export function useMobileReveal() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const mq = window.matchMedia(MOBILE_QUERY)
    const seen = new WeakSet<Element>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    const scan = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        const delay = Number(el.dataset.reveal)
        if (delay > 0) el.style.setProperty('--rd', `${delay}ms`)
        io.observe(el)
      })
    }

    const mo = new MutationObserver(scan)

    const enable = () => {
      if (!mq.matches) {
        document.documentElement.classList.remove(ON)
        return
      }
      document.documentElement.classList.add(ON)
      scan()
    }

    enable()
    mo.observe(document.body, { childList: true, subtree: true })
    mq.addEventListener('change', enable)
    return () => {
      mo.disconnect()
      io.disconnect()
      mq.removeEventListener('change', enable)
      document.documentElement.classList.remove(ON)
    }
  }, [])
}
