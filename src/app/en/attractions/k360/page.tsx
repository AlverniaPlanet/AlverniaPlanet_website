import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "K360 Cinema, Alvernia Planet";
const description = "K360 at Alvernia Planet, Europe's largest fulldome cinema. A 48 m dome, a 360 degree image all around, screenings of about 30 minutes. Tickets from 39 PLN.";

// Zlokalizowane metadane aliasu EN polskiej trasy /atrakcje/kino-360.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/atrakcje/kino-360", "en"),
  openGraph: {
    title,
    description,
    url: "/en/attractions/k360",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../../atrakcje/kino-360/page";
