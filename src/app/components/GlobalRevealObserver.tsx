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
    let delayedScanTimeoutId = 0;
    let lateScanTimeoutId = 0;
    let mutationObserverStopTimeoutId = 0;
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const isRevealNode = (node: Node) => {
      if (!(node instanceof HTMLElement)) {
        return false;
      }

      return node.matches(REVEAL_SELECTOR) || Boolean(node.querySelector(REVEAL_SELECTOR));
    };

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
      const hasRevealMutation = mutations.some((mutation) => {
        const changedNodes = [...Array.from(mutation.addedNodes), ...Array.from(mutation.removedNodes)];
        return changedNodes.some(isRevealNode);
      });

      if (!hasRevealMutation) {
        return;
      }

      scheduleScan(false);
    });

    mutationObserver.observe(revealRoot, {
      childList: true,
      subtree: true,
    });

    scheduleScan(true);
    delayedScanTimeoutId = window.setTimeout(() => scheduleScan(false), 220);
    lateScanTimeoutId = window.setTimeout(() => scheduleScan(false), 1200);
    mutationObserverStopTimeoutId = window.setTimeout(() => {
      mutationObserver?.disconnect();
    }, 4000);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(delayedScanTimeoutId);
      window.clearTimeout(lateScanTimeoutId);
      window.clearTimeout(mutationObserverStopTimeoutId);
      mutationObserver?.disconnect();
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
