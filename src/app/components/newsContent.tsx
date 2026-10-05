"use client";

import { memo } from "react";
import Link from "next/link";
import Card from "@/app/components/Card";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import { useI18n } from "@/app/i18n-provider";

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
  viewAllCta: string;
  items: NewsItem[];
};

export const NEWS_COPY: Record<Locale, NewsSection> = {
  pl: {
    title: "Aktualności",
    intro: "Najważniejsze nowości z Alvernia Planet oraz wybrane publikacje mediów o K360 i naszym kompleksie.",
    mediaHeading: "Piszą o nas",
    mediaIntro:
      "Wybrane publikacje o K360: od technologii fulldome po kosmiczny charakter pierwszych seansów.",
    viewAllCta: "Zobacz wszystkie aktualności",
    items: [
      {
        badge: "Gazeta Krakowska",
        title: "Otwarcie MARS, nakręć własny film science-fiction",
        description:
          "Gazeta Krakowska zapowiada otwarcie nowej immersyjnej wystawy w Alvernia Planet, na której zwiedzający lądują na Marsie i nagrywają własny krótki film science-fiction. To debiut MARS, interaktywnej atrakcji łączącej kino, scenografię i aplikację mobilną.",
        cta: "Czytaj w Gazecie Krakowskiej",
        href: "https://gazetakrakowska.pl/nakrec-swoj-wlasny-film-science-fiction-ladowanie-na-marsie-30-maja-otwarcie-nowej-wystawy-immersyjnej-w-alvernia-planet/ar/c13p2-29037615",
        external: true,
      },
      {
        badge: "Gazeta Krakowska",
        title: "MARS przyciąga rodziny, jak zostać astronautą w jeden dzień",
        description:
          "Gazeta Krakowska odwiedza MARS po otwarciu i opisuje, jak nowa atrakcja Alvernia Planet pod Krakowem porywa rodziny. Materiał pokazuje przebieg kosmicznej misji: od briefingu po nagrywanie scen na marsjańskim planie i gotowy film do zabrania ze sobą.",
        cta: "Czytaj w Gazecie Krakowskiej",
        href: "https://gazetakrakowska.pl/kosmiczna-misja-i-wlasny-film-nowa-atrakcja-alvernia-planet-pod-krakowem-przyciaga-rodziny-czyli-jak-zostac-astronauta-w-jeden-dzien/ar/c13p2-29047243",
        external: true,
      },
      {
        badge: "Od stycznia",
        title: "Ulepszamy ścieżki edukacyjne",
        description:
          "Od początku stycznia rozwijamy ścieżki edukacyjne tak, by jeszcze mocniej łączyły film, naukę i nowoczesną narrację. To oznacza bardziej angażujące przystanki, lepszy rytm zwiedzania i jeszcze więcej efektu wow dla grup i rodzin.",
        cta: "Zobacz ścieżkę edukacyjną",
        href: "/grupy",
      },
      {
        badge: "K360",
        title: "K360, największa przestrzeń fulldome w Europie, jest już dostępna",
        description:
          "Po kwietniowym otwarciu zapraszamy do K360, przestrzeni stworzonej do pełnego zanurzenia w obrazie, dźwięku i skali kopuły. Premierowy repertuar prowadzi widzów w stronę kosmosu i pokazuje, jak inaczej może działać kino bez klasycznego ekranu.",
        cta: "Poznaj Kino 360",
        href: "/atrakcje/kino-360",
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
    viewAllCta: "See all news",
    items: [
      {
        badge: "Gazeta Krakowska",
        title: "MARS opens: film your own sci-fi short",
        description:
          "Gazeta Krakowska covers the opening of the new immersive exhibition at Alvernia Planet, where visitors land on Mars and record their own short sci-fi film. It marks the debut of MARS, an interactive attraction blending cinema, scenography and a mobile app.",
        cta: "Read in Gazeta Krakowska",
        href: "https://gazetakrakowska.pl/nakrec-swoj-wlasny-film-science-fiction-ladowanie-na-marsie-30-maja-otwarcie-nowej-wystawy-immersyjnej-w-alvernia-planet/ar/c13p2-29037615",
        external: true,
      },
      {
        badge: "Gazeta Krakowska",
        title: "Families flock to MARS: become an astronaut in a day",
        description:
          "Gazeta Krakowska visits MARS after its launch and shows how the new attraction near Kraków captivates families. The piece walks through the cosmic mission: from the briefing to filming scenes on the Martian set, ending with a ready-made short to take home.",
        cta: "Read in Gazeta Krakowska",
        href: "https://gazetakrakowska.pl/kosmiczna-misja-i-wlasny-film-nowa-atrakcja-alvernia-planet-pod-krakowem-przyciaga-rodziny-czyli-jak-zostac-astronauta-w-jeden-dzien/ar/c13p2-29047243",
        external: true,
      },
      {
        badge: "Since January",
        title: "We are upgrading the educational paths",
        description:
          "Since January, we have been enhancing the educational paths to create a stronger blend of film, science, and contemporary storytelling. The result is a more engaging route, sharper pacing, and a more memorable visit for both families and organized groups.",
        cta: "Explore the educational path",
        href: "/grupy",
      },
      {
        badge: "K360",
        title: "K360, the largest fulldome space in Europe, is now open",
        description:
          "After the April opening, K360 is welcoming visitors into an experience built around full immersion in image, sound, and the scale of the dome. The opening programme looks toward space and shows how cinema can feel when there is no conventional front screen.",
        cta: "Discover the K360 Cinema",
        href: "/atrakcje/kino-360",
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
    viewAllCta: "Ver todas as atualidades",
    items: [
      {
        badge: "Gazeta Krakowska",
        title: "Abertura do MARS: filma a tua curta de ficção científica",
        description:
          "A Gazeta Krakowska anuncia a abertura da nova exposição imersiva na Alvernia Planet, onde os visitantes aterram em Marte e gravam a sua própria curta de ficção científica. Marca a estreia do MARS, uma atração interativa que combina cinema, cenografia e uma aplicação móvel.",
        cta: "Ler na Gazeta Krakowska",
        href: "https://gazetakrakowska.pl/nakrec-swoj-wlasny-film-science-fiction-ladowanie-na-marsie-30-maja-otwarcie-nowej-wystawy-immersyjnej-w-alvernia-planet/ar/c13p2-29037615",
        external: true,
      },
      {
        badge: "Gazeta Krakowska",
        title: "MARS atrai famílias: torna-te astronauta num só dia",
        description:
          "A Gazeta Krakowska visita o MARS após a abertura e mostra como a nova atração da Alvernia Planet, perto de Cracóvia, conquista as famílias. O artigo descreve toda a missão cósmica: desde o briefing até à gravação das cenas no plano marciano, terminando com uma curta pronta para levar para casa.",
        cta: "Ler na Gazeta Krakowska",
        href: "https://gazetakrakowska.pl/kosmiczna-misja-i-wlasny-film-nowa-atrakcja-alvernia-planet-pod-krakowem-przyciaga-rodziny-czyli-jak-zostac-astronauta-w-jeden-dzien/ar/c13p2-29047243",
        external: true,
      },
      {
        badge: "Desde janeiro",
        title: "Estamos a melhorar os percursos educativos",
        description:
          "Desde janeiro, estamos a aperfeiçoar os percursos educativos para reforçar a ligação entre audiovisual, ciência e narrativa contemporânea. O objetivo é oferecer uma visita mais envolvente, mais fluida e ainda mais memorável para famílias e grupos.",
        cta: "Ver o percurso educativo",
        href: "/grupy",
      },
      {
        badge: "K360",
        title: "O K360, o maior espaço fulldome da Europa, já está aberto",
        description:
          "Após a abertura em abril, o K360 recebe visitantes numa experiência criada para imersão total em imagem, som e escala. A programação de estreia olha para o espaço e mostra como o cinema pode funcionar sem um ecrã frontal tradicional.",
        cta: "Descobrir a cinema K360",
        href: "/atrakcje/kino-360",
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
  de: {
    title: "Aktuelles",
    intro: "Die wichtigsten Neuigkeiten aus Alvernia Planet sowie ausgewählte Medienberichte über K360 und unseren Komplex.",
    mediaHeading: "In den Medien",
    mediaIntro:
      "Ausgewählte Berichte über K360 – von der Fulldome-Technologie bis zum kosmischen Charakter der ersten Vorführungen.",
    viewAllCta: "Alle Neuigkeiten ansehen",
    items: [
      {
        badge: "Gazeta Krakowska",
        title: "MARS eröffnet: Drehen Sie Ihren eigenen Sci-Fi-Kurzfilm",
        description:
          "Die Gazeta Krakowska berichtet über die Eröffnung der neuen immersiven Ausstellung in Alvernia Planet, bei der die Gäste auf dem Mars landen und ihren eigenen Sci-Fi-Kurzfilm drehen. Es ist der Auftakt von MARS, einer interaktiven Attraktion, die Kino, Szenografie und eine mobile App verbindet.",
        cta: "In der Gazeta Krakowska lesen",
        href: "https://gazetakrakowska.pl/nakrec-swoj-wlasny-film-science-fiction-ladowanie-na-marsie-30-maja-otwarcie-nowej-wystawy-immersyjnej-w-alvernia-planet/ar/c13p2-29037615",
        external: true,
      },
      {
        badge: "Gazeta Krakowska",
        title: "Familien strömen zu MARS: an einem Tag zum Astronauten",
        description:
          "Die Gazeta Krakowska besucht MARS nach der Eröffnung und zeigt, wie die neue Attraktion bei Krakau Familien begeistert. Der Beitrag führt durch die gesamte Weltraummission: vom Briefing über die Dreharbeiten am Mars-Set bis zum fertigen Kurzfilm zum Mitnehmen.",
        cta: "In der Gazeta Krakowska lesen",
        href: "https://gazetakrakowska.pl/kosmiczna-misja-i-wlasny-film-nowa-atrakcja-alvernia-planet-pod-krakowem-przyciaga-rodziny-czyli-jak-zostac-astronauta-w-jeden-dzien/ar/c13p2-29047243",
        external: true,
      },
      {
        badge: "Seit Januar",
        title: "Wir bauen die Bildungspfade aus",
        description:
          "Seit Januar entwickeln wir die Bildungspfade weiter, damit Film, Wissenschaft und moderne Erzählweise noch stärker ineinandergreifen. Das Ergebnis: ein fesselnderer Rundgang, ein besserer Rhythmus und ein noch eindrucksvollerer Besuch für Familien und Gruppen.",
        cta: "Bildungspfad entdecken",
        href: "/grupy",
      },
      {
        badge: "K360",
        title: "K360, der größte Fulldome-Raum Europas, ist eröffnet",
        description:
          "Nach der Eröffnung im April empfängt K360 seine Gäste mit einem Erlebnis, das ganz auf das Eintauchen in Bild, Ton und die Dimension der Kuppel setzt. Das Eröffnungsprogramm führt in den Weltraum und zeigt, wie sich Kino ohne klassische Leinwand anfühlen kann.",
        cta: "Kino 360 entdecken",
        href: "/atrakcje/kino-360",
      },
      {
        badge: "Przełom",
        title: "Nieporaz sorgt mit 360-Grad-Kino für Aufsehen",
        description:
          "Das Regionalmedium beschreibt den Start von K360 als Ereignis, das die Art und Weise verändern kann, wie das Publikum Kino erlebt. Der Artikel hebt die Fulldome-Technologie, die Dimension der Kuppel und die Premiere von „One Step Beyond: A Journey to Mars“ hervor.",
        cta: "Auf Przełom lesen",
        href: "https://przelom.pl/pl/11_wiadomosci/71040_nieporaz-zaskakuje-powstaje-tu-najwieksze-kino-360-w-europie.html",
        external: true,
      },
      {
        badge: "GeekWeek",
        title: "Neue Attraktion in den Kuppeln an der A4",
        description:
          "GeekWeek zeigt Alvernia Planet als den markanten Kuppelkomplex, der von der Autobahn A4 aus zu sehen ist und nun um Europas größten 360-Grad-Raum erweitert wurde. Der Beitrag bündelt außerdem praktische Hinweise zu Vorführungen, Anfahrt und Besucherinfrastruktur.",
        cta: "Auf Interia lesen",
        href: "https://geekweek.interia.pl/filmy/news-gigantyczne-kino-360deg-otwiera-sie-w-kopulach-przy-a4,nId,23323956",
        external: true,
      },
      {
        badge: "INNPoland",
        title: "Eine neue Dimension des Filmerlebens",
        description:
          "INNPoland richtet den Blick auf die Technologie, die das Publikum mit Bild und Ton umgibt, statt es vor eine herkömmliche Leinwand zu setzen. Der Beitrag verweist zudem auf das Potenzial von K360 für Tourismus, Schulgruppen und moderne Unterhaltung in der Region.",
        cta: "Auf INNPoland lesen",
        href: "https://innpoland.pl/223459,w-polsce-powstaje-najwieksze-kino-w-europie-nadchodzi-rewolucja-w-ogladaniu-filmow",
        external: true,
      },
      {
        badge: "WP Turystyka",
        title: "Eine Filmattraktion auf der Landkarte Europas",
        description:
          "WP Turystyka beschreibt K360 über seine Maße: 15 Meter Höhe, 48 Meter Durchmesser und eine riesige Projektionsfläche. Der Text zeigt, wie futuristische Architektur und immersives Kino zu einem starken touristischen Anziehungspunkt für Kleinpolen werden können.",
        cta: "Auf WP Turystyka lesen",
        href: "https://turystyka.wp.pl/to-bedzie-hit-najwieksze-takie-kino-w-europie-powstaje-w-polsce-7272305316522176a",
        external: true,
      },
      {
        badge: "Puls Krakowa",
        title: "Ein neues Kapitel für Alvernia Planet",
        description:
          "Puls Krakowa stellt K360 als Teil eines größeren Wandels dar: von einem Ort, der mit Film- und Musikproduktion verbunden war, hin zu einem Ziel für Unterhaltung und Bildung. Der Artikel betont Immersion, neue Technologien und Erlebnisse für ein breiteres Publikum.",
        cta: "Auf Puls Krakowa lesen",
        href: "https://pulskrakowa.pl/kino-360-pod-krakowem-alvernia-planet-otwiera-nowa-atrakcje/",
        external: true,
      },
      {
        badge: "Kurier Krakowski",
        title: "Kosmisches Kino bei Krakau",
        description:
          "Der Kurier Krakowski hebt den kosmischen Charakter der ersten Vorführung und die emotionale Dimension der Reise zum Mars hervor. Der Artikel präsentiert K360 als Attraktion von Weltklasse, bei der die Zuschauer Teil der Filmgeschichte werden.",
        cta: "Im Kurier Krakowski lesen",
        href: "https://kk24.info/kosmiczne-kino-pod-krakowem-w-alvernia-planet-rusza-najwieksza-kopula-360-w-europie/",
        external: true,
      },
    ],
  },
  zh: {
    title: "最新动态",
    intro: "Alvernia Planet 的重要新闻，以及媒体对 K360 和园区的精选报道。",
    mediaHeading: "媒体报道",
    mediaIntro:
      "关于 K360 的精选报道：从全穹顶（fulldome）技术，到首批放映的太空主题。",
    viewAllCta: "查看全部动态",
    items: [
      {
        badge: "Gazeta Krakowska",
        title: "MARS 开幕：拍摄属于自己的科幻短片",
        description:
          "Gazeta Krakowska 报道了 Alvernia Planet 全新沉浸式展览的开幕：访客将登陆火星，并拍摄一部属于自己的科幻短片。这标志着 MARS 正式亮相，这项互动体验融合了电影、场景搭建与手机应用。",
        cta: "阅读 Gazeta Krakowska 报道",
        href: "https://gazetakrakowska.pl/nakrec-swoj-wlasny-film-science-fiction-ladowanie-na-marsie-30-maja-otwarcie-nowej-wystawy-immersyjnej-w-alvernia-planet/ar/c13p2-29037615",
        external: true,
      },
      {
        badge: "Gazeta Krakowska",
        title: "MARS 吸引家庭游客：一天成为宇航员",
        description:
          "Gazeta Krakowska 在开幕后探访 MARS，展示这项位于 Kraków 附近的新体验如何吸引家庭游客。报道完整呈现整场太空任务：从任务简报，到在火星场景中拍摄，最后带走一部属于自己的成片短片。",
        cta: "阅读 Gazeta Krakowska 报道",
        href: "https://gazetakrakowska.pl/kosmiczna-misja-i-wlasny-film-nowa-atrakcja-alvernia-planet-pod-krakowem-przyciaga-rodziny-czyli-jak-zostac-astronauta-w-jeden-dzien/ar/c13p2-29047243",
        external: true,
      },
      {
        badge: "自一月起",
        title: "我们正在升级教育路线",
        description:
          "自一月起，我们持续完善教育路线，让电影、科学与当代叙事结合得更加紧密。由此带来更具吸引力的参观动线、更紧凑的节奏，以及让家庭与团体都更难忘的体验。",
        cta: "了解教育路线",
        href: "/grupy",
      },
      {
        badge: "K360",
        title: "欧洲最大的全穹顶空间 K360 已正式开放",
        description:
          "继四月开幕后，K360 以画面、声音与穹顶尺度带来完全沉浸的观影体验。首轮片单以太空为主题，展现没有传统正面银幕时，电影可以带来怎样的感受。",
        cta: "了解 Kino 360",
        href: "/atrakcje/kino-360",
      },
      {
        badge: "Przełom",
        title: "Nieporaz 因 360 度影院备受关注",
        description:
          "这家地区媒体将 K360 的启用视为可能重新定义观影方式的事件。文章重点介绍全穹顶技术、穹顶的规模，以及影片《One Step Beyond: A Journey to Mars》的首映。",
        cta: "阅读 Przełom 报道",
        href: "https://przelom.pl/pl/11_wiadomosci/71040_nieporaz-zaskakuje-powstaje-tu-najwieksze-kino-360-w-europie.html",
        external: true,
      },
      {
        badge: "GeekWeek",
        title: "A4 高速公路旁的穹顶迎来新体验",
        description:
          "GeekWeek 介绍 Alvernia Planet 这组在 A4 高速公路上就能望见的标志性穹顶建筑，如今新增了欧洲最大的 360 度空间。报道还整理了放映场次、交通方式与游客配套设施等实用信息。",
        cta: "阅读 Interia 报道",
        href: "https://geekweek.interia.pl/filmy/news-gigantyczne-kino-360deg-otwiera-sie-w-kopulach-przy-a4,nId,23323956",
        external: true,
      },
      {
        badge: "INNPoland",
        title: "观影体验的全新维度",
        description:
          "INNPoland 关注这项让画面与声音包围观众、而非把观众置于传统银幕前的技术。报道同时指出 K360 在旅游、学生团体以及本地区现代娱乐方面的潜力。",
        cta: "阅读 INNPoland 报道",
        href: "https://innpoland.pl/223459,w-polsce-powstaje-najwieksze-kino-w-europie-nadchodzi-rewolucja-w-ogladaniu-filmow",
        external: true,
      },
      {
        badge: "WP Turystyka",
        title: "登上欧洲版图的电影主题景点",
        description:
          "WP Turystyka 以规模来介绍 K360：高 15 米、直径 48 米，拥有巨大的投影面积。文章指出，未来感建筑与沉浸式影院的结合，有望成为 Małopolska 地区重要的旅游亮点。",
        cta: "阅读 WP Turystyka 报道",
        href: "https://turystyka.wp.pl/to-bedzie-hit-najwieksze-takie-kino-w-europie-powstaje-w-polsce-7272305316522176a",
        external: true,
      },
      {
        badge: "Puls Krakowa",
        title: "Alvernia Planet 的全新阶段",
        description:
          "Puls Krakowa 将 K360 视为更大转变的一部分：从与影视和音乐制作相关的场地，转向娱乐与教育目的地。文章强调沉浸感、新技术，以及面向更广泛观众的体验。",
        cta: "阅读 Puls Krakowa 报道",
        href: "https://pulskrakowa.pl/kino-360-pod-krakowem-alvernia-planet-otwiera-nowa-atrakcje/",
        external: true,
      },
      {
        badge: "Kurier Krakowski",
        title: "Kraków 近郊的太空影院",
        description:
          "Kurier Krakowski 强调首场放映的太空氛围，以及火星之旅带来的情感体验。文章将 K360 描述为世界级景点：观众不再只是旁观者，而是成为影片故事的一部分。",
        cta: "阅读 Kurier Krakowski 报道",
        href: "https://kk24.info/kosmiczne-kino-pod-krakowem-w-alvernia-planet-rusza-najwieksza-kopula-360-w-europie/",
        external: true,
      },
    ],
  },
};

export const NewsSectionBlock = memo(function NewsSectionBlock({
  news,
  teaser = false,
}: {
  news: NewsSection;
  teaser?: boolean;
}) {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const viewAllHref = getLocalizedPath("/aktualnosci", loc);

  const spotlightItem = news.items[1] ?? news.items[0];
  const secondaryItem = teaser ? undefined : news.items[1] ? news.items[0] : undefined;
  const mediaItems = teaser ? [] : news.items.slice(2);

  if (teaser) {
    return (
      <ScrollMotionItem strength="soft" delay={90} float={false} className="home-deferred-block">
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="ap-type-section-title">{news.title}</h2>
            <div className="mx-auto mt-3 h-[2px] w-24 rounded-full bg-gradient-to-r from-[#4fcfde] via-[#7ef6ff] to-[#f03c64]" />
            <p className="ap-type-section-body mt-5">{news.intro}</p>
          </div>

          {spotlightItem ? (
            <article className="ap-tile ap-tile-lg ap-tile-accent ap-tile-interactive group relative mt-9 flex flex-col gap-5 overflow-hidden p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="relative z-10 flex flex-col">
                <span className="inline-flex w-fit items-center rounded-full border border-[color:var(--ap-border)] bg-[color:var(--ap-surface-strong)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--ap-text-muted)]">
                  {spotlightItem.badge}
                </span>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-[color:var(--ap-text-strong)] sm:text-3xl">
                  {spotlightItem.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-[color:var(--ap-text-dim)]">
                  {spotlightItem.description}
                </p>
              </div>
              <Link
                href={viewAllHref}
                className="relative z-10 inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#4fcfde] px-6 py-3 text-sm font-semibold text-[#061014] shadow-[0_14px_34px_rgba(79,207,222,0.26)] transition duration-300 hover:bg-white sm:self-auto"
              >
                <span>{news.viewAllCta}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ) : (
            <div className="mt-7 flex justify-center">
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-2 rounded-full bg-[#4fcfde] px-6 py-3 text-sm font-semibold text-[#061014] shadow-[0_14px_34px_rgba(79,207,222,0.26)] transition duration-300 hover:bg-white"
              >
                <span>{news.viewAllCta}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </ScrollMotionItem>
    );
  }

  return (
    <ScrollMotionItem strength="soft" delay={90} float={false} className="home-deferred-block">
      {/* titleAs="h1": wariant pełny renderuje się tylko na /aktualnosci,
          gdzie "Aktualności" to główny nagłówek strony (brakowało H1). */}
      <Card title={news.title} titleAs="h1" titleCentered titleDivider dense motion="off">
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
                <article className="ap-tile ap-tile-sm ap-tile-interactive group relative overflow-hidden p-5 sm:p-6">
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

              <div className="ap-tile ap-tile-sm p-5 sm:p-6">
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
          <div className="ap-tile ap-tile-sm mt-5 overflow-hidden">
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
