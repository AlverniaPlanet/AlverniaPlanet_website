import type { Locale } from "@/lib/localizedRoutes";

/* ---------------------------------------------------------------------------
   Dane strukturalne landing page'a /wydarzenia.

   ZASADA: nic tutaj nie jest wymyślone. Wszystkie parametry pochodzą z tablicy
   DOMES w page.tsx (te same liczby, tylko rozbite na „wielką liczbę + etykietę"
   zamiast zdania), a zdjęcia — z galerii projektu, gdzie mają opisane treści
   w src/app/galeria/galleryData.ts.
   --------------------------------------------------------------------------- */

export type DomeKey = "k3" | "k7" | "k10" | "k12";

export const EVENT_DOME_ORDER: DomeKey[] = ["k3", "k7", "k10", "k12"];

/* --- Parametry techniczne -------------------------------------------------
   Rozbicie bulletów z DOMES na kafelki „liczba + podpis". Indeksy bulletów,
   z których pochodzą (tablice są równoległe we wszystkich pięciu językach):
     K3  → 0 powierzchnia, 1 wysokość, 2 przyłącza, 5 bramy
     K7  → 0 ekran, 1 projektor, 3 fotele
     K10 → 1 powierzchnia   |   K12 → 1 powierzchnia
   Pozostałe bullety zostają cechami (patrz DOME_FEATURE_INDEXES).
   -------------------------------------------------------------------------- */

export type DomeMetric = { value: string; labelKey: MetricLabelKey; prefix?: boolean };

export type MetricLabelKey =
  | "area"
  | "height"
  | "power"
  | "gates"
  | "projection"
  | "projector"
  | "seats"
  | "levels";

/** Zapis liczb różni się między językami (separator tysięcy i przecinek dziesiętny). */
const METRIC_VALUES: Record<Locale, Record<string, string>> = {
  pl: { area2000: "2 000 m²", h15: "15 m", mw1: "1 MW", gates: "4 × 4,5 m", screen: "10,2 × 4,2 m", proj: "4K", seats: "76", area600: "600 m²", levels: "2" },
  en: { area2000: "2,000 m²", h15: "15 m", mw1: "1 MW", gates: "4 × 4.5 m", screen: "10.2 × 4.2 m", proj: "4K", seats: "76", area600: "600 m²", levels: "2" },
  pt: { area2000: "2 000 m²", h15: "15 m", mw1: "1 MW", gates: "4 × 4,5 m", screen: "10,2 × 4,2 m", proj: "4K", seats: "76", area600: "600 m²", levels: "2" },
  de: { area2000: "2.000 m²", h15: "15 m", mw1: "1 MW", gates: "4 × 4,5 m", screen: "10,2 × 4,2 m", proj: "4K", seats: "76", area600: "600 m²", levels: "2" },
  zh: { area2000: "2,000 m²", h15: "15 m", mw1: "1 MW", gates: "4 × 4.5 m", screen: "10.2 × 4.2 m", proj: "4K", seats: "76", area600: "600 m²", levels: "2" },
};

const METRIC_SHAPE: Record<DomeKey, { key: string; labelKey: MetricLabelKey; prefix?: boolean }[]> = {
  k3: [
    { key: "area2000", labelKey: "area" },
    { key: "h15", labelKey: "height" },
    { key: "mw1", labelKey: "power", prefix: true },
    { key: "gates", labelKey: "gates" },
  ],
  k7: [
    { key: "screen", labelKey: "projection" },
    { key: "proj", labelKey: "projector" },
    { key: "seats", labelKey: "seats" },
  ],
  k10: [
    { key: "area600", labelKey: "area" },
    { key: "levels", labelKey: "levels" },
  ],
  k12: [
    { key: "area600", labelKey: "area" },
    { key: "levels", labelKey: "levels" },
  ],
};

export function domeMetrics(dome: DomeKey, locale: Locale): DomeMetric[] {
  const values = METRIC_VALUES[locale] ?? METRIC_VALUES.pl;
  return METRIC_SHAPE[dome].map((m) => ({
    value: values[m.key],
    labelKey: m.labelKey,
    prefix: m.prefix,
  }));
}

/** Które bullety z DOMES zostają jako „wyposażenie i możliwości" (reszta poszła w metryki). */
export const DOME_FEATURE_INDEXES: Record<DomeKey, number[]> = {
  k3: [3, 4, 6],
  k7: [2],
  k10: [0],
  k12: [0],
};

export const METRIC_LABELS: Record<Locale, Record<MetricLabelKey, string>> = {
  pl: { area: "Powierzchnia", height: "Wysokość", power: "Zasilanie", gates: "Bramy", projection: "Ekran", projector: "Projektor", seats: "Fotele", levels: "Poziomy" },
  en: { area: "Floor area", height: "Height", power: "Power", gates: "Gates", projection: "Screen", projector: "Projector", seats: "Seats", levels: "Levels" },
  pt: { area: "Área", height: "Altura", power: "Energia", gates: "Portões", projection: "Ecrã", projector: "Projetor", seats: "Lugares", levels: "Pisos" },
  de: { area: "Fläche", height: "Höhe", power: "Strom", gates: "Tore", projection: "Leinwand", projector: "Projektor", seats: "Sitzplätze", levels: "Ebenen" },
  zh: { area: "面积", height: "高度", power: "电力接入", gates: "大门", projection: "银幕", projector: "放映机", seats: "座位", levels: "楼层" },
};

