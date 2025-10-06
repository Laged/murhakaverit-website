import React from 'react';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Paragraph Atom
 *
 * Styled paragraph component with consistent typography.
 * Uses Work Sans font from theme.
 *
 * @example
 * <Paragraph>Standard body text</Paragraph>
 * <Paragraph className="text-blood-red">Colored text</Paragraph>
 */
export function Paragraph({ children, className = '', style = {} }: ParagraphProps) {
  const combinedStyle = {
    fontFamily: 'var(--font-body)',
    ...style,
  };

  return (
    <p
      className={`text-white/90 leading-relaxed text-sm sm:text-base ${className}`}
      style={combinedStyle}
    >
      {children}
    </p>
  );
}
