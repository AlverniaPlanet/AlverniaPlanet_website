"use client";

import { Fragment, memo, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { SolarIcon } from "./components/SolarIcon";
import { NEWS_COPY, type NewsSection } from "@/app/components/newsContent";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { FAQ_COPY, type FaqCopy } from "@/app/components/faqContent";
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
import { getSitePaths, getLocalizedPath } from "@/lib/localizedRoutes";
import RepertoireSection from "./atrakcje/kino-360/RepertoireSection";
import HomeSectionHeader from "./components/HomeSectionHeader";

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
  // Nowa sekcja „Bilety" (portale + panel pakietowy).
  heading: string;
  subheading: string;
  chooseLabel: string;
  reducedPrefix: string;
  bestPriceLabel: string;
  bundleTitle: string;
  bundleTagline: string;
  packageCta: string;
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
      heading: "Wybierz swoją przygodę",
      subheading: "Jedna atrakcja czy cały filmowy dzień?",
      chooseLabel: "Wybieram",
      reducedPrefix: "ulgowy",
      bestPriceLabel: "Najlepsza cena",
      bundleTitle: "Zgarnij całą trójkę!",
      bundleTagline: "jeden dzień • jeden bilet",
      packageCta: "Kup pakiet",
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
      heading: "Choose your adventure",
      subheading: "One attraction or a full day of cinema?",
      chooseLabel: "I choose this",
      reducedPrefix: "reduced",
      bestPriceLabel: "Best price",
      bundleTitle: "Get all three!",
      bundleTagline: "one day • one ticket",
      packageCta: "Buy the bundle",
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
      heading: "Escolhe a tua aventura",
      subheading: "Uma atração ou um dia inteiro de cinema?",
      chooseLabel: "Escolho",
      reducedPrefix: "reduzido",
      bestPriceLabel: "Melhor preço",
      bundleTitle: "Leva as três!",
      bundleTagline: "um dia • um bilhete",
      packageCta: "Comprar pacote",
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
      <div className="relative z-10 -mt-10 overflow-x-clip rounded-t-[2rem] bg-[var(--ap-bg)] px-4 pt-16 pb-10 shadow-[0_-28px_60px_rgba(0,0,0,0.55)] sm:-mt-14 sm:rounded-t-[2.75rem] sm:pt-20 sm:pb-14 lg:-mt-16 lg:pt-24 lg:pb-12">
        <HomeContent
          introReady={introReady}
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
        // Gdy warstwa hero (z backdrop-blur) i tak jest już wygaszona, chowamy ją,
        // by nie przeliczać kosztownego backdrop-filter przy dalszym przewijaniu.
        parallaxRef.current.style.visibility = progress >= 0.75 ? "hidden" : "visible";
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
        className={`fixed inset-0 z-0 overflow-hidden bg-black transition-opacity duration-[1300ms] ${
          introReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div ref={zoomRef} className="absolute inset-0 will-change-transform">
          <AdaptiveVideo
            mp4Src="/home/hero.mp4"
            poster="/home/hero.poster.webp"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            sizes="100vw"
            fallbackText={heroVideoFallback}
            priority
            rootMargin="320px 0px"
            preferPosterOnLowPower
            active={videoActive}
          />
        </div>
        {/* Stałe przyciemnienie tła pod napisami hero — kontrast białego tekstu na jaśniejszym wideo */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "radial-gradient(135% 100% at 50% 44%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.44) 38%, rgba(0,0,0,0.2) 72%, rgba(0,0,0,0.06) 100%), linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.55) 100%)",
          }}
          aria-hidden
        />
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
          className={`mt-6 flex w-full flex-row flex-wrap items-center justify-center gap-2.5 transition-[opacity,transform] duration-[1000ms] sm:mt-8 sm:gap-3.5 lg:mt-10 lg:gap-4 ${
            introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "450ms", transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)" }}
        >
          <Link
            href={heroBookingHref}
            className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#ff7a3c] via-[#ff5544] to-[#ff3960] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] !text-white shadow-[0_20px_50px_rgba(255,90,60,0.45),0_0_30px_rgba(255,90,60,0.35)] transition hover:scale-[1.02] hover:brightness-110 sm:gap-3 sm:px-9 sm:py-4 sm:text-sm sm:tracking-[0.2em] lg:px-11 lg:py-5 lg:text-base"
          >
            <SolarIcon name="ticket" size="1.35em" />
            {navLabels.buy}
          </Link>
          <Link
            href={paths.attractions.k360}
            className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-[#7ef6ff]/70 bg-black/40 px-4 py-2.5 text-xs font-semibold !text-white shadow-[0_8px_28px_rgba(0,0,0,0.55),0_0_22px_rgba(126,246,255,0.3)] backdrop-blur-md transition hover:border-[#7ef6ff] hover:bg-black/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_34px_rgba(126,246,255,0.5)] sm:gap-2 sm:px-7 sm:py-4 sm:text-sm lg:px-8 lg:py-5 lg:text-base"
          >
            {navLabels.learnMore}
            <SolarIcon name="arrow-right" size="1.15em" />
          </Link>
        </div>
        <div
          className={`mt-6 flex justify-center transition-[opacity,transform] duration-[1000ms] sm:mt-8 lg:mt-10 ${
            introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "750ms", transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)" }}
        >
          <div className="pointer-events-auto inline-flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center sm:gap-5 sm:rounded-full sm:border sm:border-[#7ef6ff]/25 sm:bg-black/65 sm:px-7 sm:py-3 sm:shadow-[0_18px_50px_rgba(0,0,0,0.6),0_0_22px_rgba(126,246,255,0.18)] sm:backdrop-blur-md sm:supports-[backdrop-filter]:bg-black/55 lg:gap-8 lg:px-9 lg:py-3.5">
            <Link
              href="#content-start"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7ef6ff]/25 bg-black/65 px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] !text-white/90 shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_18px_rgba(126,246,255,0.15)] backdrop-blur-md transition hover:text-[#7ef6ff] supports-[backdrop-filter]:bg-black/55 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:shadow-none sm:backdrop-blur-none sm:supports-[backdrop-filter]:bg-transparent"
            >
              {navLabels.attractions}
              <SolarIcon name="arrow-down" size="1.2em" />
            </Link>
            <span className="hidden h-4 w-px bg-[#7ef6ff]/25 sm:inline-block" aria-hidden="true" />
            <Link
              href={paths.about}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7ef6ff]/25 bg-black/65 px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] !text-white/90 shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_18px_rgba(126,246,255,0.15)] backdrop-blur-md transition hover:text-[#7ef6ff] supports-[backdrop-filter]:bg-black/55 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:shadow-none sm:backdrop-blur-none sm:supports-[backdrop-filter]:bg-transparent"
            >
              <SolarIcon name="info" size="1.2em" />
              {navLabels.about}
            </Link>
            <span className="hidden h-4 w-px bg-[#7ef6ff]/25 sm:inline-block" aria-hidden="true" />
            <Link
              href={paths.gettingThere}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7ef6ff]/25 bg-black/65 px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] !text-white/90 shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_18px_rgba(126,246,255,0.15)] backdrop-blur-md transition hover:text-[#7ef6ff] supports-[backdrop-filter]:bg-black/55 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:shadow-none sm:backdrop-blur-none sm:supports-[backdrop-filter]:bg-transparent"
            >
              <SolarIcon name="route" size="1.2em" />
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
  tickets,
  eventsPromo,
  news,
  secondaryAnimationsReady,
  locale,
}: {
  introReady: boolean;
  tickets: TicketSection;
  eventsPromo: PromoTile;
  news: NewsSection;
  secondaryAnimationsReady: boolean;
  locale: Locale;
}) {
  return (
    <section
      id="content-start"
      className={`relative z-10 mt-10 sm:mt-12 transition-[opacity,transform] duration-[1200ms] ${
        introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: "180ms",
      }}
    >
      <div className="flex flex-col gap-12 sm:gap-16">
        {/* Zdjęcie w tle regionu Repertuaru (od pod hero do czarnego pasa Biletów), full-bleed */}
        <div
          className="relative isolate py-8 sm:py-12"
          style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
        >
          <div className="pointer-events-none absolute inset-x-0 -bottom-[8rem] -top-[7rem] -z-10 overflow-hidden sm:-top-[9rem] sm:-bottom-[10rem]">
            <Image
              src="/home/repertoire-bg.webp"
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              quality={68}
              loading="lazy"
              className="object-cover"
            />
            {/* Lekki czarny fade u góry (miękkie wejście), zdjęcie w środku, dół od razu w czerń */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #000 0%, #000 8%, rgba(7,4,12,0.62) 21%, rgba(7,4,12,0.5) 42%, rgba(7,4,12,0.62) 64%, #000 100%)",
              }}
            />
          </div>
          <div className="px-4">
            <RepertoireSection />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[72rem] 2xl:max-w-[92rem] min-[1800px]:max-w-[104rem]">
          <TicketsSection tickets={tickets} locale={locale} />
        </div>
        <FaqPreviewSection faq={FAQ_COPY[locale]} locale={locale} />
        {/* Wspólne czarne tło (full-bleed, jak sekcja Biletów) dla Wydarzeń i Aktualności */}
        <div
          className="relative isolate py-16 sm:py-24 lg:py-28"
          style={{
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            background:
              "linear-gradient(180deg, var(--ap-bg) 0%, #000 14%, #000 86%, var(--ap-bg) 100%)",
          }}
        >
          <div className="flex flex-col gap-20 px-4 sm:gap-28">
            <EventsPromoSection promo={eventsPromo} />
            <NewsRailSection news={news} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
});

