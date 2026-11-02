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
