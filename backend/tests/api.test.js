/**
 * Tests de l'API (node:test + supertest).
 *
 * Ils utilisent la vraie base MySQL décrite dans .env : lancer d'abord les
 * scripts database/01_creation_bdd.sql et 02_alimentation_bdd.sql.
 *   npm test
 */
process.env.NODE_ENV = 'test';
process.env.SMTP_HOST = ''; // aucun e-mail réel pendant les tests

const { describe, it, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/app');
const env = require('../src/config/env');
const { sequelize } = require('../src/models');

// Raccourcis : requêtes avec la bonne clé d'API
const get = (url) => request(app).get(url).set('X-API-Key', env.apiKey);
const post = (url) => request(app).post(url).set('X-API-Key', env.apiKey);

const demande = {
  nom: 'Jean Test',
  email: 'jean.test@example.com',
  objet: 'Demande de devis',
  message: 'Bonjour, pourriez-vous me faire un devis ?',
};

after(() => sequelize.close());

describe('Sécurité', () => {
  it('refuse une requête sans clé d\'API', async () => {
    const res = await request(app).get('/api/categories');
    assert.equal(res.status, 401);
  });

  it('refuse une mauvaise clé d\'API', async () => {
    const res = await request(app).get('/api/categories').set('X-API-Key', 'mauvaise-cle');
    assert.equal(res.status, 401);
  });

  it('ajoute les en-têtes de sécurité (Helmet) et cache X-Powered-By', async () => {
    const res = await get('/api/categories');
    assert.equal(res.headers['x-powered-by'], undefined);
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
    assert.ok(res.headers['content-security-policy']);
  });

  it('autorise le site React (CORS)', async () => {
    const res = await get('/api/categories').set('Origin', env.corsOrigins[0]);
    assert.equal(res.headers['access-control-allow-origin'], env.corsOrigins[0]);
  });

  it('n\'autorise pas un autre site (CORS)', async () => {
    const res = await get('/api/categories').set('Origin', 'https://site-pirate.example');
    assert.equal(res.headers['access-control-allow-origin'], undefined);
  });

  it('renvoie 404 pour une route inconnue', async () => {
    const res = await get('/api/inconnue');
    assert.equal(res.status, 404);
  });
});

describe('Catégories', () => {
  it('renvoie les 4 catégories dans l\'ordre du menu', async () => {
    const res = await get('/api/categories');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.map((c) => c.nom), ['Bâtiment', 'Services', 'Fabrication', 'Alimentation']);
  });
});

describe('Artisans', () => {
  it('liste les 17 artisans', async () => {
    const res = await get('/api/artisans');
    assert.equal(res.body.length, 17);
  });

  it('renvoie les 3 artisans du mois', async () => {
    const res = await get('/api/artisans/top');
    assert.equal(res.body.length, 3);
  });

  it('filtre par catégorie', async () => {
    const res = await get('/api/artisans?categorie=batiment');
    assert.equal(res.body.length, 4);
    assert.ok(res.body.every((a) => a.specialite.categorie.slug === 'batiment'));
  });

  it('cherche par nom sans tenir compte des accents ni des majuscules', async () => {
    const res = await get('/api/artisans?recherche=LABBE');
    assert.deepEqual(res.body.map((a) => a.nom), ['Chocolaterie Labbé']);
  });

  it('refuse une catégorie mal écrite (tentative d\'injection)', async () => {
    const res = await get('/api/artisans?categorie=%27%20OR%201%3D1');
    assert.equal(res.status, 400);
  });

  it('renvoie la fiche complète, sans l\'adresse e-mail', async () => {
    const res = await get('/api/artisans/3');
    assert.equal(res.status, 200);
    assert.equal(res.body.nom, 'Chocolaterie Labbé');
    assert.equal(res.body.specialite.nom, 'Chocolatier');
    assert.equal(res.body.specialite.categorie.nom, 'Alimentation');
    assert.equal(res.body.email, undefined);
  });

  it('renvoie 404 pour un artisan qui n\'existe pas', async () => {
    const res = await get('/api/artisans/9999');
    assert.equal(res.status, 404);
  });

  it('renvoie 400 pour un identifiant qui n\'est pas un nombre', async () => {
    const res = await get('/api/artisans/abc');
    assert.equal(res.status, 400);
  });
});

describe('Formulaire de contact', () => {
  it('accepte une demande valide', async () => {
    const res = await post('/api/artisans/3/contact').send(demande);
    assert.equal(res.status, 200);
  });

  it('refuse un e-mail invalide', async () => {
    const res = await post('/api/artisans/3/contact').send({ ...demande, email: 'pas-un-email' });
    assert.equal(res.status, 400);
  });

  it('refuse un message vide', async () => {
    const res = await post('/api/artisans/3/contact').send({ ...demande, message: '' });
    assert.equal(res.status, 400);
  });

  it('refuse une requête trop volumineuse', async () => {
    const res = await post('/api/artisans/3/contact').send({ ...demande, message: 'x'.repeat(20000) });
    assert.equal(res.status, 413);
  });

  it('limite à 5 messages par heure', async () => {
    let res;
    for (let i = 0; i < 6; i += 1) {
      res = await post('/api/artisans/3/contact').send(demande);
    }
    assert.equal(res.status, 429);
  });
});
