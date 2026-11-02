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

## Links entre os sites

Os links para a home e para os outros dois sites são URLs completas, definidas em `src/lib/links.ts`.
Para apontar para os deploys novos, defina estas variáveis de ambiente (na Vercel: Project Settings → Environment Variables)
e faça um novo build:

| Variável | Site | Se não definir |
| --- | --- | --- |
| `VITE_URL_HOME` | Home | `https://nebulosa.art` |
| `VITE_URL_3D` | 3D | `https://nebulosa.art/3d` |
| `VITE_URL_COLAGEM` | Colagem | `https://nebulosa.art/colagem` |
| `VITE_URL_MICANGA` | Micanga (Editorial) | `https://nebulosa.art/editorial` |

O link para o próprio site é sempre `/`. Exemplo: `VITE_URL_3D=https://3d.nebulosa.art npm run build`.

## Deploy

`vercel.json` reescreve qualquer caminho para `index.html` (SPA). As metatags de compartilhamento ganham a URL
absoluta do deploy automaticamente (`VERCEL_PROJECT_PRODUCTION_URL`).

## Identidade visual

Paleta: fundo `#07060A`, papel `#F4F2F8`, acentos violeta `#8C52FF`, verde `#3DE877`, azul `#14B1FF`, âmbar `#F9A01B`,
magenta `#FF2FD0`. Tipografia: Bricolage Grotesque, Instrument Serif, JetBrains Mono.
