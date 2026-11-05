// The panels around the Science lab: the scores in the eval chamber's glass, the study bench,
// what is serving, every eval with its run, and the run log.
import { clockTime, dayAndTime } from '../../lib/format';
import { CHAMBER, ROOM, RUN_KIND, byNewest, modelName, modelOf, pct } from '../../lib/science';
import type { ShipView } from '../../lib/ship';
import { Measured, TrackRow, type Screen } from './LabScreen';

const up = (s: string) => s.toUpperCase();
type Go = (s: Screen) => void;

/** The eval chamber's glass: a bar per score, by suite. The chamber itself opens the evals. */
export function Chamber({ ship, dark }: { ship: ShipView; dark: boolean }) {
  const s = ship.data.science;
  return (
    <div className={'chamber' + (dark ? ' dark' : '')} aria-hidden="true"
      style={{ left: pct(CHAMBER.x, ROOM.w), top: pct(CHAMBER.y, ROOM.h), width: pct(CHAMBER.w, ROOM.w), height: pct(CHAMBER.h, ROOM.h) }}>
      {s.suites.map((x) => {
        const rows = s.evals.filter((e) => e.suite === x.id).sort((a, b) => b.score - a.score);
        return (
          <div key={x.id} className="ch-suite">
            <span className="ch-name mono">{up(x.label)}</span>
            {rows.map((e) => (
              <span key={e.id} className="ch-row">
                <span className="ch-model mono">{up(modelName(modelOf(s, e.model)))}</span>
                <span className="ch-bar"><b style={{ width: `${e.score}%` }} /></span>
                <span className="ch-val mono">{e.score}</span>
              </span>
            ))}
          </div>
        );
      })}
      <span className="ch-foot mono">PERCENT RIGHT · {s.evals.length} SCORES</span>
    </div>
  );
}

export function StudyPanel({ ship, picked, onScreen }: { ship: ShipView; picked?: string; onScreen: Go }) {
  const s = ship.data.science;
  const lessons = s.study.flatMap((t) => t.lessons);
  return (
    <section className="panel study-panel" aria-labelledby="study-title">
      <div className="panel-head">
        <h2 className="panel-title" id="study-title">Study bench</h2>
        <span className="mono panel-meta">{lessons.filter((l) => l.done).length} OF {lessons.length} LESSONS · {s.study.length} TRACKS</span>
        <button type="button" className="foldall" onClick={() => onScreen({ view: 'study' })}>OPEN</button>
      </div>
      <ul className="tracks">
        {s.study.map((t) => <TrackRow key={t.id} t={t} picked={picked === t.id} onOpen={() => onScreen({ view: 'track', id: t.id })} />)}
      </ul>
    </section>
  );
}

export function ServingPanel({ ship, onScreen }: { ship: ShipView; onScreen: Go }) {
  const s = ship.data.science;
  return (
    <section className="panel serving-panel" aria-labelledby="serve-title">
      <div className="panel-head">
        <h2 className="panel-title" id="serve-title">Serving</h2>
        <span className="mono panel-meta">TOKENS A SECOND · ONE USER</span>
        <button type="button" className="foldall" onClick={() => onScreen({ view: 'serving' })}>OPEN</button>
      </div>
      <ul className="serves mini">
        {s.serving.map((v) => (
          <li key={v.id} className={'serve ' + v.state}>
            <span className="serve-name">{v.engine} · {modelName(modelOf(s, v.model))}</span>
            <span className="serve-state mono">{up(v.state)} · {v.contextK}K</span>
            <Measured value={v.tokensPerSec !== undefined ? `${v.tokensPerSec} t/s` : 'did not load'} run={v.run} onScreen={onScreen} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EvalsTable({ ship, onScreen }: { ship: ShipView; onScreen: Go }) {
  const s = ship.data.science;
  const rows = [...s.evals].sort((a, b) => a.suite.localeCompare(b.suite) || b.score - a.score);
  return (
    <section className="panel log-table-panel" aria-labelledby="evals-title">
      <div className="panel-head">
        <h2 className="panel-title" id="evals-title">Evals</h2>
        <span className="mono panel-meta">{rows.length} · EVERY SCORE WITH ITS RUN · SAMPLE</span>
      </div>
      <div className="olog-scroll">
        <table className="olog">
          <thead><tr><th>ID</th><th>SUITE</th><th>MODEL</th><th>SCORE</th><th>DATASET</th><th>RUN</th><th>WHEN</th></tr></thead>
          <tbody>
            {rows.map((e) => {
              const suite = s.suites.find((x) => x.id === e.suite);
              const d = s.datasets.find((x) => x.id === suite?.dataset);
              const r = s.runs.find((x) => x.id === e.run);
              return (
                <tr key={e.id} onClick={() => onScreen({ view: 'run', id: e.run })}>
                  <td className="mono">{e.id}</td>
                  <td>{suite?.label ?? e.suite}</td>
                  <td><button type="button" className="linkish plain" onClick={(ev) => { ev.stopPropagation(); onScreen({ view: 'model', id: e.model }); }}>{modelName(modelOf(s, e.model))}</button></td>
                  <td className="mono">{e.score}%</td>
                  <td>{d ? `${d.name} · ${d.state}` : '—'}</td>
                  <td className="mono"><button type="button" className="olog-id" onClick={(ev) => { ev.stopPropagation(); onScreen({ view: 'run', id: e.run }); }}>{e.run}</button></td>
                  <td className="mono">{r ? dayAndTime(r.at) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Every run, newest first, with the Science Officer's own lines from the ship's log. */
export function RunLogPanel({ ship, onScreen }: { ship: ShipView; onScreen: Go }) {
  const s = ship.data.science;
  const lines = [
    ...byNewest(s.runs).map((r) => ({ at: r.at, tag: r.ok ? RUN_KIND[r.kind] : 'FAILED', text: `${r.id} ${r.title}`, run: r.id })),
    ...ship.data.shiplog.entries.filter((x) => x.station === 'science').map((x) => ({ at: x.at, tag: x.kind === 'duty' ? 'DUTY' : 'LOG', text: x.text, run: undefined })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  const today = dayAndTime(s.asOf).split(' ')[0];
  return (
    <section className="panel array-log" aria-labelledby="rlog-title">
      <div className="panel-head">
        <h2 className="panel-title" id="rlog-title">Run log</h2>
        <span className="mono panel-meta">{s.runs.length} RUNS · NEWEST FIRST · PICK ONE FOR ITS LOG</span>
      </div>
      <ol className="alog">
        {lines.map((l) => (
          <li key={l.at + l.tag + l.text} className={l.tag === 'FAILED' ? 'alog-held' : l.tag === 'DUTY' ? 'alog-duty' : undefined}>
            <time className="mono" dateTime={l.at}>{dayAndTime(l.at).split(' ')[0] === today ? clockTime(l.at) : dayAndTime(l.at)}</time>
            <span className="alog-tag mono">{l.tag}</span>
            {l.run ? <button type="button" className="linkish plain alog-link" onClick={() => onScreen({ view: 'run', id: l.run! })}>{l.text}</button> : <span>{l.text}</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
