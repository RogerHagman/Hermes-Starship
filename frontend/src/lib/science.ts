// The Science lab (Deck 3): where things are in the picture (assets/science.svg, a 1600 x 740
// box, drawn by tools/make_science_svg.py), and the lab's rule: every number comes with the
// run that measured it. Data comes from fixtures/science.json.
import type { Eval, LeakWeek, MeterRail, MeterWindow, MetersFile, Model, Run, ScienceFile, StudyTrack, Trial } from '../types';

export const ROOM = { w: 1600, h: 740 };

/** The things in the room you can pick. Each one opens a view on the work screen. */
export type LabObject = 'bridge' | 'models' | 'evals' | 'runs' | 'serving' | 'study' | 'datasets';

export const SPOTS: { id: LabObject; box: [number, number, number, number]; label: [number, number] }[] = [
  { id: 'bridge',   box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'models',   box: [158, 124, 164, 442], label: [240, 108] },
  { id: 'evals',    box: [326, 60, 288, 476],  label: [470, 44] },
  { id: 'runs',     box: [326, 616, 288, 106], label: [470, 598] },
  { id: 'serving',  box: [644, 144, 182, 582], label: [735, 128] },
  { id: 'study',    box: [958, 500, 424, 226], label: [1170, 548] },
  { id: 'datasets', box: [1458, 146, 132, 578], label: [1524, 128] },
];

/** The eval chamber's glass: the page draws the scores here. */
export const CHAMBER = { x: 360, y: 110, w: 220, h: 360 };
/** The work screen, where the page lays its console. */
export const SCREEN = { x: 880, y: 46, w: 560, h: 458 };

export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

export const runOf = (s: ScienceFile, id?: string): Run | undefined => (id ? s.runs.find((r) => r.id === id) : undefined);
export const modelOf = (s: ScienceFile, id: string): Model | undefined => s.models.find((m) => m.id === id);

/** "Crew 27B q4". */
export const modelName = (m: Model | undefined) => (m ? `${m.name} ${m.quant}` : '—');

/** The best score on each suite, and the model that got it. */
export function bestBySuite(s: ScienceFile): Record<string, Eval | undefined> {
  const out: Record<string, Eval | undefined> = {};
  for (const e of s.evals) if (!out[e.suite] || e.score > out[e.suite]!.score) out[e.suite] = e;
  return out;
}

/** Runs newest first. */
export const byNewest = (runs: Run[]) => [...runs].sort((a, b) => b.at.localeCompare(a.at));

/** How far a study track is: lessons done of all. */
export function trackProgress(t: StudyTrack): { done: number; total: number } {
  return { done: t.lessons.filter((l) => l.done).length, total: t.lessons.length };
}

/** The next lesson to take on a track, if any are left. */
export const nextLesson = (t: StudyTrack) => t.lessons.find((l) => !l.done);

/** What each kind of run is called on the boards. */
export const RUN_KIND: Record<Run['kind'], string> = { eval: 'EVAL', quantise: 'QUANTISE', serve: 'SERVE', dataset: 'DATASET' };

/** 24 x 24 line icons for the room's things (same style as the station icons). */
export const LAB_ICONS: Record<LabObject | 'ease' | 'run' | 'model' | 'lesson' | 'speed' | 'spend' | 'leak', string> = {
  speed: 'M4 17a8 8 0 1 1 16 0 M12 17l4-6 M4 17h2 M18 17h2 M12 9V7',
  spend: 'M4 20V9 M9 20V5 M14 20v-8 M19 20v-4 M3 20h18',
  leak: 'M12 3c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z M9 15a3 3 0 0 0 3 3',
  ease: 'M9 3h6 M10 3v6l-5 10a1 1 0 0 0 1 2h12a1 1 0 0 0 1-2l-5-10V3 M7.5 15h9',
  models: 'M4 4h16v6H4z M4 14h16v6H4z M8 7h2 M8 17h2',
  model: 'M7 3h10v18H7z M10 7h4 M10 17h4',
  evals: 'M4 20V10 M10 20V4 M16 20v-7 M3 20h18',
  runs: 'M4 5h16v14H4z M7 9l3 3-3 3 M12 15h5',
  run: 'M5 4h14v16H5z M8 8h8 M8 12h8 M8 16h5',
  serving: 'M4 4h16v5H4z M4 11h16v5H4z M7 6.5h1 M7 13.5h1 M8 20h8',
  study: 'M4 5c3-1 6-1 8 1c2-2 5-2 8-1v14c-3-1-6-1-8 1c-2-2-5-2-8-1z M12 6v14',
  lesson: 'M5 4h11l3 3v13H5z M8 10h8 M8 14h6',
  datasets: 'M4 6c0-2 16-2 16 0v12c0 2-16 2-16 0z M4 6c0 2 16 2 16 0 M4 12c0 2 16 2 16 0',
  bridge: 'M12 3l7 18-7-4-7 4z',
};

// ---------- the meters: speed, spend and the leak share (fixtures/meters.json or live/meters.json) ----------

/** The meter probe writes every 5 minutes; a file older than this means it has stopped. */
export const METERS_STALE_MS = 15 * 60_000;

export function metersSource(m: MetersFile | undefined, now = Date.now()): 'sample' | 'live' | 'stale' | 'none' {
  if (!m) return 'none';
  if (m.synthetic) return 'sample';
  return now - Date.parse(m.asOf) > METERS_STALE_MS ? 'stale' : 'live';
}

/** 950 -> "950", 12 400 -> "12.4k", 31 200 000 -> "31.2M". */
export function tokens(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return String(Math.round(n));
}

export const dollars = (n: number) => `$${n.toFixed(2)}`;

export const RAIL_LABEL: Record<MeterRail, string> = { local: 'Local', codex: 'Codex', claude: 'Claude', other: 'Other' };
export const WINDOW_SHORT: Record<MeterWindow, string> = { day: 'TODAY', week: '7 DAYS', month: '30 DAYS', all: 'ALL' };

/** Input plus output: what a rail spent. Cached and reasoning tokens are counted inside those. */
export const spent = (r: { input: number; output: number }) => r.input + r.output;

/** One window's spend, rail by rail, with the total. */
export function spendIn(m: MetersFile, w: MeterWindow) {
  const rows = m.spend.filter((r) => r.window === w);
  const sum = (k: 'sessions' | 'input' | 'cached' | 'output' | 'reasoning') => rows.reduce((n, r) => n + r[k], 0);
  const calls = rows.some((r) => r.calls !== undefined) ? rows.reduce((n, r) => n + (r.calls ?? 0), 0) : undefined;
  return {
    rows,
    total: { sessions: sum('sessions'), calls, input: sum('input'), cached: sum('cached'), output: sum('output'), reasoning: sum('reasoning'),
      costUsd: rows.reduce((n, r) => n + (r.costUsd ?? 0), 0) },
  };
}

/** The newest speed trial that worked, if any. */
export const lastTrial = (m: MetersFile): Trial | undefined => [...m.trials].sort((a, b) => b.at.localeCompare(a.at)).find((t) => t.ok);
/** This week's leak and last week's (the weeks come newest first). */
export const leakNow = (m: MetersFile): [LeakWeek | undefined, LeakWeek | undefined] => [m.leak.weeks[0], m.leak.weeks[1]];
