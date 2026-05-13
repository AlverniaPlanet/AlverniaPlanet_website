"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import TourLineGalleryRow from "@/app/components/TourLineGalleryRow";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  FILM_PATH_BOOKING_CATEGORY,
  FILM_PATH_BOOKING_SERVICES,
} from "@/lib/booking";

type Locale = "pl" | "en" | "pt";

type TicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  priceLabel?: string;
  price?: string;
  bookingServiceName: string;
  bookingQuantity?: number;
};

type IntroStat = {
  value: string;
  label: string;
};

type OpeningPhoto = {
  src: string;
  alt: string;
  label: string;
};

type TourStep = {
  number: string;
  title: string;
  summary: string;
  highlights: string[];
};

type GalleryItem = {
  title: string;
  body: string;
  image: string;
};

const OPENING_PHOTO_SOURCES = {
  entrance: "/galeria/Sciezka_filmowa_v2/webp/wejscie_korytarz_k9.webp",
  silent: "/galeria/Sciezka_filmowa_v2/webp/era_niema.webp",
  interactive: "/galeria/Sciezka_filmowa_v2/webp/K9_quizy.webp",
} as const;

const COPY: Record<
  Locale,
  {
    heroTag: string;
    heroTitle: string;
    heroLead: string;
    planEyebrow: string;
    planTitle: string;
    planBody: string;
    planCaption: string;
    planPhotos: OpeningPhoto[];
    stats: IntroStat[];
    routeEyebrow: string;
    routeTitle: string;
    route: TourStep[];
    galleryTitle: string;
    galleryIntro: string;
    galleryItems: GalleryItem[];
    ticketsTitle: string;
    ticketsIntro: string;
    ticketsPriceLabel: string;
    ticketsPrice: string;
    ticketsButton: string;
    ticketsOptions: TicketOption[];
    videoFallback: string;
  }
