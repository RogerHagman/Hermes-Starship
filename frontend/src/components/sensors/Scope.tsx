// The long-range scope in the Sensor array's housing: four sectors (jobs, market, tech, home),
// range rings, a slow sweep, and a contact for every watch. A watch sits near the rim right
// after its scan and drifts in toward the centre as its next scan comes up. Paused watches
// sit dim on the rim. Picking a contact opens that watch on the work screen.
import { railColor } from '../../lib/lookups';
import { SECTORS, contactOf, polar, untilLabel } from '../../lib/sensors';
import type { ShipView } from '../../lib/ship';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;

export function Scope({ ship, now, picked, onPick }: {
  ship: ShipView; now: number; picked: string | null; onPick: (id: string) => void;
}) {
  const { watches, findings } = ship.data.sensors;
  const off = ship.station('sensors') ? !!ship.off(ship.station('sensors')!) : false;
  return (
    <div className={'scope' + (off ? ' dark' : '')}>
      <svg className="scope-svg" viewBox="0 0 200 200" aria-hidden="true">
        {[0.25, 0.5, 0.75, 1].map((r) => <circle key={r} className="scope-ring" cx="100" cy="100" r={92 * r} />)}
        {SECTORS.map((s) => {
          const a = polar(s.from, 1, 96);
          const mid = polar(s.from + 45, 1, 84);
          return (
            <g key={s.id}>
              <line className="scope-axis" x1="100" y1="100" x2={a.x} y2={a.y} />
              <text className="scope-sector" x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="middle">{s.label}</text>
            </g>
          );
        })}
        <text className="scope-range" x="102" y={100 - 92 * 0.25 + 4}>DUE</text>
        <text className="scope-range" x="102" y={100 - 92 + 4}>JUST SCANNED</text>
        {/* the sweep: a soft wedge that turns once every few seconds */}
        <g className="scope-sweep">
          <path d="M100 100 L192 100 A92 92 0 0 0 179.7 54 Z" fill="url(#scope-wedge)" />
          <line x1="100" y1="100" x2="192" y2="100" className="scope-beam" />
        </g>
        <defs>
          <linearGradient id="scope-wedge" x1="1" y1="1" x2="0.6" y2="0">
            <stop offset="0" stopColor="#7fd8e8" stopOpacity=".32" />
            <stop offset="1" stopColor="#7fd8e8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="scope-contacts" role="group" aria-label="Watches on the scope">
        {watches.map((w) => {
          const { angle, range } = contactOf(w, watches, now);
          const p = polar(angle, range);
          const st = ship.station(w.forStation);
          const unread = findings.filter((f) => f.watch === w.id && !f.seen).length;
          const due = w.state === 'paused' ? 'paused' : `next scan ${untilLabel(w.nextScan, now)}`;
          return (
            <button key={w.id} type="button" className={'contact ' + w.state + (unread ? ' new' : '') + (p.x < 100 ? ' left' : '')} aria-pressed={picked === w.id}
              style={css({ left: `${p.x / 2}%`, top: `${p.y / 2}%`, '--c': railColor(st?.rail ?? 'mixed') })}
              aria-label={`${w.name}, ${due}${unread ? `, ${unread} new` : ''}`} title={`${w.name} · ${due}`}
              onClick={() => onPick(w.id)}>
              <i />
              <span className="contact-name">{w.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
