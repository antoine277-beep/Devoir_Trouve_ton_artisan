import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'

import StarRating from '../components/StarRating'
import ContactForm from '../components/ContactForm'
import { Loader, ErrorMessage } from '../components/Feedback'
import useSeo from '../hooks/useSeo'
import { getArtisan } from '../api'
import illustrations from '../utils/illustrations'

/**
 * Fiche complète d'un artisan : image, note, spécialité, localisation,
 * site web, rubrique "À propos" et formulaire de contact.
 */
export default function ArtisanDetail() {
  const { id } = useParams() // le numéro dans l'adresse /artisan/3
  const [artisan, setArtisan] = useState(null)
  const [erreur, setErreur] = useState(null)

  useSeo(
    artisan ? `${artisan.nom}, ${artisan.specialite.nom.toLowerCase()} à ${artisan.ville}` : 'Fiche artisan',
    artisan
      ? `${artisan.nom}, ${artisan.specialite.nom.toLowerCase()} à ${artisan.ville}, noté ${artisan.note.replace('.', ',')}/5. Contactez cet artisan en ligne, réponse sous 48h.`
      : "Fiche d'un artisan de la région Auvergne-Rhône-Alpes.",
  )

  useEffect(() => {
    setArtisan(null)
    setErreur(null)
    getArtisan(id).then(setArtisan).catch(setErreur)
  }, [id])

  // Artisan inexistant (404) ou adresse invalide comme /artisan/abc (400) : page 404
  if (erreur && (erreur.status === 404 || erreur.status === 400)) {
    return <Navigate to="/page-introuvable" replace />
  }
  if (erreur) {
    return (
      <div className="container section">
        <ErrorMessage />
      </div>
    )
  }
  if (!artisan) {
    return (
      <div className="container section">
        <Loader />
      </div>
    )
  }

  const categorie = artisan.specialite.categorie
  // Photo de l'artisan si elle existe, sinon l'illustration de sa catégorie
  const image = artisan.image || illustrations[categorie.slug]

  return (
    <>
      <div className="container">
        <nav aria-label="Fil d'Ariane" className="breadcrumb-nav">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Accueil</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/categorie/${categorie.slug}`}>{categorie.nom}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {artisan.nom}
            </li>
          </ol>
        </nav>
      </div>

      <section className="artisan-profile">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-5 col-lg-4">
              <img
                src={image}
                alt={artisan.image ? `Photo de ${artisan.nom}` : ''}
                className="artisan-profile__image"
                width="400"
                height="300"
              />
            </div>
            <div className="col-md-7 col-lg-8">
              <p className="artisan-profile__categorie">{categorie.nom}</p>
              <h1 className="artisan-profile__name">{artisan.nom}</h1>
              <StarRating note={artisan.note} />
              <ul className="artisan-profile__infos">
                <li>
                  <i className="bi bi-tools" aria-hidden="true"></i>
                  <span className="visually-hidden">Spécialité :</span> {artisan.specialite.nom}
                </li>
                <li>
                  <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
                  <span className="visually-hidden">Localisation :</span> {artisan.ville}
                </li>
                {/* Le site web n'est affiché que si l'artisan en a un */}
                {artisan.site_web && (
                  <li>
                    <i className="bi bi-globe2" aria-hidden="true"></i>
                    <a href={artisan.site_web} target="_blank" rel="noopener noreferrer">
                      {artisan.site_web.replace('https://', '')}
                      <span className="visually-hidden"> (nouvel onglet)</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container section">
        <div className="row g-4 gx-lg-5">
          <section className="col-lg-5">
            <h2 className="section__title">À propos</h2>
            <p>{artisan.a_propos}</p>
          </section>

          <section className="col-lg-7">
            <div className="contact-box">
              <h2 className="section__title">Contacter {artisan.nom}</h2>
              <p>
                Une question, un devis ? Remplissez ce formulaire : votre message sera envoyé par e-mail à
                l'artisan. Une réponse vous sera apportée sous 48h.
              </p>
              <ContactForm idArtisan={artisan.id_artisan} />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
