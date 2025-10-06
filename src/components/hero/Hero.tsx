'use client';

import { AnimatedLogo } from './AnimatedLogo';
import { useParallax } from '@/hooks/useParallax';

export function Hero() {
  // Logo moves slower (0.3x) - creates depth
  const logoRef = useParallax<HTMLDivElement>({ speed: 0.3 });

  // Background layer moves at medium speed (0.5x)
  const bgRef = useParallax<HTMLDivElement>({ speed: 0.5 });

  return (
    <div
      className="relative flex items-center justify-center w-screen overflow-hidden p-0 m-0"
      style={{ height: '98vh' }}
    >
      {/* Background layer - parallax enabled */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-almost-black"
        style={{
          backgroundImage: `linear-gradient(-45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(-45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 17%, transparent 17%, transparent 25%, #000 25%, #000 36%, transparent 36%, transparent 64%, #000 64%, #000 75%, transparent 75%, transparent 83%, #000 83%)`,
          backgroundSize: '3.75em 3.75em, 3.75em 3.75em, 3.75em 3.75em',
          backgroundPosition: '0 0, 1.875em 1.875em, 1.875em 1.875em',
          willChange: 'transform',
        }}
      />

      {/* Logo layer - slower parallax for depth */}
      <div
        ref={logoRef}
        className="relative z-10"
        style={{ willChange: 'transform' }}
      >
        <AnimatedLogo />
      </div>
    </div>
  );
}
