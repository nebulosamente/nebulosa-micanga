import { useCallback, useEffect, useRef } from 'react'
import { ED_MEDIA, ED_NEBULOSA } from '../../data/editorial'
import { useEditorialDia } from '../../hooks/useEditorialDia'
import { useEditorialMesa } from '../../hooks/useEditorialMesa'
import { EditorialFeed } from './EditorialFeed'
import { EditorialPecas } from './EditorialPecas'
import { Cloud } from './EditorialStickers'
import '../../styles/editorial.css'
import '../../styles/editorialPecas.css'

type EditorialSection = 'dia' | 'mesa'

type EditorialProps = {
  /** Seção em que a página deve abrir (ex.: link antigo para o feed). */
  startAt?: EditorialSection
}

export function Editorial({ startAt = 'dia' }: EditorialProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mesaRef = useRef<HTMLDivElement>(null)
  useEditorialDia(rootRef)
  useEditorialMesa(rootRef)

  const scrollToMesa = useCallback((behavior: ScrollBehavior) => {
    const el = mesaRef.current
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior })
  }, [])

  const jump = useCallback(
    (section: EditorialSection) => {
      if (section === 'mesa') scrollToMesa('smooth')
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [scrollToMesa],
  )

  useEffect(() => {
    if (startAt !== 'mesa') return
    scrollToMesa('instant')
  }, [startAt, scrollToMesa])

  return (
    <div ref={rootRef} id="ed-dia" className="ed ed-dia">
      <main>
        <section className="flo" data-flo data-screen-label="D · Florada" aria-label="D · Florada">
          <div className="flo-stage" data-flo-stage>
            <div className="flo-bg" data-flo-bg />
            <div className="flo-sun" data-flo-sun />
            <div className="cl b" data-cl="0" style={{ left: '58%', top: '7%', width: '26vw' }}><Cloud /></div>
            <div className="cl b" data-cl="1" style={{ left: '-3%', top: '30%', width: '22vw' }}><Cloud /></div>
            <div className="cl b" data-cl="2" style={{ left: '80%', top: '33%', width: '20vw' }}><Cloud /></div>
            <div className="cl b" data-cl="3" style={{ left: '34%', top: '4%', width: '14vw' }}><Cloud /></div>
            <h1 className="sr-only" data-flo-title>
              Florada
            </h1>
            <div className="cl f" data-cl="4" style={{ left: '5%', top: '37%', width: '23vw' }}><Cloud /></div>
            <div className="cl f" data-cl="5" style={{ left: '66%', top: '40%', width: '25vw' }}><Cloud /></div>
            <div className="cl f" data-cl="6" style={{ left: '44%', top: '42%', width: '12vw' }}><Cloud /></div>
            <div className="flo-layer back" data-l="back" />
            <div className="flo-fog" />
            <div className="flo-hill a" />
            <div className="flo-hill b" />
            <div className="flo-shadow" />
            <div className="flo-char" data-flo-char>
              <img
                className="flo-photo"
                src={`${ED_NEBULOSA}/calca-8.webp`}
                alt="Modelo de calça jeans com cortina de miçanga e chapéu preto, fotografando com uma câmera analógica"
                width={1055}
                height={1491}
                fetchPriority="high"
              />
            </div>
            <div className="flo-layer mid" data-l="mid" />
            <div className="flo-layer front" data-l="front" />
            <div className="flo-meta mono">
              <span className="pill">Projeto 03 / Editorial · Ensaio 01</span>
              <span className="pill">Direção criativa · Fotografia · Styling</span>
            </div>
            <div className="flo-cap serif pill" data-cap="0">
              Primeiro, a terra. <span className="mono" style={{ marginLeft: 10, opacity: 0.7 }}>role para plantar ↓</span>
            </div>
            <div className="flo-cap serif pill" data-cap="1">
              Depois, o que ela devolve.
            </div>
            <div className="flo-cap serif pill" data-cap="2">
              Floresça sem pressa.
            </div>
            <div className="flo-count mono" data-flo-count>
              Estação 01 / 03
            </div>
          </div>
        </section>

        <section className="cd" data-screen-label="D · Cartões" aria-label="D · Cartões">
          <div className="cd-head">
            <div>
              <div className="mono" style={{ marginBottom: 14, color: '#0B4F2A' }}>
                (01) Cartões pop-up
              </div>
              <h2 className="display">
                Abra o cartão, <em>nasce um jardim.</em>
              </h2>
            </div>
            <p className="serif" style={{ margin: 0, maxWidth: 340, fontSize: 'clamp(20px, 1.8vw, 26px)', lineHeight: 1.15, color: '#0B4F2A' }}>
              Três recortes que se levantam do papel conforme você chega perto.
            </p>
          </div>
          <div className="cd-grid">
            <figure className="cdc" data-cd="a">
              <span className="tab mono">Cartão 01</span>
              <div className="cdc-in">
                <div className="bgc" style={{ background: '#FFB3DA' }} />
                <div className="blob" style={{ background: '#FF5BC0' }} />
                <img src={`${ED_MEDIA}/recorte/ceu-chapeu-sorriso.png`} alt="Cartão 01" style={{ left: '-4%', bottom: 0, width: '108%' }} loading="lazy" />
                <div className="cdc-fl" data-cf />
              </div>
              <figcaption>
                <span className="serif">Sorriso sob o chapéu</span>
                <small className="mono" style={{ opacity: 0.6 }}>
                  Recorte nº 1 · papel couché
                </small>
              </figcaption>
            </figure>
            <figure className="cdc" data-cd="b">
              <span className="tab mono" style={{ background: '#FFB3DA' }}>
                Cartão 02
              </span>
              <div className="cdc-wrap">
                <div className="cdc-in photo">
                  <img
                    src={`${ED_MEDIA}/ceu-chapeu-close.jpeg`}
                    alt="Cartão 02"
                    style={{ left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 38%' }}
                    loading="lazy"
                  />
                </div>
                <div className="cdc-fl" data-cf />
              </div>
              <figcaption>
                <span className="serif">A sombra da aba</span>
                <small className="mono" style={{ opacity: 0.6 }}>
                  Recorte nº 2 · papel couché
                </small>
              </figcaption>
            </figure>
            <figure className="cdc" data-cd="c">
              <span className="tab mono" style={{ background: '#B6E8FF' }}>
                Cartão 03
              </span>
              <div className="cdc-in">
                <div className="bgc" style={{ background: '#D9CBFF' }} />
                <div className="blob" style={{ background: '#8C52FF' }} />
                <img src={`${ED_MEDIA}/recorte/ceu-pulso.png`} alt="Cartão 03" style={{ left: '12%', top: 0, width: '76%' }} loading="lazy" />
                <div className="cdc-fl" data-cf />
              </div>
              <figcaption>
                <span className="serif">Pulso florido</span>
                <small className="mono" style={{ opacity: 0.6 }}>
                  Recorte nº 3 · papel couché
                </small>
              </figcaption>
            </figure>
          </div>
        </section>

        <EditorialPecas />

        <section className="tb" data-tb data-screen-label="D · Mesa posta" aria-label="D · Mesa posta">
          <div className="tb-stage">
            <div className="cloth" />
            <div className="tb-t display" data-tbt>
              Agora, <span>à mesa.</span>
            </div>
            <div className="plate" data-plate>
              <svg data-spiral viewBox="-110 -110 220 220" />
            </div>
            <div className="hashi" data-hashi="0" />
            <div className="hashi" data-hashi="1" />
          </div>
        </section>

        <EditorialFeed wrapRef={mesaRef} onTop={() => jump('dia')} onReplay={() => jump('mesa')} />

        <div className="tb-ft mono">
          <span>Projeto 03 / Editorial</span>
        </div>
      </main>
    </div>
  )
}
