import { useParams, useSearchParams } from 'react-router'

import Seo from '../components/Seo'
import ArtisanCard from '../components/ArtisanCard'
import { Loader, ErrorMessage } from '../components/Feedback'
import NotFound from './NotFound'
import useApi from '../hooks/useApi'
import { getArtisans, getCategorie } from '../api/client'

/**
 * Liste des artisans, selon une catégorie (/categorie/:slug)
 * ou selon une recherche par nom (/recherche?q=...).
 *
 * @param {{ mode: 'categorie' | 'recherche' }} props
 */
export default function ArtisanList({ mode }) {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const recherche = mode === 'recherche' ? (searchParams.get('q') || '').trim().slice(0, 100) : ''

  // Catégorie (pour le titre) et artisans sont chargés en parallèle
  const categorie = useApi(
    (signal) => (mode === 'categorie' ? getCategorie(slug, signal) : Promise.resolve(null)),
    [mode, slug],
  )
  const artisans = useApi(
    (signal) => getArtisans(mode === 'categorie' ? { categorie: slug } : { recherche }, signal),
    [mode, slug, recherche],
  )

  // Catégorie inexistante (ou mal formée) : page 404
  if (mode === 'categorie' && [400, 404].includes(categorie.error?.status)) {
    return <NotFound />
  }

  let titre = recherche ? `Résultats pour « ${recherche} »` : 'Tous les artisans'
  if (mode === 'categorie') {
    titre = `Artisans : ${categorie.data?.nom ?? ''}`
  }

  const seo =
    mode === 'categorie'
      ? {
          title: categorie.data ? `Artisans ${categorie.data.nom}` : 'Artisans',
          description: categorie.data
            ? `Tous les artisans de la catégorie ${categorie.data.nom} en Auvergne-Rhône-Alpes : notes, spécialités et localisation. Contactez-les en ligne.`
            : 'Les artisans de la région Auvergne-Rhône-Alpes par catégorie.',
        }
      : {
          title: `Recherche « ${recherche} »`,
          description: `Résultats de la recherche « ${recherche} » parmi les artisans de la région Auvergne-Rhône-Alpes.`,
          noIndex: true,
        }

  const loading = categorie.loading || artisans.loading
  const error = categorie.error || artisans.error
  const nombre = artisans.data?.length ?? 0

  return (
    <>
      <Seo {...seo} />

      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">{titre}</h1>
          {/* Annoncé aux lecteurs d'écran quand le nombre de résultats change */}
          <p className="page-header__count mb-0" aria-live="polite">
            {!loading && !error && (nombre > 1 ? `${nombre} artisans trouvés` : `${nombre} artisan trouvé`)}
          </p>
        </div>
      </section>

      <div className="section">
        <div className="container">
          {loading && <Loader label="Chargement des artisans…" />}
          {!loading && error && <ErrorMessage error={error} />}

          {!loading && !error && nombre === 0 && (
            <div className="empty-state">
              <p className="mb-1">Aucun artisan ne correspond à votre recherche.</p>
              <p className="mb-0">Vérifiez l’orthographe ou parcourez les catégories du menu.</p>
            </div>
          )}

          {!loading && !error && nombre > 0 && (
            <ul className="card-grid">
              {artisans.data.map((artisan) => (
                <li key={artisan.id}>
                  <ArtisanCard artisan={artisan} headingLevel={2} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
