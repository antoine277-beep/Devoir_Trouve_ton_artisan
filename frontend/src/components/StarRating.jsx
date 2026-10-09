import Icon from './Icon'
import { formatNote } from '../utils/format'

/**
 * Note sur cinq représentée par des étoiles (pleines, demi, vides).
 * Les lecteurs d'écran lisent "Note : 4,5 sur 5" au lieu des étoiles.
 *
 * @param {{ note: number, className?: string }} props
 */
export default function StarRating({ note, className = '' }) {
  // Arrondi à la demi-étoile la plus proche
  const arrondi = Math.round(note * 2) / 2
  const etoiles = [1, 2, 3, 4, 5].map((position) => {
    if (arrondi >= position) return 'star'
    if (arrondi >= position - 0.5) return 'starHalf'
    return 'starEmpty'
  })

  return (
    <p className={`star-rating ${className}`}>
      <span className="star-rating__stars" aria-hidden="true">
        {etoiles.map((type, index) => (
          <Icon key={index} name={type} />
        ))}
      </span>
      <span className="star-rating__value" aria-hidden="true">
        {formatNote(note)}
      </span>
      <span className="visually-hidden">Note : {formatNote(note)} sur 5</span>
    </p>
  )
}
