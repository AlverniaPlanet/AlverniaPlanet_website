import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Runmageddon Cracóvia Alvernia Planet 09-12.04.2026 terminado, Alvernia Planet";
const description = "Arquivo do evento Runmageddon na Alvernia Planet, de 09 a 12 de abril de 2026. As inscrições estão encerradas.";

// Zlokalizowane metadane aliasu PT polskiej trasy /runmageddon.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/runmageddon", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/runmageddon",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../runmageddon/page";
