# Mise en ligne sur alwaysdata

[alwaysdata](https://www.alwaysdata.com/fr/) est un hébergeur français dont l'offre gratuite (100 Mo, sans carte bancaire) comprend tout ce dont le projet a besoin : **Node.js**, une base **MariaDB/MySQL**, un accès **SSH** et un serveur **SMTP** pour les e-mails. L'API sert aussi le site React : il n'y a qu'une seule application à héberger.

Dans la suite, remplacez `<compte>` par le nom de votre compte alwaysdata.

## 1. Créer le compte

Inscrivez-vous sur alwaysdata.com et choisissez l'offre gratuite. Le site sera disponible à l'adresse `https://<compte>.alwaysdata.net`.

## 2. Créer la base de données

1. **Bases de données > MySQL > Ajouter une base** : par exemple `<compte>_artisan`.
2. **Bases de données > MySQL > Utilisateurs > Ajouter** : par exemple `<compte>_api`, avec un mot de passe fort. Donnez-lui accès à la base `<compte>_artisan` avec les droits les plus faibles proposés (lecture seule si l'option existe) : l'API ne fait que lire.
3. Ouvrez **phpMyAdmin** (lien dans la même page), sélectionnez la base `<compte>_artisan`, puis dans l'onglet **SQL** :
   - collez la **PARTIE 2** de `database/01_creation_bdd.sql` (les tables ; la base et le compte sont déjà créés par l'interface) et exécutez ;
   - dans l'onglet **Importer**, envoyez `database/02_alimentation_bdd.sql`.

## 3. Installer le code

Connectez-vous en SSH (identifiants dans **Accès distants > SSH**) :

```bash
ssh <compte>@ssh-<compte>.alwaysdata.net
git clone https://github.com/<utilisateur>/trouve-ton-artisan.git
cd trouve-ton-artisan

# API
cd backend
npm ci --omit=dev
cp .env.example .env
nano .env

# Site
cd ../frontend
npm ci
cp .env.example .env
nano .env
npm run build
```

### Contenu de `backend/.env`

```ini
NODE_ENV=production
TRUST_PROXY=1

DB_HOST=mysql-<compte>.alwaysdata.net
DB_PORT=3306
DB_NAME=<compte>_artisan
DB_USER=<compte>_api
DB_PASSWORD=<mot de passe de l'utilisateur MySQL>

API_KEY=<clé générée, 64 caractères>
CORS_ORIGINS=https://<compte>.alwaysdata.net

# E-mails : créer une adresse dans "E-mails > Adresses", puis
SMTP_HOST=smtp-<compte>.alwaysdata.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<adresse e-mail créée>
SMTP_PASSWORD=<mot de passe de cette adresse>
MAIL_FROM="Trouve ton artisan <adresse e-mail créée>"
# Le jeu d'essai contient des adresses qui peuvent appartenir à de vraies
# personnes : on redirige tous les messages vers sa propre boîte pour la démo
MAIL_REDIRECT_TO=<votre adresse e-mail>

FRONTEND_DIST=/home/<compte>/trouve-ton-artisan/frontend/dist
```

### Contenu de `frontend/.env`

```ini
VITE_API_URL=
VITE_API_KEY=<même clé que API_KEY>
```

`VITE_API_URL` reste vide : le site et l'API sont à la même adresse.

## 4. Déclarer le site

**Web > Sites > Ajouter un site** :

| Champ | Valeur |
|---|---|
| Adresses | `<compte>.alwaysdata.net` |
| Type | Node.js |
| Commande | `node /home/<compte>/trouve-ton-artisan/backend/src/server.js` |
| Répertoire de travail | `/home/<compte>/trouve-ton-artisan/backend` |

L'API écoute automatiquement l'adresse et le port fournis par alwaysdata (variables `IP`/`HOST` et `PORT`).

Dans l'onglet **SSL** du site, cochez **Forcer HTTPS**.

## 5. Vérifier

- `https://<compte>.alwaysdata.net` affiche l'accueil avec les artisans du mois ;
- `https://<compte>.alwaysdata.net/api/categories` sans clé répond **401** ;
- `https://<compte>.alwaysdata.net/page-inexistante` affiche la page 404 ;
- un message envoyé depuis une fiche artisan arrive dans la boîte `MAIL_REDIRECT_TO`.

## Mettre à jour le site

```bash
cd ~/trouve-ton-artisan
git pull
cd backend && npm ci --omit=dev
cd ../frontend && npm ci && npm run build
```

Puis **Web > Sites > Redémarrer** le site.
