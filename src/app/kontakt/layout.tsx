import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
export const metadata: Metadata = {
  title: "Kontakt, Alvernia Planet",
  description: "Kontakt do Alvernia Planet: telefon, e-mail, adres i dojazd. Rezerwacje indywidualne i grupowe.",
  alternates: languageAlternates("/kontakt", "pl"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
