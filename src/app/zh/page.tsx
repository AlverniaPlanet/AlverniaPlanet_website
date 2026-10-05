import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";

// Zlokalizowane meta dla /en (dotąd dziedziczyło polskie title/description/og:locale).
const title = "Alvernia Planet：电影世界 — 探索电影的天地！";
const description =
  "欧洲最大的 360° 穹顶影院（48 米）、Projekt: MARS 与 FILMWORLD，位于 Kraków 附近。四部全穹顶影片、工作坊与适合全家的活动。在线预订门票。";

export const metadata: Metadata = {
  title,
  description,
  alternates: languageAlternates("/", "zh"),
  openGraph: {
    title,
    description,
    url: "/zh",
    siteName: "Alvernia Planet",
    locale: "zh_CN",
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
