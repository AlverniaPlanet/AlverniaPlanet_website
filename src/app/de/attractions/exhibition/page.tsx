import type { Metadata } from "next";
import LegacyRedirectContent from "@/app/components/LegacyRedirectContent";

// Stary adres /de/attractions/exhibition, kanoniczny jest teraz /de/harry-potter-the-exhibition.
// Statyczny eksport (output: "export") → przekierowanie po stronie klienta.
const TARGET_PATH = "/de/harry-potter-the-exhibition";

export const metadata: Metadata = {
  title: "Harry Potter: The Exhibition, Alvernia Planet",
  alternates: {
    canonical: TARGET_PATH,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LegacyEnExhibitionRedirect() {
  return <LegacyRedirectContent targetPath={TARGET_PATH} label="Harry Potter: The Exhibition" />;
}
