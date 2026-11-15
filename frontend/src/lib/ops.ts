// Ops (Deck 1): where things are in the picture (assets/ops.svg, a 1600 x 740 box, drawn by
// tools/make_ops_svg.py), and how Ops grades what it reads: every host, link, container, disk,
// job and backup is ok, warn or bad, by the rules below. Data comes from fixtures/ops.json; the
// GPU's VRAM and the rails come from the rails file, which is live on the NAS.
import type { Backup, Container, Disk, Health, Host, Job, OpsFile, RailId } from '../types';
import type { ShipView } from './ship';
import { RAIL_IDS } from './ship';
import { shipTimeZone } from './format';

export const ROOM = { w: 1600, h: 740 };

/** The things in the room you can pick. Each one opens a view on the Ops wall screen. */
export type OpsObject = 'bridge' | 'net' | 'ops' | 'nas' | 'clock' | 'storage' | 'vault' | 'desk' | 'gpu';

export const SPOTS: { id: OpsObject; box: [number, number, number, number]; label: [number, number] }[] = [
  { id: 'bridge',  box: [14, 140, 126, 424],  label: [77, 590] },
  { id: 'net',     box: [156, 70, 156, 152],  label: [234, 64] },
  { id: 'ops',     box: [160, 250, 148, 316], label: [234, 244] },
  { id: 'nas',     box: [326, 104, 152, 462], label: [402, 98] },
  { id: 'clock',   box: [491, 90, 200, 200],  label: [591, 80] },
  { id: 'storage', box: [492, 376, 198, 190], label: [591, 370] },
  { id: 'vault',   box: [704, 292, 148, 274], label: [778, 286] },
  { id: 'desk',    box: [952, 584, 428, 142], label: [1166, 574] },
  { id: 'gpu',     box: [1458, 146, 132, 578], label: [1524, 128] },
];

/** The status board's table top, where the page lays a chip per check. */
export const TABLE = { x: 170, y: 596, w: 660, h: 96 };
/** The usage desk's top, where the page lays the live rail gauges. */
export const DESK = { x: 968, y: 600, w: 396, h: 84 };
/** The Ops wall screen, where the page lays its console. */
export const SCREEN = { x: 880, y: 46, w: 560, h: 458 };

export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/** The Operations department, head first. */
export const OPS_CREW = ['ops', 'qm', 'life', 'comms'];

// ---------- grading ----------

const WEIGHT: Record<Health, number> = { ok: 0, unknown: 1, warn: 2, bad: 3 };
/** The worst of some states (ok when there are none). */
export const worst = (states: Health[]): Health => states.reduce<Health>((w, s) => (WEIGHT[s] > WEIGHT[w] ? s : w), 'ok');
export const HEALTH_WORD: Record<Health, string> = { ok: 'OK', warn: 'WATCH', bad: 'ACT', unknown: 'NO READING' };

const share = (used: number, total: number) => (total > 0 ? used / total : 0);
export const percent = (used: number, total: number) => Math.round(share(used, total) * 100);

/** A host: what it reported, then memory (90% is a warning) and swap (half full is a warning, nearly full is bad). */
export function hostState(h: Host): Health {
  const s: Health[] = [h.state];
  if (h.ram && share(h.ram.usedGb, h.ram.totalGb) >= 0.9) s.push('warn');
  if (h.swap) {
    const sw = share(h.swap.usedGb, h.swap.totalGb);
    if (sw >= 0.9) s.push('bad'); else if (sw >= 0.5) s.push('warn');
  }
  return worst(s);
}

/** A container: stopped or restarting is bad; paused, near its memory cap or restarting often is a warning. */
export function containerState(c: Container): Health {
  if (c.state === 'exited' || c.state === 'restarting') return 'bad';
  if (c.state === 'paused') return 'warn';
  if (c.limitMb && share(c.memMb, c.limitMb) >= 0.9) return 'warn';
  return c.restarts >= 3 ? 'warn' : 'ok';
}

