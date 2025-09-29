'use client';

import { useEffect, useRef } from 'react';

interface ScrollableContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollableContent({ children, className = '', style = {} }: ScrollableContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    // Hijack page scroll to control card content
    const handlePageScroll = (e: WheelEvent) => {
      e.preventDefault(); // Prevent default page scrolling
      
      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      const maxScroll = scrollHeight - clientHeight;
      
      // Only scroll if there's content to scroll
      if (maxScroll > 0) {
        const scrollSpeed = 50; // Adjust for sensitivity
        const newScrollTop = Math.max(0, Math.min(maxScroll, scrollTop + e.deltaY * scrollSpeed / 100));
        contentElement.scrollTop = newScrollTop;
      }
    };

    // Hijack keyboard scrolling too
    const handleKeyScroll = (e: KeyboardEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      const maxScroll = scrollHeight - clientHeight;
      
      if (maxScroll <= 0) return;
      
      let scrollAmount = 0;
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          scrollAmount = e.key === 'PageDown' ? clientHeight * 0.8 : 50;
          break;
        case 'ArrowUp':
        case 'PageUp':
          scrollAmount = e.key === 'PageUp' ? -clientHeight * 0.8 : -50;
          break;
        case 'Home':
          contentElement.scrollTop = 0;
          e.preventDefault();
          return;
        case 'End':
          contentElement.scrollTop = maxScroll;
          e.preventDefault();
          return;
        default:
          return;
      }
      
      if (scrollAmount !== 0) {
        e.preventDefault();
        const newScrollTop = Math.max(0, Math.min(maxScroll, scrollTop + scrollAmount));
        contentElement.scrollTop = newScrollTop;
      }
    };

    // Add event listeners to window to hijack all scrolling
    window.addEventListener('wheel', handlePageScroll, { passive: false });
    window.addEventListener('keydown', handleKeyScroll);

    return () => {
      window.removeEventListener('wheel', handlePageScroll);
      window.removeEventListener('keydown', handleKeyScroll);
    };
  }, []);

  return (
    <div 
      ref={contentRef}
      className={`overflow-y-auto ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}