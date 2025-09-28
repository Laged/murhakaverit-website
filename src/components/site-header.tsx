import { getNoteSummaries } from "@/lib/notes";
import {
  SiteHeaderClient,
  type CharacterNavItem,
  type HeaderNavItem,
} from "@/components/site-header-client";

function buildNavItems(suomiSlug?: string): HeaderNavItem[] {
  const items: HeaderNavItem[] = [
    {
      label: "Alku",
      href: "/",
    },
  ];

  if (suomiSlug) {
    items.push({
      label: "Suomi 2068",
      href: `/notes/${suomiSlug}`,
    });
  }

  return items;
}

function buildCharacterItems(
  summaries: Awaited<ReturnType<typeof getNoteSummaries>>,
): CharacterNavItem[] {
  return summaries
    .filter((summary) => /^hahmo\s/i.test(summary.title))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((summary) => ({
      label: summary.title.replace(/^hahmo\s*/i, ""),
      href: `/notes/${summary.slug}`,
    }));
}

export async function SiteHeader() {
  const summaries = await getNoteSummaries();
  const suomiNote = summaries.find((note) =>
    note.slugSegments.slice(0, 2).join("/") === "1/1",
  );
  const navItems = buildNavItems(suomiNote?.slug);
  const characterItems = buildCharacterItems(summaries);

  return <SiteHeaderClient navItems={navItems} characterItems={characterItems} />;
}
