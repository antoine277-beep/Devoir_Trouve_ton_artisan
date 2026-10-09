/**
 * Note sur cinq affichée avec des étoiles (pleines, demi, vides).
 * La note arrive de la base sous forme de texte, par exemple "4.5".
 */
export default function StarRating({ note }) {
  const valeur = Number(note)

  // Pour chacune des 5 étoiles : pleine, à moitié pleine ou vide
  const etoiles = []
  for (let i = 1; i <= 5; i++) {
    if (valeur >= i) {
      etoiles.push('bi-star-fill')
    } else if (valeur >= i - 0.5) {
      etoiles.push('bi-star-half')
    } else {
      etoiles.push('bi-star')
    }
  }

  const noteAffichee = note.replace('.', ',') // "4.5" -> "4,5"

  return (
    <p className="star-rating">
      {/* Les étoiles sont cachées aux lecteurs d'écran, qui lisent le texte "Note : 4,5 sur 5" */}
      <span className="star-rating__stars" aria-hidden="true">
        {etoiles.map((classe, index) => (
          <i key={index} className={`bi ${classe}`}></i>
        ))}
      </span>
      <span className="star-rating__value" aria-hidden="true">
        {noteAffichee}
      </span>
      <span className="visually-hidden">Note : {noteAffichee} sur 5</span>
    </p>
  )
}
