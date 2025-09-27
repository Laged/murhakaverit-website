import type { NoteSummary } from "@/lib/notes";

type WikiLinkTransformResult = {
  content: string;
  referencedSlugs: string[];
};

const WIKILINK_PATTERN = /\[\[([^\[\]|]+?)(?:\|([^\[\]]+))?\]\]/g;

function slugifyTerm(term: string): string {
  return term
    .trim()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9/]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function resolveSummary(
  rawTarget: string,
  summaries: NoteSummary[],
): NoteSummary | undefined {
  const target = rawTarget.trim();
  const slugCandidate = slugifyTerm(target);

  return summaries.find((summary) => {
    const lastSegment = summary.slugSegments.at(-1);
    return (
      summary.slug === slugCandidate ||
      lastSegment === slugCandidate ||
      summary.title.trim().toLowerCase() === target.toLowerCase()
    );
  });
}

export function transformWikiLinks(
  content: string,
  summaries: NoteSummary[],
): WikiLinkTransformResult {
  const referenced = new Set<string>();

  const rendered = content.replace(
    WIKILINK_PATTERN,
    (fullMatch, rawTarget: string, aliasRaw?: string) => {
      const displayLabel = (aliasRaw ?? rawTarget).trim();
      const resolved = resolveSummary(rawTarget, summaries);

      if (!resolved) {
        return `**${displayLabel}**`;
      }

      referenced.add(resolved.slug);
      return `[${displayLabel}](/notes/${resolved.slug})`;
    },
  );

  return {
    content: rendered,
    referencedSlugs: Array.from(referenced),
  };
}
