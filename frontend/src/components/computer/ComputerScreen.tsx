// The core terminal. One view at a time, in place: the records (every order the ship has taken,
// any state, with a command line to find one, a page at a time), a single order's full record, the
// briefing minutes, the burn window, the sealed memory banks, any crew member's card, the terminal's
// manual (man) and its settings. Reading only: nothing typed here reaches Hermes, and the command
// line only searches what is already on the page.
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { dayAndTime, dayLine } from '../../lib/format';
import { railColor, speedText } from '../../lib/lookups';
import {
  ALL, CORE_ICONS, STATES, STATE_WORD, SURFACE_WORD, counts, echo, logOf, minutes, records, recordsFile,
  span, stats, took, type Query, type State,
} from '../../lib/computer';
import {
  DEFAULTS, MAN_SECTIONS, PHOSPHOR, SETTINGS, applySet, command, keyWord, listOf, manCommands, manTopic, pageAt, turn, wordOf,
  type CoreSettings,
} from '../../lib/terminal';
import type { ShipView } from '../../lib/ship';
import { RAIL_IDS } from '../../lib/ship';
import type { Order } from '../../types';
import { CardBody, Replies } from '../Panels';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';

export type Screen =
  | { view: 'ease' } | { view: 'record'; id: string } | { view: 'stats' } | { view: 'minutes' } | { view: 'burn' } | { view: 'memory' }
  | { view: 'station'; id: string } | { view: 'man'; topic?: string } | { view: 'settings' };

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const up = (s: string) => s.toUpperCase();
const clock = (iso: string) => dayAndTime(iso).split(' ')[1];
const when = (iso: string) => `${dayLine(iso)} · ${clock(iso)}`;

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
  /** The page of the list (from 0). A new query starts again on the first. */
  page: number;
  onPage: (page: number) => void;
  settings: CoreSettings;
  onSettings: (s: CoreSettings) => void;
  /** Goes up by one each time the jump key is pressed: the command line takes the cursor. */
  jump: number;
}

export function ComputerScreen({ ship, screen, onScreen, query, onQuery, page, onPage, settings, onSettings, jump }: Props) {
  const all = records(ship.data);
  const list = listOf(all, query, settings);
  const [said, setSaid] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const root = useRef<HTMLElement>(null);
  // Back from a record goes to the page it is on, so stepping through the list keeps your place.
  const back = () => {
    if (screen.view === 'record') {
      const i = list.findIndex((o) => o.id === screen.id);
      if (i >= 0) onPage(Math.floor(i / settings.rows));
    }
    onScreen({ view: 'ease' });
  };
  useEscape(screen.view !== 'ease', back);
  useEffect(() => { if (jump) root.current?.querySelector<HTMLInputElement>('#core-cmd')?.focus(); }, [jump]);

  /** Runs a line from the command line, or one picked in the manual. */
  const run = (line: string) => {
    const c = command(line, ship, query);
    if (!c) return;
    const text = line.trim();
    setHistory((h) => [...h.filter((x) => x !== text), text].slice(-50));
    setSaid(null);
    const ease = () => onScreen({ view: 'ease' });
    switch (c.kind) {
      case 'open':
        if (all.some((o) => o.id === c.id)) onScreen({ view: 'record', id: c.id });
        else { setSaid(`${c.id}: no such record on file.`); ease(); }
        return;
      case 'stats': onScreen({ view: 'stats' }); return;
      case 'man': {
        const topic = c.topic ? manTopic(c.topic, settings) : undefined;
        if (c.topic && !topic) { setSaid(`man: no entry for ${c.topic}. Type man for the whole manual.`); ease(); return; }
        onScreen(topic ? { view: 'man', topic } : { view: 'man' });
        return;
      }
      case 'set': {
        if (!c.name) { onScreen({ view: 'settings' }); return; }
        const r = applySet(settings, c.name, c.value);
        onSettings(r.settings);
        setSaid(r.said);
        ease();
        return;
      }
      case 'page': {
        const t = turn(c.to, pageAt(list.length, settings.rows, page));
        onPage(t.page);
        if (t.said) setSaid(t.said);
        ease();
        return;
      }
      case 'query':
        onQuery(c.query);
        if (c.said) setSaid(c.said);
        ease();
    }
  };

  const open = (id: string) => onScreen({ view: 'record', id });
  let body: ReactNode;
  switch (screen.view) {
    case 'record': body = <RecordView ship={ship} id={screen.id} list={list} oldest={settings.order === 'oldest'} onScreen={onScreen} onBack={back} />; break;
    case 'stats': body = <StatsView ship={ship} onQuery={(q) => { onQuery(q); back(); }} onBack={back} />; break;
    case 'minutes': body = <MinutesView ship={ship} onBack={back} />; break;
    case 'burn': body = <BurnView ship={ship} onBack={back} />; break;
    case 'memory': body = <MemoryView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'man': body = <ManView key={screen.topic ?? ''} topic={screen.topic} settings={settings} onRun={run} onScreen={onScreen} onBack={back} />; break;
    case 'settings': body = <SettingsView settings={settings} onSettings={onSettings} onBack={back} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) body = <StationDetail ship={ship} st={st} back="‹ Records" onBack={back} here="computer" />;
      break;
    }
  }
  if (!body) {
    body = <Terminal ship={ship} all={all} list={list} query={query} onQuery={onQuery} page={page} onPage={onPage} settings={settings}
      said={said} history={history} onRun={run} onOpen={open} onScreen={onScreen} />;
  }
  return (
    <section ref={root} className="console wall core-screen" role="region" aria-label="Core terminal"
      style={css({ '--c': 'var(--core)', '--phos': PHOSPHOR[settings.phosphor] })}>
      {body}
    </section>
  );
}

