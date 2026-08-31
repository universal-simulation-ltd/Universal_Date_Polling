import { describe, expect, it } from 'vitest'
import type { MyPoll, Slot } from './types'
import {
  confirmedLabel, deleteAllPrompt, deletePrompt, expiryLabel, isExpired, mergeMyPolls, pollSummary, responsesLabel,
  splitMyPolls,
} from './myPolls'

const NOW = Date.parse('2026-06-01T12:00:00.000Z')

const poll = (over: Partial<MyPoll> = {}): MyPoll => ({
  id: 'abc',
  title: 'Test poll',
  host_user_id: 'user-1',
  timezone: 'Europe/London',
  mode: 'times',
  slots: [],
  theme: 'orange',
  branding: null,
  location: null,
  booking_mode: false,
  final_slot_id: null,
  final_notified_slot_id: null,
  booking_notify_failed: null,
  notify_on_response: false,
  response_count: 0,
  created_at: '2026-06-01T10:00:00.000Z',
  expires_at: null,
  ...over,
})

const slot = (id: string, start: string, durationMins = 60): Slot => ({ id, start, durationMins })

describe('mergeMyPolls', () => {
  it('merges the suite-SSO and email-code lists newest-first', () => {
    const a = poll({ id: 'a', created_at: '2026-05-01T09:00:00.000Z' })
    const b = poll({ id: 'b', created_at: '2026-06-01T09:00:00.000Z' })
    expect(mergeMyPolls([a], [b]).map((p) => p.id)).toEqual(['b', 'a'])
  })

  it('never lists the same poll twice', () => {
    const a = poll({ id: 'a' })
    expect(mergeMyPolls([a], [a]).map((p) => p.id)).toEqual(['a'])
  })
})

describe('isExpired / splitMyPolls', () => {
  it('treats a poll with no expiry as live', () => {
    expect(isExpired(poll({ expires_at: null }), NOW)).toBe(false)
  })

  it('splits on the expiry instant, keeping expired polls rather than dropping them', () => {
    const live = poll({ id: 'live', expires_at: '2026-06-02T12:00:00.000Z' })
    const gone = poll({ id: 'gone', expires_at: '2026-05-31T12:00:00.000Z' })
    const { active, expired } = splitMyPolls([live, gone], NOW)
    expect(active.map((p) => p.id)).toEqual(['live'])
    expect(expired.map((p) => p.id)).toEqual(['gone'])
  })
})

describe('pollSummary', () => {
  it('gives a count and a date range for a timed poll', () => {
    const p = poll({
      slots: [slot('s1', '2026-06-10T10:00'), slot('s2', '2026-06-12T14:00'), slot('s3', '2026-06-11T09:00')],
    })
    expect(pollSummary(p)).toBe('3 times · Wed 10 Jun – Fri 12 Jun')
  })

  it('collapses to one date when every slot is on the same day', () => {
    const p = poll({ slots: [slot('s1', '2026-06-10T10:00'), slot('s2', '2026-06-10T14:00')] })
    expect(pollSummary(p)).toBe('2 times · Wed 10 Jun')
  })

  it('counts whole-day polls in dates', () => {
    const p = poll({ mode: 'days', slots: [slot('s1', '2026-06-10T00:00', 0)] })
    expect(pollSummary(p)).toBe('1 date · Wed 10 Jun')
  })
})

describe('confirmedLabel', () => {
  it('is null while the host has not chosen', () => {
    expect(confirmedLabel(poll({ slots: [slot('s1', '2026-06-10T10:00')] }))).toBeNull()
  })

  it('spells out the chosen time in the poll timezone', () => {
    const p = poll({ slots: [slot('s1', '2026-06-10T10:00')], final_slot_id: 's1' })
    expect(confirmedLabel(p)).toBe('Wed 10 Jun, 10:00–11:00')
  })

  // A final_slot_id pointing at a slot the host has since removed must not
  // crash the row — it just reads as undecided.
  it('survives a final slot that is no longer in the list', () => {
    expect(confirmedLabel(poll({ slots: [], final_slot_id: 'ghost' }))).toBeNull()
  })
})

describe('responsesLabel', () => {
  it('counts responses, singular and plural', () => {
    expect(responsesLabel(poll({ response_count: 0 }))).toBe('No responses yet')
    expect(responsesLabel(poll({ response_count: 1 }))).toBe('1 response')
    expect(responsesLabel(poll({ response_count: 4 }))).toBe('4 responses')
  })

  // A booking page is taken or it isn't; a response count would be meaningless.
  it('reports a booking page as booked or not', () => {
    expect(responsesLabel(poll({ booking_mode: true }))).toBe('Not booked yet')
    expect(responsesLabel(poll({ booking_mode: true, final_slot_id: 's1' }))).toBe('Booked')
  })
})

describe('expiryLabel', () => {
  it('says nothing for a poll that never expires', () => {
    expect(expiryLabel(poll({ expires_at: null }), NOW)).toBeNull()
  })

  it('never rounds up to a day that is not there', () => {
    expect(expiryLabel(poll({ expires_at: '2026-06-02T11:00:00.000Z' }), NOW)).toBe('Expires today')
    expect(expiryLabel(poll({ expires_at: '2026-06-02T13:00:00.000Z' }), NOW)).toBe('Expires tomorrow')
    expect(expiryLabel(poll({ expires_at: '2026-06-13T13:00:00.000Z' }), NOW)).toBe('Expires in 12 days')
  })

  it('reads as expired once the moment has passed', () => {
    expect(expiryLabel(poll({ expires_at: '2026-06-01T11:59:59.000Z' }), NOW)).toBe('Expired')
  })
})

describe('deletePrompt', () => {
  // The responses are the part that cannot be got back, so they get named.
  it('names the responses that go with the poll', () => {
    expect(deletePrompt(poll({ response_count: 0 }))).toBe('Delete this poll?')
    expect(deletePrompt(poll({ response_count: 1 }))).toBe('Delete this poll and its 1 response?')
    expect(deletePrompt(poll({ response_count: 6 }))).toBe('Delete this poll and its 6 responses?')
  })

  it('warns that deleting a booked page does not cancel the booking', () => {
    expect(deletePrompt(poll({ booking_mode: true }))).toBe('Delete this booking page?')
    expect(deletePrompt(poll({ booking_mode: true, final_slot_id: 's1', response_count: 1 })))
      .toMatch(/NOT cancelled/)
  })
})

describe('deleteAllPrompt', () => {
  it('asks about one expired poll in the singular', () => {
    expect(deleteAllPrompt(1)).toBe("Delete this expired poll and its responses? This can't be undone.")
  })

  it('asks about several in the plural', () => {
    expect(deleteAllPrompt(3)).toBe("Delete all 3 expired polls and their responses? This can't be undone.")
  })
})
