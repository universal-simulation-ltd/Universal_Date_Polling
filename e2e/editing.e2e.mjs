// "The host is just changing the times, please check back shortly" — the poll
// page's side of going back to edit, driven in a real browser.
//
// What only a browser shows: that the notice replaces the answer form rather
// than sitting on top of it; that an abandoned edit stops counting; that the
// host still sees their own page; that the page opens BY ITSELF once the host
// saves (the 15-second quiet re-check, with new times); and that a respondent
// refused by the server is shown the server's sentence, not a generic error.
//
// Backend stubbed at the network boundary, as in the other suites. The poll
// row is a mutable holder so a test can "save" the host's edit mid-run.
//
//   node e2e/editing.e2e.mjs

import { checker, freePort, launch, seedHostSession, startDevServer } from './harness.mjs'

const { check, finish } = checker()

const HOST_ID = 'host-uid'
const SLOT_A = { id: 'slot-a', start: '2026-06-10T14:00', durationMins: 60 }
const SLOT_B = { id: 'slot-b', start: '2026-06-11T09:30', durationMins: 30 }
const SLOT_C = { id: 'slot-c', start: '2026-06-12T16:00', durationMins: 60 }
const NOTICE = 'The host is just changing the times, please check back shortly.'

function poll(overrides = {}) {
  return {
    id: 'edit123',
    title: 'Team dinner',
    host_user_id: HOST_ID,
    timezone: 'Europe/London',
    mode: 'times',
    slots: [SLOT_A, SLOT_B],
    theme: 'orange',
    branding: null,
    location: null,
    booking_mode: false,
    final_slot_id: null,
    final_notified_slot_id: null,
    booking_notify_failed: null,
    notify_on_response: false,
    editing_since: null,
    created_at: '2026-06-01T09:00:00Z',
    expires_at: null,
    ...overrides,
  }
}

const minutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString()

async function stubBackend(page, { holder, host = false, submits = [], submitError = null }) {
  // Reverse registration order — catch-alls first (see booking.e2e.mjs).
  await page.route('**/rest/v1/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.route('**/functions/v1/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }))
  await page.route('**/auth/v1/**', (route) => route.fulfill({ status: 401, contentType: 'application/json', body: '{"message":"no session"}' }))
  await page.route('**/functions/v1/calendar-oauth', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }))
  await page.route('**/rest/v1/rpc/get_poll', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(holder.current) }))
  await page.route('**/rest/v1/rpc/get_poll_responses', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.route('**/rest/v1/rpc/submit_response', (route) => {
    submits.push(JSON.parse(route.request().postData() ?? '{}'))
    if (submitError) {
      // The shape PostgREST returns for a RAISE with errcode 22023.
      return route.fulfill({
        status: 400, contentType: 'application/json',
        body: JSON.stringify({ code: '22023', message: submitError, details: null, hint: null }),
      })
    }
    return route.fulfill({ status: 204, body: '' })
  })
  if (host) {
    await page.route('**/auth/v1/user', (route) => route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: HOST_ID, email: 'host@example.com', aud: 'authenticated', role: 'authenticated' }),
    }))
  }
}

const text = (page) => page.locator('body').innerText()

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
const base = `http://localhost:${port}`

