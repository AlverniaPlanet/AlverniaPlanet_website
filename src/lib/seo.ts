import type { Metadata } from "next";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";

// Canonical + hreflang dla trasy dostępnej w trzech językach (PL/EN/PT).
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
      pl: getLocalizedPath(plPath, "pl"),
      en: getLocalizedPath(plPath, "en"),
      pt: getLocalizedPath(plPath, "pt"),
      "x-default": getLocalizedPath(plPath, "pl"),
    },
  };
}
