import { useEffect } from 'react'

const SITE_NAME = 'Trouve ton artisan'

/** Crée la balise <meta name="..."> si elle n'existe pas encore. */
function getMeta(name) {
  let meta = document.head.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  return meta
}

/**
 * Référencement : titre et description de la page pour les moteurs de recherche.
 *
 * @param {{ title: string, description: string, noIndex?: boolean }} props
 * noIndex : demande aux moteurs de ne pas indexer la page (404, résultats de recherche)
 */
export default function Seo({ title, description, noIndex = false }) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} ! | Région Auvergne-Rhône-Alpes`
    getMeta('description').setAttribute('content', description)
    getMeta('robots').setAttribute('content', noIndex ? 'noindex, follow' : 'index, follow')
  }, [title, description, noIndex])

  return null
}
