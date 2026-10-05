"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AdaptiveVideoProps = {
  mp4Src: string;
  webmSrc?: string;
  /** Ustaw, gdy plik WebM jest lżejszy od mp4 — wtedy trafia przed mp4. */
  preferWebm?: boolean;
  poster: string;
  className?: string;
  sizes?: string;
  fallbackText?: string;
  loadingLabel?: string;
  showLoadingState?: boolean;
  priority?: boolean;
  rootMargin?: string;
  threshold?: number;
  preferPosterOnLowPower?: boolean;
  active?: boolean;
};

type NavigatorWithHints = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

/**
 * Czy poprzestać na plakacie zamiast pobierać wideo.
 *
 * Wideo hero waży 1,4 MB — na telefonie to było 82% całego transferu strony,
 * i to na tło, które nie niesie żadnej treści. Plakat jest klatką z tego samego
 * materiału, więc różnicę widać dopiero, gdy film ruszy.
 *
 * Warunki dobieramy tak, żeby wyłączały wideo TYLKO tam, gdzie naprawdę o coś
 * chodzi — o rachunek za transfer albo o wyraźną wolę użytkownika. Dwa dawne
 * kryteria sprzętowe wyleciały, bo gasiły film na maszynach, które odtwarzają
 * go bez mrugnięcia okiem:
 *   • `deviceMemory <= 4` — laptop z 4 GB RAM-u odtwarza pętlę 1,4 MB
 *     bez najmniejszego problemu,
 *   • `hardwareConcurrency <= 4` — czterordzeniowy procesor to nie jest sprzęt
 *     „słaby"; ten warunek kasował wideo na zwykłych laptopach biurowych.
 *
 * Kryterium szerokości ekranu wymaga teraz DODATKOWO wskaźnika dotykowego.
 * Samo `max-width: 767px` łapało okno przeglądarki rozciągnięte na pół ekranu
 * laptopa — a tam mamy i łącze, i moc, i miejsce, więc film ma grać. Telefon
 * poznajemy po tym, że jest wąski ORAZ obsługiwany palcem.
 */
function shouldPreferPosterOnly() {
  if (typeof window === "undefined") {
    return false;
  }

  const nav = navigator as NavigatorWithHints;
  // Wyraźna wola użytkownika z poziomu systemu: żadnego ruchu w tle.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Oszczędzanie danych i wolne łącze — jedyne sygnały o rachunku za transfer,
  // jakimi dysponujemy. Network Information API mają tylko silniki Chromium,
  // więc na Safari i Firefoksie po prostu nie zadziałają (i dobrze).
  const saveData = Boolean(nav.connection?.saveData);
  const effectiveType = nav.connection?.effectiveType ?? "";
  const constrainedNetwork = /(^|-)2g$|3g/.test(effectiveType);

  // Próg 768 px = breakpoint `md` w Tailwindzie. `pointer: coarse` odróżnia
  // telefon od wąskiego okna na desktopie.
  const phone = window.matchMedia("(max-width: 767px) and (pointer: coarse)").matches;

  return reducedMotion || saveData || constrainedNetwork || phone;
}

