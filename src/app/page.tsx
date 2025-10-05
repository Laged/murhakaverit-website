'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes creepyFadeIn {
          0% {
            opacity: 0;
            filter: blur(10px);
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
          }
        }

        @keyframes bloodDrip {
          0%, 100% {
            text-shadow:
              0 0 30px rgba(220, 38, 38, 0.8),
              0 0 60px rgba(220, 38, 38, 0.5),
              0 10px 40px rgba(220, 38, 38, 0.3),
              0 0 10px rgba(34, 197, 94, 0.2);
          }
          50% {
            text-shadow:
              0 0 40px rgba(220, 38, 38, 0.9),
              0 0 80px rgba(220, 38, 38, 0.6),
              0 15px 50px rgba(220, 38, 38, 0.4),
              0 0 15px rgba(34, 197, 94, 0.3);
          }
        }

        .drip-effect {
          position: relative;
        }

        .drip-effect::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 30px;
          background: linear-gradient(to bottom,
            rgba(220, 38, 38, 0.9) 0%,
            rgba(220, 38, 38, 0.7) 50%,
            rgba(220, 38, 38, 0) 100%
          );
          border-radius: 0 0 3px 3px;
          animation: drip 3s ease-in-out infinite;
        }

        @keyframes drip {
          0%, 100% {
            height: 20px;
            opacity: 0.7;
          }
          50% {
            height: 40px;
            opacity: 1;
          }
        }

        /* Blood drips on specific letters */
        .letter-a::after,
        .letter-k::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 25px;
          background: linear-gradient(to bottom,
            rgba(220, 38, 38, 0.8) 0%,
            rgba(139, 0, 0, 0.6) 50%,
            rgba(139, 0, 0, 0) 100%
          );
          border-radius: 0 0 2px 2px;
          animation: drip 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .hero-text {
          animation: creepyFadeIn 2.5s ease-out forwards;
          opacity: 0;
        }

        .hero-text.visible {
          opacity: 1;
        }
      `}</style>

      <div className="flex items-center justify-center w-screen h-screen overflow-hidden">
        <Link
          href="/nkl-2068"
          className="text-center cursor-pointer hover:scale-105 transition-transform duration-500"
        >
          <h1
            className={`hero-text drip-effect leading-none select-none ${isVisible ? 'visible' : ''}`}
            style={{
              fontFamily: 'var(--font-creepster)',
              fontSize: 'clamp(6rem, 20vw, 18rem)',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(220,38,38,0.8) 50%, rgba(34,197,94,0.3) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.5)) drop-shadow(0 0 40px rgba(34, 197, 94, 0.2))',
              animation: 'bloodDrip 4s ease-in-out infinite',
            }}
          >
            <span style={{ position: 'relative', display: 'inline-block' }}>
              MURH<span className="letter-a" style={{ position: 'relative', display: 'inline-block' }}>A</span>-
            </span>
            <br />
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span className="letter-k" style={{ position: 'relative', display: 'inline-block' }}>K</span>AVERIT
            </span>
          </h1>
        </Link>
      </div>
    </>
  );
}
