// src/theme/tokens.ts
export type Category = "kino360" | "sciezka" | "ogolne";

/** Kolory marki (jedno źródło prawdy) */
export const COLORS = {
  // ogólne
  blue: "#38BDF8",        // np. data
  blueHover: "#0EA5E9",
  bookingYellow: "#F59E0B",

  // kategorie
  cat: {
    kino: "#0284C7",      // ciemniejszy niebieski
    sciezka: "#7C3AED",   // fiolet
    ogolne: "#6B7280",    // szary
  },
} as const;

/** Krótki helper do sklejania klas */
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/** Baza dla pigułki (badge) */
export const pillBase =
  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 " +
  "text-[12px] font-semibold leading-tight text-white ring-1 ring-white/10";

/** Klasy pigułek dla kategorii (gotowiec) */
export const CATEGORY_PILL: Record<Category, string> = {
  kino360:  cx(pillBase, "shadow-[0_0_16px_rgba(2,132,199,.35)]",  "bg-[color:var(--ap-cat-kino,#0284C7)]"),
  sciezka:  cx(pillBase, "shadow-[0_0_16px_rgba(124,58,237,.35)]", "bg-[color:var(--ap-cat-sciezka,#7C3AED)]"),
  ogolne:   cx(pillBase, "shadow-[0_0_12px_rgba(107,114,128,.25)]","bg-[color:var(--ap-cat-ogolne,#6B7280)]"),
};

/** Pigułka z datą */
export const DATE_PILL =
  "inline-flex items-center whitespace-nowrap rounded-full " +
  "bg-[color:var(--ap-blue,#38BDF8)] hover:bg-[color:var(--ap-blueHover,#0EA5E9)] " +
  "px-3 py-1 text-[12px] font-semibold leading-tight text-white ring-1 ring-white/10";

/** Klasy do przycisku 'Rezerwuj' (opcjonalnie) */
export const BOOKING_BTN =
  "inline-flex items-center gap-2 rounded-full bg-[color:var(--ap-booking,#F59E0B)] " +
  "text-black hover:brightness-110 px-4 py-2 text-sm font-semibold";