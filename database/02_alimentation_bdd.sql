-- =============================================================================
-- Trouve ton artisan - Script d'alimentation de la base de données
-- -----------------------------------------------------------------------------
-- Insère le jeu d'essai fourni par la région (fichier data.xlsx) :
-- 4 catégories, 15 spécialités et 17 artisans.
--
-- Lancement (après 01_creation_bdd.sql), en indiquant le nom de la base :
--   mysql -u root -p trouve_ton_artisan < database/02_alimentation_bdd.sql
-- (dans phpMyAdmin : sélectionner la base, onglet "Importer")
-- =============================================================================

-- Le fichier est enregistré en UTF-8 : on le précise au serveur pour que
-- les accents (Bâtiment, Montélimar...) soient bien enregistrés
SET NAMES utf8mb4;

-- Tout ou rien : en cas d'erreur, aucune donnée partielle n'est enregistrée
START TRANSACTION;

-- -----------------------------------------------------------------------------
-- Catégories (dans l'ordre d'affichage du menu)
-- -----------------------------------------------------------------------------
INSERT INTO categorie (id_categorie, nom, slug) VALUES
  (1, 'Bâtiment',     'batiment'),
  (2, 'Services',     'services'),
  (3, 'Fabrication',  'fabrication'),
  (4, 'Alimentation', 'alimentation');

-- -----------------------------------------------------------------------------
-- Spécialités, chacune rattachée à sa catégorie
-- -----------------------------------------------------------------------------
INSERT INTO specialite (id_specialite, nom, id_categorie) VALUES
  -- Bâtiment
  ( 1, 'Chauffagiste', 1),
  ( 2, 'Electricien',  1),
  ( 3, 'Menuisier',    1),
  ( 4, 'Plombier',     1),
  -- Services
  ( 5, 'Coiffeur',     2),
  ( 6, 'Fleuriste',    2),
  ( 7, 'Toiletteur',   2),
  ( 8, 'Webdesign',    2),
  -- Fabrication
  ( 9, 'Bijoutier',    3),
  (10, 'Couturier',    3),
  (11, 'Ferronier',    3),
  -- Alimentation
  (12, 'Boucher',      4),
  (13, 'Boulanger',    4),
  (14, 'Chocolatier',  4),
  (15, 'Traiteur',     4);

-- -----------------------------------------------------------------------------
-- Artisans (texte "A propos" identique pour tous dans le jeu d'essai)
-- top = TRUE : artisan du mois affiché sur la page d'accueil
-- -----------------------------------------------------------------------------
SET @a_propos = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.';

INSERT INTO artisan (nom, note, ville, a_propos, email, site_web, top, id_specialite) VALUES
  -- Alimentation
  ('Boucherie Dumont',       4.5, 'Lyon',             @a_propos, 'boucherie.dumond@gmail.com',            NULL,                                     FALSE, 12),
  ('Au pain chaud',          4.8, 'Montélimar',       @a_propos, 'aupainchaud@hotmail.com',               NULL,                                     TRUE,  13),
  ('Chocolaterie Labbé',     4.9, 'Lyon',             @a_propos, 'chocolaterie-labbe@gmail.com',          'https://chocolaterie-labbe.fr',          TRUE,  14),
  ('Traiteur Truchon',       4.1, 'Lyon',             @a_propos, 'contact@truchon-traiteur.fr',           'https://truchon-traiteur.fr',            FALSE, 15),
  -- Bâtiment
  ('Orville Salmons',        5.0, 'Evian',            @a_propos, 'o-salmons@live.com',                    NULL,                                     TRUE,   1),
  ('Mont Blanc Eléctricité', 4.5, 'Chamonix',         @a_propos, 'contact@mont-blanc-electricite.com',    'https://mont-blanc-electricite.com',     FALSE,  2),
  ('Boutot & fils',          4.7, 'Bourg-en-bresse',  @a_propos, 'boutot-menuiserie@gmail.com',           'https://boutot-menuiserie.com',          FALSE,  3),
  ('Vallis Bellemare',       4.0, 'Vienne',           @a_propos, 'v.bellemare@gmail.com',                 'https://plomberie-bellemare.com',        FALSE,  4),
  -- Fabrication
  ('Claude Quinn',           4.2, 'Aix-les-bains',    @a_propos, 'claude.quinn@gmail.com',                NULL,                                     FALSE,  9),
  ('Amitee Lécuyer',         4.5, 'Annecy',           @a_propos, 'a.amitee@hotmail.com',                  'https://lecuyer-couture.com',            FALSE, 10),
  ('Ernest Carignan',        5.0, 'Le Puy-en-Velay',  @a_propos, 'e-carigan@hotmail.com',                 NULL,                                     FALSE, 11),
  -- Services
  ('Royden Charbonneau',     3.8, 'Saint-Priest',     @a_propos, 'r.charbonneau@gmail.com',               NULL,                                     FALSE,  5),
  ('Leala Dennis',           3.8, 'Chambéry',         @a_propos, 'l.dennos@hotmail.fr',                   'https://coiffure-leala-chambery.fr',     FALSE,  5),
  ('C''est sup''hair',       4.1, 'Romans-sur-Isère', @a_propos, 'sup-hair@gmail.com',                    'https://sup-hair.fr',                    FALSE,  5),
  ('Le monde des fleurs',    4.6, 'Annonay',          @a_propos, 'contact@le-monde-des-fleurs-annonay.fr', 'https://le-monde-des-fleurs-annonay.fr', FALSE,  6),
  ('Valérie Laderoute',      4.5, 'Valence',          @a_propos, 'v-laredoute@gmail.com',                 NULL,                                     FALSE,  7),
  ('CM Graphisme',           4.4, 'Valence',          @a_propos, 'contact@cm-graphisme.com',              'https://cm-graphisme.com',               FALSE,  8);

COMMIT;
