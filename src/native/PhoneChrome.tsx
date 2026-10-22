import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  parseArticleBody,
  translateNav,
  useLanguage,
  useDefaultView,
  useResetAppDefaults,
  type Language,
  type ThemePref,
} from '@unisim/sdk'
import credits from '../generated/credits.json'
import ProductLogo from '../components/ProductLogo'
import { openAppSettings, resetAppPreferences } from '../lib/appSettings'
import { SLOT_VIEW_DEFAULT_ID, SLOT_VIEW_DEFAULTS, SLOT_VIEW_LABELS, type SlotViewDefault } from '../components/SlotPicker'
import { useThemeStore } from '../stores/themeStore'
import { loadArticles } from '../knowledge'
import type { Article } from '../knowledge/types'
import { PhonePage } from './parts'

// The phone app's own chrome, in place of the SDK's UniversalAppsNavBar and the
// dialogs it opens (Actions ▸ Tune this app, About this app, Knowledge base,
// the profile menu, the suite switcher):
//
//   • a slim top bar: the app's mark and name, a back link on a poll page, and
//     a Tune button;
//   • Tune this app as a PAGE, with the knowledge base, an article and About
//     as pages over it, each with its back link, the left-edge swipe and
//     Android's Back.
//
// No suite switcher, no sign-in, no changelog and no links to other apps
// (Docs_UNI_SIM/store-listings/README.md §7). The SDK's own words are used for
// its rows (translateNav), so they come in every suite language.

const REPO_URL = 'https://github.com/universal-simulation-ltd/Universal_Date_Polling'

type Layer = 'tune' | 'kb' | 'about'

export function PhoneBar({ view, pollBase }: { view: 'create' | 'poll'; pollBase: string }) {
  const { language } = useLanguage()
  const sdk = (key: string) => translateNav(language, key)
  const [layers, setLayers] = useState<Layer[]>([])
  const push = (l: Layer) => setLayers((s) => [...s, l])
  const pop = () => setLayers((s) => s.slice(0, -1))
  const tuneLabel = sdk('prefs.app_preferences')

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="flex h-12 items-center gap-2 px-2">
          {view === 'poll' ? (
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) window.history.back()
                else window.location.href = pollBase
              }}
              className="flex min-h-[44px] items-center gap-0.5 px-1.5 text-[16px] text-orange-700 dark:text-orange-400"
            >
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
              Back
            </button>
          ) : (
            <span className="flex items-center gap-2 px-2">
              <ProductLogo />
              <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-slate-100">Date Polling</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => push('tune')}
            aria-label={tuneLabel}
            className="ml-auto grid h-11 w-11 place-items-center rounded-full text-slate-600 dark:text-slate-300 active:bg-slate-100 dark:active:bg-slate-800"
          >
            <TuneIcon />
          </button>
        </div>
      </header>

      {layers.map((l, i) => {
        const z = 1150 + i * 10
        if (l === 'tune') return <TunePage key={i} z={z} view={view} onBack={pop} onOpen={push} />
        if (l === 'kb') return <KnowledgePage key={i} z={z} back={tuneLabel} onBack={pop} />
        return <AboutPage key={i} z={z} back={tuneLabel} onBack={pop} />
      })}
    </>
  )
}

function TuneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2.2" />
      <circle cx="10" cy="17" r="2.2" />
    </svg>
  )
}

