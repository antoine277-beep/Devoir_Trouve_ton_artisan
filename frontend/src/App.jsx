import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ArtisanList from './pages/ArtisanList'
import ArtisanDetail from './pages/ArtisanDetail'
import LegalPage from './pages/LegalPage'
import NotFound from './pages/NotFound'
import { getCategories } from './api'

/**
 * Structure commune à toutes les pages (header, contenu, footer)
 * et liste des pages du site.
 */
export default function App() {
  // Catégories du menu, chargées une seule fois depuis la base de données
  // (null tant qu'elles ne sont pas arrivées)
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  return (
    <>
      {/* Lien d'évitement : permet d'aller directement au contenu au clavier */}
      <a href="#contenu" className="visually-hidden-focusable">
        Aller au contenu
      </a>

      <Header categories={categories} />

      <main id="contenu" className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorie/:id" element={<ArtisanList categories={categories} />} />
          <Route path="/recherche" element={<ArtisanList categories={categories} />} />
          <Route path="/artisan/:id" element={<ArtisanDetail />} />
          <Route path="/mentions-legales" element={<LegalPage titre="Mentions légales" />} />
          <Route path="/donnees-personnelles" element={<LegalPage titre="Données personnelles" />} />
          <Route path="/accessibilite" element={<LegalPage titre="Accessibilité" />} />
          <Route path="/cookies" element={<LegalPage titre="Cookies" />} />
          {/* Toute autre adresse : page 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}
