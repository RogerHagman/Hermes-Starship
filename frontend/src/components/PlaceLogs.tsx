// Page 3 for the ship's two shared places, in place of a station's service log:
//   Crew Quarters  -> Duty log: who is in quarters now, then every check-in and check-out.
//   Briefing Room  -> Meetings: each briefing, how long it ran, who sat at the table, and
//                     what the room agreed (the Ship's Computer keeps the minutes).
// Both read the ship's log (fixtures/shiplog.json, kinds "duty" and "briefing").
import { clockTime, dayAndTime } from '../lib/format';
import { railColor } from '../lib/lookups';
import type { ShipView } from '../lib/ship';
import { cabinOf, crewed } from './CrewTokens';

const css = (vars: Record<string, string>) => vars as React.CSSProperties;
const cabinTag = (n: number) => `05-${String(n).padStart(2, '0')}`;
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** A crew member's name in their rail colour. */
function Who({ ship, id }: { ship: ShipView; id: string }) {
  const s = ship.station(id);
  return <span className="place-who" style={css({ '--c': railColor(s?.rail ?? 'mixed') })}><i />{s?.short ?? id}</span>;
}

/** Crew Quarters: who is in their cabin now (this screen's drills and reliefs count), then the history. */
export function DutyLog({ ship }: { ship: ShipView }) {
  const all = ship.data.stations.stations;
  const inNow = all.filter((s) => crewed(s) && s.id !== 'captain' && ship.off(s));
  const lines = ship.data.shiplog.entries.filter((e) => e.kind === 'duty');
  return (
    <div className="con-body svc">
      <span className="cchair-count mono">IN QUARTERS NOW · {inNow.length || 'NOBODY'}</span>
      {inNow.length > 0 && (
        <ul className="svc-log place-log">
          {inNow.map((s) => (
            <li key={s.id}>
              <span className="idtag">CABIN {cabinTag(cabinOf(s.id, all).n)}</span>
              <span><Who ship={ship} id={s.id} />{ship.off(s)}</span>
            </li>
          ))}
        </ul>
      )}
      <span className="cchair-count mono">CHECK-INS AND CHECK-OUTS · {lines.length || 'NONE YET'}</span>
      {lines.length > 0 && (
        <ol className="svc-log place-log">
          {lines.map((e) => (
            <li key={e.at + e.station}>
              <time className="idtag" dateTime={e.at}>{dayAndTime(e.at).toUpperCase()}</time>
              <span>
                {/* Checking IN to quarters is the crew member going off duty (dir "out" of their post). */}
                <span className={`place-dir ${e.dir}`}>{e.dir === 'out' ? `IN · ${cabinTag(cabinOf(e.station, all).n)}` : 'OUT'}</span>
                <Who ship={ship} id={e.station} />{cap(e.text.replace(/^(To quarters|Back at the post): /, ''))}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** Briefing Room: the meetings, newest first, with who attended and what was agreed. */
export function MeetingLog({ ship }: { ship: ShipView }) {
  const meetings = ship.data.shiplog.entries.filter((e) => e.kind === 'briefing');
  const minutes = (a: string, b?: string) => (b ? Math.round((Date.parse(b) - Date.parse(a)) / 60000) : 0);
  return (
    <div className="con-body svc">
      <span className="cchair-count mono">MEETINGS · {meetings.length || 'NONE YET'} · MINUTES BY THE SHIP'S COMPUTER</span>
      {meetings.length > 0 && (
        <ol className="meet-list">
          {meetings.map((m) => (
            <li key={m.at} className="meet">
              <div className="meet-head">
                <span className="svc-title">{cap(m.text.replace(/^Briefing: /, ''))}</span>
                <time className="idtag" dateTime={m.at}>
                  {dayAndTime(m.at).toUpperCase()}{m.ends ? `–${clockTime(m.ends)} · ${minutes(m.at, m.ends)} MIN` : ''}
                </time>
              </div>
              <div className="meet-who" aria-label="Attended">
                {(m.attendees ?? []).map((id) => <Who key={id} ship={ship} id={id} />)}
              </div>
              {m.outcome && <p className="meet-outcome">{m.outcome}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
