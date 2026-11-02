import { useEffect, type RefObject } from 'react'
import '../lib/editorial-beads.js'

type Strand = { setP: (progress: number) => void }

const beads = () => (window as unknown as { Beads: { strand: (svg: SVGSVGElement, opts: object) => Strand } }).Beads

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const sm = (t: number) => t * t * (3 - 2 * t)
const rp = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
const FULL = 'receita de macarrão'

export function useEditorialMesa(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = (s: string) => root.querySelector(s)
    const qa = (s: string) => [...root.querySelectorAll<HTMLElement>(s)]
    const small = () => innerWidth < 760
    let mx = 0
    let my = 0
    let tmx = 0
    let tmy = 0
    let raf = 0
    let alive = true

    qa('[data-z]').forEach((el) => {
      const parts = (el.dataset.z || '').split('|')
      const src = parts[0]
      const rx = +parts[1]
      const ry = +parts[2]
      const rw = +parts[3]
      const rh = +parts[4]
      const W = +parts[5]
      const H = +parts[6]
      el.style.backgroundImage = `url(${src})`
      el.style.backgroundSize = `${100 / rw}% auto`
      el.style.backgroundPosition = `${(rx / (1 - rw)) * 100}% ${(ry / (1 - rh)) * 100}%`
      if (!el.style.aspectRatio) el.style.aspectRatio = String((rw * W) / (rh * H))
      el.classList.add('zoomed')
    })

    let saved = 0
    const cnt = q('[data-count]')
    const onSave = (event: Event) => {
      event.preventDefault()
      const button = event.currentTarget as HTMLButtonElement
      const on = button.classList.toggle('on')
      button.textContent = on ? 'Salvo ✓' : 'Salvar'
      saved += on ? 1 : -1
      if (cnt) cnt.textContent = String(saved)
    }
    const saves = qa('[data-save]')
    saves.forEach((button) => button.addEventListener('click', onSave))

    const S = {
      fh: q('[data-fh]') as HTMLElement,
      svg: q('[data-fh-svg]') as SVGSVGElement,
      typed: q('[data-typed]') as HTMLElement,
      chips: q('[data-chips]') as HTMLElement,
      sub: q('[data-fh-sub]') as HTMLElement,
      hint: q('[data-fh-hint]') as HTMLElement,
      pins: qa('.fh-pin'),
      feed: q('[data-feed]') as HTMLElement,
      cols: qa('[data-col]'),
      cp: qa('[data-pin]'),
      fin: q('[data-fin]') as HTMLElement,
      fsvg: q('[data-fin-svg]') as SVGSVGElement,
    }
    let strand: Strand
    let neck: Strand

    const build = () => {
      const vw = innerWidth
      const vh = innerHeight
      const narrow = small()
      S.svg.innerHTML = ''
      S.fsvg.innerHTML = ''
      S.svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
      S.fsvg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
      // A seção agora vive no meio da página: a posição da barra é medida
      // em relação ao palco (e não à viewport) para não depender do scroll atual.
      const bar = root.querySelector('.sb')!.getBoundingClientRect()
      const stageTop = root.querySelector('.fh-stage')!.getBoundingClientRect().top
      const sx = vw * (narrow ? 0.84 : 0.8)
      const ex = vw * 0.5
      const ey = bar.top - stageTop + bar.height * 0.4
      const d = `M ${sx} -30 C ${sx + vw * 0.02} ${vh * 0.16}, ${vw * (narrow ? 0.96 : 0.92)} ${vh * 0.26}, ${vw * 0.72} ${vh * 0.3} S ${vw * 0.16} ${vh * 0.18}, ${vw * 0.26} ${vh * 0.3} S ${vw * 0.44} ${vh * 0.32}, ${ex} ${ey}`
      const r = clamp(vw * 0.0085, 6.5, 12)
      strand = beads().strand(S.svg, { d, r, seed: 11, threadW: 2.2 })
      const hs = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      hs.innerHTML = `<g transform="translate(${sx} -30) rotate(8)"><rect x="-26" y="-140" width="9" height="176" rx="4" fill="#E2B984" stroke="#17141A" stroke-width="2.4" transform="rotate(-4)"/><rect x="-6" y="-150" width="9" height="190" rx="4" fill="#E2B984" stroke="#17141A" stroke-width="2.4" transform="rotate(5)"/></g>`
      S.svg.appendChild(hs)
      const txt = narrow ? 'MIÇANGA' : 'MACARRÃO DE MIÇANGA'
      const fd = `M ${vw * 0.035} ${vh * 0.13} Q ${vw / 2} ${vh * (narrow ? 0.8 : 0.88)} ${vw * 0.965} ${vh * 0.13}`
      const fn = txt.length * 2 + 2
      const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      probe.setAttribute('d', fd)
      S.fsvg.appendChild(probe)
      const flen = probe.getTotalLength()
      S.fsvg.removeChild(probe)
      neck = beads().strand(S.fsvg, { d: fd, n: fn, r: flen / fn / 2.05, seed: 5, text: txt, threadW: 3 })
    }
    build()
    // No mobile, a barra do navegador aparece/some durante a rolagem e dispara `resize` o tempo todo.
    // Reconstruir o fio de contas a cada quadro trava a página; espera a barra assentar.
    let resizeTimer = 0
    const onResize = () => {
      if (!small()) {
        build()
        return
      }
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 260)
    }
    addEventListener('resize', onResize)
    if (document.fonts?.ready) void document.fonts.ready.then(() => {
      if (alive) build()
    })

    const onMove = (e: PointerEvent) => {
      tmx = (e.clientX / innerWidth) * 2 - 1
      tmy = (e.clientY / innerHeight) * 2 - 1
    }
    addEventListener('pointermove', onMove)

    let lastTxt = ''
    const loop = () => {
      if (!alive) return
      const vh = innerHeight
      mx += (tmx - mx) * 0.06
      my += (tmy - my) * 0.06
      const narrow = small()

      const hr = S.fh.getBoundingClientRect()
      if (hr.bottom > -40 && hr.top < vh + 40) {
        const p = clamp(-hr.top / (hr.height - vh))
        let txt = ''
        let mark = false
        if (p < 0.3) txt = FULL.slice(0, Math.ceil((p / 0.3) * FULL.length))
        else if (p < 0.42) txt = FULL
        else if (p < 0.56) txt = FULL.slice(0, FULL.length - Math.ceil(rp(p, 0.42, 0.56) * 8))
        else if (p < 0.7) txt = `receita de ${'miçanga'.slice(0, Math.ceil(rp(p, 0.56, 0.7) * 7))}`
        else {
          txt = 'receita de miçanga'
          mark = true
        }
        const key = txt + mark
        if (key !== lastTxt) {
          lastTxt = key
          S.typed.innerHTML = mark ? 'receita de <mark>miçanga</mark>' : txt.replace(/ $/, '&nbsp;')
        }
        strand.setP(rp(p, 0.5, 0.92))
        S.chips.style.opacity = sm(rp(p, 0.72, 0.84)).toFixed(3)
        S.chips.style.transform = `translateY(${((1 - sm(rp(p, 0.72, 0.84))) * 12).toFixed(1)}px)`
        S.sub.style.opacity = sm(rp(p, 0.8, 0.92)).toFixed(3)
        S.hint.style.opacity = (1 - rp(p, 0, 0.08)).toFixed(3)
        S.pins.forEach((el) => {
          const k = +(el.dataset.par || 1)
          const rot = el.style.transform.match(/rotate\([^)]*\)/)
          const r = rot ? rot[0] : ''
          el.style.transform = `translate(${(mx * 14 * k).toFixed(1)}px,${(my * 10 * k + p * -40 * k).toFixed(1)}px) ${r}`
        })
      }

      const fr = S.feed.getBoundingClientRect()
      if (fr.bottom > -100 && fr.top < vh + 100) {
        const mid = fr.top + fr.height / 2 - vh / 2
        S.cols.forEach((c, i) => {
          if (!narrow) c.style.transform = `translateY(${(mid * [0, 0.05, -0.035][i]).toFixed(1)}px)`
        })
        S.cp.forEach((pn) => {
          const r = pn.getBoundingClientRect()
          if (r.bottom < -60 || r.top > vh + 60) return
          const k = sm(clamp((vh * 0.96 - r.top) / (vh * 0.3)))
          pn.style.opacity = k.toFixed(3)
          pn.style.transform = `translateY(${((1 - k) * 46).toFixed(1)}px) scale(${(0.96 + 0.04 * k).toFixed(3)})`
        })
      }

      const nr = S.fin.getBoundingClientRect()
      if (nr.bottom > -40 && nr.top < vh + 40) {
        const p = clamp(-nr.top / (nr.height - vh))
        neck.setP(rp(p, 0, 0.62))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimer)
      saves.forEach((button) => button.removeEventListener('click', onSave))
      S.svg.innerHTML = ''
      S.fsvg.innerHTML = ''
    }
  }, [rootRef])
}
