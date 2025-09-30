
import { FuturisticCard } from "@/components/FuturisticCard";
import { FuturisticButton } from "@/components/FuturisticButton";
import { FooterButtons } from "@/components/FooterButtons";
import { getNoteBySlug, getNoteSummaries } from "@/lib/notes";
import { transformWikiLinks } from "@/lib/wiki-links";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      <>
        <section className="flex min-h-0 items-center justify-center rounded-3xl border border-foreground/10 bg-background/70 p-8 text-sm text-foreground/80">
          <p>
            No synced notes yet. Run <code className="font-mono text-xs">bun run sync-content</code> to pull in the Obsidian vault.
          </p>
        </section>
        <footer className="footer-bar footer-bar--placeholder">
          <div className="footer-actions">
            <FuturisticButton disabled variant="ghost">Seuraava</FuturisticButton>
          </div>
        </footer>
      </>
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

  if (!transformedLanding) {
    return (
      <>
        <section className="flex min-h-0 items-center justify-center rounded-3xl border border-foreground/10 bg-background/70 p-8 text-sm text-foreground/70">
          <p>Landing note is unavailable.</p>
        </section>
        <footer className="footer-bar footer-bar--placeholder" aria-hidden />
      </>
    );
  }

  // Process metadata like notes page does
  const metadata = transformedLanding.metadata ? Object.fromEntries(
    Object.entries(transformedLanding.metadata).map(([key, value]) => [
      key.toUpperCase(), 
      typeof value === 'string' ? value : ''
    ])
  ) : {};

  const nextHref = nextNote ? `/notes/${nextNote.slug}` : undefined;

  return (
    <>
      <div className="h-full">
        <FuturisticCard
          title={transformedLanding.title}
          metadata={metadata}
          className="h-full"
        >
          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {transformedLanding.content}
            </ReactMarkdown>
          </div>
        </FuturisticCard>
      </div>
      
      {/* FooterButtons will portal to footer-slot */}
      <FooterButtons nextHref={nextHref} />
    </>
  );
}
