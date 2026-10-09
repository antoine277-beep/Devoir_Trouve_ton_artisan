/**
 * Envoi des e-mails du formulaire de contact (Nodemailer).
 *
 * - Si un serveur SMTP est configuré dans .env, les e-mails partent vraiment.
 * - Sinon (en développement), le message est seulement affiché dans le
 *   terminal : aucun e-mail n'est envoyé par erreur pendant les tests.
 */
const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter;
if (env.mail.host) {
  transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
    requireTLS: true, // connexion chiffrée obligatoire avec le serveur d'e-mails
    auth: { user: env.mail.user, pass: env.mail.password },
  });
} else {
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

/**
 * Envoie la demande d'un visiteur à un artisan.
 * L'adresse de l'artisan vient de la base de données, pas du navigateur :
 * le formulaire ne peut donc pas servir à écrire à n'importe qui.
 */
async function envoyerDemande(artisan, demande) {
  const info = await transporter.sendMail({
    from: env.mail.from,
    to: env.mail.redirectTo || artisan.email,
    // "Répondre" dans la messagerie de l'artisan écrit directement au visiteur
    replyTo: { name: demande.nom, address: demande.email },
    subject: `[Trouve ton artisan] ${demande.objet}`,
    // Texte brut : aucun code HTML envoyé par le visiteur n'est interprété
    text: `Bonjour ${artisan.nom},

Vous avez reçu une nouvelle demande via la plateforme Trouve ton artisan.

Nom : ${demande.nom}
E-mail : ${demande.email}
Objet : ${demande.objet}

Message :
${demande.message}

--
Pour répondre, utilisez la fonction "Répondre" de votre messagerie.
Merci d'apporter une réponse sous 48h.`,
  });

  if (!env.mail.host && env.nodeEnv === 'development') {
    console.log('[mail] SMTP non configuré, e-mail non envoyé :', info.message.toString());
  }
}

module.exports = { envoyerDemande };
