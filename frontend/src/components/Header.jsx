import { useState } from 'react'
import { Link, NavLink } from 'react-router'

import SearchBar from './SearchBar'
import logo from '../assets/images/logo.png'

/**
 * En-tête identique sur toutes les pages : logo (retour à l'accueil),
 * barre de recherche et menu des catégories (venant de la base de données).
 */
export default function Header({ categories }) {
  // Menu replié sur mobile : ouvert ou fermé
  const [menuOuvert, setMenuOuvert] = useState(false)
  const fermerMenu = () => setMenuOuvert(false)

  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header__inner">
          <Link to="/" className="site-header__logo" onClick={fermerMenu}>
            <img src={logo} width="640" height="138" alt="Trouve ton artisan, avec la région Auvergne-Rhône-Alpes : retour à l'accueil" />
          </Link>

          {/* Bouton visible uniquement sur mobile et tablette (d-lg-none) */}
          <button
            type="button"
            className="site-header__toggler d-lg-none"
            aria-expanded={menuOuvert}
            aria-controls="menu-principal"
            onClick={() => setMenuOuvert(!menuOuvert)}
          >
            <i className={menuOuvert ? 'bi bi-x-lg' : 'bi bi-list'} aria-hidden="true"></i> Menu
          </button>

          <div className="site-header__search">
            <SearchBar />
          </div>

          <nav
            id="menu-principal"
            className={menuOuvert ? 'site-header__nav is-open' : 'site-header__nav'}
            aria-label="Catégories d'artisanat"
          >
            <ul className="main-menu">
              {categories?.map((categorie) => (
                <li key={categorie.id_categorie}>
                  {/* NavLink ajoute la classe "active" sur le lien de la page en cours */}
                  <NavLink to={`/categorie/${categorie.slug}`} className="main-menu__link" onClick={fermerMenu}>
                    {categorie.nom}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
