// Helm's wall screen. One view at a time, in place: the course (every open job and application by
// stage), one stage, one job ad, one application, the job-ad board, your gates, the follow-ups and
// deadlines, the method, the timeline and Helm's card.
import type { ReactNode } from 'react';
import type { ShipView } from '../../lib/ship';
import {
  AD_COLOUR, AD_WORD, APP_COLOUR, APP_WORD, DEADLINE_WARN_DAYS, FOLLOW_UP_DAYS, GHOSTED_DAYS, HELM_ICONS, METHOD, STAGES, STANDING,
  course, dateWord, days, deadlines, eventColour, eventsOf, followUps, gates, today, warn, type Card, type Stage,
} from '../../lib/helm';
import type { Application, HelmEvent, HelmFile, JobAd } from '../../types';
import { ConHead, StationDetail, useEscape } from '../ShipConsole';
import { Kpis, OrderView, css, sourceWord, up } from '../post/Parts';

export type Screen =
  | { view: 'ease' } | { view: 'stage'; id: Stage } | { view: 'ad'; id: string; from?: Screen } | { view: 'app'; id: string; from?: Screen }
  | { view: 'ads' } | { view: 'gates' } | { view: 'follow' } | { view: 'method' } | { view: 'log' } | { view: 'station'; id: string }
  | { view: 'order'; id: string };

interface Props { ship: ShipView; screen: Screen; onScreen: (s: Screen) => void }

export function HelmScreen({ ship, screen, onScreen }: Props) {
  const f = ship.data.helm;
  const back = () => onScreen({ view: 'ease' });
  const from = 'from' in screen ? screen.from : undefined;
  useEscape(screen.view !== 'ease', from ? () => onScreen(from) : back);
  const open = (here: Screen) => (c: Card) => onScreen(c.kind === 'ad' ? { view: 'ad', id: c.ad.id, from: here } : { view: 'app', id: c.app.id, from: here });
  const openId = (here: Screen) => (id: string) => onScreen(id.startsWith('A-') ? { view: 'app', id, from: here } : { view: 'ad', id, from: here });
  const backTo = from ? '‹ Back' : '‹ The course';
  const backFn = () => onScreen(from ?? { view: 'ease' });
  let body: ReactNode;
  switch (screen.view) {
    case 'stage': body = <StageView f={f} id={screen.id} onOpen={open(screen)} onBack={back} />; break;
    case 'ad': body = <AdView f={f} id={screen.id} back={backTo} onBack={backFn} onOpen={openId(screen)} />; break;
    case 'app': body = <AppView f={f} id={screen.id} back={backTo} onBack={backFn} onOpen={openId(screen)} />; break;
    case 'ads': body = <AdsView f={f} onOpen={openId(screen)} onBack={back} />; break;
    case 'gates': body = <GatesView f={f} onOpen={openId(screen)} onBack={back} />; break;
    case 'follow': body = <FollowView f={f} onOpen={openId(screen)} onBack={back} />; break;
    case 'method': body = <MethodView onBack={back} />; break;
    case 'log': body = <TimelineView f={f} onOpen={openId(screen)} onBack={back} />; break;
    case 'order': body = <OrderView ship={ship} id={screen.id} icon={HELM_ICONS.log} back="‹ The course" onBack={back} />; break;
    case 'station': {
      const st = ship.station(screen.id);
      if (st) body = <StationDetail ship={ship} st={st} back="‹ The course" onBack={back} here="helm" />;
      break;
    }
  }
  if (!body) body = <CourseView f={f} onOpen={open({ view: 'ease' })} onStage={(id) => onScreen({ view: 'stage', id })} />;
  return (
    <section className="console wall post-screen" role="region" aria-label="Helm's screen" style={css({ '--c': 'var(--acc)' })}>
      {body}
    </section>
  );
}

