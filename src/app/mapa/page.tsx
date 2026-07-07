import type { Metadata } from "next";
import MapaContent from "./MapaContent";

// Podstrona dostępna tylko pod bezpośrednim linkiem /mapa, bez odnośnika
// w nawigacji i wykluczona z indeksowania oraz z mapy strony.
export const metadata: Metadata = {
  title: "Mapa zwiedzania | Alvernia Planet",
  description: "Interaktywna mapa trasy zwiedzania Alvernia Planet.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function MapaPage() {
  return <MapaContent />;
}
