import { Link } from 'react-router'

import StarRating from './StarRating'

/**
 * Petite fiche d'un artisan : nom, note, spécialité et localisation.
 * La classe Bootstrap "stretched-link" rend toute la carte cliquable.
 */
export default function ArtisanCard({ artisan }) {
  return (
    <article className="artisan-card">
      <p className="artisan-card__categorie">{artisan.specialite.categorie.nom}</p>
      <h3 className="artisan-card__title">
        <Link to={`/artisan/${artisan.id_artisan}`} className="stretched-link">
          {artisan.nom}
        </Link>
      </h3>
      <StarRating note={artisan.note} />
      <p className="artisan-card__info">
        <i className="bi bi-tools" aria-hidden="true"></i>
        <span className="visually-hidden">Spécialité :</span> {artisan.specialite.nom}
      </p>
      <p className="artisan-card__info">
        <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
        <span className="visually-hidden">Localisation :</span> {artisan.ville}
      </p>
      <p className="artisan-card__more">
        Voir la fiche <i className="bi bi-arrow-right" aria-hidden="true"></i>
      </p>
    </article>
  )
}
