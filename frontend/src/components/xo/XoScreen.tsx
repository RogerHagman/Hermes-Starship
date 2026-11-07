// Number One's wall screen. One view at a time, in place: the routing fan (your channels in, the
// stations out; what you pick lists on the side console) and its second page, where a typed message
// shows where it would go; one order; the comm channels; the fast path (the coded first words, the
// station names, and a new fast path drafted as a card for the Chief Engineer); the rail rules; the
// hails; what was not done; the briefing minutes and Number One's card.
import { useState, type ReactNode } from 'react';
import { dayAndTime, dayLine } from '../../lib/format';
import { RANK, railColor } from '../../lib/lookups';
import { minutes, records, recordsFile } from '../../lib/computer';
import { openedOf } from '../../lib/post';
import type { ShipView } from '../../lib/ship';
import {
  FAST_RULES, FAST_WORDS, RAIL_RULES, SURFACE_COLOUR, TRY_THESE, XO_ICONS, asks, channels, fastCheck, fastPathBrief, fastTargets, routeOf, surfaceWord,
  type FastDraft, type Route,
} from '../../lib/xo';
import { Pager } from '../Pager';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';
import { RouteFan } from './RouteFan';
import { Kpis, OrderView, css, sourceWord, up } from '../post/Parts';

export type Screen =
  | { view: 'ease' } | { view: 'order'; id: string; from?: Screen } | { view: 'channels' } | { view: 'fastpath'; page?: number } | { view: 'rules' }
  | { view: 'hails' } | { view: 'blocked' } | { view: 'lounge' } | { view: 'station'; id: string } | { view: 'try' };

interface Props {
  ship: ShipView; screen: Screen; onScreen: (s: Screen) => void; route: Route; onRoute: (r: Route) => void; onToast: (text: string) => void;
}

export function XoScreen({ ship, screen, onScreen, route, onRoute, onToast }: Props) {
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease', screen.view === 'order' && screen.from ? () => onScreen(screen.from!) : back);
  const open = (from?: Screen) => (id: string) => onScreen({ view: 'order', id, from });
  let body: ReactNode;
  switch (screen.view) {
    case 'order': body = <OrderView ship={ship} id={screen.id} icon={XO_ICONS.order}
      back={screen.from ? '‹ Back' : '‹ Routing'} onBack={() => onScreen(screen.from ?? { view: 'ease' })} />; break;
    case 'channels': body = <ChannelsView ship={ship} onRoute={(r) => { onRoute(r); back(); }} onBack={back} />; break;
    case 'fastpath': body = <FastPathView ship={ship} page={screen.page ?? 0} onScreen={onScreen} onToast={onToast} onBack={back} />; break;
    case 'rules': body = <RulesView onBack={back} />; break;
    case 'hails': body = <ListView ship={ship} title="Hails · waiting for you" icon={XO_ICONS.hails} state="awaiting-captain"
      none="Nothing waits for you." onOpen={open(screen)} onBack={back}
      sub="CHECKPOINTS AND ANYTHING TIER 3 · NUMBER ONE HOLDS THEM UNTIL YOU ANSWER" />; break;
    case 'blocked': body = <ListView ship={ship} title="Not done · blocked" icon={XO_ICONS.blocked} state="blocked"
      none="Nothing is blocked." onOpen={open(screen)} onBack={back}
      sub="NUMBER ONE FAILS A TASK RATHER THAN DOING IT ITSELF · EACH ONE SAYS WHY" />; break;
    case 'lounge': body = <LoungeView ship={ship} onBack={back} />; break;
    case 'try': body = <TryView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) body = <StationDetail ship={ship} st={st} back="‹ Routing" onBack={back} here="xo" />;
      break;
    }
  }
  if (!body) {
    const f = recordsFile(ship.data);
    body = (
      <>
        <ConHead icon={XO_ICONS.ease} title="Routing"
          sub={`${asks(ship.data).length} ASKS ON FILE · PICK A STATION OR A CHANNEL, ITS ASKS LIST ON THE SIDE CONSOLE · ${source(ship)}`}>
          <RoutingPager page={0} onScreen={onScreen} />
        </ConHead>
        <RouteFan ship={ship} asOf={f.asOf} route={route} onRoute={onRoute}
          onHails={() => onScreen({ view: 'hails' })} onBlocked={() => onScreen({ view: 'blocked' })} />
      </>
    );
  }
  return (
    <section className="console wall post-screen" role="region" aria-label="Number One's screen" style={css({ '--c': 'var(--acc)' })}>
      {body}
    </section>
  );
}

