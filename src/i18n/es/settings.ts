// Spanish (es) — settings. Every key in ../en/settings.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const settings: Draft['settings'] = {
  'title': 'Opciones de esta encuesta',
  'description': 'Se aplican a la encuesta que estás creando ahora.',
  'back_new_poll': 'Nueva',

  // Booking page
  'booking_lead': 'Solo nosotros dos',
  'booking_label': '{lead}: convertir esto en una página de reservas inmediata',
  'booking_on': 'Quien reciba el enlace elige una hora y queda reservada al momento: sin votos y sin nada que tengas que confirmar. Los dos recibiréis una invitación de calendario por correo.',
  'booking_off': 'Para una reunión a solas. La otra persona elige una hora, se reserva sola y los dos recibís una invitación de calendario, en lugar de recoger la disponibilidad y confirmar tú una hora.',

  // Link expiry
  'validity_label': 'El enlace es válido durante',
  'validity_hint_one': 'Después queda en solo lectura durante {count} día y se elimina con sus respuestas.',
  'validity_hint_other': 'Después queda en solo lectura durante {count} días y se elimina con sus respuestas.',

  // Response alerts
  'alerts_label': '¿Quieres recibir un correo cuando respondan tus invitados?',
  'alerts_signed_in': 'Enviaremos un correo a {email} cada vez que responda una persona nueva.',
  'alerts_verified': 'Enviaremos un correo a {email} (confirmado) cada vez que responda una persona nueva.',
  'alerts_optional': 'Añade tu correo abajo (te enviaremos un código para confirmarlo) y te avisaremos allí cada vez que alguien responda.',
  'alerts_confirm': 'Para crear tu encuesta confirmarás tu correo abajo: marca esta casilla y además te avisaremos allí cada vez que alguien responda.',

  // Your calendar
  'calendar_label': 'Tu calendario',
  'calendar_body': 'Conecta un calendario y la vista {calendar} sombreará las horas en las que ya estás ocupado. Solo tú ves el sombreado: no se muestra nada a las personas a las que envías la encuesta. {outlook} además pone en cada bloque el nombre del evento; {google} solo sombrea las horas ocupadas, y allí nunca leemos los nombres, invitados, lugares ni descripciones de tus eventos.',
  'calendar_view': 'Calendario',
  'add_another': 'Añadir otro:',
  'nothing_connected': 'Todavía no hay nada conectado.',
  'prompt_hidden': 'El aviso para conectar junto al calendario está oculto.',
  'show_again': 'Volver a mostrarlo',
  'connected': 'conectado',
  'connected_as': 'conectado como {email}',
  'disconnect': 'Desconectar',
  'titles_offer': 'Solo horas ocupadas: esta conexión es anterior a los nombres de los eventos.',
  'reconnect_titles': 'Vuelve a conectar para verlos',

  // Timezone
  'timezone_label': 'Zona horaria',
  'timezone_hint': 'Todas las horas de esta encuesta están en esta zona; cada invitado las ve convertidas a la suya. Allí son ahora las {time}.',
}

export default settings
