import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "About Alvernia Planet";
const description = "The story of Alvernia Planet: a film studio under 13 domes near Kraków.";

// Zlokalizowane metadane aliasu EN polskiej trasy /o-alvernia-planet.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/o-alvernia-planet", "en"),
  openGraph: {
    title,
    description,
    url: "/en/about",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../o-alvernia-planet/page";
