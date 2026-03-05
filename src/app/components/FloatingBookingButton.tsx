"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import { mountBookeroInstance, removeBookeroInstancesByTypes } from "@/app/components/bookeroRuntime";

const BOOKERO_PLUGIN_ID = "8iWKMAEWtI0P";
const STICKY_CONTAINER_ID = "bookero-sticky-plugin";
const STICKY_BUTTON_LABEL = "Bilety";

const HIDDEN_PATHS = new Set(["/rezerwuj", "/en/reserve", "/pt/reservar"]);

type Locale = "pl" | "en" | "pt";

function normalizePath(pathname: string | null): string {
  if (!pathname) return "/";
  if (pathname.length > 1) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

function removeStickyBookeroNodes() {
  const selectors = [
    `#${STICKY_CONTAINER_ID}`,
    '#bookero-plugin[data-mode="sticky"]',
    ".bookero-sticky-plugin",
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => node.remove());
  });
}

function removeLeakedInlineBookeroNodes(keepInsideBookingForm: boolean) {
  const selectors = [
    '#bookero-plugin:not([data-mode="sticky"])',
    '#bookero-plugin[data-mode="standard"]',
    '#bookero-plugin[data-mode="inline"]',
    '#bookero-plugin[data-mode="calendar"]',
    '#bookero-plugin[data-mode="weekly"]',
    "#bookero",
  ];

  document.querySelectorAll<HTMLElement>(selectors.join(",")).forEach((node) => {
    if (keepInsideBookingForm && node.closest("#bookero-form")) return;
    node.remove();
  });
}

function patchStickyToggleLabel(label: string) {
  const setLabel = (el: HTMLElement) => {
    if (el.childElementCount === 0) {
      const raw = (el.textContent ?? "").trim();
      if (/rezerw|book|reserv/i.test(raw)) {
        el.textContent = label;
      }
      return;
    }

    el.querySelectorAll<HTMLElement>("span, div, p, strong").forEach((node) => {
      if (node.childElementCount > 0) return;
      const raw = (node.textContent ?? "").trim();
      if (/rezerw|book|reserv/i.test(raw)) {
        node.textContent = label;
      }
    });
  };

  document.querySelectorAll<HTMLElement>(".bookero-sticky-plugin-toggle").forEach((toggle) => {
    toggle.setAttribute("aria-label", label);
    setLabel(toggle);
  });
}

export default function FloatingBookingButton() {
  const pathname = usePathname();
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const normalizedPath = normalizePath(pathname);
  const isHiddenPath = HIDDEN_PATHS.has(normalizedPath);
  const bookeroLang = loc === "en" ? "en" : "pl";

  useEffect(() => {
    if (typeof window === "undefined") return;

    removeLeakedInlineBookeroNodes(isHiddenPath);
    removeBookeroInstancesByTypes(["standard", "inline", "calendar", "weekly"]);

    if (isHiddenPath) {
      removeBookeroInstancesByTypes(["sticky"]);
      removeStickyBookeroNodes();

      const hiddenPathObserver = new MutationObserver(() => {
        removeStickyBookeroNodes();
        removeLeakedInlineBookeroNodes(true);
      });

      hiddenPathObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        hiddenPathObserver.disconnect();
      };
    }

    removeStickyBookeroNodes();
    removeBookeroInstancesByTypes(["sticky"]);

    let cancelled = false;
    let observer: MutationObserver | null = null;
    let idleCallbackId: number | null = null;
    let idleTimeoutId: number | null = null;

    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const cleanupIntentListeners = () => {
      window.removeEventListener("pointerdown", triggerMount);
      window.removeEventListener("keydown", triggerMount);
      window.removeEventListener("touchstart", triggerMount);
      window.removeEventListener("wheel", triggerMount);
    };

    const cleanupIdleHandles = () => {
      if (idleCallbackId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleCallbackId);
      }
      if (idleTimeoutId !== null) {
        window.clearTimeout(idleTimeoutId);
      }
      idleCallbackId = null;
      idleTimeoutId = null;
    };

    const mountSticky = () => {
      if (cancelled) return;

      void mountBookeroInstance(
        {
          id: BOOKERO_PLUGIN_ID,
          container: STICKY_CONTAINER_ID,
          type: "sticky",
          position: "bottom-right",
          plugin_css: true,
          lang: bookeroLang,
        },
        true,
        { persist: true },
      ).finally(() => {
        if (cancelled) return;
        patchStickyToggleLabel(STICKY_BUTTON_LABEL);

        observer = new MutationObserver(() => {
          patchStickyToggleLabel(STICKY_BUTTON_LABEL);
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });
    };

    function triggerMount() {
      cleanupIdleHandles();
      cleanupIntentListeners();
      mountSticky();
    }

    window.addEventListener("pointerdown", triggerMount, { once: true, passive: true });
    window.addEventListener("keydown", triggerMount, { once: true });
    window.addEventListener("touchstart", triggerMount, { once: true, passive: true });
    window.addEventListener("wheel", triggerMount, { once: true, passive: true });

    if (typeof win.requestIdleCallback === "function") {
      idleCallbackId = win.requestIdleCallback(() => {
        triggerMount();
      }, { timeout: 2400 });
    } else {
      idleTimeoutId = window.setTimeout(() => {
        triggerMount();
      }, 1600);
    }

    return () => {
      cancelled = true;
      cleanupIdleHandles();
      cleanupIntentListeners();
      observer?.disconnect();
      removeStickyBookeroNodes();
    };
  }, [isHiddenPath, bookeroLang, normalizedPath]);

  return null;
}
