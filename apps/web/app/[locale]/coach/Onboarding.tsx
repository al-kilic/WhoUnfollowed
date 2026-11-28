'use client';

import { useState, type FormEvent } from 'react';
import type { CoachContent } from './content';
import { card, Choice, ErrorLine, eyebrow, input, label, PrimaryButton } from './ui';
import { T } from '@/components/landing/tokens';
import { track } from '@/lib/analytics';

type AccountType = 'personal' | 'creator' | 'business';

// First run of Pro AI: a few answers that become the first version of memory.md.
export function Onboarding({ c, locale, onDone }: { c: CoachContent; locale: string; onDone: () => void }) {
  const o = c.onboarding;
  const [accountType, setAccountType] = useState<AccountType>('creator');
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState('');
  const [whatYouPost, setWhatYouPost] = useState('');
  const [samples, setSamples] = useState<string[]>(['']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch('/api/ai/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountType, niche, goal, whatYouPost, voiceSamples: samples.map((s) => s.trim()).filter(Boolean), locale }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) { setError(c.errors.invalid); return; }
    track('onboarding-done', { account_type: accountType });
    onDone();
  }

  return (
    <form onSubmit={submit} style={card}>
      <div style={eyebrow}>{c.eyebrow}</div>
      <h2 style={{ fontFamily: T.serif, fontSize: 28, fontWeight: 400, margin: 0, color: T.ink }}>{o.title}</h2>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: T.inkDim }}>{o.intro}</p>

      <div style={label}>
        {o.accountType}
        <Choice name={o.accountType} value={accountType} onChange={setAccountType}
          options={(['personal', 'creator', 'business'] as const).map((v) => ({ value: v, label: o.types[v] }))} />
      </div>
      <label style={label} htmlFor="ob-niche">{o.niche}
        <input id="ob-niche" required maxLength={80} value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={o.nichePh} style={input} />
      </label>
      <label style={label} htmlFor="ob-goal">{o.goal}
        <input id="ob-goal" required maxLength={200} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder={o.goalPh} style={input} />
      </label>
      <label style={label} htmlFor="ob-post">{o.whatYouPost}
        <input id="ob-post" required maxLength={300} value={whatYouPost} onChange={(e) => setWhatYouPost(e.target.value)} placeholder={o.whatYouPostPh} style={input} />
      </label>

      <div style={label}>
        {o.voice}
        <span style={{ fontWeight: 400, color: T.inkDim }}>{o.voiceHelp}</span>
        {samples.map((s, i) => (
          <textarea key={i} id={`ob-voice-${i}`} aria-label={`${o.voicePh} ${i + 1}`} maxLength={2200} rows={2} value={s} placeholder={o.voicePh}
            onChange={(e) => setSamples((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))} style={{ ...input, resize: 'vertical' }} />
        ))}
        {samples.length < 5 && (
          <button type="button" onClick={() => setSamples((p) => [...p, ''])}
            style={{ alignSelf: 'flex-start', font: 'inherit', fontSize: 13, background: 'none', border: 'none', color: T.tealLight, cursor: 'pointer', padding: 0 }}>
            + {o.addSample}
          </button>
        )}
      </div>

      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: T.inkDim, padding: '10px 12px', borderRadius: 10, background: T.bgPanel }}>{o.fullExport}</p>
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: T.inkMute }}>{o.privacy}</p>
      <ErrorLine text={error} />
      <PrimaryButton type="submit" disabled={busy || !niche.trim() || !goal.trim() || !whatYouPost.trim()}>{busy ? c.working : o.submit}</PrimaryButton>
    </form>
  );
}
