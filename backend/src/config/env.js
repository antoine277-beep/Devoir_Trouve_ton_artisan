/**
 * Lecture des variables d'environnement (fichier .env).
 *
 * Les informations sensibles (mots de passe, clé d'API, SMTP) sont dans le
 * fichier .env, qui n'est jamais publié sur GitHub (voir .gitignore).
 * Le fichier .env.example sert de modèle.
 */
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env'), quiet: true });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3001,
  // Adresse d'écoute imposée par certains hébergeurs (alwaysdata fournit IP)
  host: process.env.IP || process.env.HOST || undefined,

  // Nombre de proxys devant l'application chez l'hébergeur : permet au
  // limiteur de requêtes de voir la vraie adresse IP des visiteurs
  trustProxy: Number(process.env.TRUST_PROXY) || 0,

  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  // Clé partagée avec le site React : sans elle, l'API refuse de répondre
  apiKey: process.env.API_KEY,

  // Sites autorisés à appeler l'API depuis un navigateur (séparés par des virgules)
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),

  mail: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.MAIL_FROM || 'Trouve ton artisan <no-reply@trouve-ton-artisan.fr>',
    // Si renseignée, tous les e-mails partent vers cette adresse de test au lieu
    // de celle de l'artisan (les adresses du jeu d'essai peuvent exister)
    redirectTo: process.env.MAIL_REDIRECT_TO,
  },

  // Facultatif : dossier du site React compilé, pour que l'API serve aussi le site
  frontendDist: process.env.FRONTEND_DIST,
};

// Sans clé d'API (ou avec une clé trop courte, donc facile à deviner), on refuse de démarrer
if (!env.apiKey || env.apiKey.length < 32) {
  throw new Error('API_KEY manquante ou trop courte (32 caractères minimum), voir .env.example');
}

module.exports = env;
