// Number One's routing: the tester (where would this go?) and new fast paths drafted for the Chief Engineer.
import { describe, expect, it } from 'vitest';
import roster from '../../../fixtures/stations.json';
import sample from '../../../fixtures/fastpaths.json';
import type { FastPathsFile, StationsFile } from '../types';
import { fastCheck, fastEntry, fastPathBrief, fastPaths, fastSource, fastTargets, fastWords, routeOf } from './xo';

const stations = (roster as unknown as StationsFile).stations;
const file = sample as unknown as FastPathsFile;
const paths = fastPaths({ fastpaths: file, stations: roster as unknown as StationsFile });
const draft = (d: Partial<{ words: string; to: string; avoid: string; example: string }>) => ({ words: '', to: '', avoid: '', example: '', ...d });
const st = (id: string) => stations.find((s) => s.id === id)!;

describe('the fast paths', () => {
  it('come from the fast-path file, each with the station whose profile it files to', () => {
    expect(paths.map((p) => [p.say, p.to, p.patch])).toEqual([['remind…', 'yeoman', 'P'], ['todo… / todo!…', 'yeoman', 'P'], ['yeoman…', 'yeoman', 'P']]);
    expect(fastSource({ fastpaths: file })).toContain('SAMPLE');
    expect(fastSource({ fastpaths: { ...file, synthetic: false, asOf: '2026-11-07T10:31:00Z' } })).toBe("FROM HERMES' FAST-PATHS.JSON · AS OF 10:31 UTC");
  });
  it('a new entry in the file is a new fast path, phrases and all', () => {
    const more = fastPaths({ fastpaths: { ...file, paths: [...file.paths, { words: ['log meal'], profile: 'scribe' }] }, stations: roster as unknown as StationsFile });
    const g = routeOf('Thrusters: log meal two eggs', stations, more);
    expect(g.coded).toEqual({ word: 'log meal', to: 'qm', patch: undefined });
    expect(routeOf('log meals later', stations, more).coded).toBeUndefined();
  });
});

describe('where a message would go', () => {
  it('reads a speed word first, then the coded fast path', () => {
    const g = routeOf('Warp: remind me at 21:00 to call the garage', stations, paths);
    expect(g.speed).toBe('Warp');
    expect(g.rest).toBe('remind me at 21:00 to call the garage');
    expect(g.coded).toEqual({ word: 'remind', to: 'yeoman', patch: 'P' });
    expect(routeOf('Todo! book tyres', stations, paths).coded?.to).toBe('yeoman');
    expect(routeOf('half impulse, yeoman: what is on my list?', stations, paths).speed).toBe('Half Impulse');
  });
  it('matches the fast path only at the start, as a whole word', () => {
    expect(routeOf('Reminder of the meeting', stations, paths).coded).toBeUndefined();
    expect(routeOf('what is the todo list', stations, paths).coded).toBeUndefined();
    expect(routeOf('warp remind me', stations, paths).speed).toBeUndefined();
  });
  it('without a fast path, lists the stations the words name, the first named first', () => {
    const g = routeOf('Ask Navigation for the train times, then tell Helm', stations, paths);
    expect(g.coded).toBeUndefined();
    expect(g.named.map((n) => n.id)).toEqual(['nav', 'helm']);
    expect(routeOf("What's the weather tomorrow?", stations, paths).named).toEqual([]);
    expect(routeOf('the helmet is broken', stations, paths).named).toEqual([]);
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
    const c = fastCheck(draft({ words: 'warp, todo now, helm', to: 'qm' }), stations, paths);
    expect(c.stop).toHaveLength(2);
    expect(c.note.join(' ')).toContain("Helm's name");
    expect(fastCheck(draft({ words: 'log meal' }), stations, paths).stop).toEqual(['Pick the station it goes to.']);
    expect(fastCheck(draft({ words: 'log meal', to: 'qm' }), stations, paths)).toEqual({ stop: [], note: [] });
    expect(fastCheck(draft({ words: 'log meal', to: 'qm', example: 'Warp: log meal two eggs' }), stations, paths).stop).toEqual([]);
    expect(fastCheck(draft({ words: 'log meal', to: 'qm', example: 'two eggs, log meal' }), stations, paths).stop.join(' ')).toContain('The example must start');
  });
  it('writes the card for the Chief Engineer in the house format', () => {
    const d = draft({ words: 'log meal, meal', to: 'qm', avoid: 'the meal plan', example: 'log meal two eggs and toast' });
    expect(JSON.parse(fastEntry(d, st('qm')))).toEqual({ words: ['log meal', 'meal'], profile: 'scribe', patch: '<the new letter>', example: 'log meal two eggs and toast' });
    const card = fastPathBrief(d, st('qm'), st('eng'));
    expect(card).toContain('Add one entry to /opt/data/routing/fast-paths.json');
    expect(card).toContain('B2-34 comes first');
    for (const h of ['## GOAL', '## CONTEXT', '## CONSTRAINTS', '## DONE WHEN']) expect(card).toContain(h);
    expect(card).toContain('one card for forge');
    expect(card).toContain('"log meal" or "meal"');
    expect(card).toContain('"log meal two eggs and toast", "Log meal test", "Meal test", "Warp: log meal test" each create one scribe card');
    expect(card).toContain('"tell me about log meal" or "the meal plan" create none');
    expect(card).toContain('fast-path-log-meal-report.md');
    expect(card).toContain('Never sleep, wait or poll');
  });
});
