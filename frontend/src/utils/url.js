/**
 * Vérifie qu'une adresse web est sûre avant d'en faire un lien :
 * seuls http:// et https:// sont acceptés (jamais "javascript:..." par exemple).
 * @returns {string | null} l'adresse si elle est sûre, sinon null
 */
export function safeUrl(url) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null
  } catch {
    return null
  }
}

/** Adresse sans le protocole, plus lisible : "https://exemple.fr/" -> "exemple.fr" */
export function displayUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
