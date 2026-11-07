import { describe, expect, it } from 'vitest';
import sample from '../../../fixtures/holo.json';
import type { HoloFile } from '../types';
import { diffLines, outOfBounds, reviewCounts, reviewFor, reviewItems, reviewIsSample, runTime } from './review';

const holo = sample as unknown as HoloFile;

describe('the Review bay', () => {
  it('puts failed work first, then ready, building and pushed, then merged', () => {
    expect(reviewItems({ holo }).map((i) => i.state)).toEqual(['failed', 'ready', 'building', 'merged']);
  });

  it('counts what waits for the Captain', () => {
    expect(reviewCounts({ holo })).toEqual({ open: 3, ready: 1, failed: 1, building: 1 });
  });

  it('finds the work for an order, for the Bridge card', () => {
    expect(reviewFor({ holo }, 'ORD-9020')?.pr?.number).toBe(931);
    expect(reviewFor({ holo }, 'ORD-9001')).toBeUndefined();
  });

  it('flags files outside the Holodeck paths', () => {
    expect(outOfBounds(reviewFor({ holo }, 'ORD-9019')!)).toEqual(['deploy/compose.yaml']);
    expect(outOfBounds(reviewFor({ holo }, 'ORD-9020')!)).toEqual([]);
  });

  it('copes with data that has no Review bay', () => {
    expect(reviewItems({})).toEqual([]);
    expect(reviewIsSample({})).toBe(true);
    expect(reviewIsSample({ holo: { ...holo, synthetic: false } })).toBe(false);
  });

  it('colours a diff by line', () => {
    expect(diffLines('@@ -1 +1 @@\n-a\n+b\n c').map((l) => l.kind)).toEqual(['hunk', 'del', 'add', 'same']);
    expect(runTime(95)).toBe('1:35');
    expect(runTime(null)).toBe('–');
  });
});
