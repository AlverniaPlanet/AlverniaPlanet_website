import type { Metadata } from "next";

import { MARS_COPY } from "./marsCopy";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
const title = MARS_COPY.pl.meta.tytul;
const description = MARS_COPY.pl.meta.opis;

export const metadata: Metadata = {
  title,
  description,
  /* Sam `canonical`, BEZ `languageAlternates`: na etapie zapowiedzi landing
     istnieje wyłącznie po polsku, a hreflang wskazujący na `/en/...`, `/de/...`
     itd. prowadziłby Google do czterech nieistniejących adresów. Przy dokładaniu
     wersji obcojęzycznych wrócić tu do `languageAlternates("/mars-colonization", "pl")`. */
  alternates: { canonical: "/mars-colonization" },
  /* Bez tego bloku strona dziedziczy `openGraph` z korzenia serwisu: link do
     landingu udostępniony na Facebooku czy WhatsAppie pokazywałby tytuł
     „Film World” i logo Alvernii zamiast Marsa. Wersje językowe mają swoje
     odpowiedniki w `src/app/<jezyk>/mars-colonization/page.tsx`. */
  openGraph: {
    title,
    description,
    url: "/mars-colonization",
    siteName: "Alvernia Planet",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/mars-colonization/podglad-linku/og-mars-colonization.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Mars Colonization w Alvernia Planet — marsjańska kolonia pod kopułą",
      },
    ],
  },

  /* Bez tego bloku X/Twitter bierze kartę z korzenia serwisu i pokazuje
     „Film World” z logo Alvernii zamiast Marsa — dokładnie tak, jak działo
     się to z `openGraph` przed dodaniem go wyżej. */
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/mars-colonization/podglad-linku/og-mars-colonization.jpg", alt: "Mars Colonization w Alvernia Planet — marsjańska kolonia pod kopułą" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