export default function AdaptiveVideo({
  mp4Src,
  webmSrc,
  preferWebm = false,
  poster,
  className,
  sizes = "100vw",
  fallbackText,
  loadingLabel,
  showLoadingState = false,
  priority = false,
  rootMargin = "240px 0px",
  threshold = 0.2,
  preferPosterOnLowPower = false,
  active = true,
}: AdaptiveVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);

  useEffect(() => {
    if (!preferPosterOnLowPower) {
      return;
    }

    setPosterOnly(shouldPreferPosterOnly());
  }, [preferPosterOnLowPower]);

  // Dla priority (np. hero) NIE renderujemy <video> w pierwszym renderze/SSR, aby
  // źródło wideo nie konkurowało z posterem (LCP) w skanerze preload. Montujemy je
  // po pierwszej klatce (podwójny rAF) — poster pod spodem jest identyczny, brak mrugnięcia.
  // Sprawdzenie SYNCHRONICZNE, nie przez stan.
  //
  // `posterOnly` jest ustawiane w efekcie wyżej, ale React aktualizuje stan
  // asynchronicznie. Na wolniejszym CPU rAF poniżej zdążał odpalić, ZANIM
  // komponent przerenderował się z ustawioną flagą — i źródło wideo podpinało
  // się mimo zakazu. Zmierzone: telefon na 3G pobierał 1,4 MB wideo, choć ten
  // sam telefon na 4G już nie. Wywołanie funkcji wprost w efekcie usuwa
  // zależność od kolejności i od momentu przerenderowania.
  const tylkoPlakat = () => preferPosterOnLowPower && shouldPreferPosterOnly();

  // Wideo hero czeka na zdarzenie `load`, czyli na moment, w którym reszta
  // strony jest już pobrana. Powód: plik waży kilka megabajtów i na wolnym
  // łączu zjadał całe pasmo — zdjęcia w sekcjach niżej dociągały się minutami,
  // a użytkownik przewijał przez puste kafelki. Na szybkim łączu `load` pada
  // po ułamku sekundy, więc różnicy nie widać; na wolnym przez ten czas stoi
  // plakat, czyli klatka z tego samego materiału. Gdy strona jest już wczytana
  // (np. powrót z pamięci podręcznej), startujemy od razu.
  useEffect(() => {
    if (!priority || posterOnly || tylkoPlakat()) return;
    let raf1 = 0;
    let raf2 = 0;
    const start = () => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setShouldLoadVideo(true));
      });
    };
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }
    return () => {
      window.removeEventListener("load", start);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [priority, posterOnly]);

  useEffect(() => {
    if (posterOnly || tylkoPlakat()) {
      setShouldLoadVideo(false);
      setIsLoaded(true);
      return;
    }

    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = Boolean(entry?.isIntersecting);
        setIsVisible(inView);
        if (inView) {
          setShouldLoadVideo(true);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [posterOnly, rootMargin, threshold]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || posterOnly || !shouldLoadVideo) {
      return;
    }

    let cancelled = false;

    const syncPlayback = () => {
      if (cancelled) {
        return;
      }

      video.muted = true;
      video.defaultMuted = true;

      if (document.hidden || !isVisible || !active) {
        video.pause();
        return;
      }

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => undefined);
      }
    };

    const handleReady = () => {
      setIsLoaded(true);
      syncPlayback();
    };

    const handlePause = () => {
      if (!document.hidden && isVisible) {
        syncPlayback();
      }
    };

    const handleEnded = () => {
      video.currentTime = 0;
      syncPlayback();
    };

    const handleVisibilityChange = () => {
      syncPlayback();
    };

    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("canplay", handleReady);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("webkitendfullscreen", handleReady as EventListener);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (video.readyState >= 2) {
      handleReady();
    } else {
      syncPlayback();
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("webkitendfullscreen", handleReady as EventListener);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.pause();
    };
  }, [active, isVisible, posterOnly, shouldLoadVideo]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        /* Bez tego plakat hero (największy element pierwszego ekranu) stoi
           w kolejce z priorytetem Low — równo z kilkunastoma paczkami
           JavaScriptu. Atrybut nic nie waży, a przesuwa go na początek. */
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className ?? "h-full w-full object-cover"}
        aria-hidden="true"
      />
      {!posterOnly && shouldLoadVideo ? (
        <video
          ref={videoRef}
          className={className ?? "h-full w-full object-cover"}
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          preload={priority ? "metadata" : "none"}
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
        >
          {/* Przeglądarka bierze PIERWSZE obsługiwane źródło, więc kolejność
              decyduje o tym, co się realnie pobierze. Domyślnie mp4 idzie
              pierwszy, bo część naszych WebM-ów jest cięższa od swoich mp4.
              preferWebm ustawiamy tam, gdzie WebM jest faktycznie lżejszy. */}
          {webmSrc && preferWebm ? <source src={webmSrc} type="video/webm" /> : null}
          <source src={mp4Src} type="video/mp4" />
          {webmSrc && !preferWebm ? <source src={webmSrc} type="video/webm" /> : null}
          {fallbackText}
        </video>
      ) : null}
      {showLoadingState && shouldLoadVideo && !isLoaded ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 text-xs text-white/75 pointer-events-none">
          {loadingLabel}
        </div>
      ) : null}
    </div>
  );
}
