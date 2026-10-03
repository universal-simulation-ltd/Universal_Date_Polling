// Typing a name somebody else already answered under — the poll page's warning.
//
// Answers are keyed by (poll, name) on the server, so "Sam" saving over the
// top of another "Sam" silently replaces their availability. The page can't
// stop that (it may really be the same Sam on a second device), but it must
// SAY so before the click, and must not nag this browser about its own answer.
//
// Backend stubbed at the network boundary, as in the other suites.
//
//   node e2e/nameclash.e2e.mjs

import { checker, freePort, launch, startDevServer } from './harness.mjs'

const { check, finish } = checker()

const SLOT = { id: 'slot-a', start: '2026-06-10T14:00', durationMins: 60 }
const POLL = {
  id: 'clash123', title: 'Team dinner', host_user_id: 'host-uid', timezone: 'Europe/London',
  mode: 'times', slots: [SLOT], theme: 'orange', branding: null, location: null,
  booking_mode: false, final_slot_id: null, final_notified_slot_id: null,
  booking_notify_failed: null, notify_on_response: false, editing_since: null,
  created_at: '2026-06-01T09:00:00Z', expires_at: null,
}
const RESPONSES = [{ id: 'r1', poll_id: 'clash123', name: 'Sam', availability: { 'slot-a': 'yes' }, created_at: '2026-06-02T09:00:00Z' }]
const WARNING = 'has already answered this poll'

async function stub(page, submits) {
  await page.route('**/rest/v1/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.route('**/functions/v1/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }))
  await page.route('**/auth/v1/**', (r) => r.fulfill({ status: 401, contentType: 'application/json', body: '{"message":"no session"}' }))
  await page.route('**/rest/v1/rpc/get_poll', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(POLL) }))
  await page.route('**/rest/v1/rpc/get_poll_responses', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(RESPONSES) }))
  await page.route('**/rest/v1/rpc/submit_response', (r) => {
    submits.push(JSON.parse(r.request().postData() ?? '{}'))
    return r.fulfill({ status: 204, body: '' })
  })
}

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
const base = `http://localhost:${port}`
const text = (page) => page.locator('body').innerText()

try {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const submits = []
  await stub(page, submits)
  await page.goto(`${base}/p/clash123`, { waitUntil: 'networkidle' })

  await page.getByLabel('Your name').fill('Alex')
  check('a new name gets no warning', !(await text(page)).includes(WARNING))
  check('and the usual button', await page.getByRole('button', { name: 'Save my availability' }).isVisible())

  await page.getByLabel('Your name').fill('  sam ')
  let body = await text(page)
  check('a name already used is warned about (case and spaces ignored)', body.includes(WARNING), body.slice(0, 400))
  check('the button says what saving will do', await page.getByRole('button', { name: /Replace sam’s answers/ }).isVisible())
  await page.screenshot({ path: process.env.SHOT ?? '/dev/null', fullPage: true }).catch(() => {})

  await page.getByRole('button', { name: /Replace sam’s answers/ }).click()
  await page.waitForTimeout(800)
  check('saving still works (it may really be them)', submits.length === 1 && submits[0].p_name === 'sam')

  // Same browser, same poll, after a reload: that answer is now this browser's own.
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByLabel('Your name').fill('Sam')
  body = await text(page)
  check('no warning once this browser has saved under that name', !body.includes(WARNING), body.slice(0, 400))
  await ctx.close()
} finally {
  await browser.close()
  server.kill()
}
finish()
