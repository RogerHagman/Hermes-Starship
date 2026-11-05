// Tests for the ship logic, run on the real fixtures.
import { describe, expect, it } from 'vitest';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import quarters from '../../../fixtures/quarters.json';
import type { Fixtures } from '../types';
import { actingHeads, canRelieve, makeShipView, offDuty, railState } from './ship';

const data = { ship, stations, rails, orders, shiplog, quarters } as unknown as Fixtures;
const st = (id: string) => data.stations.stations.find((s) => s.id === id)!;

describe('rails', () => {
  it('reads the fixture state, and a drill takes a rail out', () => {
    expect(railState(data, {}, 'codex')).toBe('up');
    expect(railState(data, { codex: true }, 'codex')).toBe('out');
  });
});

describe('off duty', () => {
  it('everyone is at their post when all rails are up', () => {
    expect(data.stations.stations.filter((s) => offDuty(data, {}, s))).toHaveLength(0);
  });
  it('a Codex drill sends the Codex crew and the Science Officer (needs Codex and local) off duty', () => {
    const off = data.stations.stations.filter((s) => offDuty(data, { codex: true }, s)).map((s) => s.id);
    expect(off).toEqual(expect.arrayContaining(['eng', 'sys', 'diag', 'science']));
    expect(off).not.toContain('xo');
  });
  it('places, the Captain and unbuilt stations never go off duty', () => {
    const all = { local: true, codex: true, claude: true };
    expect(offDuty(data, all, st('captain'))).toBeNull();
    expect(offDuty(data, all, st('lounge'))).toBeNull();
    expect(offDuty(data, all, st('holo'))).toBeNull();
  });
});

describe('acting heads', () => {
  it('nobody acts while every head is on duty', () => {
    expect(actingHeads(data, {})).toEqual({});
  });
  it('with Codex out, Engineering goes dark and the Archivist acts for Sciences', () => {
    const acting = actingHeads(data, { codex: true });
    expect(acting.eng).toBe('dark');      // Systems and Diagnostics are Codex too
    expect(acting.sci).toBe('archives');
  });
  it('with Claude out, Cartography would act for Holodeck only if the Holodeck Officer were live', () => {
    expect(actingHeads(data, { claude: true }).holo).toBeUndefined();
  });
  it('never hands command to enlisted crew', () => {
    const acting = actingHeads(data, { local: true });
    for (const id of Object.values(acting)) {
      if (id !== 'dark') expect(['cpo', 'po', 'cadet', 'none', 'team']).not.toContain(st(id).rank);
    }
  });
});

describe('relieve and recall (Captain\'s Quarters)', () => {
  it('relieving the Chief Engineer hands Engineering to Systems, the next officer by rank', () => {
    const relieved = new Set(['eng']);
    expect(offDuty(data, {}, st('eng'), relieved)).toBe('relieved');
    expect(actingHeads(data, {}, relieved)).toEqual({ eng: 'sys' });
  });
  it('relieving Systems too leaves Diagnostics, an ensign, in charge', () => {
    expect(actingHeads(data, {}, new Set(['eng', 'sys'])).eng).toBe('diag');
  });
  it('recall is just leaving the set: everyone is back at their post', () => {
    const view = makeShipView(data, {}, new Set());
    expect(view.acting).toEqual({});
    expect(data.stations.stations.filter((s) => view.off(s))).toHaveLength(0);
  });
  it('the Captain, the Ship\'s Computer, places and unbuilt stations cannot be relieved', () => {
    const everyone = new Set(data.stations.stations.map((s) => s.id));
    for (const id of ['captain', 'computer', 'quarters', 'holo', 'doctor']) {
      expect(canRelieve(st(id))).toBe(false);
      expect(offDuty(data, {}, st(id), everyone)).toBeNull();
    }
  });
  it('a relieved head plus a rail drill: enlisted crew still never take command', () => {
    const acting = actingHeads(data, { local: true }, new Set(['security', 'science']));
    for (const id of Object.values(acting)) {
      if (id !== 'dark') expect(['cpo', 'po', 'cadet', 'none', 'team']).not.toContain(st(id).rank);
    }
  });
});
