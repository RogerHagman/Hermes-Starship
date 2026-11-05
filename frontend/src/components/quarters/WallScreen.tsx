// The wall screen in the Captain's Quarters. It shows one view at a time, in place,
// like the console under the saucer on the Bridge: At ease (a summary), the chair (hails in
// full), the viewport (the windows ahead), the log terminal, the Yeoman's PADD, the plaque
// (standing orders), the shelf (the reading year), or a station picked from the duty roster.
// Nothing here sends anything: Approve, Deny and Write open with orders in H4.
import { useEffect, useMemo, useState } from 'react';
import { byTier, RAIL, railColor, tierText, tierVar } from '../../lib/lookups';
import { age, clockTime, dateLine, dayAndTime } from '../../lib/format';
import { ROOM_ICONS, greeting, localHM, nights, stardate } from '../../lib/quarters';
import { canRelieve, type ShipView } from '../../lib/ship';
import type { Order, Rail, YeomanItem } from '../../types';
import { CardBody } from '../Panels';
import { ConHead, StationDetail, stationColour, useEscape } from '../ShipConsole';

export type Screen =
  | { view: 'ease' }
  | { view: 'chair'; hail?: string }
  | { view: 'viewport' }
  | { view: 'log' }
  | { view: 'yeoman' }
  | { view: 'orders' }
  | { view: 'reading' }
  | { view: 'station'; id: string; order?: string };

/** What the Quarters board keeps while you move between views (screen only, gone on reload). */
export interface Desk {
  entries: { at: string; text: string }[];
  ticked: ReadonlySet<string>;
}

interface Props {
  ship: ShipView;
  screen: Screen;
  desk: Desk;
  onScreen: (s: Screen) => void;
  onLog: (text: string) => void;
  onTick: (item: YeomanItem) => void;
  onRelieve: (id: string) => void;
}

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;

/** The hails, highest tier first: the order the chair shows them in. */
export function hailsOf(ship: ShipView): Order[] {
  return ship.data.orders.orders.filter((o) => o.state === 'awaiting-captain').sort(byTier);
}

export function WallScreen({ ship, screen, desk, onScreen, onLog, onTick, onRelieve }: Props) {
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease', back);
  const colour = screen.view === 'station' ? stationColour(ship.station(screen.id)!) : 'var(--captain)';
  let body: React.ReactNode;
  switch (screen.view) {
    case 'chair': body = <ChairView ship={ship} hail={screen.hail} onScreen={onScreen} onBack={back} />; break;
    case 'viewport': body = <ViewportView ship={ship} onBack={back} />; break;
    case 'log': body = <LogView ship={ship} desk={desk} onLog={onLog} onBack={back} />; break;
    case 'yeoman': body = <YeomanView ship={ship} desk={desk} onTick={onTick} onBack={back} />; break;
    case 'orders': body = <StandingView ship={ship} onBack={back} />; break;
    case 'reading': body = <ReadingView ship={ship} onBack={back} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      body = st && (
        <StationDetail ship={ship} st={st} orderId={screen.order} back="‹ At ease" onBack={back}
          actions={canRelieve(st) && (
            <button type="button" className="con-back relieve" aria-pressed={ship.relieved.has(st.id)} onClick={() => onRelieve(st.id)}>
              {ship.relieved.has(st.id) ? 'Recall' : 'Relieve'}
            </button>
          )} />
      );
      break;
    }
    default: body = <AtEase ship={ship} desk={desk} onScreen={onScreen} />;
  }
  return (
    <section className="console wall" role="region" aria-label="Wall screen" style={css({ '--c': colour })}>
      {body}
    </section>
  );
}

// ---------- At ease: one tile per thing in the room ----------

function useNow(every: number): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), every);
    return () => clearInterval(t);
  }, [every]);
  return now;
}

