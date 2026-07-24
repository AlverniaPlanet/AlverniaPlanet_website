import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Runmageddon Kraków Alvernia Planet 09-12.04.2026 finished, Alvernia Planet";
const description = "Archive of the Runmageddon Kraków Alvernia Planet event, 09-12 April 2026. Registration and special activities are closed.";

// Zlokalizowane metadane aliasu EN polskiej trasy /runmageddon.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/runmageddon", "en"),
  openGraph: {
    title,
    description,
    url: "/en/runmageddon",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../runmageddon/page";
