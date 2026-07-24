import { Suspense } from "react";
import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import VrPageContent from "./VrPageContent";
import VrHeaderFallback from "./VrHeaderFallback";

export const metadata: Metadata = {
  title: "Wirtualny spacer, Alvernia Planet",
  description:
    "Wirtualny spacer po Alvernia Planet: zajrzyj pod kopuły bez wychodzenia z domu.",
  alternates: languageAlternates("/wydarzenia/vr", "pl"),
};

// Suspense: VrPageContent używa useSearchParams(), co bez tej granicy
// wyłączało prerender całej strony (pusty statyczny HTML). Fallback
// prerenderuje nagłówek (H1 + intro) do HTML dla Google.
export default function EventsVrPage() {
  return (
    <Suspense fallback={<VrHeaderFallback />}>
      <VrPageContent />
    </Suspense>
  );
}
