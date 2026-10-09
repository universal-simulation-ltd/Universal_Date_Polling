import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'how-date-polls-work',
    title: 'Comment fonctionne un sondage de dates',
    summary: 'Proposez quelques créneaux, partagez un seul lien, et laissez le meilleur ressortir.',
    group: 'Les bases',
    body: `Trouver une date qui convient à un groupe par e-mail finit souvent en une longue suite de « Mardi, c’est possible, mais pas le matin ». Un sondage de dates remplace cet échange par une seule page que tout le monde peut remplir.

## Le principe

1. L’organisateur propose quelques dates ou horaires possibles.
2. Il partage un seul lien avec toutes les personnes concernées.
3. Chacun ouvre le lien, tape son nom et indique pour chaque option s’il est **disponible**, **disponible si nécessaire** ou **indisponible**.
4. Les résultats additionnent les réponses pour chaque option : les créneaux qui conviennent au plus grand nombre ressortent.
5. L’organisateur confirme le créneau retenu, et toute personne qui ouvre le lien le voit.

Personne n’a besoin de compte pour répondre. Seul l’organisateur doit se connecter ou confirmer son adresse e-mail, si bien qu’un sondage ne peut pas être créé de façon anonyme.

## Deux types de sondage

- Les sondages **par horaires** servent aux réunions et aux appels : chaque option a une heure de début et une durée.
- Les sondages **par journées** servent aux voyages, aux événements et à tout ce pour quoi seule la date compte.

## Conseils pour un bon sondage

- Proposez assez d’options pour laisser un vrai choix, mais pas au point de rendre la réponse fastidieuse. Quatre à huit options conviennent généralement.
- Utilisez « si nécessaire » honnêtement. Cela indique à l’organisateur qu’un créneau est possible mais pas idéal, ce qui l’aide à départager.
- Donnez au sondage un titre clair. C’est la première chose que l’on voit en ouvrant le lien.
- Si vous interrogez des personnes dans plusieurs pays, vérifiez le fuseau horaire avant de partager (voir « Les fuseaux horaires expliqués »).
- Une fois un créneau confirmé, le formulaire de réponse se replie : personne ne se demande s’il faut continuer à voter.`,
  },
  {
    id: 'time-zones-explained',
    title: 'Les fuseaux horaires expliqués',
    summary: 'Pourquoi 15 h n’est pas le même instant partout, et comment l’application s’y retrouve.',
    group: 'Les bases',
    body: `Une heure seule, comme « mardi à 15 h », n’a de sens que si l’on sait où il est 15 h. Les fuseaux horaires sont la manière dont le monde s’accorde là-dessus.

## Décalages et noms

Chaque fuseau horaire a un certain nombre d’heures d’avance ou de retard sur une heure de référence commune appelée UTC (temps universel coordonné). Londres est à UTC+0 en hiver, Paris à UTC+1 et New York à UTC−5. Ainsi, 15 h à Londres correspond à 16 h à Paris et à 10 h à New York.

Le décalage seul ne suffit pas, car beaucoup de pays passent à l’heure d’été, et pas tous le même jour. C’est pourquoi les ordinateurs utilisent des fuseaux nommés, comme Europe/Paris ou America/New_York. Un fuseau nommé contient tout l’historique des changements d’heure du lieu, et donne donc le bon décalage pour n’importe quelle date.

## Comment l’application s’y prend

- Chaque sondage a un seul fuseau horaire. Au départ, c’est celui de l’organisateur, qui peut en choisir un autre.
- Les options sont écrites dans l’heure locale de ce fuseau. « 10:00 le 3 mars, Europe/Paris » désigne toujours le même instant, même si l’heure d’été commence d’ici là.
- La page du sondage indique son fuseau. Si votre appareil est dans un autre fuseau, un bouton vous permet d’afficher toutes les heures dans le vôtre ; vous pouvez aussi choisir n’importe quel autre fuseau, ou revenir à celui du sondage.
- Changer le fuseau d’affichage ne change que la présentation. Les instants eux-mêmes ne bougent pas : tout le monde répond sur les mêmes moments.
- Les options par journées ne sont que des dates : elles ne sont pas converties.
- Quand vous ajoutez un créneau à votre agenda, l’événement est placé au moment exact convenu : votre agenda l’affiche donc dans votre heure locale.

## Un piège fréquent

Si vous créez un sondage en voyage, votre appareil est peut-être réglé sur le fuseau du lieu où vous êtes. Vérifiez le fuseau du sondage avant de le partager, pour que « 9 h » désigne bien 9 h là où la réunion a lieu.`,
  },
  {
    id: 'hosting-a-poll',
    title: 'Organiser un sondage, du brouillon au créneau confirmé',
    summary: 'Créer, modifier, confirmer et retrouver vos sondages.',
    group: 'Comment ça marche',
    body: `## Créer un sondage

1. Donnez un titre au sondage et choisissez entre horaires et journées entières.
2. Ajoutez vos options. Si vous avez connecté un agenda, les moments où vous êtes déjà occupé sont grisés, et **Suggest times** peut remplir le sondage avec quatre options prises dans votre temps libre : en semaine uniquement, entre 10:00 et 16:00 dans le fuseau du sondage, et au plus un créneau le matin et un l’après-midi par jour.
3. Confirmez votre adresse e-mail avec un code à usage unique, ou connectez-vous avec votre Universal ID.
4. Partagez le lien.

## Changer d’avis

Juste après avoir créé un sondage, vous pouvez revenir modifier les créneaux tant que personne n’a répondu. Pendant la modification, toute personne qui ouvre le lien est invitée à revenir un peu plus tard, et les réponses sont refusées jusqu’à l’enregistrement. Si vous laissez une modification ouverte dix minutes sans enregistrer, elle expire d’elle-même et le sondage rouvre.

## Confirmer un créneau

Une fois les réponses reçues, choisissez l’option retenue avec **Confirm this time**. Seul l’organisateur peut le faire. Toute personne qui ouvre le lien voit alors une bannière « Confirmed » avec le créneau choisi. Vous pouvez modifier ou annuler ce choix plus tard.

Depuis la bannière, vous pouvez :

- Envoyer par e-mail le créneau confirmé, avec une invitation d’agenda en pièce jointe, à toutes les personnes qui ont laissé une adresse. Cela ne se produit que si vous cliquez, jamais automatiquement.
- Utiliser **Copy email** pour envoyer le message depuis votre propre messagerie, avec les destinataires, l’objet et le texte prêts à copier.
- Ajouter le créneau à votre propre agenda.

## Ajouter à un agenda

Chaque résultat, ainsi que la bannière de confirmation, propose un bouton **Add to calendar** : Google Agenda, Outlook, ou un fichier d’agenda pour des applications comme Calendrier d’Apple. L’événement est préparé sur votre appareil.

## Retrouver vos sondages

Lorsque vous êtes connecté en tant qu’organisateur, la page de création liste vos sondages actifs, avec le nombre de réponses, le créneau confirmé s’il y en a un, et la date d’expiration de chaque lien. Vous pouvez copier un lien, supprimer un sondage, ou supprimer d’un coup tous vos sondages expirés.`,
  },
  {
    id: 'poll-options',
    title: 'Pages de réservation, expiration, alertes et agendas',
    summary: 'À quoi sert chacune des options « This poll’s options ».',
    group: 'Comment ça marche',
    body: `Les options du sondage que vous créez se trouvent dans votre menu de profil, sous **Tune this app** → **This poll's options**. Elles ne s’appliquent qu’à ce sondage.

## Page de réservation (« Just the two of us »)

Pour un rendez-vous en tête-à-tête. Au lieu de recueillir les disponibilités de chacun, la personne à qui vous envoyez le lien choisit l’un de vos créneaux, saisit son nom et son adresse e-mail, et le rendez-vous est réservé immédiatement. Vous n’avez rien à confirmer, et vous recevez tous les deux une invitation d’agenda par e-mail. Si vous avez connecté un agenda qui le permet, l’invitation peut venir de votre propre agenda. Vous pouvez annuler une réservation plus tard, et la personne en est informée.

## Validité du lien

Le lien d’un sondage fonctionne pendant 7, 30, 90 ou 180 jours. Il n’existe volontairement pas d’option « n’expire jamais », car ces liens circulent librement. Une fois le lien expiré, le sondage passe en lecture seule : on peut encore le consulter, mais aucune nouvelle réponse n’est acceptée. 30 jours après l’expiration du lien, le sondage et ses réponses sont supprimés.

## Alertes de réponse

Cochez cette option pour recevoir un e-mail chaque fois qu’une nouvelle personne répond. Une personne qui modifie une réponse déjà donnée ne déclenche pas de nouvel e-mail. Les alertes ne sont pas proposées pour une page de réservation, qui vous envoie de toute façon un e-mail à chaque réservation.

## Votre agenda

Vous pouvez connecter un agenda Google ou Microsoft. L’application l’utilise alors pour griser les moments où vous êtes déjà occupé pendant que vous préparez un sondage, et pour suggérer des créneaux libres. Selon le fournisseur et l’autorisation accordée, elle peut aussi afficher le titre des événements et ajouter un créneau confirmé à votre agenda. Vous pouvez vous déconnecter à tout moment, ce qui supprime la connexion enregistrée.

## Fuseau horaire

Chaque sondage a un seul fuseau horaire. Au départ c’est le vôtre, et vous pouvez en choisir un autre. Voir « Les fuseaux horaires expliqués ».

## Et aussi

Vous pouvez ajouter un lieu, comme un lien de visioconférence ou une salle, et choisir une couleur pour la page du sondage. Si vous êtes connecté avec une organisation, son logo peut apparaître sur la page, ou vous pouvez ajouter le vôtre.`,
  },
  {
    id: 'who-can-see-what',
    title: 'Qui peut voir votre sondage et vos réponses',
    summary: 'Ce que voit toute personne ayant le lien, ce que seul l’organisateur voit, et ce qui reste privé.',
    group: 'Confidentialité et sécurité',
    body: `Un sondage de dates est fait pour être partagé par lien. Il est donc utile de savoir exactement ce que ce lien montre.

## Toute personne ayant le lien peut voir

- Le titre, les options, le fuseau horaire et le lieu du sondage, ainsi que sa couleur ou son logo éventuels.
- Le nom de chaque participant, et sa réponse (disponible, si nécessaire ou indisponible) pour chaque option.
- Le créneau confirmé, une fois que l’organisateur l’a choisi.

Les liens de sondage sont composés de dix caractères aléatoires, ce qui les rend très difficiles à deviner. Mais toute personne à qui vous transférez le lien peut voir tout ce qui précède : réfléchissez à qui vous l’envoyez.

## Seul l’organisateur peut voir

- Les adresses e-mail que les participants ont choisi de laisser. Elles servent à envoyer le créneau confirmé et à remplir les invitations d’agenda, et ne sont jamais montrées aux autres participants.

## Personne d’autre ne voit

- L’adresse e-mail de l’organisateur. Elle sert à lui envoyer ses alertes et les e-mails de réservation, et n’apparaît pas sur la page du sondage.

## Votre nom sert de clé

Les réponses sont enregistrées sous le nom que vous tapez. Si vous répondez à nouveau avec exactement le même nom, votre réponse précédente est mise à jour au lieu d’être ajoutée une seconde fois. Cela signifie aussi qu’une autre personne utilisant exactement le même nom remplacerait votre réponse : choisissez un nom distinctif, par exemple votre nom complet.

Pour vous éviter de retaper, cet appareil retient le nom et l’adresse e-mail utilisés lors de votre dernière réponse. Ces informations restent sur cet appareil.

## Laisser une adresse e-mail est facultatif

Vous pouvez répondre sans donner d’adresse e-mail. Si vous en laissez une, l’organisateur peut vous envoyer le créneau confirmé. Laissez le champ vide pour refuser ; répondre à nouveau avec le champ vide supprime l’adresse donnée auparavant.`,
  },
  {
    id: 'what-is-stored',
    title: 'Ce qui est conservé, et pendant combien de temps',
    summary: 'Où vivent les données des sondages, ce que fait l’expiration, et ce qui est envoyé à qui.',
    group: 'Confidentialité et sécurité',
    body: `## Sur nos serveurs

Un sondage doit être accessible à tous : les sondages et les réponses sont donc conservés sur nos serveurs. Cela comprend :

- Le sondage lui-même : titre, options, fuseau horaire, réglages et adresse e-mail de l’organisateur.
- Chaque réponse : le nom indiqué, les choix faits et la date d’enregistrement.
- Les adresses e-mail que les participants ont choisi de laisser, ainsi que le nom et l’adresse e-mail de la personne qui réserve sur une page de réservation.
- Un logo envoyé par l’organisateur. Les logos sont stockés à un endroit où toute personne ayant le lien du sondage peut les charger, car la page doit pouvoir les afficher.
- Si l’organisateur a connecté un agenda, les clés d’accès de cette connexion. Elles restent uniquement sur le serveur, ne sont jamais envoyées à l’application, et ne servent qu’à faire ce que l’organisateur a demandé. La déconnexion les supprime.

Tout circule par des connexions chiffrées et est protégé par des règles d’accès. Ce n’est pas chiffré de bout en bout : nos systèmes peuvent techniquement lire ces données.

## Pendant combien de temps

Quand le lien d’un sondage expire, le sondage n’accepte plus de réponses et passe en lecture seule. Il n’est pas supprimé à ce moment-là, afin que l’organisateur puisse encore consulter les réponses. 30 jours après l’expiration du lien, le sondage est supprimé automatiquement, avec tout ce qui est énuméré ci-dessous. L’organisateur peut le supprimer plus tôt, et sa liste de sondages permet de supprimer en une seule étape tous les sondages expirés.

Supprimer un sondage supprime avec lui ses réponses, les adresses e-mail des participants et les informations d’agenda associées. Annuler une réservation supprime l’adresse e-mail de la personne, après que l’application a tenté de la prévenir.

## E-mails

L’application n’envoie d’e-mails que dans ces cas :

- Un code à usage unique, lorsqu’un organisateur confirme son adresse e-mail.
- Une alerte de réponse à l’organisateur, s’il a activé les alertes.
- Le créneau confirmé aux participants qui ont laissé une adresse, uniquement lorsque l’organisateur clique pour l’envoyer.
- Les confirmations et annulations de réservation, sur une page de réservation.

Les e-mails sont envoyés en notre nom par un service d’envoi d’e-mails.

## Sur votre appareil

Cet appareil retient le nom et l’adresse e-mail de votre dernière réponse, vos réglages d’affichage et, si vous organisez, votre connexion. Les événements ajoutés avec **Add to calendar** sont préparés sur votre appareil. Choisir Google ou Outlook ouvre ce service avec les détails de l’événement déjà remplis.

## Votre Universal ID

Les organisateurs peuvent se connecter avec un Universal ID, le compte unique partagé par les applications UNI·SIM, ou simplement confirmer une adresse e-mail avec un code à usage unique. Répondre à un sondage ne demande jamais de compte.`,
  },
]

export default articles
