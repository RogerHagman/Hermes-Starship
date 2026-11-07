// Number One's wall screen. One view at a time, in place: the routing table (every ask, where it came
// from and which station took it), one order, the comm channels, the fast path, the rail rules, the
// hails, where the orders went, what was not done, the briefing minutes and Number One's card.
import type { ReactNode } from 'react';
import { dayAndTime, dayLine } from '../../lib/format';
import { RANK, railColor } from '../../lib/lookups';
import { minutes, records, recordsFile } from '../../lib/computer';
import { openedOf } from '../../lib/post';
import type { ShipView } from '../../lib/ship';
import {
  EVERY, FAST_WORDS, RAIL_RULES, SURFACES, SURFACE_COLOUR, XO_ICONS, asks, channels, destinations, routed, surfaceWord, type Route,
} from '../../lib/xo';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';
import { Kpis, OrderRow, OrderView, css, sourceWord, up } from '../post/Parts';

export type Screen =
  | { view: 'ease' } | { view: 'order'; id: string; from?: Screen } | { view: 'channels' } | { view: 'fastpath' } | { view: 'rules' }
  | { view: 'hails' } | { view: 'stations' } | { view: 'blocked' } | { view: 'lounge' } | { view: 'station'; id: string };

const LIST_MAX = 150;

interface Props { ship: ShipView; screen: Screen; onScreen: (s: Screen) => void; route: Route; onRoute: (r: Route) => void }

export function XoScreen({ ship, screen, onScreen, route, onRoute }: Props) {
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease', screen.view === 'order' && screen.from ? () => onScreen(screen.from!) : back);
  const open = (from?: Screen) => (id: string) => onScreen({ view: 'order', id, from });
  let body: ReactNode;
  switch (screen.view) {
    case 'order': body = <OrderView ship={ship} id={screen.id} icon={XO_ICONS.order}
      back={screen.from ? '‹ Back' : '‹ Routing table'} onBack={() => onScreen(screen.from ?? { view: 'ease' })} />; break;
    case 'channels': body = <ChannelsView ship={ship} onRoute={(r) => { onRoute(r); back(); }} onBack={back} />; break;
    case 'fastpath': body = <FastPathView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'rules': body = <RulesView onBack={back} />; break;
    case 'hails': body = <ListView ship={ship} title="Hails · waiting for you" icon={XO_ICONS.hails} state="awaiting-captain"
      none="Nothing waits for you." onOpen={open(screen)} onBack={back}
      sub="CHECKPOINTS AND ANYTHING TIER 3 · NUMBER ONE HOLDS THEM UNTIL YOU ANSWER" />; break;
    case 'blocked': body = <ListView ship={ship} title="Not done · blocked" icon={XO_ICONS.blocked} state="blocked"
      none="Nothing is blocked." onOpen={open(screen)} onBack={back}
      sub="NUMBER ONE FAILS A TASK RATHER THAN DOING IT ITSELF · EACH ONE SAYS WHY" />; break;
    case 'stations': body = <StationsView ship={ship} onRoute={(r) => { onRoute(r); back(); }} onBack={back} />; break;
    case 'lounge': body = <LoungeView ship={ship} onBack={back} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) body = <StationDetail ship={ship} st={st} back="‹ Routing table" onBack={back} here="xo" />;
      break;
    }
  }
  if (!body) body = <RoutingTable ship={ship} route={route} onRoute={onRoute} onOpen={open()} />;
  return (
    <section className="console wall post-screen" role="region" aria-label="Number One's screen" style={css({ '--c': 'var(--acc)' })}>
      {body}
    </section>
  );
}

/** Where the records came from, for the line under each title. */
function source(ship: ShipView) {
  const f = recordsFile(ship.data);
  return sourceWord(f.synthetic, f.asOf).replace('SAMPLE', 'SAMPLE ORDERS');
}

// ---------- the routing table ----------

