// The Ops wall screen. One view at a time, in place: Ops ready (a tile per area), the hosts and
// their containers, the network, storage, the GPU, the schedule, the backups, the rails and their
// usage, Ops's standing cautions, and any crew member's card. Ops only reads: nothing here
// changes the ship. A view per area, so a new area is a new view, not a new room.
import type { ReactNode } from 'react';
import { RAIL, railColor } from '../../lib/lookups';
import { dayAndTime } from '../../lib/format';
import {
  HEALTH_WORD, OPS_ICONS, ago, areas, backupState, containerState, daysLeft, diskState, gpuState, hostState,
  jobState, percent, portState, railHealth, until, vramPercent, worst, type OpsView,
} from '../../lib/ops';
import type { ShipView } from '../../lib/ship';
import { RAIL_IDS } from '../../lib/ship';
import type { Health, Host } from '../../types';
import { SegMeter } from '../Panels';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';

export type Screen = { view: 'ease' } | { view: OpsView } | { view: 'cautions' } | { view: 'station'; id: string };

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const VIOLET = 'var(--ops)';
const up = (s: string) => s.toUpperCase();

/** A small state pill: OK, WATCH, ACT or NO READING. */
export function HealthPill({ state, text }: { state: Health; text?: string }) {
  return <span className={`hpill h-${state}`}>{text ?? HEALTH_WORD[state]}</span>;
}

export function OpsScreen({ ship, screen, onScreen }: { ship: ShipView; screen: Screen; onScreen: (s: Screen) => void }) {
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease', back);
  let body: ReactNode;
  let colour = VIOLET;
  switch (screen.view) {
    case 'nas': body = <HostsView ship={ship} onBack={back} />; break;
    case 'net': body = <NetView ship={ship} onBack={back} />; break;
    case 'storage': body = <StorageView ship={ship} onBack={back} />; break;
    case 'gpu': colour = railColor('local'); body = <GpuView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'schedule': body = <ScheduleView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'backups': body = <BackupsView ship={ship} onBack={back} />; break;
    case 'usage': body = <UsageView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'cautions': colour = 'var(--captain)'; body = <CautionsView ship={ship} onBack={back} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) { colour = railColor(st.rail); body = <StationDetail ship={ship} st={st} back="‹ Ops" onBack={back} here="ops" />; }
      break;
    }
  }
  if (!body) body = <Ready ship={ship} onScreen={onScreen} />;
  return (
    <section className="console wall ops-screen" role="region" aria-label="Ops screen" style={css({ '--c': colour })}>
      {body}
    </section>
  );
}

// ---------- Ops ready: one tile per area ----------

