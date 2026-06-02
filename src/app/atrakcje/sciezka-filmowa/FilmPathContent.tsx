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
  COMBINED_PROMO_BOOKING_CATEGORY,
  FILM_PATH_BOOKING_CATEGORY,
  FILM_PATH_BOOKING_SERVICES,
} from "@/lib/booking";
import { PROMO_PACKAGES } from "@/lib/promoPackages";

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

type PromoTicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  priceLabel: string;
  price: string;
  savings: string;
  savingsPercent: string;
  reducedPriceLabel: string;
  reducedPrice: string;
  reducedSavings: string;
  reducedSavingsPercent: string;
  button: string;
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
  entrance: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
  silent: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
  interactive: "/galeria/Sciezka_filmowa/webp/K9_quizy.webp",
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
    promoTicket: PromoTicketOption;
    ticketsOptions: TicketOption[];
    videoFallback: string;
  }
> = {
  pl: {
    heroTag: "Atrakcje",
    heroTitle: "Ścieżka filmowa",
    heroLead: "Przejdź trasę zwiedzania, która odsłania kulisy tworzenia filmowych światów.",
    planEyebrow: "Ścieżka edukacyjna",
    planTitle: "Poznaj świat filmu",
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
    routeEyebrow: "Trasa zwiedzania",
    routeTitle: "8 etapów na trasie",
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
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
      },
      {
        title: "Era niema",
        body: "Stanowisko poświęcone początkom projekcji i pierwszym ruchomym obrazom.",
        image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
      },
      {
        title: "Era analogowa",
        body: "Materiały i eksponaty pokazujące erę analogowej rejestracji i projekcji.",
        image: "/galeria/Sciezka_filmowa/webp/era_analogowa_1.webp",
      },
      {
        title: "Era cyfrowa",
        body: "Nowoczesne rozwiązania i narzędzia używane w produkcji obrazu.",
        image: "/galeria/Sciezka_filmowa/webp/era_cyfrowa_1.webp",
      },
      {
        title: "Ozdoby i detale",
        body: "Elementy scenografii i dekoracji budujące klimat filmowego świata.",
        image: "/galeria/Sciezka_filmowa/webp/K10_ozdoby.webp",
      },
      {
        title: "Strefa quizów",
        body: "Interaktywne stanowiska, które domykają zwiedzanie aktywnym finałem.",
        image: "/galeria/Sciezka_filmowa/webp/K9_quizy.webp",
      },
      {
        title: "Kadr ze ścieżki",
        body: "Fragment ekspozycji z trasy zwiedzania.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_1.webp",
      },
      {
        title: "Kadr ze ścieżki",
        body: "Kolejne stanowisko prezentujące historię filmu.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_2.webp",
      },
      {
        title: "Kadr ze ścieżki",
        body: "Detale scenografii i rekwizyty zebrane na trasie.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_3.webp",
      },
      {
        title: "Kadr ze ścieżki",
        body: "Atmosfera planu filmowego dla zwiedzających.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_4.webp",
      },
    ],
    ticketsTitle: "Bilety na ścieżkę edukacyjną",
    ticketsIntro:
      "Bilet normalny kosztuje 79 zł za osobę, a bilet ulgowy 69 zł za osobę. Dla grup szkolnych start to 2 070 zł za 30 osób, a każda kolejna osoba kosztuje 69 zł, maksymalnie do 50 uczestników na rezerwację. Sama Ścieżka filmowa trwa około 2,5 godziny, a w pakiecie z projekcją K360 całość zajmuje około 3 godzin.",
    ticketsPriceLabel: "Cena za osobę",
    ticketsPrice: "79 zł/os. lub 69 zł/os.",
    ticketsButton: "Kup bilet",
    promoTicket: {
      badge: "Pakiet",
      title: "Ścieżka + Projekcja K360",
      subtitle:
        "Jeden duży pakiet promocyjny, który łączy zwiedzanie Ścieżki filmowej z projekcją K360.",
      details: ["Około 3 godzin łącznie ze zwiedzaniem i seansem"],
      priceLabel: "Cena normalna",
      price: "119,00 zł",
      savings: "Oszczędzasz 9,00 zł",
      savingsPercent: "7%",
      reducedPriceLabel: "Cena ulgowa",
      reducedPrice: "99,00 zł",
      reducedSavings: "Oszczędzasz 9,00 zł",
      reducedSavingsPercent: "8%",
      button: "Wybierz pakiet",
    },
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
        title: "Bilet grupowy/szkolny",
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
    planTitle: "Discover the world of film",
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
    routeEyebrow: "Tour route",
    routeTitle: "8 stages on the route",
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
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
      },
      {
        title: "Silent era",
        body: "A station focused on the earliest era of film and moving image.",
        image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
      },
      {
        title: "Analog era",
        body: "Displays and materials showing the age of analog projection and recording.",
        image: "/galeria/Sciezka_filmowa/webp/era_analogowa_1.webp",
      },
      {
        title: "Digital era",
        body: "Modern tools and techniques used in contemporary image production.",
        image: "/galeria/Sciezka_filmowa/webp/era_cyfrowa_1.webp",
      },
      {
        title: "Set details",
        body: "Scenic details and decorative elements that shape the film atmosphere.",
        image: "/galeria/Sciezka_filmowa/webp/K10_ozdoby.webp",
      },
      {
        title: "Quiz zone",
        body: "Interactive stations that close the visit with a more active finale.",
        image: "/galeria/Sciezka_filmowa/webp/K9_quizy.webp",
      },
      {
        title: "Frame from the path",
        body: "A glimpse of the exhibition along the route.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_1.webp",
      },
      {
        title: "Frame from the path",
        body: "Another stop telling the story of cinema.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_2.webp",
      },
      {
        title: "Frame from the path",
        body: "Set details and props gathered along the way.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_3.webp",
      },
      {
        title: "Frame from the path",
        body: "The atmosphere of a working film set for visitors.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_4.webp",
      },
    ],
    ticketsTitle: "Educational path tickets",
    ticketsIntro:
      "The standard ticket costs 79 PLN per person and the reduced ticket costs 69 PLN per person. For school groups the starting price is 2,070 PLN for 30 guests, then 69 PLN for each additional guest up to 50 people per booking. The Film Path itself lasts about 2.5 hours, and with the K360 projection package the full visit takes about 3 hours.",
    ticketsPriceLabel: "Price per person",
    ticketsPrice: "79 PLN/person or 69 PLN/person",
    ticketsButton: "Buy tickets",
    promoTicket: {
      badge: "Package",
      title: "Film Path + K360 projection",
      subtitle:
        "One large promotional package that combines the Film Path visit with a K360 projection.",
      details: ["About 3 hours in total with the visit and screening"],
      priceLabel: "Standard price",
      price: "119.00 PLN",
      savings: "You save 9.00 PLN",
      savingsPercent: "7%",
      reducedPriceLabel: "Reduced price",
      reducedPrice: "99.00 PLN",
      reducedSavings: "You save 9.00 PLN",
      reducedSavingsPercent: "8%",
      button: "Choose package",
    },
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
        title: "Group / school ticket",
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
    planTitle: "Descobre o mundo do cinema",
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
    routeEyebrow: "Percurso da visita",
    routeTitle: "8 etapas no percurso",
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
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
      },
      {
        title: "Era muda",
        body: "Uma zona dedicada às origens da projeção e aos primeiros filmes.",
        image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
      },
      {
        title: "Era analógica",
        body: "Exposição de materiais e referências da era analógica da projeção.",
        image: "/galeria/Sciezka_filmowa/webp/era_analogowa_1.webp",
      },
      {
        title: "Era digital",
        body: "Ferramentas e soluções ligadas à produção visual contemporânea.",
        image: "/galeria/Sciezka_filmowa/webp/era_cyfrowa_1.webp",
      },
      {
        title: "Detalhes de cenário",
        body: "Elementos visuais e decorativos que constroem o ambiente visual.",
        image: "/galeria/Sciezka_filmowa/webp/K10_ozdoby.webp",
      },
      {
        title: "Zona de quiz",
        body: "Estações interativas que fecham a visita com um final mais dinâmico.",
        image: "/galeria/Sciezka_filmowa/webp/K9_quizy.webp",
      },
      {
        title: "Imagem do percurso",
        body: "Um excerto da exposição ao longo do percurso.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_1.webp",
      },
      {
        title: "Imagem do percurso",
        body: "Outra paragem que conta a história do cinema.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_2.webp",
      },
      {
        title: "Imagem do percurso",
        body: "Detalhes de cenário e adereços recolhidos pelo caminho.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_3.webp",
      },
      {
        title: "Imagem do percurso",
        body: "A atmosfera de um plano de filmagens para visitantes.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_4.webp",
      },
    ],
    ticketsTitle: "Bilhetes para o percurso educativo",
    ticketsIntro:
      "O bilhete normal custa 79 PLN por pessoa e o bilhete reduzido custa 69 PLN por pessoa. Para grupos escolares, o valor começa em 2 070 PLN para 30 pessoas, depois 69 PLN por cada pessoa adicional até 50 participantes por reserva. O Percurso de filmagem por si só dura cerca de 2,5 horas e, no pacote com a projeção K360, a visita completa dura cerca de 3 horas.",
    ticketsPriceLabel: "Preço por pessoa",
    ticketsPrice: "79 PLN/pessoa ou 69 PLN/pessoa",
    ticketsButton: "Comprar bilhete",
    promoTicket: {
      badge: "Pacote",
      title: "Percurso + Projeção K360",
      subtitle:
        "Um grande pacote promocional que junta a visita ao Percurso de filmagem com a projeção no K360.",
      details: ["Cerca de 3 horas no total com visita e sessão"],
      priceLabel: "Preço normal",
      price: "119,00 PLN",
      savings: "Poupa 9,00 PLN",
      savingsPercent: "7%",
      reducedPriceLabel: "Preço reduzido",
      reducedPrice: "99,00 PLN",
      reducedSavings: "Poupa 9,00 PLN",
      reducedSavingsPercent: "8%",
      button: "Escolher pacote",
    },
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
        title: "Bilhete grupo/escola",
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
    <div className={`relative pl-6 sm:pl-10 ${offsetClass}`}>
      <span
        className={`absolute left-[0.05rem] top-7 h-3 w-3 rounded-full border transition-all duration-500 sm:left-[0.2rem] sm:top-9 sm:h-3.5 sm:w-3.5 ${dotClasses}`}
      />
      <article
        ref={setRef}
        data-step-index={index}
        className={`ap-tile ap-tile-lg ap-tile-interactive relative overflow-hidden px-4 py-5 transition-all duration-500 ease-out sm:px-6 sm:py-6 ${stateClasses}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(126,246,255,0.12),transparent_34%)]" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[#7ef6ff]/78 sm:text-[0.72rem] sm:tracking-[0.28em]">
                {step.number}
              </p>
              <h4 className="mt-2 max-w-xl text-xl font-semibold leading-tight text-white sm:mt-4 sm:text-2xl lg:text-[2rem]">
                {step.title}
              </h4>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/72 sm:mt-4 sm:text-base lg:text-lg">{step.summary}</p>
          <div className="mt-4 grid gap-2.5 sm:mt-6 sm:gap-3 sm:grid-cols-2">
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

  const [flippedSteps, setFlippedSteps] = useState<Record<string, boolean>>({});
  const toggleStep = (key: string) =>
    setFlippedSteps((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    document.body.classList.add("film-path-route-active");

    return () => {
      document.body.classList.remove("film-path-route-active");
    };
  }, []);

  return (
    <main className="film-path-page relative z-10 min-h-screen">
      <section className="relative z-10 px-3 pt-6 sm:px-6 sm:pt-12 lg:px-12 lg:pt-16">
        <div className="ap-shell mb-6 sm:mb-10 lg:mb-12">
          <div className="ap-tile ap-tile-lg relative overflow-hidden">
            <div className="relative aspect-[4/5] sm:aspect-[16/9] bg-black">
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
              <div className="relative flex h-full items-center justify-center p-4 text-center sm:p-8 lg:p-10 force-overlay">
                <div className="space-y-2 ap-page-intro-stagger">
                  <p className="ap-type-kicker force-overlay-muted">{t.heroTag}</p>
                  <h1 className="ap-type-hero-title force-overlay drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {t.heroTitle}
                  </h1>
                  <p className="ap-type-hero-subtitle mx-auto max-w-3xl force-overlay-dim text-sm sm:text-base lg:text-lg">
                    {t.heroLead}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 pb-12 sm:px-6 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="ap-shell space-y-10 sm:space-y-14 lg:space-y-16">
          <Card dense motion="off" className="!py-8 sm:!py-12 lg:!py-16">
            <div className="space-y-4 sm:space-y-6 text-center">
              {(() => {
                const trimmed = t.planTitle.trim();
                const firstSpace = trimmed.indexOf(" ");
                const accent = firstSpace > 0 ? trimmed.slice(0, firstSpace) : trimmed;
                const rest = firstSpace > 0 ? trimmed.slice(firstSpace) : "";
                return (
                  <h2 className="mx-auto max-w-5xl text-pretty text-[clamp(1.85rem,7vw,4.4rem)] font-bold leading-[1.02] tracking-[-0.035em] sm:tracking-[-0.04em] text-white">
                    <span className="text-[#7ef6ff]">{accent}</span>
                    {rest}
                  </h2>
                );
              })()}
              <p className="mx-auto max-w-4xl text-base sm:text-lg leading-relaxed text-white/72">{t.planBody}</p>
            </div>

            <div className="mt-8 grid gap-3 sm:mt-12 lg:mt-16 sm:grid-cols-3">
              {t.stats.map((stat) => (
                <div
                  key={stat.value}
                  className="ap-tile ap-tile-sm px-4 py-3 text-center sm:px-5 sm:py-4"
                >
                  <p className={`whitespace-nowrap font-semibold text-white ${getIntroStatValueClasses(stat.value)}`}>
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60 sm:mt-2 sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
              {t.planPhotos.map((photo) => (
                <figure
                  key={photo.src}
                  className="ap-tile ap-tile-sm group relative overflow-hidden bg-[#050811] min-h-[12rem] sm:min-h-[18rem]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1280px) 20rem, (min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/18 to-transparent" />
                  <figcaption className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
                    <span className="inline-flex rounded-full border border-white/12 bg-black/36 px-2.5 py-1 text-[0.65rem] font-medium tracking-[0.14em] text-white/86 backdrop-blur-sm sm:px-3 sm:text-[0.72rem] sm:tracking-[0.16em]">
                      {photo.label}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-white/70 sm:mt-6 sm:text-sm lg:text-[0.95rem]">
              {t.planCaption}
            </p>
          </Card>

          <Card dense motion="off" className="!py-8 sm:!py-12 lg:!py-16">
            <div className="space-y-4 sm:space-y-6 text-center">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[#7ef6ff]/76 sm:text-[0.72rem] sm:tracking-[0.28em]">
                {t.routeEyebrow}
              </p>
              {(() => {
                const trimmed = t.routeTitle.trim();
                const firstSpace = trimmed.indexOf(" ");
                const accent = firstSpace > 0 ? trimmed.slice(0, firstSpace) : trimmed;
                const rest = firstSpace > 0 ? trimmed.slice(firstSpace) : "";
                return (
                  <h3 className="mx-auto max-w-5xl text-pretty text-[clamp(1.85rem,7vw,4.4rem)] font-bold leading-[1.02] tracking-[-0.035em] sm:tracking-[-0.04em] text-white">
                    <span className="text-[#7ef6ff]">{accent}</span>
                    {rest}
                  </h3>
                );
              })()}
            </div>

            <div className="mt-8 grid auto-rows-fr gap-4 sm:mt-12 sm:gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {t.route.map((step, index) => {
                const isFlipped = Boolean(flippedSteps[step.number]);
                const counter = `${String(index + 1).padStart(2, "0")} / ${String(t.route.length).padStart(2, "0")}`;
                return (
                  <div
                    key={step.number}
                    className="ap-tile ap-tile-sm ap-tile-interactive group relative h-full min-h-[6.5rem] overflow-hidden rounded-2xl sm:min-h-[11rem]"
                  >
                    {/* Front — tylko tytuł */}
                    <div
                      className={`absolute inset-0 flex flex-col px-3.5 py-3 transition-opacity duration-300 ease-out sm:px-5 sm:py-5 ${
                        isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
                      }`}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(126,246,255,0.16),transparent_38%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative flex h-full flex-col">
                          <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#7ef6ff]/40 bg-[#7ef6ff]/14 text-xs font-bold text-[#7ef6ff] shadow-[0_0_16px_rgba(126,246,255,0.25)] sm:h-10 sm:w-10 sm:text-base">
                              {step.number}
                            </span>
                            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/28 sm:text-[0.68rem] sm:tracking-[0.24em]">
                              {counter}
                            </span>
                          </div>
                          <h4 className="mt-2 pr-9 text-pretty text-[1.05rem] font-semibold leading-[1.2] tracking-[-0.015em] text-white sm:mt-auto sm:text-[clamp(1.05rem,1.6vw,1.35rem)] sm:leading-[1.15] sm:tracking-[-0.02em]">
                            {step.title}
                          </h4>
                        </div>
                        <span
                          aria-hidden="true"
                          className="absolute bottom-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#7ef6ff]/40 bg-[#06121a] text-[#7ef6ff] shadow-[0_0_14px_rgba(126,246,255,0.3)] transition-transform duration-300 group-hover:translate-x-0.5 sm:bottom-4 sm:right-4 sm:h-7 sm:w-7"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M4.5 2.5 8 6l-3.5 3.5"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                    </div>

                    {/* Back — opis */}
                    <div
                      className={`absolute inset-0 flex flex-col px-3.5 py-3 transition-opacity duration-300 ease-out sm:px-5 sm:py-5 ${
                        isFlipped ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(126,246,255,0.18),transparent_42%)]" />
                        <div className="relative flex h-full flex-col">
                          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#7ef6ff]/55 sm:text-[0.68rem] sm:tracking-[0.24em]">
                            {counter}
                          </span>
                          <h4 className="mt-1 text-[1rem] font-semibold leading-[1.2] tracking-[-0.015em] text-white sm:mt-1.5 sm:text-[1.05rem]">
                            {step.title}
                          </h4>
                          <p className="mt-1.5 pr-8 text-[0.88rem] leading-[1.45] text-white/75 sm:mt-2 sm:text-[0.88rem]">
                            {step.summary}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="absolute bottom-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#7ef6ff]/40 bg-[#06121a] text-[#7ef6ff] shadow-[0_0_14px_rgba(126,246,255,0.3)] transition-transform duration-300 group-hover:-translate-x-0.5 sm:bottom-4 sm:right-4 sm:h-7 sm:w-7"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M7.5 2.5 4 6l3.5 3.5"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleStep(step.number)}
                      aria-pressed={isFlipped}
                      aria-label={step.title}
                      className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ef6ff]/60"
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title={t.galleryTitle} titleCentered titleDivider dense motion="off" className="overflow-hidden">
            <p className="ap-type-section-body mx-auto max-w-3xl text-center">{t.galleryIntro}</p>
            <div className="mt-6">
              <TourLineGalleryRow items={t.galleryItems} />
            </div>
          </Card>

          <Card id="film-path-tickets" title={t.ticketsTitle} titleCentered titleDivider dense motion="off">
            <div className="mt-2 space-y-6 sm:space-y-8">
              {PROMO_PACKAGES[loc]
                .filter((promo) => promo.category === COMBINED_PROMO_BOOKING_CATEGORY)
                .map((promo) => (
                <article
                  key={promo.title}
                  className="ap-tile ap-tile-lg ap-tile-accent relative overflow-hidden px-4 py-5 sm:px-7 sm:py-7"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,207,222,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(79,207,222,0.10),transparent_32%)]" />
                  <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                    <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
                      <span className="ticket-card-badge mx-auto lg:mx-0">{promo.badge}</span>
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
                          {promo.title}
                        </h3>
                        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/76 sm:text-base lg:mx-0 lg:text-lg">
                          {promo.subtitle}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:justify-start">
                        {promo.details.map((detail) => (
                          <div
                            key={detail}
                            className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs text-white/72 sm:px-4 sm:py-2 sm:text-sm"
                          >
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex w-full flex-col items-center gap-3 sm:gap-4 lg:w-auto lg:items-end">
                      <div className="ap-tile ap-tile-sm w-full max-w-[24rem] px-4 py-3.5 text-center sm:px-5 sm:py-4 lg:text-right">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:text-right">
                          <div>
                            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/55 sm:text-xs">
                              {promo.priceLabel}
                            </p>
                            <p className="mt-1 text-xl font-semibold leading-none tracking-[-0.03em] text-white sm:text-2xl lg:text-[1.75rem]">
                              {promo.price}
                            </p>
                            <p className="mt-1.5 inline-flex flex-wrap items-center gap-1.5 text-[0.65rem] font-semibold leading-tight text-[#8ff3ff] sm:text-[0.72rem]">
                              <span>−{promo.savingsPercent}</span>
                              <span className="text-white/55">{promo.savings}</span>
                            </p>
                          </div>
                          <div className="border-l border-white/10 pl-3 sm:pl-4">
                            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/55 sm:text-xs">
                              {promo.reducedPriceLabel}
                            </p>
                            <p className="mt-1 text-xl font-semibold leading-none tracking-[-0.03em] text-white sm:text-2xl lg:text-[1.75rem]">
                              {promo.reducedPrice}
                            </p>
                            <p className="mt-1.5 inline-flex flex-wrap items-center gap-1.5 text-[0.65rem] font-semibold leading-tight text-[#8ff3ff] sm:text-[0.72rem]">
                              <span>−{promo.reducedSavingsPercent}</span>
                              <span className="text-white/55">{promo.reducedSavings}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <PrimaryButton
                        href={buildBookingPath(loc, { category: promo.category })}
                        size="lg"
                        className="ticket-pill w-full whitespace-nowrap ring-[color:rgba(79,207,222,0.55)] sm:w-auto sm:min-w-[13rem]"
                      >
                        {promo.button}
                      </PrimaryButton>
                    </div>
                  </div>
                </article>
              ))}

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
                {t.ticketsOptions.map((option) => (
                  <article
                    key={option.title}
                    className="ap-tile ap-tile-lg relative flex flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,207,222,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(79,207,222,0.10),transparent_32%)]" />
                    <div className="relative flex h-full flex-col gap-4 sm:gap-5 text-center">
                      <span className="ticket-card-badge mx-auto">{option.badge}</span>
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-pretty text-lg font-semibold leading-tight tracking-[-0.03em] text-white sm:text-xl lg:text-2xl">
                          {option.title}
                        </h3>
                        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/76 sm:text-base">
                          {option.subtitle}
                        </p>
                      </div>
                      <ul className="ticket-list-panel mx-auto w-full max-w-sm space-y-2.5 text-left text-xs text-white/75 sm:space-y-3 sm:text-sm">
                        {option.details.map((detail) => (
                          <li key={detail} className="ticket-detail flex gap-2.5 sm:gap-3">
                            <span className="ticket-detail-dot mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4fcfde] sm:mt-2" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto flex flex-col items-center gap-3 pt-2 sm:gap-4">
                        <div className="ap-tile ap-tile-sm w-full px-4 py-3 text-center sm:px-5 sm:py-4">
                          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/60 sm:text-[0.7rem] sm:tracking-[0.25em]">
                            {option.priceLabel ?? t.ticketsPriceLabel}
                          </p>
                          <p className="mt-1 text-2xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-[1.9rem] lg:text-[2.1rem]">
                            {option.price ?? t.ticketsPrice}
                          </p>
                        </div>

                        <PrimaryButton
                          href={buildBookingPath(loc, {
                            category: FILM_PATH_BOOKING_CATEGORY,
                            service: option.bookingServiceName,
                            quantity: option.bookingQuantity,
                          })}
                          size="lg"
                          className="ticket-pill w-full whitespace-nowrap ring-[color:rgba(79,207,222,0.55)]"
                        >
                          {t.ticketsButton}
                        </PrimaryButton>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
