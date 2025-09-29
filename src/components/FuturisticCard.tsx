'use client';

import React, { useEffect, useRef, type ReactElement } from 'react';
import { ReadableContent } from './ReadableContent';
import { useScrollStore } from '@/store/scrollStore';

type MetadataMap = Record<string, string>;

interface FuturisticCardProps {
  title: string;
  className?: string;
  metadata?: MetadataMap;
  children?: React.ReactNode;
}

export function FuturisticCard({ title, className = '', metadata, children }: FuturisticCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use Zustand store for global scroll state
  const { 
    scrollProgress, 
    isAtBottom,
    setScrollProgress, 
    setIsAtBottom, 
    setIsScrolling,
    setCardTitle,
    resetScroll
  } = useScrollStore();

  useEffect(() => {
    // Set card title in store for other components to use
    setCardTitle(title);
    
    // Reset scroll state when component mounts
    return () => {
      resetScroll();
    };
  }, [title, setCardTitle, resetScroll]);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const applyScrollMetrics = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);

      if (maxScroll <= 0) {
        setScrollProgress(0);
        setIsAtBottom(false);
        setIsScrolling(false);
        return;
      }

      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      setScrollProgress(progress);

      // Consider "at bottom" when within 10px of the bottom
      setIsAtBottom(scrollTop >= maxScroll - 10);
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      applyScrollMetrics();
      
      // Clear existing timeout and set new one
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Stop scrolling detection after 150ms of no scroll
    };

    contentElement.addEventListener('scroll', handleScroll);

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
    
    // Also listen for resize events to recalculate
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(applyScrollMetrics, 100); // Delay to ensure layout is complete
    });
    resizeObserver.observe(contentElement);

    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handlePageScroll);
      window.removeEventListener('keydown', handleKeyScroll);
      resizeObserver.disconnect();
      clearTimeout(scrollTimeout);
    };
  }, [setScrollProgress, setIsAtBottom, setIsScrolling]);

  // Sophisticated metadata parsing like CombinedCard
  const rawTime = metadata
    ? metadata["AIKA"] ?? metadata["aika"] ?? metadata["Aika"]
    : undefined;
  const rawBuilding = metadata
    ? metadata["RAKENNUS"] ?? metadata["rakennus"] ?? metadata["Rakennus"]
    : undefined;
  const rawFloor = metadata
    ? metadata["KERROS"] ?? metadata["kerros"] ?? metadata["Kerros"]
    : undefined;
  const rawLocation = metadata
    ? metadata["SIJAINTI"] ??
      metadata["sijainti"] ??
      metadata["SIJANTI"] ??
      metadata["sijanti"]
    : undefined;

  let formattedTime: string | undefined;
  let isoTime: string | undefined;

  if (rawTime && rawTime.trim().length > 0) {
    const parsed = new Date(rawTime);

    if (!Number.isNaN(parsed.valueOf())) {
      formattedTime = new Intl.DateTimeFormat("fi-FI", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Helsinki",
      }).format(parsed);
      isoTime = parsed.toISOString();
    } else {
      formattedTime = rawTime.trim();
    }
  }

  const building = rawBuilding && rawBuilding.trim().length > 0 ? rawBuilding.trim() : undefined;
  const floor = rawFloor && rawFloor.trim().length > 0 ? rawFloor.trim() : undefined;
  const location = rawLocation && rawLocation.trim().length > 0 ? rawLocation.trim() : undefined;

  const metadataLines = [
    formattedTime
      ? ({
          key: "time",
          element: <time key="time" dateTime={isoTime}>{formattedTime}</time>,
        } as const)
      : null,
    building ? ({ key: "building", element: <span key="building">{building}</span> } as const) : null,
    floor ? ({ key: "floor", element: <span key="floor">{floor}</span> } as const) : null,
    location ? ({ key: "location", element: <span key="location">{location}</span> } as const) : null,
  ].filter(Boolean) as Array<{ key: string; element: ReactElement }>;

  const wrapperClassName = ["relative h-full w-full max-w-6xl", className]
    .filter(Boolean)
    .join(" ");

  // Calculate scrollbar fill (fills from top based on progress)
  const scrollFillHeight = scrollProgress * 100;

  return (
    <div className={wrapperClassName}>
      <section 
        className="futuristic-card relative h-full w-full overflow-hidden shadow-2xl"
        style={{
          // CSS variables for responsive design
          '--corner-cut': '25px', // Mobile: smaller cutout
          '--border-width': '3px',
          '--border-opacity': '0.95',
          '--texture-size': '30px',
          '--accent-size': '32px', // Mobile: smaller accent
          // White border layer background
          background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.95), rgba(156, 163, 175, 0.95), rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6))',
          clipPath: 'polygon(0 var(--corner-cut), var(--corner-cut) 0, 100% 0, 100% calc(100% - var(--corner-cut)), calc(100% - var(--corner-cut)) 100%, 0 100%)',
          padding: 'var(--border-width)'
        } as React.CSSProperties & { [key: string]: string }}
      >
        {/* Inner content area with gradients */}
        <div
          className="h-full w-full relative"
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
              backgroundSize: 'var(--texture-size) var(--texture-size)',
              mixBlendMode: 'screen',
              opacity: 0.9,
              clipPath: 'polygon(0 calc(var(--corner-cut) - var(--border-width)), calc(var(--corner-cut) - var(--border-width)) 0, 100% 0, 100% calc(100% - calc(var(--corner-cut) - var(--border-width))), calc(100% - calc(var(--corner-cut) - var(--border-width))) 100%, 0 100%)'
            }}
          />

          {/* L-shaped corner accents - only top-right and bottom-left */}
          {/* Top-right L-shaped accent */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '7px', // Mobile positioning (half inset)
            width: 'var(--accent-size)',
            height: 'var(--accent-size)',
            zIndex: 10
          }} className="accent-top-right">
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 'var(--accent-size)',
              height: '2px',
              background: 'rgba(255, 255, 255, 0.4)',
              filter: 'brightness(1.1) drop-shadow(0 -3px 5px rgba(255,255,255,0.25)) drop-shadow(3px 0 5px rgba(255,255,255,0.25))'
            }} />
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '2px',
              height: 'var(--accent-size)',
              background: 'rgba(255, 255, 255, 0.4)',
              filter: 'brightness(1.1) drop-shadow(0 -3px 5px rgba(255,255,255,0.25)) drop-shadow(3px 0 5px rgba(255,255,255,0.25))'
            }} />
          </div>
          
          {/* Bottom-left L-shaped accent */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '7px', // Mobile positioning (half inset)
            width: 'var(--accent-size)',
            height: 'var(--accent-size)',
            zIndex: 10
          }} className="accent-bottom-left">
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 'var(--accent-size)',
              height: '2px',
              background: 'rgba(255, 255, 255, 0.4)',
              filter: 'brightness(1.1) drop-shadow(0 3px 5px rgba(255,255,255,0.25)) drop-shadow(-3px 0 5px rgba(255,255,255,0.25))'
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '2px',
              height: 'var(--accent-size)',
              background: 'rgba(255, 255, 255, 0.4)',
              filter: 'brightness(1.1) drop-shadow(0 3px 5px rgba(255,255,255,0.25)) drop-shadow(-3px 0 5px rgba(255,255,255,0.25))'
            }} />
          </div>

          {/* Content area - single scrollable area containing header and content */}
          <div
            ref={contentRef}
            className="futuristic-card-content card-content-padding absolute inset-0 overflow-y-auto text-white"
            data-card-scroll
          >
            
            {/* Header Section - now inside scrollable content */}
            <div className="mb-4 pb-3 min-h-10 flex flex-col justify-center" style={{ margin: 0 }}>
              <h1
                className="mb-2 text-white"
                style={{ 
                  fontFamily: 'var(--font-audiowide)', 
                  fontSize: 'clamp(1.25rem, 4vw, 2.5rem)',
                  margin: '0 0 8px 0',
                  textShadow: `
                    0 0 8px rgba(255,255,255,0.8),
                    0 0 16px rgba(255,255,255,0.4),
                    0 0 24px rgba(255,255,255,0.2)
                  `,
                  filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))',
                  animation: 'simpleGlow 1s ease-in-out infinite alternate'
                }}
              >
                {title}
              </h1>
              
              {metadataLines.length > 0 && (
                <div className="mt-1.5 pb-2 border-b border-white/10" style={{ margin: 0, padding: '6px 0 8px 0' }}>
                  {metadataLines.map(({ key, element }) => (
                    <div key={key} className="flex items-center gap-2 whitespace-normal" style={{ 
                      margin: '2px 0',
                      fontSize: 'clamp(12px, 2.2vw, 14px)',
                      color: 'rgba(255,255,255,0.7)',
                      letterSpacing: '0.12em'
                    }}>
                      {element}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Content area */}
            <div style={{ margin: 0 }}>
              <ReadableContent>
                {children}
              </ReadableContent>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Scrollbar Indicator - outside card like CombinedCard */}
      <div className="scroll-indicator">
        <div className="scroll-track"></div>
        <div 
          className={`scroll-thumb ${isAtBottom ? 'at-bottom' : ''}`}
          style={{
            height: `${scrollFillHeight}%`,
            top: '0%'
          }}
        ></div>
      </div>
    </div>
  );
}