import type { CSSProperties, MouseEvent, RefObject } from 'react'
import { ED_MACARRAO } from '../../data/editorial'
import { isPlainLeftClick } from '../../lib/links'

type EditorialFeedProps = {
  wrapRef: RefObject<HTMLDivElement | null>
  onTop: () => void
  onReplay: () => void
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#17141A" strokeWidth="2.6" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
    </svg>
  )
}

const chips = ['#macarrãodemiçanga']

const mac = (file: string) => `${ED_MACARRAO}/${file}.webp`

/** Largura e altura (px) dos webp 3:4, usadas só para calcular a proporção do recorte. */
const WH = '1100|1467'

type PinRing = { left: string; top: string; width: string; height: string }
type PinLabel = { text: string; small: string; style: CSSProperties }

type PhotoPinProps = {
  file: string
  alt: string
  title: string
  saves: string
  ring?: PinRing
  label?: PinLabel
}

function PhotoPin({ file, alt, title, saves, ring, label }: PhotoPinProps) {
  return (
    <article className="pin" data-pin>
      <div className="pin-ph">
        <img src={mac(file)} alt={alt} loading="lazy" />
        {ring && <span className="ring" style={ring} />}
        {label && (
          <span className="lbl" style={label.style}>
            {label.text}
            <small>{label.small}</small>
          </span>
        )}
        <button className="save" data-save type="button">
          Salvar
        </button>
      </div>
      <div className="pin-cap">
        <b>{title}</b>
        <span className="mono">{saves}</span>
      </div>
    </article>
  )
}

/** Recorte circular de uma região da foto (rx|ry|rw|rh em fração da imagem). */
function ZoomPin({ file, crop }: { file: string; crop: string }) {
  return (
    <article className="pin" data-pin>
      <div className="pin-ph z" data-z={`${mac(file)}|${crop}|${WH}`} style={{ borderRadius: '50%' }}>
        <button className="save" data-save type="button">
          Salvar
        </button>
      </div>
    </article>
  )
}

