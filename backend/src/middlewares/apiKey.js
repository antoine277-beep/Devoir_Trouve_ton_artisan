/**
 * Limite l'accès à l'API à l'application "Trouve ton artisan".
 *
 * Chaque requête doit envoyer la clé d'API dans l'en-tête "X-API-Key".
 * Sans clé, ou avec une mauvaise clé, l'API répond 401 et ne renvoie rien.
 */
const crypto = require('node:crypto');
const env = require('../config/env');

// Empreinte SHA-256 de la clé attendue, calculée une seule fois au démarrage
const expectedHash = crypto.createHash('sha256').update(env.apiKey).digest();

function apiKey(req, res, next) {
  const received = req.get('X-API-Key') || '';
  const receivedHash = crypto.createHash('sha256').update(received).digest();

  // timingSafeEqual compare en temps constant : un attaquant ne peut pas
  // deviner la clé caractère par caractère en mesurant le temps de réponse
  if (!crypto.timingSafeEqual(expectedHash, receivedHash)) {
    return res.status(401).json({ message: "Accès refusé : clé d'API absente ou invalide." });
  }

  return next();
}

module.exports = apiKey;
