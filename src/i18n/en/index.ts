// English (en-GB): the source, and the shape every other language follows. One
// file per namespace; a key is `<namespace>.<key>` everywhere else.
import common from './common.ts'
import app from './app.ts'
import native from './native.ts'
import create from './create.ts'
import settings from './settings.ts'
import slots from './slots.ts'
import poll from './poll.ts'
import share from './share.ts'
import mypolls from './mypolls.ts'
import links from './links.ts'
import lib from './lib.ts'

export const en = { common, app, native, create, settings, slots, poll, share, mypolls, links, lib }

/** The shape every language must match exactly, once it is finished. */
export type Messages = {
  [N in keyof typeof en]: { [K in keyof (typeof en)[N]]: string }
}

/**
 * A language being translated: every namespace, any subset of its keys. A key
 * left out shows in English (runtime.ts falls back key by key), so the app
 * builds and runs while a translation is part done. A misspelt or stale key is
 * still a `tsc` error — an object literal typed as this rejects keys English
 * does not have. Completeness is checked by `npm run i18n:check` (see
 * i18n.test.ts), which is the gate before a release.
 */
export type Draft = {
  [N in keyof Messages]: Partial<Messages[N]>
}
