import type { Locale } from "@/lib/localizedRoutes";

export const VR_DOME_ORDER = [
  "k1",
  "k2-recepcja",
  "k3",
  "k4",
  "k5",
  "k6",
  "k7",
  "k8",
  "k9",
  "k10",
  "k11",
  "k12",
  "k13",
  "laboratorium",
  "silos",
  "taras",
  "warsztaty",
  "lacznik",
] as const;

export type VrDomeKey = (typeof VR_DOME_ORDER)[number];

export type DomeVrScene = {
  id: string;
  title: string;
  src: string;
  initialYaw?: number;
};

export const VR_DOME_TITLES: Record<Locale, Record<VrDomeKey, string>> = {
  pl: {
    k1: "K01",
    "k2-recepcja": "K02 · Recepcja",
    k3: "K03",
    k4: "K04",
    k5: "K05",
    k6: "K06",
    k7: "K07",
    k8: "K08",
    k9: "K09",
    k10: "K10",
    k11: "K11",
    k12: "K12",
    k13: "K13",
    laboratorium: "Laboratorium",
    silos: "Silosy",
    taras: "Taras",
    warsztaty: "Warsztaty",
    lacznik: "Łącznik",
  },
  en: {
    k1: "K01",
    "k2-recepcja": "K02 · Reception",
    k3: "K03",
    k4: "K04",
    k5: "K05",
    k6: "K06",
    k7: "K07",
    k8: "K08",
    k9: "K09",
    k10: "K10",
    k11: "K11",
    k12: "K12",
    k13: "K13",
    laboratorium: "Laboratory",
    silos: "Silos",
    taras: "Terrace",
    warsztaty: "Workshops",
    lacznik: "Connector",
  },
  pt: {
    k1: "K01",
    "k2-recepcja": "K02 · Receção",
    k3: "K03",
    k4: "K04",
    k5: "K05",
    k6: "K06",
    k7: "K07",
    k8: "K08",
    k9: "K09",
    k10: "K10",
    k11: "K11",
    k12: "K12",
    k13: "K13",
    laboratorium: "Laboratório",
    silos: "Silos",
    taras: "Terraço",
    warsztaty: "Oficinas",
    lacznik: "Ligação",
  },
};

export const DOME_VR_SCENES_BY_KEY: Record<VrDomeKey, DomeVrScene[]> = {
  k1: [
    {
      id: "k1-1",
      title: "K01 · 01",
      src: "/Alvernia VR/K01_PIC_2017_10_15_02_24_50_20171015051715.jpg",
      initialYaw: 48,
    },
    {
      id: "k1-2",
      title: "K01 · 02",
      src: "/Alvernia VR/K01_PIC_2017_10_15_13_31_30_20171015145032.jpg",
      initialYaw: 54,
    },
  ],
  "k2-recepcja": [
    {
      id: "k2-1",
      title: "K02 · Recepcja",
      src: "/Alvernia VR/K02_Recepcja_PIC_2017_10_15_12_58_45_20171015145007.jpg",
      initialYaw: 50,
    },
  ],
  k3: [
    {
      id: "k3-1",
      title: "K03 · 01",
      src: "/Alvernia VR/K03_PIC_2017_10_14_21_57_24_20171014221828.jpg",
      initialYaw: 48,
    },
    {
      id: "k3-2",
      title: "K03 · 02",
      src: "/Alvernia VR/K03_PIC_2017_10_14_22_43_37_20171015105733.jpg",
      initialYaw: 54,
    },
  ],
  k4: [
    {
      id: "k4-1",
      title: "K04 · 01",
      src: "/Alvernia VR/K04_PIC_2017_10_14_23_01_08_20171015112456.jpg",
      initialYaw: 52,
    },
  ],
  k5: [
    {
      id: "k5-1",
      title: "K05 · 01",
      src: "/Alvernia VR/K05_PIC_2017_10_15_13_18_52_20171015145032.jpg",
      initialYaw: 50,
    },
  ],
  k6: [
    {
      id: "k6-1",
      title: "K06 · 01",
      src: "/Alvernia VR/K06_PIC_2017_10_15_13_10_26_20171015145032.jpg",
      initialYaw: 50,
    },
  ],
  k7: [
    {
      id: "k7-1",
      title: "K07 · 01",
      src: "/Alvernia VR/K07_PIC_2017_10_15_02_01_19_20171015101723.jpg",
      initialYaw: 50,
    },
    {
      id: "k7-2",
      title: "K07 · 02",
      src: "/Alvernia VR/K07_PIC_2017_10_15_02_07_54_20171018191514.jpg",
      initialYaw: 50,
    },
    {
      id: "k7-3",
      title: "K07 · 03",
      src: "/Alvernia VR/K07_PIC_2017_10_15_02_12_39_20171015051715.jpg",
      initialYaw: 50,
    },
  ],
  k8: [
    {
      id: "k8-1",
      title: "K08 · 01",
      src: "/Alvernia VR/K08_PIC_2017_10_15_03_10_45_20171015051715.jpg",
      initialYaw: 50,
    },
  ],
  k9: [
    {
      id: "k9-1",
      title: "K09 · 01",
      src: "/Alvernia VR/K09_PIC_2017_10_15_00_47_34_20171015051715.jpg",
      initialYaw: 48,
    },
    {
      id: "k9-2",
      title: "K09 · 02",
      src: "/Alvernia VR/K09_PIC_2017_10_15_01_04_07_20171018180144.jpg",
      initialYaw: 54,
    },
  ],
  k10: [
    {
      id: "k10-1",
      title: "K10 · 01",
      src: "/Alvernia VR/K10_PIC_2017_10_14_23_47_39_20171015114654.jpg",
      initialYaw: 48,
    },
  ],
  k11: [
    {
      id: "k11-1",
      title: "K11 · 01",
      src: "/Alvernia VR/K11_PIC_2017_10_15_12_31_22_20171015151818.jpg",
      initialYaw: 50,
    },
    {
      id: "k11-2",
      title: "K11 · 02",
      src: "/Alvernia VR/K11_PIC_2017_10_15_12_38_35_20171015152347_20171015152547.jpg",
      initialYaw: 55,
    },
  ],
  k12: [
    {
      id: "k12-1",
      title: "K12 · 01",
      src: "/Alvernia VR/K12_PIC_2017_10_15_00_01_43_20171015051715.jpg",
      initialYaw: 52,
    },
  ],
  k13: [
    {
      id: "k13-1",
      title: "K13 · 01",
      src: "/Alvernia VR/K13_PIC_2017_10_15_03_28_51_20171015101325.jpg",
      initialYaw: 50,
    },
  ],
  laboratorium: [
    {
      id: "laboratorium-1",
      title: "Laboratorium · 01",
      src: "/Alvernia VR/Laboratorium_PIC_2017_10_15_04_41_47_20171015114041.jpg",
      initialYaw: 50,
    },
  ],
  silos: [
    {
      id: "silos-1",
      title: "Silos · 01",
      src: "/Alvernia VR/Silos_PIC_2017_10_15_04_06_44_20171015113251.jpg",
      initialYaw: 49,
    },
    {
      id: "silos-2",
      title: "Silos · 02",
      src: "/Alvernia VR/Silos_PIC_2017_10_15_04_24_52_20171015051715.jpg",
      initialYaw: 53,
    },
  ],
  taras: [
    {
      id: "taras-1",
      title: "Taras · 01",
      src: "/Alvernia VR/Taras_PIC_2017_10_15_12_16_56_20171018192450.jpg",
      initialYaw: 50,
    },
  ],
  warsztaty: [
    {
      id: "warsztaty-1",
      title: "Warsztaty · 01",
      src: "/Alvernia VR/Warsztaty_PIC_2017_10_14_23_08_23_20171015112844.jpg",
      initialYaw: 50,
    },
  ],
  lacznik: [
    {
      id: "lacznik-1",
      title: "Łącznik · 01",
      src: "/Alvernia VR/Łącznik_PIC_2017_10_15_13_24_38_20171015145032.jpg",
      initialYaw: 50,
    },
  ],
};

