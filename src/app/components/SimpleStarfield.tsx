"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";

/**
 * Jedna wersja tła: "Aurora + delikatne gwiazdy"
 * - Zero canvas, tylko CSS; minimalne koszty CPU/GPU
 * - Parallax działa tylko na ruch, nie w pętli
 * - Szanuje prefers-reduced-motion
 */

type Intensity = "low" | "medium" | "high";

type Props = {
  className?: string;
  /** Widoczność/oddech animacji (opacity + czas) */
  intensity?: Intensity;
  /** Delikatny parallax na ruch kursora (domyślnie ON) */
  interactive?: boolean;
  /** Maks. przesunięcie (px) przy krawędzi ekranu */
  parallax?: number;
};

export function SimpleStarfield({
  className,
  intensity = "medium",
  interactive = true,
  parallax = 14,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Ustawienia intensywności — mocniejsze gradienty vs. delikatniejsze
  const cloud =
    intensity === "high"
      ? { min: 0.3, max: 0.5, dur: 24 }
      : intensity === "low"
      ? { min: 0.14, max: 0.26, dur: 30 }
      : { min: 0.22, max: 0.38, dur: 28 }; // medium — mocniejszy start, ale wciąż wygaszony

  const starsFar =
    intensity === "high"
      ? { min: 0.12, max: 0.22, dur: 32 }
      : intensity === "low"
      ? { min: 0.05, max: 0.11, dur: 36 }
      : { min: 0.08, max: 0.16, dur: 34 };

  const starsNear =
    intensity === "high"
      ? { min: 0.15, max: 0.26, dur: 30 }
      : intensity === "low"
      ? { min: 0.06, max: 0.13, dur: 32 }
      : { min: 0.1, max: 0.2, dur: 32 };

  // Ultra‑lekki parallax (tylko przy interakcji)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!interactive || reduce) {
      el.style.setProperty("--ap-x", "0px");
      el.style.setProperty("--ap-y", "0px");
      return;
    }

    let raf = 0;
    let pending = false;
    let targetX = 0;
    let targetY = 0;
    const update = () => {
      pending = false;
      el.style.setProperty("--ap-x", `${targetX}px`);
      el.style.setProperty("--ap-y", `${targetY}px`);
    };
    const onPointerMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetX = nx * parallax;
      targetY = ny * parallax;
      if (!pending) {
        pending = true;
        raf = window.requestAnimationFrame(update);
      }
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!pending) {
        pending = true;
        raf = window.requestAnimationFrame(update);
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove as any);
      window.removeEventListener("pointerleave", onLeave as any);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactive, parallax]);

  return (
    <div
      ref={rootRef}
      className={["fixed inset-0 z-0 bg-black", className].filter(Boolean).join(" ")}
      aria-hidden
      style={{ ["--ap-x" as any]: "0px", ["--ap-y" as any]: "0px" }}
    >
      {/* Statyczna baza kolorów, żeby od razu było widać aurorę */}
      <div className="ap-layer ap-base" />

      {/* Aurora: mocniejsze gradienty + delikatne gwiazdy */}
      <div
        className="ap-layer ap-aurora ap-aurora--a"
        style={
          {
            "--ap-min": cloud.min.toString(),
            "--ap-max": cloud.max.toString(),
            "--ap-dur": `${cloud.dur}s`,
          } as React.CSSProperties
        }
      />
      <div
        className="ap-layer ap-aurora ap-aurora--b"
        style={
          {
            "--ap-min": (cloud.min * 0.9).toString(),
            "--ap-max": (cloud.max * 1.05).toString(),
            "--ap-dur": `${Math.round(cloud.dur * 0.9)}s`,
          } as React.CSSProperties
        }
      />

      {/* Lekkie gwiazdy (dalekie + bliższe) */}
      <div
        className="ap-stars ap-stars--far"
        style={
          {
            "--ap-min": starsFar.min.toString(),
            "--ap-max": starsFar.max.toString(),
            "--ap-dur": `${starsFar.dur}s`,
          } as React.CSSProperties
        }
      />
      <div
        className="ap-stars ap-stars--near"
        style={
          {
            "--ap-min": starsNear.min.toString(),
            "--ap-max": starsNear.max.toString(),
            "--ap-dur": `${starsNear.dur}s`,
          } as React.CSSProperties
        }
      />

      {/* Subtelna winieta dla czytelności treści */}
      <div className="ap-vignette" />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ap-layer, .ap-stars {
          position:absolute; inset:0; pointer-events:none;
          backface-visibility:hidden; will-change:opacity, transform;
        }

        .ap-base {
          background:
            radial-gradient(60% 60% at 20% 25%, rgba(56,189,248,.22), transparent 65%),
            radial-gradient(55% 55% at 80% 20%, rgba(236,72,153,.18), transparent 68%),
            radial-gradient(70% 70% at 50% 85%, rgba(59,130,246,.18), transparent 72%);
          opacity:.55;
          filter: saturate(120%);
        }

        /* ====== AURORA ====== */
        .ap-aurora {
          filter: blur(72px) saturate(115%) brightness(105%);
          mix-blend-mode: screen;
          animation: ap-fade var(--ap-dur) ease-in-out infinite alternate-reverse;
          animation-delay: calc(var(--ap-dur) * -1.1);
          animation-fill-mode: both;
          opacity: var(--ap-max, .4);
        }
        .ap-aurora--a {
          background:
            radial-gradient(58% 68% at 16% 28%, rgba(56,189,248,.18), transparent 62%),
            radial-gradient(66% 76% at 84% 20%, rgba(236,72,153,.16), transparent 62%),
            radial-gradient(52% 72% at 52% 88%, rgba(99,102,241,.14), transparent 64%);
          transform: translate3d(calc(var(--ap-x, 0px) * .2), calc(var(--ap-y, 0px) * .2), 0) scale(1.01);
          transition: transform .25s ease-out;
        }
        .ap-aurora--b {
          background:
            radial-gradient(52% 60% at 26% 78%, rgba(251,191,36,.18), transparent 64%),
            radial-gradient(56% 56% at 72% 62%, rgba(59,130,246,.18), transparent 62%),
            radial-gradient(46% 60% at 12% 55%, rgba(16,185,129,.14), transparent 66%);
          transform: translate3d(calc(var(--ap-x, 0px) * .3), calc(var(--ap-y, 0px) * .3), 0) scale(1.02);
          transition: transform .25s ease-out;
        }

        /* Subtelna winieta dla czytelności zawartości */
        .ap-vignette {
          position:absolute; inset:0;
          background: radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 38%, rgba(0,0,0,.55) 100%);
          pointer-events:none;
        }

        .ap-stars {
          background-repeat: repeat;
          mix-blend-mode: screen;
        }

        /* ====== STARS (lekkie) ====== */
        .ap-stars--far {
          background-image:
            radial-gradient(circle at 18% 24%, rgba(255,255,255,.65) .5px, transparent 1.4px),
            radial-gradient(circle at 82% 16%, rgba(125,211,252,.45) .6px, transparent 1.6px),
            radial-gradient(circle at 34% 78%, rgba(248,250,252,.55) .55px, transparent 1.6px),
            radial-gradient(circle at 66% 58%, rgba(191,219,254,.40) .45px, transparent 1.4px);
          background-size: 880px 820px, 760px 640px, 820px 960px, 780px 720px;
          background-position: 0 0, 140px -120px, -120px 160px, 40px 240px;
          transform: translate3d(calc(var(--ap-x, 0px) * .18), calc(var(--ap-y, 0px) * .18), 0);
          transition: transform .25s ease-out;
          animation: ap-fade var(--ap-dur) ease-in-out infinite alternate-reverse;
          animation-delay: calc(var(--ap-dur) * -0.9);
          animation-fill-mode: both;
          opacity: var(--ap-max, .16);
        }
        .ap-stars--near {
          background-image:
            radial-gradient(circle at 26% 32%, rgba(255,255,255,.85) .9px, transparent 1.8px),
            radial-gradient(circle at 72% 12%, rgba(224,231,255,.8) .85px, transparent 1.7px),
            radial-gradient(circle at 48% 78%, rgba(125,211,252,.65) .8px, transparent 1.7px),
            radial-gradient(circle at 64% 52%, rgba(250,250,255,.9) 1px, transparent 1.8px);
          background-size: 560px 520px, 520px 460px, 640px 560px, 600px 600px;
          background-position: 0 0, -80px 60px, 120px -40px, -60px -160px;
          transform: translate3d(calc(var(--ap-x, 0px) * .32), calc(var(--ap-y, 0px) * .32), 0);
          transition: transform .25s ease-out;
          animation: ap-fade var(--ap-dur) ease-in-out infinite alternate-reverse;
          animation-delay: calc(var(--ap-dur) * -0.75);
          animation-fill-mode: both;
          opacity: var(--ap-max, .22);
        }

        /* Wspólne oddechy */
        @keyframes ap-fade {
          from { opacity: var(--ap-min, .28); }
          to   { opacity: var(--ap-max, .72); }
        }

        /* Preferencje systemowe */
        @media (prefers-reduced-motion: reduce) {
          .ap-layer, .ap-stars { animation: none !important; opacity: .4 !important; }
          .ap-aurora--a, .ap-aurora--b,
          .ap-stars--far, .ap-stars--near {
            transform: translate3d(0,0,0) !important; transition: none !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
