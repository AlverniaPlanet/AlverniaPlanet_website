"use client";

import { useId, useState } from "react";

import { SolarIcon, type SolarIconName } from "@/app/components/SolarIcon";

/* Rozwijany wiersz — wspólny dla podstron zbudowanych w nowym kierunku
   wizualnym (/jak-dojechac, /bistro).

   Bez `hidden`, bo tego nie da się animować. Zamiast tego siatka przechodzi
   z `0fr` na `1fr` — wysokość zmienia się płynnie i bez mierzenia czegokolwiek
   w JavaScripcie. Zwinięte pudełko dostaje w CSS `visibility: hidden`, więc
   znika też z drzewa dostępności i nic w środku nie łapie fokusu tabulatorem.

   `prefiks` wybiera przestrzeń nazw klas CSS. Każda podstrona ma własną
   (`.dojazd-*`, `.bistro-*`), bo taka jest architektura tego projektu — jeden
   zamknięty blok stylów na podstronę. Wspólna jest logika, nie wygląd. */
export function Rozwijane({
  prefiks,
  etykieta,
  children,
  onOtwarcie,
  ikona,
  wariant = "link",
}: {
  prefiks: "dojazd" | "bistro";
  etykieta: string;
  children: React.ReactNode;
  onOtwarcie?: () => void;
  ikona?: SolarIconName;
  wariant?: "link" | "wiersz";
}) {
  const [otwarte, setOtwarte] = useState(false);
  const id = useId();

  return (
    <div className={`${prefiks}-rozwijane ${wariant === "wiersz" ? "is-wiersz" : ""}`}>
      <button
        type="button"
        className={`${prefiks}-rozwijane-przycisk`}
        aria-expanded={otwarte}
        aria-controls={id}
        onClick={() => {
          setOtwarte((v) => {
            if (!v) onOtwarcie?.();
            return !v;
          });
        }}
      >
        <span className={`${prefiks}-rozwijane-etykieta`}>
          {ikona ? (
            <SolarIcon name={ikona} size="1.1em" className={`${prefiks}-rozwijane-ikona`} />
          ) : null}
          {etykieta}
        </span>
        <SolarIcon
          name="chevron-down"
          size="1em"
          className={`${prefiks}-rozwijane-strzalka ${otwarte ? "is-open" : ""}`}
        />
      </button>
      <div id={id} className={`${prefiks}-rozwijane-tresc ${otwarte ? "is-otwarte" : ""}`}>
        <div className={`${prefiks}-rozwijane-wnetrze`}>{children}</div>
      </div>
    </div>
  );
}
