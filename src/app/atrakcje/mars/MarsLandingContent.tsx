"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaChevronDown, FaFilm, FaLocationDot, FaRocket } from "react-icons/fa6";
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
      const scrollableDistance = Math.max(root.offsetHeight - viewportHeight, 1);
      const progress = clamp((0 - rect.top) / scrollableDistance, 0, 1);
      const isMobile = viewportWidth < 720;
      const isTablet = viewportWidth < 980;
      const flightEndProgress = isMobile ? 0.74 : 0.68;
      const flightLinearProgress = clamp(progress / flightEndProgress, 0, 1);
      const launchProgress = Math.pow(flightLinearProgress, 0.58);
      const verticalProgress = Math.pow(flightLinearProgress, 1.55);
      const motionProgress = smoothstep(0, flightEndProgress, progress);
      const travelProgress = lerp(launchProgress, easeInOutCubic(motionProgress), 0.22);
      const flightScaleProgress = launchProgress;
      const landingZoomProgress = smoothstep(flightEndProgress, 0.98, progress);

      const navHeight =
        document.querySelector<HTMLElement>("[data-ap-nav]")?.offsetHeight ?? 0;
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

      const startSize = isMobile ? 18 : isTablet ? 22 : 28;
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
      const sidePush = Math.sin(Math.min(flightLinearProgress, 1) * Math.PI) * viewportWidth * (isMobile ? 0.1 : 0.16);
      const arcLift = Math.sin(motionProgress * Math.PI) * viewportHeight * (isMobile ? 0.11 : 0.17);
      const x = lerp(startX, endX, travelProgress);
      const y = lerp(startY, endY, verticalProgress) - arcLift - sidePush * 0.12;
      const rotationProgress = lerp(launchProgress, travelProgress, 0.34);
      const flightRotation = rotationProgress * (isMobile ? 420 : 520);
      const landingRotation = landingZoomProgress * (isMobile ? 54 : 72);
      const rotation = flightRotation + landingRotation;
      const pageOpacity = rect.bottom > viewportHeight * 0.08 && rect.top < viewportHeight ? 1 : 0;
      const opacity = pageOpacity;

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

      <section
        className={styles.section}
        data-mars-scroll-target
      >
        <div className={styles.contentGrid}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Orbita</p>
            <h2 className={styles.sectionTitle}>Pierwszy kontakt z czerwoną planetą.</h2>
            <p className={styles.sectionBody}>
              Z ciemnej przestrzeni wyłania się Mars: najpierw odległy punkt
              misji, później coraz większy cel lotu i finał całej wyprawy.
            </p>
          </div>

          <div className={styles.statList} aria-label="Parametry koncepcji">
            <div>
              <strong>360°</strong>
              <span>kierunek narracji</span>
            </div>
            <div>
              <strong>30 min</strong>
              <span>kontekst seansu K360</span>
            </div>
            <div>
              <strong>Mars</strong>
              <span>cel wyprawy</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        data-mars-scroll-target
      >
        <div className={styles.cardsWrap}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Sekwencja</p>
            <h2 className={styles.sectionTitle}>Od startu do lądowania.</h2>
          </div>

          <div className={styles.missionCards}>
            {missionCards.map((card) => (
              <article key={card.label} className={styles.missionCard}>
                <span>{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        data-mars-scroll-target
      >
        <div className={styles.routePanel}>
          <div>
            <p className={styles.kicker}>Trajektoria</p>
            <h2 className={styles.sectionTitle}>Trasa misji prowadzi od bazy do powierzchni.</h2>
          </div>
          <ol className={styles.routeSteps}>
            {routeSteps.map((step) => (
              <li key={step}>
                <FaLocationDot aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
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
        </div>
      </section>
    </main>
  );
}