// Etykiety i podtytuły nowego układu strony głównej (edytorialne szyny sekcji).
const HOME_UI: Record<
  Locale,
  {
    learnMore: string;
    readMore: string;
    seeAllAttractions: string;
    seeRepertoire: string;
    seeAllFaq: string;
    seeAllNews: string;
    subAttractions: string;
    subRepertoire: string;
  }
> = {
  pl: {
    learnMore: "Dowiedz się więcej",
    readMore: "Czytaj więcej",
    seeAllAttractions: "Zobacz wszystkie atrakcje",
    seeRepertoire: "Zobacz repertuar",
    seeAllFaq: "Zobacz wszystkie",
    seeAllNews: "Zobacz wszystkie",
    subAttractions: "Trzy światy. Niezliczone emocje. Wybierz swoją misję.",
    subRepertoire: "Sprawdź, co gramy i wybierz swoją przygodę.",
  },
  en: {
    learnMore: "Learn more",
    readMore: "Read more",
    seeAllAttractions: "See all attractions",
    seeRepertoire: "See repertoire",
    seeAllFaq: "See all",
    seeAllNews: "See all",
    subAttractions: "Three worlds. Endless emotions. Choose your mission.",
    subRepertoire: "See what's playing and pick your adventure.",
  },
  pt: {
    learnMore: "Saber mais",
    readMore: "Ler mais",
    seeAllAttractions: "Ver todas as atrações",
    seeRepertoire: "Ver repertório",
    seeAllFaq: "Ver tudo",
    seeAllNews: "Ver tudo",
    subAttractions: "Três mundos. Emoções infinitas. Escolhe a tua missão.",
    subRepertoire: "Vê o que está em cartaz e escolhe a tua aventura.",
  },
};

