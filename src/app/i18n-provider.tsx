"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Locale = "pl" | "en" | "pt";

const DICTS: Record<Locale, Record<string, string>> = {
  pl: {
    "nav.home": "Strona Główna",
    "nav.about": "O nas",
    "nav.contact": "Kontakt",
    "nav.booking": "Rezerwacja",
    "cta.booking": "Kup bilet!",
    "nav.news": "Aktualności",
    "nav.attraction": "Atrakcje",
    "nav.gallery": "Galeria",
    "nav.about_alvernia": "O Alvernia Planet",
    "nav.virtual_walk": "Wirtualny spacer",
    "nav.getting_there": "Jak dojechać",
    "nav.groups": "Grupy",
    "nav.tickets": "Bilety",
    "menu.attractions.exhibition": "Harry Potter: The Exhibition",
    "menu.attractions.film_path": "FILMWORLD",
    "menu.attractions.k360": "Kino 360",
    "menu.attractions.mars": "MARS",
    "nav.faq": "Najczęściej zadawane pytania",
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
    "nav.virtual_walk": "Virtual tour",
    "nav.getting_there": "Getting here",
    "nav.groups": "Groups",
    "nav.tickets": "Tickets",
    "menu.attractions.exhibition": "Harry Potter: The Exhibition",
    "menu.attractions.film_path": "FILMWORLD",
    "menu.attractions.k360": "K360 Cinema",
    "menu.attractions.mars": "Mars mission",
    "nav.faq": "Frequently asked questions",
    "nav.events": "Events",
  },
  pt: {
    "nav.home": "Início",
    "nav.about": "Sobre",
    "nav.contact": "Contacto",
    "nav.booking": "Reservas",
    "cta.booking": "Reservar",
    "nav.news": "Notícias",
    "nav.attraction": "Atrações",
    "nav.gallery": "Galeria",
    "nav.about_alvernia": "Sobre a Alvernia Planet",
    "nav.virtual_walk": "Passeio virtual",
    "nav.getting_there": "Como chegar",
    "nav.groups": "Grupos",
    "nav.tickets": "Bilhetes",
    "menu.attractions.exhibition": "Harry Potter: The Exhibition",
    "menu.attractions.film_path": "FILMWORLD",
    "menu.attractions.k360": "Cinema K360",
    "menu.attractions.mars": "Missão Marte",
    "nav.faq": "Perguntas mais frequentes",
    "nav.events": "Eventos",
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
  const [locale, setLocale] = useState<Locale>(initialLocale ?? "pl");

  useEffect(() => {
    try { localStorage.setItem("locale", locale); } catch {}
    try { document.cookie = `locale=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 400}`; } catch {}
    try { document.documentElement.setAttribute("lang", locale); } catch {}
  }, [locale]);

  useEffect(() => {
    // zapewnia dopasowanie języka do aktualnej ścieżki po mount
    if (typeof window === "undefined") return;
    const path = window.location.pathname.toLowerCase();
    if ((path === "/en" || path.startsWith("/en/")) && locale !== "en") {
      setLocale("en");
    } else if ((path === "/pt" || path.startsWith("/pt/")) && locale !== "pt") {
      setLocale("pt");
    } else if (!path.startsWith("/en") && !path.startsWith("/pt") && locale !== "pl") {
      setLocale("pl");
    }
  }, []);

  const t = useMemo(() => {
    const dict = DICTS[locale];
    return (key: string) => dict[key] ?? key;
  }, [locale]);

  return <I18nCtx.Provider value={{ locale, setLocale, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}
