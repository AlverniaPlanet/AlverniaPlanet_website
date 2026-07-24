import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Reservas, Alvernia Planet";
const description = "Reserva bilhetes online: Cinema K360, Projeto MARS e FILMWORLD na Alvernia Planet.";

// Zlokalizowane metadane aliasu PT polskiej trasy /rezerwuj.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/rezerwuj", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/reservar",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../rezerwuj/page";
