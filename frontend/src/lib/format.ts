// Time formatting. All times show in the ship's time zone.
const TZ = 'Europe/Stockholm';

export function clockTime(iso: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(iso));
}

export function dayAndTime(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(iso));
}

/** The day an entry falls on, like "TUE 3 NOV". */
export function dayLine(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: TZ }).format(new Date(iso)).toUpperCase();
}

export function dateLine(now: Date): string {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short', timeZone: TZ }).format(now).toUpperCase();
}

/** Age measured from the fixture's asOf time, so the page reads the same whenever it is opened. */
export function age(asOf: string, iso: string): string {
  const mins = Math.round((new Date(asOf).getTime() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)} h ${mins % 60} min ago`;
}

/** The ship's day an instant falls on, as YYYY-MM-DD. */
const DAY_KEY = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ });
export function dayKey(iso: string | Date): string {
  return DAY_KEY.format(new Date(iso));
}

/** An instant as the value of a datetime-local input, in the ship's time zone: 2026-11-08T17:00. */
const INPUT_PARTS = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: TZ,
});
export function toInputTime(iso: string | number): string {
  const p = Object.fromEntries(INPUT_PARTS.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** A datetime-local value read in the ship's time zone, as a UTC stamp (2026-11-08T16:00:00Z), or null. */
export function fromInputTime(value: string): string | null {
  const m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/.exec(value);
  if (!m) return null;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  // The zone's offset at that moment: read the guess back in the zone and take the difference, twice for DST edges.
  let t = wall;
  for (let i = 0; i < 2; i++) {
    const back = Date.parse(`${toInputTime(t)}:00Z`);
    t += wall - back;
  }
  return new Date(t).toISOString().replace(/\.\d{3}Z$/, 'Z');
}
