import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

import SearchBar from './SearchBar'
import Icon from './Icon'
import logo320 from '../assets/images/logo-320.png'
import logo640 from '../assets/images/logo-640.png'

/**
 * En-tête du site, identique sur toutes les pages :
 * logo (retour à l'accueil), menu des catégories et barre de recherche.
 *
 * @param {{ categories: { data: Array<{ id: number, nom: string, slug: string }> | null, error: Error | null } }} props
 */
export default function Header({ categories }) {
  const location = useLocation()

  // Le menu mobile est ouvert pour la page en cours uniquement :
  // il se referme donc tout seul quand on change de page
  const [menuOpenOn, setMenuOpenOn] = useState(null)
  const menuOpen = menuOpenOn === location.key

  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header__inner">
          <Link to="/" className="site-header__logo">
            <img
              src={logo320}
              srcSet={`${logo320} 320w, ${logo640} 640w`}
              sizes="(min-width: 992px) 280px, 220px"
              width="320"
              height="69"
              alt="Trouve ton artisan, avec la région Auvergne-Rhône-Alpes : retour à l'accueil"
            />
          </Link>

          <button
            type="button"
            className="site-header__toggler d-lg-none"
            aria-expanded={menuOpen}
            aria-controls="menu-principal"
            onClick={() => setMenuOpenOn(menuOpen ? null : location.key)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
            <span>Menu</span>
          </button>

          <div className="site-header__search">
            {/* key : le champ est réinitialisé avec la recherche de l'adresse à chaque nouvelle recherche */}
            <SearchBar key={location.search} />
          </div>

          <nav
            id="menu-principal"
            className={`site-header__nav ${menuOpen ? 'is-open' : ''}`}
            aria-label="Catégories d'artisanat"
          >
            {categories.error && (
              <p className="small text-danger mb-0">Le menu n'a pas pu être chargé.</p>
            )}
            <ul className="main-menu">
              {categories.data?.map((categorie) => (
                <li key={categorie.id}>
                  <NavLink to={`/categorie/${categorie.slug}`} className="main-menu__link">
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
