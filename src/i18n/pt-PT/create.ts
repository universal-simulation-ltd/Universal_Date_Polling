// European Portuguese (pt-PT) — create. Every key in ../en/create.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const create: Draft['create'] = {
  // Masthead
  'headline_line1': 'Encontre um horário que',
  'headline_line2': 'sirva a todos',
  'intro': 'Ofereça alguns horários, partilhe a ligação e cada pessoa assinala os que lhe dão jeito. Sem conta — nem para si, nem para os outros.',
  'logo_alt': 'Logótipo de {name}',
  'logo_alt_yours': 'O seu logótipo',

  // Title and location
  'title_label': 'Título da sondagem',
  'title_placeholder': 'ex.: Reunião de equipa — semana de 9',
  'location_label': 'Local ou ligação da reunião',
  'optional': '(opcional)',
  'location_placeholder': 'ex.: Sala de reuniões 5, ou uma ligação Teams / Zoom / Meet',
  'location_hint': 'Mostrado a todos na sondagem e adicionado ao convite de calendário.',

  // Times to offer
  'times_heading': 'Horários a oferecer',
  'times_hint_none': 'Como quer adicioná-los? Escreva-os, arraste-os num calendário ou ofereça dias inteiros.',
  'times_hint_days': 'Os participantes assinalam os dias inteiros em que estão disponíveis — bom para viagens e planos de vários dias.',
  'tz_line': 'São {time}. Está em {zone}.',
  'tz_change': 'Mudar de fuso horário?',

  // Suggest times
  'suggest_question': 'Não sabe o que propor?',
  'suggest_intro_one': 'Escolhemos {count} horário em que está livre — dias úteis, {from}–{to} {zone}, no máximo uma manhã e uma tarde por dia.',
  'suggest_intro_other': 'Escolhemos {count} horários em que está livre — dias úteis, {from}–{to} {zone}, no máximo uma manhã e uma tarde por dia.',
  'suggest_button_one': 'Sugerir {count} horário',
  'suggest_button_other': 'Sugerir {count} horários',
  'suggest_finding': 'A procurar tempo livre…',
  'suggest_finding_sr': 'A procurar tempo livre no seu calendário.',
  'suggest_none_one': 'Sem tempo livre entre as {from} e as {to} num dia útil no próximo {count} dia — adicione horários à mão, ou liberte algum espaço e tente novamente.',
  'suggest_none_other': 'Sem tempo livre entre as {from} e as {to} num dia útil nos próximos {count} dias — adicione horários à mão, ou liberte algum espaço e tente novamente.',
  'suggest_some': 'Adicionados {found} de {total} — era todo o tempo livre que havia. Arraste um para o mover, clique para o remover.',
  'suggest_added_one': 'Adicionado {count} horário do seu tempo livre. Arraste um para o mover, clique para o remover.',
  'suggest_added_other': 'Adicionados {count} horários do seu tempo livre. Arraste um para o mover, clique para o remover.',

  // Connect-a-calendar prompt beside the calendar view
  'cal_busy_lead': 'Veja quando já está ocupado',
  'cal_prompt_connect': '{lead} — ligue um calendário e as horas ocupadas ficam sombreadas na grelha. Só são visíveis para si.',
  'cal_other_lead': 'Também está ocupado noutro sítio?',
  'cal_prompt_other': '{lead} Ligue o seu outro calendário e também ele sombreia a grelha.',
  'cal_prompt_guest': '{lead} — verifique o seu e-mail (o mesmo que guarda a sondagem) e depois ligue o seu calendário. O sombreado só é visível para si.',
  'connect_google': 'Ligar Google Calendar',
  'connect_outlook': 'Ligar Outlook',
  'dont_show_again': 'Não mostrar novamente',
  'cal_later_web': 'Pode ligar um a qualquer momento no menu de perfil (canto superior direito) → Ajustar esta aplicação → Opções desta sondagem.',
  'cal_later_phone': 'Pode ligar um a qualquer momento em Ajustar (canto superior direito) → Opções desta sondagem.',
  'verify': 'Verificar',
  'verifying': 'A verificar…',
  'different_email': 'Outro e-mail',
  'code_sent': 'Enviámos um código de 6 dígitos para {email}.',
  'sending': 'A enviar…',
  'email_me_code': 'Enviar-me um código',

  // Calendar errors
  'err_email_first': 'Introduza primeiro um endereço de e-mail válido.',
  'err_code': 'Introduza o código que recebeu por e-mail.',
  'cal_read_failed_google': 'Não foi possível ler o seu calendário Google — a ligação funciona, mas a consulta da disponibilidade falhou. Tente novamente daqui a pouco, ou desligue e volte a ligar.',
  'cal_read_failed_outlook': 'Não foi possível ler o seu calendário Outlook — a ligação funciona, mas a consulta da disponibilidade falhou. Tente novamente daqui a pouco, ou desligue e volte a ligar.',
  'cal_read_failed_both': 'Não foi possível ler os seus calendários Google e Outlook — a ligação funciona, mas a consulta da disponibilidade falhou. Tente novamente daqui a pouco, ou desligue e volte a ligar.',
  'cal_expired': 'Uma ligação de calendário expirou — volte a ligá-la.',
  'cal_expired_suggest': 'Uma ligação de calendário expirou — volte a ligá-la e depois sugira horários.',
  'cal_read_failed_suggest': 'Não foi possível ler o seu calendário agora, por isso nada foi sugerido — tente novamente daqui a pouco.',
  'cal_cancelled': 'A ligação do calendário foi cancelada ou falhou.',
  'popup_blocked': 'O seu navegador bloqueou a janela pop-up — permita pop-ups neste site e tente novamente.',

  // Logo errors
  'logo_type': 'O logótipo tem de ser uma imagem PNG, JPG ou WebP.',
  'logo_size': 'O logótipo tem de ter 10 MB ou menos.',

  // Checks before creating
  'err_title': 'Dê um título à sondagem.',
  'err_add_day': 'Adicione pelo menos um dia.',
  'err_add_time': 'Adicione pelo menos uma data e hora.',
  'err_email': 'Introduza um endereço de e-mail válido.',
  'err_booking_email': 'Uma página de marcação envia-lhe cada marcação por e-mail, por isso precisa do seu endereço de e-mail.',
  'err_alerts_email': 'Indique o seu endereço de e-mail para receber alertas de resposta, ou desative os alertas em Opções desta sondagem.',
  'err_backend': 'O Polling precisa do backend Supabase configurado para criar sondagens.',
  'err_free_limit': 'Atingiu o seu limite gratuito de sondagens ativas. Elimine uma sondagem ou espere que uma termine para libertar espaço.',
  'err_free_limit_held': 'Atingiu o seu limite gratuito de sondagens ativas (ocupado por {what}). Elimine uma sondagem ou espere que uma termine para libertar espaço.',
  'err_generic': 'Algo correu mal. Tente novamente.',

  // Summary of this poll's options, above the Create button
  'booking_chip': 'Página de marcação',
  'link_valid': 'Ligação válida durante {period}',
  'link_valid_while': 'Ligação válida durante algum tempo',
  'alerts_on': 'alertas de resposta ativos',
  'alerts_off': 'sem alertas de resposta',
  'change_these_web': '— altere-as no menu de perfil (canto superior direito) → Ajustar esta aplicação → Opções desta sondagem.',
  'change_these_phone': '— altere-as em Ajustar (canto superior direito) → Opções desta sondagem.',

  // Changing the times on a live poll
  'editing_title': 'Está a alterar os horários da sua sondagem ativa.',
  'editing_body': 'Até guardar, quem abrir a ligação é informado de que está a alterar os horários e de que deve voltar daqui a pouco. Ainda ninguém respondeu, por isso nada se perde. A sua marca mantém-se como estava.',
  'editing_cancel': 'Cancelar — manter como estava',

  // Free allowance
  'need_more': 'Precisa de mais? Diga-nos',
  'purchased_tokens_one': '{count} crédito comprado',
  'purchased_tokens_other': '{count} créditos comprados',

  // Who is creating
  'creating_as': 'A criar como {name} — sem necessidade de verificar o e-mail.',
  'creating_as_org': 'A criar como {name}{email} — sem necessidade de verificar o e-mail.',
  'signed_in_as': 'Sessão iniciada como {email} (verificado).',
  'not_you': 'Não é a sua conta? Terminar sessão',
  'your_email': 'O seu e-mail',
  'email_hint_booking': 'Necessário para uma página de marcação: é para lá que enviamos cada marcação. Enviaremos um código rápido para o confirmar.',
  'email_hint_alerts': 'Para onde enviaremos os seus alertas de resposta. Enviaremos um código rápido para o confirmar.',
  'email_hint_optional': 'Só se quiser alertas de resposta ou encontrar as suas sondagens a partir de outro dispositivo — enviaremos um código rápido para o confirmar. Deixe-o em branco e receberá, em vez disso, uma ligação de administração privada para gerir a sondagem.',
  'email_note_alerts': 'Enviaremos um código rápido para o confirmar — é assim que vai gerir esta sondagem mais tarde, e é para lá que enviaremos os seus alertas de resposta.',
  'email_note_web': 'Enviaremos um código rápido para o confirmar — é assim que vai gerir esta sondagem mais tarde. Quer um e-mail sempre que um convidado responder? Ative-o no menu de perfil (canto superior direito) → Ajustar esta aplicação → Opções desta sondagem.',
  'email_note_phone': 'Enviaremos um código rápido para o confirmar — é assim que vai gerir esta sondagem mais tarde. Quer um e-mail sempre que um convidado responder? Ative-o em Ajustar (canto superior direito) → Opções desta sondagem.',
  'code_label': 'Introduza o código de 6 dígitos que enviámos para {email}',
  'code_note_alerts': 'Confirmar cria a sua sondagem e ativa os alertas de resposta para este endereço.',
  'code_note': 'Confirmar cria a sua sondagem e permite geri-la mais tarde a partir deste endereço.',
  'use_different_email': 'Usar outro e-mail',

  // The main button
  'btn_sending': 'A enviar código…',
  'btn_saving': 'A guardar alterações…',
  'btn_creating': 'A criar sondagem…',
  'btn_verify_create': 'Verificar e criar sondagem',
  'btn_save': 'Guardar alterações',
  'btn_create': 'Criar sondagem',

  // Branding card
  'branding': 'Marca',
  'branding_imported': 'Importada da sua conta — substitua-a nesta sondagem, se quiser.',
  'branding_guest': 'Adicione a sua cor e o seu logótipo às páginas de criação e de partilha da sondagem.',
  'sign_in_branding': 'Inicie sessão para importar a sua marca →',
  'account_logo': 'Logótipo da conta',
  'your_account': 'A sua conta',
  'account_colour': 'Cor da conta',
  'default_colour': 'Cor predefinida',
  'customise': 'Personalizar para esta sondagem',
  'booking_colour': 'Cor da página de marcação',
  'colour_orange': 'Laranja',
  'colour_blue': 'Azul',
  'colour_pink': 'Rosa',
  'colour_green': 'Verde',
  'custom_colour': 'Cor personalizada',
  'brand_name': 'Nome da marca',
  'brand_placeholder': 'ex.: Acme Aventuras',
  'logo': 'Logótipo',
  'logo_preview': 'Pré-visualização do logótipo',
  'logo_change': 'Alterar…',
  'logo_upload': 'Carregar…',
  'logo_hint': 'PNG, JPG ou WebP · as imagens grandes são redimensionadas automaticamente.',
  'use_account_branding': 'Usar antes a marca da minha conta',

  // "Your poll is live" panel
  'live_booking': 'A sua página de marcação está ativa',
  'live_poll': 'A sua sondagem está ativa',
  'live_booking_body': 'Envie esta ligação à pessoa com quem se quer encontrar. O primeiro horário que ela escolher fica marcado, e ambos recebem um convite de calendário.',
  'live_poll_body': 'Partilhe esta ligação com todas as pessoas que quer convidar.',
  'copied': 'Copiado!',
  'open_poll': 'Abrir a sua sondagem →',
  'change_times': '← Alterar os horários',
  'change_times_hint': 'Pode voltar atrás e alterá-los até alguém responder.',
}

export default create
