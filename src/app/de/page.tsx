import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Zlokalizowane meta dla /en (dotąd dziedziczyło polskie title/description/og:locale).
const title = "Alvernia Planet: Filmwelt — Entdecken Sie die Welt des Films!";
const description =
  "Europas größtes 360°-Kuppelkino (48 m), Projekt: MARS und FILMWORLD in der Nähe von Kraków. Vier Fulldome-Filme, Workshops und Veranstaltungen für die ganze Familie. Tickets online buchen.";

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/", "de"),
  openGraph: {
    title,
    description,
    url: "/de",
    siteName: "Alvernia Planet",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/wspolne/logotypy/logo-alvernia-planet-negatyw.png",
        width: 1920,
        height: 1080,
        type: "image/png",
        alt: "Alvernia Planet logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/wspolne/logotypy/logo-alvernia-planet-negatyw.png"],
  },
};

export { default } from "../page";