const ROUTING_PAGES = ['The fan', 'Try a message'];
function RoutingPager({ page, onScreen }: { page: number; onScreen: (s: Screen) => void }) {
  return <Pager pages={ROUTING_PAGES} page={page} onPage={(i) => onScreen(i === 1 ? { view: 'try' } : { view: 'ease' })} />;
}

// ---------- where would this go? ----------

/** Type a message and see where it would go: the speed word, the fast path, Number One, the station. Nothing is sent. */
function TryView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const [text, setText] = useState('');
  const g = routeOf(text, ship.data.stations.stations);
  const typed = text.trim().length > 0;
  const pickId = g.coded?.to ?? g.named[0]?.id;
  const pick = pickId ? ship.station(pickId) : undefined;
  const names = g.named.map((n) => ship.station(n.id)?.short ?? n.id);
  const notLive = pick && pick.status !== 'live' ? `${pick.short} is ${pick.status} and not created yet, so Number One can't hand it there; it fails the task instead.` : '';
  const verdict = !typed ? 'Type a message, or pick one below. The board checks it by the same rules; nothing is sent.'
    : g.coded ? `Code files a card for ${pick?.name ?? g.coded.to} with your words unchanged. Number One only sends the receipt.`
    : g.named.length === 1 ? `Number One will most likely hand this to ${pick?.name}: your words name it ("${g.named[0].alias}"). It files the card; it never does the work itself.`
    : g.named.length > 1 ? `Your words name ${names.join(' and ')}. Number One picks the one that owns the ask and files the card; the board shows the first one named.`
    : 'No station is named, so Number One decides from the routing rules. If no station fits, it fails the task rather than doing it itself.';
  const steps: { label: string; value: string; sub: string; on: boolean; colour?: string }[] = [
    { label: 'SPEED WORD', value: g.speed ?? 'None', sub: g.speed ? 'READ FIRST, BEFORE THE COLON OR COMMA' : "THE STATION'S DEFAULT SPEED", on: !!g.speed },
    { label: 'FAST PATH', value: g.coded ? `“${g.coded.word}”` : 'No match', sub: g.coded ? `IN CODE · PATCH ${g.coded.patch}` : 'NOT A CODED FIRST WORD', on: !!g.coded, colour: 'var(--good)' },
    { label: 'NUMBER ONE', value: g.coded ? 'Receipt only' : names.length ? `Finds ${names.length === 1 ? names[0] : `${names.length} names`}` : 'Finds no name',
      sub: g.coded ? 'FILES NOTHING, DECIDES NOTHING' : names.length ? 'MATCHES THE STATION NAMES' : 'DECIDES FROM THE ROUTING RULES', on: typed && !g.coded, colour: '#3fc1a5' },
    { label: 'STATION', value: pick?.name ?? (typed ? 'Number One decides' : '—'), sub: pick ? `${up(pick.rail)} RAIL${pick.status !== 'live' ? ` · ${up(pick.status)}` : ''}` : typed ? 'BY THE RAIL RULES' : '',
      on: !!pick, colour: pick ? railColor(pick.rail) : undefined },
  ];
  return (
    <>
      <ConHead icon={XO_ICONS.ease} title="Routing · where would this go?" back="‹ Routing" onBack={onBack}
        sub="TYPE A MESSAGE · THE SAME RULES NUMBER ONE ROUTES BY · NOTHING IS SENT">
        <RoutingPager page={1} onScreen={onScreen} />
      </ConHead>
      <div className="con-body xtry">
        <label className="hf xtry-in"><span className="mono">YOUR MESSAGE</span>
          <input value={text} maxLength={300} placeholder="Warp: remind me at 21:00 to call the garage" onChange={(e) => setText(e.target.value)} />
        </label>
        <div className="xtry-try">
          <span className="mono">TRY</span>
          {TRY_THESE.map((t) => <button key={t} type="button" className="pchip" onClick={() => setText(t)}>{t}</button>)}
        </div>
        <ol className="xtry-path" aria-label="Where it goes">
          {steps.map((x) => (
            <li key={x.label} className={'xtry-step' + (x.on ? ' on' : '')} style={css({ '--pc': x.colour ?? 'var(--acc)' })}>
              <span className="xtry-label mono">{x.label}</span>
              <span className="xtry-value">{x.value}</span>
              <span className="xtry-sub mono">{x.sub}</span>
            </li>
          ))}
        </ol>
        <p className="xtry-verdict" role="status">{verdict}{notLive ? ` ${notLive}` : ''}</p>
        <p className="con-hint">The fast path is exact, because it is code. A name match is what Number One usually does; it reads the whole message and can pick another station.</p>
      </div>
    </>
  );
}

