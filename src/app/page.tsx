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
      <section className="rounded-3xl border border-foreground/10 bg-background/70 p-8 text-center text-sm text-foreground/80">
        <p>
          No synced notes yet. Run <code className="font-mono text-xs">bun run sync-content</code> to pull in the Obsidian vault.
        </p>
      </section>
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
    <div className="flex flex-col gap-16">
      {transformedLanding ? (
        <div className="flex flex-col gap-6">
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
        </div>
      ) : null}

      <section id="notes" className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-foreground/40">
            Notes
          </p>
          <h2 className="text-lg font-semibold uppercase tracking-[0.25em] text-foreground">
            Vault index
          </h2>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {otherNotes.length > 0 ? (
            otherNotes.map((note) => (
              <Link
                key={note.slug}
                href={`/notes/${note.slug}`}
                className="panel block rounded-none px-6 py-5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-foreground/50">
                  {note.slugSegments.join(" · ")}
                </p>
                <h3 className="mt-3 text-lg font-semibold uppercase tracking-[0.25em] text-foreground">
                  {note.title}
                </h3>
                {note.description ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground/70">
                    {note.description}
                  </p>
                ) : null}
              </Link>
            ))
          ) : (
            <p className="rounded-2xl border border-foreground/10 bg-background/70 px-6 py-8 text-sm text-foreground/60">
              Landing note is currently the only synced entry. Add more markdown files to the vault and rerun the sync script.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
