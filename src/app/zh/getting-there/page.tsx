import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "交通指南，Alvernia Planet";
const description = "如何前往 Kraków 附近的 Alvernia Planet：自驾路线、停车信息，以及从 Krzeszowice 火车站出发的接驳巴士（周五、周六、周日时刻表）。";

// Zlokalizowane metadane aliasu EN polskiej trasy /jak-dojechac.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/jak-dojechac", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/getting-there",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../jak-dojechac/page";
