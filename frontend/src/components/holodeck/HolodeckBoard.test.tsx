// The Holodeck board: the hologram's rooms, the work screen's views, and drafting a new section.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ship from '../../../../fixtures/ship.json';
import stations from '../../../../fixtures/stations.json';
import rails from '../../../../fixtures/rails.json';
import orders from '../../../../fixtures/orders.json';
import shiplog from '../../../../fixtures/shiplog.json';
import quarters from '../../../../fixtures/quarters.json';
import holo from '../../../../fixtures/holo.json';
import type { Fixtures } from '../../types';
import { makeShipView } from '../../lib/ship';
import { ASSETS, DECK_ROWS, draftBrief, loadDrafts, overlaps, type Draft } from '../../lib/holodeck';
import { SHIP_MAP } from '../../lib/shipmap';
import { HolodeckBoard } from './HolodeckBoard';

const data = { ship, stations, rails, orders, shiplog, quarters, holo } as unknown as Fixtures;
const noop = () => {};
const board = (onBoard: (b: string) => void = noop, toasts: string[] = []) => render(
  <HolodeckBoard ship={makeShipView(data, {}, new Set())} filter="all" drills={{}} target={null} onTarget={noop}
    onBoard={onBoard} onToast={(t) => toasts.push(t)} />).container;
const button = (c: HTMLElement, text: string | RegExp) =>
  [...c.querySelectorAll('button')].find((b) => (typeof text === 'string' ? b.textContent === text : text.test(b.textContent ?? ''))) as HTMLButtonElement;
const screen = (c: HTMLElement) => c.querySelector('.holo-screen') as HTMLElement;

beforeEach(() => { try { localStorage.clear(); } catch { /* no storage */ } });
afterEach(cleanup);

describe('holodeck board', () => {
  it('the hologram has a button on every room of the ship', () => {
    const c = board();
    const placed = data.stations.stations.filter((s) => s.id in SHIP_MAP.places);
    expect(c.querySelectorAll('.holo-room').length).toBe(placed.length);
    // Rooms whose crew is not aboard yet show as not built.
    expect(c.querySelector('.holo-room[aria-label^="Holodeck Officer"]')?.className).toContain('approved');
  });
  it('picking a room on the hologram opens it on the work screen, with its art and place', () => {
    const c = board();
    fireEvent.click(c.querySelector('.holo-room[aria-label^="Stellar Cartographer"]')!);
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('Stellar Cartographer');
    expect(screen(c).textContent).toContain('station-carto.svg');
    expect(screen(c).textContent).toContain(`x ${SHIP_MAP.places.carto.x}`);
    // Picking it again puts the screen back to ready.
    fireEvent.click(c.querySelector('.holo-room[aria-label^="Stellar Cartographer"]')!);
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('Holodeck ready');
  });
  it('the pattern buffer lists every asset, and the arch opens the built boards', () => {
    const went: string[] = [];
    const c = board((b) => went.push(b));
    fireEvent.click(c.querySelector('.hspot-assets')!);
    expect(screen(c).querySelectorAll('.asset').length).toBe(ASSETS.length);
    expect(ASSETS.some((a) => a.file === 'holodeck.svg')).toBe(true);
    fireEvent.click(c.querySelector('.hspot-programs')!);
    fireEvent.click(button(screen(c), 'Open'));
    expect(went).toEqual(['bridge']);
    fireEvent.click(c.querySelector('.hspot-bridge')!);
    expect(went).toEqual(['bridge', 'bridge']);
  });
  it('a new section is placed on a free spot of the hologram and kept as a draft with its brief', () => {
    const toasts: string[] = [];
    const c = board(noop, toasts);
    fireEvent.click(c.querySelector('.hspot-new')!);
    fireEvent.change(screen(c).querySelector('input')!, { target: { value: 'Stellar Observatory' } });
    fireEvent.click(button(screen(c), 'Place on the hologram'));
    const holo = c.querySelector('.holo-ship') as HTMLElement;
    expect(holo.className).toContain('placing');
    // jsdom has no layout, so give the hologram a size before clicking on it.
    holo.getBoundingClientRect = () => ({ left: 0, top: 0, width: 2200, height: 1060, right: 2200, bottom: 1060, x: 0, y: 0, toJSON: noop });
    // Deck 4 at x 1400 is free (the Holodeck and Cartography end at 1324).
    fireEvent.click(holo, { clientX: 1500, clientY: DECK_ROWS[4] + 30 });
    const saved = loadDrafts();
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ id: 'DRAFT-1', name: 'Stellar Observatory', deck: 4, y: DECK_ROWS[4] });
    expect(c.querySelector('.holo-room.draft')).not.toBeNull();
    expect(screen(c).querySelector('.brief')?.textContent).toMatch(/^GOAL\n/);
    // A spot that is taken is refused.
    fireEvent.click(button(screen(c), 'Move'));
    fireEvent.click(holo, { clientX: SHIP_MAP.places.carto.x + 40, clientY: DECK_ROWS[4] + 30 });
    expect(toasts.at(-1)).toMatch(/taken/);
  });
});

