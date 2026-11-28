import { Code2, KeyRound, MonitorSmartphone } from 'lucide-react';
import { AuthArt } from './AuthArt';
import { getAuthPanelCopy, type AuthVariant } from './authPanel.content';

// The story side of the sign-in screens: what this screen is for, the
// follower network art, a small "since your last export" card and three
// proof points that are true today. Decorative parts are hidden from screen
// readers; the text is real text.

const ICONS = [KeyRound, MonitorSmartphone, Code2];

export function AuthPanel({ locale, variant }: { locale: string; variant: AuthVariant }) {
  const c = getAuthPanelCopy(locale);
  const s = c.screens[variant];
  return (
    <aside className="a-panel" aria-label={s.eyebrow}>
      <div className="a-grid" aria-hidden />
      <div className="a-copy">
        <p className="a-eyebrow">{s.eyebrow}</p>
        <h2 className="a-ptitle">{s.title}</h2>
        <p className="a-pbody">{s.body}</p>
      </div>
      <div className="a-stage">
        <AuthArt label={c.art} />
        <div className="a-mini" aria-hidden>
          <p className="a-mini-t">{c.card.title}</p>
          {[['ana', 'left'], ['lens', 'left'], ['studio', 'new']].map(([h, k]) => (
            <p key={h} className="a-mini-r">
              <span className={`a-av ${k}`} />@{h}•••
              <b className={k}>{k === 'new' ? c.card.joined : c.card.left}</b>
            </p>
          ))}
        </div>
      </div>
      <ul className="a-proofs">
        {c.proofs.map((p, i) => {
          const Ic = ICONS[i]!;
          return <li key={p}><Ic size={15} aria-hidden />{p}</li>;
        })}
      </ul>
    </aside>
  );
}
