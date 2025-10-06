"use client";

import { Heading } from "./atoms/Heading";
import { Paragraph } from "./atoms/Paragraph";
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
            <Heading
              level={1}
              glow
              className="mb-8 leading-none text-center"
              style={{
                fontSize: "clamp(3rem, 12vw, 8rem)",
                letterSpacing: "0.15em",
              }}
            >
              <div>NKL</div>
              <div>2068</div>
            </Heading>

            <div className="space-y-4 max-w-2xl mb-8 text-left">
              <Paragraph>
                <strong>
                  Ensimmäinen alkuperäinen Jubensha-pelimme on työn alla.
                  <br />
                  Ensimmäiset peli-illat järjestetään loppuvuodesta 2026.
                </strong>
              </Paragraph>

              <Paragraph>
                Jubensha tarjoaa pelaajilleen noin neljän tunnin
                murhamysteeri-illan. Omana pelinämme NKL 2068 on huolellisesti
                käsikirjoitettu toimimaan kielellisesti sekä kulttuurillisesti
                suomalaiselle pelaajalle. Jokainen pelaaja tutkii tapahtumia
                oman hahmonsa näkökulmasta. Yhteistyö ja deduktiivinen päättely
                ovat avaimia totuuden selvittämiseen.
              </Paragraph>

              <Paragraph>
                Tervetuloa vuoteen 2068, jossa Eurooppa on pelastettu
                teknokratiaksi Kolmannen Maailmansodan raatelemasta
                yhteiskunnasta. Suomi on syntyvyyshoidon kärkimaa. Ensimmäinen
                valtio, jonka tekoälyhallitus AIH on saavuttanut EU:n
                hallinnollisen elimen EUAIB:n asettamat yhteiskuntatavotteet.
              </Paragraph>
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
