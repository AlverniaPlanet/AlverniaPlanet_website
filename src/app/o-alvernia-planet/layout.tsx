import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Layout istnieje wyłącznie po to, by dodać metadane (tytuł, opis, canonical,
// hreflang): sama strona jest komponentem klienckim ("use client") i nie może
// eksportować `metadata`.
export const metadata: Metadata = {
  title: "O Alvernia Planet",
  description: "Historia Alvernia Planet: studio filmowe pod 13 kopułami pod Krakowem. Poznaj miejsce, w którym powstaje filmowa magia.",
  alternates: languageAlternates("/o-alvernia-planet", "pl"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
