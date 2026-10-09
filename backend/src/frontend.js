/**
 * Sert le site React compilé (frontend/dist) depuis le même serveur que l'API.
 *
 * React gère lui-même la navigation entre les pages (React Router) : le
 * serveur renvoie donc toujours index.html. Pour le référencement, une adresse
 * qui ne correspond à aucune page renvoie en plus le code HTTP 404 (la page
 * 404 de React s'affiche alors).
 */
const path = require('node:path');
const express = require('express');

// Pages connues du site (mêmes chemins que dans frontend/src/App.jsx)
const knownPages = [
  /^\/$/,
  /^\/categorie\/[a-z0-9-]+\/?$/,
  /^\/recherche\/?$/,
  /^\/artisan\/\d+\/?$/,
  /^\/(mentions-legales|donnees-personnelles|accessibilite|cookies)\/?$/,
];

function serveFrontend(app, distPath) {
  const root = path.resolve(distPath);
  const indexFile = path.join(root, 'index.html');

  // Fichiers compilés (JS, CSS, images) : leur nom contient une empreinte,
  // le navigateur peut donc les garder longtemps en cache
  app.use(
    '/assets',
    express.static(path.join(root, 'assets'), { immutable: true, maxAge: '1y', fallthrough: false }),
  );
  app.use(express.static(root, { index: false, maxAge: '1h' }));

  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }
    const status = knownPages.some((page) => page.test(req.path)) ? 200 : 404;
    return res.status(status).sendFile(indexFile, { headers: { 'Cache-Control': 'no-cache' } });
  });
}

module.exports = serveFrontend;
