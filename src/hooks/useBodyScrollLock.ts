import { useEffect } from 'react'

/** Trava a rolagem da página enquanto `locked` for verdadeiro e restaura o valor anterior ao soltar. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}