function Ready({ ship, onScreen }: { ship: ShipView; onScreen: (s: Screen) => void }) {
  const o = ship.data.ops;
  const all = areas(ship);
  const of = (id: OpsView) => all.find((a) => a.id === id)!;
  const st = (id: OpsView) => worst(of(id).checks.map((c) => c.state));
  const looks = (id: OpsView) => of(id).checks.filter((c) => c.state !== 'ok');
  const sub = (id: OpsView, fallback: string) => {
    const l = looks(id);
    return l.length ? `${l[0].label}: ${l[0].text}.${l.length > 1 ? ` And ${l.length - 1} more.` : ''}` : fallback;
  };
  const nas = o.hosts.find((h) => h.id === 'nas');
  const ops = ship.station('ops');
  const flagged = all.flatMap((a) => a.checks).filter((c) => c.state !== 'ok').length;
  return (
    <>
      <ConHead icon={OPS_ICONS.ease} title={flagged ? 'Ops · some things need a look' : 'Ops · all checks OK'}
        sub={`${all.reduce((n, a) => n + a.checks.length, 0)} CHECKS · ${flagged} NEED A LOOK · READ ${up(dayAndTime(o.asOf))}${o.synthetic ? ' · SAMPLE' : ''}`} />
      <div className="con-body">
        <div className="ease ops-ease">
          <Tile icon="nas" label="HOSTS · CONTAINERS" state={st('nas')} onClick={() => onScreen({ view: 'nas' })}
            figure={nas?.ram ? `${percent(nas.ram.usedGb, nas.ram.totalGb)}%` : '—'}
            text={sub('nas', `NAS memory. ${o.containers.filter((c) => c.state === 'running').length} of ${o.containers.length} containers running.`)} />
          <Tile icon="net" label="NETWORK" state={st('net')} onClick={() => onScreen({ view: 'net' })}
            figure={`${o.network.devices.filter((d) => d.state === 'ok').length}/${o.network.devices.length}`}
            text={sub('net', `Devices answering. Internet ${o.network.internet.downMbps ?? '?'} Mbit/s down.`)} />
          <Tile icon="storage" label="STORAGE" state={st('storage')} onClick={() => onScreen({ view: 'storage' })}
            figure={`${Math.max(...o.disks.map((d) => percent(d.usedGb, d.totalGb)))}%`}
            text={sub('storage', 'The fullest disk.')} />
          <Tile icon="gpu" label="GPU · OLLAMA" state={st('gpu')} onClick={() => onScreen({ view: 'gpu' })}
            figure={vramPercent(ship) !== null ? `${vramPercent(ship)}%` : '—'}
            text={`VRAM in use. ${o.gpu.models.map((m) => m.name).join(', ') || 'No model loaded'}.`} />
          <Tile icon="schedule" label="SCHEDULE" state={st('schedule')} onClick={() => onScreen({ view: 'schedule' })}
            figure={String(o.jobs.length)} text={sub('schedule', 'Jobs, all fine on their last run.')} />
          <Tile icon="backups" label="BACKUPS" state={st('backups')} onClick={() => onScreen({ view: 'backups' })}
            figure={String(o.backups.length)} text={sub('backups', 'Copies, all fresh and read back.')} />
          <Tile icon="usage" label="RAILS · USAGE" state={st('usage')} onClick={() => onScreen({ view: 'usage' })}
            figure={`${RAIL_IDS.filter((r) => ship.rail(r) !== 'out').length}/3`}
            text={RAIL_IDS.map((r) => `${RAIL[r].label} ${ship.rail(r)}`).join(', ') + '.'} />
          <Tile icon="cautions" label="STANDING CAUTIONS" onClick={() => onScreen({ view: 'cautions' })}
            figure={String(o.cautions.length)} text={o.cautions[0]?.text ?? 'None.'} />
          <Tile icon="ops" label="OPS CONSOLE" state={ops && ship.off(ops) ? 'warn' : 'ok'} onClick={() => onScreen({ view: 'station', id: 'ops' })}
            figure={ops && ship.off(ops) ? 'Off' : 'On'}
            text={ops?.activeOrder ? `${ops.activeOrder}: ${ship.data.orders.orders.find((x) => x.id === ops.activeOrder)?.title ?? ''}` : 'No order on. Ops reads and reports.'} />
        </div>
      </div>
    </>
  );
}

/** A tile on Ops ready. Without a state it has no pill (the cautions are not a check). */
function Tile({ icon, label, figure, text, state, onClick }: {
  icon: keyof typeof OPS_ICONS; label: string; figure: string; text: string; state?: Health; onClick: () => void;
}) {
  return (
    <button type="button" className={`ease-tile ops-tile t-${state ?? 'none'}`} onClick={onClick}>
      <span className="ease-label mono"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={OPS_ICONS[icon]} /></svg>{label}</span>
      <span className="ease-figure">{figure}{state && <HealthPill state={state} />}</span>
      <span className="ease-text">{text}</span>
    </button>
  );
}

/** A labelled bar: what it is, the share, and the words after it. */
function Bar({ label, value, text }: { label: string; value: number; text: string }) {
  return (
    <span className="meter ops-meter">
      <span className="meter-label">{up(label)}</span>
      <SegMeter value={value} label={label} />
      <span className="meter-val">{text}</span>
    </span>
  );
}

// ---------- hosts and their containers ----------

function HostsView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const o = ship.data.ops;
  return (
    <>
      <ConHead icon={OPS_ICONS.nas} title="Hosts and containers" back="‹ Ops" onBack={onBack}
        sub={`${o.hosts.length} HOSTS · ${o.containers.length} CONTAINERS · ${o.containers.filter((c) => c.state === 'running').length} RUNNING`} />
      <div className="con-body">
        {o.hosts.map((h) => <HostCard key={h.id} ship={ship} h={h} />)}
      </div>
    </>
  );
}

