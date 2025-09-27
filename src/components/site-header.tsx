import Link from "next/link";

import { getNoteSummaries } from "@/lib/notes";
import { ScrollProgress } from "@/components/scroll-progress";
import { PageTimer } from "@/components/page-timer";

type NavHref = "/" | { pathname: "/"; hash: string } | string;

type NavItem = {
  label: string;
  href: NavHref;
};

function buildNavItems(suomiSlug?: string): NavItem[] {
  return [
    {
      label: "Alku",
      href: "/",
    },
    {
      label: "Suomi 2068",
      href: suomiSlug ? `/notes/${suomiSlug}` : "/#notes",
    },
  ];
}

type CharacterNavItem = {
  label: string;
  href: string;
};

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

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="header-bar">
        <div className="header-top">
          <div className="header-primary">
            <Link
              href={navItems[0]?.href ?? "/"}
              className="transition hover:text-foreground/60"
            >
              {navItems[0]?.label}
            </Link>
            <span className="header-primary-divider" aria-hidden>
              |
            </span>
            {navItems[1] && (
              <Link
                href={navItems[1].href}
                className="transition hover:text-foreground/60"
              >
                {navItems[1].label}
              </Link>
            )}
          </div>
          {characterItems.length > 0 && (
            <div className="header-secondary">
              <span className="header-secondary-label">Hahmot</span>
              <div className="header-secondary-links">
                {characterItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="header-bottom">
          <PageTimer />
          <div className="header-progress">
            <ScrollProgress />
          </div>
        </div>
      </div>
    </header>
  );
}