/** Where the records came from, for the line under each title. */
function source(ship: ShipView) {
  const f = recordsFile(ship.data);
  return sourceWord(f.synthetic, f.asOf).replace('SAMPLE', 'SAMPLE ORDERS');
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
      <ConHead icon={XO_ICONS.channels} title="Comm channels" back="‹ Routing" onBack={onBack}
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

const FAST_PAGES = ['First words', 'Station names', 'New fast path'];

/** The fast path, three pages: the first words that go by code, the names Number One matches, and a new fast path to draft. */
function FastPathView({ ship, page, onScreen, onToast, onBack }: {
  ship: ShipView; page: number; onScreen: (s: Screen) => void; onToast: (text: string) => void; onBack: () => void;
}) {
  const crew = ship.data.stations.stations.filter((s) => s.aliases.length && s.id !== 'captain')
    .sort((a, b) => (RANK[a.rank]?.order ?? 99) - (RANK[b.rank]?.order ?? 99) || a.name.localeCompare(b.name));
  const go = (n: number) => onScreen({ view: 'fastpath', page: n });
  const subs = [
    `FIRST WORDS THAT GO STRAIGHT TO A STATION · ${FAST_WORDS.length} IN CODE`,
    `ANYTHING ELSE, NUMBER ONE MATCHES BY THESE NAMES · ${crew.length} STATIONS`,
    'DRAFT ONE HERE · THE CHIEF ENGINEER CODES IT · YOU APPLY THE PATCH',
  ];
  return (
    <>
      <ConHead icon={XO_ICONS.fastpath} title="The fast path" back="‹ Routing" onBack={onBack} sub={subs[page]}>
        <Pager pages={FAST_PAGES} page={page} onPage={go} />
      </ConHead>
      {page === 0 && (
        <div className="con-body pbody xfp">
          <ul className="xfp-words">
            {FAST_WORDS.map((w) => (
              <li key={w.say} className="xfp-word" style={css({ '--pc': railColor(ship.station(w.to)?.rail ?? 'local') })}>
                <span className="xfp-say">“{w.say}”</span>
                <span className="xfp-arrow" aria-hidden="true">→</span>
                <span className="xfp-to">{ship.station(w.to)?.name ?? w.to}</span>
                <span className="xfp-eg">“{w.eg}” files a card for {ship.station(w.to)?.short ?? w.to}, word for word.</span>
                <span className="xfp-how mono">IN CODE · PATCH {w.patch}</span>
              </li>
            ))}
          </ul>
          <ol className="xfp-rules">
            {FAST_RULES.map((r, i) => <li key={i}><b className="mono">{i + 1}</b><span>{r}</span></li>)}
          </ol>
          <div className="wall-actions">
            <button type="button" className="btn btn-gold" onClick={() => go(2)}>New fast path</button>
            <button type="button" className="btn btn-ghost" onClick={() => go(1)}>Station names</button>
            <span className="con-hint">Anything without a fast path, Number One matches to a station by name.</span>
          </div>
        </div>
      )}
      {page === 1 && (
        <div className="con-body pbody">
          <ul className="prows tight xfp-names">
            {crew.map((s) => (
              <li key={s.id}>
                <button type="button" className="prow" style={css({ '--pc': railColor(s.rail) })} onClick={() => onScreen({ view: 'station', id: s.id })}>
                  <span className="pr-text">{s.short}</span>
                  <span className="pr-when mono">{up(s.status === 'live' ? s.rail : s.status)}</span>
                  <span className="pr-why">{s.aliases.map((a) => (a.startsWith('none')
                    ? <span key={a} className="pr-none">{a === 'none yet' ? 'no name yet' : a.replace(/^none,\s*/, '')}</span>
                    : <span key={a} className="ppill">{a}</span>))}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {page === 2 && <NewFastPath ship={ship} onToast={onToast} />}
    </>
  );
}

/** Draft a new fast path: the words, the station, what must not match. The card for the Chief Engineer builds as you type. */
function NewFastPath({ ship, onToast }: { ship: ShipView; onToast: (text: string) => void }) {
  const stations = ship.data.stations.stations;
  const targets = fastTargets(stations);
  const [d, setD] = useState<FastDraft>({ words: '', to: '', avoid: '' });
  const set = (k: keyof FastDraft) => (e: { target: { value: string } }) => setD((x) => ({ ...x, [k]: e.target.value }));
  const check = fastCheck(d, stations);
  const st = ship.station(d.to);
  const chief = ship.station('eng');
  const ready = check.stop.length === 0 && !!st;
  const card = ready && st ? fastPathBrief(d, st, chief) : '';
  const copy = () => {
    if (!card) return;
    const done = () => onToast(`Card copied. Paste it to Number One: it files it for ${chief?.short ?? 'Engineering'}.`);
    try { navigator.clipboard.writeText(card).then(done, () => onToast('Could not copy here. Select the card and copy it.')); }
    catch { onToast('Could not copy here. Select the card and copy it.'); }
  };
  return (
    <div className="con-body xfp-new">
      <form className="xfp-form" onSubmit={(e) => { e.preventDefault(); copy(); }}>
        <label className="hf"><span className="mono">FIRST WORDS</span>
          <input value={d.words} maxLength={80} placeholder="log meal, meal" onChange={set('words')} />
          <small className="con-hint">Commas between variants. Matched at the start, as whole words.</small>
        </label>
        <label className="hf"><span className="mono">GOES TO</span>
          <select value={d.to} onChange={set('to')}>
            <option value="">Pick a station</option>
            {targets.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.profile})</option>)}
          </select>
        </label>
        <label className="hf"><span className="mono">MUST NOT MATCH</span>
          <input value={d.avoid} maxLength={160} placeholder="the meal plan" onChange={set('avoid')} />
          <small className="con-hint">Optional. Messages that only mention the words.</small>
        </label>
        {(d.words || d.to) && (check.stop.length > 0 || check.note.length > 0) && (
          <ul className="xfp-check">
            {check.stop.map((t) => <li key={t} className="stop">{t}</li>)}
            {check.note.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
        <div className="wall-actions">
          <button type="submit" className="btn btn-gold" disabled={!ready}>Copy the card</button>
          <span className="con-hint">Paste it to Number One.</span>
        </div>
      </form>
      <pre className="xfp-draft" aria-label={`Card for ${chief?.short ?? 'Engineering'}`}>
        {card || `The card for ${chief?.name ?? 'the Chief Engineer'} shows here as you type: the goal, the context, the constraints and the tests.\n\nThe board only drafts. Number One files the card, ${chief?.short ?? 'Engineering'} writes the patch, and you apply it. From then on, Number One never sees those words first.`}
      </pre>
    </div>
  );
}

// ---------- the rail rules ----------

function RulesView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <ConHead icon={XO_ICONS.rules} title="Rail rules" back="‹ Routing" onBack={onBack}
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
      <ConHead icon={icon} title={`${title} · ${list.length}`} back="‹ Routing" onBack={onBack} sub={sub} />
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

// ---------- the briefing room ----------

function LoungeView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const list = minutes(ship.data);
  const name = (id: string) => ship.station(id)?.short ?? id;
  return (
    <>
      <ConHead icon={XO_ICONS.lounge} title="Briefing room" back="‹ Routing" onBack={onBack}
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
