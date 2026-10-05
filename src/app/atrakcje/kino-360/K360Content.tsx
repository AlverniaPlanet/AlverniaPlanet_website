"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  K360_BOOKING_SERVICES,
} from "@/lib/booking";
import { PROMO_PACKAGES } from "@/lib/promoPackages";
import { AllAttractionsBundleBar } from "@/app/components/AllAttractionsBundleBar";
import { AttractionPortal } from "@/app/components/AttractionPortal";
import { type Locale } from "@/lib/localizedRoutes";
import RepertoireSection from "./RepertoireSection";
import { SolarIcon } from "@/app/components/SolarIcon";

type Highlight = { title: string; body: string };

// Hero = jedno duże zdjęcie na cały ekran, które płynnie zmienia się (cross-fade)
// między dwoma kadrami kopuły. Kropki na dole pokazują, ile jest zdjęć.
//
// Każdy kadr ma trzy szerokości, bo oryginał ma 2400 px i na telefonie był to
// jeden plik na 248 kB — decydujący o LCP. Zmierzone na produkcji (telefon,
// 1,6 Mb/s, procesor ×4 wolniejszy): LCP 6128 ms, czyli półtora raza powyżej
// progu „słabo". `sizes="100vw"` pozwala przeglądarce wybrać wariant samej,
// z uwzględnieniem gęstości ekranu — 900 px na telefonie, 2400 px na
// czterokrotnym retinie.
const HERO_IMAGES = [
  {
    src: "/galeria/K360/K360_2-1600.webp",
    srcSet:
      "/galeria/K360/K360_2-900.webp 900w, /galeria/K360/K360_2-1600.webp 1600w, /galeria/K360/K360_2.webp 2400w",
  },
  {
    src: "/galeria/K360/K360_1-1600.webp",
    srcSet:
      "/galeria/K360/K360_1-900.webp 900w, /galeria/K360/K360_1-1600.webp 1600w, /galeria/K360/K360_1.webp 2400w",
  },
];

// Kafelek siatki ma najwyżej 380 px szerokości, a otwierał pliki 1600–2400 px.
// Siatka pobierała przez to 1218 kB zamiast 261 kB. Pełny plik zostaje tam,
// gdzie jest naprawdę potrzebny: w powiększeniu po kliknięciu.
const GALLERY_IMAGES = [
  "/galeria/K360/1.webp",
  "/galeria/K360/2.webp",
  "/galeria/K360/3.webp",
  "/galeria/K360/4.webp",
  "/galeria/K360/K360_1.webp",
  "/galeria/K360/K360_2.webp",
];

/** Miniatura 760 px dla tego samego kadru — nazwa pliku z przyrostkiem. */
const miniatura = (src: string) => src.replace(/\.webp$/, "-760.webp");