> = {
  pl: {
    heroTag: "Atrakcje",
    heroTitle: "Ścieżka filmowa",
    heroLead: "Przejdź trasę zwiedzania, która odsłania kulisy tworzenia filmowych światów.",
    planEyebrow: "Ścieżka edukacyjna",
    planTitle: "Wejdź do świata filmu, krok po kroku.",
    planBody:
      "Odświeżona ścieżka edukacyjna została wzbogacona o nowe atrakcje i prowadzi przez historię kina, przestrzenie Alvernia Planet oraz kolejne etapy pracy na planie. To jedna spójna trasa, która łączy wiedzę, scenografię, dźwięk i finał interaktywny. Oprowadzanie odbywa się w języku polskim.",
    planCaption:
      "Od wejścia na trasę, przez epoki kina i pracę na planie, aż po interaktywne zadanie na końcu.",
    planPhotos: [
      {
        src: OPENING_PHOTO_SOURCES.entrance,
        alt: "Wejście do ścieżki edukacyjnej w Alvernia Planet.",
        label: "Wejście na trasę",
      },
      {
        src: OPENING_PHOTO_SOURCES.silent,
        alt: "Stanowisko poświęcone początkom projekcji na ścieżce edukacyjnej.",
        label: "Ery projekcji",
      },
      {
        src: OPENING_PHOTO_SOURCES.interactive,
        alt: "Interaktywny fragment ścieżki edukacyjnej.",
        label: "Finał i interakcja",
      },
    ],
    stats: [
      { value: "8 etapów", label: "od historii projekcji po finał interaktywny" },
      { value: "2,5 h", label: "oprowadzania z przewodnikiem" },
      { value: "polski", label: "język oprowadzania" },
    ],
    routeEyebrow: "Animowana trasa",
    routeTitle: "Przewiń przez kolejne etapy zwiedzania.",
    route: [
      {
        number: "01",
        title: "Korytarz Historii",
        summary: "Przejście przez ery projekcji: niemą, analogową i cyfrową.",
        highlights: [
          "czym była era niema?",
          "jak działała projekcja analogowa?",
          "czym jest projekcja cyfrowa?",
          "co będzie dalej?",
        ],
      },
      {
        number: "02",
        title: "Co kryje się pod kopułą?",
        summary: "Dlaczego architektura Alvernia Planet wygląda tak wyjątkowo.",
        highlights: [
          "skąd wzięła się wizja projektu?",
          "dlaczego kopuły mają taki kształt?",
          "co tworzy ich kosmiczny wygląd?",
          "jaką funkcję pełni budynek?",
        ],
      },
      {
        number: "03",
        title: "Zawody filmowe",
        summary: "Kto za co odpowiada na planie filmowym.",
        highlights: [
          "kto tworzy ekipę filmową?",
          "za co odpowiada reżyser?",
          "co robi operator?",
          "jak pracuje cała ekipa?",
        ],
      },
      {
        number: "04",
        title: "Gwiazdy i produkcje",
        summary: "Znane nazwiska i projekty związane z obiektem.",
        highlights: [
          "jakie gwiazdy były tu obecne?",
          "jakie produkcje tu powstały?",
          "które tytuły są najbardziej znane?",
          "z czego słynie to miejsce?",
        ],
      },
      {
        number: "05",
        title: "Scenografia i rekwizyty",
        summary: "Jak detale i rekwizyty budują świat filmu.",
        highlights: [
          "jak powstaje scenografia?",
          "jaką rolę mają rekwizyty?",
          "co buduje filmowy klimat?",
          "co trafia na plan?",
        ],
      },
      {
        number: "06",
        title: "Produkcja i sceny akcji",
        summary: "Jak powstają sceny akcji i ile przygotowań wymagają.",
        highlights: [
          "jak wyglądają etapy produkcji?",
          "jak przygotowuje się sceny akcji?",
          "po co są próby?",
          "jak dba się o bezpieczeństwo?",
        ],
      },
      {
        number: "07",
        title: "Postprodukcja dźwięku",
        summary: "Skąd biorą się filmowe dźwięki i jak zmieniają scenę.",
        highlights: [
          "skąd bierze się dźwięk w filmie?",
          "jak powstają dialogi?",
          "skąd biorą się efekty?",
          "na czym polega praca w studiu?",
        ],
      },
      {
        number: "08",
        title: "Finał interaktywny",
        summary: "Krótki finał, który angażuje i podsumowuje trasę.",
        highlights: [
          "quizy",
          "pisanie własnego scenariusza przy pomocy AI",
          "fotobudka",
          "sklepik z gadżetami filmowymi",
          "drzwi wymiarów",
          "rozmowa z maskotką obiektu",
        ],
      },
    ],
    galleryTitle: "Galeria ścieżki edukacyjnej",
    galleryIntro: "Wybrane kadry z trasy: od korytarza historii po interaktywne stanowiska i scenografię.",
    galleryItems: [
      {
        title: "Korytarz wejściowy",
        body: "Początek trasy i pierwsze wejście w świat ścieżki edukacyjnej.",
        image: "/galeria/Sciezka_filmowa_v2/webp/wejscie_korytarz_k9.webp",
      },
      {
        title: "Era niema",
        body: "Stanowisko poświęcone początkom projekcji i pierwszym ruchomym obrazom.",
        image: "/galeria/Sciezka_filmowa_v2/webp/era_niema.webp",
      },
      {
        title: "Era analogowa",
        body: "Materiały i eksponaty pokazujące erę analogowej rejestracji i projekcji.",
        image: "/galeria/Sciezka_filmowa_v2/webp/era_analogowa_1.webp",
      },
      {
        title: "Era cyfrowa",
        body: "Nowoczesne rozwiązania i narzędzia używane w produkcji obrazu.",
        image: "/galeria/Sciezka_filmowa_v2/webp/era_cyfrowa_1.webp",
      },
      {
        title: "Ozdoby i detale",
        body: "Elementy scenografii i dekoracji budujące klimat filmowego świata.",
        image: "/galeria/Sciezka_filmowa_v2/webp/K10_ozdoby.webp",
      },
      {
        title: "Strefa quizów",
        body: "Interaktywne stanowiska, które domykają zwiedzanie aktywnym finałem.",
        image: "/galeria/Sciezka_filmowa_v2/webp/K9_quizy.webp",
      },
    ],
    ticketsTitle: "Bilety na ścieżkę edukacyjną",
    ticketsIntro:
      "Bilet normalny kosztuje 79 zł za osobę, a bilet ulgowy 69 zł za osobę. Dla grup szkolnych start to 2 070 zł za 30 osób, a każda kolejna osoba kosztuje 69 zł, maksymalnie do 50 uczestników na rezerwację. Sama Ścieżka filmowa trwa około 2,5 godziny, a w pakiecie z projekcją K360 całość zajmuje około 3 godzin.",
    ticketsPriceLabel: "Cena za osobę",
    ticketsPrice: "79 zł/os. lub 69 zł/os.",
    ticketsButton: "Kup bilet",
    ticketsOptions: [
      {
        badge: "Normalny",
        title: "Bilet normalny",
        subtitle: "1-10 osób na jednym bilecie",
        details: ["Dla osób indywidualnych i rodzin", "Cena regularna za osobę"],
        price: "79 zł/os.",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
      },
      {
        badge: "Ulgowy",
        title: "Bilet ulgowy",
        subtitle: "1-10 osób na jednym bilecie",
        details: ["Dla osób indywidualnych i rodzin", "Cena ulgowa za osobę"],
        price: "69 zł/os.",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.reduced,
      },
      {
        badge: "Grupowe",
        title: "Bilet grupowy (szkolny)",
        subtitle: "30-50 osób w grupie",
        details: [
          "Dla szkół i grup zorganizowanych",
          "2 070 zł za pierwsze 30 osób",
          "Powyżej 50 osób: 2 rezerwacje lub kontakt",
        ],
        priceLabel: "Cena grupowa",
        price: "2 070 zł - 3 450 zł",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
    videoFallback: "Twoja przeglądarka nie obsługuje elementu wideo.",
  },
  en: {
    heroTag: "Attractions",
    heroTitle: "Film path",
    heroLead: "Walk the tour that reveals how film worlds are built.",
    planEyebrow: "Educational path",
    planTitle: "Step into the world of film, stage by stage.",
    planBody:
      "The refreshed educational path has been expanded with new attractions and now leads through moving-image history, Alvernia Planet spaces, and the key stages of film production. It is one cohesive route that combines learning, set design, sound, and an interactive finale. The guided tour is available in Polish.",
    planCaption:
      "From the route entrance and projection eras to on-set work and the interactive ending.",
    planPhotos: [
      {
        src: OPENING_PHOTO_SOURCES.entrance,
        alt: "Entrance to the educational path at Alvernia Planet.",
        label: "Route entrance",
      },
      {
        src: OPENING_PHOTO_SOURCES.silent,
        alt: "Projection history station on the educational path.",
        label: "Projection eras",
      },
      {
        src: OPENING_PHOTO_SOURCES.interactive,
        alt: "Interactive section of the educational path.",
        label: "Final interaction",
      },
    ],
    stats: [
      { value: "8 stages", label: "from film history to the interactive finale" },
      { value: "2.5 h", label: "guided visit" },
      { value: "Polish", label: "tour language" },
    ],
    routeEyebrow: "Animated route",
    routeTitle: "Scroll through the full visit step by step.",
    route: [
      {
        number: "01",
        title: "History Corridor",
        summary: "A walk through silent, analog, and digital projection eras.",
        highlights: [
          "what was silent film?",
          "how did analog projection work?",
          "what is digital projection?",
          "what comes next?",
        ],
      },
      {
        number: "02",
        title: "Cosmic domes",
        summary: "Why the Alvernia domes look so distinctive.",
        highlights: [
          "where did the design vision come from?",
          "why do the domes have this shape?",
          "what creates their cosmic look?",
          "what is the building used for?",
        ],
      },
      {
        number: "03",
        title: "Film professions",
        summary: "Who does what on a film set.",
        highlights: [
          "who makes up the film crew?",
          "what does the director do?",
          "what does the director of photography do?",
          "how does the crew work together?",
        ],
      },
      {
        number: "04",
        title: "Stars and productions",
        summary: "Known names and productions linked to the venue.",
        highlights: [
          "which stars have been here?",
          "which productions were made here?",
          "which titles stand out most?",
          "what is this place known for?",
        ],
      },
      {
        number: "05",
        title: "Sets and props",
        summary: "How props and details build a film world.",
        highlights: [
          "how is set design created?",
          "what role do props play?",
          "what builds the film atmosphere?",
          "what ends up on set?",
        ],
      },
      {
        number: "06",
        title: "Production and action scenes",
        summary: "How action scenes are planned and prepared.",
        highlights: [
          "what are the stages of production?",
          "how are action scenes prepared?",
          "why are rehearsals needed?",
          "how is safety managed on set?",
        ],
      },
      {
        number: "07",
        title: "Sound post-production studio",
        summary: "Where film sound comes from and how it shapes a scene.",
        highlights: [
          "where does film sound come from?",
          "how are dialogues prepared?",
          "how are effects created?",
          "what happens in the studio?",
        ],
      },
      {
        number: "08",
        title: "Interactive final task",
        summary: "A short closing activity that wraps up the route.",
        highlights: [
          "quizzes",
          "writing your own script with AI",
          "photo booth",
          "shop with film gadgets",
          "dimension doors",
          "conversation with the venue mascot",
        ],
      },
    ],
    galleryTitle: "Educational path gallery",
    galleryIntro: "Selected moments from the route, from the history corridor to interactive stations and set details.",
    galleryItems: [
      {
        title: "Entrance corridor",
        body: "The beginning of the route and the first step into the educational path.",
        image: "/galeria/Sciezka_filmowa_v2/webp/wejscie_korytarz_k9.webp",
      },
      {
        title: "Silent era",
        body: "A station focused on the earliest era of film and moving image.",
        image: "/galeria/Sciezka_filmowa_v2/webp/era_niema.webp",
      },
      {
        title: "Analog era",
        body: "Displays and materials showing the age of analog projection and recording.",
        image: "/galeria/Sciezka_filmowa_v2/webp/era_analogowa_1.webp",
      },
      {
        title: "Digital era",
        body: "Modern tools and techniques used in contemporary image production.",
        image: "/galeria/Sciezka_filmowa_v2/webp/era_cyfrowa_1.webp",
      },
      {
        title: "Set details",
        body: "Scenic details and decorative elements that shape the film atmosphere.",
        image: "/galeria/Sciezka_filmowa_v2/webp/K10_ozdoby.webp",
      },
      {
        title: "Quiz zone",
        body: "Interactive stations that close the visit with a more active finale.",
        image: "/galeria/Sciezka_filmowa_v2/webp/K9_quizy.webp",
      },
    ],
    ticketsTitle: "Educational path tickets",
    ticketsIntro:
      "The standard ticket costs 79 PLN per person and the reduced ticket costs 69 PLN per person. For school groups the starting price is 2,070 PLN for 30 guests, then 69 PLN for each additional guest up to 50 people per booking. The Film Path itself lasts about 2.5 hours, and with the K360 projection package the full visit takes about 3 hours.",
    ticketsPriceLabel: "Price per person",
    ticketsPrice: "79 PLN/person or 69 PLN/person",
    ticketsButton: "Buy tickets",
    ticketsOptions: [
      {
        badge: "Standard",
        title: "Standard ticket",
        subtitle: "1-10 people on one ticket",
        details: ["For individuals and families", "Regular price per person"],
        price: "79 PLN/person",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
      },
      {
        badge: "Reduced",
        title: "Reduced ticket",
        subtitle: "1-10 people on one ticket",
        details: ["For individuals and families", "Reduced price per person"],
        price: "69 PLN/person",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.reduced,
      },
      {
        badge: "Group",
        title: "Group ticket (schools)",
        subtitle: "30-50 people in a group",
        details: [
          "For schools and organized groups",
          "2,070 PLN for the first 30 guests",
          "Over 50 guests: split into two bookings or contact us",
        ],
        priceLabel: "Group pricing",
        price: "2,070 PLN - 3,450 PLN",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
    videoFallback: "Your browser does not support the video element.",
  },
  pt: {
    heroTag: "Atrações",
    heroTitle: "Percurso de filmagem",
    heroLead: "Percorra a visita que revela como nascem mundos em imagem e som.",
    planEyebrow: "Percurso educativo",
    planTitle: "Entra no universo das produções etapa a etapa.",
    planBody:
      "O percurso educativo renovado foi enriquecido com novas atrações e conduz pela história da projeção, pelos espaços da Alvernia Planet e pelas etapas centrais do trabalho em set. É uma rota coesa que junta aprendizagem, cenografia, som e um final interativo. A visita guiada decorre em polaco.",
    planCaption:
      "Da entrada no percurso e das eras de projeção até ao trabalho em set e ao final interativo.",
    planPhotos: [
      {
        src: OPENING_PHOTO_SOURCES.entrance,
        alt: "Entrada do percurso educativo na Alvernia Planet.",
        label: "Entrada no percurso",
      },
      {
        src: OPENING_PHOTO_SOURCES.silent,
        alt: "Zona dedicada à história da projeção no percurso educativo.",
        label: "Eras da projeção",
      },
      {
        src: OPENING_PHOTO_SOURCES.interactive,
        alt: "Parte interativa do percurso educativo.",
        label: "Final interativo",
      },
    ],
    stats: [
      { value: "8 etapas", label: "da história da projeção ao final interativo" },
      { value: "2,5 h", label: "visita guiada" },
      { value: "polaco", label: "idioma da visita" },
    ],
    routeEyebrow: "Rota animada",
    routeTitle: "Percorra a visita etapa por etapa durante o scroll.",
    route: [
      {
        number: "01",
        title: "Corredor da História",
        summary: "Uma passagem pelas eras da projeção: muda, analógica e digital.",
        highlights: [
          "o que era a era muda?",
          "como funcionava a projeção analógica?",
          "o que é a projeção digital?",
          "o que vem a seguir?",
        ],
      },
      {
        number: "02",
        title: "Cúpulas cósmicas",
        summary: "Porque as cúpulas da Alvernia têm um visual tão marcante.",
        highlights: [
          "de onde veio a visão do projeto?",
          "porque têm as cúpulas esta forma?",
          "o que cria o visual cósmico?",
          "qual é a função do edifício?",
        ],
      },
      {
        number: "03",
        title: "Profissões de set",
        summary: "Quem faz o quê num set de filmagem.",
        highlights: [
          "quem faz parte da equipa?",
          "o que faz o realizador?",
          "o que faz o diretor de fotografia?",
          "como trabalha toda a equipa?",
        ],
      },
      {
        number: "04",
        title: "Estrelas e produções",
        summary: "Nomes conhecidos e produções ligadas ao espaço.",
        highlights: [
          "que estrelas passaram por aqui?",
          "que produções nasceram aqui?",
          "que títulos mais se destacam?",
          "pelo que é conhecido este lugar?",
        ],
      },
      {
        number: "05",
        title: "Cenografia e adereços",
        summary: "Como os detalhes e adereços constroem o mundo do filme.",
        highlights: [
          "como nasce a cenografia?",
          "que papel têm os adereços?",
          "o que cria o ambiente do filme?",
          "o que chega ao set?",
        ],
      },
      {
        number: "06",
        title: "Produção e ação",
        summary: "Como se planeiam cenas de ação e quanto exigem.",
        highlights: [
          "quais são as etapas da produção?",
          "como se preparam cenas de ação?",
          "porque são importantes os ensaios?",
          "como se garante a segurança?",
        ],
      },
      {
        number: "07",
        title: "Pós-produção de som",
        summary: "De onde vêm os sons da produção e como mudam a cena.",
        highlights: [
          "de onde vem o som numa cena?",
          "como se trabalham os diálogos?",
          "como nascem os efeitos?",
          "o que acontece no estúdio?",
        ],
      },
      {
        number: "08",
        title: "Final interativo",
        summary: "Uma atividade curta para fechar e resumir a visita.",
        highlights: [
          "quizzes",
          "escrita do próprio guião com IA",
          "fotomatón",
          "loja com gadgets de bastidores",
          "portas dimensionais",
          "conversa com a mascote do espaço",
        ],
      },
    ],
    galleryTitle: "Galeria do percurso educativo",
    galleryIntro: "Momentos escolhidos da visita: do corredor da história às zonas interativas e aos detalhes de cenografia.",
    galleryItems: [
      {
        title: "Corredor de entrada",
        body: "O início do percurso e o primeiro contacto com a visita educativa.",
        image: "/galeria/Sciezka_filmowa_v2/webp/wejscie_korytarz_k9.webp",
      },
      {
        title: "Era muda",
        body: "Uma zona dedicada às origens da projeção e aos primeiros filmes.",
        image: "/galeria/Sciezka_filmowa_v2/webp/era_niema.webp",
      },
      {
        title: "Era analógica",
        body: "Exposição de materiais e referências da era analógica da projeção.",
        image: "/galeria/Sciezka_filmowa_v2/webp/era_analogowa_1.webp",
      },
      {
        title: "Era digital",
        body: "Ferramentas e soluções ligadas à produção visual contemporânea.",
        image: "/galeria/Sciezka_filmowa_v2/webp/era_cyfrowa_1.webp",
      },
      {
        title: "Detalhes de cenário",
        body: "Elementos visuais e decorativos que constroem o ambiente visual.",
        image: "/galeria/Sciezka_filmowa_v2/webp/K10_ozdoby.webp",
      },
      {
        title: "Zona de quiz",
        body: "Estações interativas que fecham a visita com um final mais dinâmico.",
        image: "/galeria/Sciezka_filmowa_v2/webp/K9_quizy.webp",
      },
    ],
    ticketsTitle: "Bilhetes para o percurso educativo",
    ticketsIntro:
      "O bilhete normal custa 79 PLN por pessoa e o bilhete reduzido custa 69 PLN por pessoa. Para grupos escolares, o valor começa em 2 070 PLN para 30 pessoas, depois 69 PLN por cada pessoa adicional até 50 participantes por reserva. O Percurso de filmagem por si só dura cerca de 2,5 horas e, no pacote com a projeção K360, a visita completa dura cerca de 3 horas.",
    ticketsPriceLabel: "Preço por pessoa",
    ticketsPrice: "79 PLN/pessoa ou 69 PLN/pessoa",
    ticketsButton: "Comprar bilhete",
    ticketsOptions: [
      {
        badge: "Normal",
        title: "Bilhete normal",
        subtitle: "1-10 pessoas por bilhete",
        details: ["Para indivíduos e famílias", "Preço normal por pessoa"],
        price: "79 PLN/pessoa",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
      },
      {
        badge: "Reduzido",
        title: "Bilhete reduzido",
        subtitle: "1-10 pessoas por bilhete",
        details: ["Para indivíduos e famílias", "Preço reduzido por pessoa"],
        price: "69 PLN/pessoa",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.reduced,
      },
      {
        badge: "Grupo",
        title: "Bilhete de grupo (escolas)",
        subtitle: "30-50 pessoas no grupo",
        details: [
          "Para escolas e grupos organizados",
          "2 070 PLN para as primeiras 30 pessoas",
          "Acima de 50 pessoas: dividir em duas reservas ou contactar-nos",
        ],
        priceLabel: "Preço de grupo",
        price: "2 070 PLN - 3 450 PLN",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
    videoFallback: "O seu navegador não suporta o elemento de vídeo.",
  },
};

function useRouteTimeline(stepCount: number) {
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const visibilityRatios = useRef<number[]>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [seenIndices, setSeenIndices] = useState<number[]>(stepCount > 0 ? [0] : []);

  useEffect(() => {
    visibilityRatios.current = Array.from({ length: stepCount }, (_, index) => (index === 0 ? 1 : 0));
    activeIndexRef.current = 0;
    setActiveIndex(0);
    setSeenIndices(stepCount > 0 ? [0] : []);
  }, [stepCount]);

  useEffect(() => {
    if (typeof window === "undefined" || stepCount === 0) {
      return;
    }

    const nodes = stepRefs.current.slice(0, stepCount).filter(Boolean) as HTMLDivElement[];

    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLDivElement).dataset.stepIndex);

          if (!Number.isInteger(index)) {
            return;
          }

          visibilityRatios.current[index] = entry.isIntersecting ? entry.intersectionRatio : 0;

          if (entry.isIntersecting) {
            setSeenIndices((current) =>
              current.includes(index) ? current : [...current, index].sort((left, right) => left - right),
            );
          }
        });

        let nextIndex = activeIndexRef.current;
        let bestRatio = 0;

        visibilityRatios.current.forEach((ratio, index) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            nextIndex = index;
          }
        });

        if (bestRatio > 0 && nextIndex !== activeIndexRef.current) {
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
        }
      },
      {
        threshold: [0, 0.2, 0.45, 0.7],
        rootMargin: "-18% 0px -42% 0px",
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [stepCount]);

  const setStepRef = (index: number) => (node: HTMLDivElement | null) => {
    stepRefs.current[index] = node;
  };

  const seenSet = useMemo(() => new Set(seenIndices), [seenIndices]);

  return { activeIndex, seenSet, setStepRef };
}

function capitalizeLead(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatHighlight(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  const normalized = capitalizeLead(trimmed);
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function getStepBadgeTitleClasses(title: string) {
  const normalizedLength = title.trim().length;

  if (normalizedLength >= 23) {
    return "text-[clamp(0.56rem,1.9vw,0.68rem)] leading-[1.12]";
  }

  if (normalizedLength >= 19) {
    return "text-[clamp(0.6rem,2vw,0.72rem)] leading-[1.14]";
  }

  return "text-[clamp(0.66rem,2.2vw,0.78rem)] leading-[1.18]";
}

function getIntroStatValueClasses(value: string) {
  const normalizedLength = value.trim().length;

  if (normalizedLength >= 10) {
    return "text-[clamp(1.12rem,1.8vw,1.45rem)] tracking-[-0.035em]";
  }

  if (normalizedLength >= 7) {
    return "text-[clamp(1.22rem,1.95vw,1.58rem)] tracking-[-0.03em]";
  }

  return "text-[clamp(1.38rem,2.15vw,1.72rem)] tracking-[-0.03em]";
}

function getActiveStepTitleClasses(title: string) {
  const normalizedLength = title.trim().length;

  if (normalizedLength >= 23) {
    return "text-[clamp(1.5rem,6vw,2.2rem)] leading-[0.98] tracking-[-0.03em]";
  }

  if (normalizedLength >= 18) {
    return "text-[clamp(1.65rem,6.4vw,2.35rem)] leading-[1] tracking-[-0.03em]";
  }

  return "text-[clamp(1.85rem,7vw,2.6rem)] leading-[1.02] tracking-[-0.035em]";
}

function getHighlightTextClasses(value: string) {
  const normalizedLength = value.trim().length;

  if (normalizedLength >= 36) {
    return "text-[0.56rem] leading-none tracking-[-0.02em] sm:text-[0.6rem] lg:text-[0.68rem]";
  }

  if (normalizedLength >= 30) {
    return "text-[0.6rem] leading-none tracking-[-0.015em] sm:text-[0.65rem] lg:text-[0.72rem]";
  }

  if (normalizedLength >= 24) {
    return "text-[0.66rem] leading-none sm:text-[0.7rem] lg:text-[0.76rem]";
  }

  return "text-[0.74rem] leading-none sm:text-[0.78rem]";
}

function RouteStepCard({
  step,
  index,
  isActive,
  isSeen,
  setRef,
}: {
  step: TourStep;
  index: number;
  isActive: boolean;
  isSeen: boolean;
  setRef: (node: HTMLDivElement | null) => void;
}) {
  const stateClasses = isActive
    ? "is-active opacity-100 translate-y-0 xl:translate-x-0"
    : isSeen
      ? "opacity-100 translate-y-0 xl:translate-x-0"
      : "opacity-60 translate-y-4 xl:translate-x-2";
  const dotClasses = isActive
    ? "border-[#7ef6ff] bg-[#7ef6ff] shadow-[0_0_0_6px_rgba(126,246,255,0.12)]"
    : isSeen
      ? "border-[#7ef6ff]/55 bg-[#7ef6ff]/45"
      : "border-white/18 bg-[#080b13]";
  const offsetClass = index % 2 === 0 ? "2xl:ml-0" : "2xl:ml-12";

  return (
    <div className={`relative pl-8 sm:pl-10 ${offsetClass}`}>
      <span
        className={`absolute left-[0.2rem] top-9 h-3.5 w-3.5 rounded-full border transition-all duration-500 ${dotClasses}`}
      />
      <article
        ref={setRef}
        data-step-index={index}
        className={`ap-tile ap-tile-lg ap-tile-interactive relative overflow-hidden px-5 py-6 transition-all duration-500 ease-out sm:px-6 ${stateClasses}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(126,246,255,0.12),transparent_34%)]" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#7ef6ff]/78">
                {step.number}
              </p>
              <h4 className="mt-4 max-w-xl text-2xl font-semibold leading-tight text-white sm:text-[2rem]">
                {step.title}
              </h4>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">{step.summary}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {step.highlights.map((highlight) => (
              <div
                key={highlight}
                className="ap-tile ap-tile-sm overflow-hidden px-3 py-3 text-white/68 sm:px-4"
              >
                <span className={`block whitespace-nowrap ${getHighlightTextClasses(formatHighlight(highlight))}`}>
                  {formatHighlight(highlight)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

export default function FilmPathContent() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];
  const { activeIndex, seenSet, setStepRef } = useRouteTimeline(t.route.length);
  const activeStep = t.route[activeIndex] ?? t.route[0];
  const progress = t.route.length > 0 ? ((activeIndex + 1) / t.route.length) * 100 : 0;

  return (
    <main className="relative z-10 min-h-screen">
      <section className="relative z-10 px-4 pt-12 sm:pt-16">
        <div className="ap-shell mb-10 sm:mb-12">
          <div className="ap-tile ap-tile-lg relative overflow-hidden">
            <div className="relative aspect-[16/9] bg-black">
              <AdaptiveVideo
                mp4Src="/wycieczka/APE_sciezafilmowa.mp4"
                webmSrc="/wycieczka/APE_sciezafilmowa.webm"
                poster="/wycieczka/APE_sciezafilmowa_poster.webp"
                className="absolute inset-0 h-full w-full object-cover"
                sizes="(min-width: 1200px) 72rem, 100vw"
                fallbackText={t.videoFallback}
                priority
                rootMargin="320px 0px"
                preferPosterOnLowPower
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />
              <div className="relative flex h-full items-center justify-center p-6 text-center sm:p-10 force-overlay">
                <div className="space-y-2 ap-page-intro-stagger">
                  <p className="ap-type-kicker force-overlay-muted">{t.heroTag}</p>
                  <h1 className="ap-type-hero-title force-overlay drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {t.heroTitle}
                  </h1>
                  <p className="ap-type-hero-subtitle mx-auto max-w-3xl force-overlay-dim">
                    {t.heroLead}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-20">
        <div className="ap-shell space-y-14 sm:space-y-16">
          <section className="grid gap-8 xl:grid-cols-[minmax(21rem,0.92fr)_minmax(0,1.08fr)] xl:items-center xl:gap-10 2xl:grid-cols-[minmax(24rem,0.86fr)_minmax(0,1.14fr)]">
            <div className="space-y-6 text-center sm:text-left">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#7ef6ff]/76">
                {t.planEyebrow}
              </p>
              <h2 className="mx-auto max-w-[12ch] text-pretty text-[clamp(2.2rem,7vw,3.65rem)] font-semibold leading-[1.05] tracking-[-0.038em] text-white sm:mx-0 sm:leading-[1.01] lg:text-[4rem] lg:leading-[0.96]">
                {t.planTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/72 sm:mx-0 sm:text-xl">{t.planBody}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {t.stats.map((stat) => (
                  <div
                    key={stat.value}
                    className="ap-tile ap-tile-sm px-5 py-4 text-center sm:text-left"
                  >
                    <p className={`whitespace-nowrap font-semibold text-white ${getIntroStatValueClasses(stat.value)}`}>
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="ap-tile ap-tile-lg p-3 sm:p-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] sm:grid-rows-2 sm:gap-4">
                {t.planPhotos.map((photo, index) => {
                  const isPrimary = index === 0;

                  return (
                    <figure
                      key={photo.src}
                      className={`ap-tile ap-tile-sm group relative overflow-hidden bg-[#050811] ${
                        isPrimary ? "min-h-[18rem] sm:row-span-2 sm:min-h-[27rem]" : "min-h-[10rem]"
                      }`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes={isPrimary ? "(min-width: 1280px) 28rem, 100vw" : "(min-width: 1280px) 18rem, 100vw"}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/18 to-transparent" />
                      <figcaption className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                        <span className="inline-flex rounded-full border border-white/12 bg-black/36 px-3 py-1 text-[0.72rem] font-medium tracking-[0.16em] text-white/86 backdrop-blur-sm">
                          {photo.label}
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:px-1 sm:text-[0.95rem]">
                {t.planCaption}
              </p>
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[minmax(22rem,0.86fr)_minmax(0,1.14fr)] xl:items-start xl:gap-10 2xl:grid-cols-[minmax(24rem,0.78fr)_minmax(0,1.22fr)]">
            <div className="space-y-5 lg:space-y-6 xl:sticky xl:top-20 xl:max-h-[calc(100svh-5.5rem)] xl:max-w-[27rem] xl:overflow-y-auto xl:pr-1">
              <div className="space-y-4">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#7ef6ff]/76">
                  {t.routeEyebrow}
                </p>
                <h3 className="max-w-[11ch] text-pretty text-[clamp(2.15rem,7.8vw,3.7rem)] font-semibold leading-[1] tracking-[-0.04em] text-white sm:leading-[0.97] xl:text-[clamp(2.2rem,2.9vw,3.2rem)] 2xl:text-[3.6rem]">
                  {t.routeTitle}
                </h3>
              </div>

              <div className="ap-tile ap-tile-lg ap-tile-accent px-4 py-5 sm:px-5 sm:py-6 lg:px-6 xl:px-5 xl:py-5 2xl:px-6 2xl:py-6">
                <div className="grid gap-3 md:grid-cols-[auto_minmax(0,1fr)] md:items-end xl:grid-cols-1 2xl:grid-cols-[auto_minmax(0,1fr)]">
                  <p className="text-[clamp(2.95rem,13vw,4.15rem)] font-semibold leading-none text-white">
                    {activeStep.number}
                  </p>
                  <div className="space-y-2">
                    <p className={`font-semibold text-white ${getActiveStepTitleClasses(activeStep.title)}`}>
                      {activeStep.title}
                    </p>
                    <p className="text-[clamp(0.92rem,2.65vw,1rem)] leading-relaxed text-white/68">
                      {activeStep.summary}
                    </p>
                  </div>
                </div>
                <div className="mt-5 h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#7ef6ff_0%,#f85d7e_100%)] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-4 grid auto-rows-fr grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
                  {t.route.map((step, index) => {
                    const isActive = index === activeIndex;
                    const isSeen = seenSet.has(index);

                    return (
                      <div
                        key={step.number}
                        className={`ap-tile ap-tile-sm ap-tile-interactive flex h-full min-h-[5.6rem] flex-col overflow-hidden px-2.5 py-2.5 text-left transition-all duration-300 sm:min-h-[5.9rem] sm:px-3 ${
                          isActive ? "is-active" : isSeen ? "opacity-80" : "opacity-45"
                        }`}
                      >
                        <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-white/62">
                          {step.number}
                        </p>
                        <p
                          className={`mt-1.5 max-w-full text-pretty break-words text-white/74 ${getStepBadgeTitleClasses(step.title)}`}
                        >
                          {step.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute bottom-8 left-[0.55rem] top-8 w-px bg-[linear-gradient(180deg,rgba(126,246,255,0.22)_0%,rgba(255,255,255,0.08)_60%,rgba(248,93,126,0.16)_100%)] sm:left-[0.7rem]" />
              <div className="space-y-5 sm:space-y-6">
                {t.route.map((step, index) => (
                  <RouteStepCard
                    key={step.number}
                    step={step}
                    index={index}
                    isActive={index === activeIndex}
                    isSeen={seenSet.has(index)}
                    setRef={setStepRef(index)}
                  />
                ))}
              </div>
            </div>
          </section>

          <Card title={t.galleryTitle} titleCentered titleDivider dense motion="off" className="overflow-hidden">
            <p className="ap-type-section-body mx-auto max-w-3xl text-center">{t.galleryIntro}</p>
            <div className="mt-6">
              <TourLineGalleryRow items={t.galleryItems} />
            </div>
          </Card>

          <Card id="film-path-tickets" title={t.ticketsTitle} titleCentered titleDivider dense motion="off">
            <p className="ap-type-section-body mx-auto max-w-3xl text-center">{t.ticketsIntro}</p>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2 xl:grid-cols-3">
              {t.ticketsOptions.map((option) => (
                <div
                  key={option.title}
                  className="ticket-card ap-tile group flex h-full flex-col rounded-3xl text-white/90"
                >
                  <div className="ticket-card-top">
                    <span className="ticket-card-badge">{option.badge}</span>
                  </div>
                  <div className="ticket-card-content flex h-full flex-col p-5 text-center sm:p-6">
                    <h3 className="ticket-card-title text-xl font-semibold text-white sm:text-2xl">
                      {option.title}
                    </h3>
                    <p className="ticket-card-subtitle mt-2 text-sm text-white/75 sm:text-base">
                      {option.subtitle}
                    </p>
                    <div className="ticket-card-divider mt-6" />
                    <ul className="ticket-list-panel mx-auto mb-8 mt-5 max-w-sm space-y-3 text-left text-sm text-white/75">
                      {option.details.map((detail) => (
                        <li key={detail} className="ticket-detail flex gap-3">
                          <span className="ticket-detail-dot mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4fcfde]" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="ticket-price-block mt-auto pt-7">
                      <p className="ticket-price-label text-[0.7rem] uppercase tracking-[0.25em] text-white/60">
                        {option.priceLabel ?? t.ticketsPriceLabel}
                      </p>
                      <p className="ticket-price mt-2 text-2xl font-bold text-amber-200 sm:text-3xl">
                        {option.price ?? t.ticketsPrice}
                      </p>
                      <div className="mt-6 flex justify-center">
                        <PrimaryButton
                          href={buildBookingPath(loc, {
                            category: FILM_PATH_BOOKING_CATEGORY,
                            service: option.bookingServiceName,
                            quantity: option.bookingQuantity,
                          })}
                          size="md"
                          className="ticket-pill ring-[color:rgba(240,60,100,0.55)]"
                        >
                          {t.ticketsButton}
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
