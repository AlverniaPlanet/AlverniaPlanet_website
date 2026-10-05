import { getBookingPath, type Locale } from "@/lib/localizedRoutes";

// Nazwy wskazują na realne pozycje pakietu w panelu (patrz
// ALL_ATTRACTIONS_FILM_BOOKING_SERVICES niżej) — promocja i tak jest wygasła,
// ale martwy deep link kierowałby na przypadkową pierwszą pozycję listy.
export const K360_MARS_PREMIERE_BOOKING_SERVICES = {
  normal: "BILET NA WSZYSTKIE ATRAKCJE - One Step Beyond (119,00 zł)",
  reduced: "BILET NA WSZYSTKIE ATRAKCJE - One Step Beyond (99,00 zł)",
} as const;

// =====================================================================
// Usługi (services): dokładne nazwy z panelu Bookero, w tym wielkość
// liter i znak stopnia (°). Normalizator w BookeroEmbed dopasuje fuzzy,
// ale lepiej trzymać 1:1 z panelem.
// =====================================================================

// Etykiety dokładnie jak w panelu Bookero (nazwa atrakcji najpierw, myślnik, typ
// biletu). BookeroEmbed dopasowuje usługę przez równość po normalizacji, więc
// kolejność słów musi się zgadzać 1:1.

// Kino 360 — od teraz KAŻDY film ma osobną usługę (osobny bilet) w panelu Bookero.
// Normalny jest w kategorii "Bilet indywidualny", ulgowy w "Bilet indywidualny - ulgowy".
// Klucz = slug filmu (dokładnie jak w films.ts). Nazwy 1:1 z panelem Bookero.
export const K360_FILM_BOOKING_SERVICES: Record<string, { normal: string; reduced: string }> = {
  "one-step-beyond": {
    normal: "Kino 360 - One Step Beyond (49,00 zł)",
    reduced: "Kino 360 - One Step Beyond (39,00 zł)",
  },
  "the-stellars": {
    normal: "Kino 360 - The Stellars (49,00 zł)",
    reduced: "Kino 360 - The Stellars (39,00 zł)",
  },
  explore: {
    normal: "Kino 360 - Explore (49,00 zł)",
    reduced: "Kino 360 - Explore (39,00 zł)",
  },
  time: {
    normal: "Kino 360 - Time (49,00 zł)",
    reduced: "Kino 360 - Time (39,00 zł)",
  },
};

// Domyślny film dla OGÓLNYCH wejść „Kino 360" (portal na stronie głównej, hero
// strony kina) — nie ma już wspólnego biletu K360, więc kierujemy na film grany.
export const K360_DEFAULT_FILM_SLUG = "one-step-beyond";

// Pomocnik: nazwa usługi (service) biletu K360 dla danego filmu; fallback na film grany.
export function k360FilmService(slug: string, reduced = false): string {
  const svc = K360_FILM_BOOKING_SERVICES[slug] ?? K360_FILM_BOOKING_SERVICES[K360_DEFAULT_FILM_SLUG];
  if (!svc) return "Kino 360 - One Step Beyond (49,00 zł)";
  return reduced ? svc.reduced : svc.normal;
}

// Alias zgodności — ogólne wejścia „Kino 360" domyślnie kierują na film grany.
export const K360_BOOKING_SERVICES = {
  normal: "Kino 360 - One Step Beyond (49,00 zł)",
  reduced: "Kino 360 - One Step Beyond (39,00 zł)",
  // Kategoria "Bilet grupowy"; w panelu pozycja to sam tytuł filmu, bez ceny.
  group: "Kino 360 - One Step Beyond",
} as const;

export const MARS_BOOKING_SERVICES = {
  normal: "Projekt: MARS - Bilet normalny (69,00 zł)",
  reduced: "Projekt: MARS - Bilet ulgowy (59,00 zł)",
  // Kategoria "Bilet grupowy"; w panelu bilety grupowe NIE mają ceny w nazwie.
  group: "Projekt: MARS - Bilet grupowy",
} as const;

