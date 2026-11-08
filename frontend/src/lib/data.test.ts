import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadLiveHelm, loadLiveOrders, loadLiveRails, loadLiveRecords, loadLiveShipLog, loadLiveYeoman, nasSource, railsSource, withLive, withLiveNas, withLiveOrders } from './data';
import type { Fixtures, HelmFile, NasFile, OrdersFile, ShipLogFile, YeomanFile } from '../types';

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
    expect(duty.map((e) => e.station).sort()).toEqual(['carto', 'holo', 'sensors']);
    const others = (shiplog as { entries: { kind: string }[] }).entries.filter((e) => e.kind !== 'duty').length;
    expect(merged.shiplog.entries.length).toBe(others + 3);
    expect(withLiveDuty(data, null)).toBe(data);
  });
});

describe('live orders and log', () => {
  afterEach(() => vi.unstubAllGlobals());
  const base = async () => {
    const [stations, orders, shiplog] = await Promise.all(['stations', 'orders', 'shiplog'].map((n) => import(`../../../fixtures/${n}.json`)));
    return { stations: stations.default, orders: orders.default, shiplog: shiplog.default } as unknown as Fixtures;
  };
  const orders = { asOf: '2026-11-05T20:00:00Z', synthetic: false, orders: [
    { id: 'ORD-1201', title: 'Fix the reminder time', station: 'eng', state: 'running', updatedAt: '2026-11-05T18:01:00Z' },
    { id: 'ORD-1203', title: 'Message on dashboard', station: 'xo', state: 'queued', updatedAt: '2026-11-05T19:00:00Z' },
  ] } as OrdersFile;
  const shiplog = { asOf: '2026-11-05T20:00:00Z', synthetic: false, entries: [
    { at: '2026-11-05T18:00:00Z', station: 'xo', kind: 'order', text: 'ORD-1201 opened: Fix the reminder time' },
  ] } as ShipLogFile;

  it('reads the ship probe\'s files, and only real ones', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(orders))));
    expect(await loadLiveOrders()).toEqual(orders);
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ...orders, synthetic: true }))));
    expect(await loadLiveOrders()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ asOf: orders.asOf, synthetic: false }))));
    expect(await loadLiveShipLog()).toBeNull();
  });

  it('live orders replace the samples, and each station works on its newest running order', async () => {
    const data = withLiveOrders(await base(), orders, null);
    expect(data.orders.orders.map((o) => o.id)).toEqual(['ORD-1201', 'ORD-1203']);
    const st = (id: string) => data.stations.stations.find((s) => s.id === id);
    expect(st('eng')?.activeOrder).toBe('ORD-1201');
    expect(st('sys')?.activeOrder).toBeNull();   // its sample order is gone
  });

  it('a live log replaces the sample lines; without a rail log no sample duty lines stay', async () => {
    const data = withLive(await base(), { rails: null, raillog: null, orders: null, shiplog });
    expect(data.shiplog.entries).toEqual(shiplog.entries);
  });

  it('the records file, every order on file, sits beside the boards\' orders and never replaces them', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => new Response(url.includes('records') ? JSON.stringify(orders) : '', { status: url.includes('records') ? 200 : 404 })));
    expect(await loadLiveRecords()).toEqual(orders);
    const b = await base();
    const data = withLive(b, { rails: null, raillog: null, orders: null, shiplog: null, records: orders });
    expect(data.records).toEqual(orders);
    expect(data.orders).toBe(b.orders);
    expect(withLive(b, { rails: null, raillog: null, orders: null, shiplog: null }).records).toBeUndefined();
  });
});

describe('live NAS readings', () => {
  const base = async () => ({ ops: (await import('../../../fixtures/ops.json')).default } as unknown as Fixtures);
  const nas = (asOf: string): NasFile => ({
    asOf, synthetic: false,
    hosts: [{ id: 'nas', name: 'NAS', role: 'Live', state: 'ok', seenAt: asOf, ram: { usedGb: 6, totalGb: 7.5 } }],
    disks: [{ id: 'DK-905', host: 'nas', label: 'Real data', mount: '/DATA', usedGb: 900, totalGb: 1800 }],
  });
  const at = '2026-11-06T13:00:00Z';

  it('the live NAS and its disks replace the sample ones; other hosts and disks stay', async () => {
    const data = withLiveNas(await base(), nas(at), Date.parse(at));
    expect(data.ops.hosts.find((h) => h.id === 'nas')?.role).toBe('Live');
    expect(data.ops.hosts.some((h) => h.id === 'gpu')).toBe(true);
    expect(data.ops.disks.filter((d) => d.host === 'nas').map((d) => d.id)).toEqual(['DK-905']);
    expect(data.ops.disks.some((d) => d.host === 'gpu')).toBe(true);
    expect(nasSource(data, Date.parse(at))).toBe('live');
  });

  it('a stale reading keeps its numbers but says NO READING', async () => {
    const later = Date.parse(at) + 10 * 60_000;
    const data = withLiveNas(await base(), nas(at), later);
    expect(data.ops.hosts.find((h) => h.id === 'nas')?.state).toBe('unknown');
    expect(nasSource(data, later)).toBe('stale');
  });

  it('without a live file nothing changes', async () => {
    const b = await base();
    expect(withLiveNas(b, null)).toBe(b);
    expect(nasSource(b)).toBe('sample');
  });
});

describe("the Yeoman's live list", () => {
  afterEach(() => vi.unstubAllGlobals());
  const list = { asOf: '2026-11-07T00:10:00Z', synthetic: false, todos: [], reminders: [], waiting: [], recurring: [], done: [] } as YeomanFile;

  it('reads live/yeoman.json only when it is real and has all five lists', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(list))));
    expect(await loadLiveYeoman()).toEqual(list);
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ...list, done: undefined }))));
    expect(await loadLiveYeoman()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 })));
    expect(await loadLiveYeoman()).toBeNull();
  });
  it('replaces the sample list, and leaves it when there is none', async () => {
    const sample = (await import('../../../fixtures/yeoman.json')).default as unknown as YeomanFile;
    const b = { yeoman: sample } as unknown as Fixtures;
    const none = { rails: null, raillog: null, orders: null, shiplog: null };
    expect(withLive(b, { ...none, yeoman: list }).yeoman).toBe(list);
    expect(withLive(b, none).yeoman).toBe(sample);
  });
});

describe("Helm's live application tracker", () => {
  afterEach(() => vi.unstubAllGlobals());
  const file = { asOf: '2026-11-07T00:10:00Z', synthetic: false, ads: [], applications: [], events: [] } as HelmFile;

  it('reads live/helm.json only when it is real and has all three lists', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(file))));
    expect(await loadLiveHelm()).toEqual(file);
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ...file, synthetic: true }))));
    expect(await loadLiveHelm()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ...file, events: undefined }))));
    expect(await loadLiveHelm()).toBeNull();
  });
  it('replaces the sample tracker, and leaves it when there is none', async () => {
    const sample = (await import('../../../fixtures/helm.json')).default as unknown as HelmFile;
    const b = { helm: sample } as unknown as Fixtures;
    const none = { rails: null, raillog: null, orders: null, shiplog: null };
    expect(withLive(b, { ...none, helm: file }).helm).toBe(file);
    expect(withLive(b, none).helm).toBe(sample);
  });
});
