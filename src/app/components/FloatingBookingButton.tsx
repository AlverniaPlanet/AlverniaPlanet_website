"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/app/i18n-provider";
import { mountBookeroInstance, removeBookeroInstancesByTypes } from "@/app/components/bookeroRuntime";
import { getBookingPath } from "@/lib/localizedRoutes";

const BOOKERO_PLUGIN_ID = "8iWKMAEWtI0P";
const STICKY_CONTAINER_ID = "bookero-sticky-plugin";
const STICKY_BUTTON_LABEL = "Bilety";
const STICKY_LABEL_RETRY_DELAYS = [120, 360, 900, 1800] as const;

const HIDDEN_PATHS = new Set(["/rezerwuj", "/en/reserve", "/pt/reservar"]);
const STICKY_LABEL_MATCH = /rezerw|book|reserv|ticket|bilhet|bilet/i;

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
    const raw = (el.textContent ?? "").trim();
    if (!raw || raw === label || !STICKY_LABEL_MATCH.test(raw)) {
      return;
    }
    el.textContent = label;
  };

  document.querySelectorAll<HTMLElement>(".bookero-sticky-plugin-toggle").forEach((toggle) => {
    if (toggle.getAttribute("aria-label") !== label) {
      toggle.setAttribute("aria-label", label);
    }
    if (toggle.childElementCount === 0) {
      setLabel(toggle);
      return;
    }
    toggle.querySelectorAll<HTMLElement>("span, div, p, strong").forEach((node) => {
      if (node.childElementCount > 0) return;
      setLabel(node);
    });
  });
}

export default function FloatingBookingButton() {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const normalizedPath = normalizePath(pathname);
  const isHiddenPath = HIDDEN_PATHS.has(normalizedPath);
  const bookeroLang = loc === "en" ? "en" : "pl";
  const bookingHref = getBookingPath(loc);
  const stickyButtonLabel = loc === "pl" ? STICKY_BUTTON_LABEL : t("nav.tickets");
  const labelRef = useRef(stickyButtonLabel);
  const labelSyncTimeoutsRef = useRef<number[]>([]);
  const labelSyncRafRef = useRef<number | null>(null);
  const [useNativeFallbackOnly, setUseNativeFallbackOnly] = useState(false);
  const [runtimeMounted, setRuntimeMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
      deviceMemory?: number;
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrowViewport = window.matchMedia("(max-width: 767px)").matches;
    const saveData = Boolean(nav.connection?.saveData);
    const effectiveType = nav.connection?.effectiveType ?? "";
    const constrainedNetwork = /(^|-)2g$|3g/.test(effectiveType);
    const deviceMemory = nav.deviceMemory;
    const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 4;
    const lowCpu = (nav.hardwareConcurrency ?? 8) <= 4;

    setUseNativeFallbackOnly(
      reducedMotion ||
        saveData ||
        constrainedNetwork ||
        coarsePointer ||
        (narrowViewport && (lowMemory || lowCpu)),
    );
  }, [normalizedPath]);

  const clearScheduledLabelSync = () => {
    if (labelSyncRafRef.current !== null) {
      window.cancelAnimationFrame(labelSyncRafRef.current);
      labelSyncRafRef.current = null;
    }
    labelSyncTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    labelSyncTimeoutsRef.current = [];
  };

  const scheduleStickyLabelSync = (label: string) => {
    if (typeof window === "undefined") return;

    clearScheduledLabelSync();
    patchStickyToggleLabel(label);

    labelSyncRafRef.current = window.requestAnimationFrame(() => {
      patchStickyToggleLabel(label);
      labelSyncRafRef.current = null;
    });

    labelSyncTimeoutsRef.current = STICKY_LABEL_RETRY_DELAYS.map((delay) =>
      window.setTimeout(() => {
        patchStickyToggleLabel(label);
      }, delay),
    );
  };

  useEffect(() => {
    labelRef.current = stickyButtonLabel;
    if (isHiddenPath || useNativeFallbackOnly) return;
    scheduleStickyLabelSync(stickyButtonLabel);

    return () => {
      clearScheduledLabelSync();
    };
  }, [stickyButtonLabel, isHiddenPath, useNativeFallbackOnly]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    removeLeakedInlineBookeroNodes(isHiddenPath);
    removeBookeroInstancesByTypes(["standard", "inline", "calendar", "weekly"]);
    setRuntimeMounted(false);

    if (isHiddenPath || useNativeFallbackOnly) {
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
        setRuntimeMounted(true);
        scheduleStickyLabelSync(labelRef.current);
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
      clearScheduledLabelSync();
      removeStickyBookeroNodes();
    };
  }, [isHiddenPath, bookeroLang, normalizedPath, useNativeFallbackOnly]);

  if (isHiddenPath) {
    return null;
  }

  return useNativeFallbackOnly || !runtimeMounted ? (
    <Link href={bookingHref} className="ap-native-booking-fallback">
      {stickyButtonLabel}
    </Link>
  ) : null;
}
