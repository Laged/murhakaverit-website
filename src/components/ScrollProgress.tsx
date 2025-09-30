'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const updateScrollProgress = () => {
      // Find the card content container
      const contentElement = document.querySelector('[data-card-scroll]') as HTMLElement;
      if (!contentElement) return;

      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);

      if (maxScroll <= 0) {
        setScrollProgress(0);
        setIsAtBottom(false);
        return;
      }

      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      setScrollProgress(progress);
      setIsAtBottom(scrollTop >= maxScroll - 10);
    };

    // Update on scroll
    const contentElement = document.querySelector('[data-card-scroll]');
    if (contentElement) {
      contentElement.addEventListener('scroll', updateScrollProgress);

      // Initial update
      updateScrollProgress();

      // Update on resize
      const resizeObserver = new ResizeObserver(updateScrollProgress);
      resizeObserver.observe(contentElement);

      return () => {
        contentElement.removeEventListener('scroll', updateScrollProgress);
        resizeObserver.disconnect();
      };
    }
  }, []);

  const scrollFillWidth = scrollProgress * 100;

  return (
    <div className="scroll-indicator-horizontal">
      <div className="scroll-track-horizontal"></div>
      <div
        className={`scroll-thumb-horizontal ${isAtBottom ? 'at-bottom' : ''}`}
        style={{
          width: `${scrollFillWidth}%`,
          left: '0%'
        }}
      />
    </div>
  );
}