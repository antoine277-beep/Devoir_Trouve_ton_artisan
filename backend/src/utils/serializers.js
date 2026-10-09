/**
 * Mise en forme des données renvoyées par l'API.
 *
 * On choisit explicitement les champs envoyés au navigateur : l'adresse e-mail
 * des artisans n'en fait JAMAIS partie (protection des données personnelles
 * et contre la collecte d'adresses par des robots spammeurs).
 */

/** @param {import('sequelize').Model} categorie */
function serializeCategorie(categorie) {
  return {
    id: categorie.id_categorie,
    nom: categorie.nom,
    slug: categorie.slug,
  };
}

/**
 * @param {import('sequelize').Model} artisan artisan chargé avec sa spécialité et sa catégorie
 * @param {boolean} [complet=false] true pour la fiche détaillée (à propos, site web)
 */
function serializeArtisan(artisan, complet = false) {
  const data = {
    id: artisan.id_artisan,
    nom: artisan.nom,
    note: Number(artisan.note), // DECIMAL arrive en texte depuis MySQL
    ville: artisan.ville,
    image: artisan.image,
    top: Boolean(artisan.top),
    specialite: {
      id: artisan.specialite.id_specialite,
      nom: artisan.specialite.nom,
    },
    categorie: serializeCategorie(artisan.specialite.categorie),
  };

  if (complet) {
    data.aPropos = artisan.a_propos;
    data.siteWeb = artisan.site_web;
  }

  return data;
}

module.exports = { serializeCategorie, serializeArtisan };