function AtEase({ ship, desk, onScreen }: { ship: ShipView; desk: Desk; onScreen: (s: Screen) => void }) {
  const now = useNow(30000);
  const q = ship.data.quarters;
  const hails = hailsOf(ship);
  const burn = burnOf(ship);
  const resets = resetsOf(ship);
  const list = q.yeoman.filter((y) => !desk.ticked.has(y.id)).sort((a, b) => a.due.localeCompare(b.due));
  const last = desk.entries[0] ?? q.log[0];
  const r = q.reading;
  const conn = ship.data.ship.captain.conn === 'captain' ? 'YOU HAVE THE CONN' : 'NUMBER ONE HAS THE CONN';
  return (
    <>
      <ConHead icon={ROOM_ICONS.ease} title={greeting(now)}
        sub={`${dateLine(now)} · ${clockTime(now)} · STARDATE ${stardate(now)} · ${conn}`} />
      <div className="con-body">
        <div className="ease">
          <EaseTile icon="chair" label="THE CHAIR · HAILS" figure={String(hails.length)} onClick={() => onScreen({ view: 'chair' })}
            text={hails[0]?.title ?? 'Nothing waits for you.'} foot={hails[0] ? `${tierText(hails[0].tier)} FIRST · ${hails[0].id}` : 'ALL QUIET'} />
          <EaseTile icon="viewport" label="VIEWPORT · WINDOWS" figure={burn ? 'Burn' : resets[0] ? clockTime(resets[0].at) : '—'}
            onClick={() => onScreen({ view: 'viewport' })}
            text={burn ? `Dilithium Burn until ${dayAndTime(burn.until)}.` : 'No burn window open.'}
            foot={resets[0] ? `NEXT RESET ${clockTime(resets[0].at)} · ${resets[0].rail.label.toUpperCase()} ${resets[0].week ? 'WEEK' : '5 H'}` : 'NO RESETS AHEAD'} />
          <EaseTile icon="yeoman" label="PADD · THE YEOMAN" figure={String(list.length)} onClick={() => onScreen({ view: 'yeoman' })}
            text={list[0]?.text ?? 'Your list is clear.'} foot={list[0] ? `${KIND[list[0].kind].toUpperCase()} · ${dayAndTime(list[0].due).toUpperCase()}` : 'NOTHING DUE'} />
          <EaseTile icon="log" label="TERMINAL · CAPTAIN'S LOG" onClick={() => onScreen({ view: 'log' })}
            figure={String(desk.entries.length + q.log.length)} text={last?.text ?? 'No entries yet.'}
            foot={last ? `LAST ENTRY ${dayAndTime(last.at).toUpperCase()}` : 'LOCAL RAIL ONLY'} />
          <EaseTile icon="orders" label="PLAQUE · STANDING ORDERS" figure={String(q.standingOrders.length)} onClick={() => onScreen({ view: 'orders' })}
            text={q.standingOrders[0]} foot="ONLY YOU CHANGE THEM" />
          <EaseTile icon="reading" label="SHELF · READING YEAR" figure={`${r.read}/${r.goal}`} onClick={() => onScreen({ view: 'reading' })}
            text={r.current[0] ? `${r.current[0].title}, ${r.current[0].percent}% read.` : 'Nothing open.'}
            foot={`${Math.max(0, r.goal - r.read)} TO GO BY 31 DEC ${r.year}`} />
        </div>
      </div>
    </>
  );
}

function EaseTile({ icon, label, figure, text, foot, onClick }: {
  icon: keyof typeof ROOM_ICONS; label: string; figure: string; text: string; foot: string; onClick: () => void;
}) {
  return (
    <button type="button" className="ease-tile" onClick={onClick}>
      <span className="ease-label mono">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ROOM_ICONS[icon]} /></svg>{label}
      </span>
      <span className="ease-figure">{figure}</span>
      <span className="ease-text">{text}</span>
      <span className="ease-foot mono">{foot}</span>
    </button>
  );
}

// ---------- the chair: hails in full ----------

