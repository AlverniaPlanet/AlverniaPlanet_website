import type { MetadataRoute } from "next";
import { GALLERY_CATEGORIES } from "./galeria/galleryData";
import { FILM_SLUGS } from "./atrakcje/kino-360/films";
import { getLocalizedPath, LOCALES } from "@/lib/localizedRoutes";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alverniaplanet.com";

/**
 * Trasy KANONICZNE (polskie). Warianty językowe wyliczamy niżej przez
 * getLocalizedPath — tę samą mapę, z której korzystają linki w serwisie
 * i hreflang. Wcześniej lista była wypisana ręcznie i potrojona (pl/en/pt),
 * więc każdy nowy język oznaczał przepisanie kilkudziesięciu linii i ryzyko
 * rozjazdu z faktycznym routingiem.
 */
const TRASY_WIELOJEZYCZNE = [
  "/",
  "/aktualnosci",
  "/wydarzenia",
  "/wydarzenia/vr",
  "/galeria",
  "/jak-dojechac",
  "/bistro",
  "/grupy",
  "/runmageddon",
  "/rezerwuj",
  "/o-alvernia-planet",
  "/kontakt",
  "/harry-potter-the-exhibition",
  "/atrakcje/filmworld",
  "/atrakcje/kino-360",
  "/faq",
  ...FILM_SLUGS.map((slug) => `/atrakcje/kino-360/${slug}`),
];

/** Trasy istniejące wyłącznie po polsku — bez wariantów językowych. */
const TRASY_TYLKO_PL = [
  "/atrakcje/mars",
  "/mars-colonization",
  "/mars/konkurs-wyladuj-na-marsie",
  ...GALLERY_CATEGORIES.map((category) => `/galeria/${category.slug}`),
];

const routes = Array.from(
  new Set([
    ...TRASY_WIELOJEZYCZNE.flatMap((path) =>
      LOCALES.map((locale) => getLocalizedPath(path, locale)),
    ),
    ...TRASY_TYLKO_PL,
  ]),
);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
  }));
}
