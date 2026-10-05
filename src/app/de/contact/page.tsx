import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Kontakt, Alvernia Planet";
const description = "Kontakt zu Alvernia Planet: Telefon, E-Mail, Adresse und Anfahrt. Buchungen für Einzelgäste und Gruppen.";

// Zlokalizowane metadane aliasu EN polskiej trasy /kontakt.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/kontakt", "de"),
  openGraph: {
    title,
    description,
    url: "/de/contact",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../kontakt/page";