// „Odcinek biletu" z perforacją po bokach (czerwona wersja).
const TICKET_STUB_STYLE: CSSProperties = {
  backgroundColor: "#0a0612",
  border: "2px solid #f7486c",
  boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 28px rgba(247,72,108,0.35)",
  WebkitMask:
    "radial-gradient(circle 14px at 0 66%, transparent 14px, #000 14.5px) left center / 100% 100% no-repeat, radial-gradient(circle 14px at 100% 66%, transparent 14px, #000 14.5px) right center / 100% 100% no-repeat",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

type Copy = {
  heroKicker: string;
  heroTitle: string;
  heroTagline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  europeBadge: string;
  experienceBadge: string;

  infoBar: string[];

  aboutTitleLead: string;
  aboutTitleAccent: string;
  aboutLead: string;
  aboutBody: string;
  aboutHighlights: string[];

  nowShowingKicker: string;
  nowShowingNote: string;

  heroRepertoire: string;
  repertoireKicker: string;
  repertoireTitle: string;
  repertoireIntro: string;
  filmCta: string;
  filmMore: string;

  highlightsTitle: string;
  highlights: Highlight[];

  galleryTitle: string;
  galleryIntro: string;

  ticketsTitle: string;
  ticketsTagline: string;
  ticketBadge: string;
  ticketIncludes: string[];
  priceNormalLabel: string;
  priceNormalValue: string;
  priceReducedLabel: string;
  priceReducedValue: string;
  ticketCta: string;
};

const COPY: Record<Locale, Copy> = {
  pl: {
    heroKicker: "Fulldome 360° • Największe kino kopułowe w Europie",
    heroTitle: "Kino 360",
    heroTagline: "Przeżyj film, który dzieje się wokół Ciebie.",
    heroCtaPrimary: "Kup bilet",
    heroCtaSecondary: "Zobacz repertuar",
    europeBadge: "Największe Kino 360 w Europie",
    experienceBadge: "Przeżyj",

    infoBar: ["Kopuła 48 m", "Wysokość 15 m", "Seans ~30 min"],

    aboutTitleLead: "Nie oglądasz.",
    aboutTitleAccent: "Jesteś w środku.",
    aboutLead: "Kino 360 to projekcja fulldome na całej powierzchni 48-metrowej kopuły.",
    aboutBody:
      "Zamiast płaskiego ekranu obraz otacza Cię z każdej strony i wypełnia całe pole widzenia. To największe kino fulldome w Europie: 15 metrów wysokości, 48 metrów średnicy i seans, który trwa około 30 minut.",
    aboutHighlights: ["48 m kopuła", "Fulldome 360°", "~30 min seans"],

    nowShowingKicker: "Teraz w kopule",
    nowShowingNote: "Aktualny seans trwa około 30 minut i odbywa się w języku polskim.",
    heroRepertoire: "4 filmy fulldome w repertuarze",
    repertoireKicker: "Repertuar",
    repertoireTitle: "Repertuar Kina 360",
    repertoireIntro: "Cztery filmy fulldome 360°: każdy wypełnia całą kopułę dookoła i nad głową.",
    filmCta: "Kup bilet",
    filmMore: "Dowiedz się więcej",

    highlightsTitle: "Dlaczego Kino 360",
    highlights: [
      {
        title: "Największe kino 360 w Europie",
        body: "Żaden inny obiekt fulldome na kontynencie nie skaluje projekcji tak jak nasza 48-metrowa kopuła.",
      },
      {
        title: "Pełne zanurzenie fulldome 360°",
        body: "Obraz i dźwięk obejmują widza z każdej strony, nad głową i dookoła, bez ramki ekranu.",
      },
      {
        title: "Kopuła 48 m",
        body: "15 metrów wysokości, 48 metrów średnicy, seans około 30 minut w języku polskim.",
      },
    ],

    galleryTitle: "Zobacz przestrzeń",
    galleryIntro: "Cała kopuła staje się ekranem: obraz 360° wypełnia całe pole widzenia widza.",

    ticketsTitle: "Bilety na Kino 360",
    ticketsTagline: "Seans trwa około 30 minut i odbywa się w języku polskim.",
    ticketBadge: "Kino 360",
    ticketIncludes: [
      "Seans fulldome 360° w kopule",
      "Czas trwania ok. 30 minut",
      "Projekcja w języku polskim",
      "Do 150 miejsc na seans",
    ],
    priceNormalLabel: "Normalny",
    priceNormalValue: "49 zł/os.",
    priceReducedLabel: "Ulgowy",
    priceReducedValue: "39 zł/os.",
    ticketCta: "Kup bilet",
  },

  en: {
    heroKicker: "Fulldome 360° • Europe's largest dome cinema",
    heroTitle: "K360 Cinema",
    heroTagline: "Experience a film that happens all around you.",
    heroCtaPrimary: "Buy a ticket",
    heroCtaSecondary: "See repertoire",
    europeBadge: "Europe's largest 360° cinema",
    experienceBadge: "Experience",

    infoBar: ["48 m dome", "15 m high", "~30 min screening"],

    aboutTitleLead: "You don't watch.",
    aboutTitleAccent: "You're inside it.",
    aboutLead: "K360 is a fulldome projection across the entire surface of a 48-metre dome.",
    aboutBody:
      "Instead of a flat screen, the image surrounds you from every side and fills your entire field of view. It's the largest fulldome cinema in Europe: 15 metres high, 48 metres across, with screenings of about 30 minutes.",
    aboutHighlights: ["48 m dome", "Fulldome 360°", "~30 min screening"],

    nowShowingKicker: "Now showing",
    nowShowingNote: "The current screening runs about 30 minutes and is shown in Polish.",
    heroRepertoire: "4 fulldome films in the repertoire",
    repertoireKicker: "Repertoire",
    repertoireTitle: "K360 repertoire",
    repertoireIntro: "Four fulldome 360° films: each one fills the entire dome all around and overhead.",
    filmCta: "Buy a ticket",
    filmMore: "Learn more",

    highlightsTitle: "Why K360",
    highlights: [
      {
        title: "Europe's largest 360° cinema",
        body: "No other fulldome venue on the continent scales a projection the way our 48-metre dome does.",
      },
      {
        title: "Full fulldome 360° immersion",
        body: "Image and sound wrap around you from every side, overhead and all around, with no screen frame.",
      },
      {
        title: "48 m dome",
        body: "15 metres high, 48 metres across, a screening of about 30 minutes in Polish.",
      },
    ],

    galleryTitle: "See the venue",
    galleryIntro: "The whole dome becomes the screen: a 360° image fills the audience's entire field of view.",

    ticketsTitle: "Tickets for K360 Cinema",
    ticketsTagline: "The screening lasts about 30 minutes and is shown in Polish.",
    ticketBadge: "K360 Cinema",
    ticketIncludes: [
      "360° fulldome screening in the dome",
      "About 30 minutes long",
      "Shown in Polish",
      "Up to 150 seats per screening",
    ],
    priceNormalLabel: "Standard",
    priceNormalValue: "49 PLN",
    priceReducedLabel: "Reduced",
    priceReducedValue: "39 PLN",
    ticketCta: "Buy a ticket",
  },

  pt: {
    heroKicker: "Fulldome 360° • O maior cinema em cúpula da Europa",
    heroTitle: "Cinema K360",
    heroTagline: "Vive um filme que acontece à tua volta.",
    heroCtaPrimary: "Comprar bilhete",
    heroCtaSecondary: "Ver repertório",
    europeBadge: "O maior cinema 360° da Europa",
    experienceBadge: "Vive",

    infoBar: ["Cúpula 48 m", "15 m de altura", "Sessão ~30 min"],

    aboutTitleLead: "Não vês.",
    aboutTitleAccent: "Estás lá dentro.",
    aboutLead: "O K360 é uma projeção fulldome em toda a superfície de uma cúpula de 48 metros.",
    aboutBody:
      "Em vez de um ecrã plano, a imagem envolve-te de todos os lados e preenche todo o teu campo de visão. É o maior cinema fulldome da Europa: 15 metros de altura, 48 metros de diâmetro e sessões de cerca de 30 minutos.",
    aboutHighlights: ["Cúpula 48 m", "Fulldome 360°", "Sessão ~30 min"],

    nowShowingKicker: "Em exibição",
    nowShowingNote: "A sessão atual dura cerca de 30 minutos e é apresentada em polaco.",
    heroRepertoire: "4 filmes fulldome no repertório",
    repertoireKicker: "Repertório",
    repertoireTitle: "Repertório do K360",
    repertoireIntro: "Quatro filmes fulldome 360°: cada um preenche toda a cúpula à volta e por cima.",
    filmCta: "Comprar bilhete",
    filmMore: "Saber mais",

    highlightsTitle: "Porquê o K360",
    highlights: [
      {
        title: "O maior cinema 360° da Europa",
        body: "Nenhum outro espaço fulldome do continente projeta a esta escala como a nossa cúpula de 48 metros.",
      },
      {
        title: "Imersão fulldome 360° total",
        body: "Imagem e som envolvem-te de todos os lados, por cima e à volta, sem moldura de ecrã.",
      },
      {
        title: "Cúpula 48 m",
        body: "15 metros de altura, 48 metros de diâmetro, sessão de cerca de 30 minutos em polaco.",
      },
    ],

    galleryTitle: "Ver o espaço",
    galleryIntro: "Toda a cúpula se torna o ecrã: uma imagem 360° preenche todo o campo de visão do público.",

    ticketsTitle: "Bilhetes para o Cinema K360",
    ticketsTagline: "A sessão dura cerca de 30 minutos e é apresentada em polaco.",
    ticketBadge: "Cinema K360",
    ticketIncludes: [
      "Sessão fulldome 360° na cúpula",
      "Cerca de 30 minutos de duração",
      "Apresentada em polaco",
      "Até 150 lugares por sessão",
    ],
    priceNormalLabel: "Normal",
    priceNormalValue: "49 PLN",
    priceReducedLabel: "Reduzido",
    priceReducedValue: "39 PLN",
    ticketCta: "Comprar bilhete",
  },

  de: {
    heroKicker: "Fulldome 360° • Europas größtes Kuppelkino",
    heroTitle: "Kino 360",
    heroTagline: "Erleben Sie einen Film, der rund um Sie herum stattfindet.",
    heroCtaPrimary: "Ticket kaufen",
    heroCtaSecondary: "Programm ansehen",
    europeBadge: "Europas größtes 360°-Kino",
    experienceBadge: "Erleben",

    infoBar: ["48 m Kuppel", "15 m hoch", "Vorführung ~30 Min."],

    aboutTitleLead: "Sie sehen nicht zu.",
    aboutTitleAccent: "Sie sind mittendrin.",
    aboutLead: "Kino 360 ist eine Fulldome-Projektion auf der gesamten Fläche einer 48-Meter-Kuppel.",
    aboutBody:
      "Statt einer flachen Leinwand umgibt Sie das Bild von allen Seiten und füllt Ihr gesamtes Sichtfeld aus. Es ist das größte Fulldome-Kino Europas: 15 Meter hoch, 48 Meter Durchmesser und Vorführungen von rund 30 Minuten.",
    aboutHighlights: ["48 m Kuppel", "Fulldome 360°", "~30 Min. Vorführung"],

    nowShowingKicker: "Jetzt im Programm",
    nowShowingNote: "Die aktuelle Vorführung dauert rund 30 Minuten und wird auf Polnisch gezeigt.",
    heroRepertoire: "4 Fulldome-Filme im Programm",
    repertoireKicker: "Programm",
    repertoireTitle: "Programm von Kino 360",
    repertoireIntro: "Vier Fulldome-360°-Filme: Jeder füllt die gesamte Kuppel ringsum und über Ihnen.",
    filmCta: "Ticket kaufen",
    filmMore: "Mehr erfahren",

    highlightsTitle: "Warum Kino 360",
    highlights: [
      {
        title: "Europas größtes 360°-Kino",
        body: "Kein anderer Fulldome-Ort auf dem Kontinent projiziert in einem solchen Maßstab wie unsere 48-Meter-Kuppel.",
      },
      {
        title: "Volle Fulldome-360°-Immersion",
        body: "Bild und Ton umgeben Sie von allen Seiten, über Ihnen und ringsum, ganz ohne Leinwandrahmen.",
      },
      {
        title: "48 m Kuppel",
        body: "15 Meter hoch, 48 Meter Durchmesser, eine Vorführung von rund 30 Minuten auf Polnisch.",
      },
    ],

    galleryTitle: "Den Ort entdecken",
    galleryIntro: "Die gesamte Kuppel wird zur Leinwand: Ein 360°-Bild füllt das komplette Sichtfeld des Publikums.",

    ticketsTitle: "Tickets für Kino 360",
    ticketsTagline: "Die Vorführung dauert rund 30 Minuten und wird auf Polnisch gezeigt.",
    ticketBadge: "Kino 360",
    ticketIncludes: [
      "360°-Fulldome-Vorführung in der Kuppel",
      "Dauer rund 30 Minuten",
      "Vorführung auf Polnisch",
      "Bis zu 150 Plätze pro Vorführung",
    ],
    priceNormalLabel: "Regulär",
    priceNormalValue: "49 PLN",
    priceReducedLabel: "Ermäßigt",
    priceReducedValue: "39 PLN",
    ticketCta: "Ticket kaufen",
  },

  zh: {
    heroKicker: "全穹顶 360° • 欧洲最大的穹幕影院",
    heroTitle: "Kino 360 影院",
    heroTagline: "体验一场在你四周展开的电影。",
    heroCtaPrimary: "购票",
    heroCtaSecondary: "查看片单",
    europeBadge: "欧洲最大的 360° 影院",
    experienceBadge: "体验",

    infoBar: ["48 米穹顶", "15 米高", "约 30 分钟放映"],

    aboutTitleLead: "不是观看。",
    aboutTitleAccent: "你身在其中。",
    aboutLead: "Kino 360 影院是覆盖整个 48 米穹顶表面的全穹顶放映。",
    aboutBody:
      "这里没有平面银幕，画面从四面八方将你包围，填满整个视野。这是欧洲最大的全穹顶影院：高 15 米、直径 48 米，每场放映约 30 分钟。",
    aboutHighlights: ["48 米穹顶", "全穹顶 360°", "约 30 分钟放映"],

    nowShowingKicker: "正在放映",
    nowShowingNote: "当前场次约 30 分钟，以波兰语放映。",
    heroRepertoire: "片单中共有 4 部全穹顶影片",
    repertoireKicker: "片单",
    repertoireTitle: "Kino 360 影院片单",
    repertoireIntro: "四部全穹顶 360° 影片：每一部都铺满整个穹顶，环绕四周与头顶。",
    filmCta: "购票",
    filmMore: "了解更多",

    highlightsTitle: "为什么选择 Kino 360 影院",
    highlights: [
      {
        title: "欧洲最大的 360° 影院",
        body: "在欧洲，没有第二座全穹顶场馆能像我们 48 米的穹顶这样放映。",
      },
      {
        title: "全穹顶 360° 沉浸体验",
        body: "画面与声音从四面八方、头顶与周围将你包围，没有银幕边框。",
      },
      {
        title: "48 米穹顶",
        body: "高 15 米、直径 48 米，每场约 30 分钟，以波兰语放映。",
      },
    ],

    galleryTitle: "走进场馆",
    galleryIntro: "整个穹顶就是银幕：360° 画面填满观众的整个视野。",

    ticketsTitle: "Kino 360 影院门票",
    ticketsTagline: "每场放映约 30 分钟，以波兰语呈现。",
    ticketBadge: "Kino 360 影院",
    ticketIncludes: [
      "穹顶内的 360° 全穹顶放映",
      "时长约 30 分钟",
      "以波兰语放映",
      "每场最多 150 个座位",
    ],
    priceNormalLabel: "全价票",
    priceNormalValue: "49 PLN",
    priceReducedLabel: "优惠票",
    priceReducedValue: "39 PLN",
    ticketCta: "购票",
  },
};

function RedDivider() {
  return (
    <div className="relative mx-auto h-px w-full max-w-5xl" aria-hidden="true">
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-[#f7486c]/60 to-transparent"
        style={{ boxShadow: "0 0 16px rgba(247,72,108,0.45)" }}
      />
    </div>
  );
}

export default function K360Content() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];

  // Hero slideshow, jedno zdjęcie naraz, cross-fade między dwoma kadrami.
  const [heroIndex, setHeroIndex] = useState(0);
  /* Drugi kadr wisiał w drzewie od pierwszej klatki — niewidoczny (opacity 0),
     ale w kadrze, więc `loading="lazy"` nic by nie dało i przeglądarka
     pobierała go razem z pierwszym. Dwa pliki po 2400 px konkurowały o pasmo
     w chwili, która decyduje o LCP. Teraz dokłada się sekundę przed pierwszą
     zmianą, a przy „ogranicz ruch" (pokaz slajdów nie rusza) nie pobiera się
     wcale. */
  const [drugiKadrGotowy, setDrugiKadrGotowy] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dokladka = window.setTimeout(() => setDrugiKadrGotowy(true), 3500);
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => {
      window.clearTimeout(dokladka);
      window.clearInterval(id);
    };
  }, []);

  // Lightbox galerii, klik w zdjęcie otwiera je powiększone.
  const [lightbox, setLightbox] = useState<number | null>(null);
  useEffect(() => {
    if (lightbox === null || typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % GALLERY_IMAGES.length));
      else if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  useEffect(() => {
    document.body.classList.add("k360-route-active");
    return () => {
      document.body.classList.remove("k360-route-active");
    };
  }, []);

  // Scroll-reveal: elementy z klasą .wpk-reveal pojawiają się przy wjeżdżaniu w kadr.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".wpk-reveal"));
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loc]);

  const bookingHref = buildBookingPath(loc, {
    service: K360_BOOKING_SERVICES.normal,
  });

  const promo = PROMO_PACKAGES[loc][0];

  return (
    <main className="k360-page relative z-10 min-h-screen overflow-x-clip">
      {/* ===== HERO (czerwony, pełny ekran, pod navbar) ===== */}
      <section className="relative -mt-[84px] min-h-[100svh] w-full sm:-mt-[96px]">
        {/* Zwykły <img>, a nie next/image: przy `images.unoptimized` (eksport
            statyczny) next/image i tak nie wygeneruje `srcset`, a bez niego
            telefon pobiera plik dla czterokrotnego retiny. */}
        {HERO_IMAGES.map((kadr, i) =>
          i === 0 || drugiKadrGotowy ? (
            <img
              key={kadr.src}
              src={kadr.src}
              srcSet={kadr.srcSet}
              sizes="100vw"
              alt="Wnętrze kopuły Kina 360 w Alvernia Planet"
              width={2400}
              height={1800}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
                i === heroIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null,
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,5,16,0.62)_0%,rgba(8,5,16,0.32)_42%,rgba(8,5,16,0.95)_100%)]" />

        <div className="ap-page-intro-stagger relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-end px-4 pb-28 pt-24 text-center sm:pb-[11rem] lg:pb-[15rem]">
          <div className="relative mb-5 inline-flex flex-col items-center">
            {/* Korona spada z góry i ląduje na górnej krawędzi boxa */}
            <SolarIcon
              name="crown"
              weight="fill"
              className="ap-crown-drop absolute -top-[3.5rem] left-1/2 z-10 h-[3.6rem] w-[3.6rem] text-[#f5b301] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] sm:-top-[4.5rem] sm:h-[4.5rem] sm:w-[4.5rem]"
            />
            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#f5b301,#fcd34d)] px-3.5 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#231903] shadow-[0_6px_18px_rgba(251,191,36,0.45)] ring-1 ring-black/10 sm:px-6 sm:py-2.5 sm:text-[0.95rem] sm:tracking-[0.2em]">
              {t.europeBadge}
            </span>
          </div>
          <h1 className="ap-type-hero-title force-overlay drop-shadow-[0_0_30px_rgba(0,0,0,0.65)] [text-shadow:0_3px_16px_rgba(0,0,0,0.55)] !text-[clamp(3.2rem,12vw,4.6rem)] lg:!text-[clamp(5.5rem,3rem+5vw,8rem)]">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] sm:text-xl lg:max-w-none lg:whitespace-nowrap lg:text-[1.6rem]">
            {t.heroTagline}
          </p>

          <div className="mt-5 flex w-full flex-row flex-wrap items-center justify-center gap-2 sm:mt-9 sm:gap-3">
            <PrimaryButton
              href={bookingHref}
              size="lg"
              className="ticket-pill !text-[#04222a] whitespace-nowrap !px-5 !py-1.5 !text-xs !bg-[#56ddea] !font-extrabold ring-[color:rgba(86,221,234,0.6)] hover:!brightness-110 sm:!px-6 sm:!py-2.5 sm:!text-base sm:min-w-[12rem]"
            >
              {t.heroCtaPrimary}
            </PrimaryButton>
            <a
              href="#repertuar"
              className="inline-flex items-center justify-center gap-1.5 rounded-[var(--ap-btn-radius)] border border-white/25 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:border-[#ff96aa]/60 hover:bg-white/12 sm:gap-2 sm:px-6 sm:py-2.5 sm:text-sm"
            >
              {t.heroCtaSecondary}
              <span aria-hidden="true">↓</span>
            </a>
          </div>

        </div>

        {/* Kropki slideshow, pokazują liczbę zdjęć i aktywne (klikalne) */}
        <div className="absolute inset-x-0 bottom-[4.75rem] z-20 flex justify-center gap-2.5 sm:bottom-[5.75rem]">
          {HERO_IMAGES.map((kadr, i) => (
            <button
              key={kadr.src}
              type="button"
              onClick={() => setHeroIndex(i)}
              aria-label={`Pokaż zdjęcie ${i + 1}`}
              aria-current={i === heroIndex}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === heroIndex
                  ? "w-7 bg-[#f7486c] shadow-[0_0_12px_rgba(247,72,108,0.75)]"
                  : "w-2 bg-white/45 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Usunięto dolny pasek hero: przewijany ticker „PRZEŻYJ FILM" (rozpraszał)
            oraz pasek statystyk (Kopuła 48 m / Wysokość 15 m / Seans ~30 min) — te
            same dane są niżej w sekcji „Nie oglądasz. Jesteś w środku.". */}
      </section>

      <div className="space-y-16 px-3 py-14 sm:space-y-24 sm:px-6 sm:py-20 lg:px-12">
        {/* ===== CZYM JEST KINO 360 ===== */}
        <ScrollMotionItem strength="soft" delay={40} float={false} className="wpk-reveal">
          <section id="kino-360" className="ap-shell grid items-center gap-8 scroll-mt-24 text-center lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:text-left">
            <h2 className="text-[clamp(1.85rem,5vw,4rem)] font-extrabold leading-[1.0] tracking-[-0.04em] text-white">
              <span className="block whitespace-nowrap text-[clamp(2.1rem,6.4vw,4.65rem)] leading-[0.95]">{t.aboutTitleLead}</span>
              <span className="block whitespace-nowrap bg-[linear-gradient(120deg,#f7486c,#ff96aa)] bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text" }}>
                {t.aboutTitleAccent}
              </span>
            </h2>
            <div className="space-y-5">
              <p className="text-lg font-semibold text-white sm:text-xl">{t.aboutLead}</p>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-white/72 sm:text-lg lg:mx-0">{t.aboutBody}</p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-1 lg:justify-start">
                {t.aboutHighlights.map((h) => (
                  <span key={h} className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffc1cb] sm:text-base">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f7486c] shadow-[0_0_10px_rgba(247,72,108,0.7)]" />
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </ScrollMotionItem>

        {/* ===== REPERTUAR ===== */}
        <ScrollMotionItem strength="soft" delay={30} float={false} className="wpk-reveal">
          <RepertoireSection />
        </ScrollMotionItem>

        {/* ===== 3 KLUCZOWE ATUTY ===== */}
        <ScrollMotionItem strength="soft" delay={30} float={false} className="wpk-reveal">
          <section className="ap-shell">
            <div className="text-center">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[#ff7a92]/85 sm:text-[0.72rem] sm:tracking-[0.28em]">
                {t.highlightsTitle}
              </p>
            </div>
            <div className="mt-7 grid gap-4 sm:gap-5 lg:grid-cols-3">
              {t.highlights.map((h, index) => {
                const isCrown = index === 0;
                return (
                  <div
                    key={h.title}
                    className={`ap-tile ap-tile-lg relative overflow-hidden px-5 py-6 sm:px-6 sm:py-7 ${
                      isCrown
                        ? "shadow-[inset_0_0_0_1.5px_rgba(245,179,1,0.55),0_18px_50px_rgba(0,0,0,0.45),0_0_22px_rgba(245,179,1,0.14)]"
                        : ""
                    }`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 ${
                        isCrown
                          ? "bg-[radial-gradient(circle_at_top_right,rgba(245,179,1,0.16),transparent_45%)]"
                          : "bg-[radial-gradient(circle_at_top_right,rgba(247,72,108,0.14),transparent_42%)]"
                      }`}
                    />
                    {isCrown && (
                      <SolarIcon
                        name="crown"
                        weight="fill"
                        className="pointer-events-none absolute right-5 top-5 h-6 w-6 text-[#f5b301] drop-shadow-[0_2px_6px_rgba(245,179,1,0.45)] sm:h-7 sm:w-7"
                      />
                    )}
                    <div className="relative">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                          isCrown
                            ? "border-[#f5b301]/55 bg-[#f5b301]/12 text-[#f5d97a] shadow-[0_0_18px_rgba(245,179,1,0.35)]"
                            : "border-[#ff96aa]/40 bg-[#ff96aa]/12 text-[#ff96aa] shadow-[0_0_18px_rgba(247,72,108,0.3)]"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-4 text-lg font-bold leading-tight text-white sm:text-xl">{h.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/72 sm:text-base">{h.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </ScrollMotionItem>

        {/* ===== GALERIA ===== */}
        <ScrollMotionItem strength="soft" delay={30} float={false} className="wpk-reveal">
          <section className="ap-shell">
            <div className="text-center">
              <h2 className="text-pretty text-[clamp(1.9rem,6vw,3.8rem)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
                {t.galleryTitle}
              </h2>
              <div className="mx-auto mt-4 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#f7486c] to-[#ff96aa]" />
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{t.galleryIntro}</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {GALLERY_IMAGES.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightbox(index)}
                  aria-label={`Powiększ zdjęcie ${index + 1}`}
                  className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl ring-1 ring-[#f7486c]/30 shadow-[0_18px_50px_rgba(0,0,0,0.45),0_0_24px_rgba(247,72,108,0.18)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7486c]"
                >
                  <img
                    src={miniatura(src)}
                    srcSet={`${miniatura(src)} 760w, ${src} 1600w`}
                    sizes="(min-width: 640px) 33vw, 50vw"
                    alt={`Kino 360, kadr ${index + 1}`}
                    width={760}
                    height={570}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <span className="pointer-events-none absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                    <SolarIcon name="zoom-in" size={14} weight="bold" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </ScrollMotionItem>

        <RedDivider />

        {/* ===== BILETY (czerwone) ===== */}
        <ScrollMotionItem strength="soft" delay={30} float={false} className="wpk-reveal">
          <section className="ap-shell">
            <div className="text-center">
              <h2 className="text-pretty text-[clamp(1.9rem,6vw,3.8rem)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
                {t.ticketsTitle}
              </h2>
              <div className="mx-auto mt-4 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#f7486c] to-[#ff96aa]" />
              <p className="mx-auto mt-5 max-w-2xl text-base text-white/72 sm:text-lg">{t.ticketsTagline}</p>
            </div>

            <div className="mx-auto mt-9 flex max-w-5xl flex-col gap-6">
              {/* Bilet na Kino 360, na górze */}
              <div className="relative w-full overflow-hidden rounded-[1.75rem]" style={TICKET_STUB_STYLE}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,72,108,0.2),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(247,72,108,0.12),transparent_38%)]" />
                <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                  <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
                    <AttractionPortal attraction="kino360" className="w-36 shrink-0 sm:w-44" />
                    <div className="space-y-4">
                    <span className="ticket-card-badge mx-auto sm:mx-0">
                      {t.ticketBadge}
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">{t.heroTitle}</h3>
                    <ul className="mx-auto max-w-md space-y-2 text-left lg:mx-0">
                      {t.ticketIncludes.map((inc) => (
                        <li key={inc} className="flex gap-2.5 text-sm text-white/78 sm:text-base">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f7486c] shadow-[0_0_10px_rgba(247,72,108,0.6)]" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                    </div>
                  </div>

                  <div
                    className="h-px w-full lg:hidden"
                    style={{ backgroundImage: "repeating-linear-gradient(to right, rgba(255,255,255,0.3) 0 6px, transparent 6px 12px)" }}
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute bottom-8 top-8 hidden lg:block"
                    style={{
                      left: "calc(100% - 18.5rem)",
                      width: "1px",
                      backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.28) 0 6px, transparent 6px 12px)",
                    }}
                    aria-hidden="true"
                  />

                  <div className="flex w-full flex-col items-center gap-4 lg:w-[15.5rem]">
                    <div className="grid w-full grid-cols-2 gap-3">
                      <div className="text-center">
                        <p className="text-[0.58rem] uppercase tracking-[0.16em] text-white/55">{t.priceNormalLabel}</p>
                        <p className="mt-1 text-lg font-extrabold leading-tight text-white sm:text-xl">{t.priceNormalValue}</p>
                      </div>
                      <div className="border-l border-white/10 pl-3 text-center">
                        <p className="text-[0.58rem] uppercase tracking-[0.16em] text-white/55">{t.priceReducedLabel}</p>
                        <p className="mt-1 text-lg font-extrabold leading-tight text-[#ffc1cb] sm:text-xl">{t.priceReducedValue}</p>
                      </div>
                    </div>
                    <PrimaryButton
                      href={bookingHref}
                      size="lg"
                      className="ticket-pill w-full whitespace-nowrap !bg-[#56ddea] !text-[#04222a] !font-extrabold ring-[color:rgba(86,221,234,0.6)] hover:!brightness-110"
                    >
                      {t.ticketCta}
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              {/* Bilet na wszystkie atrakcje, wspólny komponent (1:1 jak na home), pod spodem */}
              <AllAttractionsBundleBar promo={promo} locale={loc} />
            </div>
          </section>
        </ScrollMotionItem>
      </div>

      {/* Lightbox galerii, powiększone zdjęcie */}
      {lightbox !== null && typeof document !== "undefined" &&
        createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Zamknij"
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20 sm:right-5 sm:top-5"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length));
            }}
            aria-label="Poprzednie zdjęcie"
            className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl leading-none text-white transition hover:bg-white/20 sm:left-5"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i + 1) % GALLERY_IMAGES.length));
            }}
            aria-label="Następne zdjęcie"
            className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl leading-none text-white transition hover:bg-white/20 sm:right-5"
          >
            ›
          </button>
          <div className="relative h-[78vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={GALLERY_IMAGES[lightbox]}
              alt={`Kino 360, kadr ${lightbox + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>,
        document.body,
      )}
    </main>
  );
}
