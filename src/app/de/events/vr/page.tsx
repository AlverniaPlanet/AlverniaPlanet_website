import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

const title = "Virtueller Rundgang, Alvernia Planet";
const description = "Ein virtueller Rundgang durch Alvernia Planet: ein Blick unter die Kuppeln, ganz bequem von zu Hause.";

// Zlokalizowane metadane aliasu EN polskiej trasy /wydarzenia/vr.
// Treść strony jest wspólna, ale tytuł, opis, canonical i hreflang muszą być
// własne, żeby Google nie traktował tej strony jak duplikatu wersji polskiej.
export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/wydarzenia/vr", "de"),
  openGraph: {
    title,
    description,
    url: "/de/events/vr",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
  },
};

export { default } from "../../../wydarzenia/vr/page";
