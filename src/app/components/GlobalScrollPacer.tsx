"use client";

import { useEffect } from "react";

const SCROLL_FACTOR_MIN = 0.975;
const SCROLL_FACTOR_MAX = 1.0;
const SCROLL_DYNAMIC_RANGE = 220;

function getScrollableAncestor(start: HTMLElement | null): HTMLElement | null {
  let node = start;

  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const canScrollY =
      /(auto|scroll|overlay)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1;

    if (canScrollY) {
      return node;
    }
    node = node.parentElement;
  }

  return document.scrollingElement as HTMLElement | null;
}

export default function GlobalScrollPacer() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) {
        return;
      }

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);

      // Apply only to vertical wheel intent; keep horizontal gestures untouched.
      if (absY < 0.8 || absX > absY * 0.9) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      if (target.closest("input, textarea, select, iframe, [contenteditable='true']")) {
        return;
      }

      const scrollable = getScrollableAncestor(target);
      if (!scrollable) {
        return;
      }

      const maxScrollTop = scrollable.scrollHeight - scrollable.clientHeight;
      if (maxScrollTop <= 0) {
        return;
      }

      const dynamicFactor = Math.min(
        SCROLL_FACTOR_MAX,
        SCROLL_FACTOR_MIN +
          (absY / SCROLL_DYNAMIC_RANGE) * (SCROLL_FACTOR_MAX - SCROLL_FACTOR_MIN),
      );
      const delta = event.deltaY * dynamicFactor;
      const nextTop = scrollable.scrollTop + delta;

      // Keep native behavior at boundaries.
      if ((delta < 0 && nextTop <= 0) || (delta > 0 && nextTop >= maxScrollTop)) {
        return;
      }

      event.preventDefault();
      scrollable.scrollBy({ top: delta, behavior: "auto" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return null;
}
