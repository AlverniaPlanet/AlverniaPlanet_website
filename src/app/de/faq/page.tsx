import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Häufige Fragen, Alvernia Planet";
const description = "Antworten auf die häufigsten Fragen zum Besuch bei Alvernia Planet: Tickets, Öffnungszeiten, Anfahrt und Attraktionen.";

// Zlokalizowane metadane aliasu EN polskiej trasy /faq.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/faq", "de"),
  openGraph: {
    title,
    description,
    url: "/de/faq",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../faq/page";
