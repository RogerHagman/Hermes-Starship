// The core terminal's own workings: what a typed line means, the list's pages, the settings the
// Captain can change (kept in this browser only), and the manual. Nothing typed here reaches Hermes.
import { find, parseCommand, type Query } from './computer';
import type { ShipView } from './ship';
import type { Order } from '../types';

// ---------- settings ----------

export interface CoreSettings {
  /** Orders on one page of the list. */
  rows: number;
  order: 'newest' | 'oldest';
  /** Where typed words are looked for. */
  search: 'all' | 'titles';
  /** The date at the end of each row: the day, or the day and the time. */
  dates: 'day' | 'time';
  /** What the list shows when the board opens. */
  start: 'all' | 'open' | 'awaiting-captain';
  /** The key that jumps to the command line from anywhere on the board. */
  key: '/' | '§' | 'ctrl+k';
  phosphor: 'green' | 'amber' | 'blue';
}

export const DEFAULTS: CoreSettings = { rows: 200, order: 'newest', search: 'all', dates: 'day', start: 'all', key: '/', phosphor: 'green' };

type Value = CoreSettings[keyof CoreSettings];
export interface Choice { v: Value; word: string; also?: string[] }
export interface Setting { id: keyof CoreSettings; name: string; says: string; also: string[]; choices: Choice[] }

/** Every setting, in the order the settings page and the manual list them. */
export const SETTINGS: Setting[] = [
  { id: 'rows', name: 'Rows per page', also: ['page', 'pages', 'lines'],
    says: 'How many orders one page of the list holds. Past that, the list goes on to a new page.',
    choices: [{ v: 50, word: '50' }, { v: 100, word: '100' }, { v: 200, word: '200' }, { v: 500, word: '500' }] },
  { id: 'order', name: 'Order', also: ['sort'],
    says: 'Newest first starts with the latest update. Oldest first starts at the far end of the records.',
    choices: [{ v: 'newest', word: 'Newest first', also: ['new', 'latest'] }, { v: 'oldest', word: 'Oldest first', also: ['old'] }] },
  { id: 'search', name: 'Words search', also: ['find', 'words', 'look'],
    says: 'Where the words you type are looked for: the whole record, or only the order number and title.',
    choices: [{ v: 'all', word: 'Everything', also: ['everything', 'body'] }, { v: 'titles', word: 'Titles only', also: ['title'] }] },
  { id: 'dates', name: 'Dates on rows', also: ['date', 'time'],
    says: 'The end of each row: the day of the last update, or the day and the time.',
    choices: [{ v: 'day', word: 'Day', also: ['days'] }, { v: 'time', word: 'Day and time', also: ['times'] }] },
  { id: 'start', name: 'On start', also: ['startup', 'begin'],
    says: 'What the list shows when the board opens. all, clear and reset still show every order.',
    choices: [{ v: 'all', word: 'All orders' }, { v: 'open', word: 'Open orders' },
      { v: 'awaiting-captain', word: 'Awaits you', also: ['awaiting', 'awaits', 'captain'] }] },
  { id: 'key', name: 'Jump key', also: ['jump', 'shortcut', 'hotkey'],
    says: 'The key that takes you to the command line from anywhere on this board. § is the key under Esc on a Swedish keyboard.',
    choices: [{ v: '/', word: '/', also: ['slash'] }, { v: '§', word: '§', also: ['section', 'paragraph'] },
      { v: 'ctrl+k', word: 'Ctrl+K', also: ['ctrl-k', '^k', 'cmd+k'] }] },
  { id: 'phosphor', name: 'Phosphor', also: ['colour', 'color', 'screen'],
    says: "The colour of the terminal's text. The order states keep their own colours.",
    choices: [{ v: 'green', word: 'Green' }, { v: 'amber', word: 'Amber' }, { v: 'blue', word: 'Ice blue', also: ['ice'] }] },
];

/** The phosphor colours, as the screen's --phos. */
export const PHOSPHOR: Record<CoreSettings['phosphor'], string> = { green: '#9cf0b8', amber: '#ffc46b', blue: '#a6dcff' };

const KEY = 'hermes.coreTerminal';

/** The settings this browser keeps. Anything missing or unknown falls back to its default. */
export function loadSettings(): CoreSettings {
  let raw: Record<string, unknown> = {};
  try { raw = JSON.parse(localStorage.getItem(KEY) ?? '{}') ?? {}; } catch { /* no storage */ }
  const out = { ...DEFAULTS } as Record<keyof CoreSettings, Value>;
  for (const s of SETTINGS) {
    const v = raw[s.id];
    if (s.choices.some((c) => c.v === v)) out[s.id] = v as Value;
  }
  return out as CoreSettings;
}

export function saveSettings(s: CoreSettings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* no storage: this visit only */ }
}

export const settingOf = (word: string) => {
  const w = word.toLowerCase();
  return SETTINGS.find((s) => s.id === w || s.name.toLowerCase() === w || s.also.includes(w));
};

