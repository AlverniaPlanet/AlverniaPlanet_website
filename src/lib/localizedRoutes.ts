// Języki serwisu. Polski jest domyślny (bez prefiksu w adresie), reszta
// dostaje prefiks /<kod>. Slugi tras są wspólne angielskie dla wszystkich
// wersji obcojęzycznych — patrz PL_TO_INTL_COMMON.
export const LOCALES = ["pl", "en", "pt", "de", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

/** Wersje z prefiksem w adresie (wszystko poza polskim). */
export const INTL_LOCALES = LOCALES.filter((l) => l !== "pl");

const PL_TO_INTL_COMMON: Record<string, string> = {
  "/aktualnosci": "/news",
  "/wydarzenia": "/events",
  "/wydarzenia/vr": "/events/vr",
  "/galeria": "/gallery",
  "/jak-dojechac": "/getting-there",
  "/grupy": "/groups",
  "/o-alvernia-planet": "/about",
  "/kontakt": "/contact",
  "/harry-potter-the-exhibition": "/harry-potter-the-exhibition",
  "/atrakcje/sciezka-filmowa": "/attractions/film-path",
  "/atrakcje/filmworld": "/attractions/under-the-dome",
  "/atrakcje/kino-360": "/attractions/k360",
  // Podstrony filmów Kina 360 (repertuar).
  "/atrakcje/kino-360/one-step-beyond": "/attractions/k360/one-step-beyond",
  "/atrakcje/kino-360/time": "/attractions/k360/time",
  "/atrakcje/kino-360/explore": "/attractions/k360/explore",
  "/atrakcje/kino-360/the-stellars": "/attractions/k360/the-stellars",
};

const INTL_TO_PL_COMMON: Record<string, string> = Object.entries(PL_TO_INTL_COMMON).reduce(
  (acc, [plPath, intlPath]) => {
    acc[intlPath] = plPath;
    return acc;
  },
  {} as Record<string, string>,
);

const BOOKING_PATH_BY_LOCALE: Record<Locale, string> = {
  pl: "/rezerwuj",
  en: "/en/reserve",
  pt: "/pt/reservar",
  de: "/de/reserve",
  zh: "/zh/reserve",
};

const BASE_PREFETCH_PATHS = [
  "/",
  "/aktualnosci",
  "/wydarzenia",
  "/galeria",
  "/jak-dojechac",
  "/grupy",
  "/runmageddon",
  "/kontakt",
] as const;

export function normalizePathname(path: string | null | undefined): string {
  if (!path) return "/";
  if (path.length === 1) return path;
  return path.replace(/\/+$/, "");
}

export function getLocalePrefix(locale: Locale): string {
  return locale === "pl" ? "" : `/${locale}`;
}

export function isLocalizedLocale(locale: Locale): boolean {
  return locale !== "pl";
}

export function getBookingPath(locale: Locale): string {
  return BOOKING_PATH_BY_LOCALE[locale];
}

export function stripLocalePrefix(path: string): string {
  const normalized = normalizePathname(path);
  for (const locale of INTL_LOCALES) {
    const prefix = `/${locale}`;
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return normalized.slice(prefix.length) || "/";
    }
  }
  return normalized;
}

