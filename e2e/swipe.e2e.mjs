// "Your polls" in the PHONE app (`?app` in the dev server): swipe left to
// delete with Undo, swipe right or hold to select, the suite's phone rules
// (Docs_UNI_SIM/BRANDING.md ▸ "A deletable row swipes"), built with the
// @unisim/sdk phone kit. A 390px phone with touch; every gesture is a real
// touch (CDP Input.dispatchTouchEvent).
//
// What it has to get right: a short swipe or a vertical drag opens nothing
// (the controls); a swipe left uncovers Delete, and a tap on it takes the row
// away at once but sends NO delete until the Undo has had its six seconds;
// Undo brings the row back and never deletes; a swipe right ticks the row into
// the selection bar; a hold ticks it too, and a finger that moves first does
// not; while ticked, a tap on a row ticks it instead of opening the poll; the
// left-edge swipe leaves selection mode.
//
//   node e2e/swipe.e2e.mjs

import { checker, fakeJwt, freePort, launch, startDevServer } from './harness.mjs'

const { check, finish } = checker()

const USER_ID = 'host-uid'
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

async function seed(page) {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const session = {
    access_token: fakeJwt(USER_ID, exp), refresh_token: 'fake-refresh', token_type: 'bearer',
    expires_in: 3600, expires_at: exp,
    user: { id: USER_ID, email: 'host@example.com', aud: 'authenticated', role: 'authenticated', is_anonymous: false },
  }
  await page.addInitScript((s) => {
    localStorage.setItem('unipoll-auth', s)
    localStorage.setItem('universal-suite-auth', s)
  }, JSON.stringify(session))
}

async function stub(page, state) {
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
    const ids = (new URL(route.request().url()).searchParams.get('id') ?? '')
      .replace(/^in\.\(/, '').replace(/\)$/, '').split(',').map((s) => s.replace(/^"|"$/g, '')).filter(Boolean)
    state.deletes.push(ids)
    state.polls = state.polls.filter((p) => !ids.includes(p.id))
    return route.fulfill(json(ids.map((id) => ({ id }))))
  })
}

const touch = (cdp, type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] })
async function drag(page, cdp, { x, y, dx = 0, dy = 0, steps = 12, hold = 0, settle = 400 }) {
  await touch(cdp, 'touchStart', x, y)
  if (hold) await page.waitForTimeout(hold)
  for (let i = 1; i <= steps; i++) {
    await touch(cdp, 'touchMove', x + (dx * i) / steps, y + (dy * i) / steps)
    await page.waitForTimeout(16)
  }
  await touch(cdp, 'touchEnd')
  await page.waitForTimeout(settle)
}
async function hold(page, cdp, x, y, ms = 700) {
  await touch(cdp, 'touchStart', x, y)
  await page.waitForTimeout(ms)
  // Chromium's touch emulation makes the lifting finger's click, as a phone
  // does; the hold must eat it (it would untick the row it just ticked).
  await touch(cdp, 'touchEnd')
  await page.waitForTimeout(300)
}
/** The middle of a row's title, and its swipe state. */
const rowOf = (page, title) => page.evaluate((t) => {
  const link = [...document.querySelectorAll('a')].find((a) => a.textContent === t)
  if (!link) return null
  const row = link.closest('.unisim-swipe')
  const r = (row ?? link).getBoundingClientRect()
  return {
    x: r.left + r.width / 2, y: r.top + r.height / 2, left: r.left, right: r.right,
    open: row?.getAttribute('data-swipe-open') ?? null,
    buttons: row ? [...row.querySelectorAll('.unisim-swipe-action button')].map((b) => b.textContent.trim()) : [],
  }
}, title)

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
const BASE = `http://localhost:${port}/?app`
const SHOTS = process.env.SHOTS

