import { useHideOnScroll } from '../../hooks/useHideOnScroll'
import { isPlainLeftClick, siteUrl } from '../../lib/links'

type EditorialNavProps = {
  onHome: () => void
}

export function EditorialNav({ onHome }: EditorialNavProps) {
  const hidden = useHideOnScroll()

  return (
    <nav className="nav" aria-label="Editorial" data-hidden={hidden ? 'true' : undefined}>
      <a
        className="nav-back"
        href={siteUrl('home')}
        onClick={(event) => {
          if (!isPlainLeftClick(event)) return
          event.preventDefault()
          onHome()
        }}
      >
        ← Início
      </a>
    </nav>
  )
}
