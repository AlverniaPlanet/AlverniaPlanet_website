"use client";
import * as React from "react";
import { useEffect, useRef, type CSSProperties } from "react";

function cx(...cls: Array<string | false | undefined>) {
  return cls.filter(Boolean).join(" ");
}

type Variant = "solid" | "glass" | "outlined";

type CardProps = {
  /** Jaki element ma zostać wyrenderowany (domyślnie <article>) */
  as?: React.ElementType;
  title?: React.ReactNode;
  titleClassName?: string;
  titleCentered?: boolean;
  titleDivider?: boolean;
  titleDividerClassName?: string;
  children: React.ReactNode;
  className?: string;
  /** "solid" = pełne tło, "glass" = półprzezroczyste z blur */
  variant?: Variant;
  /** ciaśniejsze paddingi */
  dense?: boolean;
  /** subtelna poświata */
  glow?: boolean;
  /** bez paddingu (np. pod galerię) */
  noPad?: boolean;
  /** globalna animacja przy scrollu dla kart */
  motion?: "off" | "soft" | "strong";
  motionDelay?: number;
} & React.HTMLAttributes<HTMLElement>;

export default function Card({
  as = "article",
  title,
  titleClassName,
  titleCentered = false,
  titleDivider = false,
  titleDividerClassName,
  children,
  className,
  variant = "solid",
  dense = false,
  glow = false,
  noPad = false,
  motion = "strong",
  motionDelay = 0,
  style,
  ...rest
}: CardProps) {
  const Tag = as as React.ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const motionStrength = motion === "strong" ? "strong" : "soft";
  const motionEnabled = motion !== "off";

  useEffect(() => {
    if (!motionEnabled) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.style.opacity = "1";
      element.style.setProperty("--card-reveal-y", "0px");
      element.style.setProperty("--card-scroll-shift", "0px");
      return;
    }

    const maxShift = motionStrength === "strong" ? 26 : 10;
    const viewportFactor = motionStrength === "strong" ? 0.72 : 0.55;
    const normalizeRange = motionStrength === "strong" ? 0.68 : 1;
    const revealThreshold = motionStrength === "strong" ? 0.03 : 0.1;
    const revealRootMargin = motionStrength === "strong" ? "0px 0px 14% 0px" : "0px 0px 10% 0px";

    let frameId: number | null = null;
    let isActive = false;
    let hasRevealed = false;
    let isTicking = false;

    const updateShift = () => {
      if (!isActive) {
        element.style.setProperty("--card-scroll-shift", "0px");
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportCenter = window.innerHeight * viewportFactor;
      const cardCenter = rect.top + rect.height / 2;
      const delta = cardCenter - viewportCenter;
      const normalized = Math.max(
        -1,
        Math.min(1, delta / (window.innerHeight * normalizeRange)),
      );
      const shift = Math.max(-maxShift, Math.min(maxShift, -normalized * maxShift));
      element.style.setProperty("--card-scroll-shift", `${shift.toFixed(2)}px`);
    };

    const requestUpdate = () => {
      if (isTicking) return;
      isTicking = true;
      frameId = window.requestAnimationFrame(() => {
        isTicking = false;
        updateShift();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          if (!hasRevealed) {
            hasRevealed = true;
            element.style.opacity = "1";
            element.style.setProperty("--card-reveal-y", "0px");
          }

          isActive = true;
          requestUpdate();
          return;
        }

        isActive = false;
        element.style.setProperty("--card-scroll-shift", "0px");
      },
      {
        threshold: revealThreshold,
        rootMargin: revealRootMargin,
      },
    );

    observer.observe(element);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [motionEnabled, motionStrength]);

  const base = "ap-card rounded-3xl ring-1 ring-[color:var(--ap-border)] shadow-[var(--ap-shadow)]";
  const bg =
    variant === "glass"
      ? "bg-[color:var(--ap-surface-strong)] backdrop-blur-md"
      : variant === "outlined"
      ? "bg-[color:var(--ap-surface-contrast)] border border-[color:var(--ap-border-strong)]"
      : "bg-[color:var(--ap-surface)]";
  const pad = noPad ? "" : dense ? "p-5 sm:p-6" : "p-6 sm:p-8";
  const halo = glow
    ? "after:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:shadow-[0_0_80px_rgba(255,255,255,0.07)]"
    : "";
  const revealDistance = motionStrength === "strong" ? 28 : 14;
  const floatDuration = motionStrength === "strong" ? "6400ms" : "7600ms";
  const floatDelay = `${motionDelay * -6}ms`;
  const effectiveDelay = Math.round(motionDelay * 0.75);
  const motionStyles: CSSProperties = motionEnabled
    ? ({
        transitionDelay: `${effectiveDelay}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transform: "translate3d(0, calc(var(--card-reveal-y) + var(--card-scroll-shift)), 0)",
        "--card-reveal-y": `${revealDistance}px`,
        "--card-scroll-shift": "0px",
      } as CSSProperties)
    : ({
        "--card-hover-shift": "0px",
      } as CSSProperties);

  return (
    <Tag
      ref={ref}
      className={cx(
        "relative",
        base,
        bg,
        pad,
        halo,
        className,
        motionEnabled &&
          "opacity-0 transition-[opacity,transform] duration-[1100ms] ease-out will-change-transform",
        !motionEnabled && "transition duration-300 ease-out",
      )}
      style={{ ...motionStyles, ...(style as CSSProperties) }}
      {...rest}
    >
      <div
        className={motionEnabled ? "scroll-float" : undefined}
        style={
          motionEnabled
            ? ({
                animationDuration: floatDuration,
                animationDelay: floatDelay,
              } as CSSProperties)
            : undefined
        }
      >
        {title != null && (
          <>
            <h2
              className={cx(
                "text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-balance mb-2",
                titleCentered && "text-center",
                titleClassName,
              )}
            >
              {title}
            </h2>
            {titleDivider && (
              <div
                className={cx(
                  "h-[1px] w-full bg-white/15 mb-6",
                  titleCentered && "mx-auto",
                  titleDividerClassName,
                )}
              />
            )}
          </>
        )}
        {children}
      </div>
    </Tag>
  );
}
