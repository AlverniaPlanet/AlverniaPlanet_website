import type { Metadata } from "next";
import LegacyRedirectContent from "@/app/components/LegacyRedirectContent";

// Stary adres /atrakcje/k360, kanoniczny jest teraz /atrakcje/kino-360.
// Statyczny eksport → przekierowanie po stronie klienta.
const TARGET_PATH = "/atrakcje/kino-360";

export const metadata: Metadata = {
  title: "Kino 360: Alvernia Planet",
  alternates: {
    canonical: TARGET_PATH,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LegacyK360PageRedirect() {
  return <LegacyRedirectContent targetPath={TARGET_PATH} label="Kino 360" />;
}