export const VR_UI: Record<
  Locale,
  {
    label: string;
    intro: string;
    openCta: string;
    sceneCount: (count: number) => string;
    pageKicker: string;
    pageTitle: string;
    pageIntro: string;
    backToEvents: string;
    hint: string;
    scenesLabel: string;
    previousLabel: string;
    nextLabel: string;
    emptyLabel: string;
    catalogLabel: string;
  }
> = {
  pl: {
    label: "Spacery 360°",
    intro: "Przejdź do osobnego widoku panoram i rozejrzyj się po wnętrzu kopuły ruchem myszy albo przeciągnięciem.",
    openCta: "Otwórz panoramy 360°",
    sceneCount: (count) => `${count} ${count === 1 ? "panorama" : count < 5 ? "panoramy" : "panoram"}`,
    pageKicker: "Panoramy 360°",
    pageTitle: "Wirtualny spacer po kopułach",
    pageIntro: "Porusz myszką na boki albo przeciągnij obraz, aby rozglądać się po wnętrzu. Na tej stronie znajdziesz wszystkie panoramy dostępne w archiwum VR Alvernia Planet.",
    backToEvents: "Powrót do wydarzeń",
    hint: "Rozglądaj się ruchem myszy lub przeciąganiem.",
    scenesLabel: "Dostępne panoramy",
    previousLabel: "Poprzednia panorama",
    nextLabel: "Następna panorama",
    emptyLabel: "Brak panoram dla tej kopuły.",
    catalogLabel: "Wszystkie przestrzenie VR",
  },
  en: {
    label: "360° tours",
    intro: "Open a dedicated panorama view and look around the interior by moving your mouse or dragging.",
    openCta: "Open 360° panoramas",
    sceneCount: (count) => `${count} panorama${count === 1 ? "" : "s"}`,
    pageKicker: "360° panoramas",
    pageTitle: "Virtual dome tour",
    pageIntro: "Move your mouse sideways or drag the image to look around the interior. This page gathers every panorama currently available in the Alvernia Planet VR archive.",
    backToEvents: "Back to events",
    hint: "Look around with your mouse or by dragging.",
    scenesLabel: "Available panoramas",
    previousLabel: "Previous panorama",
    nextLabel: "Next panorama",
    emptyLabel: "No panoramas available for this dome.",
    catalogLabel: "All VR spaces",
  },
  pt: {
    label: "Visitas 360°",
    intro: "Abra uma vista panorâmica dedicada e explore o interior movendo o rato ou arrastando.",
    openCta: "Abrir panorâmicas 360°",
    sceneCount: (count) => `${count} panorâmica${count === 1 ? "" : "s"}`,
    pageKicker: "Panorâmicas 360°",
    pageTitle: "Passeio virtual pelas cúpulas",
    pageIntro: "Mova o rato para os lados ou arraste a imagem para explorar o interior. Esta página reúne todas as panorâmicas atualmente disponíveis no arquivo VR da Alvernia Planet.",
    backToEvents: "Voltar aos eventos",
    hint: "Explore com o rato ou arrastando.",
    scenesLabel: "Panorâmicas disponíveis",
    previousLabel: "Panorâmica anterior",
    nextLabel: "Panorâmica seguinte",
    emptyLabel: "Não existem panorâmicas para esta cúpula.",
    catalogLabel: "Todos os espaços VR",
  },
};
