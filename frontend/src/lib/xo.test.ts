// Number One's routing: the tester (where would this go?) and new fast paths drafted for the Chief Engineer.
import { describe, expect, it } from 'vitest';
import roster from '../../../fixtures/stations.json';
import type { StationsFile } from '../types';
import { fastCheck, fastPathBrief, fastTargets, fastWords, routeOf } from './xo';

const stations = (roster as unknown as StationsFile).stations;
const st = (id: string) => stations.find((s) => s.id === id)!;

describe('where a message would go', () => {
  it('reads a speed word first, then the coded fast path', () => {
    const g = routeOf('Warp: remind me at 21:00 to call the garage', stations);
    expect(g.speed).toBe('Warp');
    expect(g.rest).toBe('remind me at 21:00 to call the garage');
    expect(g.coded).toEqual({ word: 'remind', to: 'yeoman', patch: 'P' });
    expect(routeOf('Todo! book tyres', stations).coded?.to).toBe('yeoman');
    expect(routeOf('half impulse, yeoman: what is on my list?', stations).speed).toBe('Half Impulse');
  });
  it('matches the fast path only at the start, as a whole word', () => {
    expect(routeOf('Reminder of the meeting', stations).coded).toBeUndefined();
    expect(routeOf('what is the todo list', stations).coded).toBeUndefined();
    expect(routeOf('warp remind me', stations).speed).toBeUndefined();
  });
  it('without a fast path, lists the stations the words name, the first named first', () => {
    const g = routeOf('Ask Navigation for the train times, then tell Helm', stations);
    expect(g.coded).toBeUndefined();
    expect(g.named.map((n) => n.id)).toEqual(['nav', 'helm']);
    expect(routeOf("What's the weather tomorrow?", stations).named).toEqual([]);
    expect(routeOf('the helmet is broken', stations).named).toEqual([]);
  });
});

describe('a new fast path', () => {
  it('cleans the words: lower case, no quotes or end punctuation, no repeats', () => {
    expect(fastWords(' "Log meal:" , meal,  MEAL ,')).toEqual(['log meal', 'meal']);
  });
  it('goes only to live crew stations with their own profile', () => {
    const ids = fastTargets(stations).map((s) => s.id);
    expect(ids).toContain('qm');
    expect(ids).toContain('eng');
    expect(ids).not.toContain('xo');
    expect(ids).not.toContain('doctor');
    expect(ids).not.toContain('sys');
    expect(ids).not.toContain('screen');
  });
  it('stops on speed words and words that already have a fast path, and notes names', () => {
    const c = fastCheck({ words: 'warp, todo now, helm', to: 'qm', avoid: '' }, stations);
    expect(c.stop).toHaveLength(2);
    expect(c.note.join(' ')).toContain("Helm's name");
    expect(fastCheck({ words: 'log meal', to: '', avoid: '' }, stations).stop).toEqual(['Pick the station it goes to.']);
    expect(fastCheck({ words: 'log meal', to: 'qm', avoid: '' }, stations)).toEqual({ stop: [], note: [] });
  });
  it('writes the card for the Chief Engineer in the house format', () => {
    const card = fastPathBrief({ words: 'log meal, meal', to: 'qm', avoid: 'the meal plan' }, st('qm'), st('eng'));
    for (const h of ['## GOAL', '## CONTEXT', '## CONSTRAINTS', '## DONE WHEN']) expect(card).toContain(h);
    expect(card).toContain('one card for forge');
    expect(card).toContain('"log meal" or "meal"');
    expect(card).toContain('assignee scribe');
    expect(card).toContain('"Log meal test", "Meal test", "Warp: log meal test" each create one scribe card');
    expect(card).toContain('"tell me about log meal" or "the meal plan" create none');
    expect(card).toContain('fast-path-log-meal-report.md');
    expect(card).toContain('Never sleep, wait or poll');
  });
});
