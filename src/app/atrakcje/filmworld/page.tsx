import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import WejdzPodKopuleContent from "./WejdzPodKopuleContent";

export const metadata: Metadata = {
  title: "FILMWORLD Alvernia Planet",
  description:
    "FILMWORLD Alvernia Planet: samodzielna trasa Free Flow przez kulisy filmu, muzyki i dźwięku. 30–60 minut, własne tempo, niebieskie światło.",
  alternates: languageAlternates("/atrakcje/filmworld", "pl"),
};

export default function Page() {
  return <WejdzPodKopuleContent />;
}
