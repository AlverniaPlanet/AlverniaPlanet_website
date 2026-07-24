import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Perguntas mais frequentes, Alvernia Planet";
const description = "Respostas às perguntas mais frequentes sobre a visita à Alvernia Planet: bilhetes, horários e atrações.";

// Zlokalizowane metadane aliasu PT polskiej trasy /faq.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/faq", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/faq",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../faq/page";
