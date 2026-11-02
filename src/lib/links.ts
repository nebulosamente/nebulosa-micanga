/**
 * Links entre os sites. 3D, Colagem, Micanga (Editorial) e a home são deploys separados,
 * então todo link entre eles é uma URL completa.
 *
 * Cada URL pode ser trocada por variável de ambiente (veja o README). Sem a variável, aponta para o site
 * atual em nebulosa.art, então nada quebra enquanto os deploys novos não existem.
 * O link para este próprio site é sempre relativo (`/`).
 */
export type SiteId = 'home' | '3d' | 'colagem' | 'micanga'

export type Navigate = (site: SiteId) => void

const SELF = 'micanga' as SiteId
const LEGACY_ORIGIN = 'https://nebulosa.art'

function pick(value: string | undefined, fallback: string) {
  const url = (value ?? '').trim() || fallback
  return url.replace(/\/+$/, '') || '/'
}

const SITE_URLS: Record<SiteId, string> = {
  home: pick(import.meta.env.VITE_URL_HOME, LEGACY_ORIGIN),
  '3d': pick(import.meta.env.VITE_URL_3D, SELF === '3d' ? '/' : `${LEGACY_ORIGIN}/3d`),
  colagem: pick(import.meta.env.VITE_URL_COLAGEM, SELF === 'colagem' ? '/' : `${LEGACY_ORIGIN}/colagem`),
  micanga: pick(import.meta.env.VITE_URL_MICANGA, SELF === 'micanga' ? '/' : `${LEGACY_ORIGIN}/editorial`),
}

export function siteUrl(site: SiteId) {
  return SITE_URLS[site]
}

/** Sai desta página e abre outro site. */
export const navigateTo: Navigate = (site) => {
  window.location.assign(siteUrl(site))
}

/** Clique simples com o botão esquerdo: o único que a gente intercepta (Ctrl/⌘/Shift abrem em outra aba). */
export function isPlainLeftClick(e: {
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  button: number
}) {
  return !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0
}
