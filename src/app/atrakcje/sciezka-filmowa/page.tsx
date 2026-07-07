import type { Metadata } from "next";
import LegacyRedirectContent from "@/app/components/LegacyRedirectContent";

// "Ścieżka filmowa" jako osobna atrakcja indywidualna już nie istnieje.
// Pełny program przeniesiono na podstronę Grupy. Stary adres przekierowuje,
// żeby nie psuć linków i SEO.
const TARGET_PATH = "/grupy";

export const metadata: Metadata = {
  title: "Ścieżka filmowa, Alvernia Planet",
  alternates: { canonical: TARGET_PATH },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirectContent targetPath={TARGET_PATH} label="Ścieżka filmowa" />;
}
