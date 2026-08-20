// The 1:1 booking page, driven in a real browser.
//
// Everything else about booking_mode is unit-testable — the wording of the text
// export, the .ics the server builds. What is NOT is the page itself: whether
// the flag actually swaps one product for another, whether the guest can pick a
// time, and whether the request that reaches the backend carries the slot they
// clicked. That is what this asserts.
//
// The backend is stubbed at the network boundary (page.route), not mocked in
// the app: creating a real poll needs an email round-trip, and stubbing the
// module would test a fake instead of the code that ships. The fixtures below
// are the JSON Supabase would return.
//
//   node e2e/booking.e2e.mjs

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')

// Playwright lives in whichever sibling app installed it — this repo doesn't
// carry it. Resolved by looking rather than by hard-coding a sibling's name: the
// Converter's suite hard-codes ../../Universal_Beam and simply cannot run on a
// machine where that checkout is absent.
function resolvePlaywright() {
  const apps = path.resolve(ROOT, '..')
  for (const dir of fs.readdirSync(apps)) {
    const candidate = path.join(apps, dir, 'node_modules', 'playwright', 'index.mjs')
    if (fs.existsSync(candidate)) return pathToFileURL(candidate).href
  }
  throw new Error('No playwright install found in a sibling Universal app')
}
const { chromium } = await import(resolvePlaywright()).then((m) => m.default ?? m)

/** Launch, falling back to whatever headless-shell build the machine actually
 *  has. The sibling's Playwright pins one revision; the cache is shared across
 *  every repo on the machine and holds whichever revision was downloaded last,
 *  so a version-matched pair is the exception rather than the rule. Without
 *  this the suite fails to start on a perfectly working machine. */
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

// ── Harness ──────────────────────────────────────────────────────────────────

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

const SLOT_A = { id: 'slot-a', start: '2026-06-10T14:00', durationMins: 60 }
const SLOT_B = { id: 'slot-b', start: '2026-06-11T09:30', durationMins: 30 }

function poll(overrides = {}) {
  return {
    id: 'book123',
    title: 'Coffee and a catch-up',
    host_email: 'host@example.com',
    host_user_id: 'host-uid',
    timezone: 'Europe/London',
    mode: 'times',
    slots: [SLOT_A, SLOT_B],
    theme: 'orange',
    branding: null,
    location: null,
    booking_mode: true,
    final_slot_id: null,
    final_notified_slot_id: null,
    notify_on_response: false,
    created_at: '2026-06-01T09:00:00Z',
    expires_at: null,
    ...overrides,
  }
}

/** Stub the Supabase REST/functions surface. `bookings` collects the bodies the
 *  page actually POSTs, which is the assertion that matters most: a picker that
 *  looks right and books the wrong slot is the bug worth catching. */
async function stubBackend(page, { row, bookResponse = { ok: true, viaCalendar: true, invitee: true }, bookings }) {
  // The responses table is STATEFUL: a booking writes a response row, and the
  // page reads it back to say who booked. A stub that always returned [] would
  // let a page that never refreshes pass.
  const responses = []
  // ORDER MATTERS, and not in the direction you'd guess: Playwright matches
  // routes in REVERSE registration order, so the catch-alls go first and the
  // specific handlers last. Registered the intuitive way round, '**/rest/v1/**'
  // swallows the polls request and every page renders "Poll not found" — a
  // stub that silently shadows the fixture it was meant to sit beneath.
  await page.route('**/rest/v1/**', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: '[]',
  }))
  await page.route('**/rest/v1/poll_responses*', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify(responses),
  }))
  await page.route('**/functions/v1/**', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: '{"ok":true}',
  }))
  await page.route('**/auth/v1/**', (route) => route.fulfill({
    status: 401, contentType: 'application/json', body: '{"message":"no session"}',
  }))
  await page.route('**/rest/v1/polls*', async (route) => {
    const wantsObject = (route.request().headers()['accept'] ?? '').includes('pgrst.object')
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(wantsObject ? row : [row]),
    })
  })
  await page.route('**/functions/v1/book-poll-slot', async (route) => {
    const sent = JSON.parse(route.request().postData() ?? '{}')
    bookings.push(sent)
    responses.push({
      id: 'r1', poll_id: sent.pollId, name: sent.name,
      availability: { [sent.slotId]: 'yes' },
      created_at: '2026-06-02T10:00:00Z', updated_at: '2026-06-02T10:00:00Z',
    })
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(bookResponse) })
  })
}

// ── Run ──────────────────────────────────────────────────────────────────────

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
// `localhost`, not 127.0.0.1: Vite binds the hostname, which resolves to ::1
// first on this machine, and the IPv4 literal is simply refused.
const base = `http://localhost:${port}`

