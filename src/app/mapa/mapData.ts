// Dane mapy interaktywnej: pozycje kopuł w układzie współrzędnych obrazu
// /public/mapa_wycieczki.png (1393 x 1129 px). Współrzędne (x, y) to środek
// kopuły, r to promień strefy klikalnej. Wszystko w pikselach obrazu.

export const MAP_WIDTH = 1393;
export const MAP_HEIGHT = 1129;
export const MAP_SRC = "/mapa_wycieczki.png";

export type Kopula = {
  id: string;
  x: number;
  y: number;
  r: number;
  /** Numer przystanku na trasie (jeśli kopuła jest częścią zwiedzania). */
  stop?: number;
  /** Etykieta przystanku, np. "Start" / "Wyjście". */
  stopLabel?: string;
  title: string;
  desc: string;
};

export const KOPULY: Kopula[] = [
  {
    id: "K5",
    x: 420,
    y: 661,
    r: 40,
    stop: 1,
    stopLabel: "Start",
    title: "Kopuła K5: Strefa startowa",
    desc:
      "Tutaj rozpoczyna się przygoda. Grupa zbiera się przed wejściem, odbiera bilety i wita się z przewodnikiem. To miejsce zbiórki przed wyruszeniem w głąb Alvernia Planet.",
  },
  {
    id: "K6",
    x: 455,
    y: 757,
    r: 37,
    stop: 1,
    stopLabel: "Start",
    title: "Kopuła K6: Strefa startowa",
    desc:
      "Druga kopuła punktu startowego. Tu odbywa się krótkie wprowadzenie i instruktaż bezpieczeństwa przed rozpoczęciem zwiedzania.",
  },
  {
    id: "K9",
    x: 580,
    y: 690,
    r: 77,
    stop: 2,
    title: "Kopuła K9",
    desc:
      "Pierwszy przystanek właściwego zwiedzania. Miejsce na opowieść o historii i idei Alvernia Planet. (Treść do uzupełnienia.)",
  },
  {
    id: "K7",
    x: 665,
    y: 535,
    r: 66,
    stop: 3,
    title: "Kopuła K7",
    desc:
      "Kolejny etap trasy. Tu prezentowana jest jedna z głównych atrakcji kompleksu. (Treść do uzupełnienia.)",
  },
  {
    id: "K1",
    x: 677,
    y: 361,
    r: 67,
    stop: 4,
    title: "Kopuła K1",
    desc:
      "Centralny punkt zwiedzania. Miejsce o szczególnym znaczeniu na trasie wycieczki. (Treść do uzupełnienia.)",
  },
  {
    id: "K2",
    x: 820,
    y: 685,
    r: 60,
    stop: 5,
    title: "Kopuła K2",
    desc:
      "Jedna z największych kopuł kompleksu. Przestrzeń pokazowa z głównym wydarzeniem zwiedzania. (Treść do uzupełnienia.)",
  },
  {
    id: "K11",
    x: 864,
    y: 390,
    r: 58,
    stop: 6,
    title: "Kopuła K11",
    desc:
      "Ostatnia kopuła na trasie zwiedzania. Stąd grupa kieruje się łącznikiem w stronę wyjścia. (Treść do uzupełnienia.)",
  },
  // --- Kopuły poza trasą (klikalne, z opisem) ---
  {
    id: "K3",
    x: 766,
    y: 140,
    r: 98,
    title: "Kopuła K3",
    desc: "Kopuła poza trasą zwiedzania. (Treść do uzupełnienia.)",
  },
  {
    id: "K4",
    x: 1070,
    y: 236,
    r: 122,
    title: "Kopuła K4",
    desc:
      "Największa kopuła kompleksu. Łącznik między K11 a K4 stanowi wyjście z trasy zwiedzania. (Treść do uzupełnienia.)",
  },
  {
    id: "K8",
    x: 488,
    y: 474,
    r: 84,
    title: "Kopuła K8",
    desc: "Kopuła poza trasą zwiedzania. (Treść do uzupełnienia.)",
  },
  {
    id: "K10",
    x: 1045,
    y: 497,
    r: 70,
    title: "Kopuła K10",
    desc: "Kopuła poza trasą zwiedzania. (Treść do uzupełnienia.)",
  },
  {
    id: "K12",
    x: 989,
    y: 666,
    r: 70,
    title: "Kopuła K12",
    desc: "Kopuła poza trasą zwiedzania. (Treść do uzupełnienia.)",
  },
  {
    id: "K13",
    x: 390,
    y: 316,
    r: 52,
    title: "Kopuła K13",
    desc: "Kopuła poza trasą zwiedzania. (Treść do uzupełnienia.)",
  },
  {
    id: "K14",
    x: 390,
    y: 395,
    r: 52,
    title: "Kopuła K14",
    desc: "Kopuła poza trasą zwiedzania. (Treść do uzupełnienia.)",
  },
];

// Kolejność punktów łamanej trasy. Start łączy obie kopuły K5 i K6 z K9.
// Trasa: K5/K6 -> K9 -> K7 -> K1 -> K2 -> K11 -> łącznik K11/K4 (wyjście).
const at = (id: string) => {
  const k = KOPULY.find((x) => x.id === id)!;
  return [k.x, k.y] as const;
};

// Trasa: K5/K6 -> K9 -> K7 -> K1 -> K2 -> K11 -> łącznik K11/K4 (wyjście).
// Rurka z K1 do K2 wygina się lekko w prawo, przez centralny węzeł (WEZEL),
// a nie idzie prostą linią (która szłaby obok rurki, przez ciemną szczelinę).
export const WEZEL: readonly [number, number] = [820, 580];

// Punkt oznaczenia wyjścia (mniej więcej w połowie łącznika K11 -> K4).
export const EXIT_POINT: readonly [number, number] = [
  (878 + 1060) / 2,
  (395 + 320) / 2,
];

export const ROUTE_SEGMENTS: Array<Array<readonly [number, number]>> = [
  [at("K5"), at("K9")],
  [at("K6"), at("K9")],
  [at("K9"), at("K7")],
  [at("K7"), at("K1")],
  [at("K1"), WEZEL, at("K2")],
  [at("K2"), WEZEL, at("K11")],
  // ostatni odcinek kończy się na wyjściu (łącznik K11 -> K4), nie w K4
  [at("K11"), EXIT_POINT],
];
