// The parts every browser suite here needs: find Playwright, launch a browser
// that actually exists on this machine, run the dev server on a free port, and
// count checks. booking.e2e.mjs predates this file and still carries its own
// copy; the newer suites share this one.

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Playwright lives in whichever sibling app installed it — this repo doesn't
// carry it. Resolved by looking rather than by naming a sibling, so a machine
// without that particular checkout can still run the suite.
async function importPlaywright() {
  const apps = path.resolve(ROOT, '..')
  for (const dir of fs.readdirSync(apps)) {
    const candidate = path.join(apps, dir, 'node_modules', 'playwright', 'index.mjs')
    if (fs.existsSync(candidate)) return import(pathToFileURL(candidate).href).then((m) => m.default ?? m)
  }
  throw new Error('No playwright install found in a sibling Universal app')
}

/** Launch, falling back to whatever headless-shell build the shared browser
 *  cache actually holds — the sibling's Playwright pins one revision, and the
 *  cache holds whichever was downloaded last. */
export async function launch() {
  const { chromium } = await importPlaywright()
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

export async function freePort() {
  return new Promise((resolve) => {
    const probe = net.createServer()
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address()
      probe.close(() => resolve(port))
    })
  })
}

export function startDevServer(port) {
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

/** Checks that print as they go; `finish()` prints the tally and fails the
 *  process if anything failed. */
export function checker() {
  let passed = 0
  const failures = []
  return {
    check(name, condition, detail = '') {
      if (condition) {
        passed += 1
        console.log(`  ok   ${name}`)
      } else {
        failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
        console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`)
      }
    },
    finish() {
      console.log(`\n${passed} passed, ${failures.length} failed`)
      if (failures.length) {
        for (const f of failures) console.log(`  - ${f}`)
        process.exit(1)
      }
    },
  }
}

/** A JWT-shaped token: supabase-js reads claims off the access token, so a bare
 *  string is rejected before it ever reaches a stubbed endpoint. */
export function fakeJwt(sub, exp) {
  const part = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  return `${part({ alg: 'HS256', typ: 'JWT' })}.${part({ sub, exp, role: 'authenticated', aud: 'authenticated' })}.sig`
}

/** Sign the page in as a Polling email-OTP host: the session the app's own
 *  client persists under `unipoll-auth`. Pair it with a stubbed
 *  `/auth/v1/user` that returns the same user. */
export async function seedHostSession(page, hostId, email = 'host@example.com') {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const session = {
    access_token: fakeJwt(hostId, exp), refresh_token: 'fake-refresh', token_type: 'bearer',
    expires_in: 3600, expires_at: exp,
    user: { id: hostId, email, aud: 'authenticated', role: 'authenticated' },
  }
  await page.addInitScript((s) => { localStorage.setItem('unipoll-auth', s) }, JSON.stringify(session))
}
