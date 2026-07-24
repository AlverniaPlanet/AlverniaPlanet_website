import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Harry Potter: The Exhibition, Alvernia Planet";
const description = "Harry Potter: The Exhibition na Alvernia Planet, de 11 de abril a 17 de agosto de 2025.";

// Zlokalizowane metadane aliasu PT polskiej trasy /harry-potter-the-exhibition.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/harry-potter-the-exhibition", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/harry-potter-the-exhibition",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../harry-potter-the-exhibition/page";
