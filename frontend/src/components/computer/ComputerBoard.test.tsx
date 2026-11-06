// The computer core: the terminal's records and command line, the records board on the table, the
// things in the room, and the panels that filter the terminal or open a record.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ship from '../../../../fixtures/ship.json';
import stations from '../../../../fixtures/stations.json';
import rails from '../../../../fixtures/rails.json';
import orders from '../../../../fixtures/orders.json';
import shiplog from '../../../../fixtures/shiplog.json';
import type { Fixtures, OrdersFile } from '../../types';
import { makeShipView, type Drills } from '../../lib/ship';
import { STATES } from '../../lib/computer';
import { ComputerBoard } from './ComputerBoard';

const data = { ship, stations, rails, orders, shiplog } as unknown as Fixtures;
const noop = () => {};
const board = (d: Fixtures = data, onBoard: (b: string) => void = noop, drills: Drills = {}) => render(
  <ComputerBoard ship={makeShipView(d, drills, new Set())} filter="all" drills={drills} target={null} onTarget={noop} onBoard={onBoard} onToast={noop} />).container;
const screen = (c: HTMLElement) => c.querySelector('.core-screen') as HTMLElement;
const title = (c: HTMLElement) => screen(c).querySelector('.con-title')?.textContent;
const rows = (c: HTMLElement) => [...screen(c).querySelectorAll('.trow .tid')].map((r) => r.textContent);
const type = (c: HTMLElement, line: string) => {
  const input = c.querySelector('#core-cmd') as HTMLInputElement;
  fireEvent.change(input, { target: { value: line } });
  fireEvent.submit(input.closest('form')!);
};

afterEach(cleanup);

