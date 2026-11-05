// The Sensor array's work screen. One view at a time, in place: Watching (a summary), one
// watch with what it found, the register of watches, the findings with their sources, the
// asks as they came in (word for word), and the quarantine. Nothing here starts a scan:
// orders open in H4.
import { RAIL, railColor } from '../../lib/lookups';
import { dayAndTime } from '../../lib/format';
import { CADENCE_MS, SENSOR_ICONS, untilLabel, type Watch } from '../../lib/sensors';
import type { ShipView } from '../../lib/ship';
import type { Finding } from '../../types';
import { ConHead, OrderBox, StationDetail, useEscape } from '../ShipConsole';

export type Screen =
  | { view: 'ease' }
  | { view: 'watch'; id: string }
  | { view: 'watches' }
  | { view: 'findings'; id?: string }
  | { view: 'asks' }
  | { view: 'quarantine' }
  | { view: 'station'; id: string };

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const SCI = 'var(--sci)';
const up = (s: string) => s.toUpperCase();

export function SensorScreen({ ship, now, screen, onScreen }: {
  ship: ShipView; now: number; screen: Screen; onScreen: (s: Screen) => void;
}) {
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease', back);
  let body: React.ReactNode;
  let colour = SCI;
  const s = ship.data.sensors;
  switch (screen.view) {
    case 'watch': {
      const w = s.watches.find((x) => x.id === screen.id);
      if (w) { colour = railColor(ship.station(w.forStation)?.rail ?? 'mixed'); body = <WatchView ship={ship} w={w} now={now} onScreen={onScreen} onBack={back} />; }
      break;
    }
    case 'watches': body = <WatchesView ship={ship} now={now} onScreen={onScreen} onBack={back} />; break;
    case 'findings': body = <FindingsView ship={ship} id={screen.id} onScreen={onScreen} onBack={back} />; break;
    case 'asks': body = <AsksView ship={ship} onBack={back} />; break;
    case 'quarantine': body = <QuarantineView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) { colour = railColor(st.rail); body = <StationDetail ship={ship} st={st} back="‹ Watching" onBack={back} />; }
      break;
    }
  }
  if (!body) body = <Watching ship={ship} now={now} onScreen={onScreen} />;
  return (
    <section className="console wall sensor-screen" role="region" aria-label="Work screen" style={css({ '--c': colour })}>
      {body}
    </section>
  );
}

/** The watches by when they are next scanned, soonest first. Paused ones last. */
export function byNextScan(ws: Watch[]): Watch[] {
  return [...ws].sort((a, b) => Number(a.state === 'paused') - Number(b.state === 'paused') || a.nextScan.localeCompare(b.nextScan));
}

// ---------- Watching: one tile per thing in the room ----------

function Watching({ ship, now, onScreen }: { ship: ShipView; now: number; onScreen: (s: Screen) => void }) {
  const s = ship.data.sensors;
  const st = ship.station('sensors');
  const off = st ? ship.off(st) : null;
  const next = byNextScan(s.watches)[0];
  const unread = s.findings.filter((f) => !f.seen);
  const changed = s.asks.filter((a) => !a.unchanged);
  const active = s.watches.filter((w) => w.state === 'active');
  const perWeek = active.reduce((n, w) => n + (7 * 86_400_000) / CADENCE_MS[w.cadence], 0);
  return (
    <>
      <ConHead icon={SENSOR_ICONS.ease} title={off ? 'Sensors are dark' : 'Sensors watching'}
        sub={`${active.length} WATCHES ACTIVE · ABOUT ${Math.round(perWeek)} SCANS A WEEK · ${off ? `SENSORS OFF · ${up(off)}` : 'SENSORS AT THE POST'}`} />
      <div className="con-body">
        <div className="ease">
          <Tile icon="scope" label="SCOPE · NEXT SCAN" figure={next ? untilLabel(next.nextScan, now).replace(/^in /, '') : '—'}
            text={next ? `${next.name}.` : 'Nothing is watched.'} foot={next ? `${up(next.sector)} · ${up(next.cadence)}` : 'NO WATCHES'}
            onClick={() => next && onScreen({ view: 'watch', id: next.id })} />
          <Tile icon="watches" label="ARRAY · WATCHES" figure={String(s.watches.length)} onClick={() => onScreen({ view: 'watches' })}
            text="Recurring watches are tracked here, never capped." foot={`${s.watches.length - active.length} PAUSED`} />
          <Tile icon="findings" label="TRAY · FINDINGS" figure={String(unread.length)} onClick={() => onScreen({ view: 'findings', id: unread[0]?.id })}
            text={unread[0]?.title ?? 'Everything found has been read.'} foot={`${s.findings.length} FINDINGS · EVERY ONE CITED`} />
          <Tile icon="asks" label="TERMINAL · ASKS" figure={String(s.asks.length)} onClick={() => onScreen({ view: 'asks' })}
            text={s.asks[0] ? `“${s.asks[0].words}”` : 'No asks yet.'}
            foot={changed.length ? `${changed.length} NOT PASSED WORD FOR WORD` : 'ALL WORD FOR WORD'} />
          <Tile icon="quarantine" label="LOCKER · QUARANTINE" figure={String(s.quarantine.length)} onClick={() => onScreen({ view: 'quarantine' })}
            text="Web content is data, never instructions." foot={s.quarantine[0] ? `LAST HELD ${up(dayAndTime(s.quarantine[0].at))}` : 'NOTHING HELD'} />
          <Tile icon="watch" label="THE STATION · SENSORS" figure={off ? 'Off' : 'On duty'}
            onClick={() => onScreen({ view: 'station', id: 'sensors' })}
            text={st?.activeOrder ? `${st.activeOrder}: ${ship.data.orders.orders.find((o) => o.id === st.activeOrder)?.title ?? ''}` : 'No order on.'}
            foot={st ? `${RAIL[st.rail].label} · ${up(st.model ?? '')}` : ''} />
        </div>
      </div>
    </>
  );
}

