// Helm (Deck 1, flight control): the career course. The application tracker is the source of truth:
// job ads, applications and what happened to them (live/helm.json from the ship probe, else the
// sample). The method is hermes/helm/method.md: ten steps, four of them the Captain's gates. Helm
// never sends anything; the Captain sends every application.
import { dayKey, dayLine } from './format';
import type { Spot } from './post';
import type { Application, HelmFile, JobAd } from '../types';

export type HelmObject = 'bridge' | 'ads' | 'gates' | 'follow' | 'method' | 'log' | 'desk';

export const SPOTS: Spot<HelmObject>[] = [
  { id: 'bridge', box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'ads',    box: [160, 56, 362, 440],  label: [341, 512] },
  { id: 'gates',  box: [1272, 64, 116, 198], label: [1330, 40] },
  { id: 'follow', box: [1266, 290, 128, 274], label: [1330, 584] },
  { id: 'method', box: [1400, 96, 188, 468], label: [1494, 76] },
  { id: 'log',    box: [194, 580, 166, 130], label: [276, 566] },
  { id: 'desk',   box: [1056, 580, 196, 140], label: [1154, 566] },
];

/** The timing rules in app_tracker.py. */
export const FOLLOW_UP_DAYS = 14;
export const GHOSTED_DAYS = 30;
export const DEADLINE_WARN_DAYS = 3;

/** The ten steps of the method. The gates are the Captain's. */
export const METHOD: { n: number; name: string; text: string; gate?: string }[] = [
  { n: 1, name: 'Find', text: 'An ad comes in: pasted, or later the Platsbanken scan. The full ad text is saved with its source line.' },
  { n: 2, name: 'Triage', text: 'The keyword analyser gives a baseline on the master CV. Claude reads the ad: fit, real gaps, red flags, place, travel.', gate: 'Shortlist, skip or park' },
  { n: 3, name: 'Research', text: 'For shortlisted jobs: the company, who reads the application, the deadline and the salary level. Notes go on the job row.' },
  { n: 4, name: 'Tailor CV', text: 'Reword so the true keywords show, until about 70% or until nothing honest is left to add. Two pages, passes the format check.' },
  { n: 5, name: 'Letter', text: "One page. It answers the ad's own prompt and uses the same facts as the CV." },
  { n: 6, name: 'Review', text: 'You read the PDFs and comment; fix and rebuild until you are happy.', gate: 'Approve: it moves to ready' },
  { n: 7, name: 'Send', text: 'You send it. Code freezes exactly what was sent and sets the follow-up date.', gate: 'You send it, never Hermes' },
  { n: 8, name: 'Wait', text: `No reply after ${FOLLOW_UP_DAYS} days: one short follow-up. No reply after ${GHOSTED_DAYS} days: ghosted. Every reply is logged.` },
  { n: 9, name: 'Interview', text: 'A prep pack: the ad, the frozen CV and letter, stories, questions to ask. A thank-you note within 24 hours.' },
  { n: 10, name: 'Close', text: 'Offer, rejected, withdrawn or ghosted. One line on what was learned; the gaps list gets updated.', gate: 'Accept or decline' },
];

/** The standing rules at the top of the method. */
export const STANDING = [
  'Only true things go in a CV or letter. A keyword goes in only where it is honestly yours.',
  'Nothing is sent by Hermes. You send every application yourself.',
  'One or two applications per company, not one per open role.',
  'Every step leaves a row in the application tracker, so the timeline is always complete.',
];

export const AD_WORD: Record<JobAd['status'], string> = { found: 'To triage', shortlisted: 'Shortlisted', applying: 'Applying', skipped: 'Skipped', parked: 'Parked' };
export const APP_WORD: Record<Application['status'], string> = {
  drafting: 'Drafting', ready: 'Ready to send', applied: 'Sent', interview: 'Interview', offer: 'Offer', rejected: 'Rejected', withdrawn: 'Withdrawn', ghosted: 'Ghosted',
};
const GOLD = 'var(--captain)';
export const AD_COLOUR: Record<JobAd['status'], string> = { found: GOLD, shortlisted: '#6fb7f2', applying: '#ef7a6a', skipped: '#7a8696', parked: '#b9a6f5' };
export const APP_COLOUR: Record<Application['status'], string> = {
  drafting: '#ef7a6a', ready: GOLD, applied: '#6fb7f2', interview: '#8fd14f', offer: '#7fd8a8', rejected: '#7a8696', withdrawn: '#7a8696', ghosted: '#7a8696',
};
export const CLOSED_APPS: Application['status'][] = ['rejected', 'withdrawn', 'ghosted'];

