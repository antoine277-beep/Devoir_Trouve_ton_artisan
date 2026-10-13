import { useEffect, useState } from 'react'

import ArtisanCard from '../components/ArtisanCard'
import useSeo from '../hooks/useSeo'
import { getArtisansDuMois } from '../api'

// Les 4 étapes du fonctionnement du site
const etapes = [
  "Choisir la catégorie d'artisanat dans le menu.",
  'Choisir un artisan.',
  'Le contacter via le formulaire de contact.',
  'Une réponse sera apportée sous 48h.',
]

/**
 * Page d'accueil : "Comment trouver mon artisan ?" et les trois artisans du mois.
 */
export default function Home() {
  const [artisans, setArtisans] = useState([])

  useSeo(
    'Accueil',
    'Trouvez un artisan en Auvergne-Rhône-Alpes : bâtiment, services, fabrication, alimentation. Contactez-le en ligne, réponse sous 48h.',
  )

  // Chargement des artisans du mois au premier affichage de la page
  useEffect(() => {
    getArtisansDuMois()
      .then(setArtisans)
      .catch(() => setArtisans([]))
  }, [])

  return (
    <>
      {/* &nbsp; : espace insécable, le "?" ne passe pas seul à la ligne */}
      <h1>Comment trouver mon artisan&nbsp;?</h1>
      {/* <ol> : liste numérotée, le navigateur affiche le numéro de chaque étape */}
      <ol>
        {etapes.map((texte) => (
          <li key={texte}>{texte}</li>
        ))}
      </ol>

      <h2 className="mt-4">Les artisans du mois</h2>
      <div className="row g-3">
        {artisans.map((artisan) => (
          <div key={artisan.id_artisan} className="col-md-6 col-lg-4">
            <ArtisanCard artisan={artisan} />
          </div>
        ))}
      </div>
    </>
  )
}
