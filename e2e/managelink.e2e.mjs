// "Email me a link to manage this poll" — driven in a real browser against a
// stubbed backend.
//
// What it pins down:
//   1. A visitor who is not the host can ask for a link: the page sends the
//      poll id, the typed address, the language and the app's base to
//      poll-manage-link, and then says the same neutral thing it always says.
//   2. A bad address is caught on the page and nothing is sent; a 429 says
//      "wait an hour".
//   3. Opening /p/<id>#manage=<token> takes the token out of the address bar,
//      redeems it once (verifyOtp, token_hash, magiclink) and shows the host view.
//   4. A spent or expired link leaves a guest, says so, and opens the form.
//   5. An admin link that didn't work points at the form, already open.
//
//   node e2e/managelink.e2e.mjs

import { checker, fakeJwt, freePort, launch, startDevServer } from './harness.mjs'

const { check, finish } = checker()

const HOST_ID = 'host-uid'
const HOST_EMAIL = 'host@example.com'
const GOOD = 'a1'.repeat(28)
const SPENT = 'b2'.repeat(28)
const SLOT = { id: 'slot-a', start: '2026-06-10T14:00', durationMins: 60 }

function poll(overrides = {}) {
  return {
    id: 'mng1234567', title: 'Team dinner', host_user_id: HOST_ID, timezone: 'Europe/London',
    mode: 'times', slots: [SLOT], theme: 'orange', branding: null, location: null, booking_mode: false,
    final_slot_id: null, final_notified_slot_id: null, booking_notify_failed: null, notify_on_response: false,
    editing_since: null, created_at: '2026-06-01T09:00:00Z', expires_at: null, ...overrides,
  }
}

