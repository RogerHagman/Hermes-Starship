// Main Engineering's work screen, the Chief's wall console. One view at a time, in place:
// Engineering ready (a summary), the warp core and the rails, the patch line, one patch,
// each engineer, the patch bay (the last check and the commands you run on the NAS), and the
// split-or-solo experiment on the test bench. Nothing here applies a patch: you do, by hand.
import { useState } from 'react';
import { RAIL, railColor } from '../../lib/lookups';
import { age, dayAndTime } from '../../lib/format';
import { ENG_ICONS, ENGINEERS, STAGES, armLine, byStage, inFlight, stageIndex, stageOf } from '../../lib/engineering';
import type { ShipView } from '../../lib/ship';
import { RAIL_IDS } from '../../lib/ship';
import type { Patch, Station } from '../../types';
import { SegMeter } from '../Panels';
import { ConHead, OrderBox, StationDetail, useEscape } from '../ShipConsole';

export type Screen =
  | { view: 'ease' }
  | { view: 'core' }
  | { view: 'line' }
  | { view: 'patch'; id: string }
  | { view: 'station'; id: string }
  | { view: 'bay' }
  | { view: 'bench' };

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const AMBER = 'var(--eng)';
const up = (s: string) => s.toUpperCase();

/** Who has Engineering now: the Chief, or whoever acts for the Chief, or nobody. */
export function inCharge(ship: ShipView): Station | undefined {
  const chief = ship.station('eng');
  if (chief && !ship.off(chief)) return chief;
  const acting = ship.acting.eng;
  return acting && acting !== 'dark' ? ship.station(acting) : undefined;
}

export function EngScreen({ ship, screen, onScreen, onToast }: {
  ship: ShipView; screen: Screen; onScreen: (s: Screen) => void; onToast: (t: string) => void;
}) {
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease', back);
  let body: React.ReactNode;
  let colour = AMBER;
  const e = ship.data.engineering;
  switch (screen.view) {
    case 'core': colour = railColor('local'); body = <CoreView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'line': body = <LineView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'patch': {
      const p = e.patches.find((x) => x.id === screen.id);
      if (p) { if (p.failed) colour = 'var(--bad)'; body = <PatchView ship={ship} p={p} onScreen={onScreen} onBack={() => onScreen({ view: 'line' })} />; }
      break;
    }
    case 'station': {
      const st = ship.station(screen.id);
      if (st) { colour = railColor(st.rail); body = <StationDetail ship={ship} st={st} back="‹ Engineering" onBack={back} here="engineering" />; }
      break;
    }
    case 'bay': body = <BayView ship={ship} onToast={onToast} onBack={back} />; break;
    case 'bench': body = <BenchView ship={ship} onScreen={onScreen} onBack={back} />; break;
  }
  if (!body) body = <Ready ship={ship} onScreen={onScreen} />;
  return (
    <section className="console wall eng-screen" role="region" aria-label="Work screen" style={css({ '--c': colour })}>
      {body}
    </section>
  );
}

// ---------- Engineering ready: one tile per thing in the room ----------

