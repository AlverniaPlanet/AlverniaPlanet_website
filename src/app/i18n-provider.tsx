"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Locale = "pl" | "en";

const DICTS: Record<Locale, Record<string, string>> = {
  pl: {
    "nav.home": "Strona Główna",
    "nav.about": "O nas",
    "nav.contact": "Kontakt",
    "nav.booking": "Rezerwacja",
    "cta.booking": "Rezerwuj",
    "nav.news": "Aktualności",
    "nav.attraction": "Atrakcje",
    "nav.gallery": "Galeria",
    "nav.about_alvernia": "O Alvernia Planet",
    "nav.getting_there": "Jak dojechać",
    "menu.attractions.exhibition": "Wystawa tematyczna",
    "menu.attractions.film_path": "Ścieżka filmowa",
    "menu.attractions.cinema": "Kino 360°",
    "nav.events": "Wydarzenia",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About us",
    "nav.contact": "Contact",
    "nav.booking": "Booking",
    "cta.booking": "Book now",
    "nav.news": "News",
    "nav.attraction": "Attractions",
    "nav.gallery": "Gallery",
    "nav.about_alvernia": "About Alvernia Planet",
    "nav.getting_there": "Getting here",
    "menu.attractions.exhibition": "Thematic exhibition",
    "menu.attractions.film_path": "Film trail",
    "menu.attractions.cinema": "360° cinema",
    "nav.events": "Events",
  },
};

const I18nCtx = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}>({
  locale: "pl",
  setLocale: () => {},
  t: (k) => k,
});

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(() => initialLocale ?? "pl");

  useEffect(() => {
    try { localStorage.setItem("locale", locale); } catch {}
    try { document.cookie = `locale=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 400}`; } catch {}
    try { document.documentElement.setAttribute("lang", locale); } catch {}
  }, [locale]);

  const t = useMemo(() => {
    const dict = DICTS[locale];
    return (key: string) => dict[key] ?? key;
  }, [locale]);

  return <I18nCtx.Provider value={{ locale, setLocale, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex gap-1">
      <button
        onClick={() => setLocale("pl")}
        className={`px-2 py-1 rounded text-sm font-medium ${
          locale === "pl" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        PL
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`px-2 py-1 rounded text-sm font-medium ${
          locale === "en" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        EN
      </button>
    </div>
  );
}
