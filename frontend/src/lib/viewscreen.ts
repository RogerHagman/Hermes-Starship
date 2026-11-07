// The Main Viewscreen (Deck 1, a place, not a crew member): the Captain's desktop on the bridge.
// "On screen" starts a session: the desktop is captured and sent to Telegram; "off screen" ends it.
// Number One runs it, and every click, typed text, key and scroll waits for the Captain's OK. Never
// yolo. Computer use is not fitted yet, so the sessions are the sample (fixtures/viewscreen.json);
// its orders are live.
import { inLastDays, type Spot } from './post';
import type { AwayAction, AwaySession, ViewscreenFile } from '../types';

export type VsObject = 'bridge' | 'switch' | 'rules' | 'relay' | 'approve' | 'log' | 'captain' | 'orders' | 'desk';

export const SPOTS: Spot<VsObject>[] = [
  { id: 'bridge',  box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'switch',  box: [160, 56, 176, 250],  label: [248, 40] },
  { id: 'rules',   box: [160, 318, 176, 180], label: [248, 508] },
  { id: 'relay',   box: [346, 56, 176, 442],  label: [434, 40] },
  { id: 'approve', box: [1272, 64, 116, 198], label: [1330, 40] },
  { id: 'log',     box: [1266, 290, 128, 274], label: [1330, 584] },
  { id: 'captain', box: [1400, 96, 188, 468], label: [1494, 500] },
  { id: 'orders',  box: [194, 580, 166, 130], label: [276, 566] },
  { id: 'desk',    box: [1056, 580, 196, 140], label: [1154, 566] },
];

export const KIND_WORD: Record<AwayAction['kind'], string> = { click: 'Click', type: 'Type', key: 'Key', scroll: 'Scroll' };
export const DECISION_WORD: Record<AwayAction['decision'], string> = { approved: 'Approved', denied: 'Denied', waiting: 'Waiting for you' };
export const DECISION_COLOUR: Record<AwayAction['decision'], string> = { approved: '#7fd8a8', denied: 'var(--bad)', waiting: 'var(--captain)' };

/** The rules of the Viewscreen, from the station roster and the Captain's duty. */
export const STANDING: { name: string; text: string }[] = [
  { name: 'On screen', text: '"On screen" starts a session: the desktop is captured and the capture goes to you on Telegram.' },
  { name: 'Every action asks', text: 'Every click, typed text, key and scroll waits for your OK before it happens. Never yolo.' },
  { name: 'Off screen', text: '"Off screen" ends the session. Nothing more is captured until the next "on screen".' },
  { name: 'Number One runs it', text: 'The Viewscreen is a place, not a crew member. Number One runs it on the local rail; you approve.' },
  { name: 'A no is a no', text: 'A denied action is logged as denied. The session goes on without it.' },
];

/** Sessions, newest first. */
export const sessions = (f: ViewscreenFile): AwaySession[] => [...f.sessions].sort((a, b) => b.start.localeCompare(a.start));
/** The session on screen now: the newest one with no end. */
export const current = (f: ViewscreenFile): AwaySession | undefined => sessions(f).find((s) => !s.end);

export interface Ask { session: AwaySession; action: AwayAction }
/** Every action of every session, newest first. */
export function actions(f: ViewscreenFile): Ask[] {
  return f.sessions.flatMap((session) => session.actions.map((action) => ({ session, action }))).sort((a, b) => b.action.at.localeCompare(a.action.at));
}
/** Actions waiting for the Captain's OK. */
export const waiting = (f: ViewscreenFile) => actions(f).filter((a) => a.action.decision === 'waiting');

/** A session's count of approved, denied and waiting actions. */
export function tally(s: AwaySession): Record<AwayAction['decision'], number> {
  const out = { approved: 0, denied: 0, waiting: 0 };
  for (const a of s.actions) out[a.decision] += 1;
  return out;
}

/** How long a session ran, or has run until asOf: "8 min". */
export function length(s: AwaySession, asOf: string): string {
  const m = Math.max(0, Math.round((Date.parse(s.end ?? asOf) - Date.parse(s.start)) / 60_000));
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

/** The last 7 days: sessions, actions, approved, denied, captures. */
export function weekOf(f: ViewscreenFile) {
  const list = f.sessions.filter((s) => inLastDays(s.start, f.asOf));
  const acts = list.flatMap((s) => s.actions);
  return {
    sessions: list.length, actions: acts.length, captures: list.reduce((n, s) => n + s.captures, 0),
    approved: acts.filter((a) => a.decision === 'approved').length, denied: acts.filter((a) => a.decision === 'denied').length,
  };
}

/** 24 x 24 line icons for the room's things. */
export const VS_ICONS: Record<VsObject | 'ease' | 'session' | 'off', string> = {
  ease: 'M3 5h18v12H3z M8 21h8 M12 17v4',
  off: 'M3 5h18v12H3z M8 21h8 M12 17v4 M4 4l16 16',
  session: 'M3 5h18v12H3z M7 9h6 M7 12h9',
  bridge: 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M12 3v18',
  switch: 'M7 6h10a6 6 0 0 1 0 12H7A6 6 0 0 1 7 6z M7 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  rules: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z M9 8h6 M9 12h6',
  relay: 'M12 20v-8 M8 8a6 6 0 0 1 8 0 M5 5a10 10 0 0 1 14 0 M10 11a2 2 0 0 1 4 0',
  approve: 'M5 12l4 4 10-10',
  log: 'M4 6h16 M4 12h16 M4 18h10',
  captain: 'M6 21V9a6 6 0 0 1 12 0v12 M4 15h4 M16 15h4',
  orders: 'M6 3h9l3 3v15H6z M9 9h6 M9 13h6 M9 17h4',
  desk: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
};
