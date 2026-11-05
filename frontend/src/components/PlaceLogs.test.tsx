// Page 3 of Crew Quarters (the duty log) and of the Briefing Room (the meetings).
import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import quarters from '../../../fixtures/quarters.json';
import type { Fixtures } from '../types';
import { makeShipView, type Drills } from '../lib/ship';
import { ShipConsole } from './ShipConsole';

const data = { ship, stations, rails, orders, shiplog, quarters } as unknown as Fixtures;
const noop = () => {};
const page3 = (id: string, drills: Drills = {}) => {
  const c = render(<ShipConsole ship={makeShipView(data, drills, new Set())} pick={{ station: id }} onPick={noop} onBack={noop} />).container;
  fireEvent.click(c.querySelectorAll('.pager-dot')[2]);
  return c;
};

describe('place logs', () => {
  it('Crew Quarters lists who is in quarters now, then every check-in and check-out', () => {
    const quiet = page3('crewq');
    expect(quiet.querySelector('.pager-dot[aria-pressed="true"]')?.getAttribute('data-tip')).toBe('Duty log');
    expect(quiet.textContent).toContain('IN QUARTERS NOW · NOBODY');
    const duty = data.shiplog.entries.filter((e) => e.kind === 'duty');
    expect(quiet.querySelectorAll('ol.place-log li').length).toBe(duty.length);
    // A Codex drill sends Engineering, Systems and Diagnostics to their cabins.
    const drill = page3('crewq', { codex: true });
    expect(drill.textContent).toContain('IN QUARTERS NOW · ');
    expect(drill.textContent).toContain('CABIN 05-13');
  });
  it('the Briefing Room lists its meetings with who attended and what was agreed', () => {
    const c = page3('lounge');
    expect(c.querySelector('.pager-dot[aria-pressed="true"]')?.getAttribute('data-tip')).toBe('Meetings');
    const meetings = c.querySelectorAll('.meet');
    expect(meetings.length).toBe(data.shiplog.entries.filter((e) => e.kind === 'briefing').length);
    expect(meetings[0].querySelector('.meet-who')?.textContent).toContain('Engineering');
    expect(meetings[0].querySelector('.meet-outcome')?.textContent).toMatch(/Minuted/);
  });
  it("a crew member's service log shows the briefings they sat in", () => {
    expect(page3('archives').textContent).toContain('Briefing: the library converter keeps failing');
  });
});