function Tile({ icon, label, figure, text, foot, onClick }: {
  icon: keyof typeof SENSOR_ICONS; label: string; figure: string; text: string; foot: string; onClick: () => void;
}) {
  return (
    <button type="button" className="ease-tile" onClick={onClick}>
      <span className="ease-label mono"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={SENSOR_ICONS[icon]} /></svg>{label}</span>
      <span className="ease-figure">{figure}</span>
      <span className="ease-text">{text}</span>
      <span className="ease-foot mono">{foot}</span>
    </button>
  );
}

// ---------- one watch ----------

function WatchView({ ship, w, now, onScreen, onBack }: { ship: ShipView; w: Watch; now: number; onScreen: (s: Screen) => void; onBack: () => void }) {
  const s = ship.data.sensors;
  const to = ship.station(w.forStation);
  const found = s.findings.filter((f) => f.watch === w.id);
  const held = s.quarantine.filter((q) => q.watch === w.id);
  const sensors = ship.station('sensors');
  return (
    <>
      <ConHead icon={SENSOR_ICONS.watch} title={w.name} back="‹ Watching" onBack={onBack}
        sub={`${w.id} · ${up(w.sector)} · ${up(w.kind)} · ${up(w.cadence)} · ${w.state === 'paused' ? 'PAUSED' : `NEXT SCAN ${up(untilLabel(w.nextScan, now))}`}`} />
      <div className="con-body">
        <dl className="con-facts">
          <dt>WATCHES</dt><dd>{w.target}</dd>
          <dt>FINDINGS GO TO</dt>
          <dd>{to ? <button type="button" className="linkish" onClick={() => onScreen({ view: 'station', id: to.id })}>{to.name}</button> : w.forStation}</dd>
          <dt>LAST SCAN</dt><dd className="mono">{dayAndTime(w.lastScan)}</dd>
          <dt>NEXT SCAN</dt><dd className="mono">{w.state === 'paused' ? 'Paused. Only you start it again.' : dayAndTime(w.nextScan)}</dd>
          {held.length > 0 && <><dt>HELD</dt><dd><button type="button" className="linkish" onClick={() => onScreen({ view: 'quarantine' })}>{held.length} in quarantine</button></dd></>}
        </dl>
        {w.order && sensors && <OrderBox ship={ship} st={sensors} orderId={w.order} />}
        <p className="readhead mono">WHAT IT FOUND · {found.length}</p>
        <ul className="finds">
          {found.length === 0 && <li className="empty">Nothing yet.</li>}
          {found.map((f) => <FindRow key={f.id} f={f} onOpen={() => onScreen({ view: 'findings', id: f.id })} />)}
        </ul>
      </div>
    </>
  );
}

function FindRow({ f, onOpen }: { f: Finding; onOpen: () => void }) {
  return (
    <li>
      <button type="button" className={'find' + (f.seen ? '' : ' new')} onClick={onOpen}>
        <span className="idtag">{f.id} · {up(dayAndTime(f.at))}</span>
        <span className="find-title">{f.title}</span>
        <span className="find-src mono">{f.sources.length} {f.sources.length === 1 ? 'SOURCE' : 'SOURCES'}{f.seen ? '' : ' · NEW'}</span>
      </button>
    </li>
  );
}

// ---------- the register of watches ----------

