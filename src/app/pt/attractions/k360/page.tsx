import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Cinema K360, Alvernia Planet";
const description = "O K360 na Alvernia Planet, o maior cinema fulldome da Europa. Cúpula de 48 m, imagem de 360 graus à volta do público, sessões de cerca de 30 minutos. Bilhetes desde 39 PLN.";

// Zlokalizowane metadane aliasu PT polskiej trasy /atrakcje/kino-360.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/atrakcje/kino-360", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/attractions/k360",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
  },
};

export { default } from "../../../atrakcje/kino-360/page";