const json = (route, status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

async function stubBackend(page, { asks = [], verifies = [], manageStatus = 200 } = {}) {
  let signedIn = false
  await page.route('**/rest/v1/**', (route) => json(route, 200, []))
  await page.route('**/functions/v1/**', (route) => json(route, 200, { ok: true }))
  await page.route('**/functions/v1/poll-manage-link', (route) => {
    asks.push(JSON.parse(route.request().postData() ?? '{}'))
    return manageStatus === 200 ? json(route, 200, { ok: true }) : json(route, manageStatus, { ok: false, code: 'rate_limited' })
  })
  await page.route('**/auth/v1/**', (route) => json(route, 401, { message: 'no session' }))
  await page.route('**/auth/v1/user*', (route) => signedIn
    ? json(route, 200, { id: HOST_ID, email: HOST_EMAIL, aud: 'authenticated', role: 'authenticated' })
    : json(route, 401, { message: 'no session' }))
  await page.route('**/auth/v1/signup*', (route) => json(route, 422, { message: 'not in this test' }))
  await page.route('**/auth/v1/verify*', (route) => {
    const body = JSON.parse(route.request().postData() ?? '{}')
    verifies.push(body)
    if (body.token_hash !== GOOD) return json(route, 403, { code: 'otp_expired', message: 'Email link is invalid or has expired' })
    signedIn = true
    const exp = Math.floor(Date.now() / 1000) + 3600
    return json(route, 200, {
      access_token: fakeJwt(HOST_ID, exp), refresh_token: 'fake-refresh', token_type: 'bearer',
      expires_in: 3600, expires_at: exp,
      user: { id: HOST_ID, email: HOST_EMAIL, aud: 'authenticated', role: 'authenticated' },
    })
  })
  await page.route('**/rest/v1/rpc/get_poll', (route) => json(route, 200, poll()))
  await page.route('**/rest/v1/rpc/get_poll_responses', (route) => json(route, 200, []))
  await page.route('**/rest/v1/rpc/claim_poll', (route) => json(route, 200, false))
}

const text = (page) => page.locator('body').innerText()
const SUMMARY = 'Is this your poll? Manage it on this device'
const SENT = "If that's the address this poll was made with"

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
const base = `http://localhost:${port}`

try {
  // 1. Ask for a link ------------------------------------------------------------
  {
    const page = await browser.newPage()
    const asks = []
    await stubBackend(page, { asks })
    await page.goto(`${base}/p/mng1234567`, { waitUntil: 'networkidle' })
    await page.getByText(SUMMARY).waitFor({ timeout: 8000 }).catch(() => {})
    check('a visitor is offered the link', (await text(page)).includes(SUMMARY))
    await page.getByText(SUMMARY).click()
    await page.getByLabel('The email you made the poll with').fill(' Host@Example.com ')
    await page.getByRole('button', { name: 'Email me a link' }).click()
    await page.getByText(SENT).waitFor({ timeout: 5000 }).catch(() => {})
    const a = asks[0] ?? {}
    check('the request went to poll-manage-link', asks.length === 1, JSON.stringify(asks))
    check('with the poll and the trimmed address', a.pollId === 'mng1234567' && a.email === 'Host@Example.com', JSON.stringify(a))
    check('and the app’s own base for the link', a.appBase === `${base}/`, a.appBase)
    check('the page answers neutrally', (await text(page)).includes(SENT))
    await page.close()
  }

  // 2. A bad address, and too many requests ---------------------------------------
  {
    const page = await browser.newPage()
    const asks = []
    await stubBackend(page, { asks, manageStatus: 429 })
    await page.goto(`${base}/p/mng1234567`, { waitUntil: 'networkidle' })
    await page.getByText(SUMMARY).click()
    await page.getByLabel('The email you made the poll with').fill('not-an-address')
    await page.getByRole('button', { name: 'Email me a link' }).click()
    check('a bad address is caught on the page', (await text(page)).includes("That email doesn't look right."))
    check('and nothing is sent', asks.length === 0)
    await page.getByLabel('The email you made the poll with').fill('host@example.com')
    await page.getByRole('button', { name: 'Email me a link' }).click()
    await page.getByText("That's a lot of requests").waitFor({ timeout: 5000 }).catch(() => {})
    check('a 429 says to wait', (await text(page)).includes("That's a lot of requests"))
    await page.close()
  }

  // 3. Opening the emailed link ----------------------------------------------------
  {
    const page = await browser.newPage()
    const verifies = []
    await stubBackend(page, { verifies })
    await page.goto(`${base}/p/mng1234567#manage=${GOOD}`, { waitUntil: 'networkidle' })
    await page.getByText('You can manage this poll from this browser now.').waitFor({ timeout: 8000 }).catch(() => {})
    check('the token is gone from the address bar', !page.url().includes('manage='), page.url())
    check('it was redeemed once, as a magic link', verifies.length === 1 && verifies[0].token_hash === GOOD && verifies[0].type === 'magiclink', JSON.stringify(verifies))
    const body = await text(page)
    check('the host view appears', body.includes('You can manage this poll from this browser now.') && body.includes(`Signed in as ${HOST_EMAIL}`), body.slice(0, 800))
    check('and the request form is gone', !body.includes(SUMMARY))
    await page.close()
  }

  // 4. A spent link ---------------------------------------------------------------
  {
    const page = await browser.newPage()
    await stubBackend(page)
    await page.goto(`${base}/p/mng1234567#manage=${SPENT}`, { waitUntil: 'networkidle' })
    await page.getByText('That link has expired').waitFor({ timeout: 8000 }).catch(() => {})
    const body = await text(page)
    check('a spent link is reported', body.includes('That link has expired or has already been used.'), body.slice(0, 800))
    check('and grants nothing', !body.includes('Signed in as'))
    check('the form is open, ready for a new one', await page.getByLabel('The email you made the poll with').isVisible())
    await page.close()
  }

  // 5. An admin link that didn't work points here -----------------------------------
  {
    const page = await browser.newPage()
    await stubBackend(page)
    await page.route('**/auth/v1/signup*', (route) => {
      const exp = Math.floor(Date.now() / 1000) + 3600
      return json(route, 200, {
        access_token: fakeJwt('anon-uid', exp), refresh_token: 'fake-refresh', token_type: 'bearer',
        expires_in: 3600, expires_at: exp,
        user: { id: 'anon-uid', aud: 'authenticated', role: 'authenticated', is_anonymous: true, email: '' },
      })
    })
    await page.goto(`${base}/p/mng1234567#admin=${'c'.repeat(32)}`, { waitUntil: 'networkidle' })
    await page.getByText("That admin link didn't work").waitFor({ timeout: 8000 }).catch(() => {})
    const body = await text(page)
    check('a failed admin link suggests an emailed one', body.includes('Gave your email when you made the poll?'), body.slice(0, 800))
    check('with the form already open', await page.getByLabel('The email you made the poll with').isVisible())
    await page.close()
  }
} finally {
  await browser.close()
  server.kill()
}

finish()
