/**
 * Envoi des e-mails du formulaire de contact (Nodemailer).
 *
 * - Avec un serveur SMTP configuré (.env), les messages partent réellement.
 * - Sans SMTP (développement), le message est seulement affiché dans la
 *   console : aucun e-mail n'est envoyé par erreur aux adresses du jeu d'essai.
 */
const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = env.mail.host
  ? nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.secure, // true = TLS dès la connexion (port 465)
      requireTLS: !env.mail.secure, // sinon on exige STARTTLS : jamais d'envoi en clair
      auth: env.mail.user ? { user: env.mail.user, pass: env.mail.password } : undefined,
    })
  : nodemailer.createTransport({ jsonTransport: true });

/**
 * Envoie la demande d'un visiteur à un artisan.
 * L'adresse de l'artisan vient de la base de données, jamais du navigateur :
 * le formulaire ne peut donc pas servir à écrire à n'importe qui (pas de relais de spam).
 *
 * @param {{ nom: string, email: string }} artisan destinataire
 * @param {{ nom: string, email: string, objet: string, message: string }} demande données du formulaire
 */
async function sendContactMail(artisan, demande) {
  const to = env.mail.redirectTo || artisan.email;

  const info = await transporter.sendMail({
    from: env.mail.from,
    to,
    // "Répondre" dans la messagerie de l'artisan écrit directement au visiteur
    replyTo: { name: demande.nom, address: demande.email },
    subject: `[Trouve ton artisan] ${demande.objet}`,
    // Message en texte brut : aucun code HTML du visiteur n'est interprété
    text: [
      `Bonjour ${artisan.nom},`,
      '',
      'Vous avez reçu une nouvelle demande via la plateforme Trouve ton artisan.',
      '',
      `Nom : ${demande.nom}`,
      `E-mail : ${demande.email}`,
      `Objet : ${demande.objet}`,
      '',
      'Message :',
      demande.message,
      '',
      '--',
      'Pour répondre, utilisez simplement la fonction "Répondre" de votre messagerie.',
      'La région Auvergne-Rhône-Alpes s\'engage à ce qu\'une réponse soit apportée sous 48h.',
    ].join('\n'),
  });

  if (!env.mail.host && !env.isProduction && process.env.NODE_ENV !== 'test') {
    // Mode développement : on affiche le message au lieu de l'envoyer
    console.info('[mail] SMTP non configuré, message non envoyé :\n', JSON.parse(info.message));
  }

  return info;
}

module.exports = { sendContactMail };
