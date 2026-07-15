export type Locale = "pl" | "en" | "pt";

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
  "/rezerwuj",
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
  return locale === "en" || locale === "pt";
}

export function getBookingPath(locale: Locale): string {
  return BOOKING_PATH_BY_LOCALE[locale];
}

export function stripLocalePrefix(path: string): string {
  const normalized = normalizePathname(path);
  if (normalized === "/en" || normalized.startsWith("/en/")) {
    return normalized.slice(3) || "/";
  }
  if (normalized === "/pt" || normalized.startsWith("/pt/")) {
    return normalized.slice(3) || "/";
  }
  return normalized;
}

export function mapToPolishRoute(path: string): string {
  const normalized = normalizePathname(path);
  if (!normalized.startsWith("/")) return normalized;
  if (normalized.startsWith("/legal/")) return normalized;

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
  if (normalized.startsWith("/legal/")) return normalized;

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
