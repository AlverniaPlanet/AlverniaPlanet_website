import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Grupos, Alvernia Planet";
const description = "Percurso de filmagem para grupos escolares e organizados: programa completo e reserva de grupo online.";

// Zlokalizowane metadane aliasu PT polskiej trasy /grupy.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/grupy", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/groups",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../grupy/page";
