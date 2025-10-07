"use client";

import { Marquee } from "@/components/ui/marquee";
import "./crime-scene.css";

export function CrimeScene() {
  const text = "MURHA ON KIVEMPAA KAVEREIDEN KANSSA";

  return (
    <div className="crime-scene">
      <Marquee className="[--duration:20s] [--gap:3rem] h-full p-0">
        <div className="crime-scene-section">
          <div className="crime-scene-stripes" />
          <span className="crime-scene-text">{text}</span>
        </div>
      </Marquee>
    </div>
  );
}
