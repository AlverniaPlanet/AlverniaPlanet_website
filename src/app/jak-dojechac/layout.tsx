import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
export const metadata: Metadata = {
  title: "Jak dojechać, Alvernia Planet",
  description: "Jak dojechać do Alvernia Planet pod Krakowem: wskazówki dojazdu, parking i transport.",
  alternates: languageAlternates("/jak-dojechac", "pl"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
