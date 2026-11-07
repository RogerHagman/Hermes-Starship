import { describe, expect, it } from 'vitest';
import type { Fixtures } from '../types';
import { BUILT_BOARDS } from './board';
import { BOARD_SOURCES, boardSources, panelSource, splitSample } from './sources';

const NAMES = ['ship', 'stations', 'rails', 'orders', 'shiplog', 'quarters', 'sensors', 'engineering', 'science', 'ops',
  'yeoman', 'helm', 'nav', 'viewscreen', 'fastpaths', 'meters'];

async function sample(): Promise<Fixtures> {
  const parts = await Promise.all(NAMES.map(async (n) => [n, (await import(`../../../fixtures/${n}.json`)).default] as const));
  return Object.fromEntries(parts) as unknown as Fixtures;
}

describe('boardSources', () => {
  it('lists what every built board reads', () => {
    for (const b of BUILT_BOARDS) expect(BOARD_SOURCES[b].length).toBeGreaterThan(0);
  });

  it('calls every part sample on the shipped fixtures', async () => {
    const data = await sample();
    for (const b of BUILT_BOARDS) {
      for (const s of boardSources(b, data)) expect(s.state, `${b} ${s.id}`).toBe('sample');
    }
  });

  it('calls a part live once a probe has replaced it, and says where from', async () => {
    const data = await sample();
    const now = Date.parse('2026-11-07T16:00:00Z');
    const live = {
      ...data,
      orders: { ...data.orders, synthetic: false },
      fastpaths: { ...data.fastpaths, synthetic: false },
      rails: { ...data.rails, synthetic: false, asOf: '2026-11-07T15:59:00Z' },
    } as Fixtures;
    const xo = boardSources('xo', live, now);
    expect(xo.map((s) => s.state)).toEqual(['live', 'live']);
    expect(xo[1].why).toContain('fast-paths.json');
    const ops = boardSources('ops', live, now);
    expect(ops.map((s) => [s.id, s.state])).toEqual([['nas', 'sample'], ['rails', 'live'], ['ops', 'sample']]);
    expect(ops[2].why).toMatch(/^Sample: no probe yet/);
  });

  it('calls rails stale when the probe stops writing', async () => {
    const data = await sample();
    const old = { ...data, rails: { ...data.rails, synthetic: false, asOf: '2026-11-07T10:00:00Z' } } as Fixtures;
    const rails = boardSources('bridge', old, Date.parse('2026-11-07T16:00:00Z')).find((s) => s.id === 'rails');
    expect(rails?.state).toBe('stale');
  });
});

describe('panelSource', () => {
  const now = Date.parse('2026-11-07T16:00:00Z');
  it('is sample on the fixtures, live once every part is live, and part sample in between', async () => {
    const data = await sample();
    expect(panelSource(['sensors'], data, now).state).toBe('sample');
    const live = { ...data, rails: { ...data.rails, synthetic: false, asOf: '2026-11-07T15:59:00Z' } } as Fixtures;
    expect(panelSource(['rails'], live, now).state).toBe('live');
    const mixed = panelSource(['rails', 'ops'], live, now);
    expect(mixed.state).toBe('mixed');
    expect(mixed.why).toContain('NETWORK · GPU · JOBS is sample');
  });
  it('is down when a live feed stops writing, even next to sample parts', async () => {
    const data = await sample();
    const old = { ...data, rails: { ...data.rails, synthetic: false, asOf: '2026-11-07T10:00:00Z' } } as Fixtures;
    const p = panelSource(['rails', 'ops'], old, now);
    expect(p.state).toBe('stale');
    expect(p.why).toMatch(/^Down: RAILS stopped writing/);
  });
});

describe('splitSample', () => {
  it('marks SAMPLE and the word after it', () => {
    expect(splitSample('12 ORDERS · SAMPLE RECORDS · READ ONLY')).toEqual([
      { text: '12 ORDERS · ', sample: false },
      { text: 'SAMPLE RECORDS', sample: true },
      { text: ' · READ ONLY', sample: false },
    ]);
  });
  it('marks a bare SAMPLE at the end, and leaves lines without one alone', () => {
    expect(splitSample('EVERY ONE CITED · SAMPLE').at(-1)).toEqual({ text: 'SAMPLE', sample: true });
    expect(splitSample('LIVE · READ 7 NOV')).toEqual([{ text: 'LIVE · READ 7 NOV', sample: false }]);
  });
});
