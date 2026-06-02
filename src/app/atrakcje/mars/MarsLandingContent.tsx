"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { FaArrowDown, FaChevronDown, FaChevronRight, FaFilm, FaLocationDot, FaMobileScreen, FaRocket, FaTriangleExclamation } from "react-icons/fa6";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import TourLineAccentTitle from "@/app/components/TourLineAccentTitle";
import TourLineGalleryRow from "@/app/components/TourLineGalleryRow";
import styles from "./MarsLandingContent.module.css";
import {
  buildBookingPath,
  K360_MARS_PROMO_BOOKING_CATEGORY,
  MARS_BOOKING_CATEGORY,
  MARS_BOOKING_SERVICES,
} from "@/lib/booking";

const MARS_PROMO_TICKET = {
  badge: "Pakiet",
  title: "K360 + Projekt: MARS",
  subtitle:
    "Pakiet promocyjny łączący Projekt MARS z projekcją K360 — dwie atrakcje w jednej cenie.",
  details: ["Dwie atrakcje w jednym dniu"],
  priceLabel: "Cena normalna",
  price: "89,00 zł",
  savings: "Oszczędzasz 29,00 zł",
  savingsPercent: "25%",
  reducedPriceLabel: "Cena ulgowa",
  reducedPrice: "79,00 zł",
  reducedSavings: "Oszczędzasz 19,00 zł",
  reducedSavingsPercent: "19%",
  button: "Wybierz pakiet",
};

type MarsTicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  price: string;
  priceLabel: string;
  bookingServiceName: string;
  bookingQuantity?: number;
};

const MARS_GALLERY_ITEMS = [
  {
    title: "Marsjański plan",
    body: "Profesjonalna scenografia, w której kręcisz swój krótki film.",
    image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
  },
  {
    title: "Wnętrze misji",
    body: "Detale wyposażenia i scenografia gotowa pod kamerę.",
    image: "/galeria/Projekt_MARS/webp/MARS_2.webp",
  },
  {
    title: "Stacja łączności",
    body: "Centrum komunikacji misji — Twoje połączenie z bazą.",
    image: "/galeria/Projekt_MARS/webp/MARS_3.webp",
  },
  {
    title: "Stacja wodna",
    body: "Zaopatrzenie misji — kluczowy element marsjańskiej bazy.",
    image: "/galeria/Projekt_MARS/webp/MARS_4.webp",
  },
  {
    title: "Powierzchnia Marsa",
    body: "Faktura skał i światło, które wchodzą do każdego kadru.",
    image: "/galeria/Projekt_MARS/webp/MARS_5.webp",
  },
  {
    title: "Akcja na planie",
    body: "Pełne zanurzenie w marsjańskim świecie zdarzeń.",
    image: "/galeria/Projekt_MARS/webp/MARS_6.webp",
  },
  {
    title: "Kadr z filmu",
    body: "Twój gotowy ujęcie z misji — do zabrania ze sobą.",
    image: "/galeria/Projekt_MARS/webp/MARS_7.webp",
  },
];

const MARS_TICKET_OPTIONS: MarsTicketOption[] = [
  {
    badge: "Normalny",
    title: "Bilet normalny",
    subtitle: "1-10 osób na jednym bilecie",
    details: ["Dla osób indywidualnych i rodzin", "Cena regularna za osobę"],
    price: "69 zł/os.",
    priceLabel: "Cena za osobę",
    bookingServiceName: MARS_BOOKING_SERVICES.normal,
  },
  {
    badge: "Ulgowy",
    title: "Bilet ulgowy",
    subtitle: "1-10 osób na jednym bilecie",
    details: ["Dla osób indywidualnych i rodzin", "Cena ulgowa za osobę"],
    price: "59 zł/os.",
    priceLabel: "Cena za osobę",
    bookingServiceName: MARS_BOOKING_SERVICES.reduced,
  },
  {
    badge: "Grupowy",
    title: "Bilet grupowy/szkolny",
    subtitle: "30-50 osób w grupie",
    details: ["Dla szkół i grup zorganizowanych", "59 zł za każdą osobę"],
    price: "1 770 - 2 950 zł",
    priceLabel: "Cena grupowa",
    bookingServiceName: MARS_BOOKING_SERVICES.group,
    bookingQuantity: 30,
  },
];

type MarsLandingContentProps = {
  marsAsset: string | null;
  surfaceAsset: string | null;
};

type RouteStep = { label: ReactNode; time?: string };

