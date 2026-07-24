import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Getting here, Alvernia Planet";
const description = "How to get to Alvernia Planet near Kraków: directions, parking and transport.";

// Zlokalizowane metadane aliasu EN polskiej trasy /jak-dojechac.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/jak-dojechac", "en"),
  openGraph: {
    title,
    description,
    url: "/en/getting-there",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../jak-dojechac/page";
