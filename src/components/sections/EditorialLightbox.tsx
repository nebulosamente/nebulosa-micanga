import { useEffect, useRef } from 'react'
import { ED_PECAS_COPY, type EdSlide } from '../../data/editorial'
import { pad } from '../../lib/format'

type EditorialLightboxProps = {
  slides: readonly EdSlide[]
  index: number
  pieceName: string
  onClose: () => void
  onStep: (delta: number) => void
}

export function EditorialLightbox({ slides, index, pieceName, onClose, onStep }: EditorialLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const item = slides[index]

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onStep(-1)
      if (event.key === 'ArrowRight') onStep(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  if (!item) return null

  return (
    <div className="pe-lb" role="dialog" aria-modal="true" aria-label={ED_PECAS_COPY.lightbox}>
      <button type="button" className="pe-lb-dismiss" aria-label={ED_PECAS_COPY.close} onClick={onClose} />
      <div className="pe-lb-card">
        <div className="pe-lb-img">
          <img src={item.src} alt={item.alt} />
        </div>
        <div className="pe-lb-bar">
          <button className="pe-btn" type="button" onClick={() => onStep(-1)} aria-label={ED_PECAS_COPY.prevView}>
            ←
          </button>
          <span className="mono">
            {pad(index + 1)} / {pad(slides.length)} · {pieceName} · {item.label}
          </span>
          <button className="pe-btn" type="button" onClick={() => onStep(1)} aria-label={ED_PECAS_COPY.nextView}>
            →
          </button>
          <button ref={closeRef} className="pe-btn pk" type="button" onClick={onClose} aria-label={ED_PECAS_COPY.close}>
            {ED_PECAS_COPY.close}
          </button>
        </div>
      </div>
    </div>
  )
}
