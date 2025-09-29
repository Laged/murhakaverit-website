'use client';

import { useFontSize } from './FontSizeContext';

export function FontSizeControls() {
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

  return (
    <div className="flex items-center gap-1 px-2 py-1 md:gap-1 md:px-3 rounded-md bg-black/20 border border-white/10">
      <button
        onClick={decreaseFontSize}
        className="px-1.5 py-1 md:px-2 md:py-1 text-white/80 md:hover:text-white text-sm md:text-sm font-mono transition-colors"
        disabled={fontSize <= 0.8}
        aria-label="Decrease font size"
      >
        -
      </button>
      
      <span className="px-1.5 py-1 md:px-2 md:py-1 text-white/60 text-xs font-mono min-w-[20px] md:min-w-[24px] text-center">
        A
      </span>
      
      <button
        onClick={increaseFontSize}
        className="px-1.5 py-1 md:px-2 md:py-1 text-white/80 md:hover:text-white text-sm md:text-sm font-mono transition-colors"
        disabled={fontSize >= 1.4}
        aria-label="Increase font size"
      >
        +
      </button>
    </div>
  );
}