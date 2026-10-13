import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'

import logo from '../assets/images/logo.png'

/**
 * En-tête identique sur toutes les pages : logo (retour à l'accueil),
 * barre de recherche (par nom d'artisan) et menu des catégories.
 */
export default function Header({ categories }) {
  const [texte, setTexte] = useState('')
  const navigate = useNavigate()

  // Recherche : on affiche la page /recherche?q=texte
  function rechercher(event) {
    event.preventDefault() // empêche le rechargement de la page
    if (texte.trim() !== '') {
      navigate(`/recherche?q=${encodeURIComponent(texte.trim())}`)
    }
  }

  return (
    <header className="border-bottom">
      {/* Mobile : éléments les uns sous les autres ; ordinateur (lg) : sur une ligne */}
      <div className="container py-3 d-lg-flex align-items-center justify-content-between">
        <Link to="/">
          <img src={logo} className="logo" width="640" height="138" alt="Trouve ton artisan, avec la région Auvergne-Rhône-Alpes : accueil" />
        </Link>

        <div className="mt-3 mt-lg-0">
          <form role="search" className="input-group mb-2" onSubmit={rechercher}>
            <label htmlFor="recherche" className="visually-hidden">
              Rechercher un artisan par son nom
            </label>
            <input
              id="recherche"
              type="search"
              className="form-control"
              placeholder="Nom d'un artisan"
              value={texte}
              onChange={(event) => setTexte(event.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Rechercher
            </button>
          </form>

          <nav aria-label="Catégories d'artisanat">
            <ul className="nav">
              {categories?.map((categorie) => (
                <li key={categorie.id_categorie} className="nav-item">
                  <NavLink to={`/categorie/${categorie.id_categorie}`} className="nav-link">
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