/** A disk: 80% full is a warning, 90% is bad. */
export function diskState(d: Disk): Health {
  const s = share(d.usedGb, d.totalGb);
  return s >= 0.9 ? 'bad' : s >= 0.8 ? 'warn' : 'ok';
}

/** Days until a disk is full at its current rate, or null when nobody knows the rate. */
export function daysLeft(d: Disk): number | null {
  return d.perDayGb ? Math.floor((d.totalGb - d.usedGb) / d.perDayGb) : null;
}

/** A job: failed is bad; skipped or never run is a warning. */
export function jobState(j: Job): Health {
  return j.last === 'failed' ? 'bad' : j.last === 'skipped' || j.last === 'never' ? 'warn' : 'ok';
}

const hoursSince = (asOf: string, iso: string) => (Date.parse(asOf) - Date.parse(iso)) / 3_600_000;

/** A backup: a failed read-back is bad; overdue is a warning (twice overdue is bad); never read back is a warning. */
export function backupState(b: Backup, asOf: string): Health {
  if (b.verified === 'failed') return 'bad';
  const late = hoursSince(asOf, b.lastAt) / b.warnAfterH;
  if (late >= 2) return 'bad';
  return late >= 1 || b.verified === 'never' ? 'warn' : 'ok';
}

/** A port open to the internet with no sign-in is bad; open to the internet at all is a warning. */
export function portState(p: OpsFile['network']['ports'][number]): Health {
  if (p.reach !== 'internet') return 'ok';
  return /^none$/i.test(p.signIn) ? 'bad' : 'warn';
}

export const railHealth = (state: string): Health => (state === 'out' ? 'bad' : state === 'degraded' ? 'warn' : 'ok');

/** The GPU's VRAM in use, from the local rail's live VRAM meter. */
export function vramPercent(ship: ShipView): number | null {
  const m = ship.data.rails.rails.find((r) => r.id === 'local')?.meters.find((x) => x.id === 'vram');
  return m ? m.percent : null;
}

export function gpuState(ship: ShipView): Health {
  const rail = railHealth(ship.rail('local'));
  const v = vramPercent(ship);
  return worst([rail, v !== null && v >= 95 ? 'warn' : 'ok']);
}

// ---------- the status board: every check, by area ----------

export type OpsView = 'nas' | 'net' | 'storage' | 'gpu' | 'schedule' | 'backups' | 'usage';
export interface Check { id: string; label: string; state: Health; text: string }
export interface Area { id: OpsView; label: string; checks: Check[] }

const up = (s: string) => s.toUpperCase();

/** Every check Ops makes, grouped by area, in the room's order. */
export function areas(ship: ShipView): Area[] {
  const o = ship.data.ops;
  const n = o.network;
  const hostName = (id: string) => o.hosts.find((h) => h.id === id)?.name ?? id;
  return [
    { id: 'nas', label: 'HOSTS', checks: [
      ...o.hosts.map((h) => ({ id: h.id, label: h.name, state: hostState(h),
        text: `${h.ram ? `RAM ${percent(h.ram.usedGb, h.ram.totalGb)}%` : ''}${h.swap ? ` · swap ${percent(h.swap.usedGb, h.swap.totalGb)}%` : ''}` })),
      ...o.containers.map((c) => ({ id: c.name, label: c.name, state: containerState(c), text: `${c.state} on ${hostName(c.host)}` })),
    ] },
    { id: 'net', label: 'NETWORK', checks: [
      { id: 'internet', label: 'Internet', state: n.internet.state, text: n.internet.downMbps ? `${n.internet.downMbps} down · ${n.internet.upMbps ?? '?'} up` : 'Up' },
      ...n.devices.map((d) => ({ id: d.id, label: d.name, state: d.state, text: d.link })),
      ...n.links.map((l) => ({ id: l.id, label: l.name, state: l.state, text: l.for })),
      ...n.ports.map((p) => ({ id: `port-${p.port}`, label: `${p.service} :${p.port}`, state: portState(p), text: `${p.reach === 'lan' ? 'LAN only' : p.reach} · ${p.signIn}` })),
    ] },
    { id: 'storage', label: 'STORAGE', checks: o.disks.map((d) => ({ id: d.id, label: d.label, state: diskState(d), text: `${percent(d.usedGb, d.totalGb)}% full` })) },
    { id: 'gpu', label: 'GPU', checks: [{ id: 'gpu', label: o.gpu.name, state: gpuState(ship), text: `VRAM ${vramPercent(ship) ?? '?'}%` }] },
    { id: 'schedule', label: 'SCHEDULE', checks: o.jobs.map((j) => ({ id: j.id, label: j.name, state: jobState(j), text: `${j.every} · last ${j.last}` })) },
    { id: 'backups', label: 'BACKUPS', checks: o.backups.map((b) => ({ id: b.id, label: b.what, state: backupState(b, o.asOf), text: `to ${b.to} · ${ago(o.asOf, b.lastAt)}` })) },
    { id: 'usage', label: 'RAILS', checks: RAIL_IDS.map((r: RailId) => {
      const rail = ship.data.rails.rails.find((x) => x.id === r);
      return { id: r, label: rail?.label ?? r, state: railHealth(ship.rail(r)), text: up(ship.rail(r)) };
    }) },
  ];
}

