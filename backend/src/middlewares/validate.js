/**
 * Vérification des données reçues (express-validator).
 *
 * Tout ce qui vient du visiteur (adresse, recherche, formulaire) est vérifié
 * avant d'être utilisé. Si une règle n'est pas respectée, l'API répond 400
 * avec la liste des erreurs.
 */
const { param, query, body, validationResult } = require('express-validator');

// Renvoie une erreur 400 si une des règles précédentes n'est pas respectée
function verifier(req, res, next) {
  const erreurs = validationResult(req);
  if (!erreurs.isEmpty()) {
    return res.status(400).json({
      message: 'Certaines données envoyées sont invalides.',
      erreurs: erreurs.array().map((erreur) => erreur.msg),
    });
  }
  next();
}

// Identifiant d'artisan dans l'adresse (/api/artisans/3) : un nombre entier
const idArtisan = param('id').isInt({ min: 1 }).withMessage('Identifiant invalide');

// Liste des artisans : catégorie (ex : "batiment") et/ou texte recherché
const filtresArtisans = [
  query('categorie').optional().isSlug().withMessage('Catégorie invalide'),
  query('recherche').optional().isLength({ max: 100 }).withMessage('Recherche trop longue'),
  verifier,
];

// Fiche artisan
const ficheArtisan = [idArtisan, verifier];

// Formulaire de contact
const formulaireContact = [
  idArtisan,
  body('nom').trim().isLength({ min: 1, max: 100 }).withMessage('Le nom est obligatoire (100 caractères maximum).'),
  body('email').trim().isEmail().withMessage("L'adresse e-mail n'est pas valide."),
  body('objet').trim().isLength({ min: 1, max: 150 }).withMessage("L'objet est obligatoire (150 caractères maximum)."),
  body('message').trim().isLength({ min: 10, max: 3000 }).withMessage('Le message doit faire entre 10 et 3000 caractères.'),
  verifier,
];

module.exports = { filtresArtisans, ficheArtisan, formulaireContact };
