/**
 * Contrôleur des catégories : alimente le menu du header.
 */
const { Categorie } = require('../models');
const { serializeCategorie } = require('../utils/serializers');

/** GET /api/categories : toutes les catégories, dans l'ordre du menu. */
async function listCategories(req, res) {
  const categories = await Categorie.findAll({ order: [['id_categorie', 'ASC']] });
  res.json(categories.map(serializeCategorie));
}

/** GET /api/categories/:slug : une catégorie (titre de la page liste). */
async function getCategorie(req, res) {
  const categorie = await Categorie.findOne({ where: { slug: req.params.slug } });
  if (!categorie) {
    return res.status(404).json({ message: 'Catégorie introuvable.' });
  }
  return res.json(serializeCategorie(categorie));
}

module.exports = { listCategories, getCategorie };
