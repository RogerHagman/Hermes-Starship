// Loads the fixture files, and the live rails and rail log when the NAS probe writes them. Moving around
// never calls a model: these are local files only, served by the page's own nginx.
import type { Fixtures, LogEntry, RailId, RailLogFile, RailsFile, Station } from '../types';

const FILES = ['ship', 'stations', 'rails', 'orders', 'shiplog', 'quarters', 'sensors'] as const;

declare global {
  interface Window { FIXTURES?: Fixtures }   // set only in the single-file preview build
}

export async function loadFixtures(): Promise<Fixtures> {
  if (window.FIXTURES) return window.FIXTURES;
  const parts = await Promise.all(FILES.map(async (name) => {
    const res = await fetch(`fixtures/${name}.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`fixtures/${name}.json: ${res.status}`);
    return [name, await res.json()] as const;
  }));
  const data = Object.fromEntries(parts) as unknown as Fixtures;
  const [live, raillog] = await Promise.all([loadLiveRails(), loadLiveRailLog()]);
  return withLiveDuty(live ? { ...data, rails: live } : data, raillog);
}

/** How often the page reads live/rails.json again. The probe writes it about once a minute. */
export const LIVE_EVERY_MS = 60_000;

/**
 * live/rails.json from the rails probe, or null when there is none (the sample rails stay).
 * Only a file that looks like a real reading is used.
 */
export async function loadLiveRails(): Promise<RailsFile | null> {
  if (window.FIXTURES) return null;   // the single-file preview has no live data
  try {
    const res = await fetch('live/rails.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const file = await res.json() as RailsFile;
    return file && file.synthetic === false && Array.isArray(file.rails) && typeof file.asOf === 'string' ? file : null;
  } catch {
    return null;
  }
}

/** Live readings older than this count as stale: the probe has probably stopped. */
export const STALE_AFTER_MS = 5 * 60_000;
export function railsSource(rails: RailsFile, now = Date.now()): 'sample' | 'live' | 'stale' {
  if (rails.synthetic) return 'sample';
  return now - Date.parse(rails.asOf) > STALE_AFTER_MS ? 'stale' : 'live';
}

/** live/rail-log.json from the rails probe, or null when there is none (the sample duty lines stay). */
export async function loadLiveRailLog(): Promise<RailLogFile | null> {
  if (window.FIXTURES) return null;
  try {
    const res = await fetch('live/rail-log.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const file = await res.json() as RailLogFile;
    return file && file.synthetic === false && Array.isArray(file.events) ? file : null;
  } catch {
    return null;
  }
}

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
