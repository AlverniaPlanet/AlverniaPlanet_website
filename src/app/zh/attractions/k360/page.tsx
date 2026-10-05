import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Kino 360 影院，Alvernia Planet";
const description = "Alvernia Planet 的 Kino 360 影院，欧洲最大的全穹顶影院。48 米穹顶、360 度画面，让您置身于影像之中。";

// Zlokalizowane metadane aliasu EN polskiej trasy /atrakcje/kino-360.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/atrakcje/kino-360", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/attractions/k360",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../../atrakcje/kino-360/page";
