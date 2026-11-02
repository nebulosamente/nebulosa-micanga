import { useEffect, type RefObject } from 'react'
import '../lib/editorial-flora.js'
import '../lib/editorial-beads.js'

type Plant = { grow: (progress: number) => void; sway: (timeSec: number) => void }
type Strand = { setP: (progress: number) => void }
type FloraSpec = {
  type: string
  col: string | null
  x: number
  y: number
  h: number
  start: number
  bend: number
  dur: number
  center?: string
  dot?: string
}

const flora = () => (window as unknown as { Flora: { mount: (host: Element, specs: FloraSpec[]) => Plant[] } }).Flora
const beads = () => (window as unknown as { Beads: { strand: (svg: SVGSVGElement, opts: object) => Strand } }).Beads

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const sm = (t: number) => t * t * (3 - 2 * t)
const hx = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mixc = (a: string, b: string, t: number) => {
  const p = hx(a)
  const q = hx(b)
  return `rgb(${p.map((v, i) => Math.round(lerp(v, q[i], t))).join(',')})`
}
const rp = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
const win = (p: number, a: number, b: number, c: number, d: number) =>
  clamp((p - a) / (b - a)) * (1 - clamp((p - c) / (d - c)))

/** Progresso (na escala original da "mesa posta") em que o prato começa a aparecer. */
const TB_START = 0.2
/** Progresso em que a cena termina. */
const TB_SPAN = 0.8
/** Fração da viewport. A cena começa quando o topo do palco ainda está tão abaixo da dobra. */
const TB_LEAD = 0.5

const R = (
  type: string,
  col: string | null,
  x: number,
  y: number,
  h: number,
  start: number,
  bend: number,
  extra?: Partial<FloraSpec>,
): FloraSpec => ({ type, col, x, y, h, start, bend, dur: 0.3, ...extra })

const BLUE = { center: '#1F3BD1' }
const YEL = { center: '#FFC21A' }
const RED = { center: '#E0301E', dot: '#FFE066' }

