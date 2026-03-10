"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = "[data-ap-reveal]";

export default function GlobalRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const revealRoot =
      document.querySelector<HTMLElement>("[data-ap-reveal-root]") ?? document.body;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observedNodes = new WeakSet<Element>();

    let frameId = 0;
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const scanNodes = (resetVisibility: boolean) => {
      const nodes = Array.from(revealRoot.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
      if (nodes.length === 0) {
        return;
      }

      if (prefersReducedMotion) {
        nodes.forEach((node) => node.classList.add("is-visible"));
        return;
      }

      nodes.forEach((node) => {
        if (resetVisibility) {
          node.classList.remove("is-visible");
        }

        if (observedNodes.has(node)) {
          return;
        }

        observedNodes.add(node);
        observer?.observe(node);
      });
    };

    const scheduleScan = (resetVisibility = false) => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        scanNodes(resetVisibility);
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 10% 0px",
      },
    );

    mutationObserver = new MutationObserver((mutations) => {
      if (!mutations.some((mutation) => mutation.addedNodes.length || mutation.removedNodes.length)) {
        return;
      }

      scheduleScan(false);
    });

    mutationObserver.observe(revealRoot, {
      childList: true,
      subtree: true,
    });

    scheduleScan(true);

    return () => {
      window.cancelAnimationFrame(frameId);
      mutationObserver?.disconnect();
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
