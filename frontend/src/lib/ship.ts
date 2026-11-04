// Ship logic as plain functions: which rails are up, who is off duty, who acts as head.
// No React here, so it is easy to read and to test (see ship.test.ts).
import type { Fixtures, RailId, Station } from '../types';
import { DEPTS, NEVER_COMMANDS, RAIL, RANK } from './lookups';

/** Drills mark a rail as out on this screen only. */
export type Drills = Partial<Record<RailId, boolean>>;

export const RAIL_IDS: RailId[] = ['local', 'codex', 'claude'];

export function railState(data: Fixtures, drills: Drills, id: RailId): 'up' | 'degraded' | 'out' {
  if (drills[id]) return 'out';
  return data.rails.rails.find((r) => r.id === id)?.state ?? 'up';
}

/**
 * Why a station is off duty, or null when it is at its post.
 * A live station goes off duty when a rail it needs is out. Places and the Captain never do.
 */
export function offDuty(data: Fixtures, drills: Drills, st: Station): string | null {
  if (st.kind !== 'station' || st.status !== 'live') return null;
  const down = (st.needs ?? []).filter((r) => railState(data, drills, r) === 'out');
  return down.length ? down.map((r) => `${RAIL[r].legend} out`).join(', ') : null;
}

/**
 * For each department whose head is off duty: the id of the officer acting as head,
 * or 'dark' when nobody can. Next officer by rank who is on duty; enlisted crew,
 * the computer, teams and advisers never command. Command answers to the Captain.
 */
export function actingHeads(data: Fixtures, drills: Drills): Record<string, string> {
  const acting: Record<string, string> = {};
  for (const d of DEPTS) {
    if (d.id === 'command') continue;
    const members = data.stations.stations.filter((s) => s.dept === d.id && s.status === 'live');
    const head = members.find((s) => s.head);
    if (!head || !offDuty(data, drills, head)) continue;
    const next = members
      .filter((s) => !s.head && !offDuty(data, drills, s) && RANK[s.rank].officer && !NEVER_COMMANDS.has(s.id))
      .sort((a, b) => RANK[a.rank].order - RANK[b.rank].order)[0];
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
  station: (id: string) => Station | undefined;
  actingFor: (id: string) => string | undefined;
}

export function makeShipView(data: Fixtures, drills: Drills): ShipView {
  const acting = actingHeads(data, drills);
  return {
    data,
    rail: (id) => railState(data, drills, id),
    off: (st) => offDuty(data, drills, st),
    acting,
    station: (id) => data.stations.stations.find((s) => s.id === id),
    actingFor: (id) => Object.keys(acting).find((d) => acting[d] === id),
  };
}
