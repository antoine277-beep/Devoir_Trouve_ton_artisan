-- =============================================================================
-- Trouve ton artisan - Script de création de la base de données
-- -----------------------------------------------------------------------------
-- Crée la base, les 3 tables et le compte MySQL utilisé par l'API.
--
-- Lancement (avec un compte administrateur) :
--   mysql -u root -p < database/01_creation_bdd.sql
--
-- Chez un hébergeur (la base et le compte se créent dans son interface),
-- n'exécuter que la PARTIE 2 dans la base fournie.
-- =============================================================================

-- =============================================================================
-- PARTIE 1 : la base de données
-- =============================================================================
DROP DATABASE IF EXISTS trouve_ton_artisan;

-- utf8mb4_unicode_ci : gère les accents, et les comparaisons ignorent
-- majuscules et accents (une recherche "labbe" trouve "Labbé")
CREATE DATABASE trouve_ton_artisan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE trouve_ton_artisan;

-- =============================================================================
-- PARTIE 2 : les tables
-- =============================================================================

-- Catégories : Bâtiment, Services, Fabrication, Alimentation
CREATE TABLE categorie (
  id_categorie INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom          VARCHAR(50)  NOT NULL UNIQUE,
  PRIMARY KEY (id_categorie)
);

-- Spécialités : une spécialité est rattachée à une seule catégorie
CREATE TABLE specialite (
  id_specialite INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom           VARCHAR(50)  NOT NULL UNIQUE,
  id_categorie  INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_specialite),
  FOREIGN KEY (id_categorie) REFERENCES categorie (id_categorie)
);

-- Artisans : un artisan apparaît dans une seule spécialité
CREATE TABLE artisan (
  id_artisan    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nom           VARCHAR(100)  NOT NULL,
  note          DECIMAL(2,1)  NOT NULL,              -- note sur 5, ex : 4.5
  ville         VARCHAR(100)  NOT NULL,
  a_propos      TEXT          NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  site_web      VARCHAR(255)  NULL,                  -- facultatif
  top           BOOLEAN       NOT NULL DEFAULT FALSE, -- artisan du mois
  id_specialite INT UNSIGNED  NOT NULL,
  PRIMARY KEY (id_artisan),
  FOREIGN KEY (id_specialite) REFERENCES specialite (id_specialite),
  CHECK (note BETWEEN 0 AND 5),
  -- seuls les liens http(s) sont acceptés : bloque les liens "javascript:..."
  CHECK (site_web IS NULL OR site_web LIKE 'http%')
);

-- =============================================================================
-- PARTIE 3 : compte utilisé par l'API (lecture seule)
-- =============================================================================
-- L'API ne fait que lire les données : elle n'a que le droit SELECT. Même en
-- cas de faille dans l'API, personne ne pourrait modifier ou supprimer des données.
-- /!\ Remplacez le mot de passe avant de lancer le script, et reportez-le
-- dans backend/.env (DB_PASSWORD).
DROP USER IF EXISTS 'tta_api'@'localhost';
CREATE USER 'tta_api'@'localhost' IDENTIFIED BY 'A_remplacer_par_un_mot_de_passe_fort!';
GRANT SELECT ON trouve_ton_artisan.* TO 'tta_api'@'localhost';
