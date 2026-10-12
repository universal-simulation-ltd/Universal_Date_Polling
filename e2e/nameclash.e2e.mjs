// Typing a name somebody else already answered under, and edit tokens (0284).
//
// Answers are keyed by (poll, name) on the server. Since 0284 an answer has an
// edit token, and the server refuses to change it without one — so the page
// blocks a claimed name up front, offers the token back as an edit link, and
// sends it on every save and removal. Answers from before tokens can still be
// replaced by name, so for those the page must SAY so before the click (it may
// really be the same Sam on a second device), and must not nag this browser
// about its own answer.
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
const RESPONSES = [
  { id: 'r1', poll_id: 'clash123', name: 'Sam', availability: { 'slot-a': 'yes' }, created_at: '2026-06-02T09:00:00Z' },
  // Since platform 0284 an answer can carry an edit token; `claimed` says so.
  { id: 'r2', poll_id: 'clash123', name: 'Kim', availability: { 'slot-a': 'no' }, created_at: '2026-06-02T10:00:00Z', claimed: true },
]
const WARNING = 'has already answered this poll'
const CLAIMED = 'only they can change those answers'
const ISSUED = 'abcdefghijkmnpqrstuvwxyz23456789'
const KIMS = '23456789abcdefghijkmnpqrstuvwxyz'

async function stub(page, calls) {
  await page.route('**/rest/v1/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.route('**/functions/v1/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }))
  await page.route('**/auth/v1/**', (r) => r.fulfill({ status: 401, contentType: 'application/json', body: '{"message":"no session"}' }))
  await page.route('**/rest/v1/rpc/get_poll', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(POLL) }))
  await page.route('**/rest/v1/rpc/get_poll_responses', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(RESPONSES) }))
  await page.route('**/rest/v1/rpc/submit_response', (r) => {
    const body = JSON.parse(r.request().postData() ?? '{}')
    calls.submits.push(body)
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ edit_token: body.p_edit_token ?? ISSUED }) })
  })
  await page.route('**/rest/v1/rpc/upsert_response_email', (r) => {
    calls.emails.push(JSON.parse(r.request().postData() ?? '{}'))
    return r.fulfill({ status: 204, body: '' })
  })
  await page.route('**/rest/v1/rpc/response_name_for_token', (r) => {
    const body = JSON.parse(r.request().postData() ?? '{}')
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body.p_edit_token === KIMS ? 'Kim' : null) })
  })
  await page.route('**/rest/v1/rpc/delete_response', (r) => {
    calls.deletes.push(JSON.parse(r.request().postData() ?? '{}'))
    return r.fulfill({ status: 200, contentType: 'application/json', body: 'true' })
  })
}

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
const base = `http://localhost:${port}`
const text = (page) => page.locator('body').innerText()
const fresh = () => ({ submits: [], emails: [], deletes: [] })

