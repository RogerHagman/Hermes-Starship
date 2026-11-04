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

/** Rank order decides who acts as department head. Lower order = more senior. */
export const RANK: Record<Station['rank'], { label: string; order: number; officer: boolean }> = {
  captain:   { label: 'Captain', order: 0, officer: true },
  commander: { label: 'Commander', order: 1, officer: true },
  ltcmdr:    { label: 'Lieutenant Commander', order: 2, officer: true },
  lt:        { label: 'Lieutenant', order: 3, officer: true },
  ltjg:      { label: 'Lieutenant junior grade', order: 4, officer: true },
  ensign:    { label: 'Ensign', order: 5, officer: true },
  cpo:       { label: 'Chief Petty Officer', order: 6, officer: false },
  po:        { label: 'Petty Officer', order: 7, officer: false },
  cadet:     { label: 'Cadet', order: 8, officer: false },
  none:      { label: 'No rank (the computer)', order: 9, officer: false },
  team:      { label: 'No rank (a team)', order: 10, officer: false },
  space:     { label: 'A place', order: 11, officer: false },
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

/** The other boards. Only the bridge exists in Milestone 0. */
export const BOARDS: { id: string; label: string; phase?: string; built?: boolean }[] = [
  { id: 'bridge',      label: 'Bridge', built: true },
  { id: 'deckplan',    label: 'Deck plan',          phase: 'H2' },
  { id: 'sector',      label: 'Sector chart',       phase: 'H2' },
  { id: 'science',     label: 'Science lab',        phase: 'H3' },
  { id: 'sensors',     label: 'Sensor array',       phase: 'H3' },
  { id: 'engineering', label: 'Main Engineering',   phase: 'H3' },
  { id: 'quarters',    label: "Captain's Quarters", phase: 'H4' },
  { id: 'conn',        label: 'Conn handoff',       phase: 'H4' },
];

export const SPEEDS_NOTE = 'Speed words set the reasoning level: Thrusters, Impulse, Warp, High Warp, Maximum Warp.';

export function railColor(rail: RailColour | string): string {
  return (RAIL as Record<string, { color: string }>)[rail]?.color ?? RAIL.mixed.color;
}
