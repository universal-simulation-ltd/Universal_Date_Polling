// "Your polls": tick boxes, Select all, then Delete selected / Clear — the
// suite's select-several bar (@unisim/sdk SelectionBar), driven in a real
// browser.
//
// What it has to get right: the boxes start unticked, Select all covers only
// the rows on screen (expired ones only while they are shown), the confirm
// counts the polls AND their responses and says they go for everyone, Cancel
// deletes nothing, and OK sends ONE delete for exactly the ticked ids, after
// which those rows are gone.
//
// Backend stubbed at the network boundary, as in the other suites; the host is
// a seeded Universal ID session.
//
//   node e2e/selection.e2e.mjs

import { checker, fakeJwt, freePort, launch, startDevServer } from './harness.mjs'

const { check, finish } = checker()

const USER_ID = 'suite-uid'
const json = (body, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(body) })

const DAY = 86400_000
const poll = (id, title, over = {}) => ({
  id, title, host_user_id: USER_ID, timezone: 'Europe/London', mode: 'times',
  slots: [{ id: 's1', start: '2026-12-01T12:00', durationMins: 60 }], theme: 'orange', branding: null,
  location: null, booking_mode: false, final_slot_id: null, final_notified_slot_id: null,
  booking_notify_failed: null, notify_on_response: false, editing_since: null,
  created_at: '2026-10-01T09:00:00Z', expires_at: new Date(Date.now() + 7 * DAY).toISOString(),
  response_count: 0, ...over,
})

async function seedSuiteSession(page) {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const session = {
    access_token: fakeJwt(USER_ID, exp), refresh_token: 'fake-refresh', token_type: 'bearer',
    expires_in: 3600, expires_at: exp,
    user: { id: USER_ID, email: 'host@example.com', aud: 'authenticated', role: 'authenticated', is_anonymous: false },
  }
  await page.addInitScript((s) => { localStorage.setItem('universal-suite-auth', s) }, JSON.stringify(session))
}

async function stubBackend(page, state) {
  // Reverse registration order — catch-alls first (see booking.e2e.mjs).
  await page.route('**/rest/v1/**', (route) => route.fulfill(json([])))
  await page.route('**/functions/v1/**', (route) => route.fulfill(json({ ok: true })))
  await page.route('**/auth/v1/**', (route) => route.fulfill(json({ message: 'no session' }, 401)))
  await page.route('**/functions/v1/calendar-oauth', (route) => route.fulfill(json({}, 500)))
  await page.route('**/auth/v1/user', (route) => route.fulfill(json({
    id: USER_ID, email: 'host@example.com', aud: 'authenticated', role: 'authenticated', is_anonymous: false,
  })))
  await page.route('**/rest/v1/rpc/list_my_polls', (route) => route.fulfill(json(state.polls)))
  await page.route('**/rest/v1/polls*', (route) => {
    if (route.request().method() !== 'DELETE') return route.fulfill(json([]))
    // `?id=in.(a,b)` — answer with the ids asked for, as RLS would for the owner.
    const ids = (new URL(route.request().url()).searchParams.get('id') ?? '')
      .replace(/^in\.\(/, '').replace(/\)$/, '').split(',').map((s) => s.replace(/^"|"$/g, '')).filter(Boolean)
    state.deletes.push(ids)
    state.polls = state.polls.filter((p) => !ids.includes(p.id))
    return route.fulfill(json(ids.map((id) => ({ id }))))
  })
}

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
// `localhost`, not 127.0.0.1: Vite binds the hostname (see booking.e2e.mjs).
const BASE = `http://localhost:${port}/`

try {
  const state = {
    polls: [
      poll('p1', 'Team lunch', { response_count: 2 }),
      poll('p2', 'Book club'),
      poll('p3', 'Old offsite', { expires_at: new Date(Date.now() - 2 * DAY).toISOString(), response_count: 1 }),
    ],
    deletes: [],
  }
  const page = await browser.newPage()
  page.on('pageerror', (e) => console.log(`  (page error: ${e.message})`))
  await seedSuiteSession(page)
  await stubBackend(page, state)
  await page.goto(BASE)
  await page.getByText('Team lunch').first().waitFor({ timeout: 20000 })

  const box = (title) => page.getByRole('checkbox', { name: `Select ${title}` })
  const all = page.getByRole('checkbox', { name: 'Select all' })
  const delSelected = page.getByRole('button', { name: 'Delete selected' })
  const clear = page.getByRole('button', { name: 'Clear' })

  console.log('Starts quiet: boxes unticked, only Select all')
  check('a box per live row', (await box('Team lunch').count()) === 1 && (await box('Book club').count()) === 1)
  check('no box for a hidden expired row', (await box('Old offsite').count()) === 0)
  check('boxes start unticked', !(await box('Team lunch').isChecked()) && !(await box('Book club').isChecked()))
  check('Select all is there', (await all.count()) === 1)
  check('no Delete selected yet', (await delSelected.count()) === 0)

  console.log('Tick one, then Select all, then Clear')
  await box('Book club').check()
  check('count shows 1 selected', (await page.getByText('1 selected').count()) === 1)
  check('Delete selected appears', (await delSelected.count()) === 1)
  await all.check()
  check('Select all ticks both live rows', (await box('Team lunch').isChecked()) && (await box('Book club').isChecked()))
  check('count shows 2 selected', (await page.getByText('2 selected').count()) === 1)
  await clear.click()
  check('Clear unticks everything', !(await box('Team lunch').isChecked()) && !(await box('Book club').isChecked()))
  check('Delete selected gone again', (await delSelected.count()) === 0)

  console.log('Expired rows join once shown')
  await page.getByRole('button', { name: /Show 1 expired/ }).click()
  check('the expired row gets a box', (await box('Old offsite').count()) === 1)
  await page.getByRole('checkbox', { name: /Select all|selected/ }).first().check()
  check('Select all now covers 3', (await page.getByText('3 selected').count()) === 1)

  console.log('Delete selected: Cancel deletes nothing')
  let message = ''
  page.once('dialog', (d) => { message = d.message(); void d.dismiss() })
  await delSelected.click()
  await page.waitForTimeout(400)
  check('the question counts polls and responses, for everyone',
    message.startsWith('Delete these 3 polls and their 3 responses for everyone?'), message)
  check('nothing sent on Cancel', state.deletes.length === 0)
  check('selection kept on Cancel', (await page.getByText('3 selected').count()) === 1)

  console.log('Untick one, then OK deletes exactly the ticked rows')
  await box('Book club').uncheck()
  page.once('dialog', (d) => { message = d.message(); void d.accept() })
  await delSelected.click()
  await page.waitForTimeout(1000)
  check('one delete, for the two ticked ids',
    state.deletes.length === 1 && [...state.deletes[0]].sort().join(',') === 'p1,p3', JSON.stringify(state.deletes))
  check('the deleted rows are gone', (await page.getByText('Team lunch').count()) === 0 && (await page.getByText('Old offsite').count()) === 0)
  check('the unticked row stays', (await page.getByText('Book club').count()) > 0)
  check('selection cleared after the delete', (await delSelected.count()) === 0)
  await page.close()
} finally {
  await browser.close()
  server.kill()
}
finish()
