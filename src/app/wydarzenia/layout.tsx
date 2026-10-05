import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
// Strona jest landing page'em WYNAJMU przestrzeni eventowej (B2B), a nie
// zapowiedzią seansów — tytuł i opis muszą to komunikować wprost. Zakres zmiany
// świadomie ograniczony do trasy /wydarzenia; aliasy językowe mają własne pliki.
const title = "Wynajem przestrzeni eventowej, Alvernia Planet";
const description =
  "Kopuły eventowe pod Krakowem: 2 × 2 000 m², wysokość do 15 m, przyłącza do 1 MW, dojazd z A4 między Krakowem a Katowicami. Gale, konferencje, koncerty, premiery i targi. Zapytaj o termin.";

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/wydarzenia", "pl"),
  openGraph: {
    title,
    description,
    url: "/wydarzenia",
    siteName: "Alvernia Planet",
    locale: "pl_PL",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
