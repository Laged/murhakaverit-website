import Link from "next/link";

import { NoteCard } from "@/components/note-card";
import { getNoteBySlug, getNoteSummaries } from "@/lib/notes";
import { transformWikiLinks } from "@/lib/wiki-links";

export const revalidate = 3600;

function pickLandingNote(summaries: Awaited<ReturnType<typeof getNoteSummaries>>) {
  return (
    summaries.find((summary) => {
      return (
        summary.slugSegments.length >= 2 &&
        summary.slugSegments[0] === "1" &&
        summary.slugSegments[1] === "0"
      );
    }) ?? summaries[0]
  );
}

export default async function HomePage() {
  const summaries = await getNoteSummaries();

  if (summaries.length === 0) {
    return (
      <div className="flex flex-col gap-12">
        <section className="flex min-h-[18rem] items-center justify-center rounded-3xl border border-foreground/10 bg-background/70 p-8 text-sm text-foreground/80">
          <p>
            No synced notes yet. Run <code className="font-mono text-xs">bun run sync-content</code> to pull in the Obsidian vault.
          </p>
        </section>
      </div>
    );
  }

  const landingSummary = pickLandingNote(summaries);
  const landingNote = landingSummary
    ? await getNoteBySlug(landingSummary.slugSegments)
    : undefined;

  const transformedLanding = landingNote
    ? {
        ...landingNote,
        content: transformWikiLinks(landingNote.content, summaries).content,
      }
    : undefined;

  const otherNotes = summaries.filter((summary) => summary.slug !== landingSummary?.slug);
  const nextNote = otherNotes.at(0);

  return (
    <div className="flex flex-col gap-12">
      {transformedLanding ? (
        <>
          <NoteCard note={transformedLanding} />
          {nextNote ? (
            <div className="flex justify-end">
              <Link
                href={`/notes/${nextNote.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:border-foreground/50"
              >
                Seuraava
                <span aria-hidden>→</span>
              </Link>
            </div>
          ) : null}
        </>
      ) : (
        <section className="flex min-h-[18rem] items-center justify-center rounded-3xl border border-foreground/10 bg-background/70 p-8 text-sm text-foreground/70">
          <p>Landing note is unavailable.</p>
        </section>
      )}
    </div>
  );
}