const BACK = [
  R('foliage', null, 7, 6, 32, 0.02, 0, { start: 0.02, dur: 0.25 }),
  R('foliage', null, 29, 6, 30, 0.03, 0, { dur: 0.25 }),
  R('foliage', null, 72, 6, 30, 0.03, 0, { dur: 0.25 }),
  R('foliage', null, 94, 6, 32, 0.02, 0, { dur: 0.25 }),
  R('daisy', 'pink', 4, 8, 58, 0.05, -24, BLUE),
  R('peony', 'hot', 12, 8, 54, 0.09, 20),
  R('tulip', 'red', 19, 8, 50, 0.12, -18),
  R('bell', 'teal', 26, 8, 56, 0.14, 22),
  R('daisy', 'tang', 33, 8, 48, 0.17, -16, BLUE),
  R('daisy', 'violet', 40, 7, 52, 0.07, -12, YEL),
  R('tulip', 'lemon', 47, 8, 46, 0.1, 16),
  R('peony', 'lilac', 54, 7, 50, 0.08, -8),
  R('poppy', 'tang', 62, 8, 48, 0.16, 16),
  R('tulip', 'hot', 68, 8, 52, 0.14, -20),
  R('daisy', 'blue', 75, 8, 56, 0.11, 22, YEL),
  R('bell', 'pink', 82, 8, 54, 0.13, -22),
  R('peony', 'pink', 89, 8, 58, 0.08, 18),
  R('tulip', 'tang', 95, 8, 50, 0.05, -14),
]
const MID = [
  R('tulip', 'hot', 8, 5, 40, 0.24, 18),
  R('daisy', 'sun', 15, 5, 38, 0.28, -20, RED),
  R('poppy', 'red', 22, 5, 36, 0.3, 14),
  R('tulip', 'pink', 29, 5, 42, 0.33, -16),
  R('daisy', 'blue', 35, 5, 36, 0.36, 18, YEL),
  R('bell', 'tang', 40, 5, 38, 0.4, -12),
  R('peony', 'violet', 60, 2, 40, 0.18, 6),
  R('daisy', 'lemon', 46, 3, 32, 0.3, -16, RED),
  R('poppy', 'cream', 43, 4, 30, 0.32, 12),
  R('poppy', 'tang', 60, 5, 38, 0.38, 12),
  R('tulip', 'lilac', 63, 2, 36, 0.22, 14),
  R('tulip', 'red', 65, 5, 42, 0.34, -18),
  R('daisy', 'pink', 71, 5, 38, 0.3, 20, BLUE),
  R('tulip', 'sun', 78, 5, 40, 0.27, -14),
  R('peony', 'hot', 85, 5, 44, 0.24, 16),
  R('bell', 'teal', 92, 5, 40, 0.22, -18),
]
const FRONT = [
  R('foliage', null, 10, 0, 24, 0.5, 0, { dur: 0.3 }),
  R('foliage', null, 26, -1, 20, 0.52, 0, { dur: 0.3 }),
  R('foliage', null, 74, -1, 20, 0.52, 0, { dur: 0.3 }),
  R('foliage', null, 90, 0, 24, 0.5, 0, { dur: 0.3 }),
  R('daisy', 'hot', 3, 1, 46, 0.5, 22, { center: '#FFE066' }),
  R('peony', 'pink', 97, 1, 48, 0.52, -22),
  R('tulip', 'tang', 15, 1, 38, 0.58, 16),
  R('daisy', 'sun', 24, 0, 34, 0.48, 14, { center: '#8C52FF' }),
  R('tulip', 'violet', 34, 0, 32, 0.5, -16),
  R('peony', 'cream', 50, 0, 28, 0.54, 8),
  R('poppy', 'lilac', 66, 0, 32, 0.46, -10),
  R('bell', 'lemon', 72, 0, 30, 0.52, 12),
  R('daisy', 'blue', 85, 1, 36, 0.6, -18, YEL),
  R('foliage', null, 46, -1, 15, 0.62, 0, { dur: 0.25 }),
  R('foliage', null, 55, -1, 15, 0.64, 0, { dur: 0.25 }),
]

const PTS: Record<string, Array<[string, string | null, number, number, number, number, Partial<FloraSpec>]>> = {
  a: [
    ['foliage', null, 12, 16, 0, 0, {}],
    ['tulip', 'hot', 10, 40, 0.05, 16, {}],
    ['foliage', null, 88, 16, 0, 0, {}],
    ['daisy', 'sun', 90, 34, 0.08, -14, RED],
  ],
  b: [
    ['foliage', null, 12, 16, 0, 0, {}],
    ['daisy', 'blue', 14, 36, 0.06, -14, YEL],
    ['foliage', null, 90, 16, 0, 0, {}],
    ['tulip', 'red', 88, 38, 0.06, 14, {}],
  ],
  c: [
    ['foliage', null, 10, 16, 0, 0, {}],
    ['peony', 'hot', 12, 36, 0.06, -12, {}],
    ['foliage', null, 90, 16, 0, 0, {}],
    ['bell', 'teal', 88, 36, 0.08, 12, {}],
  ],
}

