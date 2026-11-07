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
