import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "News, Alvernia Planet";
const description = "Latest news and announcements from Alvernia Planet.";

// Zlokalizowane metadane aliasu EN polskiej trasy /aktualnosci.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/aktualnosci", "en"),
  openGraph: {
    title,
    description,
    url: "/en/news",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../aktualnosci/page";
