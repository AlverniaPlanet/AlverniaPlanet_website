import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import HomeClient from "./HomeClient";

// Serwerowy wrapper strony głównej: cały ekran to komponent kliencki
// (HomeClient), a komponenty klienckie nie mogą eksportować `metadata`.
// Tytuł i opis dziedziczymy z root layoutu; tu dokładamy canonical + hreflang.
export const metadata: Metadata = {
  alternates: languageAlternates("/", "pl"),
};

export default function Page() {
  return <HomeClient />;
}
