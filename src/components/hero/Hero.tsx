'use client';

import { AnimatedLogo } from './AnimatedLogo';

export function Hero() {
  return (
    <div
      className="flex items-center justify-center w-screen overflow-hidden p-0 m-0 bg-almost-black"
      style={{
        height: '98vh',
        backgroundImage: `linear-gradient(-45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(-45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 17%, transparent 17%, transparent 25%, #000 25%, #000 36%, transparent 36%, transparent 64%, #000 64%, #000 75%, transparent 75%, transparent 83%, #000 83%)`,
        backgroundSize: '3.75em 3.75em, 3.75em 3.75em, 3.75em 3.75em',
        backgroundPosition: '0 0, 1.875em 1.875em, 1.875em 1.875em'
      }}
    >
      <AnimatedLogo />
    </div>
  );
}
