// A CONFIRMED ordinary poll, driven in a real browser — as a respondent and as
// the host.
//
// The wording and the guest list are unit-tested (`confirmedEmail.test.ts`,
// `calendar.test.ts`). What is not is the page: whether the answer form and
// the results actually fold once a time is confirmed and open again on a
// click; whether the host's "Add to calendar" really hands Google and Outlook
// the right people; whether "Copy email" copies what the host edited rather
// than the draft; and whether a respondent is kept out of all of it.
//
// Same approach as booking.e2e.mjs: the backend is stubbed at the network
// boundary. The host is a seeded email-OTP session (the `unipoll-auth` storage
// key) plus a stubbed `/auth/v1/user` — the same path a real host takes.
//
//   node e2e/confirmed.e2e.mjs

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')

// Playwright lives in whichever sibling app installed it (see booking.e2e.mjs).
function resolvePlaywright() {
  const apps = path.resolve(ROOT, '..')
  for (const dir of fs.readdirSync(apps)) {
    const candidate = path.join(apps, dir, 'node_modules', 'playwright', 'index.mjs')
    if (fs.existsSync(candidate)) return pathToFileURL(candidate).href
  }
  throw new Error('No playwright install found in a sibling Universal app')
}
const { chromium } = await import(resolvePlaywright()).then((m) => m.default ?? m)

async function launch() {
  try {
    return await chromium.launch()
  } catch (e) {
    const cache = path.join(process.env.HOME ?? '', 'Library/Caches/ms-playwright')
    if (!fs.existsSync(cache)) throw e
    const shells = fs.readdirSync(cache)
      .filter((d) => d.startsWith('chromium_headless_shell-'))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
    for (const shell of shells) {
      const exe = path.join(cache, shell, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell')
      if (fs.existsSync(exe)) {
        console.log(`  (using ${shell} from the shared browser cache)`)
        return await chromium.launch({ executablePath: exe })
      }
    }
    throw e
  }
}

let passed = 0
const failures = []
function check(name, condition, detail = '') {
  if (condition) {
    passed += 1
    console.log(`  ok   ${name}`)
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

async function freePort() {
  const net = await import('node:net')
  return new Promise((resolve) => {
    const probe = net.createServer()
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address()
      probe.close(() => resolve(port))
    })
  })
}

function startDevServer(port) {
  const vite = path.resolve(ROOT, 'node_modules/vite/bin/vite.js')
  const child = spawn(process.execPath, [vite, '--port', String(port), '--strictPort'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('dev server did not start in 90s')), 90000)
    child.stdout.on('data', (chunk) => {
      if (String(chunk).includes(String(port))) {
        clearTimeout(timer)
        setTimeout(() => resolve(child), 800)
      }
    })
    child.stderr.on('data', (chunk) => process.stderr.write(chunk))
    child.on('exit', (code) => reject(new Error(`dev server exited with ${code}`)))
  })
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

const HOST_ID = 'host-uid'
const SLOT_A = { id: 'slot-a', start: '2026-06-10T14:00', durationMins: 60 }
const SLOT_B = { id: 'slot-b', start: '2026-06-11T09:30', durationMins: 30 }

const POLL = {
  id: 'conf123',
  title: 'Team dinner',
  host_user_id: HOST_ID,
  timezone: 'Europe/London',
  mode: 'times',
  slots: [SLOT_A, SLOT_B],
  theme: 'orange',
  branding: null,
  location: null,
  booking_mode: false,
  final_slot_id: 'slot-a',
  final_notified_slot_id: null,
  booking_notify_failed: null,
  notify_on_response: false,
  created_at: '2026-06-01T09:00:00Z',
  expires_at: null,
}