function RoutingTable({ ship, route, onRoute, onOpen }: { ship: ShipView; route: Route; onRoute: (r: Route) => void; onOpen: (id: string) => void }) {
  const all = asks(ship.data);
  const shown = routed(all, route);
  const st = route.station ? ship.station(route.station) : undefined;
  return (
    <>
      <ConHead icon={XO_ICONS.ease} title="Routing table"
        sub={`${all.length} ASKS ON FILE · WHERE EACH CAME FROM AND WHICH STATION TOOK IT · ${source(ship)}`} />
      <div className="pchips" role="group" aria-label="Show asks from a surface">
        <button type="button" className="pchip" aria-pressed={!route.surface} onClick={() => onRoute({ ...route, surface: null })}>ALL <b>{all.length}</b></button>
        {SURFACES.map((s) => (
          <button key={s} type="button" className="pchip" style={css({ '--pc': SURFACE_COLOUR[s] })} aria-pressed={route.surface === s}
            onClick={() => onRoute({ ...route, surface: route.surface === s ? null : s })}>
            {up(surfaceWord(s))} <b>{all.filter((o) => o.surface === s).length}</b>
          </button>
        ))}
        {st && <button type="button" className="pchip" aria-pressed onClick={() => onRoute({ ...route, station: null })}>× {up(st.short)}</button>}
      </div>
      <ol className="porders" aria-label="Asks">
        {shown.length === 0 && <li className="pnote">No ask matches. <button type="button" className="linkish" onClick={() => onRoute(EVERY)}>Show them all</button></li>}
        {shown.slice(0, LIST_MAX).map((o) => {
          const to = ship.station(o.station);
          const col = o.surface && o.surface in SURFACE_COLOUR ? SURFACE_COLOUR[o.surface as keyof typeof SURFACE_COLOUR] : 'var(--text-label)';
          return (
            <OrderRow key={o.id} ship={ship} o={o} onOpen={onOpen}
              extra={<span className="po-st mono"><span style={{ color: col }}>{up(o.surface ?? '?')}</span> → {up(to?.short ?? o.station)}</span>} />
          );
        })}
      </ol>
      <p className="pnote mono" style={{ fontSize: 10 }}>{shown.length > LIST_MAX ? `${LIST_MAX} OF ${shown.length} SHOWN` : `${shown.length} SHOWN`} · NEWEST FIRST</p>
    </>
  );
}

// ---------- the comm channels ----------

