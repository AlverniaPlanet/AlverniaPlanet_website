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
  mediaHeading: string;
  mediaIntro: string;
  items: NewsItem[];
};

export const NEWS_COPY: Record<Locale, NewsSection> = {
  pl: {
    title: "Aktualności",
    intro: "Najważniejsze nowości z Alvernia Planet oraz wybrane publikacje mediów o K360 i naszym kompleksie.",
    mediaHeading: "Piszą o nas",
    mediaIntro:
      "Wybrane publikacje o K360: od technologii fulldome po kosmiczny charakter pierwszych seansów.",
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
        badge: "K360",
        title: "K360, największa przestrzeń fulldome w Europie, jest już dostępna",
        description:
          "Po kwietniowym otwarciu zapraszamy do K360, przestrzeni stworzonej do pełnego zanurzenia w obrazie, dźwięku i skali kopuły. Premierowy repertuar prowadzi widzów w stronę kosmosu i pokazuje, jak inaczej może działać kino bez klasycznego ekranu.",
        cta: "Poznaj Projekcję K360",
        href: "/atrakcje/k360",
      },
      {
        badge: "Przełom",
        title: "Nieporaz zaskakuje kinem 360 stopni",
        description:
          "Regionalny serwis opisuje uruchomienie K360 jako wydarzenie, które może na nowo zdefiniować kinowe doświadczenia. Artykuł zwraca uwagę na technologię fulldome, skalę kopuły i premierę filmu „One Step Beyond: A Journey to Mars”.",
        cta: "Czytaj w Przełomie",
        href: "https://przelom.pl/pl/11_wiadomosci/71040_nieporaz-zaskakuje-powstaje-tu-najwieksze-kino-360-w-europie.html",
        external: true,
      },
      {
        badge: "GeekWeek",
        title: "Kopuły przy A4 z nową atrakcją",
        description:
          "GeekWeek pokazuje Alvernia Planet jako charakterystyczny kompleks widoczny z autostrady A4, który wzbogacił się o największą w Europie przestrzeń 360 stopni. Materiał porządkuje też informacje o seansach, dojeździe i zapleczu dla odwiedzających.",
        cta: "Czytaj w Interii",
        href: "https://geekweek.interia.pl/filmy/news-gigantyczne-kino-360deg-otwiera-sie-w-kopulach-przy-a4,nId,23323956",
        external: true,
      },
      {
        badge: "INNPoland",
        title: "Nowy wymiar oglądania filmów",
        description:
          "INNPoland skupia się na technologii, która otacza widza obrazem i dźwiękiem, zamiast stawiać go przed tradycyjnym ekranem. Publikacja podkreśla także potencjał K360 dla turystyki, grup szkolnych i rozwoju nowoczesnej rozrywki w regionie.",
        cta: "Czytaj w INNPoland",
        href: "https://innpoland.pl/223459,w-polsce-powstaje-najwieksze-kino-w-europie-nadchodzi-rewolucja-w-ogladaniu-filmow",
        external: true,
      },
      {
        badge: "WP Turystyka",
        title: "Filmowa atrakcja na mapie Europy",
        description:
          "WP Turystyka opisuje K360 jako miejsce wyróżniające się skalą: 15 metrów wysokości, 48 metrów średnicy i ogromną powierzchnią projekcyjną. Tekst pokazuje, że połączenie futurystycznej architektury i immersyjnego kina może stać się mocnym punktem turystycznym Małopolski.",
        cta: "Czytaj w WP Turystyka",
        href: "https://turystyka.wp.pl/to-bedzie-hit-najwieksze-takie-kino-w-europie-powstaje-w-polsce-7272305316522176a",
        external: true,
      },
      {
        badge: "Puls Krakowa",
        title: "Nowy etap Alvernia Planet",
        description:
          "Puls Krakowa przedstawia K360 jako część szerszej zmiany: od przestrzeni kojarzonej z filmem i muzyką do obiektu rozrywkowo-edukacyjnego. W artykule ważny jest kierunek rozwoju oparty na immersji, nowych technologiach i doświadczeniach dla szerszej publiczności.",
        cta: "Czytaj w Pulsie Krakowa",
        href: "https://pulskrakowa.pl/kino-360-pod-krakowem-alvernia-planet-otwiera-nowa-atrakcje/",
        external: true,
      },
      {
        badge: "Kurier Krakowski",
        title: "Kosmiczne kino pod Krakowem",
        description:
          "Kurier Krakowski akcentuje kosmiczny charakter pierwszego seansu i emocjonalny wymiar podróży na Marsa. Tekst opisuje K360 jako atrakcję światowej klasy, w której widz przestaje być tylko obserwatorem i staje się częścią filmowej opowieści.",
        cta: "Czytaj w Kurierze Krakowskim",
        href: "https://kk24.info/kosmiczne-kino-pod-krakowem-w-alvernia-planet-rusza-najwieksza-kopula-360-w-europie/",
        external: true,
      },
    ],
  },
  en: {
    title: "News",
    intro: "The latest highlights from Alvernia Planet and selected media coverage of K360 and our complex.",
    mediaHeading: "In the media",
    mediaIntro:
      "Selected coverage of K360, from fulldome technology to the space-themed character of the first screenings.",
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
        badge: "K360",
        title: "K360, the largest fulldome space in Europe, is now open",
        description:
          "After the April opening, K360 is welcoming visitors into an experience built around full immersion in image, sound, and the scale of the dome. The opening programme looks toward space and shows how cinema can feel when there is no conventional front screen.",
        cta: "Discover the K360 projection",
        href: "/atrakcje/k360",
      },
      {
        badge: "Przełom",
        title: "Nieporaz draws attention with 360-degree cinema",
        description:
          "The regional outlet presents the launch of K360 as an event that can reshape the way audiences experience film. The article highlights fulldome technology, the scale of the dome, and the premiere of “One Step Beyond: A Journey to Mars.”",
        cta: "Read on Przełom",
        href: "https://przelom.pl/pl/11_wiadomosci/71040_nieporaz-zaskakuje-powstaje-tu-najwieksze-kino-360-w-europie.html",
        external: true,
      },
      {
        badge: "GeekWeek",
        title: "A new attraction in the domes by the A4",
        description:
          "GeekWeek frames Alvernia Planet as the distinctive dome complex visible from the A4 motorway, now expanded with Europe’s largest 360-degree space. The piece also gathers practical details about screenings, access, and visitor facilities.",
        cta: "Read on Interia",
        href: "https://geekweek.interia.pl/filmy/news-gigantyczne-kino-360deg-otwiera-sie-w-kopulach-przy-a4,nId,23323956",
        external: true,
      },
      {
        badge: "INNPoland",
        title: "A new dimension of watching films",
        description:
          "INNPoland focuses on technology that surrounds the audience with image and sound instead of placing them in front of a traditional screen. The article also points to K360’s potential for tourism, school groups, and modern entertainment in the region.",
        cta: "Read on INNPoland",
        href: "https://innpoland.pl/223459,w-polsce-powstaje-najwieksze-kino-w-europie-nadchodzi-rewolucja-w-ogladaniu-filmow",
        external: true,
      },
      {
        badge: "WP Travel",
        title: "A cinematic attraction on Europe’s map",
        description:
          "WP Travel describes K360 through its scale: 15 metres high, 48 metres in diameter, and a vast projection surface. The article shows how futuristic architecture and immersive cinema can become a strong tourism highlight for Lesser Poland.",
        cta: "Read on WP Travel",
        href: "https://turystyka.wp.pl/to-bedzie-hit-najwieksze-takie-kino-w-europie-powstaje-w-polsce-7272305316522176a",
        external: true,
      },
      {
        badge: "Puls Krakowa",
        title: "A new chapter for Alvernia Planet",
        description:
          "Puls Krakowa presents K360 as part of a broader shift from a site associated with film and music production toward an entertainment and education destination. The article emphasizes immersion, new technologies, and experiences for a wider audience.",
        cta: "Read on Puls Krakowa",
        href: "https://pulskrakowa.pl/kino-360-pod-krakowem-alvernia-planet-otwiera-nowa-atrakcje/",
        external: true,
      },
      {
        badge: "Kurier Krakowski",
        title: "A space-themed cinema near Krakow",
        description:
          "Kurier Krakowski highlights the cosmic character of the first screening and the emotional dimension of a journey to Mars. The article presents K360 as a world-class attraction where viewers become part of the film story.",
        cta: "Read on Kurier Krakowski",
        href: "https://kk24.info/kosmiczne-kino-pod-krakowem-w-alvernia-planet-rusza-najwieksza-kopula-360-w-europie/",
        external: true,
      },
    ],
  },
  pt: {
    title: "Atualidades",
    intro: "As principais novidades da Alvernia Planet e uma seleção de publicações dos media sobre o K360 e o nosso complexo.",
    mediaHeading: "Nos media",
    mediaIntro:
      "Uma seleção de publicações sobre o K360, da tecnologia fulldome ao caráter espacial das primeiras sessões.",
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
        badge: "K360",
        title: "O K360, o maior espaço fulldome da Europa, já está aberto",
        description:
          "Após a abertura em abril, o K360 recebe visitantes numa experiência criada para imersão total em imagem, som e escala. A programação de estreia olha para o espaço e mostra como o cinema pode funcionar sem um ecrã frontal tradicional.",
        cta: "Descobrir a projeção K360",
        href: "/atrakcje/k360",
      },
      {
        badge: "Przełom",
        title: "Nieporaz chama a atenção com cinema 360 graus",
        description:
          "O meio regional apresenta a abertura do K360 como um acontecimento capaz de mudar a forma como o público vive o cinema. O artigo destaca a tecnologia fulldome, a escala da cúpula e a estreia de “One Step Beyond: A Journey to Mars”.",
        cta: "Ler no Przełom",
        href: "https://przelom.pl/pl/11_wiadomosci/71040_nieporaz-zaskakuje-powstaje-tu-najwieksze-kino-360-w-europie.html",
        external: true,
      },
      {
        badge: "GeekWeek",
        title: "Uma nova atração nas cúpulas junto à A4",
        description:
          "O GeekWeek mostra a Alvernia Planet como o conjunto de cúpulas visível da autoestrada A4, agora ampliado com o maior espaço 360 graus da Europa. O material reúne também informações sobre sessões, acesso e infraestrutura para visitantes.",
        cta: "Ler na Interia",
        href: "https://geekweek.interia.pl/filmy/news-gigantyczne-kino-360deg-otwiera-sie-w-kopulach-przy-a4,nId,23323956",
        external: true,
      },
      {
        badge: "INNPoland",
        title: "Uma nova dimensão para ver filmes",
        description:
          "A INNPoland foca-se na tecnologia que envolve o público com imagem e som em vez de o colocar diante de um ecrã tradicional. A publicação destaca ainda o potencial do K360 para turismo, grupos escolares e entretenimento moderno na região.",
        cta: "Ler na INNPoland",
        href: "https://innpoland.pl/223459,w-polsce-powstaje-najwieksze-kino-w-europie-nadchodzi-rewolucja-w-ogladaniu-filmow",
        external: true,
      },
      {
        badge: "WP Turystyka",
        title: "Uma atração cinematográfica no mapa da Europa",
        description:
          "A WP Turystyka descreve o K360 pela sua escala: 15 metros de altura, 48 metros de diâmetro e uma enorme superfície de projeção. O texto mostra como arquitetura futurista e cinema imersivo podem tornar-se um ponto forte do turismo na Pequena Polónia.",
        cta: "Ler na WP Turystyka",
        href: "https://turystyka.wp.pl/to-bedzie-hit-najwieksze-takie-kino-w-europie-powstaje-w-polsce-7272305316522176a",
        external: true,
      },
      {
        badge: "Puls Krakowa",
        title: "Uma nova etapa para a Alvernia Planet",
        description:
          "O Puls Krakowa apresenta o K360 como parte de uma mudança mais ampla: de espaço associado a cinema e música para destino de entretenimento e educação. O artigo valoriza a imersão, as novas tecnologias e experiências para um público mais vasto.",
        cta: "Ler no Puls Krakowa",
        href: "https://pulskrakowa.pl/kino-360-pod-krakowem-alvernia-planet-otwiera-nowa-atrakcje/",
        external: true,
      },
      {
        badge: "Kurier Krakowski",
        title: "Cinema cósmico perto de Cracóvia",
        description:
          "O Kurier Krakowski destaca o caráter espacial da primeira sessão e a dimensão emocional da viagem a Marte. O texto apresenta o K360 como atração de classe mundial, na qual o espectador deixa de ser apenas observador e entra na narrativa.",
        cta: "Ler no Kurier Krakowski",
        href: "https://kk24.info/kosmiczne-kino-pod-krakowem-w-alvernia-planet-rusza-najwieksza-kopula-360-w-europie/",
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
  const spotlightItem = news.items[1] ?? news.items[0];
  const secondaryItem = news.items[1] ? news.items[0] : undefined;
  const mediaItems = news.items.slice(2);

  return (
    <ScrollMotionItem strength="soft" delay={90} float={false} className="home-deferred-block">
      <Card title={news.title} titleCentered titleDivider dense motion="off">
        <p className="ap-type-section-body mx-auto max-w-3xl text-center">{news.intro}</p>

        {spotlightItem ? (
          <div className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.82fr)] xl:items-stretch">
            <article className="ap-interactive-surface group relative flex min-h-[25rem] overflow-hidden rounded-[2rem] border border-[#4fcfde]/22 bg-[linear-gradient(135deg,rgba(79,207,222,0.17)_0%,rgba(255,255,255,0.055)_48%,rgba(240,60,100,0.13)_100%)] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.32)] sm:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.11)_0%,transparent_34%,rgba(255,255,255,0.05)_64%,transparent_100%)] opacity-70" />
              <div className="relative z-10 flex max-w-3xl flex-col justify-end">
                <span className="inline-flex w-fit items-center rounded-full border border-white/14 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
                  {spotlightItem.badge}
                </span>
                <h3 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  {spotlightItem.title}
                </h3>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/76">
                  {spotlightItem.description}
                </p>
                <div className="mt-7">
                  <Link
                    href={spotlightItem.href}
                    target={spotlightItem.external ? "_blank" : undefined}
                    rel={spotlightItem.external ? "noreferrer" : undefined}
                    className="inline-flex items-center justify-center rounded-full bg-[#4fcfde] px-5 py-2.5 text-sm font-semibold text-[#061014] shadow-[0_14px_34px_rgba(79,207,222,0.26)] transition duration-300 hover:bg-white"
                  >
                    <span>{spotlightItem.cta}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>

            <div className="grid gap-5">
              {secondaryItem ? (
                <article className="ap-interactive-surface group relative overflow-hidden rounded-[1.6rem] border border-white/12 bg-white/[0.045] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(247,120,40,0.16),transparent_58%)]" />
                  <div className="relative z-10">
                    <span className="inline-flex w-fit items-center rounded-full border border-white/14 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
                      {secondaryItem.badge}
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                      {secondaryItem.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-7 text-white/70">
                      {secondaryItem.description}
                    </p>
                    <Link
                      href={secondaryItem.href}
                      target={secondaryItem.external ? "_blank" : undefined}
                      rel={secondaryItem.external ? "noreferrer" : undefined}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8ce7f0] transition-colors duration-300 hover:text-white"
                    >
                      <span>{secondaryItem.cta}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ) : null}

              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8ce7f0]">
                  Media
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">
                  {news.mediaHeading}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-white/68">{news.mediaIntro}</p>
              </div>
            </div>
          </div>
        ) : null}

        {mediaItems.length > 0 ? (
          <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03] shadow-[0_22px_70px_rgba(0,0,0,0.18)]">
            <ul className="divide-y divide-white/10">
              {mediaItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="group grid gap-3 px-4 py-4 transition-colors duration-300 hover:bg-white/[0.055] sm:grid-cols-[9rem_minmax(0,1fr)] sm:px-5 lg:grid-cols-[9rem_minmax(0,1fr)_auto] lg:items-center"
                  >
                    <span className="inline-flex w-fit items-center rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/66">
                      {item.badge}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-semibold leading-snug text-white">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-white/62">
                        {item.description}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8ce7f0] transition-colors duration-300 group-hover:text-white">
                      <span>{item.cta}</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>
    </ScrollMotionItem>
  );
});