/** „do 1 MW" — przedrostek przy wartościach będących górną granicą. */
export const UP_TO_LABEL: Record<Locale, string> = {
  pl: "do",
  en: "up to",
  pt: "até",
  de: "bis zu",
  zh: "最高",
};

/* --- Formaty wydarzeń -----------------------------------------------------
   Zdjęcia z galerii „Wydarzenia", ale w osobnych kopiach przyciętych do 900 px
   (public/wydarzenia/formaty/): karta pokazuje je w ok. 370 px, a oryginały
   z galerii mają 1600 px i ważą 3× tyle. Oryginałów nie ruszamy, bo galeria
   wyświetla je w pełnej rozdzielczości. W komentarzu podpis z galleryData.ts,
   żeby było widać, że kadr faktycznie pokazuje to, co obiecuje kafelek.
   -------------------------------------------------------------------------- */

export type FormatCategory = { id: string; image: string; /** podpis z galerii */ caption: string };

export const FORMAT_CATEGORIES: FormatCategory[] = [
  { id: "gala", image: "/wydarzenia/formaty/gala.webp", caption: "Gala w kopule" },
  { id: "conference", image: "/wydarzenia/formaty/konferencje.webp", caption: "Konferencja w kopule" },
  { id: "concert", image: "/wydarzenia/formaty/koncerty.webp", caption: "Plan eventu i scena" },
  { id: "launch", image: "/wydarzenia/formaty/premiery.webp", caption: "Pokaz w kopule z autoshow" },
  { id: "corporate", image: "/wydarzenia/formaty/firmowe.webp", caption: "Strefa networkingowa" },
  { id: "expo", image: "/wydarzenia/formaty/targi.webp", caption: "Strefa atrakcji na scenie" },
];

/** Zdjęcia towarzyszące sekcjom — również z galerii projektu. */
export const EDITORIAL_IMAGES = {
  banquet: "/galeria/Wydarzenia/webp/3.webp", // „Bankiet w K9"
  catering: "/galeria/Wydarzenia/webp/6.webp", // „Catering live"
};

export const DOME_IMAGE_BY_KEY: Record<DomeKey, string> = {
  k3: "/wydarzenia/dome-k3-thumb.webp",
  k7: "/wydarzenia/dome-k7-thumb.webp",
  k10: "/wydarzenia/dome-k10k12-thumb.webp",
  k12: "/wydarzenia/dome-k10k12-thumb.webp",
};

/* --- „Zaufali nam" --------------------------------------------------------
   Logotypy firm, które zorganizowały wydarzenie w Alvernia Planet.

   JAK DODAĆ: wrzuć plik (PNG z przezroczystym tłem albo SVG) do
   public/wydarzenia/zaufali/ i dopisz tu pozycję. `alt` to nazwa firmy —
   czytnik ekranu przeczyta właśnie ją. `width` i `height` to naturalne wymiary
   pliku w pikselach; pasek liczy z nich proporcje, więc logotyp nie skacze,
   zanim się wczyta (sprawdzisz je poleceniem `sips -g pixelWidth -g pixelHeight`
   albo w podglądzie pliku).

   Dopóki lista jest pusta, sekcja w ogóle się nie renderuje — strona wygląda
   dokładnie tak jak dziś. */
export type TrustedLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** „white" — znak na biało (dla logotypów, które na czerni by zniknęły),
      „color" — własne barwy. Domyślnie „white". */
  tone?: "white" | "color";
  /** Korekta wysokości względem reszty paska: kwadratowy znak przy tej samej
      wysokości co szeroki napis wygląda na wyraźnie mniejszy. */
  scale?: number;
};

export const TRUSTED_LOGOS: TrustedLogo[] = [
  { src: "/wydarzenia/zaufali/netflix.webp", alt: "Netflix", width: 460, height: 125 },
  { src: "/wydarzenia/zaufali/warner-bros.webp", alt: "Warner Bros.", width: 158, height: 160, scale: 1.85 },
  { src: "/wydarzenia/zaufali/karcher.webp", alt: "Kärcher", width: 460, height: 119 },
  { src: "/wydarzenia/zaufali/runmageddon.webp", alt: "Runmageddon", width: 460, height: 60, scale: 0.72 },
  { src: "/wydarzenia/zaufali/eurovia.webp", alt: "Eurovia", width: 460, height: 100 },
  { src: "/wydarzenia/zaufali/pln-networking.webp", alt: "PLN — Professional Local Networking", width: 460, height: 128 },
  { src: "/wydarzenia/zaufali/creative-poland.png", alt: "Creative Poland", width: 621, height: 240 },
  { src: "/wydarzenia/zaufali/ekipa.webp", alt: "Ekipa", width: 460, height: 148 },
];
