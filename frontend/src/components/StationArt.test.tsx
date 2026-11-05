// The Bridge station pictures and the console button every station card has.
import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import ship from '../../../fixtures/ship.json';
import stations from '../../../fixtures/stations.json';
import rails from '../../../fixtures/rails.json';
import orders from '../../../fixtures/orders.json';
import shiplog from '../../../fixtures/shiplog.json';
import quarters from '../../../fixtures/quarters.json';
import type { Fixtures } from '../types';
import { makeShipView } from '../lib/ship';
import { ShipConsole } from './ShipConsole';
import { hasArt } from './StationArt';

const data = { ship, stations, rails, orders, shiplog, quarters } as unknown as Fixtures;
const noop = () => {};
const open = (id: string, drills = {}) => render(
  <ShipConsole ship={makeShipView(data, drills, new Set())} pick={{ station: id }} onPick={noop} onBack={noop} />).container;

describe('station art', () => {
  it('every Bridge station has a picture (the Captain has the chair)', () => {
    const bridge = data.stations.stations.filter((s) => s.deck === 1 && s.id !== 'captain');
    expect(bridge.filter((s) => !hasArt(s.id)).map((s) => s.id)).toEqual([]);
  });
  it('a Bridge card shows its picture, other decks do not', () => {
    expect(open('helm').querySelector('.station-art-wrap svg')).not.toBeNull();
    expect(open('doctor').querySelector('.station-art-wrap')).toBeNull();
  });
  it('a Bridge station has two pages: the picture, then its full card', () => {
    const c = open('helm');
    expect(c.querySelector('.con-facts')).toBeNull();
    fireEvent.click(c.querySelector('[aria-label="Page 2: Station card"]')!);
    expect(c.querySelector('.station-art-wrap')).toBeNull();
    expect(c.querySelector('.con-facts')?.textContent).toContain('DUTY');
    expect(c.querySelector('.pager-dot[aria-pressed="true"]')?.getAttribute('data-tip')).toBe('Station card');
  });
  it('the lights dim while the station is off duty', () => {
    const lit = (c: HTMLElement) => (c.querySelector('.station-art-wrap') as HTMLElement).style.getPropertyValue('--sa-glow');
    expect(lit(open('helm'))).toBe('1');
    expect(lit(open('helm', { local: true }))).toBe('0.25');
  });
  it('every station card has a console button, disabled until its board exists', () => {
    for (const s of data.stations.stations.filter((x) => x.id !== 'captain')) {
      const button = [...open(s.id).querySelectorAll('button')].find((b) => b.textContent === `${s.short} console`);
      expect(button, s.id).toBeDefined();
      expect(button!.disabled).toBe(true);
    }
  });
});
