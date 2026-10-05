import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Aktuelles, Alvernia Planet";
const description = "Neuigkeiten und Ankündigungen von Alvernia Planet.";

// Zlokalizowane metadane aliasu EN polskiej trasy /aktualnosci.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/aktualnosci", "de"),
  openGraph: {
    title,
    description,
    url: "/de/news",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../aktualnosci/page";
