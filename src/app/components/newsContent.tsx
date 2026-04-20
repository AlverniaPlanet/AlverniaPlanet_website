"use client";

import { memo } from "react";
import Link from "next/link";
import Card from "@/app/components/Card";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import type { Locale } from "@/lib/localizedRoutes";

export type NewsItem = {
  badge: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
};

export type NewsSection = {
  title: string;
  intro: string;
  items: NewsItem[];
};

export const NEWS_COPY: Record<Locale, NewsSection> = {
  pl: {
    title: "Aktualności",
    intro: "Najważniejsze nowości z Alvernia Planet, nad którymi pracujemy właśnie teraz.",
    items: [
      {
        badge: "Od stycznia",
        title: "Ulepszamy ścieżki edukacyjne",
        description:
          "Od początku stycznia rozwijamy ścieżki edukacyjne tak, by jeszcze mocniej łączyły film, naukę i nowoczesną narrację. To oznacza bardziej angażujące przystanki, lepszy rytm zwiedzania i jeszcze więcej efektu wow dla grup i rodzin.",
        cta: "Zobacz ścieżkę edukacyjną",
        href: "/atrakcje/sciezka-filmowa",
      },
      {
        badge: "Już w kwietniu",
        title: "Otwieramy K360, największą przestrzeń fulldome w Europie",
        description:
          "W kwietniu otwieramy widowiskowe K360, które stanie się jednym z najmocniejszych punktów całego kompleksu. Szykujemy doświadczenie zaprojektowane na pełne zanurzenie w obrazie, dźwięku i przestrzeni kopuły.",
        cta: "Poznaj K360",
        href: "/atrakcje/k360",
      },
      {
        badge: "Media",
        title: "Powstał o nas artykuł",
        description:
          "O Alvernia Planet ukazał się materiał, który pokazuje nas jako futurystyczną atrakcję łączącą architekturę, edukację i filmowy rozmach. To dobre szybkie wprowadzenie dla osób, które chcą zrozumieć, skąd bierze się wyjątkowość tego miejsca.",
        cta: "Przeczytaj artykuł",
        href: "https://www.klubpodroznikow.com/alvernia-planet-futurystyczna-atrakcja-turystyczna-jak-z-kosmosu/",
        external: true,
      },
    ],
  },
  en: {
    title: "News",
    intro: "The latest highlights from Alvernia Planet and the projects we are expanding right now.",
    items: [
      {
        badge: "Since January",
        title: "We are upgrading the educational paths",
        description:
          "Since January, we have been enhancing the educational paths to create a stronger blend of film, science, and contemporary storytelling. The result is a more engaging route, sharper pacing, and a more memorable visit for both families and organized groups.",
        cta: "Explore the educational path",
        href: "/atrakcje/sciezka-filmowa",
      },
      {
        badge: "Opening in April",
        title: "We are opening K360, the largest fulldome space in Europe",
        description:
          "In April, we are launching K360, set to become one of the boldest features of the entire complex. It is being designed as a fully immersive experience built around image, sound, and the scale of the dome itself.",
        cta: "Discover K360",
        href: "/atrakcje/k360",
      },
      {
        badge: "Media",
        title: "An article has been published about us",
        description:
          "Alvernia Planet has been featured in an article presenting the venue as a futuristic destination where architecture, education, and bold visual storytelling come together in one place.",
        cta: "Read the article",
        href: "https://www.klubpodroznikow.com/alvernia-planet-futurystyczna-atrakcja-turystyczna-jak-z-kosmosu/",
        external: true,
      },
    ],
  },
  pt: {
    title: "Atualidades",
    intro: "As principais novidades da Alvernia Planet e os projetos que estamos a desenvolver agora.",
    items: [
      {
        badge: "Desde janeiro",
        title: "Estamos a melhorar os percursos educativos",
        description:
          "Desde janeiro, estamos a aperfeiçoar os percursos educativos para reforçar a ligação entre audiovisual, ciência e narrativa contemporânea. O objetivo é oferecer uma visita mais envolvente, mais fluida e ainda mais memorável para famílias e grupos.",
        cta: "Ver o percurso educativo",
        href: "/atrakcje/sciezka-filmowa",
      },
      {
        badge: "Abre em abril",
        title: "Vamos abrir o K360, o maior espaço fulldome da Europa",
        description:
          "Em abril abrimos o impressionante K360, pensado para se tornar um dos pontos mais marcantes de todo o complexo. A experiência foi concebida para envolver o visitante em imagem, som e escala de forma total.",
        cta: "Descobrir o K360",
        href: "/atrakcje/k360",
      },
      {
        badge: "Media",
        title: "Foi publicado um artigo sobre nós",
        description:
          "A Alvernia Planet foi apresentada num artigo como uma atração futurista onde arquitetura, educação e narrativa audiovisual se encontram num só lugar.",
        cta: "Ler o artigo",
        href: "https://www.klubpodroznikow.com/alvernia-planet-futurystyczna-atrakcja-turystyczna-jak-z-kosmosu/",
        external: true,
      },
    ],
  },
};

export const NewsSectionBlock = memo(function NewsSectionBlock({
  news,
}: {
  news: NewsSection;
}) {
  const accentGradients = [
    "from-[#4fcfde]/20 via-[#4fcfde]/7 to-transparent",
    "from-[#f77828]/20 via-[#f77828]/7 to-transparent",
    "from-[#f03c64]/20 via-[#f03c64]/7 to-transparent",
  ] as const;

  return (
    <ScrollMotionItem strength="soft" delay={90} float={false} className="home-deferred-block">
      <Card title={news.title} titleCentered titleDivider dense motion="off">
        <p className="ap-type-section-body mx-auto max-w-3xl text-center">{news.intro}</p>
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {news.items.map((item, index) => (
            <article
              key={item.title}
              className="ap-interactive-surface group relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.035] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.24)]"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentGradients[index % accentGradients.length]}`}
              />
              <div className="relative z-10 flex h-full flex-col">
                <span className="inline-flex w-fit items-center rounded-full border border-white/14 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
                  {item.badge}
                </span>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-white/72">{item.description}</p>
                <div className="mt-6 pt-2">
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#8ce7f0] transition-colors duration-300 hover:text-white"
                  >
                    <span>{item.cta}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </ScrollMotionItem>
  );
});
