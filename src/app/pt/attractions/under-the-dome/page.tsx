import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "FILMWORLD Alvernia Planet";
const description = "FILMWORLD na Alvernia Planet: percurso livre Free Flow pelos bastidores do cinema, da música e do som. 30-60 minutos ao teu ritmo.";

// Zlokalizowane metadane aliasu PT polskiej trasy /atrakcje/filmworld.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/atrakcje/filmworld", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/attractions/under-the-dome",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../../atrakcje/filmworld/page";
