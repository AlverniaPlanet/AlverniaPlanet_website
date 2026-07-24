import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Harry Potter: The Exhibition, Alvernia Planet";
const description = "Harry Potter: The Exhibition at Alvernia Planet, hosted from 11 April to 17 August 2025.";

// Zlokalizowane metadane aliasu EN polskiej trasy /harry-potter-the-exhibition.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/harry-potter-the-exhibition", "en"),
  openGraph: {
    title,
    description,
    url: "/en/harry-potter-the-exhibition",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../harry-potter-the-exhibition/page";
