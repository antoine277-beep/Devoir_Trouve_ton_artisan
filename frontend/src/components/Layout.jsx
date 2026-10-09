import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'

import Header from './Header'
import Footer from './Footer'
import useApi from '../hooks/useApi'
import { getCategories } from '../api/client'

/**
 * Structure commune à toutes les pages : lien d'évitement, header, contenu, footer.
 */
export default function Layout() {
  // Les catégories du menu viennent de la base de données (chargées une seule fois)
  const categories = useApi(getCategories, [])

  const mainRef = useRef(null)
  const { pathname, search } = useLocation()
  const previousUrl = useRef(pathname + search)

  // Accessibilité : à chaque changement de page (pas au premier chargement),
  // le focus est placé sur le contenu principal pour que les lecteurs d'écran
  // annoncent la nouvelle page
  useEffect(() => {
    const url = pathname + search
    if (url !== previousUrl.current) {
      previousUrl.current = url
      mainRef.current?.focus()
    }
  }, [pathname, search])

  return (
    <>
      <a href="#contenu" className="visually-hidden-focusable skip-link">
        Aller au contenu
      </a>

      <Header categories={categories} />

      <main id="contenu" ref={mainRef} tabIndex={-1} className="main-content">
        <Outlet context={{ categories }} />
      </main>

      <Footer />
      <ScrollRestoration />
    </>
  )
}
