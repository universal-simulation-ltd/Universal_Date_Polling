import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'how-date-polls-work',
    title: 'Cómo funciona una encuesta de fechas',
    summary: 'Proponga algunas opciones, comparta un solo enlace y deje que la mejor salga a la luz.',
    group: 'Lo básico',
    body: `Encontrar por correo una fecha que le venga bien a un grupo suele acabar en una larga cadena de «El martes puedo, pero no por la mañana». Una encuesta de fechas sustituye esa cadena por una sola página que todos pueden rellenar.

## La idea

1. El organizador propone varias fechas u horas posibles.
2. Comparte un único enlace con todas las personas que deben asistir.
3. Cada persona abre el enlace, escribe su nombre y marca cada opción como **disponible**, **si es necesario** o **no disponible**.
4. Los resultados suman las respuestas de cada opción, de modo que destacan las que mejor encajan con más personas.
5. El organizador confirma la opción ganadora y todo el que abra el enlace la ve.

Nadie necesita una cuenta para responder. Solo el organizador tiene que iniciar sesión o confirmar su correo electrónico, así que no se pueden crear encuestas de forma anónima.

## Dos tipos de encuesta

- Las encuestas **por horas** son para reuniones y llamadas: cada opción tiene una hora de inicio y una duración.
- Las encuestas **por días completos** son para viajes, eventos y todo aquello en lo que solo importa la fecha.

## Consejos para una buena encuesta

- Ofrezca suficientes opciones para que haya una elección real, pero no tantas que responder se haga pesado. Entre cuatro y ocho suele funcionar bien.
- Use «si es necesario» con sinceridad. Le indica al organizador que una hora es posible pero no ideal, lo que le ayuda a desempatar.
- Ponga a la encuesta un título claro. Es lo primero que se ve al abrir el enlace.
- Si pregunta a personas de distintos países, revise la zona horaria antes de compartir (consulte «Las zonas horarias, explicadas»).
- Cuando confirme una hora, el formulario de respuesta se pliega, para que nadie se quede dudando de si seguir votando.`,
  },
  {
    id: 'time-zones-explained',
    title: 'Las zonas horarias, explicadas',
    summary: 'Por qué las 15:00 no son el mismo momento en todas partes, y cómo lo gestiona la aplicación.',
    group: 'Lo básico',
    body: `Una hora por sí sola, como «el martes a las 15:00», solo tiene sentido si se sabe dónde son las 15:00. Las zonas horarias son la forma en que el mundo se pone de acuerdo sobre eso.

## Desfases y nombres

Cada zona horaria va un número de horas por delante o por detrás de una hora de referencia común llamada UTC (tiempo universal coordinado). Londres está en UTC+0 en invierno, Madrid en UTC+1 y Nueva York en UTC−5. Así, las 15:00 en Londres son las 16:00 en Madrid y las 10:00 en Nueva York.

El desfase por sí solo no basta, porque muchos lugares cambian la hora en verano, y no todos el mismo día. Por eso los ordenadores usan zonas con nombre, como Europe/Madrid o America/New_York. Una zona con nombre incluye todo el historial de cambios de hora de ese lugar, así que da el desfase correcto para cualquier fecha.

## Cómo lo gestiona esta aplicación

- Cada encuesta tiene una sola zona horaria. Empieza siendo la del organizador, que puede cambiarla por cualquier otra.
- Las opciones se escriben en la hora local de esa zona. «10:00 del 3 de marzo, Europe/Madrid» siempre es el mismo momento, aunque entre medias empiece el horario de verano.
- La página de la encuesta indica en qué zona está. Si su dispositivo está en otra zona, un botón le permite ver todas las horas en la suya, y también puede elegir cualquier otra zona o volver a la de la encuesta.
- Cambiar la zona en la que ve las horas solo cambia cómo se muestran. Los momentos en sí no se mueven, así que todos responden sobre los mismos instantes.
- Las opciones de día completo son solo fechas, así que no se convierten.
- Cuando añade una hora a su calendario, el evento queda en el momento exacto acordado, de modo que su calendario lo muestra en su hora local.

## Una trampa habitual

Si crea una encuesta mientras viaja, su dispositivo puede estar en la zona del lugar que visita. Revise la zona de la encuesta antes de compartirla, para que «las 9:00» sean las 9:00 donde de verdad se celebra la reunión.`,
  },
  {
    id: 'hosting-a-poll',
    title: 'Organizar una encuesta, del borrador a la hora confirmada',
    summary: 'Crear, modificar, confirmar y volver a encontrar sus encuestas.',
    group: 'Cómo funciona',
    body: `## Crear una encuesta

1. Ponga un título a la encuesta y elija entre horas o días completos.
2. Añada sus opciones. Si ha conectado un calendario, las horas en las que ya está ocupado aparecen sombreadas, y **Suggest times** puede rellenar la encuesta con cuatro opciones de su tiempo libre: solo días laborables, entre las 10:00 y las 16:00 en la zona horaria de la encuesta, y como mucho una por la mañana y otra por la tarde en un mismo día.
3. Confirme su correo electrónico con un código de un solo uso, o inicie sesión con su Universal ID.
4. Comparta el enlace.

## Cambiar de opinión

Justo después de crear una encuesta puede volver a cambiar las horas, siempre que nadie haya respondido todavía. Mientras edita, a quien abra el enlace se le pide que vuelva en un momento, y no se aceptan respuestas hasta que guarde. Si deja una edición abierta diez minutos sin guardar, caduca por sí sola y la encuesta se vuelve a abrir.

## Confirmar una hora

Cuando tenga las respuestas, elija la opción ganadora con **Confirm this time**. Solo el organizador puede hacerlo. Todo el que abra el enlace verá entonces un aviso «Confirmed» con la hora elegida. Puede cambiar o deshacer la elección más adelante.

Desde ese aviso puede:

- Enviar por correo la hora confirmada, con una invitación de calendario adjunta, a todos los que dejaron una dirección. Solo ocurre cuando usted hace clic, nunca de forma automática.
- Usar **Copy email** para enviar el mensaje desde su propio correo, con los destinatarios, el asunto y el texto listos para copiar.
- Añadir la hora a su propio calendario.

## Añadir a un calendario

Cada resultado, y también el aviso de confirmación, tiene un botón **Add to calendar** con Google Calendar, Outlook o un archivo de calendario para aplicaciones como Calendario de Apple. El evento se prepara en su dispositivo.

## Volver a encontrar sus encuestas

Cuando ha iniciado sesión como organizador, la página de creación muestra sus encuestas activas, con cuántas personas han respondido, la hora confirmada si la hay y cuándo caduca cada enlace. Puede copiar un enlace, eliminar una encuesta o eliminar de una vez todas sus encuestas caducadas.`,
  },
  {
    id: 'poll-options',
    title: 'Páginas de reserva, caducidad, avisos y calendarios',
    summary: 'Para qué sirve cada una de las opciones de «This poll’s options».',
    group: 'Cómo funciona',
    body: `Las opciones de la encuesta que está creando están en el menú **Actions**, en **This poll's options**. Solo se aplican a esa encuesta.

## Página de reserva («Just the two of us»)

Para una reunión a solas con una persona. En lugar de recoger la disponibilidad de todos, la persona a quien envía el enlace elige una de sus horas, introduce su nombre y su correo, y la cita queda reservada al momento. Usted no tiene que confirmar nada, y ambos reciben una invitación de calendario por correo. Si ha conectado un calendario que lo permita, la invitación puede salir de su propio calendario. Puede cancelar una reserva más tarde, y se avisa a la otra persona.

## Validez del enlace

El enlace de una encuesta funciona durante 7, 30, 90 o 180 días. No existe a propósito la opción «no caduca nunca», porque estos enlaces se comparten libremente. Cuando el enlace caduca, la encuesta pasa a ser de solo lectura: se puede seguir viendo, pero no se aceptan respuestas nuevas.

## Avisos de respuesta

Marque esta opción para recibir un correo cada vez que responda una persona nueva. Quien cambie una respuesta que ya había dado no genera otro correo. Los avisos no se ofrecen en una página de reserva, porque una reserva siempre le envía un correo de todos modos.

## Su calendario

Puede conectar un calendario de Google o de Microsoft. La aplicación lo usa entonces para sombrear las horas en las que ya está ocupado mientras prepara una encuesta, y para sugerir horas libres. Según el proveedor y el permiso que haya concedido, también puede mostrar los títulos de los eventos y añadir una hora confirmada a su calendario. Puede desconectarlo en cualquier momento, y al hacerlo se elimina la conexión guardada.

## Zona horaria

Cada encuesta tiene una sola zona horaria. Empieza siendo la suya y puede elegir cualquier otra. Consulte «Las zonas horarias, explicadas».

## Además

Puede añadir un lugar, como un enlace de videollamada o una sala, y elegir un color para la página de la encuesta. Si ha iniciado sesión con una organización, su logotipo puede aparecer en la página, o puede añadir el suyo.`,
  },
  {
    id: 'who-can-see-what',
    title: 'Quién puede ver su encuesta y sus respuestas',
    summary: 'Qué ve cualquiera con el enlace, qué solo ve el organizador y qué queda en privado.',
    group: 'Privacidad y seguridad',
    body: `Una encuesta de fechas está pensada para compartirse por enlace, así que conviene saber exactamente qué muestra ese enlace.

## Cualquiera con el enlace puede ver

- El título, las opciones, la zona horaria y el lugar de la encuesta, y el color o logotipo que use.
- El nombre de cada participante y si marcó disponible, si es necesario o no disponible en cada opción.
- La hora confirmada, cuando el organizador la haya elegido.

Los enlaces de las encuestas tienen diez caracteres aleatorios, lo que los hace muy difíciles de adivinar. Pero cualquiera a quien reenvíe el enlace puede ver todo lo anterior, así que piense a quién se lo envía.

## Solo el organizador puede ver

- Las direcciones de correo que los participantes decidieron dejar. Se usan para enviar la hora confirmada y rellenar las invitaciones de calendario, y nunca se muestran a los demás participantes.

## Nadie más ve

- La dirección de correo del organizador. Se guarda para enviarle sus avisos y los correos de reserva, y no aparece en la página de la encuesta.

## Su nombre es su clave

Las respuestas se guardan con el nombre que escribe. Si vuelve a responder con exactamente el mismo nombre, su respuesta anterior se actualiza en lugar de duplicarse. Eso también significa que otra persona que use exactamente el mismo nombre sobrescribiría la suya, así que use algo distintivo, como su nombre completo.

Para ahorrarle escribir, este dispositivo recuerda el nombre y el correo que usó la última vez que respondió. Esos datos se quedan en este dispositivo.

## Dejar un correo es opcional

Puede responder sin dar ninguna dirección de correo. Si deja una, el organizador podrá enviarle la hora confirmada. Deje el campo en blanco si no quiere; volver a responder con el campo en blanco elimina la dirección que dio antes.`,
  },
  {
    id: 'what-is-stored',
    title: 'Qué se guarda y durante cuánto tiempo',
    summary: 'Dónde están los datos de las encuestas, qué hace la caducidad y qué se envía a quién.',
    group: 'Privacidad y seguridad',
    body: `## En nuestros servidores

Una encuesta tiene que estar en algún sitio al que todos puedan acceder, así que las encuestas y las respuestas se guardan en nuestros servidores. Esto incluye:

- La encuesta en sí: título, opciones, zona horaria, ajustes y el correo del organizador.
- Cada respuesta: el nombre indicado, lo que se eligió y cuándo se guardó.
- Las direcciones de correo que los participantes decidieron dejar, y el nombre y el correo de quien reserva en una página de reserva.
- Un logotipo que haya subido el organizador. Los logotipos se guardan donde cualquiera con el enlace de la encuesta puede cargarlos, porque la página necesita mostrarlos.
- Si el organizador conectó un calendario, las claves de acceso de esa conexión. Se guardan solo en el servidor, nunca se envían a la aplicación y solo se usan para hacer lo que el organizador pidió. Al desconectar se eliminan.

Todo viaja por conexiones cifradas y está protegido por reglas de acceso. No está cifrado de extremo a extremo, así que nuestros sistemas pueden leerlo técnicamente.

## Durante cuánto tiempo

Cuando caduca el enlace de una encuesta, deja de aceptar respuestas y pasa a ser de solo lectura. No se elimina en ese momento: sigue ahí hasta que el organizador la elimina, y su lista de encuestas permite eliminar de una sola vez todas las caducadas.

Eliminar una encuesta elimina con ella sus respuestas, los correos de los participantes y los datos de calendario asociados. Cancelar una reserva elimina el correo de la otra persona, después de que la aplicación haya intentado avisarle.

## Correos

La aplicación solo envía correos en estos casos:

- Un código de un solo uso, cuando un organizador confirma su correo.
- Un aviso de respuesta al organizador, si activó los avisos.
- La hora confirmada a los participantes que dejaron una dirección, solo cuando el organizador hace clic para enviarla.
- Las confirmaciones y cancelaciones de reservas, en una página de reserva.

Los correos se envían a través de un servicio de envío de correo en nuestro nombre.

## En su dispositivo

Este dispositivo recuerda el nombre y el correo de su última respuesta, sus ajustes de visualización y, si organiza encuestas, su sesión. Los eventos que añade con **Add to calendar** se preparan en su dispositivo. Elegir Google u Outlook abre ese servicio con los datos del evento ya rellenados.

## Su Universal ID

Los organizadores pueden iniciar sesión con un Universal ID, la cuenta única que comparten las aplicaciones de UNI·SIM, o simplemente confirmar un correo con un código de un solo uso. Responder a una encuesta nunca requiere una cuenta.`,
  },
]

export default articles
