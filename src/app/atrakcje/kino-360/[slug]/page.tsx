import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { languageAlternates } from "@/lib/seo";
import FilmContent from "./FilmContent";
import { FILM_SLUGS, findFilm, FILMS_COPY } from "../films";

// Statyczny eksport: wszystkie slugi znane z góry, brak dynamicznych.
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
  const desc = FILMS_COPY.pl[slug]?.desc ?? "";
  const canonical = `/atrakcje/kino-360/${slug}`;
  return {
    title: `${film.title}: Kino 360, Alvernia Planet`,
    description: desc,
    alternates: languageAlternates(canonical, "pl"),
    openGraph: {
      title: `${film.title}: Kino 360, Alvernia Planet`,
      description: desc,
      url: canonical,
      images: [{ url: film.poster }],
    },
  };
}

export default async function FilmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!findFilm(slug)) notFound();
  return <FilmContent slug={slug} />;
}