export function EditorialFeed({ wrapRef, onTop, onReplay }: EditorialFeedProps) {
  const go = (event: MouseEvent<HTMLAnchorElement>, action: () => void) => {
    if (!isPlainLeftClick(event)) return
    event.preventDefault()
    action()
  }

  return (
    <div ref={wrapRef} id="ed-mesa" className="ed-mesa">
      <section className="fh" data-fh data-screen-label="1 · Busca" aria-label="1 · Busca">
        <div className="fh-stage">
          <div className="dots" />
          <svg className="fh-svg" data-fh-svg />
          <div className="fh-pin hide-s" data-par="1.2" style={{ left: '3vw', top: '34vh', width: '16vw', transform: 'rotate(-4deg)' }}>
            <img src={mac('tigela-cima')} alt="" loading="lazy" />
          </div>
          <div className="fh-pin" data-par="-1" style={{ right: '3.5vw', top: '52vh', width: '19vw', transform: 'rotate(3deg)' }}>
            <img src={mac('caixinha')} alt="" loading="lazy" />
          </div>
          <div className="fh-pin hide-s" data-par="1.6" style={{ left: '15vw', bottom: '5vh', width: '15vw', transform: 'rotate(2.5deg)' }}>
            <img src={mac('cesto')} alt="" loading="lazy" />
          </div>
          <div
            className="fh-pin z hide-s"
            data-par="-1.4"
            data-z={`${mac('tigela-grande')}|.10|.61|.40|.30|${WH}`}
            style={{ right: '26vw', bottom: '6vh', width: '12vw', transform: 'rotate(-2deg)' }}
          />
          <div className="fh-k mono" style={{ position: 'absolute', left: '4vw', top: 74, zIndex: 6 }}>
            <span className="pill"></span>
            <span className="pill" style={{ background: '#FF3D8B' }}>
              Pesquisa em andamento
            </span>
          </div>
          <div className="fh-core">
            <div className="sb">
              <SearchIcon />
              <span className="sb-t">
                <span data-typed />
                <i className="caret" />
              </span>
              <span className="sb-x">✕</span>
            </div>
            <div className="chips" data-chips>
              {chips.map((chip) => (
                <span key={chip} className="chip">
                  {chip}
                </span>
              ))}
            </div>
            <div className="fh-sub serif" data-fh-sub style={{ fontSize: 'clamp(20px, 2vw, 30px)' }}>
              Calma: não é massa. É fio, conta e fome de cor.
            </div>
          </div>
          <div className="fh-hint mono pill" data-fh-hint>
            Role para pesquisar ↓
          </div>
        </div>
      </section>

      <section className="feed" data-feed data-screen-label="1 · Feed" aria-label="1 · Feed">
        <div className="fbar" data-fbar>
          <SearchIcon />
          <b>
            receita de <mark>miçanga</mark> · 12 pins
          </b>
          <span className="cnt mono">
            <i>♥</i> <span data-count>0</span> salvos
          </span>
        </div>
        <div className="cols" data-cols>
          <div className="col" data-col="0">
            <PhotoPin
              file="tigela-cima"
              alt="Tigela de miçangas vista de cima, com hashi e frutas ao redor"
              title="Primeiro prato"
              saves="2,4 mil salvos"
              ring={{ left: '50%', top: '48%', width: '48%', height: '36%' }}
              label={{ text: 'macarrão ≠ miçanga', small: '312 contas al dente', style: { left: '3%', bottom: '9%' } }}
            />
            <PhotoPin
              file="maos-contas"
              alt="Mãos enfiando miçangas coloridas em um fio, com potinhos de contas na mesa"
              title="Mise en place"
              saves="1,1 mil salvos"
              ring={{ left: '53%', top: '33%', width: '30%', height: '22%' }}
              label={{ text: 'feito à mão', small: 'sem pressa', style: { right: '4%', bottom: '30%' } }}
            />
            <article className="pin" data-pin>
              <div className="card" style={{ background: '#fff' }}>
                <h3 className="display">Comentários</h3>
                <div className="cm">
                  <div>
                    <i style={{ background: '#FFB3DA' }}>M</i>
                    <span>
                      <b>marina.m</b>isso é macarrão??
                    </span>
                  </div>
                  <div>
                    <i style={{ background: '#F4FF7A' }}>C</i>
                    <span>
                      <b>ceu.nebulosa</b>é miçanga. tem textura de pérola e tudo.
                    </span>
                  </div>
                  <div>
                    <i style={{ background: '#B6E8FF' }}>L</i>
                    <span>
                      <b>lu_cores</b>quero a receita pra ontem
                    </span>
                  </div>
                </div>
              </div>
            </article>
            <PhotoPin
              file="garra"
              alt="Máquina de garra cheia de miçangas, com a garra segurando um fio"
              title="Máquina de garra"
              saves="4,2 mil salvos"
              ring={{ left: '53%', top: '19%', width: '28%', height: '17%' }}
              label={{ text: 'pegue 1', small: 'ganhe fome', style: { left: '4%', top: '8%' } }}
            />
            <PhotoPin
              file="vasos"
              alt="Dois vasinhos de cerâmica com pompons de miçanga e carinhas sorridentes"
              title="Vasinhos de mesa"
              saves="870 salvos"
              ring={{ left: '78%', top: '28%', width: '17%', height: '22%' }}
              label={{ text: 'saladinha', small: 'de pompom', style: { left: '4%', bottom: '10%' } }}
            />
          </div>

          <div className="col" data-col="1" style={{ marginTop: '9vh' }}>
            <article className="pin" data-pin>
              <div className="card" style={{ background: '#F4FF7A' }}>
                <div className="mono" style={{ marginBottom: 8 }}>
                  Receita · serve 1 pescoço
                </div>
                <h3 className="display">
                  Macarrão de <span className="serif" style={{ color: '#FF3D8B' }}>miçanga</span>
                </h3>
                <ul>
                  <li><i>1</i>312 miçangas variadas</li>
                  <li><i>2</i>1 fio encerado, bem comprido</li>
                  <li><i>3</i>2 hashi de bambu</li>
                  <li><i>4</i>1 tigela escura</li>
                  <li><i>5</i>Fome de cor, a gosto</li>
                </ul>
              </div>
            </article>
            <PhotoPin
              file="fio-no-ar"
              alt="Hashi erguendo um fio longo de miçangas coloridas sobre a tigela"
              title="Hashi no ponto"
              saves="3,8 mil salvos"
              ring={{ left: '55%', top: '70%', width: '24%', height: '22%' }}
              label={{ text: 'al dente', small: 'ponto de colar', style: { right: '3%', bottom: '10%' } }}
            />
            <article className="pin" data-pin>
              <div className="card" style={{ background: '#fff' }}>
                <div className="mono" style={{ marginBottom: 10 }}>
                  Paleta do prato
                </div>
                <div className="sw">
                  <div><i style={{ background: '#FF5BC0' }} />Rosa-choque</div>
                  <div><i style={{ background: '#14B1FF' }} />Azul-piscina</div>
                  <div><i style={{ background: '#3DE877' }} />Verde-pistache</div>
                  <div><i style={{ background: '#FFCB1F' }} />Amarelo-gema</div>
                  <div><i style={{ background: '#B6A4FF' }} />Lilás-bala</div>
                  <div><i style={{ background: '#FF7A3D' }} />Laranja-manga</div>
                </div>
              </div>
            </article>
            <PhotoPin
              file="copinho"
              alt="Copo rosa com o olho da marca, transbordando miçangas, com tampa prateada aberta"
              title="Para viagem"
              saves="2,9 mil salvos"
              ring={{ left: '43%', top: '67%', width: '40%', height: '20%' }}
              label={{ text: 'tamanho M', small: 'cabe na bolsa', style: { right: '4%', top: '9%' } }}
            />
            <PhotoPin
              file="cesto"
              alt="Montanha de miçangas sobre um cesto de bambu, com fios pendurados nos hashis"
              title="Cesto de bambu"
              saves="1,6 mil salvos"
              ring={{ left: '60%', top: '28%', width: '20%', height: '18%' }}
              label={{ text: 'no vapor', small: 'flores e carinhas', style: { left: '4%', bottom: '8%' } }}
            />
          </div>

          <div className="col" data-col="2" style={{ marginTop: '3vh' }}>
            <ZoomPin file="close-fios" crop=".20|.16|.55|.4125" />
            <PhotoPin
              file="tigela-grande"
              alt="Tigela grande de yakisoba de miçanga, com ovo de flor, alga e gengibre rosa"
              title="Prato principal"
              saves="5,1 mil salvos"
              ring={{ left: '77%', top: '41%', width: '12%', height: '24%' }}
              label={{ text: 'yakisoba', small: 'com letrinhas', style: { left: '3%', top: '10%' } }}
            />
            <ZoomPin file="caixinha" crop=".27|.60|.46|.345" />
            <PhotoPin
              file="boca"
              alt="Mulher de perfil provando um fio de miçangas pendurado em um hashi"
              title="Prova real"
              saves="6,3 mil salvos"
              ring={{ left: '36%', top: '42%', width: '24%', height: '36%' }}
              label={{ text: 'mordeu?', small: 'é só olhar', style: { right: '4%', bottom: '9%' } }}
            />
            <PhotoPin
              file="caixinha"
              alt="Caixinha de delivery rosa da Nebulosa transbordando miçangas"
              title="Caixinha delivery"
              saves="3,3 mil salvos"
              ring={{ left: '50%', top: '70%', width: '36%', height: '20%' }}
              label={{ text: 'para levar', small: 'com hashi e tudo', style: { left: '3%', top: '7%' } }}
            />
          </div>
        </div>
      </section>

      <section className="fin" data-fin data-screen-label="1 · Servido" aria-label="1 · Servido">
        <div className="fin-stage">
          <div className="dots" />
          <svg className="fin-svg" data-fin-svg />
          <div className="fin-t">
            <h2 className="display">
              Servido<em>.</em>
            </h2>
            <div className="fin-lk">
              <a href="#ed-dia" onClick={(event) => go(event, onTop)}>
                ↑ Voltar ao início
              </a>
              <a className="pk" href="#ed-mesa" onClick={(event) => go(event, onReplay)}>
                Rever a busca ↺
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
