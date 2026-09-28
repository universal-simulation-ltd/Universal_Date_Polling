import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'how-date-polls-work',
    title: 'Como funciona uma enquete de datas',
    summary: 'Proponha algumas opções, compartilhe um único link e deixe o melhor horário aparecer.',
    group: 'O básico',
    body: `Encontrar por e-mail uma data que sirva para um grupo costuma virar uma longa sequência de "Na terça eu posso, mas não de manhã". Uma enquete de datas troca essa sequência por uma única página que todos podem preencher.

## A ideia

1. Quem organiza propõe algumas datas ou horários possíveis.
2. Compartilha um único link com todas as pessoas que devem participar.
3. Cada pessoa abre o link, digita o nome e marca cada opção como **livre**, **se precisar** ou **não livre**.
4. Os resultados somam as respostas de cada opção, e os horários que servem para mais gente se destacam.
5. Quem organiza confirma o horário escolhido, e todos que abrirem o link passam a vê-lo.

Ninguém precisa de conta para responder. Só quem organiza precisa entrar ou confirmar o e-mail, então não dá para criar enquetes de forma anônima.

## Dois tipos de enquete

- Enquetes **por horário** são para reuniões e chamadas: cada opção tem um horário de início e uma duração.
- Enquetes **por dia inteiro** são para viagens, eventos e tudo em que só a data importa.

## Dicas para uma boa enquete

- Ofereça opções suficientes para haver uma escolha de verdade, mas não tantas que responder vire um peso. De quatro a oito costuma funcionar bem.
- Use "se precisar" com sinceridade. Isso mostra a quem organiza que um horário é possível, mas não ideal, e ajuda a desempatar.
- Dê à enquete um título claro. É a primeira coisa que as pessoas veem ao abrir o link.
- Se estiver consultando pessoas em países diferentes, confira o fuso horário antes de compartilhar (veja "Fusos horários, explicados").
- Quando você confirma um horário, o formulário de resposta se recolhe, para ninguém ficar em dúvida se ainda deve votar.`,
  },
  {
    id: 'time-zones-explained',
    title: 'Fusos horários, explicados',
    summary: 'Por que 15h não é o mesmo momento em todo lugar, e como o app mantém todos alinhados.',
    group: 'O básico',
    body: `Um horário sozinho, como "terça às 15h", só faz sentido quando se sabe onde são 15h. Os fusos horários são a forma como o mundo combina isso.

## Diferenças e nomes

Cada fuso horário está um certo número de horas à frente ou atrás de uma hora de referência comum chamada UTC (Tempo Universal Coordenado). Londres fica em UTC+0 no inverno, São Paulo em UTC−3 e Nova York em UTC−5. Assim, 15h em Londres são 12h em São Paulo e 10h em Nova York.

A diferença sozinha não basta, porque muitos lugares adotam horário de verão, e nem todos mudam no mesmo dia. Por isso os computadores usam fusos com nome, como America/Sao_Paulo ou America/New_York. Um fuso com nome carrega todo o histórico de mudanças de horário daquele lugar, então dá a diferença certa para qualquer data.

## Como este app lida com isso

- Cada enquete tem um único fuso horário. Ele começa como o de quem organiza, que pode trocá-lo por qualquer outro.
- As opções são escritas no horário local desse fuso. "10:00 de 3 de março, America/Sao_Paulo" é sempre o mesmo momento.
- A página da enquete informa em que fuso ela está. Se o seu dispositivo estiver em outro fuso, um botão mostra todos os horários no seu fuso, e você também pode escolher qualquer outro ou voltar ao da enquete.
- Mudar o fuso de exibição muda só a forma como os horários aparecem. Os momentos em si não mudam, então todos estão respondendo sobre os mesmos instantes.
- Opções de dia inteiro são apenas datas, então não são convertidas.
- Quando você adiciona um horário à sua agenda, o evento fica marcado no momento exato combinado, e a agenda o mostra no seu horário local.

## Uma armadilha comum

Se você criar uma enquete durante uma viagem, seu dispositivo pode estar no fuso do lugar onde você está. Confira o fuso da enquete antes de compartilhar, para que "9h" signifique 9h onde a reunião de fato vai acontecer.`,
  },
  {
    id: 'hosting-a-poll',
    title: 'Organizar uma enquete, do rascunho ao horário confirmado',
    summary: 'Criar, alterar, confirmar e encontrar suas enquetes de novo.',
    group: 'Como funciona',
    body: `## Criar uma enquete

1. Dê um título à enquete e escolha entre horários ou dias inteiros.
2. Adicione as opções. Se você conectou uma agenda, os horários em que já está ocupado aparecem sombreados, e **Suggest times** pode preencher a enquete com quatro opções do seu tempo livre: só em dias úteis, entre 10:00 e 16:00 no fuso da enquete, e no máximo uma de manhã e uma à tarde no mesmo dia.
3. Confirme seu e-mail com um código de uso único, ou entre com seu Universal ID.
4. Compartilhe o link.

## Mudar de ideia

Logo depois de criar uma enquete, você pode voltar e alterar os horários, desde que ninguém tenha respondido ainda. Enquanto você edita, quem abrir o link é avisado para voltar daqui a pouco, e as respostas são recusadas até você salvar. Se uma edição ficar aberta por dez minutos sem ser salva, ela expira sozinha e a enquete reabre.

## Confirmar um horário

Quando as respostas chegarem, escolha a opção vencedora com **Confirm this time**. Só quem organiza pode fazer isso. Todos que abrirem o link passam a ver um aviso "Confirmed" com o horário escolhido. Você pode mudar ou desfazer a escolha depois.

A partir desse aviso você pode:

- Enviar por e-mail o horário confirmado, com um convite de agenda anexado, para todos que deixaram um endereço. Isso só acontece quando você clica, nunca automaticamente.
- Usar **Copy email** para enviar a mensagem do seu próprio e-mail, com destinatários, assunto e texto prontos para copiar.
- Adicionar o horário à sua própria agenda.

## Adicionar à agenda

Cada resultado, e também o aviso de confirmação, tem um botão **Add to calendar** com Google Agenda, Outlook ou um arquivo de agenda para apps como o Calendário da Apple. O evento é montado no seu dispositivo.

## Encontrar suas enquetes de novo

Quando você está conectado como organizador, a página de criação lista suas enquetes ativas, com quantas pessoas responderam, o horário confirmado se houver e quando cada link expira. Você pode copiar um link, excluir uma enquete ou excluir de uma vez todas as enquetes expiradas.`,
  },
  {
    id: 'poll-options',
    title: 'Páginas de agendamento, validade, alertas e agendas',
    summary: 'Para que serve cada uma das opções em "This poll’s options".',
    group: 'Como funciona',
    body: `As opções da enquete que você está criando ficam no menu **Actions**, em **This poll's options**. Elas valem só para essa enquete.

## Página de agendamento ("Just the two of us")

Para um encontro a dois. Em vez de reunir a disponibilidade de todos, a pessoa para quem você envia o link escolhe um dos seus horários, informa nome e e-mail, e o horário é reservado na hora. Você não precisa confirmar nada, e os dois recebem um convite de agenda por e-mail. Se você conectou uma agenda que permita isso, o convite pode sair da sua própria agenda. Você pode cancelar um agendamento depois, e a outra pessoa é avisada.

## Validade do link

O link de uma enquete funciona por 7, 30, 90 ou 180 dias. De propósito, não existe a opção "nunca expira", porque esses links são compartilhados livremente. Depois que o link expira, a enquete fica somente leitura: ainda dá para vê-la, mas nenhuma resposta nova é aceita. 30 dias depois que o link expira, a enquete e as respostas dela são apagadas.

## Alertas de resposta

Marque esta opção para receber um e-mail sempre que uma pessoa nova responder. Quem altera uma resposta já dada não gera outro e-mail. Os alertas não aparecem em uma página de agendamento, porque cada agendamento já envia um e-mail para você.

## Sua agenda

Você pode conectar uma agenda do Google ou da Microsoft. O app passa a usá-la para sombrear os horários em que você já está ocupado enquanto monta uma enquete, e para sugerir horários livres. Dependendo do provedor e da permissão concedida, ele também pode mostrar os títulos dos eventos e adicionar um horário confirmado à sua agenda. Você pode desconectar a qualquer momento, e isso apaga a conexão salva.

## Fuso horário

Cada enquete tem um único fuso horário. Ele começa como o seu, e você pode escolher qualquer outro. Veja "Fusos horários, explicados".

## E também

Você pode adicionar um local, como um link de videochamada ou uma sala, e escolher uma cor para a página da enquete. Se você estiver conectado com uma organização, o logotipo dela pode aparecer na página, ou você pode adicionar o seu.`,
  },
  {
    id: 'who-can-see-what',
    title: 'Quem pode ver sua enquete e suas respostas',
    summary: 'O que qualquer pessoa com o link vê, o que só quem organiza vê e o que fica privado.',
    group: 'Privacidade e segurança',
    body: `Uma enquete de datas foi feita para ser compartilhada por link, então vale saber exatamente o que esse link mostra.

## Qualquer pessoa com o link pode ver

- O título, as opções, o fuso horário e o local da enquete, além da cor ou do logotipo que ela usar.
- O nome de cada participante e se marcou livre, se precisar ou não livre em cada opção.
- O horário confirmado, depois que quem organiza escolher.

Os links das enquetes têm dez caracteres aleatórios, o que os torna muito difíceis de adivinhar. Mas qualquer pessoa para quem você encaminhar o link pode ver tudo isso, então pense bem para quem envia.

## Só quem organiza pode ver

- Os e-mails que os participantes escolheram deixar. Eles servem para enviar o horário confirmado e preencher os convites de agenda, e nunca são mostrados aos outros participantes.

## Ninguém mais vê

- O e-mail de quem organiza. Ele fica guardado para enviar os alertas e os e-mails de agendamento, e não aparece na página da enquete.

## Seu nome é sua chave

As respostas são salvas com o nome que você digita. Se você responder de novo com exatamente o mesmo nome, a resposta anterior é atualizada em vez de duplicada. Isso também significa que outra pessoa usando exatamente o mesmo nome substituiria a sua, então use algo que identifique você, como seu nome completo.

Para poupar digitação, este dispositivo lembra o nome e o e-mail usados na sua última resposta. Esses dados ficam neste dispositivo.

## Deixar um e-mail é opcional

Você pode responder sem informar nenhum e-mail. Se deixar um, quem organiza poderá enviar o horário confirmado para você. Deixe o campo em branco se não quiser; responder de novo com o campo em branco remove o endereço informado antes.`,
  },
  {
    id: 'what-is-stored',
    title: 'O que fica guardado, e por quanto tempo',
    summary: 'Onde ficam os dados das enquetes, o que a validade faz e o que é enviado para quem.',
    group: 'Privacidade e segurança',
    body: `## Em nossos servidores

Uma enquete precisa ficar em algum lugar que todos consigam acessar, então enquetes e respostas ficam guardadas em nossos servidores. Isso inclui:

- A enquete em si: título, opções, fuso horário, configurações e o e-mail de quem organiza.
- Cada resposta: o nome informado, as escolhas feitas e quando foi salva.
- Os e-mails que os participantes escolheram deixar, e o nome e o e-mail de quem agenda em uma página de agendamento.
- Um logotipo enviado por quem organiza. Os logotipos ficam em um lugar onde qualquer pessoa com o link da enquete pode carregá-los, porque a página precisa exibi-los.
- Se quem organiza conectou uma agenda, as chaves de acesso dessa conexão. Elas ficam só no servidor, nunca são enviadas ao app e só são usadas para fazer o que quem organiza pediu. Desconectar apaga essas chaves.

Tudo trafega por conexões criptografadas e é protegido por regras de acesso. Não há criptografia de ponta a ponta, então nossos sistemas conseguem tecnicamente ler esses dados.

## Por quanto tempo

Quando o link de uma enquete expira, ela deixa de aceitar respostas e fica somente leitura. Ela não é apagada nesse momento, para que quem organiza ainda possa consultar as respostas. 30 dias depois que o link expira, a enquete é apagada automaticamente, junto com tudo o que está listado abaixo. Quem organiza pode excluí-la antes, e a lista de enquetes permite excluir de uma só vez todas as expiradas.

Excluir uma enquete exclui junto as respostas, os e-mails dos participantes e os dados de agenda ligados a ela. Cancelar um agendamento apaga o e-mail da outra pessoa, depois que o app tenta avisá-la.

## E-mails

O app só envia e-mails nestes casos:

- Um código de uso único, quando quem organiza confirma o e-mail.
- Um alerta de resposta para quem organiza, se os alertas estiverem ativados.
- O horário confirmado para os participantes que deixaram um endereço, só quando quem organiza clica para enviar.
- Confirmações e cancelamentos de agendamento, em uma página de agendamento.

Os e-mails são enviados em nosso nome por um serviço de envio de e-mails.

## No seu dispositivo

Este dispositivo lembra o nome e o e-mail da sua última resposta, suas configurações de exibição e, se você organiza enquetes, seu login. Os eventos que você adiciona com **Add to calendar** são montados no seu dispositivo. Escolher Google ou Outlook abre esse serviço com os dados do evento já preenchidos.

## Seu Universal ID

Quem organiza pode entrar com um Universal ID, a conta única compartilhada pelos apps da UNI·SIM, ou simplesmente confirmar um e-mail com um código de uso único. Responder a uma enquete nunca exige conta.`,
  },
]

export default articles
