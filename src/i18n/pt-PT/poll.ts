// European Portuguese (pt-PT) — poll. Every key in ../en/poll.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const poll: Draft['poll'] = {
  // Loading, not found, load error
  'loading': 'A carregar a sondagem…',
  'load_failed': 'Não foi possível carregar a sondagem.',
  'load_error_title': 'Não foi possível carregar esta sondagem',
  'load_error_fallback': 'Algo correu mal.',
  'not_found_title': 'Sondagem não encontrada',
  'not_found_body': 'Esta sondagem pode ter sido removida, ou a ligação está errada.',
  'not_found_create': 'Criar uma nova sondagem →',

  // The line under the poll's title
  'header_booked': 'Este horário está marcado.',
  'header_waiting': 'À espera de que o seu convidado escolha um horário.',
  'header_pick': 'Escolha o horário que lhe convém — fica marcado de imediato.',
  'header_first': 'Seja o primeiro a responder.',
  'header_responded_one': '{count} pessoa respondeu.',
  'header_responded_other': '{count} pessoas responderam.',
  'times_in': 'Horas em {tz}',

  // The host is changing the times
  'editing_title': 'O organizador está a alterar os horários. Volte daqui a pouco.',
  'editing_body': 'Esta página atualiza-se sozinha quando terminar.',

  // The guest has just booked (booking page)
  'booked_title': 'Está marcado.',
  'booked_via_calendar': 'Vai a caminho de {email} um convite de calendário — aceite-o e a reunião fica no seu calendário.',
  'booked_emailed': 'Enviámos o convite para {email} — abra o anexo para o adicionar ao seu calendário.',
  'booked_not_emailed': 'Não conseguimos enviar-lhe uma cópia por e-mail agora, por isso adicione-o ao seu calendário com o botão acima — o horário em si está marcado.',

  // Hints for the host
  'host_hint': 'É o organizador — escolha abaixo o horário final com {button}, e todos os que tiverem a ligação vão vê-lo.',
  'host_hint_button': 'Confirmar este horário',
  'host_booking_hint': 'Esta é uma página de marcação. Envie a ligação a uma pessoa — o horário que ela escolher fica marcado de imediato, e ambos recebem um convite de calendário.',

  // The private admin link
  'admin_checking': 'A verificar a sua ligação de administração…',
  'admin_failed': 'Essa ligação de administração não funcionou para esta sondagem, por isso está a vê-la como convidado. Confirme que copiou a ligação completa.',
  'admin_unsupported': 'As ligações de administração ainda não estão disponíveis, por isso está a ver esta sondagem como convidado. Tente a ligação novamente mais tarde.',
  'admin_link_summary': 'A sua ligação de administração privada',
  'signed_in_as': 'Sessão iniciada como {email} — {signout}',
  'sign_out': 'Terminar sessão',

  // An expired poll
  'expired_one': 'A ligação desta sondagem expirou — agora é só de leitura, e será apagada {count} dia depois de ter expirado, com todas as respostas.',
  'expired_other': 'A ligação desta sondagem expirou — agora é só de leitura, e será apagada {count} dias depois de ter expirado, com todas as respostas.',

  // Answering the poll
  'respond_title_days': 'Está disponível nestes dias?',
  'respond_title_times': 'Está disponível nestes horários?',
  'respond_folded': 'Já há um horário confirmado, por isso esta secção está recolhida. Ainda pode alterar as suas respostas.',
  'respond_intro_days': 'Indique o seu nome, responda a cada dia e guarde. Não precisa de conta.',
  'respond_intro_times': 'Indique o seu nome, responda a cada horário e guarde. Não precisa de conta.',
  'your_name': 'O seu nome',
  'name_placeholder': 'ex.: Rita',
  'your_email': 'O seu e-mail',
  'optional': '(opcional)',
  'email_placeholder': 'nome@exemplo.pt',
  'edit_link_ok': 'A sua ligação de edição funcionou: estas são as suas respostas. Altere-as e guarde.',
  'edit_link_failed': 'Essa ligação de edição não corresponde a nenhuma resposta desta sondagem. Pode ter sido removida. Ainda pode responder abaixo.',
  'name_claimed': '«{name}» já respondeu a esta sondagem, e só essa pessoa pode alterar essas respostas. Se for o seu caso, abra a ligação de edição que recebeu, ou use o dispositivo em que respondeu. Se não, acrescente uma inicial ou o apelido.',
  'name_unclaimed': '«{name}» já respondeu a esta sondagem. Guardar vai substituir essas respostas — não há problema se forem suas. Se não forem, acrescente uma inicial ou o apelido para não substituir as de outra pessoa.',
  'name_similar': 'Alguém já respondeu como «{name}». Acrescente uma inicial ou o apelido para que se possa distinguir.',
  'email_note': 'Deixe o seu e-mail e receberá a data final (com um convite de calendário) quando o organizador a confirmar. Só o organizador o pode ver — nunca os outros participantes.',
  'all_day': 'Todo o dia',
  'answer_yes': 'Sim 👍',
  'answer_maybe': 'Se for preciso',
  'answer_no': 'Não 🙅‍♀️',
  'saving': 'A guardar…',
  'replace_answers': 'Substituir as respostas de {name}',
  'save_availability': 'Guardar a minha disponibilidade',
  'saved': 'Guardado — obrigado!',
  'removing': 'A remover…',
  'remove_my_answers': 'Remover as minhas respostas',
  'next_with_email': 'O organizador escolhe o horário final quando todos tiverem respondido — nessa altura enviamos-lho por e-mail, com um convite de calendário.',
  'next_without_email': 'O organizador escolhe o horário final quando todos tiverem respondido. Abra esta ligação novamente para o ver, ou indique o seu e-mail acima e guarde de novo para o receber.',

  // Errors while answering
  'err_name': 'Indique o seu nome para que saibam quem é.',
  'err_email': 'Esse e-mail não parece correto — corrija-o ou deixe-o em branco.',
  'err_email_store_why': 'A sua disponibilidade foi guardada, mas não foi possível guardar o seu e-mail — {why}.',
  'err_email_store': 'A sua disponibilidade foi guardada, mas não foi possível guardar o seu e-mail — tente guardar novamente.',
  'err_save': 'Não foi possível guardar a sua resposta.',

  // Removing answers
  'remove_confirm_host': 'Remover as respostas de {name} desta sondagem? Não é possível anular.',
  'remove_confirm_own': 'Remover as suas respostas desta sondagem? Não é possível anular.',
  'remove_confirm_button': 'Remover',
  'err_remove_host': 'Não foi possível remover essa resposta — recarregue a página e tente novamente.',
  'err_remove_own': 'Só a pessoa que deu estas respostas as pode remover.',
  'err_remove': 'Não foi possível remover essas respostas.',
  'err_confirm': 'Não foi possível confirmar o horário.',

  // A booking page: the guest picks one time
  'pick_day': 'Escolha um dia',
  'pick_time': 'Escolha um horário',
  'booking_intro': 'O que escolher fica marcado de imediato — não há mais nada a enviar, e não precisa de conta.',
  'booking_email_note': 'O seu convite de calendário é enviado para aqui. Só é usado para esta marcação.',
  'booking': 'A marcar…',
  'book_day': 'Marcar este dia',
  'book_time': 'Marcar este horário',
  'pick_day_above': 'Escolha um dia acima',
  'pick_time_above': 'Escolha um horário acima',
  'offering_days': 'Dias que está a oferecer',
  'offering_times': 'Horários que está a oferecer',
  'err_book_name': 'Indique o seu nome para que saibam com quem se vão encontrar.',
  'err_book_email': 'Indique o endereço de e-mail para onde deve ir o seu convite.',
  'err_book': 'Não foi possível marcar esse horário.',
  'cancel_not_notified': 'A marcação foi cancelada e a página está novamente aberta — mas não conseguimos enviar um e-mail ao seu convidado. Avise-o diretamente.',
  'err_cancel': 'Não foi possível cancelar essa marcação.',

  // A booking was made but an email bounced (host only)
  'notify_title': 'Este horário está marcado — mas um e-mail não chegou.',
  'notify_your_guest': 'o seu convidado',
  'notify_both': 'Nem o organizador nem {who} receberam um e-mail sobre isto. O horário fica reservado de qualquer forma, por isso vale a pena contactar diretamente essa pessoa para o confirmar.',
  'notify_invitee': 'Não conseguimos enviar um e-mail a {who}, por isso pode não saber que está confirmado. O horário está reservado — contactar diretamente essa pessoa é a solução segura.',
  'notify_host': '{who} recebeu o e-mail e tem os detalhes, mas a sua cópia foi devolvida. Verifique o endereço da sua conta, se estava à espera dela.',

  // Results
  'results': 'Resultados',
  'results_so_far': 'Resultados até agora',
  'results_nobody': 'Ninguém respondeu.',
  'results_responded_one': '{count} pessoa respondeu.',
  'results_responded_other': '{count} pessoas responderam.',
  'no_responses_host': 'Ainda sem respostas — partilhe a ligação para começar.',
  'no_responses_guest': 'Ainda sem respostas — a sua será a primeira.',
  'confirmed_chip': '✓ Confirmado',
  'best_chip': 'Melhor',
  'tally_maybe_one': '{count} talvez',
  'tally_maybe_other': '{count} talvez',
  'tally_no_one': '{count} indisponível',
  'tally_no_other': '{count} indisponíveis',
  'names_maybe': 'talvez: {names}',
  'names_no': 'indisponível: {names}',
  'confirm_this_time': '✓ Confirmar este horário',
  'unconfirm': 'Anular confirmação',
  'remove_an_answer': 'Remover uma resposta',
  'remove_an_answer_hint': 'Para lixo, um duplicado, ou alguém que perdeu a ligação de edição e quer responder de novo.',
  'remove_name_aria': 'Remover as respostas de {name}',

  // The confirmed banner
  'booked_by': '✓ Marcado por {name}',
  'booked': '✓ Marcado',
  'confirmed_time': '✓ Horário confirmado',
  'cancel_booking_named': 'Cancelar esta marcação?\n\n{name} vai receber um e-mail a avisar que foi cancelada, e a página volta a abrir para escolher outro horário.',
  'cancel_booking_unnamed': 'Cancelar esta marcação?\n\nO seu convidado vai receber um e-mail a avisar que foi cancelada, e a página volta a abrir para escolher outro horário.',
  'cancel_booking_confirm': 'Cancelar a marcação',
  'keep_it': 'Manter',
  'working': 'A processar…',
  'change': 'Alterar',
  'sending': 'A enviar…',
  'resend': 'Reenviar a confirmação',
  'email_again': 'Enviar novo e-mail aos participantes',
  'email_this_time': 'Enviar este horário aos participantes',
  'sent_one': 'Enviado a {count} pessoa ✓',
  'sent_other': 'Enviado a {count} pessoas ✓',
  'no_one_email': 'Ainda ninguém deixou um endereço de e-mail.',
  'guest_emailed_named': '{name} recebeu o convite por e-mail quando marcou ✓',
  'guest_emailed': 'O seu convidado recebeu o convite por e-mail quando marcou ✓',
  'respondents_emailed': 'Os participantes já receberam o e-mail ✓',
  'notify_hint': 'Envia a data confirmada e um convite de calendário a todos os que deixaram um e-mail.',

  // The host's own calendar
  'adding': 'A adicionar…',
  'update_in_calendar': 'Atualizar no meu calendário',
  'add_to_my_provider': 'Adicionar ao meu {provider}',
  'add_to_my_calendars': 'Adicionar aos meus calendários',
  'reconnect_to_add': 'Voltar a ligar {provider} para o adicionar',
  'added_to': 'Adicionado a {providers} ✓',
  'list_two': '{a} e {b}',
  'cal_stale': 'O seu calendário foi ligado só para a disponibilidade — volte a ligá-lo uma vez para permitir adicionar eventos.',
  'cal_stale_hint': 'Ligado só para a disponibilidade. Voltar a ligar uma vez permite pôr este horário diretamente na sua agenda.',
  'cal_add_hint': 'Põe este horário no seu próprio calendário. Pode clicar duas vezes sem problema — atualiza o mesmo evento.',
  'cal_expired': 'A ligação do seu calendário expirou — volte a ligá-lo no ecrã de criação.',
  'cal_add_failed': 'Não foi possível adicionar isto ao seu calendário.',
  'cal_popups': 'Permita pop-ups neste site para voltar a ligar o seu calendário.',
  'cal_claim_failed': 'Não foi possível concluir a ligação do seu calendário.',
  'cal_reconnect_failed': 'Não foi possível iniciar a nova ligação.',
  'err_send': 'Não foi possível enviar os e-mails.',

  // The timezone bar
  'tz_poll_in': 'Esta sondagem está em {tz} {zone}.',
  'tz_show_mine': 'Mostrar as horas no seu fuso horário ({tz})',
  'tz_reset': 'Repor o fuso horário da sondagem',
  'your_time': '{time} na sua hora',
  'your_time_dated': '{date}, {time} na sua hora',

  // Folding sections
  'show': 'Mostrar ▾',
  'hide': 'Ocultar ▴',

  'brand_alt': 'Marca',
}

export default poll
