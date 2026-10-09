import { useRef, useState } from 'react'

import Icon from './Icon'
import { sendContact } from '../api/client'

const champsVides = { nom: '', email: '', objet: '', message: '', site: '' }

// Mêmes règles que la validation de l'API (backend/src/middlewares/validate.js)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Vérifie les champs et renvoie les messages d'erreur par champ. */
function validate(valeurs) {
  const erreurs = {}
  if (!valeurs.nom.trim()) erreurs.nom = 'Indiquez votre nom.'
  else if (valeurs.nom.trim().length > 100) erreurs.nom = 'Le nom est limité à 100 caractères.'

  if (!valeurs.email.trim()) erreurs.email = 'Indiquez votre adresse e-mail.'
  else if (!EMAIL_REGEX.test(valeurs.email.trim()))
    erreurs.email = "L'adresse e-mail n'est pas valide (exemple : nom@domaine.fr)."

  if (!valeurs.objet.trim()) erreurs.objet = "Indiquez l'objet de votre demande."
  else if (valeurs.objet.trim().length > 150) erreurs.objet = "L'objet est limité à 150 caractères."

  const longueur = valeurs.message.trim().length
  if (longueur < 10) erreurs.message = 'Votre message doit contenir au moins 10 caractères.'
  else if (longueur > 3000) erreurs.message = 'Votre message est limité à 3000 caractères.'

  return erreurs
}

/**
 * Formulaire de contact d'un artisan (nom, e-mail, objet, message).
 * Le message est envoyé à l'API, qui le transmet par e-mail à l'artisan.
 *
 * @param {{ artisanId: number }} props
 */
export default function ContactForm({ artisanId }) {
  const [valeurs, setValeurs] = useState(champsVides)
  const [erreurs, setErreurs] = useState({})
  const [statut, setStatut] = useState({ etat: 'idle', message: '' }) // idle | envoi | succes | erreur
  const formRef = useRef(null)
  const statusRef = useRef(null)

  function handleChange(event) {
    const { name, value } = event.target
    setValeurs((precedentes) => ({ ...precedentes, [name]: value }))
    // L'erreur d'un champ disparaît dès qu'on le corrige
    if (erreurs[name]) {
      setErreurs((precedentes) => ({ ...precedentes, [name]: undefined }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nouvellesErreurs = validate(valeurs)
    setErreurs(nouvellesErreurs)
    const premierChampEnErreur = Object.keys(nouvellesErreurs)[0]
    if (premierChampEnErreur) {
      // On place le curseur sur le premier champ à corriger
      formRef.current.elements[premierChampEnErreur].focus()
      return
    }

    setStatut({ etat: 'envoi', message: '' })
    try {
      const reponse = await sendContact(artisanId, {
        nom: valeurs.nom.trim(),
        email: valeurs.email.trim(),
        objet: valeurs.objet.trim(),
        message: valeurs.message.trim(),
        site: valeurs.site,
      })
      setValeurs(champsVides)
      setStatut({ etat: 'succes', message: reponse.message })
    } catch (error) {
      // Erreurs de validation renvoyées par l'API : affichées sous les champs concernés
      if (error.details?.length) {
        setErreurs(Object.fromEntries(error.details.map((detail) => [detail.champ, detail.message])))
      }
      setStatut({ etat: 'erreur', message: error.message })
    }
    statusRef.current?.focus()
  }

  // Propriétés communes d'accessibilité pour chaque champ
  const aria = (name) => ({
    'aria-invalid': erreurs[name] ? true : undefined,
    'aria-describedby': erreurs[name] ? `erreur-${name}` : undefined,
  })

  const erreur = (name) =>
    erreurs[name] && (
      <p id={`erreur-${name}`} className="invalid-feedback d-block">
        {erreurs[name]}
      </p>
    )

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
      <p className="small text-body-secondary">Tous les champs sont obligatoires.</p>

      <div
        ref={statusRef}
        tabIndex={-1}
        role={statut.etat === 'erreur' ? 'alert' : 'status'}
        className="contact-form__status"
      >
        {statut.etat === 'succes' && <div className="alert alert-success mb-3">{statut.message}</div>}
        {statut.etat === 'erreur' && <div className="alert alert-danger mb-3">{statut.message}</div>}
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="contact-nom" className="form-label">
            Votre nom
          </label>
          <input
            id="contact-nom"
            name="nom"
            type="text"
            className={`form-control ${erreurs.nom ? 'is-invalid' : ''}`}
            autoComplete="name"
            maxLength={100}
            required
            value={valeurs.nom}
            onChange={handleChange}
            {...aria('nom')}
          />
          {erreur('nom')}
        </div>

        <div className="col-md-6">
          <label htmlFor="contact-email" className="form-label">
            Votre adresse e-mail
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className={`form-control ${erreurs.email ? 'is-invalid' : ''}`}
            autoComplete="email"
            maxLength={255}
            required
            value={valeurs.email}
            onChange={handleChange}
            {...aria('email')}
          />
          {erreur('email')}
        </div>

        <div className="col-12">
          <label htmlFor="contact-objet" className="form-label">
            Objet
          </label>
          <input
            id="contact-objet"
            name="objet"
            type="text"
            className={`form-control ${erreurs.objet ? 'is-invalid' : ''}`}
            maxLength={150}
            required
            value={valeurs.objet}
            onChange={handleChange}
            {...aria('objet')}
          />
          {erreur('objet')}
        </div>

        <div className="col-12">
          <label htmlFor="contact-message" className="form-label">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            className={`form-control ${erreurs.message ? 'is-invalid' : ''}`}
            maxLength={3000}
            required
            value={valeurs.message}
            onChange={handleChange}
            {...aria('message')}
          />
          {erreur('message')}
        </div>

        {/* Piège à robots : invisible pour les visiteurs, ignoré par les lecteurs d'écran */}
        <div className="contact-form__trap" aria-hidden="true">
          <label htmlFor="contact-site">Ne pas remplir ce champ</label>
          <input
            id="contact-site"
            name="site"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={valeurs.site}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary btn-lg" disabled={statut.etat === 'envoi'}>
            {statut.etat === 'envoi' ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Envoi en cours…
              </>
            ) : (
              <>
                <Icon name="send" className="me-2" />
                Envoyer le message
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