function Ready({ ship, onScreen }: { ship: ShipView; onScreen: (s: Screen) => void }) {
  const e = ship.data.engineering;
  const flying = inFlight(e.patches);
  const failed = e.patches.filter((p) => p.failed);
  const lead = inCharge(ship);
  const core = ship.rail('local');
  const local = ship.data.rails.rails.find((r) => r.id === 'local');
  const lower = ['sys', 'diag'].map((id) => ship.station(id)).filter((s): s is Station => !!s);
  const arms = e.experiment.arms;
  return (
    <>
      <ConHead icon={ENG_ICONS.ease} title={lead ? 'Engineering ready' : 'Engineering is dark'}
        sub={`${flying.length} PATCHES IN FLIGHT · ${failed.length} FAILED A CHECK · ${lead ? `${up(lead.short)} HAS ENGINEERING` : 'NOBODY HAS ENGINEERING'}`} />
      <div className="con-body">
        <div className="ease">
          <Tile icon="core" label="WARP CORE · LOCAL RAIL" figure={core === 'out' ? 'Out' : core === 'degraded' ? 'Low' : 'Up'}
            text={local ? `${local.engine}. ${local.note ?? ''}` : 'No reading.'} foot={RAIL_IDS.map((r) => `${up(RAIL[r].label)} ${up(ship.rail(r))}`).join(' · ')}
            onClick={() => onScreen({ view: 'core' })} />
          <Tile icon="line" label="TABLE · THE PATCH LINE" figure={String(flying.length)} onClick={() => onScreen({ view: 'line' })}
            text={flying[0] ? `${flying[0].id}: ${flying[0].title}, at ${stageOf(flying[0].stage).label.toLowerCase()}.` : 'Nothing in flight.'}
            foot={`${e.patches.length - flying.length} LIVE · BRIEF TO LIVE`} />
          <Tile icon="bay" label="PATCH BAY · LAST CHECK" figure={`${e.check.present}/${e.check.total}`} onClick={() => onScreen({ view: 'bay' })}
            text={e.check.note} foot={`CHECKED ${up(dayAndTime(e.check.at))} · ${e.commands.length} COMMANDS`} />
          <Tile icon="bench" label="TEST BENCH · EXPERIMENT" figure={e.experiment.verdict ? 'Called' : 'Running'} onClick={() => onScreen({ view: 'bench' })}
            text={e.experiment.question} foot={arms.map((a) => `${up(a.id)} ${a.runs} RUNS`).join(' · ')} />
          <Tile icon="chief" label="CHIEF'S CONSOLE" figure={!lead ? 'Nobody' : lead.id === 'eng' ? 'Chief' : lead.short} onClick={() => onScreen({ view: 'station', id: lead?.id ?? 'eng' })}
            text={lead?.activeOrder ? `${lead.activeOrder}: ${ship.data.orders.orders.find((o) => o.id === lead.activeOrder)?.title ?? ''}` : 'No order on.'}
            foot={lead && lead.id !== 'eng' ? 'ACTING FOR THE CHIEF' : 'HAS ENGINEERING'} />
          <Tile icon="systems" label="LOWER DECKS · DECK 8" figure={String(lower.filter((s) => !ship.off(s)).length)} onClick={() => onScreen({ view: 'station', id: 'sys' })}
            text={lower.map((s) => `${s.short}: ${s.activeOrder ?? 'no order'}`).join('. ') + '.'}
            foot={lower.map((s) => `${up(s.short)} ${ship.off(s) ? 'OFF' : 'ON'}`).join(' · ')} />
        </div>
      </div>
    </>
  );
}

function Tile({ icon, label, figure, text, foot, onClick }: {
  icon: keyof typeof ENG_ICONS; label: string; figure: string; text: string; foot: string; onClick: () => void;
}) {
  return (
    <button type="button" className="ease-tile" onClick={onClick}>
      <span className="ease-label mono"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={ENG_ICONS[icon]} /></svg>{label}</span>
      <span className="ease-figure">{figure}</span>
      <span className="ease-text">{text}</span>
      <span className="ease-foot mono">{foot}</span>
    </button>
  );
}

// ---------- the warp core and the rails ----------

