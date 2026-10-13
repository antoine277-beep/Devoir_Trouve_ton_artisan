import useSeo from '../hooks/useSeo'
import image404 from '../assets/images/page-non-trouvee.svg'

/**
 * Page 404 : affichée pour toute adresse qui ne correspond à aucune page
 * (route "*" dans App.jsx), ou pour un artisan / une catégorie qui n'existe pas.
 */
export default function NotFound() {
  useSeo('Page non trouvée', "La page que vous avez demandée n'existe pas.")

  return (
    <div className="text-center">
      <img src={image404} alt="" className="img-fluid mb-3" width="480" height="300" />
      <h1>Page non trouvée</h1>
      <p>La page que vous avez demandée n'existe pas.</p>
    </div>
  )
}
