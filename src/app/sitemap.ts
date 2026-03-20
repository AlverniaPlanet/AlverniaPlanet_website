import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alverniaplanet.com";

const routes = [
  "/",
  "/en",
  "/pt",
  "/aktualnosci",
  "/en/news",
  "/pt/news",
  "/wydarzenia",
  "/en/events",
  "/pt/events",
  "/galeria",
  "/en/gallery",
  "/pt/gallery",
  "/jak-dojechac",
  "/en/getting-there",
  "/pt/getting-there",
  "/rezerwuj",
  "/en/reserve",
  "/pt/reservar",
  "/o-alvernia-planet",
  "/en/about",
  "/pt/about",
  "/kontakt",
  "/en/contact",
  "/pt/contact",
  "/atrakcje/wystawa",
  "/en/attractions/exhibition",
  "/pt/attractions/exhibition",
  "/atrakcje/sciezka-filmowa",
  "/en/attractions/film-path",
  "/pt/attractions/film-path",
  "/atrakcje/kino-360",
  "/en/attractions/cinema-360",
  "/pt/attractions/cinema-360",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
  }));
}
