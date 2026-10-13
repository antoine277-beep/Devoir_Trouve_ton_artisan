/**
 * Modèles Sequelize : un modèle par table de la base.
 * Les tables sont créées par le script database/01_creation_bdd.sql.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Catégorie : Bâtiment, Services, Fabrication, Alimentation
const Categorie = sequelize.define('categorie', {
  id_categorie: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(50), allowNull: false },
});

// Spécialité (boulanger, plombier...) : rattachée à une seule catégorie
const Specialite = sequelize.define('specialite', {
  id_specialite: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(50), allowNull: false },
  id_categorie: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
});

// Artisan : exerce une seule spécialité
const Artisan = sequelize.define('artisan', {
  id_artisan: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  note: { type: DataTypes.DECIMAL(2, 1), allowNull: false },
  ville: { type: DataTypes.STRING(100), allowNull: false },
  a_propos: { type: DataTypes.TEXT, allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  site_web: { type: DataTypes.STRING(255), allowNull: true },
  top: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  id_specialite: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
});

// Relations (les clés étrangères du MLD)
Specialite.belongsTo(Categorie, { foreignKey: 'id_categorie', as: 'categorie' });
Artisan.belongsTo(Specialite, { foreignKey: 'id_specialite', as: 'specialite' });

module.exports = { sequelize, Categorie, Specialite, Artisan };
