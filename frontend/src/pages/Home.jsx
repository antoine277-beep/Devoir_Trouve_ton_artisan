import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import ArtisanCard from '../components/ArtisanCard'
import { Loader, ErrorMessage } from '../components/Feedback'
import useSeo from '../hooks/useSeo'
import { getArtisansDuMois } from '../api'
import illustrations from '../utils/illustrations'

// Les 4 étapes du fonctionnement du site (numéro + texte demandés par le brief)
const etapes = [
  "Choisir la catégorie d'artisanat dans le menu.",
  'Choisir un artisan.',
  'Le contacter via le formulaire de contact.',
  'Une réponse sera apportée sous 48h.',
]

/**
 * Page d'accueil : présentation, "Comment trouver mon artisan ?",
 * les trois artisans du mois et l'accès aux catégories.
 */
export default function Home({ categories }) {
  const [artisans, setArtisans] = useState(null)
  const [erreur, setErreur] = useState(false)

  useSeo(
    'Accueil',
    'Trouvez un artisan près de chez vous en Auvergne-Rhône-Alpes : bâtiment, services, fabrication, alimentation. Contactez-le en ligne, réponse sous 48h.',
  )

  // Chargement des artisans du mois au premier affichage de la page
  useEffect(() => {
    getArtisansDuMois()
      .then(setArtisans)
      .catch(() => setErreur(true))
  }, [])

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">Trouvez l'artisan qu'il vous faut, près de chez vous</h1>
          <p className="hero__lead">
            Plus de 221 000 entreprises artisanales font vivre la région Auvergne-Rhône-Alpes. Trouvez la
            bonne, demandez un renseignement, une prestation ou un tarif en quelques clics.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* &nbsp; = espace insécable : le "?" ne passe jamais seul à la ligne */}
          <h2 className="section__title">Comment trouver mon artisan&nbsp;?</h2>
          <ol className="steps">
            {etapes.map((texte, index) => (
              <li key={texte} className="steps__item">
                <span className="steps__number">{index + 1}</span>
                <p className="steps__text">{texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <h2 className="section__title">Les artisans du mois</h2>
          {erreur && <ErrorMessage />}
          {!erreur && !artisans && <Loader />}
          {artisans && (
            <ul className="card-grid">
              {artisans.map((artisan) => (
                <li key={artisan.id_artisan}>
                  <ArtisanCard artisan={artisan} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {categories && (
        <section className="section">
          <div className="container">
            <h2 className="section__title">Parcourir les catégories</h2>
            <ul className="category-grid">
              {categories.map((categorie) => (
                <li key={categorie.id_categorie}>
                  <Link to={`/categorie/${categorie.slug}`} className="category-tile">
                    <img src={illustrations[categorie.slug]} alt="" width="400" height="300" />
                    <span className="category-tile__name">{categorie.nom}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
