// The free-allowance count and the "used all" banner on the create page,
// driven in a real browser.
//
// Both are read from `free_allowance_status('polling')` (platform 0199), which
// counts LIVE polls — so a poll that expires frees its place. The old banner
// read the `app_free_tokens` flag, which nothing recomputes on an expiry; this
// suite stubs that flag as 'held' throughout to prove it is no longer read.
//
// Backend stubbed at the network boundary, as in the other suites. The host is
// a free-tier Universal ID: a seeded suite session plus stubbed org and
// subscription rows.
//
//   node e2e/allowance.e2e.mjs

import { checker, fakeJwt, freePort, launch, startDevServer } from './harness.mjs'

const { check, finish } = checker()

const USER_ID = 'suite-uid'
const ORG = { id: 'org-1', slug: 'test-co', name: 'Test Co', logo_url: null, icon_url: null, brand_color: null }
const json = (body, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(body) })

const allowance = (used, limit = 10, over = {}) => ({
  ok: true, app: 'polling', budget: 'polling', unlimited: false, used, limit,
  bytes_used: 0, bytes_limit: null, month_used: used, month_limit: null, has_room: used < limit, ...over,
})

async function seedSuiteSession(page) {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const session = {
    access_token: fakeJwt(USER_ID, exp), refresh_token: 'fake-refresh', token_type: 'bearer',
    expires_in: 3600, expires_at: exp,
    user: { id: USER_ID, email: 'free@example.com', aud: 'authenticated', role: 'authenticated', is_anonymous: false },
  }
  await page.addInitScript((s) => { localStorage.setItem('universal-suite-auth', s) }, JSON.stringify(session))
}

/** `state.allowance` is read on every RPC call, so a test can change it and
 *  watch the page follow. `state.rpcCalls` counts them. */
async function stubBackend(page, state) {
  // Reverse registration order — catch-alls first (see booking.e2e.mjs).
  await page.route('**/rest/v1/**', (route) => route.fulfill(json([])))
  await page.route('**/functions/v1/**', (route) => route.fulfill(json({ ok: true })))
  await page.route('**/auth/v1/**', (route) => route.fulfill(json({ message: 'no session' }, 401)))
  await page.route('**/functions/v1/calendar-oauth', (route) => route.fulfill(json({}, 500)))
  await page.route('**/auth/v1/user', (route) => route.fulfill(json({
    id: USER_ID, email: 'free@example.com', aud: 'authenticated', role: 'authenticated', is_anonymous: false,
  })))
  await page.route('**/rest/v1/org_members*', (route) => route.fulfill(json(
    state.company ? [{ org_id: ORG.id, user_id: USER_ID, role: 'owner', organisations: ORG }] : [],
  )))
  await page.route('**/rest/v1/subscriptions*', (route) => {
    const row = { org_id: ORG.id, tier: 'free', status: 'active', credits: state.credits ?? 0 }
    const single = (route.request().headers().accept ?? '').includes('pgrst.object')
    return route.fulfill(json(single ? row : [row]))
  })
  // The old source of truth, pinned to "full". Nothing should read it now.
  await page.route('**/rest/v1/app_free_tokens*', (route) => {
    state.flagReads = (state.flagReads ?? 0) + 1
    const row = { org_id: ORG.id, app: 'polling', status: 'held' }
    const single = (route.request().headers().accept ?? '').includes('pgrst.object')
    return route.fulfill(json(single ? row : [row]))
  })
  await page.route('**/rest/v1/rpc/free_allowance_status', (route) => {
    state.rpcCalls = (state.rpcCalls ?? 0) + 1
    state.rpcBodies = [...(state.rpcBodies ?? []), JSON.parse(route.request().postData() ?? '{}')]
    return route.fulfill(json(state.company ? state.allowance : { ok: false, error: 'no_org' }))
  })
  await page.route('**/rest/v1/rpc/list_my_polls', (route) => route.fulfill(json(state.polls ?? [])))
  await page.route('**/rest/v1/polls*', (route) => {
    if (route.request().method() !== 'DELETE') return route.fulfill(json([]))
    state.deleted = true
    return route.fulfill(json([{ id: 'live1' }]))
  })
}

const port = await freePort()
const server = await startDevServer(port)
const browser = await launch()
// `localhost`, not 127.0.0.1: Vite binds the hostname (see booking.e2e.mjs).
const BASE = `http://localhost:${port}/`