// ---------- the records: every order, any state, a page at a time ----------

function Terminal({ ship, all, list, query, onQuery, page, onPage, settings, said, history, onRun, onOpen, onScreen }: {
  ship: ShipView; all: Order[]; list: Order[]; query: Query; onQuery: (q: Query) => void; page: number; onPage: (p: number) => void;
  settings: CoreSettings; said: string | null; history: string[]; onRun: (line: string) => void; onOpen: (id: string) => void;
  onScreen: (s: Screen) => void;
}) {
  const file = recordsFile(ship.data);
  const n = counts(all);
  const open = all.filter((o) => o.state !== 'done').length;
  const [line, setLine] = useState('');
  // How far back in the lines typed the up arrow has gone: -1 is the line being typed.
  const [back, setBack] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const ol = useRef<HTMLOListElement>(null);
  const p = pageAt(list.length, settings.rows, page);
  const shown = list.slice(p.from, p.to);
  // A new page starts at its top.
  useEffect(() => { if (ol.current) ol.current.scrollTop = 0; }, [p.at, query]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!line.trim()) return;
    const l = line;
    setLine('');
    setBack(-1);
    onRun(l);
  };
  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!history.length) return;
      e.preventDefault();
      const b = Math.max(-1, e.key === 'ArrowUp' ? Math.min(back + 1, history.length - 1) : back - 1);
      setBack(b);
      setLine(b < 0 ? '' : history[history.length - 1 - b]);
    } else if (e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault();
      onPage(turn(e.key === 'PageDown' ? 'next' : 'prev', p).page);
    } else if (e.key === 'Escape') {
      if (line) { setLine(''); setBack(-1); } else input.current?.blur();
    }
  };
  const chip = (state: Query['state'], label: string, count: number) => (
    <button key={state} type="button" className={`tchip ts-${state}`} aria-pressed={query.state === state}
      onClick={() => onQuery({ ...query, state })}>{label} <b>{count}</b></button>
  );
  const station = query.station ? ship.station(query.station) : undefined;
  const filtered = query.state !== 'all' || query.station || query.words || query.since || query.before;
  // Paging forward goes further back in time when the newest come first, and forward in time when the oldest do.
  const [earlier, later] = settings.order === 'newest' ? ['NEWER', 'OLDER'] : ['OLDER', 'NEWER'];
  const key = keyWord(settings.key);
  return (
    <>
      <ConHead icon={CORE_ICONS.ease} title="Core terminal · records"
        sub={`${all.length} ORDERS ON FILE · ${open} OPEN · ${file.synthetic ? 'SAMPLE RECORDS' : sourceWord(ship)} · READ ONLY`}>
        <span className="stepper">
          <button type="button" className="con-back tman-btn" onClick={() => onScreen({ view: 'man' })} title="The terminal's manual (man)">man</button>
          <button type="button" className="con-back" onClick={() => onScreen({ view: 'settings' })} title="The terminal's settings (set)">Settings</button>
        </span>
      </ConHead>
      <div className="term" onClick={(e) => { if (e.target === e.currentTarget) input.current?.focus(); }}>
        <div className="tchips" role="group" aria-label="Show orders in a state">
          {chip('all', 'ALL', all.length)}
          {chip('open', 'OPEN', open)}
          {STATES.map((s) => chip(s, STATE_WORD[s], n[s]))}
        </div>
        <p className="techo mono">
          <span className="tprompt">computer@core:~$</span> {echo(query, ship)}
          {station && <button type="button" className="tclear" onClick={() => onQuery({ ...query, station: null })}>× {station.short}</button>}
          {query.since && <button type="button" className="tclear" onClick={() => onQuery({ ...query, since: undefined })}>× since {query.since}</button>}
          {query.before && <button type="button" className="tclear" onClick={() => onQuery({ ...query, before: undefined })}>× before {query.before}</button>}
          {query.words && <button type="button" className="tclear" onClick={() => onQuery({ ...query, words: '' })}>× “{query.words}”</button>}
          {filtered && <button type="button" className="tclear" onClick={() => onQuery(ALL)}>× all</button>}
          <button type="button" className="tclear tstats" onClick={() => onScreen({ view: 'stats' })}>the numbers ›</button>
        </p>
        <ol ref={ol} className="tlist" aria-label={p.pages > 1 ? `Orders, page ${p.at + 1} of ${p.pages}` : 'Orders'}>
          {list.length === 0 && <li className="tnone mono">No order matches. Type <b>all</b> to see every record, or <b>man</b> for help.</li>}
          {shown.map((o) => <Row key={o.id} ship={ship} o={o} times={settings.dates === 'time'} onOpen={onOpen} />)}
        </ol>
        <div className="tfoot mono">
          <span className="tcount">
            {p.pages > 1 ? `${p.from + 1}–${p.to} OF ${list.length} · PAGE ${p.at + 1} OF ${p.pages}` : `${list.length} SHOWN`}
            {settings.order === 'oldest' ? ' · OLDEST FIRST' : ''}
          </span>
          {p.pages > 1 && (
            <span className="tpager" role="group" aria-label="Pages">
              <button type="button" className="tpage" disabled={p.at === 0} onClick={() => onPage(0)}>« FIRST</button>
              <button type="button" className="tpage" disabled={p.at === 0} onClick={() => onPage(p.at - 1)}>‹ {earlier}</button>
              <button type="button" className="tpage" disabled={p.at === p.pages - 1} onClick={() => onPage(p.at + 1)}>{later} ›</button>
              <button type="button" className="tpage" disabled={p.at === p.pages - 1} onClick={() => onPage(p.pages - 1)}>LAST »</button>
            </span>
          )}
        </div>
        {said && <p className="tsaid mono" role="status">{said}</p>}
        <form className="tline" onSubmit={submit} role="search">
          <label className="tprompt mono" htmlFor="core-cmd">computer@core:~$</label>
          <input id="core-cmd" ref={input} className="tinput mono" value={line} onChange={(e) => { setLine(e.target.value); setBack(-1); }} onKeyDown={keys}
            autoComplete="off" spellCheck={false} aria-keyshortcuts={settings.key === 'ctrl+k' ? 'Control+K' : settings.key}
            placeholder="ORD-1232 · state blocked · station forge · since 20/10 · words to find · man" />
          <span className="thint mono" aria-hidden="true"><kbd>{key}</kbd> TO TYPE · <kbd>↑</kbd> EARLIER LINES</span>
        </form>
      </div>
    </>
  );
}

