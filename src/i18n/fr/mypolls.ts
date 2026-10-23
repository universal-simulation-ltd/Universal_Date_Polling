// French (fr) — mypolls. Every key in ../en/mypolls.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const mypolls: Draft['mypolls'] = {
  'title_active': 'Vos sondages actifs',
  'title': 'Vos sondages',
  'nothing_active_one_poll': 'Rien d’actif pour le moment — votre sondage a expiré.',
  'nothing_active_polls': 'Rien d’actif pour le moment — vos sondages ont expiré.',
  'load_failed': 'Impossible de charger vos sondages. {retry}',
  'some_missing': 'Il se peut que certains de vos sondages manquent dans cette liste — {retry}.',
  'some_missing_retry': 'réessayer',
  'booking_page': 'Page de réservation',
  'copy_link': 'Copier le lien',
  'copied': 'Copié !',
  'open': 'Ouvrir →',
  'booked_on': 'Réservé : {when}',
  'confirmed_on': 'Confirmé : {when}',
  'delete_all': 'Tout supprimer ({count})',
  'delete_it': 'Le supprimer',
  'show_expired_one': 'Afficher {count} expiré',
  'show_expired_other': 'Afficher {count} expirés',
  'hide_expired_one': 'Masquer {count} expiré',
  'hide_expired_other': 'Masquer {count} expirés',
  'deleting': 'Suppression…',
  'delete_failed_one': 'Ce sondage n’a pas pu être supprimé — veuillez réessayer.',
  'delete_failed_some': 'Impossible de supprimer {failed} des {total} sondages — veuillez réessayer.',
}

export default mypolls