function ChairView({ ship, hail, onScreen, onBack }: { ship: ShipView; hail?: string; onScreen: (s: Screen) => void; onBack: () => void }) {
  const hails = hailsOf(ship);
  const i = Math.max(0, hails.findIndex((h) => h.id === hail));
  const o = hails[i];
  if (!o) {
    return (
      <>
        <ConHead icon={ROOM_ICONS.chair} title="The chair" sub="NOTHING WAITS FOR YOU" back="‹ At ease" onBack={onBack} />
        <div className="con-body"><p className="empty">Nothing waits for you. The chair is yours.</p></div>
      </>
    );
  }
  const st = ship.station(o.station);
  const mission = ship.data.quarters.missions.find((m) => m.id === o.mission);
  const step = (d: number) => onScreen({ view: 'chair', hail: hails[(i + d + hails.length) % hails.length].id });
  return (
    <>
      <ConHead icon={ROOM_ICONS.chair} title="Awaiting your orders" back="‹ At ease" onBack={onBack}
        sub={`HAIL ${i + 1} OF ${hails.length} · HIGHEST TIER FIRST`}>
        {hails.length > 1 && (
          <span className="stepper">
            <button type="button" className="con-back" aria-label="Previous hail" onClick={() => step(-1)}>‹</button>
            <button type="button" className="con-back" aria-label="Next hail" onClick={() => step(1)}>›</button>
          </span>
        )}
      </ConHead>
      <div className="con-body">
        <article className="hailcard" style={css({ '--c': tierVar(o.tier) })}>
          <div className="hailcard-meta">
            <span className="idtag">{o.id}</span>
            <span className="railpill" style={css({ '--c': railColor(st?.rail ?? 'mixed') })}>{(st?.short ?? o.station).toUpperCase()}</span>
            <span className="tierpill" style={css({ '--c': tierVar(o.tier) })}>{tierText(o.tier)}</span>
            {o.speed && <span className="idtag">{o.speed.toUpperCase()}</span>}
            {mission && <span className="idtag">{mission.id} · {mission.name.toUpperCase()}</span>}
            <span className="idtag">{age(ship.data.orders.asOf, o.updatedAt).toUpperCase()}</span>
          </div>
          <h3 className="hailcard-title">{o.title}</h3>
          {o.detail && <p className="con-text">{o.detail}</p>}
          {o.body && <CardBody text={o.body} />}
        </article>
      </div>
      <div className="wall-actions">
        <button type="button" className="btn btn-ghost" disabled>Deny</button>
        <button type="button" className="btn btn-ghost" disabled>Write</button>
        <button type="button" className="btn btn-gold" disabled>Approve</button>
        <span className="con-hint">Orders arrive in H4. Nothing here reaches the crew yet.</span>
      </div>
    </>
  );
}

// ---------- the viewport: the windows ahead ----------

const HOUR = 3600000;

function burnOf(ship: ShipView) {
  const r = ship.data.rails.rails.find((x) => x.burn?.active && x.burn.until && ship.rail(x.id) !== 'out');
  return r?.burn?.until ? { rail: r, until: r.burn.until } : null;
}

/** Every window reset after the reading, soonest first. */
function resetsOf(ship: ShipView) {
  const from = Date.parse(ship.data.rails.asOf);
  return ship.data.rails.rails
    .flatMap((rail) => rail.meters.filter((m) => m.resetsAt && Date.parse(m.resetsAt) > from)
      .map((m) => ({ rail, label: m.label, percent: m.percent, week: m.id === 'week', at: m.resetsAt! })))
    .sort((a, b) => a.at.localeCompare(b.at));
}

