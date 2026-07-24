import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import { FILM_SLUGS, findFilm, FILMS_COPY } from "../../../../atrakcje/kino-360/films";

// Angielski alias podstrony filmu Kina 360 — ta sama zawartość co kanoniczna
// /atrakcje/kino-360/[slug] (język treści ustala I18nProvider w en/layout),
// ale metadane (tytuł, opis, canonical, hreflang) są lokalizowane, żeby
// Google nie traktował tej strony jak duplikatu wersji polskiej.
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
  const desc = FILMS_COPY.en[slug]?.desc ?? "";
  const title = `${film.title}: K360 Cinema, Alvernia Planet`;
  return {
    title,
    description: desc,
    alternates: languageAlternates(`/atrakcje/kino-360/${slug}`, "en"),
    openGraph: {
      title,
      description: desc,
      url: `/en/attractions/k360/${slug}`,
      images: [{ url: film.poster }],
    },
  };
}

export { default } from "../../../../atrakcje/kino-360/[slug]/page";
