import React from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  glow?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Heading Atom
 *
 * Basic heading component with optional glow effect.
 * Uses Audiowide font from theme.
 *
 * @example
 * <Heading level={1} glow>Main Title</Heading>
 * <Heading level={2} className="text-blood-red">Subtitle</Heading>
 */
export function Heading({
  level = 1,
  glow = false,
  children,
  className = '',
  style = {},
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const glowStyle: React.CSSProperties = glow
    ? {
        textShadow: `
          0 0 12px rgba(255,255,255,0.9),
          0 0 24px rgba(255,255,255,0.6),
          0 0 36px rgba(56,189,248,0.5),
          0 0 48px rgba(56,189,248,0.3)
        `,
        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.7))',
        animation: 'simpleGlow 1s ease-in-out infinite alternate',
      }
    : {};

  const combinedStyle = {
    fontFamily: 'var(--font-audiowide)',
    ...glowStyle,
    ...style,
  };

  return (
    <Tag className={`text-white ${className}`} style={combinedStyle}>
      {children}
    </Tag>
  );
}
