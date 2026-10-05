"use client";

/* Style tej podstrony — wycięte z globals.css (341 reguł, 96 kB).
   Next dzieli CSS po trasach, więc ten arkusz pobiera tylko ten, kto
   naprawdę wchodzi na /wydarzenia. Wcześniej jechał do każdego gościa,
   także na stronę główną. */
import "./wydarzenia.css";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { useI18n } from "@/app/i18n-provider";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import FullscreenHero from "@/app/components/FullscreenHero";
import { SolarIcon, type SolarIconName } from "@/app/components/SolarIcon";
import Card from "@/app/components/Card";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import Image from "next/image";
import { LANDING_COPY, type LandingCopy } from "./landingCopy";
import {
  DOME_IMAGE_BY_KEY,
  EDITORIAL_IMAGES,
  EVENT_DOME_ORDER,
  FORMAT_CATEGORIES,
  METRIC_LABELS,
  TRUSTED_LOGOS,
  UP_TO_LABEL,
  domeMetrics,
  type DomeKey,
  type MetricLabelKey,
  type TrustedLogo,
} from "./landingData";

type DomeMapHotspot = {
  id: string;
  dome: DomeKey;
  label: string;
  x: number;
  y: number;
  size: number;
};

/* Kolejność MUSI odpowiadać EVENT_DOME_ORDER — to ona wyznacza kolejność Tab
   i odczytu przez czytnik ekranu, a te same cztery wybory występują na stronie
   dwa razy (piny + kafelki). Rozjazd sprawiał, że mapa czytała się K3-K7-K12-K10,
   a kafelki K3-K7-K10-K12. */
const DOME_MAP_HOTSPOTS: DomeMapHotspot[] = [
  { id: "k3", dome: "k3", label: "K3", x: 70.5, y: 31.0, size: 8.5 },
  { id: "k7", dome: "k7", label: "K7", x: 34.6, y: 40.6, size: 7.0 },
  { id: "k10", dome: "k10", label: "K10", x: 54.2, y: 68.4, size: 7.0 },
  { id: "k12", dome: "k12", label: "K12", x: 35.5, y: 73.0, size: 7.0 },
];

/* Proporcja pliku mapy. Pin ma szerokość podaną w % kontenera, a odsunięcie
   karty podglądu liczymy w % jego WYSOKOŚCI — stąd przelicznik. */
const MAP_ASPECT = 1784 / 882;

/** Jedno id, żeby marker mógł wskazać kartę przez aria-controls. */
const DOME_PREVIEW_ID = "events-dome-preview";

/* Szerokość głównej linii tytułu hero w em (Poppins 800, zmierzona w przeglądarce)
   z ok. 4% zapasu. Główna linia musi zmieścić się w JEDNYM wierszu także na
   telefonie, więc jej rozmiar liczymy z szerokości kontenera — osobno dla języka,
   bo wspólny dzielnik (najszerszy, niemiecki) niepotrzebnie zmniejszałby resztę.
   Zmierzone: pl 11.92em, en 6.98em, pt 10.28em, de 13.57em, zh 5.97em. */
const HERO_TITLE_EM: Record<Locale, number> = {
  pl: 12.4,
  en: 7.3,
  pt: 10.7,
  de: 14.1,
  zh: 6.25,
};

const SHOW_ALL_DOME_AREAS = true;

type VideoItem = { title: string; body: string; src: string; poster: string; embed?: boolean };

const VIDEO_SHOWCASE: Record<
  Locale,
  {
    title: string;
    items: VideoItem[];
  }
> = {
  pl: {
    title: "Zobacz wideo z wydarzeń",
    items: [
      {
        title: "Koncert w kopule",
        body: "Muzyka na żywo w przestrzeni kopuły.",
        src: "https://www.youtube.com/watch?v=jt6zh-vaFNc&t=12s",
        poster: "https://i.ytimg.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Bankiet i gala",
        body: "Kopuła w wieczorowej aranżacji.",
        src: "https://www.youtube.com/watch?v=PWtTaxqxufE",
        poster: "https://i.ytimg.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Afterparty",
        body: "Przestrzeń w klubowej odsłonie.",
        src: "https://www.youtube.com/watch?v=BkdKk5Jc_RA",
        poster: "https://i.ytimg.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
        embed: true,
      },
    ],
  },
  en: {
    title: "Event video highlights",
    items: [
      {
        title: "Concert in the dome",
        body: "Live music inside the dome.",
        src: "https://www.youtube.com/watch?v=jt6zh-vaFNc&t=12s",
        poster: "https://i.ytimg.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Banquet and gala",
        body: "The dome in an evening set-up.",
        src: "https://www.youtube.com/watch?v=PWtTaxqxufE",
        poster: "https://i.ytimg.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Afterparty",
        body: "The space in a club setting.",
        src: "https://www.youtube.com/watch?v=BkdKk5Jc_RA",
        poster: "https://i.ytimg.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
        embed: true,
      },
    ],
  },
  pt: {
    title: "Vídeos de eventos",
    items: [
      {
        title: "Concerto na cúpula",
        body: "Música ao vivo no espaço da cúpula.",
        src: "https://www.youtube.com/watch?v=jt6zh-vaFNc&t=12s",
        poster: "https://i.ytimg.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Banquete e gala",
        body: "A cúpula numa ambientação noturna.",
        src: "https://www.youtube.com/watch?v=PWtTaxqxufE",
        poster: "https://i.ytimg.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Afterparty",
        body: "O espaço em versão de clube.",
        src: "https://www.youtube.com/watch?v=BkdKk5Jc_RA",
        poster: "https://i.ytimg.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
        embed: true,
      },
    ],
  },
  de: {
    title: "Video-Highlights von Veranstaltungen",
    items: [
      {
        title: "Konzert in der Kuppel",
        body: "Live-Musik im Raum der Kuppel.",
        src: "https://www.youtube.com/watch?v=jt6zh-vaFNc&t=12s",
        poster: "https://i.ytimg.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Bankett und Gala",
        body: "Die Kuppel in abendlicher Inszenierung.",
        src: "https://www.youtube.com/watch?v=PWtTaxqxufE",
        poster: "https://i.ytimg.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Afterparty",
        body: "Die Fläche im Club-Format.",
        src: "https://www.youtube.com/watch?v=BkdKk5Jc_RA",
        poster: "https://i.ytimg.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
        embed: true,
      },
    ],
  },
  zh: {
    title: "活动视频集锦",
    items: [
      {
        title: "穹顶音乐会",
        body: "穹顶空间里的现场音乐。",
        src: "https://www.youtube.com/watch?v=jt6zh-vaFNc&t=12s",
        poster: "https://i.ytimg.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "宴会与庆典",
        body: "穹顶的夜间布置。",
        src: "https://www.youtube.com/watch?v=PWtTaxqxufE",
        poster: "https://i.ytimg.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "俱乐部之夜",
        body: "以俱乐部风格呈现的空间。",
        src: "https://www.youtube.com/watch?v=BkdKk5Jc_RA",
        poster: "https://i.ytimg.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
        embed: true,
      },
    ],
  },
};

// ===== UI tekst (loadery, kontakt, adres, przycisk mapy) =====
const UI_TEXT: Record<
  Locale,
  {
    loadingVideo: string;
    playVideo: string;
    videoFallback: string;
  }
> = {
  pl: {
    loadingVideo: "Ładowanie wideo...",
    playVideo: "Odtwórz",
    videoFallback: "Twoja przeglądarka nie obsługuje elementu wideo.",
  },
  en: {
    loadingVideo: "Loading video...",
    playVideo: "Play",
    videoFallback: "Your browser does not support the video element.",
  },
  pt: {
    loadingVideo: "A carregar vídeo...",
    playVideo: "Reproduzir",
    videoFallback: "O seu navegador não suporta o elemento de vídeo.",
  },
  de: {
    loadingVideo: "Video wird geladen ...",
    playVideo: "Abspielen",
    videoFallback: "Ihr Browser unterstützt das Video-Element nicht.",
  },
  zh: {
    loadingVideo: "视频加载中……",
    playVideo: "播放",
    videoFallback: "您的浏览器不支持视频播放。",
  },
};

const SECTION_UI: Record<
  Locale,
  {
    highlightsLabel: string;
    offerLabel: string;
    domesLabel: string;
    domesIntro: string;
    domesCardLabel: string;
    domeImageAltSuffix: string;
    domesMapLabel: string;
    domesMapHint: string;
    domesMapAlt: string;
    domesMapSelectLabel: string;
    domesMapGroupLabel: string;
    domesMapPreviewLabel: string;
    domesMapPreviewClose: string;
    domesMapZoomOpen: string;
    domesMapZoomTitle: string;
    domesMapZoomHint: string;
    domesMapZoomClose: string;
    formatsPagerLabel: string;
    formatsNext: string;
    casesPagerLabel: string;
    casesNext: string;
    spacesNext: string;
    trustedLabel: string;
    trustedSpeedLabel: string;
    trustedSlower: string;
    trustedFaster: string;
    whyColorLabel: string;
    whyColorRed: string;
    whyColorBlue: string;
    whyColorOrange: string;
    railShowCard: string;
    salesTeamLabel: string;
    heroClaim: string;
    heroSecondaryCta: string;
    heroScrollHint: string;
    teamHeading: string;
    teamCopy: string;
    contactCta: string;
  }
