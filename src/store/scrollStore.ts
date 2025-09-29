import { create } from 'zustand';

interface ScrollState {
  scrollProgress: number;
  isAtBottom: boolean;
  isScrolling: boolean;
  cardTitle?: string;
  setScrollProgress: (progress: number) => void;
  setIsAtBottom: (atBottom: boolean) => void;
  setIsScrolling: (scrolling: boolean) => void;
  setCardTitle: (title?: string) => void;
  resetScroll: () => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollProgress: 0,
  isAtBottom: false,
  isScrolling: false,
  cardTitle: undefined,
  
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setIsAtBottom: (atBottom) => set({ isAtBottom: atBottom }),
  setIsScrolling: (scrolling) => set({ isScrolling: scrolling }),
  setCardTitle: (title) => set({ cardTitle: title }),
  
  resetScroll: () => set({ 
    scrollProgress: 0, 
    isAtBottom: false, 
    isScrolling: false,
    cardTitle: undefined
  }),
}));