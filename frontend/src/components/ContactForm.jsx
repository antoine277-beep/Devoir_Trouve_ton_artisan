import { useState } from 'react'

import { envoyerMessage } from '../api'

const formulaireVide = { nom: '', email: '', objet: '', message: '' }

/**
 * Formulaire de contact d'un artisan (nom, e-mail, objet, message).
 * Le message est envoyé à l'API, qui le transmet par e-mail à l'artisan.
 *
 * Les attributs required, type="email", minLength et maxLength font vérifier
 * les champs par le navigateur avant l'envoi. L'API refait ces vérifications
 * de son côté (on ne fait jamais confiance uniquement au navigateur).
 */
export default function ContactForm({ idArtisan }) {
  const [formulaire, setFormulaire] = useState(formulaireVide)
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [resultat, setResultat] = useState(null) // message de succès ou d'erreur

  // Met à jour le champ modifié (name du champ = nom de la propriété)
  function modifierChamp(event) {
    setFormulaire({ ...formulaire, [event.target.name]: event.target.value })
  }

  async function envoyer(event) {
    event.preventDefault()
    setEnvoiEnCours(true)
    setResultat(null)

    try {
      const reponse = await envoyerMessage(idArtisan, formulaire)
      setResultat({ type: 'success', texte: reponse.message })
      setFormulaire(formulaireVide)
    } catch (erreur) {
      setResultat({ type: 'danger', texte: erreur.message || "Votre message n'a pas pu être envoyé." })
    }

    setEnvoiEnCours(false)
  }

  return (
    <form className="contact-form" onSubmit={envoyer}>
      <p className="small">Tous les champs sont obligatoires.</p>

      {/* role="status" : le message est lu automatiquement par les lecteurs d'écran */}
      <div role="status">
        {resultat && <div className={`alert alert-${resultat.type}`}>{resultat.texte}</div>}
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="contact-nom" className="form-label">Votre nom</label>
          <input id="contact-nom" name="nom" type="text" className="form-control" autoComplete="name"
            required maxLength={100} value={formulaire.nom} onChange={modifierChamp} />
        </div>

        <div className="col-md-6">
          <label htmlFor="contact-email" className="form-label">Votre adresse e-mail</label>
          <input id="contact-email" name="email" type="email" className="form-control" autoComplete="email"
            required maxLength={255} value={formulaire.email} onChange={modifierChamp} />
        </div>

        <div className="col-12">
          <label htmlFor="contact-objet" className="form-label">Objet</label>
          <input id="contact-objet" name="objet" type="text" className="form-control"
            required maxLength={150} value={formulaire.objet} onChange={modifierChamp} />
        </div>

        <div className="col-12">
          <label htmlFor="contact-message" className="form-label">Message (10 caractères minimum)</label>
          <textarea id="contact-message" name="message" rows={6} className="form-control"
            required minLength={10} maxLength={3000} value={formulaire.message} onChange={modifierChamp} />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary btn-lg" disabled={envoiEnCours}>
            <i className="bi bi-send me-2" aria-hidden="true"></i>
            {envoiEnCours ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </div>
      </div>
    </form>
  )
}