export function mapToPolishRoute(path: string): string {
  const normalized = normalizePathname(path);
  if (!normalized.startsWith("/")) return normalized;
  if (normalized.startsWith("/stopka/")) return normalized;

  const withoutPrefix = stripLocalePrefix(normalized);
  if (withoutPrefix === "/atrakcje/k360") {
    return "/atrakcje/kino-360";
  }
  if (withoutPrefix === "/reserve" || withoutPrefix === "/reservar") {
    return "/rezerwuj";
  }
  return INTL_TO_PL_COMMON[withoutPrefix] ?? withoutPrefix;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const normalized = normalizePathname(path);
  if (!normalized.startsWith("/")) return normalized;
  if (normalized.startsWith("/stopka/")) return normalized;

  const polishPath = mapToPolishRoute(normalized);
  if (locale === "pl") {
    return polishPath;
  }

  if (polishPath === "/") {
    return getLocalePrefix(locale);
  }

  if (polishPath === "/rezerwuj") {
    return getBookingPath(locale);
  }

  /* MARS nie ma wersji obcojęzycznej — istnieje wyłącznie `/atrakcje/mars`.
     Bez tego wyjątku funkcja doklejała sam prefiks języka i na stronach
     głównych /de, /en, /pt i /zh powstawał odnośnik `/de/atrakcje/mars`
     prowadzący donikąd (zmierzone: 4 x 404 przy przeglądzie eksportu
     2026-10-01). `getSitePaths` miał już ten adres zapisany na sztywno —
     ten warunek domyka tę samą zasadę dla wszystkich wywołań. */
  if (polishPath === "/atrakcje/mars") {
    return polishPath;
  }

  /* To samo dla landingu „Mars Colonization": na etapie zapowiedzi (decyzja
     obiektu, 2026-10-02) istnieje wyłącznie po polsku. Bez tego wyjątku pozycja
     na pasku generowałaby `/de/mars-colonization` i cztery razy 404 — dokładnie
     ten błąd, który wystąpił wyżej przy `/atrakcje/mars`.
     PRZY DOKŁADANIU WERSJI OBCOJĘZYCZNYCH: usunąć ten warunek, dodać cztery
     pliki `src/app/<jezyk>/mars-colonization/page.tsx`, przenieść trasę
     z `TRASY_TYLKO_PL` do `TRASY_WIELOJEZYCZNE` w `sitemap.ts` — i DOPIERO
     WTEDY wdrożyć funkcję brzegową z mapą zgód per język, bo inaczej dowód
     zgody w bazie rozjedzie się z ekranem. */
  if (polishPath === "/mars-colonization") {
    return polishPath;
  }

  const mappedPath = PL_TO_INTL_COMMON[polishPath] ?? polishPath;
  return `${getLocalePrefix(locale)}${mappedPath}`.replace(/\/{2,}/g, "/");
}

export function getSitePaths(locale: Locale) {
  return {
    home: getLocalizedPath("/", locale),
    news: getLocalizedPath("/aktualnosci", locale),
    events: getLocalizedPath("/wydarzenia", locale),
    vrTour: getLocalizedPath("/wydarzenia/vr", locale),
    gallery: getLocalizedPath("/galeria", locale),
    gettingThere: getLocalizedPath("/jak-dojechac", locale),
    groups: getLocalizedPath("/grupy", locale),
    runmageddon: getLocalizedPath("/runmageddon", locale),
    booking: getLocalizedPath("/rezerwuj", locale),
    about: getLocalizedPath("/o-alvernia-planet", locale),
    faq: getLocalizedPath("/faq", locale),
    contact: getLocalizedPath("/kontakt", locale),
    attractions: {
      exhibition: getLocalizedPath("/harry-potter-the-exhibition", locale),
      // Indywidualna atrakcja "Wejdź pod kopułę" (dawniej Ścieżka filmowa).
      filmPath: getLocalizedPath("/atrakcje/filmworld", locale),
      k360: getLocalizedPath("/atrakcje/kino-360", locale),
      mars: "/atrakcje/mars",
      // Slug „/bistro" jest ten sam we wszystkich językach (nazwa własna),
      // więc nie ma wpisu w PL_TO_INTL_COMMON — wystarczy prefiks języka.
      bistro: getLocalizedPath("/bistro", locale),
      // To samo co wyżej: „Mars Colonization" jest nazwą własną produktu,
      // więc slug nie tłumaczy się na żaden język. UWAGA: to NIE jest ta sama
      // trasa co `mars` wyżej — tamto jest istniejąca atrakcja (plan filmowy),
      // ta jest landingiem nowego produktu na 2027 rok.
      marsColonization: getLocalizedPath("/mars-colonization", locale),
    },
  };
}

export function getPrefetchTargets(locale: Locale): string[] {
  return BASE_PREFETCH_PATHS.map((path) => getLocalizedPath(path, locale));
}

// Trasy renderowane bez chrome'u serwisu (navbar / stopka / pływające CTA),
// np. kioskowa aplikacja leadowa /aplikacje/identyfikacja oraz brief /aplikacje/mars-brief.
const BARE_CHROME_ROUTES = [
  "/aplikacje/identyfikacja",
  "/aplikacje/identyfikacja-online",
  "/aplikacje/mars-brief",
];
export function isBareChromeRoute(path: string | null | undefined): boolean {
  const canonical = mapToPolishRoute(normalizePathname(path ?? "/"));
  return BARE_CHROME_ROUTES.some((route) => canonical === route || canonical.startsWith(`${route}/`));
}
