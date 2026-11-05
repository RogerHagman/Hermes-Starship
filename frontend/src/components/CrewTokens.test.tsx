// The crew on the ship plan: tokens at their posts, walking to their cabins when off duty,
// and the Labels control (Role, Rank, Off).
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
import { SHIP_MAP } from '../lib/shipmap';
import { cabinOf, postOf } from './CrewTokens';
import { ShipPlan } from './ShipPlan';

const data = { ship, stations, rails, orders, shiplog, quarters } as unknown as Fixtures;
const noop = () => {};
const plan = (drills: Drills = {}) => render(
  <ShipPlan ship={makeShipView(data, drills, new Set())} filter="all" pick={null} onPick={noop} onDept={noop} onBack={noop} />).container;
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;
const token = (c: HTMLElement, name: string) => c.querySelector(`.tok[aria-label^="${name},"]`) as HTMLElement;

describe('crew tokens', () => {
  it('every live crew member has a token, and nobody else does', () => {
    const c = plan();
    const live = data.stations.stations.filter((s) => s.kind === 'station' && s.status === 'live');
    expect(c.querySelectorAll('.tok').length).toBe(live.length);
    expect(token(c, "Ship's Doctor")).toBeNull();
  });
  it('a token stands at its post, then walks to its cabin when its rail goes out', () => {
    const at = postOf('eng');
    expect(token(plan(), 'Chief Engineer').style.left).toBe(pct(at.x, SHIP_MAP.width));
    const off = token(plan({ codex: true }), 'Chief Engineer');
    const cabin = cabinOf('eng', data.stations.stations);
    expect(off.style.left).toBe(pct(cabin.x, SHIP_MAP.width));
    expect(off.style.top).toBe(pct(SHIP_MAP.cabins.y, SHIP_MAP.height));
    expect(off.className).toContain('off');
    expect(off.getAttribute('aria-label')).toContain('cabin 05-13');
  });
  it('every crew member has a cabin door of their own', () => {
    const live = data.stations.stations.filter((s) => s.kind === 'station' && s.status === 'live' && s.id !== 'captain');
    const doors = live.map((s) => cabinOf(s.id, data.stations.stations).n);
    expect(new Set(doors).size).toBe(doors.length);
  });
});

describe('labels', () => {
  it('Rank shows the rank on the tiles, Off hides the text and the post rings', () => {
    const c = plan();
    const pick = (label: string) => fireEvent.click([...c.querySelectorAll('.labels-ctl button')].find((b) => b.textContent === label)!);
    expect(c.querySelectorAll('.slot').length).toBeGreaterThan(0);
    pick('Rank');
    expect(c.querySelector('.t2.rank')?.textContent).toMatch(/[A-Z]/);
    pick('Off');
    expect(c.querySelector('.ship-tiles')?.className).toContain('bare');
    expect(c.querySelectorAll('.slot').length).toBe(0);
    expect(c.querySelectorAll('.tok').length).toBeGreaterThan(0);
  });
});
