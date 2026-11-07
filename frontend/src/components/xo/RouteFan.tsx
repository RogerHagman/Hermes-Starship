// The routing fan: Number One's wall screen, grown from the display on the First Officer's station
// art. Your three channels flow up into Number One at the hub; a line goes out to every station that
// took an ask, as thick as its week, with a dot running along it while an order there is open. The
// Captain sits to the left (hails) and Not done to the right (blocked). Pick a station and its routed
// asks list beside the fan; pick a channel and the fan shows only what came in there.
import type { KeyboardEvent } from 'react';
import { dayAndTime } from '../../lib/format';
import { railColor } from '../../lib/lookups';
import { STATE_WORD, records } from '../../lib/computer';
import { openedOf } from '../../lib/post';
import type { ShipView } from '../../lib/ship';
import { SURFACES, SURFACE_COLOUR, arc, asks, fan, routed, surfaceWord, type Route, type Surface } from '../../lib/xo';
import { css, up } from '../post/Parts';

interface Props {
  ship: ShipView;
  asOf: string;
  route: Route;
  onRoute: (r: Route) => void;
  onOpen: (id: string) => void;
  onHails: () => void;
  onBlocked: () => void;
}

const W = 640, H = 380;
const HUB = { x: 320, y: 266 };
const RX = 206, RY = 186;
const INLET_X: Record<Surface, number> = { telegram: 190, desktop: 320, dashboard: 450 };
const LIST_MAX = 120;

/** Enter or Space on an SVG button. */
const press = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
};

