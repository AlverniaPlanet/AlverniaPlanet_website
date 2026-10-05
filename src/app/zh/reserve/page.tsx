import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "预订，Alvernia Planet";
const description = "在线预订门票：Alvernia Planet 的 Kino 360 影院、Projekt: MARS 与 FILMWORLD。";

// Zlokalizowane metadane aliasu EN polskiej trasy /rezerwuj.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/rezerwuj", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/reserve",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../rezerwuj/page";
