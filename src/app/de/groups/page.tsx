import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Gruppen, Alvernia Planet";
const description = "Filmpfad für Schulklassen und organisierte Gruppen: komplettes Besuchsprogramm und Online-Buchung für Gruppen.";

// Zlokalizowane metadane aliasu EN polskiej trasy /grupy.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/grupy", "de"),
  openGraph: {
    title,
    description,
    url: "/de/groups",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../grupy/page";
