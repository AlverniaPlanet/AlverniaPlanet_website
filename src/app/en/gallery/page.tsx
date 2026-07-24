import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Gallery, Alvernia Planet";
const description = "Photos from Alvernia Planet: K360 Cinema, Project MARS, FILMWORLD and events.";

// Zlokalizowane metadane aliasu EN polskiej trasy /galeria.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/galeria", "en"),
  openGraph: {
    title,
    description,
    url: "/en/gallery",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../galeria/page";