try {
  // 1. A respondent arrives mid-edit, and the page opens once the host saves --
  {
    const page = await browser.newPage()
    const holder = { current: poll({ editing_since: minutesAgo(1) }) }
    await stubBackend(page, { holder })
    await page.goto(`${base}/p/edit123`, { waitUntil: 'networkidle' })
    let body = await text(page)
    check('shows the notice', body.includes(NOTICE), body.slice(0, 300))
    check('in place of the answer form', !body.includes('Save my availability') && !body.includes('Are you free at these times?'))

    // The host saves: new times, and the flag cleared.
    holder.current = poll({ slots: [SLOT_C], editing_since: null })
    await page.waitForFunction(
      () => document.body.innerText.includes('Save my availability'), null, { timeout: 25_000 },
    ).catch(() => {})
    body = await text(page)
    check('the page opens by itself once the host saves', body.includes('Save my availability'))
    check('with the notice gone', !body.includes(NOTICE))
    check('showing the NEW times', body.includes('16:00–17:00') && !body.includes('14:00–15:00'), body.slice(0, 600))
    await page.close()
  }

  // 2. An edit nobody renewed for over ten minutes has lapsed ----------------
  {
    const page = await browser.newPage()
    await stubBackend(page, { holder: { current: poll({ editing_since: minutesAgo(11) }) } })
    await page.goto(`${base}/p/edit123`, { waitUntil: 'networkidle' })
    const body = await text(page)
    check('an abandoned edit shows no notice', !body.includes(NOTICE))
    check('and the form is back', body.includes('Save my availability'))
    await page.close()
  }

  // 3. The host sees their own page, not the notice --------------------------
  {
    const page = await browser.newPage()
    await seedHostSession(page, HOST_ID)
    await stubBackend(page, { holder: { current: poll({ editing_since: minutesAgo(1) }) }, host: true })
    await page.goto(`${base}/p/edit123`, { waitUntil: 'networkidle' })
    // The host check resolves after the first paint (it waits on /auth/v1/user).
    await page.waitForTimeout(1000)
    const body = await text(page)
    check('the host is not told to check back', !body.includes(NOTICE))
    await page.close()
  }

  // 4. The server refuses an answer mid-edit, and says why -------------------
  {
    const page = await browser.newPage()
    const submits = []
    await stubBackend(page, {
      holder: { current: poll() }, submits,
      submitError: 'The host is just changing the times, please check back shortly',
    })
    await page.goto(`${base}/p/edit123`, { waitUntil: 'networkidle' })
    await page.getByLabel('Your name').fill('Sam')
    await page.getByRole('button', { name: /Yes/ }).first().click()
    await page.getByRole('button', { name: 'Save my availability' }).click()
    await page.waitForFunction(() => /check back shortly/.test(document.body.innerText), null, { timeout: 5000 }).catch(() => {})
    const body = await text(page)
    check('a refused answer shows the server’s reason', body.includes('The host is just changing the times, please check back shortly'), body.slice(0, 900))
    check('and does not claim it was saved', !body.includes('Saved — thanks!'))
    const sent = submits[0]?.p_availability ?? {}
    check('only current times were sent', Object.keys(sent).every((k) => k === 'slot-a' || k === 'slot-b'), JSON.stringify(sent))
    await page.close()
  }

  // 5. The host goes back a step from "Your poll is live" --------------------
  // Through the real create form: a returning email-code host, the Manual
  // times, Create — then back, change, save; back, change, cancel; and back
  // once someone has answered.
  {
    const page = await browser.newPage()
    const created = []
    const editingCalls = []
    const saves = []
    let refuseEditing = false
    await seedHostSession(page, HOST_ID)
    await stubBackend(page, { holder: { current: poll() }, host: true })
    await page.route('**/rest/v1/polls*', async (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      const body = JSON.parse(route.request().postData() ?? '{}')
      const row = Array.isArray(body) ? body[0] : body
      created.push(row)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(poll({ ...row })) })
    })
    await page.route('**/rest/v1/rpc/set_poll_editing', async (route) => {
      editingCalls.push(JSON.parse(route.request().postData() ?? '{}'))
      if (refuseEditing) {
        return route.fulfill({
          status: 400, contentType: 'application/json',
          body: JSON.stringify({ code: '22023', message: "Someone has already answered, so the times can't be changed now", details: null, hint: null }),
        })
      }
      return route.fulfill({ status: 204, body: '' })
    })
    await page.route('**/rest/v1/rpc/update_poll_draft', async (route) => {
      saves.push(JSON.parse(route.request().postData() ?? '{}'))
      await route.fulfill({ status: 204, body: '' })
    })

    await page.goto(base, { waitUntil: 'networkidle' })
    await page.getByText('(verified)').waitFor({ timeout: 5000 }).catch(() => {})
    await page.getByLabel('Poll title').fill('Team dinner')
    await page.getByText('Manual', { exact: true }).click()
    await page.getByLabel('Date', { exact: true }).fill('2026-10-14')
    await page.getByLabel('Time', { exact: true }).fill('14:00')
    await page.getByRole('button', { name: 'Add time' }).click()
    await page.getByRole('button', { name: 'Create poll' }).click()
    await page.getByText('Your poll is live').waitFor({ timeout: 8000 })
    check('the poll was created once', created.length === 1, JSON.stringify(created))
    const id = created[0]?.id
    const goBack = page.getByRole('button', { name: '← Change the times' })
    check('the live screen offers to change the times', await goBack.isVisible())

    await goBack.click()
    await page.getByText("You're changing the times on your live poll.").waitFor({ timeout: 5000 })
    check('going back tells the server the host is editing',
      editingCalls.length === 1 && editingCalls[0].p_on === true && editingCalls[0].p_poll_id === id, JSON.stringify(editingCalls))
    check('the form is back, saying Save changes', (await text(page)).includes('Save changes'))

    await page.getByLabel('Date', { exact: true }).fill('2026-10-15')
    await page.getByLabel('Time', { exact: true }).fill('09:30')
    await page.getByRole('button', { name: 'Add time' }).click()
    await page.getByRole('button', { name: 'Save changes' }).click()
    await page.getByText('Your poll is live').waitFor({ timeout: 8000 })
    const saved = saves[0] ?? {}
    check('Save changes updates the same poll', saves.length === 1 && saved.p_poll_id === id, JSON.stringify(saves))
    check('with both times and the title', saved.p_poll?.slots?.length === 2 && saved.p_poll?.title === 'Team dinner', JSON.stringify(saved.p_poll))
    check('and creates nothing new', created.length === 1, `created ${created.length}`)

    // Cancel puts everything back as it was.
    await goBack.click()
    await page.getByText("You're changing the times on your live poll.").waitFor({ timeout: 5000 })
    await page.getByLabel('Poll title').fill('Changed my mind')
    await page.getByRole('button', { name: 'Cancel — keep it as it was' }).click()
    await page.getByText('Your poll is live').waitFor({ timeout: 5000 })
    const last = editingCalls[editingCalls.length - 1]
    check('Cancel tells the server the edit is over', last?.p_on === false, JSON.stringify(editingCalls))
    check('Cancel saves nothing', saves.length === 1, `saves ${saves.length}`)
    await page.getByRole('button', { name: /Copy a list for an email/ }).click()
    const listText = await page.locator('textarea').inputValue()
    check('Cancel restores what was there', listText.includes('Team dinner') && !listText.includes('Changed my mind'), listText)

    // Once someone has answered, the server refuses and the screen says why.
    refuseEditing = true
    await goBack.click()
    await page.getByText('Someone has already answered').waitFor({ timeout: 5000 }).catch(() => {})
    const body = await text(page)
    check('a refused go-back says why', body.includes("Someone has already answered, so the times can't be changed now"), body.slice(0, 400))
    check('and stays on the live screen', body.includes('Your poll is live') && !body.includes("You're changing the times"))
    await page.close()
  }
} finally {
  await browser.close()
  server.kill()
}

finish()
