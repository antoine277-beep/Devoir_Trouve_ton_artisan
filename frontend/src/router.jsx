import { createBrowserRouter } from 'react-router'

import Layout from './components/Layout'
import Home from './pages/Home'
import ArtisanList from './pages/ArtisanList'
import ArtisanDetail from './pages/ArtisanDetail'
import LegalPage from './pages/LegalPage'
import NotFound from './pages/NotFound'

/**
 * Pages du site. Toute adresse qui ne correspond à aucune de ces routes
 * affiche la page 404 (route "*").
 * Les chemins sont repris dans backend/src/frontend.js pour le code HTTP 404.
 */
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/categorie/:slug', element: <ArtisanList mode="categorie" /> },
      { path: '/recherche', element: <ArtisanList mode="recherche" /> },
      { path: '/artisan/:id', element: <ArtisanDetail /> },
      { path: '/mentions-legales', element: <LegalPage titre="Mentions légales" /> },
      { path: '/donnees-personnelles', element: <LegalPage titre="Données personnelles" /> },
      { path: '/accessibilite', element: <LegalPage titre="Accessibilité" /> },
      { path: '/cookies', element: <LegalPage titre="Cookies" /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
