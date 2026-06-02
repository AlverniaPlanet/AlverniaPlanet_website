export type Locale = "pl" | "en" | "pt";

type LocalizedText = Record<Locale, string>;

export type GalleryCategory = {
  slug: string;
  cover: string;
  images: string[];
  captions: Record<Locale, string[]>;
  title: LocalizedText;
  intro: LocalizedText;
  hubTagline: LocalizedText;
};

const GENERAL_DIR = "/galeria/Ogolne";
const FILM_DIR = "/galeria/Sciezka_filmowa";
const EVENTS_DIR = "/galeria/Wydarzenia";
const OPENING_GALA_DIR = "/galeria/Gala_otwarcia";
const EXHIBITION_DIR = "/galeria/Wystawa/HarryPotter_TheExhibition";
const K360_DIR = "/galeria/K360";
const MARS_DIR = "/galeria/Projekt_MARS/webp";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

const GENERAL_IMAGES = range(8).map((n) => `${GENERAL_DIR}/webp/${n}.webp`);
const FILM_IMAGES = [
  "wejscie_korytarz_k9",
  "korytarz_k7",
  "era_niema",
  "era_analogowa_1",
  "era_analogowa_2",
  "era_cyfrowa_1",
  "era_cyfrowa_2",
  "era_cyfrowa_3",
  "K10_ozdoby",
  "K9_quizy",
  "k11_czerwony_dywan",
  "plan_zwiedzania",
  "sciezka_1",
  "sciezka_2",
  "sciezka_3",
  "sciezka_4",
  "img_0426_focus",
].map((name) => `${FILM_DIR}/webp/${name}.webp`);
const EVENTS_IMAGES = range(8).map((n) => `${EVENTS_DIR}/webp/${n}.webp`);
const OPENING_GALA_IMAGES = range(12).map((n) => `${OPENING_GALA_DIR}/jpg/${n}.jpg`);
const HP_IMAGES = range(8).map((n) => `${EXHIBITION_DIR}/webp/${n}.webp`);
const K360_IMAGES = [
  `${K360_DIR}/1.webp`,
  `${K360_DIR}/2.webp`,
  `${K360_DIR}/3.webp`,
  `${K360_DIR}/4.webp`,
  `${K360_DIR}/K360_1.webp`,
  `${K360_DIR}/K360_2.webp`,
];
const MARS_IMAGES = range(7).map((n) => `${MARS_DIR}/MARS_${n}.webp`);

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    slug: "ogolne",
    cover: GENERAL_IMAGES[0],
    images: GENERAL_IMAGES,
    title: { pl: "Ogólne", en: "General", pt: "Geral" },
    intro: {
      pl: "Architektura, krajobraz i przestrzenie Alvernia Planet.",
      en: "Architecture, landscape and the spaces of Alvernia Planet.",
      pt: "Arquitetura, paisagem e espaços da Alvernia Planet.",
    },
    hubTagline: {
      pl: "Obiekt i otoczenie",
      en: "Venue and surroundings",
      pt: "Espaço e arredores",
    },
    captions: {
      pl: [
        "Kopuły z lotu ptaka",
        "Szklane łączniki między kopułami",
        "Korytarz kapsułowy",
        "Kompleks nocą z lotu ptaka",
        "Wejście do kopuły",
        "Przeszklony tunel wejściowy",
        "Domy kopułowe o zmierzchu",
        "Kompleks z drona",
      ],
      en: [
        "Domes from above",
        "Glass connectors between domes",
        "Capsule corridor",
        "Night view of the complex",
        "Dome entrance",
        "Glass entry tunnel",
        "Domes at dusk",
        "Drone view of the complex",
      ],
      pt: [
        "Cúpulas vistas de cima",
        "Passagens envidraçadas entre cúpulas",
        "Corredor cápsula",
        "Vista noturna do complexo",
        "Entrada da cúpula",
        "Túnel de entrada envidraçado",
        "Cúpulas ao entardecer",
        "Vista do complexo por drone",
      ],
    },
  },
  {
    slug: "k360",
    cover: K360_IMAGES[1],
    images: K360_IMAGES,
    title: { pl: "Projekcja K360", en: "K360 projection", pt: "Projeção K360" },
    intro: {
      pl: "Kadry z fulldome 360° — największej kopuły projekcyjnej w Europie.",
      en: "Frames from the 360° fulldome — Europe's largest projection dome.",
      pt: "Imagens da cúpula 360° — a maior cúpula de projeção da Europa.",
    },
    hubTagline: {
      pl: "Fulldome 360°",
      en: "360° fulldome",
      pt: "Cúpula 360°",
    },
    captions: {
      pl: [
        "Światło i dźwięk otaczają widza",
        "Fulldome na całej kopule",
        "Obraz 360° wypełnia pole widzenia",
        "Surowa estetyka Marsa",
        "Wnętrze kopuły",
        "Pod kopułą",
      ],
      en: [
        "Light and sound surround the viewer",
        "Fulldome across the entire ceiling",
        "360° image fills the field of view",
        "The raw aesthetic of Mars",
        "Inside the dome",
        "Under the dome",
      ],
      pt: [
        "Luz e som envolvem o público",
        "Fulldome em toda a cúpula",
        "Imagem 360° preenche o campo de visão",
        "A estética crua de Marte",
        "Interior da cúpula",
        "Sob a cúpula",
      ],
    },
  },
  {
    slug: "projekt-mars",
    cover: MARS_IMAGES[0],
    images: MARS_IMAGES,
    title: { pl: "Projekt: MARS", en: "Mars Project", pt: "Projeto MARS" },
    intro: {
      pl: "Marsjański plan filmowy — scenografia, rekwizyty i kadry z misji.",
      en: "A Martian film set — props, scenography and frames from the mission.",
      pt: "O plano marciano — cenografia, adereços e cenas da missão.",
    },
    hubTagline: {
      pl: "Plan filmowy",
      en: "Film set",
      pt: "Plano de filmagens",
    },
    captions: {
      pl: [
        "Marsjański plan",
        "Wnętrze misji",
        "Stacja łączności",
        "Stacja wodna",
        "Powierzchnia Marsa",
        "Akcja na planie",
        "Kadr z filmu",
      ],
      en: [
        "Martian set",
        "Mission interior",
        "Communications station",
        "Water station",
        "Surface of Mars",
        "Action on set",
        "Frame from the film",
      ],
      pt: [
        "Plano marciano",
        "Interior da missão",
        "Estação de comunicações",
        "Estação de água",
        "Superfície de Marte",
        "Ação no set",
        "Imagem do filme",
      ],
    },
  },
  {
    slug: "sciezka-filmowa",
    cover: `${FILM_DIR}/webp/wejscie_korytarz_k9.webp`,
    images: FILM_IMAGES,
    title: { pl: "Ścieżka filmowa", en: "Film path", pt: "Percurso de filmagem" },
    intro: {
      pl: "Trasa zwiedzania — od historii kina po interaktywny finał.",
      en: "The visitor route — from the history of cinema to the interactive finale.",
      pt: "Percurso de visita — da história do cinema ao final interativo.",
    },
    hubTagline: {
      pl: "Trasa zwiedzania",
      en: "Visitor route",
      pt: "Percurso da visita",
    },
    captions: {
      pl: [
        "Korytarz wejściowy",
        "Korytarz K7",
        "Era niema",
        "Era analogowa",
        "Era analogowa — detal",
        "Era cyfrowa",
        "Era cyfrowa — detal",
        "Era cyfrowa — finał",
        "Ozdoby i detale",
        "Strefa quizów",
        "Czerwony dywan K11",
        "Plan zwiedzania",
        "Kadr ze ścieżki",
        "Kadr ze ścieżki",
        "Kadr ze ścieżki",
        "Kadr ze ścieżki",
        "Detal scenografii",
      ],
      en: [
        "Entrance corridor",
        "Corridor K7",
        "Silent era",
        "Analog era",
        "Analog era — detail",
        "Digital era",
        "Digital era — detail",
        "Digital era — finale",
        "Set details",
        "Quiz zone",
        "Red carpet K11",
        "Visit map",
        "Frame from the path",
        "Frame from the path",
        "Frame from the path",
        "Frame from the path",
        "Set detail",
      ],
      pt: [
        "Corredor de entrada",
        "Corredor K7",
        "Era muda",
        "Era analógica",
        "Era analógica — detalhe",
        "Era digital",
        "Era digital — detalhe",
        "Era digital — final",
        "Detalhes de cenário",
        "Zona de quiz",
        "Tapete vermelho K11",
        "Mapa da visita",
        "Imagem do percurso",
        "Imagem do percurso",
        "Imagem do percurso",
        "Imagem do percurso",
        "Detalhe de cenário",
      ],
    },
  },
  {
    slug: "wydarzenia",
    cover: EVENTS_IMAGES[0],
    images: EVENTS_IMAGES,
    title: { pl: "Wydarzenia", en: "Events", pt: "Eventos" },
    intro: {
      pl: "Konferencje, gale i premiery odbywające się w Alvernia Planet.",
      en: "Conferences, galas and premieres held at Alvernia Planet.",
      pt: "Conferências, galas e estreias realizadas na Alvernia Planet.",
    },
    hubTagline: {
      pl: "Eventy w kopule",
      en: "Events in the dome",
      pt: "Eventos na cúpula",
    },
    captions: {
      pl: [
        "Konferencja w kopule",
        "Strefa networkingowa",
        "Bankiet w K9",
        "Gala w kopule",
        "Plan eventu i scena",
        "Catering live",
        "Strefa atrakcji na scenie",
        "Pokaz w kopule z autoshow",
      ],
      en: [
        "Conference in the dome",
        "Networking area",
        "Banquet in K9",
        "Gala in the dome",
        "Show plan & stage",
        "Live catering",
        "Attraction zone on stage",
        "Show in the dome with car reveal",
      ],
      pt: [
        "Conferência na cúpula",
        "Área de networking",
        "Banquete na K9",
        "Gala na cúpula",
        "Plano do evento e palco",
        "Catering ao vivo",
        "Zona de atrações no palco",
        "Show na cúpula com revelação de carro",
      ],
    },
  },
  {
    slug: "gala-otwarcia",
    cover: OPENING_GALA_IMAGES[0],
    images: OPENING_GALA_IMAGES,
    title: {
      pl: "Gala otwarcia Projekcji K360",
      en: "K360 Projection opening gala",
      pt: "Gala de abertura da Projeção K360",
    },
    intro: {
      pl: "Zdjęcia z oficjalnej gali otwarcia Projekcji K360 w Alvernia Planet.",
      en: "Photos from the official opening gala of the K360 Projection at Alvernia Planet.",
      pt: "Fotografias da gala oficial de abertura da Projeção K360 na Alvernia Planet.",
    },
    hubTagline: {
      pl: "Premiera obiektu",
      en: "Venue premiere",
      pt: "Estreia do espaço",
    },
    captions: {
      pl: [],
      en: [],
      pt: [],
    },
  },
  {
    slug: "harry-potter",
    cover: HP_IMAGES[0],
    images: HP_IMAGES,
    title: {
      pl: "Harry Potter: The Exhibition",
      en: "Harry Potter: The Exhibition",
      pt: "Harry Potter: The Exhibition",
    },
    intro: {
      pl: "Wystawa tematyczna 10.04 – 17.08.2025.",
      en: "Themed exhibition Apr 10 – Aug 17, 2025.",
      pt: "Exposição temática 10 Abr – 17 Ago 2025.",
    },
    hubTagline: {
      pl: "Wystawa tematyczna",
      en: "Themed exhibition",
      pt: "Exposição temática",
    },
    captions: {
      pl: [
        "Wejście do wystawy",
        "Knight Bus",
        "Początek trasy – portal",
        "Sala immersyjna z mapą",
        "Strefa rejestracji",
        "Galeria portretów",
        "Autobus wystawy na zewnątrz",
        "Spotkanie z gośćmi",
      ],
      en: [
        "Exhibition entry",
        "Knight Bus",
        "Route kickoff – portal",
        "Immersive map room",
        "Registration hall",
        "Portrait gallery",
        "Exhibition bus outside",
        "Guest meet & greet",
      ],
      pt: [
        "Entrada da exposição",
        "Knight Bus",
        "Início do percurso – portal",
        "Sala imersiva com mapa",
        "Sala de registo",
        "Galeria de retratos",
        "Autocarro da exposição no exterior",
        "Encontro com convidados",
      ],
    },
  },
];

