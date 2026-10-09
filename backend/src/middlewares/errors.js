/**
 * Gestion des erreurs de l'API.
 */

// Route d'API qui n'existe pas
function notFound(req, res) {
  res.status(404).json({ message: 'Ressource introuvable.' });
}

// Toutes les erreurs non prévues arrivent ici. Le détail est écrit dans le
// terminal du serveur mais n'est pas envoyé au visiteur : il pourrait donner
// des indications sur le fonctionnement interne de l'application.
// (Express reconnaît un gestionnaire d'erreurs à ses 4 paramètres)
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Erreur du visiteur (JSON mal écrit, message trop gros...)
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ message: 'Requête invalide.' });
  }

  console.error(err);
  res.status(500).json({ message: 'Une erreur interne est survenue. Merci de réessayer plus tard.' });
}

module.exports = { notFound, errorHandler };
