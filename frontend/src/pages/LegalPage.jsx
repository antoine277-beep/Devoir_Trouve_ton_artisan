import { Link } from 'react-router'

import Seo from '../components/Seo'

/**
 * Pages légales (mentions légales, données personnelles, accessibilité, cookies).
 * Leur contenu sera rédigé plus tard par un cabinet spécialisé.
 *
 * @param {{ titre: string }} props
 */
export default function LegalPage({ titre }) {
  return (
    <>
      <Seo
        title={titre}
        description={`${titre} de la plateforme Trouve ton artisan de la région Auvergne-Rhône-Alpes.`}
      />
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">{titre}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="empty-state">
            <p className="h4 mb-2">Page en construction</p>
            <p>Le contenu de cette page sera bientôt disponible. Merci de votre patience.</p>
            <Link to="/" className="btn btn-primary">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
