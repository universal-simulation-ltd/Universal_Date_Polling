// Private admin links — the email-free way to host a poll — driven in a real
// browser against a stubbed backend.
//
// What it pins down:
//   1. A server WITHOUT claim_poll keeps the old rule: a guest host must give
//      an email address, and nothing is created without one.
//   2. A server WITH claim_poll lets a guest create with no email: an anonymous
//      session hosts the poll, only the token's SHA-256 is sent, and the live
//      screen shows the private admin link.
//   3. Opening /p/<id>#admin=<token> takes the token out of the address bar,
//      claims the poll, and shows the host view.
//   4. A token that doesn't match leaves the visitor a guest and says so.
//   5. The host can remove anybody's answer (platform 0284's delete_response),
//      on their own session and with no edit token.
//
//   node e2e/adminlink.e2e.mjs

import { createHash } from 'node:crypto'
import { checker, fakeJwt, freePort, launch, startDevServer } from './harness.mjs'

const { check, finish } = checker()

const ANON_ID = 'anon-uid'
const TOKEN = 'abcdefghijkmnpqrstuvwxyz23456789'
const SLOT = { id: 'slot-a', start: '2026-06-10T14:00', durationMins: 60 }

function poll(overrides = {}) {
  return {
    id: 'adm1234567', title: 'Team dinner', host_user_id: 'someone-else', timezone: 'Europe/London',
    mode: 'times', slots: [SLOT], theme: 'orange', branding: null, location: null, booking_mode: false,
    final_slot_id: null, final_notified_slot_id: null, booking_notify_failed: null, notify_on_response: false,
    editing_since: null, created_at: '2026-06-01T09:00:00Z', expires_at: null, ...overrides,
  }
}