function ChannelsView({ ship, onRoute, onBack }: { ship: ShipView; onRoute: (r: Route) => void; onBack: () => void }) {
  const f = recordsFile(ship.data);
  const all = asks(ship.data);
  const ch = channels(all, f.asOf);
  const unknown = all.filter((o) => !o.surface).length;
  const kept = ch.reduce((n, c) => n + c.speed, 0);
  const total = ch.reduce((n, c) => n + c.all, 0);
  return (
    <>
      <ConHead icon={XO_ICONS.channels} title="Comm channels" back="‹ Routing table" onBack={onBack}
        sub={`WHERE YOUR ASKS COME IN · ${source(ship)}`} />
      <div className="con-body pbody">
        <Kpis items={[...ch.map((c) => ({ n: c.week as number | string, label: `${up(surfaceWord(c.id))} · LAST 7 DAYS` })), { n: `${kept}/${total}`, label: 'KEPT A SPEED WORD' }]} />
        <ul className="prows">
          {ch.map((c) => (
            <li key={c.id}>
              <button type="button" className="prow" style={css({ '--pc': SURFACE_COLOUR[c.id] })} onClick={() => onRoute({ surface: c.id, station: null })}>
                <span className="pr-text">{surfaceWord(c.id)}</span>
                <span className="pr-when mono">{c.all} ON FILE · {c.week} THIS WEEK</span>
                <span className="pr-why">
                  {c.speed} of {c.all} kept a speed word. {c.card} filed a card, {c.chat} answered in chat
                  {c.all - c.card - c.chat > 0 ? `, ${c.all - c.card - c.chat} don't say` : ''}.
                </span>
              </button>
            </li>
          ))}
        </ul>
        {unknown > 0 && <p className="pnote">{unknown} older asks don't say which surface they came from.</p>}
        <p className="pnote">
          A speed word at the very start ("Warp:", "Half impulse,") should be stored with the order. A surface that keeps fewer than
          you typed means the arrival hook missed them there; Engineering's brief B2-32 (patch AG) is about that.
        </p>
      </div>
    </>
  );
}

// ---------- the fast path ----------

function FastPathView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const crew = ship.data.stations.stations.filter((s) => s.aliases.length && s.id !== 'captain')
    .sort((a, b) => (RANK[a.rank]?.order ?? 99) - (RANK[b.rank]?.order ?? 99) || a.name.localeCompare(b.name));
  return (
    <>
      <ConHead icon={XO_ICONS.fastpath} title="The fast path" back="‹ Routing table" onBack={onBack}
        sub={`FIRST WORDS THAT GO STRAIGHT TO A STATION · ${crew.length} STATIONS BY NAME`} />
      <div className="con-body pbody">
        <ul className="prows">
          {FAST_WORDS.map((w) => (
            <li key={w.say}><div className="prow" style={css({ '--pc': 'var(--good)' })}>
              <span className="pr-text mono" style={{ fontSize: 13 }}>“{w.say}”</span>
              <span className="pr-when mono">→ {up(ship.station(w.to)?.name ?? w.to)} · IN CODE</span>
            </div></li>
          ))}
        </ul>
        <p className="pnote">Those go by code, word for word, before Number One reads them. Anything else, Number One matches to a station by these names:</p>
        <ul className="prows two">
          {crew.map((s) => (
            <li key={s.id}>
              <button type="button" className="prow" style={css({ '--pc': railColor(s.rail) })} onClick={() => onScreen({ view: 'station', id: s.id })}>
                <span className="pr-text">{s.name}</span>
                <span className="pr-when mono">{up(s.status === 'live' ? s.rail : s.status)}</span>
                <span className="pr-why">{s.aliases.map((a) => <span key={a} className="ppill">{a}</span>)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---------- the rail rules ----------

function RulesView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <ConHead icon={XO_ICONS.rules} title="Rail rules" back="‹ Routing table" onBack={onBack}
        sub="WHICH RAIL A JOB GOES TO · CHECKED IN ORDER · THE FIRST MATCH WINS" />
      <div className="con-body pbody">
        <p className="pnote">
          Design and research that ends in a styled deliverable go to Claude. Code and big-context analysis go to Codex. Anything internal,
          cheap, private or secret stays on local qwen. Number One holds the job state the whole time.
        </p>
        <ol className="prows">
          {RAIL_RULES.map((r) => (
            <li key={r.n}><div className="prow" style={css({ '--pc': r.rail === 'mixed' ? 'var(--text-label)' : railColor(r.rail) })}>
              <span className="pr-text">Rule {r.n} · {r.name}</span>
              <span className="pr-when mono">{up(r.rail === 'mixed' ? 'any rail' : r.rail)}</span>
              <span className="pr-why">{r.text}</span>
            </div></li>
          ))}
        </ol>
      </div>
    </>
  );
}

// ---------- a list of orders in one state ----------

function ListView({ ship, title, sub, icon, state, none, onOpen, onBack }: {
  ship: ShipView; title: string; sub: string; icon: string; state: 'awaiting-captain' | 'blocked'; none: string; onOpen: (id: string) => void; onBack: () => void;
}) {
  const list = records(ship.data).filter((o) => o.state === state);
  return (
    <>
      <ConHead icon={icon} title={`${title} · ${list.length}`} back="‹ Routing table" onBack={onBack} sub={sub} />
      <div className="con-body pbody">
        {list.length === 0 && <p className="pnote">{none}</p>}
        <ul className="prows">
          {list.map((o) => {
            const st = ship.station(o.station);
            return (
              <li key={o.id}>
                <button type="button" className={'prow' + (state === 'blocked' ? ' alert' : '')} style={css({ '--pc': state === 'blocked' ? 'var(--bad)' : 'var(--captain)' })}
                  onClick={() => onOpen(o.id)}>
                  <span className="pr-text">{o.id} · {o.title}</span>
                  <span className="pr-when mono">{up(st?.short ?? o.station)} · {up(dayAndTime(openedOf(o)))}</span>
                  <span className="pr-why">{o.detail ?? `Came in on ${surfaceWord(o.surface)}.`}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// ---------- where the orders went ----------

function StationsView({ ship, onRoute, onBack }: { ship: ShipView; onRoute: (r: Route) => void; onBack: () => void }) {
  const f = recordsFile(ship.data);
  const rows = destinations(asks(ship.data), f.asOf);
  const most = Math.max(1, ...rows.map((r) => r.all));
  return (
    <>
      <ConHead icon={XO_ICONS.stations} title="Where the orders went" back="‹ Routing table" onBack={onBack}
        sub={`${rows.length} STATIONS · ON FILE, THIS WEEK AND STILL OPEN · PICK ONE TO SEE ITS ASKS`} />
      <div className="con-body pbody">
        <ul className="pbars">
          {rows.map((r) => {
            const st = ship.station(r.id);
            return (
              <li key={r.id}>
                <button type="button" className="pbar-row" style={css({ '--pc': railColor(st?.rail ?? 'mixed') })} onClick={() => onRoute({ surface: null, station: r.id })}>
                  <span className="pb-label">{st?.short ?? r.id}</span>
                  <span className="pb-track"><b style={{ width: `${(r.all / most) * 100}%` }} /></span>
                  <span className="pb-v mono">{r.all} ON FILE · {r.week} THIS WEEK{r.open ? ` · ${r.open} OPEN` : ''}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// ---------- the briefing room ----------

function LoungeView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const list = minutes(ship.data);
  const name = (id: string) => ship.station(id)?.short ?? id;
  return (
    <>
      <ConHead icon={XO_ICONS.lounge} title="Briefing room" back="‹ Routing table" onBack={onBack}
        sub={`NUMBER ONE CHAIRS THE BRIEFINGS · ${list.length} MINUTED · NEWEST FIRST`} />
      <div className="con-body pbody">
        {list.length === 0 && <p className="pnote">No briefing has been minuted yet.</p>}
        <ol className="prows">
          {list.map((m) => (
            <li key={m.at + m.text}><div className="prow">
              <span className="pr-text">{m.text.replace(/^Briefing:\s*/, '')}</span>
              <span className="pr-when mono">{dayLine(m.at)} · {dayAndTime(m.at).split(' ')[1]}</span>
              <span className="pr-why">{m.attendees ? `At the table: ${m.attendees.map(name).join(', ')}. ` : ''}{m.outcome ?? ''}</span>
            </div></li>
          ))}
        </ol>
      </div>
    </>
  );
}
