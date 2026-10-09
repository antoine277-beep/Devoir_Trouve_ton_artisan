/**
 * Règles de validation des données reçues (express-validator).
 *
 * Tout ce qui vient du visiteur (URL, paramètres, formulaire) est vérifié
 * AVANT d'être utilisé : type, longueur, format. Les données invalides sont
 * rejetées avec une erreur 400 qui liste les champs en cause.
 */
const { param, query, body, validationResult } = require('express-validator');

// Retire les retours à la ligne : empêche d'ajouter des en-têtes dans un e-mail
const singleLine = (value) => String(value).replace(/[\r\n]+/g, ' ');

/** Renvoie une erreur 400 si une des règles précédentes n'est pas respectée. */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Certaines données envoyées sont invalides.',
      errors: errors.array().map((error) => ({ champ: error.path, message: error.msg })),
    });
  }
  return next();
}

// Identifiant d'artisan dans l'URL : un entier positif
const artisanId = [
  param('id').isInt({ min: 1 }).withMessage('Identifiant invalide').toInt(),
  handleValidation,
];

// Filtres de la liste : catégorie (slug) et/ou texte recherché
const artisanFilters = [
  query('categorie')
    .optional()
    .isString().withMessage('Catégorie invalide').bail()
    .trim()
    .isLength({ max: 50 }).withMessage('Catégorie invalide')
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/).withMessage('Catégorie invalide'),
  query('recherche')
    .optional()
    .isString().withMessage('Recherche invalide').bail()
    .trim()
    .isLength({ max: 100 }).withMessage('La recherche est limitée à 100 caractères'),
  handleValidation,
];

// Slug de catégorie dans l'URL
const categorieSlug = [
  param('slug')
    .isLength({ max: 50 })
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .withMessage('Catégorie invalide'),
  handleValidation,
];

// Formulaire de contact
const contactForm = [
  ...artisanId.slice(0, 1),
  body('nom')
    .isString().withMessage('Le nom est obligatoire').bail()
    .customSanitizer(singleLine)
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ max: 100 }).withMessage('Le nom est limité à 100 caractères'),
  body('email')
    .isString().withMessage("L'adresse e-mail est obligatoire").bail()
    .trim()
    .isLength({ max: 255 }).withMessage("L'adresse e-mail est trop longue")
    .isEmail().withMessage("L'adresse e-mail n'est pas valide"),
  body('objet')
    .isString().withMessage("L'objet est obligatoire").bail()
    .customSanitizer(singleLine)
    .trim()
    .notEmpty().withMessage("L'objet est obligatoire")
    .isLength({ max: 150 }).withMessage("L'objet est limité à 150 caractères"),
  body('message')
    .isString().withMessage('Le message est obligatoire').bail()
    .trim()
    .isLength({ min: 10, max: 3000 }).withMessage('Le message doit contenir entre 10 et 3000 caractères'),
  // Piège à robots (honeypot) : traité dans le contrôleur
  body('site').optional().isString().isLength({ max: 255 }),
  handleValidation,
];

module.exports = { artisanId, artisanFilters, categorieSlug, contactForm };