export function useEditorialDia(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = (s: string) => root.querySelector(s)
    const qa = (s: string) => [...root.querySelectorAll<HTMLElement>(s)]
    const small = innerWidth < 760
    let mx = 0
    let my = 0
    let tmx = 0
    let tmy = 0
    let pS = 0
    let raf = 0
    let alive = true

    const mk = (host: Element, rows: FloraSpec[]) =>
      flora().mount(
        host,
        rows.map((r) => ({ ...r, start: r.start + (Math.abs(r.x - 50) / 50) * 0.1 })),
      )
    const thin = (rows: FloraSpec[]) => (small ? rows.filter((r, i) => r.type === 'foliage' || i % 2 === 0) : rows)
    const plants = {
      back: mk(q('[data-l=back]')!, thin(BACK)),
      mid: mk(q('[data-l=mid]')!, thin(MID)),
      front: mk(q('[data-l=front]')!, thin(FRONT)),
    }
    const allPlants = plants.back.concat(plants.mid, plants.front)
    const cards = qa('[data-cd]').map((el) => ({
      el,
      plants: flora().mount(
        el.querySelector('[data-cf]')!,
        PTS[el.dataset.cd || 'a'].map(([type, col, x, h, start, bend, extra]) =>
          R(type, col, x, 0, h, start, bend, { dur: 0.5, ...extra }),
        ),
      ),
    }))

    const sp = q('[data-spiral]') as SVGSVGElement
    let dd = ''
    for (let i = 0; i <= 160; i++) {
      const t = i / 160
      const a = t * Math.PI * 2 * 3.1 - Math.PI / 2
      const r = 14 + t * 84
      dd += `${i ? ' L ' : 'M '}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`
    }
    const spiral = beads().strand(sp, { d: dd, r: 5.4, seed: 21, threadW: 1.4, thread: 'rgba(23,20,26,.55)' })

    const onMove = (e: PointerEvent) => {
      tmx = (e.clientX / innerWidth) * 2 - 1
      tmy = (e.clientY / innerHeight) * 2 - 1
    }
    addEventListener('pointermove', onMove)

    const S = {
      flo: q('[data-flo]') as HTMLElement,
      bg: q('[data-flo-bg]') as HTMLElement,
      sun: q('[data-flo-sun]') as HTMLElement,
      title: q('[data-flo-title]') as HTMLElement,
      char: q('[data-flo-char]') as HTMLElement,
      count: q('[data-flo-count]') as HTMLElement,
      caps: qa('[data-cap]'),
      lb: q('[data-l=back]') as HTMLElement,
      lm: q('[data-l=mid]') as HTMLElement,
      lf: q('[data-l=front]') as HTMLElement,
      clouds: qa('[data-cl]'),
      tb: q('[data-tb]') as HTMLElement,
      tbt: q('[data-tbt]') as HTMLElement,
      plate: q('[data-plate]') as HTMLElement,
      hashi: qa('[data-hashi]'),
    }
    let lastEst = ''

    const loop = (t: number) => {
      if (!alive) return
      const sec = t / 1000
      const vh = innerHeight
      const vw = innerWidth
      mx += (tmx - mx) * 0.06
      my += (tmy - my) * 0.06

      const fr = S.flo.getBoundingClientRect()
      if (fr.bottom > -40 && fr.top < vh + 40) {
        const p = clamp(-fr.top / (fr.height - vh))
        pS += (p - pS) * 0.14
        const g = pS
        const k = sm(clamp(g / 0.9))
        S.bg.style.background = `linear-gradient(180deg,${mixc('#9C9AD8', '#FFB78F', k)},${mixc('#E7DDF4', '#FFF0C9', k)})`
        S.sun.style.transform = `scale(${lerp(0.2, 1, sm(clamp(g / 0.5))).toFixed(4)}) translate(${(mx * 14).toFixed(1)}px,${(my * 10).toFixed(1)}px)`
        S.title.style.transform = `translateY(${(g * -4).toFixed(2)}vh)`
        S.clouds.forEach((c, i) => {
          const dir = i % 2 ? -1 : 1
          const depth = 0.5 + (i % 4) * 0.25
          c.style.transform = `translate(${(Math.sin(sec * 0.1 + i * 1.7) * 30 * depth + dir * g * 90 * depth + mx * 20 * depth).toFixed(1)}px,${(-g * 36 * depth).toFixed(1)}px)`
        })
        S.char.style.transform = `translateX(-50%) translate(${(mx * -9).toFixed(1)}px,${(my * -4).toFixed(1)}px)`
        S.lb.style.transform = `translate(${(mx * -7).toFixed(1)}px,${(g * 2).toFixed(2)}vh)`
        S.lm.style.transform = `translate(${(mx * -16).toFixed(1)}px,0)`
        S.lf.style.transform = `translate(${(mx * -32).toFixed(1)}px,${(g * -1.5).toFixed(2)}vh)`
        for (let i = 0; i < allPlants.length; i++) {
          const pl = allPlants[i]
          pl.grow(g)
          pl.sway(sec)
        }
        S.caps.forEach((c, i) => {
          const o = i === 0 ? win(g, -1, 0, 0.16, 0.26) : i === 1 ? win(g, 0.3, 0.4, 0.56, 0.66) : win(g, 0.72, 0.82, 1.1, 1.2)
          c.style.opacity = o.toFixed(3)
          c.style.transform = `translateX(-50%) translateY(${((1 - o) * 14).toFixed(1)}px)`
        })
        const est = g < 0.27 ? '01' : g < 0.62 ? '02' : '03'
        if (est !== lastEst) {
          lastEst = est
          S.count.textContent = `Estação ${est} / 03`
        }
      }

      cards.forEach((c) => {
        const r = c.el.getBoundingClientRect()
        if (r.bottom < -120 || r.top > vh + 120) return
        const g = clamp((vh * 0.98 - r.top) / (vh * 0.62))
        const f = sm(clamp(g / 0.55))
        c.el.style.transform = `perspective(1000px) rotateX(${((1 - f) * -72).toFixed(1)}deg) translateY(${((1 - f) * 40).toFixed(1)}px)`
        c.el.style.opacity = clamp(f * 2.2).toFixed(3)
        c.plants.forEach((pl) => {
          pl.grow(rp(g, 0.35, 1))
          pl.sway(sec)
        })
      })

      const tr = S.tb.getBoundingClientRect()
      if (tr.bottom > -40 && tr.top < vh + 40) {
        // A toalha já nasce estendida (borda recortada fixa em `.tb::before`), sem a tela verde vazia
        // esperando o pano subir. A cena começa quando o palco ainda está entrando na tela.
        const raw = clamp((-tr.top + vh * TB_LEAD) / (tr.height - vh + vh * TB_LEAD))
        const p = TB_START + raw * (TB_SPAN - TB_START)
        S.tbt.style.opacity = String(sm(rp(p, 0.5, 0.62)))
        S.tbt.style.transform = `translateY(${((1 - sm(rp(p, 0.5, 0.62))) * 24).toFixed(1)}px)`
        S.plate.style.transform = `scale(${sm(rp(p, 0.2, 0.42)).toFixed(3)}) rotate(${((1 - sm(rp(p, 0.2, 0.42))) * -40).toFixed(1)}deg)`
        spiral.setP(rp(p, 0.36, 0.8))
        const hs = sm(rp(p, 0.5, 0.76))
        const Rp = (small ? Math.min(0.4 * vh, 0.7 * vw) : Math.min(0.48 * vh, 0.38 * vw)) / 2
        const off = 0.042 * vh
        S.hashi.forEach((h, i) => {
          const cx = Rp * (small ? 0.42 : 0.74) + i * off * 0.616 + (1 - hs) * vw * 0.5
          const cy = Rp * 0.52 + i * off * 0.788
          h.style.transform = `translate(-50%,-50%) translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px) rotate(-38deg)`
          h.style.opacity = String(hs)
        })
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      ;['[data-l=back]', '[data-l=mid]', '[data-l=front]'].forEach((sel) => {
        const host = root.querySelector(sel)
        if (host) host.innerHTML = ''
      })
      root.querySelectorAll('[data-cf]').forEach((host) => {
        host.innerHTML = ''
      })
      sp.replaceChildren()
    }
  }, [rootRef])
}
