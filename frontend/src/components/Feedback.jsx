/**
 * Messages d'état communs : chargement et erreur.
 */

/** Indicateur de chargement, annoncé aux lecteurs d'écran. */
export function Loader({ label = 'Chargement en cours…' }) {
  return (
    <div className="d-flex justify-content-center py-5" role="status">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  )
}

/** Message d'erreur (problème de connexion, API indisponible...). */
export function ErrorMessage({ error }) {
  return (
    <div className="alert alert-danger" role="alert">
      <strong>Oups&nbsp;!</strong> {error?.message || 'Une erreur est survenue.'} Merci de réessayer plus tard.
    </div>
  )
}
