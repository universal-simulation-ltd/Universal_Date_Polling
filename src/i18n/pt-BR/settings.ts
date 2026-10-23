// Brazilian Portuguese (pt-BR) — settings. Every key in ../en/settings.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const settings: Draft['settings'] = {
  'title': 'Opções desta enquete',
  'description': 'Elas valem para a enquete que você está criando agora.',
  'back_new_poll': 'Nova enquete',

  // Booking page
  'booking_lead': 'Só nós dois',
  'booking_label': '{lead}: transformar em página de agendamento instantâneo',
  'booking_on': 'Quem receber o link escolhe um horário e ele já fica agendado na hora: sem votos e sem nada para você confirmar. Vocês dois recebem um convite de agenda por e-mail.',
  'booking_off': 'Para uma reunião a dois. A pessoa escolhe um horário, ele se agenda sozinho e vocês dois recebem um convite de agenda, em vez de você coletar a disponibilidade e confirmar um horário.',

  // Link expiry
  'validity_label': 'O link vale por',
  'validity_hint_one': 'Depois fica somente leitura por {count} dia e é excluído com as respostas.',
  'validity_hint_other': 'Depois fica somente leitura por {count} dias e é excluído com as respostas.',

  // Response alerts
  'alerts_label': 'Quer receber um e-mail quando seus convidados responderem?',
  'alerts_signed_in': 'Vamos enviar um e-mail para {email} sempre que uma nova pessoa responder.',
  'alerts_verified': 'Vamos enviar um e-mail para {email} (confirmado) sempre que uma nova pessoa responder.',
  'alerts_optional': 'Informe seu e-mail abaixo (enviaremos um código para confirmá-lo) e avisaremos você lá sempre que alguém responder.',
  'alerts_confirm': 'Você vai confirmar seu e-mail abaixo para criar a enquete. Marque isto e também avisaremos você lá sempre que alguém responder.',

  // Your calendar
  'calendar_label': 'Sua agenda',
  'calendar_body': 'Conecte uma agenda e a visualização {calendar} sombreia os horários em que você já está ocupado. Só você vê o sombreado: nada aparece para as pessoas que recebem a enquete. O {outlook} também identifica cada bloco com o nome do evento; o {google} só sombreia os horários ocupados, e nunca lemos os nomes, convidados, locais ou descrições dos seus eventos por lá.',
  'calendar_view': 'Calendário',
  'add_another': 'Adicionar outra:',
  'nothing_connected': 'Nada conectado ainda.',
  'prompt_hidden': 'O convite para conectar ao lado da agenda está oculto.',
  'show_again': 'Mostrar de novo',
  'connected': 'conectado',
  'connected_as': 'conectado como {email}',
  'disconnect': 'Desconectar',
  'titles_offer': 'Só horários ocupados: esta conexão é anterior aos nomes de eventos.',
  'reconnect_titles': 'Reconecte para mostrá-los',

  // Timezone
  'timezone_label': 'Fuso horário',
  'timezone_hint': 'Todos os horários desta enquete são escritos neste fuso; cada convidado os vê convertidos para o seu. Agora são {time} lá.',
}

export default settings
