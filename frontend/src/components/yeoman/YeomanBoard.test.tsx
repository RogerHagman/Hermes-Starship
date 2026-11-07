// The Yeoman's post: the list in four boxes with the reasons, the matrix on the desk, the things in the
// room, the doors out, and the panels that open an item on the wall screen.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ship from '../../../../fixtures/ship.json';
import stations from '../../../../fixtures/stations.json';
import rails from '../../../../fixtures/rails.json';
import orders from '../../../../fixtures/orders.json';
import shiplog from '../../../../fixtures/shiplog.json';
import yeoman from '../../../../fixtures/yeoman.json';
import type { Fixtures, YeomanFile } from '../../types';
import { makeShipView } from '../../lib/ship';
import { YeomanBoard } from './YeomanBoard';

const data = { ship, stations, rails, orders, shiplog, yeoman } as unknown as Fixtures;
const noop = () => {};
const board = (d: Fixtures = data, onBoard: (b: string) => void = noop) => render(
  <YeomanBoard ship={makeShipView(d, {}, new Set())} filter="all" drills={{}} target={null} onTarget={noop} onBoard={onBoard} onToast={noop} />).container;
const screen = (c: HTMLElement) => c.querySelector('.yeo-screen') as HTMLElement;
const title = (c: HTMLElement) => screen(c).querySelector('.con-title')?.textContent;
const quad = (c: HTMLElement, box: string) => screen(c).querySelector(`.yquad.yb-${box}`) as HTMLElement;
const texts = (el: Element, sel: string) => [...el.querySelectorAll(sel)].map((x) => x.textContent);

afterEach(cleanup);

describe("the Yeoman's post", () => {
  it('the wall screen starts on the list: four boxes, each todo with the reason it sits there', () => {
    const c = board();
    expect(title(c)).toBe('The list · four boxes');
    expect(texts(screen(c), '.yq-name')).toEqual(['Do first', 'Schedule', 'Delegate', "Don't do"]);
    const drop = quad(c, 'drop');
    expect(drop.querySelector('.yq-n')?.textContent).toBe('3');
    const letter = [...drop.querySelectorAll('.yq-item')].find((b) => b.textContent?.includes('cover letter'))!;
    expect(letter.querySelector('.yq-why')?.textContent).toBe('No due date, no "!".');
    expect(screen(c).textContent).toContain('SAMPLE LIST');
  });
  it('a todo opens with how it got here, what would move it and what happens', () => {
    const c = board();
    const letter = [...quad(c, 'drop').querySelectorAll('.yq-item')].find((b) => b.textContent?.includes('cover letter'))!;
    fireEvent.click(letter);
    expect(title(c)).toBe('Write a cover letter for the sample job ad');
    const body = screen(c).textContent!;
    expect(body).toContain('HOW IT GOT HERE');
    expect(body).toContain("neither urgent nor important, so it sits in Don't do");
    expect(body).toContain('A "!" makes it Schedule');
    expect(body).toContain('ORD-9003');
    fireEvent.click(screen(c).querySelector('.con-back')!);
    expect(title(c)).toBe('The list · four boxes');
  });
  it('the matrix on the desk counts each box and opens it; picking it again puts the list back', () => {
    const c = board();
    expect(texts(c, '.ymb-n')).toEqual(['2', '2', '2', '3']);
    const first = c.querySelector('.ymb-box.yb-first')!;
    fireEvent.click(first);
    expect(title(c)).toBe('Do first · 2');
    expect(first.getAttribute('aria-pressed')).toBe('true');
    expect(texts(screen(c), '.yr-text')).toEqual(['Pay the electricity bill', 'Answer the housing association']);
    // From a box, an item goes back to that box.
    fireEvent.click(screen(c).querySelector('.yrow')!);
    expect(screen(c).querySelector('.con-back')?.textContent).toBe('‹ Do first');
    fireEvent.click(screen(c).querySelector('.con-back')!);
    expect(title(c)).toBe('Do first · 2');
    fireEvent.click(first);
    expect(title(c)).toBe('The list · four boxes');
  });
  it('the things in the room open their views and light up', () => {
    const c = board();
    const pic = c.querySelector('.yeo-pic')!;
    const views: [string, RegExp][] = [
      ['clock', /^The next 48 hours · 8$/], ['chime', /^Reminders · 4$/], ['waiting', /^Waiting for · 3$/],
      ['calendar', /^Recurring · 4$/], ['done', /^Done log · 7$/], ['intray', /^The in-tray/], ['desk', /^Captain's Yeoman$/],
    ];
    for (const [spot, want] of views) {
      fireEvent.click(c.querySelector(`.yspot-${spot}`)!);
      expect(title(c)).toMatch(want);
      expect(pic.getAttribute('data-on')).toBe(spot);
    }
    expect(screen(c).textContent).not.toContain('undefined');
  });
  it('the reminders show the timer is beating, and what fired', () => {
    const c = board();
    fireEvent.click(c.querySelector('.yspot-chime')!);
    expect(screen(c).querySelector('.ybeat')?.textContent).toContain('BEATING');
    expect(screen(c).textContent).toContain('FIRED · FROM THE DONE LOG · 2');
    const stale = { ...data, yeoman: { ...(yeoman as unknown as YeomanFile), heartbeat: '2026-11-04T19:00:00Z' } } as Fixtures;
    cleanup();
    const s = board(stale);
    expect(s.querySelector('.yeo-pic')?.getAttribute('data-beat')).toBe('stale');
    fireEvent.click(s.querySelector('.yspot-chime')!);
    expect(screen(s).querySelector('.ybeat.stale')?.textContent).toContain('LAST BEAT 30 MIN');
  });
  it('the turbolift goes to the Bridge and the Captain\'s door to the Quarters', () => {
    const went: string[] = [];
    const c = board(data, (b) => went.push(b));
    fireEvent.click(c.querySelector('.yspot-bridge')!);
    fireEvent.click(c.querySelector('.yspot-door')!);
    expect(went).toEqual(['bridge', 'quarters']);
  });
  it('the side and bottom panels list what is due, late, done and this week', () => {
    const c = board();
    const next = c.querySelector('.ynext')!;
    expect(next.querySelectorAll('.ynext-row')).toHaveLength(8);
    expect(c.querySelector('.ywait')?.querySelectorAll('.ylate')).toHaveLength(2);
    expect(c.querySelector('.yspot-waiting')?.getAttribute('aria-label')).toBe('Waiting for, 2 LATE');
    fireEvent.click(next.querySelector('.ynext-row')!);
    expect(title(c)).toBe('Pay the electricity bill');
    expect(screen(c).querySelector('.con-back')?.textContent).toBe('‹ 48 hours');
    expect(c.querySelectorAll('.ydone-panel .yd-row')).toHaveLength(7);
    expect(c.querySelector('.yweek')?.querySelectorAll('.ydays li')).toHaveLength(7);
  });
  it('a live list says so instead of SAMPLE', () => {
    const live = { ...data, yeoman: { ...(yeoman as unknown as YeomanFile), synthetic: false } } as Fixtures;
    const c = board(live);
    expect(screen(c).textContent).not.toContain('SAMPLE LIST');
    expect(screen(c).textContent).toContain('LIVE · READ WED 20:30');
  });
});
