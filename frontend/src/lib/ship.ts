// Ship logic as plain functions: which rails are up, who is off duty, who acts as head.
// No React here, so it is easy to read and to test (see ship.test.ts).
import type { Fixtures, RailId, Station } from '../types';
import { DEPTS, NEVER_COMMANDS, RAIL, RANK } from './lookups';

/** Drills mark a rail as out on this screen only. */
export type Drills = Partial<Record<RailId, boolean>>;

/** Stations the Captain has relieved (from the Quarters board or a Bridge station card). Screen only, like a drill. */
export type Relieved = ReadonlySet<string>;
const NOBODY: Relieved = new Set();

/** The Captain and the Ship's Computer can't be relieved: one is you, the other keeps the records. */
export const CANNOT_RELIEVE = new Set(['captain', 'computer']);

export function canRelieve(st: Station): boolean {
  return st.kind === 'station' && st.status === 'live' && !CANNOT_RELIEVE.has(st.id);
}

export const RAIL_IDS: RailId[] = ['local', 'codex', 'claude'];

export function railState(data: Fixtures, drills: Drills, id: RailId): 'up' | 'degraded' | 'out' {
  if (drills[id]) return 'out';
  return data.rails.rails.find((r) => r.id === id)?.state ?? 'up';
}

/**
 * Why a station is off duty, or null when it is at its post.
 * A live station goes off duty when the Captain relieves it, or when a rail it needs is out.
 * Places and the Captain never do.
 */
export function offDuty(data: Fixtures, drills: Drills, st: Station, relieved: Relieved = NOBODY): string | null {
  if (st.kind !== 'station' || st.status !== 'live') return null;
  if (relieved.has(st.id) && canRelieve(st)) return 'relieved';
  const down = (st.needs ?? []).filter((r) => railState(data, drills, r) === 'out');
  return down.length ? down.map((r) => `${RAIL[r].legend} out`).join(', ') : null;
}

/**
 * Who takes a department when its head is off duty: the next officer by rank who is on duty.
 * Enlisted crew, the computer, teams and advisers never command. Undefined means nobody can.
 */
export function nextInLine(members: Station[], off: (s: Station) => string | null): Station | undefined {
  return members
    .filter((s) => !s.head && s.status === 'live' && !off(s) && RANK[s.rank].officer && !NEVER_COMMANDS.has(s.id))
    .sort((a, b) => RANK[a.rank].order - RANK[b.rank].order)[0];
}

/**
 * For each department whose head is off duty: the id of the officer acting as head,
 * or 'dark' when nobody can. Next officer by rank who is on duty; enlisted crew,
 * the computer, teams and advisers never command. Command answers to the Captain.
 */
export function actingHeads(data: Fixtures, drills: Drills, relieved: Relieved = NOBODY): Record<string, string> {
  const acting: Record<string, string> = {};
  const off = (s: Station) => offDuty(data, drills, s, relieved);
  for (const d of DEPTS) {
    if (d.id === 'command') continue;
    const members = data.stations.stations.filter((s) => s.dept === d.id && s.status === 'live');
    const head = members.find((s) => s.head);
    if (!head || !off(head)) continue;
    const next = nextInLine(members, off);
    acting[d.id] = next ? next.id : 'dark';
  }
  return acting;
}

/** One object the components share: the fixtures plus the answers above. */
export interface ShipView {
  data: Fixtures;
  rail: (id: RailId) => 'up' | 'degraded' | 'out';
  off: (st: Station) => string | null;
  acting: Record<string, string>;
  relieved: Relieved;
  station: (id: string) => Station | undefined;
  actingFor: (id: string) => string | undefined;
}

export function makeShipView(data: Fixtures, drills: Drills, relieved: Relieved = NOBODY): ShipView {
  const acting = actingHeads(data, drills, relieved);
  return {
    data,
    rail: (id) => railState(data, drills, id),
    off: (st) => offDuty(data, drills, st, relieved),
    acting,
    relieved,
    station: (id) => data.stations.stations.find((s) => s.id === id),
    actingFor: (id) => Object.keys(acting).find((d) => acting[d] === id),
  };
}
