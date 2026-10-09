/**
 * Point d'entrée : vérifie la connexion à la base puis démarre le serveur.
 */
const env = require('./config/env');
const app = require('./app');
const { sequelize } = require('./models');

async function start() {
  try {
    await sequelize.authenticate();
    console.info(`Connexion MySQL réussie (${env.db.host}:${env.db.port}/${env.db.name})`);
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error.message);
    process.exit(1);
  }

  const server = app.listen(env.port, env.host || undefined, () => {
    console.info(`API Trouve ton artisan démarrée sur http://localhost:${env.port}/api (${env.nodeEnv})`);
  });

  // Arrêt propre (Ctrl+C ou arrêt par l'hébergeur) : on ferme les connexions
  const shutdown = () => {
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start();
