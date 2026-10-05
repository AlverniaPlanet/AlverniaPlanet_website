import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Über Alvernia Planet";
const description = "Die Geschichte von Alvernia Planet: ein Filmstudio unter 13 Kuppeln in der Nähe von Kraków.";

// Zlokalizowane metadane aliasu EN polskiej trasy /o-alvernia-planet.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/o-alvernia-planet", "de"),
  openGraph: {
    title,
    description,
    url: "/de/about",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../o-alvernia-planet/page";
