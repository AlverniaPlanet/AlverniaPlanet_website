import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Anfahrt, Alvernia Planet";
const description = "So erreichen Sie Alvernia Planet bei Kraków: Anfahrt mit dem Auto, Parkplätze und der Shuttlebus ab Bahnhof Krzeszowice — Fahrplan für Freitag, Samstag und Sonntag.";

// Zlokalizowane metadane aliasu EN polskiej trasy /jak-dojechac.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/jak-dojechac", "de"),
  openGraph: {
    title,
    description,
    url: "/de/getting-there",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../jak-dojechac/page";
