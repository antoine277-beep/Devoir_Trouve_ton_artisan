import { useEffect, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router'

import ArtisanCard from '../components/ArtisanCard'
import useSeo from '../hooks/useSeo'
import { getArtisansParCategorie, rechercherArtisans } from '../api'

/**
 * Liste des artisans, utilisée pour deux adresses :
 * - /categorie/1       : les artisans d'une catégorie
 * - /recherche?q=texte : les artisans dont le nom contient le texte
 */
export default function ArtisanList({ categories }) {
  const { id } = useParams() // numéro de la catégorie (absent sur la page de recherche)
  const [searchParams] = useSearchParams()
  const texte = searchParams.get('q') || ''
  const [artisans, setArtisans] = useState(null)

  // Nom de la catégorie : on le cherche dans la liste déjà chargée pour le menu
  const categorie = categories?.find((c) => c.id_categorie === Number(id))
  const titre = id ? `Artisans : ${categorie ? categorie.nom : ''}` : `Résultats pour « ${texte} »`

  useSeo(titre, `${titre} - les artisans de la région Auvergne-Rhône-Alpes, avec leur note, leur spécialité et leur ville.`)

  // Chargement des artisans à chaque changement de catégorie ou de recherche
  useEffect(() => {
    // Si on change de page avant la réponse de l'API, on ignore l'ancienne réponse
    let pageAffichee = true
    setArtisans(null)

    const requete = id ? getArtisansParCategorie(id) : rechercherArtisans(texte)
    requete
      .then((donnees) => {
        if (pageAffichee) setArtisans(donnees)
      })
      .catch(() => setArtisans([]))

    return () => {
      pageAffichee = false
    }
  }, [id, texte])

  // Catégorie qui n'existe pas : on affiche la page 404
  if (id && categories && !categorie) {
    return <Navigate to="/page-introuvable" replace />
  }

  return (
    <>
      <h1>{titre}</h1>

      {artisans && artisans.length === 0 && <p>Aucun artisan trouvé.</p>}

      {artisans && (
        <div className="row g-3">
          {artisans.map((artisan) => (
            <div key={artisan.id_artisan} className="col-md-6 col-lg-4">
              <ArtisanCard artisan={artisan} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
