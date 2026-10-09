/**
 * Limite l'accès à l'API à l'application "Trouve ton artisan".
 *
 * Chaque requête doit envoyer la clé d'API dans l'en-tête "X-API-Key".
 * Sans clé, ou avec une mauvaise clé, l'API répond 401 (non autorisé).
 */
const env = require('../config/env');

function apiKey(req, res, next) {
  if (req.get('X-API-Key') !== env.apiKey) {
    return res.status(401).json({ message: "Accès refusé : clé d'API absente ou invalide." });
  }
  next();
}

module.exports = apiKey;
