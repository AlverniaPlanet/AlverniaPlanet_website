import type { Metadata } from "next";
import KonkursContent from "./KonkursContent";

export const metadata: Metadata = {
  title: "Konkurs filmowy „Lądowanie na Marsie”, Alvernia Planet",
  description:
    "Nakręć krótki film (30–90 s) na pełnoskalowym planie marsjańskim w Alvernia Planet i zgłoś go do konkursu „Lądowanie na Marsie”. Najlepsze prace mogą trafić na międzynarodowy festiwal FINC w Brazylii. Zasady, wytyczne i terminy.",
  // Strona istnieje tylko po polsku — canonical wskazuje na siebie.
  alternates: { canonical: "/mars/konkurs-wyladuj-na-marsie" },
};

export default function KonkursWyladujNaMarsiePage() {
  return <KonkursContent />;
}
