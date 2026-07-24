import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Booking, Alvernia Planet";
const description = "Book tickets online: K360 Cinema, Project MARS and FILMWORLD at Alvernia Planet.";

// Zlokalizowane metadane aliasu EN polskiej trasy /rezerwuj.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/rezerwuj", "en"),
  openGraph: {
    title,
    description,
    url: "/en/reserve",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../rezerwuj/page";
