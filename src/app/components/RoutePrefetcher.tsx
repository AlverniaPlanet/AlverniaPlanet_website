"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";

type Locale = "pl" | "en" | "pt";

function getPrefetchTargets(locale: Locale): string[] {
  const prefix = locale === "pl" ? "" : `/${locale}`;
  const reservePath =
    locale === "en" ? "/en/reserve" : locale === "pt" ? "/pt/reservar" : "/rezerwuj";

  const toLocalePath = (path: string) => {
    if (locale === "pl") return path;
    const map: Record<string, string> = {
      "/wydarzenia": "/events",
      "/galeria": "/gallery",
      "/jak-dojechac": "/getting-there",
      "/o-alvernia-planet": "/about",
      "/kontakt": "/contact",
      "/atrakcje/wystawa": "/attractions/exhibition",
      "/atrakcje/sciezka-filmowa": "/attractions/film-path",
      "/atrakcje/kino-360": "/attractions/cinema-360",
    };
    const mapped = map[path] ?? path;
    return `${prefix}${mapped}`;
  };

  return [
    toLocalePath("/"),
    toLocalePath("/wydarzenia"),
    toLocalePath("/galeria"),
    toLocalePath("/jak-dojechac"),
    toLocalePath("/o-alvernia-planet"),
    toLocalePath("/kontakt"),
    toLocalePath("/atrakcje/wystawa"),
    toLocalePath("/atrakcje/sciezka-filmowa"),
    toLocalePath("/atrakcje/kino-360"),
    reservePath,
  ];
}

export default function RoutePrefetcher() {
  const router = useRouter();
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";

  useEffect(() => {
    let cancelled = false;
    let idleCallbackId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const runPrefetch = () => {
      if (cancelled) return;
      const targets = getPrefetchTargets(loc);
      targets.forEach((href) => {
        try {
          router.prefetch(href);
        } catch {
          // Ignore prefetch failures, they are non-critical.
        }
      });
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
    };
  }, [loc, router]);

  return null;
}
