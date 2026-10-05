import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "虚拟导览，Alvernia Planet";
const description = "Alvernia Planet 虚拟导览：足不出户，走进穹顶之下。";

// Zlokalizowane metadane aliasu EN polskiej trasy /wydarzenia/vr.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/wydarzenia/vr", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/events/vr",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
  },
};

export { default } from "../../../wydarzenia/vr/page";