try {
  // 1. An unbooked booking page, seen by the guest ---------------------------
  {
    const page = await browser.newPage()
    const bookings = []
    await stubBackend(page, { row: poll(), bookings })
    await page.goto(`${base}/p/book123`, { waitUntil: 'networkidle' })

    const body = await page.locator('body').innerText()
    check('shows the title', body.includes('Coffee and a catch-up'))
    check('tells the guest their pick settles it', body.includes("it's booked straight away"))
    check('offers a picker, not an availability grid', body.includes('Pick a time'))
    check('drops the yes/maybe/no grid', !body.includes('Are you free at these times?'), body.slice(0, 200))
    check('drops the results tally', !body.includes('Results so far'))

    const bookButton = page.getByRole('button', { name: /Book this time|Pick a time above/ })
    check('the book button waits for a pick', await bookButton.isDisabled())

    // The SECOND slot deliberately: booking the first would pass just as
    // happily against a panel that ignores the click and always sends slots[0].
    await page.getByRole('button', { name: /11 Jun/ }).click()
    check('the book button enables once a time is picked', await bookButton.isEnabled())

    // Name and email are required — the invite has nowhere to go without them.
    await bookButton.click()
    check('refuses a booking with no name', (await page.locator('body').innerText()).includes('Add your name'))
    await page.getByLabel('Your name').fill('Sam')
    await bookButton.click()
    check('refuses a booking with no email', (await page.locator('body').innerText()).includes('Add the email address'))
    await page.getByLabel('Your email').fill('sam@example.com')
    await bookButton.click()

    await page.waitForFunction(() => document.body.innerText.includes("You're booked in"), null, { timeout: 5000 })
    // The banner names the booker only after the response row is re-read, which
    // is a second round trip — waiting on the earlier string alone would race it.
    // Case-insensitively: the banner's label is CSS-uppercased, and innerText
    // returns what is RENDERED, so 'Booked by Sam' arrives as 'BOOKED BY SAM'.
    await page.waitForFunction(
      () => /booked by/i.test(document.body.innerText), null, { timeout: 5000 },
    )
    const after = await page.locator('body').innerText()
    check('confirms the booking to the guest', after.includes("You're booked in"))
    check('names the slot that was booked', after.includes('11 Jun') && after.includes('09:30–10:00'))
    check('shows who booked it', /booked by sam/i.test(after))
    check('promises the provider invite when the host has a calendar', after.includes('calendar invitation is on its way'))
    check('the picker is gone once booked', !after.includes('Book this time'))

    check('POSTed exactly one booking', bookings.length === 1, `got ${bookings.length}`)
    const sent = bookings[0] ?? {}
    check('POSTed the slot that was clicked', sent.slotId === 'slot-b', JSON.stringify(sent))
    check('POSTed the guest name and email', sent.name === 'Sam' && sent.email === 'sam@example.com', JSON.stringify(sent))
    check('POSTed the book action for this poll', sent.action === 'book' && sent.pollId === 'book123', JSON.stringify(sent))
    await page.close()
  }

  // 2. A page somebody has already booked ------------------------------------
  {
    const page = await browser.newPage()
    const bookings = []
    await stubBackend(page, { row: poll({ final_slot_id: 'slot-a' }), bookings })
    await page.goto(`${base}/p/book123`, { waitUntil: 'networkidle' })
    const body = await page.locator('body').innerText()
    check('a booked page says so', body.includes('This time is booked'))
    check('a booked page shows the booked slot', body.includes('10 Jun') && body.includes('14:00–15:00'))
    check('a booked page offers no second booking', !body.includes('Book this time'))
    check('nothing was POSTed by simply looking', bookings.length === 0)
    await page.close()
  }

  // 3. The negative control: an ORDINARY poll must be untouched --------------
  {
    const page = await browser.newPage()
    const bookings = []
    await stubBackend(page, { row: poll({ booking_mode: false }), bookings })
    await page.goto(`${base}/p/book123`, { waitUntil: 'networkidle' })
    const body = await page.locator('body').innerText()
    check('an ordinary poll still shows the availability grid', body.includes('Are you free at these times?'))
    check('an ordinary poll still shows results', body.includes('Results so far'))
    check('an ordinary poll shows no booking picker', !body.includes('Book this time'))
    await page.close()
  }

  // 4. The create screen's opt-in --------------------------------------------
  {
    const page = await browser.newPage()
    const bookings = []
    await stubBackend(page, { row: poll(), bookings })
    await page.goto(base, { waitUntil: 'networkidle' })
    const before = await page.locator('body').innerText()
    check('the booking toggle is behind More options', !before.includes('Just the two of us'))
    await page.getByRole('button', { name: 'More options' }).click()
    const opened = await page.locator('body').innerText()
    check('More options offers the booking page', opened.includes('Just the two of us'))
    check('and explains what it does', opened.includes('They pick a time, it books itself'))

    const toggle = page.getByRole('checkbox').first()
    await page.getByText('make this an instant booking page').click()
    const ticked = await page.locator('body').innerText()
    check('ticking it hides the now-redundant response alerts', !ticked.includes('Want to be emailed when your guests respond?'))
    check('ticking it confirms what the guest will see', ticked.includes("no votes, and nothing for you to confirm"))
    void toggle
    await page.close()
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
