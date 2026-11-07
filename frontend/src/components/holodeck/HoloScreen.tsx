// The Holodeck's work screen. It shows one view at a time, in place, like the wall screen in
// the Captain's Quarters: Ready (a summary), the ship deck by deck, one room, the pattern
// buffer (assets), the new-section console and its drafts, the programs (boards) and the
// safety protocols. Nothing here sends anything: drafts stay in this browser.
import { useMemo, useState } from 'react';
import pkg from '../../../package.json';
import { BOARDS, DECKS, DEPTS, RAIL, RANK, STATUS, railColor } from '../../lib/lookups';
import { OWN_BOARD, type BoardId } from '../../lib/board';
import { dayAndTime } from '../../lib/format';
import {
  ASSET_TEXT, HOLO_ICONS, PIPELINE, PROGRAMS, PROTOCOLS, draftBrief, type Asset, type Draft, type DraftRail,
} from '../../lib/holodeck';
import { SHIP_MAP } from '../../lib/shipmap';
import type { ShipView } from '../../lib/ship';
import type { Station } from '../../types';
import { ConHead, StationPills, stationColour, stationSub, useEscape } from '../ShipConsole';
import { StationArt, hasArt } from '../StationArt';
import { ReviewView } from './Review';
import { REVIEW_STATE, reviewCounts, reviewIsSample, reviewItems } from '../../lib/review';

export type Screen =
  | { view: 'ease' }
  | { view: 'ship' }
  | { view: 'room'; id: string }
  | { view: 'assets'; file?: string }
  | { view: 'new' }
  | { view: 'draft'; id: string }
  | { view: 'programs' }
  | { view: 'safety' }
  | { view: 'review'; branch?: string };

/** What a new section needs before it can be placed on the hologram. */
export type DraftFields = Pick<Draft, 'name' | 'short' | 'kind' | 'deck' | 'dept' | 'rail' | 'duty' | 'w'>;

interface Props {
  ship: ShipView;
  screen: Screen;
  drafts: Draft[];
  assets: Asset[];
  placing: boolean;
  onScreen: (s: Screen) => void;
  onBoard: (b: BoardId) => void;
  onPlace: (fields: DraftFields, id?: string) => void;
  onDelete: (id: string) => void;
  onToast: (text: string) => void;
}

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const PLACES = SHIP_MAP.places as Record<string, { x: number; y: number; w: number }>;
const ICONS = SHIP_MAP.icons as Record<string, string>;
const HOLO = 'var(--holo)';


export function HoloScreen(p: Props) {
  const { ship, screen, onScreen } = p;
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease' && !p.placing, back);
  let body: React.ReactNode;
  let colour = HOLO;
  switch (screen.view) {
    case 'ship': body = <DecksView ship={ship} drafts={p.drafts} onScreen={onScreen} onBack={back} />; break;
    case 'room': {
      const st = ship.station(screen.id);
      if (st) { colour = stationColour(st); body = <RoomView ship={ship} st={st} assets={p.assets} onBoard={p.onBoard} onScreen={onScreen} onBack={back} />; }
      break;
    }
    case 'assets': body = <AssetsView assets={p.assets} file={screen.file} onScreen={onScreen} onBack={back} />; break;
    case 'new': body = <NewView ship={ship} placing={p.placing} onPlace={p.onPlace} onBack={back} />; break;
    case 'draft': {
      const d = p.drafts.find((x) => x.id === screen.id);
      if (d) body = <DraftView ship={ship} d={d} placing={p.placing} onPlace={p.onPlace} onDelete={p.onDelete} onToast={p.onToast} onBack={back} />;
      break;
    }
    case 'programs': body = <ProgramsView onBoard={p.onBoard} onBack={back} />; break;
    case 'safety': body = <SafetyView onBack={back} />; break;
    case 'review': body = <ReviewView ship={ship} branch={screen.branch} onPick={(branch) => onScreen({ view: 'review', branch })} onBack={back} />; break;
  }
  if (!body) body = <Ready ship={ship} drafts={p.drafts} assets={p.assets} onScreen={onScreen} />;
  return (
    <section className="console wall holo-screen" role="region" aria-label="Work screen" style={css({ '--c': colour })}>
      {body}
    </section>
  );
}

// ---------- Ready: one tile per thing in the room ----------

