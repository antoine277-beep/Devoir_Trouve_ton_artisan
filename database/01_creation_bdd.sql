-- =============================================================================
-- Trouve ton artisan - Script de création de la base de données
-- -----------------------------------------------------------------------------
-- Crée la base, les 3 tables et le compte MySQL utilisé par l'API.
-- Compatible MySQL 8 et MariaDB 10.5+.
--
-- Lancement (avec un compte administrateur) :
--   mysql -u root -p < database/01_creation_bdd.sql
-- =============================================================================

-- On repart d'une base propre à chaque exécution du script
DROP DATABASE IF EXISTS trouve_ton_artisan;

-- utf8mb4 : gère tous les caractères (accents, emojis...)
-- utf8mb4_unicode_ci : comparaisons insensibles à la casse ET aux accents,
-- une recherche "labbe" trouve donc "Labbé"
CREATE DATABASE trouve_ton_artisan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE trouve_ton_artisan;

-- -----------------------------------------------------------------------------
-- Table categorie : Bâtiment, Services, Fabrication, Alimentation
-- Le slug sert à construire l'URL de la page (ex : /categorie/batiment)
-- -----------------------------------------------------------------------------
CREATE TABLE categorie (
  id_categorie INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom          VARCHAR(50)  NOT NULL,
  slug         VARCHAR(50)  NOT NULL,
  CONSTRAINT pk_categorie PRIMARY KEY (id_categorie),
  CONSTRAINT uq_categorie_nom  UNIQUE (nom),
  CONSTRAINT uq_categorie_slug UNIQUE (slug),
  -- slug en minuscules sans accent ni espace : lettres, chiffres et tirets
  CONSTRAINT ck_categorie_slug CHECK (slug REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$')
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- Table specialite : une spécialité est rattachée à une seule catégorie
-- -----------------------------------------------------------------------------
CREATE TABLE specialite (
  id_specialite INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom           VARCHAR(50)  NOT NULL,
  id_categorie  INT UNSIGNED NOT NULL,
  CONSTRAINT pk_specialite PRIMARY KEY (id_specialite),
  CONSTRAINT uq_specialite_nom UNIQUE (nom),
  -- RESTRICT : impossible de supprimer une catégorie qui a encore des spécialités
  CONSTRAINT fk_specialite_categorie FOREIGN KEY (id_categorie)
    REFERENCES categorie (id_categorie)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- Table artisan : un artisan apparaît dans une seule spécialité
-- -----------------------------------------------------------------------------
CREATE TABLE artisan (
  id_artisan    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nom           VARCHAR(100)  NOT NULL,
  note          DECIMAL(2,1)  NOT NULL,          -- de 0.0 à 5.0
  ville         VARCHAR(100)  NOT NULL,
  a_propos      TEXT          NOT NULL,
  email         VARCHAR(255)  NOT NULL,
  site_web      VARCHAR(255)  NULL,              -- facultatif
  image         VARCHAR(255)  NULL,              -- chemin de la photo / du logo, facultatif
  top           BOOLEAN       NOT NULL DEFAULT FALSE, -- artisan du mois
  id_specialite INT UNSIGNED  NOT NULL,
  CONSTRAINT pk_artisan PRIMARY KEY (id_artisan),
  CONSTRAINT uq_artisan_email UNIQUE (email),
  CONSTRAINT ck_artisan_note  CHECK (note BETWEEN 0 AND 5),
  CONSTRAINT ck_artisan_email CHECK (email LIKE '_%@_%._%'),
  -- seuls les liens http(s) sont acceptés : bloque les liens "javascript:..."
  CONSTRAINT ck_artisan_site  CHECK (site_web IS NULL OR site_web LIKE 'http://%' OR site_web LIKE 'https://%'),
  CONSTRAINT fk_artisan_specialite FOREIGN KEY (id_specialite)
    REFERENCES specialite (id_specialite)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE = InnoDB;

-- Index pour accélérer les recherches les plus fréquentes du site
CREATE INDEX idx_artisan_nom ON artisan (nom);  -- barre de recherche
CREATE INDEX idx_artisan_top ON artisan (top);  -- artisans du mois

-- -----------------------------------------------------------------------------
-- Compte utilisé par l'API (principe du moindre privilège)
-- -----------------------------------------------------------------------------
-- L'API ne fait que LIRE les données : elle n'a que le droit SELECT.
-- La base sera alimentée plus tard par une autre application, qui aura son
-- propre compte. Même en cas de faille dans l'API, un attaquant ne pourrait
-- ni modifier ni supprimer de données.
--
-- /!\ Remplacez le mot de passe ci-dessous avant de lancer le script en
-- production, et reportez-le dans le fichier backend/.env (DB_PASSWORD).
DROP USER IF EXISTS 'tta_api'@'localhost';
CREATE USER 'tta_api'@'localhost' IDENTIFIED BY 'A_remplacer_par_un_mot_de_passe_fort!';
GRANT SELECT ON trouve_ton_artisan.* TO 'tta_api'@'localhost';
FLUSH PRIVILEGES;
