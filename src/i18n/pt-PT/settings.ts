// European Portuguese (pt-PT) — settings. Every key in ../en/settings.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const settings: Draft['settings'] = {
  'title': 'Opções desta sondagem',
  'description': 'Aplicam-se à sondagem que está a criar agora.',
  'back_new_poll': 'Criar',

  // Booking page
  'booking_lead': 'Só nós os dois',
  'booking_label': '{lead} — fazer disto uma página de marcação imediata',
  'booking_on': 'A pessoa a quem enviar a ligação escolhe um horário e este fica marcado na hora — sem votos, e sem nada para confirmar. Ambos recebem um convite de calendário por e-mail.',
  'booking_off': 'Para um encontro a dois. A pessoa escolhe um horário, a marcação faz-se sozinha e ambos recebem um convite de calendário — em vez de recolher disponibilidades e confirmar um horário.',

  // Link expiry
  'validity_label': 'A ligação é válida durante',
  'validity_hint_one': 'Depois fica só de leitura durante {count} dia, e é apagada com as respostas.',
  'validity_hint_other': 'Depois fica só de leitura durante {count} dias, e é apagada com as respostas.',

  // Response alerts
  'alerts_label': 'Quer receber um e-mail quando os convidados responderem?',
  'alerts_signed_in': 'Enviaremos um e-mail para {email} sempre que uma nova pessoa responder.',
  'alerts_verified': 'Enviaremos um e-mail para {email} (confirmado) sempre que uma nova pessoa responder.',
  'alerts_optional': 'Indique o seu e-mail abaixo (enviaremos um código para o confirmar) e enviaremos aí um alerta sempre que alguém responder.',
  'alerts_confirm': 'Vai confirmar o seu e-mail abaixo para criar a sondagem — assinale esta opção e enviaremos também aí um alerta sempre que alguém responder.',

  // Your calendar
  'calendar_label': 'O seu calendário',
  'calendar_body': 'Ligue um calendário e a vista {calendar} sombreia as horas em que já está ocupado. O sombreado só é visível para si — nada é mostrado às pessoas a quem envia a sondagem. {outlook} também identifica cada bloco com o nome do evento; {google} sombreia apenas as horas ocupadas, e nunca lemos aí os nomes, convidados, locais ou descrições dos seus eventos.',
  'calendar_view': 'Calendário',
  'add_another': 'Adicionar outro:',
  'nothing_connected': 'Ainda nada ligado.',
  'prompt_hidden': 'O convite para ligar um calendário, junto ao calendário, está oculto.',
  'show_again': 'Mostrar novamente',
  'connected': 'ligado',
  'connected_as': 'ligado como {email}',
  'disconnect': 'Desligar',
  'titles_offer': 'Só horas ocupadas — esta ligação é anterior aos nomes dos eventos.',
  'reconnect_titles': 'Voltar a ligar para os mostrar',

  // Timezone
  'timezone_label': 'Fuso horário',
  'timezone_hint': 'Todas as horas desta sondagem são escritas neste fuso; cada convidado vê-as convertidas para o seu. Lá são agora {time}.',
}

export default settings