function Ready({ ship, drafts, assets, onScreen }: { ship: ShipView; drafts: Draft[]; assets: Asset[]; onScreen: (s: Screen) => void }) {
  const rooms = ship.data.stations.stations.filter((s) => PLACES[s.id]);
  const notBuilt = rooms.filter((s) => s.kind === 'station' && s.status !== 'live');
  const built = BOARDS.filter((b) => b.built);
  const lead = leadOf(ship);
  const kb = assets.reduce((n, a) => n + a.kb, 0);
  const rv = reviewCounts(ship.data);
  const top = reviewItems(ship.data)[0];
  return (
    <>
      <ConHead icon={HOLO_ICONS.ease} title="Holodeck ready"
        sub={`PROGRAM · THE SHIP · V${pkg.version} · ${lead ? `${lead.short.toUpperCase()} LEADS THE DECK` : 'NOBODY CAN LEAD THE DECK'}`} />
      <div className="con-body">
        <div className="ease">
          <Tile icon="ship" label="EMITTER · THE SHIP" figure={String(rooms.length)} onClick={() => onScreen({ view: 'ship' })}
            text={`${rooms.length - notBuilt.length} rooms built, ${notBuilt.length} waiting for their crew.`} foot="8 DECKS · PICK A ROOM ON THE HOLOGRAM" />
          <Tile icon="assets" label="PATTERN BUFFER · ASSETS" figure={String(assets.length)} onClick={() => onScreen({ view: 'assets' })}
            text="Every picture the boards draw, and the generator that draws it." foot={`${kb} KB · FIXED SEEDS`} />
          <Tile icon="new" label="CONSOLE · NEW SECTION" figure={String(drafts.length)} onClick={() => onScreen(drafts[0] ? { view: 'draft', id: drafts[0].id } : { view: 'new' })}
            text={drafts[0] ? `Latest draft: ${drafts[0].name}, deck ${drafts[0].deck}.` : 'Spin up a new room and place it on the hologram.'}
            foot={drafts.length ? 'DRAFTS · THIS BROWSER ONLY' : 'NO DRAFTS YET'} />
          <Tile icon="programs" label="ARCH · PROGRAMS" figure={`${built.length}/${BOARDS.length}`} onClick={() => onScreen({ view: 'programs' })}
            text={`Boards built: ${built.map((b) => b.label).join(', ')}.`} foot={`NEXT · ${BOARDS.find((b) => !b.built)?.label.toUpperCase() ?? 'NONE'}`} />
          <Tile icon="safety" label="SAFETY PANEL · PROTOCOLS" figure="On" onClick={() => onScreen({ view: 'safety' })}
            text={PROTOCOLS[1]} foot={`${PROTOCOLS.length} PROTOCOLS · ${PIPELINE.length} BUILD STEPS`} />
          <Tile icon="review" label="REVIEW BAY · HOLO'S PRS" figure={String(rv.open)} onClick={() => onScreen({ view: 'review' })}
            text={top ? `${top.order ?? top.branch}: ${top.title}, ${REVIEW_STATE[top.state].label.toLowerCase()}.` : 'Nothing from the Holodeck Officer yet.'}
            foot={`${rv.ready} READY · ${rv.failed} FAILED · ${rv.building} BUILDING${reviewIsSample(ship.data) ? ' · SAMPLE' : ''}`} />
        </div>
      </div>
    </>
  );
}

/** Who leads the Holodeck department now: its head, or whoever acts for it. */
export function leadOf(ship: ShipView): Station | undefined {
  const head = ship.data.stations.stations.find((s) => s.dept === 'holo' && s.head);
  if (head && head.status === 'live' && !ship.off(head)) return head;
  const acting = ship.acting.holo;
  if (acting === 'dark') return undefined;
  if (acting) return ship.station(acting);
  // The head isn't aboard yet: the senior live officer of the department leads.
  return ship.data.stations.stations
    .filter((s) => s.dept === 'holo' && s.status === 'live' && !ship.off(s))
    .sort((a, b) => RANK[a.rank].order - RANK[b.rank].order)[0];
}

function Tile({ icon, label, figure, text, foot, onClick }: {
  icon: keyof typeof HOLO_ICONS; label: string; figure: string; text: string; foot: string; onClick: () => void;
}) {
  return (
    <button type="button" className="ease-tile" onClick={onClick}>
      <span className="ease-label mono"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={HOLO_ICONS[icon]} /></svg>{label}</span>
      <span className="ease-figure">{figure}</span>
      <span className="ease-text">{text}</span>
      <span className="ease-foot mono">{foot}</span>
    </button>
  );
}

// ---------- the ship, deck by deck ----------

