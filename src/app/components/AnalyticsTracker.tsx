"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const MAX_LABEL_LENGTH = 120;

const LABEL_MAP: Record<string, string> = {
  // PL
  "wydarzenia": "Wydarzenia",
  "jak dojechać": "Jak dojechać",
  "bilety i rezerwacje": "Bilety i rezerwacje",
  "aktualności": "Aktualności",
  "galeria": "Galeria",
  "strona główna": "Strona główna",
  "o alvernia planet": "O Alvernia Planet",
  "kontakt": "Kontakt",
  "wystawa tematyczna": "Wystawa tematyczna",
  "ścieżka filmowa": "Ścieżka filmowa",
  "kino 360°": "Kino 360°",
  "regulamin": "Regulamin",
  "polityka prywatności": "Polityka prywatności",
  "polityka cookies": "Polityka cookies",
  "ochrona małoletnich": "Ochrona małoletnich",
  // EN -> map to PL
  "events": "Wydarzenia",
  "getting here": "Jak dojechać",
  "tickets & bookings": "Bilety i rezerwacje",
  "news": "Aktualności",
  "gallery": "Galeria",
  "home": "Strona główna",
  "about alvernia planet": "O Alvernia Planet",
  "contact": "Kontakt",
  "themed exhibition": "Wystawa tematyczna",
  "film path": "Ścieżka filmowa",
  "360° cinema": "Kino 360°",
  "terms & conditions": "Regulamin",
  "privacy policy": "Polityka prywatności",
  "cookies policy": "Polityka cookies",
  "minors protection": "Ochrona małoletnich",
  "book your visit": "Rezerwuj wizytę",
};

function getLabel(el: HTMLElement) {
  const dataLabel = el.getAttribute("data-analytics-label")?.trim();
  if (dataLabel) return dataLabel.slice(0, MAX_LABEL_LENGTH);
  const text = el.textContent?.trim().replace(/\s+/g, " ");
  return text ? text.slice(0, MAX_LABEL_LENGTH) : undefined;
}

function getHref(el: HTMLElement) {
  if (el instanceof HTMLAnchorElement && el.href) {
    try {
      const url = new URL(el.href, window.location.href);
      return url.origin === window.location.origin ? url.pathname + url.search : url.href;
    } catch {
      return el.href;
    }
  }
  return undefined;
}

function normalizeLabel(label?: string) {
  if (!label) return undefined;
  const key = label.toLowerCase().trim();
  return LABEL_MAP[key] || label;
}

function detectLanguageSwitch(label?: string) {
  if (!label) return undefined;
  const key = label.toLowerCase();
  if (key === "en" || key === "english") return "en";
  if (key === "pl" || key === "polski") return "pl";
  return undefined;
}

export function AnalyticsTracker() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest) return;

      const clickable = target.closest<HTMLElement>("[data-analytics-label], [data-analytics-event], a, button, [role='button']");
      if (!clickable || clickable.getAttribute("data-analytics-ignore") === "true") return;

      const eventName = clickable.getAttribute("data-analytics-event") || "ui_click";
      const rawLabel = getLabel(clickable);
      const label = normalizeLabel(rawLabel);
      const href = getHref(clickable);

      const langTo = detectLanguageSwitch(label || rawLabel);
      if (langTo) {
        trackEvent("language_switch", { to: langTo, label: label || rawLabel });
      }

      trackEvent(eventName, { label: label || rawLabel, href });
    };

    document.addEventListener("click", handler, { capture: true });
    return () => document.removeEventListener("click", handler, { capture: true });
  }, []);

  return null;
}
