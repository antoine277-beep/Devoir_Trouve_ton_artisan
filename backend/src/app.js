/**
 * Construction de l'application Express : sécurité, routes, erreurs.
 * (le démarrage du serveur est dans server.js, ce qui permet de tester l'app)
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const apiKey = require('./middlewares/apiKey');
const { notFound, errorHandler } = require('./middlewares/errors');
const routes = require('./routes');
const serveFrontend = require('./frontend');

const app = express();

// Ne pas annoncer "X-Powered-By: Express" : inutile de donner des indices aux attaquants
app.disable('x-powered-by');

// Derrière le proxy de l'hébergeur, l'IP du visiteur est dans X-Forwarded-For
app.set('trust proxy', env.trustProxy);

// En-têtes de sécurité HTTP (CSP, HSTS, X-Content-Type-Options, X-Frame-Options...)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"], // le site ne peut pas être affiché dans une iframe (clickjacking)
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  }),
);

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
const api = express.Router();

// CORS : seuls les sites listés dans CORS_ORIGINS peuvent appeler l'API
// depuis un navigateur
api.use(
  cors({
    origin: env.corsOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-API-Key'],
    maxAge: 600,
  }),
);

// Limite globale : 600 requêtes par tranche de 15 minutes et par IP
// (freine les robots et les attaques par force brute ou déni de service,
// tout en laissant de la marge à plusieurs visiteurs derrière une même IP)
api.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Trop de requêtes. Merci de patienter quelques minutes.' },
  }),
);

// Petite route de supervision pour l'hébergeur (ne renvoie aucune donnée)
api.get('/health', (req, res) => res.json({ status: 'ok' }));

// Toutes les autres routes exigent la clé d'API
api.use(apiKey);

// Corps JSON uniquement, 10 Ko maximum (un message de contact n'a pas besoin de plus)
api.use(express.json({ limit: '10kb' }));

api.use(routes);
api.use(notFound);

app.use('/api', api);

// -----------------------------------------------------------------------------
// Site React (facultatif, si FRONTEND_DIST est renseigné)
// -----------------------------------------------------------------------------
if (env.frontendDist) {
  serveFrontend(app, env.frontendDist);
}

app.use(errorHandler);

module.exports = app;