const response = (id, name, availability) => ({
  id, poll_id: POLL.id, name, availability,
  created_at: '2026-06-02T10:00:00Z', updated_at: '2026-06-02T10:00:00Z',
})
// Slot A is the confirmed one: Sam is free, Alex is free if need be, Jo is not,
// and Kim only answered for slot B. So the guests are Sam and Alex — and Jo's
// and Kim's addresses are what a list built carelessly would let in.
const RESPONSES = [
  response('r1', 'Sam', { 'slot-a': 'yes', 'slot-b': 'no' }),
  response('r2', 'Alex', { 'slot-a': 'maybe' }),
  response('r3', 'Jo', { 'slot-a': 'no', 'slot-b': 'yes' }),
  response('r4', 'Kim', { 'slot-b': 'yes' }),
]
const CONTACTS = [
  { name: 'Sam', email: 'sam@example.com' },
  { name: 'Alex', email: 'alex@example.com' },
  { name: 'Jo', email: 'jo@example.com' },
  { name: 'Kim', email: 'kim@example.com' },
]

/** A JWT-shaped token: supabase-js reads the claims off the access token, so a
 *  bare string would be rejected before it ever reached the stubbed endpoint. */
function fakeJwt(sub, exp) {
  const part = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  return `${part({ alg: 'HS256', typ: 'JWT' })}.${part({ sub, exp, role: 'authenticated', aud: 'authenticated' })}.sig`
}

async function stubBackend(page, { host, emailReads }) {
  // Reverse registration order — catch-alls first (see booking.e2e.mjs).
  await page.route('**/rest/v1/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.route('**/functions/v1/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }))
  await page.route('**/auth/v1/**', (route) => route.fulfill({ status: 401, contentType: 'application/json', body: '{"message":"no session"}' }))
  await page.route('**/rest/v1/rpc/get_poll', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(POLL) }))
  await page.route('**/rest/v1/rpc/get_poll_responses', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(RESPONSES) }))
  // Recorded, so the respondent run can assert it never asked.
  await page.route('**/rest/v1/rpc/get_poll_respondent_emails', (route) => {
    emailReads.push(route.request().url())
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(host ? CONTACTS : []) })
  })
  // No calendar connected: the status call failing leaves the own-calendar row
  // hidden, which is the case this test is not about.
  await page.route('**/functions/v1/calendar-oauth', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }))
  if (host) {
    await page.route('**/auth/v1/user', (route) => route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: HOST_ID, email: 'host@example.com', aud: 'authenticated', role: 'authenticated' }),
    }))
  }
}

/** window.open is how Add to calendar leaves the page; record instead. */
async function recordWindowOpen(page) {
  await page.addInitScript(() => {
    window.__opened = []
    window.open = (url) => { window.__opened.push(String(url)); return null }
  })
}

async function seedHostSession(page) {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const session = {
    access_token: fakeJwt(HOST_ID, exp), refresh_token: 'fake-refresh', token_type: 'bearer',
    expires_in: 3600, expires_at: exp,
    user: { id: HOST_ID, email: 'host@example.com', aud: 'authenticated', role: 'authenticated' },
  }
  await page.addInitScript((s) => { localStorage.setItem('unipoll-auth', s) }, JSON.stringify(session))
}

const text = (page) => page.locator('body').innerText()

// ── Run ──────────────────────────────────────────────────────────────────────

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
const base = `http://localhost:${port}`