try {
  const state = {
    polls: [poll('p1', 'Team lunch', { response_count: 2 }), poll('p2', 'Book club'), poll('p3', 'Quiz night')],
    deletes: [],
  }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log(`  (page error: ${e.message})`))
  await seed(page)
  await stub(page, state)
  const cdp = await ctx.newCDPSession(page)
  await page.goto(BASE)
  // Three live polls start folded away under their heading.
  await page.getByRole('button', { name: /Your active polls/ }).click({ timeout: 20000 })
  await page.getByText('Team lunch').first().waitFor({ timeout: 5000 })
  await page.waitForTimeout(300)

  console.log('The phone app draws each poll in a swipe row')
  let r = await rowOf(page, 'Team lunch')
  check('the row is a swipe row', r && r.open === null && r.buttons.length === 0, JSON.stringify(r))

  console.log('Controls: a short swipe and a vertical drag open nothing')
  await drag(page, cdp, { x: r.x, y: r.y, dx: -25 })
  r = await rowOf(page, 'Team lunch')
  check('a short swipe settles back shut', r.open === null, JSON.stringify(r))
  await drag(page, cdp, { x: r.x, y: r.y, dx: -10, dy: 70 })
  r = await rowOf(page, 'Team lunch')
  check('a vertical drag never opens it', r.open === null, JSON.stringify(r))

  console.log('Swipe left: Delete, with Undo')
  r = await rowOf(page, 'Book club')
  await drag(page, cdp, { x: r.x, y: r.y, dx: -150 })
  r = await rowOf(page, 'Book club')
  check('a swipe left uncovers Delete', r.open === 'right' && r.buttons.includes('Delete'), JSON.stringify(r))
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/dp-swipe-delete.png` })
  await page.getByRole('button', { name: 'Delete Book club' }).click()
  await page.waitForTimeout(300)
  check('the row leaves the list at once', (await rowOf(page, 'Book club')) === null)
  check('the Undo toast says what went', (await page.getByRole('status').filter({ hasText: 'Deleted “Book club”.' }).count()) === 1)
  check('nothing is sent while Undo is offered', state.deletes.length === 0, JSON.stringify(state.deletes))
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/dp-undo.png` })
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.waitForTimeout(300)
  check('Undo brings the row back', (await rowOf(page, 'Book club')) !== null)
  check('Undo deletes nothing', state.deletes.length === 0)

  r = await rowOf(page, 'Book club')
  await drag(page, cdp, { x: r.x, y: r.y, dx: -150 })
  // A second swipe the same way runs it.
  r = await rowOf(page, 'Book club')
  await drag(page, cdp, { x: r.x, y: r.y, dx: -150 })
  check('a second swipe left deletes too', (await rowOf(page, 'Book club')) === null)
  await page.waitForTimeout(6500)
  check('after six seconds ONE delete goes, for that poll only',
    state.deletes.length === 1 && state.deletes[0].join(',') === 'p2', JSON.stringify(state.deletes))
  check('the toast has gone', (await page.getByText('Deleted “Book club”.').count()) === 0)

  console.log('Swipe right: Select')
  r = await rowOf(page, 'Team lunch')
  await drag(page, cdp, { x: r.x, y: r.y, dx: 150 })
  r = await rowOf(page, 'Team lunch')
  check('a swipe right uncovers Select', r.open === 'left' && r.buttons.includes('Select'), JSON.stringify(r))
  await page.getByRole('button', { name: 'Select Team lunch' }).click()
  await page.waitForTimeout(300)
  check('the selection bar counts it', (await page.getByText('1 selected').count()) === 1)
  check('the row is ticked', await page.getByRole('checkbox', { name: 'Select Team lunch' }).first().isChecked())

  console.log('While ticked, a tap ticks instead of opening')
  const before = page.url()
  r = await rowOf(page, 'Quiz night')
  await page.touchscreen.tap(r.x, r.y)
  await page.waitForTimeout(300)
  check('the tap ticked Quiz night', (await page.getByText('2 selected').count()) === 1)
  check('and opened nothing', page.url() === before, page.url())
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/dp-selecting.png` })

  console.log('A swipe in from the left edge leaves selection mode')
  await drag(page, cdp, { x: 6, y: 420, dx: 140, settle: 400 })
  check('nothing is ticked any more', (await page.getByText(/\d selected/).count()) === 0)

  console.log('Hold selects; a finger that moves first does not')
  r = await rowOf(page, 'Quiz night')
  await drag(page, cdp, { x: r.x, y: r.y, dy: 40, hold: 100 })
  await page.waitForTimeout(500)
  check('CONTROL: moving before the hold time selects nothing', (await page.getByText(/\d selected/).count()) === 0)
  r = await rowOf(page, 'Quiz night')
  await hold(page, cdp, r.x, r.y)
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/dp-hold.png` })
  check('a hold ticks the row', (await page.getByText('1 selected').count()) === 1)
  check('the lifting finger opened nothing', page.url() === before, page.url())
  check('no delete was sent by any of it', state.deletes.length === 1)

  await ctx.close()
} finally {
  await browser.close()
  server.kill()
}
finish()
