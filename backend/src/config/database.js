/**
 * Connexion à la base MySQL avec Sequelize.
 *
 * Sequelize envoie les valeurs séparément de la requête SQL (requêtes
 * préparées) : ce que tape un visiteur ne peut pas modifier la requête,
 * ce qui protège des injections SQL.
 */
const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false, // n'affiche pas les requêtes SQL dans le terminal
  define: {
    timestamps: false, // nos tables n'ont pas de colonnes createdAt / updatedAt
    freezeTableName: true, // nom du modèle = nom de la table (pas de "s" ajouté)
  },
});

module.exports = sequelize;
