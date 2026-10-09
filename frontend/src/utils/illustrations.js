import batiment from '../assets/images/categories/batiment.svg'
import services from '../assets/images/categories/services.svg'
import fabrication from '../assets/images/categories/fabrication.svg'
import alimentation from '../assets/images/categories/alimentation.svg'

// Illustration par défaut de chaque catégorie (quand l'artisan n'a pas de photo)
const illustrations = { batiment, services, fabrication, alimentation }

/**
 * Image à afficher pour un artisan : sa photo/son logo s'il en a un,
 * sinon l'illustration de sa catégorie.
 */
export function artisanImage(artisan) {
  return artisan.image || illustrations[artisan.categorie.slug] || batiment
}

export default illustrations
