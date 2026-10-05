import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Harry Potter: The Exhibition，Alvernia Planet";
const description = "Alvernia Planet 举办的 Harry Potter: The Exhibition，展期为 2025 年 4 月 11 日至 8 月 17 日。";

// Zlokalizowane metadane aliasu EN polskiej trasy /harry-potter-the-exhibition.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/harry-potter-the-exhibition", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/harry-potter-the-exhibition",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../harry-potter-the-exhibition/page";