async function openPage(state) {
  const page = await browser.newPage()
  page.on('pageerror', (e) => console.log(`  (page error: ${e.message})`))
  await seedSuiteSession(page)
  await stubBackend(page, state)
  await page.goto(BASE)
  // The signed-in line shows once the suite session resolves.
  await page.getByText('Creating as').first().waitFor({ timeout: 20000 })
  await page.waitForTimeout(800)
  return page
}

const usage = (page) => page.getByTestId('free-allowance-usage')
const banner = (page) => page.getByTestId('free-allowance-limit')
const textOf = async (loc) => ((await loc.count()) ? (await loc.first().textContent())?.trim() : null)

async function visible(page) {
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.waitForTimeout(600)
}

try {
  console.log('Below 80%: nothing said')
  {
    const state = { company: true, allowance: allowance(3) }
    const page = await openPage(state)
    check('the RPC was asked, for polling', state.rpcCalls > 0 && state.rpcBodies[0]?.p_app === 'polling', JSON.stringify(state.rpcBodies))
    check('no count line', (await usage(page).count()) === 0)
    check('no banner', (await banner(page).count()) === 0)
    check('app_free_tokens is not read', !state.flagReads, `reads: ${state.flagReads}`)
    await page.close()
  }

  console.log('From 80%: a quiet count, with the backend numbers')
  {
    const state = { company: true, allowance: allowance(8) }
    const page = await openPage(state)
    const t = await textOf(usage(page))
    check('count line says 8 of 10', t === "You've used 8 of your 10 free active polls.", t ?? 'missing')
    check('no banner yet', (await banner(page).count()) === 0)
    await page.close()
  }
  {
    const state = { company: true, allowance: allowance(16, 20) }
    const page = await openPage(state)
    const t = await textOf(usage(page))
    check('a different backend limit is followed (16 of 20)', t === "You've used 16 of your 20 free active polls.", t ?? 'missing')
    await page.close()
  }

  console.log('At the limit, then a poll expires')
  {
    const state = { company: true, allowance: allowance(10) }
    const page = await openPage(state)
    const t = await textOf(banner(page))
    check('banner names the limit', !!t && t.startsWith("You've used all 10 of your free active polls."), t ?? 'missing')
    check('no count line beside the banner', (await usage(page).count()) === 0)
    // An expiry: the live count drops, the flag (stubbed 'held') does not.
    state.allowance = allowance(9)
    await visible(page)
    check('banner gone once the RPC counts one fewer live poll', (await banner(page).count()) === 0)
    const t2 = await textOf(usage(page))
    check('count line now shows 9 of 10', t2 === "You've used 9 of your 10 free active polls.", t2 ?? 'missing')
    check('app_free_tokens still never read', !state.flagReads, `reads: ${state.flagReads}`)
    await page.close()
  }

  console.log('At the limit with purchased tokens: no banner')
  {
    const state = { company: true, credits: 3, allowance: allowance(10) }
    const page = await openPage(state)
    check('no banner while purchased tokens remain', (await banner(page).count()) === 0)
    await page.close()
  }

  console.log('Deleting a poll re-reads the allowance')
  {
    const future = new Date(Date.now() + 7 * 86400_000).toISOString()
    const state = {
      company: true,
      allowance: allowance(10),
      polls: [{
        id: 'live1', title: 'Team lunch', host_user_id: USER_ID, timezone: 'Europe/London', mode: 'times',
        slots: [{ id: 's1', start: '2026-12-01T12:00', durationMins: 60 }], theme: 'orange', branding: null,
        location: null, booking_mode: false, final_slot_id: null, final_notified_slot_id: null,
        booking_notify_failed: null, notify_on_response: false, editing_since: null,
        created_at: '2026-10-01T09:00:00Z', expires_at: future, response_count: 0,
      }],
    }
    const page = await openPage(state)
    check('banner showing before the delete', (await banner(page).count()) === 1)
    state.allowance = allowance(9)
    await page.getByRole('button', { name: 'Delete', exact: true }).first().click()
    await page.getByRole('button', { name: /^Delete/ }).last().click()
    await page.waitForTimeout(800)
    check('the delete went to the backend', state.deleted === true)
    check('banner gone after the delete', (await banner(page).count()) === 0)
    await page.close()
  }

  console.log('No company: the app says nothing, as before')
  {
    const state = { company: false, allowance: allowance(10) }
    const page = await openPage(state)
    check('no count line', (await usage(page).count()) === 0)
    check('no banner', (await banner(page).count()) === 0)
    await page.close()
  }
} finally {
  await browser.close()
  server.kill()
}
finish()
