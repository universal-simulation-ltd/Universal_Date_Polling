import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'how-date-polls-work',
    title: 'How a date poll works',
    summary: 'Propose some times, share one link, and let the best time rise to the top.',
    group: 'The basics',
    body: `Finding a time that suits a group by email usually means a long chain of "I can do Tuesday, but not the morning". A date poll replaces that chain with one page everyone can fill in.

## The idea

1. The host proposes a handful of possible dates or times.
2. The host shares one link with everyone who should come.
3. Each person opens the link, types their name, and marks each option as **free**, **if need be** or **not free**.
4. The results add up the answers for every option, so the times that suit the most people stand out.
5. The host confirms the winning time, and everyone who opens the link sees it.

Nobody needs an account to answer. Only the host has to sign in or confirm their email address, so polls cannot be created anonymously.

## Two kinds of poll

- **Times** polls are for meetings and calls: each option has a start time and a length.
- **Whole-day** polls are for trips, events and anything where only the date matters.

## Tips for a good poll

- Offer enough options to give people a real choice, but not so many that answering becomes a chore. Four to eight usually works well.
- Use "if need be" honestly. It tells the host a time is possible but not ideal, which helps them break a tie.
- Give the poll a clear title. It is the first thing people see when they open the link.
- If you are asking people in different countries, check the time zone before you share (see "Time zones, explained").
- Once you confirm a time, the answer form folds away, so people are not left wondering whether to keep voting.`,
  },
  {
    id: 'time-zones-explained',
    title: 'Time zones, explained',
    summary: 'Why 3 pm is not the same moment everywhere, and how this app keeps everyone straight.',
    group: 'The basics',
    body: `A time on its own, such as "3 pm on Tuesday", only means something once you know where it is 3 pm. Time zones are how the world agrees on that.

## Offsets and names

Every time zone is some number of hours ahead of or behind a shared reference time called UTC (Coordinated Universal Time). London is UTC+0 in winter, Paris is UTC+1, and New York is UTC−5. So 3 pm in London is 4 pm in Paris and 10 am in New York.

Offsets alone are not enough, because many places move their clocks for daylight saving, and they do not all change on the same day. That is why computers use named zones such as Europe/London or America/New_York. A named zone carries the whole history of that place's clock changes, so it gives the right offset for any date.

## How this app handles it

- Every poll has one time zone. It starts as the host's own zone, and the host can change it to any other.
- The options are written in that zone's local time. "10:00 on 3 March in Europe/London" always means the same moment, even if daylight saving begins between now and then.
- The poll page says which zone the poll is in. If your device is in a different zone, a button lets you show every time in your own zone instead, and you can pick any other zone or switch back.
- Changing the zone you view in only changes how the times are displayed. The moments themselves never move, so everyone is answering about the same instants.
- Whole-day options are just dates, so they are not converted.
- When you add a time to your calendar, the entry is set at the exact moment agreed, so your calendar shows it in your own local time.

## A common trap

If you create a poll while travelling, your device may be set to the zone you are visiting. Check the poll's zone before you share it, so that "9 am" means 9 am where the meeting is actually happening.`,
  },
  {
    id: 'hosting-a-poll',
    title: 'Hosting a poll, from first draft to confirmed time',
    summary: 'Creating, editing, confirming and finding your polls again.',
    group: 'How it works',
    body: `## Creating a poll

1. Give the poll a title and choose times or whole days.
2. Add your options. If you have connected a calendar, times you are already busy are shaded, and **Suggest times** can fill the poll with four options from your free time: weekdays only, between 10:00 and 16:00 in the poll's time zone, and at most one morning and one afternoon on any day.
3. Confirm your email address with a one-time code, or sign in with your Universal ID.
4. Share the link.

## Changing your mind

Straight after creating a poll you can go back and change the times, as long as nobody has answered yet. While you edit, anyone who opens the link is asked to check back shortly, and answers are refused until you save. If you leave an edit open for ten minutes without saving, it lapses on its own and the poll reopens.

## Confirming a time

When the answers are in, pick the winning option with **Confirm this time**. Only the host can do this. Everyone who opens the link then sees a "Confirmed" banner with the chosen time. You can change or undo the choice later.

From the banner you can:

- Email everyone who left an address the confirmed time, with a calendar invitation attached. This only ever happens when you click it, never automatically.
- Use **Copy email** to send the message from your own mailbox instead, with the recipients, subject and text ready to copy.
- Add the time to your own calendar.

## Adding to a calendar

Every result, and the confirmed banner, has an **Add to calendar** button with Google Calendar, Outlook, or a calendar file for apps such as Apple Calendar. The calendar entry is put together on your device.

## Finding your polls again

When you are signed in as the host, the create page lists your active polls, with how many people have answered, the confirmed time if there is one, and when each link expires. You can copy a link, delete a poll, or delete all your expired polls in one go.`,
  },
  {
    id: 'poll-options',
    title: 'Booking pages, link expiry, alerts and calendars',
    summary: 'What each of "This poll\'s options" does.',
    group: 'How it works',
    body: `The options for the poll you are creating are in the **Actions** menu, under **This poll's options**. They apply only to that poll.

## Booking page ("Just the two of us")

For a one-to-one meeting. Instead of collecting everyone's availability, the person you send the link to picks one of your times, enters their name and email address, and the time is booked on the spot. There is nothing for you to confirm, and you both receive a calendar invitation by email. If you have connected a calendar that allows it, the invitation can come from your own calendar instead. You can cancel a booking later, and the guest is told.

## Link validity

A poll's link works for 7, 30, 90 or 180 days. There is deliberately no "never expires" option, because poll links are shared freely. Once the link expires, the poll becomes read-only: people can still see it, but no new answers are accepted.

## Response alerts

Tick this to be emailed each time a new person answers your poll. People who change an answer they have already given do not trigger another email. Alerts are not offered on a booking page, because a booking always emails you anyway.

## Your calendar

You can connect a Google or Microsoft calendar. The app then uses it to shade the times you are already busy while you build a poll, and to suggest free times. Depending on the provider and the permission you gave, it may also be able to show event titles and add a confirmed time to your calendar. You can disconnect at any time, and disconnecting removes the stored connection.

## Time zone

Every poll has one time zone. It starts as yours, and you can choose any other. See "Time zones, explained".

## Also available

You can add a location, such as a meeting link or a room, and choose a colour for the poll page. If you are signed in with an organisation, its logo can appear on the page, or you can add your own.`,
  },
  {
    id: 'who-can-see-what',
    title: 'Who can see your poll and your answers',
    summary: 'What anyone with the link sees, what only the host sees, and what stays private.',
    group: 'Privacy and security',
    body: `A date poll is designed to be shared by link, so it helps to know exactly what that link shows.

## Anyone with the link can see

- The poll's title, options, time zone and location, and any colour or logo it uses.
- Every respondent's name, and whether they said free, if need be or not free for each option.
- The confirmed time, once the host has chosen one.

Poll links are made of ten random characters, which makes them very hard to guess. But anyone you forward the link to can see all of the above, so think about who it goes to.

## Only the host can see

- Email addresses that respondents chose to leave. They are used to send the confirmed time and to fill in calendar invitations, and they are never shown to other respondents.

## Nobody else sees

- The host's own email address. It is kept for sending the host's alerts and booking emails, and is not shown on the poll page.

## Your name is your key

Answers are stored against the name you type. If you answer again with exactly the same name, your earlier answer is updated rather than added twice. That also means someone else using exactly the same name would overwrite yours, so use something distinctive, such as your full name.

To save typing, this device remembers the name and email address you last used to answer a poll. That stays on this device.

## Leaving an email address is optional

You can answer without giving an email address. If you leave one, the host can email you the confirmed time. Leave the box blank to opt out; answering again with it blank removes the address you gave before.`,
  },
  {
    id: 'what-is-stored',
    title: 'What is stored, and for how long',
    summary: 'Where poll data lives, what expiry does, and what is sent to whom.',
    group: 'Privacy and security',
    body: `## On our servers

A poll has to live somewhere everyone can reach it, so polls and answers are stored on our servers. That includes:

- The poll itself: its title, options, time zone, settings, and the host's email address.
- Each answer: the name given, the choices made, and when it was saved.
- Email addresses respondents chose to leave, and a booking guest's name and email address.
- A logo the host uploaded. Logos are stored where anyone with the poll link can load them, because the poll page needs to show them.
- If the host connected a calendar, the access keys for that connection. These are kept on the server only, are never sent to the app, and are used only to do what the host asked. Disconnecting deletes them.

Everything travels over encrypted connections and is protected by access rules. It is not end-to-end encrypted, so our systems can technically read it.

## How long

When a poll's link expires, it stops accepting answers and becomes read-only. It is not deleted at that moment. It stays until the host deletes it, and the host's list of polls has a single step to delete all expired polls.

Deleting a poll deletes its answers, respondents' email addresses and calendar details with it. Cancelling a booking deletes the guest's email address, after the app has tried to let them know.

## Emails

The app only sends email in these cases:

- A one-time code, when a host confirms their email address.
- A response alert to the host, if they switched alerts on.
- The confirmed time to respondents who left an address, only when the host clicks to send it.
- Booking confirmations and cancellations, on a booking page.

Emails are sent through an email delivery service on our behalf.

## On your device

This device remembers the name and email address you last answered with, your display settings, and, if you host, your sign-in. Calendar entries you add with **Add to calendar** are put together on your device. Choosing Google or Outlook opens that service with the event details filled in.

## Your Universal ID

Hosts can sign in with a Universal ID, the single account shared across UNI·SIM apps, or simply confirm an email address with a one-time code. Answering a poll never needs an account.`,
  },
]

export default articles
