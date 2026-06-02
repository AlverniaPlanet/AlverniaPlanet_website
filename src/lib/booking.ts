import { getBookingPath, type Locale } from "@/lib/localizedRoutes";

export const BOOKING_CATEGORY_PARAM = "category";
export const BOOKING_SERVICE_PARAM = "service";
export const BOOKING_QUANTITY_PARAM = "quantity";
export const BOOKING_AUTOPICK_PARAM = "autopick";

export const K360_BOOKING_CATEGORY = "K360° projekcja";
export const COMBINED_PROMO_BOOKING_CATEGORY = "Promocja: K360 + Ścieżka";
export const K360_MARS_PROMO_BOOKING_CATEGORY = "Promocja: K360 + Projekt: MARS";
// Pakiet przedpremierowy K360 + Projekt: MARS (weekend 23–24.05.2026).
export const K360_MARS_PREMIERE_BOOKING_CATEGORY =
  "Promocja: K360 + Projekt: MARS - Przedpremierowy";
export const K360_MARS_PREMIERE_BOOKING_SERVICES = {
  normal: "Bilet promocyjny normalny: K360 + Projekt: MARS - Przedpremierowy (74,00 zł)",
  reduced: "Bilet promocyjny ulgowy: K360 + Projekt: MARS - Przedpremierowy (64,00 zł)",
} as const;
export const K360_BOOKING_SERVICES = {
  normal: "Bilet normalny: K360 Projekcja (49,00 zł)",
  reduced: "Bilet ulgowy: K360 Projekcja (39,00 zł)",
  group: "Bilet grupowy: K360 Projekcja (39,00 zł)",
} as const;

export const MARS_BOOKING_CATEGORY = "Projekt: MARS";
export const MARS_BOOKING_SERVICES = {
  normal: "Bilet normalny: Projekt: MARS (69,00 zł)",
  reduced: "Bilet ulgowy: Projekt: MARS (59,00 zł)",
  group: "Bilet grupowy: Projekt: MARS (59,00 zł)",
} as const;

export const FILM_PATH_BOOKING_CATEGORY = "Ścieżka filmowa";
export const FILM_PATH_BOOKING_SERVICES = {
  normal: "Bilet normalny: Ścieżka filmowa (79,00 zł)",
  reduced: "Bilet ulgowy: Ścieżka filmowa (69,00 zł)",
  group: "Bilet grupowy: Ścieżka filmowa (2070,00 zł)",
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
