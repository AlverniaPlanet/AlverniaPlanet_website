"use client";

import type { CSSProperties } from "react";

import type { MarsCopy } from "./marsCopy";
import { TekstNaglowka } from "./Naglowek";
import "./ekosystem.css";

/* --- Więcej niż jedna misja ----------------------------------------------------
   Przebudowa 05.10.2026 wg referencji obiektu: zamiast trzech kart —
   TYPOGRAFIA I OŚ. Trzy etapy ekosystemu (Mars Colonization → Humanoids Lab →
   Robotics Showroom), każdy z numerem, nazwą i zdaniem, a pod nimi jedna oś
   z trzema punktami i etykietą etapu („Aktualna misja", „Kolejny etap",
   „Technologia w praktyce").

   BEZ WŁASNEGO TŁA: sekcja jest przezroczysta i leży na ciemnym pasie
   rodzica (`.mars-pas-nocny` w `page.tsx`), wspólnym z sekcją „Dla kogo".
   Obiekt chciał „czystej typografii na istniejącym ciemnym tle strony" —
   a strona pod tym miejscem jest jasna, więc ciemne podłoże daje rodzic,
   nie sekcja. Żadnych kart, cieni, gradientów ani zdjęć.

   Od 1024 px trzy równe kolumny i POZIOMA oś pod nimi; niżej PIONOWA oś po
   lewej, bo na tablecie trzy kolumny ściskałyby nazwy i opisy (uzasadnienie
   w arkuszu). Sekcja jest informacyjna — bez przycisków i odnośników. */
export function Ekosystem({ copy }: { copy: MarsCopy }) {
  const { overline, tytul, filary } = copy.ekosystem;

  return (
    <section className="mars-misje" aria-labelledby="mars-misje-tytul" data-ujawnij>
      <div className="mars-shell">
        <p className="mars-overline">{overline}</p>
        <h2 className="mars-misje-tytul" id="mars-misje-tytul">
          <TekstNaglowka tekst={tytul} />
        </h2>

        {/* Lista UPORZĄDKOWANA — kolejność etapów jest treścią. `role="list"`,
            bo Safari/VoiceOver gubi rolę listy przy `list-style: none`. */}
        <ol role="list" className="mars-misje-etapy">
          {filary.map((filar, i) => (
            <li
              key={filar.tytul}
              className={i === 0 ? "mars-misje-etap is-aktualny" : "mars-misje-etap"}
              style={{ "--i": i } as CSSProperties}
            >
              {/* Numer i kropka to oznaczenia, nie treść — pozycję na liście
                  czytnik ekranu i tak ogłasza. */}
              <span className="mars-misje-numer" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Nazwy produktów są angielskie we wszystkich językach — czytnik
                  przeczyta je angielską wymową. */}
              <h3 className="mars-misje-nazwa" lang="en">
                {filar.tytul}
              </h3>
              <p className="mars-misje-opis">{filar.opis}</p>
              <span className="mars-misje-punkt" aria-hidden="true" />
              <p className="mars-misje-etykieta">{filar.etap}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
