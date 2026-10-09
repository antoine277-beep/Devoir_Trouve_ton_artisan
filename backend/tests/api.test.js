/**
 * Tests de l'API (node:test + supertest).
 *
 * Ils interrogent la vraie base MySQL décrite dans .env : lancer d'abord les
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

const KEY = env.apiKey;
const get = (url) => request(app).get(url).set('X-API-Key', KEY);
const post = (url) => request(app).post(url).set('X-API-Key', KEY);

const demandeValide = {
  nom: 'Jean Test',
  email: 'jean.test@example.com',
  objet: 'Demande de devis',
  message: 'Bonjour, pourriez-vous me faire un devis ?',
};

after(() => sequelize.close());

describe('Accès à l\'API', () => {
  it('la route de supervision répond sans clé', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
  });

  it('refuse une requête sans clé d\'API', async () => {
    const res = await request(app).get('/api/categories');
    assert.equal(res.status, 401);
  });

  it('refuse une mauvaise clé d\'API', async () => {
    const res = await request(app).get('/api/categories').set('X-API-Key', 'mauvaise-cle');
    assert.equal(res.status, 401);
  });

  it('renvoie 404 sur une route inconnue', async () => {
    const res = await get('/api/inconnue');
    assert.equal(res.status, 404);
  });
});

describe('En-têtes de sécurité', () => {
  it('cache X-Powered-By et ajoute les en-têtes de Helmet', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.headers['x-powered-by'], undefined);
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
    assert.match(res.headers['content-security-policy'], /default-src 'self'/);
  });

  it('autorise l\'origine du front (CORS)', async () => {
    const res = await get('/api/categories').set('Origin', env.corsOrigins[0]);
    assert.equal(res.headers['access-control-allow-origin'], env.corsOrigins[0]);
  });

  it('n\'autorise pas un autre site (CORS)', async () => {
    const res = await get('/api/categories').set('Origin', 'https://site-pirate.example');
    assert.equal(res.headers['access-control-allow-origin'], undefined);
  });
});

describe('Catégories', () => {
  it('renvoie les 4 catégories dans l\'ordre du menu', async () => {
    const res = await get('/api/categories');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.map((c) => c.nom), ['Bâtiment', 'Services', 'Fabrication', 'Alimentation']);
  });

  it('renvoie une catégorie par son slug', async () => {
    const res = await get('/api/categories/batiment');
    assert.equal(res.status, 200);
    assert.equal(res.body.nom, 'Bâtiment');
  });

  it('renvoie 404 pour une catégorie inconnue', async () => {
    const res = await get('/api/categories/inconnue');
    assert.equal(res.status, 404);
  });
});

describe('Artisans', () => {
  it('liste les 17 artisans', async () => {
    const res = await get('/api/artisans');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 17);
  });

  it('renvoie les 3 artisans du mois', async () => {
    const res = await get('/api/artisans/top');
    assert.equal(res.body.length, 3);
    assert.ok(res.body.every((a) => a.top === true));
  });

  it('filtre par catégorie', async () => {
    const res = await get('/api/artisans?categorie=batiment');
    assert.equal(res.body.length, 4);
    assert.ok(res.body.every((a) => a.categorie.slug === 'batiment'));
  });

  it('recherche par nom sans tenir compte des accents ni des majuscules', async () => {
    const res = await get('/api/artisans?recherche=LABBE');
    assert.deepEqual(res.body.map((a) => a.nom), ['Chocolaterie Labbé']);
  });

  it('traite % comme un caractère normal dans la recherche', async () => {
    const res = await get('/api/artisans?recherche=%25');
    assert.equal(res.body.length, 0);
  });

  it('refuse une catégorie mal formée', async () => {
    const res = await get('/api/artisans?categorie=%27%20OR%201%3D1');
    assert.equal(res.status, 400);
  });

  it('renvoie la fiche complète sans l\'adresse e-mail', async () => {
    const res = await get('/api/artisans/3');
    assert.equal(res.status, 200);
    assert.equal(res.body.nom, 'Chocolaterie Labbé');
    assert.equal(res.body.note, 4.9);
    assert.equal(res.body.specialite.nom, 'Chocolatier');
    assert.equal(res.body.categorie.nom, 'Alimentation');
    assert.ok(res.body.aPropos);
    assert.equal(res.body.email, undefined);
  });

  it('renvoie 404 pour un artisan inconnu', async () => {
    const res = await get('/api/artisans/9999');
    assert.equal(res.status, 404);
  });

  it('renvoie 400 pour un identifiant invalide', async () => {
    const res = await get('/api/artisans/abc');
    assert.equal(res.status, 400);
  });
});

describe('Formulaire de contact', () => {
  it('accepte une demande valide', async () => {
    const res = await post('/api/artisans/3/contact').send(demandeValide);
    assert.equal(res.status, 202);
  });

  it('refuse un e-mail invalide en indiquant le champ', async () => {
    const res = await post('/api/artisans/3/contact').send({ ...demandeValide, email: 'pas-un-email' });
    assert.equal(res.status, 400);
    assert.equal(res.body.errors[0].champ, 'email');
  });

  it('refuse un message vide', async () => {
    const res = await post('/api/artisans/3/contact').send({ ...demandeValide, message: '' });
    assert.equal(res.status, 400);
  });

  it('refuse une requête trop volumineuse', async () => {
    const res = await post('/api/artisans/3/contact').send({ ...demandeValide, message: 'x'.repeat(20000) });
    assert.equal(res.status, 413);
  });

  it('ignore silencieusement un robot (champ piège rempli)', async () => {
    const res = await post('/api/artisans/3/contact').send({ ...demandeValide, site: 'http://spam.example' });
    assert.equal(res.status, 202);
  });

  it('limite le nombre de messages par heure', async () => {
    let res;
    for (let i = 0; i < 6; i += 1) {
      res = await post('/api/artisans/3/contact').send(demandeValide);
    }
    assert.equal(res.status, 429);
  });
});