/** The choice a typed value means: its value, its word, its first word, or one of its other words. */
export function choiceOf(s: Setting, word: string): Choice | undefined {
  const w = word.toLowerCase();
  return s.choices.find((c) => String(c.v).toLowerCase() === w)
    ?? s.choices.find((c) => c.word.toLowerCase() === w)
    ?? s.choices.find((c) => c.also?.includes(w))
    ?? s.choices.find((c) => c.word.toLowerCase().split(' ')[0] === w);
}

export const wordOf = (s: Setting, v: Value) => s.choices.find((c) => c.v === v)?.word ?? String(v);
const choiceList = (s: Setting) => s.choices.map((c) => String(c.v)).join(', ');
const NAMES = SETTINGS.map((s) => s.id).join(', ');

/** "set rows 100": the settings after it, and what the terminal says about it. */
export function applySet(now: CoreSettings, name: string, value?: string): { settings: CoreSettings; said: string } {
  const n = name.toLowerCase();
  if (!value && (n === 'defaults' || n === 'default' || n === 'reset')) return { settings: { ...DEFAULTS }, said: 'Settings back to their defaults.' };
  const s = settingOf(n);
  if (!s) return { settings: now, said: `set: no setting called ${name}. The settings: ${NAMES}. To find the words, put the line in "quotes".` };
  if (!value) return { settings: now, said: `${s.name}: ${wordOf(s, now[s.id])}. Choose ${choiceList(s)}.` };
  const c = choiceOf(s, value);
  if (!c) return { settings: now, said: `${s.name}: ${value} is not a choice. Choose ${choiceList(s)}.` };
  return { settings: { ...now, [s.id]: c.v }, said: `${s.name}: ${c.word}.` };
}