export const FILM_PATH_BOOKING_SERVICES = {
  normal: "Filmworld: Ścieżka edukacyjna z przewodnikiem - bilet normalny",
  reduced: "Filmworld: Ścieżka edukacyjna z przewodnikiem - bilet ulgowy",
  // Kategoria "Bilet grupowy"; w panelu bilety grupowe NIE mają ceny w nazwie.
  group: "Filmworld: Ścieżka edukacyjna z przewodnikiem - Bilet grupowy",
} as const;

// Pakiet 3w1, wszystkie atrakcje (K360 + MARS + FILMWORLD).
//
// UWAGA: w panelu Bookero NIE istnieje jedna pozycja „BILET NA WSZYSTKIE
// ATRAKCJE". Są CZTERY — po jednej na seans Kino 360 — bo pakiet zawiera
// konkretny seans. Wersja ulgowa leży w OSOBNEJ kategorii
// „Bilet indywidualny - ulgowy". Nazwy zweryfikowane 1:1 z listą usług
// pobraną z działającego widżetu.

export const ALL_ATTRACTIONS_FILM_BOOKING_SERVICES: Record<
  string,
  { normal: string; reduced: string }
> = {
  "one-step-beyond": {
    normal: "BILET NA WSZYSTKIE ATRAKCJE - One Step Beyond (119,00 zł)",
    reduced: "BILET NA WSZYSTKIE ATRAKCJE - One Step Beyond (99,00 zł)",
  },
  "the-stellars": {
    normal: "BILET NA WSZYSTKIE ATRAKCJE - The Stellars (119,00 zł)",
    reduced: "BILET NA WSZYSTKIE ATRAKCJE - The Stellars (99,00 zł)",
  },
  explore: {
    normal: "BILET NA WSZYSTKIE ATRAKCJE - Explore (119,00 zł)",
    reduced: "BILET NA WSZYSTKIE ATRAKCJE - Explore (99,00 zł)",
  },
  time: {
    normal: "BILET NA WSZYSTKIE ATRAKCJE - Time (119,00 zł)",
    reduced: "BILET NA WSZYSTKIE ATRAKCJE - Time (99,00 zł)",
  },
};

// Pakiet dla danego seansu K360; fallback na film aktualnie grany.
export function allAttractionsService(slug: string, reduced = false): string {
  const svc =
    ALL_ATTRACTIONS_FILM_BOOKING_SERVICES[slug] ??
    ALL_ATTRACTIONS_FILM_BOOKING_SERVICES[K360_DEFAULT_FILM_SLUG];
  return reduced ? svc.reduced : svc.normal;
}

// Alias zgodności — ogólne wejścia „pakiet" kierują na film grany.
export const ALL_ATTRACTIONS_BOOKING_SERVICES = {
  normal: allAttractionsService(K360_DEFAULT_FILM_SLUG),
  reduced: allAttractionsService(K360_DEFAULT_FILM_SLUG, true),
} as const;

// „Alvernia Planet EDU Days" — dni otwarte dla nauczycieli (27-28.08.2026).
// Bilet bezpłatny, w panelu Bookero pod kategorią „Bilet indywidualny".
// Nazwa MUSI być 1:1 z panelem — BookeroEmbed dopasowuje usługę po tekście
// (sufiks z ceną jest po obu stronach obcinany, więc „(0 zł)" nie przeszkadza).
export const TEACHER_OPEN_DAYS_BOOKING_SERVICE =
  "BILET NA WSZYSTKIE ATRAKCJE - Dla nauczycieli (0 zł)";

