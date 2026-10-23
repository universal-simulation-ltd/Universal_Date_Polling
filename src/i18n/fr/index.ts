// French (fr). One file per namespace, the same split as ../en.
import type { Draft } from '../en/index.ts'
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

export const fr: Draft = { common, app, native, create, settings, slots, poll, share, mypolls, links, lib }
