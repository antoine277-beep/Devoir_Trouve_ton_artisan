import { Link } from 'react-router'

import Seo from '../components/Seo'
import image404 from '../assets/images/page-non-trouvee.svg'

/**
 * Page 404 : affichée pour toute adresse qui ne correspond à aucune page,
 * ou pour un artisan / une catégorie qui n'existe pas.
 */
export default function NotFound() {
  return (
    <section className="section not-found">
      <Seo
        title="Page non trouvée"
        description="La page que vous avez demandée n'existe pas ou n'est plus disponible."
        noIndex
      />
      <div className="container text-center">
        <img src={image404} alt="" className="not-found__image" width="480" height="300" />
        <h1 className="not-found__title">Page non trouvée</h1>
        <p className="not-found__text">
          La page que vous avez demandée n’existe pas ou n’est plus disponible.
          <br />
          Vérifiez l’adresse ou retournez à l’accueil pour trouver votre artisan.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Retour à l’accueil
        </Link>
      </div>
    </section>
  )
}
