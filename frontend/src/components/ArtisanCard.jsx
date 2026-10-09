import { Link } from 'react-router'

import StarRating from './StarRating'
import Icon from './Icon'

/**
 * Petite fiche d'un artisan : nom, note, spécialité et localisation.
 * Toute la carte est cliquable (lien étiré sur le nom) et mène à la fiche complète.
 *
 * @param {{ artisan: object, headingLevel?: 2 | 3 }} props
 */
export default function ArtisanCard({ artisan, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`

  return (
    <article className="artisan-card">
      <p className="artisan-card__categorie">{artisan.categorie.nom}</p>
      <Heading className="artisan-card__title">
        <Link to={`/artisan/${artisan.id}`} className="stretched-link">
          {artisan.nom}
        </Link>
      </Heading>
      <StarRating note={artisan.note} />
      <ul className="artisan-card__infos">
        <li>
          <Icon name="tool" />
          <span className="visually-hidden">Spécialité : </span>
          {artisan.specialite.nom}
        </li>
        <li>
          <Icon name="geo" />
          <span className="visually-hidden">Localisation : </span>
          {artisan.ville}
        </li>
      </ul>
      <span className="artisan-card__more" aria-hidden="true">
        Voir la fiche <Icon name="arrowRight" />
      </span>
    </article>
  )
}
