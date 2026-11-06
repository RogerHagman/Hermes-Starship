// The core terminal. One view at a time, in place: the records (every order the ship has taken,
// any state, with a command line to find one), a single order's full record, the briefing minutes,
// the burn window, the sealed memory banks, and any crew member's card. Reading only: nothing
// typed here reaches Hermes, and the command line only searches what is already on the page.
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { dayAndTime, dayLine } from '../../lib/format';
import { railColor, speedText } from '../../lib/lookups';
import {
  ALL, CORE_ICONS, LIST_MAX, STATES, STATE_WORD, SURFACE_WORD, counts, echo, find, logOf, minutes, parseCommand, records, recordsFile,
  span, stats, took, type Query, type State,
} from '../../lib/computer';
import type { ShipView } from '../../lib/ship';
import { RAIL_IDS } from '../../lib/ship';
import type { Order } from '../../types';
import { CardBody, Replies } from '../Panels';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';

export type Screen =
  | { view: 'ease' } | { view: 'record'; id: string } | { view: 'stats' } | { view: 'minutes' } | { view: 'burn' } | { view: 'memory' }
  | { view: 'station'; id: string };

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const up = (s: string) => s.toUpperCase();
const when = (iso: string) => `${dayLine(iso)} · ${dayAndTime(iso).split(' ')[1]}`;

/** A small state pill for an order. */
export function StatePill({ state }: { state: State }) {
  return <span className={`tstate ts-${state}`}>{STATE_WORD[state]}</span>;
}

interface Props {
  ship: ShipView;
  screen: Screen;
  onScreen: (s: Screen) => void;
  query: Query;
  onQuery: (q: Query) => void;
}

export function ComputerScreen({ ship, screen, onScreen, query, onQuery }: Props) {
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease', back);
  let body: ReactNode;
  switch (screen.view) {
    case 'record': body = <RecordView ship={ship} id={screen.id} query={query} onScreen={onScreen} onBack={back} />; break;
    case 'stats': body = <StatsView ship={ship} onQuery={(q) => { onQuery(q); back(); }} onBack={back} />; break;
    case 'minutes': body = <MinutesView ship={ship} onBack={back} />; break;
    case 'burn': body = <BurnView ship={ship} onBack={back} />; break;
    case 'memory': body = <MemoryView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) body = <StationDetail ship={ship} st={st} back="‹ Records" onBack={back} here="computer" />;
      break;
    }
  }
  if (!body) body = <Terminal ship={ship} query={query} onQuery={onQuery} onOpen={(id) => onScreen({ view: 'record', id })} onStats={() => onScreen({ view: 'stats' })} />;
  return (
    <section className="console wall core-screen" role="region" aria-label="Core terminal" style={css({ '--c': 'var(--core)' })}>
      {body}
    </section>
  );
}

// ---------- the records: every order, any state ----------

const STATS_WORDS = new Set(['stats', 'statistics', 'numbers']);

