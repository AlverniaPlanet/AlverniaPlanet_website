import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import WejdzPodKopuleContent from "./WejdzPodKopuleContent";

export const metadata: Metadata = {
  title: "FILMWORLD Alvernia Planet",
  description:
    "FILMWORLD Alvernia Planet: zwiedzanie z przewodnikiem przez kulisy filmu, muzyki i dźwięku. 1 godz. 15 min, sześć przystanków pod Krakowem.",
  alternates: languageAlternates("/atrakcje/filmworld", "pl"),
};

export default function Page() {
  return <WejdzPodKopuleContent />;
}
