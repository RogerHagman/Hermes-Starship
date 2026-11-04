// Tests for the ship logic, run on the real fixtures.
import { describe, expect, it } from 'vitest';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import type { Fixtures } from '../types';
import { actingHeads, offDuty, railState } from './ship';

const data = { ship, stations, rails, orders, shiplog } as unknown as Fixtures;
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
