import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Contact, Alvernia Planet";
const description = "Contact Alvernia Planet: phone, e-mail, address and directions. Individual and group bookings.";

// Zlokalizowane metadane aliasu EN polskiej trasy /kontakt.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/kontakt", "en"),
  openGraph: {
    title,
    description,
    url: "/en/contact",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
  },
};

export { default } from "../../kontakt/page";
