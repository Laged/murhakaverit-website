import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CombinedCard } from "@/components/CombinedCard";
import { FuturisticCard } from "@/components/FuturisticCard";
import { FuturisticButton } from "@/components/futuristic-button";
import { FooterButtons } from "@/components/footer-buttons";
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
  console.log('NotePage function called');
  
  const { slug } = await params;
  console.log('Slug:', slug);
  
  const note = await getNoteBySlug(slug);
  console.log('Note loaded:', note?.title);

  if (!note) {
    console.log('Note not found, calling notFound()');
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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {transformed.content}
          </ReactMarkdown>
        </FuturisticCard>
      </div>
      
      {/* FooterButtons will portal to footer-slot */}
      <FooterButtons previousHref={previousHref} nextHref={nextHref} />
    </>
  );
}
