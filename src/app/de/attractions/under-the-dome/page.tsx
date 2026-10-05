import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "FILMWORLD, Alvernia Planet";
const description = "FILMWORLD bei Alvernia Planet: ein geführter Rundgang hinter die Kulissen von Film, Musik und Ton.";

// Zlokalizowane metadane aliasu EN polskiej trasy /atrakcje/filmworld.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/atrakcje/filmworld", "de"),
  openGraph: {
    title,
    description,
    url: "/de/attractions/under-the-dome",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../../atrakcje/filmworld/page";
