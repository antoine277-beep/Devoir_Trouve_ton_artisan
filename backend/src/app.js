/**
 * Application Express : sécurité, routes de l'API et gestion des erreurs.
 * (le démarrage du serveur est dans server.js, ce qui permet de tester l'app)
 */
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const apiKey = require('./middlewares/apiKey');
const { notFound, errorHandler } = require('./middlewares/errors');
const routes = require('./routes');

const app = express();

// Chez l'hébergeur, l'adresse IP du visiteur est transmise par un proxy
app.set('trust proxy', env.trustProxy);

// En-têtes de sécurité HTTP (Content-Security-Policy, HSTS, anti-iframe...)
// Helmet retire aussi l'en-tête "X-Powered-By: Express"
app.use(helmet());

// -----------------------------------------------------------------------------
// API : toutes les adresses qui commencent par /api
// -----------------------------------------------------------------------------
const api = express.Router();

// CORS : seuls les sites autorisés peuvent appeler l'API depuis un navigateur
api.use(cors({ origin: env.corsOrigins }));

// Maximum 600 requêtes par tranche de 15 minutes et par adresse IP
// (freine les robots et les tentatives de saturation du serveur)
api.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    message: { message: 'Trop de requêtes. Merci de patienter quelques minutes.' },
  }),
);

// Toutes les routes de l'API exigent la clé d'API
api.use(apiKey);

// Lecture du JSON envoyé par le formulaire (10 Ko maximum)
api.use(express.json({ limit: '10kb' }));

api.use(routes);
api.use(notFound);
app.use('/api', api);

// -----------------------------------------------------------------------------
// Site React compilé (facultatif) : une seule application à héberger
// -----------------------------------------------------------------------------
if (env.frontendDist) {
  const dossier = path.resolve(env.frontendDist);
  app.use(express.static(dossier));
  // React Router gère les pages : pour toute autre adresse, on renvoie index.html
  app.get('/{*page}', (req, res) => res.sendFile(path.join(dossier, 'index.html')));
}

app.use(errorHandler);

module.exports = app;
