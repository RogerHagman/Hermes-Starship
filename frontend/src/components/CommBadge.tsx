// The comm badge: how the Captain talks to the crew. Read-only in Milestone 0.
// You can pick who to hail and draft words, but Send never leaves the screen:
// free text is the one thing that reaches a model, and that arrives in H4.
import { useEffect, useRef, useState } from 'react';
import { RAIL, railColor } from '../lib/lookups';
import type { ShipView } from '../lib/ship';

type Kind = 'ask' | 'order' | 'approve' | 'deny';
const KINDS: { id: Kind; label: string }[] = [
  { id: 'ask', label: 'Ask' }, { id: 'order', label: 'Order' }, { id: 'approve', label: 'Approve' }, { id: 'deny', label: 'Deny' },
];

interface Props { ship: ShipView; target: string | null; onToast: (text: string) => void }

export function CommBadge({ ship, target, onToast }: Props) {
  const [kind, setKind] = useState<Kind>('ask');
  const [allHands, setAllHands] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [preset, setPreset] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Who the badge speaks to: everyone, the station you last opened, or Number One.
  const to = allHands ? ship.station('lounge') : ship.station(target ?? 'xo') ?? ship.station('xo');
  const toIsPlace = to?.kind !== 'station';
  const dest = toIsPlace && !allHands ? ship.station('xo') : to;
  const off = dest ? ship.off(dest) : null;
  const hails = ship.data.orders.orders.filter((o) => o.state === 'awaiting-captain');

  const presets: string[] = kind === 'ask' ? ['Status report', "What's in flight?", 'Anything for me?']
    : kind === 'order' ? (dest?.activeOrder ? [`Follow up ${dest.activeOrder}`, 'Run the next card'] : ['Run the next card'])
    : hails.map((h) => h.id);
  const tier = kind === 'ask' ? 0 : kind === 'order' ? 1 : Math.max(0, ...hails.map((h) => h.tier));
  const words = draft.trim() || preset;

  useEffect(() => { setPreset(null); }, [kind]);
  useEffect(() => { if (open) textRef.current?.focus(); }, [open]);

  const send = () => {
    if (!words) return;
    onToast(`Comms open in H4. Nothing was sent to ${allHands ? 'all hands' : dest?.short ?? 'Number One'}.`);
    setDraft(''); setPreset(null); setOpen(false);
  };

  const railNote = allHands ? 'Briefing Room · every station on its own rail'
    : off ? `${dest?.short} is off duty (${off}): this would queue for the acting head`
    : toIsPlace ? `${to?.short} is a place, so this goes to Number One`
    : `Goes to ${dest?.short} on ${RAIL[dest?.rail ?? 'mixed'].legend}`;

  return (
    <div className="badgewrap">
      <div className={'badge' + (open ? ' lifted' : '')} role="region" aria-label="Comm badge">
        <div className="brow">
          <svg className="bicon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 L20 21 L12 16.5 L4 21 Z" /></svg>
          <span className="bname">
            <span className="btitle">COMM BADGE</span>
            <span className="bsub mono">READ-ONLY · OPENS IN H4</span>
          </span>
          <span className="mono blabel">TO</span>
          <span className="bto" style={{ '--c': railColor(allHands ? 'mixed' : dest?.rail ?? 'local') } as React.CSSProperties}>
            <span className="dot" />{allHands ? 'All hands' : to?.short ?? 'Number One'}
          </span>
          <button type="button" className="bchip" aria-pressed={allHands} onClick={() => setAllHands(!allHands)}>All hands</button>
          <span className="bsep" aria-hidden="true" />
          {KINDS.map((k) => (
            <button key={k.id} type="button" className={'bkind bk-' + k.id} aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>{k.label}</button>
          ))}
          <span className="bsep" aria-hidden="true" />
          <div className="bpresets">
            {presets.length === 0 && <span className="bempty">Nothing waits for you.</span>}
            {presets.map((p) => (
              <button key={p} type="button" className="bpreset" aria-pressed={preset === p} onClick={() => setPreset(preset === p ? null : p)}>{p}</button>
            ))}
            <span className="bnote" style={{ color: off ? 'var(--bad)' : 'var(--text-muted)' }}>{railNote}</span>
          </div>
          <span className="btier" style={{ '--c': `var(--tier-${tier})` } as React.CSSProperties}>TIER {tier}</span>
          <button type="button" className="bwritebtn" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z M14 6l4 4" /></svg>{open ? 'Close' : 'Write'}
          </button>
          <button type="button" className="bsend" aria-disabled={!words} onClick={send}>
            {kind === 'approve' ? 'Approve' : kind === 'deny' ? 'Deny' : 'Send'}
          </button>
        </div>
        {open && (
          <div className="bwrite">
            <textarea ref={textRef} className="btext" rows={3} maxLength={500} value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send(); }}
              placeholder={`Your words to ${allHands ? 'all hands' : dest?.short ?? 'Number One'}`} aria-label="Your own words" />
            <div className="bmeta mono"><span>Passed through word for word. Nothing leaves this screen yet.</span><span>{draft.length}/500 · Ctrl+Enter sends · Esc closes</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
