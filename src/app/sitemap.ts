import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alverniaplanet.com";

const routes = [
  "/",
  "/en",
  "/pt",
  "/wydarzenia",
  "/en/events",
  "/pt/events",
  "/jak-dojechac",
  "/en/getting-there",
  "/pt/getting-there",
  "/bilety",
  "/en/tickets",
  "/pt/tickets",
  "/o-alvernia-planet",
  "/en/about",
  "/pt/about",
  "/galeria",
  "/en/gallery",
  "/pt/gallery",
  "/kontakt",
  "/en/contact",
  "/pt/contact",
  "/aktualnosci",
  "/en/news",
  "/pt/news",
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
