"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

import { SolarIcon } from "@/app/components/SolarIcon";
import type { Locale } from "@/lib/localizedRoutes";
import "./postep-sceny.css";

/* Postęp sceny z zaprzeczeniem („Czym jest", „Real humanoids") — prośba
   obiektu (05.10.2026): mały pasek „jak ładowanie" na dole sekcji, czas
   animacji i przycisk ponownego odtworzenia.

   ZEGAR JEST JEDEN. Pasek to animacja CSS (`scaleX`) trwająca całą scenę
   i ruszająca w tej samej chwili co reszta sceny — z ujawnieniem sekcji
   (`.jest-widoczny`). Licznik nie odmierza własnego czasu, tylko co klatkę
   czyta `currentTime` tej animacji, więc nie rozjedzie się z tym, co widać,
   nawet gdy przeglądarka przytnie klatki albo karta pójdzie w tło.

   Liczbę piszemy w ISTNIEJĄCY węzeł tekstowy (`Text.data`), a nie przez
   `textContent` — podmiana węzła co klatkę unieważnia selektory `:has()`
   na całej stronie (pułapka z /wydarzenia).

   ODTWORZENIE: sekcja trzyma licznik `odtworzenie` i podaje go jako `key`
   wszystkim animowanym elementom sceny — nowy element to nowa animacja CSS
   od zera. Tutaj klucz dostaje tylko wypełnienie paska; sam przycisk stoi
   poza kluczem, więc po kliknięciu nie znika i fokus zostaje na nim.

   Bez skryptu i przy „ogranicz ruch" cały rząd jest ukryty (arkusz) — scena
   wtedy nie gra, więc nie ma czego mierzyć ani odtwarzać. */
export function PostepSceny({
  czasMs,
  odtworzenie,
  onOdtworz,
  etykieta,
  loc,
}: {
  czasMs: number;
  odtworzenie: number;
  onOdtworz: () => void;
  etykieta: string;
  loc: Locale;
}) {
  const wypelnienie = useRef<HTMLSpanElement>(null);
  const biezacy = useRef<HTMLSpanElement>(null);
  const liczba = useMemo(
    () => new Intl.NumberFormat(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    [loc],
  );

  useEffect(() => {
    const pasek = wypelnienie.current;
    const wezel = biezacy.current?.firstChild;
    if (!pasek || !(wezel instanceof Text)) return;

    let klatka = 0;
    const pokaz = (ms: number) => {
      wezel.data = liczba.format(Math.min(Math.max(ms, 0), czasMs) / 1000);
    };
    const tik = () => {
      const animacja = pasek.getAnimations()[0];
      if (!animacja) return;
      if (animacja.playState === "finished") {
        pokaz(czasMs);
        return;
      }
      const t = animacja.currentTime;
      pokaz(typeof t === "number" ? t : 0);
      klatka = requestAnimationFrame(tik);
    };
    const start = () => {
      cancelAnimationFrame(klatka);
      klatka = requestAnimationFrame(tik);
    };
    const koniec = () => {
      cancelAnimationFrame(klatka);
      pokaz(czasMs);
    };

    pokaz(0);
    pasek.addEventListener("animationstart", start);
    pasek.addEventListener("animationend", koniec);
    /* Przy odtworzeniu sekcja jest już ujawniona, więc animacja nowego paska
       rusza od razu — mogła wystartować, zanim ten efekt podpiął nasłuch. */
    if (pasek.getAnimations().length > 0) start();

    return () => {
      cancelAnimationFrame(klatka);
      pasek.removeEventListener("animationstart", start);
      pasek.removeEventListener("animationend", koniec);
    };
  }, [czasMs, odtworzenie, liczba]);

  return (
    <div className="mars-scena-postep">
      <span className="mars-scena-pasek" aria-hidden="true">
        <span
          key={odtworzenie}
          ref={wypelnienie}
          className="mars-scena-wypelnienie"
          style={{ "--ms-scena-czas": `${czasMs}ms` } as CSSProperties}
        />
      </span>
      <span className="mars-scena-czas" aria-hidden="true">
        <span ref={biezacy}>{liczba.format(0)}</span> / {liczba.format(czasMs / 1000)} s
      </span>
      <button type="button" className="mars-scena-odtworz" onClick={onOdtworz}>
        <SolarIcon name="restart" size="1.1em" />
        {etykieta}
      </button>
    </div>
  );
}
