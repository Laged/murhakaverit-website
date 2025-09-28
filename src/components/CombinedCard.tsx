'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react';

type MetadataMap = Record<string, string>;

interface CombinedCardProps {
  title: string;
  className?: string;
  metadata?: MetadataMap;
}

export function CombinedCard({ title, className = '', metadata }: CombinedCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [headerHideProgress, setHeaderHideProgress] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);
  const [metadataHeight, setMetadataHeight] = useState(0);
  const hideTargetRef = useRef(0);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    let smoothFrame = 0;

    function smoothToTarget() {
      smoothFrame = 0;
      let shouldContinue = false;

      setHeaderHideProgress((previous) => {
        const target = hideTargetRef.current;
        const delta = target - previous;

        if (Math.abs(delta) < 0.005) {
          return target;
        }

        shouldContinue = true;
        return previous + delta * 0.25;
      });

      if (shouldContinue) {
        scheduleSmooth();
      }
    }

    const scheduleSmooth = () => {
      if (smoothFrame !== 0) {
        return;
      }

      smoothFrame = window.requestAnimationFrame(smoothToTarget);
    };

    const applyScrollMetrics = () => {

      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);

      const nearTop = scrollTop <= 1;

      if (maxScroll <= 0 || nearTop) {
        setScrollProgress(0);
        setIsAtBottom(false);
        setHeaderHideProgress(0);
        hideTargetRef.current = 0;
        return;
      }

      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      setScrollProgress(progress);

      // Consider "at bottom" when within 10px of the bottom
      setIsAtBottom(scrollTop >= maxScroll - 10);

      if (scrollTop <= 0) {
        hideTargetRef.current = 0;
        setHeaderHideProgress(0);
        return;
      }

      const revealDistance = 48;
      const hideDistance = 220;

      let nextHide: number;
      if (scrollTop <= revealDistance) {
        nextHide = Math.min(1, Math.max(0, scrollTop / Math.max(revealDistance, 1)));
      } else if (scrollTop >= hideDistance) {
        nextHide = 1;
      } else {
        nextHide = (scrollTop - revealDistance) / (hideDistance - revealDistance);
      }

      hideTargetRef.current = Math.min(1, Math.max(0, nextHide));
      scheduleSmooth();
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
    setTimeout(applyScrollMetrics, 50);
    applyScrollMetrics();

    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handlePageScroll);
      window.removeEventListener('keydown', handleKeyScroll);
      resizeObserver.disconnect();
      if (smoothFrame !== 0) {
        window.cancelAnimationFrame(smoothFrame);
      }
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

  useEffect(() => {
    const updateHeaderHeight = () => {
      const element = headerRef.current;
      const titleElement = titleRef.current;

      if (!element) {
        setHeaderHeight(0);
        setTitleHeight(0);
        setMetadataHeight(0);
        return;
      }

      const headerRect = element.getBoundingClientRect();
      const titleRect = titleElement?.getBoundingClientRect();
      const metadataElement = element.querySelector<HTMLElement>('.header-meta');
      const metadataRect = metadataElement?.getBoundingClientRect();

      setHeaderHeight(headerRect.height);
      setTitleHeight(titleRect?.height ?? 0);

      setMetadataHeight((previous) => {
        const measured = metadataRect?.height ?? 0;

        if (measured > 1) {
          return measured;
        }

        if (previous > 0) {
          return previous;
        }

        if (titleRect) {
          return Math.max(0, headerRect.height - titleRect.height);
        }

        return measured;
      });
    };

    updateHeaderHeight();

    const element = headerRef.current;

    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    observer.observe(element);
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [metadataLines.length]);

  const effectiveMetadataHeight = metadataHeight || Math.max(0, headerHeight - titleHeight);

  const metadataDynamicStyle: CSSProperties = {
    opacity: 1 - Math.min(headerHideProgress * 1.15, 1),
    transform:
      effectiveMetadataHeight > 0
        ? `translateY(-${effectiveMetadataHeight * headerHideProgress}px)`
        : undefined,
    maxHeight:
      headerHideProgress <= 0.02
        ? undefined
        : effectiveMetadataHeight > 0
          ? `${Math.max(effectiveMetadataHeight * (1 - headerHideProgress), 0)}px`
          : undefined,
    pointerEvents: headerHideProgress >= 0.95 ? 'none' : undefined,
  };

  const headerDynamicStyle: CSSProperties = {
    marginBottom:
      headerHeight > 0 ? -headerHeight * headerHideProgress : undefined,
    transform:
      headerHeight > 0
        ? `translateY(-${Math.pow(headerHideProgress, 0.85) * headerHeight}px)`
        : undefined,
    opacity: 1 - Math.min(headerHideProgress * 1.05, 1),
    pointerEvents: headerHideProgress >= 0.98 ? 'none' : undefined,
  };

  const headerClassName =
    headerHideProgress >= 0.98
      ? 'typography-header header-hidden'
      : 'typography-header';

  return (
    <div className="relative h-full w-full max-w-6xl">
      <section
        className={`combined-card relative h-full w-full overflow-hidden shadow-2xl ${className}`.trim()}
      >
      {/* Layer 1: White Border (Largest) */}
      <div className="border-layer" aria-hidden="true" />
      
      {/* Layer 2: Background with Gradient (Smaller) */}
      <div className="background-layer" aria-hidden="true" />
      
      {/* Layer 3: Texture & Accents (Smaller still) */}
      <div className="texture-accent-layer" aria-hidden="true" />
      
      {/* Layer 4: Typography Content with Header/Content/Footer sections */}
      <div className="typography-layer">
        {/* Header Section */}
        <div ref={headerRef} className={headerClassName} style={headerDynamicStyle}>
          <div className="header-stack">
            <h1
              ref={titleRef}
              className="layer-title"
              style={{ fontFamily: 'var(--font-audiowide)' }}
            >
              {title}
            </h1>
            {metadataLines.length > 0 ? (
              <div className="header-meta" style={metadataDynamicStyle}>
                {metadataLines.map(({ key, element }) => (
                  <div key={key} className="header-meta-item">
                    {element}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Content Section */}
        <div className="typography-content" ref={contentRef} data-card-scroll>
          <div className="layer-text">
            <p>A sophisticated React component featuring animated borders, notched corners, and immersive scroll functionality for modern web applications.</p>
            
            <h2>Features</h2>
            <ul>
              <li><strong>4-Layer Design System</strong>: Animated gradient borders, textured backgrounds, and precise geometric shapes</li>
              <li><strong>Scroll Hijacking</strong>: Full-screen immersive experience that captures all page scroll events</li>
              <li><strong>Custom Scrollbar</strong>: Visual progress indicator positioned outside the card</li>
              <li><strong>Responsive Design</strong>: Mobile-first approach with optimized typography scaling</li>
              <li><strong>Accessibility</strong>: WCAG AA compliance with motion preference support</li>
              <li><strong>TypeScript</strong>: Full type safety and IntelliSense support</li>
            </ul>
            
            <h2>Installation</h2>
            <p>Copy the component files: <code>src/app/components/CombinedCard.tsx</code> and <code>src/app/layers.css</code></p>
            
            <p>Install required dependencies: <code>npm install react @types/react</code></p>
            
            <p>Ensure you have the required fonts in your layout by importing Audiowide and Work_Sans from next/font/google.</p>
            
            <h2>Basic Usage</h2>
            <p>Import the CombinedCard component and layers.css file. Wrap it in a full-screen black container with flexbox centering for the immersive experience.</p>
            
            <h2>Props</h2>
            <p>The component accepts a required <strong>title</strong> string, optional <strong>className</strong> for additional CSS classes, and an optional <strong>metadata</strong> map for fields such as AIKA (timestamp) and SIJAINTI (location).</p>
            
            <h2>Customization</h2>
            <p>The component uses CSS custom properties for easy theming. You can customize corner-cut size (50px), border-width (3px), border-opacity (0.95), texture-size (30px), and accent-size (64px).</p>
            
            <p>To customize the content, edit the layer-text section. The component supports paragraphs with optimal line length (65 characters), headings with consistent hierarchy, bullet points with custom markers, and blockquotes for emphasis.</p>
            
            <h2>Scroll Behavior</h2>
            <p>The component hijacks all page scroll events. To disable this behavior, remove the wheel and keyboard event listeners from the useEffect hook.</p>
            
            <h2>Browser Support</h2>
            <p>Modern browsers with CSS Grid and clip-path support are required. The component uses hardware acceleration for smooth animations and provides graceful degradation for reduced motion preferences.</p>
            
            <h2>Performance</h2>
            <p>Features hardware-accelerated CSS animations, efficient scroll event handling with ResizeObserver, minimal DOM manipulation, and optimized for 60fps animations.</p>
            
            <blockquote>
              Perfect for dashboards, data visualization, and modern web applications requiring sophisticated visual design.
            </blockquote>
            
            <p>This component is provided as-is for educational and development purposes. The 4-layer design architecture creates depth and visual interest while maintaining excellent performance through modern CSS techniques.</p>
            
            <p>The scroll hijacking feature captures all page scroll events and redirects them to the card&apos;s internal content, creating an app-like single-page experience that feels immersive and engaging.</p>
          </div>
        </div>
        
        {/* Footer Section */}
        <div className="typography-footer" />
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
