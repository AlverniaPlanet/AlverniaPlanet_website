import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
export const metadata: Metadata = {
  title: "Galeria, Alvernia Planet",
  description: "Zdjęcia z Alvernia Planet: Kino 360, Projekt MARS, FILMWORLD i wydarzenia.",
  alternates: languageAlternates("/galeria", "pl"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