function CoreView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const crew = ENGINEERS.map((id) => ship.station(id)).filter((s): s is Station => !!s);
  return (
    <>
      <ConHead icon={ENG_ICONS.core} title="Warp core and nacelles" back="‹ Engineering" onBack={onBack}
        sub={`THE CORE IS THE LOCAL RAIL · THE NACELLES ARE CODEX AND CLAUDE · ${railsLine(ship)}`} />
      <div className="con-body">
        <ul className="core-rails">
          {ship.data.rails.rails.map((r) => {
            const needs = crew.filter((s) => (s.needs ?? []).includes(r.id));
            const state = ship.rail(r.id);
            return (
              <li key={r.id} className={'core-rail ' + state} style={css({ '--c': railColor(r.id) })}>
                <span className="core-rail-name">{r.label}<span className={`state ${state}`}>{up(state)}</span></span>
                <span className="core-rail-sub">{r.engine}{r.note ? ` · ${r.note}` : ''}</span>
                {r.meters.map((m) => (
                  <span key={m.id} className="meter">
                    <span className="meter-label">{up(m.label)}</span>
                    <SegMeter value={m.percent} label={`${r.label} ${m.label}`} />
                    <span className="meter-val">{m.percent}%</span>
                  </span>
                ))}
                <span className="core-rail-crew mono">
                  {needs.length ? <>ENGINEERING ON IT: {needs.map((s, i) => (
                    <span key={s.id}>{i > 0 && ', '}<button type="button" className="linkish mono" onClick={() => onScreen({ view: 'station', id: s.id })}>{up(s.short)}</button></span>
                  ))}</> : 'NO ENGINEER NEEDS IT'}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function railsLine(ship: ShipView): string {
  const up = RAIL_IDS.filter((r) => ship.rail(r) !== 'out').length;
  return `${up} OF 3 UP`;
}

// ---------- the patch line ----------

function LineView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const e = ship.data.engineering;
  return (
    <>
      <ConHead icon={ENG_ICONS.line} title="The patch line" back="‹ Engineering" onBack={onBack}
        sub={`${e.patches.length} PATCHES · ${inFlight(e.patches).length} IN FLIGHT · PATCHES ONLY, YOU APPLY THEM`} />
      <div className="con-body">
        <ol className="stages">
          {STAGES.map((s) => {
            const here = byStage(e.patches).filter((p) => p.stage === s.id);
            const who = s.who === 'captain' ? 'You' : ship.station(s.who)?.short ?? s.who;
            return (
              <li key={s.id} className={'pstage' + (here.length ? '' : ' empty')}>
                <span className="stage-name mono">{s.label}</span>
                <span className="stage-who mono">{up(who)}</span>
                <span className="stage-does">{s.does}</span>
                <span className="stage-patches">
                  {here.map((p) => <PatchChip key={p.id} p={p} onOpen={() => onScreen({ view: 'patch', id: p.id })} />)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

export function PatchChip({ p, onOpen, picked }: { p: Patch; onOpen: () => void; picked?: boolean }) {
  return (
    <button type="button" className={'pchip' + (p.failed ? ' failed' : '') + (p.stage === 'live' ? ' live' : '')} aria-pressed={picked}
      aria-label={`${p.id}, ${p.title}${p.failed ? ', failed a check' : ''}`} title={p.title} onClick={onOpen}>
      <span className="mono">{p.id}</span>
    </button>
  );
}

// ---------- one patch ----------

function PatchView({ ship, p, onScreen, onBack }: { ship: ShipView; p: Patch; onScreen: (s: Screen) => void; onBack: () => void }) {
  const at = stageIndex(p.stage);
  const s = stageOf(p.stage);
  const holder = s.who === 'captain' ? undefined : ship.station(s.who);
  return (
    <>
      <ConHead icon={ENG_ICONS.patch} title={p.title} back="‹ The patch line" onBack={onBack}
        sub={`${p.id} · ${s.label}${p.failed ? ' · FAILED A CHECK' : ''} · ${up(age(ship.data.engineering.asOf, p.updatedAt))}`} />
      <div className="con-body">
        <ol className="pline" aria-label="Where it is on the line">
          {STAGES.map((x, i) => (
            <li key={x.id} className={(i < at ? 'done' : i === at ? (p.failed ? 'here failed' : 'here') : '')}><span className="mono">{x.label}</span></li>
          ))}
        </ol>
        <dl className="con-facts">
          <dt>WHY</dt><dd>{p.why}</dd>
          <dt>HELD BY</dt>
          <dd>{holder ? <button type="button" className="linkish" onClick={() => onScreen({ view: 'station', id: holder.id })}>{holder.name}</button> : 'You, the Captain.'} {s.does}</dd>
          {p.checks && <><dt>CHECKS</dt><dd className="mono">{p.checks.passed} OF {p.checks.total} PASS{p.failed ? ' · DIAGNOSTICS REPORTED THE REST' : ''}</dd></>}
          {p.files !== undefined && <><dt>FILES</dt><dd className="mono">{p.files}</dd></>}
          {p.stage === 'apply' || p.stage === 'review'
            ? <><dt>THEN</dt><dd><button type="button" className="linkish" onClick={() => onScreen({ view: 'bay' })}>The patch bay commands</button></dd></>
            : null}
        </dl>
        {(p.orders ?? []).map((id) => {
          const o = ship.data.orders.orders.find((x) => x.id === id);
          const st = o && ship.station(o.station);
          return st ? <OrderBox key={id} ship={ship} st={st} orderId={id} /> : null;
        })}
        {!p.orders?.length && <p className="con-text">No orders on it yet.</p>}
      </div>
    </>
  );
}

// ---------- the patch bay ----------

function BayView({ ship, onToast, onBack }: { ship: ShipView; onToast: (t: string) => void; onBack: () => void }) {
  const e = ship.data.engineering;
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (label: string, cmd: string) => {
    const done = () => { setCopied(label); onToast(`Copied: ${label}. Run it on the NAS.`); };
    try { navigator.clipboard.writeText(cmd).then(done, () => onToast('Could not copy here. Select the line instead.')); }
    catch { onToast('Could not copy here. Select the line instead.'); }
  };
  const all = e.check.present === e.check.total;
  return (
    <>
      <ConHead icon={ENG_ICONS.bay} title="Patch bay" back="‹ Engineering" onBack={onBack}
        sub={`LAST CHECK ${up(dayAndTime(e.check.at))} · ${e.check.present} OF ${e.check.total} PATCHES IN PLACE`} />
      <div className="con-body">
        <p className={'bay-check' + (all ? ' ok' : ' bad')}>
          <span className="mono">{all ? 'ALL IN PLACE' : `${e.check.total - e.check.present} MISSING`}</span> {e.check.note}
        </p>
        <p className="readhead mono">YOU RUN THESE ON THE NAS · NOTHING IS APPLIED LIVE BY A STATION</p>
        <ol className="cmds">
          {e.commands.map((c) => (
            <li key={c.label}>
              <span className="cmd-head"><span className="cmd-label">{c.label}</span><span className="cmd-when mono">{up(c.when.replace(/\.$/, ''))}</span></span>
              <code className="cmd">{c.cmd}</code>
              <button type="button" className="btn btn-ghost cmd-copy" onClick={() => copy(c.label, c.cmd)}>{copied === c.label ? 'Copied' : 'Copy'}</button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

// ---------- the test bench: split or solo ----------

function BenchView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: (s: Screen) => void; onBack: () => void }) {
  const x = ship.data.engineering.experiment;
  const most = Math.max(...x.arms.map((a) => a.minutes), 1);
  const plan = ship.data.engineering.patches.find((p) => /split or solo/i.test(p.title));
  return (
    <>
      <ConHead icon={ENG_ICONS.bench} title={x.name} back="‹ Engineering" onBack={onBack}
        sub={`${x.arms.reduce((n, a) => n + a.runs, 0)} RUNS SO FAR · ${x.verdict ? 'CALLED' : 'NO VERDICT YET'} · SAMPLE NUMBERS`} />
      <div className="con-body">
        <p className="find-summary">{x.question}</p>
        <p className="readhead mono">MINUTES A CARD · FEWER IS BETTER</p>
        <ul className="arms">
          {x.arms.map((a) => (
            <li key={a.id} className={'arm ' + a.id}>
              <span className="arm-label">{a.label}</span>
              <span className="arm-bar" aria-hidden="true"><b style={{ width: `${(a.minutes / most) * 100}%` }} /></span>
              <span className="arm-val mono">{a.minutes} MIN</span>
              <span className="arm-line mono">{up(armLine(a))}</span>
            </li>
          ))}
        </ul>
        <dl className="con-facts">
          <dt>VERDICT</dt><dd>{x.verdict ?? 'Not called yet. A few runs each is too few to trust; the Chief calls it when there are more.'}</dd>
          {plan && <><dt>ON THE LINE</dt><dd><button type="button" className="linkish" onClick={() => onScreen({ view: 'patch', id: plan.id })}>{plan.id}: {plan.title}</button></dd></>}
        </dl>
      </div>
    </>
  );
}
