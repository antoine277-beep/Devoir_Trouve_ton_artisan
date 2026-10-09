import { useEffect } from 'react'

/**
 * Référencement : change le titre de l'onglet et la description de la page
 * (balise <meta name="description"> de index.html) pour les moteurs de recherche.
 */
export default function useSeo(titre, description) {
  useEffect(() => {
    document.title = `${titre} | Trouve ton artisan`
    document.querySelector('meta[name="description"]').setAttribute('content', description)
  }, [titre, description])
}
