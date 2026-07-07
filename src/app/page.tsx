"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { AttractionCard } from "@/app/components/AttractionCard";
import { FaFilm, FaRocket, FaStar, FaTicket } from "react-icons/fa6";
import { NEWS_COPY, NewsSectionBlock, type NewsSection } from "@/app/components/newsContent";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { FaqAccordion, FAQ_COPY } from "@/app/components/faqContent";
import { waitForImagesReady } from "@/app/components/waitForImagesReady";
import {
  ALL_ATTRACTIONS_BOOKING_CATEGORY,
  ALL_ATTRACTIONS_BOOKING_SERVICES,
  buildBookingPath,
  FILM_PATH_BOOKING_CATEGORY,
  FILM_PATH_BOOKING_SERVICES,
  K360_BOOKING_CATEGORY,
  K360_BOOKING_SERVICES,
  MARS_BOOKING_CATEGORY,
  MARS_BOOKING_SERVICES,
} from "@/lib/booking";
import { PROMO_PACKAGES } from "@/lib/promoPackages";
import { getSitePaths } from "@/lib/localizedRoutes";

type Locale = "pl" | "en" | "pt";

type AttractionItem = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  accent?: "red" | "orange" | "cyan";
  highlightLabel?: string;
  cornerLabel?: string;
  featured?: boolean;
};

type TicketOption = {
  badge: string;
  title: string;
  titleLead?: string;
  titleHighlight?: string;
  bgColor?: string;
  subtitle: string;
  details: string[];
  priceLabel?: string;
  price?: string;
  reducedPriceLabel?: string;
  reducedPrice?: string;
  bookingServiceName?: string;
  bookingCategory?: string;
  bookingQuantity?: number;
  accent?: "red" | "orange" | "cyan";
  href?: string;
  ctaLabel?: string;
  comingSoon?: boolean;
};

type PromoTicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  priceLabel: string;
  price: string;
  savings: string;
  savingsBadge: string;
  button: string;
};

type TicketSection = {
  title: string;
  intro: string;
  headerCta: string;
  headerCtaSub: string;
  priceLabel: string;
  price: string;
  cta: string;
  ctaHref: string;
  promoTicket: PromoTicketOption;
  options: TicketOption[];
};

type PromoTile = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  images: string[];
  imageAlt: string;
};

type HeroPromo = {
  message: string;
  cta: string;
  href: string;
  tone: "cool" | "hot";
  previewMedia?: "k360";
};

type HomeCopy = {
  heroTitle: string;
  heroEuropeBadge: string;
  heroTagline: string;
  heroPromos: HeroPromo[];
  attractions: {
    title: string;
    intro: string;
    items: AttractionItem[];
  };
  tickets: TicketSection;
  eventsPromo: PromoTile;
  news: NewsSection;
};

