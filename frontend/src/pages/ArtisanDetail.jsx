import { Link, useParams } from 'react-router'

import Seo from '../components/Seo'
import StarRating from '../components/StarRating'
import ContactForm from '../components/ContactForm'
import Icon from '../components/Icon'
import { Loader, ErrorMessage } from '../components/Feedback'
import NotFound from './NotFound'
import useApi from '../hooks/useApi'
import { getArtisan } from '../api/client'
import { artisanImage } from '../utils/illustrations'
import { safeUrl, displayUrl } from '../utils/url'
import { formatNote } from '../utils/format'

/**
 * Fiche complète d'un artisan : image, note, spécialité, localisation,
 * rubrique "À propos", site web et formulaire de contact.
 */
export default function ArtisanDetail() {
  const { id } = useParams()
  const { data: artisan, error, loading } = useApi((signal) => getArtisan(id, signal), [id])

  // Identifiant inconnu ou invalide : page 404
  if ([400, 404].includes(error?.status)) {
    return <NotFound />
  }

  if (loading) {
    return (
      <div className="container section">
        <Seo title="Fiche artisan" description="Fiche détaillée d'un artisan de la région Auvergne-Rhône-Alpes." />
        <Loader label="Chargement de la fiche de l'artisan…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container section">
        <Seo title="Fiche artisan" description="Fiche détaillée d'un artisan de la région Auvergne-Rhône-Alpes." />
        <ErrorMessage error={error} />
      </div>
    )
  }

  const siteWeb = safeUrl(artisan.siteWeb)

  return (
    <>
      <Seo
        title={`${artisan.nom}, ${artisan.specialite.nom.toLowerCase()} à ${artisan.ville}`}
        description={`${artisan.nom}, ${artisan.specialite.nom.toLowerCase()} à ${artisan.ville} (${artisan.categorie.nom}), noté ${formatNote(artisan.note)}/5. Contactez cet artisan en ligne, réponse sous 48h.`}
      />

      <div className="container">
        <nav aria-label="Fil d'Ariane" className="breadcrumb-nav">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Accueil</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/categorie/${artisan.categorie.slug}`}>{artisan.categorie.nom}</Link>
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
                src={artisanImage(artisan)}
                alt={artisan.image ? `Photo de ${artisan.nom}` : ''}
                className="artisan-profile__image"
                width="400"
                height="300"
              />
            </div>
            <div className="col-md-7 col-lg-8">
              <p className="artisan-profile__categorie">{artisan.categorie.nom}</p>
              <h1 className="artisan-profile__name">{artisan.nom}</h1>
              <StarRating note={artisan.note} className="star-rating--large" />
              <ul className="artisan-profile__infos">
                <li>
                  <Icon name="tool" />
                  <span>
                    <span className="visually-hidden">Spécialité : </span>
                    {artisan.specialite.nom}
                  </span>
                </li>
                <li>
                  <Icon name="geo" />
                  <span>
                    <span className="visually-hidden">Localisation : </span>
                    {artisan.ville}
                  </span>
                </li>
                {siteWeb && (
                  <li>
                    <Icon name="globe" />
                    <a href={siteWeb} target="_blank" rel="noopener noreferrer">
                      {displayUrl(siteWeb)}
                      <span className="visually-hidden"> (site de l’artisan, nouvel onglet)</span>
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
          <section className="col-lg-5" aria-labelledby="titre-a-propos">
            <h2 id="titre-a-propos" className="section__title section__title--left">
              À propos
            </h2>
            <p className="artisan-about">{artisan.aPropos}</p>
          </section>

          <section className="col-lg-7" aria-labelledby="titre-contact">
            <div className="contact-box">
              <h2 id="titre-contact" className="section__title section__title--left">
                Contacter {artisan.nom}
              </h2>
              <p>
                Une question, un devis ? Remplissez ce formulaire : votre message sera transmis par e-mail à
                l’artisan. Une réponse vous sera apportée sous 48h.
              </p>
              <ContactForm artisanId={artisan.id} />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
