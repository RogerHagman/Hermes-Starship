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

afterEach(() => { cleanup(); localStorage.clear(); });

/** 450 done orders from the probe, one an hour back from the samples, so the list runs to three pages. */
const many = (): Fixtures => {
  const old = Array.from({ length: 450 }, (_, i) => ({
    id: `ORD-${2000 + i}`, title: i === 449 ? 'The oldest on file' : `Old order ${i}`, station: i % 2 ? 'nav' : 'yeoman', state: 'done',
    updatedAt: new Date(Date.parse('2026-10-31T12:00:00Z') - i * 3_600_000).toISOString(),
  }));
  return { ...data, records: { asOf: '2026-11-05T20:00:00Z', synthetic: false, orders: [...data.orders.orders, ...old] } as OrdersFile };
};
const count = (c: HTMLElement) => screen(c).querySelector('.tcount')?.textContent;
const said = (c: HTMLElement) => screen(c).querySelector('.tsaid')?.textContent;
const pager = (c: HTMLElement, word: string) => [...screen(c).querySelectorAll('.tpage')].find((b) => b.textContent?.includes(word)) as HTMLButtonElement;

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
    expect(facts).toContain('took 8 min');
    expect(facts).toContain('WORK TIME5 min 00 s');
    expect(facts).toContain('CARDS1');
  });
  it('an order with no speed word says the station\'s default speed was used: its own, else Impulse', () => {
    const plain = { ...data, orders: { ...data.orders, orders: data.orders.orders.map((o) => (['ORD-9008', 'ORD-9010'].includes(o.id) ? { ...o, speed: undefined } : o)) } };
    const c = board(plain as Fixtures);
    type(c, 'ORD-9008');   // the Yeoman runs at Thrusters
    expect(screen(c).querySelector('.tfacts')!.textContent).toContain('SPEEDThrusters · default');
    fireEvent.click([...screen(c).querySelectorAll('.con-back')].find((b) => b.textContent === '‹ Records')!);
    type(c, 'ORD-9010');   // Cartography has no default of its own
    expect(screen(c).querySelector('.tfacts')!.textContent).toContain('SPEEDImpulse · default');
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

describe('the core terminal: pages, the manual, the jump key and the settings', () => {
  const total = data.orders.orders.length + 450;
  it('lists 200 a page and every order is on a page: a narrower search reaches further back', () => {
    const c = board(many());
    expect(rows(c)).toHaveLength(200);
    expect(count(c)).toBe(`1–200 OF ${total} · PAGE 1 OF 3`);
    fireEvent.click(pager(c, 'OLDER'));
    expect(count(c)).toBe(`201–400 OF ${total} · PAGE 2 OF 3`);
    fireEvent.click(pager(c, 'LAST'));
    expect(rows(c)).toContain('ORD-2449');
    expect(pager(c, 'OLDER').disabled).toBe(true);
    type(c, 'first');
    expect(count(c)).toContain('PAGE 1 OF 3');
    type(c, 'page 2');
    expect(count(c)).toContain('PAGE 2 OF 3');
    type(c, 'page 9');
    expect(said(c)).toBe('page: there are 3 pages.');
    // a new search starts again on page 1; a narrower one fits on one page and reaches the oldest order
    type(c, 'station nav');
    expect(count(c)).toMatch(/OF \d+ · PAGE 1 OF 2$/);
    type(c, 'oldest on file');
    expect(rows(c)).toEqual(['ORD-2449']);
    type(c, 'all');
    type(c, 'before 20/10');
    // the 20th starts at 22:00 UTC on the 19th: 278 hours before the newest old order
    expect(rows(c)).toHaveLength(171);
    expect(rows(c)[0]).toBe('ORD-2279');
    expect(screen(c).querySelector('.techo')?.textContent).toContain('--before 2026-10-20');
  });
  it('back from a record goes to the page it is on; the record says where it is in the list', () => {
    const c = board(many());
    type(c, 'last');
    fireEvent.click([...screen(c).querySelectorAll('.trow')].find((r) => r.textContent?.includes('ORD-2449'))!);
    expect(screen(c).querySelector('.tpos')?.textContent).toBe(`${total} / ${total}`);
    fireEvent.click([...screen(c).querySelectorAll('.stepper button')][0]);   // ‹ Newer, still on page 3
    fireEvent.click([...screen(c).querySelectorAll('.con-back')].find((b) => b.textContent === '‹ Records')!);
    expect(count(c)).toContain('PAGE 3 OF 3');
  });
  it('man opens the manual; man <command> opens it at that command; a line in it runs', () => {
    const c = board();
    type(c, 'man');
    expect(title(c)).toBe("man core · the terminal's manual");
    for (const h of ['NAME', 'SYNOPSIS', 'DESCRIPTION', 'COMMANDS', 'KEYS', 'SETTINGS', 'FILES']) expect(screen(c).querySelector('.tman')?.textContent).toContain(h);
    expect(screen(c).querySelectorAll('.tman-cmds > div').length).toBe(11);
    fireEvent.click([...screen(c).querySelectorAll('.con-back')].find((b) => b.textContent === '‹ Records')!);
    type(c, 'help before');
    expect(screen(c).querySelector('#man-since')?.className).toBe('on');
    fireEvent.click([...screen(c).querySelectorAll('.tman-eg')].find((b) => b.textContent === 'state blocked')!);
    expect(title(c)).toBe('Core terminal · records');
    expect(screen(c).querySelector('.techo')?.textContent).toContain('--state blocked');
    type(c, 'man overboard');
    expect(said(c)).toBe('man: no entry for overboard. Type man for the whole manual.');
    fireEvent.click([...screen(c).querySelectorAll('.con-back')].find((b) => b.textContent === 'man')!);
    expect(title(c)).toMatch(/^man core/);
  });
  it('the jump key takes the cursor to the command line from anywhere on the board, but not from another field', () => {
    const c = board();
    type(c, 'ORD-9012');
    expect(title(c)).toMatch(/^ORD-9012/);
    fireEvent.keyDown(document.body, { key: '/' });
    expect(title(c)).toBe('Core terminal · records');
    expect(document.activeElement?.id).toBe('core-cmd');
    const other = document.createElement('input');
    document.body.appendChild(other);
    other.focus();
    fireEvent.keyDown(other, { key: '/' });
    expect(document.activeElement).toBe(other);
    other.remove();
  });
  it('the up arrow brings back earlier lines, and Esc clears the line', () => {
    const c = board();
    type(c, 'state review');
    type(c, 'dentist');
    const input = c.querySelector('#core-cmd') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('dentist');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('state review');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('dentist');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input.value).toBe('');
  });
  it('the settings page and set change the terminal, and this browser keeps them', () => {
    const c = board(many());
    type(c, 'settings');
    expect(title(c)).toBe('Terminal settings');
    expect(screen(c).querySelectorAll('.tset-row').length).toBe(10);
    const choose = (name: string, word: string) => fireEvent.click([...screen(c).querySelectorAll(`.tset-choices[aria-label="${name}"] .tchoice`)]
      .find((b) => b.textContent === word)!);
    choose('Rows per page', '100');
    choose('Order', 'Oldest first');
    fireEvent.click([...screen(c).querySelectorAll('.con-back')].find((b) => b.textContent === '‹ Records')!);
    expect(count(c)).toBe(`1–100 OF ${total} · PAGE 1 OF 5 · OLDEST FIRST`);
    expect(rows(c)[0]).toBe('ORD-2449');
    expect(pager(c, 'NEWER ›')).toBeTruthy();
    type(c, 'set rows 500');
    expect(said(c)).toBe('Rows per page: 500.');
    expect(count(c)).toBe(`${total} SHOWN · OLDEST FIRST`);
    // the columns: each can be hidden, from the page or with set
    expect(screen(c).querySelectorAll('.trow .tclock').length).toBe(screen(c).querySelectorAll('.trow').length * 2);
    type(c, 'set effective off');
    expect(said(c)).toBe('Work time column: Hidden.');
    expect(screen(c).querySelectorAll('.trow .tclock').length).toBe(screen(c).querySelectorAll('.trow').length);
    expect(screen(c).querySelector('.thead')?.textContent).not.toContain('WORK TIME');
    type(c, 'set station hide');
    expect(screen(c).querySelector('.trow .tst')).toBeNull();
    type(c, 'set phosphor amber');
    expect(screen(c).style.getPropertyValue('--phos')).toBe('#ffc46b');
    type(c, 'set key §');
    expect(JSON.parse(localStorage.getItem('hermes.coreTerminal')!)).toMatchObject({ rows: 500, order: 'oldest', phosphor: 'amber', key: '§' });
    fireEvent.keyDown(document.body, { key: '§' });
    expect(document.activeElement?.id).toBe('core-cmd');
    cleanup();
    // a new visit starts with what this browser kept; On start picks the first list
    localStorage.setItem('hermes.coreTerminal', JSON.stringify({ start: 'awaiting-captain' }));
    const d = board();
    expect(screen(d).querySelector('.tchip.ts-awaiting-captain')?.getAttribute('aria-pressed')).toBe('true');
    type(d, 'set defaults');
    expect(said(d)).toBe('Settings back to their defaults.');
  });
});
