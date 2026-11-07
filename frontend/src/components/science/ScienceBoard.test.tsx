// The Science lab: every number links to the run that measured it, the run log, serving, and
// the study bench.
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
import meters from '../../../../fixtures/meters.json';
import type { Fixtures } from '../../types';
import { makeShipView } from '../../lib/ship';
import { bestBySuite, metersSource, nextLesson, spendIn, spent, tokens, trackProgress } from '../../lib/science';
import { ScienceBoard } from './ScienceBoard';

const data = { ship, stations, rails, orders, shiplog, quarters, sensors, engineering, science, meters } as unknown as Fixtures;
const noop = () => {};
const board = (relieved = new Set<string>(), onBoard: (b: string) => void = noop) => render(
  <ScienceBoard ship={makeShipView(data, {}, relieved)} filter="all" drills={{}} target={null} onTarget={noop}
    onBoard={onBoard} onToast={noop} />).container;
const screen = (c: HTMLElement) => c.querySelector('.lab-screen') as HTMLElement;

afterEach(cleanup);

describe('science lab board', () => {
  it('the chamber shows every score', () => {
    const c = board();
    expect(c.querySelectorAll('.chamber .ch-row').length).toBe(data.science.evals.length);
  });
  it('every score on the evals view links to its run, and the run shows its log', () => {
    const c = board();
    fireEvent.click(c.querySelector('.lspot-evals')!);
    const refs = screen(c).querySelectorAll('.evals-grid .runref');
    expect(refs.length).toBe(data.science.evals.length);
    fireEvent.click([...refs].find((r) => r.textContent === 'RUN-902')!);
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('Crew 27B q8 on routing and tool calls');
    expect(screen(c).querySelectorAll('.runlog li').length).toBe(5);
  });
  it('serving shows a failed trial as failed, with no speed', () => {
    const c = board();
    fireEvent.click(c.querySelector('.lspot-serving')!);
    expect(screen(c).querySelectorAll('.serve').length).toBe(3);
    expect(screen(c).querySelector('.serve.failed')?.textContent).toContain('did not load');
  });
  it('the study bench opens a track with its lessons and the runs they read', () => {
    const c = board();
    fireEvent.click(c.querySelector('.lspot-study')!);
    fireEvent.click(screen(c).querySelector('.track')!);
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('How quantising works');
    expect(screen(c).querySelectorAll('.lessons li.done').length).toBe(3);
    expect(screen(c).querySelector('.lessons li.next')?.textContent).toContain('READS RUN-910');
  });
  it('with Science relieved, the lab goes dark; the turbolift goes to the Bridge', () => {
    const went: string[] = [];
    const c = board(new Set(['science']), (b) => went.push(b));
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('The lab is dark');
    expect(c.querySelector('.chamber')?.className).toContain('dark');
    fireEvent.click(c.querySelector('.lspot-bridge')!);
    expect(went).toEqual(['bridge']);
  });
});

describe('the meters', () => {
  it('the side panel opens speed, spend and the leak', () => {
    const c = board();
    const rows = c.querySelectorAll('.meters-panel .mp-row');
    expect(rows[0].textContent).toContain('284 ms');
    fireEvent.click(rows[0]);
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('Speed');
    expect(screen(c).querySelectorAll('.meter-table tbody tr').length).toBe(3);
    expect(screen(c).querySelector('tr.failed')?.textContent).toContain('timed out');
    fireEvent.click(c.querySelectorAll('.meters-panel .mp-row')[2]);
    expect(screen(c).querySelector('.con-title')?.textContent).toBe('Leak share');
    expect(screen(c).querySelector('.leak-weeks li.high .lw-fig')?.textContent).toBe('32.7%');
  });
  it('spend switches window, and a rail with no price shows no dollars', () => {
    const c = board();
    fireEvent.click(c.querySelectorAll('.meters-panel .mp-row')[1]);
    const total = () => screen(c).querySelector('.spend-table tr.total')?.textContent ?? '';
    expect(total()).toContain('30.9M');
    expect(total()).toContain('$3.42');
    fireEvent.click([...screen(c).querySelectorAll('.win-btn')].find((b) => b.textContent === 'TODAY')!);
    expect(total()).toContain('$0.61');
    const codex = [...screen(c).querySelectorAll('.spend-table tbody tr')].find((r) => r.textContent?.startsWith('Codex'))!;
    expect(codex.lastElementChild?.textContent).toBe('—');
  });
  it('counts and labels', () => {
    expect(tokens(950)).toBe('950');
    expect(tokens(12_400)).toBe('12.4k');
    expect(tokens(31_200_000)).toBe('31.2M');
    expect(spent(spendIn(data.meters, 'week').total)).toBe(30_910_000);
    expect(metersSource(data.meters)).toBe('sample');
    const live = { ...data.meters, synthetic: false, asOf: '2026-11-07T10:00:00Z' };
    expect(metersSource(live, Date.parse('2026-11-07T10:10:00Z'))).toBe('live');
    expect(metersSource(live, Date.parse('2026-11-07T10:20:00Z'))).toBe('stale');
  });
});

describe('the lab', () => {
  it('finds the best score per suite and the next lesson on a track', () => {
    expect(bestBySuite(data.science).routing?.id).toBe('EV-903');
    const t = data.science.study[0];
    expect(trackProgress(t)).toEqual({ done: 3, total: 5 });
    expect(nextLesson(t)?.title).toBe('Why the context needs memory too');
    expect(nextLesson(data.science.study[2])).toBeUndefined();
  });
});
