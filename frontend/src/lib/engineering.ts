// Main Engineering (Deck 7): where things are in the picture (assets/engineering.svg, a
// 1600 x 740 box, drawn by tools/make_engineering_svg.py), and the patch line: every patch
// from its brief to live, who holds it at each stage. Data comes from fixtures/engineering.json.
import type { EngineeringFile, Patch, PatchStage } from '../types';

export const ROOM = { w: 1600, h: 740 };

/** The things in the room you can pick. Each one opens a view on the work screen. */
export type EngObject = 'bridge' | 'chief' | 'core' | 'systems' | 'diagnostics' | 'bench' | 'bay';

export const SPOTS: { id: EngObject; box: [number, number, number, number]; label: [number, number] }[] = [
  { id: 'bridge',      box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'chief',       box: [160, 250, 148, 316], label: [234, 236] },
  { id: 'core',        box: [335, 8, 160, 572],   label: [415, 196] },
  { id: 'systems',     box: [516, 288, 152, 278], label: [592, 272] },
  { id: 'diagnostics', box: [684, 318, 152, 248], label: [760, 302] },
  { id: 'bench',       box: [960, 586, 420, 122], label: [1170, 568] },
  { id: 'bay',         box: [1458, 146, 132, 578], label: [1524, 128] },
];

/** The engineer at each console. */
export const CONSOLE_OF: Partial<Record<EngObject, string>> = { chief: 'eng', systems: 'sys', diagnostics: 'diag' };
export const ENGINEERS = ['eng', 'sys', 'diag'];

/** The master systems table's top: the page lays the live patch line here. */
export const LINE = { x: 170, y: 596, w: 660, h: 96 };
/** The Chief's wall screen, where the page lays its console. */
export const SCREEN = { x: 880, y: 46, w: 560, h: 458 };

export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/**
 * The patch line, in order. `who` is the station that holds a patch at that stage; the
 * Captain applies by hand (the docker commands in the patch bay), so no station applies.
 */
export const STAGES: { id: PatchStage; label: string; who: string; does: string }[] = [
  { id: 'brief',  label: 'BRIEF',  who: 'captain', does: 'The goal, written as a brief.' },
  { id: 'plan',   label: 'PLAN',   who: 'eng',     does: 'The Chief plans it and splits it for the lower decks.' },
  { id: 'build',  label: 'BUILD',  who: 'sys',     does: 'Systems builds exactly what the plan says, as a patch.' },
  { id: 'verify', label: 'VERIFY', who: 'diag',    does: 'Diagnostics runs the checks and reports.' },
  { id: 'review', label: 'REVIEW', who: 'eng',     does: 'The Chief reviews, then asks you for a checkpoint.' },
  { id: 'apply',  label: 'APPLY',  who: 'captain', does: 'You apply it on the NAS with the patch bay commands.' },
  { id: 'live',   label: 'LIVE',   who: 'captain', does: 'Applied, and check.sh finds it in place.' },
];

export const stageOf = (id: PatchStage) => STAGES.find((s) => s.id === id)!;
export const stageIndex = (id: PatchStage) => STAGES.findIndex((s) => s.id === id);

/** Patches not yet live, furthest along first. */
export function inFlight(patches: Patch[]): Patch[] {
  return patches.filter((p) => p.stage !== 'live')
    .sort((a, b) => stageIndex(b.stage) - stageIndex(a.stage) || b.updatedAt.localeCompare(a.updatedAt));
}

/** Every patch, newest first within its stage, the furthest stage first. */
export function byStage(patches: Patch[]): Patch[] {
  return [...patches].sort((a, b) => stageIndex(b.stage) - stageIndex(a.stage) || b.updatedAt.localeCompare(a.updatedAt));
}

export type Arm = EngineeringFile['experiment']['arms'][number];

/** "41 min a card · 2 reworks in 3 runs". */
export function armLine(a: Arm): string {
  return `${a.minutes} min a card · ${a.rework} ${a.rework === 1 ? 'rework' : 'reworks'} in ${a.runs} ${a.runs === 1 ? 'run' : 'runs'}`;
}

/** 24 x 24 line icons for the room's things (same style as the station icons). */
export const ENG_ICONS: Record<EngObject | 'ease' | 'line' | 'patch', string> = {
  ease: 'M12 3v18 M8 6h8 M8 18h8 M9 10h6v4H9z',
  core: 'M12 2v20 M8 5h8 M8 19h8 M7 9h10v6H7z',
  line: 'M3 12h4 M10 12h4 M17 12h4 M7 12l3 0 M5 9l2 3-2 3 M12 9l2 3-2 3 M19 9l2 3-2 3',
  patch: 'M6 3h9l3 3v15H6z M9 10h6 M9 14h6 M9 18h3',
  chief: 'M4 20l8-16 8 16z M8 14h8',
  systems: 'M4 4h16v12H4z M8 20h8 M12 16v4 M8 8l3 3-3 3',
  diagnostics: 'M3 12h4l2-6 4 12 2-6h6',
  bench: 'M3 8h18 M3 16h18 M7 8v8 M17 8v8',
  bay: 'M5 3h14v18H5z M5 9h14 M5 15h14 M9 6h2 M9 12h2 M9 18h2',
  bridge: 'M12 3l7 18-7-4-7 4z',
};
