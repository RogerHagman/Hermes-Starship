// The Sensor array board: a contact per watch on the scope, the work screen's views, and the
// scope's geometry (what is due soon sits near the centre).
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ship from '../../../../fixtures/ship.json';
import stations from '../../../../fixtures/stations.json';
import rails from '../../../../fixtures/rails.json';
import orders from '../../../../fixtures/orders.json';
import shiplog from '../../../../fixtures/shiplog.json';
import quarters from '../../../../fixtures/quarters.json';
import sensors from '../../../../fixtures/sensors.json';
import type { Fixtures } from '../../types';
import { makeShipView } from '../../lib/ship';
import { contactOf, progress, untilLabel, type Watch } from '../../lib/sensors';
import { SensorsBoard } from './SensorsBoard';

const data = { ship, stations, rails, orders, shiplog, quarters, sensors } as unknown as Fixtures;
const noop = () => {};
const board = (relieved = new Set<string>(), onBoard: (b: string) => void = noop) => render(
  <SensorsBoard ship={makeShipView(data, {}, relieved)} filter="all" drills={{}} target={null} onTarget={noop}
    onBoard={onBoard} onToast={noop} />).container;
const screen = (c: HTMLElement) => c.querySelector('.sensor-screen') as HTMLElement;

afterEach(cleanup);

describe('sensor array board', () => {
  it('every watch is a contact on the scope; one with unread findings pings', () => {
    const c = board();
    expect(c.querySelectorAll('.contact').length).toBe(data.sensors.watches.length);
    expect(c.querySelector('.contact[aria-label^="Two sample GPUs"]')?.className).toContain('new');
    expect(c.querySelector('.contact[aria-label^="Weekend trip fares"]')?.className).toContain('paused');
  });
  it('picking a contact opens the watch with its order and what it found', () => {
    const c = board();
    fireEvent.click(c.querySelector('.contact[aria-label^="Two sample GPUs"]')!);
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('Two sample GPUs');
    expect(screen(c).textContent).toContain('ORD-9011');
    fireEvent.click(screen(c).querySelector('.find')!);
    expect(screen(c).querySelectorAll('.sources li').length).toBe(3);
  });
  it('the asks terminal shows the words as they were said, and flags one that was changed', () => {
    const c = board();
    fireEvent.click(c.querySelector('.sspot-asks')!);
    const asks = screen(c).querySelectorAll('.ask');
    expect(asks.length).toBe(data.sensors.asks.length);
    expect(screen(c).querySelectorAll('.ask.changed').length).toBe(1);
    expect(screen(c).querySelector('.ask.changed')?.textContent).toContain('NOT WORD FOR WORD');
  });
  it('the quarantine describes what it holds; the turbolift goes to the Bridge', () => {
    const went: string[] = [];
    const c = board(new Set(), (b) => went.push(b));
    fireEvent.click(c.querySelector('.sspot-quarantine')!);
    expect(screen(c).querySelectorAll('.held li').length).toBe(data.sensors.quarantine.length);
    fireEvent.click(c.querySelector('.sspot-bridge')!);
    expect(went).toEqual(['bridge']);
  });
  it('with Sensors relieved, the scope goes dark', () => {
    const c = board(new Set(['sensors']));
    expect(c.querySelector('.scope')?.className).toContain('dark');
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('Sensors are dark');
  });
});

describe('the scope', () => {
  const w = (over: Partial<Watch>): Watch => ({ id: 'W-999', name: 'x', sector: 'tech', kind: 'release', cadence: 'weekly', target: '', forStation: 'eng',
    lastScan: '2026-11-01T00:00:00Z', nextScan: '2026-11-08T00:00:00Z', state: 'active', ...over });
  it('a watch drifts in from the rim toward the centre as its next scan comes up', () => {
    const a = w({});
    const early = contactOf(a, [a], Date.parse('2026-11-01T06:00:00Z')).range;
    const late = contactOf(a, [a], Date.parse('2026-11-07T18:00:00Z')).range;
    expect(early).toBeGreaterThan(late);
    expect(progress(a, Date.parse('2026-11-09T00:00:00Z'))).toBe(1);
    expect(contactOf(w({ state: 'paused' }), [a], 0).range).toBeGreaterThan(0.9);
  });
  it('watches in a sector are spread across its quarter', () => {
    const a = w({ id: 'W-1' }), b = w({ id: 'W-2' });
    const [pa, pb] = [contactOf(a, [a, b], 0).angle, contactOf(b, [a, b], 0).angle];
    expect(pa).toBe(120);
    expect(pb).toBe(150);
  });
  it('says when the next scan is', () => {
    const now = Date.parse('2026-11-04T19:30:00Z');
    expect(untilLabel('2026-11-05T07:00:00Z', now)).toBe('in 12 h');
    expect(untilLabel('2026-11-11T18:10:00Z', now)).toBe('in 7 days');
    expect(untilLabel('2026-11-04T19:00:00Z', now)).toBe('due now');
  });
});