describe('computer core', () => {
  it('the terminal lists every order on file, newest first, with a count per state', () => {
    const c = board();
    expect(title(c)).toBe('Core terminal · records');
    expect(rows(c).length).toBe(data.orders.orders.length);
    expect(rows(c)[0]).toBe('ORD-9016');   // the newest update in the samples
    expect(screen(c).querySelector('.tchip.ts-done b')?.textContent).toBe('9');
    expect(screen(c).textContent).toContain('SAMPLE RECORDS');
  });
  it('the command line filters, searches and opens a record', () => {
    const c = board();
    type(c, 'state review');
    expect(rows(c)).toEqual(['ORD-9010']);
    expect(screen(c).querySelector('.techo')?.textContent).toContain('records --state review');
    type(c, 'all');
    type(c, 'dentist');
    expect(rows(c).sort()).toEqual(['ORD-9005', 'ORD-9008']);
    type(c, 'ORD-1234');
    expect(screen(c).querySelector('.tsaid')?.textContent).toContain('ORD-1234: no such record on file');
    type(c, 'ord-9012');
    expect(title(c)).toBe('ORD-9012 · Plan and review: sample read API for the deck plan');
  });
  it('a record shows the brief, what came back, its sub-orders, and steps through the list', () => {
    const c = board();
    fireEvent.click(screen(c).querySelector('.trow')!);   // the newest: ORD-9016
    expect(title(c)).toMatch(/^ORD-9016 · /);
    expect(screen(c).textContent).toContain('THE BRIEF');
    expect(screen(c).textContent).toContain('Nothing came back on this order yet.');
    const newer = [...screen(c).querySelectorAll('.stepper button')][0] as HTMLButtonElement;
    expect(newer.disabled).toBe(true);
    fireEvent.click(screen(c).querySelectorAll('.stepper button')[1]);
    expect(title(c)).toMatch(/^ORD-9013 · |^ORD-9014 · /);
    fireEvent.click([...screen(c).querySelectorAll('.con-back')].find((b) => b.textContent === '‹ Records')!);
    expect(title(c)).toBe('Core terminal · records');
    fireEvent.click([...screen(c).querySelectorAll('.trow')].find((r) => r.textContent?.includes('ORD-9012'))!);
    const subs = [...screen(c).querySelectorAll('.tfacts .linkish')].map((b) => b.textContent);
    expect(subs).toEqual(expect.arrayContaining(['ORD-9013', 'ORD-9014']));
    expect(screen(c).querySelectorAll('.reply').length).toBe(2);   // what came back on ORD-9012
    fireEvent.click([...screen(c).querySelectorAll('.tfacts .linkish')].find((b) => b.textContent === 'ORD-9013')!);
    expect(title(c)).toMatch(/^ORD-9013 · /);
    fireEvent.click([...screen(c).querySelectorAll('.tfacts .linkish')].find((b) => b.textContent === 'ORD-9012')!);
    expect(title(c)).toMatch(/^ORD-9012 · /);
  });
  it('the records board on the table counts each state and filters the terminal; again clears it', () => {
    const c = board();
    const cols = [...c.querySelectorAll('.rb-col')];
    expect(cols.length).toBe(STATES.length);
    const review = c.querySelector('.rb-col.ts-review')!;
    expect(review.getAttribute('aria-label')).toBe('REVIEW, 1 orders');
    fireEvent.click(review);
    expect(rows(c)).toEqual(['ORD-9010']);
    expect(review.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(review);
    expect(rows(c).length).toBe(data.orders.orders.length);
  });
  it('orders by station filter the terminal, and bring it back from another view', () => {
    const c = board();
    fireEvent.click(c.querySelector('.cspot-minutes')!);
    expect(title(c)).toBe('Briefing minutes');
    const eng = [...c.querySelectorAll('.cst-row')].find((r) => r.textContent?.includes('Engineering'))!;
    fireEvent.click(eng);
    expect(title(c)).toBe('Core terminal · records');
    expect(rows(c).sort()).toEqual(['ORD-9012', 'ORD-9015']);
  });
  it('each thing in the room opens its view, and again puts the records back; the turbolift goes to the Bridge', () => {
    const went: string[] = [];
    const c = board(data, (b) => went.push(b));
    const want: [string, RegExp][] = [['records', /^Records · the numbers$/], ['minutes', /^Briefing minutes$/], ['burn', /^Dilithium Burn · /],
      ['memory', /^Memory banks · sealed$/], ['core', /Computer/]];
    for (const [spot, name] of want) {
      fireEvent.click(c.querySelector(`.cspot-${spot}`)!);
      expect(title(c)).toMatch(name);
      expect(c.querySelector(`.cspot-${spot}`)?.getAttribute('aria-pressed')).toBe('true');
      fireEvent.click(c.querySelector(`.cspot-${spot}`)!);
      expect(title(c)).toBe('Core terminal · records');
    }
    fireEvent.click(c.querySelector('.cspot-bridge')!);
    expect(went).toEqual(['bridge']);
  });
  it('the numbers: opened from the terminal or the racks, and a station\'s bar shows its done orders', () => {
    const c = board();
    type(c, 'stats');
    expect(title(c)).toBe('Records · the numbers');
    expect(screen(c).querySelectorAll('.tdays li').length).toBe(14);
    expect(screen(c).querySelector('.tkpis')?.textContent).toContain('45 min');
    fireEvent.click([...screen(c).querySelectorAll('button.tbar-row')].find((b) => b.textContent?.includes('Navigation'))!);
    expect(title(c)).toBe('Core terminal · records');
    expect(rows(c).sort()).toEqual(['ORD-9004', 'ORD-9005']);
    fireEvent.click(screen(c).querySelector('.tstats')!);
    expect(title(c)).toBe('Records · the numbers');
  });
  it('a record says when it opened, where from, when it closed and how long it took', () => {
    const c = board();
    type(c, 'ORD-9008');
    const facts = screen(c).querySelector('.tfacts')!.textContent!;
    expect(facts).toContain('TELEGRAM');
    expect(facts).toContain('TOOK 8 MIN');
    expect(facts).toContain('CARDS1');
  });
  it('an order with no speed word says the station\'s default speed was used: Impulse, unless the station has its own', () => {
    const plain = { ...data, orders: { ...data.orders, orders: data.orders.orders.map((o) => (o.id === 'ORD-9008' ? { ...o, speed: undefined } : o)) } };
    const c = board(plain as Fixtures);
    type(c, 'ORD-9008');
    expect(screen(c).querySelector('.tfacts')!.textContent).toContain('SPEEDImpulse · default');
    cleanup();
    const own = { ...plain, stations: { ...data.stations, stations: data.stations.stations.map((s) => (s.id === 'yeoman' ? { ...s, defaultSpeed: 'Thrusters' } : s)) } };
    const c2 = board(own as Fixtures);
    type(c2, 'ORD-9008');
    expect(screen(c2).querySelector('.tfacts')!.textContent).toContain('SPEEDThrusters · default');
  });
  it('the order log opens a record by its number', () => {
    const c = board();
    const link = [...c.querySelectorAll('.alog-link')].find((l) => l.textContent?.startsWith('ORD-9010'))!;
    fireEvent.click(link);
    expect(title(c)).toMatch(/^ORD-9010 · /);
    // A line with no order number is plain text.
    expect([...c.querySelectorAll('.alog li')].some((l) => l.textContent?.includes('Customs:') && !l.querySelector('.alog-link'))).toBe(true);
  });
  it('the records from the probe replace the boards\' orders on the terminal, and old done ones show', () => {
    const records = { asOf: '2026-11-05T20:00:00Z', synthetic: false, orders: [
      ...data.orders.orders,
      { id: 'ORD-1100', title: 'Weeks old and done', station: 'xo', state: 'done', updatedAt: '2026-10-20T11:00:00Z' },
    ] } as OrdersFile;
    const c = board({ ...data, records });
    expect(rows(c)).toContain('ORD-1100');
    expect(screen(c).textContent).toContain('LIVE FROM THE SHIP PROBE');
    expect(c.querySelector('.cspot-records')?.getAttribute('aria-label')).toBe(`Records, ${records.orders.length} ON FILE`);
  });
});
