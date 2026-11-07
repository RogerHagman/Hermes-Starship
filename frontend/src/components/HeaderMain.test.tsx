// The header's condition lamp goes red when a commit lands on main without a merged PR.
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import quarters from '../../../fixtures/quarters.json';
import holo from '../../../fixtures/holo.json';
import type { Fixtures } from '../types';
import { makeShipView } from '../lib/ship';
import { Header } from './Header';

const base = { ship, stations, rails, orders, shiplog, quarters, holo } as unknown as Fixtures;
const lamp = (data: Fixtures) =>
  render(<Header ship={makeShipView(data, {}, new Set())} board="bridge" error={null} />).container.querySelector('.condition') as HTMLElement;

describe('condition lamp and the main watch', () => {
  it('stays as the ship says while main is clean', () => {
    expect(lamp(base).textContent).toBe(`CONDITION ${ship.condition.toUpperCase()}`);
  });

  it('goes red, and says why, when a commit came in without a PR', () => {
    const bad = { ...holo, main: { ...holo.main, unreviewed: [
      { sha: '3333333333aa', title: 'Direct push', author: 'Holodeck Officer', at: '2026-11-07T21:30:00Z', url: holo.items[0].run!.url }] } };
    const el = lamp({ ...base, holo: bad } as unknown as Fixtures);
    expect(el.className).toContain('red');
    expect(el.textContent).toBe('CONDITION RED · MAIN');
    expect(el.getAttribute('title')).toContain('without a merged PR');
  });
});
