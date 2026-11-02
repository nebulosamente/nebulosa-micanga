import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ED_GRUPOS, ED_MANIFESTO, ED_PECAS_COPY, ED_PIECES, type EdPieceId } from '../../data/editorial'
import { ED_AUTOPLAY_MS, ED_DRAG_PX, edSlidePose, useEditorialPecas } from '../../hooks/useEditorialPecas'
import { EditorialLightbox } from './EditorialLightbox'
import { Cloud, Sticker, type StickerKind } from './EditorialStickers'

type DecorStyle = CSSProperties & { '--sy'?: number }

type Decor = {
  kind: StickerKind
  tint?: string
  className?: string
  style: DecorStyle
}

/** Adesivos soltos no palco. Ficam nas bordas para não cobrir as fotos. */
const DECOR: readonly Decor[] = [
  { kind: 'smile', className: 'bob', style: { left: '2.5%', top: '33%', width: 'clamp(52px, 7.4vw, 118px)', '--sy': -110 } },
  { kind: 'flower', className: 'spin', tint: '#FF8CC4', style: { right: '4%', top: '22%', width: 'clamp(56px, 8vw, 128px)', '--sy': -70 } },
  { kind: 'eye', className: 'bob b2', style: { left: '9%', bottom: '24%', width: 'clamp(40px, 5.2vw, 86px)', '--sy': -150 } },
  { kind: 'star', className: 'spin slow', tint: '#8C52FF', style: { right: '8.5%', bottom: '30%', width: 'clamp(44px, 6vw, 96px)', '--sy': -190 } },
  { kind: 'heart', className: 'bob b3', style: { left: '1.5%', bottom: '38%', width: 'clamp(34px, 4vw, 64px)', '--sy': -60 } },
  { kind: 'tassel', className: 'bob b2', style: { right: '1.5%', top: '48%', width: 'clamp(34px, 4.4vw, 72px)', '--sy': -90 } },
  { kind: 'bead', className: 'bob', tint: '#3DE877', style: { left: '47%', top: '15%', width: 'clamp(26px, 3vw, 48px)', '--sy': -240 } },
  { kind: 'bead', className: 'bob b3', tint: '#FF5BC0', style: { right: '19%', bottom: '17%', width: 'clamp(24px, 2.6vw, 42px)', '--sy': -280 } },
]

const pad = (value: number) => (value < 10 ? `0${value}` : String(value))

