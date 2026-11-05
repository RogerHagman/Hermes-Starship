// The Bridge board (Deck 1): the ship plan with its console, rails, hails, orders in flight,
// the duty roster, the ship's log and the comm badge. Picking anything shows it in the
// console under the saucer; picking it again puts the console back on the watch.
import { useCallback, useState } from 'react';
import type { Drills, ShipView } from '../lib/ship';
import type { ConsolePick } from './ShipConsole';
import { CommBadge } from './CommBadge';
import { HailsPanel, OrdersPanel, RailsPanel } from './Panels';
import { LogPanel, RosterPanel } from './Roster';
import { ShipPlan } from './ShipPlan';
import type { RailFilter } from './SideRail';

interface Props {
  ship: ShipView;
  filter: RailFilter;
  drills: Drills;
  target: string | null;
  onTarget: (id: string) => void;
  onToast: (text: string) => void;
  onQuarters: () => void;
  onRelieve: (id: string) => void;
}

export function BridgeBoard({ ship, filter, drills, target, onTarget, onToast, onQuarters, onRelieve }: Props) {
  const [open, setOpen] = useState<ConsolePick | null>(null);
  // `from`: where the card was opened from (the Captain's chair, or a chain of command), so
  // Back can return there.
  const openStation = (station: string, order?: string, from?: string) => {
    const same = open?.station === station && open?.order === order;
    setOpen(same ? null : { station, order, from });
    onTarget(station);
  };
  // A duty roster card: the department's chain of command. Clicking it again closes it.
  const openDept = (dept: string) => setOpen(open?.dept === dept ? null : { dept });
  const close = useCallback(() => setOpen(null), []);
  return (
    <div className="grid">
      <ShipPlan ship={ship} filter={filter} pick={open} onPick={openStation} onDept={openDept} onBack={close} onQuarters={onQuarters} onRelieve={onRelieve} />
      <aside className="side">
        <RailsPanel ship={ship} drills={drills} />
        <HailsPanel ship={ship} picked={open?.order} onOpen={openStation} />
        <OrdersPanel ship={ship} filter={filter} picked={open?.order} onOpen={openStation} />
      </aside>
      <RosterPanel ship={ship} filter={filter} picked={open?.station} pickedDept={open?.dept} onOpen={(id) => openStation(id)} onDept={openDept} />
      <LogPanel ship={ship} />
      <CommBadge ship={ship} target={target} onToast={onToast} />
    </div>
  );
}
