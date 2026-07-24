import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import { FILM_SLUGS, findFilm, FILMS_COPY } from "../../../../atrakcje/kino-360/films";

// Portugalski alias podstrony filmu Kina 360 — analogicznie do wersji EN:
// wspólna treść, własne lokalizowane metadane (tytuł, opis, canonical, hreflang).
export const dynamicParams = false;

export function generateStaticParams() {
  return FILM_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const film = findFilm(slug);
  if (!film) return {};
  const desc = FILMS_COPY.pt[slug]?.desc ?? "";
  const title = `${film.title}: Cinema K360, Alvernia Planet`;
  return {
    title,
    description: desc,
    alternates: languageAlternates(`/atrakcje/kino-360/${slug}`, "pt"),
    openGraph: {
      title,
      description: desc,
      url: `/pt/attractions/k360/${slug}`,
      images: [{ url: film.poster }],
    },
  };
}

export { default } from "../../../../atrakcje/kino-360/[slug]/page";