function Group({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200/80 dark:ring-slate-800 [&>*+*]:border-t [&>*+*]:border-slate-100 dark:[&>*+*]:border-slate-800">
      {children}
    </div>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

function LinkRow({ label, note, onClick }: { label: string; note?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-[52px] w-full items-center gap-3 px-4 py-2.5 text-left active:bg-slate-50 dark:active:bg-slate-800">
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] text-slate-900 dark:text-slate-100">{label}</span>
        {note && <span className="mt-0.5 block text-[13px] text-slate-500 dark:text-slate-400">{note}</span>}
      </span>
      <Chevron />
    </button>
  )
}

/** A row whose value is chosen with the phone's own picker: a <select> laid over it. */
function PickerRow<T extends string>({ label, value, options, onChange }: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <label className="relative flex min-h-[52px] w-full items-center gap-3 px-4">
      <span className="flex-1 text-[16px] text-slate-900 dark:text-slate-100">{label}</span>
      <span className="max-w-[55%] truncate text-[15px] text-slate-500 dark:text-slate-400">{options.find((o) => o.value === value)?.label}</span>
      <Chevron />
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="absolute inset-0 h-full w-full opacity-0" aria-label={label}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

function TunePage({ z, view, onBack, onOpen }: { z: number; view: 'create' | 'poll'; onBack: () => void; onOpen: (l: Layer) => void }) {
  const { language, appLanguage, globalLanguage, setAppLanguage } = useLanguage()
  const sdk = (key: string) => translateNav(language, key)
  const override = useThemeStore((s) => s.override)
  const global = useThemeStore((s) => s.global)
  const [done, setDone] = useState(false)
  const reset = useResetAppDefaults(resetAppPreferences, useThemeStore)

  const schemeName = (p: ThemePref) => sdk(`prefs.${p}`)
  const follow = (value: string) => sdk('prefs.follow_global').replace('{value}', value)

  return (
    <PhonePage z={z} title={sdk('prefs.app_preferences')} back={view === 'poll' ? 'Poll' : 'New poll'} onBack={onBack}>
      <div className="flex flex-col gap-5">
        {view === 'create' && (
          <Group>
            <LinkRow
              label="This poll's options"
              note="Booking page, link expiry, response alerts, calendar and timezone"
              onClick={() => {
                onBack()
                openAppSettings()
              }}
            />
            {/* The double-tap default's twin, for anybody who can't double-tap,
                on the phone's own picker. */}
            <SlotViewRow />
          </Group>
        )}

        <Group>
          <PickerRow<'global' | ThemePref>
            label={sdk('prefs.color_scheme')}
            value={override ?? 'global'}
            options={[
              { value: 'global', label: follow(schemeName(global)) },
              { value: 'light', label: schemeName('light') },
              { value: 'dark', label: schemeName('dark') },
              { value: 'system', label: schemeName('system') },
            ]}
            onChange={(v) => useThemeStore.getState().setOverride(v === 'global' ? null : v)}
          />
          <PickerRow<'global' | Language>
            label={sdk('prefs.language')}
            value={appLanguage ?? 'global'}
            options={[
              { value: 'global', label: follow(LANGUAGE_LABELS[globalLanguage]) },
              ...SUPPORTED_LANGUAGES.map((l) => ({ value: l, label: LANGUAGE_LABELS[l] })),
            ]}
            onChange={(v) => setAppLanguage(v === 'global' ? null : v)}
          />
        </Group>

        <Group>
          <LinkRow label={sdk('menu.knowledge_base')} onClick={() => onOpen('kb')} />
          <LinkRow label={sdk('menu.about_app')} onClick={() => onOpen('about')} />
        </Group>

        <button
          type="button"
          onClick={() => {
            reset()
            setDone(true)
          }}
          className="min-h-[50px] rounded-2xl bg-white dark:bg-slate-900 text-[16px] text-red-700 dark:text-red-400 ring-1 ring-slate-200/80 dark:ring-slate-800"
        >
          {sdk('prefs.reset_defaults')}
        </button>
        {done && (
          <p role="status" className="-mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            {sdk('prefs.reset_done')}
          </p>
        )}

        <Credit language={language} />
      </div>
    </PhonePage>
  )
}

function SlotViewRow() {
  const view = useDefaultView<SlotViewDefault>(SLOT_VIEW_DEFAULT_ID, 'none', { views: SLOT_VIEW_DEFAULTS })
  return (
    <PickerRow<SlotViewDefault>
      label="Availability opens on"
      value={view.defaultView}
      options={SLOT_VIEW_DEFAULTS.map((v) => ({ value: v, label: v === 'none' ? 'Nothing picked' : SLOT_VIEW_LABELS[v] }))}
      onChange={(v) => view.setDefaultView(v === 'none' ? null : v)}
    />
  )
}

/** The credit, in the SDK's translated sentence, with its two links. */
function Credit({ language }: { language: string }) {
  const sentence = translateNav(language, 'about.designed_by')
  const team = translateNav(language, 'about.the_team')
  const parts = sentence.split(/(\{designer\}|\{team\})/)
  return (
    <p className="px-2 text-center text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
      {parts.map((p, i) =>
        p === '{designer}' ? (
          <a key={i} href="https://jamesmarkey.co.uk" target="_blank" rel="noreferrer" className="font-medium text-slate-700 dark:text-slate-300 underline underline-offset-2">James Markey MBE</a>
        ) : p === '{team}' ? (
          <a key={i} href="https://www.unisim.co.uk" target="_blank" rel="noreferrer" className="font-medium text-slate-700 dark:text-slate-300 underline underline-offset-2">{team}</a>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
      <span className="mt-1 block tabular-nums text-slate-400">v{__APP_VERSION__}</span>
    </p>
  )
}

function AboutPage({ z, back, onBack }: { z: number; back: string; onBack: () => void }) {
  const { language } = useLanguage()
  const sdk = (key: string) => translateNav(language, key)
  const ships = credits.ships as { name: string; title: string; licence: string; repo?: string; description?: string }[]
  return (
    <PhonePage z={z} title="Universal Date Polling" back={back} onBack={onBack}>
      <div className="flex flex-col gap-5">
        <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
          Propose some times, share one link, and see when everyone is free. Nobody needs an account to answer.
        </p>
        <Group>
          <div className="flex min-h-[52px] items-center px-4">
            <span className="flex-1 text-[16px] text-slate-900 dark:text-slate-100">{sdk('about.version')}</span>
            <span className="tabular-nums text-[15px] text-slate-500 dark:text-slate-400">{__APP_VERSION__}</span>
          </div>
          <LinkRow label={sdk('about.view_source')} onClick={() => window.open(REPO_URL, '_blank', 'noopener')} />
        </Group>
        <p className="px-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
          {sdk('about.open_source_body').replace('{licence}', 'AGPL-3.0')}
        </p>
        <div>
          <h3 className="px-1 pb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{sdk('about.built_with')}</h3>
          <Group>
            {ships.map((p) => (
              <div key={p.name} className="px-4 py-2.5">
                <p className="text-[15px] text-slate-900 dark:text-slate-100">
                  {p.title} <span className="text-[12px] text-slate-400">{p.licence}</span>
                </p>
                {p.description && <p className="text-[13px] text-slate-500 dark:text-slate-400">{p.description}</p>}
              </div>
            ))}
            <LinkRow
              label={sdk('about.all_packages').replace('{count}', String(credits.noticesCount))}
              onClick={() => window.open(`${REPO_URL}/blob/main/THIRD-PARTY-NOTICES.md`, '_blank', 'noopener')}
            />
          </Group>
        </div>
        <Credit language={language} />
      </div>
    </PhonePage>
  )
}

/** Accents and case away, so "resume" finds "résumé". */
function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

function KnowledgePage({ z, back, onBack }: { z: number; back: string; onBack: () => void }) {
  const { language } = useLanguage()
  const sdk = (key: string) => translateNav(language, key)
  const [list, setList] = useState<Article[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [reading, setReading] = useState<Article | null>(null)

  useEffect(() => {
    let live = true
    loadArticles(language)
      .then((l) => live && setList(l))
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [language])

  const shown = useMemo(() => {
    if (!list) return []
    const q = fold(query.trim())
    if (!q) return list
    return list.filter((a) => fold(`${a.title} ${a.summary ?? ''} ${a.body}`).includes(q))
  }, [list, query])

  const groups = useMemo(() => [...new Set(shown.map((a) => a.group ?? ''))], [shown])
  const title = sdk('menu.knowledge_base')

  return (
    <>
      <PhonePage z={z} title={title} back={back} onBack={onBack}>
        {/* Never focused for the reader: a pull down on the page puts the
            finger in it (BRANDING.md). */}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          aria-label="Search"
          className="h-11 w-full rounded-xl bg-white dark:bg-slate-900 px-3.5 text-[16px] text-slate-900 dark:text-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 outline-none focus:ring-orange-500"
        />
        {failed && <p className="mt-4 text-sm text-slate-500">{sdk('kb.load_failed')}</p>}
        {!list && !failed && <p className="mt-4 text-sm text-slate-500">{sdk('kb.loading')}</p>}
        <div className="mt-5 flex flex-col gap-5">
          {groups.map((g) => (
            <div key={g}>
              {g && <h3 className="px-1 pb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{g}</h3>}
              <Group>
                {shown.filter((a) => (a.group ?? '') === g).map((a) => (
                  <LinkRow key={a.id} label={a.title} note={a.summary} onClick={() => setReading(a)} />
                ))}
              </Group>
            </div>
          ))}
        </div>
      </PhonePage>
      {reading && list && (
        <ArticlePage
          z={z + 5}
          article={reading}
          back={title}
          list={list}
          onTurn={setReading}
          onBack={() => setReading(null)}
        />
      )}
    </>
  )
}

/** `**bold**` inside a line, the one inline mark the articles use. */
function inline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  )
}

function ArticlePage({ z, article, list, back, onTurn, onBack }: {
  z: number
  article: Article
  list: Article[]
  back: string
  onTurn: (a: Article) => void
  onBack: () => void
}) {
  const { language } = useLanguage()
  const sdk = (key: string) => translateNav(language, key)
  const blocks = useMemo(() => parseArticleBody(article.body), [article.body])
  const at = list.findIndex((a) => a.id === article.id)
  const prev = at > 0 ? list[at - 1] : null
  const next = at >= 0 && at < list.length - 1 ? list[at + 1] : null
  return (
    <PhonePage key={article.id} z={z} title={article.title} description={article.summary} back={back} onBack={onBack}>
      <div className="flex flex-col gap-3 text-[16px] leading-relaxed text-slate-700 dark:text-slate-300">
        {blocks.map((b, i) => {
          if (b.kind === 'h') return <h3 key={i} className="mt-2 text-[19px] font-bold text-slate-900 dark:text-slate-100">{inline(b.text)}</h3>
          if (b.kind === 'p') return <p key={i}>{inline(b.text)}</p>
          const List = b.kind === 'ul' ? 'ul' : 'ol'
          return (
            <List key={i} className={`flex flex-col gap-1.5 pl-5 ${b.kind === 'ul' ? 'list-disc' : 'list-decimal'}`}>
              {b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}
            </List>
          )
        })}
      </div>
      {article.sources && article.sources.length > 0 && (
        <div className="mt-6">
          <h3 className="px-1 pb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{sdk('kb.sources')}</h3>
          <Group>
            {article.sources.map((s) => (
              <LinkRow key={s.href} label={s.title} note={[sdk(`kb.kind.${s.kind}`), s.publisher, s.year].filter(Boolean).join(' · ')} onClick={() => window.open(s.href, '_blank', 'noopener')} />
            ))}
          </Group>
        </div>
      )}
      <div className="mt-6 flex gap-2.5">
        {prev && (
          <button type="button" onClick={() => onTurn(prev)} className="min-h-[48px] flex-1 truncate rounded-xl bg-white dark:bg-slate-900 px-3 text-[15px] text-slate-700 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-800">
            ‹ {sdk('kb.previous')}
          </button>
        )}
        {next && (
          <button type="button" onClick={() => onTurn(next)} className="min-h-[48px] flex-1 truncate rounded-xl bg-white dark:bg-slate-900 px-3 text-[15px] text-slate-700 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-800">
            {sdk('kb.next')} ›
          </button>
        )}
      </div>
    </PhonePage>
  )
}
