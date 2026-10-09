/**
 * Contrôleur des artisans : listes, fiche détaillée et formulaire de contact.
 */
const { Op } = require('sequelize');
const { Artisan, Specialite, Categorie } = require('../models');
const { envoyerDemande } = require('../services/mailer');

// L'adresse e-mail des artisans n'est JAMAIS envoyée au navigateur
// (protection des données personnelles et contre les robots spammeurs)
const sansEmail = { exclude: ['email'] };

// On récupère aussi la spécialité de l'artisan et la catégorie de cette spécialité
const avecSpecialiteEtCategorie = {
  model: Specialite,
  as: 'specialite',
  include: [{ model: Categorie, as: 'categorie' }],
};

/**
 * GET /api/artisans?categorie=batiment  ou  GET /api/artisans?recherche=dupont
 * Liste des artisans d'une catégorie, ou dont le nom contient le texte recherché.
 */
async function listerArtisans(req, res) {
  const { categorie, recherche } = req.query;

  // Filtre sur le nom de l'artisan : LIKE '%texte%' (le nom contient le texte,
  // sans tenir compte des majuscules ni des accents)
  const filtreNom = recherche ? { nom: { [Op.like]: `%${recherche}%` } } : {};

  // Filtre sur la catégorie de la spécialité (ex : slug = 'batiment')
  const filtreCategorie = categorie ? { slug: categorie } : {};

  const artisans = await Artisan.findAll({
    where: filtreNom,
    attributes: sansEmail,
    include: [
      {
        model: Specialite,
        as: 'specialite',
        required: true,
        include: [{ model: Categorie, as: 'categorie', where: filtreCategorie }],
      },
    ],
    order: [['nom', 'ASC']],
  });
  res.json(artisans);
}

/** GET /api/artisans/top : les trois artisans du mois (page d'accueil). */
async function listerArtisansDuMois(req, res) {
  const artisans = await Artisan.findAll({
    where: { top: true },
    attributes: sansEmail,
    include: [avecSpecialiteEtCategorie],
    order: [['note', 'DESC']],
    limit: 3,
  });
  res.json(artisans);
}

/** GET /api/artisans/:id : fiche complète d'un artisan. */
async function afficherArtisan(req, res) {
  const artisan = await Artisan.findByPk(req.params.id, {
    attributes: sansEmail,
    include: [avecSpecialiteEtCategorie],
  });

  if (!artisan) {
    return res.status(404).json({ message: 'Artisan introuvable.' });
  }
  res.json(artisan);
}

/**
 * POST /api/artisans/:id/contact
 * Envoie la demande du visiteur par e-mail à l'artisan.
 */
async function contacterArtisan(req, res) {
  // Ici on a besoin de l'e-mail de l'artisan, mais il reste côté serveur
  const artisan = await Artisan.findByPk(req.params.id);
  if (!artisan) {
    return res.status(404).json({ message: 'Artisan introuvable.' });
  }

  const { nom, email, objet, message } = req.body;
  try {
    await envoyerDemande(artisan, { nom, email, objet, message });
  } catch (erreur) {
    console.error("[mail] échec de l'envoi :", erreur.message);
    return res.status(500).json({ message: "Votre message n'a pas pu être envoyé. Merci de réessayer plus tard." });
  }

  res.json({ message: 'Votre message a bien été envoyé. Une réponse vous sera apportée sous 48h.' });
}

module.exports = { listerArtisans, listerArtisansDuMois, afficherArtisan, contacterArtisan };
