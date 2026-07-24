import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
export const metadata: Metadata = {
  title: "Rezerwacja biletów, Alvernia Planet",
  description: "Kup bilety online: Kino 360, Projekt MARS i FILMWORLD w Alvernia Planet. Wybierz termin i zarezerwuj miejsca.",
  alternates: languageAlternates("/rezerwuj", "pl"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