const source = (f: HelmFile) => sourceWord(f.synthetic, f.asOf).replace('SAMPLE', 'SAMPLE TRACKER');
const pctWord = (n?: number) => (n === undefined ? '' : `${n}%`);

/** One job or application as a small card on the course. */
function CourseCard({ c, onOpen }: { c: Card; onOpen: (c: Card) => void }) {
  const company = c.kind === 'ad' ? c.ad.company : c.app.company;
  const role = c.kind === 'ad' ? c.ad.role : c.app.role;
  const match = c.kind === 'ad' ? c.ad.match : c.app.match;
  const id = c.kind === 'ad' ? c.ad.id : c.app.id;
  const flag = c.kind === 'app' && ['offer', 'rejected', 'withdrawn', 'ghosted'].includes(c.app.status) ? up(APP_WORD[c.app.status]) : '';
  return (
    <li>
      <button type="button" className="hcard" onClick={() => onOpen(c)} aria-label={`${id}: ${role}, ${company}${match !== undefined ? `, ${match}% match` : ''}`}>
        <span className="hc-co">{company}</span>
        <span className="hc-n mono">{flag || pctWord(match)}</span>
        <span className="hc-role">{role}</span>
      </button>
    </li>
  );
}

// ---------- the course ----------

function CourseView({ f, onOpen, onStage }: { f: HelmFile; onOpen: (c: Card) => void; onStage: (id: Stage) => void }) {
  const by = course(f);
  const open = STAGES.filter((s) => s.id !== 'closed').reduce((n, s) => n + by[s.id].length, 0);
  return (
    <>
      <ConHead icon={HELM_ICONS.ease} title="The course" sub={`${open} OPEN · EVERY JOB AND APPLICATION BY STAGE, LEFT TO RIGHT · ${source(f)}`} />
      <ol className="hcourse" aria-label="The course">
        {STAGES.map((s) => (
          <li key={s.id} className="hlane" style={css({ '--pc': s.colour })}>
            <button type="button" className="hl-head" onClick={() => onStage(s.id)} title={s.hint}>
              <span className="hl-name">{s.name}</span>
              <span className="hl-n">{by[s.id].length}</span>
            </button>
            <ol className="hl-cards">
              {by[s.id].length === 0 && <li className="hl-none mono">NONE</li>}
              {by[s.id].slice(0, s.id === 'closed' ? 4 : 6).map((c) => <CourseCard key={c.kind === 'ad' ? c.ad.id : c.app.id} c={c} onOpen={onOpen} />)}
              {by[s.id].length > (s.id === 'closed' ? 4 : 6) && (
                <li><button type="button" className="hl-more mono" onClick={() => onStage(s.id)}>+{by[s.id].length - (s.id === 'closed' ? 4 : 6)} MORE</button></li>
              )}
            </ol>
          </li>
        ))}
      </ol>
    </>
  );
}

// ---------- one stage ----------