export function RouteFan({ ship, asOf, route, onRoute, onOpen, onHails, onBlocked }: Props) {
  const all = asks(ship.data);
  const inSurface = routed(all, { surface: route.surface, station: null });
  const roster = ship.data.stations.stations.map((s) => s.id);
  const nodes = fan(inSurface, asOf, roster);
  const spots = arc(nodes.length, HUB.x, HUB.y, RX, RY);
  const mostAll = Math.max(1, ...nodes.map((n) => n.all));
  const mostWeek = Math.max(1, ...nodes.map((n) => n.week));
  const recs = records(ship.data);
  const hails = recs.filter((o) => o.state === 'awaiting-captain').length;
  const blocked = recs.filter((o) => o.state === 'blocked').length;
  // with a station picked, the inlets show where its asks came in; the pipes keep their full scale
  const fed = route.station ? routed(all, { surface: null, station: route.station }) : all;
  const bySurface = SURFACES.map((s) => ({ id: s, n: fed.filter((o) => o.surface === s).length }));
  const mostIn = Math.max(1, ...SURFACES.map((s) => all.filter((o) => o.surface === s).length));
  const pick = (id: string) => onRoute({ ...route, station: route.station === id ? null : id });
  const pickSurface = (s: Surface) => onRoute({ ...route, surface: route.surface === s ? null : s });
  const list = routed(all, route);
  const st = route.station ? ship.station(route.station) : undefined;

  return (
    <div className="xfan">
      <svg className="xf-svg" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="The routing fan">
        <defs>
          <radialGradient id="xf-hubglow"><stop offset="0" stopColor="#3fc1a5" stopOpacity=".55" /><stop offset="1" stopColor="#3fc1a5" stopOpacity="0" /></radialGradient>
        </defs>
        {/* the guide arc the stations sit on */}
        <path className="xf-guide" d={`M${HUB.x - RX} ${HUB.y} A ${RX} ${RY} 0 0 1 ${HUB.x + RX} ${HUB.y}`} />
        {/* your channels, flowing up into Number One */}
        {bySurface.map((s) => {
          const x = INLET_X[s.id];
          const d = `M${x} ${H} C${x} ${H - 52} ${HUB.x} ${HUB.y + 64} ${HUB.x} ${HUB.y}`;
          const dim = (route.surface && route.surface !== s.id) || (route.station && s.n === 0);
          return (
            <g key={s.id} className={'xf-inlet' + (dim ? ' dim' : '')} role="button" tabIndex={0} aria-pressed={route.surface === s.id}
              aria-label={`${surfaceWord(s.id)}: ${s.n} asks${st ? ` to ${st.short}` : ''}. Show only these`} onClick={() => pickSurface(s.id)} onKeyDown={press(() => pickSurface(s.id))}
              style={css({ '--pc': SURFACE_COLOUR[s.id] })}>
              <path className="xf-pipe" d={d} style={{ strokeWidth: 2 + 6 * (s.n / mostIn) }} />
              {s.n > 0 && <path className="xf-flow" d={d} />}
              <path className="xf-hit" d={d} />
              <text className="xf-in" x={x + 10} y={H - 8}>{up(surfaceWord(s.id))} <tspan className="xf-n">{s.n}</tspan></text>
            </g>
          );
        })}
        {/* the Captain to the left: hails */}
        <Side x={HUB.x - RX - 8} y={HUB.y} name="CAPTAIN" n={hails} what="WAITING FOR YOU" colour="var(--captain)" anchor="start" onPick={onHails} />
        {/* not done to the right: blocked */}
        <Side x={HUB.x + RX + 8} y={HUB.y} name="NOT DONE" n={blocked} what="BLOCKED" colour="var(--bad)" anchor="end" onPick={onBlocked} />
        {/* a line out to every station that took an ask */}
        {nodes.map((n, i) => {
          const p = spots[i];
          const s = ship.station(n.id);
          const col = railColor(s?.rail ?? 'mixed');
          const r = 6 + 8 * Math.sqrt(n.all / mostAll);
          const dim = route.station && route.station !== n.id;
          const lx = p.x + (r + 6) * p.dx, ly = p.y + (r + 6) * p.dy;
          const anchor = p.dx < -0.35 ? 'end' : p.dx > 0.35 ? 'start' : 'middle';
          const d = `M${HUB.x} ${HUB.y} L${p.x} ${p.y}`;
          return (
            <g key={n.id} className={'xf-node' + (dim ? ' dim' : '') + (route.station === n.id ? ' on' : '')} role="button" tabIndex={0}
              aria-pressed={route.station === n.id} aria-label={`${s?.short ?? n.id}: ${n.all} asks, ${n.week} this week, ${n.open} open. Show them`}
              onClick={() => pick(n.id)} onKeyDown={press(() => pick(n.id))} style={css({ '--pc': col })}>
              <path className="xf-line" d={d} />
              {n.week > 0 && <path className="xf-week" d={d} style={{ strokeWidth: 1.5 + 4.5 * (n.week / mostWeek) }} />}
              {n.open > 0 && <path className="xf-run" d={d} style={{ animationDuration: `${2.2 + (i % 4) * 0.35}s` }} />}
              <circle className="xf-hitdot" cx={p.x} cy={p.y} r={r + 10} />
              <circle className="xf-dot" cx={p.x} cy={p.y} r={r} />
              {n.hails > 0 && <circle className="xf-hail" cx={p.x} cy={p.y} r={r + 4} />}
              {n.blocked > 0 && <circle className="xf-block" cx={p.x + r * 0.75} cy={p.y - r * 0.75} r={3.5} />}
              <text className="xf-name" x={lx} y={ly + (p.dy < -0.6 ? -10 : 0)} textAnchor={anchor}>{s?.short ?? n.id}</text>
              <text className="xf-count" x={lx} y={ly + (p.dy < -0.6 ? 1 : 11)} textAnchor={anchor}>{n.all}{n.open ? ` · ${n.open} OPEN` : ''}</text>
            </g>
          );
        })}
        {/* Number One at the hub */}
        <circle cx={HUB.x} cy={HUB.y} r={34} fill="url(#xf-hubglow)" />
        <circle className="xf-ping" cx={HUB.x} cy={HUB.y} r={15} style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }} />
        <circle className="xf-hub" cx={HUB.x} cy={HUB.y} r={15} />
        <text className="xf-hubn" x={HUB.x} y={HUB.y + 4.5} textAnchor="middle">{inSurface.length}</text>
        <text className="xf-hubl" x={HUB.x + 22} y={HUB.y + 26}>NUMBER ONE</text>
      </svg>
      <section className="xf-list" aria-label={st ? `Routed to ${st.short}` : 'Every ask'}>
        <div className="xf-head">
          <span className="xf-title">{st ? `Routed to ${st.short}` : route.surface ? `From ${surfaceWord(route.surface)}` : 'Every ask'}</span>
          <span className="xf-total mono">{list.length}</span>
          {(route.station || route.surface) && (
            <button type="button" className="pchip" onClick={() => onRoute({ surface: null, station: null })}>× ALL</button>
          )}
        </div>
        <p className="xf-sub mono">
          {st ? `${up(st.name)}${route.surface ? ` · FROM ${up(surfaceWord(route.surface))}` : ''} · NEWEST FIRST` : 'PICK A STATION ON THE FAN · NEWEST FIRST'}
        </p>
        <ol className="xf-rows">
          {list.length === 0 && <li className="empty">Nothing routed here.</li>}
          {list.slice(0, LIST_MAX).map((o) => {
            const to = ship.station(o.station);
            return (
              <li key={o.id}>
                <button type="button" className={`plist-row ts-${o.state}`} style={css({ '--pc': railColor(to?.rail ?? 'mixed') })} onClick={() => onOpen(o.id)}>
                  <span className="pl-main">{o.title}</span>
                  <span className="pl-meta mono">
                    {st ? `${o.id} · ${STATE_WORD[o.state]} · FROM ${up(o.surface ?? '?')}` : `${o.id} → ${up(to?.short ?? o.station)} · ${STATE_WORD[o.state]} · ${up(o.surface ?? '?')}`} · {up(dayAndTime(openedOf(o)))}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

/** The Captain or Not done, at the end of the fan's arc. */
function Side({ x, y, name, n, what, colour, anchor, onPick }: {
  x: number; y: number; name: string; n: number; what: string; colour: string; anchor: 'start' | 'end'; onPick: () => void;
}) {
  const tx = anchor === 'start' ? x - 4 : x + 4;
  return (
    <g className={'xf-side' + (n ? ' lit' : '')} role="button" tabIndex={0} aria-label={`${name.toLowerCase()}: ${n} ${what.toLowerCase()}`}
      onClick={onPick} onKeyDown={press(onPick)} style={css({ '--pc': colour })}>
      <path className="xf-line" d={`M${HUB.x} ${HUB.y} L${x} ${y}`} />
      {n > 0 && <path className="xf-run" d={`M${HUB.x} ${HUB.y} L${x} ${y}`} />}
      <circle className="xf-hitdot" cx={x} cy={y} r={20} />
      <rect className="xf-sidebox" x={x - 9} y={y - 9} width={18} height={18} rx={4} />
      <text className="xf-name" x={tx} y={y + 26} textAnchor={anchor}>{name}</text>
      <text className="xf-count" x={tx} y={y + 37} textAnchor={anchor}>{n} {what}</text>
    </g>
  );
}
