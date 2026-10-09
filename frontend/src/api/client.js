/**
 * Accès à l'API "Trouve ton artisan".
 *
 * L'adresse de l'API et la clé d'accès viennent des variables d'environnement
 * (fichier .env, voir .env.example). Sans VITE_API_URL, l'API est appelée sur
 * le même domaine que le site (/api).
 */
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const API_KEY = import.meta.env.VITE_API_KEY || ''

/** Erreur renvoyée par l'API (garde le code HTTP pour l'afficher correctement). */
export class ApiError extends Error {
  constructor(status, message, details = []) {
    super(message)
    this.status = status
    this.details = details
  }
}

/**
 * Appelle l'API et renvoie la réponse JSON.
 * @param {string} path chemin après /api (ex : "/categories")
 * @param {RequestInit} [options]
 */
export async function apiFetch(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'X-API-Key': API_KEY,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError(0, 'Impossible de joindre le serveur. Vérifiez votre connexion internet.')
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.message || 'Une erreur est survenue.', data?.errors || [])
  }
  return data
}

export const getCategories = (signal) => apiFetch('/categories', { signal })
export const getCategorie = (slug, signal) => apiFetch(`/categories/${encodeURIComponent(slug)}`, { signal })
export const getTopArtisans = (signal) => apiFetch('/artisans/top', { signal })
export const getArtisan = (id, signal) => apiFetch(`/artisans/${encodeURIComponent(id)}`, { signal })

/** @param {{ categorie?: string, recherche?: string }} filtres */
export function getArtisans(filtres, signal) {
  const params = new URLSearchParams()
  if (filtres.categorie) params.set('categorie', filtres.categorie)
  if (filtres.recherche) params.set('recherche', filtres.recherche)
  return apiFetch(`/artisans?${params}`, { signal })
}

/** Envoie le formulaire de contact d'un artisan. */
export function sendContact(id, demande) {
  return apiFetch(`/artisans/${encodeURIComponent(id)}/contact`, {
    method: 'POST',
    body: JSON.stringify(demande),
  })
}
