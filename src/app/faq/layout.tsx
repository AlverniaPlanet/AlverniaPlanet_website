import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
export const metadata: Metadata = {
  title: "Najczęściej zadawane pytania, Alvernia Planet",
  description: "Odpowiedzi na najczęstsze pytania o wizytę w Alvernia Planet: bilety, godziny otwarcia, dojazd i atrakcje.",
  alternates: languageAlternates("/faq", "pl"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
