import { getBookingPath, type Locale } from "@/lib/localizedRoutes";

export const BOOKING_CATEGORY_PARAM = "category";
export const BOOKING_SERVICE_PARAM = "service";
export const BOOKING_QUANTITY_PARAM = "quantity";
export const BOOKING_AUTOPICK_PARAM = "autopick";

// W panelu Bookero wszystkie bilety indywidualne (na każdą atrakcję osobno
// + pakiet 3w1) są pod jedną kategorią "Bilet indywidualny". Bilety grupowe
// są pod osobną kategorią "Bilet grupowy".
export const INDIVIDUAL_BOOKING_CATEGORY = "Bilet indywidualny";
export const GROUP_BOOKING_CATEGORY = "Bilet grupowy";

// Aliasy używane przez stronę głównej i podstrony atrakcji, wszystkie
// trafiają do tej samej kategorii "Bilet indywidualny" w panelu Bookero,
// a o konkretny bilet decyduje wybrana usługa (service).
export const K360_BOOKING_CATEGORY = INDIVIDUAL_BOOKING_CATEGORY;
export const MARS_BOOKING_CATEGORY = INDIVIDUAL_BOOKING_CATEGORY;
export const FILM_PATH_BOOKING_CATEGORY = INDIVIDUAL_BOOKING_CATEGORY;
export const ALL_ATTRACTIONS_BOOKING_CATEGORY = INDIVIDUAL_BOOKING_CATEGORY;

// Stare promo-pakiety (K360 + MARS, K360 + Ścieżka) zostały zastąpione przez
// jeden bilet "BILET NA WSZYSTKIE ATRAKCJE". Te eksporty zostają, żeby nie
// łamać starych referencji, kierują do nowej, zastępczej kategorii.
export const COMBINED_PROMO_BOOKING_CATEGORY = INDIVIDUAL_BOOKING_CATEGORY;
export const K360_MARS_PROMO_BOOKING_CATEGORY = INDIVIDUAL_BOOKING_CATEGORY;

// Pakiet przedpremierowy K360 + Projekt: MARS (weekend 23–24.05.2026),
// promocja już wygasła (FloatingDemoPromo nie pokazuje się po 25.05.2026),
// więc te stałe są nieaktywne; zostawiam aliasy żeby kompilacja działała.
export const K360_MARS_PREMIERE_BOOKING_CATEGORY = INDIVIDUAL_BOOKING_CATEGORY;
export const K360_MARS_PREMIERE_BOOKING_SERVICES = {
  normal: "BILET NA WSZYSTKIE ATRAKCJE (119,00 zł)",
  reduced: "BILET ULGOWY NA WSZYSTKIE ATRAKCJE (99,00 zł)",
} as const;

// =====================================================================
// Usługi (services): dokładne nazwy z panelu Bookero, w tym wielkość
// liter i znak stopnia (°). Normalizator w BookeroEmbed dopasuje fuzzy,
// ale lepiej trzymać 1:1 z panelem.
// =====================================================================

// Etykiety dokładnie jak w panelu Bookero (nazwa atrakcji najpierw, myślnik, typ
// biletu). BookeroEmbed dopasowuje usługę przez równość po normalizacji, więc
// kolejność słów musi się zgadzać 1:1.
export const K360_BOOKING_SERVICES = {
  normal: "Kino 360° - Bilet normalny (49,00 zł)",
  reduced: "Kino 360° - Bilet ulgowy (39,00 zł)",
  // ⚠️ Bilet grupowy K360 jest pod kategorią "Bilet grupowy" w panelu Bookero.
  //    zweryfikuj dokładną nazwę usługi jeśli będzie używana.
  group: "Kino 360° - Bilet grupowy (39,00 zł)",
} as const;

export const MARS_BOOKING_SERVICES = {
  normal: "Bilet normalny: Projekt: MARS (69,00 zł)",
  reduced: "Bilet ulgowy: Projekt: MARS (59,00 zł)",
  // ⚠️ Bilet grupowy MARS jest pod kategorią "Bilet grupowy" w panelu Bookero.
  //    zweryfikuj dokładną nazwę usługi jeśli będzie używana.
  group: "Bilet grupowy: Projekt: MARS (59,00 zł)",
} as const;

export const FILM_PATH_BOOKING_SERVICES = {
  normal: "Bilet normalny: Ścieżka filmowa (79,00 zł)",
  reduced: "Bilet ulgowy: Ścieżka filmowa (69,00 zł)",
  // ⚠️ Bilet grupowy Ścieżka filmowa jest pod kategorią "Bilet grupowy".
  //    zweryfikuj dokładną nazwę usługi jeśli będzie używana.
  group: "Bilet grupowy: Ścieżka filmowa (2070,00 zł)",
} as const;

// Pakiet 3w1, wszystkie atrakcje (K360 + MARS + Ścieżka). Nazwy z panelu
// Bookero są wielkimi literami.
export const ALL_ATTRACTIONS_BOOKING_SERVICES = {
  normal: "BILET NA WSZYSTKIE ATRAKCJE (119,00 zł)",
  reduced: "BILET ULGOWY NA WSZYSTKIE ATRAKCJE (99,00 zł)",
} as const;

export function buildBookingPath(
  locale: Locale,
  options?: {
    category?: string;
    service?: string;
    quantity?: number;
    autopick?: boolean;
  },
) {
  const params = new URLSearchParams();

  if (options?.category) {
    params.set(BOOKING_CATEGORY_PARAM, options.category);
  }

  if (options?.service) {
    params.set(BOOKING_SERVICE_PARAM, options.service);
  }

  if (typeof options?.quantity === "number" && Number.isFinite(options.quantity)) {
    params.set(BOOKING_QUANTITY_PARAM, String(options.quantity));
  }

  if (options?.autopick) {
    params.set(BOOKING_AUTOPICK_PARAM, "1");
  }

  const basePath = getBookingPath(locale);
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
