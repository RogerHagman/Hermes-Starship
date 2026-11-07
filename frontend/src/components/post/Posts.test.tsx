// The four Bridge posts: each room opens on its own view, the things in the room open theirs on the
// wall screen and light up, the desk tiles work, and the doors go where they say.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ship from '../../../../fixtures/ship.json';
import stations from '../../../../fixtures/stations.json';
import rails from '../../../../fixtures/rails.json';
import orders from '../../../../fixtures/orders.json';
import shiplog from '../../../../fixtures/shiplog.json';
import yeoman from '../../../../fixtures/yeoman.json';
import helm from '../../../../fixtures/helm.json';
import nav from '../../../../fixtures/nav.json';
import viewscreen from '../../../../fixtures/viewscreen.json';
import type { Fixtures } from '../../types';
import { makeShipView } from '../../lib/ship';
import { XoBoard } from '../xo/XoBoard';
import { HelmBoard } from '../helm/HelmBoard';
import { NavBoard } from '../nav/NavBoard';
import { ViewscreenBoard } from '../viewscreen/ViewscreenBoard';

const data = { ship, stations, rails, orders, shiplog, yeoman, helm, nav, viewscreen } as unknown as Fixtures;
const noop = () => {};
type Board = typeof XoBoard;
const mount = (B: Board, onBoard: (b: string) => void = noop, d: Fixtures = data) => render(
  <B ship={makeShipView(d, {}, new Set())} filter="all" drills={{}} target={null} onTarget={noop} onBoard={onBoard} onToast={noop} />).container;
const title = (c: HTMLElement) => c.querySelector('.post-screen .con-title')?.textContent;
const spot = (c: HTMLElement, cls: string) => c.querySelector(`.${cls}`) as HTMLElement;
const tile = (c: HTMLElement, name: string) => [...c.querySelectorAll('.pdesk-tile')].find((t) => t.querySelector('.pdt-name')?.textContent === name) as HTMLElement;

afterEach(cleanup);

