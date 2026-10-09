import { Link, useOutletContext } from 'react-router'

import Seo from '../components/Seo'
import ArtisanCard from '../components/ArtisanCard'
import { Loader, ErrorMessage } from '../components/Feedback'
import useApi from '../hooks/useApi'
import { getTopArtisans } from '../api/client'
import illustrations from '../utils/illustrations'

// Les 4 étapes du fonctionnement du site (numéro + texte obligatoires)
const etapes = [
  'Choisir la catégorie d’artisanat dans le menu.',
  'Choisir un artisan.',
  'Le contacter via le formulaire de contact.',
  'Une réponse sera apportée sous 48h.',
]

/**
 * Page d'accueil : présentation, "Comment trouver mon artisan ?",
 * accès aux catégories et les trois artisans du mois.
 */
export default function Home() {
  const { categories } = useOutletContext()
  const top = useApi(getTopArtisans, [])

  return (
    <>
      <Seo
        description="Trouvez un artisan près de chez vous en Auvergne-Rhône-Alpes : bâtiment, services, fabrication, alimentation. Contactez-le en ligne, réponse sous 48h."
      />

      <section className="hero">
        <div className="container">
          <h1 className="hero__title">Trouvez l’artisan qu’il vous faut, près de chez vous</h1>
          <p className="hero__lead">
            Plus de 221 000 entreprises artisanales font vivre la région Auvergne-Rhône-Alpes. Trouvez la
            bonne, demandez un renseignement, une prestation ou un tarif en quelques clics.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="titre-etapes">
        <div className="container">
          <h2 id="titre-etapes" className="section__title">
            Comment trouver mon artisan&nbsp;?
          </h2>
          <ol className="steps">
            {etapes.map((texte, index) => (
              <li key={texte} className="steps__item">
                <span className="steps__number" aria-hidden="true">
                  {index + 1}
                </span>
                <p className="steps__text">
                  <span className="visually-hidden">Étape {index + 1} : </span>
                  {texte}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--light" aria-labelledby="titre-top">
        <div className="container">
          <h2 id="titre-top" className="section__title">
            Les artisans du mois
          </h2>
          {top.loading && <Loader label="Chargement des artisans du mois…" />}
          {top.error && <ErrorMessage error={top.error} />}
          {top.data && (
            <ul className="card-grid">
              {top.data.map((artisan) => (
                <li key={artisan.id}>
                  <ArtisanCard artisan={artisan} headingLevel={3} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {categories.data && (
        <section className="section" aria-labelledby="titre-categories">
          <div className="container">
            <h2 id="titre-categories" className="section__title">
              Parcourir les catégories
            </h2>
            <ul className="category-grid">
              {categories.data.map((categorie) => (
                <li key={categorie.id}>
                  <Link to={`/categorie/${categorie.slug}`} className="category-tile">
                    <img src={illustrations[categorie.slug]} alt="" width="400" height="300" loading="lazy" />
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
