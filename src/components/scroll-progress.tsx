"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function calculateProgress(element?: HTMLElement | Window): number {
  if (typeof window === "undefined") {
    return 0;
  }

  if (!element || element === window) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight <= 0) {
      return 0;
    }

    return Math.min(scrollTop / docHeight, 1);
  }

  if (!(element instanceof HTMLElement)) {
    return 0;
  }

  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight - element.clientHeight;

  if (scrollHeight <= 0) {
    return 0;
  }

  return Math.min(scrollTop / scrollHeight, 1);
}

export function ScrollProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const target = document.querySelector<HTMLElement>("[data-card-scroll]") ?? undefined;

    const handleUpdate = () => {
      setProgress(calculateProgress(target ?? window));
    };

    handleUpdate();

    if (target) {
      target.addEventListener("scroll", handleUpdate, { passive: true });
    } else {
      window.addEventListener("scroll", handleUpdate, { passive: true });
    }
    window.addEventListener("resize", handleUpdate);

    return () => {
      if (target) {
        target.removeEventListener("scroll", handleUpdate);
      } else {
        window.removeEventListener("scroll", handleUpdate);
      }
      window.removeEventListener("resize", handleUpdate);
    };
  }, [pathname]);

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
      <div
        className="h-full origin-left bg-foreground transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