> = {
  pl: {
    highlightsLabel: "Najważniejsze atuty",
    offerLabel: "Formaty wydarzeń",
    domesLabel: "Obiekty dostępne pod wynajem",
    domesIntro:
      "To nasze realne przestrzenie eventowe, które możesz wynająć. Poniżej znajdziesz kluczowe parametry każdej z nich.",
    domesCardLabel: "Wynajem",
    domeImageAltSuffix: "podgląd obiektu",
    domesMapLabel: "Mapa techniczna kopuł",
    domesMapHint: "Wybierz kopułę i poznaj jej wnętrze, wyposażenie oraz parametry.",
    domesMapAlt: "Wizualizacja kompleksu Alvernia Planet z zaznaczonymi kopułami K3, K7, K10 i K12",
    domesMapSelectLabel: "Wybierz kopułę",
    domesMapGroupLabel: "Interaktywna mapa kompleksu — wybierz kopułę",
    domesMapPreviewLabel: "Podgląd wybranej przestrzeni",
    domesMapPreviewClose: "Zamknij podgląd",
    domesMapZoomOpen: "Powiększ mapę",
    domesMapZoomTitle: "Mapa kompleksu",
    domesMapZoomHint: "Przesuwaj mapę palcem. Dotknij kopuły, aby ją wybrać.",
    domesMapZoomClose: "Zamknij powiększoną mapę",
    formatsPagerLabel: "Przewijanie rodzajów wydarzeń",
    formatsNext: "Następny rodzaj wydarzenia",
    casesPagerLabel: "Przewijanie filmów z realizacji",
    casesNext: "Następny film",
    spacesNext: "Następna przestrzeń",
    trustedLabel: "Logotypy firm, które zorganizowały u nas wydarzenie",
    trustedSpeedLabel: "Tempo przewijania",
    trustedSlower: "wolniej",
    trustedFaster: "szybciej",
    whyColorLabel: "Kolor ikon",
    whyColorRed: "czerwony",
    whyColorBlue: "niebieski",
    whyColorOrange: "pomarańczowy",
    railShowCard: "Pokaż",
    salesTeamLabel: "Zespół Klienta Biznesowego",
    heroClaim: "Kopuły, akustyka i zaplecze filmowe 30 minut od Krakowa.",
    teamHeading: "Twój dedykowany zespół od wyjątkowych wydarzeń",
    teamCopy:
      "Od pierwszego pomysłu po realizację wydarzenia. Doradzamy, projektujemy i wspieramy na każdym etapie organizacji eventu. Łączymy doświadczenie produkcji filmowej z kompetencjami eventowymi, tworząc wydarzenia, które pozostają w pamięci uczestników na długo.",
    heroSecondaryCta: "Zobacz przestrzenie",
    heroScrollHint: "Przestrzenie do wynajęcia",
    contactCta: "Zapytaj o termin",
  },
  en: {
    highlightsLabel: "Key highlights",
    offerLabel: "Event formats",
    domesLabel: "Rentable venue spaces",
    domesIntro:
      "These are real event spaces available for rent. Below are the key parameters of each venue.",
    domesCardLabel: "For rent",
    domeImageAltSuffix: "venue preview",
    domesMapLabel: "Technical dome map",
    domesMapHint: "Pick a dome and see its interior, equipment and specifications.",
    domesMapAlt: "Visualisation of the Alvernia Planet complex with domes K3, K7, K10 and K12 marked",
    domesMapSelectLabel: "Select dome",
    domesMapGroupLabel: "Interactive map of the complex — pick a dome",
    domesMapPreviewLabel: "Preview of the selected space",
    domesMapPreviewClose: "Close preview",
    domesMapZoomOpen: "Enlarge map",
    domesMapZoomTitle: "Complex map",
    domesMapZoomHint: "Drag to explore the map. Tap a dome to select it.",
    domesMapZoomClose: "Close enlarged map",
    formatsPagerLabel: "Event types carousel",
    formatsNext: "Next event type",
    casesPagerLabel: "Event videos carousel",
    casesNext: "Next video",
    spacesNext: "Next space",
    trustedLabel: "Logos of companies that have held an event with us",
    trustedSpeedLabel: "Scrolling speed",
    trustedSlower: "slower",
    trustedFaster: "faster",
    whyColorLabel: "Icon colour",
    whyColorRed: "red",
    whyColorBlue: "blue",
    whyColorOrange: "orange",
    railShowCard: "Show",
    salesTeamLabel: "Business Client Team",
    heroClaim: "Domes, acoustics and a film-production backstage 30 minutes from Kraków.",
    teamHeading: "Your dedicated team for exceptional events",
    teamCopy:
      "From the first idea to the finished event. We advise, design and support you at every stage. We combine film-production experience with event expertise to create occasions guests remember long afterwards.",
    heroSecondaryCta: "See the spaces",
    heroScrollHint: "Spaces for rent",
    contactCta: "Ask about dates",
  },
  pt: {
    highlightsLabel: "Destaques principais",
    offerLabel: "Formatos de evento",
    domesLabel: "Espaços disponíveis para aluguer",
    domesIntro:
      "Estes são espaços reais para eventos disponíveis para aluguer. Abaixo estão os principais parâmetros de cada espaço.",
    domesCardLabel: "Para aluguer",
    domeImageAltSuffix: "pré-visualização do espaço",
    domesMapLabel: "Mapa técnica das cúpulas",
    domesMapHint: "Escolha uma cúpula e veja o interior, o equipamento e os parâmetros.",
    domesMapAlt: "Visualização do complexo Alvernia Planet com as cúpulas K3, K7, K10 e K12 assinaladas",
    domesMapSelectLabel: "Selecionar cúpula",
    domesMapGroupLabel: "Mapa interativo do complexo — escolha uma cúpula",
    domesMapPreviewLabel: "Pré-visualização do espaço selecionado",
    domesMapPreviewClose: "Fechar pré-visualização",
    domesMapZoomOpen: "Ampliar mapa",
    domesMapZoomTitle: "Mapa do complexo",
    domesMapZoomHint: "Arraste para explorar o mapa. Toque numa cúpula para a selecionar.",
    domesMapZoomClose: "Fechar mapa ampliado",
    formatsPagerLabel: "Carrossel de tipos de eventos",
    formatsNext: "Próximo tipo de evento",
    casesPagerLabel: "Carrossel de vídeos de eventos",
    casesNext: "Próximo vídeo",
    spacesNext: "Próximo espaço",
    trustedLabel: "Logótipos de empresas que realizaram um evento connosco",
    trustedSpeedLabel: "Velocidade",
    trustedSlower: "mais devagar",
    trustedFaster: "mais rápido",
    whyColorLabel: "Cor dos ícones",
    whyColorRed: "vermelho",
    whyColorBlue: "azul",
    whyColorOrange: "laranja",
    railShowCard: "Mostrar",
    salesTeamLabel: "Equipa de Clientes Empresariais",
    heroClaim: "Cúpulas, acústica e bastidores de cinema a 30 minutos de Kraków.",
    teamHeading: "A sua equipa dedicada a eventos excecionais",
    teamCopy:
      "Da primeira ideia à realização do evento. Aconselhamos, desenhamos e apoiamos em cada etapa. Juntamos a experiência de produção de cinema às competências de eventos, criando ocasiões que ficam na memória.",
    heroSecondaryCta: "Ver os espaços",
    heroScrollHint: "Espaços para alugar",
    contactCta: "Pedir disponibilidade",
  },
  de: {
    highlightsLabel: "Wichtigste Vorteile",
    offerLabel: "Veranstaltungsformate",
    domesLabel: "Mietbare Veranstaltungsflächen",
    domesIntro:
      "Das sind echte Veranstaltungsflächen, die Sie mieten können. Nachfolgend finden Sie die wichtigsten Parameter jeder Fläche.",
    domesCardLabel: "Zu vermieten",
    domeImageAltSuffix: "Vorschau des Objekts",
    domesMapLabel: "Technische Kuppelkarte",
    domesMapHint: "Wählen Sie eine Kuppel und sehen Sie Innenraum, Ausstattung und Daten.",
    domesMapAlt: "Visualisierung des Alvernia-Planet-Komplexes mit den markierten Kuppeln K3, K7, K10 und K12",
    domesMapSelectLabel: "Kuppel auswählen",
    domesMapGroupLabel: "Interaktive Karte des Komplexes — Kuppel auswählen",
    domesMapPreviewLabel: "Vorschau der ausgewählten Fläche",
    domesMapPreviewClose: "Vorschau schließen",
    domesMapZoomOpen: "Karte vergrößern",
    domesMapZoomTitle: "Karte des Komplexes",
    domesMapZoomHint: "Ziehen Sie die Karte, um sie zu erkunden. Tippen Sie auf eine Kuppel, um sie auszuwählen.",
    domesMapZoomClose: "Vergrößerte Karte schließen",
    formatsPagerLabel: "Karussell der Veranstaltungsarten",
    formatsNext: "Nächste Veranstaltungsart",
    casesPagerLabel: "Karussell der Eventvideos",
    casesNext: "Nächstes Video",
    spacesNext: "Nächste Fläche",
    trustedLabel: "Logos von Unternehmen, die bei uns eine Veranstaltung ausgerichtet haben",
    trustedSpeedLabel: "Tempo",
    trustedSlower: "langsamer",
    trustedFaster: "schneller",
    whyColorLabel: "Farbe der Symbole",
    whyColorRed: "rot",
    whyColorBlue: "blau",
    whyColorOrange: "orange",
    railShowCard: "Anzeigen",
    salesTeamLabel: "Team für Geschäftskunden",
    heroClaim: "Kuppeln, Akustik und Filmproduktions-Backstage — 30 Minuten von Kraków.",
    teamHeading: "Ihr eigenes Team für außergewöhnliche Veranstaltungen",
    teamCopy:
      "Von der ersten Idee bis zur fertigen Veranstaltung. Wir beraten, planen und begleiten Sie in jeder Phase. Wir verbinden Erfahrung aus der Filmproduktion mit Event-Kompetenz und schaffen Veranstaltungen, an die sich Gäste lange erinnern.",
    heroSecondaryCta: "Flächen ansehen",
    heroScrollHint: "Flächen zu mieten",
    contactCta: "Termin anfragen",
  },
  zh: {
    highlightsLabel: "核心亮点",
    offerLabel: "活动形式",
    domesLabel: "可租用的场地",
    domesIntro:
      "这些都是可供租用的真实活动空间。以下是每个场地的主要参数。",
    domesCardLabel: "可租用",
    domeImageAltSuffix: "场地预览",
    domesMapLabel: "穹顶技术平面图",
    domesMapHint: "选择一座穹顶，了解其内部、配套设备与参数。",
    domesMapAlt: "Alvernia Planet 建筑群可视化图，已标注 K3、K7、K10 和 K12 穹顶",
    domesMapSelectLabel: "选择穹顶",
    domesMapGroupLabel: "建筑群互动地图 — 选择穹顶",
    domesMapPreviewLabel: "所选空间预览",
    domesMapPreviewClose: "关闭预览",
    domesMapZoomOpen: "放大地图",
    domesMapZoomTitle: "园区地图",
    domesMapZoomHint: "拖动查看地图，点击穹顶即可选择。",
    domesMapZoomClose: "关闭放大地图",
    formatsPagerLabel: "活动类型轮播",
    formatsNext: "下一个活动类型",
    casesPagerLabel: "活动视频轮播",
    casesNext: "下一个视频",
    spacesNext: "下一个空间",
    trustedLabel: "曾在这里举办活动的企业标识",
    trustedSpeedLabel: "滚动速度",
    trustedSlower: "更慢",
    trustedFaster: "更快",
    whyColorLabel: "图标颜色",
    whyColorRed: "红色",
    whyColorBlue: "蓝色",
    whyColorOrange: "橙色",
    railShowCard: "查看",
    salesTeamLabel: "企业客户团队",
    heroClaim: "穹顶、专业声学与影视制作后台，距 Kraków 仅 30 分钟车程。",
    teamHeading: "为非凡活动而设的专属团队",
    teamCopy:
      "从最初的构想到活动落地，我们在每个环节提供咨询、设计与支持。我们把影视制作的经验与活动策划的专长结合起来，打造让来宾长久难忘的现场。",
    heroSecondaryCta: "查看场地",
    heroScrollHint: "可租用空间",
    contactCta: "咨询可用档期",
  },
};

/* Kolejność akcentów kolorystycznych kafelków — te same trzy kolory, co ceny
   biletów na stronie głównej. Klasy definiują --events-tile-accent. */
const TILE_TONES = ["events-tone-cyan", "events-tone-red", "events-tone-orange"];

type StatItem = {
  /** Liczba wraz z jednostką, np. „2 000 m²". Pusta, gdy atut nie jest liczbą. */
  value?: string;
  /** Dopisek przed liczbą („do", „up to") — mniejszy, poza licznikiem. */
  prefix?: string;
  /** Ikona zamiast liczby — dla atutów, których nie da się zmierzyć. */
  icon?: SolarIconName;
  label: string;
};

const STATS: Record<
  Locale,
  { title: string; intro: string; items: StatItem[] }
> = {
  pl: {
    title: "Alvernia Planet *w liczbach*",
    intro:
      "Najważniejsze informacje o kompleksie i przestrzeniach eventowych.",
    items: [
      { value: "13", label: "kopuł na terenie kompleksu" },
      { prefix: "do", value: "2 000 m²", label: "powierzchni jednej kopuły" },
      { value: "30 min", label: "od Krakowa, zjazd z A4" },
      { value: "1000+", label: "zrealizowanych wydarzeń" },
      { icon: "star", label: "Doświadczenie filmowe i eventowe" },
      { value: "300+", label: "miejsc parkingowych na terenie kompleksu" },
    ],
  },
  en: {
    title: "Alvernia Planet *in numbers*",
    intro:
      "Key facts about the complex and its event spaces.",
    items: [
      { value: "13", label: "domes at the complex" },
      { prefix: "up to", value: "2 000 m²", label: "of a single dome's floor space" },
      { value: "30 min", label: "from Kraków, straight off the A4" },
      { value: "1000+", label: "events delivered" },
      { icon: "star", label: "Film and event experience" },
      { value: "300+", label: "parking spaces at the complex" },
    ],
  },
  pt: {
    title: "A Alvernia Planet *em números*",
    intro:
      "Informações essenciais sobre o complexo e os espaços para eventos.",
    items: [
      { value: "13", label: "cúpulas no complexo" },
      { prefix: "até", value: "2 000 m²", label: "de área de uma cúpula" },
      { value: "30 min", label: "de Kraków, saída da A4" },
      { value: "1000+", label: "eventos realizados" },
      { icon: "star", label: "Experiência em cinema e eventos" },
      { value: "300+", label: "lugares de estacionamento no complexo" },
    ],
  },
  de: {
    title: "Alvernia Planet *in Zahlen*",
    intro:
      "Die wichtigsten Angaben zum Gelände und zu den Eventflächen.",
    items: [
      { value: "13", label: "Kuppeln auf dem Gelände" },
      { prefix: "bis zu", value: "2 000 m²", label: "Fläche einer Kuppel" },
      { value: "30 Min.", label: "von Kraków, direkt an der A4" },
      { value: "1000+", label: "umgesetzte Veranstaltungen" },
      { icon: "star", label: "Erfahrung in Film und Events" },
      { value: "300+", label: "Parkplätze auf dem Gelände" },
    ],
  },
  zh: {
    title: "*数字中的* Alvernia Planet",
    intro: "关于园区和活动空间的重要信息。",
    items: [
      { value: "13", label: "座穹顶坐落于园区" },
      { prefix: "最大", value: "2 000 m²", label: "单座穹顶面积" },
      { value: "30 分钟", label: "距 Kraków，A4 高速直达" },
      { value: "1000+", label: "已举办的活动" },
      { icon: "star", label: "影视与活动经验" },
      { value: "300+", label: "个园区停车位" },
    ],
  },
};

type ContactItem = {
  name: string;
  role: string;
  phone: string;
  email: string;
  accentClass: string;
};

const CONTACT_PHOTOS: Record<string, string> = {
  "b.jacon@gremi.pl": "/wydarzenia/zespol/bartlomiej-jacon-216.webp",
  "p.kozolub@gremi.pl": "/wydarzenia/zespol/piotr-kozolub-216.webp",
};

const CONTACTS: Record<Locale, ContactItem[]> = {
  pl: [
    {
      name: "BARTEK JACOŃ",
      role: "Starszy specjalista ds. sprzedaży",
      phone: "+48 723 999 099",
      email: "b.jacon@gremi.pl",
      accentClass: "text-[#f77828] hover:text-[#f03c64]",
    },
    {
      name: "PIOTR KOZOŁUB",
      role: "Specjalista ds. sprzedaży",
      phone: "+48 452 432 315",
      email: "p.kozolub@gremi.pl",
      accentClass: "text-[#f03c64] hover:text-[#f77828]",
    },
  ],
  en: [
    {
      name: "BARTEK JACOŃ",
      role: "Senior sales specialist",
      phone: "+48 723 999 099",
      email: "b.jacon@gremi.pl",
      accentClass: "text-[#f77828] hover:text-[#f03c64]",
    },
    {
      name: "PIOTR KOZOŁUB",
      role: "Sales specialist",
      phone: "+48 452 432 315",
      email: "p.kozolub@gremi.pl",
      accentClass: "text-[#f03c64] hover:text-[#f77828]",
    },
  ],
  pt: [
    {
      name: "BARTEK JACOŃ",
      role: "Especialista sénior de vendas",
      phone: "+48 723 999 099",
      email: "b.jacon@gremi.pl",
      accentClass: "text-[#f77828] hover:text-[#f03c64]",
    },
    {
      name: "PIOTR KOZOŁUB",
      role: "Especialista de vendas",
      phone: "+48 452 432 315",
      email: "p.kozolub@gremi.pl",
      accentClass: "text-[#f03c64] hover:text-[#f77828]",
    },
  ],
  de: [
    {
      name: "BARTEK JACOŃ",
      role: "Senior-Vertriebsspezialist",
      phone: "+48 723 999 099",
      email: "b.jacon@gremi.pl",
      accentClass: "text-[#f77828] hover:text-[#f03c64]",
    },
    {
      name: "PIOTR KOZOŁUB",
      role: "Vertriebsspezialist",
      phone: "+48 452 432 315",
      email: "p.kozolub@gremi.pl",
      accentClass: "text-[#f03c64] hover:text-[#f77828]",
    },
  ],
  zh: [
    {
      name: "BARTEK JACOŃ",
      role: "高级销售专员",
      phone: "+48 723 999 099",
      email: "b.jacon@gremi.pl",
      accentClass: "text-[#f77828] hover:text-[#f03c64]",
    },
    {
      name: "PIOTR KOZOŁUB",
      role: "销售专员",
      phone: "+48 452 432 315",
      email: "p.kozolub@gremi.pl",
      accentClass: "text-[#f03c64] hover:text-[#f77828]",
    },
  ],
};

type DomeContent = {
  title: string;
  bullets: string[];
  /** Wyróżnik marketingowy ponad parametrami technicznymi (na razie tylko K3).
      Osobne pole, a nie kolejny bullet — DOME_FEATURE_INDEXES trzyma w tablicę
      bullets twarde indeksy, więc dopisanie pozycji przesunęłoby chipy. */
  highlight?: string;
};

const DOMES: Record<
  Locale,
  {
    k3: DomeContent;
    k7: DomeContent;
    k10: DomeContent;
    k12: DomeContent;
  }
