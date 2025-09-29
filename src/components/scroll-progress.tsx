"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useScrollStore } from "@/store/scrollStore";

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
  const [localProgress, setLocalProgress] = useState(0);
  
  // Get scroll progress from Zustand store (for FuturisticCard)
  const { scrollProgress: storeProgress, isScrolling, isAtBottom } = useScrollStore();

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const target = document.querySelector<HTMLElement>("[data-card-scroll]") ?? undefined;

    const handleUpdate = () => {
      setLocalProgress(calculateProgress(target ?? window));
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

  // Use store progress if available (from FuturisticCard), otherwise fall back to local progress
  const progress = storeProgress > 0 || isScrolling ? storeProgress : localProgress;

  return (
    <div 
      className="h-1 w-full overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '2px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <div
        className="h-full origin-left transition-[width] duration-150 ease-out"
        style={{ 
          width: `${progress * 100}%`,
          background: storeProgress > 0 && isAtBottom 
            ? 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(59,130,246,0.6))'
            : 'linear-gradient(to right, rgba(255,255,255,0.6), rgba(156,163,175,0.5))',
          borderRadius: '2px',
          boxShadow: storeProgress > 0 && isAtBottom 
            ? '0 0 8px rgba(255,255,255,0.4), 0 0 16px rgba(59,130,246,0.3)'
            : '0 0 4px rgba(255,255,255,0.2)',
          animation: storeProgress > 0 && isAtBottom ? 'scrollGlow 2s ease-in-out infinite alternate' : 'none'
        }}
      />
    </div>
  );
}
