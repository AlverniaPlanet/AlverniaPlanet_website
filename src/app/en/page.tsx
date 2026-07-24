import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Zlokalizowane meta dla /en (dotąd dziedziczyło polskie title/description/og:locale).
const title = "Alvernia Planet: Film World - Explore the world of film!";
const description =
  "Europe's largest 360° dome cinema (48 m), Project MARS and FILMWORLD near Kraków. Four fulldome films, workshops and events for the whole family. Book tickets online.";

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/", "en"),
  openGraph: {
    title,
    description,
    url: "/en",
    siteName: "Alvernia Planet",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo_alvernia_planet_neg_RGB.png",
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
    images: ["/logo_alvernia_planet_neg_RGB.png"],
  },
};

export { default } from "../page";
