'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FontSizeContextType {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  // Base font size: 16px = 1.0, range from 0.8 to 1.4 (12.8px to 22.4px)
  const [fontSize, setFontSize] = useState(1.0);

  // Load font size from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('readable-font-size');
    if (saved) {
      const parsedSize = parseFloat(saved);
      if (parsedSize >= 0.8 && parsedSize <= 1.4) {
        setFontSize(parsedSize);
      }
    }
  }, []);

  // Save font size to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('readable-font-size', fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(1.4, prev + 0.1)); // Max 1.4x (22.4px)
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(0.8, prev - 0.1)); // Min 0.8x (12.8px)
  };

  const resetFontSize = () => {
    setFontSize(1.0);
  };

  return (
    <FontSizeContext.Provider value={{
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize
    }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}