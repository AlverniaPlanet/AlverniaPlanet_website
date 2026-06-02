"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { AttractionCard } from "@/app/components/AttractionCard";
import { NEWS_COPY, NewsSectionBlock, type NewsSection } from "@/app/components/newsContent";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { waitForImagesReady } from "@/app/components/waitForImagesReady";
import {
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
};

type TicketOption = {
  badge: string;
  title: string;
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
    heroTitle: "Witamy w Alvernia Planet",
    heroPromos: [
      {
        message: "Przeżyj projekcję K360",
        cta: "Zobacz projekcję K360",
        href: "/atrakcje/k360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Atrakcje",
      intro: "Wejdź do świata kopuł i zacznij od naszych trzech flagowych doświadczeń.",
      items: [
        {
          title: "Projekcja K360",
          description:
            "Immersyjna projekcja fulldome w jednej z najbardziej zaawansowanych kopuł w Europie.",
          cta: "Zobacz projekcję K360",
          href: "/atrakcje/k360",
          image: "/galeria/K360/2.webp",
          imageAlt: "Kadr z projekcji K360 — fulldome na całej kopule",
          accent: "red",
        },
        {
          title: "Projekt: MARS",
          description:
            "Wciel się w bohatera własnej misji i nakręć krótki film na profesjonalnej scenografii marsjańskiej.",
          cta: "Odkryj Projekt: MARS",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronauta na powierzchni Marsa — Projekt: MARS w Alvernia Planet",
          accent: "orange",
        },
        {
          title: "Ścieżka filmowa",
          description:
            "Zakulisowa trasa przez plany zdjęciowe, rekwizyty i technologię używaną w produkcjach filmowych.",
          cta: "Poznaj ścieżkę filmową",
          href: "/atrakcje/sciezka-filmowa",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Elementy scenografii na ścieżce filmowej",
          accent: "cyan",
        },
      ],
    },
    tickets: {
      title: "Bilety",
      intro:
        "Wybierz atrakcję i kup bilet bezpośrednio na jej podstronie.",
      headerCta: "Trzy atrakcje, jeden krok do rezerwacji",
      headerCtaSub: "K360, Projekt: MARS i Ścieżka filmowa — każda ma własną sprzedaż biletów.",
      priceLabel: "Cena za osobę",
      price: "79 zł/os. lub 69 zł/os.",
      cta: "Kup bilet",
      ctaHref: "/rezerwuj",
      promoTicket: {
        badge: "Pakiet",
        title: "Ścieżka + Projekcja K360",
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
          title: "Projekcja K360",
          subtitle: "Immersyjne fulldome na 360°",
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
          title: "Projekt: MARS",
          subtitle: "Wciel się w bohatera misji",
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
          badge: "Ścieżka",
          title: "Ścieżka filmowa",
          subtitle: "Zakulisowa trasa po planach",
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
    heroTitle: "Welcome to Alvernia Planet",
    heroPromos: [
      {
        message: "Experience the K360 projection",
        cta: "See K360 projection",
        href: "/atrakcje/k360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Attractions",
      intro: "Start with our signature experiences inside the domes.",
      items: [
        {
          title: "K360 projection",
          description: "Immersive dome projection with the image all around you.",
          cta: "See K360 projection",
          href: "/atrakcje/k360",
          image: "/galeria/K360/2.webp",
          imageAlt: "Frame from the K360 projection — fulldome across the ceiling",
          accent: "red",
        },
        {
          title: "Mars Project",
          description:
            "Step into your own mission and shoot a short film on a professional Martian set.",
          cta: "Discover Mars Project",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronaut on the Martian surface — Mars Project at Alvernia Planet",
          accent: "orange",
        },
        {
          title: "Film Path",
          description:
            "A behind-the-scenes walk through sets, props, and the technology that powers productions.",
          cta: "Explore the film path",
          href: "/atrakcje/sciezka-filmowa",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Film set elements on the film path",
          accent: "cyan",
        },
      ],
    },
    tickets: {
      title: "Tickets",
      intro: "Pick an attraction and buy tickets directly on its page.",
      headerCta: "Three attractions, one step to booking",
      headerCtaSub: "K360, Mars Project and Film Path — each has its own ticket flow.",
      priceLabel: "Price per person",
      price: "79 PLN/person or 69 PLN/person",
      cta: "Buy tickets",
      ctaHref: "/en/reserve",
      promoTicket: {
        badge: "Package",
        title: "Film Path + K360 projection",
        subtitle:
          "One large promotional package that combines the Film Path visit with a K360 projection.",
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
          title: "K360 projection",
          subtitle: "Immersive 360° fulldome",
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
          title: "Mars Project",
          subtitle: "Star in your own mission",
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
          badge: "Film Path",
          title: "Film Path",
          subtitle: "Behind-the-scenes walk",
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
    heroTitle: "Bem-vindo à Alvernia Planet",
    heroPromos: [
      {
        message: "Vive a projeção K360",
        cta: "Ver a projeção K360",
        href: "/atrakcje/k360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Atrações",
      intro: "Entre no mundo das cúpulas e comece pelas nossas três experiências emblemáticas.",
      items: [
        {
          title: "Projeção K360",
          description:
            "Projeções imersivas em cúpula com imagem a 360° numa das estruturas mais avançadas da Europa.",
          cta: "Ver a projeção K360",
          href: "/atrakcje/k360",
          image: "/galeria/K360/2.webp",
          imageAlt: "Imagem da projeção K360 — fulldome em toda a cúpula",
          accent: "red",
        },
        {
          title: "Projeto MARS",
          description:
            "Encarna o herói da tua missão e filma uma curta numa cenografia marciana profissional.",
          cta: "Descobrir Projeto MARS",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronauta na superfície de Marte — Projeto MARS na Alvernia Planet",
          accent: "orange",
        },
        {
          title: "Percurso de filmagem",
          description:
            "Uma visita aos bastidores com cenários, adereços e tecnologia usada nas produções.",
          cta: "Conheça o percurso",
          href: "/atrakcje/sciezka-filmowa",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Elementos de cenário no percurso de filmagem",
          accent: "cyan",
        },
      ],
    },
    tickets: {
      title: "Bilhetes",
      intro: "Escolhe uma atração e compra o bilhete diretamente na sua página.",
      headerCta: "Três atrações, um passo até à reserva",
      headerCtaSub: "K360, Projeto MARS e Percurso de filmagem — cada um com a sua venda.",
      priceLabel: "Preço por pessoa",
      price: "79 PLN/pessoa ou 69 PLN/pessoa",
      cta: "Comprar bilhetes",
      ctaHref: "/pt/reservar",
      promoTicket: {
        badge: "Pacote",
        title: "Percurso + Projeção K360",
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
          title: "Projeção K360",
          subtitle: "Fulldome imersivo a 360°",
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
          title: "Projeto MARS",
          subtitle: "Encarna o herói da missão",
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
          badge: "Percurso",
          title: "Percurso de filmagem",
          subtitle: "Visita aos bastidores",
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
  { attractions: string; about: string; route: string; buy: string }
> = {
  pl: {
    attractions: "Sprawdź atrakcje",
    about: "Informacje",
    route: "Jak dojechać",
    buy: "Kup bilet",
  },
  en: {
    attractions: "See attractions",
    about: "Information",
    route: "How to get there",
    buy: "Buy ticket",
  },
  pt: {
    attractions: "Ver atrações",
    about: "Informações",
    route: "Como chegar",
    buy: "Comprar bilhete",
  },
};

const HeroSection = memo(function HeroSection({
  heroTitle,
  heroVideoFallback,
  introReady,
  heroWelcomeVisible,
  locale,
}: {
  heroTitle: string;
  heroVideoFallback: string;
  introReady: boolean;
  heroWelcomeVisible: boolean;
  locale: Locale;
}) {
  const paths = getSitePaths(locale);
  const navLabels = HERO_NAV_LABELS[locale];
  const heroBookingHref = buildBookingPath(locale, {
    category: K360_BOOKING_CATEGORY,
    service: K360_BOOKING_SERVICES.reduced,
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
      // tell when it's covered — drive playback from scroll instead.
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
      <div
        className={`pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center justify-center px-4 text-center transition-[opacity,transform,filter] duration-[1400ms] will-change-[opacity,transform,filter] sm:top-[44%] lg:top-[42%] ${
          introReady
            ? "opacity-100 translate-y-[-50%] blur-0 scale-100"
            : "opacity-0 translate-y-[calc(-50%+2.5rem)] blur-2xl scale-[0.88]"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: "320ms",
        }}
      >
        <h1 className="ap-type-hero-title !text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.75),0_12px_30px_rgba(0,0,0,0.85),0_24px_60px_rgba(0,0,0,0.6)]">
          {heroTitle}
        </h1>
        <div className="mt-6 sm:mt-8 lg:mt-10">
          <Link
            href={heroBookingHref}
            className="pointer-events-auto inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-[#ff7a3c] via-[#ff5544] to-[#ff3960] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] !text-white shadow-[0_20px_50px_rgba(255,90,60,0.45),0_0_30px_rgba(255,90,60,0.35)] transition hover:scale-[1.02] hover:brightness-110 sm:px-10 sm:py-4 sm:text-base lg:px-12 lg:py-5 lg:text-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
        </div>
        <div className="mt-6 flex justify-center sm:mt-8 lg:mt-10">
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
  return (
    <ScrollMotionItem strength="strong" delay={40}>
      <div className="mx-auto w-full max-w-[92rem] lg:max-w-[80rem] 2xl:max-w-[92rem]">
        <div className="text-center">
          <h2 className="ap-type-section-title !text-[clamp(2.6rem,2rem+2.6vw,4.6rem)] !leading-[1.05]">{attractions.title}</h2>
          <div className="mx-auto mt-4 h-[3px] w-28 rounded-full bg-gradient-to-r from-[#f03c64] via-[#f77828] to-[#4fcfde]" />
          <p className="ap-type-section-body mx-auto mt-6 max-w-2xl !text-[clamp(1.15rem,1rem+0.7vw,1.6rem)] !leading-[1.5] lg:max-w-none lg:whitespace-nowrap">{attractions.intro}</p>
        </div>

        {/* Mobile + tablet: roller jak był */}
        <div className="lg:hidden">
          <AttractionsScroller items={attractions.items} animate={animate} />
        </div>

        {/* Desktop (lg+): statyczna siatka 3 kolumn */}
        <div className="mt-14 hidden gap-8 lg:grid lg:grid-cols-3">
          {attractions.items.map((item) => (
            <AttractionCard key={item.title} {...item} />
          ))}
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
    priceColor: string;
    buttonClass: string;
  }
> = {
  red: {
    badgeBg: "linear-gradient(135deg, #f7486c, #ff96aa)",
    badgeColor: "#2a0410",
    badgeShadow: "0 8px 22px rgba(247, 72, 108, 0.32)",
    divider:
      "linear-gradient(90deg, rgba(247,72,108,0) 0%, rgba(247,72,108,0.55) 50%, rgba(247,72,108,0) 100%)",
    dot: "#ff7a92",
    glow: "radial-gradient(circle at top left, rgba(247,72,108,0.18), transparent 38%), radial-gradient(circle at bottom right, rgba(247,72,108,0.08), transparent 32%)",
    border: "border-[rgba(247,72,108,0.32)]",
    priceColor: "text-[#ff96aa]",
    buttonClass:
      "ticket-pill w-full !bg-[#f7486c] ring-[color:rgba(247,72,108,0.55)] hover:!brightness-110",
  },
  orange: {
    badgeBg: "linear-gradient(135deg, #f77828, #ffb585)",
    badgeColor: "#2a0f04",
    badgeShadow: "0 8px 22px rgba(247, 120, 40, 0.32)",
    divider:
      "linear-gradient(90deg, rgba(247,120,40,0) 0%, rgba(247,120,40,0.55) 50%, rgba(247,120,40,0) 100%)",
    dot: "#ff9357",
    glow: "radial-gradient(circle at top left, rgba(247,120,40,0.18), transparent 38%), radial-gradient(circle at bottom right, rgba(247,120,40,0.08), transparent 32%)",
    border: "border-[rgba(247,120,40,0.32)]",
    priceColor: "text-[#ffb585]",
    buttonClass:
      "ticket-pill w-full !bg-[linear-gradient(135deg,#f77828,#ffb585)] !text-[#2a0f04] !shadow-[0_8px_18px_rgba(247,120,40,0.32)] ring-[color:rgba(247,120,40,0.55)] hover:!brightness-110",
  },
  cyan: {
    badgeBg: "linear-gradient(135deg, #4fcfde, #a5e6f0)",
    badgeColor: "#062a33",
    badgeShadow: "0 8px 22px rgba(79, 207, 222, 0.32)",
    divider:
      "linear-gradient(90deg, rgba(79,207,222,0) 0%, rgba(79,207,222,0.55) 50%, rgba(79,207,222,0) 100%)",
    dot: "#7ef6ff",
    glow: "radial-gradient(circle at top left, rgba(79,207,222,0.18), transparent 38%), radial-gradient(circle at bottom right, rgba(79,207,222,0.08), transparent 32%)",
    border: "border-[rgba(79,207,222,0.32)]",
    priceColor: "text-[#7ef6ff]",
    buttonClass:
      "ticket-pill w-full !bg-[linear-gradient(135deg,#4fcfde,#7ef6ff)] !text-[#062a33] !shadow-[0_8px_18px_rgba(79,207,222,0.32)] ring-[color:rgba(79,207,222,0.55)] hover:!brightness-110",
  },
};

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

  return (
    <div
      className={`ticket-card ap-tile group relative flex h-full flex-col overflow-hidden rounded-3xl text-white/90 border ${tokens.border}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: tokens.glow }}
        aria-hidden="true"
      />
      <div className="ticket-card-top relative">
        <span
          className="ticket-card-badge"
          style={{ background: tokens.badgeBg, color: tokens.badgeColor, boxShadow: tokens.badgeShadow }}
        >
          {option.badge}
        </span>
      </div>
      <div className="ticket-card-content relative flex h-full flex-col p-4 text-center sm:p-6">
        <h3 className="ticket-card-title text-lg font-semibold text-white sm:text-2xl">
          {option.title}
        </h3>
        <p className="ticket-card-subtitle mt-1.5 text-xs text-white/75 sm:mt-2 sm:text-base">
          {option.subtitle}
        </p>
        <div className="mt-4 h-px w-full sm:mt-6" style={{ background: tokens.divider }} />
        <ul className="ticket-list-panel mx-auto mb-6 mt-4 max-w-sm space-y-2.5 text-left text-xs text-white/75 sm:mb-8 sm:mt-5 sm:space-y-3 sm:text-sm">
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
        <div className="ticket-price-block mt-auto pt-5 sm:pt-7">
          <p className="ticket-price-label text-[0.65rem] uppercase tracking-[0.22em] text-white/60 sm:text-[0.7rem] sm:tracking-[0.25em]">
            {option.priceLabel ?? defaultPriceLabel}
          </p>
          <p className={`ticket-price mt-1.5 text-xl font-bold sm:mt-2 sm:text-3xl ${tokens.priceColor}`}>
            {option.price ?? defaultPrice}
          </p>
          {option.reducedPrice ? (
            <div className="mt-3 flex flex-col items-center gap-0.5 border-t border-white/10 pt-3">
              <p className="text-[0.6rem] uppercase tracking-[0.22em] text-white/45 sm:text-[0.65rem]">
                {option.reducedPriceLabel}
              </p>
              <p className="text-sm font-semibold text-white/80 sm:text-base">
                {option.reducedPrice}
              </p>
            </div>
          ) : null}
          <div className="mt-4 flex justify-center sm:mt-6">
            {isComingSoon ? (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="ticket-pill w-full cursor-not-allowed whitespace-nowrap rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white/55 ring-1 ring-white/10"
              >
                {buttonLabel}
              </button>
            ) : (
              <PrimaryButton
                href={linkHref}
                size="md"
                className={`whitespace-nowrap ${tokens.buttonClass}`}
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
          <p className="mt-3 ap-type-cta-body !text-[clamp(1.05rem,0.95rem+0.5vw,1.4rem)] !leading-[1.5]">{tickets.headerCtaSub}</p>
        </div>
        <div className="mt-8 space-y-6 sm:space-y-8">
          {PROMO_PACKAGES[locale].map((promo) => (
            <article
              key={promo.title}
              className="home-ticket-promo ap-tile ap-tile-lg ap-tile-accent relative overflow-hidden px-4 py-5 sm:px-7 sm:py-7"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,207,222,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(79,207,222,0.08),transparent_32%)]" />
              <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
                  <span className="ticket-card-badge mx-auto lg:mx-0">{promo.badge}</span>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-[color:var(--ap-text-strong)] sm:text-3xl lg:text-4xl">
                      {promo.title}
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

                <div className="flex w-full flex-col items-center gap-3 sm:gap-4 lg:w-auto lg:items-end">
                  <div className="home-ticket-promo-price ap-tile ap-tile-sm w-full max-w-[27rem] px-4 py-3.5 text-center sm:px-5 sm:py-4 lg:text-right">
                    <div className="grid grid-cols-2 gap-0 lg:text-right">
                      <div className="pr-3 sm:pr-4">
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--ap-text-muted)] sm:text-xs">
                          {promo.priceLabel}
                        </p>
                        <p className="mt-1 text-xl font-semibold leading-none tracking-[-0.03em] text-[color:var(--ap-text-strong)] sm:text-2xl lg:text-[1.75rem]">
                          {promo.price}
                        </p>
                        <p className="mt-1.5 inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap text-[0.65rem] font-semibold leading-tight text-[color:var(--ap-breeze-strong)] sm:text-[0.72rem]">
                          <span>−{promo.savingsPercent}</span>
                          <span className="text-[color:var(--ap-text-muted)]">{promo.savings}</span>
                        </p>
                      </div>
                      <div className="border-l border-[color:var(--ap-border)] pl-3 sm:pl-4">
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--ap-text-muted)] sm:text-xs">
                          {promo.reducedPriceLabel}
                        </p>
                        <p className="mt-1 text-xl font-semibold leading-none tracking-[-0.03em] text-[color:var(--ap-text-strong)] sm:text-2xl lg:text-[1.75rem]">
                          {promo.reducedPrice}
                        </p>
                        <p className="mt-1.5 inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap text-[0.65rem] font-semibold leading-tight text-[color:var(--ap-breeze-strong)] sm:text-[0.72rem]">
                          <span>−{promo.reducedSavingsPercent}</span>
                          <span className="text-[color:var(--ap-text-muted)]">{promo.reducedSavings}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <PrimaryButton
                    href={buildBookingPath(locale, { category: promo.category })}
                    size="lg"
                    className="ticket-pill w-full whitespace-nowrap ring-[color:rgba(240,60,100,0.55)] sm:w-auto sm:min-w-[13rem]"
                  >
                    {promo.button}
                  </PrimaryButton>
                </div>
              </div>
            </article>
          ))}

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2 xl:grid-cols-3">
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
        {canAnimate ? (
          <>
            <div
              className="attractions-edge-fade attractions-edge-fade-left pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[color:var(--ap-bg)] to-transparent sm:w-20"
              aria-hidden="true"
            />
            <div
              className="attractions-edge-fade attractions-edge-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[color:var(--ap-bg)] to-transparent sm:w-20"
              aria-hidden="true"
            />
          </>
        ) : null}

        <div
          ref={trackRef}
          className={`attractions-track flex min-w-max gap-4 py-2 sm:gap-5 ${
            canAnimate ? "will-change-transform" : "pr-4"
          }`}
        >
          {renderItems.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={`w-[300px] shrink-0 sm:w-[332px] lg:w-[352px] ${
                canAnimate ? "" : "snap-start"
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
