export type Locale = "pl" | "en" | "pt";

const PL_TO_INTL_COMMON: Record<string, string> = {
  "/aktualnosci": "/news",
  "/wydarzenia": "/events",
  "/wydarzenia/vr": "/events/vr",
  "/galeria": "/gallery",
  "/jak-dojechac": "/getting-there",
  "/o-alvernia-planet": "/about",
  "/kontakt": "/contact",
  "/atrakcje/wystawa": "/attractions/exhibition",
  "/atrakcje/sciezka-filmowa": "/attractions/film-path",
  "/atrakcje/k360": "/attractions/k360",
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
  if (withoutPrefix === "/atrakcje/kino-360") {
    return "/atrakcje/k360";
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
    runmageddon: getLocalizedPath("/runmageddon", locale),
    booking: getLocalizedPath("/rezerwuj", locale),
    about: getLocalizedPath("/o-alvernia-planet", locale),
    contact: getLocalizedPath("/kontakt", locale),
    attractions: {
      exhibition: getLocalizedPath("/atrakcje/wystawa", locale),
      filmPath: getLocalizedPath("/atrakcje/sciezka-filmowa", locale),
      k360: getLocalizedPath("/atrakcje/k360", locale),
    },
  };
}

export function getPrefetchTargets(locale: Locale): string[] {
  return BASE_PREFETCH_PATHS.map((path) => getLocalizedPath(path, locale));
}
