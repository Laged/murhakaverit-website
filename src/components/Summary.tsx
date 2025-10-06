"use client";

import { FuturisticButton } from "./common/FuturisticButton";
import { FuturisticCardContainer } from "./common/FuturisticCardContainer";

export function Summary() {
  return (
    <div
      className="w-screen flex items-center justify-center px-4 sm:px-8 texture-subtle-stripes"
      style={{ height: "98vh" }}
    >
      <div className="w-full h-full py-6 sm:py-8">
        <FuturisticCardContainer>
          <div className="h-full flex flex-col items-center justify-center p-8 sm:p-12">
            <h1
              className="mb-8 text-white leading-none text-center"
              style={{
                fontFamily: "var(--font-audiowide)",
                fontSize: "clamp(3rem, 12vw, 8rem)",
                letterSpacing: "0.15em",
                textShadow: `
                  0 0 12px rgba(255,255,255,0.9),
                  0 0 24px rgba(255,255,255,0.6),
                  0 0 36px rgba(56,189,248,0.5),
                  0 0 48px rgba(56,189,248,0.3)
                `,
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.7))",
                animation: "simpleGlow 1s ease-in-out infinite alternate",
              }}
            >
              <div>NKL</div>
              <div>2068</div>
            </h1>

            <div
              className="space-y-4 max-w-2xl mb-8 text-left"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                <strong>
                  Ensimmäinen alkuperäinen Jubensha-pelimme on työn alla.
                  <br />
                  Ensimmäiset peli-illat järjestetään loppuvuodesta 2026.
                </strong>
              </p>

              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                Jubensha tarjoaa pelaajilleen noin neljän tunnin
                murhamysteeri-illan. Omana pelinämme NKL 2068 on huolellisesti
                käsikirjoitettu toimimaan kielellisesti sekä kulttuurillisesti
                suomalaiselle pelaajalle. Jokainen pelaaja tutkii tapahtumia
                oman hahmonsa näkökulmasta. Yhteistyö ja deduktiivinen päättely
                ovat avaimia totuuden selvittämiseen.
              </p>

              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                Tervetuloa vuoteen 2068, jossa Eurooppa on pelastettu
                teknokratiaksi Kolmannen Maailmansodan raatelemasta
                yhteiskunnasta. Suomi on syntyvyyshoidon kärkimaa. Ensimmäinen
                valtio, jonka tekoälyhallitus AIH on saavuttanut EU:n
                hallinnollisen elimen EUAIB:n asettamat yhteiskuntatavotteet.
              </p>
            </div>

            <FuturisticButton href="/nkl-2068" variant="primary">
              Lue lisää →
            </FuturisticButton>
          </div>
        </FuturisticCardContainer>
      </div>
    </div>
  );
}
