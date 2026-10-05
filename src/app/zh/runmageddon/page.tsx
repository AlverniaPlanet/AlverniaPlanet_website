import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Runmageddon Kraków Alvernia Planet 2026.04.09–12 已结束，Alvernia Planet";
const description = "Runmageddon Kraków Alvernia Planet 活动存档，举办日期为 2026 年 4 月 9 日至 12 日。报名已关闭。";

// Zlokalizowane metadane aliasu EN polskiej trasy /runmageddon.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/runmageddon", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/runmageddon",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../runmageddon/page";
