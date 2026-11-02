import { useEffect, useRef, type RefObject } from 'react'

/**
 * Rolagem da seção "Peças" e do manifesto do editorial.
 *
 * data-ed-par     seção cujo centro vira --o (fração da viewport); os adesivos deslocam com ele.
 * data-ed-reveal  ganha a classe .in ao cruzar a dobra.
 * data-ed-mani    progresso 0–1 do manifesto, escrito em --wp.
 * data-ed-giro    trilho alto: a rolagem escolhe o índice do carrossel e escreve --gp (0–1) para os adesivos.
 */

/** px. Altura usada se o viewport ainda não mediu. */
const VIEWPORT_FALLBACK_PX = 800
/** Fração da viewport. Abaixo disso o bloco já pode aparecer. */
const REVEAL_LINE = 0.94
/** Fração da viewport. Onde a primeira palavra começa a acender. */
const WORD_LEAD = 0.86
/** Fração da viewport. Rolagem que acende o parágrafo inteiro. */
const WORD_SPAN = 0.5
/** Evita o índice final antes de o trilho acabar. */
const GIRO_EDGE = 0.9999
/** ms. O giro preso em sticky não dispara scroll o tempo todo. */
const POLL_MS = 800
/** ms. A primeira medida espera o layout assentar. */
const BOOT_MS = 350

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function useEditorialPecas(
  rootRef: RefObject<HTMLElement | null>,
  onGiro: (index: number) => void,
  giroCount: number,
) {
  const onGiroRef = useRef(onGiro)
  const countRef = useRef(giroCount)
  const lastIndex = useRef<number | null>(null)

  useEffect(() => {
    onGiroRef.current = onGiro
    countRef.current = giroCount
  }, [onGiro, giroCount])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let frame = 0

    const sync = () => {
      const viewport = window.innerHeight || VIEWPORT_FALLBACK_PX
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const pars = [...root.querySelectorAll<HTMLElement>('[data-ed-par]')]
      const reveals = [...root.querySelectorAll<HTMLElement>('[data-ed-reveal]:not(.in)')]
      const mani = root.querySelector<HTMLElement>('[data-ed-mani]')
      const giro = root.querySelector<HTMLElement>('[data-ed-giro]')
      const pin = giro?.firstElementChild instanceof HTMLElement ? giro.firstElementChild : null

      const parRects = pars.map((el) => el.getBoundingClientRect())
      const revealRects = reveals.map((el) => el.getBoundingClientRect())
      const maniRect = mani?.getBoundingClientRect()
      const giroRect = giro?.getBoundingClientRect()
      const pinRect = pin?.getBoundingClientRect()

      pars.forEach((el, i) => {
        const rect = parRects[i]
        const offset = (rect.top + rect.height / 2 - viewport / 2) / viewport
        el.style.setProperty('--o', offset.toFixed(3))
      })
      reveals.forEach((el, i) => {
        const rect = revealRects[i]
        if (reduced || (rect.top < viewport * REVEAL_LINE && rect.bottom > 0)) el.classList.add('in')
      })
      if (mani && maniRect) {
        const progress = reduced ? 1 : clamp((viewport * WORD_LEAD - maniRect.top) / (viewport * WORD_SPAN), 0, 1)
        mani.style.setProperty('--wp', progress.toFixed(3))
      }
      if (giro && giroRect && pinRect) {
        const span = Math.max(1, giroRect.height - pinRect.height)
        const progress = clamp(-giroRect.top / span, 0, 1)
        giro.style.setProperty('--gp', progress.toFixed(3))
        const count = countRef.current
        const index = Math.min(count - 1, Math.floor(progress * count * GIRO_EDGE))
        if (lastIndex.current !== index) {
          lastIndex.current = index
          onGiroRef.current(index)
        }
      }
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }

    window.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    const poll = window.setInterval(schedule, POLL_MS)
    schedule()
    const boot = window.setTimeout(schedule, BOOT_MS)
    return () => {
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      window.clearInterval(poll)
      window.clearTimeout(boot)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [rootRef])
}
