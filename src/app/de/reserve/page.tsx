import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Buchung, Alvernia Planet";
const description = "Tickets online buchen: Kino 360, Projekt: MARS und FILMWORLD bei Alvernia Planet.";

// Zlokalizowane metadane aliasu EN polskiej trasy /rezerwuj.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/rezerwuj", "de"),
  openGraph: {
    title,
    description,
    url: "/de/reserve",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../rezerwuj/page";
