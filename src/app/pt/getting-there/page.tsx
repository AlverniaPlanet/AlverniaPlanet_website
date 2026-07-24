import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Como chegar, Alvernia Planet";
const description = "Como chegar à Alvernia Planet, perto de Cracóvia: direções, estacionamento e transportes.";

// Zlokalizowane metadane aliasu PT polskiej trasy /jak-dojechac.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/jak-dojechac", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/getting-there",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../jak-dojechac/page";