/** Where the records come from, when they are live. */
function sourceWord(ship: ShipView): string {
  return ship.data.records ? 'LIVE FROM THE SHIP PROBE' : 'LIVE ORDERS · LAST 7 DAYS';
}

function Row({ ship, o, times, onOpen }: { ship: ShipView; o: Order; times: boolean; onOpen: (id: string) => void }) {
  const st = ship.station(o.station);
  return (
    <li>
      <button type="button" className={`trow ts-${o.state}`} onClick={() => onOpen(o.id)} style={css({ '--rc': railColor(st?.rail ?? 'mixed') })}>
        <span className="tid mono">{o.id}</span>
        <StatePill state={o.state} />
        <span className="tst mono">{up(st?.short ?? o.station)}</span>
        <span className="ttitle">{o.title}</span>
        <span className="twhen mono">{o.replies?.length ? `${o.replies.length} ↩ · ` : ''}{times ? when(o.updatedAt) : dayLine(o.updatedAt)}</span>
      </button>
    </li>
  );
}

// ---------- one order's full record ----------

function RecordView({ ship, id, list, oldest, onScreen, onBack }: {
  ship: ShipView; id: string; list: Order[]; oldest: boolean; onScreen: (s: Screen) => void; onBack: () => void;
}) {
  const all = records(ship.data);
  const o = all.find((x) => x.id === id);
  if (!o) return <ConHead icon={CORE_ICONS.record} title={id} sub="NO SUCH RECORD ON FILE" back="‹ Records" onBack={onBack} />;
  const st = ship.station(o.station);
  // Newer and older go by time, whichever way round the list is.
  const byTime = oldest ? [...list].reverse() : list;
  const at = byTime.findIndex((x) => x.id === id);
  const newer = at > 0 ? byTime[at - 1] : undefined;
  const older = at >= 0 && at < byTime.length - 1 ? byTime[at + 1] : undefined;
  const pos = list.findIndex((x) => x.id === id);
  const subs = all.filter((x) => x.parent === o.id);
  const lines = logOf(ship.data, o.id);
  const go = (x: string) => onScreen({ view: 'record', id: x });
  return (
    <>
      <ConHead icon={CORE_ICONS.record} title={`${o.id} · ${o.title}`}
        sub={`${STATE_WORD[o.state]} · ${up(st?.name ?? o.station)} · UPDATED ${up(dayAndTime(o.updatedAt))}`} back="‹ Records" onBack={onBack}>
        <span className="stepper">
          {pos >= 0 && <span className="tpos mono" title="Where this order is in the list">{pos + 1} / {list.length}</span>}
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
          <div><dt>SPEED</dt><dd>{speedText(o.speed, st)}</dd></div>
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

// ---------- the manual: man ----------

const SECTION_WORD: Record<typeof MAN_SECTIONS[number], string> = {
  name: 'NAME', synopsis: 'SYNOPSIS', description: 'DESCRIPTION', commands: 'COMMANDS', keys: 'KEYS', settings: 'SETTINGS', files: 'FILES',
};

function ManView({ topic, settings, onRun, onScreen, onBack }: {
  topic?: string; settings: CoreSettings; onRun: (line: string) => void; onScreen: (s: Screen) => void; onBack: () => void;
}) {
  const cmds = manCommands(settings);
  const body = useRef<HTMLDivElement>(null);
  const goTo = (id: string) => {
    const el = body.current?.querySelector<HTMLElement>(`#man-${id}`);
    if (body.current && el) body.current.scrollTop = el.offsetTop - 6;
  };
  // "man <command>" opens the manual at that command.
  useEffect(() => { if (topic) goTo(topic); }, [topic]);
  const key = keyWord(settings.key);
  const keys: [string, string][] = [
    [key, settings.key === 'ctrl+k'
      ? 'From anywhere on this board, even while typing: back to the records, with the cursor on the command line.'
      : 'From anywhere on this board: back to the records, with the cursor on the command line. Not while you type in another field.'],
    ['Enter', 'Runs the line.'],
    ['↑ ↓', 'The lines you typed before, and back again.'],
    ['PgUp PgDn', 'The page before and the page after, on the command line.'],
    ['Esc', 'On the command line: clears the line, then leaves it. Anywhere else on the terminal: back to the records.'],
    ['F', 'Full screen, when you are not typing.'],
  ];
  const tryIt = (eg: string) => (
    <button key={eg} type="button" className="tman-eg" onClick={() => onRun(eg)} title="Run it">{eg}</button>
  );
  return (
    <>
      <ConHead icon={CORE_ICONS.man} title="man core · the terminal's manual" back="‹ Records" onBack={onBack}
        sub={`CORE(1) · SHIP'S COMPUTER MANUAL · PICK A LINE IN GREEN TO RUN IT${topic ? ` · AT ${up(topic)}` : ''}`} />
      <nav className="tman-index mono" aria-label="Sections">
        {MAN_SECTIONS.map((x) => <button key={x} type="button" className="tclear" onClick={() => goTo(x)}>{SECTION_WORD[x]}</button>)}
        <span className="tman-sep" aria-hidden="true">·</span>
        {cmds.map((c) => <button key={c.id} type="button" className={'tclear' + (topic === c.id ? ' on' : '')} onClick={() => goTo(c.id)}>{c.usage[0].split(' ')[0]}</button>)}
      </nav>
      <div className="con-body tman mono" ref={body}>
        <section id="man-name">
          <h3>NAME</h3>
          <p>core · the Ship's Computer's records terminal: every order the ship has taken, in any state.</p>
        </section>
        <section id="man-synopsis">
          <h3>SYNOPSIS</h3>
          <pre>{[
            'ORD-dddd',
            '[state <state>] [station <name>] [since <day>] [before <day>] [open] [all] [words …]',
            '"<words>"',
            'page <n> | next | prev | first | last',
            'stats',
            'set [<name> [<value>]] | set defaults',
            'man [<command>]',
          ].join('\n')}</pre>
        </section>
        <section id="man-description">
          <h3>DESCRIPTION</h3>
          <p>
            Reading only. The terminal lists every order on file, {settings.order === 'newest' ? 'newest first' : 'oldest first'} by its last update,
            {' '}{settings.rows} to a page; past that the list goes on to a new page, so every order on file can be reached. Nothing typed
            here reaches Hermes: the command line only searches the records already on this board.
          </p>
          <p>
            A state, a station and days stay on until you change them or type <b>all</b>; the words are replaced by each new line. The line
            above the list echoes the whole search as one command, and each <b>×</b> on it drops one part. The chips above it pick a state,
            and so do the records board on the table and the stations on the right.
          </p>
        </section>
        <section id="man-commands">
          <h3>COMMANDS</h3>
          <dl className="tman-cmds">
            {cmds.map((c) => (
              <div key={c.id} id={`man-${c.id}`} className={topic === c.id ? 'on' : undefined}>
                <dt>{c.usage.map((u) => <code key={u}>{u}</code>)}</dt>
                <dd>
                  <span>{c.says}</span>
                  {c.eg && <span className="tman-try">TRY {c.eg.map(tryIt)}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section id="man-keys" className={topic === 'keys' ? 'on' : undefined}>
          <h3>KEYS</h3>
          <dl className="tman-keys">
            {keys.map(([k, says]) => <div key={k}><dt><kbd>{k}</kbd></dt><dd>{says}</dd></div>)}
          </dl>
        </section>
        <section id="man-settings" className={topic === 'settings' ? 'on' : undefined}>
          <h3>SETTINGS</h3>
          <p>Kept in this browser. Change them on the settings page or with <b>set &lt;name&gt; &lt;value&gt;</b>.</p>
          <dl className="tman-sets">
            {SETTINGS.map((x) => (
              <div key={x.id}>
                <dt><code>{x.id}</code></dt>
                <dd>{x.says} <span className="tman-now">{x.choices.map((c) => String(c.v)).join(' | ')} · NOW {up(wordOf(x, settings[x.id]))}</span></dd>
              </div>
            ))}
          </dl>
          <button type="button" className="tman-eg" onClick={() => onScreen({ view: 'settings' })}>Open the settings ›</button>
        </section>
        <section id="man-files" className={topic === 'files' ? 'on' : undefined}>
          <h3>FILES</h3>
          <dl className="tman-keys">
            <div><dt><code>live/records.json</code></dt><dd>
              Written by the ship probe on the NAS: every order in orders.csv with its card, replies and times, done ones too however old,
              up to the newest RECORDS_KEEP (1000 in deploy/compose.yaml). Set on the NAS, not here.
            </dd></div>
            <div><dt><code>live/orders.json</code></dt><dd>The boards' orders, the last 7 days. The terminal reads these when there is no records file.</dd></div>
            <div><dt><code>hermes.coreTerminal</code></dt><dd>This browser's storage, where the terminal keeps its settings.</dd></div>
          </dl>
        </section>
      </div>
    </>
  );
}

// ---------- the settings ----------

function SettingsView({ settings, onSettings, onBack }: { settings: CoreSettings; onSettings: (s: CoreSettings) => void; onBack: () => void }) {
  const same = SETTINGS.every((x) => settings[x.id] === DEFAULTS[x.id]);
  return (
    <>
      <ConHead icon={CORE_ICONS.settings} title="Terminal settings" back="‹ Records" onBack={onBack}
        sub="KEPT IN THIS BROWSER ONLY · NEVER SENT TO HERMES">
        <button type="button" className="con-back" disabled={same} onClick={() => onSettings({ ...DEFAULTS })} title="Every setting back to its default (set defaults)">Defaults</button>
      </ConHead>
      <div className="con-body tset">
        <ul className="tset-list">
          {SETTINGS.map((x) => (
            <li key={x.id} className="tset-row">
              <span className="tset-name">{x.name}</span>
              <code className="tset-cmd mono">set {x.id} {String(settings[x.id])}</code>
              <span className="tset-says">{x.says}</span>
              <span className="tset-choices" role="group" aria-label={x.name}>
                {x.choices.map((c) => (
                  <button key={String(c.v)} type="button" className="tchoice" aria-pressed={settings[x.id] === c.v}
                    onClick={() => onSettings({ ...settings, [x.id]: c.v })}>
                    {x.id === 'phosphor' && <i className="tswatch" style={{ background: PHOSPHOR[c.v as CoreSettings['phosphor']] }} />}
                    {c.word}
                  </button>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="tnote tset-nas">Set on the NAS, not here: how many orders the ship probe keeps in the records (RECORDS_KEEP, 1000).</p>
      </div>
    </>
  );
}
