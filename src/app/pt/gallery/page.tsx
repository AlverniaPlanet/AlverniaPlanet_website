import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Galeria, Alvernia Planet";
const description = "Fotos da Alvernia Planet: Cinema K360, Projeto MARS, FILMWORLD e eventos.";

// Zlokalizowane metadane aliasu PT polskiej trasy /galeria.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/galeria", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/gallery",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../galeria/page";
