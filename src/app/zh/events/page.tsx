import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "活动，Alvernia Planet";
const description = "Kraków 附近 Alvernia Planet 的活动、放映与特别节目。";

// Zlokalizowane metadane aliasu EN polskiej trasy /wydarzenia.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/wydarzenia", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/events",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../wydarzenia/page";
