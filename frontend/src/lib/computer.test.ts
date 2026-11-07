// The core terminal's command line and search.
import { describe, expect, it } from 'vitest';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import type { Fixtures, OrdersFile } from '../types';
import { ALL, counts, echo, find, logOf, minutes, parseCommand, records, recordsFile, span, stationOf, stats, took } from './computer';
import { makeShipView } from './ship';

const data = { ship, stations, rails, orders, shiplog } as unknown as Fixtures;
const view = makeShipView(data, {}, new Set());
const ids = (q = ALL) => find(records(data), q).map((o) => o.id);

describe('the records', () => {
  it('are every order on the boards, newest first, until the probe writes its own file', () => {
    const list = records(data);
    expect(list.length).toBe(data.orders.orders.length);
    expect(list.map((o) => o.updatedAt)).toEqual([...list.map((o) => o.updatedAt)].sort().reverse());
    const file = { asOf: '2026-11-05T20:00:00Z', synthetic: false, orders: [
      { id: 'ORD-1100', title: 'Old and done', station: 'xo', state: 'done', updatedAt: '2026-10-20T11:00:00Z' },
    ] } as OrdersFile;
    expect(recordsFile({ ...data, records: file })).toBe(file);
    expect(records({ ...data, records: file }).map((o) => o.id)).toEqual(['ORD-1100']);
  });
  it('are counted per state', () => {
    const n = counts(records(data));
    expect(Object.values(n).reduce((a, b) => a + b, 0)).toBe(data.orders.orders.length);
    expect(n.done).toBe(data.orders.orders.filter((o) => o.state === 'done').length);
  });
});

describe('the command line', () => {
  it('an order number opens its record, in any case', () => {
    expect(parseCommand('ord-9012', view, ALL)).toEqual({ query: ALL, open: 'ORD-9012' });
    expect(parseCommand('  ORD-9012 ', view, ALL).open).toBe('ORD-9012');
  });
  it('sets a state, a station or both, and keeps the rest as words', () => {
    expect(parseCommand('state done', view, ALL).query).toEqual({ state: 'done', station: null, words: '' });
    expect(parseCommand('awaiting', view, ALL).query.state).toBe('awaiting-captain');
    expect(parseCommand('open', view, ALL).query.state).toBe('open');
    expect(parseCommand('station forge sample patch', view, ALL).query).toEqual({ state: 'all', station: 'eng', words: 'sample patch' });
    expect(parseCommand('status running station sensors', view, ALL).query).toEqual({ state: 'running', station: 'sensors', words: '' });
    // A state word among other words is just a word to find.
    expect(parseCommand('done dentist', view, ALL).query).toEqual({ state: 'all', station: null, words: 'done dentist' });
  });
  it('all clears the filters', () => {
    expect(parseCommand('all', view, { state: 'done', station: 'eng', words: 'x' }).query).toEqual(ALL);
  });
  it('knows a station by its id, short name, alias or profile', () => {
    expect(['eng', 'Engineering', 'chief', 'forge'].map((w) => stationOf(view, w))).toEqual(['eng', 'eng', 'eng', 'eng']);
    expect(stationOf(view, 'nobody')).toBeUndefined();
  });
  it('echoes the query as a command', () => {
    expect(echo(ALL, view)).toBe('records');
    expect(echo({ state: 'open', station: 'eng', words: 'patch' }, view)).toBe('records --state open --station engineering "patch"');
  });
});

describe('the search', () => {
  it('filters by state, open, station and words in the brief and the replies', () => {
    expect(ids({ ...ALL, state: 'review' })).toEqual(['ORD-9010']);
    expect(ids({ ...ALL, state: 'open' })).not.toContain('ORD-9009');
    expect(ids({ ...ALL, state: 'open' }).length).toBe(records(data).filter((o) => o.state !== 'done').length);
    expect(ids({ ...ALL, station: 'eng' }).sort()).toEqual(['ORD-9012', 'ORD-9015']);
    expect(ids({ ...ALL, words: 'dentist' }).sort()).toEqual(['ORD-9005', 'ORD-9008']);
    expect(ids({ ...ALL, words: 'containers sweep' })).toEqual(['ORD-9009']);   // both words, from a reply
    expect(ids({ ...ALL, words: 'nothing-like-this' })).toEqual([]);
  });
});