function HostCard({ ship, h }: { ship: ShipView; h: Host }) {
  const o = ship.data.ops;
  const mine = o.containers.filter((c) => c.host === h.id);
  return (
    <div className={`ops-card s-${hostState(h)}`}>
      <span className="ops-card-head">
        <span className="ops-card-name">{h.name}</span>
        <HealthPill state={hostState(h)} />
        <span className="ops-card-meta mono">
          {h.uptimeH !== undefined ? `UP ${h.uptimeH >= 48 ? `${Math.round(h.uptimeH / 24)} DAYS` : `${h.uptimeH} H`}` : ''}
          {h.tempC !== undefined ? ` · ${h.tempC} °C` : ''} · SEEN {up(ago(o.asOf, h.seenAt))}
        </span>
      </span>
      <span className="ops-card-sub">{h.role}</span>
      {h.cpuPct !== undefined && <Bar label="CPU" value={h.cpuPct} text={`${h.cpuPct}%`} />}
      {h.ram && <Bar label="Memory" value={percent(h.ram.usedGb, h.ram.totalGb)} text={`${h.ram.usedGb} / ${h.ram.totalGb} GB`} />}
      {h.swap && <Bar label="Swap" value={percent(h.swap.usedGb, h.swap.totalGb)} text={`${h.swap.usedGb} / ${h.swap.totalGb} GB`} />}
      {mine.length > 0 && (
        <ul className="ops-rows">
          {mine.map((c) => (
            <li key={c.name} className={`ops-row s-${containerState(c)}`}>
              <span className="ops-row-name mono">{c.name}</span>
              <span className="ops-row-what">{c.image} · {c.state}{c.restarts ? ` · ${c.restarts} ${c.restarts === 1 ? 'restart' : 'restarts'}` : ''}</span>
              <span className="ops-row-fig mono">{c.limitMb ? `${c.memMb} / ${c.limitMb} MB` : `${c.memMb} MB`}</span>
              <HealthPill state={containerState(c)} />
              {c.note && <span className="ops-row-note">{c.note}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------- the network ----------

function NetView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const o = ship.data.ops;
  const n = o.network;
  const host = (id: string) => o.hosts.find((h) => h.id === id)?.name ?? id;
  return (
    <>
      <ConHead icon={OPS_ICONS.net} title="The network" back="‹ Ops" onBack={onBack}
        sub={`${n.devices.length} DEVICES · ${n.links.length} LINKS OUT · ${n.ports.length} PORTS OPEN`} />
      <div className="con-body">
        <p className={`ops-line s-${n.internet.state}`}>
          <HealthPill state={n.internet.state} /> Internet{n.internet.downMbps ? `: ${n.internet.downMbps} Mbit/s down, ${n.internet.upMbps ?? '?'} up` : ''}.
          <span className="mono"> CHECKED {up(ago(o.asOf, n.internet.checkedAt))}</span>
        </p>
        <p className="readhead mono">ON THE LAN</p>
        <ul className="ops-rows">
          {n.devices.map((d) => (
            <li key={d.id} className={`ops-row s-${d.state}`}>
              <span className="ops-row-name">{d.name}</span>
              <span className="ops-row-what">{d.link}{d.note ? ` · ${d.note}` : ''}</span>
              <span className="ops-row-fig mono">{d.latencyMs !== undefined ? `${d.latencyMs} MS` : '—'}</span>
              <HealthPill state={d.state} />
            </li>
          ))}
        </ul>
        <p className="readhead mono">LINKS OUT · WHAT THE SHIP REACHES</p>
        <ul className="ops-rows">
          {n.links.map((l) => (
            <li key={l.id} className={`ops-row s-${l.state}`}>
              <span className="ops-row-name">{l.name}</span>
              <span className="ops-row-what">{l.for}</span>
              <span className="ops-row-fig mono">{up(ago(o.asOf, l.checkedAt))}</span>
              <HealthPill state={l.state} />
            </li>
          ))}
        </ul>
        <p className="readhead mono">PORTS OPEN · WHO CAN SIGN IN</p>
        <ul className="ops-rows">
          {n.ports.map((p) => (
            <li key={p.port} className={`ops-row s-${portState(p)}`}>
              <span className="ops-row-name mono">:{p.port}</span>
              <span className="ops-row-what">{p.service} on {host(p.host)} · sign-in: {p.signIn}</span>
              <span className="ops-row-fig mono">{p.reach === 'lan' ? 'LAN ONLY' : up(p.reach)}</span>
              <HealthPill state={portState(p)} />
              {p.note && <span className="ops-row-note">{p.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---------- storage ----------

function StorageView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const o = ship.data.ops;
  const host = (id: string) => o.hosts.find((h) => h.id === id)?.name ?? id;
  return (
    <>
      <ConHead icon={OPS_ICONS.storage} title="Storage" back="‹ Ops" onBack={onBack}
        sub={`${o.disks.length} DISKS · 80% FULL IS WATCH, 90% IS ACT`} />
      <div className="con-body">
        {o.disks.map((d) => {
          const left = daysLeft(d);
          return (
            <div key={d.id} className={`ops-card s-${diskState(d)}`}>
              <span className="ops-card-head">
                <span className="ops-card-name">{d.label}</span>
                <HealthPill state={diskState(d)} />
                <span className="ops-card-meta mono">{d.id} · {up(host(d.host))} · {d.mount}</span>
              </span>
              <Bar label="Used" value={percent(d.usedGb, d.totalGb)} text={`${d.usedGb} / ${d.totalGb} GB`} />
              <span className="ops-card-sub">
                {left !== null ? `Fills by about ${d.perDayGb} GB a day: full in about ${left} days.` : 'Nobody has measured how fast it fills.'}
                {d.note ? ` ${d.note}` : ''}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ---------- the GPU and Ollama ----------

function GpuView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const o = ship.data.ops;
  const g = o.gpu;
  const v = vramPercent(ship);
  const load = ship.data.rails.rails.find((r) => r.id === 'local')?.meters.find((m) => m.id === 'gpu')?.percent;
  const crew = ship.data.stations.stations.filter((s) => s.kind === 'station' && s.status === 'live' && (s.needs ?? []).includes('local'));
  return (
    <>
      <ConHead icon={OPS_ICONS.gpu} title={`GPU · ${g.name}`} back="‹ Ops" onBack={onBack}
        sub={`ON THE ${up(o.hosts.find((h) => h.id === g.host)?.name ?? g.host)} · LOCAL RAIL ${up(ship.rail('local'))} · VRAM FROM THE RAILS`} />
      <div className="con-body">
        <div className={`ops-card s-${gpuState(ship)}`}>
          <span className="ops-card-head">
            <span className="ops-card-name">{g.vramGb} GB of VRAM</span>
            <HealthPill state={gpuState(ship)} />
            <span className="ops-card-meta mono">{g.tempC !== undefined ? `${g.tempC} °C` : ''}{g.powerW !== undefined ? ` · ${g.powerW} W` : ''}</span>
          </span>
          {v !== null && <Bar label="VRAM" value={v} text={`${((g.vramGb * v) / 100).toFixed(1)} / ${g.vramGb} GB`} />}
          {load !== undefined && <Bar label="GPU load" value={load} text={`${load}%`} />}
        </div>
        <p className="readhead mono">LOADED IN OLLAMA</p>
        <ul className="ops-rows">
          {g.models.map((m) => (
            <li key={m.name} className="ops-row s-ok">
              <span className="ops-row-name">{m.name}</span>
              <span className="ops-row-what">{m.until ? `Unloads in ${until(o.asOf, m.until)} if unused` : 'Stays loaded'}</span>
              <span className="ops-row-fig mono">{m.sizeGb} GB</span>
            </li>
          ))}
        </ul>
        <dl className="con-facts">
          <dt>RUNS ON IT</dt>
          <dd>{crew.map((s, i) => (
            <span key={s.id}>{i > 0 && ', '}<button type="button" className="linkish" onClick={() => onScreen({ view: 'station', id: s.id })}>{s.short}</button></span>
          ))}. When the local rail goes out, they go to quarters.</dd>
        </dl>
      </div>
    </>
  );
}

// ---------- the schedule ----------

function ScheduleView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const o = ship.data.ops;
  return (
    <>
      <ConHead icon={OPS_ICONS.schedule} title="The schedule" back="‹ Ops" onBack={onBack}
        sub={`${o.jobs.length} JOBS · ${o.jobs.filter((j) => j.last === 'failed').length} FAILED LAST TIME · SHIP'S TIME`} />
      <div className="con-body">
        <ul className="ops-rows">
          {o.jobs.map((j) => {
            const who = ship.station(j.owner);
            return (
              <li key={j.id} className={`ops-row two s-${jobState(j)}`}>
                <span className="ops-row-name">{j.name}</span>
                <span className="ops-row-what">
                  {j.every} · <button type="button" className="linkish" onClick={() => onScreen({ view: 'station', id: j.owner })}>{who?.short ?? j.owner}</button>
                  {j.backup && <> · <button type="button" className="linkish" onClick={() => onScreen({ view: 'backups' })}>{j.backup}</button></>}
                  {j.order && <> · {j.order}</>}
                </span>
                <span className="ops-row-fig mono">
                  {j.lastAt ? `${up(j.last)} ${up(ago(o.asOf, j.lastAt))}` : up(j.last)}{j.nextAt ? ` · NEXT IN ${up(until(o.asOf, j.nextAt))}` : ''}
                </span>
                <HealthPill state={jobState(j)} />
                {j.note && <span className="ops-row-note">{j.note}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// ---------- the backups ----------

function BackupsView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const o = ship.data.ops;
  return (
    <>
      <ConHead icon={OPS_ICONS.backups} title="Backup vault" back="‹ Ops" onBack={onBack}
        sub={`${o.backups.length} COPIES · A COPY COUNTS WHEN IT HAS BEEN READ BACK`} />
      <div className="con-body">
        <ul className="ops-rows">
          {o.backups.map((b) => {
            const s = backupState(b, o.asOf);
            return (
              <li key={b.id} className={`ops-row two s-${s}`}>
                <span className="ops-row-name">{b.what}</span>
                <span className="ops-row-what">{b.from} to {b.to} · keeps {b.keep.toLowerCase()}</span>
                <span className="ops-row-fig mono">
                  {up(ago(o.asOf, b.lastAt))}{b.sizeGb !== undefined ? ` · ${b.sizeGb} GB` : ''} · {b.verified === 'ok' ? 'READ BACK' : b.verified === 'never' ? 'NEVER READ BACK' : 'READ BACK FAILED'}
                </span>
                <HealthPill state={s} />
                {b.note && <span className="ops-row-note">{b.note}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// ---------- the rails and their usage ----------

function UsageView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const crew = ship.data.stations.stations.filter((s) => s.kind === 'station' && s.status === 'live');
  const live = !ship.data.rails.synthetic;
  return (
    <>
      <ConHead icon={OPS_ICONS.usage} title="The rails and their usage" back="‹ Ops" onBack={onBack}
        sub={`${RAIL_IDS.filter((r) => ship.rail(r) !== 'out').length} OF 3 UP · ${live ? 'LIVE FROM THE RAILS PROBE' : 'SAMPLE RAILS'} · ${up(dayAndTime(ship.data.rails.asOf))}`} />
      <div className="con-body">
        <ul className="core-rails">
          {ship.data.rails.rails.map((r) => {
            const state = ship.rail(r.id);
            const needs = crew.filter((s) => (s.needs ?? []).includes(r.id));
            return (
              <li key={r.id} className={'core-rail ' + state} style={css({ '--c': railColor(r.id) })}>
                <span className="core-rail-name">{r.label}<HealthPill state={railHealth(state)} text={up(state)} /></span>
                <span className="core-rail-sub">{r.engine}{r.note ? ` · ${r.note}` : ''}</span>
                {r.meters.map((m) => <Bar key={m.id} label={m.label} value={m.percent} text={`${m.percent}%`} />)}
                {r.burn?.active && <span className="core-rail-crew mono">BURN WINDOW OPEN UNTIL {up(dayAndTime(r.burn.until ?? ship.data.rails.asOf))}</span>}
                <span className="core-rail-crew mono">{needs.length} CREW RUN ON IT:{' '}
                  {needs.slice(0, 8).map((s, i) => (
                    <span key={s.id}>{i > 0 && ', '}<button type="button" className="linkish mono" onClick={() => onScreen({ view: 'station', id: s.id })}>{up(s.short)}</button></span>
                  ))}{needs.length > 8 ? ` +${needs.length - 8}` : ''}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// ---------- standing cautions ----------

function CautionsView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const o = ship.data.ops;
  return (
    <>
      <ConHead icon={OPS_ICONS.cautions} title="Standing cautions" back="‹ Ops" onBack={onBack}
        sub={`${o.cautions.length} THINGS OPS WATCHES FOR · LEARNT THE HARD WAY`} />
      <div className="con-body">
        <ol className="cautions">
          {o.cautions.map((c) => (
            <li key={c.id}>
              <span className="caution-text">{c.text}</span>
              <span className="caution-why">{c.why}</span>
              <span className="caution-id mono">{c.id}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

