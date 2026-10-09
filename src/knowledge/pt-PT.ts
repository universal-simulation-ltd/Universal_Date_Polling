import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'how-date-polls-work',
    title: 'Como funciona uma sondagem de datas',
    summary: 'Proponha algumas opções, partilhe uma única ligação e deixe o melhor horário destacar-se.',
    group: 'O essencial',
    body: `Encontrar por e-mail uma data que sirva a um grupo acaba muitas vezes numa longa troca de "Na terça posso, mas não de manhã". Uma sondagem de datas substitui essa troca por uma única página que todos podem preencher.

## A ideia

1. Quem organiza propõe algumas datas ou horas possíveis.
2. Partilha uma única ligação com todas as pessoas que devem participar.
3. Cada pessoa abre a ligação, escreve o nome e marca cada opção como **disponível**, **se for preciso** ou **indisponível**.
4. Os resultados somam as respostas de cada opção, e os horários que servem a mais pessoas destacam-se.
5. Quem organiza confirma o horário escolhido, e todos os que abrirem a ligação passam a vê-lo.

Ninguém precisa de conta para responder. Só quem organiza tem de iniciar sessão ou confirmar o endereço de e-mail, pelo que não é possível criar sondagens de forma anónima.

## Dois tipos de sondagem

- As sondagens **por horas** servem para reuniões e chamadas: cada opção tem uma hora de início e uma duração.
- As sondagens **por dias inteiros** servem para viagens, eventos e tudo aquilo em que só a data importa.

## Sugestões para uma boa sondagem

- Ofereça opções suficientes para haver uma escolha real, mas não tantas que responder se torne cansativo. Entre quatro e oito costuma resultar bem.
- Use "se for preciso" com honestidade. Indica a quem organiza que um horário é possível mas não ideal, o que ajuda a desempatar.
- Dê à sondagem um título claro. É a primeira coisa que se vê ao abrir a ligação.
- Se estiver a perguntar a pessoas em países diferentes, confirme o fuso horário antes de partilhar (consulte "Fusos horários, explicados").
- Quando confirma um horário, o formulário de resposta recolhe-se, para que ninguém fique na dúvida sobre se deve continuar a votar.`,
  },
  {
    id: 'time-zones-explained',
    title: 'Fusos horários, explicados',
    summary: 'Porque é que as 15h não são o mesmo momento em todo o lado, e como a aplicação mantém todos alinhados.',
    group: 'O essencial',
    body: `Uma hora sozinha, como "terça às 15h", só faz sentido quando se sabe onde são 15h. Os fusos horários são a forma de o mundo se entender quanto a isso.

## Diferenças e nomes

Cada fuso horário está um certo número de horas à frente ou atrás de uma hora de referência comum chamada UTC (Tempo Universal Coordenado). No inverno, Lisboa e Londres estão em UTC+0, Paris em UTC+1 e Nova Iorque em UTC−5. Assim, as 15h em Lisboa são 16h em Paris e 10h em Nova Iorque.

A diferença sozinha não chega, porque muitos locais mudam a hora no verão, e nem todos no mesmo dia. Por isso os computadores usam fusos com nome, como Europe/Lisbon ou America/New_York. Um fuso com nome guarda todo o histórico de mudanças de hora desse local, pelo que dá a diferença certa para qualquer data.

## Como esta aplicação trata disto

- Cada sondagem tem um único fuso horário. Começa por ser o de quem organiza, que o pode trocar por qualquer outro.
- As opções são escritas na hora local desse fuso. "10:00 de 3 de março, Europe/Lisbon" é sempre o mesmo momento, mesmo que a hora de verão comece entretanto.
- A página da sondagem indica em que fuso está. Se o seu dispositivo estiver noutro fuso, um botão mostra todas as horas no seu fuso; também pode escolher qualquer outro ou voltar ao da sondagem.
- Mudar o fuso de apresentação muda apenas a forma como as horas aparecem. Os momentos em si não mudam, por isso todos respondem sobre os mesmos instantes.
- As opções de dia inteiro são só datas, por isso não são convertidas.
- Quando adiciona um horário ao seu calendário, o evento fica no momento exato combinado, e o calendário mostra-o na sua hora local.

## Uma armadilha comum

Se criar uma sondagem durante uma viagem, o seu dispositivo pode estar no fuso do local onde está. Confirme o fuso da sondagem antes de a partilhar, para que "9h" signifique 9h onde a reunião vai de facto acontecer.`,
  },
  {
    id: 'hosting-a-poll',
    title: 'Organizar uma sondagem, do rascunho ao horário confirmado',
    summary: 'Criar, alterar, confirmar e voltar a encontrar as suas sondagens.',
    group: 'Como funciona',
    body: `## Criar uma sondagem

1. Dê um título à sondagem e escolha entre horas ou dias inteiros.
2. Adicione as opções. Se tiver ligado um calendário, as horas em que já está ocupado aparecem sombreadas, e **Suggest times** pode preencher a sondagem com quatro opções do seu tempo livre: só em dias úteis, entre as 10:00 e as 16:00 no fuso da sondagem, e no máximo uma de manhã e uma à tarde no mesmo dia.
3. Confirme o seu endereço de e-mail com um código de utilização única, ou inicie sessão com o seu Universal ID.
4. Partilhe a ligação.

## Mudar de ideias

Logo depois de criar uma sondagem, pode voltar atrás e alterar os horários, desde que ninguém tenha respondido. Enquanto edita, quem abrir a ligação é convidado a voltar dentro de pouco tempo, e as respostas são recusadas até guardar. Se deixar uma edição aberta durante dez minutos sem guardar, esta caduca por si e a sondagem volta a abrir.

## Confirmar um horário

Quando tiver as respostas, escolha a opção vencedora com **Confirm this time**. Só quem organiza o pode fazer. Todos os que abrirem a ligação passam a ver um aviso "Confirmed" com o horário escolhido. Pode alterar ou anular a escolha mais tarde.

A partir desse aviso pode:

- Enviar por e-mail o horário confirmado, com um convite de calendário em anexo, a todos os que deixaram um endereço. Só acontece quando clica, nunca automaticamente.
- Usar **Copy email** para enviar a mensagem a partir do seu próprio e-mail, com destinatários, assunto e texto prontos a copiar.
- Adicionar o horário ao seu próprio calendário.

## Adicionar ao calendário

Cada resultado, e também o aviso de confirmação, tem um botão **Add to calendar** com Google Calendar, Outlook ou um ficheiro de calendário para aplicações como o Calendário da Apple. O evento é preparado no seu dispositivo.

## Voltar a encontrar as suas sondagens

Com sessão iniciada como organizador, a página de criação lista as suas sondagens ativas, com quantas pessoas responderam, o horário confirmado se existir e quando expira cada ligação. Pode copiar uma ligação, eliminar uma sondagem ou eliminar de uma só vez todas as sondagens expiradas.`,
  },
  {
    id: 'poll-options',
    title: 'Páginas de marcação, validade, alertas e calendários',
    summary: 'Para que serve cada uma das opções em "This poll’s options".',
    group: 'Como funciona',
    body: `As opções da sondagem que está a criar estão no seu menu de perfil, em **Tune this app** → **This poll's options**. Aplicam-se apenas a essa sondagem.

## Página de marcação ("Just the two of us")

Para um encontro a dois. Em vez de recolher a disponibilidade de todos, a pessoa a quem envia a ligação escolhe um dos seus horários, indica o nome e o endereço de e-mail, e o horário fica marcado de imediato. Não tem nada para confirmar, e ambos recebem um convite de calendário por e-mail. Se tiver ligado um calendário que o permita, o convite pode sair do seu próprio calendário. Pode cancelar uma marcação mais tarde, e a outra pessoa é avisada.

## Validade da ligação

A ligação de uma sondagem funciona durante 7, 30, 90 ou 180 dias. Propositadamente, não existe a opção "nunca expira", porque estas ligações são partilhadas livremente. Depois de a ligação expirar, a sondagem fica só de leitura: continua visível, mas não são aceites novas respostas. 30 dias depois de a ligação expirar, a sondagem e as respetivas respostas são apagadas.

## Alertas de resposta

Assinale esta opção para receber um e-mail sempre que uma nova pessoa responder. Quem altera uma resposta já dada não gera outro e-mail. Os alertas não estão disponíveis numa página de marcação, porque cada marcação já lhe envia um e-mail.

## O seu calendário

Pode ligar um calendário Google ou Microsoft. A aplicação passa a usá-lo para sombrear as horas em que já está ocupado enquanto prepara uma sondagem, e para sugerir horas livres. Consoante o fornecedor e a autorização concedida, pode também mostrar os títulos dos eventos e adicionar um horário confirmado ao seu calendário. Pode desligá-lo a qualquer momento, o que apaga a ligação guardada.

## Fuso horário

Cada sondagem tem um único fuso horário. Começa por ser o seu, e pode escolher qualquer outro. Consulte "Fusos horários, explicados".

## E ainda

Pode adicionar um local, como uma ligação de videochamada ou uma sala, e escolher uma cor para a página da sondagem. Se tiver sessão iniciada com uma organização, o respetivo logótipo pode aparecer na página, ou pode adicionar o seu.`,
  },
  {
    id: 'who-can-see-what',
    title: 'Quem pode ver a sua sondagem e as suas respostas',
    summary: 'O que qualquer pessoa com a ligação vê, o que só quem organiza vê e o que fica privado.',
    group: 'Privacidade e segurança',
    body: `Uma sondagem de datas foi pensada para ser partilhada por ligação, por isso convém saber exatamente o que essa ligação mostra.

## Qualquer pessoa com a ligação pode ver

- O título, as opções, o fuso horário e o local da sondagem, bem como a cor ou o logótipo que use.
- O nome de cada participante e se indicou disponível, se for preciso ou indisponível em cada opção.
- O horário confirmado, depois de quem organiza o escolher.

As ligações das sondagens têm dez caracteres aleatórios, o que as torna muito difíceis de adivinhar. Mas qualquer pessoa a quem reencaminhe a ligação pode ver tudo isto, por isso pense bem a quem a envia.

## Só quem organiza pode ver

- Os endereços de e-mail que os participantes escolheram deixar. Servem para enviar o horário confirmado e preencher os convites de calendário, e nunca são mostrados aos outros participantes.

## Mais ninguém vê

- O endereço de e-mail de quem organiza. Fica guardado para lhe enviar os alertas e os e-mails de marcação, e não aparece na página da sondagem.

## O seu nome é a sua chave

As respostas são guardadas com o nome que escreve. Se responder de novo com exatamente o mesmo nome, a resposta anterior é atualizada em vez de duplicada. Isto também significa que outra pessoa com exatamente o mesmo nome substituiria a sua, por isso use algo que o identifique, como o nome completo.

Para lhe poupar trabalho, este dispositivo lembra o nome e o endereço de e-mail usados na sua última resposta. Esses dados ficam neste dispositivo.

## Deixar um e-mail é opcional

Pode responder sem indicar nenhum endereço de e-mail. Se deixar um, quem organiza poderá enviar-lhe o horário confirmado. Deixe o campo em branco se não quiser; responder de novo com o campo em branco remove o endereço indicado antes.`,
  },
  {
    id: 'what-is-stored',
    title: 'O que é guardado, e durante quanto tempo',
    summary: 'Onde ficam os dados das sondagens, o que faz a validade e o que é enviado a quem.',
    group: 'Privacidade e segurança',
    body: `## Nos nossos servidores

Uma sondagem tem de estar num sítio a que todos consigam aceder, por isso as sondagens e as respostas são guardadas nos nossos servidores. Isto inclui:

- A própria sondagem: título, opções, fuso horário, definições e o endereço de e-mail de quem organiza.
- Cada resposta: o nome indicado, as escolhas feitas e quando foi guardada.
- Os endereços de e-mail que os participantes escolheram deixar, e o nome e o endereço de e-mail de quem marca numa página de marcação.
- Um logótipo carregado por quem organiza. Os logótipos ficam num local onde qualquer pessoa com a ligação da sondagem os pode carregar, porque a página precisa de os mostrar.
- Se quem organiza ligou um calendário, as chaves de acesso dessa ligação. Ficam apenas no servidor, nunca são enviadas para a aplicação e só são usadas para fazer o que quem organiza pediu. Desligar o calendário apaga-as.

Tudo circula por ligações encriptadas e está protegido por regras de acesso. Não tem encriptação ponto a ponto, por isso os nossos sistemas conseguem tecnicamente lê-lo.

## Durante quanto tempo

Quando a ligação de uma sondagem expira, esta deixa de aceitar respostas e fica só de leitura. Não é apagada nesse momento, para que quem organiza ainda possa consultar as respostas. 30 dias depois de a ligação expirar, a sondagem é apagada automaticamente, juntamente com tudo o que é indicado abaixo. Quem organiza pode eliminá-la antes, e a lista de sondagens permite eliminar de uma só vez todas as expiradas.

Eliminar uma sondagem elimina também as respostas, os endereços de e-mail dos participantes e os dados de calendário associados. Cancelar uma marcação apaga o endereço de e-mail da outra pessoa, depois de a aplicação tentar avisá-la.

## E-mails

A aplicação só envia e-mails nestes casos:

- Um código de utilização única, quando quem organiza confirma o endereço de e-mail.
- Um alerta de resposta para quem organiza, se tiver ativado os alertas.
- O horário confirmado aos participantes que deixaram um endereço, só quando quem organiza clica para o enviar.
- Confirmações e cancelamentos de marcações, numa página de marcação.

Os e-mails são enviados em nosso nome através de um serviço de envio de e-mail.

## No seu dispositivo

Este dispositivo lembra o nome e o endereço de e-mail da sua última resposta, as suas definições de apresentação e, se organizar sondagens, a sua sessão. Os eventos que adiciona com **Add to calendar** são preparados no seu dispositivo. Escolher Google ou Outlook abre esse serviço com os dados do evento já preenchidos.

## O seu Universal ID

Quem organiza pode iniciar sessão com um Universal ID, a conta única partilhada pelas aplicações UNI·SIM, ou simplesmente confirmar um endereço de e-mail com um código de utilização única. Responder a uma sondagem nunca exige conta.`,
  },
]

export default articles
