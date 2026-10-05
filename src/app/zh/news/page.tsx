import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "最新消息，Alvernia Planet";
const description = "来自 Alvernia Planet 的最新消息与公告。";

// Zlokalizowane metadane aliasu EN polskiej trasy /aktualnosci.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/aktualnosci", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/news",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../aktualnosci/page";
