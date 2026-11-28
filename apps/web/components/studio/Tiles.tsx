import type { ComponentType, CSSProperties, ReactNode } from 'react';

export interface Tile {
  label: string; value: ReactNode; icon?: ComponentType<{ size?: number }>;
  tone?: 'bad' | 'good' | 'acc' | 'amber' | undefined;
  // Makes the tile a button (e.g. jump to the card it summarises).
  onClick?: () => void; hint?: string;
}

// A row of number tiles in one card, as at the top of the prototype's pages.
export function Tiles({ tiles, children }: { tiles: Tile[]; children?: ReactNode }) {
  const color = { bad: 'var(--bad)', good: 'var(--good)', acc: 'var(--accent)', amber: 'var(--t-amber-c)' };
  return (
    <section className="s-card">
      {children && <div className="s-pad" style={{ borderBottom: '1px solid var(--line)' }}>{children}</div>}
      <div className="s-kpis" style={{ '--kc': tiles.length } as CSSProperties}>
        {tiles.map(({ label, value, icon: Ic, tone, onClick, hint }) => {
          const body = (
            <>
              <span className="s-kl">{Ic && <Ic size={13} />}{label}</span>
              <span className="s-kv"><b style={tone ? { color: color[tone] } : undefined}>{value}</b></span>
            </>
          );
          return onClick
            ? <button key={label} type="button" className={`s-kpi s-kpi-btn${tone ? ` k-${tone}` : ''}`} onClick={onClick} title={hint} aria-label={hint ? `${label}: ${typeof value === 'string' || typeof value === 'number' ? value : ''}. ${hint}` : undefined}>{body}</button>
            : <div key={label} className={`s-kpi${tone === 'amber' ? ' k-amber' : ''}`}>{body}</div>;
        })}
      </div>
    </section>
  );
}
