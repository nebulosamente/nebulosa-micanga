# nebulosa-micanga

Projeto 03 · Editorial do portfólio Nebulosa. Editorial Nebulosa: miçanga, figurino e cenografia.

Este repositório saiu do monorepo `nebulosa`, que juntava a home, o 3D, a Colagem e o Micanga (Editorial) num app só.
Agora cada site é independente e vai para o ar sozinho.

A página abre no topo (`/`). O endereço `/banquete` abre já rolado até a seção da mesa (era `/editorial/banquete` no repositório único).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4

## Desenvolvimento

```bash
npm install
npm run dev      # http://127.0.0.1:4337
npm run build    # tsc -b && vite build, saída em dist/
npm run preview  # http://127.0.0.1:4338
npm run lint
```

As portas são diferentes em cada um dos três repositórios para dar para rodar todos ao mesmo tempo.

## Estrutura do código

```
src/
  main.tsx, App.tsx     entrada e página única
  components/
    sections/           Editorial (página) e as seções: Feed, Peças, Lightbox, Stickers
  data/editorial.ts     textos, peças e caminhos das imagens
  hooks/                useEditorialDia / Mesa / Pecas (cenas por rolagem), useCarouselAutoplay,
                        useBodyScrollLock, useMobileReveal, mobile
  lib/                  carousel (pose e constantes do giro), format, click (clique simples),
                        editorial-flora.js e editorial-beads.js (plantas e miçangas em SVG)
  styles/               index.css, mobile.css, editorial.css, editorialPecas.css
public/media/editorial/ imagens usadas: nebulosa/, macarrao/ e 3 recortes
```

## Deploy

`vercel.json` reescreve qualquer caminho para `index.html` (SPA). As metatags de compartilhamento ganham a URL
absoluta do deploy automaticamente (`VERCEL_PROJECT_PRODUCTION_URL`).

## Identidade visual

Paleta: fundo `#07060A`, papel `#F4F2F8`, acentos violeta `#8C52FF`, verde `#3DE877`, azul `#14B1FF`, âmbar `#F9A01B`,
magenta `#FF2FD0`. Tipografia: Bricolage Grotesque, Instrument Serif, JetBrains Mono.
