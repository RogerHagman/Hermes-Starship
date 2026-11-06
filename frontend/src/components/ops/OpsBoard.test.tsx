// Ops: the status board on the table, the views on the wall screen, the grading rules, and the
// GPU's fans following the local rail.
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
import ops from '../../../../fixtures/ops.json';
import type { Fixtures } from '../../types';
import { makeShipView, type Drills } from '../../lib/ship';
import { areas, attention, backupState, containerState, diskState, handAngle, hostState, worst } from '../../lib/ops';
import { OpsBoard } from './OpsBoard';

const data = { ship, stations, rails, orders, shiplog, quarters, sensors, engineering, science, ops } as unknown as Fixtures;
const noop = () => {};
const view = (drills: Drills = {}) => makeShipView(data, drills, new Set());
const board = (onBoard: (b: string) => void = noop, drills: Drills = {}) => render(
  <OpsBoard ship={view(drills)} filter="all" drills={drills} target={null} onTarget={noop} onBoard={onBoard} onToast={noop} />).container;
const screen = (c: HTMLElement) => c.querySelector('.ops-screen') as HTMLElement;
const title = (c: HTMLElement) => screen(c).querySelector('.con-title')?.textContent;

afterEach(cleanup);

describe('ops board', () => {
  it('the status board has a chip per check, in seven areas, and the failed job is red', () => {
    const c = board();
    const list = areas(view());
    expect(c.querySelectorAll('.sb-col').length).toBe(7);
    expect(c.querySelectorAll('.sb-chip').length).toBe(list.reduce((n, a) => n + a.checks.length, 0));
    expect(c.querySelector('.sb-schedule .sb-chip.h-bad')?.getAttribute('aria-label')).toBe('Backup disk prune, ACT');
  });
  it('each thing in the room opens its view on the wall screen, and again closes it', () => {
    const c = board();
    const want: [string, string][] = [['net', 'The network'], ['nas', 'Hosts and containers'], ['clock', 'The schedule'],
      ['storage', 'Storage'], ['vault', 'Backup vault'], ['gpu', 'GPU · Sample 24 GB card'], ['ops', 'Ops']];
    for (const [spot, name] of want) {
      fireEvent.click(c.querySelector(`.ospot-${spot}`)!);
      expect(title(c)).toBe(name);
      fireEvent.click(c.querySelector(`.ospot-${spot}`)!);
      expect(title(c)).toMatch(/^Ops · /);
    }
    fireEvent.click(c.querySelector('.usage-desk')!);
    expect(title(c)).toBe('The rails and their usage');
  });
  it('needs a look lists the failed job first, then the warnings, and opens their area', () => {
    const c = board();
    const rows = [...c.querySelectorAll('.look-row')];
    expect(rows[0].textContent).toContain('Backup disk prune');
    expect(rows.map((r) => r.querySelector('.look-name')?.textContent)).toContain('Backup disk');
    fireEvent.click(rows[0]);
    expect(title(c)).toBe('The schedule');
  });
  it('the GPU fans follow the local rail, and stop in a drill; the turbolift goes to the Bridge', () => {
    const went: string[] = [];
    expect(board().querySelector('.ops-pic')?.getAttribute('data-gpu')).toBe('up');
    cleanup();
    const c = board((b) => went.push(b), { local: true });
    expect(c.querySelector('.ops-pic')?.getAttribute('data-gpu')).toBe('out');
    expect(attention(areas(view({ local: true }))).map((x) => x.label)).toContain('Local');
    fireEvent.click(c.querySelector('.ospot-bridge')!);
    expect(went).toEqual(['bridge']);
  });
  it('the network view shows the ports and who can sign in, but no addresses', () => {
    const c = board();
    fireEvent.click(c.querySelector('.ospot-net')!);
    expect(screen(c).textContent).toContain(`:${data.ops.network.ports[1].port}`);   // Ollama's port, read from the sample
    expect(screen(c).textContent).toContain('sign-in: None');
    expect(screen(c).textContent).not.toMatch(/\b(10|172|192)\.\d+\.\d+\.\d+\b/);
  });
});

describe('ops grading', () => {
  const o = data.ops;
  it('disks: 80% is watch, 90% is act', () => {
    expect(o.disks.map((d) => diskState(d))).toEqual(['ok', 'warn', 'ok', 'ok']);
    expect(diskState({ ...o.disks[0], usedGb: 1700 })).toBe('bad');
  });
  it('hosts and containers', () => {
    expect(hostState(o.hosts[0])).toBe('ok');
    expect(hostState({ ...o.hosts[0], swap: { usedGb: 3.8, totalGb: 4 } })).toBe('bad');
    expect(containerState({ ...o.containers[0], state: 'exited' })).toBe('bad');
    expect(containerState({ ...o.containers[0], memMb: 3900 })).toBe('warn');
  });
  it('backups: overdue is watch, twice overdue or a failed read-back is act, never read back is watch', () => {
    expect(o.backups.map((b) => backupState(b, o.asOf))).toEqual(['ok', 'ok', 'ok', 'warn']);
    expect(backupState({ ...o.backups[0], lastAt: '2026-11-02T02:30:00Z' }, o.asOf)).toBe('bad');
    expect(backupState({ ...o.backups[0], verified: 'failed' }, o.asOf)).toBe('bad');
  });
  it('the worst state wins, and the chronometer turns once a day', () => {
    expect(worst(['ok', 'warn', 'unknown'])).toBe('warn');
    expect(worst([])).toBe('ok');
    expect(handAngle(new Date('2026-11-04T23:00:00Z'))).toBe(0);    // midnight in Stockholm
    expect(handAngle(new Date('2026-11-04T11:00:00Z'))).toBe(180);   // noon
  });
});
