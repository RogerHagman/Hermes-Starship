// Main Engineering: the patch line on the table, the work screen's views, who has Engineering,
// and the patch line's order.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ship from '../../../../fixtures/ship.json';
import stations from '../../../../fixtures/stations.json';
import rails from '../../../../fixtures/rails.json';
import orders from '../../../../fixtures/orders.json';
import shiplog from '../../../../fixtures/shiplog.json';
import quarters from '../../../../fixtures/quarters.json';
import sensors from '../../../../fixtures/sensors.json';
import engineering from '../../../../fixtures/engineering.json';
import science from '../../../../fixtures/science.json';
import type { Fixtures } from '../../types';
import { makeShipView, type Drills } from '../../lib/ship';
import { STAGES, inFlight } from '../../lib/engineering';
import { EngineeringBoard } from './EngineeringBoard';

const data = { ship, stations, rails, orders, shiplog, quarters, sensors, engineering, science } as unknown as Fixtures;
const noop = () => {};
const board = (relieved = new Set<string>(), onBoard: (b: string) => void = noop, drills: Drills = {}) => render(
  <EngineeringBoard ship={makeShipView(data, drills, relieved)} filter="all" drills={drills} target={null} onTarget={noop}
    onBoard={onBoard} onToast={noop} />).container;
const screen = (c: HTMLElement) => c.querySelector('.eng-screen') as HTMLElement;

afterEach(cleanup);

describe('main engineering board', () => {
  it('every patch is a chip on the patch line, in its stage; a failed one says so', () => {
    const c = board();
    expect(c.querySelectorAll('.patch-line .pchip').length).toBe(data.engineering.patches.length);
    expect(c.querySelectorAll('.pl-live .pchip').length).toBe(3);
    expect(c.querySelector('.pl-verify .pchip')?.className).toContain('failed');
  });
  it('picking a patch shows where it is on the line, who holds it and its orders', () => {
    const c = board();
    fireEvent.click(c.querySelector('.pchip[aria-label^="PT-901"]')!);
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('Sample read API for the deck plan');
    expect(screen(c).querySelector('.pline .here')?.textContent).toBe('BUILD');
    expect(screen(c).textContent).toContain('Systems Engineer');
    expect(screen(c).querySelectorAll('.con-order').length).toBe(3);
  });
  it('the patch bay lists the docker commands you run, never applying anything itself', () => {
    const c = board();
    fireEvent.click(c.querySelector('.espot-bay')!);
    const cmds = [...screen(c).querySelectorAll('code.cmd')].map((x) => x.textContent ?? '');
    expect(cmds.length).toBe(data.engineering.commands.length);
    for (const cmd of cmds) expect(cmd).toMatch(/^sudo docker /);
  });
  it('the warp core follows the local rail, and goes dark in a drill', () => {
    expect(board().querySelector('.eng-pic')?.getAttribute('data-core')).toBe('up');
    cleanup();
    expect(board(new Set(), noop, { local: true }).querySelector('.eng-pic')?.getAttribute('data-core')).toBe('out');
  });
  it('with the Chief relieved, Systems has Engineering; the turbolift goes to the Bridge', () => {
    const went: string[] = [];
    const c = board(new Set(['eng']), (b) => went.push(b));
    expect(c.querySelector('.espot-chief')?.getAttribute('aria-label')).toContain('Systems');
    fireEvent.click(c.querySelector('.espot-chief')!);
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('Systems Engineer');
    fireEvent.click(c.querySelector('.espot-bridge')!);
    expect(went).toEqual(['bridge']);
  });
  it('the split-or-solo bench shows both arms and no verdict yet', () => {
    const c = board();
    fireEvent.click(c.querySelector('.espot-bench')!);
    expect(screen(c).querySelectorAll('.arm').length).toBe(2);
    expect(screen(c).textContent).toContain('Not called yet');
  });
});

describe('the patch line', () => {
  it('runs brief to live, and in flight is everything not live, furthest along first', () => {
    expect(STAGES.map((s) => s.id)).toEqual(['brief', 'plan', 'build', 'verify', 'review', 'apply', 'live']);
    expect(inFlight(data.engineering.patches).map((p) => p.id)).toEqual(['PT-902', 'PT-903', 'PT-901', 'PT-904', 'PT-905']);
  });
});
