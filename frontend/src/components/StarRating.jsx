/**
 * Note sur cinq affichée avec des étoiles.
 * La note arrive de la base sous forme de texte, par exemple "4.5".
 */
export default function StarRating({ note }) {
  const pleines = Math.round(Number(note)) // nombre d'étoiles pleines (arrondi)

  return (
    <p className="mb-1">
      {/* Les étoiles sont décoratives : les lecteurs d'écran lisent seulement "4,5 sur 5" */}
      <span className="etoiles" aria-hidden="true">
        {'★'.repeat(pleines)}
        {'☆'.repeat(5 - pleines)}
      </span>{' '}
      {note.replace('.', ',')} sur 5
    </p>
  )
}
