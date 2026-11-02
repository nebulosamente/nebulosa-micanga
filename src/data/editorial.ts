/** Endereço que abre a página já rolada até a mesa (link antigo do feed). */
export const EDITORIAL_MESA_ROUTE = '/banquete'

export const ED_MEDIA = '/media/editorial'

/** Fotos do macarrão de miçanga (webp, 3:4 salvo indicação). */
export const ED_MACARRAO = `${ED_MEDIA}/macarrao`
/** Fotos de produto da coleção Nebulosa: calça, chapéu e pulseira. */
export const ED_NEBULOSA = `${ED_MEDIA}/nebulosa`

export type EdPieceId = 'calca' | 'chapeu' | 'pulseira'

export type EdSlide = {
  src: string
  label: string
  alt: string
}

export type EdPiece = {
  id: EdPieceId
  name: string
  blurb: string
  slides: readonly EdSlide[]
}

const nb = (file: string) => `${ED_NEBULOSA}/${file}.webp`

export const ED_PIECES: readonly EdPiece[] = [
  {
    id: 'calca',
    name: 'Calça',
    blurb: 'Jeans largo com cortina de miçanga no joelho: balança quando você anda.',
    slides: [
      { src: nb('calca-8'), label: 'Look completo', alt: 'Modelo de calça jeans com cortina de miçanga, segurando uma câmera' },
      { src: nb('calca-3'), label: 'Frente ¾', alt: 'Calça jeans com cortina de miçanga no joelho, vista de frente' },
      { src: nb('calca-4'), label: 'Perfil ¾', alt: 'Calça jeans com cortina de miçanga, em três quartos' },
      { src: nb('calca-1'), label: 'Perfil', alt: 'Calça jeans, perfil, com fios de miçanga no joelho' },
      { src: nb('calca-2'), label: 'Joelho', alt: 'Detalhe da cortina de miçanga no joelho da calça' },
      { src: nb('calca-6'), label: 'Costas', alt: 'Calça jeans, costas, com cortina de miçanga' },
      { src: nb('calca-5'), label: 'Costas ¾', alt: 'Calça jeans, três quartos de costas' },
    ],
  },
  {
    id: 'chapeu',
    name: 'Chapéu',
    blurb: 'Bucket preto de tela, com fio de contas, estrela e o nome Nebulosa em letrinhas.',
    slides: [
      { src: nb('chapeu-1'), label: 'No look', alt: 'Modelo ajustando o chapéu bucket preto com fio de miçanga' },
      { src: nb('chapeu-2'), label: 'Sorriso', alt: 'Chapéu bucket cobrindo os olhos, sorriso aparecendo' },
      { src: nb('chapeu-3'), label: 'Pedestal', alt: 'Chapéu bucket preto sobre pedestal, fundo amarelo' },
      { src: nb('chapeu-4'), label: 'Letrinhas', alt: 'Detalhe do fio de contas com as letras NEBULOSA' },
      { src: nb('manequim-1'), label: 'Manequim ¾', alt: 'Chapéu no manequim, em três quartos, fundo lilás' },
      { src: nb('manequim-2'), label: 'Manequim frente', alt: 'Chapéu no manequim, vista frontal' },
      { src: nb('manequim-3'), label: 'Manequim perfil', alt: 'Chapéu no manequim, outro perfil' },
    ],
  },
  {
    id: 'pulseira',
    name: 'Pulseira',
    blurb: 'Macramê neon com pingente de girassol e bússola: empilha à vontade.',
    slides: [
      { src: nb('pulseira-1'), label: 'Pilha', alt: 'Pulseiras de macramê neon sobre fundo rosa' },
      { src: nb('pulseira-2'), label: 'No cilindro', alt: 'Pulseiras empilhadas em um cilindro branco' },
      { src: nb('pulseira-3'), label: 'Detalhe', alt: 'Pulseiras de macramê com girassol e bússola, fundo azul' },
    ],
  },
] as const

export type EdGroup = {
  /** Nome da cor de fundo das fotos do grupo. */
  name: string
  color: string
  photos: readonly [EdSlide, EdSlide]
}

/** Fotos separadas pela cor do fundo, para o mural sobre o verde. */
export const ED_GRUPOS: readonly EdGroup[] = [
  {
    name: 'Azul-piscina',
    color: '#14B1FF',
    photos: [
      { src: nb('calca-8'), label: 'Calça', alt: 'Look de calça jeans com cortina de miçanga sobre céu azul' },
      { src: nb('calca-4'), label: 'Calça', alt: 'Calça jeans em três quartos sobre céu azul' },
    ],
  },
  {
    name: 'Amarelo-gema',
    color: '#FFCB1F',
    photos: [
      { src: nb('chapeu-3'), label: 'Chapéu', alt: 'Chapéu bucket preto sobre pedestal, fundo amarelo' },
      { src: nb('chapeu-4'), label: 'Chapéu', alt: 'Detalhe das letrinhas NEBULOSA no chapéu, fundo amarelo' },
    ],
  },
  {
    name: 'Lilás-bala',
    color: '#B6A4FF',
    photos: [
      { src: nb('manequim-1'), label: 'Chapéu', alt: 'Chapéu no manequim, fundo lilás' },
      { src: nb('manequim-3'), label: 'Chapéu', alt: 'Chapéu no manequim, outro perfil, fundo lilás' },
    ],
  },
  {
    name: 'Rosa-choque',
    color: '#FF5BC0',
    photos: [
      { src: nb('pulseira-1'), label: 'Pulseira', alt: 'Pulseiras de macramê neon sobre fundo rosa' },
      { src: nb('pulseira-2'), label: 'Pulseira', alt: 'Pulseiras empilhadas em cilindro branco, fundo rosa' },
    ],
  },
] as const

export const ED_PECAS_COPY = {
  index: '(02) Peças',
  titleLead: 'Vista, gire, ',
  titleEm: 'repita.',
  hint: 'Role ou arraste ↔',
  prev: 'Anterior',
  next: 'Próxima',
  view: 'Vista',
  play: '▶ girar sozinho',
  pause: '❚❚ pausar giro',
  enlarge: 'Ampliar',
  close: 'Fechar',
  lightbox: 'Foto ampliada',
  prevView: 'Foto anterior',
  nextView: 'Próxima foto',
  numeral: '02',
} as const

/** Manifesto que acende palavra por palavra. Palavras com `hl` ganham marca-texto colorida. */
export const ED_MANIFESTO: readonly { w: string; hl?: 'sky' | 'lemon' | 'pink' | 'white' }[] = [
  { w: 'Calça' },
  { w: 'que' },
  { w: 'vira' },
  { w: 'cortina.', hl: 'sky' },
  { w: 'Chapéu' },
  { w: 'que' },
  { w: 'vira' },
  { w: 'colar.', hl: 'lemon' },
  { w: 'Pulseira' },
  { w: 'que' },
  { w: 'vira' },
  { w: 'papo.', hl: 'pink' },
  { w: 'E' },
  { w: 'a' },
  { w: 'miçanga?' },
  { w: 'Vai' },
  { w: 'direto' },
  { w: 'pro' },
  { w: 'prato.', hl: 'white' },
]
