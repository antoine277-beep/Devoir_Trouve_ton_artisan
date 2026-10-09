import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

// Police de secours hébergée avec le site, utilisée si Graphik n'est pas installée
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-700.css'
// Icônes officielles de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'

import './styles/main.scss'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
