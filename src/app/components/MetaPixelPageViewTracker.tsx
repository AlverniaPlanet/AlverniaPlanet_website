"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type FbqFn = (...args: unknown[]) => void;

export function MetaPixelPageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const fbq = (window as Window & { fbq?: FbqFn }).fbq;
    if (typeof fbq !== "function") return;

    fbq("track", "PageView");
  }, [pathname]);

  return null;
}
