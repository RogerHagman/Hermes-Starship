// The Yeoman's post: the list in four boxes with the reasons, the matrix on the desk, the things in the
// room, the doors out, and the panels that open an item on the wall screen.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
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
const board = (d: Fixtures = data, onBoard: (b: string) => void = noop, onToast: (t: string) => void = noop) => render(
  <YeomanBoard ship={makeShipView(d, {}, new Set())} filter="all" drills={{}} target={null} onTarget={noop} onBoard={onBoard} onToast={onToast} />).container;
const screen = (c: HTMLElement) => c.querySelector('.yeo-screen') as HTMLElement;
const title = (c: HTMLElement) => screen(c).querySelector('.con-title')?.textContent;
const quad = (c: HTMLElement, box: string) => screen(c).querySelector(`.yquad.yb-${box}`) as HTMLElement;
const texts = (el: Element, sel: string) => [...el.querySelectorAll(sel)].map((x) => x.textContent);

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

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

describe('changing the list from the board', () => {
  const live = { ...data, yeoman: { ...(yeoman as unknown as YeomanFile), synthetic: false } } as Fixtures;
  /** A desk that answers: health on, and each action accepted with the next id. */
  const desk = (inbox = true) => {
    const posts: { op: string; item: string; value?: unknown }[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      if (url === 'desk/health') return new Response(JSON.stringify({ inbox, pending: 0 }), { status: 200 });
      posts.push(JSON.parse(init!.body as string));
      return new Response(JSON.stringify({ id: `b-${posts.length}`, at: '2026-11-04T19:31:00Z' }), { status: 202 });
    }));
    return posts;
  };
  const row = (c: HTMLElement, text: string) => [...screen(c).querySelectorAll('.yq-li')].find((li) => li.textContent?.includes(text)) as HTMLElement;
  const ready = async (c: HTMLElement) => waitFor(() => expect(c.querySelector('.room-hint')?.textContent).toContain('DESK ON'));

  it('the sample list reads only: the controls show, switched off, and nothing is sent', () => {
    const posts = desk();
    const c = board();
    expect(screen(c).querySelectorAll('.ytick')).toHaveLength(9);
    expect([...screen(c).querySelectorAll<HTMLButtonElement>('.ytick, .ystar')].every((b) => b.disabled)).toBe(true);
    expect(c.querySelector('.room-hint')?.textContent).toContain('READ ONLY');
    expect(posts).toEqual([]);
  });
  it('without the inbox the desk says it waits for the Yeoman patch', async () => {
    desk(false);
    const c = board(live);
    await waitFor(() => expect(c.querySelector('.room-hint')?.textContent).toContain('WAITING FOR THE YEOMAN PATCH'));
    expect(screen(c).querySelector<HTMLButtonElement>('.ytick')!.disabled).toBe(true);
  });
  it('a tick goes to the desk and the todo leaves the list at once, as pending', async () => {
    const posts = desk();
    const toasts: string[] = [];
    const c = board(live, noop, (t) => toasts.push(t));
    await ready(c);
    await act(async () => { fireEvent.click(row(c, 'Sort the cable drawer').querySelector('.ytick')!); });
    expect(posts).toEqual([{ op: 'tick', item: 'todo-907', value: null }]);
    await waitFor(() => expect(row(c, 'Sort the cable drawer')).toBeUndefined());
    expect(c.querySelector('.room-hint')?.textContent).toContain('1 WITH THE YEOMAN');
    expect(toasts[0]).toContain('Ticked off');
  });
  it('the star flips the "!" and the todo moves box', async () => {
    const posts = desk();
    const c = board(live);
    await ready(c);
    await act(async () => { fireEvent.click(row(c, 'Sort the cable drawer').querySelector('.ystar')!); });
    expect(posts).toEqual([{ op: 'important', item: 'todo-907', value: true }]);
    await waitFor(() => expect(quad(c, 'schedule').textContent).toContain('Sort the cable drawer'));
    expect(row(c, 'Sort the cable drawer').querySelector('.ypending')?.textContent).toBe('WITH THE YEOMAN');
  });
  it('dropping on an urgent box asks for a due date first, then sends the "!" and the date', async () => {
    const posts = desk();
    const c = board(live);
    await ready(c);
    const li = row(c, 'Sort the cable drawer');
    fireEvent.dragStart(li, { dataTransfer: { setData: noop, getData: () => 'todo-907' } });
    fireEvent.drop(quad(c, 'first'), { dataTransfer: { getData: () => 'todo-907' } });
    const dialog = c.querySelector('.wall-slot .ydialog')!;
    expect(dialog.textContent).toContain('MOVE TO DO FIRST');
    expect(dialog.querySelector<HTMLInputElement>('input[type="datetime-local"]')!.value).toBe('2026-11-05T23:59');
    await act(async () => { fireEvent.click([...dialog.querySelectorAll('button')].find((b) => b.textContent === 'Move it')!); });
    expect(posts).toEqual([
      { op: 'important', item: 'todo-907', value: true },
      { op: 'due', item: 'todo-907', value: '2026-11-05T22:59:00Z' },
    ]);
    await waitFor(() => expect(quad(c, 'first').textContent).toContain('Sort the cable drawer'));
  });
  it('an item opens with its buttons: cancel asks once before it goes', async () => {
    const posts = desk();
    const c = board(live);
    await ready(c);
    fireEvent.click(row(c, 'Sort the cable drawer').querySelector('.yq-item')!);
    const bar = screen(c).querySelector('.yactions')!;
    fireEvent.click([...bar.querySelectorAll('button')].find((b) => b.textContent === 'Cancel it')!);
    expect(bar.textContent).toContain('CANCEL THIS TODO?');
    await act(async () => { fireEvent.click([...bar.querySelectorAll('button')].find((b) => b.textContent === 'Yes, cancel')!); });
    expect(posts).toEqual([{ op: 'cancel', item: 'todo-907', value: null }]);
  });
  it('a new todo can be added from the list', async () => {
    const posts = desk();
    const c = board(live);
    await ready(c);
    fireEvent.click(screen(c).querySelector('.yadd-open')!);
    fireEvent.change(screen(c).querySelector('.yadd-text')!, { target: { value: 'Buy coffee filters' } });
    await act(async () => { fireEvent.submit(screen(c).querySelector('.yadd')!); });
    expect(posts).toEqual([{ op: 'add', item: '', value: { text: 'Buy coffee filters', important: false, due: null } }]);
    await waitFor(() => expect(quad(c, 'drop').textContent).toContain('Buy coffee filters'));
  });
  it('task fatigue: each box has its word, over 8 is red, and the load meter adds up the list', () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ id: `todo-x${i}`, text: `Extra ${i}`, addedAt: '2026-11-01T10:00:00Z', important: false }));
    const heavy = { ...data, yeoman: { ...(yeoman as unknown as YeomanFile), todos: [...(yeoman as unknown as YeomanFile).todos, ...many] } } as Fixtures;
    const c = board(heavy);
    expect(quad(c, 'drop').getAttribute('data-fatigue')).toBe('fatigue');
    expect(quad(c, 'drop').querySelector('.yfat')?.textContent).toBe('FATIGUE · OVER 8');
    expect(quad(c, 'first').getAttribute('data-fatigue')).toBe('light');
    expect(quad(c, 'first').querySelector('.yfat')?.textContent).toBe('LIGHT');
    expect(screen(c).querySelector('.yload')?.textContent).toBe('LOAD 13 · HEAVY');
    expect(c.querySelector('.room-hint')?.textContent).toContain('LOAD HEAVY');
    expect(c.querySelector('.ymb-box.yb-drop')?.getAttribute('data-fatigue')).toBe('fatigue');
    expect(board(data).querySelector('.yload')?.textContent).toBe('LOAD 8.5 · HEAVY');
  });
});
