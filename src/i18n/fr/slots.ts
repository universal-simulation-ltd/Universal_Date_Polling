// French (fr) — slots. Every key in ../en/slots.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const slots: Draft['slots'] = {
  'view_form': 'Saisie',
  'view_calendar': 'Agenda',
  'view_days': 'Journées',
  'view_none': 'Rien de choisi',
  'duration_m': '{m} min',
  'duration_h': '{h} h',
  'duration_hm': '{h} h {m}',
  'previous_month': 'Mois précédent',
  'next_month': 'Mois suivant',
  'no_days_yet': 'Aucun jour pour l’instant — cliquez sur les jours à proposer.',
  'days_selected_one': '{count} jour sélectionné',
  'days_selected_other': '{count} jours sélectionnés',
  'remove_day': 'Retirer {day}',
  'date': 'Date',
  'time': 'Heure',
  'length': 'Durée',
  'add_time': 'Ajouter l’horaire',
  'no_times_yet': 'Aucun horaire pour l’instant — choisissez une date et une heure ci-dessus, puis appuyez sur {button}.',
  'remove_time': 'Retirer {day} {time}',
  'past_moved': 'Vous ne pouvez pas choisir une heure passée — l’horaire a été reporté au {day}, {time}.',
  'dst_gap': 'Attention — {time} n’existe pas le {day} dans le fuseau {zone} : on avance les horloges cette nuit-là, donc ce créneau tombe à {lands}.',
  'previous_week': 'Semaine précédente',
  'next_week': 'Semaine suivante',
  'this_week': 'Aujourd’hui',
  'grid_help': 'Cliquez sur un jour pour poser un créneau d’une heure, ou faites glisser vers le bas dans une colonne pour en régler la durée. Faites glisser un créneau pour le déplacer dans la journée ; cliquez dessus pour le retirer.',
  'busy_legend': 'Rayé = occupé dans votre agenda connecté.',
  'syncing': 'Synchronisation de votre agenda…',
  'syncing_sr': 'Synchronisation de votre agenda.',
  'time_passed': 'Cet horaire est déjà passé — choisissez un créneau à venir.',
  'already_proposed': 'Vous avez déjà proposé cet horaire.',
  'slot_title': 'Faire glisser pour déplacer · cliquer pour retirer {time} · {length}',
  'show_times_in': 'Afficher les heures dans le fuseau',
  'search_zones': 'Rechercher un fuseau horaire',
  'search_zones_placeholder': 'Rechercher un fuseau horaire…',
  'no_matching_zones': 'Aucun fuseau horaire correspondant.',
}

export default slots
