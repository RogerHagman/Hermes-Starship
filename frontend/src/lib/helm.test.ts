// Helm's course: stages, follow-ups, deadlines and gates from the sample application tracker.
import { describe, expect, it } from 'vitest';
import sample from '../../../fixtures/helm.json';
import type { HelmFile } from '../types';
import { addDays, course, dateWord, days, deadlines, eventsOf, followUps, gates, today, warn } from './helm';

const f = sample as unknown as HelmFile;
const ids = (list: { kind: string; ad?: { id: string }; app?: { id: string } }[]) => list.map((c) => (c.kind === 'ad' ? c.ad!.id : c.app!.id));

describe("Helm's course", () => {
  it('puts every open job and application at its stage', () => {
    const by = course(f);
    expect(ids(by.triage)).toEqual(['J-9006', 'J-9005']);
    expect(ids(by.shortlisted)).toEqual([]);
    expect(ids(by.drafting)).toEqual(['A-9002']);
    expect(ids(by.ready)).toEqual(['A-9003']);
    expect(ids(by.applied).sort()).toEqual(['A-9001', 'A-9004']);
    expect(ids(by.interview)).toEqual(['A-9005']);
    expect(ids(by.closed)).toEqual(['A-9006']);
  });
  it('an ad marked applying with no application yet waits as shortlisted', () => {
    const g = { ...f, applications: f.applications.filter((a) => a.job !== 'J-9003') };
    expect(ids(course(g).shortlisted)).toEqual(['J-9003']);
  });
  it('counts days on the ship\'s calendar', () => {
    expect(today(f)).toBe('2026-11-04');
    expect(days('2026-10-16', '2026-11-04')).toBe(19);
    expect(addDays('2026-10-25', 14)).toBe('2026-11-08');
    expect(dateWord('2026-11-06')).toBe('FRI 6 NOV');
  });
  it('a sent application is due a follow-up after 14 days and counts as ghosted after 30', () => {
    const fus = followUps(f);
    expect(fus.map((x) => [x.app.id, x.since, x.kind])).toEqual([['A-9004', 19, 'follow-up'], ['A-9001', 2, 'waiting']]);
    expect(fus[1].due).toBe('2026-11-16');
    const old = { ...f, applications: f.applications.map((a) => (a.id === 'A-9004' ? { ...a, applied: '2026-09-30' } : a)) };
    expect(followUps(old)[0].kind).toBe('ghosted');
    expect(gates(old).some((g) => g.id === 'A-9004' && g.name === 'Close')).toBe(true);
  });
  it('warns three days before a deadline', () => {
    const d = deadlines(f);
    expect(d.map((x) => [x.ad.id, x.left])).toEqual([['J-9002', 2], ['J-9006', 3]]);
    expect(d.every(warn)).toBe(true);
  });
  it('lists what waits at your gates in the order of the method', () => {
    expect(gates(f).map((g) => [g.step, g.id])).toEqual([[2, 'J-9006'], [2, 'J-9005'], [6, 'A-9002'], [7, 'A-9003']]);
  });
  it('an application\'s timeline has its ad\'s lines too', () => {
    expect(eventsOf(f, 'A-9001').map((e) => e.kind)).toEqual(['sent', 'started', 'found']);
  });
});