> = {
  pl: {
    k3: {
      title: "Kopuła K3",
      highlight:
        "Obsługujemy tu największe Kino 360° w Europie. Możesz wykorzystać je podczas swojego wydarzenia.",
      bullets: [
        "Powierzchnia 2 000 m²",
        "Wysokość 15 m",
        "Przyłącza elektryczne do 1 MW",
        "Garderoby z prysznicami",
        "Klimatyzacja",
        "Dwie bramy 4m × 4,5m (swobodny przejazd TIR)",
        "Zapytaj o warunki montażu scenografii",
      ],
    },
    k7: {
      title: "Kopuła K7",
      bullets: [
        "Powierzchnia projekcyjna 10.2 × 4.2 m",
        "Projektor 4K",
        "Certyfikat Dolby Premier",
        "76 foteli",
      ],
    },
    k10: {
      title: "Kopuła K10",
      bullets: ["Kopuły dwupoziomowe", "Powierzchnia 600 m²"],
    },
    k12: {
      title: "Kopuła K12",
      bullets: ["Kopuły dwupoziomowe", "Powierzchnia 600 m²"],
    },
  },
  en: {
    k3: {
      title: "Dome K3",
      highlight:
        "Home to the largest 360° cinema in Europe. You can use it during your event.",
      bullets: [
        "Floor area 2,000 m²",
        "Height 15 m",
        "Electrical connections up to 1 MW",
        "Dressing rooms with showers",
        "Air conditioning",
        "Two gates 4 m × 4.5 m (truck drive-through)",
        "Ask about set-building conditions",
      ],
    },
    k7: {
      title: "Dome K7",
      bullets: [
        "Projection surface 10.2 × 4.2 m",
        "4K projector",
        "Dolby Premier certificate",
        "76 seats",
      ],
    },
    k10: {
      title: "Dome K10",
      bullets: ["Two-level domes", "Floor area 600 m²"],
    },
    k12: {
      title: "Dome K12",
      bullets: ["Two-level domes", "Floor area 600 m²"],
    },
  },
  pt: {
    k3: {
      title: "Cúpula K3",
      highlight:
        "Acolhe o maior cinema 360° da Europa. Pode utilizá-lo durante o seu evento.",
      bullets: [
        "Área 2 000 m²",
        "Altura 15 m",
        "Ligações elétricas até 1 MW",
        "Camarins com chuveiros",
        "Ar condicionado",
        "Duas portas 4 m × 4,5 m (passagem de camiões)",
        "Pergunte pelas condições de montagem de cenografia",
      ],
    },
    k7: {
      title: "Cúpula K7",
      bullets: [
        "Superfície de projeção 10,2 × 4,2 m",
        "Projetor 4K",
        "Certificado Dolby Premier",
        "76 lugares",
      ],
    },
    k10: {
      title: "Cúpula K10",
      bullets: ["Cúpulas de dois níveis", "Área 600 m²"],
    },
    k12: {
      title: "Cúpula K12",
      bullets: ["Cúpulas de dois níveis", "Área 600 m²"],
    },
  },
  de: {
    k3: {
      title: "Kuppel K3",
      highlight:
        "Hier steht das größte 360°-Kino Europas. Sie können es für Ihre Veranstaltung nutzen.",
      bullets: [
        "Fläche 2.000 m²",
        "Höhe 15 m",
        "Stromanschlüsse bis 1 MW",
        "Garderoben mit Duschen",
        "Klimaanlage",
        "Zwei Tore 4 m × 4,5 m (freie Lkw-Durchfahrt)",
        "Fragen Sie nach den Bedingungen für den Bühnenaufbau",
      ],
    },
    k7: {
      title: "Kuppel K7",
      bullets: [
        "Projektionsfläche 10,2 × 4,2 m",
        "4K-Projektor",
        "Dolby-Premier-Zertifikat",
        "76 Sitzplätze",
      ],
    },
    k10: {
      title: "Kuppel K10",
      bullets: ["Zweigeschossige Kuppeln", "Fläche 600 m²"],
    },
    k12: {
      title: "Kuppel K12",
      bullets: ["Zweigeschossige Kuppeln", "Fläche 600 m²"],
    },
  },
  zh: {
    k3: {
      title: "K3 穹顶",
      highlight:
        "这里拥有全欧洲最大的 360° 影院，可用于您的活动。",
      bullets: [
        "面积 2000 m²",
        "高度 15 m",
        "供电接口最高 1 MW",
        "带淋浴的化妆间",
        "空调系统",
        "两扇 4 m × 4.5 m 大门（货车可自由通行）",
        "欢迎咨询舞美搭建条件",
      ],
    },
    k7: {
      title: "K7 穹顶",
      bullets: [
        "投影面 10.2 × 4.2 m",
        "4K 投影机",
        "Dolby Premier 认证",
        "76 个座位",
      ],
    },
    k10: {
      title: "K10 穹顶",
      bullets: ["双层穹顶", "面积 600 m²"],
    },
    k12: {
      title: "K12 穹顶",
      bullets: ["双层穹顶", "面积 600 m²"],
    },
  },
};

// ===== Komponenty pomocnicze: EventVideo =====
interface EventVideoProps {
  src: string;
  srcWebm?: string;
  poster?: string;
  className?: string;
  loadingLabel: string;
  fallbackText: string;
}

function EventVideo({
  src,
  srcWebm,
  poster,
  className,
  loadingLabel,
  fallbackText,
}: EventVideoProps) {
  return (
    <div className={`relative h-56 md:h-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/20 ${className ?? ""}`}>
      <AdaptiveVideo
        mp4Src={src}
        webmSrc={srcWebm}
        poster={poster ?? "/wydarzenia/AP_wydarzenia_poster.webp"}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        fallbackText={fallbackText}
        loadingLabel={loadingLabel}
        showLoadingState
        rootMargin="180px 0px"
        preferPosterOnLowPower
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/70"
        aria-hidden
      />
    </div>
  );
}

interface VideoTileProps {
  item: VideoItem;
  playLabel: string;
}

function VideoTile({ item, playLabel }: VideoTileProps) {
  const videoHref = item.src.includes("/embed/")
    ? item.src.replace("/embed/", "/watch?v=")
    : item.src;

  return (
    <a
      href={videoHref}
      target="_blank"
      rel="noopener noreferrer"
      className="events-video-tile ap-interactive-surface group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(247,120,40,0.7)]"
      aria-label={`${playLabel}: ${item.title}`}
    >
      <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-black/50">
        {/* Kadr jest dekoracyjny: link ma aria-label „Odtwórz: <tytuł>", a tytuł
            stoi też w treści kafelka — alt powtarzałby go po raz trzeci. */}
        <Image
          src={item.poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <div className="events-video-tile-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <span className="events-video-play-badge absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
          ▶ {playLabel}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-sm sm:text-base font-semibold text-white">{item.title}</p>
        <p className="mt-1 text-xs sm:text-sm text-white/75">{item.body}</p>
      </div>
    </a>
  );
}


/* Mapa kompleksu — GŁÓWNE wejście w wybór przestrzeni. Kliknięcie pinu wybiera
   kopułę i pokazuje przy niej kompaktowy podgląd; klik NIE przewija strony,
   bo mapa ma zostać w kadrze. Do pełnej specyfikacji prowadzi dopiero CTA.

   Karta podglądu jest RODZEŃSTWEM mapy, nie jej dzieckiem: kontener mapy ma
   overflow-hidden, który uciąłby ją przy krawędzi. Pozycję wylicza CSS z
   procentów hotspotu (--pin-x/--pin-y), bez getBoundingClientRect — strona jest
   "use client" przy output:"export", więc pomiar DOM-u przy pierwszym malowaniu
   groziłby rozjazdem hydratacji. */
function ComplexMap({
  activeDome,
  onSelect,
  sectionUi,
  domes,
  locale,
  detailsCta,
  previewOpen,
  onClosePreview,
  onShowDetails,
}: {
  activeDome: DomeKey;
  onSelect: (dome: DomeKey) => void;
  sectionUi: (typeof SECTION_UI)[Locale];
  domes: (typeof DOMES)[Locale];
  locale: Locale;
  detailsCta: string;
  previewOpen: boolean;
  onClosePreview: () => void;
  onShowDetails: () => void;
}) {
  const activeSpot = DOME_MAP_HOTSPOTS.find((spot) => spot.dome === activeDome);
  const zoomRef = useRef<HTMLDialogElement | null>(null);
  const zoomScrollRef = useRef<HTMLDivElement | null>(null);
  const zoomScrollLock = useRef<string | null>(null);

  /* Powiększona mapa na telefonie. Natywny <dialog> z showModal() daje za darmo
     pułapkę fokusu, zamykanie Escape/gestem wstecz i powrót fokusu na przycisk.
     Mapa ma tam ~56 rem szerokości i przewija się palcem; startujemy wycentrowani
     na aktualnie wybranej kopule. */
  const openZoom = () => {
    const dialog = zoomRef.current;
    if (!dialog || dialog.open) return;
    zoomScrollLock.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    requestAnimationFrame(() => {
      const scroller = zoomScrollRef.current;
      const spot = activeSpot ?? DOME_MAP_HOTSPOTS[0];
      if (!scroller) return;
      scroller.scrollLeft = (spot.x / 100) * scroller.scrollWidth - scroller.clientWidth / 2;
      scroller.scrollTop = (spot.y / 100) * scroller.scrollHeight - scroller.clientHeight / 2;
    });
  };

  const closeZoom = () => zoomRef.current?.close();

  const onZoomClosed = () => {
    document.documentElement.style.overflow = zoomScrollLock.current ?? "";
    zoomScrollLock.current = null;
  };

  // Gdyby komponent zniknął przy otwartej mapie, nie zostawiamy zablokowanej strony.
  useEffect(() => () => {
    if (zoomScrollLock.current !== null) document.documentElement.style.overflow = zoomScrollLock.current;
  }, []);

  return (
    <div className="events-map-shell relative">
      <div
        className="events-map relative aspect-[1784/882] overflow-hidden rounded-2xl"
        role="group"
        aria-label={sectionUi.domesMapGroupLabel}
      >
        {/* Zwykły <picture>, nie next/image: eksport statyczny ma
            images.unoptimized, więc next/image i tak nie zrobiłby wariantów,
            a telefon pobierał pełne 1784 px (135 kB) na kadr o szerokości
            ok. 374 px. Wersja 900 px (49 kB) jest tym samym zdjęciem w tym
            samym kadrze — przy podwójnej gęstości pikseli nadal z zapasem.
            Widok po powiększeniu (niżej) korzysta z pełnej rozdzielczości. */}
        <picture>
          <source media="(max-width: 767px)" srcSet="/wydarzenia/kopuly-event-900.webp" />
          <img
            src="/wydarzenia/kopuly-event.webp"
            alt={sectionUi.domesMapAlt}
            width={1784}
            height={882}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,transparent_0%,transparent_44%,rgba(6,10,24,0.18)_72%,rgba(6,10,24,0.34)_100%)]" />
        {DOME_MAP_HOTSPOTS.map((spot) => {
          const isActive = activeDome === spot.dome;
          const headline = domeMetrics(spot.dome, locale)[0];
          return (
            <button
              key={spot.id}
              type="button"
              className={`events-map-hotspot absolute aspect-square cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b16] ${
                isActive ? "is-active z-20" : "z-10"
              }`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.size}%` }}
              aria-label={`${sectionUi.domesMapSelectLabel}: ${spot.label}`}
              aria-pressed={isActive}
              aria-controls={previewOpen ? DOME_PREVIEW_ID : undefined}
              onClick={() => onSelect(spot.dome)}
            >
              <span className="events-map-ring absolute inset-0 rounded-full" />
              {/* Oznaczenie kopuły naniesione na plan — bez niego widzący
                  użytkownik musiałby zgadywać, który krąg to która kopuła.
                  Nazwę niesie aria-label przycisku, więc etykieta jest ukryta
                  przed czytnikiem, żeby nie dublować odczytu. */}
              <span aria-hidden="true" className="events-map-pin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full">
                {spot.label}
                {headline ? <span className="events-map-pin-metric">{headline.value}</span> : null}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={openZoom}
          aria-label={sectionUi.domesMapZoomOpen}
          title={sectionUi.domesMapZoomOpen}
          className="events-map-zoom-open absolute right-2 top-2 z-30 grid place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff] md:hidden"
        >
          {/* Sama ikonka w prawym górnym rogu — tam na planie nie ma pinów
              (K3, najbliższy, stoi ok. 30 px niżej). Nazwę niesie aria-label. */}
          <SolarIcon name="arrow-up-right" size="1rem" />
        </button>
      </div>

      <dialog
        ref={zoomRef}
        className="events-map-zoom"
        aria-labelledby="events-map-zoom-title"
        onClose={onZoomClosed}
      >
        <div className="events-map-zoom-head">
          <div className="min-w-0">
            <p id="events-map-zoom-title" className="text-base font-bold leading-tight text-white">
              {sectionUi.domesMapZoomTitle}
            </p>
            <p className="mt-1 text-[0.78rem] leading-snug text-white/70">{sectionUi.domesMapZoomHint}</p>
          </div>
          <button
            type="button"
            onClick={closeZoom}
            aria-label={sectionUi.domesMapZoomClose}
            className="events-map-zoom-close shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff]"
          >
            <SolarIcon name="close" size="1.1rem" />
          </button>
        </div>
        <div ref={zoomScrollRef} className="events-map-zoom-scroller">
          <div className="events-map-zoom-canvas relative aspect-[1784/882]">
            <Image
              src="/wydarzenia/kopuly-event.webp"
              alt={sectionUi.domesMapAlt}
              fill
              sizes="(max-width: 767px) 180vh, 56rem"
              className="object-cover"
              loading="lazy"
              decoding="async"
            />
            {DOME_MAP_HOTSPOTS.map((spot) => {
              const isActive = activeDome === spot.dome;
              return (
                <button
                  key={spot.id}
                  type="button"
                  className={`events-map-hotspot absolute aspect-square cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b16] ${
                    isActive ? "is-active z-20" : "z-10"
                  }`}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.size}%` }}
                  aria-label={`${sectionUi.domesMapSelectLabel}: ${spot.label}`}
                  aria-pressed={isActive}
                  onClick={() => {
                    onSelect(spot.dome);
                    closeZoom();
                  }}
                >
                  <span className="events-map-ring absolute inset-0 rounded-full" />
                  <span aria-hidden="true" className="events-map-pin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full">
                    {spot.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </dialog>

      {previewOpen && activeSpot ? (
        <DomePreview
          spot={activeSpot}
          dome={domes[activeSpot.dome]}
          locale={locale}
          sectionUi={sectionUi}
          detailsCta={detailsCta}
          onClose={onClosePreview}
          onShowDetails={onShowDetails}
        />
      ) : null}
    </div>
  );
}

/* Szybki podgląd wybranej kopuły — tytuł, dwie najważniejsze liczby i CTA.
   Pełna specyfikacja zostaje w SpacePanel; to są dwa różne poziomy informacji.

   Od 1024 px karta kotwiczy się przy pinie (nad nim albo pod, zależnie od tego,
   w której połowie mapy pin leży). W 768–1023 px mapa jest za niska (~364 px),
   żeby karta zmieściła się nad/pod pinem, więc siada przy dolnej krawędzi.
   Poniżej 768 px mapa ma ok. 358×177 px — karta nie ma tam czego zasłaniać ani
   gdzie się zmieścić, więc staje się panelem w normalnym flow pod mapą. */
function DomePreview({
  spot,
  dome,
  locale,
  sectionUi,
  detailsCta,
  onClose,
  onShowDetails,
}: {
  spot: DomeMapHotspot;
  dome: DomeContent;
  locale: Locale;
  sectionUi: (typeof SECTION_UI)[Locale];
  detailsCta: string;
  onClose: () => void;
  onShowDetails: () => void;
}) {
  const metrics = domeMetrics(spot.dome, locale).slice(0, 2);
  const labels = METRIC_LABELS[locale] ?? METRIC_LABELS.pl;

  return (
    <div
      id={DOME_PREVIEW_ID}
      className={`events-map-preview ap-glass ${spot.y <= 45 ? "is-below" : "is-above"} ${
        spot.x < 50 ? "is-side-right" : "is-side-left"
      }`}
      style={
        {
          "--pin-x": `${spot.x}%`,
          "--pin-y": `${spot.y}%`,
          "--pin-half": `${((spot.size / 2) * MAP_ASPECT).toFixed(3)}%`,
        } as CSSProperties
      }
      aria-live="polite"
      aria-label={sectionUi.domesMapPreviewLabel}
    >
      <div className="flex items-start gap-3">
        <span className="events-map-preview-thumb relative shrink-0 overflow-hidden">
          <Image
            src={DOME_IMAGE_BY_KEY[spot.dome]}
            alt=""
            fill
            className="object-cover"
            loading="lazy"
            decoding="async"
          />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-tight text-white sm:text-lg">{dome.title}</h3>
          <ul className="mt-1.5 space-y-1">
            {metrics.map((metric) => (
              <li key={metric.labelKey} className="flex flex-wrap items-baseline gap-x-1.5 text-[0.8rem] leading-snug">
                <span className="events-map-preview-value font-bold">
                  {metric.prefix ? `${UP_TO_LABEL[locale]} ` : ""}
                  {metric.value}
                </span>
                <span className="text-white/60">{labels[metric.labelKey]}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={sectionUi.domesMapPreviewClose}
          className="events-map-preview-close shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff]"
        >
          <SolarIcon name="close" size="0.85em" />
        </button>
      </div>
      <button
        type="button"
        onClick={onShowDetails}
        className="events-map-preview-cta mt-3 flex w-full items-center justify-center gap-2 rounded-xl font-semibold uppercase tracking-[0.14em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b16]"
      >
        {detailsCta}
        <SolarIcon name="arrow-right" size="1em" />
      </button>
      <span className="events-map-preview-arrow" aria-hidden="true" />
    </div>
  );
}
/* Licznik liczb w kafelkach „w liczbach". Komponent jest LOKALNY dla
   /wydarzenia — wcześniej stał we wspólnym pliku, ale korzystała z niego także
   /o-alvernia-planet, więc każda zmiana tutaj przeciekała na tamtą stronę.
   Kopia w obrębie tej trasy pozwala poprawić parsowanie i obsłużyć de/zh, nie
   ruszając niczego poza landingiem eventowym.

   Wartość podaje się gotowym napisem („2 000 m²", „1000+", „30 min");
   komponent wyłuskuje z niego liczbę, a resztę zostawia bez zmian. */
const NUMBER_LOCALES: Record<Locale, string> = {
  pl: "pl-PL",
  en: "en-US",
  pt: "pt-PT",
  de: "de-DE",
  zh: "zh-CN",
};

const METRIC_ANIMATION_MS = 1400;

// useLayoutEffect zgłasza ostrzeżenie przy renderze po stronie serwera, a tam
// i tak nie ma czego mierzyć — na serwerze schodzimy więc do useEffect.
const useIzomorficznyLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function AnimatedMetricValue({
  value,
  locale,
  className,
  replayToken = 0,
  onFinished,
}: {
  value: string;
  locale: Locale;
  className?: string;
  /** Zmiana wartości uruchamia odliczanie od zera jeszcze raz (klik w kafelek). */
  replayToken?: number;
  /** Wołane po zakończeniu animacji — dopiero wtedy kafelek da się kliknąć. */
  onFinished?: () => void;
}) {
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  // Ref zamiast zależności efektu: nowa funkcja przy każdym renderze rodzica
  // restartowałaby odliczanie w trakcie.
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  });

  // Grupa 1 = to, co przed liczbą („do "), 2 = sama liczba (może mieć spacje
  // i separatory: „2 000"), 3 = ogon z jednostką („ m²", „+", „ min").
  const parsed = useMemo(() => {
    const match = value.match(/^(.*?)(\d[\d\s\u00a0.,]*\d|\d)(.*)$/);
    if (!match) return null;
    const [, prefix, digits, suffix] = match;
    return { prefix, target: Number(digits.replace(/\D/g, "")), suffix };
  }, [value]);

  // Start od WARTOŚCI DOCELOWEJ, nie od zera. Statyczny HTML (a więc też to, co
  // widzi użytkownik przed uruchomieniem JavaScriptu, i to, co indeksuje Google)
  // pokazywał wcześniej „0 kopuł", „do 0 m²", „0 min" — sekcja z liczbami czytała
  // się jak niezaładowana. Zerujemy dopiero na kliencie, w useLayoutEffect, czyli
  // PRZED pierwszym malowaniem — dzięki temu licznik nadal dolicza od zera, ale
  // nigdzie nie widać przeskoku z wartości docelowej na 0.
  /* Formatowanie trzymamy w jednym miejscu: używa go i pierwsze renderowanie,
     i pętla animacji. Intl tworzymy raz — w pętli po klatce kosztował tyle,
     co reszta odliczania razem wzięta. */
  const format = useMemo(() => {
    const formatter = new Intl.NumberFormat(NUMBER_LOCALES[locale] ?? "en-US");
    return (liczba: number) => `${parsed?.prefix ?? ""}${formatter.format(liczba)}${parsed?.suffix ?? ""}`;
  }, [locale, parsed]);

  /* Pętla odliczania NIE przechodzi przez stan Reacta — wpisuje tekst wprost
     do elementu. Wcześniej każda klatka była osobnym przerysowaniem komponentu
     (zmierzone: ok. 180 zatwierdzeń Reacta i 450–490 ms pracy wątku głównego
     na sekcję), a widocznie zmienia się tylko kilkanaście napisów.
     Zapis pomijamy, gdy sformatowany tekst nie różni się od poprzedniego. */
  const ostatniTekst = useRef<string | null>(null);
  const pisz = (liczba: number) => {
    const el = valueRef.current;
    if (!el) return;
    const tekst = format(liczba);
    if (tekst === ostatniTekst.current) return;
    ostatniTekst.current = tekst;
    /* Podmieniamy DANE istniejącego węzła tekstowego, a nie cały textContent:
       ten drugi usuwa węzeł i wstawia nowy, przez co przeglądarka przelicza
       selektory :has() na całym dokumencie. Zmierzone przy przewijaniu:
       154 unieważnienia „Affected by :has()" na sekcję i +9 ms stylu. */
    const wezel = el.firstChild;
    if (wezel && wezel.nodeType === Node.TEXT_NODE) wezel.nodeValue = tekst;
    else el.textContent = tekst;
  };

  useIzomorficznyLayoutEffect(() => {
    if (!parsed || parsed.target <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    pisz(0);
  }, [parsed, format]);

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
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !parsed || parsed.target <= 0) return;

    // Przy „ogranicz ruch" liczba ma po prostu stać na wartości docelowej.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pisz(parsed.target);
      return;
    }

    let frame = 0;
    const start = performance.now();
    /* Liczba zmienia się nie częściej niż co ~32 ms (ok. 30 razy na sekundę).
       Przy 60 klatkach co druga i tak pokazywałaby wartość nie do odróżnienia,
       a każdy zapis tekstu unieważnia styl i układ kafelka. Zmierzone na
       telefonie: przeliczanie stylów przy przewijaniu 79 ms → 50 ms. */
    let ostatniZapis = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / METRIC_ANIMATION_MS, 1);
      if (progress === 1 || now - ostatniZapis >= 32) {
        ostatniZapis = now;
        const eased = 1 - Math.pow(1 - progress, 3);
        pisz(Math.round(parsed.target * eased));
      }
      if (progress < 1) frame = requestAnimationFrame(tick);
      else onFinishedRef.current?.();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, parsed, replayToken, format]);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  /* Pierwsze renderowanie (także statyczny HTML dla wyszukiwarek) pokazuje
     wartość docelową; od tej chwili tekstem zarządza pętla powyżej. */
  return (
    <span ref={valueRef} className={className}>
      {format(parsed.target)}
    </span>
  );
}

