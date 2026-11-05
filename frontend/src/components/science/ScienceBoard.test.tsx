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
import type { Fixtures } from '../../types';
import { makeShipView } from '../../lib/ship';
import { bestBySuite, nextLesson, trackProgress } from '../../lib/science';
import { ScienceBoard } from './ScienceBoard';

const data = { ship, stations, rails, orders, shiplog, quarters, sensors, engineering, science } as unknown as Fixtures;
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

describe('the lab', () => {
  it('finds the best score per suite and the next lesson on a track', () => {
    expect(bestBySuite(data.science).routing?.id).toBe('EV-903');
    const t = data.science.study[0];
    expect(trackProgress(t)).toEqual({ done: 3, total: 5 });
    expect(nextLesson(t)?.title).toBe('Why the context needs memory too');
    expect(nextLesson(data.science.study[2])).toBeUndefined();
  });
});
