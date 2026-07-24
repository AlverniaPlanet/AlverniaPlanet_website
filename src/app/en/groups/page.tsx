import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Groups, Alvernia Planet";
const description = "Film path for school and organised groups: full tour programme and online group booking.";

// Zlokalizowane metadane aliasu EN polskiej trasy /grupy.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/grupy", "en"),
  openGraph: {
    title,
    description,
    url: "/en/groups",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../grupy/page";