// Wydarzenie „Wieczór Filmożerców" (14–15.08.2026): 3 filmy w cenie 1, 49 zł.
// Ma WŁASNĄ usługę w panelu Bookero (kategoria „Bilet indywidualny"), która
// udostępnia tylko daty wydarzenia i sloty 18:00 / 20:00. Nazwa 1:1 z panelem.
export const FILM_NIGHT_BOOKING_SERVICE = "Noc Filmożerców (49,00 zł)";

// =====================================================================
// PRZEŁĄCZNIK SYSTEMU SPRZEDAŻY
//
// Serwis obsługuje DWA systemy biletowe. Wszystkie ~130 miejsc wywołania
// przechodzą przez buildBookingPath() / bookingHomeHref(), więc przejście
// między nimi to zmiana JEDNEJ stałej poniżej — nic więcej.
//
//   "bookero"  → linki wewnętrzne /rezerwuj?category=…&service=…
//                (widget osadzony na naszej stronie; deep linki pełne:
//                 kategoria, konkretna usługa, ilość, autopick, promoday)
//
//   "iksoris"  → linki zewnętrzne na bilety.alverniaplanet.com
//                (deep link wskazuje TYLKO atrakcję, parametrem idw)
//
// ⚠️ Przy powrocie na "iksoris" sprawdź, czy system nie zwraca HTTP 423
//    („Przerwa techniczna") — wtedy wszystkie przyciski zakupu prowadziłyby
//    do strony serwisowej. Pełna dokumentacja migracji i mapowania:
//    docs/system-sprzedazy.md
// =====================================================================


// ── IKSORIS ──────────────────────────────────────────────────────────
// Zweryfikowane linki z panelu (wrzesień 2026). NIE USUWAĆ — to jedyny
// zapis mapowania; odtworzenie go wymagałoby ponownego audytu panelu.

export const IKSORIS_BASE_URL = "https://bilety.alverniaplanet.com";

/** Identyfikatory atrakcji w Iksorisie (parametr `idw`). */
export const IKSORIS_ATTRACTION = {
  allAttractions: 1,
  k360: 2,
  filmworld: 3,
  mars: 4,
} as const;

/**
 * Język interfejsu Iksorisa.
 *
 * ⚠️ Iksoris obsługuje TYLKO polski i angielski. Zweryfikowane na żywo:
 *   ?lang=en → HTTP 200, <html lang="en">, tytuł „Welcome"
 *   ?lang=pt → HTTP 500  (trzy próby, stabilnie)
 *   ?lang=de → HTTP 500
 * Dlatego wersja portugalska serwisu kieruje na angielski interfejs kasy —
 * dla portugalskiego gościa angielski jest użyteczniejszy niż polski, a „pt"
 * wywaliłoby stronę błędem serwera.
 *
 * Polski jest domyślny, więc nie doklejamy parametru.
 */
function iksorisLang(locale: Locale): "pl" | "en" {
  return locale === "pl" ? "pl" : "en";
}

/** Dokleja ?lang=en / &lang=en, gdy interfejs ma być angielski. */
function zJezykiem(url: string, locale: Locale): string {
  if (iksorisLang(locale) === "pl") return url;
  return `${url}${url.includes("?") ? "&" : "?"}lang=en`;
}

function iksorisAttractionUrl(idw: number, locale: Locale): string {
  return zJezykiem(`${IKSORIS_BASE_URL}/rezerwacja/termin.html?idl=0&idg=0&idw=${idw}&d=3`, locale);
}

/** Strona startowa sprzedaży w Iksorisie (CTA bez wskazania atrakcji). */
export const IKSORIS_BOOKING_URL = IKSORIS_BASE_URL;

/** Strona startowa Iksorisa w języku pasującym do wersji serwisu. */
export function iksorisHomeUrl(locale: Locale): string {
  return iksorisLang(locale) === "pl"
    ? IKSORIS_BASE_URL
    : `${IKSORIS_BASE_URL}/index.html?lang=en`;
}

