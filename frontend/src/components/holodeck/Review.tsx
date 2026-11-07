// The Review bay: what the Holodeck Officer pushed, and how the holo Action did with it.
// - ReviewPanel: the short list beside the room (one row per holo branch).
// - ReviewView: the work screen view. On the left every item; on the right the picked one:
//   its run step by step (with the failing step's log lines), the files with their diffs, and
//   holo's report. Nothing here writes: the PR's link opens GitHub, where you merge.
import { useState } from 'react';
import { dayAndTime } from '../../lib/format';
import { HOLO_ICONS } from '../../lib/holodeck';
import { REVIEW_STATE, STEP_MARK, diffLines, mainUnreviewed, outOfBounds, reviewCounts, reviewIsSample, reviewItems, runTime } from '../../lib/review';
import type { ShipView } from '../../lib/ship';
import type { HoloItem } from '../../types';
import { ConHead } from '../ShipConsole';
import { Src } from '../Src';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;

/** The coloured state word of one item. */
export function ReviewPill({ item }: { item: HoloItem }) {
  const s = REVIEW_STATE[item.state];
  return <span className="rv-pill mono" style={css({ '--rc': s.colour })} title={s.what}>{s.label}</span>;
}

// ---------- the main watch ----------

/** One line in the panel: main is clean, or how many commits came in without a PR. */
function MainLine({ ship }: { ship: ShipView }) {
  const main = ship.data.holo?.main;
  if (!main) return null;
  const bad = main.unreviewed;
  return (
    <p className={'rv-main mono' + (bad.length ? ' bad' : '')}
      title="GitHub doesn't enforce main's rules on this private repo, so the holo probe checks every commit on main came in through a merged PR.">
      {bad.length ? `MAIN · ${bad.length} WITHOUT A PR · CONDITION RED` : `MAIN CLEAN · ${main.checked} COMMITS CHECKED, ALL THROUGH PRS`}
    </p>
  );
}

