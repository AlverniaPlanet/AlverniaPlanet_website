"use client";

import { useEffect, type RefObject } from "react";

type RevealParallaxStrength = "soft" | "strong";

export function useRevealParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  strength: RevealParallaxStrength,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.style.setProperty("--ap-scroll-shift", "0px");
      element.style.setProperty("--ap-pointer-shift-x", "0px");
      element.style.setProperty("--ap-pointer-shift-y", "0px");
      return;
    }

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const motionBoost = 1.5;
    const maxScrollShift =
      strength === "strong"
        ? (coarsePointer ? 16 : 28) * motionBoost
        : (coarsePointer ? 9 : 14) * motionBoost;
    const viewportFactor = strength === "strong" ? 0.72 : 0.56;
    const normalizeRange = strength === "strong" ? 0.7 : 1;
    const revealThreshold = strength === "strong" ? 0.03 : 0.1;
    const revealRootMargin =
      strength === "strong" ? "0px 0px 14% 0px" : "0px 0px 10% 0px";

    let scrollFrameId: number | null = null;
    let isActive = false;
    let isScrollTicking = false;

    element.style.setProperty("--ap-pointer-shift-x", "0px");
    element.style.setProperty("--ap-pointer-shift-y", "0px");

    const updateScrollShift = () => {
      if (!isActive) {
        element.style.setProperty("--ap-scroll-shift", "0px");
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportCenter = window.innerHeight * viewportFactor;
      const elementCenter = rect.top + rect.height / 2;
      const delta = elementCenter - viewportCenter;
      const normalized = Math.max(
        -1,
        Math.min(1, delta / (window.innerHeight * normalizeRange)),
      );
      const shift = Math.max(
        -maxScrollShift,
        Math.min(maxScrollShift, -normalized * maxScrollShift),
      );

      element.style.setProperty("--ap-scroll-shift", `${shift.toFixed(2)}px`);
    };

    const requestScrollUpdate = () => {
      if (isScrollTicking) {
        return;
      }

      isScrollTicking = true;
      scrollFrameId = window.requestAnimationFrame(() => {
        isScrollTicking = false;
        updateScrollShift();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActive = Boolean(entry?.isIntersecting);

        if (isActive) {
          requestScrollUpdate();
          return;
        }

        element.style.setProperty("--ap-scroll-shift", "0px");
      },
      {
        threshold: revealThreshold,
        rootMargin: revealRootMargin,
      },
    );

    observer.observe(element);
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestScrollUpdate);
      window.removeEventListener("resize", requestScrollUpdate);

      if (scrollFrameId !== null) {
        window.cancelAnimationFrame(scrollFrameId);
      }
    };
  }, [enabled, ref, strength]);
}
