import type { Metadata } from "next";
import { getLocalizedPath, LOCALES, type Locale } from "@/lib/localizedRoutes";

/**
 * Kod hreflang dla danej wersji językowej.
 *
 * Dla chińskiego podajemy `zh-Hans`, a nie samo `zh`: serwis ma wersję w piśmie
 * UPROSZCZONYM (Chiny kontynentalne), a Google rozróżnia ją od tradycyjnego
 * `zh-Hant` używanego w Hongkongu i na Tajwanie. Samo „zh" byłoby niejednoznaczne.
 * Prefiks w adresie zostaje krótki (/zh) — to tylko etykieta dla wyszukiwarek.
 */
const HREFLANG: Record<Locale, string> = {
  pl: "pl",
  en: "en",
  pt: "pt",
  de: "de",
  zh: "zh-Hans",
};

// Canonical + hreflang dla trasy dostępnej we wszystkich wersjach językowych.
// `plPath` to kanoniczna polska ścieżka (np. "/kontakt"); adresy EN/PT
// wyliczamy z tej samej mapy tras, z której korzystają linki w serwisie
// (localizedRoutes), więc nie ma ryzyka rozjazdu. Adresy są względne —
// metadataBase w root layout zamienia je na absolutne.
export function languageAlternates(
  plPath: string,
  locale: Locale,
): Metadata["alternates"] {
  return {
    canonical: getLocalizedPath(plPath, locale),
    languages: {
      ...Object.fromEntries(
        LOCALES.map((kod) => [HREFLANG[kod], getLocalizedPath(plPath, kod)]),
      ),
      "x-default": getLocalizedPath(plPath, "pl"),
    },
  };
}
