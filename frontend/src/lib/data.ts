// Loads the fixture files, and the live rails and rail log when the NAS probe writes them. Moving around
// never calls a model: these are local files only, served by the page's own nginx.
import type { Fixtures, HelmFile, LogEntry, NasFile, OrdersFile, RailId, RailLogFile, RailsFile, ShipLogFile, Station, YeomanFile } from '../types';

const FILES = ['ship', 'stations', 'rails', 'orders', 'shiplog', 'quarters', 'sensors', 'engineering', 'science', 'ops', 'yeoman', 'helm', 'nav', 'viewscreen'] as const;

declare global {
  interface Window { FIXTURES?: Fixtures }   // set only in the single-file preview build
}

/** The sample fixtures as shipped, before any live file replaces a part of them. */
export async function loadSample(): Promise<Fixtures> {
  if (window.FIXTURES) return window.FIXTURES;
  const parts = await Promise.all(FILES.map(async (name) => {
    const res = await fetch(`fixtures/${name}.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`fixtures/${name}.json: ${res.status}`);
    return [name, await res.json()] as const;
  }));
  return Object.fromEntries(parts) as unknown as Fixtures;
}

/** What the probes on the NAS write into live/. Each part is null when its file is missing. */
export interface Live {
  rails: RailsFile | null;
  raillog: RailLogFile | null;
  orders: OrdersFile | null;
  shiplog: ShipLogFile | null;
  nas?: NasFile | null;
  records?: OrdersFile | null;
  yeoman?: YeomanFile | null;
  helm?: HelmFile | null;
}

export async function loadLive(): Promise<Live> {
  const [rails, raillog, orders, shiplog, nas, records, yeoman, helm] = await Promise.all([
    loadLiveRails(), loadLiveRailLog(), loadLiveOrders(), loadLiveShipLog(), loadLiveNas(), loadLiveRecords(), loadLiveYeoman(), loadLiveHelm()]);
  return { rails, raillog, orders, shiplog, nas, records, yeoman, helm };
}

/** The sample data with each live part in place of its sample. */
export function withLive(base: Fixtures, live: Live): Fixtures {
  const data = live.rails ? { ...base, rails: live.rails } : base;
  const out = withLiveNas(withLiveDuty(withLiveOrders(data, live.orders, live.shiplog), live.raillog), live.nas ?? null);
  const withRecords = live.records ? { ...out, records: live.records } : out;
  const withYeoman = live.yeoman ? { ...withRecords, yeoman: live.yeoman } : withRecords;
  return live.helm ? { ...withYeoman, helm: live.helm } : withYeoman;
}

/** A live file, or null when there is none or it doesn't look like a real reading. */
async function loadLiveFile<T extends { synthetic: boolean; asOf: string }>(name: string, ok: (file: T) => boolean): Promise<T | null> {
  if (window.FIXTURES) return null;   // the single-file preview has no live data
  try {
    const res = await fetch(`live/${name}.json`, { cache: 'no-store' });
    if (!res.ok) return null;
    const file = await res.json() as T;
    return file && file.synthetic === false && typeof file.asOf === 'string' && ok(file) ? file : null;
  } catch {
    return null;
  }
}

/** live/orders.json from the ship probe: the real orders, from orders.csv and the Kanban cards. */
export const loadLiveOrders = () => loadLiveFile<OrdersFile>('orders', (f) => Array.isArray(f.orders));
/** live/records.json from the ship probe: every order on file, in any state, for the core terminal. */
export const loadLiveRecords = () => loadLiveFile<OrdersFile>('records', (f) => Array.isArray(f.orders));
/** live/yeoman.json from the ship probe: the Captain's real list, from the Yeoman's own files. */
export const loadLiveYeoman = () => loadLiveFile<YeomanFile>('yeoman', (f) => ['todos', 'reminders', 'waiting', 'recurring', 'done'].every((k) => Array.isArray((f as never)[k])));
/** live/helm.json from the ship probe: Helm's real application tracker, with no contact details in it. */
export const loadLiveHelm = () => loadLiveFile<HelmFile>('helm', (f) => ['ads', 'applications', 'events'].every((k) => Array.isArray((f as never)[k])));
/** live/shiplog.json from the ship probe: orders opening and closing, and the customs log. */
export const loadLiveShipLog = () => loadLiveFile<ShipLogFile>('shiplog', (f) => Array.isArray(f.entries));

/**
 * With live orders, the sample orders go, and each station's active order is the newest one it
 * is running (or none). With a live log, its lines take the place of the sample ones; the duty
 * lines come from the rail log (withLiveDuty).
 */
export function withLiveOrders(data: Fixtures, orders: OrdersFile | null, shiplog: ShipLogFile | null): Fixtures {
  let out = data;
  if (orders) {
    const running = new Map<string, string>();
    for (const o of [...orders.orders].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))) {
      if (o.state === 'running') running.set(o.station, o.id);
    }
    const stations = data.stations.stations.map((s) => (s.kind === 'station' ? { ...s, activeOrder: running.get(s.id) ?? null } : s));
    out = { ...out, orders, stations: { ...data.stations, stations } };
  }
  if (shiplog) out = { ...out, shiplog };
  return out;
}

/** How often the page reads live/rails.json again. The probe writes it about once a minute. */
export const LIVE_EVERY_MS = 60_000;

/**
 * live/rails.json from the rails probe, or null when there is none (the sample rails stay).
 * Only a file that looks like a real reading is used.
 */
export const loadLiveRails = () => loadLiveFile<RailsFile>('rails', (f) => Array.isArray(f.rails));

/** Live readings older than this count as stale: the probe has probably stopped. */
export const STALE_AFTER_MS = 5 * 60_000;
export function railsSource(rails: RailsFile, now = Date.now()): 'sample' | 'live' | 'stale' {
  if (rails.synthetic) return 'sample';
  return now - Date.parse(rails.asOf) > STALE_AFTER_MS ? 'stale' : 'live';
}

/** live/rail-log.json from the rails probe, or null when there is none (the sample duty lines stay). */
export const loadLiveRailLog = () => loadLiveFile<RailLogFile>('rail-log', (f) => Array.isArray(f.events));

const WHY: Record<RailId, { out: string; up: string }> = {
  local: { out: 'Ollama went down', up: 'Ollama came back' },
  codex: { out: 'the Codex window ran out', up: 'the Codex window reset' },
  claude: { out: 'the Claude window ran out', up: 'the Claude window reset' },
};

/**
 * The duty lines the rail log implies: when a rail goes out, every live crew member who needs
 * it goes to quarters; when it comes back, each one whose rails are all up again returns.
 * Newest first, shaped like the ship's log ("duty" lines).
 */
export function dutyFromRailLog(stations: Station[], log: RailLogFile): LogEntry[] {
  const crew = stations.filter((s) => s.kind === 'station' && s.status === 'live' && (s.needs ?? []).length > 0);
  const down = new Set<RailId>();
  const off = (s: Station) => (s.needs ?? []).some((r) => down.has(r));
  const lines: LogEntry[] = [];
  for (const e of [...log.events].sort((a, b) => a.at.localeCompare(b.at))) {
    const before = new Set(crew.filter(off).map((s) => s.id));
    if (e.state === 'out') down.add(e.rail); else down.delete(e.rail);
    for (const s of crew) {
      const now = off(s);
      if (now && !before.has(s.id)) lines.push({ at: e.at, station: s.id, kind: 'duty', dir: 'out', text: `To quarters: ${WHY[e.rail].out}` });
      if (!now && before.has(s.id)) lines.push({ at: e.at, station: s.id, kind: 'duty', dir: 'in', text: `Back at the post: ${WHY[e.rail].up}` });
    }
  }
  return lines.reverse();
}

/** With a rail log, its duty lines take the place of the sample ones in the ship's log. */
export function withLiveDuty(data: Fixtures, raillog: RailLogFile | null): Fixtures {
  if (!raillog) return data;
  const entries = [...data.shiplog.entries.filter((e) => e.kind !== 'duty'), ...dutyFromRailLog(data.stations.stations, raillog)]
    .sort((a, b) => b.at.localeCompare(a.at));
  return { ...data, raillog, shiplog: { ...data.shiplog, entries } };
}

/** live/nas.json from the Ops probe: the NAS's own memory, swap, CPU, uptime, temperature and disks. */
export const loadLiveNas = () => loadLiveFile<NasFile>('nas', (f) => Array.isArray(f.hosts) && Array.isArray(f.disks));

/** Whether the Ops board's NAS readings are the samples, live from the Ops probe, or stale (the probe stopped). */
export function nasSource(data: Fixtures, now = Date.now()): 'sample' | 'live' | 'stale' {
  if (!data.nas) return 'sample';
  return now - Date.parse(data.nas.asOf) > STALE_AFTER_MS ? 'stale' : 'live';
}

/**
 * With a live NAS reading, each host it has takes the place of the sample one, and the sample
 * disks of those hosts go: the probe's disks are the real ones. A reading that has gone stale
 * keeps its numbers, but the host says NO READING, so an old figure never passes for a new one.
 */
export function withLiveNas(data: Fixtures, nas: NasFile | null, now = Date.now()): Fixtures {
  if (!nas) return data;
  const stale = now - Date.parse(nas.asOf) > STALE_AFTER_MS;
  const ids = new Set(nas.hosts.map((h) => h.id));
  const live = new Map(nas.hosts.map((h) => [h.id, stale
    ? { ...h, state: 'unknown' as const, note: 'The Ops probe has stopped: these are its last readings.' }
    : h]));
  const ops = data.ops;
  const hosts = [...ops.hosts.map((h) => live.get(h.id) ?? h), ...nas.hosts.filter((h) => !ops.hosts.some((x) => x.id === h.id))];
  const disks = [...ops.disks.filter((d) => !ids.has(d.host)), ...nas.disks].sort((a, b) => a.id.localeCompare(b.id));
  return { ...data, nas, ops: { ...ops, hosts, disks } };
}
