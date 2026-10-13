# Trouve ton artisan !

Plateforme de la région Auvergne-Rhône-Alpes pour trouver un artisan et le contacter.
Site React (Bootstrap, Sass) et API Node.js / Express / Sequelize avec une base MySQL.

## Prérequis

- [Node.js](https://nodejs.org/) **22.23.2** ou **24.18.1** minimum, et npm
- **MySQL 8** (ou MariaDB), avec un compte administrateur

## Installation

### 1. Base de données

Remplacez d'abord le mot de passe du compte `tta_api` à la fin de `database/01_creation_bdd.sql`, puis :

```bash
mysql -u root -p < database/01_creation_bdd.sql
mysql -u root -p trouve_ton_artisan < database/02_alimentation_bdd.sql
```

### 2. API

```bash
cd backend
cp .env.example .env
npm install
```

Dans `backend/.env`, renseignez `DB_PASSWORD` (mot de passe de `tta_api`) et `API_KEY` (32 caractères minimum), par exemple générée avec :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Site

```bash
cd frontend
cp .env.example .env
npm install
```

Dans `frontend/.env`, mettez dans `VITE_API_KEY` la même valeur que `API_KEY`.

## Lancement

Dans deux terminaux :

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Le site est alors sur http://localhost:5173 et l'API sur http://localhost:3001/api.
Sans serveur SMTP renseigné dans `backend/.env`, les e-mails du formulaire ne sont pas envoyés : ils s'affichent dans le terminal de l'API.

## Mise en production

```bash
cd frontend
npm run build
```

Puis, dans `backend/.env`, renseignez `NODE_ENV=production` et `FRONTEND_DIST=../frontend/dist` : l'API sert alors aussi le site.

```bash
cd backend
npm start
```
