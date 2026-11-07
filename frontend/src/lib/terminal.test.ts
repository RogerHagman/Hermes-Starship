// The core terminal's workings: typed lines, days, pages, settings and the manual.
import { afterEach, describe, expect, it } from 'vitest';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import type { Fixtures } from '../types';
import { ALL, dayOf, find, records } from './computer';
import { makeShipView } from './ship';
import {
  DEFAULTS, MAN_SECTIONS, SETTINGS, applySet, command, isJumpKey, listOf, loadSettings, manCommands, manTopic, pageAt, saveSettings, turn,
} from './terminal';

const data = { ship, stations, rails, orders, shiplog } as unknown as Fixtures;
const view = makeShipView(data, {}, new Set());
const all = records(data);

afterEach(() => localStorage.clear());

describe('a typed line', () => {
  it('terminal commands come first, each only in its own shape', () => {
    expect(command('man', view, ALL)).toEqual({ kind: 'man' });
    expect(command('help station', view, ALL)).toEqual({ kind: 'man', topic: 'station' });
    expect(command('?', view, ALL)).toEqual({ kind: 'man' });
    expect(command('settings', view, ALL)).toEqual({ kind: 'set' });
    expect(command('set rows 100', view, ALL)).toEqual({ kind: 'set', name: 'rows', value: '100' });
    expect(command('page 3', view, ALL)).toEqual({ kind: 'page', to: 3 });
    expect(command('next', view, ALL)).toEqual({ kind: 'page', to: 'next' });
    expect(command('stats', view, ALL)).toEqual({ kind: 'stats' });
    expect(command('ord-9012', view, ALL)).toEqual({ kind: 'open', id: 'ORD-9012' });
    expect(command('   ', view, ALL)).toBeNull();
    // in their own shape only: these are searches
    expect(command('next week dentist', view, ALL)).toMatchObject({ kind: 'query', query: { words: 'next week dentist' } });
    expect(command('page two', view, ALL)).toMatchObject({ kind: 'query', query: { words: 'page two' } });
    expect(command('"set up"', view, ALL)).toMatchObject({ kind: 'query', query: { words: 'set up' } });
    expect(command('"next"', view, { ...ALL, state: 'done' })).toMatchObject({ kind: 'query', query: { state: 'done', words: 'next' } });
  });
  it('since and before set days, reach further back, and say so when a day is wrong', () => {
    const c = command('since 20/10 before 2026-10-25 state done', view, ALL);
    expect(c).toEqual({ kind: 'query', query: { state: 'done', station: null, words: '', since: '2026-10-20', before: '2026-10-25' } });
    expect(command('since any', view, { ...ALL, since: '2026-10-20' })).toEqual({ kind: 'query', query: ALL });
    expect(command('all', view, { ...ALL, since: '2026-10-20', before: '2026-10-25' })).toEqual({ kind: 'query', query: ALL });
    expect(command('since 31/02', view, ALL)).toMatchObject({ said: expect.stringContaining('31/02 is not a day') });
    expect(command('state nope', view, ALL)).toMatchObject({ said: expect.stringContaining('no state called nope') });
    expect(command('station nowhere', view, ALL)).toMatchObject({ said: expect.stringContaining('no station called nowhere') });
  });
  it('a day can be written the ship\'s way, the Swedish way or by name', () => {
    const asOf = '2026-11-07T10:00:00Z';
    expect(dayOf('2026-10-24', asOf)).toBe('2026-10-24');
    expect(dayOf('24/10', asOf)).toBe('2026-10-24');
    expect(dayOf('24/10/25', asOf)).toBe('2025-10-24');
    expect(dayOf('24/12', asOf)).toBe('2025-12-24');   // the last 24 December, not the coming one
    expect(dayOf('today', asOf)).toBe('2026-11-07');
    expect(dayOf('yesterday', '2026-11-01T10:00:00Z')).toBe('2026-10-31');
    expect(dayOf('32/10', asOf)).toBeUndefined();
    expect(dayOf('soon', asOf)).toBeUndefined();
  });
  it('the days filter by the day an order opened, or its last update without one', () => {
    const since = find(all, { ...ALL, since: '2026-11-04' });
    expect(since.length).toBeGreaterThan(0);
    expect(since.map((o) => o.id)).not.toContain('ORD-9011');   // opened on the 3rd, updated on the 4th
    expect(since.every((o) => (o.openedAt ?? o.updatedAt) >= '2026-11-03T23')).toBe(true);
    const before = find(all, { ...ALL, before: '2026-11-04' });
    expect(before.map((o) => o.id)).toContain('ORD-9011');
    expect(since.length + before.length).toBe(all.length);
    expect(find(all, { ...ALL, since: '2026-11-03', before: '2026-11-04' }).map((o) => o.id).sort()).toEqual(before.filter((o) => (o.openedAt ?? o.updatedAt) >= '2026-11-02T23').map((o) => o.id).sort());
  });
});