describe("Number One's post", () => {
  const fanNode = (c: HTMLElement, name: string) => [...c.querySelectorAll('.xf-node')].find((g) => g.querySelector('.xf-name')?.textContent === name) as Element;
  const listed = (c: HTMLElement) => [...c.querySelectorAll('.xf-rows .pl-meta')].map((x) => x.textContent ?? '');

  it('starts on the routing fan: your channels in, a node per station that took an ask, every ask beside it', () => {
    const c = mount(XoBoard);
    expect(title(c)).toBe('Routing');
    expect([...c.querySelectorAll('.xf-inlet .xf-in')].map((t) => t.textContent)).toEqual(['TELEGRAM 7', 'DESKTOP APP 5', 'WEB DASHBOARD 4']);
    expect(c.querySelectorAll('.xf-node').length).toBe(11);
    expect(c.querySelector('.xf-title')?.textContent).toBe('Every ask');
    expect(listed(c)).toHaveLength(16);
  });
  it('picking a station node lists the asks routed to it, and picking it again shows them all', () => {
    const c = mount(XoBoard);
    fireEvent.click(fanNode(c, 'Engineering'));
    expect(c.querySelector('.xf-title')?.textContent).toBe('Routed to Engineering');
    expect(listed(c).length).toBe(2);
    expect(listed(c).every((t) => !t.includes('→') && t.includes('· FROM '))).toBe(true);
    expect(fanNode(c, 'Ops').getAttribute('class')).toContain('dim');
    // the inlets show where Engineering's asks came in
    expect([...c.querySelectorAll('.xf-inlet .xf-in')].map((t) => t.textContent)).toEqual(['TELEGRAM 0', 'DESKTOP APP 2', 'WEB DASHBOARD 0']);
    expect(c.querySelectorAll('.xf-inlet')[0].getAttribute('class')).toContain('dim');
    fireEvent.keyDown(fanNode(c, 'Engineering'), { key: 'Enter' });
    expect(c.querySelector('.xf-title')?.textContent).toBe('Every ask');
  });
  it('a routed ask opens its order, and Esc comes back to the fan with the station still picked', () => {
    const c = mount(XoBoard);
    fireEvent.click(fanNode(c, 'Engineering'));
    fireEvent.click(c.querySelector('.xf-rows .plist-row')!);
    expect(title(c)).toMatch(/^ORD-\d{4} · /);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(c.querySelector('.xf-title')?.textContent).toBe('Routed to Engineering');
  });
  it('a channel tile on the desk, or a channel on the fan, shows only what came in there', () => {
    const c = mount(XoBoard);
    fireEvent.click(tile(c, 'Telegram'));
    expect(c.querySelector('.xf-title')?.textContent).toBe('From Telegram');
    expect(listed(c)).toHaveLength(7);
    expect(listed(c).every((t) => /^ORD-\d{4} → .+ · TELEGRAM · /.test(t))).toBe(true);
    fireEvent.click(c.querySelectorAll('.xf-inlet')[0]);
    expect(listed(c)).toHaveLength(16);
  });
  it('the Captain on the fan opens the hails; the room opens the comm channels, fast path and rules', () => {
    const c = mount(XoBoard);
    fireEvent.click([...c.querySelectorAll('.xf-side')].find((g) => g.textContent?.includes('CAPTAIN'))!);
    expect(title(c)).toBe('Hails · waiting for you · 3');
    fireEvent.click(spot(c, 'xspot-channels'));
    expect(title(c)).toBe('Comm channels');
    expect(spot(c, 'x-pic').dataset.on).toBe('channels');
    fireEvent.click(spot(c, 'xspot-fastpath'));
    expect(title(c)).toBe('The fast path');
    fireEvent.click(spot(c, 'xspot-rules'));
    expect(title(c)).toBe('Rail rules');
    expect(c.querySelectorAll('.post-screen .prow')).toHaveLength(10);
    fireEvent.click(spot(c, 'xspot-rules'));
    expect(title(c)).toBe('Routing');
  });
  it('the turbolift goes to the bridge', () => {
    const go = vi.fn();
    fireEvent.click(spot(mount(XoBoard, go), 'xspot-bridge'));
    expect(go).toHaveBeenCalledWith('bridge');
  });
});

describe("Helm's post", () => {
  it('starts on the course, every open job and application by stage', () => {
    const c = mount(HelmBoard);
    expect(title(c)).toBe('The course');
    const lanes = [...c.querySelectorAll('.hlane')].map((l) => [l.querySelector('.hl-name')?.textContent, l.querySelector('.hl-n')?.textContent]);
    expect(lanes).toEqual([['To triage', '2'], ['Shortlisted', '0'], ['Drafting', '1'], ['Ready', '1'], ['Sent', '2'], ['Interview', '1'], ['Closed', '1']]);
    expect(c.textContent).toContain('SAMPLE TRACKER');
  });
  it('a card opens its application with the timeline, and Esc goes back', () => {
    const c = mount(HelmBoard);
    fireEvent.click([...c.querySelectorAll('.hcard')].find((b) => b.textContent?.includes('Tidaholm'))!);
    expect(title(c)).toBe('A-9004 · Support Technician');
    expect(c.querySelector('.post-screen')?.textContent).toContain('one short follow-up is due');
    expect(c.querySelectorAll('.post-screen .htime li').length).toBeGreaterThan(0);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(title(c)).toBe('The course');
  });
  it('the gates, the follow-ups and the method open from the room', () => {
    const c = mount(HelmBoard);
    fireEvent.click(spot(c, 'hspot-gates'));
    expect(title(c)).toBe('Your gates · 4');
    fireEvent.click(spot(c, 'hspot-follow'));
    expect(title(c)).toBe('Follow-ups and deadlines');
    fireEvent.click(spot(c, 'hspot-method'));
    expect(title(c)).toBe('The method');
    expect(c.querySelectorAll('.post-screen .prow')).toHaveLength(10);
    fireEvent.click(tile(c, 'Ready'));
    expect(title(c)).toBe('Ready · 1');
  });
  it('the side panels say what waits for you and what is due', () => {
    const c = mount(HelmBoard);
    expect(c.querySelector('#hgate-title')?.closest('section')?.querySelectorAll('.plist-row')).toHaveLength(4);
    expect(c.querySelector('#hdue-title')?.closest('section')?.textContent).toContain('Send one follow-up · Tidaholm Tech');
  });
});

