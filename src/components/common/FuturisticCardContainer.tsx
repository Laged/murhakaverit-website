'use client';

import React, { type ReactNode } from 'react';

interface FuturisticCardContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Provides the futuristic card styling (borders, gradients, texture) without layout.
 * Children are responsible for their own layout and scrolling behavior.
 */
export function FuturisticCardContainer({ children, className = '' }: FuturisticCardContainerProps) {
  const wrapperClassName = ["relative h-full w-full max-w-6xl", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      <section
        className="futuristic-card relative h-full w-full overflow-hidden shadow-2xl"
        style={{
          '--corner-cut': '25px',
          '--border-width': '3px',
          background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.95), rgba(156, 163, 175, 0.95), rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6))',
          clipPath: 'polygon(0 var(--corner-cut), var(--corner-cut) 0, 100% 0, 100% calc(100% - var(--corner-cut)), calc(100% - var(--corner-cut)) 100%, 0 100%)',
          padding: 'var(--border-width)'
        } as React.CSSProperties & { [key: string]: string }}
      >
        <div
          className="h-full w-full relative"
          style={{
            background: '#020617',
            clipPath: 'polygon(0 calc(var(--corner-cut) - var(--border-width)), calc(var(--corner-cut) - var(--border-width)) 0, 100% 0, 100% calc(100% - calc(var(--corner-cut) - var(--border-width))), calc(100% - calc(var(--corner-cut) - var(--border-width))) 100%, 0 100%)'
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% -10%, rgba(56,189,248,0.45), transparent 55%),
                radial-gradient(circle at 85% 10%, rgba(147,197,253,0.35), transparent 55%),
                linear-gradient(135deg, #020617 0%, #0f172a 35%, #020617 65%, #010414 100%)
              `,
              clipPath: 'polygon(0 calc(var(--corner-cut) - var(--border-width)), calc(var(--corner-cut) - var(--border-width)) 0, 100% 0, 100% calc(100% - calc(var(--corner-cut) - var(--border-width))), calc(100% - calc(var(--corner-cut) - var(--border-width))) 100%, 0 100%)'
            }}
          >
            {/* Texture layer with dot pattern */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                mixBlendMode: 'screen',
                opacity: 0.9,
              }}
            />

            {/* Content slot - children control their own layout */}
            <div className="absolute inset-0">
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
