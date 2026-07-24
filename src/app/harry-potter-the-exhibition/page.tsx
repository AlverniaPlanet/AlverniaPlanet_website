import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import WystawaContent from "./WystawaContent";

export const metadata: Metadata = {
  title: "Harry Potter: The Exhibition, Alvernia Planet",
  description: "Harry Potter: The Exhibition w Alvernia Planet, wystawa, która gościła u nas od 11 kwietnia do 17 sierpnia 2025.",
  alternates: languageAlternates("/harry-potter-the-exhibition", "pl"),
};

export default function WystawaPage() {
  return <WystawaContent />;
}