function Terminal({ ship, query, onQuery, onOpen, onStats }: {
  ship: ShipView; query: Query; onQuery: (q: Query) => void; onOpen: (id: string) => void; onStats: () => void;
}) {
  const all = records(ship.data);
  const file = recordsFile(ship.data);
  const shown = find(all, query);
  const n = counts(all);
  const open = all.filter((o) => o.state !== 'done').length;
  const [line, setLine] = useState('');
  const [said, setSaid] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const run = (e: FormEvent) => {
    e.preventDefault();
    if (!line.trim()) return;
    if (STATS_WORDS.has(line.trim().toLowerCase())) { setLine(''); onStats(); return; }
    const { query: q, open: id } = parseCommand(line, ship, query);
    setLine('');
    if (id) {
      if (all.some((o) => o.id === id)) onOpen(id);
      else setSaid(`${id}: no such record on file.`);
      return;
    }
    setSaid(null);
    onQuery(q);
  };
  const chip = (state: Query['state'], label: string, count: number) => (
    <button key={state} type="button" className={`tchip ts-${state}`} aria-pressed={query.state === state}
      onClick={() => onQuery({ ...query, state })}>{label} <b>{count}</b></button>
  );
  const station = query.station ? ship.station(query.station) : undefined;
  return (
    <>
      <ConHead icon={CORE_ICONS.ease} title="Core terminal · records"
        sub={`${all.length} ORDERS ON FILE · ${open} OPEN · ${file.synthetic ? 'SAMPLE RECORDS' : sourceWord(ship)} · READ ONLY`} />
      <div className="term" onClick={(e) => { if (e.target === e.currentTarget) input.current?.focus(); }}>
        <div className="tchips" role="group" aria-label="Show orders in a state">
          {chip('all', 'ALL', all.length)}
          {chip('open', 'OPEN', open)}
          {STATES.map((s) => chip(s, STATE_WORD[s], n[s]))}
        </div>
        <p className="techo mono">
          <span className="tprompt">computer@core:~$</span> {echo(query, ship)}
          {station && <button type="button" className="tclear" onClick={() => onQuery({ ...query, station: null })}>× {station.short}</button>}
          {query.words && <button type="button" className="tclear" onClick={() => onQuery({ ...query, words: '' })}>× “{query.words}”</button>}
          {(query.state !== 'all' || query.station || query.words) && <button type="button" className="tclear" onClick={() => onQuery(ALL)}>× all</button>}
          <button type="button" className="tclear tstats" onClick={onStats}>the numbers ›</button>
        </p>
        <ol className="tlist" aria-label="Orders">
          {shown.length === 0 && <li className="tnone mono">No order matches. Type <b>all</b> to see every record.</li>}
          {shown.slice(0, LIST_MAX).map((o) => <Row key={o.id} ship={ship} o={o} onOpen={onOpen} />)}
        </ol>
        <p className="tcount mono">
          {shown.length > LIST_MAX ? `${LIST_MAX} OF ${shown.length} SHOWN · NARROW IT WITH A STATE, A STATION OR WORDS` : `${shown.length} SHOWN`}
          {said && <span className="tsaid"> · {said}</span>}
        </p>
        <form className="tline" onSubmit={run} role="search">
          <label className="tprompt mono" htmlFor="core-cmd">computer@core:~$</label>
          <input id="core-cmd" ref={input} className="tinput mono" value={line} onChange={(e) => setLine(e.target.value)}
            autoComplete="off" spellCheck={false} placeholder="ORD-1232 · state blocked · station forge · words to find · stats · all" />
        </form>
      </div>
    </>
  );
}

/** Where the records come from, when they are live. */
function sourceWord(ship: ShipView): string {
  return ship.data.records ? 'LIVE FROM THE SHIP PROBE' : 'LIVE ORDERS · LAST 7 DAYS';
}

function Row({ ship, o, onOpen }: { ship: ShipView; o: Order; onOpen: (id: string) => void }) {
  const st = ship.station(o.station);
  return (
    <li>
      <button type="button" className={`trow ts-${o.state}`} onClick={() => onOpen(o.id)} style={css({ '--rc': railColor(st?.rail ?? 'mixed') })}>
        <span className="tid mono">{o.id}</span>
        <StatePill state={o.state} />
        <span className="tst mono">{up(st?.short ?? o.station)}</span>
        <span className="ttitle">{o.title}</span>
        <span className="twhen mono">{o.replies?.length ? `${o.replies.length} ↩ · ` : ''}{dayLine(o.updatedAt)}</span>
      </button>
    </li>
  );
}

// ---------- one order's full record ----------

