import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Sobre a Alvernia Planet";
const description = "A história da Alvernia Planet: um estúdio de cinema sob 13 cúpulas, perto de Cracóvia.";

// Zlokalizowane metadane aliasu PT polskiej trasy /o-alvernia-planet.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/o-alvernia-planet", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/about",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../o-alvernia-planet/page";
