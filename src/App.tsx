import { Editorial } from './components/sections/Editorial'
import { EDITORIAL_MESA_ROUTE } from './data/editorial'
import { useMobileReveal } from './hooks/useMobileReveal'
import { navigateTo } from './lib/links'

function App() {
  useMobileReveal()
  // A página é uma só; o endereço da mesa (link antigo do feed) só abre rolando até a seção.
  const onMesa = window.location.pathname.replace(/\/+$/, '') === EDITORIAL_MESA_ROUTE
  return <Editorial onNavigate={navigateTo} startAt={onMesa ? 'mesa' : 'dia'} />
}

export default App
