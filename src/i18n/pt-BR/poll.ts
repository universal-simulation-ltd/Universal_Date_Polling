// Brazilian Portuguese (pt-BR) — poll. Every key in ../en/poll.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const poll: Draft['poll'] = {
  // Loading, not found, load error
  'loading': 'Carregando enquete…',
  'load_failed': 'Falha ao carregar a enquete.',
  'load_error_title': 'Não foi possível carregar esta enquete',
  'load_error_fallback': 'Algo deu errado.',
  'not_found_title': 'Enquete não encontrada',
  'not_found_body': 'Esta enquete pode ter sido removida, ou o link está errado.',
  'not_found_create': 'Criar uma nova enquete →',

  // The line under the poll's title
  'header_booked': 'Este horário está agendado.',
  'header_waiting': 'Aguardando seu convidado escolher um horário.',
  'header_pick': 'Escolha o horário que for melhor para você: ele é agendado na hora.',
  'header_first': 'Seja o primeiro a responder.',
  'header_responded_one': '{count} pessoa respondeu.',
  'header_responded_other': '{count} pessoas responderam.',
  'times_in': 'Horários em {tz}',

  // The host is changing the times
  'editing_title': 'O organizador está mudando os horários. Volte daqui a pouco.',
  'editing_body': 'Esta página se atualiza sozinha quando ele terminar.',

  // The guest has just booked (booking page)
  'booked_title': 'Seu horário está agendado.',
  'booked_via_calendar': 'Um convite de agenda está a caminho de {email}: aceite-o e a reunião entra na sua agenda.',
  'booked_emailed': 'Enviamos o convite para {email}: abra o anexo para adicioná-lo à sua agenda.',
  'booked_not_emailed': 'Não conseguimos enviar uma cópia por e-mail agora, então adicione o evento à sua agenda pelo botão acima. O horário em si já está agendado.',

  // Hints for the host
  'host_hint': 'Você é o organizador: escolha o horário final abaixo com {button}, e todos com o link vão vê-lo.',
  'host_hint_button': 'Confirmar este horário',
  'host_booking_hint': 'Esta é uma página de agendamento. Envie o link para uma pessoa: o horário que ela escolher é agendado na hora, e vocês dois recebem um convite de agenda.',

  // The private admin link
  'admin_checking': 'Verificando seu link de administração…',
  'admin_failed': 'Esse link de administração não funcionou para esta enquete, então você a está vendo como convidado. Verifique se copiou o link inteiro.',
  'admin_unsupported': 'Os links de administração ainda não estão disponíveis, então você está vendo esta enquete como convidado. Tente o link de novo mais tarde.',
  'admin_link_summary': 'Seu link de administração privado',
  'signed_in_as': 'Você entrou como {email}: {signout}',
  'sign_out': 'Sair',

  // An expired poll
  'expired_one': 'O link desta enquete expirou: agora ela é somente leitura e será excluída, com todas as respostas, {count} dia depois de expirar.',
  'expired_other': 'O link desta enquete expirou: agora ela é somente leitura e será excluída, com todas as respostas, {count} dias depois de expirar.',

  // Answering the poll
  'respond_title_days': 'Você está livre nestes dias?',
  'respond_title_times': 'Você está livre nestes horários?',
  'respond_folded': 'Um horário foi confirmado, então isto está recolhido. Você ainda pode mudar suas respostas.',
  'respond_intro_days': 'Digite seu nome, responda a cada dia e salve. Não precisa de conta.',
  'respond_intro_times': 'Digite seu nome, responda a cada horário e salve. Não precisa de conta.',
  'your_name': 'Seu nome',
  'name_placeholder': 'ex.: Ana',
  'your_email': 'Seu e-mail',
  'optional': '(opcional)',
  'email_placeholder': 'voce@exemplo.com',
  'edit_link_ok': 'Seu link de edição funcionou: estas são suas respostas. Mude o que quiser e salve.',
  'edit_link_failed': 'Esse link de edição não corresponde a nenhuma resposta desta enquete. Ela pode ter sido removida. Você ainda pode responder abaixo.',
  'name_claimed': '“{name}” já respondeu esta enquete, e só essa pessoa pode mudar essas respostas. Se for você, abra o link de edição que recebeu ou use o dispositivo em que respondeu. Se não, adicione uma inicial ou seu sobrenome.',
  'name_unclaimed': '“{name}” já respondeu esta enquete. Salvar vai substituir essas respostas, o que não tem problema se forem suas. Se não, adicione uma inicial ou seu sobrenome para não sobrescrever as de outra pessoa.',
  'name_similar': 'Alguém já respondeu como “{name}”. Adicione uma inicial ou seu sobrenome para que as pessoas saibam quem é quem.',
  'email_note': 'Deixe seu e-mail e você receberá a data final (com um convite de agenda) quando o organizador confirmá-la. Só o organizador pode vê-lo, nunca os outros participantes.',
  'all_day': 'O dia todo',
  'answer_yes': 'Sim 👍',
  'answer_maybe': 'Se precisar',
  'answer_no': 'Não 🙅‍♀️',
  'saving': 'Salvando…',
  'replace_answers': 'Substituir as respostas de {name}',
  'save_availability': 'Salvar minha disponibilidade',
  'saved': 'Salvo. Obrigado!',
  'removing': 'Removendo…',
  'remove_my_answers': 'Remover minhas respostas',
  'next_with_email': 'O organizador escolhe o horário final quando todos tiverem respondido. Aí enviaremos o horário para o seu e-mail, com um convite de agenda.',
  'next_without_email': 'O organizador escolhe o horário final quando todos tiverem respondido. Abra este link de novo para vê-lo, ou informe seu e-mail acima e salve de novo para recebê-lo.',

  // Errors while answering
  'err_name': 'Digite seu nome para que as pessoas saibam quem você é.',
  'err_email': 'Esse e-mail não parece certo. Corrija-o ou deixe em branco.',
  'err_email_store_why': 'Sua disponibilidade foi salva, mas não foi possível guardar seu e-mail: {why}.',
  'err_email_store': 'Sua disponibilidade foi salva, mas não foi possível guardar seu e-mail. Tente salvar de novo.',
  'err_save': 'Não foi possível salvar sua resposta.',

  // Removing answers
  'remove_confirm_host': 'Remover as respostas de {name} desta enquete? Isso não pode ser desfeito.',
  'remove_confirm_own': 'Remover suas respostas desta enquete? Isso não pode ser desfeito.',
  'remove_confirm_button': 'Remover',
  'err_remove_host': 'Não foi possível remover essa resposta. Recarregue a página e tente de novo.',
  'err_remove_own': 'Só quem deu estas respostas pode removê-las.',
  'err_remove': 'Não foi possível remover essas respostas.',
  'err_confirm': 'Não foi possível confirmar o horário.',

  // A booking page: the guest picks one time
  'pick_day': 'Escolha um dia',
  'pick_time': 'Escolha um horário',
  'booking_intro': 'O que você escolher é agendado na hora: não precisa enviar mais nada nem ter conta.',
  'booking_email_note': 'Seu convite de agenda vai para cá. Este e-mail só é usado para este agendamento.',
  'booking': 'Agendando…',
  'book_day': 'Agendar este dia',
  'book_time': 'Agendar este horário',
  'pick_day_above': 'Escolha um dia acima',
  'pick_time_above': 'Escolha um horário acima',
  'offering_days': 'Dias que você está oferecendo',
  'offering_times': 'Horários que você está oferecendo',
  'err_book_name': 'Digite seu nome para que a pessoa saiba com quem vai se encontrar.',
  'err_book_email': 'Informe o e-mail para onde o convite deve ir.',
  'err_book': 'Não foi possível agendar esse horário.',
  'cancel_not_notified': 'O agendamento foi cancelado e a página está aberta de novo, mas não conseguimos enviar um e-mail ao seu convidado. Avise-o você mesmo.',
  'err_cancel': 'Não foi possível cancelar esse agendamento.',

  // A booking was made but an email bounced (host only)
  'notify_title': 'Este horário está agendado, mas um e-mail não foi entregue.',
  'notify_your_guest': 'seu convidado',
  'notify_both': 'Nem você nem {who} receberam um e-mail sobre isso. O horário está reservado de qualquer forma, então vale a pena entrar em contato diretamente para confirmar.',
  'notify_invitee': 'Não conseguimos enviar um e-mail para {who}, então talvez a pessoa não saiba que está confirmado. O horário está reservado: entrar em contato diretamente é a solução mais segura.',
  'notify_host': '{who} recebeu o e-mail e tem os detalhes, mas a nossa cópia para você voltou. Verifique o endereço da sua conta se esperava recebê-la.',

  // Results
  'results': 'Resultados',
  'results_so_far': 'Resultados até agora',
  'results_nobody': 'Ninguém respondeu.',
  'results_responded_one': '{count} pessoa respondeu.',
  'results_responded_other': '{count} pessoas responderam.',
  'no_responses_host': 'Nenhuma resposta ainda. Compartilhe o link para começar.',
  'no_responses_guest': 'Nenhuma resposta ainda. A sua será a primeira.',
  'confirmed_chip': '✓ Confirmado',
  'best_chip': 'Melhor',
  'tally_maybe_one': '{count} se precisar',
  'tally_maybe_other': '{count} se precisar',
  'tally_no_one': '{count} não livre',
  'tally_no_other': '{count} não livres',
  'names_maybe': 'se precisar: {names}',
  'names_no': 'não livres: {names}',
  'confirm_this_time': '✓ Confirmar este horário',
  'unconfirm': 'Desfazer confirmação',
  'remove_an_answer': 'Remover uma resposta',
  'remove_an_answer_hint': 'Para spam, uma duplicata ou alguém que perdeu o link de edição e quer responder de novo.',
  'remove_name_aria': 'Remover as respostas de {name}',

  // The confirmed banner
  'booked_by': '✓ Agendado por {name}',
  'booked': '✓ Agendado',
  'confirmed_time': '✓ Horário confirmado',
  'cancel_booking_named': 'Cancelar este agendamento?\n\n{name} receberá um e-mail avisando que foi cancelado, e a página se abre para essa pessoa escolher outro horário.',
  'cancel_booking_unnamed': 'Cancelar este agendamento?\n\nSeu convidado receberá um e-mail avisando que foi cancelado, e a página se abre para ele escolher outro horário.',
  'cancel_booking_confirm': 'Cancelar o agendamento',
  'keep_it': 'Manter',
  'working': 'Processando…',
  'change': 'Alterar',
  'sending': 'Enviando…',
  'resend': 'Reenviar a confirmação',
  'email_again': 'Enviar e-mail aos participantes de novo',
  'email_this_time': 'Enviar este horário aos participantes por e-mail',
  'sent_one': 'Enviado para {count} pessoa ✓',
  'sent_other': 'Enviado para {count} pessoas ✓',
  'no_one_email': 'Ninguém deixou um e-mail ainda.',
  'guest_emailed_named': '{name} recebeu o convite por e-mail ao agendar ✓',
  'guest_emailed': 'Seu convidado recebeu o convite por e-mail ao agendar ✓',
  'respondents_emailed': 'Os participantes receberam o e-mail ✓',
  'notify_hint': 'Envia a data confirmada e um convite de agenda para todos que deixaram um e-mail.',

  // The host's own calendar
  'adding': 'Adicionando…',
  'update_in_calendar': 'Atualizar na minha agenda',
  'add_to_my_provider': 'Adicionar ao meu {provider}',
  'add_to_my_calendars': 'Adicionar às minhas agendas',
  'reconnect_to_add': 'Reconecte o {provider} para adicionar',
  'added_to': 'Adicionado a {providers} ✓',
  'list_two': '{a} e {b}',
  'cal_stale': 'Sua agenda foi conectada só para disponibilidade. Reconecte-a uma vez para permitir adicionar eventos.',
  'cal_stale_hint': 'Conectada só para disponibilidade. Uma nova conexão permite colocar o horário direto na sua agenda.',
  'cal_add_hint': 'Coloca este horário na sua própria agenda. Pode clicar duas vezes sem problema: o mesmo evento é atualizado.',
  'cal_expired': 'A conexão da sua agenda expirou. Reconecte-a na tela de criação.',
  'cal_add_failed': 'Não foi possível adicionar isto à sua agenda.',
  'cal_popups': 'Permita pop-ups para este site para reconectar sua agenda.',
  'cal_claim_failed': 'Não foi possível concluir a conexão da sua agenda.',
  'cal_reconnect_failed': 'Não foi possível iniciar a reconexão.',
  'err_send': 'Não foi possível enviar os e-mails.',

  // The timezone bar
  'tz_poll_in': 'Esta enquete está no fuso {tz} {zone}.',
  'tz_show_mine': 'Mostrar horários no seu fuso ({tz})',
  'tz_reset': 'Voltar ao fuso da enquete',
  'your_time': '{time} no seu horário',
  'your_time_dated': '{date}, {time} no seu horário',

  // Folding sections
  'show': 'Mostrar ▾',
  'hide': 'Ocultar ▴',

  'brand_alt': 'Marca',
}

export default poll
