// The Holodeck board (Deck 4): where the ship's own interface is worked on. The room is the
// hero, like the Captain's Quarters: the ship floats over the emitter as a hologram (pick a
// room on it), and the pattern buffer, the new-section console, the safety panel and the
// arch each open a view on the work screen in place. Around the room: the Holodeck crew,
// the build queue and the rails on the right, every room on the ship and the deck's orders
// below, the comm badge at the bottom. Drafts of new sections stay in this browser.
import { memo, useCallback, useEffect, useState } from 'react';
import art from '../../assets/holodeck.svg?raw';
import type { BoardId } from '../../lib/board';
import { BOARDS } from '../../lib/lookups';
import {
  ASSETS, PROJ, ROOM, SCREEN, SPOTS, loadDrafts, nextDraftId, overlaps, pct, saveDrafts, type Draft, type HoloObject,
} from '../../lib/holodeck';
import type { Drills, ShipView } from '../../lib/ship';
import { CommBadge } from '../CommBadge';
import { RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { Hologram, type Ghost } from './Hologram';
import { HoloScreen, type DraftFields, type Screen } from './HoloScreen';
import { CrewPanel, DeckOrders, QueuePanel, RegisterPanel } from './Panels';

interface Props {
  ship: ShipView;
  filter: RailFilter;
  drills: Drills;
  target: string | null;
  onTarget: (id: string) => void;
  onBoard: (b: BoardId) => void;
  onToast: (text: string) => void;
}

// The SVG is our own file, never fixture text, so it is safe to insert as markup.
const Art = memo(function Art() {
  return <div className="room-art-svg" dangerouslySetInnerHTML={{ __html: art }} />;
});

const VIEW_OF: Record<Exclude<HoloObject, 'bridge'>, Screen['view']> = {
  assets: 'assets', ship: 'ship', new: 'new', safety: 'safety', programs: 'programs',
};

export function HolodeckBoard({ ship, filter, drills, target, onTarget, onBoard, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const [drafts, setDraftsState] = useState<Draft[]>(loadDrafts);
  const [placing, setPlacing] = useState<{ fields: DraftFields; id?: string } | null>(null);
  const [hot, setHot] = useState<HoloObject | null>(null);
  const setDrafts = (d: Draft[]) => { setDraftsState(d); saveDrafts(d); };

  // Picking the same thing again puts the work screen back to ready.
  const show = useCallback((s: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(s) ? { view: 'ease' } : s)), []);
  const pickSpot = (o: HoloObject) => (o === 'bridge' ? onBoard('bridge') : show({ view: VIEW_OF[o] } as Screen));
  const openRoom = (id: string) => {
    if (drafts.some((d) => d.id === id)) { show({ view: 'draft', id }); return; }
    show({ view: 'room', id });
    if (ship.station(id)?.kind === 'station') onTarget(id);
  };

  // Esc while placing puts the draft back down where it was (or drops a new one).
  useEffect(() => {
    if (!placing) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setPlacing(null); onToast('Placing cancelled.'); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [placing, onToast]);

  const place = (g: Ghost) => {
    if (!placing) return;
    if (overlaps(g, drafts, placing.id)) { onToast('That spot is taken. Pick a free one on the deck.'); return; }
    const old = placing.id ? drafts.find((d) => d.id === placing.id) : undefined;
    const d: Draft = { ...placing.fields, ...g, id: old?.id ?? nextDraftId(drafts), at: old?.at ?? new Date().toISOString() };
    setDrafts(old ? drafts.map((x) => (x.id === d.id ? d : x)) : [d, ...drafts]);
    setPlacing(null);
    setScreen({ view: 'draft', id: d.id });
    onToast(old ? `${d.name} moved to deck ${d.deck}.` : `${d.name} drafted on deck ${d.deck}. Copy its brief for the crew.`);
  };
  const remove = (id: string) => {
    const d = drafts.find((x) => x.id === id);
    setDrafts(drafts.filter((x) => x.id !== id));
    setScreen({ view: 'ease' });
    onToast(`${d?.name ?? id} deleted from this browser.`);
  };

  const on = screen.view === 'room' || screen.view === 'draft' ? 'ship' : (Object.keys(VIEW_OF) as HoloObject[]).find((k) => VIEW_OF[k as keyof typeof VIEW_OF] === screen.view) ?? null;
  const picked = screen.view === 'room' || screen.view === 'draft' ? screen.id : null;
  const labels: Record<HoloObject, { name: string; meta?: string }> = {
    assets: { name: 'Pattern buffer', meta: `${ASSETS.length} ASSETS` },
    ship: { name: 'The ship', meta: 'PICK A ROOM' },
    new: { name: 'New section', meta: drafts.length ? `${drafts.length} DRAFTS` : 'SPIN ONE UP' },
    safety: { name: 'Safeties', meta: 'ON' },
    programs: { name: 'Programs', meta: `${BOARDS.filter((b) => b.built).length} OF ${BOARDS.length} BUILT` },
    bridge: { name: 'Exit', meta: 'TO THE BRIDGE' },
  };

  return (
    <div className="qgrid hgrid">
      <section className="room" aria-label="Holodeck">
        <div className="hero-top">
          <p className="mono hero-label">DECK 4 · THE HOLODECK · PICK A ROOM ON THE HOLOGRAM, OR SOMETHING IN THE ROOM</p>
          <p className="mono hero-label room-hint">{placing ? `PLACING ${placing.fields.name.toUpperCase()} · ESC CANCELS` : 'ESC RETURNS THE WORK SCREEN TO READY'}</p>
        </div>
        <div className="room-wrap">
          <div className="room-pic holo-pic" data-hot={hot ?? ''} data-on={on ?? ''}>
            <div className="room-art" aria-hidden="true"><Art /></div>
            {SPOTS.map(({ id, box: [x, y, w, h], label: [lx, ly] }) => (
              <button key={id} type="button" className={`spot hspot-${id}`} aria-pressed={on === id}
                aria-label={labels[id].meta ? `${labels[id].name}, ${labels[id].meta}` : labels[id].name}
                style={{ left: pct(x, ROOM.w), top: pct(y, ROOM.h), width: pct(w, ROOM.w), height: pct(h, ROOM.h) }}
                onPointerEnter={() => setHot(id)} onPointerLeave={() => setHot(null)}
                onFocus={() => setHot(id)} onBlur={() => setHot(null)}
                onClick={() => pickSpot(id)}>
                <span className="spot-label" style={{ left: pct(lx - x, w), top: pct(ly - y, h) }}>
                  <span className="spot-name">{labels[id].name}</span>
                  {labels[id].meta && <span className="spot-meta mono">{labels[id].meta}</span>}
                </span>
              </button>
            ))}
            <div className="holo-slot" style={{ left: pct(PROJ.x, ROOM.w), top: pct(PROJ.y, ROOM.h), width: pct(PROJ.w, ROOM.w), height: pct(PROJ.h, ROOM.h) }}>
              <Hologram ship={ship} drafts={drafts} picked={picked}
                placing={placing ? { w: placing.fields.w, short: (placing.fields.short || placing.fields.name).toUpperCase(), id: placing.id } : null}
                onPick={openRoom} onPlace={place} />
            </div>
          </div>
          <div className="wall-slot" style={{
            '--x': pct(SCREEN.x, ROOM.w), '--y': pct(SCREEN.y, ROOM.h), '--w': pct(SCREEN.w, ROOM.w), '--h': pct(SCREEN.h, ROOM.h),
          } as React.CSSProperties}>
            <HoloScreen ship={ship} screen={screen} drafts={drafts} assets={ASSETS} placing={!!placing}
              onScreen={setScreen} onBoard={onBoard} onToast={onToast} onDelete={remove}
              onPlace={(fields, id) => { setPlacing({ fields, id }); onToast('Now click a free spot on the hologram.'); }} />
          </div>
        </div>
      </section>
      <aside className="side qside">
        <CrewPanel ship={ship} picked={picked ?? undefined} onOpen={openRoom} />
        <QueuePanel ship={ship} drafts={drafts} picked={picked ?? undefined} onRoom={openRoom}
          onDraft={(id) => show({ view: 'draft', id })} onNew={() => setScreen({ view: 'new' })} />
        <RailsPanel ship={ship} drills={drills} compact />
      </aside>
      <div className="qbottom">
        <RegisterPanel ship={ship} filter={filter} assets={ASSETS} picked={picked ?? undefined} onOpen={openRoom} />
        <DeckOrders ship={ship} picked={picked ?? undefined} onOpen={openRoom} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}
