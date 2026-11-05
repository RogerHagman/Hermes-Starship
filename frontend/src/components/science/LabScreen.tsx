// The Science lab's work screen. One view at a time, in place: the lab at a glance, the model
// shelf and one model, the evals, one run with its log, every run, serving, the datasets, the
// study bench and one study track. Every number on it links to the run that measured it.
import { Fragment } from 'react';
import { railColor } from '../../lib/lookups';
import { dayAndTime } from '../../lib/format';
import { LAB_ICONS, RUN_KIND, bestBySuite, byNewest, modelName, modelOf, nextLesson, runOf, trackProgress } from '../../lib/science';
import type { ShipView } from '../../lib/ship';
import type { Run, StudyTrack } from '../../types';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';

export type Screen =
  | { view: 'ease' }
  | { view: 'models' }
  | { view: 'model'; id: string }
  | { view: 'evals' }
  | { view: 'runs' }
  | { view: 'run'; id: string }
  | { view: 'serving' }
  | { view: 'datasets' }
  | { view: 'study' }
  | { view: 'track'; id: string }
  | { view: 'station'; id: string };

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const LAB = 'var(--lab)';
const up = (s: string) => s.toUpperCase();
type Go = (s: Screen) => void;

/** A number and the run that measured it: the run id opens its log. */
export function Measured({ value, run, onScreen }: { value: string; run?: string; onScreen: Go }) {
  return (
    <span className="measured">
      <span className="measured-v">{value}</span>
      {run && <button type="button" className="runref mono" onClick={(e) => { e.stopPropagation(); onScreen({ view: 'run', id: run }); }}>{run}</button>}
    </span>
  );
}

export function LabScreen({ ship, screen, onScreen }: { ship: ShipView; screen: Screen; onScreen: Go }) {
  const back = () => onScreen({ view: 'ease' });
  useEscape(screen.view !== 'ease', back);
  let body: React.ReactNode;
  let colour = LAB;
  const s = ship.data.science;
  switch (screen.view) {
    case 'models': body = <ModelsView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'model': if (modelOf(s, screen.id)) body = <ModelView ship={ship} id={screen.id} onScreen={onScreen} onBack={() => onScreen({ view: 'models' })} />; break;
    case 'evals': body = <EvalsView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'runs': body = <RunsView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'run': {
      const r = runOf(s, screen.id);
      if (r) { if (!r.ok) colour = 'var(--bad)'; body = <RunView ship={ship} r={r} onScreen={onScreen} onBack={() => onScreen({ view: 'runs' })} />; }
      break;
    }
    case 'serving': body = <ServingView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'datasets': body = <DatasetsView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'study': colour = 'var(--captain)'; body = <StudyView ship={ship} onScreen={onScreen} onBack={back} />; break;
    case 'track': {
      const t = s.study.find((x) => x.id === screen.id);
      if (t) { colour = 'var(--captain)'; body = <TrackView t={t} ship={ship} onScreen={onScreen} onBack={() => onScreen({ view: 'study' })} />; }
      break;
    }
    case 'station': {
      const st = ship.station(screen.id);
      if (st) { colour = railColor(st.rail); body = <StationDetail ship={ship} st={st} back="‹ The lab" onBack={back} here="science" />; }
      break;
    }
  }
  if (!body) body = <Lab ship={ship} onScreen={onScreen} />;
  return (
    <section className="console wall lab-screen" role="region" aria-label="Work screen" style={css({ '--c': colour })}>
      {body}
    </section>
  );
}

// ---------- the lab at a glance ----------

