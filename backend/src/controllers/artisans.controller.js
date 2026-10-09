/**
 * Contrôleur des artisans : listes, fiche détaillée et formulaire de contact.
 */
const { Op } = require('sequelize');
const { Artisan, Specialite, Categorie } = require('../models');
const { serializeArtisan } = require('../utils/serializers');
const { sendContactMail } = require('../services/mailer');

// Jointures utilisées partout : artisan -> spécialité -> catégorie
const withSpecialiteEtCategorie = {
  model: Specialite,
  as: 'specialite',
  include: [{ model: Categorie, as: 'categorie' }],
};

/**
 * Échappe les caractères spéciaux de LIKE (% et _) : la recherche "100%"
 * cherche bien le texte "100%" et pas "100 suivi de n'importe quoi".
 */
function escapeLike(text) {
  return text.replace(/[\\%_]/g, (char) => `\\${char}`);
}

/**
 * GET /api/artisans?categorie=batiment&recherche=dupont
 * Liste des artisans, filtrée par catégorie et/ou par nom.
 */
async function listArtisans(req, res) {
  const { categorie, recherche } = req.query;
  const where = {};
  const categorieInclude = { model: Categorie, as: 'categorie' };

  if (recherche) {
    // La recherche porte sur le nom de l'artisan (insensible à la casse et aux accents)
    where.nom = { [Op.like]: `%${escapeLike(recherche)}%` };
  }

  if (categorie) {
    // On ne garde que les artisans dont la spécialité appartient à la catégorie
    categorieInclude.where = { slug: categorie };
  }

  const artisans = await Artisan.findAll({
    where,
    include: [{ model: Specialite, as: 'specialite', required: true, include: [categorieInclude] }],
    order: [['nom', 'ASC']],
    limit: 100, // garde-fou : jamais de réponse démesurée
  });

  res.json(artisans.map((artisan) => serializeArtisan(artisan)));
}

/** GET /api/artisans/top : les trois artisans du mois (page d'accueil). */
async function listTopArtisans(req, res) {
  const artisans = await Artisan.findAll({
    where: { top: true },
    include: [withSpecialiteEtCategorie],
    order: [['note', 'DESC'], ['nom', 'ASC']],
    limit: 3,
  });

  res.json(artisans.map((artisan) => serializeArtisan(artisan)));
}

/** GET /api/artisans/:id : fiche complète d'un artisan. */
async function getArtisan(req, res) {
  const artisan = await Artisan.findByPk(req.params.id, { include: [withSpecialiteEtCategorie] });

  if (!artisan) {
    return res.status(404).json({ message: 'Artisan introuvable.' });
  }

  return res.json(serializeArtisan(artisan, true));
}

/**
 * POST /api/artisans/:id/contact
 * Envoie la demande du visiteur par e-mail à l'artisan.
 */
async function contactArtisan(req, res) {
  const { nom, email, objet, message, site } = req.body;

  // Piège à robots rempli : on fait comme si tout allait bien, sans rien envoyer,
  // pour ne pas indiquer au robot qu'il a été repéré
  if (site) {
    return res.status(202).json({ message: 'Votre message a bien été envoyé.' });
  }

  const artisan = await Artisan.findByPk(req.params.id, { attributes: ['id_artisan', 'nom', 'email'] });
  if (!artisan) {
    return res.status(404).json({ message: 'Artisan introuvable.' });
  }

  try {
    await sendContactMail(artisan, { nom, email, objet, message });
  } catch (error) {
    console.error('[mail] échec de l\'envoi :', error.message);
    return res.status(502).json({
      message: "Votre message n'a pas pu être envoyé. Merci de réessayer dans quelques minutes.",
    });
  }

  return res.status(202).json({ message: 'Votre message a bien été envoyé. Une réponse vous sera apportée sous 48h.' });
}

module.exports = { listArtisans, listTopArtisans, getArtisan, contactArtisan };
