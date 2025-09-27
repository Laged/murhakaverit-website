import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoteCard } from "@/components/note-card";
import { getNoteBySlug, getNoteSummaries } from "@/lib/notes";
import { transformWikiLinks } from "@/lib/wiki-links";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const summaries = await getNoteSummaries();
  return summaries.map((summary) => ({ slug: summary.slugSegments }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    return {
      title: "Note not found",
    };
  }

  return {
    title: note.title,
    description: note.description,
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const summaries = await getNoteSummaries();
  const transformed = transformWikiLinks(note.content, summaries);

  const currentIndex = summaries.findIndex((summary) => summary.slug === note.slug);
  const previousNote = currentIndex > 0 ? summaries[currentIndex - 1] : undefined;
  const nextNote =
    currentIndex >= 0 && currentIndex < summaries.length - 1
      ? summaries[currentIndex + 1]
      : undefined;

  const previousHref = previousNote ? `/notes/${previousNote.slug}` : undefined;
  const nextHref = nextNote ? `/notes/${nextNote.slug}` : undefined;

  return (
    <div className="flex flex-col gap-12">
      <NoteCard note={{ ...note, content: transformed.content }} />

      {(previousNote || nextNote) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {previousHref ? (
              <Link
                href={previousHref}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:border-foreground/50"
              >
                <span aria-hidden>←</span>
                Edellinen
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:border-foreground/50"
              >
                <span aria-hidden>←</span>
                Etusivu
              </Link>
            )}
          </div>
          {nextHref ? (
            <Link
              href={nextHref}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:border-foreground/50"
            >
              Seuraava
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:border-foreground/50"
            >
              Alkuun
              <span aria-hidden>↺</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