describe('the log and the minutes', () => {
  it('logOf gives an order\'s log lines, oldest first', () => {
    const id = data.shiplog.entries.find((e) => /ORD-\d{4}/.test(e.text))!.text.match(/ORD-\d{4}/)![0];
    const lines = logOf(data, id);
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.every((l) => l.text.includes(id))).toBe(true);
    expect(lines.map((l) => l.at)).toEqual([...lines.map((l) => l.at)].sort());
  });
  it('minutes are the briefings, newest first', () => {
    const list = minutes(data);
    expect(list.length).toBe(data.shiplog.entries.filter((e) => e.kind === 'briefing').length);
    expect(list[0].at >= list[list.length - 1].at).toBe(true);
  });
});

describe('the numbers', () => {
  const at = (id: string) => records(data).find((o) => o.id === id)!;
  it('time to close is from opening to closing, for done orders only', () => {
    expect(took(at('ORD-9008'))).toBe(8);
    expect(took(at('ORD-9016'))).toBeNull();   // still running
    expect(took({ ...at('ORD-9008'), openedAt: undefined })).toBeNull();
  });
  it('spans read short', () => {
    expect([span(0.2), span(45), span(89), span(210), span(60 * 30), span(60 * 60)]).toEqual(['1 MIN', '45 MIN', '89 MIN', '3.5 H', '30 H', '2.5 DAYS']);
  });
  it('counts orders per ship\'s day, the last 14 ending on the file\'s day', () => {
    const s = stats(records(data), data.orders.asOf);
    expect(s.days.length).toBe(14);
    expect(s.days[13].key).toBe('2026-11-04');
    expect(s.days[13].label).toBe('WED 4 NOV');
    expect(s.days[0].key).toBe('2026-10-22');
    expect(s.days.reduce((n, d) => n + d.opened, 0)).toBe(data.orders.orders.length);
    expect(s.days.reduce((n, d) => n + d.closed, 0)).toBe(data.orders.orders.filter((o) => o.state === 'done').length);
    expect(s.week).toEqual({ opened: 18, closed: 9 });
  });
  it('a late-evening order counts on the Stockholm day it came in', () => {
    const late = { id: 'ORD-1', title: 't', station: 'xo', state: 'queued', updatedAt: '2026-11-03T23:30:00Z', openedAt: '2026-11-03T23:30:00Z' } as const;
    const s = stats([late], '2026-11-04T10:00:00Z', 3);
    expect(s.days.map((d) => d.opened)).toEqual([0, 0, 1]);   // 00:30 on the 4th in Stockholm
  });
  it('gives the median time to close per station, slowest first, the surfaces and chat or card', () => {
    const s = stats(records(data), data.orders.asOf);
    expect(s.timed).toBe(9);
    expect(s.median).toBe(45);
    expect(s.stations[0]).toEqual({ id: 'nav', done: 2, median: (35 + 1260) / 2 });
    expect(s.stations.map((x) => x.median)).toEqual([...s.stations.map((x) => x.median)].sort((a, b) => b - a));
    expect(s.surfaces).toEqual([{ id: 'desktop', n: 7 }, { id: 'telegram', n: 7 }, { id: 'dashboard', n: 4 }]);
    expect([s.card, s.chat]).toEqual([18, 0]);
    const chat = stats([{ ...at('ORD-9008'), cards: 0 }, { ...at('ORD-9009'), cards: undefined }], data.orders.asOf);
    expect([chat.card, chat.chat]).toEqual([0, 1]);   // an older record that doesn't say counts as neither
  });
});
