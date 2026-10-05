"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { INTL_LOCALES, type Locale } from "@/lib/localizedRoutes";

const DICTS: Record<Locale, Record<string, string>> = {
  pl: {
    "nav.home": "Strona Główna",
    "nav.mars_colonization": "Mars Colonization",
    "nav.mars_colonization_badge": "Nowość",
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
    "nav.groups": "Dla grup",
    "nav.plan_visit": "Zaplanuj wizytę",
    "nav.plan_visit_desc": "Dojazd, bistro i odpowiedzi na pytania",
    "nav.getting_there_desc": "Dojazd, komunikacja, mapa",
    "nav.bistro_desc": "Co zjeść na miejscu",
    "nav.faq_desc": "Najczęściej zadawane pytania",
    "nav.faq_short": "FAQ",
    "cta.tickets": "Kup bilety",
    "cta.tickets_short": "Bilety",
    "cta.ask_date": "Zapytaj o termin",
    "cta.ask_date_short": "Zapytaj",
    "nav.tickets": "Bilety",
    "menu.attractions.exhibition": "Harry Potter: The Exhibition",
    "menu.attractions.film_path": "FILMWORLD",
    "menu.attractions.k360": "Kino 360",
    "menu.attractions.mars": "MARS",
    "menu.attractions.bistro": "Bistro",
    "nav.faq": "Najczęściej zadawane pytania",
    "nav.events": "Eventy",
    "aria.primary_nav": "Nawigacja główna",
    "nav.quick_navigate": "Nawiguj",
    "nav.quick_call": "Zadzwoń",
    "nav.groups_badge": "Dni otwarte",
    "aria.language": "Język",
    "aria.secondary_nav": "Nawigacja pomocnicza",
    "aria.open_menu": "Otwórz menu",
    "aria.close_menu": "Zamknij menu",
    "aria.home": "Alvernia Planet – strona główna",
  },
  en: {
    "nav.home": "Home",
    "nav.mars_colonization": "Mars Colonization",
    "nav.mars_colonization_badge": "New",
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
    "nav.plan_visit": "Plan your visit",
    "nav.plan_visit_desc": "Getting here, bistro and answers",
    "nav.getting_there_desc": "Directions, transport, map",
    "nav.bistro_desc": "Where to eat on site",
    "nav.faq_desc": "Frequently asked questions",
    "nav.faq_short": "FAQ",
    "cta.tickets": "Buy tickets",
    "cta.tickets_short": "Tickets",
    "cta.ask_date": "Ask about a date",
    "cta.ask_date_short": "Enquire",
    "nav.tickets": "Tickets",
    "menu.attractions.exhibition": "Harry Potter: The Exhibition",
    "menu.attractions.film_path": "FILMWORLD",
    "menu.attractions.k360": "K360 Cinema",
    "menu.attractions.mars": "Mars mission",
    "menu.attractions.bistro": "Bistro",
    "nav.faq": "Frequently asked questions",
    "nav.events": "Events",
    "aria.primary_nav": "Main navigation",
    "nav.quick_navigate": "Directions",
    "nav.quick_call": "Call us",
    "nav.groups_badge": "Open days",
    "aria.language": "Language",
    "aria.secondary_nav": "Secondary navigation",
    "aria.open_menu": "Open menu",
    "aria.close_menu": "Close menu",
    "aria.home": "Alvernia Planet – home",
  },
  pt: {
    "nav.home": "Início",
    "nav.mars_colonization": "Mars Colonization",
    "nav.mars_colonization_badge": "Novo",
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
    "nav.plan_visit": "Planeia a visita",
    "nav.plan_visit_desc": "Como chegar, bistrô e respostas",
    "nav.getting_there_desc": "Acessos, transportes, mapa",
    "nav.bistro_desc": "Onde comer no local",
    "nav.faq_desc": "Perguntas mais frequentes",
    "nav.faq_short": "FAQ",
    "cta.tickets": "Comprar bilhetes",
    "cta.tickets_short": "Bilhetes",
    "cta.ask_date": "Pedir uma data",
    "cta.ask_date_short": "Contactar",
    "nav.tickets": "Bilhetes",
    "menu.attractions.exhibition": "Harry Potter: The Exhibition",
    "menu.attractions.film_path": "FILMWORLD",
    "menu.attractions.k360": "Cinema K360",
    "menu.attractions.mars": "Missão Marte",
    "menu.attractions.bistro": "Bistro",
    "nav.faq": "Perguntas mais frequentes",
    "nav.events": "Eventos",
    "aria.primary_nav": "Navegação principal",
    "nav.quick_navigate": "Como chegar",
    "nav.quick_call": "Telefonar",
    "nav.groups_badge": "Dias abertos",
    "aria.language": "Idioma",
    "aria.secondary_nav": "Navegação secundária",
    "aria.open_menu": "Abrir menu",
    "aria.close_menu": "Fechar menu",
    "aria.home": "Alvernia Planet – página inicial",
  },
  de: {
    "nav.home": "Startseite",
    "nav.mars_colonization": "Mars Colonization",
    "nav.mars_colonization_badge": "Neu",
    "nav.about": "Über uns",
    "nav.contact": "Kontakt",
    "nav.booking": "Buchung",
    "cta.booking": "Tickets kaufen!",
    "nav.news": "Aktuelles",
    "nav.attraction": "Attraktionen",
    "nav.gallery": "Galerie",
    "nav.about_alvernia": "Über Alvernia Planet",
    "nav.virtual_walk": "Virtueller Rundgang",
    "nav.getting_there": "Anfahrt",
    "nav.groups": "Gruppen",
    "nav.plan_visit": "Besuch planen",
    "nav.plan_visit_desc": "Anfahrt, Bistro und Antworten",
    "nav.getting_there_desc": "Anfahrt, Verbindungen, Karte",
    "nav.bistro_desc": "Essen vor Ort",
    "nav.faq_desc": "Häufige Fragen",
    "nav.faq_short": "FAQ",
    "cta.tickets": "Tickets kaufen",
    "cta.tickets_short": "Tickets",
    "cta.ask_date": "Termin anfragen",
    "cta.ask_date_short": "Anfragen",
    "nav.tickets": "Tickets",
    "menu.attractions.exhibition": "Harry Potter: The Exhibition",
    "menu.attractions.film_path": "FILMWORLD",
    "menu.attractions.k360": "Kino 360",
    "menu.attractions.mars": "Mars-Mission",
    "menu.attractions.bistro": "Bistro",
    "nav.faq": "Häufige Fragen",
    "nav.events": "Events",
    "aria.primary_nav": "Hauptnavigation",
    "nav.quick_navigate": "Route",
    "nav.quick_call": "Anrufen",
    "nav.groups_badge": "Tage der offenen Tür",
    "aria.language": "Sprache",
    "aria.secondary_nav": "Sekundäre Navigation",
    "aria.open_menu": "Menü öffnen",
    "aria.close_menu": "Menü schließen",
    "aria.home": "Alvernia Planet – Startseite",
  },
  zh: {
    "nav.home": "首页",
    "nav.mars_colonization": "Mars Colonization",
    "nav.mars_colonization_badge": "新",
    "nav.about": "关于我们",
    "nav.contact": "联系我们",
    "nav.booking": "预订",
    "cta.booking": "购买门票！",
    "nav.news": "最新消息",
    "nav.attraction": "景点",
    "nav.gallery": "图库",
    "nav.about_alvernia": "关于 Alvernia Planet",
    "nav.virtual_walk": "虚拟导览",
    "nav.getting_there": "交通指南",
    "nav.groups": "团体",
    "nav.plan_visit": "规划行程",
    "nav.plan_visit_desc": "交通、餐饮与常见问题",
    "nav.getting_there_desc": "交通、公共运输、地图",
    "nav.bistro_desc": "园区内的用餐",
    "nav.faq_desc": "常见问题",
    "nav.faq_short": "FAQ",
    "cta.tickets": "购买门票",
    "cta.tickets_short": "门票",
    "cta.ask_date": "咨询档期",
    "cta.ask_date_short": "咨询",
    "nav.tickets": "门票",
    "menu.attractions.exhibition": "Harry Potter: The Exhibition",
    "menu.attractions.film_path": "FILMWORLD",
    "menu.attractions.k360": "Kino 360 全景影院",
    "menu.attractions.mars": "火星任务",
    "menu.attractions.bistro": "Bistro",
    "nav.faq": "常见问题",
    "nav.events": "活动",
    "aria.primary_nav": "主导航",
    "nav.quick_navigate": "导航",
    "nav.quick_call": "致电",
    "nav.groups_badge": "开放日",
    "aria.language": "语言",
    "aria.secondary_nav": "次级导航",
    "aria.open_menu": "打开菜单",
    "aria.close_menu": "关闭菜单",
    "aria.home": "Alvernia Planet 首页",
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

/** Język z prefiksu ścieżki (/zh, /de/...). Zwraca undefined dla tras polskich. */
function localeZeSciezki(path: string | null | undefined): Locale | undefined {
  if (!path) return undefined;
  const p = path.toLowerCase();
  return INTL_LOCALES.find((kod) => p === `/${kod}` || p.startsWith(`/${kod}/`));
}

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  // Język wyliczamy z trasy JUŻ przy pierwszym renderze — także podczas
  // prerenderu do statycznego HTML. Wcześniej stan startował z "pl", a właściwy
  // język ustawiał się dopiero w useEffect po hydracji. Layouty /en, /pt, /de
  // i /zh naprawiały to dla TREŚCI stron, ale pasek nawigacji i stopka są
  // renderowane w głównym layoutcie, czyli poza nimi — więc w świeżo otwartej
  // karcie menu i stopka błyskały polskim, zanim ruszył JavaScript.
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>(
    () => localeZeSciezki(pathname) ?? initialLocale ?? "pl",
  );

  useEffect(() => {
    try { localStorage.setItem("locale", locale); } catch {}
    try { document.cookie = `locale=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 400}`; } catch {}
    try { document.documentElement.setAttribute("lang", locale); } catch {}
  }, [locale]);

  useEffect(() => {
    // zapewnia dopasowanie języka do aktualnej ścieżki po mount
    if (typeof window === "undefined") return;
    const path = window.location.pathname.toLowerCase();
    // Wykrywanie języka z prefiksu ścieżki — generyczne po liście INTL_LOCALES,
    // żeby dodanie kolejnej wersji nie wymagało dopisywania kolejnego else-if.
    const zPrefiksu = localeZeSciezki(path);
    if (zPrefiksu) {
      if (locale !== zPrefiksu) setLocale(zPrefiksu);
    } else if (locale !== "pl") {
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