/** The course: every open job and application, by stage, left to right. */
export type Stage = 'triage' | 'shortlisted' | 'drafting' | 'ready' | 'applied' | 'interview' | 'closed';
export const STAGES: { id: Stage; name: string; colour: string; hint: string }[] = [
  { id: 'triage', name: 'To triage', colour: GOLD, hint: 'Ads waiting for your call' },
  { id: 'shortlisted', name: 'Shortlisted', colour: '#6fb7f2', hint: 'Research before an application' },
  { id: 'drafting', name: 'Drafting', colour: '#ef7a6a', hint: 'CV and letter being tailored' },
  { id: 'ready', name: 'Ready', colour: GOLD, hint: 'Approved: yours to send' },
  { id: 'applied', name: 'Sent', colour: '#6fb7f2', hint: 'Waiting for a reply' },
  { id: 'interview', name: 'Interview', colour: '#8fd14f', hint: 'In talks, or an offer to answer' },
  { id: 'closed', name: 'Closed', colour: '#7a8696', hint: 'Offer, rejected, withdrawn or ghosted' },
];

/** A card on the course: a job ad not yet applied for, or an application. */
export type Card = { kind: 'ad'; ad: JobAd } | { kind: 'app'; app: Application; ad?: JobAd };

export function course(f: HelmFile): Record<Stage, Card[]> {
  const out: Record<Stage, Card[]> = { triage: [], shortlisted: [], drafting: [], ready: [], applied: [], interview: [], closed: [] };
  const withApp = new Set(f.applications.map((a) => a.job));
  for (const ad of f.ads) {
    if (ad.status === 'found') out.triage.push({ kind: 'ad', ad });
    else if (ad.status === 'shortlisted' || (ad.status === 'applying' && !withApp.has(ad.id))) out.shortlisted.push({ kind: 'ad', ad });
  }
  for (const app of f.applications) {
    const ad = f.ads.find((a) => a.id === app.job);
    const stage: Stage = CLOSED_APPS.includes(app.status) ? 'closed' : app.status === 'offer' ? 'interview' : (app.status as Stage);
    out[stage].push({ kind: 'app', app, ad });
  }
  return out;
}

/** A date-only day as a day number, so two days can be subtracted. */
const dayNo = (d: string) => Math.round(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)) / 86_400_000);
/** The tracker's "today": the ship's day of asOf. */
export const today = (f: HelmFile) => dayKey(f.asOf);
/** Whole days from day a to day b. */
export const days = (a: string, b: string) => dayNo(b) - dayNo(a);
/** A date-only day the way the boards show a day: "TUE 3 NOV". */
export const dateWord = (d: string) => dayLine(`${d}T12:00:00Z`);

export interface FollowUp { app: Application; since: number; due: string; kind: 'ghosted' | 'follow-up' | 'waiting' }

/** Every sent application with no reply yet: how long since it went, and what the timing rules say. */
export function followUps(f: HelmFile): FollowUp[] {
  const now = today(f);
  return f.applications.filter((a) => a.status === 'applied' && a.applied).map((app) => {
    const since = days(app.applied!, now);
    const kind: FollowUp['kind'] = since >= GHOSTED_DAYS ? 'ghosted' : since >= FOLLOW_UP_DAYS ? 'follow-up' : 'waiting';
    const due = addDays(app.applied!, kind === 'waiting' ? FOLLOW_UP_DAYS : GHOSTED_DAYS);
    return { app, since, due, kind };
  }).sort((a, b) => b.since - a.since);
}

export function addDays(d: string, n: number): string {
  return new Date((dayNo(d) + n) * 86_400_000).toISOString().slice(0, 10);
}

