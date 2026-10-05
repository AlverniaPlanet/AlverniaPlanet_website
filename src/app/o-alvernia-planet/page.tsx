"use client";

import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { SolarIcon } from "@/app/components/SolarIcon";

const WIKIPEDIA_URL = "https://pl.wikipedia.org/wiki/Alvernia_Planet";

const COPY: Record<
  Locale,
  {
    tag: string;
    heroTitle: string;
    heroSubtitle: string;
    intro: string;
    wikipediaLabel: string;
    wikipediaTitle: string;
    wikipediaLead: string;
    wikipediaCta: string;
    wikipediaFacts: { title: string; body: string }[];
    bullets: { title: string; body: string; image: string; alt: string }[];
    metrics: { value: string; label: string }[];
    highlightTitle: string;
    highlightSubtitle: string;
    highlightSections: { title: string; summary: string; points: string[]; tag: string }[];
    vrFeature: {
      title: string;
      subtitle: string;
      body: string;
      cta: string;
      tags: string[];
    };
  }
> = {
  pl: {
    tag: "O nas",
    heroTitle: "O Alvernia Planet",
    heroSubtitle: "Unikalny w skali świata kompleks kopuł filmowych i centrum wydarzeń.",
    intro:
      "Alvernia Planet łączy świat filmu, technologii i edukacji. Nasze kopuły goszczą eventy, produkcje filmowe i immersyjne atrakcje dla odwiedzających.",
    wikipediaLabel: "Wikipedia",
    wikipediaTitle: "Alvernia Planet w polskiej Wikipedii",
    wikipediaLead:
      "Krótki, niezależny opis historii obiektu, jego architektury i funkcji, zebrany w jednym miejscu.",
    wikipediaCta: "Przejdź do Wikipedii",
    wikipediaFacts: [
      {
        title: "Historia",
        body: "Kompleks powstał w latach 2000-2002 jako projekt RMF Media Complex, a później działał jako Alvernia Studios.",
      },
      {
        title: "Przemiana",
        body: "Od września 2017 roku rozwijany jest jako Alvernia Planet z przeznaczeniem na funkcje eventowe, wystawiennicze i edukacyjne.",
      },
      {
        title: "Architektura",
        body: "Hasło opisuje obiekt jako 13 kopuł połączonych przeszklonymi korytarzami o wyraźnie futurystycznym charakterze.",
      },
      {
        title: "Edukacja",
        body: "Wikipedia wskazuje także programy dla grup szkolnych i zajęcia o etapach powstawania filmu, dźwięku oraz postprodukcji.",
      },
    ],
    bullets: [
      {
        title: "Architektura industrialna",
        body: "Stalowe mosty, antresole, futurystyczne wnętrza i szklane łączniki między kopułami.",
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
        alt: "Industrialne wnętrze kopuły z metalowymi konstrukcjami",
      },
      {
        title: "Lokalizacja",
        body: "Otoczona terenami zielonymi, z wygodnym dojazdem i parkingiem.",
        image: "/galeria/Ogolne/webp/8.webp",
        alt: "Widok kompleksu Alvernia Planet z drona",
      },
    ],
    metrics: [
      { value: "13", label: "kopuł gotowych na eventy, produkcje i scenografie" },
      { value: "17 425 m²", label: "powierzchni zabudowy" },
      { value: "300+", label: "miejsc parkingowych" },
    ],
    highlightTitle: "Wyjątkowe miejsce w środku Europy",
    highlightSubtitle:
      "Skala obiektu, infrastruktura i otoczenie tworzą przestrzeń gotową na duże wydarzenia i codziennych gości.",
    highlightSections: [
      {
        tag: "Dojazd",
        title: "Lokalizacja i dojazd",
        summary: "Tuż przy A4 między Krakowem a Katowicami.",
        points: [
          "Nieporaz, ul. Ferdynanda Wspaniałego 1",
          "30 km od Krakowa, 10 km od lotniska Balice",
        ],
      },
      {
        tag: "Eventy",
        title: "Wydarzenia immersyjne",
        summary: "Scena dla prestiżowych wydarzeń i produkcji.",
        points: [
          "Wystawy, premiery, gale, koncerty, pokazy mody",
          "Możliwości pełnej immersji i multimediów",
        ],
      },
      {
        tag: "Architektura",
        title: "Architektura i funkcje",
        summary: "Futurystyczne kopuły i szklane pasaże.",
        points: [
          "Rozrywka, edukacja, ekspozycje i multimedia",
          "Rozpoznawalny styl architektoniczny",
        ],
      },
      {
        tag: "Skala",
        title: "Skala i infrastruktura",
        summary: "Duży teren i zaplecze dla gości.",
        points: [
          "17 425 m² zabudowy i 14,21 ha terenu",
          "Parking 300+ miejsc z opcją rozbudowy",
        ],
      },
      {
        tag: "Edukacja",
        title: "Edukacja i film",
        summary: "Autorska ścieżka edukacyjna od 2023.",
        points: [
          "Proces powstawania filmu i scenografii",
          "Iluzja obrazu, dźwięk i narracja",
        ],
      },
      {
        tag: "Okolica",
        title: "Okolica i atrakcje",
        summary: "Idealne na całodniową wycieczkę.",
        points: [
          "Zamek Tenczyn i Muzeum Agatów w Rudnie",
          "Muzeum Pożarnictwa w Alwerni",
          "Teńczyński Park Krajobrazowy",
        ],
      },
    ],
    vrFeature: {
      title: "Wirtualny spacer",
      subtitle: "Panoramy 360° z wnętrza Alvernia Planet",
      body: "Przejdź do osobnej zakładki z widokami VR i rozejrzyj się po kopułach oraz wybranych przestrzeniach kompleksu. Znajdziesz tam wszystkie panoramy dostępne w archiwum, od recepcji po wnętrza poszczególnych kopuł.",
      cta: "Otwórz wirtualny spacer",
      tags: ["Panoramy 360°", "Kopuły i przestrzenie", "Osobna podstrona VR"],
    },
  },
  en: {
    tag: "About us",
    heroTitle: "About Alvernia Planet",
    heroSubtitle: "A unique dome complex for film, events, and immersive experiences.",
    intro:
      "Alvernia Planet blends film, technology, and education. Our domes host events, film productions, and immersive attractions for visitors.",
    wikipediaLabel: "Wikipedia",
    wikipediaTitle: "Alvernia Planet on Polish Wikipedia",
    wikipediaLead:
      "A concise, independent overview of the venue, its history, architecture, and current functions.",
    wikipediaCta: "Go to Wikipedia",
    wikipediaFacts: [
      {
        title: "History",
        body: "The complex was built in 2000-2002 as the RMF Media Complex and later operated as Alvernia Studios.",
      },
      {
        title: "Transition",
        body: "Since September 2017 it has been developed as Alvernia Planet for event, exhibition, and educational uses.",
      },
      {
        title: "Architecture",
        body: "The article describes 13 domes connected by glazed corridors and a distinctly futuristic architectural form.",
      },
      {
        title: "Education",
        body: "It also notes educational programs about filmmaking, including scenography, sound, and post-production.",
      },
    ],
    bullets: [
      {
        title: "Industrial architecture",
        body: "Steel bridges, mezzanines, futuristic interiors, and glass connectors between domes.",
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
        alt: "Industrial-style interior with steel structures inside a dome",
      },
      {
        title: "Location",
        body: "Surrounded by greenery, with convenient road access and parking.",
        image: "/galeria/Ogolne/webp/8.webp",
        alt: "Aerial drone view of the Alvernia Planet complex",
      },
    ],
    metrics: [
      { value: "13", label: "domes ready for events, productions, and scenography" },
      { value: "17,425 m²", label: "built-up area" },
      { value: "300+", label: "parking spaces" },
    ],
    highlightTitle: "A unique place in the heart of Europe",
    highlightSubtitle:
      "Scale, infrastructure, and surroundings make this venue ready for both large productions and everyday visitors.",
    highlightSections: [
      {
        tag: "Access",
        title: "Location and access",
        summary: "Right by the A4 between Krakow and Katowice.",
        points: [
          "Nieporaz, Ferdynanda Wspaniałego 1",
          "30 km from Krakow, 10 km from Krakow Airport",
        ],
      },
      {
        tag: "Events",
        title: "Immersive events",
        summary: "A stage for premium events and productions.",
        points: [
          "Exhibitions, premieres, galas, concerts, fashion shows",
          "Immersive and multimedia-ready setups",
        ],
      },
      {
        tag: "Architecture",
        title: "Architecture and functions",
        summary: "Futuristic domes with glass corridors.",
        points: [
          "Entertainment, education, exhibitions, multimedia",
          "A distinctive architectural signature",
        ],
      },
      {
        tag: "Scale",
        title: "Scale and infrastructure",
        summary: "Large footprint and guest facilities.",
        points: [
          "17,425 m² built area and 14.21 ha site",
          "Parking for 300+ cars, expandable",
        ],
      },
      {
        tag: "Education",
        title: "Education and film",
        summary: "In-house educational path since 2023.",
        points: [
          "How films are made and scenography",
          "Image & sound illusion, audiovisual storytelling",
        ],
      },
      {
        tag: "Nearby",
        title: "Nearby attractions",
        summary: "Great for a full-day visit.",
        points: [
          "Tenczyn Castle and the Agate Museum in Rudno",
          "Małopolska Museum of Firefighting in Alwernia",
          "Tenczyn Landscape Park for a post-visit walk",
        ],
      },
    ],
    vrFeature: {
      title: "Virtual tour",
      subtitle: "360° panoramas from inside Alvernia Planet",
      body: "Open a dedicated VR section and look around the domes and selected spaces of the complex. It gathers every panorama currently available in the archive, from the reception area to the interiors of individual domes.",
      cta: "Open the virtual tour",
      tags: ["360° panoramas", "Domes and spaces", "Dedicated VR page"],
    },
  },
  pt: {
    tag: "Sobre nós",
    heroTitle: "Sobre a Alvernia Planet",
    heroSubtitle: "Um complexo único de cúpulas e um centro de eventos.",
    intro:
      "A Alvernia Planet combina audiovisual, tecnologia e educação. As nossas cúpulas recebem eventos, produções e atrações imersivas para visitantes.",
    wikipediaLabel: "Wikipedia",
    wikipediaTitle: "Alvernia Planet na Wikipedia polaca",
    wikipediaLead:
      "Um resumo independente da história do complexo, da arquitetura e das funções atuais, reunido num só lugar.",
    wikipediaCta: "Ir para a Wikipedia",
    wikipediaFacts: [
      {
        title: "Historia",
        body: "O complexo foi construído entre 2000 e 2002 como projeto RMF Media Complex e mais tarde funcionou como Alvernia Studios.",
      },
      {
        title: "Evolução",
        body: "Desde setembro de 2017 tem sido desenvolvido como Alvernia Planet para eventos, exposições e educação.",
      },
      {
        title: "Arquitetura",
        body: "O artigo descreve 13 cúpulas ligadas por corredores envidraçados e uma forma arquitetónica marcadamente futurista.",
      },
      {
        title: "Educação",
        body: "A página também menciona programas educativos sobre a criação de filmes, cenografia, som e pós-produção.",
      },
    ],
    bullets: [
      {
        title: "Arquitetura industrial",
        body: "Com pontes metálicas, mezaninos, interiores futuristas e ligações envidraçadas entre cúpulas.",
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
        alt: "Interior industrial da cúpula com estruturas metálicas",
      },
      {
        title: "Localização",
        body: "Rodeada de áreas verdes, com acesso fácil e estacionamento.",
        image: "/galeria/Ogolne/webp/8.webp",
        alt: "Vista aérea por drone do complexo da Alvernia Planet",
      },
    ],
    metrics: [
      { value: "13", label: "cúpulas prontas para eventos, produções e cenografia" },
      { value: "17 425 m²", label: "de área construída" },
      { value: "300+", label: "lugares de estacionamento" },
    ],
    highlightTitle: "Um lugar único no coração da Europa",
    highlightSubtitle:
      "A escala do complexo, a infraestrutura e os arredores criam um espaço pronto para grandes eventos e visitas diárias.",
    highlightSections: [
      {
        tag: "Acesso",
        title: "Localização e acesso",
        summary: "Junto à A4 entre Cracóvia e Katowice.",
        points: [
          "Nieporaz, Ferdynanda Wspaniałego 1",
          "30 km de Cracóvia, 10 km do aeroporto",
        ],
      },
      {
        tag: "Eventos",
        title: "Eventos imersivos",
        summary: "Palco para eventos e produções de prestígio.",
        points: [
          "Exposições, estreias, galas, concertos, desfiles",
          "Configurações imersivas e multimédia",
        ],
      },
      {
        tag: "Arquitetura",
        title: "Arquitetura e funções",
        summary: "Cúpulas futuristas e corredores envidraçados.",
        points: [
          "Entretenimento, educação, exposições, multimédia",
          "Assinatura arquitetónica marcante",
        ],
      },
      {
        tag: "Escala",
        title: "Escala e infraestrutura",
        summary: "Grande área e apoio ao visitante.",
        points: [
          "17 425 m² construídos e 14,21 ha",
          "Estacionamento para 300+ carros, com expansão",
        ],
      },
      {
        tag: "Educação",
        title: "Educação e audiovisual",
        summary: "Percurso educativo próprio desde 2023.",
        points: [
          "Como nascem produções e cenografia",
          "Ilusão de imagem e som, narrativa audiovisual",
        ],
      },
      {
        tag: "Arredores",
        title: "Arredores e atrações",
        summary: "Perfeito para uma visita de dia inteiro.",
        points: [
          "Castelo de Tenczyn e Museu das Ágatas em Rudno",
          "Museu de Bombeiros da Pequena Polónia em Alwernia",
          "Parque Paisagístico de Tenczyn para passeios",
        ],
      },
    ],
    vrFeature: {
      title: "Passeio virtual",
      subtitle: "Panorâmicas 360° do interior da Alvernia Planet",
      body: "Abra uma secção VR dedicada e explore as cúpulas e espaços selecionados do complexo. Lá encontra todas as panorâmicas atualmente disponíveis no arquivo, desde a receção até ao interior das cúpulas.",
      cta: "Abrir passeio virtual",
      tags: ["Panorâmicas 360°", "Cúpulas e espaços", "Página VR dedicada"],
    },
  },
  de: {
    tag: "Über uns",
    heroTitle: "Über Alvernia Planet",
    heroSubtitle: "Ein weltweit einzigartiger Kuppelkomplex für Film, Events und immersive Erlebnisse.",
    intro:
      "Alvernia Planet verbindet Film, Technologie und Bildung. Unsere Kuppeln beherbergen Veranstaltungen, Filmproduktionen und immersive Attraktionen für unsere Gäste.",
    wikipediaLabel: "Wikipedia",
    wikipediaTitle: "Alvernia Planet in der polnischen Wikipedia",
    wikipediaLead:
      "Ein kompakter, unabhängiger Überblick über das Objekt, seine Geschichte, Architektur und heutigen Funktionen.",
    wikipediaCta: "Zur Wikipedia",
    wikipediaFacts: [
      {
        title: "Geschichte",
        body: "Der Komplex entstand 2000-2002 als RMF Media Complex und wurde später als Alvernia Studios betrieben.",
      },
      {
        title: "Wandel",
        body: "Seit September 2017 wird er als Alvernia Planet für Veranstaltungen, Ausstellungen und Bildungsangebote entwickelt.",
      },
      {
        title: "Architektur",
        body: "Der Artikel beschreibt 13 Kuppeln, die durch verglaste Korridore verbunden sind, in einer betont futuristischen Architektur.",
      },
      {
        title: "Bildung",
        body: "Erwähnt werden auch Bildungsprogramme rund um die Filmentstehung, darunter Szenenbild, Ton und Postproduktion.",
      },
    ],
    bullets: [
      {
        title: "Industrielle Architektur",
        body: "Stahlbrücken, Zwischenebenen, futuristische Innenräume und gläserne Verbindungsgänge zwischen den Kuppeln.",
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
        alt: "Industriell geprägter Innenraum mit Stahlkonstruktionen im Inneren einer Kuppel",
      },
      {
        title: "Lage",
        body: "Umgeben von Grünflächen, mit bequemer Anfahrt und eigenem Parkplatz.",
        image: "/galeria/Ogolne/webp/8.webp",
        alt: "Luftaufnahme des Komplexes Alvernia Planet aus der Drohnenperspektive",
      },
    ],
    metrics: [
      { value: "13", label: "Kuppeln für Veranstaltungen, Produktionen und Szenenbilder" },
      { value: "17.425 m²", label: "bebaute Fläche" },
      { value: "300+", label: "Parkplätze" },
    ],
    highlightTitle: "Ein einzigartiger Ort im Herzen Europas",
    highlightSubtitle:
      "Größe, Infrastruktur und Umgebung machen dieses Objekt bereit für große Produktionen ebenso wie für Gäste im Alltag.",
    highlightSections: [
      {
        tag: "Anfahrt",
        title: "Lage und Anfahrt",
        summary: "Direkt an der A4 zwischen Kraków und Katowice.",
        points: [
          "Nieporaz, Ferdynanda Wspaniałego 1",
          "30 km von Kraków, 10 km vom Flughafen Kraków",
        ],
      },
      {
        tag: "Events",
        title: "Immersive Veranstaltungen",
        summary: "Eine Bühne für hochwertige Events und Produktionen.",
        points: [
          "Ausstellungen, Premieren, Galas, Konzerte, Modenschauen",
          "Aufbauten für volle Immersion und Multimedia",
        ],
      },
      {
        tag: "Architektur",
        title: "Architektur und Funktionen",
        summary: "Futuristische Kuppeln mit gläsernen Korridoren.",
        points: [
          "Unterhaltung, Bildung, Ausstellungen, Multimedia",
          "Eine unverwechselbare architektonische Handschrift",
        ],
      },
      {
        tag: "Größe",
        title: "Größe und Infrastruktur",
        summary: "Weitläufiges Gelände und Einrichtungen für Gäste.",
        points: [
          "17.425 m² bebaute Fläche und 14,21 ha Gelände",
          "Parkplatz für 300+ Fahrzeuge, erweiterbar",
        ],
      },
      {
        tag: "Bildung",
        title: "Bildung und Film",
        summary: "Eigener Bildungspfad seit 2023.",
        points: [
          "Wie Filme und Szenenbilder entstehen",
          "Bild- und Tonillusion, audiovisuelles Erzählen",
        ],
      },
      {
        tag: "Umgebung",
        title: "Attraktionen in der Umgebung",
        summary: "Ideal für einen Ausflug über den ganzen Tag.",
        points: [
          "Burg Tenczyn und das Achatmuseum in Rudno",
          "Feuerwehrmuseum der Region Małopolska in Alwernia",
          "Landschaftspark Tenczyn für einen Spaziergang danach",
        ],
      },
    ],
    vrFeature: {
      title: "Virtueller Rundgang",
      subtitle: "360°-Panoramen aus dem Inneren von Alvernia Planet",
      body: "Öffnen Sie den eigenen VR-Bereich und sehen Sie sich in den Kuppeln sowie in ausgewählten Räumen des Komplexes um. Dort finden Sie alle Panoramen, die derzeit im Archiv verfügbar sind - vom Empfang bis zu den Innenräumen der einzelnen Kuppeln.",
      cta: "Virtuellen Rundgang öffnen",
      tags: ["360°-Panoramen", "Kuppeln und Räume", "Eigene VR-Unterseite"],
    },
  },
  zh: {
    tag: "关于我们",
    heroTitle: "关于 Alvernia Planet",
    heroSubtitle: "世界罕见的穹顶建筑群，集电影、活动与沉浸式体验于一体。",
    intro:
      "Alvernia Planet 融合电影、科技与教育。我们的穹顶承办各类活动与影视制作，并为访客带来沉浸式体验项目。",
    wikipediaLabel: "Wikipedia",
    wikipediaTitle: "波兰语 Wikipedia 中的 Alvernia Planet",
    wikipediaLead:
      "一份简明而独立的介绍，涵盖场馆的历史、建筑以及当前的各项功能。",
    wikipediaCta: "前往 Wikipedia",
    wikipediaFacts: [
      {
        title: "历史",
        body: "建筑群于 2000-2002 年建成，最初名为 RMF Media Complex，后来以 Alvernia Studios 的名义运营。",
      },
      {
        title: "转型",
        body: "自 2017 年 9 月起，这里以 Alvernia Planet 的形式发展，用于活动、展览与教育。",
      },
      {
        title: "建筑",
        body: "词条介绍了 13 座由玻璃连廊相连的穹顶，以及鲜明的未来主义建筑造型。",
      },
      {
        title: "教育",
        body: "词条还提到关于电影创作的教育项目，内容包括布景、声音与后期制作。",
      },
    ],
    bullets: [
      {
        title: "工业风建筑",
        body: "钢制天桥、夹层、充满未来感的室内空间，以及穹顶之间的玻璃连廊。",
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
        alt: "穹顶内部的工业风空间与钢结构",
      },
      {
        title: "位置",
        body: "四周绿地环绕，交通便利，并设有停车场。",
        image: "/galeria/Ogolne/webp/8.webp",
        alt: "Alvernia Planet 建筑群的无人机航拍画面",
      },
    ],
    metrics: [
      { value: "13", label: "座穹顶，可用于活动、拍摄与布景" },
      { value: "17,425 m²", label: "建筑面积" },
      { value: "300+", label: "停车位" },
    ],
    highlightTitle: "欧洲腹地的独特之地",
    highlightSubtitle:
      "规模、设施与周边环境，让这里既能承办大型制作，也随时欢迎日常到访的游客。",
    highlightSections: [
      {
        tag: "交通",
        title: "位置与交通",
        summary: "紧邻 A4 高速公路，位于 Kraków 与 Katowice 之间。",
        points: [
          "Nieporaz, Ferdynanda Wspaniałego 1",
          "距 Kraków 30 公里，距 Kraków 机场 10 公里",
        ],
      },
      {
        tag: "活动",
        title: "沉浸式活动",
        summary: "高端活动与影视制作的舞台。",
        points: [
          "展览、首映、庆典、音乐会、时装秀",
          "可实现全场沉浸与多媒体呈现",
        ],
      },
      {
        tag: "建筑",
        title: "建筑与功能",
        summary: "未来感穹顶与玻璃连廊。",
        points: [
          "娱乐、教育、展览与多媒体",
          "辨识度极高的建筑风格",
        ],
      },
      {
        tag: "规模",
        title: "规模与设施",
        summary: "宽阔的场地与完善的访客配套。",
        points: [
          "建筑面积 17,425 m²，占地 14.21 公顷",
          "300+ 车位的停车场，并可继续扩建",
        ],
      },
      {
        tag: "教育",
        title: "教育与电影",
        summary: "自 2023 年起推出自主研发的教育路线。",
        points: [
          "电影与布景的诞生过程",
          "影像与声音的错觉，视听叙事",
        ],
      },
      {
        tag: "周边",
        title: "周边景点",
        summary: "适合安排一整天的行程。",
        points: [
          "Rudno 的 Tenczyn 城堡与玛瑙博物馆",
          "Alwernia 的 Małopolska 消防博物馆",
          "参观之后可漫步 Tenczyn 景观公园",
        ],
      },
    ],
    vrFeature: {
      title: "虚拟漫游",
      subtitle: "Alvernia Planet 内部的 360° 全景",
      body: "打开独立的 VR 页面，环视各座穹顶以及建筑群中的精选空间。那里汇集了档案中目前可用的全部全景，从接待区一直到每座穹顶的内部。",
      cta: "打开虚拟漫游",
      tags: ["360° 全景", "穹顶与空间", "独立 VR 页面"],
    },
  },
};

