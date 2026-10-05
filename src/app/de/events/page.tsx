import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Veranstaltungen, Alvernia Planet";
const description = "Veranstaltungen, Vorführungen und Sonderprogramme bei Alvernia Planet in der Nähe von Kraków.";

// Zlokalizowane metadane aliasu EN polskiej trasy /wydarzenia.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/wydarzenia", "de"),
  openGraph: {
    title,
    description,
    url: "/de/events",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../wydarzenia/page";
