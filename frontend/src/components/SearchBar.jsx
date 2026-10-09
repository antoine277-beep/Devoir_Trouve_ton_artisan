import { useId, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import Icon from './Icon'

/**
 * Barre de recherche du header : cherche les artisans par leur nom
 * et affiche les résultats sur la page /recherche.
 */
export default function SearchBar() {
  const id = useId()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Le champ reprend le texte recherché présent dans l'adresse (/recherche?q=...)
  const [terme, setTerme] = useState(searchParams.get('q') || '')

  function handleSubmit(event) {
    event.preventDefault()
    const valeur = terme.trim()
    if (valeur) {
      navigate(`/recherche?q=${encodeURIComponent(valeur)}`)
    }
  }

  return (
    <form role="search" className="search-bar" onSubmit={handleSubmit}>
      <label htmlFor={id} className="visually-hidden">
        Rechercher un artisan par son nom
      </label>
      <input
        id={id}
        type="search"
        name="q"
        className="search-bar__input"
        placeholder="Rechercher un artisan…"
        maxLength={100}
        autoComplete="off"
        value={terme}
        onChange={(event) => setTerme(event.target.value)}
      />
      <button type="submit" className="search-bar__button">
        <Icon name="search" />
        <span className="visually-hidden">Lancer la recherche</span>
      </button>
    </form>
  )
}
