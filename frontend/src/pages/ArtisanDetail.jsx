import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router'

import StarRating from '../components/StarRating'
import ContactForm from '../components/ContactForm'
import useSeo from '../hooks/useSeo'
import { getArtisan } from '../api'
import batiment from '../assets/images/categories/batiment.svg'
import services from '../assets/images/categories/services.svg'
import fabrication from '../assets/images/categories/fabrication.svg'
import alimentation from '../assets/images/categories/alimentation.svg'

// Image de l'artisan : l'illustration de sa catégorie (numéro de catégorie -> image)
const images = { 1: batiment, 2: services, 3: fabrication, 4: alimentation }

/**
 * Fiche complète d'un artisan : nom, image, note, spécialité, localisation,
 * rubrique "À propos", site web s'il en a un et formulaire de contact.
 */
export default function ArtisanDetail() {
  const { id } = useParams() // le numéro dans l'adresse /artisan/3
  const [artisan, setArtisan] = useState(null)
  const [introuvable, setIntrouvable] = useState(false)

  useSeo(
    artisan ? artisan.nom : 'Fiche artisan',
    artisan
      ? `${artisan.nom}, ${artisan.specialite.nom.toLowerCase()} à ${artisan.ville}. Contactez cet artisan en ligne, réponse sous 48h.`
      : "Fiche d'un artisan de la région Auvergne-Rhône-Alpes.",
  )

  useEffect(() => {
    getArtisan(id)
      .then(setArtisan)
      .catch(() => setIntrouvable(true)) // artisan inexistant (404) ou adresse invalide (400)
  }, [id])

  if (introuvable) {
    return <Navigate to="/page-introuvable" replace />
  }
  if (!artisan) {
    return <p>Chargement...</p>
  }

  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <h1>{artisan.nom}</h1>
        <img src={images[artisan.specialite.id_categorie]} alt="" className="img-fluid mb-3" width="400" height="300" />
        <StarRating note={artisan.note} />
        <p className="mb-1">Spécialité : {artisan.specialite.nom}</p>
        <p>Localisation : {artisan.ville}</p>
        {/* Le site web n'est affiché que si l'artisan en a un */}
        {artisan.site_web && (
          <p>
            Site web :{' '}
            <a href={artisan.site_web} target="_blank" rel="noopener noreferrer">
              {artisan.site_web}
            </a>
          </p>
        )}

        <h2>À propos</h2>
        <p>{artisan.a_propos}</p>
      </div>

      <div className="col-lg-6">
        <h2>Contacter l'artisan</h2>
        <ContactForm idArtisan={artisan.id_artisan} />
      </div>
    </div>
  )
}
