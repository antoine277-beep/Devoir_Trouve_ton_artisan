import { Link } from 'react-router'

import StarRating from './StarRating'

/**
 * Petite fiche d'un artisan : nom, note, spécialité et localisation.
 * La classe Bootstrap "stretched-link" rend toute la carte cliquable.
 */
export default function ArtisanCard({ artisan }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h2 className="h5 card-title">
          <Link to={`/artisan/${artisan.id_artisan}`} className="stretched-link">
            {artisan.nom}
          </Link>
        </h2>
        <StarRating note={artisan.note} />
        <p className="mb-1">Spécialité : {artisan.specialite.nom}</p>
        <p className="mb-0">Localisation : {artisan.ville}</p>
      </div>
    </div>
  )
}
