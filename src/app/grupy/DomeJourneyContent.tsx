"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BookingLink from "@/app/components/BookingLink";
import Image from "next/image";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import TourLineGalleryRow from "@/app/components/TourLineGalleryRow";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  FILM_PATH_BOOKING_SERVICES,
  eduBookingHref,
  bookingHomeHref,
} from "@/lib/booking";
import { PROMO_PACKAGES } from "@/lib/promoPackages";
import { AllAttractionsBundleBar } from "@/app/components/AllAttractionsBundleBar";
import { type Locale } from "@/lib/localizedRoutes";
import { SolarIcon } from "@/app/components/SolarIcon";

// Ta sama treść obsługuje dwie podstrony:
//  - "groups"     → /grupy: pełny program "Ścieżka filmowa" dla grup + formularz
//                    rezerwacji z preselekcją kategorii "Bilet grupowy".
//  - "individual" → /atrakcje/wejdz-pod-kopule: ta sama trasa pod nazwą
//                    "FILMWORLD", bez biletu grupowego i bez formularza.
type Audience = "groups" | "individual";


// Nazwa indywidualnej atrakcji (grupowa wersja zostaje "Ścieżką filmową").
const INDIVIDUAL_HERO_TITLE: Record<Locale, string> = {
  pl: "FILMWORLD",
  en: "FILMWORLD",
  pt: "FILMWORLD",
  de: "FILMWORLD",
  zh: "FILMWORLD",
};

const GROUP_FORM_COPY: Record<Locale, { title: string; intro: string }> = {
  pl: {
    title: "Zarezerwuj bilet grupowy",
    intro: "Wybierz termin i bilet grupowy w systemie rezerwacji. Zajmie to chwilę.",
  },
  en: {
    title: "Book a group ticket",
    intro: "Pick a date and a group ticket in our booking system. It only takes a moment.",
  },
  pt: {
    title: "Reserva um bilhete de grupo",
    intro: "Escolhe a data e o bilhete de grupo no nosso sistema de reservas. É rápido.",
  },
  de: {
    title: "Gruppenticket buchen",
    intro: "Wählen Sie im Buchungssystem einen Termin und ein Gruppenticket. Das dauert nur einen Moment.",
  },
  zh: {
    title: "预订团体票",
    intro: "在预订系统中选择日期和团体票，只需片刻即可完成。",
  },
};

// Strona grupowa nie pokazuje kart biletów, tylko krótka informacja o
// wielkości grupy i kontakcie powyżej 50 osób (rezerwacja jest w formularzu).
const GROUP_TICKETS_COPY: Record<
  Locale,
  { title: string; lead: string; bullets: string[]; contactLabel: string }
> = {
  pl: {
    title: "Bilety grupowe",
    lead: "Oferta dla grup zorganizowanych i szkolnych.",
    bullets: [
      "Grupy liczą od 30 do 50 osób w jednej rezerwacji.",
      "Powyżej 50 osób prosimy o indywidualny kontakt. Pomożemy dobrać termin i podzielić grupę.",
    ],
    contactLabel: "Kontakt dla grup 50+",
  },
  en: {
    title: "Group tickets",
    lead: "For organized and school groups.",
    bullets: [
      "Groups of 30 to 50 people on a single booking.",
      "Over 50 people? Please contact us individually and we'll help arrange dates and split the group.",
    ],
    contactLabel: "Contact for 50+ groups",
  },
  pt: {
    title: "Bilhetes de grupo",
    lead: "Para grupos organizados e escolares.",
    bullets: [
      "Grupos de 30 a 50 pessoas por reserva.",
      "Acima de 50 pessoas: contacta-nos individualmente e ajudamos a marcar datas e dividir o grupo.",
    ],
    contactLabel: "Contacto para grupos 50+",
  },
  de: {
    title: "Gruppentickets",
    lead: "Für organisierte Gruppen und Schulklassen.",
    bullets: [
      "Gruppen von 30 bis 50 Personen pro Buchung.",
      "Mehr als 50 Personen? Bitte kontaktieren Sie uns direkt – wir helfen bei der Terminwahl und der Aufteilung der Gruppe.",
    ],
    contactLabel: "Kontakt für Gruppen ab 50 Personen",
  },
  zh: {
    title: "团体票",
    lead: "面向团体客人与学校团体。",
    bullets: [
      "每份预订可容纳 30 至 50 人。",
      "超过 50 人时，请单独与我们联系，我们会协助安排日期并拆分团队。",
    ],
    contactLabel: "50 人以上团体联系",
  },
};

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
  sound: "/galeria/Sciezka_filmowa/webp/dzwieku.webp",
} as const;

