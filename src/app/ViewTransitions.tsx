'use client';

import { unstable_ViewTransition as ViewTransition } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Page transition animations using React's unstable ViewTransition.
 * Uses exit/enter pattern: fade out → switch → fade in
 */
export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition exit="card-exit" enter="card-enter">
      <div key={pathname}>
        {children}
      </div>
    </ViewTransition>
  );
}

// Stub for compatibility
export function useTransition() {
  return { isTransitioning: false, transitionPhase: 'idle' as const, displayChildren: null };
}