function ViewportView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const burn = burnOf(ship);
  const resets = resetsOf(ship);
  const from = Date.parse(ship.data.rails.asOf);
  return (
    <>
      <ConHead icon={ROOM_ICONS.viewport} title="Windows ahead" back="‹ At ease" onBack={onBack}
        sub={`THE NEXT 24 HOURS FROM ${dayAndTime(ship.data.rails.asOf).toUpperCase()} · SAMPLE READING`} />
      <div className="con-body">
        <p className="burnline">
          {burn
            ? <><span className="state burn">DILITHIUM BURN</span> Open until {dayAndTime(burn.until)}: held Burn cards run on {burn.rail.label}.</>
            : <><span className="state">NO BURN</span> No burn window is open.</>}
          {' '}Overnight, Codex and Claude may use their full windows.
        </p>
        <WindowsChart ship={ship} from={from} burn={burn} />
        <table className="resets">
          <caption className="mono">EVERY RESET AHEAD</caption>
          <thead><tr><th>WHEN</th><th>RAIL</th><th>WINDOW</th><th>USED NOW</th></tr></thead>
          <tbody>
            {resets.map((x) => (
              <tr key={x.rail.id + x.label} className={Date.parse(x.at) > from + 24 * HOUR ? 'later' : undefined}>
                <td className="mono">{dayAndTime(x.at)}</td>
                <td><span className="dot" style={css({ '--c': railColor(x.rail.id) })} />{x.rail.label}</td>
                <td>{x.label}</td>
                <td className="mono">{ship.rail(x.rail.id) === 'out' ? 'out' : `${x.percent}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/**
 * The next 24 hours as two lanes, Claude and Codex. Shaded bands are nights (full windows
 * allowed); the Claude lane shows the burn until its weekly reset. Diamonds mark 5-hour window
 * resets, bars mark weekly resets. Every value is also in the table under the chart.
 */
function WindowsChart({ ship, from, burn }: { ship: ShipView; from: number; burn: { rail: Rail; until: string } | null }) {
  const to = from + 24 * HOUR;
  const [hover, setHover] = useState<string | null>(null);
  const W = 760, X0 = 92, X1 = 744, LANES = ['claude', 'codex'] as const;
  const x = (t: number) => X0 + ((Math.min(Math.max(t, from), to) - from) / (to - from)) * (X1 - X0);
  const laneY = (i: number) => 44 + i * 40;
  const ticks = useMemo(() => {
    const out: { t: number; label: string; day: boolean }[] = [];
    for (let t = Math.ceil(from / (15 * 60000)) * 15 * 60000; t <= to; t += 15 * 60000) {
      const [h, m] = localHM(t);
      if (m === 0 && h % 3 === 0) out.push({ t, label: h === 0 ? dayAndTime(new Date(t).toISOString()).split(' ')[0].toUpperCase() : String(h).padStart(2, '0'), day: h === 0 });
    }
    return out;
  }, [from, to]);
  const dark = useMemo(() => nights(from, to), [from, to]);
  return (
    <figure className="wchart">
      <svg viewBox={`0 0 ${W} 132`} role="img" aria-label="Rail windows over the next 24 hours: nights, the burn and every reset. The table below lists the same.">
        {dark.map(([a, b]) => <rect key={a} className="w-night" x={x(a)} y={22} width={x(b) - x(a)} height={88} rx={4} />)}
        {dark[0] && <text className="w-note" x={(x(dark[0][0]) + x(dark[0][1])) / 2} y={16} textAnchor="middle">NIGHT · FULL WINDOWS</text>}
        {ticks.map((k) => (
          <g key={k.t}>
            <line className="w-grid" x1={x(k.t)} x2={x(k.t)} y1={22} y2={110} />
            <text className={'w-tick' + (k.day ? ' day' : '')} x={x(k.t)} y={126} textAnchor="middle">{k.label}</text>
          </g>
        ))}
        {LANES.map((id, i) => {
          const rail = ship.data.rails.rails.find((r) => r.id === id);
          const y = laneY(i);
          const out = ship.rail(id) === 'out';
          return (
            <g key={id} style={css({ '--c': railColor(id) })} className={out ? 'w-out' : undefined}>
              <circle cx={14} cy={y} r={4} className="w-key" />
              <text className="w-lane" x={24} y={y + 4}>{RAIL[id].legend}</text>
              <line className="w-track" x1={X0} x2={X1} y1={y} y2={y} />
              {burn && burn.rail.id === id && (
                <g>
                  <rect className="w-burn" x={X0} y={y - 7} width={x(Date.parse(burn.until)) - X0} height={14} rx={4} />
                  <text className="w-burn-label" x={X0 + 8} y={y + 3.5}>BURN</text>
                </g>
              )}
              {rail?.meters.filter((m) => m.resetsAt).map((m) => {
                const t = Date.parse(m.resetsAt!);
                const key = id + m.id;
                const inside = t > from && t <= to;
                const tip = `${rail.label} ${m.label} resets ${dayAndTime(m.resetsAt!)} · ${m.percent}% used now`;
                if (!inside) {
                  return t > to ? (
                    <g key={key} className="w-mark" tabIndex={0} onPointerEnter={() => setHover(key)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(key)} onBlur={() => setHover(null)}>
                      <title>{tip}</title>
                      <rect x={X1 - 6} y={y - 12} width={24} height={24} fill="transparent" />
                      <path className="w-later" d={`M${X1 + 2} ${y - 6} l7 6 -7 6`} />
                    </g>
                  ) : null;
                }
                const cx = x(t);
                return (
                  <g key={key} className="w-mark" tabIndex={0} onPointerEnter={() => setHover(key)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(key)} onBlur={() => setHover(null)}>
                    <title>{tip}</title>
                    <rect x={cx - 12} y={y - 14} width={24} height={28} fill="transparent" />
                    {m.id === 'week'
                      ? <rect className="w-week" x={cx - 2.5} y={y - 11} width={5} height={22} rx={2} />
                      : <path className="w-five" d={`M${cx} ${y - 7} l7 7 -7 7 -7 -7z`} />}
                    <text className={'w-time' + (hover === key ? ' on' : '')} x={cx} y={y - 15} textAnchor="middle">{clockTime(m.resetsAt!)}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
        <line className="w-now" x1={X0} x2={X0} y1={20} y2={112} />
        <text className="w-now-label" x={X0 - 6} y={126} textAnchor="end">NOW</text>
      </svg>
      <figcaption className="wlegend mono">
        <span><i className="k-five" />5 H WINDOW RESETS</span>
        <span><i className="k-week" />WEEK RESETS</span>
        <span><i className="k-night" />NIGHT</span>
        {burn && <span><i className="k-burn" />BURN</span>}
        <span><i className="k-later" />LATER THAN 24 H</span>
      </figcaption>
    </figure>
  );
}

// ---------- the log terminal ----------

function LogView({ ship, desk, onLog, onBack }: { ship: ShipView; desk: Desk; onLog: (text: string) => void; onBack: () => void }) {
  const [draft, setDraft] = useState('');
  const entries = [...desk.entries.map((e) => ({ ...e, here: true })), ...ship.data.quarters.log.map((e) => ({ ...e, here: false }))];
  const save = () => { if (draft.trim()) { onLog(draft.trim()); setDraft(''); } };
  return (
    <>
      <ConHead icon={ROOM_ICONS.log} title="Captain's log" back="‹ At ease" onBack={onBack}
        sub={`STARDATE ${stardate(new Date())} · STAYS ON THE LOCAL RAIL · ONLY THE SHIP'S COMPUTER READS IT`} />
      <div className="con-body">
        <div className="logentry">
          <textarea className="logtext" rows={2} maxLength={400} value={draft} aria-label="New log entry"
            placeholder="Captain's log, supplemental…" onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save(); }} />
          <button type="button" className="btn btn-gold" aria-disabled={!draft.trim()} onClick={save}>Log it</button>
        </div>
        <p className="con-hint">Entries you add stay on this screen until you reload. The log opens for real in H4.</p>
        <ol className="captlog">
          {entries.map((e) => (
            <li key={e.at + e.text}>
              <time className="mono" dateTime={e.at}>{dayAndTime(e.at).toUpperCase()}</time>
              <span>{e.text}{e.here && <span className="here mono"> · THIS SCREEN ONLY</span>}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

// ---------- the Yeoman's PADD ----------

const KIND: Record<YeomanItem['kind'], string> = { todo: 'To do', reminder: 'Reminder', waiting: 'Waiting for' };

function YeomanView({ ship, desk, onTick, onBack }: { ship: ShipView; desk: Desk; onTick: (y: YeomanItem) => void; onBack: () => void }) {
  const items = [...ship.data.quarters.yeoman].sort((a, b) => a.due.localeCompare(b.due));
  const left = items.filter((y) => !desk.ticked.has(y.id)).length;
  return (
    <>
      <ConHead icon={ROOM_ICONS.yeoman} title="From the Yeoman" back="‹ At ease" onBack={onBack}
        sub={`${left} OF ${items.length} OPEN · SAMPLE LIST · THE YEOMAN KEEPS IT ON THE LOCAL RAIL`} />
      <div className="con-body">
        <ul className="yeo">
          {items.map((y) => {
            const done = desk.ticked.has(y.id);
            return (
              <li key={y.id}>
                <label className={'yeo-item' + (done ? ' done' : '')}>
                  <input type="checkbox" checked={done} onChange={() => onTick(y)} />
                  <span className="yeo-text">{y.text}</span>
                  <span className={'yeo-kind ' + y.kind}>{KIND[y.kind]}</span>
                  <span className="yeo-due mono">{dayAndTime(y.due)}</span>
                </label>
              </li>
            );
          })}
        </ul>
        <p className="con-hint">Ticking stays on this screen. The Yeoman hears it once orders open in H4.</p>
      </div>
    </>
  );
}

// ---------- the plaque ----------

function StandingView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const list = ship.data.quarters.standingOrders;
  return (
    <>
      <ConHead icon={ROOM_ICONS.orders} title="Standing orders" back="‹ At ease" onBack={onBack}
        sub={`${list.length} ORDERS · EVERY STATION KEEPS THEM · ONLY YOU CHANGE THEM`} />
      <div className="con-body">
        <ol className="standing">
          {list.map((s, i) => <li key={s}><span className="standing-n">{i + 1}</span><span>{s}</span></li>)}
        </ol>
      </div>
    </>
  );
}

// ---------- the shelf ----------

function ReadingView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const r = ship.data.quarters.reading;
  const pctRead = Math.round((100 * r.read) / r.goal);
  return (
    <>
      <ConHead icon={ROOM_ICONS.reading} title={`Reading year ${r.year}`} back="‹ At ease" onBack={onBack}
        sub="SAMPLE SHELF · THE ARCHIVIST KEEPS IT" />
      <div className="con-body">
        <div className="readhero">
          <span className="readfig">{r.read}<small> of {r.goal}</small></span>
          <span className="readmeta">
            <span>books read this year, {Math.max(0, r.goal - r.read)} to go by 31 December</span>
            <Meter value={pctRead} label={`Reading goal, ${pctRead}%`} />
          </span>
        </div>
        <h4 className="readhead mono">ON THE NIGHTSTAND</h4>
        <ul className="books">
          {r.current.map((b) => (
            <li key={b.title}>
              <span className="book-title">{b.title}</span><span className="book-by">{b.author}</span>
              <Meter value={b.percent} label={`${b.title}, ${b.percent}% read`} />
              <span className="book-pct mono">{b.percent}%</span>
            </li>
          ))}
        </ul>
        <h4 className="readhead mono">NEXT ON THE SHELF</h4>
        <ul className="books next">
          {r.next.map((b) => <li key={b.title}><span className="book-title">{b.title}</span><span className="book-by">{b.author}</span></li>)}
        </ul>
      </div>
    </>
  );
}

/** A thin meter: gold fill on a dim gold track. */
function Meter({ value, label }: { value: number; label: string }) {
  return (
    <span className="qmeter" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <b style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </span>
  );
}
