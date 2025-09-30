'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    // Listen to scroll progress events from FuturisticCard
    const handleScrollProgress = (e: Event) => {
      const customEvent = e as CustomEvent<{ progress: number; isAtBottom: boolean }>;
      setScrollProgress(customEvent.detail.progress);
      setIsAtBottom(customEvent.detail.isAtBottom);
    };

    window.addEventListener('card-scroll-progress', handleScrollProgress);

    return () => {
      window.removeEventListener('card-scroll-progress', handleScrollProgress);
    };
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