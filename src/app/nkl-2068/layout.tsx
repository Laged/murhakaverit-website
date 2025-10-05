import type { Metadata } from "next";
import { Audiowide, Work_Sans, Geist_Mono } from "next/font/google";
import { SiteHeader } from "./SiteHeader";
import { FontSizeProvider } from "@/components/common/FontSizeContext";
import { FooterButtonsProvider } from "./FooterButtonsContext";
import { FooterButtonsRenderer } from "./FooterButtonsRenderer";

const NKL_DESCRIPTION =
  "Tervetuloa tulevaisuuteen, jossa Eurooppa on pelastettu teknokratiaksi Kolmannen Maailmansodan raatelemasta yhteiskunnasta. Suomi on syntyvyyshoidon kärkimaa. Ensimmäinen valtio, jonka tekoälyhallitus AIH on saavuttanut EU:n hallinnollisen elimen EUAIB:n asettamat yhteiskuntatavotteet. Tavoitteet on optimoitu valtioittain noudattamaan kansan osoittamaa arvomaailmaa sekä historiaa ennen Kolmatta Maailmansotaa. Lue lisää NKL 2068-maailmasta sekä tämän Murhakaverit ry:n ensimmäisen Jubenshan hahmoista jo ennen peli-iltaasi!";

export const metadata: Metadata = {
  title: {
    default: "NKL 2068",
    template: "%s | NKL 2068",
  },
  description: NKL_DESCRIPTION,
  openGraph: {
    title: "NKL 2068 | Murhakaverit Vault",
    description: NKL_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NKL 2068 | Murhakaverit Vault",
    description: NKL_DESCRIPTION,
  },
};

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const audiowide = Audiowide({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function NKL2068Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${workSans.variable} ${audiowide.variable} ${geistMono.variable}`}>
      <FontSizeProvider>
        <FooterButtonsProvider>
          <div className="flex flex-col h-dvh w-full max-w-6xl mx-auto px-4 sm:px-8">
            <main className="flex-1 min-h-0 py-6 sm:py-8">
              {children}
            </main>
            <div className="footer-container">
              <FooterButtonsRenderer />
              <SiteHeader />
            </div>
          </div>
        </FooterButtonsProvider>
      </FontSizeProvider>
    </div>
  );
}
