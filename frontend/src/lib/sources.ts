// Which data each board reads, and whether each part is live from a probe on the NAS or still the
// sample. The header shows them as chips, so it is plain on every board what still needs a live read.
import type { Fixtures } from '../types';
import type { BoardId } from './board';
import { nasSource, railsSource } from './data';

/** The parts a board can read. Each is one file in fixtures/, or one in live/ from a probe. */
export type SourceId = 'orders' | 'records' | 'rails' | 'duty' | 'nas' | 'ops' | 'quarters' | 'sensors' | 'engineering'
  | 'science' | 'meters' | 'yeoman' | 'helm' | 'nav' | 'viewscreen' | 'fastpaths' | 'holo';

export type SourceState = 'live' | 'stale' | 'sample';

export interface Source { id: SourceId; label: string; state: SourceState; why: string }

const LABEL: Record<SourceId, string> = {
  orders: 'ORDERS', records: 'RECORDS', rails: 'RAILS', duty: 'DUTY LOG', nas: 'NAS', ops: 'NETWORK · GPU · JOBS',
  quarters: 'QUARTERS', sensors: 'WATCHES', engineering: 'PATCHES', science: 'MODEL SCORES', meters: 'METERS',
  yeoman: 'TODO LIST', helm: 'TRACKER', nav: 'CHARTS', viewscreen: 'SESSIONS', fastpaths: 'FAST PATHS', holo: 'REVIEW BAY',
};

/** Where a live part comes from, or what it waits for. Shown as the chip's tooltip. */
const FROM: Record<SourceId, string> = {
  orders: 'the ship probe (orders.csv and the Kanban cards)',
  records: 'the ship probe (every order on file)',
  rails: 'the rails probe',
  duty: 'the rails probe (rail-log.json)',
  nas: 'the Ops probe',
  ops: 'no probe yet: containers, network, GPU, jobs and backups are sample',
  quarters: 'no probe yet: the hails, campaigns and log in the Quarters are sample',
  sensors: "no probe yet: Sensors' watches are sample",
  engineering: 'no probe yet: the patch bay is sample',
  science: 'no probe yet: the model scores and the study bench are sample',
  meters: 'the meter probe',
  yeoman: "the ship probe (the Yeoman's files)",
  helm: "the ship probe (Helm's tracker, once it is on the NAS)",
  nav: 'no probe yet: Navigation keeps no files of its own',
  viewscreen: 'no probe yet: waits for computer use',
  fastpaths: "the ship probe (Hermes' routing/fast-paths.json)",
  holo: "the holo probe (holo's branches, runs and PRs on GitHub)",
};

/** The parts each board reads, most important first. */
export const BOARD_SOURCES: Record<BoardId, SourceId[]> = {
  bridge: ['orders', 'rails', 'duty'],
  quarters: ['quarters', 'orders', 'yeoman'],
  holodeck: ['holo', 'orders'],
  sensors: ['sensors', 'orders'],
  engineering: ['engineering', 'orders', 'rails'],
  science: ['meters', 'science'],
  ops: ['nas', 'rails', 'ops'],
  computer: ['records', 'rails'],
  yeoman: ['yeoman', 'orders'],
  xo: ['orders', 'fastpaths'],
  helm: ['helm', 'orders'],
  nav: ['nav', 'yeoman'],
  viewscreen: ['viewscreen'],
};

function stateOf(id: SourceId, data: Fixtures, now: number): SourceState {
  switch (id) {
    case 'rails': return railsSource(data.rails, now);
    case 'nas': return nasSource(data, now);
    case 'duty': return data.raillog ? 'live' : 'sample';
    case 'records': return data.records && !data.records.synthetic ? 'live' : 'sample';
    case 'holo': return data.holo && !data.holo.synthetic ? 'live' : 'sample';
    default: return data[id].synthetic ? 'sample' : 'live';
  }
}

/** The chips for one board: each part it reads, and whether that part is live, stale or the sample. */
export function boardSources(board: BoardId, data: Fixtures, now = Date.now()): Source[] {
  return BOARD_SOURCES[board].map((id) => {
    const state = stateOf(id, data, now);
    const why = state === 'live' ? `Live from ${FROM[id]}.`
      : state === 'stale' ? `Stale: ${FROM[id]} has stopped writing.`
      : FROM[id].startsWith('no probe') ? `Sample: ${FROM[id]}.` : `Sample: ${FROM[id]} has written nothing yet.`;
    return { id, label: LABEL[id], state, why };
  });
}

/** Splits text so every SAMPLE word (with the word after it, as in SAMPLE ORDERS) can be marked. */
export function splitSample(text: string): { text: string; sample: boolean }[] {
  const out: { text: string; sample: boolean }[] = [];
  let at = 0;
  for (const m of text.matchAll(/\bSAMPLE(?: [A-Z]+(?![a-z]))?/g)) {
    if (m.index > at) out.push({ text: text.slice(at, m.index), sample: false });
    out.push({ text: m[0], sample: true });
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push({ text: text.slice(at), sample: false });
  return out;
}

/** How one panel reads: all live, partly sample, all sample, or a live feed that has stopped (down). */
export type PanelState = 'live' | 'mixed' | 'sample' | 'stale';

/** One panel's state from the parts it reads. Down wins, then any sample. The why is the panel tag's tooltip. */
export function panelSource(ids: SourceId[], data: Fixtures, now = Date.now()): { state: PanelState; why: string } {
  const parts = ids.map((id) => ({ id, state: stateOf(id, data, now) }));
  const name = (s: SourceState) => parts.filter((p) => p.state === s).map((p) => LABEL[p.id]).join(', ');
  const down = name('stale');
  if (down) return { state: 'stale', why: `Down: ${down} stopped writing. This panel shows the last read.` };
  const sample = name('sample');
  if (!sample) return { state: 'live', why: `Live: ${name('live')}.` };
  if (parts.every((p) => p.state === 'sample')) return { state: 'sample', why: `Sample: ${sample} has no live read yet.` };
  return { state: 'mixed', why: `Part sample: ${sample} is sample, ${name('live')} is live.` };
}
