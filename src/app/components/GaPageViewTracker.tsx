"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// GA4 + App Router: gtag('config', ...) z <head> wysyła page_view TYLKO dla
// pierwszego, twardego wejścia na dokument. Przejścia klienckie (<Link>) nie
// przeładowują dokumentu, więc bez tego trackera każda sesja raportowałaby
// dokładnie jedną odsłonę, niezależnie od liczby odwiedzonych podstron.
//
// PIERWSZE uruchomienie efektu jest świadomie pomijane — inaczej wejście na
// stronę liczyłoby się dwa razy (raz z `config`, raz tutaj).
//
// Klucz to samo `pathname` (bez useSearchParams) — spójnie z
// MetaPixelPageViewTracker. Dodatkowa korzyść: parametry preselekcji Bookero
// (?kategoria=…&usluga=…) nie nabijają sztucznych odsłon; pełny adres z query
// i tak leci w `page_location`.
// ---------------------------------------------------------------------------

type GtagFn = (...args: unknown[]) => void;

export function GaPageViewTracker() {
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const gtag = (window as Window & { gtag?: GtagFn }).gtag;
    if (typeof gtag !== "function") return;

    gtag("event", "page_view", {
      page_path: `${pathname}${window.location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
