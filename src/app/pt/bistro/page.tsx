import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

import { BISTRO_COPY } from "../../bistro/bistroCopy";

// Zlokalizowane metadane aliasu PT polskiej trasy /bistro.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
const title = BISTRO_COPY.pt.meta.tytul;
const description = BISTRO_COPY.pt.meta.opis;

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/bistro", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt/bistro",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/bistro/og-bistro.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "O logótipo do Bistro pod Kopułami sobre uma mesa com pratos, Alvernia Planet",
      },
    ],
  },
};

export { default } from "../../bistro/page";
