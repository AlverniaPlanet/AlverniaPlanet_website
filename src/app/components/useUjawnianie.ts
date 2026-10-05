"use client";

import { useEffect } from "react";

/* Ujawnianie treści przy przewijaniu — wspólne dla podstron zbudowanych
   w nowym kierunku wizualnym (/jak-dojechac, /bistro).

   Jeden IntersectionObserver na całą stronę, a każdy element odłącza się po
   pierwszym pokazaniu — po przewinięciu strony nie zostaje żadna praca.
   Animujemy WYŁĄCZNIE `opacity` i `transform`: obie właściwości obsługuje
   kompozytor, więc nie ma przeliczania układu ani odmalowywania.

   Ukrycie włącza JavaScript (klasa na korzeniu strony), nie arkusz — bez
   skryptu albo przed hydracją treść jest normalnie widoczna, a nie
   przezroczysta. Przy „ogranicz ruch" reguły `prefers-reduced-motion` zerują
   przejścia, więc elementy po prostu pojawiają się od razu.

   @param korzenSelektor selektor korzenia podstrony, np. ".bistro-page" */
export function useUjawnianie(korzenSelektor: string) {
  useEffect(() => {
    const korzen = document.querySelector(korzenSelektor);
    const cele = Array.from(document.querySelectorAll<HTMLElement>("[data-ujawnij]"));
    if (!korzen || cele.length === 0) return;

    korzen.classList.add("ujawnianie-wlaczone");

    const pokaz = (el: Element) => el.classList.add("jest-widoczny");

    if (typeof IntersectionObserver === "undefined") {
      cele.forEach(pokaz);
      return;
    }

    const obserwator = new IntersectionObserver(
      (wpisy) => {
        for (const wpis of wpisy) {
          if (!wpis.isIntersecting) continue;
          pokaz(wpis.target);
          obserwator.unobserve(wpis.target);
        }
      },
      /* Dolny margines ujemny: element pokazuje się dopiero, gdy naprawdę
         wejdzie w kadr, a nie gdy ledwie dotknie krawędzi. */
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    cele.forEach((el) => obserwator.observe(el));
    return () => obserwator.disconnect();
  }, [korzenSelektor]);
}
