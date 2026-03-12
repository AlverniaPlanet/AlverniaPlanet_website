"use client";

import { useEffect, type RefObject } from "react";

type RevealParallaxStrength = "soft" | "strong";

export function useRevealParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  strength: RevealParallaxStrength,
  enabled = true,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) {
      return;
    }

    element.style.setProperty("--ap-pointer-shift-x", "0px");
    element.style.setProperty("--ap-pointer-shift-y", "0px");
    element.style.setProperty("--ap-scroll-shift", "0px");

    return () => {
      element.style.setProperty("--ap-scroll-shift", "0px");
      element.style.setProperty("--ap-pointer-shift-x", "0px");
      element.style.setProperty("--ap-pointer-shift-y", "0px");
    };
  }, [enabled, ref, strength]);
}
