"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CombinedCard } from "@/components/CombinedCard";
import type { Note } from "@/lib/notes";

type MetadataMap = Record<string, string>;

type NoteCardProps = {
  note: Note;
};

const BOLD_FIELD_PATTERN = /\*\*([^*:\n]+?)\s*:\s*([^*]+?)\*\*/g;

function normalizeMetadataKey(raw: string): string {
  const normalized = raw
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();

  if (normalized === "SIJANTI") {
    return "SIJAINTI";
  }

  return normalized;
}

function extractMetadataFromContent(markdown: string): {
  metadata: MetadataMap;
  content: string;
} {
  const metadata: MetadataMap = {};

  const withoutFields = markdown.replace(
    BOLD_FIELD_PATTERN,
    (match, rawKey: string, rawValue: string) => {
      const key = normalizeMetadataKey(rawKey);
      const value = rawValue.trim();

      if (key.length === 0 || value.length === 0) {
        return match;
      }

      metadata[key] = value;
      return "";
    },
  );

  const cleaned = withoutFields
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+/, "");

  return {
    metadata,
    content: cleaned,
  };
}

export function NoteCard({ note }: NoteCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [contentContainer, setContentContainer] = useState<HTMLElement | null>(
    null,
  );

  const { metadata: extractedMetadata, content } = useMemo(
    () => extractMetadataFromContent(note.content),
    [note.content],
  );

  const metadata = useMemo(() => {
    const enriched: MetadataMap = { ...extractedMetadata };

    if (!enriched.SIJAINTI) {
      enriched.SIJAINTI = note.slugSegments.join(" / ");
    }

    return enriched;
  }, [extractedMetadata, note.slugSegments]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const textContainer =
      wrapper?.querySelector<HTMLElement>(".layer-text") ?? null;
    const scrollContainer =
      wrapper?.querySelector<HTMLElement>(".typography-content") ?? null;

    if (!textContainer) {
      setPortalTarget(null);
      setContentContainer(null);
      return;
    }

    while (textContainer.firstChild) {
      textContainer.removeChild(textContainer.firstChild);
    }

    setPortalTarget(textContainer);
    setContentContainer(scrollContainer);
  }, [note.slug]);

  useEffect(() => {
    const container = contentContainer;

    if (!container) {
      return undefined;
    }

    const upwardKeys = new Set(["ArrowUp", "PageUp", "Home"]);
    const downwardKeys = new Set(["ArrowDown", "PageDown", "End", " ", "Space"]);

    const handleWheel = (event: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop >= maxScroll - 1;

      if (maxScroll === 0) {
        event.stopImmediatePropagation();
        return;
      }

      if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
        event.stopImmediatePropagation();
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop >= maxScroll - 1;

      if (maxScroll === 0) {
        event.stopImmediatePropagation();
        return;
      }

      if (
        (upwardKeys.has(event.key) && atTop) ||
        (downwardKeys.has(event.key) && atBottom)
      ) {
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("wheel", handleWheel, { capture: true });
    window.addEventListener("keydown", handleKey, { capture: true });

    return () => {
      window.removeEventListener("wheel", handleWheel, true);
      window.removeEventListener("keydown", handleKey, true);
    };
  }, [contentContainer]);

  return (
    <div ref={wrapperRef} className="w-full">
      <CombinedCard title={note.title} metadata={metadata} />
      {portalTarget
        ? createPortal(
            <div className="markdown note-card-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>,
            portalTarget,
          )
        : null}
    </div>
  );
}
