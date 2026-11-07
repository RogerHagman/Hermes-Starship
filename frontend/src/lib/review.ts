// The Review bay: the Holodeck Officer's work on GitHub, read from fixtures/holo.json or
// live/holo.json (the holo probe). Each item is one holo/ branch: the run of the holo Action on
// it, the PR the Action opened, the files it changes and holo's report. Read-only: merging
// happens on GitHub, through the PR's link.
import type { Fixtures, HoloItem } from '../types';

export type ReviewState = HoloItem['state'];
export type StepState = NonNullable<HoloItem['run']>['steps'][number]['state'];

/** How each state reads on the board, and its colour (a CSS colour token). */
export const REVIEW_STATE: Record<ReviewState, { label: string; colour: string; what: string }> = {
  pushed: { label: 'PUSHED', colour: 'var(--text-label)', what: 'holo pushed the branch. The holo Action has not started yet.' },
  building: { label: 'BUILDING', colour: 'var(--rail-mixed)', what: 'The holo Action is running the checks and the build.' },
  failed: { label: 'CHECKS FAILED', colour: 'var(--bad)', what: 'A check failed. holo fixes it on the same branch, or the order goes back.' },
  ready: { label: 'READY TO REVIEW', colour: 'var(--good)', what: 'Checks passed and the PR is open. Yours to review and merge on GitHub.' },
  merged: { label: 'MERGED', colour: 'var(--captain)', what: 'Merged into main. Pull on the NAS to see it live.' },
  closed: { label: 'CLOSED', colour: 'var(--text-muted)', what: 'The PR was closed without merging.' },
};

export const STEP_MARK: Record<StepState, string> = { ok: '✓', failed: '✕', running: '◐', waiting: '○', skipped: '–' };

/** The items, or none when a board was handed data without the Review bay (older tests, partial data). */
export function itemsOf(data: Partial<Pick<Fixtures, 'holo'>>): HoloItem[] {
  return data.holo?.items ?? [];
}

/** Whether the Review bay shows the sample (no live/holo.json yet). */
export function reviewIsSample(data: Partial<Pick<Fixtures, 'holo'>>): boolean {
  return data.holo?.synthetic ?? true;
}

/** Open work first (failed, then ready, building, pushed), then finished work, newest first within each. */
const RANK: Record<ReviewState, number> = { failed: 0, ready: 1, building: 2, pushed: 3, merged: 4, closed: 5 };
export function reviewItems(data: Partial<Pick<Fixtures, 'holo'>>): HoloItem[] {
  return [...itemsOf(data)].sort((a, b) => RANK[a.state] - RANK[b.state] || b.updatedAt.localeCompare(a.updatedAt));
}

/** Counts for the panel head and the Ready tile. */
export function reviewCounts(data: Partial<Pick<Fixtures, 'holo'>>): { open: number; ready: number; failed: number; building: number } {
  const items = itemsOf(data);
  const n = (s: ReviewState) => items.filter((i) => i.state === s).length;
  return { open: items.filter((i) => i.state !== 'merged' && i.state !== 'closed').length, ready: n('ready'), failed: n('failed'), building: n('building') + n('pushed') };
}

/** The holo item for an order, if holo has pushed work for it. The Bridge shows it on the order's card. */
export function reviewFor(data: Partial<Pick<Fixtures, 'holo'>>, order: string): HoloItem | undefined {
  return itemsOf(data).find((i) => i.order === order);
}

/** Files outside the Holodeck's paths. Any at all means the paths check fails. */
export function outOfBounds(item: HoloItem): string[] {
  return item.files.filter((f) => !f.inBounds).map((f) => f.path);
}

/** One line of a diff and how to colour it. */
export function diffLines(patch: string): { text: string; kind: 'add' | 'del' | 'hunk' | 'same' }[] {
  return patch.split('\n').map((text) => ({
    text,
    kind: text.startsWith('@@') ? 'hunk' : text.startsWith('+') ? 'add' : text.startsWith('-') ? 'del' : 'same',
  }));
}

/** The run's length as m:ss, or a dash. */
export function runTime(s: number | null | undefined): string {
  if (s == null) return '–';
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
