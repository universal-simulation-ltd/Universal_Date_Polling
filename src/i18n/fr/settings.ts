// French (fr) — settings. Every key in ../en/settings.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const settings: Draft['settings'] = {
  'title': 'Options de ce sondage',
  'description': 'Elles s’appliquent au sondage que vous créez en ce moment.',
  'back_new_poll': 'Création',
  'booking_lead': 'Juste nous deux',
  'booking_label': '{lead} — en faire une page de réservation instantanée',
  'booking_on': 'La personne à qui vous envoyez le lien choisit un horaire, et il est réservé aussitôt — pas de vote, et rien à confirmer de votre côté. Vous recevrez tous les deux une invitation d’agenda par e-mail.',
  'booking_off': 'Pour un tête-à-tête. La personne choisit un horaire, il se réserve tout seul, et vous recevez tous les deux une invitation d’agenda — au lieu de recueillir les disponibilités et de confirmer vous-même un horaire.',
  'validity_label': 'Le lien reste valide pendant',
  'validity_hint_one': 'Ensuite, il passe en lecture seule pendant {count} jour, puis il est supprimé avec ses réponses.',
  'validity_hint_other': 'Ensuite, il passe en lecture seule pendant {count} jours, puis il est supprimé avec ses réponses.',
  'alerts_label': 'Vous voulez recevoir un e-mail quand vos invités répondent ?',
  'alerts_signed_in': 'Nous écrirons à {email} chaque fois qu’une nouvelle personne répond.',
  'alerts_verified': 'Nous écrirons à {email} (adresse confirmée) chaque fois qu’une nouvelle personne répond.',
  'alerts_optional': 'Ajoutez votre adresse e-mail ci-dessous (nous enverrons un code pour la confirmer) et nous vous y alerterons chaque fois que quelqu’un répond.',
  'alerts_confirm': 'Vous confirmerez votre adresse e-mail ci-dessous pour créer votre sondage — cochez cette case et nous vous y alerterons aussi chaque fois que quelqu’un répond.',
  'calendar_label': 'Votre agenda',
  'calendar_body': 'Connectez un agenda et la vue {calendar} grise les moments où vous êtes déjà occupé. Vous seul voyez ces zones grisées — rien n’est montré aux personnes à qui vous envoyez le sondage. {outlook} indique aussi le nom de l’événement sur chaque plage ; {google} grise uniquement les moments occupés, et nous n’y lisons jamais le nom, les invités, le lieu ni la description de vos événements.',
  'calendar_view': 'Agenda',
  'add_another': 'En ajouter un autre :',
  'nothing_connected': 'Aucun agenda connecté pour l’instant.',
  'prompt_hidden': 'Le message vous invitant à connecter un agenda, à côté de la vue Agenda, est masqué.',
  'show_again': 'L’afficher à nouveau',
  'connected': 'connecté',
  'connected_as': 'connecté en tant que {email}',
  'disconnect': 'Déconnecter',
  'titles_offer': 'Moments occupés uniquement — cette connexion est antérieure aux noms d’événements.',
  'reconnect_titles': 'Reconnecter pour les afficher',
  'timezone_label': 'Fuseau horaire',
  'timezone_hint': 'Toutes les heures de ce sondage sont écrites dans ce fuseau ; chaque invité les voit converties dans le sien. Il y est {time} en ce moment.',
}

export default settings