const ICON_ANIMATION_MS = 1200;

const canAnimateIcon = (el: HTMLElement) =>
  typeof el.animate === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Ikona w kafelku bez liczby (gwiazdka). Zamiast odliczania „wskakuje" z obrotem
   i krótką poświatą w kolorze kafelka — w tym samym rytmie co liczby: rusza, gdy
   kafelek wjedzie w kadr, a po zakończeniu da się ją odtworzyć kliknięciem.
   Web Animations API zamiast klasy CSS: ponowne odtworzenie to po prostu kolejne
   animate(), bez zdejmowania i dokładania klasy. Poświata (drop-shadow) jest na
   opakowaniu, bo sama ikona to maska CSS, która wycięłaby cień. */
function AnimatedTileIcon({
  name,
  replayToken = 0,
  onFinished,
}: {
  name: SolarIconName;
  replayToken?: number;
  onFinished?: () => void;
}) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  });

  // Jak zerowanie liczb: przed pierwszym malowaniem na kliencie gwiazdka czeka
  // ukryta, aż kafelek wjedzie w kadr. Statyczny HTML i „ogranicz ruch" pokazują
  // ją normalnie.
  useIzomorficznyLayoutEffect(() => {
    const el = wrapRef.current;
    if (el && canAnimateIcon(el)) el.style.opacity = "0";
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!isVisible || !el) return;
    el.style.opacity = "";
    if (!canAnimateIcon(el)) return;

    const glow = getComputedStyle(el).color;
    const none = "drop-shadow(0 0 0 rgba(0, 0, 0, 0))";
    const animation = el.animate(
      [
        { transform: "scale(0.3) rotate(-144deg)", opacity: 0, filter: none },
        { transform: "scale(1.2) rotate(10deg)", opacity: 1, filter: `drop-shadow(0 0 14px ${glow})`, offset: 0.55 },
        { transform: "scale(0.94) rotate(-4deg)", opacity: 1, filter: `drop-shadow(0 0 8px ${glow})`, offset: 0.78 },
        { transform: "scale(1) rotate(0deg)", opacity: 1, filter: none },
      ],
      { duration: ICON_ANIMATION_MS, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    animation.onfinish = () => onFinishedRef.current?.();
    return () => animation.cancel();
  }, [isVisible, replayToken]);

  return (
    <span ref={wrapRef} className="events-tile-accent-text inline-flex">
      <SolarIcon name={name} size="2.25rem" />
    </span>
  );
}

/* Kafelek „w liczbach". Po zakończeniu pierwszej animacji (odliczania albo
   wskoczenia gwiazdki) kliknięcie kafelka odtwarza ją jeszcze raz; w trakcie
   animacji klik nic nie robi. W trybie „ogranicz ruch" animacji nie ma, więc
   kafelki nie są klikalne. */
function StatTile({ item, index, locale }: { item: StatItem; index: number; locale: Locale }) {
  const [replayToken, setReplayToken] = useState(0);
  const [replayable, setReplayable] = useState(false);
  const canReplay = replayable;

  const replay = () => {
    if (!canReplay) return;
    setReplayable(false);
    setReplayToken((token) => token + 1);
  };

  return (
    <article
      onClick={canReplay ? replay : undefined}
      className={`events-stat-tile ap-tile ap-tile-sm relative h-full overflow-hidden px-3 py-5 text-center sm:px-5 sm:py-6 ${
        TILE_TONES[index % TILE_TONES.length]
      }${canReplay ? " is-replayable" : ""}`}
    >
      <div className="events-tile-glow" aria-hidden />
      {/* Stała wysokość wiersza z liczbą/ikoną trzyma podpisy w jednej
          linii bazowej we wszystkich kafelkach, mimo różnej treści. */}
      <div className="relative flex h-full flex-col items-center">
        <p className="flex h-11 items-center justify-center gap-1.5 sm:h-13">
          {item.icon ? (
            <AnimatedTileIcon
              name={item.icon}
              replayToken={replayToken}
              onFinished={() => setReplayable(true)}
            />
          ) : (
            <>
              {item.prefix ? (
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/55 sm:text-[0.7rem]">
                  {item.prefix}
                </span>
              ) : null}
              <span className="events-tile-accent-text whitespace-nowrap text-[1.35rem] font-extrabold leading-none sm:text-[1.9rem] lg:text-4xl">
                <AnimatedMetricValue
                  value={item.value ?? ""}
                  locale={locale}
                  className="tabular-nums"
                  replayToken={replayToken}
                  onFinished={() => setReplayable(true)}
                />
              </span>
            </>
          )}
        </p>
        <p className="mt-2.5 text-[0.82rem] leading-snug text-white/85 sm:text-sm">
          {item.label}
        </p>
      </div>
    </article>
  );
}

function StatsGrid({ items, locale }: { items: StatItem[]; locale: Locale }) {
  return (
    <ul className="ap-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {items.map((item, index) => (
        <li key={item.label} className="min-w-0">
          <StatTile item={item} index={index} locale={locale} />
        </li>
      ))}
    </ul>
  );
}

/* ==========================================================================
   SEKCJE LANDING PAGE'A
   Układ celowo NIE opiera się na kartach — sekcje oddziela rytm pionowy,
   cienka linia i duża typografia. Karty zostają tam, gdzie niosą treść
   (formaty, przestrzenie, zespół), a nie jako opakowanie każdego bloku.
   ========================================================================== */

/* Nagłówek sekcji — bez nadtytułu (małe wersaliki typu „FORMATY" nad tytułem
   zostały usunięte na prośbę właściciela). */
/* Fragment nagłówka w kolorze akcentu zapisujemy w treści gwiazdkami:
   „Alvernia Planet w *liczbach*". Dzięki temu wyróżnienie jest częścią tłumaczenia
   (w każdym języku wypada na innym słowie), a nie sztywnym podziałem w kodzie.
   Kolor bierze się ze zmiennej --events-accent-rgb — w sekcji „Miejsce, które
   pracuje…" steruje nią suwak, w pozostałych zostaje domyślny błękit. */
function tytulZAkcentem(tekst: string) {
  return tekst.split("*").map((fragment, index) =>
    index % 2 === 1 ? (
      <span key={`${fragment}-${index}`} className="events-accent">
        {fragment}
      </span>
    ) : (
      fragment
    )
  );
}

