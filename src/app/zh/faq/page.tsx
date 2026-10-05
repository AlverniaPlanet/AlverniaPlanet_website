import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "常见问题，Alvernia Planet";
const description = "关于参观 Alvernia Planet 的常见问题解答：门票、开放时间、交通与各项目。";

// Zlokalizowane metadane aliasu EN polskiej trasy /faq.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/faq", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/faq",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../faq/page";
