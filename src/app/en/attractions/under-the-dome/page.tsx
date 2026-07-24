import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "FILMWORLD Alvernia Planet";
const description = "FILMWORLD at Alvernia Planet: a self-guided Free Flow route through the backstage of film, music and sound. 30-60 minutes at your own pace.";

// Zlokalizowane metadane aliasu EN polskiej trasy /atrakcje/filmworld.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/atrakcje/filmworld", "en"),
  openGraph: {
    title,
    description,
    url: "/en/attractions/under-the-dome",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../../atrakcje/filmworld/page";
