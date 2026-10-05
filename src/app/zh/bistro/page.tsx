import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

import { BISTRO_COPY } from "../../bistro/bistroCopy";

// Zlokalizowane metadane aliasu ZH polskiej trasy /bistro.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
const title = BISTRO_COPY.zh.meta.tytul;
const description = BISTRO_COPY.zh.meta.opis;

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/bistro", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh/bistro",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/bistro/og-bistro.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Bistro pod Kopułami 的标志，背景是摆满菜肴的餐台，Alvernia Planet",
      },
    ],
  },
};

export { default } from "../../bistro/page";