/** In the Review bay view: every commit on main without a merged PR, each with its link. */
function MainBanner({ ship }: { ship: ShipView }) {
  const bad = mainUnreviewed(ship.data);
  if (bad.length === 0) return null;
  return (
    <div className="rv-main-banner" role="alert">
      <span className="rv-cap mono">ON MAIN WITHOUT A MERGED PR · LOOK BEFORE YOU PULL ON THE NAS · CLEAR WITH MAIN_OK IN DEPLOY/.ENV</span>
      <ul>
        {bad.map((c) => (
          <li key={c.sha}>
            <a href={c.url} target="_blank" rel="noreferrer" className="mono">{c.sha.slice(0, 7)}</a>
            <span>{c.title}</span>
            <span className="mono rv-when">{c.author}{c.at ? ` · ${dayAndTime(c.at)}` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- the side panel ----------

export function ReviewPanel({ ship, picked, onOpen }: { ship: ShipView; picked?: string; onOpen: (branch?: string) => void }) {
  const items = reviewItems(ship.data);
  const n = reviewCounts(ship.data);
  return (
    <section className="panel holo-review" aria-labelledby="hrv-title">
      <div className="panel-head">
        <h2 className="panel-title" id="hrv-title">Review bay</h2>
        <Src ids={['holo']} />
        <span className="mono panel-meta">{n.ready} READY · {n.failed} FAILED · {n.building} BUILDING</span>
        <button type="button" className="foldall" onClick={() => onOpen()}>OPEN</button>
      </div>
      <MainLine ship={ship} />
      <ul className="rv-list">
        {items.length === 0 && <li className="empty">Nothing from the Holodeck Officer yet.</li>}
        {items.slice(0, 4).map((i) => (
          <li key={i.branch}>
            <button type="button" className="rv-row" aria-pressed={picked === i.branch} onClick={() => onOpen(i.branch)}
              style={css({ '--rc': REVIEW_STATE[i.state].colour })}>
              <span className="rv-ord mono">{i.order ?? i.branch.slice(5)}</span>
              <span className="rv-title">{i.title}</span>
              <ReviewPill item={i} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- the work screen view ----------

export function ReviewView({ ship, branch, onPick, onBack }: {
  ship: ShipView; branch?: string; onPick: (branch: string) => void; onBack: () => void;
}) {
  const items = reviewItems(ship.data);
  const item = items.find((i) => i.branch === branch) ?? items[0];
  const n = reviewCounts(ship.data);
  const sample = reviewIsSample(ship.data) ? 'SAMPLE · ' : '';
  return (
    <>
      <ConHead icon={HOLO_ICONS.review} title="Review bay" back="‹ Ready" onBack={onBack}
        sub={`${sample}THE HOLODECK OFFICER'S WORK ON GITHUB · ${n.open} OPEN · ${n.ready} READY TO REVIEW`} />
      <MainBanner ship={ship} />
      <div className="con-body rv-body">
        <ul className="rv-items">
          {items.map((i) => (
            <li key={i.branch}>
              <button type="button" className="rv-item" aria-pressed={item?.branch === i.branch} onClick={() => onPick(i.branch)}
                style={css({ '--rc': REVIEW_STATE[i.state].colour })}>
                <span className="rv-ord mono">{i.order ?? i.branch}</span>
                <ReviewPill item={i} />
                <span className="rv-title">{i.title}</span>
                <span className="rv-when mono">{dayAndTime(i.updatedAt)}{i.pr ? ` · PR #${i.pr.number}` : ''}</span>
              </button>
            </li>
          ))}
          {items.length === 0 && <li className="empty">Nothing from the Holodeck Officer yet. Send an order that starts with "holodeck:".</li>}
        </ul>
        {item && <ReviewDetail item={item} />}
      </div>
    </>
  );
}

function ReviewDetail({ item }: { item: HoloItem }) {
  const [file, setFile] = useState<string | null>(null);
  const shown = item.files.find((f) => f.path === file) ?? item.files.find((f) => f.patch);
  const oob = outOfBounds(item);
  const run = item.run;
  const s = REVIEW_STATE[item.state];
  return (
    <div className="rv-detail" style={css({ '--rc': s.colour })}>
      <div className="rv-head">
        <span className="rv-head-title">{item.title}</span>
        <span className="rv-head-sub mono">
          {item.branch}{item.sha ? ` @ ${item.sha.slice(0, 7)}` : ''}{item.version ? ` · BUMPS TO ${item.version}` : ''}
        </span>
        <p className="rv-what">{s.what}</p>
        <span className="rv-links">
          {item.pr && <a className="btn btn-ghost" href={item.pr.url} target="_blank" rel="noreferrer">PR #{item.pr.number} on GitHub</a>}
          {run && <a className="btn btn-ghost" href={run.url} target="_blank" rel="noreferrer">The run</a>}
        </span>
      </div>

      <section className="rv-sec" aria-label="The holo Action's run">
        <h3 className="rv-cap mono">CHECKS · {run ? `${run.status.toUpperCase()} · ${runTime(run.seconds)}` : 'NOT STARTED'}</h3>
        {run ? (
          <ol className="rv-steps">
            {run.steps.map((st) => (
              <li key={st.name} className={`rv-step ${st.state}`}>
                <span className="rv-mark" aria-label={st.state}>{STEP_MARK[st.state]}</span>
                <span className="rv-step-name">{st.name}</span>
                <span className="rv-step-time mono">{st.seconds != null ? `${st.seconds}s` : ''}</span>
              </li>
            ))}
          </ol>
        ) : <p className="con-hint">The holo Action starts within a minute of the push.</p>}
        {run?.failLog && run.failLog.length > 0 && <pre className="rv-log mono">{run.failLog.join('\n')}</pre>}
      </section>

      <section className="rv-sec" aria-label="Files changed">
        <h3 className="rv-cap mono">
          FILES · {item.files.length} · +{item.files.reduce((a, f) => a + f.add, 0)} −{item.files.reduce((a, f) => a + f.del, 0)}
          {oob.length > 0 && <span className="rv-oob"> · {oob.length} OUT OF BOUNDS</span>}
        </h3>
        <ul className="rv-files">
          {item.files.map((f) => (
            <li key={f.path}>
              <button type="button" className={'rv-file' + (f.inBounds ? '' : ' oob')} aria-pressed={shown?.path === f.path}
                disabled={!f.patch} onClick={() => setFile(f.path)} title={f.inBounds ? undefined : "Outside the Holodeck's paths"}>
                <span className="rv-file-path mono">{f.path}</span>
                <span className="rv-file-n mono"><span className="add">+{f.add}</span> <span className="del">−{f.del}</span></span>
              </button>
            </li>
          ))}
        </ul>
        {shown?.patch && (
          <pre className="rv-diff mono" aria-label={`Diff of ${shown.path}`}>
            {diffLines(shown.patch).map((l, i) => <span key={i} className={`dl ${l.kind}`}>{l.text}{'\n'}</span>)}
          </pre>
        )}
      </section>

      <section className="rv-sec" aria-label="holo's report">
        <h3 className="rv-cap mono">REPORT · HOLODECK/REPORTS/{item.order ?? '—'}.MD</h3>
        {item.report ? <pre className="rv-report">{item.report}</pre> : <p className="con-hint">holo wrote no report on this branch.</p>}
      </section>
    </div>
  );
}