const HOME_COPY: Record<Locale, HomeCopy> = {
  pl: {
    heroTitle: "Kino 360",
    heroEuropeBadge: "Największe w Europie",
    heroTagline: "Witamy!",
    heroPromos: [
      {
        message: "Przeżyj kino K360",
        cta: "Zobacz kino K360",
        href: "/atrakcje/kino-360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Atrakcje",
      intro: "Trzy filmowe atrakcje dla całej rodziny, coś dla małych odkrywców i dorosłych kinomanów.",
      items: [
        {
          title: "FILMWORLD",
          description:
            "Zakulisowa trasa przez plany zdjęciowe, rekwizyty i technologię używaną w produkcjach filmowych.",
          cta: "Poznaj ścieżkę filmową",
          href: "/atrakcje/filmworld",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Elementy scenografii na ścieżce filmowej",
          accent: "cyan",
          cornerLabel: "Poznaj",
        },
        {
          title: "Kino 360",
          description:
            "NAJWIĘKSZE kino 360 w Europie. Kopuła o średnicy 48 metrów otacza widza obrazem i dźwiękiem ze wszystkich stron.",
          cta: "Zobacz kino K360",
          href: "/atrakcje/kino-360",
          image: "/galeria/K360/K360_2.webp",
          imageAlt: "Kadr z kina K360, fulldome na całej kopule",
          accent: "red",
          highlightLabel: "Największe w Europie",
          cornerLabel: "Przeżyj",
          featured: true,
        },
        {
          title: "MARS",
          description:
            "Wciel się w bohatera własnej misji i nakręć krótki film na profesjonalnej scenografii marsjańskiej.",
          cta: "Odkryj MARS",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronauta na powierzchni Marsa, MARS w Alvernia Planet",
          accent: "orange",
          cornerLabel: "Zagraj",
        },
      ],
    },
    tickets: {
      title: "Bilety",
      intro:
        "Wybierz atrakcję i kup bilet bezpośrednio na jej podstronie.",
      headerCta: "Trzy atrakcje, jeden krok do rezerwacji",
      headerCtaSub: "K360, MARS i FILMWORLD. Każda ma własną sprzedaż biletów.",
      priceLabel: "Cena za osobę",
      price: "79 zł/os. lub 69 zł/os.",
      cta: "Kup bilet",
      ctaHref: "/rezerwuj",
      promoTicket: {
        badge: "Pakiet",
        title: "Ścieżka + Kino 360",
        subtitle:
          "Jeden duży pakiet promocyjny, który łączy zwiedzanie Ścieżki filmowej z projekcją K360.",
        details: ["Około 3 godzin łącznie ze zwiedzaniem i seansem"],
        priceLabel: "Cena promocyjna",
        price: "119,00 zł",
        savings: "Oszczędzasz 9,00 zł",
        savingsBadge: "7% taniej",
        button: "Wybierz pakiet",
      },
      options: [
        {
          badge: "K360",
          title: "Kino 360",
          subtitle: "Największe kino 360 w Europie, kopuła 48 m.",
          details: ["Cena regularna za osobę"],
          price: "49 zł/os.",
          reducedPriceLabel: "Cena ulgowa",
          reducedPrice: "39 zł/os.",
          bookingCategory: K360_BOOKING_CATEGORY,
          bookingServiceName: K360_BOOKING_SERVICES.normal,
          accent: "red",
          ctaLabel: "Kup bilet",
        },
        {
          badge: "MARS",
          title: "MARS",
          subtitle: "Wcielasz się w astronautę i kręcisz własny film SF.",
          details: ["Cena regularna za osobę"],
          price: "69 zł/os.",
          reducedPriceLabel: "Cena ulgowa",
          reducedPrice: "59 zł/os.",
          bookingCategory: MARS_BOOKING_CATEGORY,
          bookingServiceName: MARS_BOOKING_SERVICES.normal,
          accent: "orange",
          ctaLabel: "Wybierz bilet",
        },
        {
          badge: "Kopuła",
          title: "FILMWORLD",
          subtitle: "Zwiedź tajemnicze kopuły pod Krakowem i poznaj film zza kulis.",
          details: ["Cena regularna za osobę"],
          price: "79 zł/os.",
          reducedPriceLabel: "Cena ulgowa",
          reducedPrice: "69 zł/os.",
          bookingCategory: FILM_PATH_BOOKING_CATEGORY,
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
          accent: "cyan",
          ctaLabel: "Kup bilet",
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Wydarzenia",
      title: "Wyjątkowe miejsce na Twój event",
      description:
        "Wyjątkowe przestrzenie do konferencji, gal i premier. Sprawdź możliwości organizacji eventów w Alvernia Planet.",
      cta: "Odkryj wydarzenia",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Przestrzeń eventowa Alvernia Planet podczas konferencji",
    },
    news: NEWS_COPY.pl,
  },
  en: {
    heroTitle: "K360 Cinema",
    heroEuropeBadge: "Largest in Europe",
    heroTagline: "Welcome!",
    heroPromos: [
      {
        message: "Experience the K360 Cinema",
        cta: "See K360 Cinema",
        href: "/atrakcje/kino-360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Attractions",
      intro: "Three cinematic attractions for the whole family, something for young explorers and grown-up film fans alike.",
      items: [
        {
          title: "FILMWORLD",
          description:
            "A behind-the-scenes walk through sets, props, and the technology that powers productions.",
          cta: "Explore the film path",
          href: "/atrakcje/filmworld",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Film set elements on the film path",
          accent: "cyan",
          cornerLabel: "Discover",
        },
        {
          title: "K360 Cinema",
          description:
            "EUROPE'S LARGEST 360° cinema. A 48-metre dome wraps you in image and sound from every direction.",
          cta: "See K360 Cinema",
          href: "/atrakcje/kino-360",
          image: "/galeria/K360/K360_2.webp",
          imageAlt: "Frame from the K360 Cinema, fulldome across the ceiling",
          accent: "red",
          highlightLabel: "Largest in Europe",
          cornerLabel: "Experience",
          featured: true,
        },
        {
          title: "MARS",
          description:
            "Step into your own mission and shoot a short film on a professional Martian set.",
          cta: "Discover MARS",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronaut on the Martian surface, MARS at Alvernia Planet",
          accent: "orange",
          cornerLabel: "Play",
        },
      ],
    },
    tickets: {
      title: "Tickets",
      intro: "Pick an attraction and buy tickets directly on its page.",
      headerCta: "Three attractions, one step to booking",
      headerCtaSub: "K360, MARS and FILMWORLD. Each has its own ticket flow.",
      priceLabel: "Price per person",
      price: "79 PLN/person or 69 PLN/person",
      cta: "Buy tickets",
      ctaHref: "/en/reserve",
      promoTicket: {
        badge: "Package",
        title: "Film Path + K360 Cinema",
        subtitle:
          "One large promotional package that combines the Film Path visit with a K360 Cinema.",
        details: ["About 3 hours in total with the visit and screening"],
        priceLabel: "Promo price",
        price: "119.00 PLN",
        savings: "You save 9.00 PLN",
        savingsBadge: "7% off",
        button: "Choose package",
      },
      options: [
        {
          badge: "K360",
          title: "K360 Cinema",
          subtitle: "Europe's largest 360° cinema, a 48-metre dome.",
          details: ["Standard price per person"],
          price: "49 PLN/person",
          reducedPriceLabel: "Reduced price",
          reducedPrice: "39 PLN/person",
          bookingCategory: K360_BOOKING_CATEGORY,
          bookingServiceName: K360_BOOKING_SERVICES.normal,
          accent: "red",
          ctaLabel: "Buy tickets",
        },
        {
          badge: "MARS",
          title: "MARS",
          subtitle: "Play the astronaut and shoot your own sci-fi short.",
          details: ["Standard price per person"],
          price: "69 PLN/person",
          reducedPriceLabel: "Reduced price",
          reducedPrice: "59 PLN/person",
          bookingCategory: MARS_BOOKING_CATEGORY,
          bookingServiceName: MARS_BOOKING_SERVICES.normal,
          accent: "orange",
          ctaLabel: "Choose ticket",
        },
        {
          badge: "Dome",
          title: "FILMWORLD",
          subtitle: "Explore the mysterious domes near Kraków and discover film from behind the scenes.",
          details: ["Standard price per person"],
          price: "79 PLN/person",
          reducedPriceLabel: "Reduced price",
          reducedPrice: "69 PLN/person",
          bookingCategory: FILM_PATH_BOOKING_CATEGORY,
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
          accent: "cyan",
          ctaLabel: "Buy tickets",
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Events",
      title: "A unique venue for your event",
      description:
        "Exceptional spaces for conferences, galas, and premieres. Discover what events you can host at Alvernia Planet.",
      cta: "Explore events",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Event space at Alvernia Planet during a conference",
    },
    news: NEWS_COPY.en,
  },
  pt: {
    heroTitle: "Cinema K360",
    heroEuropeBadge: "O maior da Europa",
    heroTagline: "Bem-vindos!",
    heroPromos: [
      {
        message: "Vive a cinema K360",
        cta: "Ver a cinema K360",
        href: "/atrakcje/kino-360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Atrações",
      intro: "Três atrações num só sítio: descobre os bastidores do cinema, vê um filme dentro de uma cúpula gigante e protagoniza a tua cena num plano real.",
      items: [
        {
          title: "FILMWORLD",
          description:
            "Uma visita aos bastidores com cenários, adereços e tecnologia usada nas produções.",
          cta: "Conheça o percurso",
          href: "/atrakcje/filmworld",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Elementos de cenário no percurso de filmagem",
          accent: "cyan",
          cornerLabel: "Descobre",
        },
        {
          title: "Cinema K360",
          description:
            "O MAIOR cinema 360° da Europa. Uma cúpula de 48 metros envolve-te em imagem e som por todos os lados.",
          cta: "Ver a cinema K360",
          href: "/atrakcje/kino-360",
          image: "/galeria/K360/K360_2.webp",
          imageAlt: "Imagem da cinema K360, fulldome em toda a cúpula",
          accent: "red",
          highlightLabel: "O maior da Europa",
          cornerLabel: "Vive",
          featured: true,
        },
        {
          title: "MARS",
          description:
            "Encarna o herói da tua missão e filma uma curta numa cenografia marciana profissional.",
          cta: "Descobrir MARS",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronauta na superfície de Marte, MARS na Alvernia Planet",
          accent: "orange",
          cornerLabel: "Joga",
        },
      ],
    },
    tickets: {
      title: "Bilhetes",
      intro: "Escolhe uma atração e compra o bilhete diretamente na sua página.",
      headerCta: "Três atrações, um passo até à reserva",
      headerCtaSub: "K360, MARS e FILMWORLD, cada um com a sua venda.",
      priceLabel: "Preço por pessoa",
      price: "79 PLN/pessoa ou 69 PLN/pessoa",
      cta: "Comprar bilhetes",
      ctaHref: "/pt/reservar",
      promoTicket: {
        badge: "Pacote",
        title: "Percurso + Cinema K360",
        subtitle:
          "Um grande pacote promocional que junta a visita ao Percurso de filmagem com a projeção no K360.",
        details: ["Cerca de 3 horas no total com visita e sessão"],
        priceLabel: "Preço promocional",
        price: "119,00 PLN",
        savings: "Poupa 9,00 PLN",
        savingsBadge: "7% menos",
        button: "Escolher pacote",
      },
      options: [
        {
          badge: "K360",
          title: "Cinema K360",
          subtitle: "O maior cinema 360° da Europa, cúpula de 48 m.",
          details: ["Preço normal por pessoa"],
          price: "49 PLN/pessoa",
          reducedPriceLabel: "Preço reduzido",
          reducedPrice: "39 PLN/pessoa",
          bookingCategory: K360_BOOKING_CATEGORY,
          bookingServiceName: K360_BOOKING_SERVICES.normal,
          accent: "red",
          ctaLabel: "Comprar bilhete",
        },
        {
          badge: "MARS",
          title: "MARS",
          subtitle: "Encarnas um astronauta e filmas a tua curta de FC.",
          details: ["Preço normal por pessoa"],
          price: "69 PLN/pessoa",
          reducedPriceLabel: "Preço reduzido",
          reducedPrice: "59 PLN/pessoa",
          bookingCategory: MARS_BOOKING_CATEGORY,
          bookingServiceName: MARS_BOOKING_SERVICES.normal,
          accent: "orange",
          ctaLabel: "Escolher bilhete",
        },
        {
          badge: "Cúpula",
          title: "FILMWORLD",
          subtitle: "Visita as misteriosas cúpulas perto de Cracóvia e descobre o cinema nos bastidores.",
          details: ["Preço normal por pessoa"],
          price: "79 PLN/pessoa",
          reducedPriceLabel: "Preço reduzido",
          reducedPrice: "69 PLN/pessoa",
          bookingCategory: FILM_PATH_BOOKING_CATEGORY,
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
          accent: "cyan",
          ctaLabel: "Comprar bilhete",
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Eventos",
      title: "Um espaço único para o seu evento",
      description:
        "Espaços excepcionais para conferências, galas e estreias. Descubra o potencial da Alvernia Planet para eventos.",
      cta: "Explorar eventos",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Espaço de eventos da Alvernia Planet durante uma conferência",
    },
    news: NEWS_COPY.pt,
  },
};

const HERO_WELCOME_AUTO_HIDE_MS = 2500;
const HERO_WELCOME_FADE_DURATION_MS = 1200;
const HERO_PROMO_DELAY_MS = 2000;
const HERO_PROMO_FADE_DURATION_MS = 700;
const HERO_PREVIEW_REVEAL_DURATION_MS = 980;
const EVENTS_PROMO_ROTATION_MS = 5200;
const EVENTS_PROMO_FADE_MS = 2400;

export default function Page() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = HOME_COPY[loc];
  const [introReady, setIntroReady] = useState(false);
  const [secondaryAnimationsReady, setSecondaryAnimationsReady] = useState(false);
  const [heroWelcomeVisible, setHeroWelcomeVisible] = useState(true);
  const heroVideoFallback =
    loc === "en"
      ? "Your browser does not support the video element."
      : loc === "pt"
      ? "O seu navegador não suporta o elemento de vídeo."
      : "Twój browser nie wspiera elementu video.";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroReady(true);
      setSecondaryAnimationsReady(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIntroReady(true);
    });
    let idleTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleCallbackId: number | null = null;
    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const startSecondary = () => setSecondaryAnimationsReady(true);
    if (typeof win.requestIdleCallback === "function") {
      idleCallbackId = win.requestIdleCallback(startSecondary, { timeout: 1800 });
    } else {
      idleTimeoutId = globalThis.setTimeout(startSecondary, 1100);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      if (idleCallbackId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleCallbackId);
      }
      if (idleTimeoutId !== null) {
        window.clearTimeout(idleTimeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const timer = window.setTimeout(() => {
      setHeroWelcomeVisible(false);
    }, HERO_WELCOME_AUTO_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const history = window.history;
    if (history && "scrollRestoration" in history) {
      const previous = history.scrollRestoration;
      history.scrollRestoration = "manual";
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
      return () => {
        history.scrollRestoration = previous;
      };
    }
  }, []);

  return (
    <main className="relative min-h-screen text-white">
      <HeroSection
        heroTitle={copy.heroTitle}
        heroEuropeBadge={copy.heroEuropeBadge}
        heroTagline={copy.heroTagline}
        heroVideoFallback={heroVideoFallback}
        introReady={introReady}
        heroWelcomeVisible={heroWelcomeVisible}
        locale={loc}
      />
      <div className="relative z-10 -mt-10 rounded-t-[2rem] bg-[var(--ap-bg)] px-4 pt-16 pb-10 shadow-[0_-28px_60px_rgba(0,0,0,0.55)] sm:-mt-14 sm:rounded-t-[2.75rem] sm:pt-20 sm:pb-14 lg:-mt-16 lg:pt-24 lg:pb-12">
        <HomeContent
          introReady={introReady}
          attractions={copy.attractions}
          tickets={copy.tickets}
          eventsPromo={copy.eventsPromo}
          news={copy.news}
          secondaryAnimationsReady={secondaryAnimationsReady}
          locale={loc}
        />
      </div>
    </main>
  );
}

const HERO_NAV_LABELS: Record<
  Locale,
  {
    attractions: string;
    about: string;
    route: string;
    buy: string;
    learnMore: string;
    promoEyebrow: string;
    promoMain: string;
    promoMainPre: string;
    promoMainHighlight: string;
    promoMainPost: string;
    promoMainEurope: string;
    promoMainTail: string;
    promoMainLine2: string;
  }
> = {
  pl: {
    attractions: "Sprawdź atrakcje",
    about: "Informacje",
    route: "Jak dojechać",
    buy: "Kup bilet",
    learnMore: "Dowiedz się więcej",
    promoEyebrow: "Promocja • do 30.06",
    promoMain: "Przeżyj największe kino 360 w Europie! Bilety już od 39 zł",
    promoMainPre: "Przeżyj ",
    promoMainHighlight: "NAJWIĘKSZE KINO 360",
    promoMainPost: " w Europie! Bilety już od 39 zł",
    promoMainEurope: "w Europie",
    promoMainTail: "!",
    promoMainLine2: "Bilety już od 39 zł",
  },
  en: {
    attractions: "See attractions",
    about: "Information",
    route: "How to get there",
    buy: "Buy ticket",
    learnMore: "Learn more",
    promoEyebrow: "Offer • until 30.06",
    promoMain: "Experience the largest 360° cinema in Europe! Tickets from 39 PLN",
    promoMainPre: "Experience the ",
    promoMainHighlight: "LARGEST 360° CINEMA",
    promoMainPost: " in Europe! Tickets from 39 PLN",
    promoMainEurope: "in Europe",
    promoMainTail: "!",
    promoMainLine2: "Tickets from 39 PLN",
  },
  pt: {
    attractions: "Ver atrações",
    about: "Informações",
    route: "Como chegar",
    buy: "Comprar bilhete",
    learnMore: "Saber mais",
    promoEyebrow: "Promoção • até 30.06",
    promoMain: "Vive o maior cinema 360° da Europa! Bilhetes desde 39 PLN",
    promoMainPre: "Vive o ",
    promoMainHighlight: "MAIOR CINEMA 360°",
    promoMainPost: " da Europa! Bilhetes desde 39 PLN",
    promoMainEurope: "da Europa",
    promoMainTail: "!",
    promoMainLine2: "Bilhetes desde 39 PLN",
  },
};

const HeroSection = memo(function HeroSection({
  heroTitle,
  heroEuropeBadge,
  heroTagline,
  heroVideoFallback,
  introReady,
  heroWelcomeVisible,
  locale,
}: {
  heroTitle: string;
  heroEuropeBadge: string;
  heroTagline: string;
  heroVideoFallback: string;
  introReady: boolean;
  heroWelcomeVisible: boolean;
  locale: Locale;
}) {
  const paths = getSitePaths(locale);
  const navLabels = HERO_NAV_LABELS[locale];
  const heroBookingHref = buildBookingPath(locale, {
    category: ALL_ATTRACTIONS_BOOKING_CATEGORY,
    service: ALL_ATTRACTIONS_BOOKING_SERVICES.reduced,
    autopick: true,
  });
  const pinRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<HTMLDivElement | null>(null);
  const shadeRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const [videoActive, setVideoActive] = useState(true);
  const videoActiveRef = useRef(true);
  const heroHiddenRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / viewportHeight, 0), 1);

      // Hero is position:fixed, so AdaptiveVideo's IntersectionObserver can't
      // tell when it's covered. Drive playback from scroll instead.
      const shouldBeActive = progress < 0.98;
      if (shouldBeActive !== videoActiveRef.current) {
        videoActiveRef.current = shouldBeActive;
        setVideoActive(shouldBeActive);
      }

      // Once fully covered, hide the pinned layer so the fixed video can't
      // bleed through transparent gaps below (e.g. between content and footer).
      const shouldHide = progress >= 0.995;
      if (shouldHide !== heroHiddenRef.current) {
        heroHiddenRef.current = shouldHide;
        if (pinRef.current) {
          pinRef.current.style.visibility = shouldHide ? "hidden" : "visible";
        }
      }

      if (!motionEnabled) return;

      const eased = progress * progress * (3 - 2 * progress);

      if (zoomRef.current) {
        zoomRef.current.style.transform = `scale(${(1 + eased * 0.16).toFixed(4)})`;
      }
      if (shadeRef.current) {
        shadeRef.current.style.opacity = Math.min(eased * 1.05, 0.82).toFixed(3);
      }
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(0, ${(eased * 80).toFixed(2)}px, 0)`;
        parallaxRef.current.style.opacity = Math.max(1 - progress * 1.4, 0).toFixed(3);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="relative z-0 -mt-24 h-[calc(100svh+6rem)] min-h-[calc(100dvh+6rem)] w-full md:-mt-28 md:h-[calc(100svh+7rem)] md:min-h-[calc(100dvh+7rem)]">
      <div
        ref={pinRef}
        className={`fixed inset-0 z-0 overflow-hidden bg-black transition-opacity duration-[1300ms] will-change-[opacity] ${
          introReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div ref={zoomRef} className="absolute inset-0 will-change-transform">
          <AdaptiveVideo
            mp4Src="/home/HOME.mp4"
            webmSrc="/home/HOME.webm"
            poster="/home/HOME_poster.webp"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            sizes="100vw"
            fallbackText={heroVideoFallback}
            priority
            rootMargin="320px 0px"
            preferPosterOnLowPower
            active={videoActive}
          />
        </div>
        <div
          className={`pointer-events-none absolute inset-0 z-[6] bg-black transition-opacity ${
            heroWelcomeVisible ? "opacity-30" : "opacity-0"
          }`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDuration: `${HERO_WELCOME_FADE_DURATION_MS}ms`,
          }}
          aria-hidden
        />
        <div
          ref={shadeRef}
          className="pointer-events-none absolute inset-0 z-[7] bg-black opacity-0 will-change-[opacity]"
          aria-hidden
        />
        <div ref={parallaxRef} className="absolute inset-0 z-20 will-change-[transform,opacity]">
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        {/* Napis hero, taki sam jak na podstronie Kina: korona + złota plakietka + „Przeżyj" + tytuł + tagline */}
        <div className="ap-page-intro-stagger flex flex-col items-center">
          {/* Korona + złota plakietka „Największe w Europie", ZAWSZE na górze, większa */}
          <div className="relative mb-1.5 inline-flex flex-col items-center sm:mb-2">
            {/* Korona spada z góry i ląduje na górnej krawędzi plakietki */}
            <svg
              className="ap-crown-drop absolute -top-[2.05rem] left-1/2 z-10 h-[2.15rem] w-[2.15rem] text-[#f5b301] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] sm:-top-[2.5rem] sm:h-[2.65rem] sm:w-[2.65rem]"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M1.5 5.2 4.4 7l1.9-4.6L8 5l1.7-2.6L11.6 7l2.9-1.8L13 12.7H3L1.5 5.2zM3 14h10v1.2H3V14z" />
            </svg>
            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#f5b301,#fcd34d)] px-3.5 py-1 text-[0.55rem] font-extrabold uppercase tracking-[0.14em] text-[#231903] shadow-[0_6px_18px_rgba(251,191,36,0.45)] ring-1 ring-black/10 sm:px-5 sm:py-1.5 sm:text-[0.67rem] sm:tracking-[0.18em]">
              {heroEuropeBadge}
            </span>
          </div>
          {/* Kino 360, duży główny napis hero (h1) */}
          <h1 className="force-overlay !leading-[0.92] mb-2 drop-shadow-[0_0_30px_rgba(0,0,0,0.65)] [text-shadow:0_3px_16px_rgba(0,0,0,0.55)] !text-[clamp(3.6rem,14vw,5.5rem)] font-extrabold tracking-[-0.02em] text-white sm:mb-3 lg:!text-[clamp(6.5rem,3rem+5.5vw,9rem)]">
            {heroTitle}
          </h1>
          {/* Witamy!: mniejszy podpis pod tytułem */}
          <p className="force-overlay leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] !text-[clamp(1.7rem,5.5vw,2.4rem)] font-extrabold tracking-[-0.01em] text-white sm:!text-[clamp(2.1rem,3.2vw,3rem)]">
            {heroTagline}
          </p>
        </div>
        {/* Kup bilet + Dowiedz się więcej, dwa przyciski obok siebie, jak na podstronie Kina.
            Na wąskich ekranach zawijają się (flex-wrap), na większych rosną. */}
        <div
          className={`mt-6 flex w-full flex-row flex-wrap items-center justify-center gap-2.5 transition-[opacity,transform] duration-[1000ms] will-change-[opacity,transform] sm:mt-8 sm:gap-3.5 lg:mt-10 lg:gap-4 ${
            introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "450ms", transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)" }}
        >
          <Link
            href={heroBookingHref}
            className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#ff7a3c] via-[#ff5544] to-[#ff3960] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] !text-white shadow-[0_20px_50px_rgba(255,90,60,0.45),0_0_30px_rgba(255,90,60,0.35)] transition hover:scale-[1.02] hover:brightness-110 sm:gap-3 sm:px-9 sm:py-4 sm:text-sm sm:tracking-[0.2em] lg:px-11 lg:py-5 lg:text-base"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px] sm:h-5 sm:w-5">
              <path
                d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M9 5v14" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2" />
            </svg>
            {navLabels.buy}
          </Link>
          <Link
            href={paths.attractions.k360}
            className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-[#7ef6ff]/70 bg-black/40 px-4 py-2.5 text-xs font-semibold !text-white shadow-[0_8px_28px_rgba(0,0,0,0.55),0_0_22px_rgba(126,246,255,0.3)] backdrop-blur-md transition hover:border-[#7ef6ff] hover:bg-black/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_34px_rgba(126,246,255,0.5)] sm:gap-2 sm:px-7 sm:py-4 sm:text-sm lg:px-8 lg:py-5 lg:text-base"
          >
            {navLabels.learnMore}
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
              <path d="M3 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        <div
          className={`mt-6 flex justify-center transition-[opacity,transform] duration-[1000ms] will-change-[opacity,transform] sm:mt-8 lg:mt-10 ${
            introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "750ms", transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)" }}
        >
          <div className="pointer-events-auto inline-flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center sm:gap-5 sm:rounded-full sm:border sm:border-[#7ef6ff]/25 sm:bg-black/65 sm:px-7 sm:py-3 sm:shadow-[0_18px_50px_rgba(0,0,0,0.6),0_0_22px_rgba(126,246,255,0.18)] sm:backdrop-blur-xl sm:supports-[backdrop-filter]:bg-black/55 lg:gap-8 lg:px-9 lg:py-3.5">
            <Link
              href="#content-start"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7ef6ff]/25 bg-black/65 px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] !text-white/90 shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_18px_rgba(126,246,255,0.15)] backdrop-blur-xl transition hover:text-[#7ef6ff] supports-[backdrop-filter]:bg-black/55 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:shadow-none sm:backdrop-blur-none sm:supports-[backdrop-filter]:bg-transparent"
            >
              {navLabels.attractions}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M7 2v9M3 7l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <span className="hidden h-4 w-px bg-[#7ef6ff]/25 sm:inline-block" aria-hidden="true" />
            <Link
              href={paths.about}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7ef6ff]/25 bg-black/65 px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] !text-white/90 shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_18px_rgba(126,246,255,0.15)] backdrop-blur-xl transition hover:text-[#7ef6ff] supports-[backdrop-filter]:bg-black/55 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:shadow-none sm:backdrop-blur-none sm:supports-[backdrop-filter]:bg-transparent"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                <path
                  d="M7 6v3.5M7 4v.01"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              {navLabels.about}
            </Link>
            <span className="hidden h-4 w-px bg-[#7ef6ff]/25 sm:inline-block" aria-hidden="true" />
            <Link
              href={paths.gettingThere}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7ef6ff]/25 bg-black/65 px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] !text-white/90 shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_18px_rgba(126,246,255,0.15)] backdrop-blur-xl transition hover:text-[#7ef6ff] supports-[backdrop-filter]:bg-black/55 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:shadow-none sm:backdrop-blur-none sm:supports-[backdrop-filter]:bg-transparent"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M12 2 6.5 13 5 8 0 6.5 12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              {navLabels.route}
            </Link>
          </div>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
});

const HomeContent = memo(function HomeContent({
  introReady,
  attractions,
  tickets,
  eventsPromo,
  news,
  secondaryAnimationsReady,
  locale,
}: {
  introReady: boolean;
  attractions: HomeCopy["attractions"];
  tickets: TicketSection;
  eventsPromo: PromoTile;
  news: NewsSection;
  secondaryAnimationsReady: boolean;
  locale: Locale;
}) {
  return (
    <section
      id="content-start"
      className={`relative z-10 mt-10 sm:mt-12 transition-[opacity,transform] duration-[1200ms] will-change-[opacity,transform] ${
        introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: "180ms",
      }}
    >
      <div className="flex flex-col gap-20 sm:gap-28">
        <AttractionsSection attractions={attractions} animate={secondaryAnimationsReady} />
        <div className="mx-auto w-full max-w-[72rem] 2xl:max-w-[92rem] min-[1800px]:max-w-[104rem]">
          <TicketsSection tickets={tickets} locale={locale} />
        </div>
        <div className="mx-auto w-full max-w-[72rem] 2xl:max-w-[92rem] min-[1800px]:max-w-[104rem]">
          <FaqAccordion copy={FAQ_COPY[locale]} />
        </div>
        <EventsPromoSection promo={eventsPromo} />
        <div className="mx-auto w-full max-w-[72rem] 2xl:max-w-[92rem] min-[1800px]:max-w-[104rem]">
          <NewsSectionBlock news={news} teaser />
        </div>
      </div>
    </section>
  );
});

const AttractionsSection = memo(function AttractionsSection({
  attractions,
  animate,
}: {
  attractions: HomeCopy["attractions"];
  animate: boolean;
}) {
  // Reveal na scroll: Kino (środek) wjeżdża pierwsze, Filmworld z lewej, Mars z prawej.
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const featuredIndex = attractions.items.findIndex((item) => item.featured);

  return (
    <ScrollMotionItem strength="strong" delay={40}>
      <div className="mx-auto w-full max-w-[92rem] lg:max-w-[80rem] 2xl:max-w-[92rem]">
        <div className="text-center">
          <h2 className="ap-type-section-title !text-[clamp(2.6rem,2rem+2.6vw,4.6rem)] !leading-[1.05]">{attractions.title}</h2>
          <div className="mx-auto mt-4 h-[3px] w-28 rounded-full bg-gradient-to-r from-[#4fcfde] via-[#f7486c] to-[#f77828]" />
          <p className="ap-type-section-body mx-auto mt-6 max-w-2xl !text-[clamp(1.15rem,1rem+0.7vw,1.6rem)] !leading-[1.5] lg:max-w-none lg:whitespace-nowrap">{attractions.intro}</p>
        </div>

        {/* Mobile + tablet: roller (Kino wyróżnione na środku) */}
        <div className="lg:hidden">
          <AttractionsScroller items={attractions.items} animate={animate} />
        </div>

        {/* Desktop (lg+): siatka 3 kolumn: Kino wjeżdża pierwsze (środek), Filmworld z lewej, Mars z prawej */}
        <div
          ref={gridRef}
          className="mt-14 hidden gap-8 overflow-x-clip lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center"
        >
          {attractions.items.map((item, i) => {
            const dir = item.featured ? "center" : i < featuredIndex ? "left" : "right";
            const hiddenTransform =
              dir === "left"
                ? "-translate-x-24"
                : dir === "right"
                ? "translate-x-24"
                : "translate-y-10 scale-[0.97]";
            return (
              <div
                key={item.title}
                className={`transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${
                  revealed
                    ? "translate-x-0 translate-y-0 scale-100 opacity-100"
                    : `opacity-0 ${hiddenTransform}`
                }`}
                style={{ transitionDelay: revealed && !item.featured ? "240ms" : "0ms" }}
              >
                <AttractionCard
                  {...item}
                  {...(item.featured
                    ? {
                        videoMp4: "/home/Cinema360_home.mp4",
                        videoWebm: "/home/Cinema360_home.webm",
                        videoPoster: "/home/Cinema360_home_poster.webp",
                      }
                    : {})}
                />
              </div>
            );
          })}
        </div>
      </div>
    </ScrollMotionItem>
  );
});

const TICKET_ACCENT_TOKENS: Record<
  NonNullable<TicketOption["accent"]>,
  {
    badgeBg: string;
    badgeColor: string;
    badgeShadow: string;
    divider: string;
    dot: string;
    glow: string;
    border: string;
    accentHex: string;
    shadowGlow: string;
    priceColor: string;
    buttonClass: string;
  }
> = {
  red: {
    badgeBg: "linear-gradient(135deg, #f7486c, #ff96aa)",
    badgeColor: "#ffffff",
    badgeShadow: "0 8px 22px rgba(247, 72, 108, 0.45)",
    divider:
      "linear-gradient(90deg, rgba(247,72,108,0) 0%, rgba(247,72,108,0.55) 50%, rgba(247,72,108,0) 100%)",
    dot: "#ff7a92",
    glow: "radial-gradient(circle at top left, rgba(247,72,108,0.22), transparent 40%), radial-gradient(circle at bottom right, rgba(247,72,108,0.1), transparent 32%)",
    border: "border-[rgba(247,72,108,0.32)]",
    accentHex: "#f7486c",
    shadowGlow: "0 24px 60px rgba(0,0,0,0.45), 0 0 24px rgba(247,72,108,0.35)",
    priceColor: "text-[#ff96aa]",
    buttonClass:
      "ticket-pill w-full !bg-[#f7486c] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] ring-[color:rgba(247,72,108,0.55)] hover:!brightness-110",
  },
  orange: {
    badgeBg: "linear-gradient(135deg, #f77828, #ffb585)",
    badgeColor: "#ffffff",
    badgeShadow: "0 8px 22px rgba(247, 120, 40, 0.45)",
    divider:
      "linear-gradient(90deg, rgba(247,120,40,0) 0%, rgba(247,120,40,0.55) 50%, rgba(247,120,40,0) 100%)",
    dot: "#ff9357",
    glow: "radial-gradient(circle at top left, rgba(247,120,40,0.22), transparent 40%), radial-gradient(circle at bottom right, rgba(247,120,40,0.1), transparent 32%)",
    border: "border-[rgba(247,120,40,0.32)]",
    accentHex: "#f77828",
    shadowGlow: "0 24px 60px rgba(0,0,0,0.45), 0 0 24px rgba(247,120,40,0.35)",
    priceColor: "text-[#ffb585]",
    buttonClass:
      "ticket-pill w-full !bg-[linear-gradient(135deg,#e2580c,#f59044)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] !shadow-[0_8px_18px_rgba(247,120,40,0.45)] ring-[color:rgba(247,120,40,0.6)] hover:!brightness-110",
  },
  cyan: {
    badgeBg: "linear-gradient(135deg, #4fcfde, #a5e6f0)",
    badgeColor: "#ffffff",
    badgeShadow: "0 8px 22px rgba(79, 207, 222, 0.45)",
    divider:
      "linear-gradient(90deg, rgba(79,207,222,0) 0%, rgba(79,207,222,0.55) 50%, rgba(79,207,222,0) 100%)",
    dot: "#7ef6ff",
    glow: "radial-gradient(circle at top left, rgba(79,207,222,0.22), transparent 40%), radial-gradient(circle at bottom right, rgba(79,207,222,0.1), transparent 32%)",
    border: "border-[rgba(79,207,222,0.32)]",
    accentHex: "#4fcfde",
    shadowGlow: "0 24px 60px rgba(0,0,0,0.45), 0 0 24px rgba(79,207,222,0.35)",
    priceColor: "text-[#7ef6ff]",
    buttonClass:
      "ticket-pill w-full !bg-[linear-gradient(135deg,#1ea6b7,#4fcfde)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] !shadow-[0_8px_18px_rgba(79,207,222,0.45)] ring-[color:rgba(79,207,222,0.6)] hover:!brightness-110",
  },
};

// Stałe wyniesione poza komponenty (czyste, bez zależności od props/stanu),
// żeby nie były realokowane przy ewentualnym re-renderze. Identyczne wartości.
const promoButtonClass =
  "ticket-pill w-full !bg-[linear-gradient(90deg,#4fcfde,#a855f7,#f7486c,#f77828)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] ring-[color:rgba(168,85,247,0.5)] hover:!brightness-110";
const attractionIcons = [
  <FaFilm key="kino" aria-hidden="true" />,
  <FaRocket key="mars" aria-hidden="true" />,
  <svg key="dome" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M3.5 13a8.5 8.5 0 0 1 17 0" />
    <path d="M3.5 13h17M12 4.5V13M7 6 9.4 13M17 6 14.6 13" />
  </svg>,
];
const rowDescriptions = [
  "Seans w kinie sferycznym 360°",
  "Marsjańska misja i łazik w akcji",
  "Futurystyczna przestrzeń pełna wrażeń",
];

const TicketOptionCard = memo(function TicketOptionCard({
  option,
  defaultPriceLabel,
  defaultPrice,
  cta,
  ctaHref,
}: {
  option: TicketOption;
  defaultPriceLabel: string;
  defaultPrice: string;
  cta: string;
  ctaHref: string;
}) {
  const accent = option.accent ?? "cyan";
  const tokens = TICKET_ACCENT_TOKENS[accent];
  const linkHref = option.href ?? ctaHref;
  const buttonLabel = option.ctaLabel ?? cta;
  const isComingSoon = Boolean(option.comingSoon);
  // Kafelek pakietu „Wszystkie atrakcje" (bgColor ustawiony), czarny z tęczowym
  // akcentem, żeby NIE wyglądał jak cyjanowy kafelek „FILMWORLD".
  const isPromo = Boolean(option.bgColor);

  return (
    <div
      className={`ticket-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] text-white/90 transition-transform duration-300 hover:-translate-y-1`}
      style={{
        backgroundColor: option.bgColor ?? "#0a0d18",
        border: `2px solid ${isPromo ? "rgba(255,255,255,0.16)" : tokens.accentHex}`,
        boxShadow: isPromo
          ? "0 24px 60px rgba(0,0,0,0.55), 0 0 22px rgba(168,85,247,0.25)"
          : tokens.shadowGlow,
        WebkitMask:
          "radial-gradient(circle 12px at 0 65%, transparent 12px, #000 12.5px) left center / 100% 100% no-repeat, radial-gradient(circle 12px at 100% 65%, transparent 12px, #000 12.5px) right center / 100% 100% no-repeat",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: isPromo
            ? "radial-gradient(circle at top left, rgba(79,207,222,0.16), transparent 42%), radial-gradient(circle at bottom right, rgba(247,72,108,0.14), transparent 40%)"
            : tokens.glow,
        }}
        aria-hidden="true"
      />
      <div className="ticket-card-top relative !px-2 !pt-2.5 !pb-1 sm:!px-5 sm:!pt-4 sm:!pb-[0.3rem]">
        <span
          className="ticket-card-badge !min-w-0 !w-full !px-1.5 !py-1 !text-[0.5rem] !tracking-[0.12em] sm:!min-w-[12.5rem] sm:!w-auto sm:!px-4 sm:!py-[0.45rem] sm:!text-[0.72rem] sm:!tracking-[0.26em]"
          style={{
            background: isPromo ? "linear-gradient(90deg,#4fcfde,#a855f7,#f7486c,#f77828)" : tokens.badgeBg,
            color: isPromo ? "#ffffff" : tokens.badgeColor,
            boxShadow: isPromo ? "0 8px 22px rgba(168,85,247,0.35)" : tokens.badgeShadow,
          }}
        >
          {option.badge}
        </span>
      </div>
      <div className="ticket-card-content relative flex h-full flex-col p-2 text-center sm:p-6">
        <h3 className="ticket-card-title text-[0.95rem] font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-[2.4rem]">
          {option.titleHighlight ? (
            <>
              {option.titleLead}{" "}
              <span
                className="block bg-[linear-gradient(90deg,#4fcfde_0%,#a855f7_45%,#f7486c_65%,#f77828_100%)] bg-clip-text uppercase text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {option.titleHighlight}
              </span>
            </>
          ) : (
            option.title
          )}
        </h3>
        <p className="ticket-card-subtitle mt-1.5 hidden text-xs text-white/75 sm:mt-2.5 sm:block sm:text-lg">
          {option.subtitle}
        </p>
        <div className="mt-2.5 h-px w-full sm:mt-6" style={{ background: tokens.divider }} />
        <ul className="ticket-list-panel mx-auto mb-6 mt-4 hidden max-w-sm space-y-2.5 text-left text-xs text-white/75 sm:mb-6 sm:mt-6 sm:block sm:space-y-3.5 sm:text-base">
          {option.details.map((detail) => (
            <li key={detail} className="ticket-detail flex gap-2.5 sm:gap-3">
              <span
                className="ticket-detail-dot mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full sm:mt-2"
                style={{ background: tokens.dot }}
              />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
        <div
          className="ticket-price-block mt-auto !p-2.5 pt-2.5 sm:!p-4 sm:pt-7"
          style={option.bgColor ? { background: "transparent", borderColor: "rgba(255,255,255,0.1)" } : undefined}
        >
          <p className="ticket-price-label text-[0.5rem] uppercase tracking-[0.12em] text-white/60 sm:text-[0.7rem] sm:tracking-[0.25em]">
            {option.priceLabel ?? defaultPriceLabel}
          </p>
          <p className={`ticket-price mt-1 text-base font-bold sm:mt-2 sm:text-[2.3rem] ${tokens.priceColor}`}>
            {option.price ?? defaultPrice}
          </p>
          {option.reducedPrice ? (
            <div className="mt-2 flex flex-col items-center gap-0.5 border-t border-white/10 pt-2 sm:mt-3 sm:pt-3">
              <p className="text-[0.46rem] uppercase tracking-[0.12em] text-white/45 sm:text-[0.65rem] sm:tracking-[0.22em]">
                {option.reducedPriceLabel}
              </p>
              <p className="text-[0.7rem] font-semibold text-white/80 sm:text-base">
                {option.reducedPrice}
              </p>
            </div>
          ) : null}
          <div className="mt-2.5 flex justify-center sm:mt-6">
            {isComingSoon ? (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="ticket-pill w-full cursor-not-allowed whitespace-normal rounded-full bg-white/10 !px-2 !py-1.5 !text-[0.6rem] font-semibold leading-tight text-white/55 ring-1 ring-white/10 sm:whitespace-nowrap sm:!px-6 sm:!py-3 sm:!text-sm"
              >
                {buttonLabel}
              </button>
            ) : (
              <PrimaryButton
                href={linkHref}
                size="md"
                className={`!w-1/2 sm:!w-full !px-2 !py-1.5 !text-[0.6rem] whitespace-normal leading-tight sm:!px-5 sm:!py-2 sm:!text-base sm:whitespace-nowrap ${isPromo ? promoButtonClass : tokens.buttonClass}`}
              >
                {buttonLabel}
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const TicketsSection = memo(function TicketsSection({
  tickets,
  locale,
}: {
  tickets: TicketSection;
  locale: Locale;
}) {
  // Na mobile/tablet (< lg) pokazujemy 4 równe kafelki w siatce 2x2,
  // pakiet „Wszystkie atrakcje" w tym samym kompaktowym formacie co reszta.
  const firstPromo = PROMO_PACKAGES[locale][0];
  const promoOption: TicketOption = {
    badge: firstPromo.badge,
    title: firstPromo.title,
    titleLead: firstPromo.heroLead,
    titleHighlight: firstPromo.heroHighlight,
    bgColor: "#000000",
    subtitle: firstPromo.subtitle,
    details: firstPromo.details,
    priceLabel: firstPromo.priceLabel,
    price: firstPromo.price,
    reducedPriceLabel: firstPromo.reducedPriceLabel,
    reducedPrice: firstPromo.reducedPrice,
    bookingCategory: firstPromo.category,
    bookingServiceName: firstPromo.service,
    accent: "cyan",
    ctaLabel: firstPromo.button,
  };
  const promoHref = buildBookingPath(locale, {
    category: firstPromo.category,
    service: firstPromo.service,
    autopick: firstPromo.autopick,
  });
  const promoPriceParts = firstPromo.price.split(",");
  // Bilet KINO 360, rozbudowana karta na mobile, nad pakietem (dane z options[0]).
  const kino = tickets.options[0];
  const kinoHref = kino.bookingServiceName
    ? buildBookingPath(locale, {
        category: kino.bookingCategory ?? FILM_PATH_BOOKING_CATEGORY,
        service: kino.bookingServiceName,
        quantity: kino.bookingQuantity,
      })
    : tickets.ctaHref;

  return (
    <ScrollMotionItem strength="soft" delay={30} float={false} className="home-deferred-block">
      <Card
        title={tickets.title}
        titleCentered
        titleDivider
        dense
        motion="off"
        titleClassName="!text-[clamp(2.6rem,2rem+2.6vw,4.6rem)] !leading-[1.05]"
      >
        <div className="mt-1 text-center">
          <p className="ap-type-cta-title !text-[clamp(1.25rem,1.05rem+0.8vw,1.9rem)] !leading-[1.3]">{tickets.headerCta}</p>
        </div>
        <div className="mt-8">
          {/* MOBILE / tablet (< lg): hero pakiet + „lub pojedyncza" + rzędy atrakcji + zaufanie */}
          <div className="lg:hidden">
            {/* HERO: bilet KINO 360 (czerwony, w stylu pakietu, nad pakietem) */}
            <article className="relative overflow-hidden rounded-[1.9rem] border-2 border-[#f7486c] bg-[#05060c] px-5 py-6 shadow-[0_0_38px_rgba(247,72,108,0.32),0_30px_60px_rgba(0,0,0,0.6)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_22%,rgba(247,72,108,0.24),transparent_46%),radial-gradient(circle_at_78%_88%,rgba(255,107,133,0.16),transparent_46%),radial-gradient(circle_at_60%_58%,rgba(247,120,40,0.1),transparent_52%)]" />
              <div className="relative">
                <div className="flex justify-center">
                  <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#f5b301,#fcd34d)] px-3.5 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-[#231903] shadow-[0_6px_18px_rgba(251,191,36,0.45)] ring-1 ring-black/10">
                    Największe w Europie
                  </span>
                </div>
                <h3 className="mt-4 text-[1.85rem] font-black leading-[1.05] tracking-[-0.02em] text-white">
                  <span className="block uppercase">{kino.title}</span>
                </h3>
                <div className="mt-3 h-px w-16 bg-white/15" />
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="max-w-[8rem] text-[0.82rem] leading-snug text-white/65">
                    Obraz dookoła w kopule 48 m
                  </p>
                  <div className="shrink-0 text-right leading-none">
                    <p className="text-[1.7rem] font-black text-white">
                      {(kino.price ?? "").split("/")[0].trim()}
                      <span className="text-sm font-bold">/{(kino.price ?? "").split("/")[1] ?? "os."}</span>
                    </p>
                    <p className="mt-1.5 text-[0.66rem] text-white/55">
                      ulgowy <span className="font-extrabold text-[#ff8da3]">{kino.reducedPrice}</span>
                    </p>
                  </div>
                </div>
                <PrimaryButton
                  href={kinoHref}
                  size="lg"
                  className="ticket-pill mt-5 !flex !w-full !items-center !justify-center !gap-2 !bg-[linear-gradient(135deg,#e2580c,#f7486c,#ff6b85)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] !shadow-[0_0_26px_rgba(247,72,108,0.5)] ring-[color:rgba(247,72,108,0.6)]"
                >
                  <FaTicket aria-hidden="true" /> {kino.ctaLabel ?? tickets.cta}
                </PrimaryButton>
              </div>
            </article>

            {/* HERO: pakiet „Wszystkie atrakcje" */}
            <article className="relative mt-6 overflow-hidden rounded-[1.9rem] border-2 border-[#4fcfde] bg-[#05060c] px-5 py-6 shadow-[0_0_38px_rgba(79,207,222,0.32),0_30px_60px_rgba(0,0,0,0.6)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_22%,rgba(79,207,222,0.22),transparent_46%),radial-gradient(circle_at_78%_88%,rgba(247,72,108,0.18),transparent_46%),radial-gradient(circle_at_60%_58%,rgba(168,85,247,0.12),transparent_52%)]" />
              <div className="relative">
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4fcfde]/12 px-3.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#7ef6ff] ring-1 ring-[#4fcfde]/40">
                    <FaStar className="text-[0.7rem]" aria-hidden="true" /> Najlepszy wybór
                  </span>
                </div>
                <h3 className="mt-4 text-[1.85rem] font-black leading-[1.05] tracking-[-0.02em] text-white">
                  {firstPromo.heroLead}
                  <span
                    className="block bg-[linear-gradient(90deg,#4fcfde,#a855f7,#f7486c,#f77828)] bg-clip-text uppercase text-transparent"
                    style={{ WebkitBackgroundClip: "text" }}
                  >
                    {firstPromo.heroHighlight}
                  </span>
                </h3>
                <div className="mt-3 h-px w-16 bg-white/15" />
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="max-w-[8rem] text-[0.82rem] leading-snug text-white/65">
                    Pełne doświadczenie w najlepszej cenie
                  </p>
                  <div className="shrink-0 text-right leading-none">
                    <p className="text-[1.7rem] font-black text-white">
                      {promoPriceParts[0]}
                      <span className="text-sm font-bold">,{promoPriceParts[1] ?? "00 zł"}</span>
                    </p>
                    <p className="mt-1.5 text-[0.66rem] text-white/55">
                      ulgowy <span className="font-extrabold text-[#7ef6ff]">{firstPromo.reducedPrice}</span>
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[0.7rem] text-white/45">zamiast osobno drożej</p>
                <PrimaryButton
                  href={promoHref}
                  size="lg"
                  className="ticket-pill mt-5 !flex !w-full !items-center !justify-center !gap-2 !bg-[linear-gradient(135deg,#1ea6b7,#4fcfde,#7ef6ff)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] !shadow-[0_0_26px_rgba(79,207,222,0.5)] ring-[color:rgba(79,207,222,0.6)]"
                >
                  <FaTicket aria-hidden="true" /> {firstPromo.button}
                </PrimaryButton>
              </div>
            </article>

            {/* separator */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="whitespace-nowrap text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-white/45">
                Lub wybierz pojedynczą atrakcję
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            {/* rzędy pojedynczych atrakcji */}
            <div className="space-y-3">
              {tickets.options.map((option, i) => {
                if (i === 0) return null; // Kino jest teraz osobną kartą na górze
                const tk = TICKET_ACCENT_TOKENS[option.accent ?? "cyan"];
                const href = option.bookingServiceName
                  ? buildBookingPath(locale, {
                      category: option.bookingCategory ?? FILM_PATH_BOOKING_CATEGORY,
                      service: option.bookingServiceName,
                      quantity: option.bookingQuantity,
                    })
                  : tickets.ctaHref;
                return (
                  <div
                    key={option.title}
                    className="flex items-center gap-3 rounded-2xl border bg-white/[0.03] p-2.5"
                    style={{ borderColor: `${tk.accentHex}3d` }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg"
                      style={{ border: `1.5px solid ${tk.accentHex}`, color: tk.accentHex, boxShadow: `0 0 14px ${tk.accentHex}40` }}
                    >
                      {attractionIcons[i] ?? attractionIcons[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{option.title}</p>
                      <p className="line-clamp-2 text-[0.72rem] leading-snug text-white/55">{rowDescriptions[i] ?? option.subtitle}</p>
                    </div>
                    <div className="shrink-0 border-l border-white/10 pl-2.5 text-right">
                      <p className="whitespace-nowrap text-sm font-extrabold leading-none text-white">
                        {(option.price ?? "").split("/")[0].trim()}
                        <span className="text-[0.6rem] font-medium text-white/50">/{(option.price ?? "").split("/")[1] ?? "os."}</span>
                      </p>
                    </div>
                    <a
                      href={href}
                      className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[0.64rem] font-bold text-white transition hover:brightness-110"
                      style={{ background: tk.accentHex, boxShadow: `0 0 16px ${tk.accentHex}55` }}
                    >
                      {option.ctaLabel ?? tickets.cta}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* lg+: bogaty pakiet na całą szerokość + 3 bilety w rzędzie */}
          <div className="hidden space-y-8 lg:block">
          {PROMO_PACKAGES[locale].map((promo) => (
            <article
              key={promo.title}
              className="home-ticket-promo relative overflow-hidden rounded-[1.75rem] border-2 border-[#4fcfde] px-4 py-5 shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_28px_rgba(79,207,222,0.35)] sm:px-7 sm:py-7"
              style={{
                backgroundColor: "#0a0d18",
                WebkitMask:
                  "radial-gradient(circle 14px at 0 50%, transparent 14px, #000 14.5px) left center / 100% 100% no-repeat, radial-gradient(circle 14px at 100% 50%, transparent 14px, #000 14.5px) right center / 100% 100% no-repeat",
                WebkitMaskComposite: "source-in",
                maskComposite: "intersect",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,207,222,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(247,120,40,0.16),transparent_38%),radial-gradient(circle_at_bottom_center,rgba(247,72,108,0.14),transparent_42%)]" />

              {/* Pionowa „dziurkowana" linia w środku, jak na bilecie */}
              <div
                className="pointer-events-none absolute top-6 bottom-6 hidden lg:block"
                style={{
                  left: "calc(100% - 23rem)",
                  width: "1px",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(255,255,255,0.28) 0 6px, transparent 6px 12px)",
                }}
                aria-hidden="true"
              />

              <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
                  <span
                    className="ticket-card-badge mx-auto lg:mx-0 !text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
                  >
                    {promo.badge}
                  </span>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-2xl font-extrabold leading-[1.02] tracking-[-0.03em] text-[color:var(--ap-text-strong)] sm:text-3xl lg:text-4xl">
                      {promo.heroLead}{" "}
                      <span
                        className="block whitespace-nowrap bg-[linear-gradient(90deg,#4fcfde_0%,#a855f7_45%,#f7486c_65%,#f77828_100%)] bg-clip-text uppercase font-black text-transparent sm:inline"
                        style={{ WebkitBackgroundClip: "text" }}
                      >
                        {promo.heroHighlight}
                      </span>
                    </h3>
                    <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[color:var(--ap-text-dim)] sm:text-base lg:mx-0 lg:text-lg">
                      {promo.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:justify-start">
                    {promo.details.map((detail) => (
                      <div
                        key={detail}
                        className="home-ticket-promo-detail rounded-full border border-[color:var(--ap-border)] bg-[color:var(--ap-surface-strong)] px-3 py-1.5 text-xs text-[color:var(--ap-text-dim)] sm:px-4 sm:py-2 sm:text-sm"
                      >
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pozioma perforacja, tylko mobile/tablet (pod lg) */}
                <div
                  className="h-px w-full lg:hidden"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to right, rgba(255,255,255,0.32) 0 6px, transparent 6px 12px)",
                  }}
                  aria-hidden="true"
                />

                <div className="flex w-full flex-col items-center gap-3 sm:gap-4 lg:w-[20rem] lg:items-stretch">
                  {/* Dwie ceny: normalna + ulgowa */}
                  <div className="home-ticket-promo-price ap-tile ap-tile-sm w-full px-3 py-3.5 text-center sm:px-5 sm:py-4">
                    <p className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-[color:var(--ap-text-muted)] sm:text-[0.64rem] sm:tracking-[0.22em]">
                      {promo.promoStripLabel}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-0">
                      <div className="pr-2 sm:pr-4">
                        <p className="text-[0.54rem] uppercase tracking-[0.12em] text-[color:var(--ap-text-muted)] sm:text-[0.66rem] sm:tracking-[0.18em]">
                          {promo.priceLabel}
                        </p>
                        <p className="mt-1 text-lg font-extrabold leading-none tracking-[-0.03em] text-[color:var(--ap-text-strong)] sm:text-2xl">
                          {promo.price}
                        </p>
                        <p className="mt-1.5 inline-flex flex-wrap items-center justify-center gap-1.5 text-[0.55rem] font-semibold leading-tight text-[color:var(--ap-breeze-strong)] sm:text-[0.68rem]">
                          <span>−{promo.savingsPercent}</span>
                          <span className="text-[color:var(--ap-text-muted)]">{promo.savings}</span>
                        </p>
                      </div>
                      <div className="border-l border-[color:var(--ap-border)] pl-2 sm:pl-4">
                        <p className="text-[0.54rem] uppercase tracking-[0.12em] text-[color:var(--ap-text-muted)] sm:text-[0.66rem] sm:tracking-[0.18em]">
                          {promo.reducedPriceLabel}
                        </p>
                        <p className="mt-1 text-lg font-extrabold leading-none tracking-[-0.03em] text-[color:var(--ap-text-strong)] sm:text-2xl">
                          {promo.reducedPrice}
                        </p>
                        <p className="mt-1.5 inline-flex flex-wrap items-center justify-center gap-1.5 text-[0.55rem] font-semibold leading-tight text-[color:var(--ap-breeze-strong)] sm:text-[0.68rem]">
                          <span>−{promo.reducedSavingsPercent}</span>
                          <span className="text-[color:var(--ap-text-muted)]">{promo.reducedSavings}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <PrimaryButton
                    href={buildBookingPath(locale, { category: promo.category, service: promo.service, autopick: promo.autopick })}
                    size="lg"
                    className="ticket-pill w-full whitespace-nowrap !bg-[linear-gradient(135deg,#1ea6b7,#4fcfde,#7ef6ff)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] !shadow-[0_10px_30px_rgba(79,207,222,0.45),0_0_24px_rgba(79,207,222,0.35)] ring-[color:rgba(79,207,222,0.6)] hover:!brightness-110"
                  >
                    {promo.button}
                  </PrimaryButton>
                </div>
              </div>
            </article>
          ))}

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-10 xl:grid-cols-3">
            {tickets.options.map((option) => (
              <TicketOptionCard
                key={option.title}
                option={option}
                defaultPriceLabel={tickets.priceLabel}
                defaultPrice={tickets.price}
                cta={tickets.cta}
                ctaHref={
                  option.bookingServiceName
                    ? buildBookingPath(locale, {
                        category: option.bookingCategory ?? FILM_PATH_BOOKING_CATEGORY,
                        service: option.bookingServiceName,
                        quantity: option.bookingQuantity,
                      })
                    : tickets.ctaHref
                }
              />
            ))}
          </div>
          </div>
        </div>
      </Card>
    </ScrollMotionItem>
  );
});

const EventsPromoSection = memo(function EventsPromoSection({
  promo,
}: {
  promo: PromoTile;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState(promo.images[0] ?? "");
  const [previousImageSrc, setPreviousImageSrc] = useState<string | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [imagesReady, setImagesReady] = useState(promo.images.length <= 1);

  useEffect(() => {
    let cancelled = false;

    setActiveImageIndex(0);
    setCurrentImageSrc(promo.images[0] ?? "");
    setPreviousImageSrc(null);
    setIsCrossfading(false);
    setImagesReady(promo.images.length <= 1);

    if (promo.images.length <= 1 || typeof window === "undefined") {
      return () => {
        cancelled = true;
      };
    }

    void waitForImagesReady(promo.images).then(() => {
      if (!cancelled) {
        setImagesReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [promo.images]);

  useEffect(() => {
    if (!imagesReady || promo.images.length <= 1 || typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (document.hidden) {
        return;
      }

      setActiveImageIndex((currentIndex) => (currentIndex + 1) % promo.images.length);
    }, EVENTS_PROMO_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [imagesReady, promo.images]);

  useEffect(() => {
    const nextImageSrc = promo.images[activeImageIndex];
    if (!imagesReady || !nextImageSrc || nextImageSrc === currentImageSrc || typeof window === "undefined") {
      return;
    }

    let cancelled = false;
    let firstFrameId = 0;
    let secondFrameId = 0;
    let timeoutId: number | null = null;

    setPreviousImageSrc(currentImageSrc);
    setCurrentImageSrc(nextImageSrc);
    setIsCrossfading(false);

    firstFrameId = window.requestAnimationFrame(() => {
      if (cancelled) {
        return;
      }

      secondFrameId = window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        setIsCrossfading(true);
      });
    });

    timeoutId = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      setPreviousImageSrc(null);
      setIsCrossfading(false);
    }, EVENTS_PROMO_FADE_MS);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [activeImageIndex, currentImageSrc, imagesReady, promo.images]);

  return (
    <ScrollMotionItem strength="soft" delay={70} float={false} className="home-deferred-block">
      <div className="mx-auto w-full max-w-[92rem] 2xl:max-w-[116rem] min-[1800px]:max-w-[138rem]">
        <div className="relative grid items-stretch overflow-hidden rounded-[2rem] ring-1 ring-[color:var(--ap-border)] lg:grid-cols-2">
          <div className="relative min-h-[18rem] sm:min-h-[22rem] lg:min-h-[30rem]">
            {previousImageSrc ? (
              <Image
                src={previousImageSrc}
                alt={promo.imageAlt}
                fill
                sizes="(min-width: 1024px) 46rem, 100vw"
                key={previousImageSrc}
                className={`object-cover transition-opacity duration-[2400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isCrossfading ? "opacity-0" : "opacity-100"
                }`}
                loading="eager"
                decoding="async"
              />
            ) : null}
            {currentImageSrc ? (
              <Image
                src={currentImageSrc}
                alt={promo.imageAlt}
                fill
                sizes="(min-width: 1024px) 46rem, 100vw"
                key={currentImageSrc}
                className={`object-cover transition-opacity duration-[2400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  previousImageSrc ? (isCrossfading ? "opacity-100" : "opacity-0") : "opacity-100"
                }`}
                loading="eager"
                decoding="async"
              />
            ) : null}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#141830]/45 via-transparent to-[#4fcfde]/12 lg:bg-gradient-to-r lg:from-transparent lg:to-[color:var(--ap-surface)]/70"
              aria-hidden="true"
            />
          </div>
          <div className="relative flex flex-col justify-center gap-3 bg-[color:var(--ap-surface)] px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-14 lg:text-left">
            <p className="ap-type-kicker">{promo.eyebrow}</p>
            <h2 className="ap-type-section-title text-balance">{promo.title}</h2>
            <p className="ap-type-section-body mx-auto max-w-2xl lg:mx-0">{promo.description}</p>
            <div className="mt-4 flex justify-center lg:justify-start">
              <PrimaryButton href={promo.href} size="md">
                {promo.cta}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ScrollMotionItem>
  );
});

const AttractionsScroller = memo(function AttractionsScroller({
  items,
  animate: shouldAnimate = true,
}: {
  items: AttractionItem[];
  animate?: boolean;
}) {
  const loopItems = useMemo(() => [...items, ...items], [items]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !shouldAnimate) {
      setCanAnimate(false);
      return;
    }

    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
      deviceMemory?: number;
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrowViewport = window.matchMedia("(max-width: 767px)").matches;
    const saveData = Boolean(nav.connection?.saveData);
    const effectiveType = nav.connection?.effectiveType ?? "";
    const constrainedNetwork = /(^|-)2g$|3g/.test(effectiveType);
    const deviceMemory = nav.deviceMemory;
    const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 4;
    const lowCpu = (nav.hardwareConcurrency ?? 8) <= 4;

    setCanAnimate(
      !reducedMotion &&
        !saveData &&
        !constrainedNetwork &&
        !coarsePointer &&
        !(narrowViewport && (lowMemory || lowCpu)),
    );
  }, [shouldAnimate]);

  useEffect(() => {
    if (!canAnimate) {
      return;
    }
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) {
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let frameId: number | null = null;
    let halfWidth = 0;
    let offset = 0;
    let boostVelocity = 0;
    let lastTime = 0;
    let lastPaintTime = 0;
    let isVisible = false;
    let touchMode: "idle" | "pending" | "horizontal" | "vertical" = "idle";
    let touchStartX = 0;
    let touchStartY = 0;
    let touchLastX = 0;
    let touchLastTime = 0;
    const baseSpeed = window.matchMedia("(max-width: 640px)").matches ? 18 : 14;
    const minFrameMs = 1000 / 24;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const normalizeOffset = () => {
      if (halfWidth <= 0) {
        return;
      }
      offset = ((offset % halfWidth) + halfWidth) % halfWidth;
    };

    const recalculateWidth = () => {
      halfWidth = track.scrollWidth / 2;
      normalizeOffset();
    };

    const applyTrackTransform = () => {
      track.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`;
    };

    const tick = (time: number) => {
      if (!isVisible) {
        frameId = null;
        return;
      }

      if (lastPaintTime && time - lastPaintTime < minFrameMs) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }
      lastPaintTime = time;

      if (!lastTime) {
        lastTime = time;
      }
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      offset += (baseSpeed + boostVelocity) * deltaSeconds;
      normalizeOffset();
      applyTrackTransform();

      boostVelocity *= Math.pow(0.94, deltaSeconds * 60);
      if (Math.abs(boostVelocity) < 0.2) {
        boostVelocity = 0;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (frameId !== null || !isVisible) return;
      lastTime = 0;
      lastPaintTime = 0;
      frameId = window.requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!isVisible) return;

      const horizontalDelta = event.deltaX;
      const absX = Math.abs(horizontalDelta);
      const absY = Math.abs(event.deltaY);

      // React only to near-pure horizontal gestures; never block normal page scroll.
      if (absX < 1.2 || absY > 0.6 || absX <= absY * 2) {
        return;
      }

      boostVelocity = clamp(boostVelocity + horizontalDelta * 0.48, -640, 640);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!isVisible || event.touches.length !== 1) {
        return;
      }
      const touch = event.touches[0];
      touchMode = "pending";
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchLastX = touch.clientX;
      touchLastTime = performance.now();
      boostVelocity = 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchMode === "idle" || event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];

      if (touchMode === "pending") {
        const totalX = touch.clientX - touchStartX;
        const totalY = touch.clientY - touchStartY;
        if (Math.abs(totalX) < 8 && Math.abs(totalY) < 8) {
          return;
        }
        if (Math.abs(totalX) <= Math.abs(totalY)) {
          touchMode = "vertical";
          return;
        }
        touchMode = "horizontal";
        stopAnimation();
      }

      if (touchMode !== "horizontal") {
        return;
      }

      event.preventDefault();
      const now = performance.now();
      const deltaX = touch.clientX - touchLastX;
      const deltaSeconds = Math.max((now - touchLastTime) / 1000, 1 / 120);

      offset -= deltaX;
      normalizeOffset();
      applyTrackTransform();

      boostVelocity = clamp((-deltaX / deltaSeconds) * 0.18, -640, 640);
      touchLastX = touch.clientX;
      touchLastTime = now;
    };

    const handleTouchEnd = () => {
      if (touchMode === "horizontal" && isVisible) {
        startAnimation();
      }
      touchMode = "idle";
    };

    recalculateWidth();
    const resizeObserver = new ResizeObserver(recalculateWidth);
    resizeObserver.observe(track);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "80px 0px",
      },
    );
    visibilityObserver.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
        return;
      }

      if (isVisible) {
        startAnimation();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
    };
  }, [canAnimate, items.length]);

  // W trybie przesuwania (mobile/tablet) ustaw start na środkowej (wyróżnionej)
  // atrakcji. K360 pojawia się pierwsze, a Ścieżkę / MARS odsłania się w lewo/prawo.
  useEffect(() => {
    if (canAnimate) {
      return;
    }
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) {
      return;
    }

    const featuredIndex = items.findIndex((item) => item.featured);
    const index = featuredIndex >= 0 ? featuredIndex : Math.floor(items.length / 2);

    const frameId = window.requestAnimationFrame(() => {
      const cardEl = track.children[index] as HTMLElement | undefined;
      if (!cardEl) {
        return;
      }
      const target = cardEl.offsetLeft + cardEl.offsetWidth / 2 - container.clientWidth / 2;
      container.scrollLeft = Math.max(0, target);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [canAnimate, items]);

  const renderItems = canAnimate ? loopItems : items;

  const scrollByCard = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const isWider = window.matchMedia("(min-width: 640px)").matches;
    const cardWidth = isWider ? 352 : 316;
    container.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`attractions-carousel relative mt-8 rounded-2xl ${
          canAnimate ? "overflow-hidden touch-pan-y" : "overflow-x-auto pb-2 snap-x snap-mandatory touch-auto"
        }`}
        style={canAnimate ? undefined : { scrollbarWidth: "none" }}
      >
        {/* Krawędziowy fade usunięty na życzenie. Powodował przyciemnienie/ucięcie kart. */}

        <div
          ref={trackRef}
          className={`attractions-track flex min-w-max gap-4 py-2 sm:gap-5 ${
            canAnimate
              ? "will-change-transform"
              : "px-[max(1rem,calc(50%_-_150px))] sm:px-[max(1rem,calc(50%_-_166px))]"
          }`}
        >
          {renderItems.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={`w-[300px] shrink-0 sm:w-[332px] lg:w-[352px] ${
                canAnimate ? "" : "snap-center"
              }`}
            >
              <AttractionCard {...item} />
            </div>
          ))}
        </div>
      </div>
      {!canAnimate && items.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => scrollByCard("left")}
            aria-label="Poprzednia atrakcja"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 backdrop-blur-md transition active:scale-95 hover:bg-white/12 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 3 5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="inline-flex h-1.5 items-center gap-1" aria-hidden="true">
            {items.map((_, index) => (
              <span
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-white/25"
              />
            ))}
          </span>
          <button
            type="button"
            onClick={() => scrollByCard("right")}
            aria-label="Następna atrakcja"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 backdrop-blur-md transition active:scale-95 hover:bg-white/12 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );
});
