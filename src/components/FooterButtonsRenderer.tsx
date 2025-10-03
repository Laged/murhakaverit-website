'use client';

import { useFooterButtons } from './FooterButtonsContext';
import { FuturisticButton } from './FuturisticButton';
import { FontSizeControls } from './FontSizeControls';

export function FooterButtonsRenderer() {
  const { data } = useFooterButtons();
  const { previousHref, nextHref } = data;

  return (
    <div className="footer-actions">
      {previousHref ? (
        <FuturisticButton href={previousHref} variant="ghost">
          Edellinen
        </FuturisticButton>
      ) : (
        <FuturisticButton disabled variant="ghost">
          Edellinen
        </FuturisticButton>
      )}

      <FontSizeControls />

      {nextHref ? (
        <FuturisticButton href={nextHref} variant="ghost">
          Seuraava
        </FuturisticButton>
      ) : (
        <FuturisticButton disabled variant="ghost">
          Seuraava
        </FuturisticButton>
      )}
    </div>
  );
}
