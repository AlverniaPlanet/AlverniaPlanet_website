import type { Metadata } from "next";
import LegacyRedirectContent from "@/app/components/LegacyRedirectContent";

// Stary adres /atrakcje/wejdz-pod-kopule, kanoniczny jest teraz /atrakcje/filmworld.
// Statyczny eksport → przekierowanie po stronie klienta (jak /atrakcje/k360 → kino-360).
const TARGET_PATH = "/atrakcje/filmworld";

export const metadata: Metadata = {
  title: "FILMWORLD, Alvernia Planet",
  alternates: {
    canonical: TARGET_PATH,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LegacyWejdzPodKopuleRedirect() {
  return <LegacyRedirectContent targetPath={TARGET_PATH} label="FILMWORLD" />;
}
