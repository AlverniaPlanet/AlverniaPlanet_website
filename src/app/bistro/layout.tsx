import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

import { BISTRO_COPY } from "./bistroCopy";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
const title = BISTRO_COPY.pl.meta.tytul;
const description = BISTRO_COPY.pl.meta.opis;

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/bistro", "pl"),
  /* Bez tego bloku strona dziedziczy `openGraph` z korzenia serwisu: link do
     bistra udostepniony na Facebooku czy WhatsAppie pokazywal tytul „Film
     World" i logo Alvernii zamiast jedzenia. Wersje jezykowe maja swoje
     odpowiedniki w `src/app/<jezyk>/bistro/page.tsx`. */
  openGraph: {
    title,
    description,
    url: "/bistro",
    siteName: "Alvernia Planet",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/bistro/og-bistro.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Znak Bistro pod Kopułami na tle blatu z daniami, Alvernia Planet",
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
