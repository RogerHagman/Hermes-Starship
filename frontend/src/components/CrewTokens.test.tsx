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
import { cabinOf, postOf, walkPath } from './CrewTokens';
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
  it('the walk to a cabin goes by the turbolift, not through space', () => {
    const st = (id: string) => data.stations.stations.find((s) => s.id === id)!;
    const L = SHIP_MAP.lifts;
    // Saucer crew: along the deck to the lift, down it, along Crew Quarters.
    const helm = walkPath(st('helm'), postOf('helm'), cabinOf('helm', data.stations.stations));
    expect(helm.map((p) => p.x).slice(1, 3)).toEqual([L.saucer, L.saucer]);
    // Engineering hull crew: up their lift to deck 6, then up the neck into the saucer.
    const eng = walkPath(st('eng'), postOf('eng'), cabinOf('eng', data.stations.stations));
    expect(eng).toContainEqual({ x: L.engineering, y: L.deck6 });
    expect(eng).toContainEqual(L.neckTop);
    // Every step is straight along a deck, straight up a lift, or the neck.
    for (const path of [helm, eng]) {
      path.slice(1).forEach((p, i) => {
        const a = path[i];
        const neck = a === L.neckFoot && p === L.neckTop;
        expect(a.x === p.x || a.y === p.y || neck, JSON.stringify([a, p])).toBe(true);
      });
    }
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
