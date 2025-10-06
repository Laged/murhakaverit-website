"use client";

import { useParallax } from '@/hooks/useParallax';
import "./crime-scene.css";

export function CrimeScene() {
  const text = "MURHA ON KIVEMPAA KAVEREIDEN KANSSA";

  // Subtle parallax - tape moves slightly faster than scroll (1.2x)
  const tapeRef = useParallax<HTMLDivElement>({ speed: 1.2 });

  return (
    <div ref={tapeRef} className="crime-scene" style={{ willChange: 'transform' }}>
      <div className="crime-scene-marquee">
        <div className="crime-scene-marquee-group">
          <div className="crime-scene-item crime-scene-item--text">
            <div className="crime-scene-border-top">
              <div className="crime-scene-border-content" />
            </div>
            <div className="crime-scene-text">{text}</div>
            <div className="crime-scene-border-bottom">
              <div className="crime-scene-border-content" />
            </div>
          </div>
          <div className="crime-scene-item crime-scene-item--spacer">
            <div className="crime-scene-border-top">
              <div className="crime-scene-border-content" />
            </div>
            <div className="crime-scene-text">{text}</div>
            <div className="crime-scene-border-bottom">
              <div className="crime-scene-border-content" />
            </div>
          </div>
        </div>
        <div className="crime-scene-marquee-group" aria-hidden="true">
          <div className="crime-scene-item crime-scene-item--text">
            <div className="crime-scene-border-top">
              <div className="crime-scene-border-content" />
            </div>
            <div className="crime-scene-text">{text}</div>
            <div className="crime-scene-border-bottom">
              <div className="crime-scene-border-content" />
            </div>
          </div>
          <div className="crime-scene-item crime-scene-item--spacer">
            <div className="crime-scene-border-top">
              <div className="crime-scene-border-content" />
            </div>
            <div className="crime-scene-text">{text}</div>
            <div className="crime-scene-border-bottom">
              <div className="crime-scene-border-content" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
