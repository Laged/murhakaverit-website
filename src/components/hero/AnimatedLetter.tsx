'use client';

type AnimatedLetterProps = {
  letter: string;
  index: number;
};

export function AnimatedLetter({ letter, index }: AnimatedLetterProps) {
  return (
    <span
      className={`letter letter-${index} hover:scale-110 transition-transform duration-300`}
      style={{ display: 'inline-block' }}
    >
      {letter}
    </span>
  );
}