function StageView({ f, id, onOpen, onBack }: { f: HelmFile; id: Stage; onOpen: (c: Card) => void; onBack: () => void }) {
  const s = STAGES.find((x) => x.id === id)!;
  const list = course(f)[id];
  return (
    <>
      <ConHead icon={HELM_ICONS.ease} title={`${s.name} · ${list.length}`} back="‹ The course" onBack={onBack} sub={`${up(s.hint)} · ${source(f)}`} />
      <div className="con-body pbody">
        {list.length === 0 && <p className="pnote">Nothing at this stage.</p>}
        <ul className="prows">
          {list.map((c) => c.kind === 'ad'
            ? (
              <li key={c.ad.id}>
                <button type="button" className="prow" style={css({ '--pc': AD_COLOUR[c.ad.status] })} onClick={() => onOpen(c)}>
                  <span className="pr-text">{c.ad.id} · {c.ad.role} · {c.ad.company}</span>
                  <span className="pr-when mono">{pctWord(c.ad.match)} MATCH · FOUND {dateWord(c.ad.found)}</span>
                  <span className="pr-why">{[c.ad.location, c.ad.fit ? `Fit: ${c.ad.fit}.` : '', c.ad.notes].filter(Boolean).join(' · ')}</span>
                </button>
              </li>
            )
            : (
              <li key={c.app.id}>
                <button type="button" className="prow" style={css({ '--pc': APP_COLOUR[c.app.status] })} onClick={() => onOpen(c)}>
                  <span className="pr-text">{c.app.id} · {c.app.role} · {c.app.company}</span>
                  <span className="pr-when mono">{up(APP_WORD[c.app.status])}{c.app.nextDate ? ` · NEXT ${dateWord(c.app.nextDate)}` : ''}</span>
                  <span className="pr-why">{c.app.nextStep ?? c.app.notes ?? ''}</span>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

// ---------- one job ad, one application ----------

function Timeline({ lines, onOpen, here }: { lines: HelmEvent[]; onOpen?: (id: string) => void; here?: string }) {
  return (
    <ol className="htime">
      {lines.map((e, i) => (
        <li key={`${e.date}-${e.id}-${i}`} style={css({ '--pc': eventColour(e.kind) })}>
          <time className="mono" dateTime={e.date}>{dateWord(e.date)}</time>
          <span className="ht-kind mono">{up(e.kind)}</span>
          {onOpen && e.id !== here
            ? <button type="button" className="linkish mono ht-id" onClick={() => onOpen(e.id)}>{e.id}</button>
            : <span className="mono ht-id">{e.id}</span>}
          <span className="ht-text">{e.text}</span>
        </li>
      ))}
    </ol>
  );
}

function AdView({ f, id, back, onBack, onOpen }: { f: HelmFile; id: string; back: string; onBack: () => void; onOpen: (id: string) => void }) {
  const ad = f.ads.find((a) => a.id === id);
  if (!ad) return <ConHead icon={HELM_ICONS.ad} title={id} sub="NO SUCH JOB AD IN THE TRACKER" back={back} onBack={onBack} />;
  const apps = f.applications.filter((a) => a.job === ad.id);
  const left = ad.deadline ? days(today(f), ad.deadline) : null;
  return (
    <>
      <ConHead icon={HELM_ICONS.ad} title={`${ad.id} · ${ad.role}`} back={back} onBack={onBack}
        sub={`${up(ad.company)} · ${up(AD_WORD[ad.status])} · FOUND ${dateWord(ad.found)}`} />
      <div className="con-body pbody">
        <dl className="pfacts mono">
          <div><dt>STATUS</dt><dd><span className="ppill" style={css({ '--pc': AD_COLOUR[ad.status] })}>{up(AD_WORD[ad.status])}</span></dd></div>
          <div><dt>KEYWORD MATCH</dt><dd>{ad.match !== undefined ? `${ad.match}% WITH THE CV` : 'NOT RUN'}</dd></div>
          <div><dt>FIT</dt><dd>{ad.fit ? up(ad.fit) : 'NOT JUDGED'}</dd></div>
          {ad.location && <div><dt>WHERE</dt><dd>{ad.location}</dd></div>}
          {ad.source && <div><dt>SOURCE</dt><dd>{ad.source}</dd></div>}
          <div><dt>DEADLINE</dt><dd>{ad.deadline ? `${dateWord(ad.deadline)}${left !== null ? (left < 0 ? ' · PASSED' : ` · ${left} DAYS LEFT`) : ''}` : 'NONE GIVEN'}</dd></div>
          {ad.notes && <div className="wide"><dt>NOTES</dt><dd>{ad.notes}</dd></div>}
        </dl>
        {ad.match !== undefined && <MatchBar n={ad.match} />}
        {apps.length > 0 && (
          <ul className="prows">
            {apps.map((a) => (
              <li key={a.id}><button type="button" className="prow" style={css({ '--pc': APP_COLOUR[a.status] })} onClick={() => onOpen(a.id)}>
                <span className="pr-text">{a.id} · the application</span>
                <span className="pr-when mono">{up(APP_WORD[a.status])}</span>
                <span className="pr-why">{a.nextStep ?? a.notes ?? ''}</span>
              </button></li>
            ))}
          </ul>
        )}
        <div className="psec"><span className="cb-head mono">TIMELINE</span><Timeline lines={eventsOf(f, ad.id)} onOpen={onOpen} here={ad.id} /></div>
      </div>
    </>
  );
}

function AppView({ f, id, back, onBack, onOpen }: { f: HelmFile; id: string; back: string; onBack: () => void; onOpen: (id: string) => void }) {
  const app = f.applications.find((a) => a.id === id);
  if (!app) return <ConHead icon={HELM_ICONS.app} title={id} sub="NO SUCH APPLICATION IN THE TRACKER" back={back} onBack={onBack} />;
  const fu = followUps(f).find((x) => x.app.id === app.id);
  return (
    <>
      <ConHead icon={HELM_ICONS.app} title={`${app.id} · ${app.role}`} back={back} onBack={onBack}
        sub={`${up(app.company)} · ${up(APP_WORD[app.status])} · STARTED ${dateWord(app.created)}`} />
      <div className="con-body pbody">
        <dl className="pfacts mono">
          <div><dt>STATUS</dt><dd><span className="ppill" style={css({ '--pc': APP_COLOUR[app.status] })}>{up(APP_WORD[app.status])}</span></dd></div>
          <div><dt>SENT</dt><dd>{app.applied ? dateWord(app.applied) : 'NOT YET'}</dd></div>
          <div><dt>KEYWORD MATCH</dt><dd>{app.match !== undefined ? `${app.match}%` : 'NOT RUN'}</dd></div>
          {app.nextStep && <div className="wide"><dt>NEXT STEP</dt><dd>{app.nextStep}{app.nextDate ? ` · BY ${dateWord(app.nextDate)}` : ''}</dd></div>}
          {app.notes && <div className="wide"><dt>NOTES</dt><dd>{app.notes}</dd></div>}
          <div className="wide"><dt>THE JOB AD</dt><dd><button type="button" className="linkish" onClick={() => onOpen(app.job)}>{app.job} · {app.role} · {app.company}</button></dd></div>
        </dl>
        {fu && <p className="pnote">{followWords(fu.kind, fu.since)}</p>}
        <div className="psec"><span className="cb-head mono">TIMELINE</span><Timeline lines={eventsOf(f, app.id)} onOpen={onOpen} here={app.id} /></div>
      </div>
    </>
  );
}

function followWords(kind: 'ghosted' | 'follow-up' | 'waiting', since: number): string {
  if (kind === 'ghosted') return `Sent ${since} days ago with no reply: past ${GHOSTED_DAYS} days, so it counts as ghosted. Closing it is your call.`;
  if (kind === 'follow-up') return `Sent ${since} days ago with no reply: one short follow-up is due (after ${FOLLOW_UP_DAYS} days).`;
  return `Sent ${since} days ago. A follow-up is due after ${FOLLOW_UP_DAYS} days with no reply.`;
}

function MatchBar({ n }: { n: number }) {
  return (
    <div className="hmatch" aria-label={`Keyword match ${n}%`}>
      <span className="pb-track"><b style={{ width: `${Math.min(100, n)}%` }} /><i title="The tailoring aim: about 70%" /></span>
      <span className="mono">{n}% · THE TAILORED CV AIMS FOR ABOUT 70%</span>
    </div>
  );
}

// ---------- the job-ad board ----------

function AdsView({ f, onOpen, onBack }: { f: HelmFile; onOpen: (id: string) => void; onBack: () => void }) {
  const order: JobAd['status'][] = ['found', 'shortlisted', 'applying', 'parked', 'skipped'];
  const ads = [...f.ads].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || b.found.localeCompare(a.found));
  return (
    <>
      <ConHead icon={HELM_ICONS.ads} title={`Job ads · ${ads.length}`} back="‹ The course" onBack={onBack}
        sub={`TO TRIAGE FIRST · KEYWORD MATCH WITH THE CV · ${source(f)}`} />
      <div className="con-body pbody">
        <ul className="pbars hads">
          {ads.map((ad) => (
            <li key={ad.id}>
              <button type="button" className="pbar-row" style={css({ '--pc': AD_COLOUR[ad.status] })} onClick={() => onOpen(ad.id)}>
                <span className="pb-label">{ad.company} <small>{ad.role}</small></span>
                <span className="pb-track"><b style={{ width: `${ad.match ?? 0}%` }} /></span>
                <span className="pb-v mono">{pctWord(ad.match) || '—'} · {up(AD_WORD[ad.status])}{ad.deadline ? ` · DUE ${dateWord(ad.deadline)}` : ''}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---------- your gates ----------

function GatesView({ f, onOpen, onBack }: { f: HelmFile; onOpen: (id: string) => void; onBack: () => void }) {
  const list = gates(f);
  return (
    <>
      <ConHead icon={HELM_ICONS.gates} title={`Your gates · ${list.length}`} back="‹ The course" onBack={onBack}
        sub="FOUR STEPS ONLY YOU DECIDE: TRIAGE, REVIEW, SEND AND CLOSE · HELM NEVER SENDS" />
      <div className="con-body pbody">
        {list.length === 0 && <p className="pnote">Nothing waits at a gate.</p>}
        <ul className="prows">
          {list.map((g) => (
            <li key={`${g.step}-${g.id}`}>
              <button type="button" className="prow" style={css({ '--pc': 'var(--captain)' })} onClick={() => onOpen(g.id)}>
                <span className="pr-text">{g.id} · {g.title}</span>
                <span className="pr-when mono">STEP {g.step} · {up(g.name)} · {up(g.what)}</span>
                <span className="pr-why">{g.note}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="pnote">
          Today the tracker runs in Claude's thread. When Helm takes it over, you answer a gate in words, like "helm, shortlist J-1002" or
          "helm, sent A-1001", and code moves the row.
        </p>
      </div>
    </>
  );
}

// ---------- follow-ups and deadlines ----------

function FollowView({ f, onOpen, onBack }: { f: HelmFile; onOpen: (id: string) => void; onBack: () => void }) {
  const fus = followUps(f);
  const dls = deadlines(f);
  const next = f.applications.filter((a) => a.nextDate && !['applied', 'rejected', 'withdrawn', 'ghosted'].includes(a.status))
    .sort((a, b) => a.nextDate!.localeCompare(b.nextDate!));
  const now = today(f);
  return (
    <>
      <ConHead icon={HELM_ICONS.follow} title="Follow-ups and deadlines" back="‹ The course" onBack={onBack}
        sub={`FOLLOW UP AT ${FOLLOW_UP_DAYS} DAYS · GHOSTED AT ${GHOSTED_DAYS} · DEADLINES WARN ${DEADLINE_WARN_DAYS} DAYS AHEAD`} />
      <div className="con-body pbody">
        <Kpis items={[
          { n: fus.filter((x) => x.kind === 'follow-up').length, label: 'FOLLOW-UPS DUE', tone: fus.some((x) => x.kind === 'follow-up') ? 'warn' : undefined },
          { n: fus.filter((x) => x.kind === 'ghosted').length, label: 'PAST 30 DAYS', tone: fus.some((x) => x.kind === 'ghosted') ? 'bad' : undefined },
          { n: fus.filter((x) => x.kind === 'waiting').length, label: 'WAITING FOR A REPLY' },
          { n: dls.filter(warn).length, label: 'DEADLINES NEAR', tone: dls.some(warn) ? 'warn' : undefined },
        ]} />
        <ul className="prows two">
          {fus.map((x) => (
            <li key={x.app.id}>
              <button type="button" className={'prow' + (x.kind === 'ghosted' ? ' alert' : x.kind === 'waiting' ? ' dim' : '')}
                style={css({ '--pc': x.kind === 'waiting' ? '#6fb7f2' : x.kind === 'follow-up' ? 'var(--captain)' : 'var(--bad)' })} onClick={() => onOpen(x.app.id)}>
                <span className="pr-text">{x.app.company}</span>
                <span className="pr-when mono">{x.since} DAYS · {x.kind === 'waiting' ? `DUE ${dateWord(x.due)}` : x.kind === 'follow-up' ? 'FOLLOW UP NOW' : 'GHOSTED?'}</span>
                <span className="pr-why">{x.app.id} · {x.app.role}. Sent {dateWord(x.app.applied!)}.</span>
              </button>
            </li>
          ))}
          {dls.map((d) => (
            <li key={d.ad.id}>
              <button type="button" className={'prow' + (d.left < 0 ? ' dim' : '')} style={css({ '--pc': warn(d) ? 'var(--captain)' : d.left < 0 ? 'var(--text-label)' : '#6fb7f2' })} onClick={() => onOpen(d.ad.id)}>
                <span className="pr-text">{d.ad.company}</span>
                <span className="pr-when mono">DEADLINE {dateWord(d.ad.deadline!)} · {d.left < 0 ? 'PASSED' : d.left === 0 ? 'TODAY' : `${d.left} DAYS`}</span>
                <span className="pr-why">{d.ad.id} · {d.ad.role}. {AD_WORD[d.ad.status]}.</span>
              </button>
            </li>
          ))}
        </ul>
        {next.length > 0 && (
          <div className="psec">
            <span className="cb-head mono">NEXT STEPS BY DATE</span>
            <ul className="prows">
              {next.map((a: Application) => (
                <li key={a.id}><button type="button" className={'prow' + (a.nextDate! < now ? ' alert' : '')} style={css({ '--pc': APP_COLOUR[a.status] })} onClick={() => onOpen(a.id)}>
                  <span className="pr-text">{a.nextStep ?? 'Next step'}</span>
                  <span className="pr-when mono">{dateWord(a.nextDate!)}{a.nextDate! < now ? ' · LATE' : ''}</span>
                  <span className="pr-why">{a.id} · {a.role} · {a.company}</span>
                </button></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

// ---------- the method ----------

function MethodView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <ConHead icon={HELM_ICONS.method} title="The method" back="‹ The course" onBack={onBack}
        sub="FROM JOB AD TO SENT APPLICATION · TEN STEPS · GOLD ONES ARE YOUR GATES" />
      <div className="con-body pbody">
        <ol className="prows two tight">
          {METHOD.map((m) => (
            <li key={m.n}><div className="prow" style={css({ '--pc': m.gate ? 'var(--captain)' : 'var(--acc)' })}>
              <span className="pr-text">{m.n} · {m.name}</span>
              <span className="pr-when mono">{m.gate ? `GATE · ${up(m.gate)}` : ''}</span>
              <span className="pr-why">{m.text}</span>
            </div></li>
          ))}
        </ol>
        <div className="psec">
          <span className="cb-head mono">STANDING RULES</span>
          <ul className="hrules">{STANDING.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      </div>
    </>
  );
}

// ---------- the timeline ----------

function TimelineView({ f, onOpen, onBack }: { f: HelmFile; onOpen: (id: string) => void; onBack: () => void }) {
  return (
    <>
      <ConHead icon={HELM_ICONS.log} title="Timeline" back="‹ The course" onBack={onBack}
        sub={`${f.events.length} LINES · EVERY STEP LEAVES ONE · NEWEST FIRST · ${source(f)}`} />
      <div className="con-body pbody">
        {f.events.length === 0 && <p className="pnote">Nothing has happened yet.</p>}
        <Timeline lines={f.events} onOpen={onOpen} />
      </div>
    </>
  );
}
