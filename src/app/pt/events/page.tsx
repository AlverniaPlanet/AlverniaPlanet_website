import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Eventos, Alvernia Planet";
const description = "Eventos, sessões e atividades especiais na Alvernia Planet, perto de Cracóvia.";

// Zlokalizowane metadane aliasu PT polskiej trasy /wydarzenia.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/wydarzenia", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/events",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../wydarzenia/page";
