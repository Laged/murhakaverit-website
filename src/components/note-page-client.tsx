'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { FuturisticButton } from "@/components/futuristic-button";
import { NoteCard } from "@/components/note-card";
import type { Note } from "@/lib/notes";

type NotePageClientProps = {
  note: Note;
  previousHref?: string;
  nextHref?: string;
};

export function NotePageClient({ note, previousHref, nextHref }: NotePageClientProps) {
  const [footerPortal, setFooterPortal] = useState<Element | null>(null);

  useEffect(() => {
    // Add a delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const portal = document.getElementById('footer-portal');
      console.log('Portal found:', portal);
      setFooterPortal(portal);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const footerContent = (
    <footer className="footer-bar">
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
    </footer>
  );

  console.log('FooterPortal state:', footerPortal);

  return (
    <>
      <div className="flex bg-orange-500 p-4">
        DEBUG CLIENT: <NoteCard note={note} />
      </div>
      
      <div className="bg-purple-500 p-2">
        FALLBACK FOOTER (should not be visible if portal works):
        {!footerPortal && footerContent}
      </div>
      
      {footerPortal && createPortal(footerContent, footerPortal)}
    </>
  );
}