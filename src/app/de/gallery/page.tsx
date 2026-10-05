import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Galerie, Alvernia Planet";
const description = "Fotos von Alvernia Planet: Kino 360, Projekt: MARS, FILMWORLD und Veranstaltungen.";

// Zlokalizowane metadane aliasu EN polskiej trasy /galeria.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/galeria", "de"),
  openGraph: {
    title,
    description,
    url: "/de/gallery",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../galeria/page";
