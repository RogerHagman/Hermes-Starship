// The station pictures and the console button every station card has.
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
  it("the Quarters station's console button opens the Captain's Quarters board", () => {
    let went = 0;
    const c = render(<ShipConsole ship={makeShipView(data, {}, new Set())} pick={{ station: 'quarters' }} onPick={noop} onBack={noop} onQuarters={() => went++} />).container;
    fireEvent.click([...c.querySelectorAll('button')].find((b) => b.textContent === 'Quarters console')!);
    expect(went).toBe(1);
  });
  it('every station on every deck has a picture (the Captain has the chair)', () => {
    const all = data.stations.stations.filter((s) => s.id !== 'captain');
    expect(all.filter((s) => !hasArt(s.id)).map((s) => s.id)).toEqual([]);
    expect(hasArt('captain')).toBe(false);
  });
  it('a card on any deck shows its picture', () => {
    for (const id of ['helm', 'lounge', 'computer', 'eng', 'diag']) {
      expect(open(id).querySelector('.station-art-wrap svg'), id).not.toBeNull();
    }
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
  it('a station that is not built yet is drawn dimmed', () => {
    const lit = (c: HTMLElement) => (c.querySelector('.station-art-wrap') as HTMLElement).style.getPropertyValue('--sa-glow');
    expect(lit(open('doctor'))).toBe('0.45');
    expect(lit(open('design'))).toBe('0.45');
    expect(lit(open('sensors'))).toBe('1');
  });
  it('every station card has a console button, disabled until its board exists', () => {
    for (const s of data.stations.stations.filter((x) => x.id !== 'captain' && x.id !== 'quarters')) {
      const button = [...open(s.id).querySelectorAll('button')].find((b) => b.textContent === `${s.short} console`);
      expect(button, s.id).toBeDefined();
      expect(button!.disabled).toBe(true);
    }
  });
});
