/**
 * Connexion à la base MySQL avec Sequelize.
 *
 * Sequelize envoie toutes les valeurs au serveur sous forme de paramètres
 * (requêtes préparées) : les données saisies par les visiteurs ne sont jamais
 * concaténées dans le SQL, ce qui protège des injections SQL.
 */
const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false, // pas de requêtes SQL dans les logs (elles pourraient contenir des données personnelles)
  define: {
    timestamps: false, // les tables n'ont pas de colonnes createdAt / updatedAt
    freezeTableName: true, // le nom du modèle = le nom de la table, sans pluriel
  },
  dialectOptions: {
    charset: 'utf8mb4',
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

module.exports = sequelize;
