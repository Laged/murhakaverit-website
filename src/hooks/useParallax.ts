import { useEffect, useRef } from 'react';

interface ParallaxOptions {
  speed?: number; // Multiplier for scroll speed (0.5 = half speed, 1.5 = faster)
  disabled?: boolean; // Disable parallax (useful for mobile)
}

/**
 * useParallax Hook
 *
 * Creates a parallax scrolling effect on an element.
 * Element moves at a different speed than the scroll speed.
 *
 * @param speed - Scroll speed multiplier (default: 0.5)
 * @param disabled - Disable parallax effect (default: false)
 *
 * @example
 * const ref = useParallax({ speed: 0.3 });
 * return <div ref={ref}>Parallax content</div>
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {}
) {
  const { speed = 0.5, disabled = false } = options;
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (disabled || !elementRef.current) return;

    const element = elementRef.current;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const offset = scrollY * speed;

          // Use transform for GPU acceleration
          element.style.transform = `translate3d(0, ${offset}px, 0)`;

          ticking = false;
        });

        ticking = true;
      }
    };

    // Initial position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, disabled]);

  return elementRef;
}