function Lab({ ship, onScreen }: { ship: ShipView; onScreen: Go }) {
  const s = ship.data.science;
  const st = ship.station('science');
  const off = st ? ship.off(st) : null;
  const live = s.serving.find((v) => v.state === 'live');
  const best = bestBySuite(s).routing;
  const last = byNewest(s.runs)[0];
  const lessons = s.study.flatMap((t) => t.lessons);
  const nextTrack = s.study.find((t) => nextLesson(t));
  return (
    <>
      <ConHead icon={LAB_ICONS.ease} title={off ? 'The lab is dark' : 'Science lab'}
        sub={`${s.models.length} MODELS · ${s.runs.length} RUNS LOGGED · EVERY NUMBER WITH ITS RUN · ${off ? `SCIENCE OFF · ${up(off)}` : 'SCIENCE AT THE POST'}`} />
      <div className="con-body">
        <div className="ease">
          <Tile icon="evals" label="CHAMBER · BEST ON ROUTING" figure={best ? `${best.score}%` : '—'} onClick={() => onScreen({ view: 'evals' })}
            text={best ? `${modelName(modelOf(s, best.model))}, measured in ${best.run}.` : 'No evals yet.'} foot={`${s.evals.length} EVALS · ${s.suites.length} SUITES`} />
          <Tile icon="serving" label="RACK · SERVING NOW" figure={live?.tokensPerSec ? `${live.tokensPerSec} t/s` : '—'} onClick={() => onScreen({ view: 'serving' })}
            text={live ? `${live.engine}, ${modelName(modelOf(s, live.model))}, ${live.contextK}k context. Measured in ${live.run}.` : 'Nothing served.'}
            foot={`${s.serving.filter((v) => v.state === 'trial').length} ON TRIAL · ${s.serving.filter((v) => v.state === 'failed').length} FAILED`} />
          <Tile icon="models" label="SHELF · MODELS" figure={String(s.models.length)} onClick={() => onScreen({ view: 'models' })}
            text={s.models.map((m) => modelName(m)).join(', ') + '.'} foot={`${s.models.reduce((n, m) => n + m.sizeGb, 0).toFixed(1)} GB ON THE SHELF`} />
          <Tile icon="runs" label="CONSOLE · LAST RUN" figure={last ? (last.ok ? 'OK' : 'Failed') : '—'} onClick={() => onScreen(last ? { view: 'run', id: last.id } : { view: 'runs' })}
            text={last ? `${last.id}: ${last.title}.` : 'No runs yet.'} foot={last ? `${RUN_KIND[last.kind]} · ${up(dayAndTime(last.at))} · ${last.minutes} MIN` : ''} />
          <Tile icon="study" label="STUDY BENCH" figure={`${lessons.filter((l) => l.done).length}/${lessons.length}`}
            onClick={() => onScreen(nextTrack ? { view: 'track', id: nextTrack.id } : { view: 'study' })}
            text={nextTrack ? `Next: ${nextLesson(nextTrack)!.title}.` : 'Every lesson taken.'} foot={`${s.study.length} TRACKS · LEARNED FROM OUR OWN RUNS`} />
          <Tile icon="datasets" label="ARCHIVE · DATASETS" figure={String(s.datasets.length)} onClick={() => onScreen({ view: 'datasets' })}
            text={s.datasets.map((d) => `${d.name} (${d.state})`).join(', ') + '.'} foot={`${s.datasets.reduce((n, d) => n + d.rows, 0)} ROWS · KEPT ON THE LOCAL RAIL`} />
        </div>
      </div>
    </>
  );
}

function Tile({ icon, label, figure, text, foot, onClick }: {
  icon: keyof typeof LAB_ICONS; label: string; figure: string; text: string; foot: string; onClick: () => void;
}) {
  return (
    <button type="button" className="ease-tile" onClick={onClick}>
      <span className="ease-label mono"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={LAB_ICONS[icon]} /></svg>{label}</span>
      <span className="ease-figure">{figure}</span>
      <span className="ease-text">{text}</span>
      <span className="ease-foot mono">{foot}</span>
    </button>
  );
}

// ---------- the model shelf ----------