function DecksView({ ship, drafts, onScreen, onBack }: { ship: ShipView; drafts: Draft[]; onScreen: (s: Screen) => void; onBack: () => void }) {
  const rooms = ship.data.stations.stations.filter((s) => PLACES[s.id]);
  return (
    <>
      <ConHead icon={HOLO_ICONS.ship} title="The ship, deck by deck" back="‹ Ready" onBack={onBack}
        sub={`${rooms.length} ROOMS · ${drafts.length} DRAFTS · PICK ONE TO OPEN IT`} />
      <div className="con-body">
        <ol className="decks">
          {DECKS.map((name, i) => {
            const deck = i + 1;
            const here = rooms.filter((s) => s.deck === deck).sort((a, b) => PLACES[a.id].y - PLACES[b.id].y || PLACES[a.id].x - PLACES[b.id].x);
            const mine = drafts.filter((d) => d.deck === deck);
            return (
              <li key={name} className="deck-row">
                <span className="deck-n mono">DECK {deck}</span>
                <span className="deck-name">{name}</span>
                <span className="deck-rooms">
                  {here.map((s) => (
                    <button key={s.id} type="button" className={'roomchip ' + (s.kind === 'place' ? 'place' : s.status)}
                      style={css({ '--c': stationColour(s) })} onClick={() => onScreen({ view: 'room', id: s.id })}>{s.short}</button>
                  ))}
                  {mine.map((d) => (
                    <button key={d.id} type="button" className="roomchip draft" onClick={() => onScreen({ view: 'draft', id: d.id })}>{d.short}</button>
                  ))}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

// ---------- one room ----------

function RoomView({ ship, st, assets, onBoard, onScreen, onBack }: {
  ship: ShipView; st: Station; assets: Asset[]; onBoard: (b: BoardId) => void; onScreen: (s: Screen) => void; onBack: () => void;
}) {
  const at = PLACES[st.id];
  const art = assets.find((a) => a.station === st.id);
  const own = OWN_BOARD[st.id];
  const board = own && BOARDS.find((b) => b.id === own);
  return (
    <>
      <ConHead icon={ICONS[st.id]} title={st.name} back="‹ Ready" onBack={onBack} sub={stationSub(st)} />
      <StationPills ship={ship} st={st} />
      <div className="con-body holo-room-body">
        {hasArt(st.id) && <StationArt ship={ship} st={st} />}
        <dl className="con-facts">
          <dt>{st.kind === 'place' ? 'PLACE' : 'DUTY'}</dt><dd>{st.duty}</dd>
          {at && <><dt>ON THE PLAN</dt><dd className="mono">x {at.x} · y {at.y} · width {at.w}</dd></>}
          <dt>ART</dt>
          <dd>{art
            ? <button type="button" className="linkish mono" onClick={() => onScreen({ view: 'assets', file: art.file })}>{art.file} · {art.kb} KB</button>
            : 'None yet.'}
          </dd>
          <dt>BOARD</dt>
          <dd>{board
            ? <button type="button" className="linkish" onClick={() => onBoard(board.id as BoardId)}>{board.label}, deck {board.deck}</button>
            : 'Not built yet. Its console opens on the Bridge.'}
          </dd>
        </dl>
      </div>
    </>
  );
}

// ---------- the pattern buffer ----------

const svgUrl = (text: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;

function AssetsView({ assets, file, onScreen, onBack }: { assets: Asset[]; file?: string; onScreen: (s: Screen) => void; onBack: () => void }) {
  const a = assets.find((x) => x.file === file);
  // Pictures go in as images, so their ids and styles stay apart from the page's.
  const urls = useMemo(() => Object.fromEntries(assets.map((x) => [x.file, svgUrl(ASSET_TEXT[x.file] ?? '')])), [assets]);
  return (
    <>
      <ConHead icon={HOLO_ICONS.assets} title={a ? a.file : 'Pattern buffer'} back={a ? '‹ All assets' : '‹ Ready'}
        onBack={a ? () => onScreen({ view: 'assets' }) : onBack}
        sub={a ? `${a.kb} KB · DRAWN BY ${a.generator.toUpperCase()}` : `${assets.length} ASSETS · SRC/ASSETS · PICK ONE`} />
      <div className="con-body">
        {a ? (
          <figure className="asset-big">
            <img src={urls[a.file]} alt={`${a.file}, full size`} />
            <figcaption className="mono">{a.station ? `STATION ART · ${a.station.toUpperCase()}` : 'BOARD ART'} · REBUILD WITH python3 frontend/{a.generator.split(' ')[0]}</figcaption>
          </figure>
        ) : (
          <ul className="asset-grid">
            {assets.map((x) => (
              <li key={x.file}>
                <button type="button" className="asset" onClick={() => onScreen({ view: 'assets', file: x.file })} title={x.generator}>
                  <img src={urls[x.file]} alt="" loading="lazy" />
                  <span className="asset-name mono">{x.file.replace(/^station-/, '').replace(/\.svg$/, '')}</span>
                  <span className="asset-kb mono">{x.kb} KB</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

// ---------- the new-section console ----------

const RAILS: DraftRail[] = ['local', 'codex', 'claude', 'mixed'];
const SIZES: [number, string][] = [[170, 'Small'], [200, 'Medium'], [240, 'Large']];

/** What the tile says: the short name given, or the name, or its last word when the name is long. */
export function shortName(f: Pick<DraftFields, 'name' | 'short'>): string {
  const name = f.name.trim();
  if (f.short.trim()) return f.short.trim().slice(0, 16);
  return (name.length <= 16 ? name : name.split(/\s+/).at(-1) ?? name).slice(0, 16);
}

function NewView({ ship, placing, onPlace, onBack }: {
  ship: ShipView; placing: boolean; onPlace: (f: DraftFields) => void; onBack: () => void;
}) {
  const [f, setF] = useState<DraftFields>({ name: '', short: '', kind: 'station', deck: 4, dept: 'holo', rail: 'claude', duty: '', w: 200 });
  const set = <K extends keyof DraftFields>(k: K, v: DraftFields[K]) => setF((o) => ({ ...o, [k]: v }));
  const ready = f.name.trim().length > 1;
  const taken = ship.data.stations.stations.some((s) => s.name.toLowerCase() === f.name.trim().toLowerCase());
  return (
    <>
      <ConHead icon={HOLO_ICONS.new} title="New section" back="‹ Ready" onBack={onBack}
        sub="SPIN UP A ROOM · PLACE IT ON THE HOLOGRAM · THIS BROWSER ONLY" />
      <form className="con-body holo-form" onSubmit={(e) => { e.preventDefault(); if (ready && !taken) onPlace({ ...f, name: f.name.trim(), short: shortName(f) }); }}>
        <label className="hf"><span className="mono">NAME</span>
          <input value={f.name} maxLength={40} placeholder="Stellar Observatory" onChange={(e) => set('name', e.target.value)} disabled={placing} />
        </label>
        <label className="hf"><span className="mono">ON THE TILE</span>
          <input value={f.short} maxLength={16} placeholder={shortName(f) || 'Observatory'} onChange={(e) => set('short', e.target.value)} disabled={placing} />
        </label>
        <fieldset className="hf"><legend className="mono">KIND</legend>
          <span className="seg-ctl">
            {(['station', 'place'] as const).map((k) => (
              <button key={k} type="button" className="chip" aria-pressed={f.kind === k} onClick={() => set('kind', k)} disabled={placing}>
                {k === 'station' ? 'Station (crewed)' : 'Place'}
              </button>
            ))}
          </span>
        </fieldset>
        <label className="hf"><span className="mono">DECK</span>
          <select value={f.deck} onChange={(e) => set('deck', Number(e.target.value))} disabled={placing}>
            {DECKS.map((d, i) => <option key={d} value={i + 1}>{i + 1} · {d}</option>)}
          </select>
        </label>
        <label className="hf"><span className="mono">DEPARTMENT</span>
          <select value={f.dept} onChange={(e) => set('dept', e.target.value)} disabled={placing}>
            {DEPTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <fieldset className="hf"><legend className="mono">SIZE</legend>
          <span className="seg-ctl">
            {SIZES.map(([w, label]) => (
              <button key={w} type="button" className="chip" aria-pressed={f.w === w} onClick={() => set('w', w)} disabled={placing}>{label}</button>
            ))}
          </span>
        </fieldset>
        <fieldset className="hf wide"><legend className="mono">RAIL</legend>
          <span className="seg-ctl">
            {RAILS.map((r) => (
              <button key={r} type="button" className="chip" aria-pressed={f.rail === r} style={css({ '--c': RAIL[r].color })}
                onClick={() => set('rail', r)} disabled={placing}><span className="dot" />{RAIL[r].legend}</button>
            ))}
          </span>
        </fieldset>
        <label className="hf wide"><span className="mono">WHAT IT IS FOR</span>
          <textarea rows={1} value={f.duty} maxLength={240} placeholder="One or two lines: its duty, like a station card." onChange={(e) => set('duty', e.target.value)} disabled={placing} />
        </label>
        <div className="wall-actions wide">
          {placing
            ? <span className="holo-placing mono">MOVE OVER THE HOLOGRAM AND CLICK A SPOT · ESC CANCELS</span>
            : <>
                <button type="submit" className="btn btn-gold" aria-disabled={!ready || taken}>Place on the hologram</button>
                <span className="con-hint">{taken ? 'A room with that name is on the ship already.' : 'The ship has the grid: pick a free spot on a deck.'}</span>
              </>}
        </div>
      </form>
    </>
  );
}

// ---------- one draft ----------

function DraftView({ ship, d, placing, onPlace, onDelete, onToast, onBack }: {
  ship: ShipView; d: Draft; placing: boolean; onPlace: (f: DraftFields, id?: string) => void; onDelete: (id: string) => void;
  onToast: (t: string) => void; onBack: () => void;
}) {
  const brief = draftBrief(d, ship.data.stations.stations);
  const copy = () => {
    const done = () => onToast('Brief copied. Paste it into a card for the Holodeck crew.');
    try { navigator.clipboard.writeText(brief).then(done, () => onToast('Could not copy here. Select the brief and copy it.')); }
    catch { onToast('Could not copy here. Select the brief and copy it.'); }
  };
  return (
    <>
      <ConHead icon={HOLO_ICONS.draft} title={d.name} back="‹ Ready" onBack={onBack}
        sub={`${d.id} · DECK ${d.deck} · ${DECKS[d.deck - 1].toUpperCase()} · DRAFTED ${dayAndTime(d.at).toUpperCase()}`} />
      <div className="con-pills">
        <span className="railpill" style={css({ '--c': railColor(d.rail) })}>{RAIL[d.rail].label}</span>
        <span className="railpill" style={css({ '--c': 'var(--holo)', borderStyle: 'dashed' })}>DRAFT</span>
        <span className="railpill" style={css({ '--c': 'var(--text-label)', borderStyle: STATUS.proposed.line })}>{d.kind === 'place' ? 'PLACE' : 'STATION'}</span>
      </div>
      <div className="con-body">
        <pre className="brief" aria-label="Brief for the Holodeck crew">{brief}</pre>
      </div>
      <div className="wall-actions">
        <button type="button" className="btn btn-gold" onClick={copy}>Copy brief</button>
        <button type="button" className="btn btn-ghost" disabled={placing} onClick={() => onPlace(d, d.id)}>{placing ? 'Placing…' : 'Move'}</button>
        <button type="button" className="btn btn-ghost" onClick={() => onDelete(d.id)}>Delete draft</button>
        <span className="con-hint">Kept in this browser. The crew builds it from the brief.</span>
      </div>
    </>
  );
}

// ---------- the arch: programs ----------

function ProgramsView({ onBoard, onBack }: { onBoard: (b: BoardId) => void; onBack: () => void }) {
  return (
    <>
      <ConHead icon={HOLO_ICONS.programs} title="Programs" back="‹ Ready" onBack={onBack}
        sub={`THE BOARDS · ${BOARDS.filter((b) => b.built).length} OF ${BOARDS.length} BUILT · A BUILT ONE OPENS`} />
      <div className="con-body">
        <ul className="programs">
          {BOARDS.map((b) => {
            const what = PROGRAMS.find((x) => x.id === b.id)?.what;
            return (
              <li key={b.id} className={'program' + (b.built ? ' built' : '')}>
                <span className="program-tag mono">{b.built ? `DECK ${b.deck}` : b.phase}</span>
                <span className="program-name">{b.label}</span>
                <span className="program-what">{what}</span>
                {b.built && b.id !== 'holodeck'
                  ? <button type="button" className="btn btn-ghost" onClick={() => onBoard(b.id as BoardId)}>Open</button>
                  : <span className="program-state mono">{b.id === 'holodeck' ? 'RUNNING' : 'NOT BUILT'}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// ---------- the safety panel ----------

function SafetyView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <ConHead icon={HOLO_ICONS.safety} title="Safety protocols" back="‹ Ready" onBack={onBack}
        sub="SAFETIES ON · EVERY NEW SECTION KEEPS THESE · ONLY YOU CHANGE THEM" />
      <div className="con-body">
        <ol className="standing protocols">
          {PROTOCOLS.map((p, i) => <li key={p}><span className="standing-n">{i + 1}</span><span>{p}</span></li>)}
        </ol>
        <table className="resets pipeline">
          <caption className="mono">BUILDING A SECTION</caption>
          <thead><tr><th>STEP</th><th>WHERE</th></tr></thead>
          <tbody>{PIPELINE.map((s) => <tr key={s.step}><td>{s.step}</td><td className="mono">{s.how}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}