export interface Deadline { ad: JobAd; left: number }

/** Open ads with a deadline: passed ones (left < 0), and the ones inside the warning window first. */
export function deadlines(f: HelmFile): Deadline[] {
  const now = today(f);
  return f.ads.filter((a) => a.deadline && ['found', 'shortlisted', 'applying'].includes(a.status))
    .map((ad) => ({ ad, left: days(now, ad.deadline!) }))
    .sort((a, b) => a.left - b.left);
}
export const warn = (d: Deadline) => d.left >= 0 && d.left <= DEADLINE_WARN_DAYS;

export interface Gate { step: number; name: string; what: string; id: string; title: string; note: string }

/** Everything waiting on the Captain at one of the four gates, in the method's order. */
export function gates(f: HelmFile): Gate[] {
  const out: Gate[] = [];
  for (const ad of f.ads.filter((a) => a.status === 'found')) {
    out.push({ step: 2, name: 'Triage', what: 'Shortlist, skip or park', id: ad.id, title: `${ad.role} · ${ad.company}`,
      note: [ad.match !== undefined ? `${ad.match}% keyword match` : '', ad.fit ? `fit: ${ad.fit}` : '', ad.notes ?? ''].filter(Boolean).join(' · ') });
  }
  for (const app of f.applications.filter((a) => a.status === 'drafting')) {
    out.push({ step: 6, name: 'Review', what: 'Read the CV and letter', id: app.id, title: `${app.role} · ${app.company}`, note: app.nextStep ?? 'Being tailored.' });
  }
  for (const app of f.applications.filter((a) => a.status === 'ready')) {
    out.push({ step: 7, name: 'Send', what: 'Send it yourself', id: app.id, title: `${app.role} · ${app.company}`, note: app.nextStep ?? 'Approved and ready.' });
  }
  for (const app of f.applications.filter((a) => a.status === 'offer')) {
    out.push({ step: 10, name: 'Close', what: 'Accept or decline', id: app.id, title: `${app.role} · ${app.company}`, note: app.nextStep ?? 'An offer is in.' });
  }
  for (const fu of followUps(f).filter((x) => x.kind === 'ghosted')) {
    out.push({ step: 10, name: 'Close', what: 'Close it as ghosted', id: fu.app.id, title: `${fu.app.role} · ${fu.app.company}`, note: `Sent ${fu.since} days ago, no reply.` });
  }
  return out;
}

/** What happened to one job or application, and to its ad or applications, newest first. */
export function eventsOf(f: HelmFile, id: string) {
  const app = f.applications.find((a) => a.id === id);
  const ad = f.ads.find((a) => a.id === (app ? app.job : id));
  const ids = new Set([id, ...(ad ? [ad.id] : []), ...f.applications.filter((a) => ad && a.job === ad.id).map((a) => a.id)]);
  return f.events.filter((e) => ids.has(e.id));
}

/** The kinds of line on the timeline, with a colour each. */
export function eventColour(kind: string): string {
  if (['sent', 'applied'].includes(kind)) return '#6fb7f2';
  if (['reply', 'interview', 'offer'].includes(kind)) return '#8fd14f';
  if (['found'].includes(kind)) return GOLD;
  if (['started', 'created', 'shortlisted'].includes(kind)) return '#ef7a6a';
  return '#7a8696';
}

/** 24 x 24 line icons for the room's things. */
export const HELM_ICONS: Record<HelmObject | 'ease' | 'ad' | 'app', string> = {
  ease: 'M3 12h4l3-7 4 14 3-7h4',
  ad: 'M6 3h9l3 3v15H6z M9 9h6 M9 13h6 M9 17h4',
  app: 'M4 6h16v12H4z M4 7l8 6 8-6',
  bridge: 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M12 3v18',
  ads: 'M4 4h16v16H4z M8 8h3v4H8z M13 8h3v8h-3z M8 14h3v2H8z',
  gates: 'M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z M9 12l2 2 4-4',
  follow: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',
  method: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z M9 8h6 M9 12h6 M9 16h3',
  log: 'M4 6h16 M4 12h16 M4 18h10',
  desk: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
};
