import { useEffect, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router'

import ArtisanCard from '../components/ArtisanCard'
import { Loader, ErrorMessage } from '../components/Feedback'
import useSeo from '../hooks/useSeo'
import { getArtisansParCategorie, rechercherArtisans } from '../api'

/**
 * Liste des artisans, utilisée pour deux adresses :
 * - /categorie/batiment : les artisans d'une catégorie
 * - /recherche?q=texte  : les artisans dont le nom contient le texte
 */
export default function ArtisanList({ categories }) {
  const { slug } = useParams() // undefined sur la page de recherche
  const [searchParams] = useSearchParams()
  const texte = searchParams.get('q') || ''

  const [artisans, setArtisans] = useState(null)
  const [erreur, setErreur] = useState(false)

  // La catégorie demandée est cherchée dans la liste déjà chargée pour le menu
  const categorie = categories?.find((c) => c.slug === slug)

  let titre = texte ? `Résultats pour « ${texte} »` : 'Tous les artisans'
  if (slug) {
    titre = `Artisans : ${categorie ? categorie.nom : ''}`
  }

  useSeo(
    titre,
    slug
      ? `Les artisans de la catégorie ${categorie?.nom ?? ''} en Auvergne-Rhône-Alpes : notes, spécialités et localisation.`
      : 'Résultats de recherche parmi les artisans de la région Auvergne-Rhône-Alpes.',
  )

  // Chargement des artisans à chaque changement de catégorie ou de recherche
  useEffect(() => {
    // Si on change de page avant la réponse de l'API, on ignore l'ancienne réponse
    let pageAffichee = true

    setArtisans(null)
    setErreur(false)
    const requete = slug ? getArtisansParCategorie(slug) : rechercherArtisans(texte)
    requete
      .then((donnees) => {
        if (pageAffichee) setArtisans(donnees)
      })
      .catch(() => {
        if (pageAffichee) setErreur(true)
      })

    return () => {
      pageAffichee = false
    }
  }, [slug, texte])

  // Catégorie qui n'existe pas : on affiche la page 404
  if (slug && categories && !categorie) {
    return <Navigate to="/page-introuvable" replace />
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">{titre}</h1>
          {artisans && (
            <p className="page-header__count mb-0">
              {artisans.length} {artisans.length > 1 ? 'artisans trouvés' : 'artisan trouvé'}
            </p>
          )}
        </div>
      </section>

      <div className="section">
        <div className="container">
          <h2 className="visually-hidden">Liste des artisans</h2>
          {erreur && <ErrorMessage />}
          {!erreur && !artisans && <Loader />}

          {artisans && artisans.length === 0 && (
            <div className="empty-state">
              <p className="mb-1">Aucun artisan ne correspond à votre recherche.</p>
              <p className="mb-0">Vérifiez l'orthographe ou parcourez les catégories du menu.</p>
            </div>
          )}

          {artisans && artisans.length > 0 && (
            <ul className="card-grid">
              {artisans.map((artisan) => (
                <li key={artisan.id_artisan}>
                  <ArtisanCard artisan={artisan} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
