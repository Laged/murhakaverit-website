'use client';

import { useEffect } from "react";
import { useFooterButtons } from "./FooterButtonsContext";

type FooterButtonsProps = {
  previousHref?: string;
  nextHref?: string;
};

export function FooterButtons({ previousHref, nextHref }: FooterButtonsProps) {
  const { setData } = useFooterButtons();

  useEffect(() => {
    setData({ previousHref, nextHref });
  }, [previousHref, nextHref, setData]);

  return null;
}