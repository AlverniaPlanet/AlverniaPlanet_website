import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import K360Content from "./K360Content";

export const metadata: Metadata = {
  title: "Kino 360, Alvernia Planet",
  description:
    "Kino 360 w Alvernia Planet, największe kino fulldome w Europie. Kopuła 48 m, obraz 360° dookoła widza, seans ok. 30 minut. Bilety od 39 zł.",
  alternates: languageAlternates("/atrakcje/kino-360", "pl"),
};

export default function Kino360Page() {
  return <K360Content />;
}
