'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type FooterButtonsData = {
  previousHref?: string;
  nextHref?: string;
};

type FooterButtonsContextType = {
  data: FooterButtonsData;
  setData: (data: FooterButtonsData) => void;
};

const FooterButtonsContext = createContext<FooterButtonsContextType | null>(null);

export function FooterButtonsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FooterButtonsData>({});

  return (
    <FooterButtonsContext.Provider value={{ data, setData }}>
      {children}
    </FooterButtonsContext.Provider>
  );
}

export function useFooterButtons() {
  const context = useContext(FooterButtonsContext);
  if (!context) {
    throw new Error('useFooterButtons must be used within FooterButtonsProvider');
  }
  return context;
}
