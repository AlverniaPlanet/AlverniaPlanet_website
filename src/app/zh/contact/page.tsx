import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "联系我们，Alvernia Planet";
const description = "联系 Alvernia Planet：电话、电子邮件、地址与交通方式。个人与团体预订。";

// Zlokalizowane metadane aliasu EN polskiej trasy /kontakt.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/kontakt", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/contact",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../kontakt/page";
