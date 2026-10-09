# Trouve ton artisan !

Plateforme de la **région Auvergne-Rhône-Alpes** qui permet aux particuliers de trouver un artisan de la région et de le contacter via un formulaire (réponse sous 48h).

- Site en ligne : _à compléter après l'hébergement_
- Maquettes Figma : _à compléter_

## Fonctionnalités

- **Accueil** : fonctionnement du site en 4 étapes (« Comment trouver mon artisan ? ») et les 3 artisans du mois
- **Menu** des catégories (Bâtiment, Services, Fabrication, Alimentation) alimenté par la base de données
- **Recherche** des artisans par leur nom (insensible aux majuscules et aux accents)
- **Liste** des artisans d'une catégorie ou d'une recherche, sous forme de fiches cliquables
- **Fiche artisan** : image, note en étoiles, spécialité, ville, « À propos », site web et formulaire de contact qui envoie un e-mail à l'artisan
- **Pages légales** en construction et **page 404**
- Site **mobile first**, conforme **WCAG 2.1 AA** et validé par les vérificateurs du **W3C**

## Technologies

| Partie | Outils |
|---|---|
| Front | React 19, React Router, Bootstrap 5.3, Sass, Vite |
| API | Node.js, Express 5, Sequelize, Nodemailer |
| Base de données | MySQL 8 (ou MariaDB 10.5+) |
| Sécurité | Helmet, CORS, express-rate-limit, express-validator |

## Prérequis

- [Node.js](https://nodejs.org/) **20 ou plus récent** (testé avec Node 24) et npm
- **MySQL 8** ou **MariaDB 10.5+**, avec un compte administrateur (root)
- Git

## Installation

### 1. Récupérer le projet

```bash
git clone <adresse-du-depot>
cd trouve-ton-artisan
```

### 2. Créer la base de données

Avant de lancer le premier script, remplacez le mot de passe du compte `tta_api` à la fin de `database/01_creation_bdd.sql`.

```bash
mysql -u root -p < database/01_creation_bdd.sql
mysql -u root -p trouve_ton_artisan < database/02_alimentation_bdd.sql
```

| Script | Rôle |
|---|---|
| `01_creation_bdd.sql` | crée la base `trouve_ton_artisan`, les 3 tables et le compte `tta_api` (lecture seule) |
| `02_alimentation_bdd.sql` | insère le jeu d'essai : 4 catégories, 15 spécialités, 17 artisans |

### 3. Configurer et installer l'API

```bash
cd backend
cp .env.example .env
npm install
```

Complétez ensuite `backend/.env` :

- `DB_PASSWORD` : le mot de passe choisi pour `tta_api` ;
- `API_KEY` : une clé d'au moins 32 caractères, à générer avec :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Configurer et installer le site

```bash
cd ../frontend
cp .env.example .env
npm install
```

Dans `frontend/.env`, mettez dans `VITE_API_KEY` la **même valeur** que `API_KEY`.

## Lancement en développement

Dans deux terminaux :

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

- Site : http://localhost:5173
- API : http://localhost:3001/api (Vite redirige automatiquement `/api` vers l'API)

Sans serveur SMTP configuré, les e-mails du formulaire ne sont **pas envoyés** : ils s'affichent dans le terminal de l'API.

## Tests

L'API est couverte par 25 tests (accès, sécurité, catégories, artisans, formulaire), à lancer base de données démarrée :

```bash
cd backend
npm test
```

## Mise en production

```bash
cd frontend
npm run build
```

Le site compilé se trouve dans `frontend/dist`. L'API peut le servir elle-même : renseignez `FRONTEND_DIST=../frontend/dist` et `NODE_ENV=production` dans `backend/.env`, puis :

```bash
cd backend
npm start
```

Le site et l'API sont alors disponibles à la même adresse (une seule application à héberger). Les étapes détaillées pour l'hébergeur alwaysdata sont dans [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md).

## Structure du projet

```
trouve-ton-artisan/
├── database/                 scripts SQL (création, alimentation)
├── backend/                  API REST
│   ├── src/
│   │   ├── config/           variables d'environnement, connexion MySQL
│   │   ├── models/           modèles Sequelize (categorie, specialite, artisan)
│   │   ├── controllers/      logique des routes
│   │   ├── routes/           liste des routes de l'API
│   │   ├── middlewares/      clé d'API, validation, erreurs
│   │   ├── services/         envoi des e-mails
│   │   ├── app.js            application Express (sécurité, routes)
│   │   └── server.js         démarrage du serveur
│   └── tests/                tests de l'API
└── frontend/                 site React
    ├── public/               favicons
    └── src/
        ├── api/              appels à l'API
        ├── components/       header, footer, cartes, formulaire...
        ├── pages/            accueil, liste, fiche, pages légales, 404
        └── styles/           Sass (variables de la charte, composants, pages)
```

## Routes de l'API

Toutes les routes (sauf `/api/health`) exigent l'en-tête `X-API-Key`.

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/categories` | catégories du menu |
| GET | `/api/categories/:slug` | une catégorie |
| GET | `/api/artisans?categorie=&recherche=` | liste filtrée par catégorie et/ou nom |
| GET | `/api/artisans/top` | les 3 artisans du mois |
| GET | `/api/artisans/:id` | fiche d'un artisan |
| POST | `/api/artisans/:id/contact` | envoi du formulaire de contact (`nom`, `email`, `objet`, `message`) |

## Sécurité

- accès à l'API limité à l'application par une **clé d'API** et une liste blanche **CORS** ;
- compte MySQL de l'API en **lecture seule** (SELECT uniquement) ;
- requêtes **paramétrées** (Sequelize) et échappement des jokers `%` et `_` contre l'injection SQL ;
- **validation** de toutes les données reçues, côté site et côté API ;
- en-têtes de sécurité HTTP avec **Helmet** (CSP stricte, HSTS, anti-clickjacking...) ;
- **limitation du nombre de requêtes** (globale et formulaire de contact) et **piège à robots** ;
- l'adresse e-mail des artisans n'est **jamais envoyée au navigateur** ;
- secrets dans des fichiers `.env` **non publiés**, dépendances vérifiées avec `npm audit`.

## Auteur

Projet réalisé dans le cadre de la formation du Centre Européen de Formation.
