import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Meta localizada para /pt (antes herdava title/description/og:locale em polaco).
const title = "Alvernia Planet: Film World - Descobre o mundo do cinema!";
const description =
  "O maior cinema 360° da Europa (cúpula de 48 m), Projeto MARS e FILMWORLD perto de Cracóvia. Quatro filmes fulldome, workshops e eventos para toda a família. Reserva bilhetes online.";

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/", "pt"),
  openGraph: {
    title,
    description,
    url: "/pt",
    siteName: "Alvernia Planet",
    locale: "pt_PT",
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
