import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "FILMWORLD，Alvernia Planet";
const description = "Alvernia Planet 的 FILMWORLD：由导览员带领，走进电影、音乐与声音的幕后。";

// Zlokalizowane metadane aliasu EN polskiej trasy /atrakcje/filmworld.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/atrakcje/filmworld", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/attractions/under-the-dome",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../../atrakcje/filmworld/page";
