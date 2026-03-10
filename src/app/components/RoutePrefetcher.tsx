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
    let cancelled = false;
    let idleCallbackId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let queueTimeoutId: ReturnType<typeof setTimeout> | null = null;

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

    if (typeof win.requestIdleCallback === "function") {
      idleCallbackId = win.requestIdleCallback(runPrefetch, { timeout: 2200 });
    } else {
      timeoutId = setTimeout(runPrefetch, 1200);
    }

    return () => {
      cancelled = true;
      if (idleCallbackId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (queueTimeoutId !== null) {
        clearTimeout(queueTimeoutId);
      }
    };
  }, [loc, router]);

  return null;
}
