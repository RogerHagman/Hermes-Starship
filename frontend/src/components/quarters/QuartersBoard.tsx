// The Captain's Quarters board (Deck 2). The room is the hero: pick the chair, the viewport,
// the log terminal, the Yeoman's PADD, the plaque or the shelf, and its view comes up on the
// wall screen in place. Around the room: hails, rails and the duty roster on the right,
// campaigns and the order log below, the comm badge at the bottom. Fixtures only.
import { useCallback, useState } from 'react';
import type { RoomObject } from '../../lib/quarters';
import type { Drills, ShipView } from '../../lib/ship';
import type { Order, YeomanItem } from '../../types';
import { CommBadge } from '../CommBadge';
import { HailsPanel, RailsPanel } from '../Panels';
import type { RailFilter } from '../SideRail';
import { CampaignsPanel, DutyPanel, OrderLog, type Scope } from './Panels';
import { Room, type SpotLabel } from './Room';
import { WallScreen, hailsOf, type Desk, type Screen } from './WallScreen';

interface Props {
  ship: ShipView;
  filter: RailFilter;
  drills: Drills;
  target: string | null;
  onTarget: (id: string) => void;
  onRelieve: (id: string) => void;
  onBridge: () => void;
  onToast: (text: string) => void;
}

const VIEWS: RoomObject[] = ['chair', 'viewport', 'log', 'yeoman', 'orders', 'reading'];

export function QuartersBoard({ ship, filter, drills, target, onTarget, onRelieve, onBridge, onToast }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'ease' });
  const [scope, setScope] = useState<Scope>({});
  const [entries, setEntries] = useState<Desk['entries']>([]);
  const [ticked, setTicked] = useState<ReadonlySet<string>>(new Set());
  const desk: Desk = { entries, ticked };
  const q = ship.data.quarters;
  const hails = hailsOf(ship);
  const burning = ship.data.rails.rails.some((r) => r.burn?.active && ship.rail(r.id) !== 'out');
  const on = (VIEWS as string[]).includes(screen.view) ? (screen.view as RoomObject) : null;

  // Picking the same thing again puts the wall screen back at ease.
  const show = useCallback((s: Screen) => setScreen((cur) => (JSON.stringify(cur) === JSON.stringify(s) ? { view: 'ease' } : s)), []);
  const pick = (o: RoomObject) => (o === 'bridge' ? onBridge() : show({ view: o } as Screen));
  const openOrder = (o: Order) => {
    show(o.state === 'awaiting-captain' ? { view: 'chair', hail: o.id } : { view: 'station', id: o.station, order: o.id });
    onTarget(o.station);
  };
  const log = (text: string) => {
    setEntries((e) => [{ at: new Date().toISOString(), text }, ...e]);
    onToast('Logged on this screen only. It is gone when you reload.');
  };
  const tick = (y: YeomanItem) => {
    const done = !ticked.has(y.id);
    setTicked((t) => { const n = new Set(t); if (done) n.add(y.id); else n.delete(y.id); return n; });
    onToast(done ? `Ticked "${y.text}" on this screen. The Yeoman hears it in H4.` : `"${y.text}" is open again.`);
  };

  const open = q.yeoman.filter((y) => !ticked.has(y.id)).length;
  const labels: Record<RoomObject, SpotLabel> = {
    chair: { name: 'The chair', meta: hails.length ? `${hails.length} HAILS` : 'ALL QUIET' },
    viewport: { name: 'Viewport', meta: burning ? 'BURN OPEN' : 'WINDOWS' },
    reading: { name: 'Bookshelf', meta: `${q.reading.read}/${q.reading.goal}` },
    orders: { name: 'Standing orders', meta: String(q.standingOrders.length) },
    log: { name: "Captain's log", meta: 'LOCAL ONLY' },
    yeoman: { name: 'Yeoman', meta: `${open} OPEN` },
    bridge: { name: 'To the Bridge', meta: 'DECK 1' },
  };

  return (
    <div className="qgrid">
      <Room ship={ship} on={on} labels={labels} onPick={pick}>
        <WallScreen ship={ship} screen={screen} desk={desk} onScreen={setScreen}
          onLog={log} onTick={tick} onRelieve={onRelieve} />
      </Room>
      <aside className="side qside">
        <HailsPanel ship={ship} picked={screen.view === 'chair' ? screen.hail ?? hails[0]?.id : undefined}
          help="Pick one to read it in full on the wall screen. Approve and Deny open in H4."
          onOpen={(station, order) => { show({ view: 'chair', hail: order }); onTarget(station); }} />
        <RailsPanel ship={ship} drills={drills} compact />
        <DutyPanel ship={ship} filter={filter} picked={screen.view === 'station' ? screen.id : undefined}
          onOpen={(id) => { show({ view: 'station', id }); onTarget(id); }} onRelieve={onRelieve} />
      </aside>
      <div className="qbottom">
        <CampaignsPanel ship={ship} scope={scope} onScope={setScope} />
        <OrderLog ship={ship} filter={filter} scope={scope} onScope={setScope}
          picked={screen.view === 'chair' ? screen.hail : screen.view === 'station' ? screen.order : undefined} onOpen={openOrder} />
      </div>
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}
