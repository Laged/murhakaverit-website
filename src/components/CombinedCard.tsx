'use client';

import { useEffect, useRef, useState, type ReactElement } from 'react';

type MetadataMap = Record<string, string>;

interface CombinedCardProps {
  title: string;
  className?: string;
  metadata?: MetadataMap;
  children?: React.ReactNode;
}

export function CombinedCard({ title, className = '', metadata, children }: CombinedCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const applyScrollMetrics = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);

      if (maxScroll <= 0) {
        setScrollProgress(0);
        setIsAtBottom(false);
        return;
      }

      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      setScrollProgress(progress);

      // Consider "at bottom" when within 10px of the bottom
      setIsAtBottom(scrollTop >= maxScroll - 10);
    };

    const handleScroll = () => {
      applyScrollMetrics();
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

    // Initial calculation with delay to ensure content is rendered
    // setTimeout(applyScrollMetrics, 50);
    // applyScrollMetrics();

    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handlePageScroll);
      window.removeEventListener('keydown', handleKeyScroll);
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate scrollbar fill (fills from top based on progress)
  const scrollFillHeight = scrollProgress * 100;
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

  return (
    <div className={wrapperClassName}>
      <section className="combined-card relative h-full w-full overflow-hidden shadow-2xl">
      {/* Layer 1: White Border (Largest) */}
      <div className="border-layer" aria-hidden="true" />
      
      {/* Layer 2: Background with Gradient (Smaller) */}
      <div className="background-layer" aria-hidden="true" />
      
      {/* Layer 3: Texture & Accents (Smaller still) */}
      <div className="texture-accent-layer" aria-hidden="true" />
      
      {/* Layer 4: Typography Content with Header Section inside scrollable area */}
      <div className="typography-layer" style={{ padding: 0, margin: 0 }}>
        {/* Scrollable Content Section containing header and content */}
        <div className="typography-content" ref={contentRef} data-card-scroll style={{ padding: 0, margin: 0, position: 'absolute', inset: 0 }}>
          <div className="layer-text card-content-padding" style={{ margin: 0 }}>
            {/* Header Section - now inside scrollable content */}
            <div className="content-header" style={{ margin: 0 }}>
              <h1
                className="layer-title"
                style={{ fontFamily: 'var(--font-audiowide)', margin: 0, padding: 0 }}
              >
{title}
              </h1>
              {metadataLines.length > 0 ? (
                <div className="header-meta" style={{ margin: 0, padding: 0 }}>
                  {metadataLines.map(({ key, element }) => (
                    <div key={key} className="header-meta-item" style={{ margin: 0, padding: 0 }}>
                      {element}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div style={{ margin: 0 }}>
              {children}
            </div>
          </div>
        </div>
        
      </div>
      </section>

      {/* Custom Scrollbar Indicator - outside card */}
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
