// Fixed design lookups: colours, status line styles, ranks, departments, boards.
import type { RailColour, Station } from '../types';

export const RAIL: Record<RailColour, { label: string; color: string; legend: string }> = {
  local:   { label: 'LOCAL',   color: 'var(--rail-local)',  legend: 'Local qwen' },
  codex:   { label: 'CODEX',   color: 'var(--rail-codex)',  legend: 'Codex' },
  claude:  { label: 'CLAUDE',  color: 'var(--rail-claude)', legend: 'Claude' },
  mixed:   { label: 'MIXED',   color: 'var(--rail-mixed)',  legend: 'Mixed' },
  captain: { label: 'CAPTAIN', color: 'var(--captain)',     legend: 'Captain' },
};

export const STATUS: Record<Station['status'], { label: string; line: 'solid' | 'dashed' | 'dotted' }> = {
  live:     { label: 'LIVE',                line: 'solid' },
  approved: { label: 'APPROVED, NOT BUILT', line: 'dashed' },
  proposed: { label: 'PROPOSED',            line: 'dashed' },
  reserved: { label: 'NAME RESERVED',       line: 'dotted' },
};

/** Rank order decides who acts as department head. Lower order = more senior.
 *  `short` fits on a ship plan tile (Labels: Rank). */
export const RANK: Record<Station['rank'], { label: string; short: string; order: number; officer: boolean }> = {
  captain:   { label: 'Captain', short: 'Captain', order: 0, officer: true },
  commander: { label: 'Commander', short: 'Commander', order: 1, officer: true },
  ltcmdr:    { label: 'Lieutenant Commander', short: 'Lt Cmdr', order: 2, officer: true },
  lt:        { label: 'Lieutenant', short: 'Lieutenant', order: 3, officer: true },
  ltjg:      { label: 'Lieutenant junior grade', short: 'Lt jg', order: 4, officer: true },
  ensign:    { label: 'Ensign', short: 'Ensign', order: 5, officer: true },
  cpo:       { label: 'Chief Petty Officer', short: 'Chief PO', order: 6, officer: false },
  po:        { label: 'Petty Officer', short: 'Petty Officer', order: 7, officer: false },
  cadet:     { label: 'Cadet', short: 'Cadet', order: 8, officer: false },
  none:      { label: 'No rank (the computer)', short: 'No rank', order: 9, officer: false },
  team:      { label: 'No rank (a team)', short: 'No rank', order: 10, officer: false },
  space:     { label: 'A place', short: 'Place', order: 11, officer: false },
};

export type DeptId = NonNullable<Station['dept']>;
export const DEPTS: { id: DeptId; name: string; uniform: string }[] = [
  { id: 'command',  name: 'Command',           uniform: '#e8645c' },
  { id: 'flight',   name: 'Flight Control',    uniform: '#e8645c' },
  { id: 'ops',      name: 'Operations',        uniform: '#e3b24a' },
  { id: 'security', name: 'Security',          uniform: '#e3b24a' },
  { id: 'eng',      name: 'Engineering',       uniform: '#e3b24a' },
  { id: 'holo',     name: 'Holodeck & Design', uniform: '#e3b24a' },
  { id: 'sci',      name: 'Sciences',          uniform: '#5aa4ec' },
  { id: 'med',      name: 'Medical',           uniform: '#5aa4ec' },
];

export const DECKS = ['Bridge', 'Command deck', 'Sciences, records & sickbay', 'Holodeck & design',
  'Crew quarters', 'Operations & customs', 'Main engineering', 'Lower decks'];

/** Stations that never take command, whatever their rank. */
export const NEVER_COMMANDS = new Set(['strategist']);

/** The boards. Built ones open from the side rail; the rest say when they arrive. */
export const BOARDS: { id: string; label: string; deck?: number; phase?: string; built?: boolean }[] = [
  { id: 'bridge',      label: 'Bridge',             deck: 1, built: true },
  { id: 'quarters',    label: "Captain's Quarters", deck: 2, built: true },
  { id: 'holodeck',    label: 'Holodeck',           deck: 4, built: true },
  { id: 'science',     label: 'Science lab',        deck: 3, built: true },
  { id: 'sensors',     label: 'Sensor array',       deck: 3, built: true },
  { id: 'engineering', label: 'Main Engineering',   deck: 7, built: true },
  { id: 'conn',        label: 'Conn handoff',       phase: 'H4' },
];

/** Rank pips on the collar: full pips, then a hollow half pip (Lieutenant Commander, junior grade). */
export const PIPS: Partial<Record<Station['rank'], { full: number; hollow: number }>> = {
  captain:   { full: 4, hollow: 0 },
  commander: { full: 3, hollow: 0 },
  ltcmdr:    { full: 2, hollow: 1 },
  lt:        { full: 2, hollow: 0 },
  ltjg:      { full: 1, hollow: 1 },
  ensign:    { full: 1, hollow: 0 },
};

export const SPEEDS_NOTE = 'Speed words set the reasoning level: Thrusters, Impulse, Warp, High Warp, Maximum Warp.';

export function railColor(rail: RailColour | string): string {
  return (RAIL as Record<string, { color: string }>)[rail]?.color ?? RAIL.mixed.color;
}

/** An order's tier colour and label. Live orders have no tier until the tier classifier exists. */
export const tierVar = (tier?: number) => (tier === undefined ? 'var(--text-label)' : `var(--tier-${tier})`);
export const tierText = (tier?: number) => (tier === undefined ? 'NO TIER' : `TIER ${tier}`);
/** Highest tier first; orders with no tier last. */
export const byTier = (a: { tier?: number }, b: { tier?: number }) => (b.tier ?? -1) - (a.tier ?? -1);