export function findCategoryBySlug(slug: string): GalleryCategory | undefined {
  return GALLERY_CATEGORIES.find((category) => category.slug === slug);
}

export const GALLERY_HUB_LABELS: Record<
  Locale,
  {
    tag: string;
    title: string;
    subtitle: string;
    backToHub: string;
    morePhotos: string;
    photoCountLabel: (count: number) => string;
    backToHubAria: string;
    loadingImage: string;
    imageError: string;
    photoLabel: string;
  }
> = {
  pl: {
    tag: "Galeria",
    title: "Galeria",
    subtitle:
      "Wybierz kategorię, żeby zobaczyć pełną kolekcję zdjęć.",
    backToHub: "Wróć do galerii",
    morePhotos: "Zobacz więcej",
    photoCountLabel: (count) =>
      count === 1 ? "1 zdjęcie" : count < 5 ? `${count} zdjęcia` : `${count} zdjęć`,
    backToHubAria: "Wróć do strony galerii",
    loadingImage: "Ładowanie zdjęcia...",
    imageError: "Nie udało się wczytać",
    photoLabel: "Zdjęcie",
  },
  en: {
    tag: "Gallery",
    title: "Gallery",
    subtitle: "Pick a category to browse the full set of photos.",
    backToHub: "Back to gallery",
    morePhotos: "See more",
    photoCountLabel: (count) => `${count} ${count === 1 ? "photo" : "photos"}`,
    backToHubAria: "Back to the gallery page",
    loadingImage: "Loading image...",
    imageError: "Failed to load",
    photoLabel: "Photo",
  },
  pt: {
    tag: "Galeria",
    title: "Galeria",
    subtitle: "Escolhe uma categoria para ver toda a coleção de fotos.",
    backToHub: "Voltar à galeria",
    morePhotos: "Ver mais",
    photoCountLabel: (count) => `${count} ${count === 1 ? "foto" : "fotos"}`,
    backToHubAria: "Voltar à página da galeria",
    loadingImage: "A carregar foto...",
    imageError: "Falha ao carregar",
    photoLabel: "Foto",
  },
};
