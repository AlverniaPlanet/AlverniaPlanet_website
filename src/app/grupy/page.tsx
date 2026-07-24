import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import DomeJourneyContent from "./DomeJourneyContent";

export const metadata: Metadata = {
  title: "Grupy, Ścieżka filmowa, Alvernia Planet",
  description:
    "Ścieżka filmowa dla grup szkolnych i zorganizowanych: pełny program zwiedzania i rezerwacja biletu grupowego online.",
  alternates: languageAlternates("/grupy", "pl"),
};

export default function Page() {
  return <DomeJourneyContent audience="groups" />;
}