function ModelsView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: Go; onBack: () => void }) {
  const s = ship.data.science;
  return (
    <>
      <ConHead icon={LAB_ICONS.models} title="Model shelf" back="‹ The lab" onBack={onBack}
        sub={`${s.models.length} MODELS · LOCAL ONLY · SIZE FROM THE RUN THAT MADE EACH FILE`} />
      <div className="con-body">
        <table className="resets lab-table">
          <thead><tr><th>MODEL</th><th>SIZE</th><th>ROLE</th><th>SERVED</th></tr></thead>
          <tbody>
            {s.models.map((m) => {
              const serve = s.serving.find((v) => v.model === m.id && v.state !== 'failed');
              return (
                <tr key={m.id} onClick={() => onScreen({ view: 'model', id: m.id })}>
                  <td><button type="button" className="linkish plain" onClick={(e) => { e.stopPropagation(); onScreen({ view: 'model', id: m.id }); }}>{modelName(m)}</button></td>
                  <td><Measured value={`${m.sizeGb} GB`} run={m.run} onScreen={onScreen} /></td>
                  <td>{m.role}</td>
                  <td className="mono">{serve ? up(serve.state) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ModelView({ ship, id, onScreen, onBack }: { ship: ShipView; id: string; onScreen: Go; onBack: () => void }) {
  const s = ship.data.science;
  const m = modelOf(s, id)!;
  const evals = s.evals.filter((e) => e.model === id);
  const serves = s.serving.filter((v) => v.model === id);
  const runs = byNewest(s.runs.filter((r) => r.model === id));
  return (
    <>
      <ConHead icon={LAB_ICONS.model} title={modelName(m)} back="‹ Model shelf" onBack={onBack}
        sub={`${m.id} · ${up(m.quant)} · ${m.sizeGb} GB · ${runs.length} RUNS`} />
      <div className="con-body">
        <dl className="con-facts">
          <dt>ROLE</dt><dd>{m.role}</dd>
          <dt>SIZE</dt><dd><Measured value={`${m.sizeGb} GB`} run={m.run} onScreen={onScreen} /></dd>
          {evals.map((e) => (
            <Fragment key={e.id}><dt>{up(s.suites.find((x) => x.id === e.suite)?.label ?? e.suite)}</dt>
              <dd><Measured value={`${e.score}%`} run={e.run} onScreen={onScreen} /></dd></Fragment>
          ))}
          {serves.map((v) => (
            <Fragment key={v.id}><dt>{up(v.engine)} · {up(v.state)}</dt>
              <dd><Measured value={v.tokensPerSec !== undefined ? `${v.tokensPerSec} tokens a second, ${v.contextK}k context` : `Did not serve at ${v.contextK}k context`} run={v.run} onScreen={onScreen} /></dd></Fragment>
          ))}
        </dl>
        <p className="readhead mono">ITS RUNS · NEWEST FIRST</p>
        <RunList runs={runs} onScreen={onScreen} />
      </div>
    </>
  );
}

// ---------- the evals ----------

function EvalsView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: Go; onBack: () => void }) {
  const s = ship.data.science;
  const models = s.models.filter((m) => s.evals.some((e) => e.model === m.id));
  return (
    <>
      <ConHead icon={LAB_ICONS.evals} title="Evals" back="‹ The lab" onBack={onBack}
        sub={`${s.evals.length} SCORES · PERCENT RIGHT · ON OUR OWN DATASETS · PICK A RUN FOR ITS LOG`} />
      <div className="con-body">
        <table className="resets lab-table evals-grid">
          <thead><tr><th>MODEL</th>{s.suites.map((x) => <th key={x.id}>{up(x.label)}</th>)}</tr></thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id}>
                <td><button type="button" className="linkish plain" onClick={() => onScreen({ view: 'model', id: m.id })}>{modelName(m)}</button></td>
                {s.suites.map((x) => {
                  const e = s.evals.find((v) => v.model === m.id && v.suite === x.id);
                  return <td key={x.id}>{e ? <Measured value={`${e.score}%`} run={e.run} onScreen={onScreen} /> : <span className="muted">not run</span>}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="readhead mono">THE SUITES</p>
        <dl className="con-facts">
          {s.suites.map((x) => {
            const d = s.datasets.find((v) => v.id === x.dataset);
            return (
              <Fragment key={x.id}><dt>{up(x.label)}</dt>
                <dd>{x.what} <button type="button" className="linkish" onClick={() => onScreen({ view: 'datasets' })}>{d ? `${d.name}, ${d.rows} rows, ${d.state}` : x.dataset}</button></dd></Fragment>
            );
          })}
        </dl>
      </div>
    </>
  );
}

// ---------- runs ----------

function RunList({ runs, onScreen }: { runs: Run[]; onScreen: Go }) {
  return (
    <ul className="runs">
      {runs.length === 0 && <li className="empty">No runs.</li>}
      {runs.map((r) => (
        <li key={r.id}>
          <button type="button" className={'run' + (r.ok ? '' : ' failed')} onClick={() => onScreen({ view: 'run', id: r.id })}>
            <span className="idtag">{r.id} · {RUN_KIND[r.kind]} · {up(dayAndTime(r.at))} · {r.minutes} MIN</span>
            <span className="run-title">{r.title}</span>
            <span className="run-ok mono">{r.ok ? 'OK' : 'FAILED'}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function RunsView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: Go; onBack: () => void }) {
  const runs = byNewest(ship.data.science.runs);
  return (
    <>
      <ConHead icon={LAB_ICONS.runs} title="Run console" back="‹ The lab" onBack={onBack}
        sub={`${runs.length} RUNS · ${runs.filter((r) => !r.ok).length} FAILED · EVERY ONE WITH ITS LOG`} />
      <div className="con-body"><RunList runs={runs} onScreen={onScreen} /></div>
    </>
  );
}

function RunView({ ship, r, onScreen, onBack }: { ship: ShipView; r: Run; onScreen: Go; onBack: () => void }) {
  const s = ship.data.science;
  const m = r.model ? modelOf(s, r.model) : undefined;
  const d = r.dataset ? s.datasets.find((x) => x.id === r.dataset) : undefined;
  const measured = [
    ...s.evals.filter((e) => e.run === r.id).map((e) => `${s.suites.find((x) => x.id === e.suite)?.label}: ${e.score}%`),
    ...s.serving.filter((v) => v.run === r.id && v.tokensPerSec !== undefined).map((v) => `${v.engine}: ${v.tokensPerSec} tokens a second`),
    ...s.models.filter((x) => x.run === r.id).map((x) => `${modelName(x)}: ${x.sizeGb} GB`),
  ];
  return (
    <>
      <ConHead icon={LAB_ICONS.run} title={r.title} back="‹ All runs" onBack={onBack}
        sub={`${r.id} · ${RUN_KIND[r.kind]} · ${up(dayAndTime(r.at))} · ${r.minutes} MIN · ${r.ok ? 'OK' : 'FAILED'}`} />
      <div className="con-body">
        <dl className="con-facts">
          {m && <><dt>MODEL</dt><dd><button type="button" className="linkish" onClick={() => onScreen({ view: 'model', id: m.id })}>{modelName(m)}</button></dd></>}
          {d && <><dt>DATASET</dt><dd>{d.name}, {d.rows} rows, {d.state}</dd></>}
          {measured.length > 0 && <><dt>NUMBERS FROM IT</dt><dd>{measured.join(' · ')}</dd></>}
        </dl>
        <p className="readhead mono">THE RUN LOG</p>
        <ol className="runlog mono">{r.log.map((line, i) => <li key={i}>{line}</li>)}</ol>
      </div>
    </>
  );
}

// ---------- serving ----------

function ServingView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: Go; onBack: () => void }) {
  const s = ship.data.science;
  const most = Math.max(1, ...s.serving.map((v) => v.tokensPerSec ?? 0));
  return (
    <>
      <ConHead icon={LAB_ICONS.serving} title="Serving" back="‹ The lab" onBack={onBack}
        sub="TOKENS A SECOND, ONE USER · MORE IS BETTER · A TRIAL NEVER REPLACES WHAT IS LIVE ON ITS OWN" />
      <div className="con-body">
        <ul className="serves">
          {s.serving.map((v) => (
            <li key={v.id} className={'serve ' + v.state}>
              <span className="serve-name">{v.engine} · {modelName(modelOf(s, v.model))}</span>
              <span className="serve-state mono">{up(v.state)} · {v.contextK}K CONTEXT{v.vram !== undefined ? ` · VRAM ${v.vram}%` : ''}</span>
              <span className="serve-bar" aria-hidden="true"><b style={{ width: `${((v.tokensPerSec ?? 0) / most) * 100}%` }} /></span>
              <Measured value={v.tokensPerSec !== undefined ? `${v.tokensPerSec} t/s` : 'did not load'} run={v.run} onScreen={onScreen} />
            </li>
          ))}
        </ul>
        <p className="con-text">The local rail carries Number One. A move to a new engine is a patch like any other, and you apply it.</p>
      </div>
    </>
  );
}

// ---------- datasets ----------

function DatasetsView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: Go; onBack: () => void }) {
  const s = ship.data.science;
  return (
    <>
      <ConHead icon={LAB_ICONS.datasets} title="Datasets" back="‹ The lab" onBack={onBack}
        sub={`${s.datasets.length} SETS · SCRUBBED · KEPT ON THE LOCAL RAIL · A FROZEN SET KEEPS SCORES COMPARABLE`} />
      <div className="con-body">
        <ul className="dsets">
          {s.datasets.map((d) => {
            const suites = s.suites.filter((x) => x.dataset === d.id);
            return (
              <li key={d.id} className={'dset ' + d.state}>
                <span className="idtag">{d.id} · {up(d.state)} · {d.rows} ROWS{suites.length ? ` · FOR ${suites.map((x) => up(x.label)).join(', ')}` : ''}</span>
                <span className="dset-name">{d.name}</span>
                <span className="dset-what">{d.purpose}</span>
                {d.run && <button type="button" className="runref mono" onClick={() => onScreen({ view: 'run', id: d.run! })}>{d.run}</button>}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

// ---------- the study bench ----------

function StudyView({ ship, onScreen, onBack }: { ship: ShipView; onScreen: Go; onBack: () => void }) {
  const s = ship.data.science;
  return (
    <>
      <ConHead icon={LAB_ICONS.study} title="Study bench" back="‹ The lab" onBack={onBack}
        sub={`${s.study.length} TRACKS · EACH LESSON READS ONE OF OUR OWN RUNS WHERE IT CAN`} />
      <div className="con-body">
        <ul className="tracks">
          {s.study.map((t) => <TrackRow key={t.id} t={t} onOpen={() => onScreen({ view: 'track', id: t.id })} />)}
        </ul>
      </div>
    </>
  );
}

export function TrackRow({ t, onOpen, picked }: { t: StudyTrack; onOpen: () => void; picked?: boolean }) {
  const p = trackProgress(t);
  const next = nextLesson(t);
  return (
    <li>
      <button type="button" className={'track' + (next ? '' : ' done')} aria-pressed={picked} onClick={onOpen}>
        <span className="track-name">{t.name}</span>
        <span className="track-count mono">{p.done}/{p.total}</span>
        <span className="track-bar" aria-hidden="true"><b style={{ width: `${(p.done / p.total) * 100}%` }} /></span>
        <span className="track-next">{next ? `Next: ${next.title}` : 'Done. Every lesson taken.'}</span>
      </button>
    </li>
  );
}

function TrackView({ t, ship, onScreen, onBack }: { t: StudyTrack; ship: ShipView; onScreen: Go; onBack: () => void }) {
  const p = trackProgress(t);
  const next = nextLesson(t);
  return (
    <>
      <ConHead icon={LAB_ICONS.lesson} title={t.name} back="‹ Study bench" onBack={onBack}
        sub={`${t.id} · ${p.done} OF ${p.total} LESSONS · ${next ? 'IN PROGRESS' : 'DONE'}`} />
      <div className="con-body">
        <p className="find-summary">{t.why}</p>
        <ol className="lessons">
          {t.lessons.map((l) => {
            const r = runOf(ship.data.science, l.run);
            return (
              <li key={l.title} className={l.done ? 'done' : l === next ? 'next' : ''}>
                <span className="lesson-mark mono" aria-label={l.done ? 'Done' : l === next ? 'Next' : 'To come'}>{l.done ? '✓' : l === next ? 'NEXT' : ''}</span>
                <span className="lesson-title">{l.title}</span>
                {r && <button type="button" className="runref mono" onClick={() => onScreen({ view: 'run', id: r.id })} title={r.title}>READS {r.id}</button>}
              </li>
            );
          })}
        </ol>
        <p className="con-text">Lessons are taken with the Science Officer, in plain words, from the lab's own runs.</p>
      </div>
    </>
  );
}

