"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type ScrollMotionStrength = "soft" | "strong";

type ScrollMotionItemProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  strength?: ScrollMotionStrength;
  float?: boolean;
};

export default function ScrollMotionItem({
  children,
  className,
  delay = 0,
  strength = "soft",
  float = true,
}: ScrollMotionItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.style.opacity = "1";
      element.style.setProperty("--reveal-y", "0px");
      element.style.setProperty("--scroll-shift", "0px");
      return;
    }

    const maxShift = strength === "strong" ? 26 : 10;
    const viewportFactor = strength === "strong" ? 0.72 : 0.55;
    const normalizeRange = strength === "strong" ? 0.68 : 1;
    const revealThreshold = strength === "strong" ? 0.03 : 0.1;
    const revealRootMargin = strength === "strong" ? "0px 0px 14% 0px" : "0px 0px 10% 0px";

    let frameId: number | null = null;
    let isActive = false;
    let hasRevealed = false;
    let isTicking = false;

    const updateShift = () => {
      if (!isActive) {
        element.style.setProperty("--scroll-shift", "0px");
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
      element.style.setProperty("--scroll-shift", `${shift.toFixed(2)}px`);
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
            element.style.setProperty("--reveal-y", "0px");
          }

          isActive = true;
          requestUpdate();
          return;
        }

        isActive = false;
        element.style.setProperty("--scroll-shift", "0px");
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
  }, [strength]);

  const revealDistance = strength === "strong" ? 28 : 14;
  const floatDuration = strength === "strong" ? "6400ms" : "7600ms";
  const floatDelay = `${delay * -6}ms`;
  const effectiveDelay = Math.round(delay * 0.75);

  return (
    <div
      ref={ref}
      className={`opacity-0 transition-[opacity,transform] duration-[1100ms] ease-out will-change-transform ${className ?? ""}`}
      style={
        {
          transitionDelay: `${effectiveDelay}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          transform: "translate3d(0, calc(var(--reveal-y) + var(--scroll-shift)), 0)",
          "--reveal-y": `${revealDistance}px`,
          "--scroll-shift": "0px",
        } as CSSProperties
      }
    >
      <div
        className={float ? "scroll-float" : undefined}
        style={
          float
            ? ({
                animationDuration: floatDuration,
                animationDelay: floatDelay,
              } as CSSProperties)
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
