import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Passeio virtual, Alvernia Planet";
const description = "Um passeio virtual pela Alvernia Planet: espreita debaixo das cúpulas sem sair de casa.";

// Zlokalizowane metadane aliasu PT polskiej trasy /wydarzenia/vr.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/wydarzenia/vr", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/events/vr",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../../wydarzenia/vr/page";
