import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Runmageddon Kraków Alvernia Planet 09.–12.04.2026 beendet, Alvernia Planet";
const description = "Archiv der Veranstaltung Runmageddon Kraków Alvernia Planet vom 9. bis 12. April 2026. Die Anmeldung ist geschlossen.";

// Zlokalizowane metadane aliasu EN polskiej trasy /runmageddon.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/runmageddon", "de"),
  openGraph: {
    title,
    description,
    url: "/de/runmageddon",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../runmageddon/page";
