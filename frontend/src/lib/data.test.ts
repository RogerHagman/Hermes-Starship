import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadLiveRails, railsSource } from './data';

const live = { asOf: '2026-11-05T09:00:00Z', synthetic: false, rails: [] };

describe('live rails', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('uses a real reading', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(live))));
    expect(await loadLiveRails()).toEqual(live);
  });

  it('keeps the sample when there is no file, a sample file or junk', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 })));
    expect(await loadLiveRails()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ...live, synthetic: true }))));
    expect(await loadLiveRails()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => new Response('not json')));
    expect(await loadLiveRails()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    expect(await loadLiveRails()).toBeNull();
  });

  it('says where the numbers come from', () => {
    const at = Date.parse(live.asOf);
    expect(railsSource({ ...live, synthetic: true }, at)).toBe('sample');
    expect(railsSource(live, at + 60_000)).toBe('live');
    expect(railsSource(live, at + 6 * 60_000)).toBe('stale');
  });
});

describe('the rail log becomes the duty log', () => {
  // Imported here so the fixtures load once for these tests only.
  const load = async () => {
    const { dutyFromRailLog, withLiveDuty } = await import('./data');
    const stations = (await import('../../../fixtures/stations.json')).default as never;
    const shiplog = (await import('../../../fixtures/shiplog.json')).default as never;
    return { dutyFromRailLog, withLiveDuty, stations, shiplog };
  };
  const log = (events: { at: string; rail: 'local' | 'codex' | 'claude'; state: 'out' | 'up' }[]) =>
    ({ asOf: '2026-11-05T12:00:00Z', synthetic: false, events });

  it('a Codex window running out sends the Codex crew to quarters, and its reset brings them back', async () => {
    const { dutyFromRailLog, stations } = await load();
    const lines = dutyFromRailLog((stations as { stations: never[] }).stations, log([
      { at: '2026-11-05T10:00:00Z', rail: 'codex', state: 'up' },
      { at: '2026-11-05T08:00:00Z', rail: 'codex', state: 'out' },
    ]));
    const out = lines.filter((l) => l.dir === 'out').map((l) => l.station).sort();
    expect(out).toEqual(['diag', 'eng', 'science', 'sys']);
    expect(lines.filter((l) => l.dir === 'in').length).toBe(4);
    expect(lines[0].at).toBe('2026-11-05T10:00:00Z');   // newest first
    expect(lines.find((l) => l.dir === 'out')?.text).toBe('To quarters: the Codex window ran out');
  });

  it('a crew member who needs two rails stays in quarters until both are back', async () => {
    const { dutyFromRailLog, stations } = await load();
    const lines = dutyFromRailLog((stations as { stations: never[] }).stations, log([
      { at: '2026-11-05T08:00:00Z', rail: 'codex', state: 'out' },
      { at: '2026-11-05T08:30:00Z', rail: 'local', state: 'out' },
      { at: '2026-11-05T09:00:00Z', rail: 'codex', state: 'up' },
      { at: '2026-11-05T09:30:00Z', rail: 'local', state: 'up' },
    ])).filter((l) => l.station === 'science');
    expect(lines.map((l) => [l.at, l.dir])).toEqual([['2026-11-05T09:30:00Z', 'in'], ['2026-11-05T08:00:00Z', 'out']]);
  });

  it('with a rail log, its lines replace the sample duty lines; the rest of the log stays', async () => {
    const { withLiveDuty, stations, shiplog } = await load();
    const data = { stations, shiplog } as never;
    const merged = withLiveDuty(data, log([{ at: '2026-11-05T08:00:00Z', rail: 'claude', state: 'out' }]));
    const duty = merged.shiplog.entries.filter((e) => e.kind === 'duty');
    expect(duty.map((e) => e.station).sort()).toEqual(['carto', 'sensors']);
    const others = (shiplog as { entries: { kind: string }[] }).entries.filter((e) => e.kind !== 'duty').length;
    expect(merged.shiplog.entries.length).toBe(others + 2);
    expect(withLiveDuty(data, null)).toBe(data);
  });
});
