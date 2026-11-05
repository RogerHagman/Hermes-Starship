// A department's chain of command, shown in the console when you click a duty roster card
// (anywhere but a name). From the top: the Captain, Number One when the head answers to
// Number One, the head, then the rest by rank. The line at the bottom says who takes the
// department if the head goes off duty. Picking a name opens that station; Back returns here.
import { DEPTS, RANK, STATUS, railColor } from '../lib/lookups';
import { SHIP_MAP } from '../lib/shipmap';
import { nextInLine, type ShipView } from '../lib/ship';
import type { Station } from '../types';
import { Pips } from './Roster';
import { ConHead } from './ShipConsole';

const ICONS = SHIP_MAP.icons as Record<string, string>;

export function ChainOfCommand({ ship, dept, onPick, onBack }: {
  ship: ShipView; dept: string; onPick: (station: string) => void; onBack: () => void;
}) {
  const d = DEPTS.find((x) => x.id === dept);
  if (!d) return null;
  const members = ship.data.stations.stations
    .filter((s) => s.dept === d.id)
    .sort((a, b) => Number(!!b.head) - Number(!!a.head) || RANK[a.rank].order - RANK[b.rank].order);
  const head = members.find((s) => s.head);
  const captain = ship.station('captain');
  const xo = ship.station('xo');
  const acting = ship.acting[d.id];

  // The ladder: [station, how far it is indented, what it does here].
  const ladder: [Station, number, string][] = [];
  if (d.id === 'command') {
    for (const s of members) ladder.push([s, s.head ? 0 : s.id === 'xo' ? 1 : 2, s.head ? 'COMMANDS THE SHIP' : s.id === 'xo' ? 'SECOND IN COMMAND' : '']);
  } else {
    if (captain) ladder.push([captain, 0, 'COMMANDS THE SHIP']);
    if (xo && head?.answersTo?.startsWith('Number One')) ladder.push([xo, 1, 'RUNS THE BRIDGE']);
    for (const s of members) ladder.push([s, s.head ? 2 : 3, s.head ? 'HEAD' : '']);
  }

  const next = head && nextInLine(members, () => null);
  const cover = d.id === 'command'
    ? 'Number One takes the bridge when the Captain clocks out.'
    : acting === 'dark' ? `${head?.short} is off duty and nobody can act: ${d.name} is dark.`
    : acting ? `${head?.short} is off duty: ${ship.station(acting)?.short} has ${d.name}.`
    : next ? `If ${head?.short} goes off duty, ${next.short} (${RANK[next.rank].label}) takes ${d.name}.`
    : `If ${head?.short} goes off duty, nobody can act: ${d.name} goes dark.`;
  const onDuty = members.filter((s) => s.status === 'live' && !ship.off(s)).length;

  return (
    <section className="console chain-con" role="region" aria-label={`${d.name} chain of command`} style={{ '--c': d.uniform } as React.CSSProperties}>
      <ConHead icon={head ? ICONS[head.id] : undefined} title={d.name} back="‹ Watch" onBack={onBack}
        sub={`CHAIN OF COMMAND · ${onDuty} OF ${members.length} ON DUTY`} />
      <div className="con-body">
        <ol className="chain">
          {ladder.map(([s, level, role]) => {
            const off = ship.off(s);
            const tags = [role, acting === s.id ? 'ACTING HEAD' : '', off ? `OFF · ${off.toUpperCase()}` : '', s.status !== 'live' ? STATUS[s.status].label : '']
              .filter(Boolean);
            return (
              <li key={s.id} style={{ '--lvl': level } as React.CSSProperties}>
                <button type="button" className={'chain-row' + (off || s.status !== 'live' ? ' off' : '')} onClick={() => onPick(s.id)}
                  style={{ '--c': railColor(s.rail), borderLeftStyle: STATUS[s.status].line } as React.CSSProperties} title={`${s.name} · answers to ${s.answersTo ?? 'nobody'}`}>
                  <span className="chain-pips">{RANK[s.rank].officer ? <Pips rank={s.rank} /> : <span className="dot" />}</span>
                  <span className="chain-name">{s.short}</span>
                  <span className="chain-rank">{RANK[s.rank].label}</span>
                  <span className="chain-tags mono">{tags.join(' · ')}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="chain-cover">{cover}</p>
    </section>
  );
}
