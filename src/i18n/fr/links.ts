// French (fr) — links. Every key in ../en/links.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const links: Draft['links'] = {
  'admin_title': 'Votre lien d’administration privé',
  'admin_body_email': 'Gardez-le pour vous. Il ouvre la page d’administration du sondage sur tout appareil où vous avez confirmé la même adresse e-mail : vous pouvez y confirmer un horaire, modifier le sondage ou le supprimer.',
  'admin_body_no_email': 'Gardez-le pour vous : toute personne qui l’a peut gérer le sondage, c’est-à-dire confirmer un horaire, le modifier ou le supprimer. Conservez-le en lieu sûr : c’est le seul moyen de gérer le sondage depuis un autre appareil, ou ici si les données de ce navigateur sont effacées.',
  'admin_field': 'Lien d’administration privé',
  'edit_title': 'Votre lien de modification',
  'edit_body': 'Cet appareil peut modifier ces réponses. Pour les modifier depuis un autre appareil, ouvrez ce lien sur celui-ci. Gardez-le pour vous : toute personne qui l’a peut modifier ou supprimer vos réponses.',
  'copied': 'Copié !',
}

export default links
