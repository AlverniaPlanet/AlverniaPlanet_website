import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "关于 Alvernia Planet";
const description = "Alvernia Planet 的故事：Kraków 附近由 13 座穹顶构成的电影制片厂。";

// Zlokalizowane metadane aliasu EN polskiej trasy /o-alvernia-planet.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/o-alvernia-planet", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/about",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../o-alvernia-planet/page";
