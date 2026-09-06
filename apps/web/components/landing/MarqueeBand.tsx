import React from 'react';
import { T } from './tokens';

export function MarqueeBand({ items }: { items: string[] }) {
  return (
    <section style={{
      marginTop: 16, padding: '24px 0',
      borderTop: `1px solid rgba(244,240,232,0.05)`,
      borderBottom: `1px solid rgba(244,240,232,0.05)`,
      background: 'rgba(244,240,232,0.015)', overflow: 'hidden',
    }}>
      <div style={{
        overflow: 'hidden',
        maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
      }}>
        <div style={{
          display: 'flex', gap: 56, width: 'max-content',
          animation: 'scroll-x 32s linear infinite',
          fontFamily: T.serif, fontSize: 56, lineHeight: 1.25, letterSpacing: '-0.02em',
          color: T.inkDim,
        }}>
          {[0, 1].map((dup) => (
            <span key={dup} style={{ display: 'flex', alignItems: 'center', gap: 56, flexShrink: 0 }}>
              {items.map((phrase, i) => (
                <React.Fragment key={i}>
                  <span style={i % 2 === 1 ? { fontStyle: 'italic', color: T.tealLight } : undefined}>{phrase}</span>
                  <span style={{ color: T.tealMid }}>✶</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
