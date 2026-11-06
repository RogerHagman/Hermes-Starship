// The core terminal's command line and search.
import { describe, expect, it } from 'vitest';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import type { Fixtures, OrdersFile } from '../types';
import { ALL, counts, echo, find, logOf, minutes, parseCommand, records, recordsFile, stationOf } from './computer';
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
