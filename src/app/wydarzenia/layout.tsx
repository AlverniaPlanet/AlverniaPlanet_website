import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
export const metadata: Metadata = {
  title: "Wydarzenia, Alvernia Planet",
  description: "Wydarzenia, seanse i aktywności specjalne w Alvernia Planet.",
  alternates: languageAlternates("/wydarzenia", "pl"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
