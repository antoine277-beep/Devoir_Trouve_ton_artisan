import { useState } from 'react'
import { useNavigate } from 'react-router'

/**
 * Barre de recherche du header : cherche les artisans par leur nom
 * et affiche les résultats sur la page /recherche?q=...
 */
export default function SearchBar() {
  const [texte, setTexte] = useState('')
  const navigate = useNavigate()

  function rechercher(event) {
    event.preventDefault() // empêche le rechargement de la page
    if (texte.trim() !== '') {
      navigate(`/recherche?q=${encodeURIComponent(texte.trim())}`)
    }
  }

  return (
    <form role="search" className="search-bar" onSubmit={rechercher}>
      <label htmlFor="recherche" className="visually-hidden">
        Rechercher un artisan par son nom
      </label>
      <input
        id="recherche"
        type="search"
        className="search-bar__input"
        placeholder="Rechercher un artisan..."
        maxLength={100}
        value={texte}
        onChange={(event) => setTexte(event.target.value)}
      />
      <button type="submit" className="search-bar__button">
        <i className="bi bi-search" aria-hidden="true"></i>
        <span className="visually-hidden">Lancer la recherche</span>
      </button>
    </form>
  )
}