/**
 * Lista wydarzeń — `wydarzenie.html` bez `idw`, więc nie wskazuje atrakcji,
 * tylko pokazuje ofertę terminów. Parametr `d` wybiera zestaw wydarzeń.
 */
export function iksorisEventsUrl(d: number, locale: Locale = "pl"): string {
  return zJezykiem(`${IKSORIS_BASE_URL}/rezerwacja/wydarzenie.html?d=${d}`, locale);
}



/**
 * Rozpoznaje atrakcję po nazwie usługi z panelu Bookero.
 *
 * Kolejność testów ma znaczenie: „BILET NA WSZYSTKIE ATRAKCJE - One Step
 * Beyond" zawiera w sobie tytuł seansu Kino 360, więc pakiet MUSI być
 * sprawdzany pierwszy — inaczej trafiłby na idw=2 zamiast idw=1.
 *
 * Bilety bezpłatne (EDU Days) zwracają null: nazwa zaczyna się od „BILET NA
 * WSZYSTKIE ATRAKCJE", więc bez tego wyjątku nauczyciel z darmowego biletu
 * lądowałby w koszyku na 119 zł.
 *
 * null = brak odpowiednika → kierujemy na stronę główną sprzedaży.
 */
function iksorisAttractionFor(service?: string): number | null {
  if (!service) return null;
  const s = service.trim().toLowerCase();
  if (s.includes("dla nauczycieli")) return null;
  if (s.startsWith("bilet na wszystkie atrakcje")) return IKSORIS_ATTRACTION.allAttractions;
  if (s.startsWith("kino 360")) return IKSORIS_ATTRACTION.k360;
  if (s.startsWith("filmworld")) return IKSORIS_ATTRACTION.filmworld;
  if (s.startsWith("projekt: mars")) return IKSORIS_ATTRACTION.mars;
  return null;
}

// ── WSPÓLNE API (używane przez cały serwis) ──────────────────────────

/**
 * Deep link do konkretnego biletu. Sygnatura jest wspólna dla obu systemów —
 * Iksoris ignoruje quantity/autopick/promoDay, bo nie ma dla nich odpowiednika.
 */
export function buildBookingPath(
  locale: Locale,
  options?: {
    /** Nazwa usługi — po niej rozpoznajemy atrakcję w Iksorisie. */
    service?: string;
  },
) {
  const idw = iksorisAttractionFor(options?.service);
  return idw === null ? iksorisHomeUrl(locale) : iksorisAttractionUrl(idw, locale);
}

/**
 * Ogólne CTA „Kup bilet" — bez wskazania atrakcji (navbar, stopka, czat).
 * Pod Bookero zwraca ścieżkę WEWNĘTRZNĄ, więc renderuj to przez <BookingLink>,
 * który sam wybierze <Link> albo <a>.
 */
export function bookingHomeHref(locale: Locale): string {
  return iksorisHomeUrl(locale);
}

/** Miejsca, które zawsze otwierały zewnętrzny portal w nowej karcie. */
export function bookingPortalHref(locale: Locale = "pl"): string {
  return iksorisHomeUrl(locale);
}

/**
 * Główne CTA w hero na stronie głównej.
 * Iksoris: lista wydarzeń. Bookero: deep link na pakiet 3w1.
 */
export function heroBookingHref(locale: Locale): string {
  // Przycisk w hero jest celowo ogólny („KUP BILET"), więc wybór atrakcji
  // zostawiamy użytkownikowi — kierujemy na stronę startową sprzedaży.
  return iksorisHomeUrl(locale);
}

/**
 * CTA w hero na /grupy — ścieżka edukacyjna.
 * Iksoris: własna lista wydarzeń (d=4).
 * Bookero: deep link na Filmworld, który w panelu nazywa się teraz
 * „Filmworld: Ścieżka edukacyjna z przewodnikiem" — czyli dokładnie ten produkt.
 */
export function eduBookingHref(locale: Locale): string {
  return iksorisEventsUrl(4, locale);
}

