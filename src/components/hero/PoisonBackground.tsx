'use client';

import './poison-background.css';

type PoisonBackgroundProps = {
  children: React.ReactNode;
};

export function PoisonBackground({ children }: PoisonBackgroundProps) {
  return (
    <div className="poison-bg flex items-center justify-center w-screen h-screen overflow-hidden p-0 m-0">
      <div className="wave-left" />
      <div className="wave-right" />
      {children}
    </div>
  );
}
