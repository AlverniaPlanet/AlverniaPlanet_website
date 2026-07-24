import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Notícias, Alvernia Planet";
const description = "Últimas notícias e novidades da Alvernia Planet.";

// Zlokalizowane metadane aliasu PT polskiej trasy /aktualnosci.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/aktualnosci", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/news",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../aktualnosci/page";
