/**
 * Routes de l'API (toutes préfixées par /api dans app.js).
 *
 *   GET  /api/categories               catégories du menu
 *   GET  /api/artisans                 liste (?categorie=batiment ou ?recherche=texte)
 *   GET  /api/artisans/top             les 3 artisans du mois
 *   GET  /api/artisans/:id             fiche d'un artisan
 *   POST /api/artisans/:id/contact     formulaire de contact
 */
const express = require('express');
const rateLimit = require('express-rate-limit');
const categories = require('../controllers/categories.controller');
const artisans = require('../controllers/artisans.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

// Anti-spam : 5 messages par heure maximum depuis une même adresse IP
const limiteContact = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { message: 'Vous avez envoyé trop de messages. Merci de réessayer dans une heure.' },
});

router.get('/categories', categories.listerCategories);
router.get('/artisans', validate.filtresArtisans, artisans.listerArtisans);
router.get('/artisans/top', artisans.listerArtisansDuMois);
router.get('/artisans/:id', validate.ficheArtisan, artisans.afficherArtisan);
router.post('/artisans/:id/contact', limiteContact, validate.formulaireContact, artisans.contacterArtisan);

module.exports = router;
