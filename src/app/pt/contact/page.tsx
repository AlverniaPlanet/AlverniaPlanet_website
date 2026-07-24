import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Contacto, Alvernia Planet";
const description = "Contacto da Alvernia Planet: telefone, e-mail, morada e direções. Reservas individuais e de grupo.";

// Zlokalizowane metadane aliasu PT polskiej trasy /kontakt.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/kontakt", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/contact",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../kontakt/page";
