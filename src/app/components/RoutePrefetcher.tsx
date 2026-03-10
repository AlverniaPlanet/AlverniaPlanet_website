"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import { getPrefetchTargets, type Locale } from "@/lib/localizedRoutes";

export default function RoutePrefetcher() {
  const router = useRouter();
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";

  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    };
    const connection = nav.connection;

    if (connection?.saveData) {
      return;
    }

    if (typeof connection?.effectiveType === "string" && /(^|-)2g$/.test(connection.effectiveType)) {
      return;
    }

    let cancelled = false;
    let idleCallbackId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let queueTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let loadTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const runPrefetch = () => {
      if (cancelled) return;
      const targets = getPrefetchTargets(loc);
      let index = 0;

      const prefetchNext = () => {
        if (cancelled || index >= targets.length) return;
        const href = targets[index];
        index += 1;
        try {
          router.prefetch(href);
        } catch {
          // Ignore prefetch failures, they are non-critical.
        }
        queueTimeoutId = setTimeout(prefetchNext, 140);
      };

      prefetchNext();
    };

    const schedulePrefetch = () => {
      if (cancelled) return;
      if (typeof win.requestIdleCallback === "function") {
        idleCallbackId = win.requestIdleCallback(runPrefetch, { timeout: 2600 });
      } else {
        timeoutId = setTimeout(runPrefetch, 1800);
      }
    };

    const onLoad = () => {
      loadTimeoutId = setTimeout(schedulePrefetch, 180);
    };

    if (document.readyState === "complete") {
      schedulePrefetch();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      if (idleCallbackId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (queueTimeoutId !== null) {
        clearTimeout(queueTimeoutId);
      }
      if (loadTimeoutId !== null) {
        clearTimeout(loadTimeoutId);
      }
    };
  }, [loc, router]);

  return null;
}
