import { getBookingPath, type Locale } from "@/lib/localizedRoutes";

export const BOOKING_CATEGORY_PARAM = "category";
export const BOOKING_SERVICE_PARAM = "service";
export const BOOKING_QUANTITY_PARAM = "quantity";

export const CINEMA_360_BOOKING_CATEGORY = "Kino 360°";
export const CINEMA_360_BOOKING_SERVICES = {
  normal: "Bilet normalny: Kino 360° (49,00 zł)",
  reduced: "Bilet ulgowy: Kino 360° (39,00 zł)",
} as const;

export const FILM_PATH_BOOKING_CATEGORY = "Ścieżka filmowa";
export const FILM_PATH_BOOKING_SERVICES = {
  normal: "Bilet normalny: Ścieżka filmowa (69,00 zł)",
  group: "Bilet grupowy: Ścieżka filmowa (2070,00 zł)",
} as const;

export function buildBookingPath(
  locale: Locale,
  options?: {
    category?: string;
    service?: string;
    quantity?: number;
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

  const basePath = getBookingPath(locale);
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