const COPY: Record<
  Locale,
  {
    heroTag: string;
    heroTitle: string;
    heroLead: string;
    heroCta: string;
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
    heroTitle: "Lekcja edukacyjna",
    heroLead: "Przejdź trasę zwiedzania, która odsłania kulisy tworzenia filmowych światów.",
    heroCta: "Kup bilet dla grupy",
    planEyebrow: "Ścieżka edukacyjna",
    planTitle: "Poznaj świat filmu",
    planBody:
      "Odświeżona ścieżka edukacyjna została wzbogacona o nowe atrakcje i prowadzi przez historię kina, przestrzenie Alvernia Planet oraz kolejne etapy pracy na planie. To jedna spójna trasa, która łączy wiedzę, scenografię i dźwięk. Oprowadzanie z przewodnikiem trwa 2 godziny, a po jego zakończeniu grupa może korzystać z czasu wolnego na Terminalu — bez limitu czasu. Oprowadzanie odbywa się w języku polskim.",
    planCaption:
      "Od wejścia na trasę, przez epoki kina, aż po pracę na planie filmowym.",
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
        src: OPENING_PHOTO_SOURCES.sound,
        alt: "Studio postprodukcji dźwięku na ścieżce edukacyjnej.",
        label: "Studio dźwięku",
      },
    ],
    stats: [
      { value: "7 etapów", label: "od historii projekcji po zawody filmowe" },
      { value: "2 h", label: "oprowadzania, potem czas wolny na Terminalu" },
      { value: "polski", label: "język oprowadzania" },
    ],
    routeEyebrow: "Trasa zwiedzania",
    routeTitle: "7 etapów na trasie",
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
        number: "04",
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
        number: "07",
        title: "Zawody filmowe",
        summary: "Kto za co odpowiada na planie filmowym.",
        highlights: [
          "kto tworzy ekipę filmową?",
          "za co odpowiada reżyser?",
          "co robi operator?",
          "jak pracuje cała ekipa?",
        ],
      },
    ],
    galleryTitle: "Galeria ścieżki edukacyjnej",
    galleryIntro: "Wybrane kadry z trasy: od korytarza historii po studio dźwięku i scenografię.",
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
      "Bilet normalny kosztuje 79 zł za osobę, a bilet ulgowy 69 zł za osobę. Dla grup szkolnych start to 2 070 zł za 30 osób, a każda kolejna osoba kosztuje 69 zł, maksymalnie do 50 uczestników na rezerwację. Oprowadzanie z przewodnikiem trwa 2 godziny, a po nim grupa może korzystać z czasu wolnego na Terminalu bez limitu czasu. W pakiecie z projekcją K360 całość zajmuje około 2,5 godziny.",
    ticketsPriceLabel: "Cena za osobę",
    ticketsPrice: "79 zł/os. lub 69 zł/os.",
    ticketsButton: "Kup bilet",
    promoTicket: {
      badge: "Pakiet",
      title: "Ścieżka + Kino 360",
      priceLabel: "Cena normalna",
      price: "119,00 zł",
      subtitle:
        "Jeden duży pakiet promocyjny, który łączy zwiedzanie Ścieżki filmowej z projekcją K360.",
      details: ["Około 2,5 godziny łącznie ze zwiedzaniem i seansem"],
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
    heroTitle: "Educational lesson",
    heroLead: "Walk the tour that reveals how film worlds are built.",
    heroCta: "Buy group ticket",
    planEyebrow: "Educational path",
    planTitle: "Discover the world of film",
    planBody:
      "The refreshed educational path has been expanded with new attractions and now leads through moving-image history, Alvernia Planet spaces, and the key stages of film production. It is one cohesive route that combines learning, set design, and sound. The guided tour lasts 2 hours, after which the group can enjoy free time in the Terminal with no time limit. The guided tour is available in Polish.",
    planCaption:
      "From the route entrance and projection eras to on-set work.",
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
        src: OPENING_PHOTO_SOURCES.sound,
        alt: "Sound post-production studio on the educational path.",
        label: "Sound studio",
      },
    ],
    stats: [
      { value: "7 stages", label: "from film history to film professions" },
      { value: "2 h", label: "guided visit, then free time in the Terminal" },
      { value: "Polish", label: "tour language" },
    ],
    routeEyebrow: "Tour route",
    routeTitle: "7 stages on the route",
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
        number: "04",
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
        number: "07",
        title: "Film professions",
        summary: "Who does what on a film set.",
        highlights: [
          "who makes up the film crew?",
          "what does the director do?",
          "what does the director of photography do?",
          "how does the crew work together?",
        ],
      },
    ],
    galleryTitle: "Educational path gallery",
    galleryIntro: "Selected moments from the route, from the history corridor to the sound studio and set details.",
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
      "The standard ticket costs 79 PLN per person and the reduced ticket costs 69 PLN per person. For school groups the starting price is 2,070 PLN for 30 guests, then 69 PLN for each additional guest up to 50 people per booking. The guided tour lasts 2 hours, after which the group can use the Terminal with no time limit. With the K360 Cinema package the full visit takes about 2.5 hours.",
    ticketsPriceLabel: "Price per person",
    ticketsPrice: "79 PLN/person or 69 PLN/person",
    ticketsButton: "Buy tickets",
    promoTicket: {
      badge: "Package",
      title: "Film Path + K360 Cinema",
      priceLabel: "Standard price",
      price: "119.00 PLN",
      subtitle:
        "One large promotional package that combines the Film Path visit with a K360 Cinema.",
      details: ["About 2.5 hours in total with the visit and screening"],
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
    heroTitle: "Aula educativa",
    heroLead: "Percorra a visita que revela como nascem mundos em imagem e som.",
    heroCta: "Comprar bilhete de grupo",
    planEyebrow: "Percurso educativo",
    planTitle: "Descobre o mundo do cinema",
    planBody:
      "O percurso educativo renovado foi enriquecido com novas atrações e conduz pela história da projeção, pelos espaços da Alvernia Planet e pelas etapas centrais do trabalho em set. É uma rota coesa que junta aprendizagem, cenografia e som. A visita guiada dura 2 horas e, no final, o grupo pode usufruir de tempo livre no Terminal, sem limite de tempo. A visita guiada decorre em polaco.",
    planCaption:
      "Da entrada no percurso e das eras de projeção até ao trabalho em set.",
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
        src: OPENING_PHOTO_SOURCES.sound,
        alt: "Estúdio de pós-produção de som no percurso educativo.",
        label: "Estúdio de som",
      },
    ],
    stats: [
      { value: "7 etapas", label: "da história da projeção às profissões de set" },
      { value: "2 h", label: "visita guiada, depois tempo livre no Terminal" },
      { value: "polaco", label: "idioma da visita" },
    ],
    routeEyebrow: "Percurso da visita",
    routeTitle: "7 etapas no percurso",
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
        number: "04",
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
        number: "07",
        title: "Profissões de set",
        summary: "Quem faz o quê num set de filmagem.",
        highlights: [
          "quem faz parte da equipa?",
          "o que faz o realizador?",
          "o que faz o diretor de fotografia?",
          "como trabalha toda a equipa?",
        ],
      },
    ],
    galleryTitle: "Galeria do percurso educativo",
    galleryIntro: "Momentos escolhidos da visita: do corredor da história ao estúdio de som e aos detalhes de cenografia.",
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
      "O bilhete normal custa 79 PLN por pessoa e o bilhete reduzido custa 69 PLN por pessoa. Para grupos escolares, o valor começa em 2 070 PLN para 30 pessoas, depois 69 PLN por cada pessoa adicional até 50 participantes por reserva. A visita guiada dura 2 horas e, depois, o grupo pode usufruir de tempo livre no Terminal sem limite de tempo. No pacote com a cinema K360, a visita completa dura cerca de 2,5 horas.",
    ticketsPriceLabel: "Preço por pessoa",
    ticketsPrice: "79 PLN/pessoa ou 69 PLN/pessoa",
    ticketsButton: "Comprar bilhete",
    promoTicket: {
      badge: "Pacote",
      title: "Percurso + Cinema K360",
      priceLabel: "Preço normal",
      price: "119,00 PLN",
      subtitle:
        "Um grande pacote promocional que junta a visita ao Percurso de filmagem com a projeção no K360.",
      details: ["Cerca de 2,5 horas no total com visita e sessão"],
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
  de: {
    heroTag: "Attraktionen",
    heroTitle: "Bildungsstunde",
    heroLead: "Gehen Sie den Rundgang, der zeigt, wie Filmwelten entstehen.",
    heroCta: "Gruppenticket kaufen",
    planEyebrow: "Bildungspfad",
    planTitle: "Entdecken Sie die Welt des Films",
    planBody:
      "Der erneuerte Bildungspfad wurde um neue Attraktionen erweitert und führt durch die Geschichte des bewegten Bildes, die Räume von Alvernia Planet und die wichtigsten Etappen der Filmproduktion. Es ist eine zusammenhängende Route, die Wissen, Szenenbild und Ton verbindet. Die Führung dauert 2 Stunden, danach kann die Gruppe die freie Zeit im Terminal ohne Zeitlimit genießen. Die Führung findet auf Polnisch statt.",
    planCaption:
      "Vom Eingang der Route über die Projektionsepochen bis zur Arbeit am Set.",
    planPhotos: [
      {
        src: OPENING_PHOTO_SOURCES.entrance,
        alt: "Eingang zum Bildungspfad in Alvernia Planet.",
        label: "Eingang der Route",
      },
      {
        src: OPENING_PHOTO_SOURCES.silent,
        alt: "Station zur Geschichte der Projektion auf dem Bildungspfad.",
        label: "Projektionsepochen",
      },
      {
        src: OPENING_PHOTO_SOURCES.sound,
        alt: "Studio für Ton-Postproduktion auf dem Bildungspfad.",
        label: "Tonstudio",
      },
    ],
    stats: [
      { value: "7 Etappen", label: "von der Filmgeschichte bis zu den Filmberufen" },
      { value: "2 Std.", label: "Führung, danach freie Zeit im Terminal" },
      { value: "Polnisch", label: "Sprache der Führung" },
    ],
    routeEyebrow: "Rundgang",
    routeTitle: "7 Etappen auf der Route",
    route: [
      {
        number: "01",
        title: "Korridor der Geschichte",
        summary: "Ein Gang durch die Epochen der Projektion: stumm, analog und digital.",
        highlights: [
          "was war die Stummfilmzeit?",
          "wie lief analoge Projektion?",
          "was ist digitale Projektion?",
          "was kommt als Nächstes?",
        ],
      },
      {
        number: "02",
        title: "Kosmische Kuppeln",
        summary: "Warum die Kuppeln von Alvernia so besonders aussehen.",
        highlights: [
          "woher kam die Designvision?",
          "warum diese Kuppelform?",
          "was macht den kosmischen Look?",
          "wozu dient das Gebäude?",
        ],
      },
      {
        number: "03",
        title: "Ton-Postproduktion",
        summary: "Woher der Filmton kommt und wie er eine Szene prägt.",
        highlights: [
          "woher kommt der Filmton?",
          "wie entstehen die Dialoge?",
          "wie entstehen die Effekte?",
          "was passiert im Studio?",
        ],
      },
      {
        number: "04",
        title: "Produktion und Actionszenen",
        summary: "Wie Actionszenen geplant und vorbereitet werden.",
        highlights: [
          "welche Produktionsphasen gibt es?",
          "wie bereitet man Actionszenen vor?",
          "wozu dienen die Proben?",
          "wie wird die Sicherheit geplant?",
        ],
      },
      {
        number: "05",
        title: "Szenenbild und Requisiten",
        summary: "Wie Details und Requisiten eine Filmwelt erschaffen.",
        highlights: [
          "wie entsteht das Szenenbild?",
          "welche Rolle haben Requisiten?",
          "was schafft die Filmatmosphäre?",
          "was landet am Set?",
        ],
      },
      {
        number: "06",
        title: "Stars und Produktionen",
        summary: "Bekannte Namen und Produktionen rund um diesen Ort.",
        highlights: [
          "welche Stars waren hier?",
          "welche Filme entstanden hier?",
          "welche Titel stechen hervor?",
          "wofür ist dieser Ort bekannt?",
        ],
      },
      {
        number: "07",
        title: "Filmberufe",
        summary: "Wer am Filmset wofür zuständig ist.",
        highlights: [
          "wer gehört zum Filmteam?",
          "was macht die Regie?",
          "was macht die Kamera?",
          "wie arbeitet das Team zusammen?",
        ],
      },
    ],
    galleryTitle: "Galerie des Bildungspfads",
    galleryIntro: "Ausgewählte Momente der Route: vom Korridor der Geschichte über das Tonstudio bis zu den Setdetails.",
    galleryItems: [
      {
        title: "Eingangskorridor",
        body: "Der Beginn der Route und der erste Schritt in den Bildungspfad.",
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
      },
      {
        title: "Stummfilmzeit",
        body: "Eine Station über die früheste Epoche des Films und des bewegten Bildes.",
        image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
      },
      {
        title: "Analoge Ära",
        body: "Exponate und Materialien aus der Zeit der analogen Aufnahme und Projektion.",
        image: "/galeria/Sciezka_filmowa/webp/era_analogowa_1.webp",
      },
      {
        title: "Digitale Ära",
        body: "Moderne Werkzeuge und Techniken der heutigen Bildproduktion.",
        image: "/galeria/Sciezka_filmowa/webp/era_cyfrowa_1.webp",
      },
      {
        title: "Setdetails",
        body: "Szenische Details und Dekorationen, die die Filmatmosphäre prägen.",
        image: "/galeria/Sciezka_filmowa/webp/K10_ozdoby.webp",
      },
      {
        title: "Bild vom Rundgang",
        body: "Ein Einblick in die Ausstellung entlang der Route.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_1.webp",
      },
      {
        title: "Bild vom Rundgang",
        body: "Eine weitere Station, die die Geschichte des Kinos erzählt.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_2.webp",
      },
      {
        title: "Bild vom Rundgang",
        body: "Setdetails und Requisiten entlang des Weges.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_3.webp",
      },
      {
        title: "Bild vom Rundgang",
        body: "Die Atmosphäre eines arbeitenden Filmsets für Besucher.",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_4.webp",
      },
    ],
    ticketsTitle: "Tickets für den Bildungspfad",
    ticketsIntro:
      "Das reguläre Ticket kostet 79 PLN pro Person, das ermäßigte Ticket 69 PLN pro Person. Für Schulgruppen beginnt der Preis bei 2 070 PLN für 30 Gäste, jede weitere Person kostet 69 PLN, maximal 50 Personen pro Buchung. Die Führung dauert 2 Stunden, danach kann die Gruppe das Terminal ohne Zeitlimit nutzen. Im Paket mit Kino 360 dauert der gesamte Besuch etwa 2,5 Stunden.",
    ticketsPriceLabel: "Preis pro Person",
    ticketsPrice: "79 PLN/Person oder 69 PLN/Person",
    ticketsButton: "Tickets kaufen",
    promoTicket: {
      badge: "Paket",
      title: "Filmpfad + Kino 360",
      priceLabel: "Regulärer Preis",
      price: "119,00 PLN",
      subtitle:
        "Ein großes Aktionspaket, das den Besuch des Filmpfads mit einer Vorstellung im Kino 360 verbindet.",
      details: ["Insgesamt etwa 2,5 Stunden mit Rundgang und Vorstellung"],
      savings: "Sie sparen 9,00 PLN",
      savingsPercent: "7%",
      reducedPriceLabel: "Ermäßigter Preis",
      reducedPrice: "99,00 PLN",
      reducedSavings: "Sie sparen 9,00 PLN",
      reducedSavingsPercent: "8%",
      button: "Paket wählen",
    },
    ticketsOptions: [
      {
        badge: "Regulär",
        title: "Reguläres Ticket",
        subtitle: "1-10 Personen auf einem Ticket",
        details: ["Für Einzelgäste und Familien", "Regulärer Preis pro Person"],
        price: "79 PLN/Person",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
      },
      {
        badge: "Ermäßigt",
        title: "Ermäßigtes Ticket",
        subtitle: "1-10 Personen auf einem Ticket",
        details: ["Für Einzelgäste und Familien", "Ermäßigter Preis pro Person"],
        price: "69 PLN/Person",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.reduced,
      },
      {
        badge: "Gruppe",
        title: "Gruppen-/Schulticket",
        subtitle: "30-50 Personen in der Gruppe",
        details: [
          "Für Schulen und organisierte Gruppen",
          "2 070 PLN für die ersten 30 Gäste",
          "Über 50 Gäste: zwei Buchungen oder Kontakt zu uns",
        ],
        priceLabel: "Gruppenpreis",
        price: "2 070 PLN - 3 450 PLN",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
    videoFallback: "Ihr Browser unterstützt das Video-Element nicht.",
  },
  zh: {
    heroTag: "游玩项目",
    heroTitle: "教育课程",
    heroLead: "走完这条参观路线，揭开电影世界的诞生过程。",
    heroCta: "购买团体票",
    planEyebrow: "教育路线",
    planTitle: "探索电影世界",
    planBody:
      "焕然一新的教育路线新增了多个项目，带您走过影像的历史、Alvernia Planet 的各个空间以及电影制作的关键环节。这是一条完整连贯的路线，把知识、布景与声音融为一体。导览讲解全程 2 小时，结束后团队可在 Terminal 自由活动，不限时间。导览以波兰语进行。",
    planCaption:
      "从路线入口、放映时代，一直到片场工作。",
    planPhotos: [
      {
        src: OPENING_PHOTO_SOURCES.entrance,
        alt: "Alvernia Planet 教育路线的入口。",
        label: "路线入口",
      },
      {
        src: OPENING_PHOTO_SOURCES.silent,
        alt: "教育路线上的放映历史展区。",
        label: "放映时代",
      },
      {
        src: OPENING_PHOTO_SOURCES.sound,
        alt: "教育路线上的声音后期制作工作室。",
        label: "声音工作室",
      },
    ],
    stats: [
      { value: "7 个阶段", label: "从电影历史到电影职业" },
      { value: "2 小时", label: "导览讲解，之后在 Terminal 自由活动" },
      { value: "波兰语", label: "导览语言" },
    ],
    routeEyebrow: "参观路线",
    routeTitle: "7 个阶段的路线",
    route: [
      {
        number: "01",
        title: "历史长廊",
        summary: "穿越默片、胶片与数字三个放映时代。",
        highlights: [
          "什么是默片时代?",
          "胶片放映如何运作?",
          "什么是数字放映?",
          "未来会是什么样?",
        ],
      },
      {
        number: "02",
        title: "宇宙穹顶",
        summary: "Alvernia Planet 的穹顶为何如此独特。",
        highlights: [
          "设计灵感从何而来?",
          "穹顶为何是这种造型?",
          "宇宙感由什么营造?",
          "这座建筑有什么用途?",
        ],
      },
      {
        number: "03",
        title: "声音后期制作",
        summary: "电影声音从何而来，又如何塑造一场戏。",
        highlights: [
          "电影声音从何而来?",
          "对白如何制作?",
          "音效如何创造?",
          "工作室里发生什么?",
        ],
      },
      {
        number: "04",
        title: "制作与动作场面",
        summary: "动作场面如何策划与准备。",
        highlights: [
          "制作分为哪些阶段?",
          "动作场面如何准备?",
          "为什么需要排练?",
          "片场如何保障安全?",
        ],
      },
      {
        number: "05",
        title: "布景与道具",
        summary: "细节与道具如何构建电影世界。",
        highlights: [
          "布景如何制作?",
          "道具起到什么作用?",
          "什么营造电影氛围?",
          "什么最终进入片场?",
        ],
      },
      {
        number: "06",
        title: "明星与作品",
        summary: "与这里相关的知名人物与作品。",
        highlights: [
          "哪些明星来过这里?",
          "哪些作品在此拍摄?",
          "哪些片名最为知名?",
          "这里以什么闻名?",
        ],
      },
      {
        number: "07",
        title: "电影职业",
        summary: "片场上谁负责什么。",
        highlights: [
          "剧组由哪些人组成?",
          "导演负责什么?",
          "摄影指导做什么?",
          "团队如何协同工作?",
        ],
      },
    ],
    galleryTitle: "教育路线相册",
    galleryIntro: "路线上的精选画面：从历史长廊到声音工作室与布景细节。",
    galleryItems: [
      {
        title: "入口长廊",
        body: "路线的起点，也是走进教育路线的第一步。",
        image: "/galeria/Sciezka_filmowa/webp/wejscie_korytarz_k9.webp",
      },
      {
        title: "默片时代",
        body: "展示电影与活动影像最早时期的展区。",
        image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
      },
      {
        title: "胶片时代",
        body: "呈现胶片拍摄与放映时代的展品与资料。",
        image: "/galeria/Sciezka_filmowa/webp/era_analogowa_1.webp",
      },
      {
        title: "数字时代",
        body: "当代影像制作中使用的现代工具与技术。",
        image: "/galeria/Sciezka_filmowa/webp/era_cyfrowa_1.webp",
      },
      {
        title: "布景细节",
        body: "营造电影氛围的布景元素与装饰细节。",
        image: "/galeria/Sciezka_filmowa/webp/K10_ozdoby.webp",
      },
      {
        title: "路线画面",
        body: "路线沿途展览的一瞥。",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_1.webp",
      },
      {
        title: "路线画面",
        body: "另一处讲述电影故事的展区。",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_2.webp",
      },
      {
        title: "路线画面",
        body: "沿途收集的布景细节与道具。",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_3.webp",
      },
      {
        title: "路线画面",
        body: "为参观者呈现的片场氛围。",
        image: "/galeria/Sciezka_filmowa/webp/sciezka_4.webp",
      },
    ],
    ticketsTitle: "教育路线门票",
    ticketsIntro:
      "全价票每人 79 PLN，优惠票每人 69 PLN。学校团体 30 人起价 2 070 PLN，之后每增加一人加收 69 PLN，每份预订最多 50 人。导览讲解全程 2 小时，结束后团队可在 Terminal 自由活动，不限时间。搭配 Kino 360 影院的套票，整个行程约需 2.5 小时。",
    ticketsPriceLabel: "每人价格",
    ticketsPrice: "每人 79 PLN 或 69 PLN",
    ticketsButton: "购买门票",
    promoTicket: {
      badge: "套票",
      title: "电影之路 + Kino 360 影院",
      priceLabel: "全价",
      price: "119.00 PLN",
      subtitle:
        "超值套票，把电影之路的参观与 Kino 360 影院的放映合为一体。",
      details: ["参观加放映合计约 2.5 小时"],
      savings: "立省 9.00 PLN",
      savingsPercent: "7%",
      reducedPriceLabel: "优惠价",
      reducedPrice: "99.00 PLN",
      reducedSavings: "立省 9.00 PLN",
      reducedSavingsPercent: "8%",
      button: "选择套票",
    },
    ticketsOptions: [
      {
        badge: "全价",
        title: "全价票",
        subtitle: "每张票 1-10 人",
        details: ["适合个人与家庭", "每人全价"],
        price: "79 PLN/人",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
      },
      {
        badge: "优惠",
        title: "优惠票",
        subtitle: "每张票 1-10 人",
        details: ["适合个人与家庭", "每人优惠价"],
        price: "69 PLN/人",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.reduced,
      },
      {
        badge: "团体",
        title: "团体票／学校票",
        subtitle: "每团 30-50 人",
        details: [
          "适合学校与团体客人",
          "前 30 人合计 2 070 PLN",
          "超过 50 人：分成两份预订或与我们联系",
        ],
        priceLabel: "团体价",
        price: "2 070 PLN - 3 450 PLN",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
    videoFallback: "您的浏览器不支持视频播放。",
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
    ? "border-[#1893f8] bg-[#1893f8] shadow-[0_0_0_6px_rgba(24,147,248,0.12)]"
    : isSeen
      ? "border-[#1893f8]/55 bg-[#1893f8]/45"
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(24,147,248,0.12),transparent_34%)]" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[#1893f8]/78 sm:text-[0.72rem] sm:tracking-[0.28em]">
                {step.number}
              </p>
              <h4 className="mt-2 max-w-xl text-xl font-semibold leading-tight text-white sm:mt-4 sm:text-2xl lg:text-[2rem]">
                {step.title}
              </h4>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base lg:text-lg">{step.summary}</p>
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

// Kolor wiodący tej podstrony (Alvernia Planet EDU). Trzymany w jednym miejscu,
// żeby dało się go zmienić bez przeszukiwania całego pliku.

export default function DomeJourneyContent({ audience = "groups" }: { audience?: Audience }) {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];
  const isGroups = audience === "groups";

  // Indywidualna podstrona nazywa się "FILMWORLD"; grupowa zostaje
  // "Ścieżką filmową". Bilet grupowy/szkolny pokazujemy tylko grupom.
  const heroTitle = isGroups ? t.heroTitle : INDIVIDUAL_HERO_TITLE[loc];
  const ticketsOptions = isGroups
    ? t.ticketsOptions
    : t.ticketsOptions.filter((option) => option.bookingQuantity === undefined);
  // CTA dni otwartych prowadzi prosto do kasy z wybraną usługą,
  // żeby nauczyciel nie musiał sam szukać bezpłatnego biletu na liście.

  const groupForm = GROUP_FORM_COPY[loc];
  const groupTickets = GROUP_TICKETS_COPY[loc];

  const [flippedSteps, setFlippedSteps] = useState<Record<string, boolean>>({});
  const toggleStep = (key: string) =>
    setFlippedSteps((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    // edu-route-active niesie paletę wydarzenia (czerń/niebieski/żółty) i jest
    // dokładana TYLKO tutaj — /atrakcje/filmworld korzysta z tych samych klas
    // film-path-*, więc bez osobnego zakresu zmieniłby się razem z tą stroną.
    document.body.classList.add("film-path-route-active", "edu-route-active");

    return () => {
      document.body.classList.remove("film-path-route-active", "edu-route-active");
    };
  }, []);

  return (
    <main className="film-path-page edu-page relative z-10 min-h-screen">
      {/* HERO — układ jak na stronie głównej: wideo puszczone na pełną szerokość
          okna (full-bleed przez ujemne marginesy), treść nałożona na wierzchu,
          dół schodzi gradientem w tło strony, więc nie ma widocznej krawędzi
          kadru. Wcześniej wideo siedziało w zamkniętym kafelku. */}
      <section className="relative z-10">
        <div
          className="relative isolate"
          style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
        >
          <div className="relative min-h-[78svh] sm:min-h-[72svh] lg:min-h-[80svh]">
            <AdaptiveVideo
              mp4Src="/grupy/APE_sciezafilmowa.mp4"
              webmSrc="/grupy/APE_sciezafilmowa.webm"
              poster="/grupy/APE_sciezafilmowa_poster.webp"
              className="absolute inset-0 h-full w-full object-cover"
              sizes="100vw"
              fallbackText={t.videoFallback}
              priority
              rootMargin="320px 0px"
              preferPosterOnLowPower
            />
            {/* Zasłona: mocna u góry pod nawigacją, przejrzysta w środku, a u dołu
                pełne tło strony — stąd płynne wejście w kolejną sekcję. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.95) 8%, rgba(0,0,0,0.78) 18%, rgba(0,0,0,0.58) 33%, rgba(0,0,0,0.66) 48%, rgba(0,0,0,0.86) 64%, rgba(0,0,0,0.97) 76%, #000 86%, #000 100%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: "radial-gradient(120% 55% at 50% 6%, #1893f82e 0%, rgba(0,0,0,0) 58%)",
              }}
            />

            <div className="relative flex min-h-[78svh] items-center px-4 py-20 sm:min-h-[72svh] sm:px-6 sm:py-24 lg:min-h-[80svh] lg:px-12">
              {/* Na telefonie kolejność: tytuł -> grafika -> baner wydarzenia (order-*).
                  Od lg wracamy do dwóch kolumn: tekst i baner jeden pod drugim po
                  lewej, grafika po prawej przez oba wiersze — stąd jawne
                  col-start / row-start zamiast polegania na kolejności w DOM. */}
              <div className="ap-shell grid items-center gap-4 sm:gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-x-12 lg:gap-y-6">
                <div className="order-1 text-center ap-page-intro-stagger lg:order-none lg:col-start-1 lg:row-start-1 lg:text-left">
                  <h1 className="ap-type-hero-title force-overlay drop-shadow-[0_2px_28px_rgba(0,0,0,0.6)]">
                    {heroTitle}
                  </h1>
                  <p className="ap-type-hero-subtitle mx-auto mt-4 max-w-2xl force-overlay text-sm sm:text-base lg:mx-0 lg:text-lg">
                    {t.heroLead}
                  </p>

                  {/* CTA prowadzi wprost do listy wydarzeń ścieżki edukacyjnej
                      w Iksorisie (d=4). Stylistyka jak główny przycisk w hero na
                      stronie głównej — ten sam cyan i te same proporcje pigułki. */}
                  <a
                    href={eduBookingHref(loc)}
                    className="ticket-pill mt-7 inline-flex h-[3.25rem] items-center justify-center gap-2.5 rounded-[var(--ap-btn-radius)] px-8 text-sm font-extrabold uppercase tracking-[0.16em] transition hover:-translate-y-px"
                    style={{
                      backgroundColor: "#56ddea",
                      color: "#04222a",
                      boxShadow: "0 6px 22px rgba(86,221,234,0.32)",
                      borderColor: "transparent",
                    }}
                  >
                    {t.heroCta}
                  </a>

                </div>

                {/* Grafika i informacje o wydarzeniu.

                    Na telefonie tworzą JEDEN kafelek — obramowanie i tło niesie
                    ten wrapper. Od lg dostaje `display: contents`, czyli znika z
                    układu, a oba dzieci stają się samodzielnymi komórkami siatki
                    hero (grafika po prawej, informacje pod tekstem po lewej) —
                    dzięki temu desktop wygląda dokładnie tak jak dotąd, a nie
                    trzeba duplikować niczego w DOM. */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 pb-12 sm:px-6 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="ap-shell space-y-12 sm:space-y-16 lg:space-y-20">
          <Card dense motion="off" className="!py-8 sm:!py-12 lg:!py-16">
            <div className="space-y-4 sm:space-y-6 text-center">
              {(() => {
                const trimmed = t.planTitle.trim();
                const firstSpace = trimmed.indexOf(" ");
                const accent = firstSpace > 0 ? trimmed.slice(0, firstSpace) : trimmed;
                const rest = firstSpace > 0 ? trimmed.slice(firstSpace) : "";
                return (
                  <h2 className="mx-auto max-w-5xl text-pretty text-[clamp(1.7rem,1.15rem+2.4vw,3rem)] font-bold leading-[1.07] tracking-[-0.03em] text-white">
                    <span className="text-[#1893f8]">{accent}</span>
                    {rest}
                  </h2>
                );
              })()}
              <p className="mx-auto max-w-4xl text-base sm:text-lg leading-relaxed text-white/80">{t.planBody}</p>
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
                  <p className="mt-1.5 text-xs leading-relaxed text-white/70 sm:mt-2 sm:text-sm">{stat.label}</p>
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
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[#1893f8]/76 sm:text-[0.72rem] sm:tracking-[0.28em]">
                {t.routeEyebrow}
              </p>
              {(() => {
                const trimmed = t.routeTitle.trim();
                const firstSpace = trimmed.indexOf(" ");
                const accent = firstSpace > 0 ? trimmed.slice(0, firstSpace) : trimmed;
                const rest = firstSpace > 0 ? trimmed.slice(firstSpace) : "";
                return (
                  <h3 className="mx-auto max-w-5xl text-pretty text-[clamp(1.7rem,1.15rem+2.4vw,3rem)] font-bold leading-[1.07] tracking-[-0.03em] text-white">
                    <span className="text-[#1893f8]">{accent}</span>
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
                    {/* Front: tylko tytuł */}
                    <div
                      className={`absolute inset-0 flex flex-col px-3.5 py-3 transition-opacity duration-300 ease-out sm:px-5 sm:py-5 ${
                        isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
                      }`}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(24,147,248,0.16),transparent_38%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative flex h-full flex-col">
                          <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1893f8]/40 bg-[#1893f8]/14 text-xs font-bold text-[#1893f8] shadow-[0_0_16px_rgba(24,147,248,0.25)] sm:h-10 sm:w-10 sm:text-base">
                              {step.number}
                            </span>
                            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/45 sm:text-[0.68rem] sm:tracking-[0.24em]">
                              {counter}
                            </span>
                          </div>
                          <h4 className="mt-2 pr-9 text-pretty text-[1.05rem] font-semibold leading-[1.2] tracking-[-0.015em] text-white sm:mt-auto sm:text-[clamp(1.05rem,1.6vw,1.35rem)] sm:leading-[1.15] sm:tracking-[-0.02em]">
                            {step.title}
                          </h4>
                        </div>
                        <span
                          aria-hidden="true"
                          className="absolute bottom-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#1893f8]/40 bg-[#05070d] text-[#1893f8] shadow-[0_0_14px_rgba(24,147,248,0.3)] transition-transform duration-300 group-hover:translate-x-0.5 sm:bottom-4 sm:right-4 sm:h-7 sm:w-7"
                        >
                          <SolarIcon name="chevron-right" size={12} />
                        </span>
                    </div>

                    {/* Back: opis */}
                    <div
                      className={`absolute inset-0 flex flex-col px-3.5 py-3 transition-opacity duration-300 ease-out sm:px-5 sm:py-5 ${
                        isFlipped ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(24,147,248,0.18),transparent_42%)]" />
                        <div className="relative flex h-full flex-col">
                          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#1893f8]/55 sm:text-[0.68rem] sm:tracking-[0.24em]">
                            {counter}
                          </span>
                          <h4 className="mt-1 text-[1rem] font-semibold leading-[1.2] tracking-[-0.015em] text-white sm:mt-1.5 sm:text-[1.05rem]">
                            {step.title}
                          </h4>
                          <p className="mt-1.5 pr-8 text-[0.88rem] leading-[1.45] text-white/80 sm:mt-2 sm:text-[0.88rem]">
                            {step.summary}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="absolute bottom-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#1893f8]/40 bg-[#05070d] text-[#1893f8] shadow-[0_0_14px_rgba(24,147,248,0.3)] transition-transform duration-300 group-hover:-translate-x-0.5 sm:bottom-4 sm:right-4 sm:h-7 sm:w-7"
                        >
                          <SolarIcon name="chevron-left" size={12} />
                        </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleStep(step.number)}
                      aria-pressed={isFlipped}
                      aria-label={step.title}
                      className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1893f8]/60"
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

          <Card
            id="film-path-tickets"
            title={isGroups ? groupTickets.title : t.ticketsTitle}
            titleCentered
            titleDivider
            dense
            motion="off"
          >
            <div className="mt-2 space-y-6 sm:space-y-8">
              {isGroups ? (
                <div className="mx-auto max-w-3xl">
                  <div className="ap-tile ap-tile-lg ap-tile-accent relative overflow-hidden px-5 py-6 text-center sm:px-8 sm:py-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(24,147,248,0.16),transparent_45%)]" />
                    <div className="relative space-y-5">
                      <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                        {groupTickets.lead}
                      </p>
                      <ul className="mx-auto max-w-xl space-y-3 text-left">
                        {groupTickets.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-white/85 sm:text-base">
                            <span className="ticket-detail-dot mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1893f8]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-1">
                        <PrimaryButton
                          href="/kontakt"
                          size="lg"
                          className="ticket-pill whitespace-nowrap ring-[color:rgba(24,147,248,0.55)]"
                        >
                          {groupTickets.contactLabel}
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
              {PROMO_PACKAGES[loc].map((promo) => (
                <AllAttractionsBundleBar key={promo.title} promo={promo} locale={loc} />
              ))}

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
                {ticketsOptions.map((option) => (
                  <article
                    key={option.title}
                    className="ap-tile ap-tile-lg relative flex flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(24,147,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(24,147,248,0.10),transparent_32%)]" />
                    <div className="relative flex h-full flex-col gap-4 sm:gap-5 text-center">
                      <span className="ticket-card-badge mx-auto">{option.badge}</span>
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-pretty text-lg font-semibold leading-tight tracking-[-0.03em] text-white sm:text-xl lg:text-2xl">
                          {option.title}
                        </h3>
                        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/82 sm:text-base">
                          {option.subtitle}
                        </p>
                      </div>
                      <ul className="ticket-list-panel mx-auto w-full max-w-sm space-y-2.5 text-left text-xs text-white/80 sm:space-y-3 sm:text-sm">
                        {option.details.map((detail) => (
                          <li key={detail} className="ticket-detail flex gap-2.5 sm:gap-3">
                            <span className="ticket-detail-dot mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1893f8] sm:mt-2" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto flex flex-col items-center gap-3 pt-2 sm:gap-4">
                        <div className="ap-tile ap-tile-sm w-full px-4 py-3 text-center sm:px-5 sm:py-4">
                          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/70 sm:text-[0.7rem] sm:tracking-[0.25em]">
                            {option.priceLabel ?? t.ticketsPriceLabel}
                          </p>
                          <p className="mt-1 text-2xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-[1.9rem] lg:text-[2.1rem]">
                            {option.price ?? t.ticketsPrice}
                          </p>
                        </div>

                        <PrimaryButton
                          href={buildBookingPath(loc, {
                            service: option.bookingServiceName,
                          })}
                          size="lg"
                          className="ticket-pill w-full whitespace-nowrap ring-[color:rgba(24,147,248,0.55)]"
                        >
                          {t.ticketsButton}
                        </PrimaryButton>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
                </>
              )}
            </div>
          </Card>

          {isGroups ? (
            <div id="grupy-booking" className="scroll-mt-28 space-y-5 sm:space-y-7">
              <div className="space-y-3 text-center">
                <h2 className="mx-auto max-w-4xl text-pretty text-[clamp(1.7rem,1.15rem+2.4vw,3rem)] font-bold leading-[1.07] tracking-[-0.03em] text-white">
                  {groupForm.title}
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                  {groupForm.intro}
                </p>
              </div>
              {/* Osadzony formularz Bookero usunięty — nie potrafił wczytać
                  dostępnych terminów dla usług grupowych („Wystąpił błąd podczas
                  wczytywania dostępnych terminów"). Zamiast pustego kalendarza
                  kierujemy do systemu rezerwacji tym samym przyciskiem co
                  w nagłówku. */}
              <div className="flex justify-center">
                <BookingLink
                  href={bookingHomeHref(loc)}
                  className="ticket-pill inline-flex h-[3.25rem] items-center justify-center gap-2.5 rounded-[var(--ap-btn-radius)] px-8 text-sm font-extrabold uppercase tracking-[0.16em] transition hover:-translate-y-px"
                  style={{
                    backgroundColor: "#56ddea",
                    color: "#04222a",
                    boxShadow: "0 6px 22px rgba(86,221,234,0.32)",
                    borderColor: "transparent",
                  }}
                >
                  {t.heroCta}
                </BookingLink>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
