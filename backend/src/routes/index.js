/**
 * Routes de l'API (toutes préfixées par /api dans app.js).
 *
 *   GET  /api/categories               catégories du menu
 *   GET  /api/categories/:slug         une catégorie
 *   GET  /api/artisans                 liste (?categorie=slug&recherche=texte)
 *   GET  /api/artisans/top             les 3 artisans du mois
 *   GET  /api/artisans/:id             fiche d'un artisan
 *   POST /api/artisans/:id/contact     formulaire de contact
 */
const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const categories = require('../controllers/categories.controller');
const artisans = require('../controllers/artisans.controller');
const validate = require('../middlewares/validate');

const router = Router();

// Anti-spam : 5 messages par heure et par adresse IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Vous avez envoyé trop de messages. Merci de réessayer dans une heure.' },
});

router.get('/categories', categories.listCategories);
router.get('/categories/:slug', validate.categorieSlug, categories.getCategorie);

router.get('/artisans', validate.artisanFilters, artisans.listArtisans);
router.get('/artisans/top', artisans.listTopArtisans);
router.get('/artisans/:id', validate.artisanId, artisans.getArtisan);
router.post('/artisans/:id/contact', contactLimiter, validate.contactForm, artisans.contactArtisan);

module.exports = router;
