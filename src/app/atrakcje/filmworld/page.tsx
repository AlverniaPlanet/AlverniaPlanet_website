import type { Metadata } from "next";
import WejdzPodKopuleContent from "./WejdzPodKopuleContent";

export const metadata: Metadata = {
  title: "FILMWORLD Alvernia Planet",
  description:
    "FILMWORLD Alvernia Planet: samodzielna trasa Free Flow przez kulisy filmu, muzyki i dźwięku. 30–60 minut, własne tempo, niebieskie światło.",
};

export default function Page() {
  return <WejdzPodKopuleContent />;
}