function FaqPreviewSection({ faq, locale }: { faq: FaqCopy; locale: Locale }) {
  const ui = HOME_UI[locale];
  const faqHref = getSitePaths(locale).faq;
  const items = faq.items.slice(0, 9);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Ten sam lekki reveal wjazdowy co w innych sekcjach (stan Reacta, GPU, bez bibliotek).
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      setSettled(true);
      return;
    }
    const root = sectionRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!revealed || settled) return;
    const id = window.setTimeout(() => setSettled(true), 1500);
    return () => window.clearTimeout(id);
  }, [revealed, settled]);
  const revealCls = settled ? "" : `wpk-reveal${revealed ? " is-visible" : ""}`;

  return (
    <ScrollMotionItem strength="soft" delay={40}>
      <div ref={sectionRef} className="mx-auto w-full max-w-[86rem] 2xl:max-w-[96rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.5fr)] lg:items-start lg:gap-12">
          <div className={revealCls}>
            <HomeSectionHeader
              title={faq.badge}
              subtitle={faq.title}
              cta={{ label: ui.seeAllFaq, href: faqHref }}
            />
          </div>
          <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 lg:items-start">
            {items.map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={item.question}
                  style={{ "--wpk-reveal-delay": `${120 + i * 55}ms` } as CSSProperties}
                  className={`${revealCls} border-t border-white/10`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start gap-3 py-4 text-left"
                  >
                    <span
                      className={`flex-1 text-[0.9rem] font-medium leading-snug transition-colors ${
                        isOpen ? "text-white" : "text-white/75 group-hover:text-white"
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 shrink-0 text-[#f7486c] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <SolarIcon name="chevron-down" size="0.9em" />
                    </span>
                  </button>
                  {/* Płynne rozwijanie bez mierzenia wysokości (grid-rows 0fr→1fr) */}
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-4 pr-2 text-[0.82rem] leading-relaxed text-white/60">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollMotionItem>
  );
}

function NewsRailSection({ news, locale }: { news: NewsSection; locale: Locale }) {
  const ui = HOME_UI[locale];
  const newsHref = getSitePaths(locale).news;
  const featured = news.items[0];
  if (!featured) return null;
  const featuredHref = featured.external ? featured.href : getLocalizedPath(featured.href, locale);
  return (
    <ScrollMotionItem strength="soft" delay={40}>
      <div className="mx-auto w-full max-w-[86rem] 2xl:max-w-[96rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)] lg:items-center lg:gap-12">
          <HomeSectionHeader title={news.title} cta={{ label: ui.seeAllNews, href: newsHref }} className="lg:justify-center" />
          <Link
            href={featuredHref}
            target={featured.external ? "_blank" : undefined}
            rel={featured.external ? "noopener noreferrer" : undefined}
            className="group grid overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/10 transition hover:ring-white/25 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
          >
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#4fcfde]">
                {featured.badge}
              </span>
              <h3 className="mt-2 text-pretty text-xl font-black leading-tight tracking-[-0.01em] text-white sm:text-2xl">
                {featured.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">
                {featured.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white transition-colors group-hover:text-[#ff96aa]">
                {ui.readMore}
                <span aria-hidden="true" className="text-[#f7486c]">→</span>
              </span>
            </div>
            <div className="relative min-h-[11rem] overflow-hidden max-sm:order-first">
              <Image
                src="/galeria/Projekt_MARS/webp/MARS_1.webp"
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width:640px) 32vw, 100vw"
                quality={70}
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(10,6,18,0.6),transparent_45%)] sm:bg-[linear-gradient(to_right,rgba(10,6,18,0.85),transparent_40%)]" />
            </div>
          </Link>
        </div>
        {/* Więcej aktualności — kompaktowa siatka pozostałych pozycji */}
        {news.items.length > 1 ? (
          <div className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {news.items.slice(1, 7).map((item) => {
              const href = item.external ? item.href : getLocalizedPath(item.href, locale);
              return (
                <Link
                  key={item.title}
                  href={href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col border-t border-white/10 py-4 transition-colors hover:border-[#f7486c]/50"
                >
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#4fcfde]">
                    {item.badge}
                  </span>
                  <h4 className="mt-1.5 line-clamp-2 text-[0.9rem] font-bold leading-snug text-white/80 transition-colors group-hover:text-white">
                    {item.title}
                  </h4>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </ScrollMotionItem>
  );
}

// Kolory akcentów sekcji „Bilety" (dokładnie wg referencji).
const TICKET_ACCENTS: Record<NonNullable<TicketOption["accent"]>, string> = {
  red: "#ff4773",
  orange: "#ff843d",
  cyan: "#56ddea",
};

// Grafika portalu (wideo) + ikona wg akcentu atrakcji (K360 = red, MARS = orange, FILMWORLD = cyan).
const TICKET_PORTALS: Record<
  NonNullable<TicketOption["accent"]>,
  { video: { mp4: string; webm: string; poster: string }; icon: ReactNode }
> = {
  red: {
    video: { mp4: "/home/Bilet/kino360.mp4", webm: "/home/Bilet/kino360.webm", poster: "/home/Bilet/kino360.poster.webp" },
    icon: <SolarIcon name="clapperboard" />,
  },
  orange: {
    video: { mp4: "/home/Bilet/mars.mp4", webm: "/home/Bilet/mars.webm", poster: "/home/Bilet/mars.poster.webp" },
    icon: <SolarIcon name="rocket" />,
  },
  cyan: {
    video: { mp4: "/home/Bilet/filmworld.mp4", webm: "/home/Bilet/filmworld.webm", poster: "/home/Bilet/filmworld.poster.webp" },
    icon: <SolarIcon name="videocamera" />,
  },
};

// Podstrona atrakcji dla przycisku „Dowiedz się więcej" wg akcentu.
const TICKET_ATTRACTION_PAGE: Record<NonNullable<TicketOption["accent"]>, string> = {
  red: "/atrakcje/kino-360",
  orange: "/atrakcje/mars",
  cyan: "/atrakcje/filmworld",
};

// „Bilety" — trzy portale (łuki) połączone znakami „+" i szeroki panel pakietowy.
const TicketsSection = memo(function TicketsSection({
  tickets,
  locale,
}: {
  tickets: TicketSection;
  locale: Locale;
}) {
  const options = tickets.options;
  const ui = HOME_UI[locale];
  const promo = PROMO_PACKAGES[locale][0];

  // Skróć końcówki ",00"/".00" (np. „119,00 zł" → „119 zł").
  const shorten = (s: string) => s.replace(/[.,]00/g, "");
  // Sufiks „za osobę" pobrany z ceny pierwszej atrakcji (/os., /person, /pessoa).
  const perUnit = `/${options[0]?.price?.split("/")[1]?.trim() ?? "os."}`;

  const bookingHrefFor = (o: TicketOption) =>
    o.bookingServiceName
      ? buildBookingPath(locale, {
          category: o.bookingCategory ?? FILM_PATH_BOOKING_CATEGORY,
          service: o.bookingServiceName,
          quantity: o.bookingQuantity,
        })
      : o.href ?? tickets.ctaHref;

  const packageHref = buildBookingPath(locale, {
    category: promo.category,
    service: promo.service,
    autopick: promo.autopick,
  });

  const [promoNum, ...promoCurRest] = shorten(promo.reducedPrice).split(" "); // „99", „zł"
  const promoCur = promoCurRest.join(" ");
  // Cena kupując osobno = suma cen normalnych 3 atrakcji (49+69+79); oszczędność względem pakietu.
  const individualSum = options.reduce((sum, o) => sum + (parseInt(o.price ?? "0", 10) || 0), 0);
  const savingsVsIndividual = individualSum - (parseInt(promoNum, 10) || 0);
  const oldStruck = `${individualSum} ${promoCur}`.trim(); // np. „197 zł" (osobno)
  const normalPrice = shorten(promo.price); // np. „119 zł" — normalna cena pakietu (99 to ulgowy)
  const savingsPrefix = shorten(promo.savings).replace(/[\d.,].*/, "").trim(); // „Oszczędzasz"
  const savingsText = `${savingsPrefix} ${savingsVsIndividual} ${promoCur}`.trim(); // „Oszczędzasz 98 zł"

  // Lekki reveal wjazdowy — ta sama, sprawdzona metoda co w repertuarze: sterowana
  // STANEM Reacta (nie classList), transform+opacity na GPU, po animacji zdejmujemy
  // klasę (i will-change). Bez bibliotek i nowych zasobów.
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      setSettled(true);
      return;
    }
    const root = sectionRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!revealed || settled) return;
    const id = window.setTimeout(() => setSettled(true), 1500);
    return () => window.clearTimeout(id);
  }, [revealed, settled]);
  const revealCls = settled ? "" : `wpk-reveal${revealed ? " is-visible" : ""}`;

  return (
    <ScrollMotionItem strength="soft" delay={30} float={false} className="home-deferred-block">
      <section
        ref={sectionRef}
        aria-labelledby="tickets-heading"
        className="relative isolate py-16 sm:py-24 lg:py-28"
        style={{
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          // Góra od razu czarna (styka się z czernią zdjęcia nad sekcją); dół wtapia w granat pod FAQ
          background:
            "linear-gradient(180deg, #000 0%, #000 86%, var(--ap-bg) 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-[72rem] px-4 sm:px-8 lg:px-12 2xl:max-w-[92rem] min-[1800px]:max-w-[104rem]">
          {/* Nagłówek — wyśrodkowany */}
          <div className={`mx-auto max-w-2xl text-center ${revealCls}`}>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.3em] text-[#ff4773]">
            {tickets.title}
          </p>
          <h2
            id="tickets-heading"
            className="mt-2.5 text-[clamp(2.1rem,1.3rem+3.2vw,3.9rem)] font-black leading-[1.02] tracking-[-0.03em] text-white"
          >
            {tickets.heading}
          </h2>
          <p className="mt-3 text-base text-white/55 sm:text-lg">{tickets.subheading}</p>
        </div>

        {/* Portale (łuki) połączone znakami „+" */}
        <div className="mt-12 flex flex-col items-center gap-10 sm:mt-16 sm:flex-row sm:items-start sm:justify-center sm:gap-0">
          {options.map((option, i) => {
            const accent = option.accent ?? "cyan";
            const hex = TICKET_ACCENTS[accent];
            const portal = TICKET_PORTALS[accent];
            const [priceNum, ...unitRest] = (option.price ?? "").split(" ");
            const priceUnit = unitRest.join(" ");
            const reducedShort = (option.reducedPrice ?? "").split("/")[0].trim();
            const href = bookingHrefFor(option);
            const attractionHref = getLocalizedPath(TICKET_ATTRACTION_PAGE[accent], locale);
            const isLast = i === options.length - 1;
            const linkColor = i === 0 ? "#ff4773" : "#56ddea";
            return (
              <Fragment key={option.title}>
                <div
                  style={{ "--wpk-reveal-delay": `${140 + i * 120}ms` } as CSSProperties}
                  className={`${revealCls} flex flex-1 flex-col items-center px-2 text-center sm:max-w-[21rem]`}
                >
                  {/* Portal (łuk) — klikalny, ale poza kolejnością tab (dubluje przycisk „Wybieram") */}
                  <Link
                    href={href}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="group relative block w-full max-w-[17rem] overflow-hidden"
                    style={{
                      aspectRatio: "4 / 5",
                      borderRadius: "48% 48% 16px 16px / 34% 34% 10px 10px",
                      boxShadow: `inset 0 0 0 2px ${hex}, 0 0 34px ${hex}44`,
                    }}
                  >
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={portal.video.poster}
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <source src={portal.video.mp4} type="video/mp4" />
                      <source src={portal.video.webm} type="video/webm" />
                    </video>
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, rgba(7,10,22,0.9) 3%, rgba(7,10,22,0.15) 42%, transparent 62%), radial-gradient(115% 75% at 50% 0%, ${hex}26, transparent 62%)`,
                      }}
                    />
                    <span
                      className="absolute bottom-3.5 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center text-2xl"
                      style={{ color: hex, filter: `drop-shadow(0 0 7px ${hex}99)` }}
                    >
                      {/* Ramka „viewfinder" (frame.svg) w kolorze akcentu — zamiast kółka */}
                      <span
                        className="absolute inset-0"
                        style={{
                          backgroundColor: "currentColor",
                          WebkitMask: "url(/icon/frame.svg) center / contain no-repeat",
                          mask: "url(/icon/frame.svg) center / contain no-repeat",
                        }}
                        aria-hidden
                      />
                      {portal.icon}
                    </span>
                  </Link>

                  {/* Opis */}
                  <h3 className="mt-5 text-[1.6rem] font-black tracking-[-0.02em] text-white">
                    {option.title}
                  </h3>
                  <p className="mt-2 max-w-[18rem] text-[0.98rem] leading-snug text-white/75">
                    {option.subtitle}
                  </p>

                  {/* Cena */}
                  <p className="mt-4 flex items-baseline justify-center gap-1.5">
                    <span className="text-[2.6rem] font-black leading-none" style={{ color: hex }}>
                      {priceNum}
                    </span>
                    <span className="text-base font-bold text-white/85">{priceUnit}</span>
                  </p>
                  <p className="mt-1 text-[0.82rem] text-white/45">
                    {tickets.reducedPrefix}{" "}
                    <span className="font-semibold text-white/70">{reducedShort}</span>
                  </p>

                  {/* Przycisk „Wybieram" */}
                  <Link
                    href={href}
                    aria-label={`${tickets.chooseLabel}: ${option.title}`}
                    className="ticket-pill mt-4 inline-flex w-full max-w-[13rem] items-center justify-center rounded-[var(--ap-btn-radius)] px-6 py-2.5 text-sm font-extrabold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05030a]"
                    style={{ backgroundColor: hex, boxShadow: `0 10px 26px ${hex}55` }}
                  >
                    {tickets.chooseLabel}
                  </Link>
                  <Link
                    href={attractionHref}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded text-[0.78rem] font-semibold text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    {ui.learnMore}
                    <span aria-hidden="true" className="inline-flex" style={{ color: hex }}>
                      <SolarIcon name="arrow-right" size="0.9em" />
                    </span>
                  </Link>
                </div>

                {/* Łącznik „+" (nie po ostatnim portalu) */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-center px-1 py-1 sm:items-start sm:px-2 sm:py-0 lg:px-4"
                  >
                    <span
                      className="text-3xl font-thin leading-none sm:mt-[min(13vw,8.5rem)] sm:text-[2.6rem]"
                      style={{ color: linkColor, textShadow: `0 0 16px ${linkColor}88` }}
                    >
                      +
                    </span>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Panel pakietowy — szeroki, niski, z gradientową obwódką koral→fiolet→turkus */}
        <div
          className={`mt-12 rounded-[1.6rem] p-px sm:mt-16 ${revealCls}`}
          style={{
            background: "linear-gradient(100deg,#ff4773 0%,#a855f7 50%,#56ddea 100%)",
            boxShadow: "0 26px 60px rgba(0,0,0,0.5)",
            "--wpk-reveal-delay": "520ms",
          } as CSSProperties}
        >
          <div className="relative overflow-hidden rounded-[calc(1.6rem-1px)] bg-[#0b1022] px-5 py-6 sm:px-8 sm:py-7">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 130% at 0% 50%, rgba(255,71,115,0.12), transparent 62%), radial-gradient(60% 130% at 100% 50%, rgba(86,221,234,0.12), transparent 62%)",
              }}
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
              {/* Info: etykieta + tytuł | skład + tagline */}
              <div className="flex min-w-0 flex-col gap-4 lg:flex-1 lg:flex-row lg:items-center lg:gap-7">
                <div className="lg:shrink-0">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color: "#ff8da3",
                      border: "1px solid rgba(255,71,115,0.4)",
                      background: "rgba(255,71,115,0.08)",
                    }}
                  >
                    {tickets.bestPriceLabel}
                  </span>
                  <h3 className="mt-3 text-[1.55rem] font-black uppercase leading-[0.98] tracking-[-0.02em] text-white sm:text-[1.7rem] md:whitespace-nowrap">
                    {tickets.bundleTitle}
                  </h3>
                </div>

                <div className="min-w-0 lg:border-l lg:border-white/10 lg:pl-7">
                  <p className="text-lg font-black tracking-[-0.01em] sm:text-xl">
                    {options.map((o, i) => (
                      <Fragment key={o.title}>
                        {i > 0 && <span className="text-white/35"> + </span>}
                        <span style={{ color: TICKET_ACCENTS[o.accent ?? "cyan"] }}>
                          {o.title.toUpperCase()}
                        </span>
                      </Fragment>
                    ))}
                  </p>
                  <p className="mt-1 text-sm text-white/50">{tickets.bundleTagline}</p>
                </div>
              </div>

              {/* Akcje: ceny + oszczędność + przycisk */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-4 lg:shrink-0 lg:justify-end">
                {/* Ceny: osobno (przekreślone) + pakiet ulgowy z ceną normalną */}
                <div className="flex items-end gap-3 lg:flex-col lg:items-end lg:gap-1">
                  <span className="text-lg font-semibold text-white/35 line-through">{oldStruck}</span>
                  <div className="flex flex-col lg:items-end">
                    <span className="flex items-baseline gap-1.5">
                      <span className="text-[2.4rem] font-black leading-none text-white">{promoNum}</span>
                      <span className="text-base font-bold text-white/80">
                        {promoCur}
                        {perUnit}
                      </span>
                      <span className="self-center rounded-full border border-white/20 px-2 py-0.5 text-[0.52rem] font-bold uppercase tracking-[0.12em] text-white/70">
                        {tickets.reducedPrefix}
                      </span>
                    </span>
                    <span className="mt-0.5 text-[0.72rem] text-white/45">
                      {promo.priceLabel}{" "}
                      <span className="font-semibold text-white/60">{normalPrice}</span>
                    </span>
                  </div>
                </div>

                {/* Oszczędność */}
                <span
                  className="inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{
                    color: "#7fe9f2",
                    border: "1px solid rgba(86,221,234,0.4)",
                    background: "rgba(86,221,234,0.08)",
                  }}
                >
                  {savingsText}
                </span>

                {/* Przycisk „Kup pakiet" */}
                <Link
                  href={packageHref}
                  className="ticket-pill inline-flex w-full shrink-0 items-center justify-center rounded-full px-7 py-3 text-sm font-extrabold transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1022] sm:w-auto"
                  style={{
                    backgroundColor: "#56ddea",
                    color: "#04222a",
                    boxShadow: "0 12px 30px rgba(86,221,234,0.4)",
                  }}
                >
                  {tickets.packageCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
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
                loading="lazy"
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
                loading="lazy"
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
              <PrimaryButton
                href={promo.href}
                size="md"
                className="!bg-[linear-gradient(135deg,#2fb9cc,#5ad7e8)] !font-extrabold !text-[#04222a] !shadow-[0_8px_22px_rgba(79,207,222,0.4)] ring-[color:rgba(79,207,222,0.6)] hover:!brightness-110"
              >
                {promo.cta}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ScrollMotionItem>
  );
});
