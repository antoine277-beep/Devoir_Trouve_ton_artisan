/**
 * Lecture et vérification des variables d'environnement.
 *
 * Toutes les informations sensibles (mots de passe, clé d'API, SMTP...) sont
 * stockées dans le fichier .env, qui n'est jamais publié sur GitHub
 * (voir .gitignore). Le fichier .env.example sert de modèle.
 */
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env'), quiet: true });

/**
 * Retourne la valeur d'une variable obligatoire, ou arrête l'application
 * avec un message clair si elle est absente.
 */
function required(name) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Variable d'environnement manquante : ${name} (voir .env.example)`);
  }
  return value;
}

/** Retourne la valeur d'une variable facultative, ou la valeur par défaut. */
function optional(name, defaultValue = '') {
  const value = process.env[name];
  return value === undefined || value === '' ? defaultValue : value;
}

const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: Number(optional('PORT', '3001')),
  // Adresse d'écoute imposée par certains hébergeurs (alwaysdata : IP ou HOST)
  host: optional('IP', optional('HOST')),

  // Nombre de proxys devant l'application (hébergeur), utile pour que le
  // limiteur de requêtes voie la vraie adresse IP du visiteur
  trustProxy: Number(optional('TRUST_PROXY', '0')),

  db: {
    host: optional('DB_HOST', '127.0.0.1'),
    port: Number(optional('DB_PORT', '3306')),
    name: required('DB_NAME'),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
  },

  // Clé partagée avec l'application front : sans elle, l'API refuse de répondre
  apiKey: required('API_KEY'),

  // Liste des sites autorisés à appeler l'API depuis un navigateur (CORS)
  corsOrigins: optional('CORS_ORIGINS', 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  mail: {
    host: optional('SMTP_HOST'),
    port: Number(optional('SMTP_PORT', '587')),
    secure: optional('SMTP_SECURE', 'false') === 'true',
    user: optional('SMTP_USER'),
    password: optional('SMTP_PASSWORD'),
    from: optional('MAIL_FROM', 'Trouve ton artisan <no-reply@trouve-ton-artisan.fr>'),
    // Si renseignée, tous les e-mails partent vers cette adresse de test
    // au lieu de l'adresse de l'artisan (jeu d'essai = adresses fictives)
    redirectTo: optional('MAIL_REDIRECT_TO'),
  },

  // Facultatif : chemin du build React (frontend/dist) pour que l'API serve
  // aussi le site, et ainsi n'héberger qu'une seule application
  frontendDist: optional('FRONTEND_DIST'),
};

env.isProduction = env.nodeEnv === 'production';

// Une clé trop courte se devine facilement : on impose 32 caractères minimum
if (env.apiKey.length < 32) {
  throw new Error('API_KEY doit contenir au moins 32 caractères');
}

module.exports = env;
