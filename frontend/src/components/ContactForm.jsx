import { useState } from 'react'

import { envoyerMessage } from '../api'

const formulaireVide = { nom: '', email: '', objet: '', message: '' }

/**
 * Formulaire de contact d'un artisan (nom, e-mail, objet, message).
 * Le message est envoyé à l'API, qui le transmet par e-mail à l'artisan.
 *
 * Les attributs required, type="email" et maxLength font vérifier les champs
 * par le navigateur avant l'envoi. L'API refait ces vérifications de son côté.
 */
export default function ContactForm({ idArtisan }) {
  const [formulaire, setFormulaire] = useState(formulaireVide)
  const [resultat, setResultat] = useState(null) // message de succès ou d'erreur

  // Met à jour le champ modifié (le "name" du champ = le nom de la propriété)
  function modifierChamp(event) {
    setFormulaire({ ...formulaire, [event.target.name]: event.target.value })
  }

  async function envoyer(event) {
    event.preventDefault()
    try {
      const reponse = await envoyerMessage(idArtisan, formulaire)
      setResultat({ type: 'success', texte: reponse.message })
      setFormulaire(formulaireVide)
    } catch (erreur) {
      setResultat({ type: 'danger', texte: erreur.message })
    }
  }

  return (
    <form onSubmit={envoyer}>
      {/* role="status" : le message est lu automatiquement par les lecteurs d'écran */}
      <div role="status">
        {resultat && <div className={`alert alert-${resultat.type}`}>{resultat.texte}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="contact-nom" className="form-label">Nom</label>
        <input id="contact-nom" name="nom" type="text" className="form-control" autoComplete="name"
          required maxLength={100} value={formulaire.nom} onChange={modifierChamp} />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-email" className="form-label">E-mail</label>
        <input id="contact-email" name="email" type="email" className="form-control" autoComplete="email"
          required maxLength={255} value={formulaire.email} onChange={modifierChamp} />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-objet" className="form-label">Objet</label>
        <input id="contact-objet" name="objet" type="text" className="form-control"
          required maxLength={150} value={formulaire.objet} onChange={modifierChamp} />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-message" className="form-label">Message</label>
        <textarea id="contact-message" name="message" rows={5} className="form-control"
          required maxLength={3000} value={formulaire.message} onChange={modifierChamp} />
      </div>

      <button type="submit" className="btn btn-primary">
        Envoyer
      </button>
    </form>
  )
}
