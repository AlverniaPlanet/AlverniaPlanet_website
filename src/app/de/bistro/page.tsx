import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

import { BISTRO_COPY } from "../../bistro/bistroCopy";

// Zlokalizowane metadane aliasu DE polskiej trasy /bistro.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
const title = BISTRO_COPY.de.meta.tytul;
const description = BISTRO_COPY.de.meta.opis;

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/bistro", "de"),
  openGraph: {
    title,
    description,
    url: "/de/bistro",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/bistro/og-bistro.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Das Logo des Bistro pod Kopułami über einem Tisch mit Gerichten, Alvernia Planet",
      },
    ],
  },
};

export { default } from "../../bistro/page";