/** Checks that need a look, the worst first. */
export function attention(list: Area[]): (Check & { area: Area })[] {
  return list.flatMap((a) => a.checks.map((c) => ({ ...c, area: a })))
    .filter((c) => c.state !== 'ok')
    .sort((a, b) => WEIGHT[b.state] - WEIGHT[a.state]);
}

/** "12 min ago", "5 h ago", "11 days ago". */
export function ago(asOf: string, iso: string): string {
  const h = hoursSince(asOf, iso);
  if (h < 0) return `in ${until(asOf, iso)}`;
  if (h < 1) return `${Math.max(0, Math.round(h * 60))} min ago`;
  if (h < 48) return `${Math.round(h)} h ago`;
  return `${Math.round(h / 24)} days ago`;
}

/** "in 1 min", "in 7 h", "in 6 days" (without the "in"). */
export function until(asOf: string, iso: string): string {
  const h = -hoursSince(asOf, iso);
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min`;
  if (h < 48) return `${Math.round(h)} h`;
  return `${Math.round(h / 24)} days`;
}

/** The chronometer hand's angle for a time: a full turn a day, midnight at the top (ship's time). */
export function handAngle(at: Date): number {
  const [h, m] = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: shipTimeZone() })
    .format(at).split(':').map(Number);
  return ((h + m / 60) / 24) * 360;
}

/** 24 x 24 line icons for the room's things and the views (same style as the station icons). */
export const OPS_ICONS: Record<OpsObject | OpsView | 'ease' | 'cautions', string> = {
  ease: 'M3 12h4l3-7 4 14 3-7h4',
  ops: 'M3 12h4l3-7 4 14 3-7h4',
  bridge: 'M12 3l7 18-7-4-7 4z',
  net: 'M12 3v6 M5 15v-3h14v3 M3 15h4v6H3z M10 15h4v6h-4z M17 15h4v6h-4z',
  nas: 'M5 3h14v18H5z M5 9h14 M5 15h14 M8 6h2 M8 12h2 M8 18h2',
  clock: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M12 7v5l3 3',
  schedule: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M12 7v5l3 3',
  storage: 'M4 5h16v4H4z M4 10h16v4H4z M4 15h16v4H4z M7 7h1 M7 12h1 M7 17h1',
  vault: 'M4 4h16v16H4z M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M12 12h0',
  backups: 'M4 4h16v16H4z M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M12 12h0',
  desk: 'M3 17a9 9 0 0 1 18 0 M12 17l4-6 M3 20h18',
  usage: 'M3 17a9 9 0 0 1 18 0 M12 17l4-6 M3 20h18',
  gpu: 'M3 7h18v10H3z M8 12a2 2 0 1 0 0 0.1 M16 12a2 2 0 1 0 0 0.1 M6 17v3 M18 17v3',
  cautions: 'M12 3l10 18H2z M12 10v5 M12 18v0.5',
};
