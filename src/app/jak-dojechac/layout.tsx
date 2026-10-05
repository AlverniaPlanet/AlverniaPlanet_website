import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
export const metadata: Metadata = {
  title: "Jak dojechać, Alvernia Planet",
  description: "Jak dojechać do Alvernia Planet pod Krakowem: dojazd samochodem, parking oraz bus z dworca PKP w Krzeszowicach — rozkład na piątek, sobotę i niedzielę.",
  alternates: languageAlternates("/jak-dojechac", "pl"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Ramka z mapa Google stoi na tej podstronie w kazdej zakladce i jest
          najwolniejszym zasobem w kadrze. `preconnect` otwiera polaczenie
          (DNS + TCP + TLS) zanim ramka o nie poprosi, wiec mapa pojawia sie
          wczesniej. Tylko tutaj — na podstronach bez mapy byloby to marnowanie
          polaczenia. */}
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="" />
      {children}
    </>
  );
}
