/** Affiche une note au format français : 4.5 -> "4,5" */
export const formatNote = (note) =>
  note.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