const routeSteps: RouteStep[] = [
  { label: "Interaktywne lobby", time: "15 min" },
  { label: "Briefing", time: "15 min" },
  {
    label: (
      <>
        Wejście na <span className="bg-gradient-to-r from-[#ff8a3d] to-[#ffb585] bg-clip-text font-bold text-transparent drop-shadow-[0_0_10px_rgba(247,120,40,0.45)]">MARS</span>jański plan i kręcenie scen z aplikacją
      </>
    ),
    time: "30 min",
  },
];

function StepTile({ step }: { step: RouteStep }) {
  return (
    <div className="k360-feature-card ap-tile ap-tile-sm ap-tile-interactive group relative overflow-hidden px-3 py-3 transition-all duration-300 ease-out sm:px-4 sm:py-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(247,120,40,0.14),transparent_34%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center gap-2.5 sm:gap-3">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#f77828]/30 bg-[#f77828]/12 text-[#f9b27a] sm:h-8 sm:w-8">
          <FaLocationDot aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 text-[clamp(0.92rem,0.88rem+0.32vw,1.12rem)] font-semibold leading-snug text-white">
          {step.label}
        </span>
        {step.time ? (
          <span className="ml-auto shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#ff9357]/80 sm:text-[0.72rem] sm:tracking-[0.18em]">
            {step.time}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function StepConnector() {
  return (
    <div className="flex justify-center py-0.5 md:py-0" aria-hidden="true">
      <FaChevronDown className="h-3.5 w-3.5 text-[#f77828]/55 md:hidden" />
      <FaChevronRight className="hidden h-3.5 w-3.5 text-[#f77828]/55 md:block" />
    </div>
  );
}

function RowConnector() {
  return (
    <div className="flex justify-center py-0.5" aria-hidden="true">
      <FaChevronDown className="h-3.5 w-3.5 text-[#f77828]/55" />
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function smoothstep(start: number, end: number, value: number) {
  const progress = clamp((value - start) / (end - start), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

export default function MarsLandingContent({
  marsAsset,
  surfaceAsset,
}: MarsLandingContentProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const planetRef = useRef<HTMLDivElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const showMarsAsset = Boolean(marsAsset && !imageFailed);

  useEffect(() => {
    document.body.classList.add("mars-route-active");

    return () => {
      document.body.classList.remove("mars-route-active");
    };
  }, []);

  const handleScrollCueClick = () => {
    const targets = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("[data-mars-scroll-target]") ?? [],
    );
    const headerOffset = window.innerWidth < 720 ? 86 : 98;
    const currentScroll = window.scrollY;
    const nextTarget =
      targets.find((target) => {
        const targetScroll = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        return targetScroll > currentScroll + 32;
      }) ?? targets[targets.length - 1];

    if (!nextTarget) {
      return;
    }

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = nextTarget.getBoundingClientRect().top + window.scrollY - headerOffset;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: clamp(targetScroll, 0, maxScroll),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const root = rootRef.current;
    const planet = planetRef.current;

    if (!root || !planet) {
      return;
    }

    let frame = 0;

    const updatePlanet = () => {
      frame = 0;

      const rect = root.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const navHeight =
        document.querySelector<HTMLElement>("[data-ap-nav]")?.offsetHeight ?? 0;
      const animationDistance = Math.max(
        root.offsetHeight - viewportHeight + navHeight,
        1,
      );
      const progress = clamp((navHeight - rect.top) / animationDistance, 0, 1);
      const isMobile = viewportWidth < 720;
      const isTablet = viewportWidth < 980;
      const flightEndProgress = isMobile ? 0.74 : 0.68;
      const flightLinearProgress = clamp(progress / flightEndProgress, 0, 1);
      const launchProgress = Math.pow(flightLinearProgress, 0.6);
      const verticalProgress = Math.pow(flightLinearProgress, 0.6);
      const travelProgress = launchProgress;
      const flightScaleProgress = launchProgress;
      const landingZoomProgress = smoothstep(flightEndProgress, 0.98, progress);

      const solarLeft = isMobile
        ? -152
        : isTablet
          ? -48
          : clamp(viewportWidth * 0.04, 8, 72);
      const solarTop = navHeight + (isMobile
        ? 75.2
        : isTablet
          ? 86.4
          : clamp(viewportWidth * 0.07, 67.2, 108.8));
      const solarWidth = isMobile
        ? viewportWidth * 1.5
        : isTablet
          ? viewportWidth * 0.95
          : Math.min(viewportWidth * 0.69, 1040);
      const solarHeight = isMobile
        ? 480
        : isTablet
          ? 544
          : Math.max(Math.min(viewportWidth * 0.54, 620), 384);
      const marsOrbitRadiusX = solarWidth * 0.21;
      const marsOrbitRadiusY = solarHeight * 0.52 * 0.29;
      const marsOrbitAngle = -58 * (Math.PI / 180);
      const marsOrbitTilt = -13 * (Math.PI / 180);
      const marsOrbitLocalX = Math.cos(marsOrbitAngle) * marsOrbitRadiusX;
      const marsOrbitLocalY = Math.sin(marsOrbitAngle) * marsOrbitRadiusY;
      const marsOrbitX =
        solarLeft +
        solarWidth * 0.18 +
        marsOrbitLocalX * Math.cos(marsOrbitTilt) -
        marsOrbitLocalY * Math.sin(marsOrbitTilt);
      const marsOrbitY =
        solarTop +
        solarHeight * 0.57 +
        marsOrbitLocalX * Math.sin(marsOrbitTilt) +
        marsOrbitLocalY * Math.cos(marsOrbitTilt);

      const startSize = isMobile ? 32 : isTablet ? 42 : 52;
      const landingSize = Math.min(
        viewportWidth * (isMobile ? 1.04 : 0.76),
        viewportHeight * (isMobile ? 0.7 : 0.86),
        780,
      );
      const finalSize = Math.min(
        viewportWidth * (isMobile ? 1.62 : 1.36),
        viewportHeight * (isMobile ? 1.16 : 1.38),
        1320,
      );
      const size = lerp(
        lerp(startSize, landingSize, flightScaleProgress),
        finalSize,
        landingZoomProgress,
      );
      const startX = marsOrbitX - startSize / 2;
      const startY = marsOrbitY - startSize / 2;
      const endX = viewportWidth / 2 - size / 2;
      const endY = viewportHeight - size * (isMobile ? 0.5 : 0.56);
      const x = lerp(startX, endX, travelProgress);
      const y = lerp(startY, endY, verticalProgress);
      const rotationProgress = lerp(launchProgress, travelProgress, 0.34);
      const flightRotation = rotationProgress * (isMobile ? 420 : 520);
      const landingRotation = landingZoomProgress * (isMobile ? 54 : 72);
      const rotation = flightRotation + landingRotation;
      const inViewport = rect.bottom > 0 && rect.top < viewportHeight;
      const endFade = clamp(
        (rect.bottom - viewportHeight * 0.85) / (viewportHeight * 0.15),
        0,
        1,
      );
      const opacity = inViewport ? endFade : 0;

      root.style.setProperty("--mars-progress", progress.toFixed(4));
      planet.style.setProperty("--mars-size", `${size.toFixed(2)}px`);
      planet.style.setProperty("--mars-x", `${x.toFixed(2)}px`);
      planet.style.setProperty("--mars-y", `${y.toFixed(2)}px`);
      planet.style.setProperty("--mars-rotation", `${rotation.toFixed(2)}deg`);
      planet.style.setProperty("--mars-opacity", `${opacity}`);
    };

    const scheduleUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updatePlanet);
    };

    updatePlanet();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page} data-mars-page>
      <div className={styles.spaceBackdrop} aria-hidden="true" />

      <div className={styles.solarSystem} aria-hidden="true">
        <span className={styles.solarSun} />
        <span className={`${styles.solarOrbit} ${styles.orbitMercury}`} />
        <span className={`${styles.solarOrbit} ${styles.orbitVenus}`} />
        <span className={`${styles.solarOrbit} ${styles.orbitEarth}`} />
        <span className={`${styles.solarOrbit} ${styles.orbitMars}`} />
        <span className={`${styles.solarOrbit} ${styles.orbitJupiter}`} />
        <span className={`${styles.solarOrbit} ${styles.orbitSaturn}`} />
        <span className={`${styles.solarOrbit} ${styles.orbitUranus}`} />
        <span className={`${styles.solarOrbit} ${styles.orbitNeptune}`} />
        <span className={styles.asteroidBelt} />
        <span className={`${styles.solarPlanet} ${styles.planetMercury}`} />
        <span className={`${styles.solarPlanet} ${styles.planetVenus}`} />
        <span className={`${styles.solarPlanet} ${styles.planetEarth}`} />
        <span className={`${styles.solarPlanet} ${styles.planetJupiter}`} />
        <span className={`${styles.solarPlanet} ${styles.planetSaturn}`} />
        <span className={`${styles.solarPlanet} ${styles.planetUranus}`} />
        <span className={`${styles.solarPlanet} ${styles.planetNeptune}`} />
      </div>

      <div
        ref={planetRef}
        className={`${styles.marsTraveler} ${showMarsAsset ? styles.marsTravelerAsset : ""}`}
        aria-hidden="true"
      >
        {showMarsAsset ? null : <div className={styles.marsGlow} />}
        <div className={`${styles.marsBody} ${showMarsAsset ? styles.marsBodyAsset : ""}`}>
          {showMarsAsset ? (
            <img
              src={marsAsset ?? undefined}
              alt=""
              className={styles.marsImage}
              draggable={false}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className={styles.marsFallback} />
          )}
          <span className={styles.marsTerminator} />
          <span className={styles.marsRim} />
        </div>
      </div>

      <button
        type="button"
        className={styles.scrollCue}
        onClick={handleScrollCueClick}
        aria-label="Przewiń do kolejnej sekcji"
      >
        <FaChevronDown />
      </button>

      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Atrakcje / kosmos</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleSmall}>Projekt:</span>
            <span className={styles.heroTitleLarge}>MARS</span>
          </h1>
          <p className={styles.heroLead}>
            Plan filmowy poświęcony Czerwonej Planecie. Wcielasz się w bohatera
            własnej misji i scena po scenie kręcisz krótki film na profesjonalnej
            scenografii marsjańskiej. Aplikacja składa wszystkie ujęcia w gotowy
            klip, który zabierasz ze sobą.
          </p>
          <div className={styles.heroActions}>
            <PrimaryButton href="/rezerwuj" size="lg" className={styles.primaryAction}>
              <FaRocket aria-hidden="true" />
              Zarezerwuj misję
            </PrimaryButton>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.cardWrap}>
          <Card
            role="alert"
            className="relative !bg-[#1f0d05]/95 ring-2 ring-[#f77828]/60 backdrop-blur-xl shadow-[0_18px_50px_rgba(247,120,40,0.28)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:rounded-l-3xl before:bg-gradient-to-b before:from-[#ff9357] before:via-[#f77828] before:to-[#c45313] before:content-['']"
            variant="solid"
            motion="off"
            dense
          >
            <div className="flex flex-col gap-4 pl-2 sm:flex-row sm:items-center sm:gap-6 sm:pl-4">
              <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f77828]/25 text-[#ffb585] ring-2 ring-[#f77828]/55 shadow-[0_0_28px_rgba(247,120,40,0.45)] sm:h-16 sm:w-16">
                <FaMobileScreen className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                <span className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f77828] text-[#170a04] shadow-[0_4px_12px_rgba(247,120,40,0.55)] sm:h-7 sm:w-7" aria-hidden="true">
                  <FaTriangleExclamation className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </span>
              </span>
              <div className="text-center sm:text-left">
                <p className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[#ffb585]">
                  <FaTriangleExclamation aria-hidden="true" className="h-3.5 w-3.5" />
                  Ważne — weź ze sobą telefon
                </p>
                <h3 className="mt-2 text-xl font-bold leading-tight text-white sm:text-2xl">
                  Cała atrakcja działa na Twoim smartfonie
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/82 sm:text-base">
                  Sceny na marsjańskim planie nagrywasz <strong className="text-white">własnym telefonem</strong>, a aplikacja składa z nich gotowy film. Dlatego potrzebujesz <strong className="text-white">smartfonu</strong> z wolną pamięcią. Pamiętaj o naładowanej baterii.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.cardWrap} ap-page-stack`}>
          <div data-mars-scroll-target>
            <Card className="!bg-[#0b0d1d]/88 backdrop-blur-xl !py-8 sm:!py-12 lg:!py-16" motion="off" dense>
              <div className="space-y-4 sm:space-y-6 text-center">
                <h3 className="mx-auto max-w-5xl text-pretty text-[clamp(1.85rem,6.8vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] sm:tracking-[-0.04em] text-white">
                  <span className="font-bold text-[#ff9357]">Zagraj</span> w filmie
                </h3>
                <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-white/72">
                  Od wyboru kostiumu, przez briefing, aż do gotowego filmu nakręconego
                  na marsjańskim planie.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-2 sm:mt-12 lg:mt-16">
                <div className="flex flex-col gap-2 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-3">
                  <StepTile step={routeSteps[0]} />
                  <StepConnector />
                  <StepTile step={routeSteps[1]} />
                </div>

                <RowConnector />

                <StepTile step={routeSteps[2]} />

                <div className="flex justify-center py-1.5" aria-hidden="true">
                  <FaArrowDown className="h-5 w-5 text-[#f77828] drop-shadow-[0_0_12px_rgba(247,120,40,0.55)]" />
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#f77828]/45 bg-gradient-to-r from-[#f77828]/22 via-[#f77828]/10 to-transparent px-4 py-5 shadow-[0_0_36px_rgba(247,120,40,0.18)] sm:px-7 sm:py-7">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f77828]/25 text-[#ffb585] sm:h-11 sm:w-11">
                      <FaFilm aria-hidden="true" />
                    </span>
                    <div className="space-y-1.5">
                      <p className="text-[clamp(1.2rem,1.1rem+1.2vw,1.95rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
                        Wyjście z gotowym filmem
                      </p>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/60 sm:text-[0.78rem]">
                        do zabrania ze sobą
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className={styles.section} data-mars-scroll-target>
        <div className={styles.cardWrap}>
          <Card
            className="space-y-6 !bg-[#0b0d1d]/88 backdrop-blur-xl"
            variant="solid"
            motion="off"
            dense
          >
            <TourLineAccentTitle variant="warm">Zobacz Projekt: MARS</TourLineAccentTitle>
            <TourLineGalleryRow items={MARS_GALLERY_ITEMS} />
          </Card>
        </div>
      </section>

      <section className={styles.section} data-mars-scroll-target>
        <div className={styles.cardWrap}>
          <Card
            id="mars-tickets"
            title="Bilety na Projekt: MARS"
            titleCentered
            titleDivider
            dense
            motion="off"
            className="!bg-[#0b0d1d]/88 backdrop-blur-xl"
          >
            <div className="mt-2 space-y-6 sm:space-y-8">
              <article className="ap-tile ap-tile-lg ap-tile-accent relative overflow-hidden px-4 py-5 sm:px-7 sm:py-7">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,120,40,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(247,72,108,0.10),transparent_32%)]" />
                <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                  <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
                    <span className="ticket-card-badge mx-auto lg:mx-0">{MARS_PROMO_TICKET.badge}</span>
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
                        {MARS_PROMO_TICKET.title}
                      </h3>
                      <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/76 sm:text-base lg:mx-0 lg:text-lg">
                        {MARS_PROMO_TICKET.subtitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:justify-start">
                      {MARS_PROMO_TICKET.details.map((detail) => (
                        <div
                          key={detail}
                          className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs text-white/72 sm:px-4 sm:py-2 sm:text-sm"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-center gap-3 sm:gap-4 lg:w-auto lg:items-end">
                    <div className="ap-tile ap-tile-sm w-full max-w-[22rem] px-4 py-3.5 text-center sm:px-5 sm:py-4 lg:text-right">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:text-right">
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/55 sm:text-xs">
                            {MARS_PROMO_TICKET.priceLabel}
                          </p>
                          <p className="mt-1 text-xl font-semibold leading-none tracking-[-0.03em] text-white sm:text-2xl lg:text-[1.75rem]">
                            {MARS_PROMO_TICKET.price}
                          </p>
                          <p className="mt-1.5 inline-flex flex-wrap items-center gap-1.5 text-[0.65rem] font-semibold leading-tight text-[#ffb585] sm:text-[0.72rem]">
                            <span>−{MARS_PROMO_TICKET.savingsPercent}</span>
                            <span className="text-white/55">{MARS_PROMO_TICKET.savings}</span>
                          </p>
                        </div>
                        <div className="border-l border-white/10 pl-3 sm:pl-4">
                          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/55 sm:text-xs">
                            {MARS_PROMO_TICKET.reducedPriceLabel}
                          </p>
                          <p className="mt-1 text-xl font-semibold leading-none tracking-[-0.03em] text-white sm:text-2xl lg:text-[1.75rem]">
                            {MARS_PROMO_TICKET.reducedPrice}
                          </p>
                          <p className="mt-1.5 inline-flex flex-wrap items-center gap-1.5 text-[0.65rem] font-semibold leading-tight text-[#ffb585] sm:text-[0.72rem]">
                            <span>−{MARS_PROMO_TICKET.reducedSavingsPercent}</span>
                            <span className="text-white/55">{MARS_PROMO_TICKET.reducedSavings}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <PrimaryButton
                      href={buildBookingPath("pl", {
                        category: K360_MARS_PROMO_BOOKING_CATEGORY,
                      })}
                      size="lg"
                      className="ticket-pill w-full whitespace-nowrap ring-[color:rgba(247,120,40,0.55)] sm:w-auto sm:min-w-[13rem]"
                    >
                      {MARS_PROMO_TICKET.button}
                    </PrimaryButton>
                  </div>
                </div>
              </article>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
                {MARS_TICKET_OPTIONS.map((option) => (
                  <article
                    key={option.title}
                    className="ap-tile ap-tile-lg relative flex flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,120,40,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(247,72,108,0.10),transparent_32%)]" />
                    <div className="relative flex h-full flex-col gap-4 sm:gap-5 text-center">
                      <span className="ticket-card-badge mx-auto">{option.badge}</span>
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-pretty text-lg font-semibold leading-tight tracking-[-0.03em] text-white sm:text-xl lg:text-2xl">
                          {option.title}
                        </h3>
                        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/76 sm:text-base">
                          {option.subtitle}
                        </p>
                      </div>
                      <ul className="ticket-list-panel mx-auto w-full max-w-sm space-y-2.5 text-left text-xs text-white/75 sm:space-y-3 sm:text-sm">
                        {option.details.map((detail) => (
                          <li key={detail} className="ticket-detail flex gap-2.5 sm:gap-3">
                            <span className="ticket-detail-dot mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff9357] sm:mt-2" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto flex flex-col items-center gap-3 pt-2 sm:gap-4">
                        <div className="ap-tile ap-tile-sm w-full px-4 py-3 text-center sm:px-5 sm:py-4">
                          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/60 sm:text-[0.7rem] sm:tracking-[0.25em]">{option.priceLabel}</p>
                          <p className="mt-1 text-2xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-[1.9rem] lg:text-[2.1rem]">
                            {option.price}
                          </p>
                        </div>

                        <PrimaryButton
                          href={buildBookingPath("pl", {
                            category: MARS_BOOKING_CATEGORY,
                            service: option.bookingServiceName,
                            quantity: option.bookingQuantity,
                          })}
                          size="lg"
                          className="ticket-pill w-full whitespace-nowrap ring-[color:rgba(247,120,40,0.55)]"
                        >
                          Kup bilet
                        </PrimaryButton>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.cardWrap}>
          <Card
            className="!bg-[#0b0d1d]/88 backdrop-blur-xl"
            variant="solid"
            motion="off"
            dense
          >
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
              <a
                href="/mars/Mapka_mars_na_strone.webp"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mx-auto block w-full max-w-sm overflow-hidden rounded-2xl border border-[#f77828]/30 bg-black/30 shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition hover:border-[#f77828]/55 lg:mx-0"
              >
                <img
                  src="/mars/Mapka_mars_na_strone.webp"
                  alt="Mapa scenografii Projektu MARS"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </a>

              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Mapa scenografii</h2>
                <div className="mx-auto mt-3 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#f03c64] via-[#f77828] to-[#4fcfde] lg:mx-0" />
                <p className="mt-5 text-base leading-relaxed text-white/72 sm:text-lg">
                  Zobacz rozkład marsjańskiego planu — gdzie kręcisz kolejne sceny swojej misji.
                  Każda stacja na mapie to inne ujęcie Twojego filmu.
                </p>
                <div className="mt-7 flex justify-center lg:justify-start">
                  <a
                    href="/mars/Mapka_mars_na_strone.webp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#f77828] to-[#ff9357] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#170a04] shadow-[0_12px_30px_rgba(247,120,40,0.4)] transition hover:scale-[1.03] hover:brightness-110"
                  >
                    <FaLocationDot aria-hidden="true" />
                    Otwórz pełną mapę
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section
        className={styles.marsTransition}
        aria-hidden="true"
      >
        <div
          className={`${styles.marsSurface} ${surfaceAsset ? styles.marsSurfaceImage : ""}`}
        >
          {surfaceAsset ? (
            <img src={surfaceAsset} alt="" draggable={false} />
          ) : null}
          <svg
            className={styles.marsBottomWave}
            viewBox="0 0 1440 260"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className={styles.marsBottomWaveBase}
              d="M0,200 C240,130 480,260 720,190 C960,120 1200,254 1440,178 L1440,260 L0,260 Z"
            />
          </svg>
        </div>
      </section>
    </main>
  );
}
