import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "图库，Alvernia Planet";
const description = "Alvernia Planet 图片：Kino 360 影院、Projekt: MARS、FILMWORLD 与各类活动。";

// Zlokalizowane metadane aliasu EN polskiej trasy /galeria.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/galeria", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/gallery",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../galeria/page";