function AnimatedMetricValue({
  value,
  locale,
  className,
}: {
  value: string;
  locale: Locale;
  className?: string;
}) {
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  const parsed = useMemo(() => {
    const digits = value.replace(/[^\d]/g, "");
    const target = Number(digits || "0");
    const suffix = value.replace(/^[\d\s,\.]+/, "");
    return { target, suffix };
  }, [value]);

  const numberLocale = locale === "pl" ? "pl-PL" : locale === "pt" ? "pt-PT" : "en-US";

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || parsed.target <= 0) return;
    let frame = 0;
    const duration = 3200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(parsed.target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, parsed.target]);

  const formatted = `${new Intl.NumberFormat(numberLocale).format(current)}${parsed.suffix}`;

  return (
    <span ref={valueRef} className={className}>
      {formatted}
    </span>
  );
}

export default function AboutAlverniaPage() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = COPY[loc];
  const vrHref = getLocalizedPath("/wydarzenia/vr", loc);
  const metricTones = [
    "from-[#4fcfde]/20 via-[#4fcfde]/6 to-transparent",
    "from-[#f77828]/22 via-[#f77828]/6 to-transparent",
    "from-[#f03c64]/20 via-[#f03c64]/6 to-transparent",
  ];

  return (
    <main className="relative min-h-screen text-white px-4 py-12 sm:py-16 ap-page-intro-stagger">
      <div className="ap-shell ap-page-stack">
        <header className="text-center space-y-5">
          <p className="ap-type-kicker">{copy.tag}</p>
          <h1 className="ap-type-hero-title">{copy.heroTitle}</h1>
          <p className="ap-type-hero-subtitle max-w-5xl mx-auto">
            {copy.heroSubtitle} {copy.intro}
          </p>
          <div className="h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </header>

        <Card variant="glass" className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-16 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,207,222,0.28)_0%,rgba(79,207,222,0.06)_45%,rgba(79,207,222,0)_72%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(240,60,100,0.2)_0%,rgba(240,60,100,0.06)_38%,rgba(240,60,100,0)_72%)]"
            aria-hidden
          />
          <div className="relative grid gap-7 lg:grid-cols-[1.35fr_0.9fr] lg:gap-10">
            <div className="h-full">
              <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-2">
                {copy.bullets.map((item) => (
                  <div
                    key={item.title}
                    className="ap-tile ap-tile-sm ap-tile-interactive h-full p-2.5 sm:p-3"
                  >
                    <div className="relative h-36 w-full overflow-hidden rounded-xl ring-1 ring-white/15 sm:h-40 lg:h-44">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="mt-3 space-y-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {copy.metrics.map((metric, index) => (
                <article
                  key={metric.value + metric.label}
                  className="ap-tile ap-tile-sm ap-tile-interactive relative overflow-hidden px-4 py-4"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metricTones[index % metricTones.length]} opacity-90`}
                    aria-hidden
                  />
                  <div className="relative">
                    <p className="text-2xl sm:text-3xl font-extrabold leading-none text-white">
                      <AnimatedMetricValue
                        value={metric.value}
                        locale={loc}
                        className="tabular-nums"
                      />
                    </p>
                    <p className="mt-2 text-sm text-white/75">{metric.label}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="ap-tile ap-tile-lg relative mt-8 p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <a
                  href={WIKIPEDIA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-[10px] font-extrabold tracking-normal text-white">
                    W
                  </span>
                  {copy.wikipediaLabel}
                  <SolarIcon
                    name="arrow-up-right"
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <h2 className="mt-4 text-xl font-semibold text-white sm:text-2xl">{copy.wikipediaTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                  {copy.wikipediaLead}
                </p>
              </div>
              <a
                href={WIKIPEDIA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start text-sm font-medium text-[#7de7f1] transition hover:text-white"
              >
                <span>Wikipedia</span>
                <SolarIcon name="arrow-up-right" className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {copy.wikipediaFacts.map((fact) => (
                <article
                  key={fact.title}
                  className="ap-tile ap-tile-sm px-4 py-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    {fact.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/75 sm:text-[0.95rem]">
                    {fact.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className="relative mt-8 flex justify-center">
            <PrimaryButton
              href={WIKIPEDIA_URL}
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.wikipediaCta}
            </PrimaryButton>
          </div>
        </Card>

        <Card variant="solid" className="relative overflow-hidden" motion="off">
          <div
            className="pointer-events-none absolute -top-20 right-[-3.5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,207,222,0.24)_0%,rgba(79,207,222,0.05)_42%,rgba(79,207,222,0)_72%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 left-[-4rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(247,120,40,0.2)_0%,rgba(247,120,40,0.05)_40%,rgba(247,120,40,0)_74%)]"
            aria-hidden
          />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="space-y-5 text-center lg:text-left">
              <p className="ap-type-kicker">{copy.vrFeature.subtitle}</p>
              <h2 className="ap-type-section-title">{copy.vrFeature.title}</h2>
              <p className="ap-type-section-body max-w-3xl">{copy.vrFeature.body}</p>
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {copy.vrFeature.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/72"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pt-2">
                <PrimaryButton href={vrHref} size="lg">
                  {copy.vrFeature.cta}
                </PrimaryButton>
              </div>
            </div>
            <div className="ap-tile ap-tile-lg p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  // Zoptymalizowane podglądy (resize + webp) — wizualnie identyczne
                  // przy wyświetlaniu ~600 px. Oryginały pełnej rozdzielczości
                  // zostają w /Alvernia VR/ dla właściwego touru VR.
                  "/o-alvernia-planet/vr1.webp",
                  "/o-alvernia-planet/vr2.webp",
                  "/o-alvernia-planet/vr3.webp",
                  "/o-alvernia-planet/vr4.webp",
                ].map((src, index) => (
                  <div
                    key={src}
                    className={`ap-tile ap-tile-sm relative overflow-hidden bg-black/20 ${
                      index === 0 ? "sm:col-span-2 aspect-[16/8.5]" : "aspect-[16/10]"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={copy.vrFeature.title}
                      fill
                      sizes="(min-width: 1024px) 32vw, 100vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
