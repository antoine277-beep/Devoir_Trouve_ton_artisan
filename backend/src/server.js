/**
 * Point d'entrée : vérifie la connexion à la base, puis démarre le serveur.
 */
const env = require('./config/env');
const app = require('./app');
const { sequelize } = require('./models');

sequelize
  .authenticate()
  .then(() => {
    app.listen(env.port, env.host, () => {
      console.log(`API démarrée sur http://localhost:${env.port}/api`);
    });
  })
  .catch((erreur) => {
    console.error('Impossible de se connecter à la base de données :', erreur.message);
    process.exit(1);
  });
