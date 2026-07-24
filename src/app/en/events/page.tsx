import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Events, Alvernia Planet";
const description = "Events, screenings and special activities at Alvernia Planet near Kraków.";

// Zlokalizowane metadane aliasu EN polskiej trasy /wydarzenia.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/wydarzenia", "en"),
  openGraph: {
    title,
    description,
    url: "/en/events",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../wydarzenia/page";
