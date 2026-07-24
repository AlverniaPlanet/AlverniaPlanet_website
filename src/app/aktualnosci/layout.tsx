import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
export const metadata: Metadata = {
  title: "Aktualności, Alvernia Planet",
  description: "Najnowsze aktualności i ogłoszenia z Alvernia Planet.",
  alternates: languageAlternates("/aktualnosci", "pl"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
