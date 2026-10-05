import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Kino 360, Alvernia Planet";
const description = "Kino 360 bei Alvernia Planet — Europas größtes Fulldome-Kino. Eine 48-m-Kuppel, ein 360-Grad-Bild und Filme, die Sie mitten ins Geschehen versetzen.";

// Zlokalizowane metadane aliasu EN polskiej trasy /atrakcje/kino-360.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/atrakcje/kino-360", "de"),
  openGraph: {
    title,
    description,
    url: "/de/attractions/k360",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../../atrakcje/kino-360/page";
