"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";

/* --------------------------------------------------------------------------
   Pełnoekranowe hero z wideo — mechanika wspólna dla strony głównej i /wydarzenia.
   Warstwa wideo jest `fixed`, a sekcja pod spodem rezerwuje wysokość ekranu,
   więc przy przewijaniu treść „wjeżdża" na przypięte wideo: kadr się przybliża,
   przyciemnia i wygasza, a napisy odjeżdżają w dół z parallaxem.

   Strona, która używa tego hero, MUSI zaraz pod nim postawić warstwę z własnym,
   nieprzezroczystym tłem i `relative z-10` — inaczej przypięte wideo prześwituje.
   -------------------------------------------------------------------------- */

/** Ile czarna kurtyna powitalna trzyma się nad wideo, zanim zacznie znikać. */
export const HERO_WELCOME_AUTO_HIDE_MS = 2500;
/** Długość samego wygaszania kurtyny. */
export const HERO_WELCOME_FADE_DURATION_MS = 1200;

const HERO_SHADE_BACKGROUND =
  "radial-gradient(135% 100% at 50% 44%, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.47) 38%, rgba(0,0,0,0.21) 72%, rgba(0,0,0,0.07) 100%), linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.59) 100%)";

type FullscreenHeroProps = {
  mp4Src: string;
  webmSrc?: string;
  /** Ustaw, gdy plik WebM jest lżejszy od mp4 — wtedy trafia przed mp4. */
  preferWebm?: boolean;
  poster: string;
  fallbackText: string;
  /** Czarna kurtyna powitalna wygaszana po wejściu na stronę. */
  welcome?: boolean;
  /** Treść hero (napisy, CTA) — leci w warstwie parallaxu nad wideo. */
  children: ReactNode;
};

export default function FullscreenHero({
  mp4Src,
  webmSrc,
  preferWebm = false,
  poster,
  fallbackText,
  welcome = true,
  children,
}: FullscreenHeroProps) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<HTMLDivElement | null>(null);
  const shadeRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const [videoActive, setVideoActive] = useState(true);
  const videoActiveRef = useRef(true);
  const heroHiddenRef = useRef(false);
  const [welcomeVisible, setWelcomeVisible] = useState(welcome);

  useEffect(() => {
    if (!welcome || typeof window === "undefined") {
      return;
    }
    const timer = window.setTimeout(() => {
      setWelcomeVisible(false);
    }, HERO_WELCOME_AUTO_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, [welcome]);

  // Strona z przypiętym hero musi otwierać się od góry. Bez tego przeglądarka
  // przywraca zapamiętaną pozycję i użytkownik ląduje w środku treści, a hero
  // jest już przewinięte.
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ostatniPostep = { current: -1 };

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

      /* Przy postępie zmienionym o mniej niż 0,2% nie ma czego przeliczać:
         skala zmieniłaby się o 0,03%, a przesunięcie o 0,16 px. Pomijamy zapisy,
         żeby nie zajmować wątku głównego przy drobnych ruchach przewijania. */
      if (Math.abs(progress - ostatniPostep.current) < 0.002 && progress > 0 && progress < 1) return;
      ostatniPostep.current = progress;

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
        className="ap-intro-fade fixed inset-0 z-0 overflow-hidden bg-black"
      >
        <div ref={zoomRef} className="absolute inset-0 will-change-transform">
          <AdaptiveVideo
            mp4Src={mp4Src}
            webmSrc={webmSrc}
            preferWebm={preferWebm}
            poster={poster}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            sizes="100vw"
            fallbackText={fallbackText}
            priority
            rootMargin="320px 0px"
            preferPosterOnLowPower
            active={videoActive}
          />
        </div>
        {/* Stałe przyciemnienie tła pod napisami hero — kontrast białego tekstu na jaśniejszym wideo */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{ background: HERO_SHADE_BACKGROUND }}
          aria-hidden
        />
        {welcome ? (
          <div
            className={`pointer-events-none absolute inset-0 z-[6] bg-black transition-opacity ${
              welcomeVisible ? "opacity-30" : "opacity-0"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDuration: `${HERO_WELCOME_FADE_DURATION_MS}ms`,
            }}
            aria-hidden
          />
        ) : null}
        <div
          ref={shadeRef}
          className="pointer-events-none absolute inset-0 z-[7] bg-black opacity-0 will-change-[opacity]"
          aria-hidden
        />
        <div ref={parallaxRef} className="absolute inset-0 z-20 will-change-[transform,opacity]">
          {children}
        </div>
      </div>
    </section>
  );
}
