import { Link } from 'react-router'

// Pages légales (contenu fourni plus tard par un cabinet spécialisé)
const legalLinks = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/donnees-personnelles', label: 'Données personnelles' },
  { to: '/accessibilite', label: 'Accessibilité' },
  { to: '/cookies', label: 'Cookies' },
]

const annee = new Date().getFullYear()

/**
 * Pied de page identique sur toutes les pages : coordonnées de l'antenne de
 * Lyon et menu des pages légales.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__primary">
        <div className="container">
          <div className="row gy-4">
            <div className="col-md-6">
              <h2 className="site-footer__title">Région Auvergne-Rhône-Alpes</h2>
              <p className="mb-0">Antenne de Lyon</p>
              <address className="mb-0">
                101 cours Charlemagne
                <br />
                CS 20033
                <br />
                69269 LYON CEDEX 02
                <br />
                France
                <br />
                <a href="tel:+33426734000" className="site-footer__link">
                  +33 (0)4 26 73 40 00
                </a>
              </address>
            </div>
            <div className="col-md-6">
              <h2 className="site-footer__title">Trouve ton artisan</h2>
              <p className="mb-0">
                La plateforme de la Région pour trouver un artisan près de chez vous et le contacter en ligne.
                Une réponse vous est apportée sous 48h.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer__secondary">
        <div className="container">
          <nav aria-label="Informations légales">
            <ul className="legal-menu">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="site-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="site-footer__copyright mb-0">© {annee} Région Auvergne-Rhône-Alpes</p>
        </div>
      </div>
    </footer>
  )
}