try {
  // 1. A respondent opens a confirmed poll ------------------------------------
  {
    const page = await browser.newPage()
    const emailReads = []
    await recordWindowOpen(page)
    await stubBackend(page, { host: false, emailReads })
    await page.goto(`${base}/p/conf123`, { waitUntil: 'networkidle' })
    let body = await text(page)

    check('shows the confirmed time', /confirmed time/i.test(body) && body.includes('14:00–15:00'))
    check('folds the answer form', body.includes('A time is confirmed, so this is folded away') && !body.includes('Save my availability'))
    check('folds the results to a count', body.includes('4 people responded.') && !body.includes('not free: Jo'))

    await page.getByRole('button', { name: /Are you free at these times\?/ }).click()
    body = await text(page)
    check('the answer form opens again', body.includes('Save my availability'))
    await page.getByRole('button', { name: /Hide/ }).first().click()
    check('and folds away again', !(await text(page)).includes('Save my availability'))

    await page.getByRole('button', { name: /^Results/ }).click()
    body = await text(page)
    check('the results open again with the names', body.includes('Sam') && body.includes('not free: Jo'))

    check('a respondent gets no Copy email', !body.includes('Copy email'))
    check('a respondent never asks for addresses', emailReads.length === 0, emailReads.join(', '))

    // The banner's own button is the first "Add to calendar" on the page.
    await page.getByRole('button', { name: 'Add to calendar' }).first().click()
    check('a respondent is told of no guests', !(await text(page)).includes('Invites the'))
    await page.getByRole('menuitem', { name: 'Google Calendar' }).click()
    const [url] = await page.evaluate(() => window.__opened)
    check('a respondent’s Google link carries no guests', !!url && !new URL(url).searchParams.has('add'), url)
    await page.close()
  }

  // 2. The host opens the same poll ------------------------------------------
  {
    const context = await browser.newContext()
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base })
    const page = await context.newPage()
    const emailReads = []
    await recordWindowOpen(page)
    await seedHostSession(page)
    await stubBackend(page, { host: true, emailReads })
    await page.goto(`${base}/p/conf123`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Copy email/ }).waitFor({ timeout: 5000 })

    let body = await text(page)
    check('the host sees Copy email', body.includes('Copy email'))
    check('the host’s answer form and results are folded too',
      !body.includes('Save my availability') && body.includes('4 people responded.'))
    check('the "which times work" list is gone once confirmed', !body.includes('Copy a list for an email'))
    check('the host’s page read the addresses once', emailReads.length === 1, `got ${emailReads.length}`)

    const addToCal = page.getByRole('button', { name: 'Add to calendar' }).first()
    await addToCal.click()
    check('the menu says who it will invite', (await text(page)).includes('Invites the 2 people free then'))
    await page.getByRole('menuitem', { name: 'Google Calendar' }).click()
    await addToCal.click()
    await page.getByRole('menuitem', { name: 'Outlook' }).click()
    const [google, outlook] = await page.evaluate(() => window.__opened)
    check('Google gets the yes and the if-need-be as guests',
      new URL(google).searchParams.get('add') === 'sam@example.com,alex@example.com', google)
    check('Outlook gets the same people as attendees',
      new URL(outlook).searchParams.get('to') === 'sam@example.com,alex@example.com', outlook)

    await page.getByRole('button', { name: /Copy email/ }).click()
    const dialog = page.getByRole('dialog')
    await dialog.waitFor()
    const dialogText = await dialog.innerText()
    check('opens the preview', dialogText.includes('Copy the confirmation email'))
    const inputs = dialog.locator('input')
    check('To holds every address left, once each',
      (await inputs.nth(0).inputValue()) === 'sam@example.com, alex@example.com, jo@example.com, kim@example.com',
      await inputs.nth(0).inputValue())
    check('Subject is filled in', (await inputs.nth(1).inputValue()) === 'Time confirmed: Team dinner')
    const message = dialog.locator('textarea')
    const draft = await message.inputValue()
    check('the message names the confirmed time', draft.includes('Wed, 10 Jun 2026 at 14:00–15:00 BST'), draft)
    check('the message links back to the poll', draft.includes('/p/conf123'), draft)

    await message.fill(`${draft}\n\nBring a dessert!`)
    await dialog.getByRole('button', { name: 'Copy message' }).click()
    const clip = await page.evaluate(() => navigator.clipboard.readText())
    check('Copy message copies what the host edited', clip.endsWith('Bring a dessert!') && clip.includes('Team dinner'), clip)
    check('and says so', (await dialog.innerText()).includes('Copied!'))

    await dialog.getByRole('button', { name: 'Copy' }).first().click()
    check('the To line copies on its own',
      (await page.evaluate(() => navigator.clipboard.readText())) === 'sam@example.com, alex@example.com, jo@example.com, kim@example.com')

    await page.keyboard.press('Escape')
    check('Escape closes the preview', (await page.getByRole('dialog').count()) === 0)
    await context.close()
  }
} finally {
  await browser.close()
  server.kill()
}

console.log(`\n${passed} passed, ${failures.length} failed`)
if (failures.length) {
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
