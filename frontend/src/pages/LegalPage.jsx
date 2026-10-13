import useSeo from '../hooks/useSeo'

/**
 * Pages légales (mentions légales, données personnelles, accessibilité, cookies).
 * Leur contenu sera rédigé plus tard par un cabinet spécialisé.
 */
export default function LegalPage({ titre }) {
  useSeo(titre, `${titre} de la plateforme Trouve ton artisan de la région Auvergne-Rhône-Alpes.`)

  return (
    <>
      <h1>{titre}</h1>
      <p>Page en construction.</p>
    </>
  )
}
