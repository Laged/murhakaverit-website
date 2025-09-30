import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Note Not Found",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-foreground/10 bg-background/80 px-6 py-12 text-center text-sm text-foreground/80">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-foreground/50">
        404
      </p>
      <h1 className="text-lg font-semibold uppercase tracking-[0.25em] text-foreground">
        Note missing
      </h1>
      <p>
        That vault entry is not available. Sync the content or use the header navigation to pick another note.
      </p>
      <Link
        href="/"
        className="mt-2 px-4 py-2 text-xs uppercase tracking-wide border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-colors rounded"
      >
        Return to Home
      </Link>
    </section>
  );
}