function RecordView({ ship, id, query, onScreen, onBack }: { ship: ShipView; id: string; query: Query; onScreen: (s: Screen) => void; onBack: () => void }) {
  const all = records(ship.data);
  const o = all.find((x) => x.id === id);
  if (!o) return <ConHead icon={CORE_ICONS.record} title={id} sub="NO SUCH RECORD ON FILE" back="‹ Records" onBack={onBack} />;
  const st = ship.station(o.station);
  const list = find(all, query);
  const at = list.findIndex((x) => x.id === id);
  const newer = at > 0 ? list[at - 1] : undefined;
  const older = at >= 0 && at < list.length - 1 ? list[at + 1] : undefined;
  const subs = all.filter((x) => x.parent === o.id);
  const lines = logOf(ship.data, o.id);
  const go = (x: string) => onScreen({ view: 'record', id: x });
  return (
    <>
      <ConHead icon={CORE_ICONS.record} title={`${o.id} · ${o.title}`}
        sub={`${STATE_WORD[o.state]} · ${up(st?.name ?? o.station)} · UPDATED ${up(dayAndTime(o.updatedAt))}`} back="‹ Records" onBack={onBack}>
        <span className="stepper">
          <button type="button" className="con-back" disabled={!newer} onClick={() => newer && go(newer.id)} title="The newer order in this list">‹ Newer</button>
          <button type="button" className="con-back" disabled={!older} onClick={() => older && go(older.id)} title="The older order in this list">Older ›</button>
        </span>
      </ConHead>
      <div className="con-body trecord">
        <dl className="tfacts mono">
          <div><dt>ORDER</dt><dd>{o.id}</dd></div>
          <div><dt>STATE</dt><dd><StatePill state={o.state} /></dd></div>
          <div><dt>STATION</dt><dd>{st
            ? <button type="button" className="linkish" onClick={() => onScreen({ view: 'station', id: st.id })}>{st.name}</button>
            : o.station}</dd></div>
          <div><dt>SPEED</dt><dd>{speedText(o.speed)}</dd></div>
          <div><dt>TIER</dt><dd>{o.tier === undefined ? 'NO TIER' : `TIER ${o.tier}`}</dd></div>
          {o.openedAt && <div><dt>OPENED</dt><dd>{when(o.openedAt)}{o.surface ? ` · ${up(SURFACE_WORD[o.surface] ?? o.surface)}` : ''}</dd></div>}
          {o.closedAt && <div><dt>CLOSED</dt><dd>{when(o.closedAt)}{took(o) !== null ? ` · TOOK ${span(took(o)!)}` : ''}</dd></div>}
          <div><dt>UPDATED</dt><dd>{when(o.updatedAt)}</dd></div>
          {o.cards !== undefined && <div><dt>CARDS</dt><dd>{o.cards === 0 ? 'NONE · ANSWERED IN CHAT' : o.cards}</dd></div>}
          {o.parent && <div><dt>PART OF</dt><dd><button type="button" className="linkish" onClick={() => go(o.parent!)}>{o.parent}</button></dd></div>}
          {subs.length > 0 && <div><dt>SUB-ORDERS</dt><dd>{subs.map((s) => (
            <button key={s.id} type="button" className="linkish" onClick={() => go(s.id)}>{s.id}</button>))}</dd></div>}
          {o.mission && <div><dt>MISSION</dt><dd>{o.mission}</dd></div>}
          {o.detail && <div className="wide"><dt>NOTE</dt><dd>{o.detail}</dd></div>}
        </dl>
        {o.body
          ? <div className="tsec"><span className="cb-head mono">THE BRIEF</span><CardBody text={o.body} /></div>
          : <p className="tnote">No card body on file: Number One answered this one in chat, or the card had no words.</p>}
        {o.replies && o.replies.length > 0
          ? <Replies ship={ship} replies={o.replies} />
          : <p className="tnote">Nothing came back on this order yet.</p>}
        {lines.length > 0 && (
          <div className="tsec">
            <span className="cb-head mono">SHIP'S LOG · {lines.length}</span>
            <ol className="tlog">
              {lines.map((l) => (
                <li key={l.at + l.text}><time className="mono" dateTime={l.at}>{up(dayAndTime(l.at))}</time><span>{l.text}</span></li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}

// ---------- the numbers ----------

function StatsView({ ship, onQuery, onBack }: { ship: ShipView; onQuery: (q: Query) => void; onBack: () => void }) {
  const all = records(ship.data);
  const file = recordsFile(ship.data);
  const s = stats(all, file.asOf);
  const most = Math.max(1, ...s.days.map((d) => d.opened));
  const slowest = Math.max(1, ...s.stations.map((x) => x.median));
  const from = Math.max(1, ...s.surfaces.map((x) => x.n));
  const peak = s.days.reduce((a, d) => (d.opened > a.opened ? d : a), s.days[0]);
  const today = s.days[s.days.length - 1];
  const handled = s.card + s.chat;
  const oldest = all.reduce<string | null>((a, o) => { const t = o.openedAt ?? o.updatedAt; return !a || t < a ? t : a; }, null);
  return (
    <>
      <ConHead icon={CORE_ICONS.stats} title="Records · the numbers" back="‹ Records" onBack={onBack}
        sub={`${all.length} ORDERS ON FILE${oldest ? ` · SINCE ${dayLine(oldest)}` : ''} · ${file.synthetic ? 'SAMPLE RECORDS' : sourceWord(ship)}`} />
      <div className="con-body tstats-body">
        <ul className="tkpis">
          <li><span className="tk-n">{s.week.opened}</span><span className="tk-l mono">OPENED · LAST 7 DAYS</span></li>
          <li><span className="tk-n">{s.week.closed}</span><span className="tk-l mono">CLOSED · LAST 7 DAYS</span></li>
          <li><span className="tk-n">{s.median === null ? '—' : span(s.median).toLowerCase()}</span>
            <span className="tk-l mono">MEDIAN TIME TO CLOSE · {s.timed} TIMED</span></li>
          <li><span className="tk-n">{handled ? `${s.chat} of ${handled}` : '—'}</span><span className="tk-l mono">ANSWERED IN CHAT · NO CARD</span></li>
        </ul>

        <div className="tsec">
          <span className="cb-head mono">ORDERS OPENED PER DAY · LAST {s.days.length} DAYS</span>
          <ol className="tdays" aria-label="Orders opened per day">
            {s.days.map((d) => (
              <li key={d.key} title={`${d.label}: ${d.opened} opened, ${d.closed} closed`} aria-label={`${d.label}, ${d.opened} opened, ${d.closed} closed`}>
                <span className="td-n mono">{d.opened > 0 && (d === peak || d === today) ? d.opened : ''}</span>
                <span className="td-bar"><b style={{ height: `${(d.opened / most) * 100}%` }} /></span>
                <span className="td-day mono">{d.label.split(' ')[1]}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="tstat-cols">
          <div className="tsec">
            <span className="cb-head mono">TIME TO CLOSE · MEDIAN PER STATION · SLOWEST FIRST</span>
            {s.stations.length === 0 && <p className="tnote">No done order has both its times yet.</p>}
            <ul className="tbars">
              {s.stations.map((x) => {
                const st = ship.station(x.id);
                return (
                  <li key={x.id}>
                    <button type="button" className="tbar-row" title={`Show ${st?.short ?? x.id}'s done orders`}
                      onClick={() => onQuery({ state: 'done', station: x.id, words: '' })}>
                      <span className="tb-label">{st?.short ?? x.id}</span>
                      <span className="tb-track"><b style={{ width: `${(x.median / slowest) * 100}%` }} /></span>
                      <span className="tb-v mono">{span(x.median)} · {x.done} DONE</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="tsec">
            <span className="cb-head mono">WHERE THE ORDERS CAME FROM</span>
            {s.surfaces.length === 0 && <p className="tnote">The records don't say yet.</p>}
            <ul className="tbars">
              {s.surfaces.map((x) => (
                <li key={x.id}>
                  <span className="tbar-row">
                    <span className="tb-label">{SURFACE_WORD[x.id] ?? x.id}</span>
                    <span className="tb-track"><b style={{ width: `${(x.n / from) * 100}%` }} /></span>
                    <span className="tb-v mono">{x.n}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- the briefing minutes ----------

function MinutesView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const list = minutes(ship.data);
  const name = (id: string) => ship.station(id)?.short ?? id;
  return (
    <>
      <ConHead icon={CORE_ICONS.minutes} title="Briefing minutes" back="‹ Records" onBack={onBack}
        sub={`${list.length} BRIEFINGS ON FILE · KEPT BY THE SHIP'S COMPUTER · NEWEST FIRST`} />
      <div className="con-body">
        {list.length === 0 && <p className="tnote">No briefing has been minuted yet.</p>}
        <ol className="tminutes">
          {list.map((m) => {
            const mins = m.ends ? Math.round((Date.parse(m.ends) - Date.parse(m.at)) / 60000) : null;
            return (
              <li key={m.at + m.text}>
                <span className="tm-head">
                  <span className="tm-topic">{m.text.replace(/^Briefing:\s*/, '')}</span>
                  <span className="tm-when mono">{dayLine(m.at)} · {dayAndTime(m.at).split(' ')[1]}{mins ? ` · ${mins} MIN` : ''}</span>
                </span>
                {m.attendees && <span className="tm-who mono">AT THE TABLE · {m.attendees.map(name).join(', ').toUpperCase()}</span>}
                {m.outcome && <span className="tm-out">{m.outcome}</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

// ---------- the burn window ----------

function BurnView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const rails = ship.data.rails.rails.filter((r) => RAIL_IDS.includes(r.id));
  const on = rails.filter((r) => r.burn?.active);
  return (
    <>
      <ConHead icon={CORE_ICONS.burn} title={on.length ? 'Dilithium Burn · on' : 'Dilithium Burn · not on'} back="‹ Records" onBack={onBack}
        sub={`THE WEEKLY BURN · ${ship.data.rails.synthetic ? 'SAMPLE RAILS' : 'LIVE FROM THE RAILS PROBE'}`} />
      <div className="con-body">
        <p className="tnote">
          Before the Claude week resets on Thursday at 10:00, the crew may use what is left of the windows. Cards held for the
          burn wait on the board, and the Ship's Computer releases them when it starts.
        </p>
        <ul className="tburn">
          {rails.map((r) => (
            <li key={r.id} className={r.burn?.active ? 'on' : undefined} style={css({ '--rc': railColor(r.id) })}>
              <span className="tb-name">{r.label}</span>
              <span className="tb-state mono">{r.burn?.active ? `BURNING${r.burn.until ? ` UNTIL ${up(dayAndTime(r.burn.until))}` : ''}` : 'NO BURN'}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---------- the memory banks: sealed ----------

function MemoryView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const computer = ship.station('computer');
  return (
    <>
      <ConHead icon={CORE_ICONS.memory} title="Memory banks · sealed" back="‹ Records" onBack={onBack}
        sub="HINDSIGHT · THE SHIP'S LONG MEMORY · NOTHING FROM IT SHOWS ON A BOARD" />
      <div className="con-body">
        <ul className="tseal">
          <li>Only the Ship's Computer reads and writes Hindsight. No other station has the tools for it.</li>
          <li>Memory never crosses to a cloud rail: Codex and Claude stations never see it, and never file cards to the Computer.</li>
          <li>To ask it something, give Number One an order for the Computer. Its answer comes back on that order, like any other.</li>
        </ul>
        {computer && (
          <p className="tnote">
            The Computer runs on {computer.model}.{' '}
            <button type="button" className="linkish" onClick={() => onScreen({ view: 'station', id: 'computer' })}>Its station card ›</button>
          </p>
        )}
      </div>
    </>
  );
}
