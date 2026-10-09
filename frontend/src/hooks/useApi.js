import { useEffect, useState } from 'react'

/**
 * Charge des données depuis l'API et suit l'état du chargement.
 *
 * @param {(signal: AbortSignal) => Promise<any>} loader fonction d'appel à l'API
 * @param {any[]} deps rechargement quand ces valeurs changent
 * @returns {{ data: any, error: import('../api/client').ApiError | null, loading: boolean }}
 */
export default function useApi(loader, deps) {
  // Clé qui identifie la requête en cours : quand elle change, on recharge
  const key = JSON.stringify(deps)
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    // Annule la requête si le composant disparaît ou si les paramètres changent
    const controller = new AbortController()

    loader(controller.signal)
      .then((data) => setResult({ key, data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setResult({ key, data: null, error })
        }
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // Tant que la réponse ne correspond pas à la requête en cours, on charge
  const loading = result.key !== key
  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
  }
}
