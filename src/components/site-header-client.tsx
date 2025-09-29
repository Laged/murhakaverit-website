'use client';

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { PageTimer } from "@/components/page-timer";
import { ScrollProgress } from "@/components/scroll-progress";

export type HeaderNavItem = {
  label: string;
  href: string;
};

export type CharacterNavItem = {
  label: string;
  href: string;
};

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isCharacterActive(pathname: string, href: string): boolean {
  return pathname === href;
}

type SiteHeaderClientProps = {
  navItems: HeaderNavItem[];
  characterItems: CharacterNavItem[];
};

export function SiteHeaderClient({ navItems, characterItems }: SiteHeaderClientProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Navigation Section */}
      <nav className="z-50 bg-transparent">
        <div className="header-bar">
          <div className="header-top">
            <div className="header-primary">
              {navItems.map((item, index) => {
                const active = isNavActive(pathname, item.href);
                const baseClasses = "transition hover:text-foreground/60";
                const activeClasses = active
                  ? "font-semibold text-foreground"
                  : "text-foreground";

                return (
                  <Fragment key={item.href}>
                    {index > 0 && (
                      <span className="header-primary-divider" aria-hidden>
                        |
                      </span>
                    )}
                    <Link href={item.href} className={`${baseClasses} ${activeClasses}`.trim()}>
                      {item.label}
                    </Link>
                  </Fragment>
                );
              })}
            </div>
            {characterItems.length > 0 && (
              <div className="header-secondary">
                <span className="header-secondary-label"></span>
                <div className="header-secondary-links">
                  {characterItems.map((item) => {
                    const active = isCharacterActive(pathname, item.href);
                    const baseClasses = "transition hover:text-foreground";
                    const activeClasses = active
                      ? "font-semibold text-foreground"
                      : "text-foreground";

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${baseClasses} ${activeClasses}`.trim()}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Timer/Progress Section */}
      <div className="z-50 bg-transparent">
        <div className="header-bar">
          <div className="header-bottom">
            <PageTimer />
            <div className="header-progress">
              <ScrollProgress />
            </div>
          </div>
        </div>
      </div>

      {/* Footer will be rendered via portal after this */}
    </>
  );
}