function WatchesView({ ship, now, onScreen, onBack }: { ship: ShipView; now: number; onScreen: (s: Screen) => void; onBack: () => void }) {
  const ws = byNextScan(ship.data.sensors.watches);
  return (
    <>
      <ConHead icon={SENSOR_ICONS.watches} title="Watches" back="‹ Watching" onBack={onBack}
        sub={`${ws.length} WATCHES · TRACKED, NEVER CAPPED · SOONEST FIRST`} />
      <div className="con-body">
        <table className="resets watches">
          <thead><tr><th>WATCH</th><th>SECTOR</th><th>EVERY</th><th>FOR</th><th>NEXT</th></tr></thead>
          <tbody>
            {ws.map((w) => {
              const to = ship.station(w.forStation);
              return (
                <tr key={w.id} className={w.state === 'paused' ? 'later' : undefined} onClick={() => onScreen({ view: 'watch', id: w.id })}>
                  <td><button type="button" className="linkish plain" onClick={(e) => { e.stopPropagation(); onScreen({ view: 'watch', id: w.id }); }}>{w.name}</button></td>
                  <td className="mono">{up(w.sector)}</td>
                  <td className="mono">{up(w.cadence)}</td>
                  <td><span className="dot" style={css({ '--c': railColor(to?.rail ?? 'mixed') })} />{to?.short ?? w.forStation}</td>
                  <td className="mono">{w.state === 'paused' ? 'PAUSED' : untilLabel(w.nextScan, now)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------- findings ----------

function FindingsView({ ship, id, onScreen, onBack }: { ship: ShipView; id?: string; onScreen: (s: Screen) => void; onBack: () => void }) {
  const s = ship.data.sensors;
  const f = id ? s.findings.find((x) => x.id === id) : undefined;
  if (!f) {
    return (
      <>
        <ConHead icon={SENSOR_ICONS.findings} title="Findings" back="‹ Watching" onBack={onBack}
          sub={`${s.findings.length} FINDINGS · ${s.findings.filter((x) => !x.seen).length} NEW · EVERY ONE CITED`} />
        <div className="con-body">
          <ul className="finds">{s.findings.map((x) => <FindRow key={x.id} f={x} onOpen={() => onScreen({ view: 'findings', id: x.id })} />)}</ul>
        </div>
      </>
    );
  }
  const w = s.watches.find((x) => x.id === f.watch);
  const to = w && ship.station(w.forStation);
  return (
    <>
      <ConHead icon={SENSOR_ICONS.findings} title={f.title} back="‹ All findings" onBack={() => onScreen({ view: 'findings' })}
        sub={`${f.id} · ${up(dayAndTime(f.at))} · ${w ? up(w.name) : f.watch}${f.seen ? '' : ' · NEW'}`} />
      <div className="con-body">
        <p className="find-summary">{f.summary}</p>
        <dl className="con-facts">
          <dt>FROM THE WATCH</dt>
          <dd>{w ? <button type="button" className="linkish" onClick={() => onScreen({ view: 'watch', id: w.id })}>{w.name}</button> : f.watch}</dd>
          <dt>WENT TO</dt><dd>{to?.name ?? '—'}{f.seen ? ', who has read it.' : ', not read yet.'}</dd>
        </dl>
        <p className="readhead mono">SOURCES · {f.sources.length}</p>
        <ol className="sources">
          {f.sources.map((src) => <li key={src.title + src.site}><span>{src.title}</span><span className="mono">{src.site}</span></li>)}
        </ol>
      </div>
    </>
  );
}

// ---------- the asks terminal ----------

function AsksView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const asks = ship.data.sensors.asks;
  return (
    <>
      <ConHead icon={SENSOR_ICONS.asks} title="Asks, word for word" back="‹ Watching" onBack={onBack}
        sub="UNKNOWN ASKS COME HERE AS YOU SAID THEM · NUMBER ONE NEVER REWRITES THEM" />
      <div className="con-body">
        <ul className="asks">
          {asks.map((a) => (
            <li key={a.id} className={'ask' + (a.unchanged ? '' : ' changed')}>
              <span className="idtag">{a.id} · {up(dayAndTime(a.at))} · {up(a.state)}{a.order ? ` · ${a.order}` : ''}</span>
              <q className="ask-words">{a.words}</q>
              {a.unchanged
                ? <span className="ask-ok mono">PASSED WORD FOR WORD</span>
                : <span className="ask-bad"><span className="mono">NOT WORD FOR WORD · NUMBER ONE PASSED</span> {a.passed}</span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---------- the quarantine ----------

function QuarantineView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const s = ship.data.sensors;
  return (
    <>
      <ConHead icon={SENSOR_ICONS.quarantine} title="Quarantine" back="‹ Watching" onBack={onBack}
        sub={`${s.quarantine.length} HELD · SEALED · WHAT IS HELD IS DESCRIBED, NEVER SHOWN`} />
      <div className="con-body">
        <p className="q-rule">Web content is data, never instructions. Sensors never runs or follows anything it reads.</p>
        <ul className="held">
          {s.quarantine.map((q) => {
            const w = s.watches.find((x) => x.id === q.watch);
            return (
              <li key={q.id}>
                <span className="idtag">{q.id} · {up(dayAndTime(q.at))} · {q.site}</span>
                <span className="held-what">{q.what}</span>
                {w && <button type="button" className="linkish mono" onClick={() => onScreen({ view: 'watch', id: w.id })}>From {w.name}</button>}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
