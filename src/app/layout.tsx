import type { Metadata } from "next";
import { Creepster } from "next/font/google";
import "./globals.css";
import "./layers.css";
import { ViewTransitions } from "./ViewTransitions";

const creepster = Creepster({
  variable: "--font-creepster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://murhakaverit.vercel.app"),
  title: {
    default: "MURHA-KAVERIT",
    template: "%s | MURHA-KAVERIT",
  },
  description: "Murhakaverit - Mystery and Murder Mystery Games",
  openGraph: {
    title: "MURHA-KAVERIT",
    description: "Murhakaverit - Mystery and Murder Mystery Games",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MURHA-KAVERIT",
    description: "Murhakaverit - Mystery and Murder Mystery Games",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${creepster.variable} antialiased bg-black text-white`}
      >
        <ViewTransitions>
          {children}
        </ViewTransitions>
      </body>
    </html>
  );
}