describe("Navigation's post", () => {
  it('starts on the next 7 days, today first, with the trips on their days', () => {
    const c = mount(NavBoard);
    expect(title(c)).toBe('The next 7 days');
    const days = [...c.querySelectorAll('.nweek > li')];
    expect(days).toHaveLength(7);
    expect(days[0].className).toBe('today');
    expect(days[3].querySelector('.nw-trip')?.textContent).toBe('GÖTEBORG');
    expect(days[1].textContent).toContain('Dentist');
  });
  it('the booking terminal shows the holds first; Navigation never confirms', () => {
    const c = mount(NavBoard);
    fireEvent.click(spot(c, 'nspot-bookings'));
    expect(title(c)).toBe('Bookings · 2 held for you');
    expect(c.querySelector('.post-screen')?.textContent).toContain('Navigation never presses Confirm');
  });
  it('the star chart opens a trip with its legs', () => {
    const c = mount(NavBoard);
    fireEvent.click(spot(c, 'nspot-chart'));
    fireEvent.click([...c.querySelectorAll('.post-screen .prow')].find((b) => b.textContent?.includes('Weekend in Göteborg'))!);
    expect(title(c)).toBe('Weekend in Göteborg');
    expect([...c.querySelectorAll('.post-screen .ncourse li')].map((l) => l.textContent)).toEqual(['Lidköping', 'Herrljunga', 'Göteborg']);
  });
  it('the slot board lists the Schedule box and the free windows', () => {
    const c = mount(NavBoard);
    fireEvent.click(spot(c, 'nspot-slots'));
    expect(title(c)).toBe('Slots wanted · 2');
    expect(c.querySelectorAll('.post-screen .nfree li')).toHaveLength(7);
  });
  it('the door goes to Helm', () => {
    const go = vi.fn();
    fireEvent.click(spot(mount(NavBoard, go), 'nspot-helm'));
    expect(go).toHaveBeenCalledWith('helm');
  });
});

describe('the Main Viewscreen', () => {
  it('starts on what is on screen now, with the tape of actions', () => {
    const c = mount(ViewscreenBoard);
    expect(title(c)).toBe("On screen · Show the application tracker's follow-ups");
    expect(spot(c, 'v-pic').dataset.onScreen).toBe('on');
    expect(spot(c, 'v-pic').dataset.asking).toBe('on');
    expect([...c.querySelectorAll('.post-screen .vact .va-dec')].map((d) => d.textContent)).toEqual(['APPROVED', 'APPROVED', 'WAITING FOR YOU']);
  });
  it('with nothing on screen it says so, and shows the last session', () => {
    const off = { ...data, viewscreen: { ...viewscreen, sessions: viewscreen.sessions.filter((s) => s.end) } } as unknown as Fixtures;
    const c = mount(ViewscreenBoard, noop, off);
    expect(title(c)).toBe('Off screen');
    expect(spot(c, 'v-pic').dataset.onScreen).toBe('off');
    expect(c.querySelector('.post-screen')?.textContent).toContain('Last session · On screen: the job tracker');
  });
  it('the approve panel lists what waits and what you denied', () => {
    const c = mount(ViewscreenBoard);
    fireEvent.click(spot(c, 'vspot-approve'));
    expect(title(c)).toBe('Approve · 1 waiting');
    expect(c.querySelectorAll('.post-screen .vact')).toHaveLength(3);
    fireEvent.click(spot(c, 'vspot-captain'));
    expect(title(c)).toBe('Captain');
  });
});