describe('drafts', () => {
  const d: Draft = { id: 'DRAFT-1', name: 'Stellar Observatory', short: 'Observatory', kind: 'station', deck: 4, dept: 'holo',
    rail: 'claude', duty: 'Charts for the Captain.', x: 1400, y: 434, w: 200, at: '2026-11-05T18:00:00Z' };
  it('the brief asks the four questions, and leaves the hire to the Captain', () => {
    const b = draftBrief(d, data.stations.stations);
    expect(b.split('\n').filter((l) => /^[A-Z ]+$/.test(l))).toEqual(['GOAL', 'CONTEXT', 'CONSTRAINTS', 'DONE WHEN']);
    expect(b).toContain('Deck 4 (Holodeck & design)');
    expect(b).toContain('"proposed"');
    expect(b).toContain('Holodeck,');   // the rooms already on the deck
  });
  it('a draft may not sit on a room or on another draft', () => {
    expect(overlaps({ x: 1400, y: 434, w: 200 })).toBe(false);
    expect(overlaps({ x: 1200, y: 434, w: 200 })).toBe(true);          // Cartography
    expect(overlaps({ x: 1450, y: 434, w: 100 }, [d])).toBe(true);
    expect(overlaps({ x: 1450, y: 434, w: 100 }, [d], 'DRAFT-1')).toBe(false);
  });

  it('the Review bay lists holo\'s work, and shows a run, its files and diff, and the report', () => {
    const c = board();
    const panel = c.querySelector('.holo-review') as HTMLElement;
    expect([...panel.querySelectorAll('.rv-row .rv-ord')].map((e) => e.textContent)).toEqual(['ORD-9019', 'ORD-9020', 'ORD-9021', 'ORD-9022']);
    fireEvent.click(button(panel, /ORD-9019/));
    const s = screen(c);
    expect(s.querySelector('.con-title')?.textContent).toBe('Review bay');
    expect(s.querySelector('.rv-step.failed')?.textContent).toContain('Holodeck paths only');
    expect(s.querySelector('.rv-log')?.textContent).toContain('deploy/compose.yaml');
    expect(s.querySelector('.rv-file.oob')?.textContent).toContain('deploy/compose.yaml');
    fireEvent.click(button(s, /ORD-9020/));
    expect(s.querySelector('.rv-links a')?.getAttribute('href')).toMatch(/\/pull\/931$/);
    expect(s.querySelector('.rv-report')?.textContent).toContain('HOLODECK LEADS THE DECK');
    expect(s.querySelector('.rv-diff')?.textContent).toContain('+      "status": "live",');
    expect([...s.querySelectorAll('.rv-step')].every((e) => e.classList.contains('ok'))).toBe(true);
  });

  it('the Ready screen has a Review bay tile with the counts', () => {
    const c = board();
    expect(screen(c).textContent).toContain('1 READY · 1 FAILED · 1 BUILDING · SAMPLE');
  });
});
