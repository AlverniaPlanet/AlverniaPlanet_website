import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "团体，Alvernia Planet";
const description = "面向学校与团体的电影之路：完整参观行程与在线团体预订。";

// Zlokalizowane metadane aliasu EN polskiej trasy /grupy.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/grupy", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/groups",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../grupy/page";
