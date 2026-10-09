/**
 * Gestion centralisée des erreurs de l'API.
 */
const env = require('../config/env');

/** Route d'API inconnue : 404 en JSON. */
function notFound(req, res) {
  res.status(404).json({ message: 'Ressource introuvable.' });
}

/**
 * Toutes les erreurs non prévues arrivent ici. Le détail technique est écrit
 * dans les logs du serveur mais n'est jamais renvoyé au visiteur : une pile
 * d'erreur révèlerait l'organisation interne de l'application.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Erreurs "client" levées par Express (JSON mal formé, requête trop grosse...)
  if (err.status >= 400 && err.status < 500) {
    const messages = {
      400: 'Requête mal formée.',
      413: 'Requête trop volumineuse.',
    };
    return res.status(err.status).json({ message: messages[err.status] || 'Requête invalide.' });
  }

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, env.isProduction ? err.message : err);
  return res.status(500).json({ message: 'Une erreur interne est survenue. Merci de réessayer plus tard.' });
}

module.exports = { notFound, errorHandler };
