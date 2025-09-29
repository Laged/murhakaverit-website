'use client';

import { useFontSize } from './FontSizeContext';

interface ReadableContentProps {
  children: React.ReactNode;
}

export function ReadableContent({ children }: ReadableContentProps) {
  const { fontSize } = useFontSize();

  return (
    <div 
      className="readable-content"
      style={{
        // Mobile typography optimized for long-form readability with dynamic scaling
        fontFamily: 'var(--font-body)',
        fontSize: `${16 * fontSize}px`, // Dynamic base size
        lineHeight: '1.6',
        textAlign: 'left',
        maxWidth: '65ch',
        color: 'rgba(255,255,255,0.95)'
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .readable-content p {
            margin-bottom: 12px;
            max-width: 65ch;
            text-align: left;
          }
          
          @media (min-width: 768px) {
            .readable-content p {
              margin-bottom: 24px;
            }
          }
          
          .readable-content p:last-child {
            margin-bottom: 0;
          }
          
          .readable-content h1,
          .readable-content h2,
          .readable-content .subhead {
            font-family: var(--font-audiowide);
            font-size: ${18 * fontSize}px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            margin: 32px 0 16px 0;
            letter-spacing: 0.05em;
            text-shadow: 0 0 2px rgba(255,255,255,0.2);
          }
          
          @media (min-width: 414px) {
            .readable-content h1,
            .readable-content h2,
            .readable-content .subhead {
              font-size: ${19 * fontSize}px;
            }
          }
          
          @media (min-width: 768px) {
            .readable-content h1,
            .readable-content h2,
            .readable-content .subhead {
              font-size: ${20 * fontSize}px;
            }
          }
          
          .readable-content ul {
            margin: 16px 0 24px 20px;
            padding: 0;
          }
          
          .readable-content li {
            margin-bottom: 8px;
            line-height: 1.6;
            position: relative;
          }
          
          .readable-content li::marker {
            color: rgba(255,255,255,0.7);
            content: "▸ ";
          }
          
          .readable-content blockquote,
          .readable-content .pull-quote {
            margin: 32px 0;
            padding: 16px 20px;
            border-left: 3px solid rgba(255,255,255,0.6);
            background: rgba(255,255,255,0.03);
            font-style: italic;
            font-size: ${17.6 * fontSize}px; /* 1.1em equivalent */
            color: rgba(255,255,255,0.9);
            border-radius: 0 4px 4px 0;
          }
          
          .readable-content :focus-visible {
            outline: 2px solid rgba(255,255,255,0.8);
            outline-offset: 2px;
          }
        `
      }} />
      {children}
    </div>
  );
}