"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AdaptiveVideoProps = {
  mp4Src: string;
  webmSrc?: string;
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
};

type NavigatorWithHints = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
  deviceMemory?: number;
};

function shouldPreferPosterOnly() {
  if (typeof window === "undefined") {
    return false;
  }

  const nav = navigator as NavigatorWithHints;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean(nav.connection?.saveData);
  const effectiveType = nav.connection?.effectiveType ?? "";
  const constrainedNetwork = /(^|-)2g$|3g/.test(effectiveType);

  return reducedMotion || saveData || constrainedNetwork;
}

export default function AdaptiveVideo({
  mp4Src,
  webmSrc,
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
}: AdaptiveVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(priority);
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);

  useEffect(() => {
    if (!preferPosterOnLowPower) {
      return;
    }

    setPosterOnly(shouldPreferPosterOnly());
  }, [preferPosterOnLowPower]);

  useEffect(() => {
    if (posterOnly) {
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

      if (document.hidden || !isVisible) {
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
  }, [isVisible, posterOnly, shouldLoadVideo]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
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
          <source src={mp4Src} type="video/mp4" />
          {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
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
