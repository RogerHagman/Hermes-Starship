// The chain of command (from a duty roster card) and the service log page of a Bridge station.
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
import { BridgeBoard } from './BridgeBoard';

const data = { ship, stations, rails, orders, shiplog, quarters } as unknown as Fixtures;
const noop = () => {};
const board = (drills = {}) => render(
  <BridgeBoard ship={makeShipView(data, drills, new Set())} filter="all" drills={drills} target={null} onTarget={noop} onToast={noop} onBoard={noop} onRelieve={noop} />).container;
const consoleOf = (c: HTMLElement) => c.querySelector('.console')!;
const names = (c: HTMLElement) => [...c.querySelectorAll('.chain-name')].map((n) => n.textContent);

describe('chain of command', () => {
  it('a roster card opens its chain: Captain, Number One, the head, then the rest', () => {
    const c = board();
    fireEvent.click(c.querySelectorAll('.dept')[1]);   // the card itself, not a name on it
    expect(consoleOf(c).getAttribute('aria-label')).toBe('Flight Control chain of command');
    expect(names(c)).toEqual(['Captain', 'Number One', 'Helm', 'Navigation']);
    expect(c.querySelector('.chain-cover')?.textContent).toContain('Navigation');
  });
  it('a name on the card opens the station, not the chain', () => {
    const c = board();
    fireEvent.click([...c.querySelectorAll('.member')].find((m) => m.textContent?.includes('Navigation'))!);
    expect(consoleOf(c).getAttribute('aria-label')).toBe('Navigation console');
  });
  it('a name in the chain opens that station, and Back returns to the chain', () => {
    const c = board();
    fireEvent.click([...c.querySelectorAll('.dept-name')].find((d) => d.textContent?.startsWith('Engineering'))!);
    fireEvent.click([...c.querySelectorAll('.chain-row')].find((r) => r.textContent?.includes('Systems'))!);
    const back = consoleOf(c).querySelector('.con-back')!;
    expect(back.textContent).toBe('‹ Chain');
    fireEvent.click(back);
    expect(consoleOf(c).getAttribute('aria-label')).toBe('Engineering chain of command');
  });
  it('with the head off duty, the cover line names the acting head', () => {
    const c = board({ codex: true });
    fireEvent.click([...c.querySelectorAll('.dept-name')].find((d) => d.textContent?.startsWith('Engineering'))!);
    expect(c.querySelector('.chain-cover')?.textContent).toMatch(/off duty/);
  });
});

describe('service log', () => {
  it("page 3 lists the station's orders and log lines, and an order opens on page 1", () => {
    const c = board();
    fireEvent.click([...c.querySelectorAll('.member')].find((m) => m.textContent?.includes('Navigation'))!);
    fireEvent.click(c.querySelector('[aria-label="Page 3: Service log"]')!);
    const rows = [...c.querySelectorAll('.svc-row')];
    expect(rows.map((r) => r.querySelector('.idtag')?.textContent?.slice(0, 8))).toEqual(['ORD-9004', 'ORD-9005']);
    fireEvent.click(rows[1]);
    expect(c.querySelector('.con-order-title')?.textContent).toBe('Find a slot for the dentist');
  });
});
