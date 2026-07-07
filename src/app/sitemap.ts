import type { MetadataRoute } from "next";
import { GALLERY_CATEGORIES } from "./galeria/galleryData";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alverniaplanet.com";

const galleryCategoryRoutes = GALLERY_CATEGORIES.map(
  (category) => `/galeria/${category.slug}`,
);

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
  "/grupy",
  "/en/groups",
  "/pt/groups",
  "/runmageddon",
  "/en/runmageddon",
  "/pt/runmageddon",
  "/rezerwuj",
  "/en/reserve",
  "/pt/reservar",
  "/o-alvernia-planet",
  "/en/about",
  "/pt/about",
  "/kontakt",
  "/en/contact",
  "/pt/contact",
  "/harry-potter-the-exhibition",
  "/en/harry-potter-the-exhibition",
  "/pt/harry-potter-the-exhibition",
  "/atrakcje/filmworld",
  "/en/attractions/under-the-dome",
  "/pt/attractions/under-the-dome",
  "/atrakcje/kino-360",
  "/en/attractions/k360",
  "/pt/attractions/k360",
  ...galleryCategoryRoutes,
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
  }));
}
