/**
 * Messages communs : chargement en cours et erreur.
 */

// Petit cercle qui tourne pendant le chargement (role="status" : annoncé aux lecteurs d'écran)
export function Loader() {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border text-primary" aria-hidden="true"></div>
      <span className="visually-hidden">Chargement en cours...</span>
    </div>
  )
}

// Message affiché si l'API ne répond pas
export function ErrorMessage() {
  return (
    <div className="alert alert-danger" role="alert">
      Les informations n'ont pas pu être chargées. Merci de réessayer plus tard.
    </div>
  )
}
