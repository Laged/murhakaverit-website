'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FuturisticButton } from "@/components/FuturisticButton";
import { FontSizeControls } from "@/components/FontSizeControls";

type FooterButtonsProps = {
  previousHref?: string;
  nextHref?: string;
};

export function FooterButtons({ previousHref, nextHref }: FooterButtonsProps) {
  const [footerPortal, setFooterPortal] = useState<Element | null>(null);

  useEffect(() => {
    const portal = document.getElementById('footer-slot');
    setFooterPortal(portal);
  }, []);

  const content = (
    <div className="footer-actions">
      {previousHref ? (
        <FuturisticButton href={previousHref} variant="ghost">
          Edellinen
        </FuturisticButton>
      ) : (
        <FuturisticButton disabled variant="ghost">
          Etusivu
        </FuturisticButton>
      )}

      {/* Font size controls in the center */}
      <FontSizeControls />

      {nextHref ? (
        <FuturisticButton href={nextHref} variant="ghost">
          Seuraava
        </FuturisticButton>
      ) : (
        <FuturisticButton href="/" variant="ghost">
          Alkuun
        </FuturisticButton>
      )}
    </div>
  );

  if (footerPortal) {
    return createPortal(content, footerPortal);
  }

  // Fallback: render inline if portal not found
  return content;
}