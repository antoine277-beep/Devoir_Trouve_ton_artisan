/**
 * Appels à l'API "Trouve ton artisan".
 *
 * L'adresse de l'API et la clé d'accès viennent du fichier .env (voir
 * .env.example). Sans VITE_API_URL, l'API est appelée sur le même site (/api).
 */
const API_URL = import.meta.env.VITE_API_URL || ''
const API_KEY = import.meta.env.VITE_API_KEY

async function appelApi(chemin, options = {}) {
  const reponse = await fetch(`${API_URL}/api${chemin}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY, // sans cette clé, l'API refuse de répondre
    },
  })
  const donnees = await reponse.json()

  // Code HTTP d'erreur (400, 404, 500...) : on déclenche une erreur avec le message de l'API
  if (!reponse.ok) {
    const erreur = new Error(donnees.erreurs ? donnees.erreurs.join(' ') : donnees.message)
    erreur.status = reponse.status
    throw erreur
  }
  return donnees
}

export const getCategories = () => appelApi('/categories')
export const getArtisansDuMois = () => appelApi('/artisans/top')
export const getArtisan = (id) => appelApi(`/artisans/${id}`)
export const getArtisansParCategorie = (idCategorie) => appelApi(`/artisans?categorie=${idCategorie}`)
export const rechercherArtisans = (texte) => appelApi(`/artisans?recherche=${encodeURIComponent(texte)}`)

export const envoyerMessage = (idArtisan, formulaire) =>
  appelApi(`/artisans/${idArtisan}/contact`, { method: 'POST', body: JSON.stringify(formulaire) })
