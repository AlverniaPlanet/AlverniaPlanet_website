"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FaArrowRight, FaChevronDown, FaFilm, FaLocationDot, FaRocket } from "react-icons/fa6";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import styles from "./MarsLandingContent.module.css";

type MarsLandingContentProps = {
  marsAsset: string | null;
  surfaceAsset: string | null;
};

const missionCards = [
  {
    label: "Start",
    title: "Briefing przed lotem",
    body: "Wejście w klimat misji kosmicznej, zanim obraz przejmie całą kopułę.",
  },
  {
    label: "Lot",
    title: "Skala fulldome",
    body: "Obraz pracuje dookoła widza, dlatego Mars nie jest tylko sceną, ale kierunkiem podróży.",
  },
  {
    label: "Lądowanie",
    title: "Finał przy powierzchni",
    body: "Ostatni etap prowadzi nisko nad planetą, prosto w czerwony horyzont.",
  },
];

const routeSteps = [
  "Wejście do bazy",
  "Start misji",
  "Przelot przez ciemną przestrzeń",
  "Orbita Marsa",
  "Lądowanie",
];

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
          <h1 className={styles.heroTitle}>Misja Mars</h1>
          <p className={styles.heroLead}>
            Wyprawa w stronę czerwonej planety zaczyna się nad bazą Alvernia
            Planet i kończy przy marsjańskim horyzoncie. To kosmiczny kierunek
            dla atrakcji inspirowanej podróżą dalej niż Księżyc.
          </p>
          <div className={styles.heroActions}>
            <PrimaryButton href="/rezerwuj" size="lg" className={styles.primaryAction}>
              <FaRocket aria-hidden="true" />
              Zarezerwuj misję
            </PrimaryButton>
            <Link href="/atrakcje/k360" className={styles.secondaryAction}>
              <FaFilm aria-hidden="true" />
              Projekcja K360
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.cardWrap} ap-page-stack`}>
          <div data-mars-scroll-target>
            <Card className="space-y-5 sm:space-y-6" motion="off" dense>
              <div className="grid gap-7 xl:grid-cols-[minmax(20rem,0.84fr)_minmax(0,1.16fr)] xl:items-start xl:gap-8 2xl:grid-cols-[minmax(22rem,0.78fr)_minmax(0,1.22fr)]">
                <div className="space-y-5 lg:space-y-6 xl:sticky xl:top-20">
                  <div className="space-y-4 text-center sm:text-left">
                    <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#7ef6ff]/76">
                      Misja
                    </p>
                    <h3 className="mx-auto max-w-[14ch] text-pretty text-[clamp(2.1rem,6.8vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:mx-0">
                      Od startu do lądowania
                    </h3>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/72 sm:mx-0">
                      Z ciemnej przestrzeni wyłania się Mars: najpierw odległy punkt misji,
                      później coraz większy cel lotu i finał całej wyprawy nad czerwonym
                      horyzontem.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                    <div className="ap-tile ap-tile-sm px-4 py-4 text-center sm:text-left">
                      <p className="whitespace-nowrap text-[clamp(1.3rem,2.5vw,1.8rem)] font-semibold leading-none tracking-[-0.03em] text-white">
                        360°
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">kierunek narracji</p>
                    </div>
                    <div className="ap-tile ap-tile-sm px-4 py-4 text-center sm:text-left">
                      <p className="whitespace-nowrap text-[clamp(1.3rem,2.5vw,1.8rem)] font-semibold leading-none tracking-[-0.03em] text-white">
                        30 min
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">kontekst seansu K360</p>
                    </div>
                    <div className="ap-tile ap-tile-sm px-4 py-4 text-center sm:text-left">
                      <p className="whitespace-nowrap text-[clamp(1.3rem,2.5vw,1.8rem)] font-semibold leading-none tracking-[-0.03em] text-white">
                        Mars
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">cel wyprawy</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:auto-rows-fr">
                  {missionCards.map((card, index) => (
                    <article
                      key={card.label}
                      className="k360-feature-card ap-tile ap-tile-sm ap-tile-interactive group relative overflow-hidden px-3.5 py-3.5 transition-all duration-300 ease-out sm:px-4 sm:py-4"
                      style={{ "--tour-delay": `${(index % 6) * 0.18}s` } as CSSProperties}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(126,246,255,0.12),transparent_34%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                            {card.label}
                          </span>
                          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/28">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h4 className="max-w-[11ch] text-pretty text-[clamp(1.18rem,1.7vw,1.6rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-white">
                          {card.title}
                        </h4>
                        <p className="text-[0.88rem] leading-[1.55] text-white/70 sm:text-[0.92rem]">
                          {card.body}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div data-mars-scroll-target>
            <Card className="space-y-5 sm:space-y-6" motion="off" dense>
              <div className="space-y-4 text-center sm:text-left">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#7ef6ff]/76">
                  Trajektoria
                </p>
                <h3 className="mx-auto max-w-[14ch] text-pretty text-[clamp(2.1rem,6.8vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:mx-0">
                  Trasa misji
                </h3>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/72 sm:mx-0">
                  Od bazy startowej, przez ciemną przestrzeń, aż na powierzchnię czerwonej
                  planety.
                </p>
              </div>

              <ol className="grid list-none gap-3 p-0 md:grid-cols-2 xl:grid-cols-3">
                {routeSteps.map((step, index) => (
                  <li
                    key={step}
                    className="k360-feature-card ap-tile ap-tile-sm ap-tile-interactive group relative overflow-hidden px-3.5 py-3.5 transition-all duration-300 ease-out sm:px-4 sm:py-4"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(247,120,40,0.14),transparent_34%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#f77828]/30 bg-[#f77828]/12 text-[#f9b27a]">
                        <FaLocationDot aria-hidden="true" />
                      </span>
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/28">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[clamp(0.98rem,0.9rem+0.32vw,1.12rem)] font-semibold leading-snug text-white">
                        {step}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.landingSection}`}
        data-mars-scroll-target
      >
        <div className={styles.landingContent}>
          <p className={styles.kicker}>Powierzchnia</p>
          <h2 className={styles.landingTitle}>Lądowanie przy czerwonym horyzoncie.</h2>
          <p className={styles.sectionBody}>
            Ostatnie metry są spokojniejsze, cięższe i bliższe powierzchni.
            Po locie przez przestrzeń zostaje tylko pył, światło i ogrom planety
            tuż pod stopami.
          </p>
          <div className={styles.landingActions}>
            <PrimaryButton href="/rezerwuj" size="lg" className={styles.primaryAction}>
              <FaArrowRight aria-hidden="true" />
              Przejdź do rezerwacji
            </PrimaryButton>
          </div>
        </div>

        <div
          className={`${styles.marsSurface} ${surfaceAsset ? styles.marsSurfaceImage : ""}`}
          aria-hidden="true"
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