function SectionHeader({
  title,
  lead,
  align = "left",
  className = "",
}: {
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  /* Wariant wyśrodkowany jest szerszy niż 3xl, żeby ręcznie złamany tytuł mapy
     mieścił pierwszy wiersz w całości i nie zawijał się na trzy. */
  return (
    <header className={`${centered ? "mx-auto max-w-4xl text-center" : "max-w-4xl"} ${className}`}>
      {/* whitespace-pre-line: tytuł może wymusić złamanie wiersza znakiem \n
          w treści (tak łamie się nagłówek mapy). Tytuły bez \n zawijają się
          normalnie — pre-line nie zmienia ich zachowania. */}
      <h2 className="events-display whitespace-pre-line text-[clamp(1.9rem,5.2vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-0.022em] text-white">
        {tytulZAkcentem(title)}
      </h2>
      {lead ? (
        <p className={`mt-5 text-[0.98rem] leading-relaxed text-white/70 sm:text-lg ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {lead}
        </p>
      ) : null}
    </header>
  );
}

/* Ikony przewag — pozycje w why.items są równoległe we wszystkich językach:
   przestrzeń, skala, produkcja, wsparcie. */
/* Ikony idą po kolejności kafelków, więc zmiana kolejności treści w landingCopy
   wymaga tej samej zmiany tutaj — inaczej ikona rozjedzie się z tytułem. */
const WHY_ICONS: SolarIconName[] = ["planet", "clapperboard", "city", "phone"];

/* Dlaczego Alvernia Planet — cztery przewagi jako niska lista kafelków jeden
   pod drugim: ikona obok bloku tekstu (tytuł + opis), wszystkie w jednym kolorze.
   Wymiary ikony i tekstu siedzą w CSS (.events-why-*), bo rozmiar ikony jest
   liczony z tych samych zmiennych co wysokość tekstu.
   Bez strzałki „>" — kafelki nigdzie nie prowadzą, więc strzałka obiecywałaby
   kliknięcie, które nic nie robi. Na desktopie lista stoi obok wideo; kolumny
   muszą się rozciągać (bez items-center), bo wideo ma h-full i bez tego
   zwija się do 0 px. */
/* Barwy ikon: suwak przechodzi PŁYNNIE przez trzy punkty — czerwony z palety
   marki, obecny niebieski na środku i pomarańczowy z palety. Wartości pośrednie
   są mieszane liniowo, więc suwak daje pełną skalę odcieni, a nie trzy stany. */
const WHY_ICON_STOPS: [number, number, number][] = [
  [240, 60, 100],
  [126, 246, 255],
  [247, 120, 40],
];

function mieszajKolor(procent: number): string {
  const pozycja = (Math.min(100, Math.max(0, procent)) / 100) * (WHY_ICON_STOPS.length - 1);
  const i = Math.min(Math.floor(pozycja), WHY_ICON_STOPS.length - 2);
  const t = pozycja - i;
  const od = WHY_ICON_STOPS[i];
  const doo = WHY_ICON_STOPS[i + 1];
  return od.map((kanal, k) => Math.round(kanal + (doo[k] - kanal) * t)).join(" ");
}

/* Obrys kopuły jaśnieje ku górze i ciemnieje przy podstawie. Przy suwaku
   koloru wyliczamy te dwa odcienie z aktualnej barwy — tą samą drogą, co samą
   barwę, więc nie trzeba color-mix() ani dodatkowych deklaracji w CSS. */
function zmieszajZ(rgb: string, docelowy: [number, number, number], ile: number): string {
  const kanaly = rgb.split(" ").map(Number);
  return kanaly.map((k, i) => Math.round(k + (docelowy[i] - k) * ile)).join(" ");
}

function WhyEditorial({
  why,
  locale,
  loadingLabel,
  fallbackText,
  ui,
}: {
  why: LandingCopy["why"];
  locale: Locale;
  loadingLabel: string;
  fallbackText: string;
  ui: { colorLabel: string; red: string; blue: string; orange: string };
}) {
  /* 50 = środek skali, czyli kolor, który ikony miały do tej pory. */
  const [kolor, setKolor] = useState(50);
  const rgb = mieszajKolor(kolor);
  const kolorId = useId();

  return (
    <div className="events-why-shell" style={{ "--events-accent-rgb": rgb } as CSSProperties}>
      <SectionHeader title={why.title} align="center" />

      <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
        <div className="min-w-0">
        <ul role="list" lang={locale} className="ap-stagger events-why-list">
          {why.items.map((item, index) => (
            <li key={item.title} className="events-why-tile">
              <span className="events-why-tile-icon" aria-hidden="true">
                <SolarIcon name={WHY_ICONS[index] ?? "star"} size="100%" />
              </span>
              <div className="events-why-tile-text">
                <h3 className="events-why-tile-title">{item.title}</h3>
                <p className="events-why-tile-body">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Kolor ikon — sam suwak, bez podpisu i próbek. Nazwa dla czytnika
            ekranu siedzi w aria-label, więc nic nie zajmuje miejsca na ekranie. */}
        <div className="events-why-color">
          <div
            className="events-dome-slider events-dome-slider--color"
            style={
              {
                "--dome-progress": kolor / 100,
                "--events-accent-rgb": rgb,
                "--dome-light-rgb": zmieszajZ(rgb, [255, 255, 255], 0.55),
                "--dome-dark-rgb": zmieszajZ(rgb, [6, 12, 24], 0.42),
              } as CSSProperties
            }
          >
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={kolor}
              onChange={(event) => setKolor(Number(event.target.value))}
              aria-label={ui.colorLabel}
              className="events-dome-slider-input"
            />
            <span className="events-dome-slider-visual" aria-hidden="true">
              <span className="events-dome-slider-track" />
              {/* Trzy punkty skali stoją dokładnie nad barwami krańcowymi
                  i środkową — w tych samych kolorach, co przyjmują ikony. */}
              <span className="events-dome-slider-stops">
                <span className="events-dome-slider-stop" />
                <span className="events-dome-slider-stop" />
                <span className="events-dome-slider-stop" />
              </span>
              <span className="events-dome-slider-handle">
                <DomeSliderHandle idPrefix={kolorId} />
              </span>
            </span>
          </div>
        </div>
        </div>
        <div className="hidden lg:block">
          <EventVideo
            src="/wydarzenia/bankiet1.mp4"
            poster={EDITORIAL_IMAGES.banquet}
            loadingLabel={loadingLabel}
            fallbackText={fallbackText}
          />
        </div>
      </div>
    </div>
  );
}

/* Ikona kategorii w szklanym kółku w prawym górnym rogu karty. Dobrane tylko
   tam, gdzie zestaw Solar ma uczciwy odpowiednik — konferencje dostają
   „document" (program wydarzenia), bo mikrofonu w zestawie nie ma. */
const FORMAT_ICON: Record<string, SolarIconName> = {
  gala: "star",
  conference: "document",
  concert: "soundwave",
  launch: "rocket",
  corporate: "buildings",
  expo: "gallery",
};

/* Wspólny mechanizm poziomych railów na /wydarzenia („Rodzaje wydarzeń"
   i „Zobacz, jak może wyglądać Twój event").

   Poniżej 1024 px karty stoją w poziomym railu. Aktywna karta zatrzymuje się
   na środku (scroll-snap center, po jednej karcie na gest), a sąsiednie są
   lekko pomniejszone i przygaszone — płynnie, proporcjonalnie do odległości od
   środka, więc zmiana karty nie „przeskakuje". Pod railem kropki (aktywna
   wydłużona) i przycisk „dalej" — widać, że jest co przewijać i ile tego jest.
   Od 1024 px wracają do siatki bez paska nawigacji.

   Rail jest regionem z tabIndex tylko wtedy, gdy faktycznie się przewija:
   bez tego byłby dla klawiatury nieosiągalny, a statyczna siatka na desktopie
   dawałaby tylko zbędny przystanek. */
function useCenteredRail(count: number, perView = 1, options?: { alwaysRail?: boolean }) {
  /* alwaysRail: rail przewija się także od 1024 px (karty przestrzeni), więc
     musi zostać osiągalny z klawiatury na każdej szerokości. */
  const alwaysRail = options?.alwaysRail ?? false;
  const railRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  /** Karta (albo strona), do której jedzie płynne przewijanie (null = brak). */
  const targetRef = useRef<number | null>(null);
  /** Ostatnio zapisane --dist dla każdej karty — żeby nie pisać tego samego. */
  const ostatnieDist = useRef<string[]>([]);
  const [active, setActive] = useState(0);
  /** Lista jest przewijanym railem (na desktopie tylko w trybie stronicowanym). */
  const [isRail, setIsRail] = useState(true);
  /* Tryb stronicowany: od 1024 px widać `perView` kart naraz, a przewijanie
     przeskakuje o cały komplet. Stan startowy `false` = to samo, co renderuje
     serwer; przełącza się przy pierwszym pomiarze. */
  const [paged, setPaged] = useState(false);
  const pageCount = perView > 1 ? Math.ceil(count / perView) : count;

  /* Przy przewijaniu (raz na klatkę): która karta jest najbliżej środka i jak
     daleko od środka są pozostałe. Odległość trafia do zmiennej --dist na <li>,
     a CSS zamienia ją na skalę i krycie — bez przeliczania layoutu. Najpierw
     wszystkie odczyty, potem zapisy, żeby nie wymuszać reflow w pętli. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const desktop = desktopQuery.matches;
      const pagedNow = desktop && perView > 1;
      const flat = desktop || reducedQuery.matches;
      setIsRail(alwaysRail || !desktop || pagedNow);
      setPaged(pagedNow);
      const railRect = rail.getBoundingClientRect();
      const center = railRect.left + railRect.width / 2;
      const distances = itemRefs.current.map((li) => {
        if (!li) return Number.POSITIVE_INFINITY;
        const rect = li.getBoundingClientRect();
        return Math.abs(rect.left + rect.width / 2 - center) / Math.max(rect.width, 1);
      });
      let nearest = 0;
      distances.forEach((distance, index) => {
        if (distance < distances[nearest]) nearest = index;
      });
      itemRefs.current.forEach((li, index) => {
        if (!li) return;
        /* Dwa miejsca po przecinku zamiast trzech i pominięcie zapisu, gdy nic
           się nie zmieniło: krok 0,01 to różnica skali 0,07%, niewidoczna gołym
           okiem, a większość klatek przestaje ruszać style w ogóle. */
        const wartosc = flat ? "0" : Math.min(distances[index], 1).toFixed(2);
        if (ostatnieDist.current[index] === wartosc) return;
        ostatnieDist.current[index] = wartosc;
        li.style.setProperty("--dist", wartosc);
      });
      /* W trybie stronicowanym aktywna jest strona, której PIERWSZA karta stoi
         najbliżej lewej krawędzi railu — nie karta na środku. */
      let current = nearest;
      if (pagedNow) {
        let best = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (let page = 0; page < pageCount; page += 1) {
          const li = itemRefs.current[page * perView];
          if (!li) continue;
          const distance = Math.abs(li.getBoundingClientRect().left - railRect.left);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = page;
          }
        }
        current = best;
      }
      if (current === targetRef.current) targetRef.current = null;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    /* Użytkownik sam złapał rail albo przewijanie się skończyło — cel nieaktualny.
       Przy okazji włączamy i wyłączamy klasę, która prosi przeglądarkę o warstwę
       kompozytora tylko na czas ruchu (stałe will-change trzymało 8 warstw
       i ok. 3,7 MB pamięci GPU przez cały czas życia strony). */
    const clearTarget = () => {
      targetRef.current = null;
      rail.classList.remove("is-moving");
    };
    const oznaczRuch = () => rail.classList.add("is-moving");
    update();
    rail.addEventListener("scroll", schedule, { passive: true });
    rail.addEventListener("scroll", oznaczRuch, { passive: true });
    rail.addEventListener("scrollend", clearTarget);
    rail.addEventListener("pointerdown", clearTarget, { passive: true });
    rail.addEventListener("wheel", clearTarget, { passive: true });
    window.addEventListener("resize", schedule);
    desktopQuery.addEventListener("change", schedule);
    reducedQuery.addEventListener("change", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", schedule);
      rail.removeEventListener("scroll", oznaczRuch);
      rail.removeEventListener("scrollend", clearTarget);
      rail.removeEventListener("pointerdown", clearTarget);
      rail.removeEventListener("wheel", clearTarget);
      window.removeEventListener("resize", schedule);
      desktopQuery.removeEventListener("change", schedule);
      reducedQuery.removeEventListener("change", schedule);
    };
  }, [count, perView, pageCount, alwaysRail]);

  const goTo = (index: number) => {
    const rail = railRef.current;
    const li = itemRefs.current[paged ? index * perView : index];
    if (!rail || !li) return;
    const railRect = rail.getBoundingClientRect();
    const rect = li.getBoundingClientRect();
    /* Stronicowany rail zrównuje pierwszą kartę strony z lewą krawędzią,
       zwykły — kartę ze środkiem railu. */
    const delta = paged
      ? rect.left - railRect.left
      : rect.left + rect.width / 2 - (railRect.left + railRect.width / 2);
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    targetRef.current = smooth && Math.abs(delta) > 1 ? index : null;
    rail.scrollTo({ left: rail.scrollLeft + delta, behavior: smooth ? "smooth" : "auto" });
  };

  /* Liczymy od karty docelowej, a nie od tej, obok której akurat przejeżdża
     animacja — inaczej szybkie kliknięcia „Dalej" giną. */
  const goNext = () => goTo(((targetRef.current ?? active) + 1) % (paged ? pageCount : count));

  const setItemRef = (index: number) => (element: HTMLLIElement | null) => {
    itemRefs.current[index] = element;
  };

  return { railRef, setItemRef, active, isRail, paged, pageCount, goTo, goNext };
}

type RailPagerLabels = { group: string; show: string; next: string };

/** Kropki + „dalej" pod railem. Domyślnie tylko poniżej 1024 px (display
    steruje CSS); karta przestrzeni i stronicowany rail „Rodzajów wydarzeń"
    pokazują je również na desktopie — przez dodatkową klasę. */
function RailPager({
  titles,
  active,
  labels,
  onSelect,
  onNext,
  className = "",
}: {
  titles: string[];
  active: number;
  labels: RailPagerLabels;
  onSelect: (index: number) => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div className={`events-rail-pager${className ? ` ${className}` : ""}`}>
      <div role="group" aria-label={labels.group} className="events-rail-dots">
        {titles.map((title, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`${labels.show}: ${title} (${index + 1}/${titles.length})`}
            aria-current={index === active ? "true" : undefined}
            className={`events-rail-dot${index === active ? " is-active" : ""}`}
          >
            <span className="events-rail-dot-mark" aria-hidden="true" />
          </button>
        ))}
      </div>
      <button type="button" onClick={onNext} aria-label={labels.next} className="events-rail-next">
        <SolarIcon name="arrow-right" size="1.1rem" />
      </button>
    </div>
  );
}

/* Uchwyt suwaka tempa: mała kopuła rysowana wektorowo — półkolista bryła
   z płaską podstawą, trzema południkami i jednym równoleżnikiem, czyli to samo,
   co widać na kopułach w Nieporazie. Rysunek jest DEKORACJĄ: cały SVG ma
   aria-hidden i pointer-events: none (w CSS), a klika się natywny input pod
   spodem. Identyfikatory gradientów biorą się z useId, żeby nie zderzyć się
   z innym SVG na stronie.

   Układ współrzędnych 32 x 20: podstawa na y = 17,6, wierzchołek na y = 2,7.
   Południki to krzywe kwadratowe, nie łuki — łatwiej utrzymać je w obrysie
   przy tak małej bryle. */
/* Zakres, krok i wartość początkowa suwaka tempa — przeniesione do stałych
   przy przebudowie wyglądu. Wartości są DOKŁADNIE te same, co wcześniej. */
const TEMPO_MIN = 25;
const TEMPO_MAX = 250;
const TEMPO_KROK = 5;
const TEMPO_MIN_DOMYSLNE = 100;

function DomeSliderHandle({ idPrefix }: { idPrefix: string }) {
  const wypelnienie = `${idPrefix}-dome-fill`;
  const obrys = `${idPrefix}-dome-stroke`;
  return (
    <svg
      className="events-dome-slider-svg"
      viewBox="0 0 32 20"
      width="32"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={wypelnienie} x1="16" y1="2.7" x2="16" y2="17.6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.34" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.07" />
        </linearGradient>
        {/* Rozjaśnienie górnej krawędzi bez neonu: obrys jaśnieje ku górze.
            Odcienie idą ze zmiennych, żeby ta sama kopuła mogła świecić
            turkusem przy tempie i kolorem wybranym suwakiem przy ikonach. */}
        <linearGradient id={obrys} x1="16" y1="2.7" x2="16" y2="17.6" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--dome-ink-top)" }} />
          <stop offset="0.5" stopColor="currentColor" />
          <stop offset="1" style={{ stopColor: "var(--dome-ink-bottom)" }} />
        </linearGradient>
      </defs>

      <path d="M2.6 17.6a13.4 14.9 0 0 1 26.8 0Z" fill={`url(#${wypelnienie})`} />

      {/* Południki to ćwiartki elipsy o tej samej półosi pionowej co bryła
          (14,7) i mniejszej poziomej (7,6) — biegną od wierzchołka DO PODSTAWY,
          a nie z powrotem do środka. Ostatnia krzywa to równoleżnik: jego końce
          siadają na obrysie, więc nie wystaje poza kopułę. */}
      <g fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.58" strokeLinecap="round">
        <path d="M16 2.9v14.7" />
        <path d="M16 2.9a7.6 14.7 0 0 0-7.6 14.7" />
        <path d="M16 2.9a7.6 14.7 0 0 1 7.6 14.7" />
        <path d="M4.5 11.4q11.5 3.4 23 0" />
      </g>

      <path
        d="M2.6 17.6a13.4 14.9 0 0 1 26.8 0"
        fill="none"
        stroke={`url(#${obrys})`}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path d="M2.4 17.6h27.2" stroke="currentColor" strokeOpacity="0.7" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

/* Pasek „Zaufali nam" — logotypy jadą w lewo bez końca.

   Mechanika: dwie identyczne kopie listy w jednym rzędzie i jedna animacja,
   która przesuwa rząd o połowę jego szerokości (czyli dokładnie o długość
   pierwszej kopii). W chwili, gdy pierwsza kopia znika za lewą krawędzią,
   druga stoi dokładnie w jej miejscu i animacja wraca do zera — pętli nie widać.
   Druga kopia jest aria-hidden, więc czytnik ekranu czyta nazwy firm raz.

   Animowany jest wyłącznie `transform`, więc ruch obsługuje kompozytor: nie
   przemalowuje strony i nie dokłada się do drgań przy przewijaniu (tą samą
   drogą idą inne nieskończone animacje na stronie). Przy „ogranicz ruch"
   pasek staje i zamienia się w zwykły, przewijany palcem rząd.

   Czas pętli rośnie z liczbą logotypów, żeby prędkość była zawsze ta sama. */
function TrustedLogos({
  items,
  label,
  ui,
}: {
  items: TrustedLogo[];
  label: string;
  ui: { speedLabel: string; slower: string; faster: string };
}) {
  const laneRef = useRef<HTMLDivElement | null>(null);
  const suwakId = useId();
  /* Tempo w procentach, żeby suwak chodził po całkowitych krokach.
     Zakres i krok BEZ ZMIAN względem poprzedniej wersji kontrolera. */
  const [tempo, setTempo] = useState(TEMPO_MIN_DOMYSLNE);
  /* Czy sekcja weszła w kadr — od tego zależy, czy logotypy w ogóle się pobiorą. */
  const [widoczne, ustawWidoczne] = useState(false);

  /* Prędkość zmieniamy przez playbackRate TRWAJĄCEJ animacji, a nie przez
     animation-duration: zmiana czasu trwania przelicza postęp i pasek
     przeskakuje, a zmiana tempa odtwarzania płynnie przyspiesza w miejscu. */
  useEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;
    const zastosuj = () => {
      for (const animacja of lane.getAnimations()) animacja.playbackRate = tempo / 100;
    };
    zastosuj();
    const klatka = requestAnimationFrame(zastosuj);
    return () => cancelAnimationFrame(klatka);
  }, [tempo]);

  /* Poza kadrem pasek stoi. Animacja transform jest tania, ale nie darmowa —
     przy przewijaniu dolnej części strony kosztowała tyle, co cała reszta
     ruchu razem wzięta, mimo że nikt jej nie widział. */
  useEffect(() => {
    const lane = laneRef.current;
    if (!lane || typeof IntersectionObserver === "undefined") return;
    const obserwator = new IntersectionObserver(
      ([wpis]) => {
        lane.classList.toggle("is-paused", !wpis.isIntersecting);
        /* Logotypy leżą w pasie szerszym od ekranu i przesuwanym transformem,
           więc przeglądarka NIGDY nie uznaje ich za „blisko widoku" i przy
           loading="lazy" nie pobiera ich wcale — pas był pusty nawet na
           szybkim łączu. Ten sam obserwator, który wstrzymuje animację poza
           kadrem, przestawia je na pobieranie natychmiastowe w chwili, gdy
           sekcja wjeżdża w kadr: pierwszy ekran nie drożeje ani o bajt,
           a logotypy w końcu docierają. */
        if (wpis.isIntersecting) ustawWidoczne(true);
      },
      { rootMargin: "120px 0px" }
    );
    obserwator.observe(lane);
    return () => obserwator.disconnect();
  }, []);

  const opis = `${(tempo / 100).toFixed(1).replace(".", ",")}×`;

  const kopia = (zapasowa: boolean) => (
    <ul
      role="list"
      aria-label={zapasowa ? undefined : label}
      aria-hidden={zapasowa ? true : undefined}
      className="events-trusted-track"
    >
      {items.map((logo) => (
        <li
          key={logo.src}
          className="events-trusted-item"
          style={logo.scale ? ({ "--logo-scale": logo.scale } as CSSProperties) : undefined}
        >
          {/* width/height z pliku trzymają proporcję, a wysokość nadaje CSS —
              dzięki temu pasek nie skacze, zanim logotyp się wczyta. */}
          <Image
            src={logo.src}
            alt={zapasowa ? "" : logo.alt}
            width={logo.width}
            height={logo.height}
            loading={widoczne ? "eager" : "lazy"}
            decoding="async"
            className={`events-trusted-logo${logo.tone === "color" ? "" : " is-white"}`}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="events-trusted"
      style={{ "--trusted-count": items.length } as CSSProperties}
    >
      <div className="events-trusted-viewport">
        <div ref={laneRef} className="events-trusted-lane">
          {kopia(false)}
          {kopia(true)}
        </div>
      </div>

      {/* Tempo przewijania. Przy „ogranicz ruch" pasek stoi, więc CSS chowa
          cały ten blok — nie ma czym sterować. */}
      <div className="events-trusted-speed">
        <label className="events-trusted-speed-label" htmlFor={suwakId}>
          {ui.speedLabel}
        </label>

        {/* Sterowanie to nadal natywny input type="range" — stąd klawiatura,
            czytnik ekranu i przeciąganie działają same z siebie. Warstwa
            widoczna (tor, podziałka, kopuła) leży POD nim i nie łapie
            wskaźnika. Pozycję kopuły liczy ta sama proporcja, po której
            przeglądarka prowadzi uchwyt: środek wędruje od połowy szerokości
            uchwytu do szerokości minus połowa — dlatego przy skrajnych
            wartościach kopuła nie wychodzi poza komponent. */}
        <div
          className="events-dome-slider"
          style={{ "--dome-progress": (tempo - TEMPO_MIN) / (TEMPO_MAX - TEMPO_MIN) } as CSSProperties}
        >
          <input
            id={suwakId}
            type="range"
            min={TEMPO_MIN}
            max={TEMPO_MAX}
            step={TEMPO_KROK}
            value={tempo}
            onChange={(event) => setTempo(Number(event.target.value))}
            aria-valuetext={opis}
            className="events-dome-slider-input"
          />
          <span className="events-dome-slider-visual" aria-hidden="true">
            <span className="events-dome-slider-track" />
            <span className="events-dome-slider-fill" />
            <span className="events-dome-slider-ticks" />
            <span className="events-dome-slider-handle">
              <DomeSliderHandle idPrefix={suwakId} />
            </span>
          </span>
        </div>

        <output htmlFor={suwakId} className="events-trusted-speed-value" aria-hidden="true">
          {opis}
        </output>
      </div>
    </div>
  );
}

/* Rodzaje wydarzeń — karty w stylu okładek: zdjęcie na całą kartę, szklana
   pigułka z numerem i ikona kategorii u góry, tytuł i opis na kadrze u dołu.

   Poniżej 1024 px wspólny rail z kartą na środku (useCenteredRail). Od 1024 px
   ten sam rail, ale stronicowany: widać 3 karty naraz, a kropki i „dalej"
   przewijają o cały komplet trzech. */
function FormatsGrid({
  items,
  categories,
  label,
  pagerLabels,
}: {
  items: LandingCopy["formats"]["items"];
  categories: typeof FORMAT_CATEGORIES;
  label: string;
  pagerLabels: RailPagerLabels;
}) {
  const total = String(categories.length).padStart(2, "0");
  const { railRef, setItemRef, active, isRail, paged, pageCount, goTo, goNext } = useCenteredRail(
    categories.length,
    FORMATS_PER_VIEW
  );

  /* Kafelki 4–6 leżą poza poziomym kadrem karuzeli, więc przy loading="lazy"
     przeglądarka nie pobiera ich nigdy — użytkownik przewijał na kolejną
     stronę i widział puste karty. Gdy karuzela wjedzie w kadr, przestawiamy
     całą szóstkę na pobieranie natychmiastowe: pierwszy ekran nie drożeje,
     a kolejne kafelki są gotowe, zanim ktoś do nich przewinie. */
  const [karuzelaWidoczna, ustawKaruzeleWidoczna] = useState(false);
  useEffect(() => {
    const el = railRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      ustawKaruzeleWidoczna(true);
      return;
    }
    const obserwator = new IntersectionObserver(
      ([wpis]) => {
        if (!wpis.isIntersecting) return;
        ustawKaruzeleWidoczna(true);
        obserwator.disconnect();
      },
      { rootMargin: "200px 0px" }
    );
    obserwator.observe(el);
    return () => obserwator.disconnect();
  }, [railRef]);
  /* Na desktopie jedna kropka = jedna strona, więc jej etykieta wymienia tytuły
     wszystkich kart, które ta strona pokazuje. */
  const pagerTitles = paged
    ? Array.from({ length: pageCount }, (_, page) =>
        categories
          .slice(page * FORMATS_PER_VIEW, page * FORMATS_PER_VIEW + FORMATS_PER_VIEW)
          .map((_, index) => items[page * FORMATS_PER_VIEW + index]?.title ?? "")
          .filter(Boolean)
          .join(", ")
      )
    : categories.map((_, index) => items[index]?.title ?? "");

  return (
    <>
      <div
        ref={railRef}
        role="region"
        aria-label={label}
        tabIndex={isRail ? 0 : undefined}
        className="events-rail events-rail-paged ap-seealso-rail -mx-4 overflow-x-auto pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171730] lg:mx-0 lg:pb-0"
      >
        {/* role="list": Safari/VoiceOver gubi rolę listy przy list-style: none. */}
        <ul role="list" className="events-rail-list flex gap-3 sm:gap-4 lg:gap-5">
          {categories.map((category, index) => {
            const copy = items[index];
            if (!copy) return null;
            return (
              <li key={category.id} ref={setItemRef(index)} className="events-rail-item shrink-0">
                <article className="events-format-card events-rail-card group relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
                  {/* Zdjęcie dekoracyjne — kartę nazywa nagłówek poniżej, więc
                      czytnik ekranu nie powtarza tytułu dwa razy. */}
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 46vw, 80vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    loading={karuzelaWidoczna ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <div className="events-format-scrim pointer-events-none absolute inset-0" />

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
                    {/* Numer karty — pozycję na liście czytnik ekranu i tak ogłasza. */}
                    <span className="events-format-pill" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                      <span className="events-format-pill-total">/ {total}</span>
                    </span>
                    <span className="events-format-icon" aria-hidden="true">
                      <SolarIcon name={FORMAT_ICON[category.id] ?? "star"} size="1.15rem" />
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 className="events-display text-[1.6rem] font-extrabold leading-[1.02] tracking-[-0.025em] text-white sm:text-[1.75rem]">
                      {copy.title}
                    </h3>
                    <p className="mt-2.5 text-[0.86rem] leading-snug text-white/80">
                      {copy.body}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      <RailPager
        className="events-rail-pager-paged"
        titles={pagerTitles}
        active={active}
        labels={pagerLabels}
        onSelect={goTo}
        onNext={goNext}
      />
    </>
  );
}

/** Realizacje — materiały wideo w tym samym railu co „Rodzaje wydarzeń"
    (poniżej 1024 px), od 1024 px siatka 3 kolumn. Pod kafelkiem nie powtarzamy
    tytułu i opisu: kafelek VideoTile ma je w sobie. */
function CasesSection({
  cases,
  videoShowcase,
  playLabel,
  pagerLabels,
}: {
  cases: LandingCopy["cases"];
  videoShowcase: { title: string; items: VideoItem[] };
  playLabel: string;
  pagerLabels: RailPagerLabels;
}) {
  const { railRef, setItemRef, active, isRail, goTo, goNext } = useCenteredRail(
    videoShowcase.items.length
  );

  return (
    <>
      <SectionHeader title={cases.title} lead={cases.lead} />
      <div
        ref={railRef}
        role="region"
        aria-label={cases.title}
        tabIndex={isRail ? 0 : undefined}
        className="events-rail ap-seealso-rail -mx-4 mt-10 overflow-x-auto pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:mx-0 lg:overflow-visible lg:pb-0"
      >
        <ul role="list" className="events-rail-list flex gap-3 sm:gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
          {videoShowcase.items.map((item, index) => (
            <li key={item.title} ref={setItemRef(index)} className="events-rail-item min-w-0 shrink-0 lg:w-auto">
              {/* Skalę railu nosi osobna warstwa: kafelek ma własny transform
                  (uniesienie przy hover), który by ją nadpisał. */}
              <div className="events-rail-card h-full">
                <VideoTile item={item} playLabel={playLabel} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <RailPager
        titles={videoShowcase.items.map((item) => item.title)}
        active={active}
        labels={pagerLabels}
        onSelect={goTo}
        onNext={goNext}
      />
    </>
  );
}

/** Wybór przestrzeni — karty zamiast mapy jako pierwszy krok. */
/** Krótkie oznaczenia kopuł — te same, co pinezki na mapie. */
const DOME_SHORT_LABEL: Record<DomeKey, string> = DOME_MAP_HOTSPOTS.reduce(
  (acc, spot) => ({ ...acc, [spot.dome]: spot.label }),
  {} as Record<DomeKey, string>
);

/* Karta wybranej przestrzeni — układ z projektu właściciela.

   Od góry: zdjęcie z oznaczeniem kopuły, pozycją w zestawie, nazwą i hasłem;
   listwa parametrów z ikonami; zwijany blok „Możliwości i wyposażenie" (po
   rozwinięciu pełna lista z tablicy DOMES) i przełącznik kopuł (te same kropki
   i „dalej", co pod railami na tej stronie). Od 1024 px zdjęcie stoi obok
   treści.

   Wysokość karty nie zależy od wybranej kopuły: listwa parametrów ma zawsze
   jeden rząd, streszczenie wyposażenia rezerwuje dwa wiersze, a hasło leży na
   zdjęciu. Przełączenie nie przesuwa więc niczego pod kartą.

   Kropki są drugim wejściem w wybór (obok pinów mapy): piny mają na telefonie
   20–25 px, a kropki 24 px i „dalej" 44 px, więc to one spełniają
   WCAG 2.2 SC 2.5.8. */
/** Ile kart „Rodzajów wydarzeń" widać naraz od 1024 px (jedna strona railu). */
const FORMATS_PER_VIEW = 3;

const METRIC_ICON: Record<MetricLabelKey, SolarIconName> = {
  area: "full-screen",
  height: "arrows-vertical",
  power: "bolt",
  gates: "garage",
  projection: "monitor",
  projector: "videocamera",
  seats: "armchair",
  levels: "layers",
};

function DomeCard({
  domeKey,
  dome,
  index,
  locale,
  copy,
  featuresOpen,
  onToggleFeatures,
  featuresId,
}: {
  domeKey: DomeKey;
  dome: DomeContent;
  index: number;
  locale: Locale;
  copy: LandingCopy["spaces"];
  featuresOpen: boolean;
  onToggleFeatures: () => void;
  featuresId: string;
}) {
  const metrics = domeMetrics(domeKey, locale);
  const labels = METRIC_LABELS[locale] ?? METRIC_LABELS.pl;
  /* Po rozwinięciu: wyróżnik (tylko K3) i komplet pozycji z DOMES — także te,
     które listwa pokazuje jako liczby, bo to jedyne miejsce z pełnym opisem
     (np. „przejazd TIR" przy bramach). */
  const details = [dome.highlight, ...dome.bullets].filter((item): item is string => Boolean(item));

  return (
    <div className="events-spacecard">
      <div className="events-spacecard-grid">
        {/* Zdjęcie: pliki mają różne proporcje (K7 3:2, reszta 5:3), więc kadruje
            object-cover na stałej ramce. Nazwa kopuły jest nagłówkiem na kadrze,
            więc samo zdjęcie jest dekoracyjne. */}
        <div className="events-spacecard-photo">
          <Image
            src={DOME_IMAGE_BY_KEY[domeKey]}
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="events-spacecard-img object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="events-spacecard-scrim" aria-hidden="true" />
          <span className="events-spacecard-badge" aria-hidden="true">
            {DOME_SHORT_LABEL[domeKey]}
          </span>
          <span className="events-spacecard-count" aria-hidden="true">
            {index + 1} / {EVENT_DOME_ORDER.length}
          </span>
          <div className="events-spacecard-heading">
            <h3 className="events-display events-spacecard-title">{dome.title}</h3>
            <p className="events-spacecard-tagline">
              {copy.domeTaglines[domeKey].map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="events-spacecard-body">
          {/* data-count steruje skalą liczby (4 metryki mają węższe kolumny). */}
          <ul
            role="list"
            aria-label={`${dome.title} — ${copy.specsLabel}`}
            data-count={metrics.length}
            className="events-spacecard-metrics"
          >
            {metrics.map((metric) => (
              <li key={metric.labelKey} className="events-spacecard-metric">
                <span className="events-spacecard-metric-icon" aria-hidden="true">
                  <SolarIcon name={METRIC_ICON[metric.labelKey]} size="1.05rem" />
                </span>
                {/* Prefiks („do", „bis zu") w jednej linii z liczbą — oderwany
                    zmieniałby znaczenie („1 MW" jako wartość dokładna). */}
                <p className="events-spacecard-metric-value">
                  {metric.prefix ? (
                    <span className="events-spacecard-metric-prefix">{`${UP_TO_LABEL[locale]} `}</span>
                  ) : null}
                  {metric.value}
                </p>
                <p className="events-spacecard-metric-label">{labels[metric.labelKey]}</p>
              </li>
            ))}
          </ul>

          <div className={`events-spacecard-features${featuresOpen ? " is-open" : ""}`}>
            <button
              type="button"
              onClick={onToggleFeatures}
              aria-expanded={featuresOpen}
              aria-controls={featuresId}
              className="events-spacecard-features-toggle"
            >
              <span className="events-spacecard-icon-box" aria-hidden="true">
                <SolarIcon name="box" size="1.2rem" />
              </span>
              <span className="events-spacecard-features-title min-w-0 flex-1">{copy.featuresLabel}</span>
              <SolarIcon name="chevron-right" size="1.1rem" className="events-spacecard-features-chevron" />
            </button>
            {/* role="list" jawnie: preflight Tailwinda zdejmuje list-style,
                a Safari/VoiceOver gubi wtedy rolę listy. */}
            <ul id={featuresId} role="list" hidden={!featuresOpen} className="events-spacecard-features-list">
              {details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Cztery karty przestrzeni w jednym railu — przewija się je gestem dokładnie
   tak, jak „Rodzaje wydarzeń", a kropki pod spodem robią to samo co pinezki
   na mapie. Wybór jest wspólny z mapą (activeDome): pinezka przewija rail,
   a przewinięcie railu podświetla pinezkę.

   „Szczegóły" mają JEDEN wspólny stan dla wszystkich kart — inaczej karta
   rozwinięta na jednej kopule byłaby wyższa od sąsiednich i rail skakałby
   przy przewijaniu. */
function SpacePanel({
  domes,
  activeDome,
  onSelect,
  locale,
  copy,
  pagerLabels,
}: {
  domes: (typeof DOMES)[Locale];
  activeDome: DomeKey;
  onSelect: (dome: DomeKey) => void;
  locale: Locale;
  copy: LandingCopy["spaces"];
  pagerLabels: RailPagerLabels;
}) {
  const { railRef, setItemRef, active, isRail, goTo, goNext } = useCenteredRail(
    EVENT_DOME_ORDER.length,
    1,
    { alwaysRail: true }
  );
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const featuresId = useId();
  const activeIndex = EVENT_DOME_ORDER.indexOf(activeDome);
  /* Ostatnio uzgodniony indeks. Pilnuje, żeby dwa kierunki synchronizacji
     (rail → stan strony i stan strony → rail) nie odbijały się w kółko. */
  const syncedRef = useRef(activeIndex);

  useEffect(() => {
    if (active === syncedRef.current) return;
    syncedRef.current = active;
    onSelect(EVENT_DOME_ORDER[active]);
    // onSelect zmienia stan strony; nie chcemy go w zależnościach.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (activeIndex === syncedRef.current) return;
    syncedRef.current = activeIndex;
    goTo(activeIndex);
    // goTo jest tworzone przy każdym renderze — zależność tylko od indeksu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  /* Chiński nie korzysta ze światła międzyliterowego. Sterujemy klasą z propsa
     `locale`, a NIE selektorem :lang(zh): layout.tsx renderuje lang="pl" na
     sztywno, a i18n-provider poprawia atrybut dopiero po hydracji. */
  const cjk = locale === "zh" ? " is-cjk" : "";

  return (
    <div className={`events-spacecard-wrap${cjk}`}>
      <div
        ref={railRef}
        role="region"
        aria-label={copy.title}
        tabIndex={isRail ? 0 : undefined}
        className="events-rail events-spacecard-rail ap-seealso-rail overflow-x-auto pb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <ul role="list" className="events-rail-list flex gap-4">
          {EVENT_DOME_ORDER.map((key, index) => (
            <li key={key} ref={setItemRef(index)} className="events-rail-item">
              <DomeCard
                domeKey={key}
                dome={domes[key]}
                index={index}
                locale={locale}
                copy={copy}
                featuresOpen={featuresOpen}
                onToggleFeatures={() => setFeaturesOpen((open) => !open)}
                featuresId={`${featuresId}-${key}`}
              />
            </li>
          ))}
        </ul>
      </div>

      <RailPager
        className="events-spacecard-pager"
        titles={EVENT_DOME_ORDER.map((key) => domes[key].title)}
        active={active}
        labels={pagerLabels}
        onSelect={goTo}
        onNext={goNext}
      />
    </div>
  );
}

/* Formularz zapytania ofertowego.

   Backendem jest TEN SAM Google Apps Script, co formularz na /kontakt
   (NEXT_PUBLIC_CONTACT_FORM_ENDPOINT). Skrypt czyta wyłącznie pola
   name/email/phone/message/locale/source, więc dodatkowe pola briefu
   (firma, rodzaj eventu, liczba osób, termin) sklejamy w treść wiadomości —
   nic nie ginie i nie trzeba ruszać ani backendu, ani /kontakt.

   Świadomie NIE używamy tu Supabase (src/lib/leads.ts): tamten kontrakt ma
   zamkniętą listę źródeł ("mars" | "identyfikacja") i nie przyjmuje telefonu
   ani treści wiadomości — podpięcie się pod niego wymagałoby zmiany wspólnego
   helpera i funkcji brzegowej, czyli wyjścia poza zakres /wydarzenia.

   Gdy endpoint nie jest skonfigurowany, formularz NADAL działa: składa treść
   zapytania i otwiera klienta pocztowego (mailto) na adres rezerwacji, ten sam,
   który widnieje w stopce. Żadnego udawanego backendu. */
const CONTACT_FORM_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";
const EVENTS_MAIL_FALLBACK = "rezerwacje@alverniaplanet.com";

/* NIEUŻYWANY na razie — właściciel poprosił o zdjęcie formularza i pokazanie
   w sekcji „Planujesz wydarzenie?" samych handlowców z kontaktem. Zostaje w pliku,
   żeby formularz (z wysyłką przez Google Apps Script) dało się łatwo przywrócić. */
function LeadForm({
  copy,
  locale,
  contacts,
  contactHref,
}: {
  copy: LandingCopy;
  locale: Locale;
  contacts: ContactItem[];
  contactHref: string;
}) {
  const form = copy.form;
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");
    const el = event.currentTarget;
    const data = new FormData(el);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const brief = [
      [form.company, get("company")],
      [form.type, get("eventType")],
      [form.guests, get("guests")],
      [form.date, get("eventDate")],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n");

    const body = [
      `${form.name}: ${get("name")}`,
      `${form.email}: ${get("email")}`,
      get("phone") ? `${form.phone}: ${get("phone")}` : "",
      brief,
      get("message"),
    ]
      .filter(Boolean)
      .join("\n");

    // Bez skonfigurowanego endpointu przekazujemy brief do klienta pocztowego.
    if (!CONTACT_FORM_ENDPOINT) {
      const mailto = `mailto:${EVENTS_MAIL_FALLBACK}?subject=${encodeURIComponent(
        `${form.title} ${get("company") || get("name")}`.trim(),
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setState("success");
      return;
    }

    const payload = new URLSearchParams();
    payload.set("name", get("name"));
    payload.set("email", get("email"));
    payload.set("phone", get("phone"));
    payload.set("message", [brief, get("message")].filter(Boolean).join("\n\n"));
    payload.set("locale", locale);
    payload.set("source", "wydarzenia-brief");

    try {
      await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: payload.toString(),
      });
      setState("success");
      el.reset();
    } catch {
      setState("error");
    }
  };

  const field = "events-field w-full rounded-xl px-4 py-3 text-[0.95rem] text-white placeholder:text-white/35 focus:outline-none";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
      <div>
        <SectionHeader title={form.title} lead={form.lead} />
        <p className="mt-8 text-sm leading-relaxed text-white/60">{form.note}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={contactHref} className="events-cta-ghost">
            {copy.cta.talk}
            <SolarIcon name="arrow-right" size="1.05em" />
          </a>
        </div>
        <ul className="mt-6 space-y-3">
          {contacts.slice(0, 2).map((person) => (
            <li key={person.email} className="flex items-center gap-3 text-sm">
              <SolarIcon name="phone" size="1.05em" className="text-[#56ddea]" />
              <span className="text-white/70">{person.name}</span>
              <a
                href={`tel:${person.phone.replace(/\s+/g, "")}`}
                className="events-contact-link font-semibold"
              >
                {person.phone}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="events-form-panel rounded-2xl p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="events-field-label">{form.name}</span>
            <input name="name" required autoComplete="name" className={field} />
          </label>
          <label className="block">
            <span className="events-field-label">{form.company}</span>
            <input name="company" autoComplete="organization" className={field} />
          </label>
          <label className="block">
            <span className="events-field-label">{form.email}</span>
            <input name="email" type="email" required autoComplete="email" className={field} />
          </label>
          <label className="block">
            <span className="events-field-label">{form.phone}</span>
            <input name="phone" type="tel" autoComplete="tel" className={field} />
          </label>
          <label className="block">
            <span className="events-field-label">{form.type}</span>
            <input name="eventType" className={field} />
          </label>
          <label className="block">
            <span className="events-field-label">{form.guests}</span>
            <input name="guests" inputMode="numeric" className={field} />
          </label>
          <label className="block">
            <span className="events-field-label">{form.date}</span>
            <input name="eventDate" className={field} />
          </label>
          <label className="block sm:col-span-2">
            <span className="events-field-label">
              {form.message} <span className="text-white/35">({form.optional})</span>
            </span>
            <textarea name="message" rows={4} className={`${field} resize-y`} />
          </label>
        </div>

        <button
          type="submit"
          disabled={state === "sending"}
          className="events-submit mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[var(--ap-btn-radius)] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.14em] disabled:opacity-60"
        >
          {state === "sending" ? form.sending : form.submit}
        </button>

        <p aria-live="polite" className="mt-4 min-h-[1.25rem] text-sm">
          {state === "success" ? <span className="text-[#7ef6ff]">{form.success}</span> : null}
          {state === "error" ? <span className="text-[#ff7092]">{form.error}</span> : null}
        </p>
      </form>
    </div>
  );
}

export default function EventsPage() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const ui = UI_TEXT[loc];
  const sectionUi = SECTION_UI[loc];
  const copy = LANDING_COPY[loc];
  const domes = DOMES[loc];
  const contacts = CONTACTS[loc];
  const videoShowcase = VIDEO_SHOWCASE[loc];
  const stats = STATS[loc];
  const contactHref = getLocalizedPath("/kontakt", loc);

  // Wybór przestrzeni jest teraz stanem CAŁEJ strony: sterują nim zarówno karty
  // przestrzeni (główna ścieżka), jak i mapa kompleksu niżej (dodatkowa).
  /* JEDEN stan wyboru dla mapy, karty podglądu, kafelków i panelu specyfikacji.
     `previewOpen` nie jest drugim wyborem — trzyma wyłącznie widoczność karty,
     która celowo pojawia się dopiero po pierwszej świadomej interakcji, żeby
     nie zasłaniać mapy od wejścia na stronę. */
  const [activeDome, setActiveDome] = useState<DomeKey>("k3");
  const [previewOpen, setPreviewOpen] = useState(false);
  const specsRef = useRef<HTMLDivElement | null>(null);
  const kontaktRef = useRef<HTMLElement | null>(null);

  /* Sekcja kontaktu stoi ok. 5 300 px pod pierwszym ekranem, a ma dwie rzeczy,
     które bez nadzoru pracują cały czas: duże zdjęcie w tle i nieprzerwany
     poblask w nadtytule.

     Dwa obserwatory, każdy odpala się rzadko i nic nie liczy co klatkę:
     - `is-near` (zapas 300% wysokości okna) włącza zdjęcie tła — do tego czasu
       CSS trzyma `--contact-photo: none`, więc przeglądarka go nie pobiera.
       Bramka `html.ap-reveal` w CSS gwarantuje, że bez JS-u tło jest od razu;
     - `is-offscreen` zatrzymuje poblask, gdy sekcji nie widać. To ta sama
       zasada, co przy taśmie logotypów: animacja jest tania, ale nie darmowa,
       a poza kadrem nikt jej nie ogląda. */
  useEffect(() => {
    const sekcja = kontaktRef.current;
    if (!sekcja || typeof IntersectionObserver === "undefined") return;

    const blisko = new IntersectionObserver(
      ([wpis]) => {
        if (!wpis.isIntersecting) return;
        sekcja.classList.add("is-near");
        blisko.disconnect();
      },
      { rootMargin: "300% 0px" },
    );
    blisko.observe(sekcja);

    const wKadrze = new IntersectionObserver(
      ([wpis]) => sekcja.classList.toggle("is-offscreen", !wpis.isIntersecting),
      { rootMargin: "120px 0px" },
    );
    wKadrze.observe(sekcja);

    return () => {
      blisko.disconnect();
      wKadrze.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  const scrollToSpecs = () => {
    const panel = specsRef.current;
    if (!panel || typeof window === "undefined") return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
  };

  /* Klik w pin ma WYBRAĆ kopułę i pokazać podgląd — nie przewijać strony, bo
     zabierałoby to mapę z kadru (na telefonie panel stoi ~1400 px niżej).
     Do specyfikacji prowadzi dopiero CTA w karcie albo kliknięcie kafelka,
     który dosłownie zapowiada „Zobacz szczegóły". */
  const selectDome = (dome: DomeKey, options?: { scroll?: boolean }) => {
    setActiveDome(dome);
    setPreviewOpen(true);
    if (options?.scroll) scrollToSpecs();
  };

  const showDomeDetails = () => {
    scrollToSpecs();
  };

  /* Escape zamyka podgląd — karta nie jest modalem (nie przechwytuje fokusa
     ani nie blokuje przewijania), więc to jedyny skrót, jakiego tu potrzeba. */
  useEffect(() => {
    if (!previewOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewOpen]);


  return (
    <main className="events-page relative min-h-screen text-white">
      {/* Hero na cały ekran — ta sama mechanika co na stronie głównej:
          przypięte wideo, przybliżenie i wygaszanie przy przewijaniu. */}
      <FullscreenHero
        mp4Src="/wydarzenia/AP_wydarzenia.mp4"
        poster="/wydarzenia/AP_wydarzenia_poster.webp"
        fallbackText={ui.videoFallback}
      >
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <div className="events-hero-copy flex w-full max-w-[64rem] flex-col items-center">
            <p className="ap-intro-rise events-hero-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.34em] sm:text-[0.72rem]">
              {copy.hero.eyebrow}
            </p>
            <h1
              className={`ap-intro-rise events-display force-overlay mt-5 text-balance [text-shadow:0_2px_22px_rgba(0,0,0,0.6)] !leading-[1.06] !text-[clamp(2rem,7.4vw,4.2rem)] font-extrabold tracking-[-0.028em] text-white `}
            >
              {/* Tytuł w dwóch częściach: duża linia i dopowiedzenie mniejszym
                  stopniem w jednym wierszu (.events-hero-title-sub). Obie w jednym
                  <h1> ze spacją między nimi — czytnik ekranu czyta całe zdanie. */}
              <span
                className="events-hero-title-main block"
                style={{ "--hero-title-em": HERO_TITLE_EM[loc] } as CSSProperties}
              >
                {copy.hero.title}
              </span>{" "}
              <span className="events-hero-title-sub mt-2 block sm:mt-3">{copy.hero.titleSub}</span>
            </h1>
            <p
              className={`ap-intro-rise ap-intro-d1 force-overlay-hero mt-6 max-w-[46rem] text-balance leading-[1.5] [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] !text-[clamp(0.98rem,3.2vw,1.06rem)] font-medium sm:!text-[clamp(1.05rem,1.3vw,1.3rem)] `}
            >
              {copy.hero.lead}
            </p>

            <div
              className={`ap-intro-rise ap-intro-d3 mt-9 flex w-full max-w-[20rem] flex-col items-stretch gap-3.5 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4 `}
            >
              <button
                type="button"
                onClick={() => scrollTo("zapytanie")}
                className="ticket-pill pointer-events-auto inline-flex h-[3.75rem] items-center justify-center gap-2.5 rounded-[var(--ap-btn-radius)] px-8 text-sm font-extrabold uppercase tracking-[0.14em] transition hover:-translate-y-px hover:brightness-110 sm:min-w-[15rem]"
                style={{
                  backgroundColor: "#56ddea",
                  color: "#04222a",
                  boxShadow: "0 6px 22px rgba(86,221,234,0.32)",
                  borderColor: "transparent",
                }}
              >
                {copy.cta.primary}
              </button>
              <button
                type="button"
                onClick={() => scrollTo("przestrzenie")}
                className="pointer-events-auto inline-flex h-[3.75rem] items-center justify-center gap-2.5 rounded-[var(--ap-btn-radius)] border border-[#56ddea]/45 bg-black/45 px-8 text-sm font-bold uppercase tracking-[0.14em] !text-white backdrop-blur-md transition hover:-translate-y-px hover:border-[#56ddea]/80 hover:bg-[#56ddea]/10 sm:min-w-[13.5rem]"
              >
                {copy.cta.spaces}
                <SolarIcon name="arrow-right" size="1.15em" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => scrollTo("content-start")}
              className={`ap-intro-rise ap-intro-d4 ap-hero-scroll pointer-events-auto mt-12 inline-flex items-center gap-3 text-[0.82rem] font-medium text-white/90 hover:text-white `}
            >
              <span
                aria-hidden="true"
                className="ap-hero-scroll-dot inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35"
              >
                <SolarIcon name="arrow-down" size="1.1em" />
              </span>
              {copy.hero.scrollHint}
            </button>
          </div>
        </div>
      </FullscreenHero>

      {/* Warstwa treści przykrywa przypięte hero — musi mieć własne, pełne tło. */}
      <div
        id="content-start"
        className="events-content-shell relative z-10 -mt-10 overflow-x-clip rounded-t-[2rem] px-4 pb-16 pt-14 shadow-[0_-28px_60px_-20px_rgba(0,0,0,0.7)] sm:-mt-14 sm:rounded-t-[2.75rem] sm:pt-16 sm:pb-20 lg:-mt-16 lg:pt-20"
      >
        {/* Tło całej treści pod hero: grafika kosmiczna (BCG_Event). Warstwa stoi
            w miejscu, a treść przewija się nad nią — przez `position: sticky`,
            nie `background-attachment: fixed`, którego iOS Safari nie obsługuje.
            Obraz 16:9 rozciągnięty na całą wysokość strony (7–10 tys. px) byłby
            kilkanaście razy powiększony i rozmyty; tak zawsze wypełnia ekran. */}
        <div className="events-shell-bg" aria-hidden="true">
          <div className="events-shell-bg-image" />
        </div>
        <div className="ap-shell">
          {/* 1 — Liczby: dowód skali od razu pod hero */}
          {/* Bez content-visibility (ap-deferred-section): karta stoi tuż pod hero,
              a zastępcza wysokość 860 px podmieniana na prawdziwą przesuwała
              wszystko poniżej i psuła skoki do kotwic w Safari. */}
          <ScrollMotionItem strength="strong" delay={40}>
            <Card variant="solid" motion="off">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="ap-type-section-title">{tytulZAkcentem(stats.title)}</h2>
                  <div className="events-section-divider mx-auto mt-4 h-[1px] w-full max-w-3xl" />
                  <p className="events-section-intro mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base">
                    {stats.intro}
                  </p>
                </div>
                <StatsGrid items={stats.items} locale={loc} />
              </div>
            </Card>
          </ScrollMotionItem>


          {/* 2 — Rodzaje wydarzeń: zaraz po liczbach pokazujemy, co da się tu zorganizować.
              Stoi na czarnym pasie z przejściem na górze (.events-block-dark); na dole
              czerń trzyma się do końca sekcji (.events-block-dark-hold), a wygasza ją
              dopiero sekcja z mapą. */}
          <section className="events-block events-block-dark">
            <ScrollMotionItem strength="soft" delay={40}>
              <SectionHeader
                title={copy.formats.title}
                lead={copy.formats.lead}
              />
              <div className="mt-10">
                <FormatsGrid
                  items={copy.formats.items}
                  categories={FORMAT_CATEGORIES}
                  label={copy.formats.title}
                  pagerLabels={{
                    group: sectionUi.formatsPagerLabel,
                    show: sectionUi.railShowCard,
                    next: sectionUi.formatsNext,
                  }}
                />
              </div>
            </ScrollMotionItem>
          </section>

          {/* 2b — Zaufali nam. Sekcja pojawia się dopiero, gdy w TRUSTED_LOGOS
                 są pozycje. Bez własnego tła: czerń spod sekcji wyżej wygasa nad nią,
                 więc pasek logotypów stoi na tle strony, a czerń wraca dopiero
                 przy mapie. */}
          {TRUSTED_LOGOS.length > 0 ? (
            <section className="events-block">
              <ScrollMotionItem strength="soft" delay={40}>
                <SectionHeader title={copy.trusted.title} lead={copy.trusted.lead} align="center" />
                <div className="mt-10">
                  <TrustedLogos
                    items={TRUSTED_LOGOS}
                    label={sectionUi.trustedLabel}
                    ui={{
                      speedLabel: sectionUi.trustedSpeedLabel,
                      slower: sectionUi.trustedSlower,
                      faster: sectionUi.trustedFaster,
                    }}
                  />
                </div>
              </ScrollMotionItem>
            </section>
          ) : null}

          {/* 3 — Mapa kompleksu + wybór przestrzeni. Mapa i kafelki to dwa wejścia
                 w ten sam wybór (activeDome), więc stoją w jednej sekcji pod wspólnym
                 nagłówkiem — osobne nagłówki wpychały między nie ~460 px pustki. */}
          <section id="przestrzenie" className="events-block events-block-dark events-block-dark-hold scroll-mt-24">
            <ScrollMotionItem strength="soft" delay={40}>
              <SectionHeader
                title={copy.map.title}
                lead={sectionUi.domesMapHint}
                align="center"
                className="events-map-header"
              />
              <div className="mt-10">
                <ComplexMap
                  activeDome={activeDome}
                  onSelect={(dome) => selectDome(dome)}
                  sectionUi={sectionUi}
                  domes={domes}
                  locale={loc}
                  detailsCta={copy.spaces.detailsCta}
                  previewOpen={previewOpen}
                  onClosePreview={() => setPreviewOpen(false)}
                  onShowDetails={showDomeDetails}
                />
              </div>
              <div
                ref={specsRef}
                id="specyfikacja-przestrzeni"
                role="region"
                aria-label={sectionUi.domesMapPreviewLabel}
                className="mt-8"
              >
                <SpacePanel
                  domes={domes}
                  activeDome={activeDome}
                  onSelect={setActiveDome}
                  locale={loc}
                  copy={copy.spaces}
                  pagerLabels={{
                    group: copy.spaces.title,
                    show: sectionUi.railShowCard,
                    next: sectionUi.spacesNext,
                  }}
                />
              </div>
            </ScrollMotionItem>
          </section>

          {/* 4 — Dlaczego Alvernia Planet — na czarnym pasie z przejściami na górze
              i na dole (.events-block-dark). */}
          <section className="events-block events-block-dark events-block-dark-hold">
            <ScrollMotionItem strength="soft" delay={40}>
              <WhyEditorial
                why={copy.why}
                locale={loc}
                loadingLabel={ui.loadingVideo}
                fallbackText={ui.videoFallback}
                ui={{
                  colorLabel: sectionUi.whyColorLabel,
                  red: sectionUi.whyColorRed,
                  blue: sectionUi.whyColorBlue,
                  orange: sectionUi.whyColorOrange,
                }}
              />
            </ScrollMotionItem>
          </section>

          {/* 5 — Realizacje jako mini case studies. Czerń spod „Miejsca, które
                 pracuje" idzie dalej przez tę sekcję i wygasa dopiero przed
                 „Planujesz wydarzenie?" (events-block-fade-out). */}
          <section className="events-block events-block-fade-out">
            <ScrollMotionItem strength="soft" delay={40}>
              <CasesSection
                cases={copy.cases}
                videoShowcase={videoShowcase}
                playLabel={ui.playVideo}
                pagerLabels={{
                  group: sectionUi.casesPagerLabel,
                  show: sectionUi.railShowCard,
                  next: sectionUi.casesNext,
                }}
              />
            </ScrollMotionItem>
          </section>

          {/* 6 — Zapytanie ofertowe: na razie bez formularza — zamiast niego
              handlowcy z bezpośrednim kontaktem. Komponent LeadForm zostaje
              w pliku nieużywany, żeby formularz dało się łatwo przywrócić.

              Sekcja ma własne tło (zdjęcie z wydarzenia w kopule) rozciągnięte
              na całą szerokość okna. Mechanika ta sama, co przy czarnych pasach
              wyżej: ::before o szerokości 100vw pod treścią (z-index: -1
              w kontekście .ap-shell), więc nie powoduje poziomego przewijania
              i nie wymaga dokładania obrazka do DOM. */}
          <section ref={kontaktRef} id="zapytanie" className="events-block events-contact scroll-mt-24">
            <ScrollMotionItem strength="soft" delay={40}>
              {/* Ta sama duża karta, w której stoi sekcja „Alvernia Planet
                  w liczbach" — dzięki temu kontakt nie odstaje od reszty
                  strony, tylko domyka ją tym samym kształtem. */}
              <Card variant="solid" motion="off" className="events-contact-shell">
              <div className="events-contact-inner">
                <p className="events-contact-eyebrow">
                  <span className="events-contact-eyebrow-rule" aria-hidden="true" />
                  <span className="events-contact-eyebrow-text">{copy.form.eyebrow}</span>
                </p>
                <h2 className="events-display events-contact-title">{tytulZAkcentem(copy.form.title)}</h2>
                <p className="events-contact-lead">{copy.form.lead}</p>
                <p className="events-contact-note">{copy.form.note}</p>

                <ul role="list" className="ap-stagger events-contact-cards">
                  {contacts.slice(0, 2).map((person, index) => {
                    const photo = CONTACT_PHOTOS[person.email];
                    return (
                      <li
                        key={`contact-${person.email}`}
                        className={`events-contact-card ${TILE_TONES[index % TILE_TONES.length]}`}
                      >
                        <div className="events-tile-glow" aria-hidden="true" />
                        {photo ? (
                          <Image
                            src={photo}
                            /* Ozdoba wizytówki: dokładnie to samo nazwisko stoi
                               tuż pod zdjęciem jako tekst, więc alt z imieniem
                               kazałby czytnikowi ekranu przeczytać je dwa razy. */
                            alt=""
                            width={512}
                            height={512}
                            sizes="132px"
                            className="events-contact-photo"
                          />
                        ) : null}
                        <p className="events-contact-name">{person.name}</p>
                        <p className="events-contact-role">{person.role}</p>
                        <div className="events-contact-actions">
                          <a
                            href={`tel:${person.phone.replace(/\s+/g, "")}`}
                            className="events-contact-action"
                            aria-label={`${person.name}, ${person.phone}`}
                          >
                            <SolarIcon name="phone" size="1em" className="events-contact-action-icon" />
                            <span className="events-contact-action-value">{person.phone}</span>
                            <span className="events-contact-action-arrow" aria-hidden="true">
                              <SolarIcon name="arrow-right" size="0.85em" />
                            </span>
                          </a>
                          <a
                            href={`mailto:${person.email}`}
                            className="events-contact-action"
                            aria-label={`${person.name}, ${person.email}`}
                          >
                            <SolarIcon name="letter" size="1em" className="events-contact-action-icon" />
                            <span className="events-contact-action-value">{person.email}</span>
                            <span className="events-contact-action-arrow" aria-hidden="true">
                              <SolarIcon name="arrow-right" size="0.85em" />
                            </span>
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <p className="events-contact-strip">{copy.hero.eyebrow}</p>
              </div>
              </Card>
            </ScrollMotionItem>
          </section>
        </div>
      </div>
    </main>
  );
}
