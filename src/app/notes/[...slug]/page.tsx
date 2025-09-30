import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { FuturisticCard } from "@/components/FuturisticCard";
import { FooterButtons } from "@/components/FooterButtons";
import { getNoteBySlug, getNoteSummaries } from "@/lib/notes";
import { transformWikiLinks } from "@/lib/wiki-links";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const summaries = await getNoteSummaries();
  return summaries.map((summary) => ({ slug: summary.slugSegments }));
}

// Disable dynamic params to prevent 404 routes from being generated
export const dynamicParams = false;

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

  // Process metadata like NoteCard does
  const metadata = note.metadata ? Object.fromEntries(
    Object.entries(note.metadata).map(([key, value]) => [
      key.toUpperCase(), 
      typeof value === 'string' ? value : ''
    ])
  ) : {};

  return (
    <>
      <div className="h-full">
        <FuturisticCard
          title={note.title}
          metadata={metadata}
          className="h-full"
        >
          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {transformed.content}
            </ReactMarkdown>
          </div>
        </FuturisticCard>
      </div>
      
      {/* FooterButtons will portal to footer-slot */}
      <FooterButtons previousHref={previousHref} nextHref={nextHref} />
    </>
  );
}
