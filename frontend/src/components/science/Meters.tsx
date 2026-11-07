// The Science lab's meters: speed (time to first token and tokens a second), spend (tokens and
// dollars by rail, window and station) and the leak share (tokens lost to polling and restarts,
// week by week). Sample data until the meter probe writes live/meters.json. Every speed figure
// carries the trial that measured it (SPD-), the lab's rule for runs.
import { useState } from 'react';
import { railColor } from '../../lib/lookups';
import { dayAndTime } from '../../lib/format';
import {
  LAB_ICONS, RAIL_LABEL, WINDOW_SHORT, dollars, lastTrial, leakNow, metersSource, spendIn, spent, tokens,
} from '../../lib/science';
import type { ShipView } from '../../lib/ship';
import type { MeterRail, MeterWindow, MetersFile } from '../../types';
import { ConHead } from '../ShipConsole';
import type { Screen } from './LabScreen';
import { Src } from '../Src';

type Go = (s: Screen) => void;
const up = (s: string) => s.toUpperCase();
const ms = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)} s` : `${Math.round(n)} ms`);
const tint = (rail: MeterRail) => (rail === 'other' ? 'var(--text-muted)' : railColor(rail));
const css = (vars: Record<string, string>) => vars as React.CSSProperties;

/** SAMPLE, LIVE or STALE, and when: the same words as the rails. */
export function metersLabel(m: MetersFile | undefined): string {
  const src = metersSource(m);
  return src === 'none' || !m ? 'NO METERS' : `${up(src)} · AS OF ${up(dayAndTime(m.asOf))}`;
}

function SourceNote({ m, which }: { m: MetersFile; which: keyof MetersFile['sources'] }) {
  const s = m.sources[which];
  return <p className={'meter-src mono' + (s.state === 'read' ? '' : ' off')}>{s.state === 'read' ? 'SOURCE' : up(s.state)} · {s.note}</p>;
}

// ---------- speed ----------

export function SpeedView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const m = ship.data.meters;
  const best = lastTrial(m);
  const cloud = (['codex', 'claude'] as MeterRail[]).map((r) => ({
    rail: r, week: m.handoffs.find((h) => h.rail === r && h.window === 'week'), all: m.handoffs.find((h) => h.rail === r && h.window === 'all'),
  }));
  return (
    <>
      <ConHead icon={LAB_ICONS.speed} title="Speed" back="‹ The lab" onBack={onBack}
        sub={`TIME TO FIRST TOKEN · TOKENS A SECOND · ${metersLabel(m)}`} />
      <div className="con-body">
        <p className="readhead mono">LOCAL RAIL · SPEED TRIALS · NEWEST FIRST</p>
        {m.trials.length === 0 ? <p className="con-text">No speed trial yet. A trial is a run of its own: it asks the loaded model the same short question three times and times the answers.</p> : (
          <table className="resets lab-table meter-table">
            <thead><tr><th>TRIAL · MODEL</th><th>WHEN</th><th>FIRST TOKEN</th><th>TOKENS/S</th><th>PROMPT T/S</th><th>LOAD</th></tr></thead>
            <tbody>
              {m.trials.map((t) => (
                <tr key={t.id} className={t.ok ? (t === best ? 'best' : '') : 'failed'} title={t.note}>
                  <td className="mono">{t.id}<span className="trial-model">{t.model}</span></td>
                  <td className="mono">{dayAndTime(t.at)}</td>
                  {t.ok ? (
                    <>
                      <td className="mono">{t.ttftMs !== undefined ? ms(t.ttftMs) : '—'}{t.ttftMsMax !== undefined && t.ttftMsMax > (t.ttftMs ?? 0) * 1.5 ? <span className="muted"> (max {ms(t.ttftMsMax)})</span> : null}</td>
                      <td className="mono">{t.tokensPerSec ?? '—'}</td>
                      <td className="mono">{t.promptTokensPerSec ?? '—'}</td>
                      <td className="mono">{t.loadMs ? ms(t.loadMs) : '—'}</td>
                    </>
                  ) : <td colSpan={4} className="trial-failed">{t.note ?? 'Failed'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <SourceNote m={m} which="trials" />
        <p className="readhead mono">CLOUD RAILS · TOKENS A WALL SECOND, PER HAND-OFF</p>
        <ul className="rail-speeds">
          {cloud.map(({ rail, week, all }) => (
            <li key={rail} style={css({ '--c': tint(rail) })}>
              <span className="rs-name">{RAIL_LABEL[rail]}</span>
              <span className="rs-fig mono">{week?.tokensPerSec !== undefined ? `${week.tokensPerSec} t/s` : '—'}</span>
              <span className="rs-sub mono">{week ? `${week.count} HAND-OFFS IN 7 DAYS · ${tokens(week.tokens)} TOKENS` : 'NO HAND-OFFS IN 7 DAYS'}{all?.tokensPerSec !== undefined ? ` · ALL TIME ${all.tokensPerSec} T/S` : ''}</span>
            </li>
          ))}
        </ul>
        <SourceNote m={m} which="handoffs" />
        <p className="con-text">A cloud figure is tokens over the hand-off's whole wall time, tools and waits included: how fast the work went, not how fast the model talks. Time to first token on a cloud rail isn't measured; that would take a paid call.</p>
      </div>
    </>
  );
}

// ---------- spend ----------

const WINDOWS: MeterWindow[] = ['day', 'week', 'month', 'all'];

export function SpendView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const m = ship.data.meters;
  const [w, setW] = useState<MeterWindow>('week');
  const { rows, total } = spendIn(m, w);
  const most = Math.max(1, ...m.stations.map((s) => s.tokens));
  const label = m.windows.find((x) => x.id === w)?.label ?? w;
  return (
    <>
      <ConHead icon={LAB_ICONS.spend} title="Spend" back="‹ The lab" onBack={onBack}
        sub={`TOKENS AND DOLLARS BY RAIL · ${metersLabel(m)}`}>
        <span className="win-pick" role="group" aria-label="Window">
          {WINDOWS.map((x) => <button key={x} type="button" className="win-btn mono" aria-pressed={x === w} onClick={() => setW(x)}>{WINDOW_SHORT[x]}</button>)}
        </span>
      </ConHead>
      <div className="con-body">
        <p className="readhead mono">{up(label)} · BY RAIL</p>
        <table className="resets lab-table meter-table spend-table">
          <thead><tr><th>RAIL</th><th>SESSIONS</th><th>CALLS</th><th>INPUT</th><th>CACHED</th><th>OUTPUT</th><th>REASONING</th><th>SPENT</th><th>$</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={9} className="muted">Nothing spent in this window.</td></tr>}
            {rows.map((r) => (
              <tr key={r.rail} style={css({ '--c': tint(r.rail) })}>
                <td className="rail-cell">{RAIL_LABEL[r.rail]}</td>
                <td className="mono">{r.sessions}</td>
                <td className="mono">{r.calls ?? '—'}</td>
                <td className="mono">{tokens(r.input)}</td>
                <td className="mono">{tokens(r.cached)}</td>
                <td className="mono">{tokens(r.output)}</td>
                <td className="mono">{tokens(r.reasoning)}</td>
                <td className="mono strong">{tokens(spent(r))}</td>
                <td className="mono">{r.costUsd !== undefined ? dollars(r.costUsd) : '—'}</td>
              </tr>
            ))}
            {rows.length > 1 && (
              <tr className="total">
                <td>All rails</td>
                <td className="mono">{total.sessions}</td>
                <td className="mono">{total.calls ?? '—'}</td>
                <td className="mono">{tokens(total.input)}</td>
                <td className="mono">{tokens(total.cached)}</td>
                <td className="mono">{tokens(total.output)}</td>
                <td className="mono">{tokens(total.reasoning)}</td>
                <td className="mono strong">{tokens(spent(total))}</td>
                <td className="mono">{total.costUsd ? dollars(total.costUsd) : '—'}</td>
              </tr>
            )}
          </tbody>
        </table>
        <SourceNote m={m} which="sessions" />
        <p className="readhead mono">LAST 7 DAYS · BY STATION</p>
        <ul className="station-spend">
          {m.stations.map((s) => {
            const st = ship.station(s.station);
            return (
              <li key={s.station + s.rail} style={css({ '--c': tint(s.rail) })}>
                <span className="ss-name">{st?.short ?? st?.name ?? s.station}</span>
                <span className="ss-bar" aria-hidden="true"><b style={{ width: `${(s.tokens / most) * 100}%` }} /></span>
                <span className="ss-fig mono">{tokens(s.tokens)}{s.costUsd !== undefined ? ` · ${dollars(s.costUsd)}` : ''}</span>
                <span className="ss-sub mono">{up(RAIL_LABEL[s.rail])} · {s.sessions} SESSIONS</span>
              </li>
            );
          })}
        </ul>
        <p className="con-text">Spent is input plus output. Cached tokens are part of the input, and reasoning tokens part of the output. Dollars show only where Hermes knows a price: Codex runs on the ChatGPT plan and the local rail is free, so they show tokens only.</p>
      </div>
    </>
  );
}

// ---------- the leak ----------

export function LeakView({ ship, onBack }: { ship: ShipView; onBack: () => void }) {
  const m = ship.data.meters;
  const most = Math.max(10, ...m.leak.weeks.map((w) => w.share));
  return (
    <>
      <ConHead icon={LAB_ICONS.leak} title="Leak share" back="‹ The lab" onBack={onBack}
        sub={`TOKENS LOST TO POLLING AND RESTARTS · WEEK BY WEEK · ${metersLabel(m)}`} />
      <div className="con-body">
        {m.leak.weeks.length === 0 ? <p className="con-text">No weeks yet.</p> : (
          <ul className="leak-weeks">
            {m.leak.weeks.map((w) => (
              <li key={w.week} className={w.share >= 20 ? 'high' : w.share >= 10 ? 'mid' : ''}>
                <span className="lw-name mono">{w.week.replace('-', ' ')}</span>
                <span className="lw-bar" aria-hidden="true"><b style={{ width: `${(w.share / most) * 100}%` }} /></span>
                <span className="lw-fig mono">{w.share.toFixed(1)}%</span>
                <span className="lw-sub mono">{tokens(w.leakTokens)} OF {tokens(w.tokens)} · {w.runs} CARD RUNS{w.unmatched ? ` · ${w.unmatched} UNMATCHED` : ''} · FROM {w.from}</span>
              </li>
            ))}
          </ul>
        )}
        <SourceNote m={m} which="leak" />
        {m.leak.basis && <p className="meter-src mono">WORKED OUT AS · {m.leak.basis}</p>}
        <p className="con-text">The leak is what a card run spends without moving the work on: polling a card that hasn't changed, and the overhead of starting again after the usage wall. Patch AD (03/11) and AE cut it. An unmatched run is counted, never guessed at.</p>
      </div>
    </>
  );
}

// ---------- the side panel ----------

export function MetersPanel({ ship, onScreen }: { ship: ShipView; onScreen: Go }) {
  const m = ship.data.meters;
  const t = lastTrial(m);
  const week = spendIn(m, 'week').total;
  const [now, before] = leakNow(m);
  return (
    <section className="panel meters-panel" aria-labelledby="meters-title">
      <div className="panel-head">
        <h2 className="panel-title" id="meters-title">Meters</h2>
        <Src ids={['meters']} />
        <span className="mono panel-meta">{metersLabel(m)}</span>
      </div>
      <div className="mp-rows">
        <button type="button" className="mp-row" onClick={() => onScreen({ view: 'speed' })}>
          <span className="mp-label mono">SPEED · LOCAL</span>
          <span className="mp-fig">{t?.ttftMs !== undefined ? ms(t.ttftMs) : '—'}<small> first token</small></span>
          <span className="mp-fig">{t?.tokensPerSec ?? '—'}<small> t/s</small></span>
        </button>
        <button type="button" className="mp-row" onClick={() => onScreen({ view: 'spend' })}>
          <span className="mp-label mono">SPEND · 7 DAYS</span>
          <span className="mp-fig">{tokens(spent(week))}<small> tokens</small></span>
          <span className="mp-fig">{week.costUsd ? dollars(week.costUsd) : '—'}</span>
        </button>
        <button type="button" className="mp-row" onClick={() => onScreen({ view: 'leak' })}>
          <span className="mp-label mono">LEAK · {now ? now.week.slice(5) : 'THIS WEEK'}</span>
          <span className="mp-fig">{now ? `${now.share.toFixed(1)}%` : '—'}</span>
          <span className="mp-fig muted-fig">{before ? `${before.share.toFixed(1)}% before` : ''}</span>
        </button>
      </div>
    </section>
  );
}
