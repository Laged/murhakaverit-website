'use client';

import { useParallax } from '@/hooks/useParallax';

type AnimatedLetterProps = {
  letter: string;
  index: number;
};

export function AnimatedLetter({ letter, index }: AnimatedLetterProps) {
  // Each letter gets a slightly different parallax speed
  // Creates a "wave" effect as you scroll
  // Speed ranges from 0.25 to 0.35 based on position
  const baseSpeed = 0.25;
  const speedVariation = 0.1;
  const letterSpeed = baseSpeed + (index % 13) * (speedVariation / 13);

  const letterRef = useParallax<HTMLSpanElement>({ speed: letterSpeed });

  return (
    <span
      ref={letterRef}
      className={`letter letter-${index} hover:scale-110 transition-transform duration-300`}
      style={{
        display: 'inline-block',
        willChange: 'transform'
      }}
    >
      {letter}
    </span>
  );
}
