'use client';

import { AnimatedLetter } from './AnimatedLetter';
import './animations.css';

export function AnimatedLogo() {
  const text = 'MURHA-KAVERIT';
  const letters = text.split('');

  return (
    <h1
      className="hero-text leading-none select-none whitespace-nowrap"
      style={{
        fontFamily: 'var(--font-creepster)',
        fontSize: 'min(28vw, 45vh)',
        color: 'white',
        margin: 0,
        padding: 0,
      }}
    >
      {letters.map((letter, index) => (
        <span key={index}>
          {letter === '-' && <br />}
          {letter !== '-' && <AnimatedLetter letter={letter} index={index} />}
        </span>
      ))}
    </h1>
  );
}
