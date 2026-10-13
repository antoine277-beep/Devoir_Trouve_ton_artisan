import { Link } from 'react-router'

/**
 * Pied de page identique sur toutes les pages : menu des pages légales
 * et coordonnées de l'antenne de Lyon.
 */
export default function Footer() {
  return (
    <footer className="footer bg-primary text-white py-4">
      <div className="container">
        <nav aria-label="Informations légales">
          <ul className="list-inline">
            <li className="list-inline-item me-3">
              <Link to="/mentions-legales">Mentions légales</Link>
            </li>
            <li className="list-inline-item me-3">
              <Link to="/donnees-personnelles">Données personnelles</Link>
            </li>
            <li className="list-inline-item me-3">
              <Link to="/accessibilite">Accessibilité</Link>
            </li>
            <li className="list-inline-item">
              <Link to="/cookies">Cookies</Link>
            </li>
          </ul>
        </nav>

        <address className="mb-0">
          101 cours Charlemagne
          <br />
          CS 20033
          <br />
          69269 LYON CEDEX 02
          <br />
          France
          <br />
          +33 (0)4 26 73 40 00
        </address>
      </div>
    </footer>
  )
}