const json = (route, status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

/** The backend, at the network boundary. `adminLinks` decides whether the
 *  server has claim_poll yet. Anonymous sign-in answers with a session. */
async function stubBackend(page, { adminLinks, holder = { current: poll() }, claims = [], responses = [] }) {
  await page.route('**/rest/v1/**', (route) => json(route, 200, []))
  await page.route('**/functions/v1/**', (route) => json(route, 200, { ok: true }))
  await page.route('**/auth/v1/**', (route) => json(route, 401, { message: 'no session' }))
  await page.route('**/auth/v1/signup*', (route) => {
    const exp = Math.floor(Date.now() / 1000) + 3600
    return json(route, 200, {
      access_token: fakeJwt(ANON_ID, exp), refresh_token: 'fake-refresh', token_type: 'bearer',
      expires_in: 3600, expires_at: exp,
      user: { id: ANON_ID, aud: 'authenticated', role: 'authenticated', is_anonymous: true, email: '' },
    })
  })
  await page.route('**/rest/v1/rpc/get_poll', (route) => json(route, 200, holder.current))
  await page.route('**/rest/v1/rpc/get_poll_responses', (route) => json(route, 200, responses))
  await page.route('**/rest/v1/rpc/claim_poll', (route) => {
    if (!adminLinks) return json(route, 404, { code: 'PGRST202', message: 'Could not find the function public.claim_poll', details: null, hint: null })
    const args = JSON.parse(route.request().postData() ?? '{}')
    claims.push(args)
    const ok = args.p_admin_token === TOKEN && args.p_poll_id === holder.current.id
    if (ok) holder.current = { ...holder.current, host_user_id: ANON_ID }
    return json(route, 200, ok)
  })
}

async function fillDraft(page) {
  await page.getByLabel('Poll title').fill('Team dinner')
  await page.getByText('Type in', { exact: true }).click()
  await page.getByLabel('Date', { exact: true }).fill('2026-10-14')
  await page.getByLabel('Time', { exact: true }).fill('14:00')
  await page.getByRole('button', { name: 'Add time' }).click()
}

const text = (page) => page.locator('body').innerText()

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
const base = `http://localhost:${port}`

try {
  // 1. Old server: email still required ---------------------------------------
  {
    const page = await browser.newPage()
    const created = []
    await stubBackend(page, { adminLinks: false })
    await page.route('**/rest/v1/polls*', (route) => { created.push(route.request().postData()); return json(route, 201, poll()) })
    await page.goto(base, { waitUntil: 'networkidle' })
    const body = await text(page)
    check('the email is not marked optional', body.includes('Your email') && !body.includes('(optional)'))
    await fillDraft(page)
    await page.getByRole('button', { name: 'Create poll' }).click()
    await page.getByText('Enter a valid email address.').waitFor({ timeout: 5000 }).catch(() => {})
    check('creating without an email is refused', (await text(page)).includes('Enter a valid email address.'))
    check('and nothing is created', created.length === 0)
    await page.close()
  }

  // 2. New server: create with no email, get the admin link --------------------
  {
    const page = await browser.newPage()
    const created = []
    await stubBackend(page, { adminLinks: true })
    await page.route('**/rest/v1/polls*', (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      const body = JSON.parse(route.request().postData() ?? '{}')
      const row = Array.isArray(body) ? body[0] : body
      created.push(row)
      return json(route, 201, poll({ ...row }))
    })
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.getByText('(optional)').waitFor({ timeout: 5000 }).catch(() => {})
    check('the email is marked optional', (await text(page)).includes('(optional)'))
    await fillDraft(page)
    await page.getByRole('button', { name: 'Create poll' }).click()
    await page.getByText('Your poll is live').waitFor({ timeout: 8000 }).catch(() => {})
    const row = created[0] ?? {}
    check('the poll was created', created.length === 1, JSON.stringify(created))
    check('hosted by the anonymous session', row.host_user_id === ANON_ID, row.host_user_id)
    check('with no host email', row.host_email === '', JSON.stringify(row.host_email))
    check('carrying a SHA-256 hash, not a token', /^[0-9a-f]{64}$/.test(row.admin_token_hash ?? ''), row.admin_token_hash)
    const link = await page.getByLabel('Private admin link').inputValue().catch(() => '')
    const m = link.match(/\/p\/([a-z0-9]+)#admin=([a-z0-9]{32})$/)
    check('the live screen shows the admin link', !!m && m[1] === row.id, link)
    const sha = m ? createHash('sha256').update(m[2]).digest('hex') : ''
    check('whose token hashes to what was stored', sha === row.admin_token_hash)
    await page.close()
  }

  // 3. Opening the admin link claims the poll -----------------------------------
  {
    const page = await browser.newPage()
    const claims = []
    const holder = { current: poll() }
    await stubBackend(page, { adminLinks: true, holder, claims })
    await page.goto(`${base}/p/adm1234567#admin=${TOKEN}`, { waitUntil: 'networkidle' })
    await page.getByText('Your private admin link').waitFor({ timeout: 8000 }).catch(() => {})
    check('the token is gone from the address bar', !page.url().includes('admin='), page.url())
    check('the poll was claimed with it', claims.length === 1 && claims[0].p_admin_token === TOKEN, JSON.stringify(claims))
    const body = await text(page)
    check('the host view appears', body.includes('Your private admin link'), body.slice(0, 600))
    await page.close()
  }

  // 4. A wrong token leaves a guest, and says so --------------------------------
  {
    const page = await browser.newPage()
    await stubBackend(page, { adminLinks: true })
    await page.goto(`${base}/p/adm1234567#admin=${'b'.repeat(32)}`, { waitUntil: 'networkidle' })
    await page.getByText("That admin link didn't work").waitFor({ timeout: 8000 }).catch(() => {})
    const body = await text(page)
    check('a wrong token is reported', body.includes("That admin link didn't work"), body.slice(0, 600))
    check('and grants nothing', !body.includes('Your private admin link'))
    await page.close()
  }

  // 5. The host removes an answer ------------------------------------------------
  {
    const page = await browser.newPage()
    const holder = { current: poll() }
    const responses = [
      { id: 'r1', poll_id: 'adm1234567', name: 'Sam', availability: { 'slot-a': 'yes' }, created_at: '2026-06-02T09:00:00Z', claimed: true },
    ]
    const deletes = []
    await stubBackend(page, { adminLinks: true, holder, responses })
    await page.route('**/rest/v1/rpc/delete_response', (route) => {
      deletes.push({ body: JSON.parse(route.request().postData() ?? '{}'), auth: route.request().headers().authorization ?? '' })
      return json(route, 200, true)
    })
    await page.goto(`${base}/p/adm1234567#admin=${TOKEN}`, { waitUntil: 'networkidle' })
    await page.getByText('Your private admin link').waitFor({ timeout: 8000 }).catch(() => {})
    await page.getByText('Remove an answer').click()
    page.once('dialog', (d) => d.accept())
    await page.getByRole('button', { name: 'Remove Sam’s answers' }).click()
    await page.waitForTimeout(800)
    const d = deletes[0]
    check('the host can remove an answer', deletes.length === 1 && d.body.p_name === 'Sam' && d.body.p_edit_token === null, JSON.stringify(deletes))
    let sub = null
    try { sub = JSON.parse(Buffer.from((d?.auth ?? '').replace(/^Bearer /, '').split('.')[1], 'base64url').toString()).sub } catch { /* not a JWT */ }
    check('on the host\u2019s own session', sub === ANON_ID, d?.auth.slice(0, 40))
    await page.close()
  }
} finally {
  await browser.close()
  server.kill()
}

finish()