export function EditorialPecas() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const dragOrigin = useRef<number | null>(null)
  const suppressClick = useRef(false)
  const [pieceId, setPieceId] = useState<EdPieceId>('calca')
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [lightbox, setLightbox] = useState(-1)

  const piece = ED_PIECES.find((item) => item.id === pieceId) ?? ED_PIECES[0]
  const slides = piece.slides
  const current = slides[index] ?? slides[0]

  useEditorialPecas(rootRef, setIndex, slides.length)

  const step = useCallback(
    (delta: number) => setIndex((value) => (value + delta + slides.length) % slides.length),
    [slides.length],
  )
  const closeLightbox = useCallback(() => setLightbox(-1), [])
  const stepLightbox = useCallback(
    (delta: number) => setLightbox((value) => (value + delta + slides.length) % slides.length),
    [slides.length],
  )

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      if (dragging.current) return
      setIndex((value) => (value + 1) % slides.length)
    }, ED_AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [playing, slides.length])

  useEffect(() => {
    if (lightbox < 0) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [lightbox])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragOrigin.current = event.clientX
    dragging.current = true
    suppressClick.current = false
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    const origin = dragOrigin.current
    dragOrigin.current = null
    if (origin == null) return
    const distance = event.clientX - origin
    if (Math.abs(distance) > ED_DRAG_PX) {
      suppressClick.current = true
      step(distance < 0 ? 1 : -1)
    }
  }

  const onSlide = (i: number) => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    if (i === index) setLightbox(i)
    else setIndex(i)
  }

  return (
    <div ref={rootRef} className="pe-wrap">
      <section
        className="pe"
        id="ed-pecas"
        data-piece={pieceId}
        aria-label="Peças · giro"
      >
        <div className="pe-track" data-ed-giro>
          <div className="pe-pin">
            <div className="pe-blob b1" aria-hidden="true" />
            <div className="pe-blob b2" aria-hidden="true" />
            <div className="pe-blob b3" aria-hidden="true" />
            <div className="pe-cloud c1" aria-hidden="true">
              <Cloud />
            </div>
            <div className="pe-cloud c2" aria-hidden="true">
              <Cloud />
            </div>
            {DECOR.map((item, i) => (
              <Sticker
                key={`${item.kind}-${i}`}
                kind={item.kind}
                tint={item.tint}
                className={`pe-s${item.className ? ` ${item.className}` : ''}`}
                style={item.style}
              />
            ))}
            <div className="pe-numeral display" aria-hidden="true">
              {ED_PECAS_COPY.numeral}
            </div>

            <div className="pe-head">
              <div>
                <div className="mono pe-meta">{ED_PECAS_COPY.index}</div>
                <h2 className="display pe-h2">
                  {ED_PECAS_COPY.titleLead}
                  <em>{ED_PECAS_COPY.titleEm}</em>
                </h2>
              </div>
              <p className="serif pe-lede" key={piece.id}>
                {piece.blurb}
              </p>
            </div>

            <div
              className="pe-stage"
              aria-roledescription="carrossel"
              aria-label={`Fotos: ${piece.name}`}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {slides.map((slide, i) => {
                const pose = edSlidePose(i, index, slides.length)
                return (
                  <button
                    key={`${piece.id}-${slide.src}`}
                    type="button"
                    className={pose.current ? 'pe-slide on' : 'pe-slide'}
                    style={{
                      transform: pose.transform,
                      opacity: pose.opacity,
                      zIndex: pose.zIndex,
                      pointerEvents: pose.pointerEvents,
                    }}
                    onClick={() => onSlide(i)}
                    aria-label={
                      pose.current
                        ? `${ED_PECAS_COPY.enlarge}: ${slide.label}`
                        : `${piece.name}, ${slide.label}`
                    }
                  >
                    <img src={slide.src} alt={slide.alt} draggable={false} loading={i < 3 ? 'eager' : 'lazy'} />
                    <span className="pe-cap pill mono">
                      {pad(i + 1)} · {slide.label}
                    </span>
                    <span className="pe-zoom" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
                      </svg>
                    </span>
                  </button>
                )
              })}
              <span className="pe-hint pill mono">{ED_PECAS_COPY.hint}</span>
            </div>

            <div className="pe-deck">
              <div className="pe-row">
                <button className="pe-btn" type="button" onClick={() => step(-1)} aria-label="Foto anterior">
                  <span aria-hidden="true">←</span> {ED_PECAS_COPY.prev}
                </button>
                <div className="pe-tabs">
                  {ED_PIECES.map((item) => (
                    <button
                      key={item.id}
                      className="pe-tab"
                      type="button"
                      aria-pressed={item.id === pieceId}
                      data-tab={item.id}
                      onClick={() => {
                        setPieceId(item.id)
                        setIndex(0)
                      }}
                    >
                      {item.name} <sup>{pad(item.slides.length)}</sup>
                    </button>
                  ))}
                </div>
                <button className="pe-btn" type="button" onClick={() => step(1)} aria-label="Próxima foto">
                  {ED_PECAS_COPY.next} <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className="pe-meter">
                <div className="pe-meter-row mono">
                  <span>{ED_PECAS_COPY.view}</span>
                  <span>
                    {pad(index + 1)} / {pad(slides.length)} · {current.label}
                  </span>
                </div>
                <div className="pe-scrub">
                  {slides.map((slide, i) => (
                    <button
                      key={`${piece.id}-scrub-${slide.label}`}
                      type="button"
                      aria-current={i === index ? 'true' : 'false'}
                      aria-label={`Ir para ${slide.label}`}
                      onClick={() => setIndex(i)}
                    >
                      <span />
                    </button>
                  ))}
                </div>
              </div>
              <button className="pe-play mono" type="button" onClick={() => setPlaying((value) => !value)}>
                {playing ? ED_PECAS_COPY.pause : ED_PECAS_COPY.play}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mf" data-ed-par aria-label="Manifesto">
        <Sticker kind="smile" className="mf-s bob" style={{ right: '19%', top: '7%', width: 'clamp(46px, 6vw, 96px)', '--sy': -80 } as DecorStyle} />
        <Sticker kind="flower" className="mf-s spin" tint="#FFE14D" style={{ right: '5%', top: '12%', width: 'clamp(52px, 7vw, 112px)', '--sy': -120 } as DecorStyle} />
        <Sticker kind="star" className="mf-s spin slow" tint="#FF8CC4" style={{ left: '8%', bottom: '14%', width: 'clamp(40px, 5vw, 80px)', '--sy': -60 } as DecorStyle} />
        <Sticker kind="eye" className="mf-s bob b2" style={{ right: '9%', bottom: '16%', width: 'clamp(40px, 5.4vw, 88px)', '--sy': -100 } as DecorStyle} />
        <div className="mono mf-meta">(03) Manifesto</div>
        <p className="display mf-t" data-ed-mani>
          {ED_MANIFESTO.map((item, i) => (
            <span
              key={`${item.w}-${i}`}
              className={item.hl ? `mf-w hl ${item.hl}` : 'mf-w'}
              style={{ '--k': (i / ED_MANIFESTO.length).toFixed(3) } as CSSProperties}
            >
              {item.w}{' '}
            </span>
          ))}
        </p>
        <div className="mf-grid">
          {ED_GRUPOS.map((group, i) => (
            <figure
              key={group.name}
              className="mf-grp"
              data-ed-reveal
              style={{ '--gc': group.color, '--gi': i } as CSSProperties}
            >
              <div className="mf-pair">
                <span className="mf-disc" aria-hidden="true" />
                <img className="mf-ph a" src={group.photos[0].src} alt={group.photos[0].alt} loading="lazy" />
                <img className="mf-ph b" src={group.photos[1].src} alt={group.photos[1].alt} loading="lazy" />
              </div>
              <figcaption className="pill mono">{group.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {lightbox >= 0 && (
        <EditorialLightbox
          slides={slides}
          index={lightbox}
          pieceName={piece.name}
          onClose={closeLightbox}
          onStep={stepLightbox}
        />
      )}
    </div>
  )
}