/** Does this key press jump to the command line? (The caller skips / and § while typing in a field.) */
export function isJumpKey(e: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey'>, key: CoreSettings['key']): boolean {
  if (key === 'ctrl+k') return (e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k';
  return e.key === key && !e.ctrlKey && !e.metaKey && !e.altKey;
}

export const keyWord = (key: CoreSettings['key']) => (key === 'ctrl+k' ? 'Ctrl+K' : key);

// ---------- the list and its pages ----------

/** The orders a query shows, in the order the settings ask for. */
export function listOf(all: Order[], q: Query, s: CoreSettings): Order[] {
  const list = find(all, q, s.search);
  return s.order === 'oldest' ? list.reverse() : list;
}

export interface PageAt { at: number; pages: number; from: number; to: number }

/** Page `page` (from 0, held inside the list) of `total` orders, `rows` a page. */
export function pageAt(total: number, rows: number, page: number): PageAt {
  const pages = Math.max(1, Math.ceil(total / rows));
  const at = Math.min(Math.max(0, page), pages - 1);
  return { at, pages, from: at * rows, to: Math.min(total, (at + 1) * rows) };
}

// ---------- what a typed line means ----------

export type PageTo = number | 'next' | 'prev' | 'first' | 'last';
export type Command =
  | { kind: 'open'; id: string }
  | { kind: 'query'; query: Query; said?: string }
  | { kind: 'page'; to: PageTo }
  | { kind: 'stats' }
  | { kind: 'man'; topic?: string }
  | { kind: 'set'; name?: string; value?: string };

const STATS_WORDS = new Set(['stats', 'statistics', 'numbers']);
const PAGE_WORDS: Record<string, PageTo> = { next: 'next', more: 'next', prev: 'prev', previous: 'prev', first: 'first', last: 'last' };

/**
 * A line typed on the command line. Terminal commands (man, set, stats, page and its words) come
 * first and only in their own shape, so "set up the printer" is still a search when it is quoted;
 * everything else is an order number or a query (see parseCommand).
 */
export function command(line: string, ship: ShipView, q: Query): Command | null {
  const text = line.trim();
  if (!text) return null;
  const parts = text.split(/\s+/);
  const first = parts[0].toLowerCase();
  const alone = parts.length === 1;
  if (!text.startsWith('"')) {
    if (alone && STATS_WORDS.has(first)) return { kind: 'stats' };
    if (first === 'man' || first === 'help' || text === '?') return parts[1] ? { kind: 'man', topic: parts[1] } : { kind: 'man' };
    if (first === 'settings' && alone) return { kind: 'set' };
    if (first === 'set') return parts[1] ? { kind: 'set', name: parts[1], value: parts.slice(2).join(' ') || undefined } : { kind: 'set' };
    if (first === 'page' && parts.length === 2 && /^\d+$/.test(parts[1])) return { kind: 'page', to: Number(parts[1]) };
    if (alone && PAGE_WORDS[first]) return { kind: 'page', to: PAGE_WORDS[first] };
  }
  const { query, open, said } = parseCommand(text, ship, q);
  if (open) return { kind: 'open', id: open };
  return said ? { kind: 'query', query, said } : { kind: 'query', query };
}

/** The page (from 0) a page command goes to, and what the terminal says if it can't. */
export function turn(to: PageTo, now: PageAt): { page: number; said?: string } {
  if (to === 'next') return now.at + 1 < now.pages ? { page: now.at + 1 } : { page: now.at, said: 'That is the last page.' };
  if (to === 'prev') return now.at > 0 ? { page: now.at - 1 } : { page: 0, said: 'That is the first page.' };
  if (to === 'first') return { page: 0 };
  if (to === 'last') return { page: now.pages - 1 };
  if (to < 1 || to > now.pages) return { page: now.at, said: `page: there ${now.pages === 1 ? 'is 1 page' : `are ${now.pages} pages`}.` };
  return { page: to - 1 };
}

// ---------- the manual ----------

export interface ManEntry {
  id: string;
  /** How it is typed. */
  usage: string[];
  says: string;
  /** Lines to try: picking one runs it. */
  eg?: string[];
  /** Other words that find this entry with "man <word>". */
  words: string[];
}

/** The commands, as the manual lists them. The page size and jump key follow the settings. */
export function manCommands(s: CoreSettings): ManEntry[] {
  return [
    { id: 'ord', usage: ['ORD-dddd'], words: ['ord', 'record', 'order'],
      says: "Opens that order's full record: its facts, the brief, what came back, its sub-orders and its lines in the ship's log. ‹ Newer and Older › step through the list you came from, and ‹ Records goes back to the page it is on.",
      eg: ['ORD-1232'] },
    { id: 'state', usage: ['state <state>', 'status <state>', '<state>'], words: ['status', 'queued', 'running', 'review', 'awaiting', 'blocked', 'done'],
      says: 'Shows only the orders in one state: queued, running, review, awaiting (or awaits, captain), blocked or done. A state word on its own line works too.',
      eg: ['state blocked', 'done'] },
    { id: 'open', usage: ['open'], words: [],
      says: 'Shows every order that is not done.', eg: ['open'] },
    { id: 'station', usage: ['station <name>'], words: ['stations'],
      says: "Shows one station's orders. The name can be the station's id, its short name, its full name, an alias or its Hermes profile.",
      eg: ['station forge', 'station yeoman'] },
    { id: 'since', usage: ['since <day>', 'before <day>', 'since any', 'before any'], words: ['before', 'day', 'days', 'date'],
      says: 'Orders opened on or after a day, or before it, to reach further back. A day is 24/10, 24/10/2026, 2026-10-24, today or yesterday; 24/10 means the last 24 October. An order with no opening time counts by its last update. any drops the day again.',
      eg: ['since 20/10', 'before 25/10 state done', 'since any before any'] },
    { id: 'words', usage: ['<words>', '"<words>"'], words: ['search', 'find', 'quotes'],
      says: `Anything else is words to find. An order matches when every word is in it: its number, title, brief, note or replies (or the number and title only, if you set search titles). Each line you type replaces the words, and the state, station and days stay until you change them. A line in "quotes" is only words, so you can find next or set.`,
      eg: ['dentist', '"set up"'] },
    { id: 'all', usage: ['all', 'clear', 'reset'], words: ['clear', 'reset'],
      says: 'Drops the state, the station and the days. Words on the same line still apply.', eg: ['all'] },
    { id: 'page', usage: ['page <n>', 'next', 'prev', 'first', 'last'], words: ['next', 'prev', 'previous', 'first', 'last', 'more', 'pages'],
      says: `The list holds ${s.rows} orders a page (set rows). Past that it goes on to a new page: these move between them, and so do PgDn and PgUp on the command line. A new search starts again on page 1.`,
      eg: ['page 2', 'last', 'first'] },
    { id: 'stats', usage: ['stats', 'statistics', 'numbers'], words: ['statistics', 'numbers'],
      says: 'Opens Records · the numbers: orders opened and closed this week, the median time to close, opened per day, time to close per station, and where the orders came from. The records racks in the room open it too.',
      eg: ['stats'] },
    { id: 'set', usage: ['set', 'settings', 'set <name> <value>', 'set defaults'], words: ['settings', 'setting', 'defaults'],
      says: `set or settings opens the settings page. set <name> <value> changes one from here, and set <name> says what it is now. The settings: ${NAMES}. This browser keeps them; they never reach Hermes.`,
      eg: ['set rows 100', 'set order oldest', 'set rows'] },
    { id: 'man', usage: ['man', 'man <command>', 'help', '?'], words: ['help', 'manual'],
      says: `This page. man <command> goes straight to that command. ${keyWord(s.key)} takes you back to the command line.`,
      eg: ['man since'] },
  ];
}

/** The manual's sections, in order. */
export const MAN_SECTIONS = ['name', 'synopsis', 'description', 'commands', 'keys', 'settings', 'files'] as const;
export type ManSection = typeof MAN_SECTIONS[number];

/** Where "man <word>" goes: a command's entry, or a section. Undefined if the manual has nothing on it. */
export function manTopic(word: string, s: CoreSettings = DEFAULTS): string | undefined {
  const w = word.toLowerCase().replace(/^ord-\d*$/, 'ord');
  if ((MAN_SECTIONS as readonly string[]).includes(w)) return w;
  if (w === 'key' || w === 'shortcut' || w === 'shortcuts') return 'keys';
  if (w === 'file' || w === 'records' || w === 'probe') return 'files';
  return manCommands(s).find((e) => e.id === w || e.words.includes(w))?.id ?? (settingOf(w) ? 'settings' : undefined);
}
