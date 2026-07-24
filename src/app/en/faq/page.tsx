import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Frequently asked questions, Alvernia Planet";
const description = "Answers to the most common questions about visiting Alvernia Planet: tickets, opening hours and attractions.";

// Zlokalizowane metadane aliasu EN polskiej trasy /faq.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/faq", "en"),
  openGraph: {
    title,
    description,
    url: "/en/faq",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../faq/page";
