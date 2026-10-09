/**
 * Contrôleur des catégories : alimente le menu du header.
 */
const { Categorie } = require('../models');

/** GET /api/categories : toutes les catégories, dans l'ordre du menu. */
async function listerCategories(req, res) {
  const categories = await Categorie.findAll({ order: [['id_categorie', 'ASC']] });
  res.json(categories);
}

module.exports = { listerCategories };
