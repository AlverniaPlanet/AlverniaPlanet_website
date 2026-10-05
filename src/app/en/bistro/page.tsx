import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

import { BISTRO_COPY } from "../../bistro/bistroCopy";

// Zlokalizowane metadane aliasu EN polskiej trasy /bistro.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
const title = BISTRO_COPY.en.meta.tytul;
const description = BISTRO_COPY.en.meta.opis;

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/bistro", "en"),
  openGraph: {
    title,
    description,
    url: "/en/bistro",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/bistro/og-bistro.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "The Bistro pod Kopułami logo over a table of dishes, Alvernia Planet",
      },
    ],
  },
};

export { default } from "../../bistro/page";
