// Brazilian Portuguese (pt-BR) — create. Every key in ../en/create.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const create: Draft['create'] = {
  // Masthead
  'headline_line1': 'Encontre um horário que',
  'headline_line2': 'sirva para todos',
  'intro': 'Ofereça alguns horários, compartilhe o link e cada pessoa marca os que pode. Ninguém precisa de conta, nem você nem eles.',
  'logo_alt': 'Logo de {name}',
  'logo_alt_yours': 'Seu logo',

  // Title and location
  'title_label': 'Título da enquete',
  'title_placeholder': 'ex.: Reunião da equipe, semana do dia 9',
  'location_label': 'Local ou link da reunião',
  'optional': '(opcional)',
  'location_placeholder': 'ex.: Sala de reunião 5, ou um link do Teams / Zoom / Meet',
  'location_hint': 'Aparece para todos na enquete e é adicionado ao convite da agenda.',

  // Times to offer
  'times_heading': 'Horários a oferecer',
  'times_hint_none': 'Como você quer adicioná-los? Digite, arraste em um calendário ou ofereça dias inteiros.',
  'times_hint_days': 'Os participantes marcam os dias inteiros em que estão livres: bom para viagens e planos de vários dias.',
  'tz_line': 'Agora são {time}. Você está em {zone}.',
  'tz_change': 'Mudar o fuso horário?',

  // Suggest times
  'suggest_question': 'Não sabe o que propor?',
  'suggest_intro_one': 'Vamos escolher {count} horário em que você está livre: dias úteis, {from}–{to} {zone}, no máximo uma manhã e uma tarde por dia.',
  'suggest_intro_other': 'Vamos escolher {count} horários em que você está livre: dias úteis, {from}–{to} {zone}, no máximo uma manhã e uma tarde por dia.',
  'suggest_button_one': 'Sugerir {count} horário',
  'suggest_button_other': 'Sugerir {count} horários',
  'suggest_finding': 'Procurando horário livre…',
  'suggest_finding_sr': 'Procurando horário livre na sua agenda.',
  'suggest_none_one': 'Nenhum horário livre entre {from} e {to} em dia útil no próximo {count} dia. Adicione horários manualmente ou libere espaço e tente de novo.',
  'suggest_none_other': 'Nenhum horário livre entre {from} e {to} em dia útil nos próximos {count} dias. Adicione horários manualmente ou libere espaço e tente de novo.',
  'suggest_some': '{found} de {total} adicionados: era todo o horário livre disponível. Arraste um para movê-lo, clique para removê-lo.',
  'suggest_added_one': '{count} horário adicionado do seu tempo livre. Arraste para movê-lo, clique para removê-lo.',
  'suggest_added_other': '{count} horários adicionados do seu tempo livre. Arraste um para movê-lo, clique para removê-lo.',

  // Connect-a-calendar prompt beside the calendar view
  'cal_busy_lead': 'Veja quando você já está ocupado',
  'cal_prompt_connect': '{lead}: conecte uma agenda e seus horários ocupados aparecem sombreados na grade. Só você os vê.',
  'cal_other_lead': 'Ocupado em outro lugar também?',
  'cal_prompt_other': '{lead} Conecte sua outra agenda e ela também sombreia a grade.',
  'cal_prompt_guest': '{lead}: confirme seu e-mail (o mesmo que salva sua enquete) e depois conecte sua agenda. Só você vê o sombreado.',
  'connect_google': 'Conectar Google Calendar',
  'connect_outlook': 'Conectar Outlook',
  'dont_show_again': 'Não mostrar de novo',
  'cal_later_web': 'Você ainda pode conectar uma quando quiser pelo menu do perfil (canto superior direito) → Ajustar este app → Opções desta enquete.',
  'cal_later_phone': 'Você ainda pode conectar uma quando quiser em Ajustar (canto superior direito) → Opções desta enquete.',
  'verify': 'Confirmar',
  'verifying': 'Confirmando…',
  'different_email': 'Outro e-mail',
  'code_sent': 'Enviamos um código de 6 dígitos para {email}.',
  'sending': 'Enviando…',
  'email_me_code': 'Enviar um código por e-mail',

  // Calendar errors
  'err_email_first': 'Primeiro informe um e-mail válido.',
  'err_code': 'Digite o código do seu e-mail.',
  'cal_read_failed_google': 'Não foi possível ler sua agenda do Google: a conexão funciona, mas a consulta de disponibilidade falhou. Tente de novo daqui a pouco, ou desconecte e conecte de novo.',
  'cal_read_failed_outlook': 'Não foi possível ler sua agenda do Outlook: a conexão funciona, mas a consulta de disponibilidade falhou. Tente de novo daqui a pouco, ou desconecte e conecte de novo.',
  'cal_read_failed_both': 'Não foi possível ler suas agendas do Google e do Outlook: a conexão funciona, mas a consulta de disponibilidade falhou. Tente de novo daqui a pouco, ou desconecte e conecte de novo.',
  'cal_expired': 'Uma conexão de agenda expirou. Conecte-a de novo.',
  'cal_expired_suggest': 'Uma conexão de agenda expirou. Conecte-a de novo e depois sugira horários.',
  'cal_read_failed_suggest': 'Não foi possível ler sua agenda agora, então nada foi sugerido. Tente de novo daqui a pouco.',
  'cal_cancelled': 'A conexão da agenda foi cancelada ou falhou.',
  'popup_blocked': 'Seu navegador bloqueou o pop-up. Permita pop-ups para este site e tente de novo.',

  // Logo errors
  'logo_type': 'O logo precisa ser uma imagem PNG, JPG ou WebP.',
  'logo_size': 'O logo precisa ter no máximo 10 MB.',

  // Checks before creating
  'err_title': 'Dê um título à sua enquete.',
  'err_add_day': 'Adicione pelo menos um dia.',
  'err_add_time': 'Adicione pelo menos uma data e um horário.',
  'err_email': 'Informe um e-mail válido.',
  'err_booking_email': 'Uma página de agendamento envia cada agendamento para o seu e-mail, então ela precisa do seu endereço.',
  'err_alerts_email': 'Informe seu e-mail para receber alertas de resposta, ou desative os alertas em Opções desta enquete.',
  'err_backend': 'O Polling precisa do back-end Supabase configurado para criar enquetes.',
  'err_free_limit': 'Você atingiu seu limite gratuito de enquetes ativas. Exclua uma enquete ou espere uma terminar para liberar espaço.',
  'err_free_limit_held': 'Você atingiu seu limite gratuito de enquetes ativas (ocupado por {what}). Exclua uma enquete ou espere uma terminar para liberar espaço.',
  'err_generic': 'Algo deu errado. Tente de novo.',

  // Summary of this poll's options, above the Create button
  'booking_chip': 'Página de agendamento',
  'link_valid': 'Link válido por {period}',
  'link_valid_while': 'Link válido por um tempo',
  'alerts_on': 'alertas de resposta ativados',
  'alerts_off': 'sem alertas de resposta',
  'change_these_web': ': mude isso no menu do perfil (canto superior direito) → Ajustar este app → Opções desta enquete.',
  'change_these_phone': ': mude isso em Ajustar (canto superior direito) → Opções desta enquete.',

  // Changing the times on a live poll
  'editing_title': 'Você está mudando os horários da sua enquete publicada.',
  'editing_body': 'Até você salvar, quem abrir o link verá que você está mudando os horários e que deve voltar daqui a pouco. Ninguém respondeu ainda, então nada se perde. Sua marca continua como estava.',
  'editing_cancel': 'Cancelar e manter como estava',

  // Free allowance
  'need_more': 'Precisa de mais? Fale com a gente',
  'purchased_tokens_one': '{count} crédito comprado',
  'purchased_tokens_other': '{count} créditos comprados',

  // Who is creating
  'creating_as': 'Criando como {name}, sem precisar confirmar o e-mail.',
  'creating_as_org': 'Criando como {name}{email}, sem precisar confirmar o e-mail.',
  'signed_in_as': 'Você entrou como {email} (confirmado).',
  'not_you': 'Não é você? Sair',
  'your_email': 'Seu e-mail',
  'email_hint_booking': 'Necessário para uma página de agendamento: é para onde enviamos cada agendamento. Vamos mandar um código rápido para confirmar que é você.',
  'email_hint_alerts': 'Para onde enviaremos seus alertas de resposta. Vamos mandar um código rápido para confirmar que é você.',
  'email_hint_optional': 'Só se você quiser alertas de resposta ou encontrar suas enquetes em outro dispositivo. Vamos mandar um código rápido para confirmá-lo. Deixe em branco e você receberá um link de administração privado para gerenciar a enquete.',
  'email_note_alerts': 'Vamos mandar um código rápido para confirmar que é você: é assim que você vai gerenciar esta enquete depois, e é para lá que enviaremos seus alertas de resposta.',
  'email_note_web': 'Vamos mandar um código rápido para confirmar que é você: é assim que você vai gerenciar esta enquete depois. Quer um e-mail sempre que um convidado responder? Ative isso no menu do perfil (canto superior direito) → Ajustar este app → Opções desta enquete.',
  'email_note_phone': 'Vamos mandar um código rápido para confirmar que é você: é assim que você vai gerenciar esta enquete depois. Quer um e-mail sempre que um convidado responder? Ative isso em Ajustar (canto superior direito) → Opções desta enquete.',
  'code_label': 'Digite o código de 6 dígitos que enviamos para {email}',
  'code_note_alerts': 'Ao confirmar, sua enquete é criada e os alertas de resposta para este endereço são ativados.',
  'code_note': 'Ao confirmar, sua enquete é criada e você pode gerenciá-la depois com este endereço.',
  'use_different_email': 'Usar outro e-mail',

  // The main button
  'btn_sending': 'Enviando código…',
  'btn_saving': 'Salvando alterações…',
  'btn_creating': 'Criando enquete…',
  'btn_verify_create': 'Confirmar e criar enquete',
  'btn_save': 'Salvar alterações',
  'btn_create': 'Criar enquete',

  // Branding card
  'branding': 'Marca',
  'branding_imported': 'Importada da sua conta. Se quiser, substitua-a nesta enquete.',
  'branding_guest': 'Adicione sua cor e seu logo às páginas de criação e de compartilhamento da enquete.',
  'sign_in_branding': 'Entre para importar sua marca →',
  'account_logo': 'Logo da conta',
  'your_account': 'Sua conta',
  'account_colour': 'Cor da conta',
  'default_colour': 'Cor padrão',
  'customise': 'Personalizar nesta enquete',
  'booking_colour': 'Cor da página de agendamento',
  'colour_orange': 'Laranja',
  'colour_blue': 'Azul',
  'colour_pink': 'Rosa',
  'colour_green': 'Verde',
  'custom_colour': 'Cor personalizada',
  'brand_name': 'Nome da marca',
  'brand_placeholder': 'ex.: Acme Aventuras',
  'logo': 'Logo',
  'logo_preview': 'Prévia do logo',
  'logo_change': 'Trocar…',
  'logo_upload': 'Enviar…',
  'logo_hint': 'PNG, JPG ou WebP · imagens grandes são redimensionadas para você.',
  'use_account_branding': 'Usar a marca da minha conta',

  // "Your poll is live" panel
  'live_booking': 'Sua página de agendamento está no ar',
  'live_poll': 'Sua enquete está no ar',
  'live_booking_body': 'Envie este link para a única pessoa com quem você quer se encontrar. O primeiro horário que ela escolher fica agendado, e vocês dois recebem um convite de agenda.',
  'live_poll_body': 'Compartilhe este link com todos que você quer convidar.',
  'copied': 'Copiado!',
  'open_poll': 'Abrir sua enquete →',
  'change_times': '← Mudar os horários',
  'change_times_hint': 'Você pode voltar e mudá-los até alguém responder.',
}

export default create