try {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const calls = fresh()
  await stub(page, calls)
  await page.goto(`${base}/p/clash123`, { waitUntil: 'networkidle' })

  await page.getByLabel('Your name').fill('Alex')
  check('a new name gets no warning', !(await text(page)).includes(WARNING))
  check('and the usual button', await page.getByRole('button', { name: 'Save my availability' }).isVisible())

  // An answer from before edit tokens (no `claimed`): updatable by name, so warn.
  await page.getByLabel('Your name').fill('  Sam ')
  let body = await text(page)
  check('an old unclaimed answer under that name is warned about', body.includes(WARNING), body.slice(0, 400))
  check('the button says what saving will do', await page.getByRole('button', { name: /Replace Sam’s answers/ }).isVisible())
  await page.screenshot({ path: process.env.SHOT ?? '/dev/null', fullPage: true }).catch(() => {})

  // Other capitals are a separate answer on the server — a hint, not "replace".
  await page.getByLabel('Your name').fill('sam')
  body = await text(page)
  check('other capitals get the tell-apart hint, not the replace warning',
    body.includes('Someone has already answered as “Sam”') && !body.includes(WARNING), body.slice(0, 400))

  // A claimed answer: the server would refuse, so the page says so and blocks.
  await page.getByLabel('Your name').fill('Kim')
  body = await text(page)
  check('a claimed answer is called out', body.includes(CLAIMED), body.slice(0, 400))
  check('and saving is blocked', await page.getByRole('button', { name: 'Save my availability' }).isDisabled())

  await page.getByLabel('Your name').fill('Sam')
  await page.getByRole('button', { name: /Replace Sam’s answers/ }).click()
  await page.waitForTimeout(800)
  check('saving an old answer still works, and asks for a token',
    calls.submits.length === 1 && calls.submits[0].p_name === 'Sam' && calls.submits[0].p_issue_token === true && calls.submits[0].p_edit_token === null,
    JSON.stringify(calls.submits))
  body = await text(page)
  check('the edit link is offered once the answer is ours', body.includes('Your edit link'), body.slice(-600))
  const link = await page.getByLabel('Your edit link').inputValue()
  check('the edit link carries the issued token in the fragment', link.endsWith(`/p/clash123#edit=${ISSUED}`), link)
  const stored = await page.evaluate(() => localStorage.getItem('unipoll-response-tokens'))
  check('the token is kept on this device', stored?.includes(ISSUED) === true, stored)

  // Same browser, after a reload: the answer is this browser's own.
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByLabel('Your name').fill('Sam')
  body = await text(page)
  check('no warning once this browser holds the token', !body.includes(WARNING) && !body.includes(CLAIMED), body.slice(0, 400))
  await page.getByRole('button', { name: 'Save my availability' }).click()
  await page.waitForTimeout(800)
  check('a re-save sends the token it holds', calls.submits.at(-1)?.p_edit_token === ISSUED, JSON.stringify(calls.submits.at(-1)))

  page.once('dialog', (d) => d.accept())
  await page.getByRole('button', { name: 'Remove my answers' }).click()
  await page.waitForTimeout(800)
  check('removing my answers sends my token', calls.deletes.length === 1 && calls.deletes[0].p_name === 'Sam' && calls.deletes[0].p_edit_token === ISSUED,
    JSON.stringify(calls.deletes))
  const after = await page.evaluate(() => localStorage.getItem('unipoll-response-tokens'))
  check('and forgets the token', !after?.includes(ISSUED), after)
  await ctx.close()

  // Another device, opening Kim's edit link.
  const ctx2 = await browser.newContext()
  const page2 = await ctx2.newPage()
  const calls2 = fresh()
  await stub(page2, calls2)
  await page2.goto(`${base}/p/clash123#edit=${KIMS}`, { waitUntil: 'networkidle' })
  await page2.waitForTimeout(500)
  check('the edit link fills in whose answer it is', (await page2.getByLabel('Your name').inputValue()) === 'Kim')
  body = await text(page2)
  check('says the link worked and does not call the answer someone else’s',
    body.includes('Your edit link worked') && !body.includes(CLAIMED), body.slice(0, 400))
  check('the token is out of the address bar', !page2.url().includes('edit='), page2.url())
  await page2.getByRole('button', { name: 'Save my availability' }).click()
  await page2.waitForTimeout(800)
  check('saving from the link sends its token', calls2.submits[0]?.p_edit_token === KIMS, JSON.stringify(calls2.submits))
  await ctx2.close()

  // A link that matches nothing.
  const ctx3 = await browser.newContext()
  const page3 = await ctx3.newPage()
  await stub(page3, fresh())
  await page3.goto(`${base}/p/clash123#edit=${ISSUED}`, { waitUntil: 'networkidle' })
  await page3.waitForTimeout(500)
  check('a link that matches nothing says so', (await text(page3)).includes('doesn’t match an answer on this poll'))
  await ctx3.close()
} finally {
  await browser.close()
  server.kill()
}
finish()