describe('the pages', () => {
  it('hold the rows the settings ask for, and every order is on one', () => {
    expect(pageAt(450, 200, 0)).toEqual({ at: 0, pages: 3, from: 0, to: 200 });
    expect(pageAt(450, 200, 2)).toEqual({ at: 2, pages: 3, from: 400, to: 450 });
    expect(pageAt(450, 200, 9)).toEqual({ at: 2, pages: 3, from: 400, to: 450 });   // held inside the list
    expect(pageAt(0, 200, 0)).toEqual({ at: 0, pages: 1, from: 0, to: 0 });
  });
  it('turn by number or word, and say when there is nowhere to go', () => {
    const p = pageAt(450, 200, 1);
    expect(turn('next', p)).toEqual({ page: 2 });
    expect(turn('prev', p)).toEqual({ page: 0 });
    expect(turn('last', p)).toEqual({ page: 2 });
    expect(turn(3, p)).toEqual({ page: 2 });
    expect(turn(4, p).said).toBe('page: there are 3 pages.');
    expect(turn('next', pageAt(450, 200, 2)).said).toBe('That is the last page.');
  });
  it('the list can run oldest first, and words can look in titles only', () => {
    const newest = listOf(all, ALL, DEFAULTS);
    expect(listOf(all, ALL, { ...DEFAULTS, order: 'oldest' })).toEqual([...newest].reverse());
    const q = { ...ALL, words: 'dentist' };
    expect(listOf(all, q, { ...DEFAULTS, search: 'titles' }).length).toBeLessThanOrEqual(listOf(all, q, DEFAULTS).length);
  });
});

describe('the settings', () => {
  it('set changes one, says what it is, and refuses what is not a choice', () => {
    expect(applySet(DEFAULTS, 'rows', '100')).toEqual({ settings: { ...DEFAULTS, rows: 100 }, said: 'Rows per page: 100.' });
    expect(applySet(DEFAULTS, 'order', 'oldest').settings.order).toBe('oldest');
    expect(applySet(DEFAULTS, 'colour', 'ice').settings.phosphor).toBe('blue');
    expect(applySet(DEFAULTS, 'start', 'awaiting').settings.start).toBe('awaiting-captain');
    expect(applySet(DEFAULTS, 'key', '§').settings.key).toBe('§');
    expect(applySet(DEFAULTS, 'rows').said).toBe('Rows per page: 200. Choose 50, 100, 200, 500.');
    expect(applySet(DEFAULTS, 'rows', '7')).toEqual({ settings: DEFAULTS, said: 'Rows per page: 7 is not a choice. Choose 50, 100, 200, 500.' });
    expect(applySet(DEFAULTS, 'up', 'the printer').said).toContain('no setting called up');
    expect(applySet({ ...DEFAULTS, rows: 50, order: 'oldest' }, 'defaults').settings).toEqual(DEFAULTS);
  });
  it('this browser keeps them, and anything odd in storage falls back to its default', () => {
    expect(loadSettings()).toEqual(DEFAULTS);
    saveSettings({ ...DEFAULTS, rows: 500, phosphor: 'amber' });
    expect(loadSettings()).toEqual({ ...DEFAULTS, rows: 500, phosphor: 'amber' });
    localStorage.setItem('hermes.coreTerminal', JSON.stringify({ rows: 7, order: 'sideways', key: '§' }));
    expect(loadSettings()).toEqual({ ...DEFAULTS, key: '§' });
    localStorage.setItem('hermes.coreTerminal', 'not json');
    expect(loadSettings()).toEqual(DEFAULTS);
  });
  it('every default is one of its own choices', () => {
    for (const s of SETTINGS) expect(s.choices.map((c) => c.v)).toContain(DEFAULTS[s.id]);
  });
  it('the jump key: / or § with no modifier, or Ctrl+K (Cmd+K on a Mac)', () => {
    const k = (key: string, mods: Partial<{ ctrlKey: boolean; metaKey: boolean; altKey: boolean }> = {}) =>
      ({ key, ctrlKey: false, metaKey: false, altKey: false, ...mods });
    expect(isJumpKey(k('/'), '/')).toBe(true);
    expect(isJumpKey(k('/', { ctrlKey: true }), '/')).toBe(false);
    expect(isJumpKey(k('§'), '§')).toBe(true);
    expect(isJumpKey(k('/'), '§')).toBe(false);
    expect(isJumpKey(k('k', { ctrlKey: true }), 'ctrl+k')).toBe(true);
    expect(isJumpKey(k('K', { metaKey: true }), 'ctrl+k')).toBe(true);
    expect(isJumpKey(k('k'), 'ctrl+k')).toBe(false);
  });
});

describe('the manual', () => {
  it('man <word> finds a command by any of its words, or a section', () => {
    expect(manTopic('station')).toBe('station');
    expect(manTopic('blocked')).toBe('state');
    expect(manTopic('before')).toBe('since');
    expect(manTopic('next')).toBe('page');
    expect(manTopic('ORD-1232')).toBe('ord');
    expect(manTopic('keys')).toBe('keys');
    expect(manTopic('shortcut')).toBe('keys');
    expect(manTopic('phosphor')).toBe('settings');
    expect(manTopic('overboard')).toBeUndefined();
    for (const s of MAN_SECTIONS) expect(manTopic(s)).toBe(s);
  });
  it('every line it offers to try is one the terminal understands', () => {
    for (const e of manCommands(DEFAULTS)) {
      for (const eg of e.eg ?? []) {
        const c = command(eg, view, ALL);
        expect(c, eg).not.toBeNull();
        expect(c && 'said' in c ? c.said : undefined, eg).toBeUndefined();
      }
    }
  });
  it('says the page size and the jump key the settings hold', () => {
    const m = manCommands({ ...DEFAULTS, rows: 50, key: 'ctrl+k' });
    expect(m.find((e) => e.id === 'page')!.says).toContain('50 orders a page');
    expect(m.find((e) => e.id === 'man')!.says).toContain('Ctrl+K');
  });
});
