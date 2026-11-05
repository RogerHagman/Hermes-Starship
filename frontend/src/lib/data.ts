// Loads the fixture files, and the live rails when the NAS probe writes them. Moving around
// never calls a model: these are local files only, served by the page's own nginx.
import type { Fixtures, RailsFile } from '../types';

const FILES = ['ship', 'stations', 'rails', 'orders', 'shiplog', 'quarters'] as const;

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
  const live = await loadLiveRails();
  return live ? { ...data, rails: live } : data;
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
