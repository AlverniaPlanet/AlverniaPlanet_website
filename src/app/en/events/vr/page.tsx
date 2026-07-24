import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Virtual tour, Alvernia Planet";
const description = "A virtual tour of Alvernia Planet: look under the domes without leaving home.";

// Zlokalizowane metadane aliasu EN polskiej trasy /wydarzenia/vr.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/wydarzenia/vr", "en"),
  openGraph: {
    title,
    description,
    url: "/en/events/vr",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../../wydarzenia/vr/page";
