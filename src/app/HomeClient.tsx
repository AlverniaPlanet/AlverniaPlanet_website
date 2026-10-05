"use client";

import { Fragment, memo, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import BookingLink from "@/app/components/BookingLink";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import FullscreenHero from "@/app/components/FullscreenHero";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { SolarIcon } from "./components/SolarIcon";
import { NEWS_COPY, type NewsSection } from "@/app/components/newsContent";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { FAQ_COPY, type FaqCopy } from "@/app/components/faqContent";
import { waitForImagesReady } from "@/app/components/waitForImagesReady";
import {
  bookingHomeHref,
  heroBookingHref as heroBookingHrefFor,
  buildBookingPath,
  FILM_PATH_BOOKING_SERVICES,
  K360_BOOKING_SERVICES,
  MARS_BOOKING_SERVICES,
} from "@/lib/booking";
import { PROMO_PACKAGES } from "@/lib/promoPackages";
import { getSitePaths, getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import RepertoireSection from "./atrakcje/kino-360/RepertoireSection";
import HomeSectionHeader from "./components/HomeSectionHeader";

type AttractionItem = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  accent?: "red" | "orange" | "cyan";
  highlightLabel?: string;
  cornerLabel?: string;
  featured?: boolean;
};

type TicketOption = {
  badge: string;
  title: string;
  titleLead?: string;
  titleHighlight?: string;
  bgColor?: string;
  subtitle: string;
  details: string[];
  priceLabel?: string;
  price?: string;
  reducedPriceLabel?: string;
  reducedPrice?: string;
  bookingServiceName?: string;
  bookingQuantity?: number;
  accent?: "red" | "orange" | "cyan";
  href?: string;
  ctaLabel?: string;
  comingSoon?: boolean;
};

type PromoTicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  priceLabel: string;
  price: string;
  savings: string;
  savingsBadge: string;
  button: string;
};

type TicketSection = {
  title: string;
  intro: string;
  headerCta: string;
  headerCtaSub: string;
  priceLabel: string;
  price: string;
  cta: string;
  ctaHref: string;
  promoTicket: PromoTicketOption;
  options: TicketOption[];
  // Nowa sekcja „Bilety" (portale + panel pakietowy).
  heading: string;
  subheading: string;
  chooseLabel: string;
  reducedPrefix: string;
  normalPrefix: string;
  separatelyLabel: string;
  bestPriceLabel: string;
  bundleTitle: string;
  bundleTagline: string;
  packageCta: string;
};

type PromoTile = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  images: string[];
  imageAlt: string;
};

type HeroPromo = {
  message: string;
  cta: string;
  href: string;
  tone: "cool" | "hot";
  previewMedia?: "k360";
};

type HomeCopy = {
  heroTitleLead: string;
  heroTitleAccent: string;
  heroTitleTail: string;
  heroTaglineLead: string;
  heroTaglineAccent: string;
  heroSecondaryCta: string;
  heroScrollHint: string;
  heroPromos: HeroPromo[];
  attractions: {
    title: string;
    intro: string;
    items: AttractionItem[];
  };
  tickets: TicketSection;
  eventsPromo: PromoTile;
  news: NewsSection;
};

const HOME_COPY: Record<Locale, HomeCopy> = {
  pl: {
    // Hero prowadzi KORZYŚCIĄ, nie nazwą jednej z trzech atrakcji.
    // Wcześniej H1 brzmiał „Kino 360", a podtytuł „Witamy!" — gość z reklamy
    // budował model „to tylko kino", co zaniżało wartość pakietu. Marka wchodzi
    // do H1 (SEO brandowe), plakietka niesie sygnał „kompleks na cały dzień",
    // a lokalizacja i cena wejścia są widoczne od razu.
    // Nazwa atrakcji wyróżniona WERSALIKAMI wewnątrz zdania — niesie rozpoznanie
    // marki, nie odbierając zdaniu roli obietnicy. Korzyści zwinięte do jednej
    // linii razem z ceną wejścia, zamiast osobnego rzędu plakietek.
    heroTitleLead: "Przeżyj największe",
    heroTitleAccent: "KINO 360°",
    heroTitleTail: "w Europie!",
    heroTaglineLead: "Odkryj Kino 360°, weź udział w misji na Marsa i zajrzyj za kulisy świata filmu.",
    heroTaglineAccent: "Bilety od 39 zł.",
    heroSecondaryCta: "Zobacz atrakcje",
    heroScrollHint: "Odkryj Alvernia Planet",
    heroPromos: [
      {
        message: "Przeżyj kino K360",
        cta: "Zobacz kino K360",
        href: "/atrakcje/kino-360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Atrakcje",
      intro: "Trzy filmowe atrakcje dla całej rodziny, coś dla małych odkrywców i dorosłych kinomanów.",
      items: [
        {
          title: "FILMWORLD",
          description:
            "Zakulisowa trasa przez plany zdjęciowe, rekwizyty i technologię używaną w produkcjach filmowych.",
          cta: "Poznaj ścieżkę filmową",
          href: "/atrakcje/filmworld",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Elementy scenografii na ścieżce filmowej",
          accent: "cyan",
          cornerLabel: "Poznaj",
        },
        {
          title: "Kino 360",
          description:
            "NAJWIĘKSZE kino 360 w Europie. Kopuła o średnicy 48 metrów otacza widza obrazem i dźwiękiem ze wszystkich stron.",
          cta: "Zobacz kino K360",
          href: "/atrakcje/kino-360",
          image: "/galeria/K360/K360_2.webp",
          imageAlt: "Kadr z kina K360, fulldome na całej kopule",
          accent: "red",
          highlightLabel: "Największe w Europie",
          cornerLabel: "Przeżyj",
          featured: true,
        },
        {
          title: "MARS",
          description:
            "Wciel się w bohatera własnej misji i nakręć krótki film na profesjonalnej scenografii marsjańskiej.",
          cta: "Odkryj MARS",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronauta na powierzchni Marsa, MARS w Alvernia Planet",
          accent: "orange",
          cornerLabel: "Zagraj",
        },
      ],
    },
    tickets: {
      title: "Bilety",
      intro:
        "Wybierz atrakcję i kup bilet bezpośrednio na jej podstronie.",
      heading: "Wybierz swoją przygodę",
      subheading: "Jedna atrakcja czy cały filmowy dzień?",
      chooseLabel: "Wybieram",
      reducedPrefix: "ulgowy",
      normalPrefix: "normalny",
      separatelyLabel: "osobno",
      bestPriceLabel: "Najlepsza cena",
      bundleTitle: "Zgarnij całą trójkę!",
      bundleTagline: "jeden dzień • jeden bilet",
      packageCta: "Kup pakiet",
      headerCta: "Trzy atrakcje, jeden krok do rezerwacji",
      headerCtaSub: "K360, MARS i FILMWORLD. Każda ma własną sprzedaż biletów.",
      priceLabel: "Cena za osobę",
      price: "79 zł/os. lub 69 zł/os.",
      cta: "Kup bilet",
      ctaHref: bookingHomeHref("pl"),
      promoTicket: {
        badge: "Pakiet",
        title: "Ścieżka + Kino 360",
        subtitle:
          "Jeden duży pakiet promocyjny, który łączy zwiedzanie Ścieżki filmowej z projekcją K360.",
        details: ["Około 2,5 godziny łącznie ze zwiedzaniem i seansem"],
        priceLabel: "Cena promocyjna",
        price: "119,00 zł",
        savings: "Oszczędzasz 9,00 zł",
        savingsBadge: "7% taniej",
        button: "Wybierz pakiet",
      },
      options: [
        {
          badge: "K360",
          title: "Kino 360",
          subtitle: "Największe kino 360 w Europie, kopuła 48 m.",
          details: ["Cena regularna za osobę"],
          price: "49 zł/os.",
          reducedPriceLabel: "Cena ulgowa",
          reducedPrice: "39 zł/os.",
          bookingServiceName: K360_BOOKING_SERVICES.normal,
          accent: "red",
          ctaLabel: "Kup bilet",
        },
        {
          badge: "MARS",
          title: "MARS",
          subtitle: "Wcielasz się w astronautę i kręcisz własny film SF.",
          details: ["Cena regularna za osobę"],
          price: "69 zł/os.",
          reducedPriceLabel: "Cena ulgowa",
          reducedPrice: "59 zł/os.",
          bookingServiceName: MARS_BOOKING_SERVICES.normal,
          accent: "orange",
          ctaLabel: "Wybierz bilet",
        },
        {
          badge: "Kopuła",
          title: "FILMWORLD",
          subtitle: "Ścieżka edukacyjna odkrywająca kulisy powstawania filmu.",
          details: ["Cena regularna za osobę"],
          price: "79 zł/os.",
          reducedPriceLabel: "Cena ulgowa",
          reducedPrice: "69 zł/os.",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
          accent: "cyan",
          ctaLabel: "Kup bilet",
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Wydarzenia",
      title: "Wyjątkowe miejsce na Twój event",
      description:
        "Wyjątkowe przestrzenie do konferencji, gal i premier. Sprawdź możliwości organizacji eventów w Alvernia Planet.",
      cta: "Odkryj wydarzenia",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Przestrzeń eventowa Alvernia Planet podczas konferencji",
    },
    news: NEWS_COPY.pl,
  },
  en: {
    heroTitleLead: "Experience the largest",
    heroTitleAccent: "360° CINEMA",
    heroTitleTail: "in Europe!",
    heroTaglineLead: "Discover the 360° Cinema, join a mission to Mars and step behind the scenes of film.",
    heroTaglineAccent: "Tickets from 39 PLN.",
    heroSecondaryCta: "See attractions",
    heroScrollHint: "Discover Alvernia Planet",
    heroPromos: [
      {
        message: "Experience the K360 Cinema",
        cta: "See K360 Cinema",
        href: "/atrakcje/kino-360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Attractions",
      intro: "Three cinematic attractions for the whole family, something for young explorers and grown-up film fans alike.",
      items: [
        {
          title: "FILMWORLD",
          description:
            "A behind-the-scenes walk through sets, props, and the technology that powers productions.",
          cta: "Explore the film path",
          href: "/atrakcje/filmworld",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Film set elements on the film path",
          accent: "cyan",
          cornerLabel: "Discover",
        },
        {
          title: "K360 Cinema",
          description:
            "EUROPE'S LARGEST 360° cinema. A 48-metre dome wraps you in image and sound from every direction.",
          cta: "See K360 Cinema",
          href: "/atrakcje/kino-360",
          image: "/galeria/K360/K360_2.webp",
          imageAlt: "Frame from the K360 Cinema, fulldome across the ceiling",
          accent: "red",
          highlightLabel: "Largest in Europe",
          cornerLabel: "Experience",
          featured: true,
        },
        {
          title: "MARS",
          description:
            "Step into your own mission and shoot a short film on a professional Martian set.",
          cta: "Discover MARS",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronaut on the Martian surface, MARS at Alvernia Planet",
          accent: "orange",
          cornerLabel: "Play",
        },
      ],
    },
    tickets: {
      title: "Tickets",
      intro: "Pick an attraction and buy tickets directly on its page.",
      heading: "Choose your adventure",
      subheading: "One attraction or a full day of cinema?",
      chooseLabel: "I choose this",
      reducedPrefix: "reduced",
      normalPrefix: "standard",
      separatelyLabel: "separately",
      bestPriceLabel: "Best price",
      bundleTitle: "Get all three!",
      bundleTagline: "one day • one ticket",
      packageCta: "Buy the bundle",
      headerCta: "Three attractions, one step to booking",
      headerCtaSub: "K360, MARS and FILMWORLD. Each has its own ticket flow.",
      priceLabel: "Price per person",
      price: "79 PLN/person or 69 PLN/person",
      cta: "Buy tickets",
      ctaHref: bookingHomeHref("en"),
      promoTicket: {
        badge: "Package",
        title: "Film Path + K360 Cinema",
        subtitle:
          "One large promotional package that combines the Film Path visit with a K360 Cinema.",
        details: ["About 2.5 hours in total with the visit and screening"],
        priceLabel: "Promo price",
        price: "119.00 PLN",
        savings: "You save 9.00 PLN",
        savingsBadge: "7% off",
        button: "Choose package",
      },
      options: [
        {
          badge: "K360",
          title: "K360 Cinema",
          subtitle: "Europe's largest 360° cinema, a 48-metre dome.",
          details: ["Standard price per person"],
          price: "49 PLN/person",
          reducedPriceLabel: "Reduced price",
          reducedPrice: "39 PLN/person",
          bookingServiceName: K360_BOOKING_SERVICES.normal,
          accent: "red",
          ctaLabel: "Buy tickets",
        },
        {
          badge: "MARS",
          title: "MARS",
          subtitle: "Play the astronaut and shoot your own sci-fi short.",
          details: ["Standard price per person"],
          price: "69 PLN/person",
          reducedPriceLabel: "Reduced price",
          reducedPrice: "59 PLN/person",
          bookingServiceName: MARS_BOOKING_SERVICES.normal,
          accent: "orange",
          ctaLabel: "Choose ticket",
        },
        {
          badge: "Dome",
          title: "FILMWORLD",
          subtitle: "An educational trail revealing how films are made.",
          details: ["Standard price per person"],
          price: "79 PLN/person",
          reducedPriceLabel: "Reduced price",
          reducedPrice: "69 PLN/person",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
          accent: "cyan",
          ctaLabel: "Buy tickets",
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Events",
      title: "A unique venue for your event",
      description:
        "Exceptional spaces for conferences, galas, and premieres. Discover what events you can host at Alvernia Planet.",
      cta: "Explore events",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Event space at Alvernia Planet during a conference",
    },
    news: NEWS_COPY.en,
  },
  pt: {
    heroTitleLead: "Vive o maior",
    heroTitleAccent: "CINEMA 360°",
    heroTitleTail: "da Europa!",
    heroTaglineLead: "Descobre o Cinema 360°, participa numa missão a Marte e espreita os bastidores do cinema.",
    heroTaglineAccent: "Bilhetes desde 39 PLN.",
    heroSecondaryCta: "Ver atrações",
    heroScrollHint: "Descobre a Alvernia Planet",
    heroPromos: [
      {
        message: "Vive a cinema K360",
        cta: "Ver a cinema K360",
        href: "/atrakcje/kino-360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Atrações",
      intro: "Três atrações num só sítio: descobre os bastidores do cinema, vê um filme dentro de uma cúpula gigante e protagoniza a tua cena num plano real.",
      items: [
        {
          title: "FILMWORLD",
          description:
            "Uma visita aos bastidores com cenários, adereços e tecnologia usada nas produções.",
          cta: "Conheça o percurso",
          href: "/atrakcje/filmworld",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Elementos de cenário no percurso de filmagem",
          accent: "cyan",
          cornerLabel: "Descobre",
        },
        {
          title: "Cinema K360",
          description:
            "O MAIOR cinema 360° da Europa. Uma cúpula de 48 metros envolve-te em imagem e som por todos os lados.",
          cta: "Ver a cinema K360",
          href: "/atrakcje/kino-360",
          image: "/galeria/K360/K360_2.webp",
          imageAlt: "Imagem da cinema K360, fulldome em toda a cúpula",
          accent: "red",
          highlightLabel: "O maior da Europa",
          cornerLabel: "Vive",
          featured: true,
        },
        {
          title: "MARS",
          description:
            "Encarna o herói da tua missão e filma uma curta numa cenografia marciana profissional.",
          cta: "Descobrir MARS",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronauta na superfície de Marte, MARS na Alvernia Planet",
          accent: "orange",
          cornerLabel: "Joga",
        },
      ],
    },
    tickets: {
      title: "Bilhetes",
      intro: "Escolhe uma atração e compra o bilhete diretamente na sua página.",
      heading: "Escolhe a tua aventura",
      subheading: "Uma atração ou um dia inteiro de cinema?",
      chooseLabel: "Escolho",
      reducedPrefix: "reduzido",
      normalPrefix: "normal",
      separatelyLabel: "em separado",
      bestPriceLabel: "Melhor preço",
      bundleTitle: "Leva as três!",
      bundleTagline: "um dia • um bilhete",
      packageCta: "Comprar pacote",
      headerCta: "Três atrações, um passo até à reserva",
      headerCtaSub: "K360, MARS e FILMWORLD, cada um com a sua venda.",
      priceLabel: "Preço por pessoa",
      price: "79 PLN/pessoa ou 69 PLN/pessoa",
      cta: "Comprar bilhetes",
      ctaHref: bookingHomeHref("pt"),
      promoTicket: {
        badge: "Pacote",
        title: "Percurso + Cinema K360",
        subtitle:
          "Um grande pacote promocional que junta a visita ao Percurso de filmagem com a projeção no K360.",
        details: ["Cerca de 2,5 horas no total com visita e sessão"],
        priceLabel: "Preço promocional",
        price: "119,00 PLN",
        savings: "Poupa 9,00 PLN",
        savingsBadge: "7% menos",
        button: "Escolher pacote",
      },
      options: [
        {
          badge: "K360",
          title: "Cinema K360",
          subtitle: "O maior cinema 360° da Europa, cúpula de 48 m.",
          details: ["Preço normal por pessoa"],
          price: "49 PLN/pessoa",
          reducedPriceLabel: "Preço reduzido",
          reducedPrice: "39 PLN/pessoa",
          bookingServiceName: K360_BOOKING_SERVICES.normal,
          accent: "red",
          ctaLabel: "Comprar bilhete",
        },
        {
          badge: "MARS",
          title: "MARS",
          subtitle: "Encarnas um astronauta e filmas a tua curta de FC.",
          details: ["Preço normal por pessoa"],
          price: "69 PLN/pessoa",
          reducedPriceLabel: "Preço reduzido",
          reducedPrice: "59 PLN/pessoa",
          bookingServiceName: MARS_BOOKING_SERVICES.normal,
          accent: "orange",
          ctaLabel: "Escolher bilhete",
        },
        {
          badge: "Cúpula",
          title: "FILMWORLD",
          subtitle: "Um percurso educativo que revela os bastidores da produção de um filme.",
          details: ["Preço normal por pessoa"],
          price: "79 PLN/pessoa",
          reducedPriceLabel: "Preço reduzido",
          reducedPrice: "69 PLN/pessoa",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
          accent: "cyan",
          ctaLabel: "Comprar bilhete",
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Eventos",
      title: "Um espaço único para o seu evento",
      description:
        "Espaços excepcionais para conferências, galas e estreias. Descubra o potencial da Alvernia Planet para eventos.",
      cta: "Explorar eventos",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Espaço de eventos da Alvernia Planet durante uma conferência",
    },
    news: NEWS_COPY.pt,
  },
  de: {
    heroTitleLead: "Erleben Sie das größte",
    heroTitleAccent: "360°-KINO",
    heroTitleTail: "in Europa!",
    heroTaglineLead: "Entdecken Sie das Kino 360, starten Sie zu einer Mission zum Mars und werfen Sie einen Blick hinter die Kulissen des Films.",
    heroTaglineAccent: "Tickets ab 39 PLN.",
    heroSecondaryCta: "Attraktionen ansehen",
    heroScrollHint: "Alvernia Planet entdecken",
    heroPromos: [
      {
        message: "Erleben Sie das Kino 360",
        cta: "Kino 360 ansehen",
        href: "/atrakcje/kino-360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Attraktionen",
      intro: "Drei filmische Attraktionen für die ganze Familie – etwas für kleine Entdecker und für erwachsene Filmfans.",
      items: [
        {
          title: "FILMWORLD",
          description:
            "Ein Rundgang hinter den Kulissen: Filmsets, Requisiten und die Technik, die Produktionen möglich macht.",
          cta: "Filmpfad entdecken",
          href: "/atrakcje/filmworld",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "Kulissenelemente auf dem Filmpfad",
          accent: "cyan",
          cornerLabel: "Entdecken",
        },
        {
          title: "Kino 360",
          description:
            "EUROPAS GRÖSSTES 360°-Kino. Eine Kuppel mit 48 Metern Durchmesser umhüllt Sie mit Bild und Ton aus allen Richtungen.",
          cta: "Kino 360 ansehen",
          href: "/atrakcje/kino-360",
          image: "/galeria/K360/K360_2.webp",
          imageAlt: "Aufnahme aus dem Kino 360, Fulldome auf der gesamten Kuppel",
          accent: "red",
          highlightLabel: "Größtes in Europa",
          cornerLabel: "Erleben",
          featured: true,
        },
        {
          title: "MARS",
          description:
            "Schlüpfen Sie in die Hauptrolle Ihrer eigenen Mission und drehen Sie einen Kurzfilm in einer professionellen Marskulisse.",
          cta: "MARS entdecken",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "Astronaut auf der Marsoberfläche, MARS in Alvernia Planet",
          accent: "orange",
          cornerLabel: "Spielen",
        },
      ],
    },
    tickets: {
      title: "Tickets",
      intro: "Wählen Sie eine Attraktion und kaufen Sie das Ticket direkt auf ihrer Unterseite.",
      heading: "Wählen Sie Ihr Abenteuer",
      subheading: "Eine Attraktion oder ein ganzer Filmtag?",
      chooseLabel: "Auswählen",
      reducedPrefix: "ermäßigt",
      normalPrefix: "regulär",
      separatelyLabel: "einzeln",
      bestPriceLabel: "Bestpreis",
      bundleTitle: "Nehmen Sie alle drei!",
      bundleTagline: "ein Tag • ein Ticket",
      packageCta: "Paket kaufen",
      headerCta: "Drei Attraktionen, ein Schritt bis zur Buchung",
      headerCtaSub: "K360, MARS und FILMWORLD. Jede hat ihren eigenen Ticketverkauf.",
      priceLabel: "Preis pro Person",
      price: "79 PLN/Pers. oder 69 PLN/Pers.",
      cta: "Tickets kaufen",
      ctaHref: bookingHomeHref("de"),
      promoTicket: {
        badge: "Paket",
        title: "Filmpfad + Kino 360",
        subtitle:
          "Ein großes Aktionspaket, das den Besuch des Filmpfads mit einer Vorstellung im Kino 360 verbindet.",
        details: ["Rund 2,5 Stunden insgesamt, mit Besichtigung und Vorstellung"],
        priceLabel: "Aktionspreis",
        price: "119,00 PLN",
        savings: "Sie sparen 9,00 PLN",
        savingsBadge: "7 % günstiger",
        button: "Paket wählen",
      },
      options: [
        {
          badge: "K360",
          title: "Kino 360",
          subtitle: "Europas größtes 360°-Kino, Kuppel mit 48 m.",
          details: ["Regulärer Preis pro Person"],
          price: "49 PLN/Pers.",
          reducedPriceLabel: "Ermäßigter Preis",
          reducedPrice: "39 PLN/Pers.",
          bookingServiceName: K360_BOOKING_SERVICES.normal,
          accent: "red",
          ctaLabel: "Tickets kaufen",
        },
        {
          badge: "MARS",
          title: "MARS",
          subtitle: "Sie spielen den Astronauten und drehen Ihren eigenen Sci-Fi-Kurzfilm.",
          details: ["Regulärer Preis pro Person"],
          price: "69 PLN/Pers.",
          reducedPriceLabel: "Ermäßigter Preis",
          reducedPrice: "59 PLN/Pers.",
          bookingServiceName: MARS_BOOKING_SERVICES.normal,
          accent: "orange",
          ctaLabel: "Ticket wählen",
        },
        {
          badge: "Kuppel",
          title: "FILMWORLD",
          subtitle: "Ein Lehrpfad, der zeigt, wie ein Film hinter den Kulissen entsteht.",
          details: ["Regulärer Preis pro Person"],
          price: "79 PLN/Pers.",
          reducedPriceLabel: "Ermäßigter Preis",
          reducedPrice: "69 PLN/Pers.",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
          accent: "cyan",
          ctaLabel: "Tickets kaufen",
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Veranstaltungen",
      title: "Ein außergewöhnlicher Ort für Ihre Veranstaltung",
      description:
        "Außergewöhnliche Räume für Konferenzen, Galas und Premieren. Entdecken Sie, welche Veranstaltungen Sie in Alvernia Planet ausrichten können.",
      cta: "Veranstaltungen entdecken",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Veranstaltungsfläche von Alvernia Planet während einer Konferenz",
    },
    news: NEWS_COPY.de,
  },
  zh: {
    heroTitleLead: "体验欧洲最大的",
    heroTitleAccent: "360°",
    heroTitleTail: "全景影院尽在 Alvernia Planet！",
    heroTaglineLead: "探索 Kino 360 影院，加入火星任务，走进电影幕后的世界。",
    heroTaglineAccent: "门票 39 PLN 起。",
    heroSecondaryCta: "查看游玩项目",
    heroScrollHint: "探索 Alvernia Planet",
    heroPromos: [
      {
        message: "体验 Kino 360 影院",
        cta: "查看 Kino 360 影院",
        href: "/atrakcje/kino-360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "游玩项目",
      intro: "三大电影主题项目，适合全家同行：既有给小小探险家的乐趣，也有给资深影迷的惊喜。",
      items: [
        {
          title: "FILMWORLD",
          description:
            "走进幕后，穿行于摄影棚布景、道具与电影制作技术之间。",
          cta: "探索电影之路",
          href: "/atrakcje/filmworld",
          image: "/galeria/Sciezka_filmowa/webp/era_niema.webp",
          imageAlt: "电影之路上的布景元素",
          accent: "cyan",
          cornerLabel: "探索",
        },
        {
          title: "Kino 360 影院",
          description:
            "欧洲最大的 360° 影院。直径 48 米的穹顶，让影像与声音从四面八方将您包围。",
          cta: "查看 Kino 360 影院",
          href: "/atrakcje/kino-360",
          image: "/galeria/K360/K360_2.webp",
          imageAlt: "Kino 360 影院的画面，全穹顶投影覆盖整个穹幕",
          accent: "red",
          highlightLabel: "欧洲最大",
          cornerLabel: "体验",
          featured: true,
        },
        {
          title: "火星任务",
          description:
            "化身自己任务中的主角，在专业的火星布景中拍摄一部短片。",
          cta: "探索 MARS",
          href: "/atrakcje/mars",
          image: "/galeria/Projekt_MARS/webp/MARS_1.webp",
          imageAlt: "火星表面上的宇航员，Alvernia Planet 的 MARS 项目",
          accent: "orange",
          cornerLabel: "出演",
        },
      ],
    },
    tickets: {
      title: "门票",
      intro: "选择一个项目，直接在它的页面上购票。",
      heading: "选择您的冒险",
      subheading: "只玩一个项目，还是畅玩一整天电影世界？",
      chooseLabel: "我要选它",
      reducedPrefix: "优惠票",
      normalPrefix: "全价票",
      separatelyLabel: "单独购买",
      bestPriceLabel: "最优价格",
      bundleTitle: "三大项目一次玩遍！",
      bundleTagline: "一天 • 一张票",
      packageCta: "购买套票",
      headerCta: "三大项目，一步完成预订",
      headerCtaSub: "K360、MARS 与 FILMWORLD，每个项目都有独立的购票流程。",
      priceLabel: "每人价格",
      price: "79 PLN/人 或 69 PLN/人",
      cta: "购买门票",
      ctaHref: bookingHomeHref("zh"),
      promoTicket: {
        badge: "套票",
        title: "电影之路 + Kino 360 影院",
        subtitle:
          "超值组合套票，把电影之路的参观与 Kino 360 影院的放映合二为一。",
        details: ["参观加观影全程约 2.5 小时"],
        priceLabel: "优惠价",
        price: "119.00 PLN",
        savings: "立省 9.00 PLN",
        savingsBadge: "立减 7%",
        button: "选择套票",
      },
      options: [
        {
          badge: "K360",
          title: "Kino 360 影院",
          subtitle: "欧洲最大的 360° 影院，穹顶直径 48 米。",
          details: ["每人全价"],
          price: "49 PLN/人",
          reducedPriceLabel: "优惠价",
          reducedPrice: "39 PLN/人",
          bookingServiceName: K360_BOOKING_SERVICES.normal,
          accent: "red",
          ctaLabel: "购买门票",
        },
        {
          badge: "MARS",
          title: "火星任务",
          subtitle: "化身宇航员，拍摄属于自己的科幻短片。",
          details: ["每人全价"],
          price: "69 PLN/人",
          reducedPriceLabel: "优惠价",
          reducedPrice: "59 PLN/人",
          bookingServiceName: MARS_BOOKING_SERVICES.normal,
          accent: "orange",
          ctaLabel: "选择门票",
        },
        {
          badge: "穹顶",
          title: "FILMWORLD",
          subtitle: "一条揭秘电影幕后制作的教育路线。",
          details: ["每人全价"],
          price: "79 PLN/人",
          reducedPriceLabel: "优惠价",
          reducedPrice: "69 PLN/人",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
          accent: "cyan",
          ctaLabel: "购买门票",
        },
      ],
    },
    eventsPromo: {
      eyebrow: "活动",
      title: "举办活动的独特场地",
      description:
        "适合会议、颁奖礼与首映式的非凡空间。看看您可以在 Alvernia Planet 举办哪些活动。",
      cta: "探索活动",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "会议期间的 Alvernia Planet 活动空间",
    },
    news: NEWS_COPY.zh,
  },
};

const EVENTS_PROMO_ROTATION_MS = 5200;
const EVENTS_PROMO_FADE_MS = 2400;

export default function Page() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = HOME_COPY[loc];
  const heroVideoFallback =
    loc === "en"
      ? "Your browser does not support the video element."
      : loc === "pt"
      ? "O seu navegador não suporta o elemento de vídeo."
      : loc === "de"
      ? "Ihr Browser unterstützt das Video-Element nicht."
      : loc === "zh"
      ? "您的浏览器不支持视频播放。"
      : "Twój browser nie wspiera elementu video.";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let idleTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleCallbackId: number | null = null;
    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const startSecondary = () => {};
    if (typeof win.requestIdleCallback === "function") {
      idleCallbackId = win.requestIdleCallback(startSecondary, { timeout: 1800 });
    } else {
      idleTimeoutId = globalThis.setTimeout(startSecondary, 1100);
    }

    return () => {
      if (idleCallbackId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleCallbackId);
      }
      if (idleTimeoutId !== null) {
        window.clearTimeout(idleTimeoutId);
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen text-white">
      <HeroSection
        heroTitleLead={copy.heroTitleLead}
        heroTitleAccent={copy.heroTitleAccent}
        heroTitleTail={copy.heroTitleTail}
        heroTaglineLead={copy.heroTaglineLead}
        heroTaglineAccent={copy.heroTaglineAccent}
        heroSecondaryCta={copy.heroSecondaryCta}
        heroScrollHint={copy.heroScrollHint}
        heroVideoFallback={heroVideoFallback}
        locale={loc}
      />
      <div className="relative z-10 -mt-10 overflow-x-clip rounded-t-[2rem] bg-[var(--ap-bg)] px-4 pt-16 pb-10 shadow-[0_-28px_60px_rgba(0,0,0,0.55)] sm:-mt-14 sm:rounded-t-[2.75rem] sm:pt-20 sm:pb-14 lg:-mt-16 lg:pt-24 lg:pb-12">
        <HomeContent
          tickets={copy.tickets}
          eventsPromo={copy.eventsPromo}
          news={copy.news}
          locale={loc}
        />
      </div>
    </main>
  );
}

const HERO_NAV_LABELS: Record<
  Locale,
  {
    attractions: string;
    about: string;
    route: string;
    buy: string;
    learnMore: string;
    promoEyebrow: string;
    promoMain: string;
    promoMainPre: string;
    promoMainHighlight: string;
    promoMainPost: string;
    promoMainEurope: string;
    promoMainTail: string;
    promoMainLine2: string;
  }
> = {
  pl: {
    attractions: "Sprawdź atrakcje",
    about: "Informacje",
    route: "Jak dojechać",
    buy: "Kup bilet",
    learnMore: "Dowiedz się więcej",
    promoEyebrow: "Promocja • do 30.06",
    promoMain: "Przeżyj największe kino 360 w Europie! Bilety już od 39 zł",
    promoMainPre: "Przeżyj ",
    promoMainHighlight: "NAJWIĘKSZE KINO 360",
    promoMainPost: " w Europie! Bilety już od 39 zł",
    promoMainEurope: "w Europie",
    promoMainTail: "!",
    promoMainLine2: "Bilety już od 39 zł",
  },
  en: {
    attractions: "See attractions",
    about: "Information",
    route: "How to get there",
    buy: "Buy ticket",
    learnMore: "Learn more",
    promoEyebrow: "Offer • until 30.06",
    promoMain: "Experience the largest 360° cinema in Europe! Tickets from 39 PLN",
    promoMainPre: "Experience the ",
    promoMainHighlight: "LARGEST 360° CINEMA",
    promoMainPost: " in Europe! Tickets from 39 PLN",
    promoMainEurope: "in Europe",
    promoMainTail: "!",
    promoMainLine2: "Tickets from 39 PLN",
  },
  pt: {
    attractions: "Ver atrações",
    about: "Informações",
    route: "Como chegar",
    buy: "Comprar bilhete",
    learnMore: "Saber mais",
    promoEyebrow: "Promoção • até 30.06",
    promoMain: "Vive o maior cinema 360° da Europa! Bilhetes desde 39 PLN",
    promoMainPre: "Vive o ",
    promoMainHighlight: "MAIOR CINEMA 360°",
    promoMainPost: " da Europa! Bilhetes desde 39 PLN",
    promoMainEurope: "da Europa",
    promoMainTail: "!",
    promoMainLine2: "Bilhetes desde 39 PLN",
  },
  de: {
    attractions: "Attraktionen ansehen",
    about: "Informationen",
    route: "Anfahrt",
    buy: "Ticket kaufen",
    learnMore: "Mehr erfahren",
    promoEyebrow: "Aktion • bis 30.06",
    promoMain: "Erleben Sie das größte 360°-Kino in Europa! Tickets ab 39 PLN",
    promoMainPre: "Erleben Sie das ",
    promoMainHighlight: "GRÖSSTE 360°-KINO",
    promoMainPost: " in Europa! Tickets ab 39 PLN",
    promoMainEurope: "in Europa",
    promoMainTail: "!",
    promoMainLine2: "Tickets ab 39 PLN",
  },
  zh: {
    attractions: "查看游玩项目",
    about: "相关信息",
    route: "交通指南",
    buy: "购买门票",
    learnMore: "了解更多",
    promoEyebrow: "优惠 • 截至 30.06",
    promoMain: "体验欧洲最大的 360° 影院！门票 39 PLN 起",
    promoMainPre: "体验欧洲",
    promoMainHighlight: "最大的 360° 影院",
    promoMainPost: "！门票 39 PLN 起",
    promoMainEurope: "在欧洲",
    promoMainTail: "！",
    promoMainLine2: "门票 39 PLN 起",
  },
};

const HeroSection = memo(function HeroSection({
  heroTitleLead,
  heroTitleAccent,
  heroTitleTail,
  heroTaglineLead,
  heroTaglineAccent,
  heroSecondaryCta,
  heroScrollHint,
  heroVideoFallback,
  locale,
}: {
  heroTitleLead: string;
  heroTitleAccent: string;
  heroTitleTail: string;
  heroTaglineLead: string;
  heroTaglineAccent: string;
  heroSecondaryCta: string;
  heroScrollHint: string;
  heroVideoFallback: string;
  locale: Locale;
}) {
  const navLabels = HERO_NAV_LABELS[locale];
  // Cena normalna, nie ulgowa: hero ma zakotwiczać na cenie, którą realnie
  // płaci dorosły (119 zł). Wcześniej prosiliśmy o bilet ulgowy (99 zł), więc
  // użytkownik wchodził do koszyka z inną liczbą w głowie niż na ekranie.
  // Przewijanie do treści BEZ dopisywania #content-start do adresu. Kotwica
  // zostawała w URL-u i przeglądarka zapamiętywała pozycję — po odświeżeniu
  // albo powrocie strona otwierała się w środku, zamiast od góry.
  const scrollToContent = () => {
    const target = document.getElementById("content-start");
    if (!target) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  // Główne CTA hero prowadzi na listę wydarzeń, a nie na deep link pakietu:
  // przycisk jest ogólny („KUP BILET"), więc nie zawężamy wyboru za użytkownika.
  const heroBookingHref = heroBookingHrefFor(locale);
  return (
    <FullscreenHero
      mp4Src="/home/hero.mp4"
      webmSrc="/home/hero.webm"
      preferWebm
      poster="/home/hero.poster.webp"
      fallbackText={heroVideoFallback}
    >
      {/* Kompozycja hero: jedna ścieżka czytania — nagłówek → opis → cena → CTA →
          subtelny scroll. Content siedzi ~43% wysokości ekranu (pb-[14svh] przy
          justify-center podnosi środek o 7%), żeby nie „wisiał" nad fotelami. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <div className="flex w-full max-w-[60rem] flex-col items-center">
          <h1
            className={`ap-intro-rise force-overlay text-balance [text-shadow:0_2px_18px_rgba(0,0,0,0.6)] !leading-[1.3] !text-[clamp(2.05rem,8.2vw,3rem)] font-extrabold tracking-[-0.022em] text-white sm:!text-[clamp(2.8rem,5vw,4.75rem)] `}
          >
            {heroTitleLead} <span className="uppercase">{heroTitleAccent}</span> {heroTitleTail}
          </h1>

          <p
            className={`ap-intro-rise ap-intro-d1 force-overlay-hero mt-6 max-w-[43.75rem] text-balance leading-[1.45] [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] !text-[clamp(1rem,3.4vw,1.06rem)] font-medium sm:!text-[clamp(1.125rem,1.35vw,1.375rem)] `}
          >
            {heroTaglineLead}
          </p>

          {/* Cena osobną linią, czystym tekstem — bez plakietki i bez boksu. */}
          <p
            className={`ap-intro-rise ap-intro-d2 mt-3.5 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] !text-[clamp(1.05rem,3.6vw,1.12rem)] font-bold text-[#56ddea] sm:!text-[clamp(1.125rem,1.35vw,1.375rem)] `}
          >
            {heroTaglineAccent}
          </p>

          <div
            className={`ap-intro-rise ap-intro-d3 mt-8 flex w-full max-w-[18rem] flex-col items-stretch gap-4 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-5 `}
          >
            <BookingLink
              href={heroBookingHref}
              className="ticket-pill pointer-events-auto inline-flex h-[3.75rem] items-center justify-center gap-2.5 rounded-[var(--ap-btn-radius)] px-8 text-sm font-extrabold uppercase tracking-[0.16em] transition hover:-translate-y-px hover:brightness-110 sm:min-w-[13.5rem]"
              style={{
                backgroundColor: "#56ddea",
                color: "#04222a",
                boxShadow: "0 6px 22px rgba(86,221,234,0.32)",
                borderColor: "transparent",
              }}
            >
              <SolarIcon name="ticket" size="1.3em" />
              {navLabels.buy}
            </BookingLink>
            <button
              type="button"
              onClick={scrollToContent}
              className="pointer-events-auto inline-flex h-[3.75rem] items-center justify-center gap-2.5 rounded-[var(--ap-btn-radius)] border border-[#56ddea]/45 bg-black/45 px-8 text-sm font-bold uppercase tracking-[0.16em] !text-white backdrop-blur-md transition hover:-translate-y-px hover:border-[#56ddea]/80 hover:bg-[#56ddea]/10 sm:min-w-[13.5rem]"
            >
              {heroSecondaryCta}
              <SolarIcon name="arrow-right" size="1.15em" />
            </button>
          </div>

          {/* Scroll indicator — celowo cichy, nie może konkurować z CTA. */}
          <button
            type="button"
            onClick={scrollToContent}
            className={`ap-intro-rise ap-intro-d4 ap-hero-scroll pointer-events-auto mt-12 inline-flex items-center gap-3 text-[0.82rem] font-medium text-white/90 hover:text-white `}
          >
            <span
              aria-hidden="true"
              className="ap-hero-scroll-dot inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35"
            >
              <SolarIcon name="arrow-down" size="1.1em" />
            </span>
            {heroScrollHint}
          </button>
        </div>
      </div>
    </FullscreenHero>
  );
});

// Opinie z profilu Google (Alvernia Planet) — pokazywane POD repertuarem, na tym
// samym fotograficznym tle (ciemne karty, więc tło nie „przecina" sekcji).
// ⚠️ UWAGA: teksty PL odtworzone z tłumaczeń Google (screenshot był po angielsku
// i ucięty) — przed publikacją podmień na ORYGINALNE brzmienie opinii 1:1
// z profilu Google Maps. Nazwiska i oceny są prawdziwe (publiczne opinie 5★).
const GOOGLE_REVIEWS: Record<
  Locale,
  { kicker: string; title: string; source: string; reviews: { name: string; text: string }[] }
> = {
  pl: {
    kicker: "Opinie",
    title: "Co mówią odwiedzający",
    source: "opinii w Google",
    reviews: [
      {
        name: "Robert Greszta",
        text: "Świetne miejsce z wyjątkową atmosferą! Wszystko jest dopracowane i bardzo ciekawe, a kino 360 to prawdziwa perełka.",
      },
      {
        name: "Julia Bołtniewska",
        text: "Od dawna chciałam odwiedzić to miejsce. Byliśmy zachwyceni! Kino 360 było świetne!",
      },
    ],
  },
  en: {
    kicker: "Reviews",
    title: "What visitors say",
    source: "Google reviews",
    reviews: [
      {
        name: "Robert Greszta",
        text: "A great place with a unique atmosphere! Everything is meticulously crafted and very interesting, and the 360 cinema is a real gem.",
      },
      {
        name: "Julia Bołtniewska",
        text: "I've been wanting to visit this place for a long time. We loved it! The 360 cinema was great!",
      },
    ],
  },
  pt: {
    kicker: "Opiniões",
    title: "O que dizem os visitantes",
    source: "avaliações no Google",
    reviews: [
      {
        name: "Robert Greszta",
        text: "Um lugar fantástico com uma atmosfera única! Tudo é feito com muito cuidado e é muito interessante, e o cinema 360 é uma verdadeira pérola.",
      },
      {
        name: "Julia Bołtniewska",
        text: "Há muito tempo que queria visitar este lugar. Adorámos! O cinema 360 foi fantástico!",
      },
    ],
  },
  de: {
    kicker: "Bewertungen",
    title: "Das sagen unsere Besucher",
    source: "Google-Bewertungen",
    reviews: [
      {
        name: "Robert Greszta",
        text: "Ein toller Ort mit einer einzigartigen Atmosphäre! Alles ist bis ins Detail durchdacht und sehr interessant, und das 360°-Kino ist ein echtes Juwel.",
      },
      {
        name: "Julia Bołtniewska",
        text: "Ich wollte diesen Ort schon lange besuchen. Wir waren begeistert! Das 360°-Kino war großartig!",
      },
    ],
  },
  zh: {
    kicker: "评价",
    title: "访客怎么说",
    source: "条 Google 评价",
    reviews: [
      {
        name: "Robert Greszta",
        text: "非常棒的地方，氛围独一无二！每个细节都很用心，也很有意思，360° 影院更是一大亮点。",
      },
      {
        name: "Julia Bołtniewska",
        text: "我很早就想来这里了。我们都非常喜欢！360° 影院太棒了！",
      },
    ],
  },
};

// Paleta awatarów Google Maps — tam, gdzie autor nie ma zdjęcia, Google rysuje
// kółko z inicjałem w jednym z kilku kolorów. Kolor dobieramy DETERMINISTYCZNIE
// z imienia, żeby ta sama osoba zawsze miała ten sam awatar (i żeby SSR nie
// rozjechał się z hydracją, co zdarzyłoby się przy losowaniu).
// Kolory dobrane tak, żeby BIAŁY inicjał spełniał WCAG AA (>=4,5:1) na każdym
// z nich. Oryginalny pomarańcz Google (#ef6c00) dawał tylko 3,08:1, więc jest
// przyciemniony do #a84c00 (5,52:1) — reszta palety przechodzi bez zmian.
// ⚠️ DO PODMIANY NA DOKŁADNY ADRES PROFILU: to zapytanie do Map Google trafia
// we właściwe miejsce, ale pewniejszy jest bezpośredni link z wizytówki
// (Google Maps → Udostępnij → Kopiuj link).
const GOOGLE_PLACE_URL =
  "https://www.google.com/maps/search/?api=1&query=Alvernia%20Planet%20Nieporaz";

// Ocena i liczba opinii ze stanu na dzień wpisania. „+" przy liczbie jest
// świadomy: opinii przybywa, a zaokrąglenie w górę nie zestarzeje się w dół.
// Aktualizować razem, obie wartości pochodzą z tej samej wizytówki.
const GOOGLE_RATING = "4,3";
const GOOGLE_REVIEW_COUNT = "1 721";

const GOOGLE_AVATAR_COLORS = ["#7b1fa2", "#c62828", "#00695c", "#4527a0", "#a84c00", "#1565c0"];

function googleAvatar(name: string) {
  const seed = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return {
    color: GOOGLE_AVATAR_COLORS[seed % GOOGLE_AVATAR_COLORS.length],
    initial: (name.trim()[0] ?? "?").toUpperCase(),
  };
}

function GoogleReviewsSection({ locale }: { locale: Locale }) {
  const t = GOOGLE_REVIEWS[locale] ?? GOOGLE_REVIEWS.pl;
  return (
    <section aria-label={t.title} className="mx-auto mt-10 w-full max-w-[72rem] sm:mt-14">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.5rem]">
          {t.title}
        </h2>
        {/* Atrybucja źródła — logo Google raz, przy sekcji, zamiast powtarzania
            napisu „OPINIA Z GOOGLE" na każdej karcie. */}
        <a
          href={GOOGLE_PLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-flex items-center gap-2.5 rounded-full px-2 py-1 text-[0.95rem] font-medium text-white/75 sm:text-base transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <Image
            src="/wspolne/logotypy/google-g.png"
            alt="Google"
            width={20}
            height={20}
            className="h-5 w-5"
            unoptimized
          />
          <span className="font-bold text-white">{GOOGLE_RATING}</span>
          <span className="flex items-center gap-0.5 text-[#fbbc04]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <SolarIcon key={i} name="star" size={16} weight="fill" />
            ))}
          </span>
          <span>
            {GOOGLE_REVIEW_COUNT}+ {t.source}
          </span>
        </a>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6">
        {t.reviews.map((review) => {
          const avatar = googleAvatar(review.name);
          return (
            <a
              key={review.name}
              href={GOOGLE_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${review.name} — ${t.source}`}
              /* LITE tło, nie szkło. Wcześniej karta była półprzezroczysta
                 (bg-white/[0.04]) i prześwitywało przez nią zdjęcie hero — przez to
                 czytała się jak element strony, a nie jak cytat z Google. Kolory to
                 powierzchnia Google Material w trybie ciemnym (#202124 / #3c4043),
                 czyli dokładnie to, co widać w Mapach Google po ciemnej stronie. */
              className="block rounded-2xl border border-[#3c4043] bg-[#202124] p-5 transition sm:p-6 hover:border-[#5f6368] hover:bg-[#26282b] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:p-5"
            >
              {/* Wiersz nagłówka: awatar + nazwa, jak w Mapach. */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-medium text-white"
                  style={{ backgroundColor: avatar.color }}
                >
                  {avatar.initial}
                </span>
                <span className="min-w-0 truncate text-base font-medium text-[#e8eaed] sm:text-[1.05rem]">
                  {review.name}
                </span>
              </div>

              {/* Gwiazdki pod całym nagłówkiem, przy lewej krawędzi karty —
                  tak samo jak Google układa je pod nazwą autora. */}
              <div className="mt-2.5 flex items-center gap-0.5 text-[#fbbc04]" aria-label="5/5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <SolarIcon key={i} name="star" size={18} weight="fill" />
                ))}
              </div>

              <p className="mt-3 text-[0.95rem] leading-[1.6] text-[#bdc1c6] sm:text-base">{review.text}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}

const HomeContent = memo(function HomeContent({
  tickets,
  eventsPromo,
  news,
  locale,
}: {
  tickets: TicketSection;
  eventsPromo: PromoTile;
  news: NewsSection;
  locale: Locale;
}) {
  return (
    <section
      id="content-start"
      className="ap-intro-section relative z-10 mt-10 sm:mt-12"
    >
      <div className="flex flex-col gap-12 sm:gap-16">
        {/* Zdjęcie w tle regionu Repertuaru (od pod hero do czarnego pasa Biletów), full-bleed */}
        <div
          className="relative isolate py-8 sm:py-12"
          style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
        >
          <div className="pointer-events-none absolute inset-x-0 -bottom-[8rem] -top-[7rem] -z-10 overflow-hidden sm:-top-[9rem] sm:-bottom-[10rem]">
            <Image
              src="/home/repertoire-bg.webp"
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              quality={68}
              loading="lazy"
              className="object-cover"
            />
            {/* Lekki czarny fade u góry (miękkie wejście), zdjęcie w środku, dół od razu w czerń */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #000 0%, #000 8%, rgba(7,4,12,0.62) 21%, rgba(7,4,12,0.5) 42%, rgba(7,4,12,0.62) 64%, #000 100%)",
              }}
            />
          </div>
          <div className="px-4">
            <RepertoireSection />
            {/* Opinie z Google — bezpośrednio pod repertuarem, na tym samym tle */}
            <GoogleReviewsSection locale={locale} />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[72rem] 2xl:max-w-[92rem] min-[1800px]:max-w-[104rem]">
          <TicketsSection tickets={tickets} locale={locale} />
        </div>
        <FaqPreviewSection faq={FAQ_COPY[locale]} locale={locale} />
        {/* Wspólne czarne tło (full-bleed, jak sekcja Biletów) dla Wydarzeń i Aktualności */}
        <div
          className="relative isolate py-16 sm:py-24 lg:py-28"
          style={{
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            background:
              "linear-gradient(180deg, var(--ap-bg) 0%, #000 14%, #000 86%, var(--ap-bg) 100%)",
          }}
        >
          <div className="flex flex-col gap-20 px-4 sm:gap-28">
            <EventsPromoSection promo={eventsPromo} />
            <NewsRailSection news={news} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
});

// Etykiety i podtytuły nowego układu strony głównej (edytorialne szyny sekcji).
const HOME_UI: Record<
  Locale,
  {
    learnMore: string;
    readMore: string;
    seeAllAttractions: string;
    seeRepertoire: string;
    seeAllFaq: string;
    seeAllNews: string;
    subAttractions: string;
    subRepertoire: string;
  }
> = {
  pl: {
    learnMore: "Dowiedz się więcej",
    readMore: "Czytaj więcej",
    seeAllAttractions: "Zobacz wszystkie atrakcje",
    seeRepertoire: "Zobacz repertuar",
    seeAllFaq: "Zobacz wszystkie",
    seeAllNews: "Zobacz wszystkie",
    subAttractions: "Trzy światy. Niezliczone emocje. Wybierz swoją misję.",
    subRepertoire: "Sprawdź, co gramy i wybierz swoją przygodę.",
  },
  en: {
    learnMore: "Learn more",
    readMore: "Read more",
    seeAllAttractions: "See all attractions",
    seeRepertoire: "See repertoire",
    seeAllFaq: "See all",
    seeAllNews: "See all",
    subAttractions: "Three worlds. Endless emotions. Choose your mission.",
    subRepertoire: "See what's playing and pick your adventure.",
  },
  pt: {
    learnMore: "Saber mais",
    readMore: "Ler mais",
    seeAllAttractions: "Ver todas as atrações",
    seeRepertoire: "Ver repertório",
    seeAllFaq: "Ver tudo",
    seeAllNews: "Ver tudo",
    subAttractions: "Três mundos. Emoções infinitas. Escolhe a tua missão.",
    subRepertoire: "Vê o que está em cartaz e escolhe a tua aventura.",
  },
  de: {
    learnMore: "Mehr erfahren",
    readMore: "Weiterlesen",
    seeAllAttractions: "Alle Attraktionen ansehen",
    seeRepertoire: "Programm ansehen",
    seeAllFaq: "Alle ansehen",
    seeAllNews: "Alle ansehen",
    subAttractions: "Drei Welten. Unzählige Emotionen. Wählen Sie Ihre Mission.",
    subRepertoire: "Sehen Sie, was läuft, und wählen Sie Ihr Abenteuer.",
  },
  zh: {
    learnMore: "了解更多",
    readMore: "阅读更多",
    seeAllAttractions: "查看全部游玩项目",
    seeRepertoire: "查看放映排期",
    seeAllFaq: "查看全部",
    seeAllNews: "查看全部",
    subAttractions: "三个世界。无尽精彩。选择您的任务。",
    subRepertoire: "看看正在放映什么，选择您的冒险。",
  },
};

function FaqPreviewSection({ faq, locale }: { faq: FaqCopy; locale: Locale }) {
  const ui = HOME_UI[locale];
  const faqHref = getSitePaths(locale).faq;
  const items = faq.items.slice(0, 9);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Ten sam lekki reveal wjazdowy co w innych sekcjach (stan Reacta, GPU, bez bibliotek).
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      setSettled(true);
      return;
    }
    const root = sectionRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!revealed || settled) return;
    const id = window.setTimeout(() => setSettled(true), 1500);
    return () => window.clearTimeout(id);
  }, [revealed, settled]);
  const revealCls = settled ? "" : `wpk-reveal${revealed ? " is-visible" : ""}`;

  return (
    <ScrollMotionItem strength="soft" delay={40}>
      <div ref={sectionRef} className="mx-auto w-full max-w-[86rem] 2xl:max-w-[96rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.5fr)] lg:items-start lg:gap-12">
          <div className={revealCls}>
            <HomeSectionHeader
              title={faq.badge}
              subtitle={faq.title}
              cta={{ label: ui.seeAllFaq, href: faqHref }}
            />
          </div>
          <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 lg:items-start">
            {items.map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={item.question}
                  style={{ "--wpk-reveal-delay": `${120 + i * 55}ms` } as CSSProperties}
                  className={`${revealCls} border-t border-white/10`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start gap-3 py-4 text-left"
                  >
                    <span
                      className={`flex-1 text-[0.9rem] font-medium leading-snug transition-colors ${
                        isOpen ? "text-white" : "text-white/75 group-hover:text-white"
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 shrink-0 text-[#f7486c] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <SolarIcon name="chevron-down" size="0.9em" />
                    </span>
                  </button>
                  {/* Płynne rozwijanie bez mierzenia wysokości (grid-rows 0fr→1fr) */}
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-4 pr-2 text-[0.82rem] leading-relaxed text-white/60">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollMotionItem>
  );
}

function NewsRailSection({ news, locale }: { news: NewsSection; locale: Locale }) {
  const ui = HOME_UI[locale];
  const newsHref = getSitePaths(locale).news;
  const featured = news.items[0];
  if (!featured) return null;
  const featuredHref = featured.external ? featured.href : getLocalizedPath(featured.href, locale);
  return (
    <ScrollMotionItem strength="soft" delay={40}>
      <div className="mx-auto w-full max-w-[86rem] 2xl:max-w-[96rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)] lg:items-center lg:gap-12">
          <HomeSectionHeader title={news.title} cta={{ label: ui.seeAllNews, href: newsHref }} className="lg:justify-center" />
          <Link
            href={featuredHref}
            target={featured.external ? "_blank" : undefined}
            rel={featured.external ? "noopener noreferrer" : undefined}
            className="group grid overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/10 transition hover:ring-white/25 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
          >
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#4fcfde]">
                {featured.badge}
              </span>
              <h3 className="mt-2 text-pretty text-xl font-extrabold leading-tight tracking-[-0.01em] text-white sm:text-2xl">
                {featured.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">
                {featured.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white transition-colors group-hover:text-[#ff96aa]">
                {ui.readMore}
                <span aria-hidden="true" className="text-[#f7486c]">→</span>
              </span>
            </div>
            <div className="relative min-h-[11rem] overflow-hidden max-sm:order-first">
              <Image
                src="/galeria/Projekt_MARS/webp/MARS_1.webp"
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width:640px) 32vw, 100vw"
                quality={70}
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(10,6,18,0.6),transparent_45%)] sm:bg-[linear-gradient(to_right,rgba(10,6,18,0.85),transparent_40%)]" />
            </div>
          </Link>
        </div>
        {/* Więcej aktualności — kompaktowa siatka pozostałych pozycji */}
        {news.items.length > 1 ? (
          <div className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {news.items.slice(1, 7).map((item) => {
              const href = item.external ? item.href : getLocalizedPath(item.href, locale);
              return (
                <Link
                  key={item.title}
                  href={href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col border-t border-white/10 py-4 transition-colors hover:border-[#f7486c]/50"
                >
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#4fcfde]">
                    {item.badge}
                  </span>
                  <h4 className="mt-1.5 line-clamp-2 text-[0.9rem] font-bold leading-snug text-white/80 transition-colors group-hover:text-white">
                    {item.title}
                  </h4>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </ScrollMotionItem>
  );
}

// Kolory akcentów sekcji „Bilety" (dokładnie wg referencji).
const PER_UNIT_FALLBACK: Record<Locale, string> = {
  pl: "os.",
  en: "person",
  pt: "pessoa",
  de: "Pers.",
  zh: "人",
};

const TICKET_ACCENTS: Record<NonNullable<TicketOption["accent"]>, string> = {
  red: "#ff7092",
  orange: "#ff843d",
  cyan: "#56ddea",
};

// Kolor TEKSTU na przycisku wypełnionym akcentem.
//
// Biały tekst na tych tłach nie spełniał WCAG 2.2 AA (1.4.3, minimum 4,5:1) —
// zmierzone na zbudowanej stronie: róż 3,28 / pomarańcz 2,44 / cyjan 1,62.
// Od 06.2025 European Accessibility Act obejmuje e-commerce w UE, więc to nie
// jest wyłącznie kwestia czytelności.
//
// Każdy kolor to mocno przyciemniony ton TEGO SAMEGO odcienia, żeby przyciski
// nadal czytały się jako jeden system, a nie czarny tekst doklejony do koloru.
// Wzorzec jest już na stronie: „Kup pakiet" to #04222a na cyjanie.
// Zmierzone kontrasty: róż 5,86 · pomarańcz 7,15 · cyjan 10,20 — wszystkie ≥ 4,5.
// Jedna para kolorów dla WSZYSTKICH przycisków akcji na stronie: „Wybieram",
// „Kup pakiet" i CTA w hero. Wcześniej każdy przycisk brał kolor swojej karty,
// więc na jednym ekranie były trzy różne „główne" kolory i nic nie wskazywało
// jednoznacznie, gdzie się klika. Kolory atrakcji zostają przy cenie, obrysie
// portalu i ikonie — tam niosą informację, na przycisku tylko rozpraszały.
// Zmierzone: #04222a na #56ddea = 10,20:1 (WCAG AA wymaga 4,5).
const TICKET_ACTION_FILL = "#56ddea";
const TICKET_ACTION_INK = "#04222a";

// Grafika portalu (wideo) + ikona wg akcentu atrakcji (K360 = red, MARS = orange, FILMWORLD = cyan).
const TICKET_PORTALS: Record<
  NonNullable<TicketOption["accent"]>,
  { video: { mp4: string; webm: string; poster: string }; icon: ReactNode }
> = {
  red: {
    video: { mp4: "/home/Bilet/kino360.mp4", webm: "/home/Bilet/kino360.webm", poster: "/home/Bilet/kino360.poster.webp" },
    icon: <SolarIcon name="clapperboard" />,
  },
  orange: {
    video: { mp4: "/home/Bilet/mars.mp4", webm: "/home/Bilet/mars.webm", poster: "/home/Bilet/mars.poster.webp" },
    icon: <SolarIcon name="rocket" />,
  },
  cyan: {
    video: { mp4: "/home/Bilet/filmworld.mp4", webm: "/home/Bilet/filmworld.webm", poster: "/home/Bilet/filmworld.poster.webp" },
    icon: <SolarIcon name="videocamera" />,
  },
};

// Podstrona atrakcji dla przycisku „Dowiedz się więcej" wg akcentu.
const TICKET_ATTRACTION_PAGE: Record<NonNullable<TicketOption["accent"]>, string> = {
  red: "/atrakcje/kino-360",
  orange: "/atrakcje/mars",
  cyan: "/atrakcje/filmworld",
};

// Filmik portalu (Kino/MARS/Filmworld) — LENIWE ładowanie: źródła (i pobranie ~350 KB
// każdy) dopiero, gdy portal zbliża się do ekranu. Do tego czasu widać poster. Portale są
// poniżej pierwszego ekranu, więc nie obciążają wczytywania strony (mniejszy payload).
function PortalVideo({ mp4, webm, poster }: { mp4: string; webm: string; poster: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    // Źródła dodane po zmianie stanu — trzeba przeładować, żeby wideo je podłączyło i ruszyło (autoPlay).
    if (load) ref.current?.load();
  }, [load]);
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full bg-[#070a16] object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      /* Plakat dopiero po wejściu w viewport, razem ze źródłami.
         Atrybut `poster` NIE podlega leniwemu ładowaniu — przeglądarka pobiera
         go natychmiast, nawet gdy <source> są odroczone stanem `load`. Te trzy
         kafelki leżą 3–5 ekranów niżej, a mimo to zabierały 99 KB z łącza
         dokładnie wtedy, gdy walczy o nie plakat hero. Tło #070a16 zakrywa
         pustkę, zanim obserwator zapali `load`. */
      poster={load ? poster : undefined}
      aria-hidden="true"
      tabIndex={-1}
    >
      {load ? (
        <>
          <source src={mp4} type="video/mp4" />
          <source src={webm} type="video/webm" />
        </>
      ) : null}
    </video>
  );
}

// „Bilety" — trzy portale (łuki) połączone znakami „+" i szeroki panel pakietowy.
const TicketsSection = memo(function TicketsSection({
  tickets,
  locale,
}: {
  tickets: TicketSection;
  locale: Locale;
}) {
  const options = tickets.options;
  const ui = HOME_UI[locale];
  const promo = PROMO_PACKAGES[locale][0];

  // Skróć końcówki ",00"/".00" (np. „119,00 zł" → „119 zł").
  const shorten = (s: string) => s.replace(/[.,]00/g, "");
  // Sufiks „za osobę" pobrany z ceny pierwszej atrakcji (/os., /person, /pessoa).
  // Fallback MUSI być zależny od języka: cena pierwszej pozycji to pakiet bez
  // ukośnika, więc wchodził on zawsze — i na stronach /de oraz /zh wyświetlał
  // polskie „/os." pośród niemieckiego i chińskiego tekstu.
  const perUnit = `/${options[0]?.price?.split("/")[1]?.trim() ?? PER_UNIT_FALLBACK[locale]}`;

  const bookingHrefFor = (o: TicketOption) =>
    o.bookingServiceName
      ? buildBookingPath(locale, {
          service: o.bookingServiceName,
        })
      : o.href ?? tickets.ctaHref;

  const packageHref = buildBookingPath(locale, {
    service: promo.service,
  });

  // Waluta z ceny pakietu: „119,00 zł" → „zł".
  const promoCur = shorten(promo.price).split(" ").slice(1).join(" ");
  const priceNum = (value: string) => shorten(value).split(" ")[0];

  // DWIE KOMPLETNE TARYFY, każda licząca się WEWNĄTRZ siebie.
  //
  // Wcześniej pasek pokazywał jako cenę główną 99 zł, czyli cenę ULGOWĄ, choć na
  // kartach atrakcji obok cena główna jest zawsze NORMALNA — ta sama gramatyka
  // znaczyła co innego. Do tego „oszczędność" liczyła się jako 197 (suma cen
  // NORMALNYCH) − 99 (cena ULGOWA) = 98 zł: kwota, której nie uzyskiwał nikt.
  // Dorosły oszczędza 78 (197→119), dziecko 68 (167→99).
  //
  // Sumy „osobno" liczymy z cen atrakcji, a nie wpisujemy na sztywno, żeby zmiana
  // ceny jednej atrakcji nie rozjechała pakietu.
  const sumOf = (pick: (o: TicketOption) => string | undefined) =>
    options.reduce((total, o) => total + (parseInt(pick(o) ?? "0", 10) || 0), 0);

  const tariffs = [
    {
      key: "normal",
      label: tickets.normalPrefix,
      num: priceNum(promo.price),
      separately: `${sumOf((o) => o.price)} ${promoCur}`.trim(),
      savings: shorten(promo.savings),
      // Kolumna ceny normalnej lekko wyróżniona: to cena, którą realnie płaci dorosły.
      lead: true,
    },
    {
      key: "reduced",
      label: tickets.reducedPrefix,
      num: priceNum(promo.reducedPrice),
      separately: `${sumOf((o) => o.reducedPrice)} ${promoCur}`.trim(),
      savings: shorten(promo.reducedSavings),
      lead: false,
    },
  ];

  // Lekki reveal wjazdowy — ta sama, sprawdzona metoda co w repertuarze: sterowana
  // STANEM Reacta (nie classList), transform+opacity na GPU, po animacji zdejmujemy
  // klasę (i will-change). Bez bibliotek i nowych zasobów.
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      setSettled(true);
      return;
    }
    const root = sectionRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!revealed || settled) return;
    const id = window.setTimeout(() => setSettled(true), 1500);
    return () => window.clearTimeout(id);
  }, [revealed, settled]);
  const revealCls = settled ? "" : `wpk-reveal${revealed ? " is-visible" : ""}`;

  return (
    <ScrollMotionItem strength="soft" delay={30} float={false} className="home-deferred-block">
      <section
        ref={sectionRef}
        aria-labelledby="tickets-heading"
        className="relative isolate py-16 sm:py-24 lg:py-28"
        style={{
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          // Góra od razu czarna (styka się z czernią zdjęcia nad sekcją); dół wtapia w granat pod FAQ
          background:
            "linear-gradient(180deg, #000 0%, #000 86%, var(--ap-bg) 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-[72rem] px-4 sm:px-8 lg:px-12 2xl:max-w-[92rem] min-[1800px]:max-w-[104rem]">
          {/* Nagłówek — wyśrodkowany */}
          <div className={`mx-auto max-w-2xl text-center ${revealCls}`}>
          <h2
            id="tickets-heading"
            className="text-[clamp(2.1rem,1.3rem+3.2vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white"
          >
            {tickets.heading}
          </h2>
          <p className="mt-3 text-base text-white/55 sm:text-lg">{tickets.subheading}</p>
        </div>

        {/* Portale (łuki) połączone znakami „+" */}
        <div className="mt-12 flex flex-col items-center gap-10 sm:mt-16 sm:flex-row sm:items-start sm:justify-center sm:gap-0">
          {options.map((option, i) => {
            const accent = option.accent ?? "cyan";
            const hex = TICKET_ACCENTS[accent];
            const portal = TICKET_PORTALS[accent];
            const [priceNum, ...unitRest] = (option.price ?? "").split(" ");
            const priceUnit = unitRest.join(" ");
            const reducedShort = (option.reducedPrice ?? "").split("/")[0].trim();
            const href = bookingHrefFor(option);
            const attractionHref = getLocalizedPath(TICKET_ATTRACTION_PAGE[accent], locale);
            const isLast = i === options.length - 1;
            const linkColor = i === 0 ? TICKET_ACCENTS.red : TICKET_ACCENTS.cyan;
            return (
              <Fragment key={option.title}>
                <div
                  style={{ "--wpk-reveal-delay": `${140 + i * 120}ms` } as CSSProperties}
                  className={`${revealCls} flex flex-1 flex-col items-center px-2 text-center sm:max-w-[21rem]`}
                >
                  {/* Portal (łuk) — klikalny, ale poza kolejnością tab (dubluje przycisk „Wybieram") */}
                  <a
                    href={href}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="group relative block w-full max-w-[17rem] overflow-hidden"
                    style={{
                      aspectRatio: "4 / 5",
                      borderRadius: "48% 48% 48% 48% / 34% 34% 34% 34%",
                      boxShadow: `inset 0 0 0 2px ${hex}, 0 0 34px ${hex}44`,
                    }}
                  >
                    <PortalVideo
                      mp4={portal.video.mp4}
                      webm={portal.video.webm}
                      poster={portal.video.poster}
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, rgba(7,10,22,0.9) 3%, rgba(7,10,22,0.15) 42%, transparent 62%), radial-gradient(115% 75% at 50% 0%, ${hex}26, transparent 62%)`,
                      }}
                    />
                    <span
                      className="absolute bottom-3.5 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center text-2xl"
                      style={{ color: hex, filter: `drop-shadow(0 0 7px ${hex}99)` }}
                    >
                      {/* Ramka „viewfinder" (frame.svg) w kolorze akcentu — zamiast kółka */}
                      <span
                        className="absolute inset-0"
                        style={{
                          backgroundColor: "currentColor",
                          WebkitMask: "url(/wspolne/ikony/frame.svg) center / contain no-repeat",
                          mask: "url(/wspolne/ikony/frame.svg) center / contain no-repeat",
                        }}
                        aria-hidden
                      />
                      {portal.icon}
                    </span>
                  </a>

                  {/* Opis */}
                  <h3 className="mt-5 text-[1.6rem] font-extrabold tracking-[-0.02em] text-white">
                    {option.title}
                  </h3>
                  <p className="mt-2 max-w-[18rem] text-[0.98rem] leading-snug text-white/75">
                    {option.subtitle}
                  </p>

                  {/* Cena */}
                  <p className="mt-4 flex items-baseline justify-center gap-1.5">
                    <span className="text-[2.6rem] font-extrabold leading-none" style={{ color: hex }}>
                      {priceNum}
                    </span>
                    <span className="text-base font-bold text-white/85">{priceUnit}</span>
                  </p>
                  <p className="mt-1 text-[0.82rem] text-white/45">
                    {tickets.reducedPrefix}{" "}
                    <span className="font-semibold text-white/70">{reducedShort}</span>
                  </p>

                  {/* Przycisk „Wybieram" */}
                  <a
                    href={href}
                    aria-label={`${tickets.chooseLabel}: ${option.title}`}
                    className="ticket-pill mt-4 inline-flex w-full max-w-[13rem] items-center justify-center rounded-[var(--ap-btn-radius)] px-6 py-2.5 text-sm font-extrabold transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05030a]"
                    style={{
                      backgroundColor: TICKET_ACTION_FILL,
                      color: TICKET_ACTION_INK,
                      boxShadow: `0 10px 26px ${TICKET_ACTION_FILL}73`,
                    }}
                  >
                    {tickets.chooseLabel}
                  </a>
                  <Link
                    href={attractionHref}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded text-[0.78rem] font-semibold text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    {ui.learnMore}
                    <span aria-hidden="true" className="inline-flex" style={{ color: hex }}>
                      <SolarIcon name="arrow-right" size="0.9em" />
                    </span>
                  </Link>
                </div>

                {/* Łącznik „+" (nie po ostatnim portalu) */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-center px-1 py-1 sm:items-start sm:px-2 sm:py-0 lg:px-4"
                  >
                    <span
                      className="text-3xl font-normal leading-none sm:mt-[min(13vw,8.5rem)] sm:text-[2.6rem]"
                      style={{ color: linkColor, textShadow: `0 0 16px ${linkColor}88` }}
                    >
                      +
                    </span>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Panel pakietowy — szeroki, niski, z gradientową obwódką koral→fiolet→turkus */}
        <div
          className={`mt-12 rounded-[1.6rem] p-px sm:mt-16 ${revealCls}`}
          style={{
            background: "linear-gradient(100deg,#ff4773 0%,#a855f7 50%,#56ddea 100%)",
            boxShadow: "0 26px 60px rgba(0,0,0,0.5)",
            "--wpk-reveal-delay": "520ms",
          } as CSSProperties}
        >
          <div className="relative overflow-hidden rounded-[calc(1.6rem-1px)] bg-[#0b1022] px-5 py-6 sm:px-8 sm:py-7">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 130% at 0% 50%, rgba(255,71,115,0.12), transparent 62%), radial-gradient(60% 130% at 100% 50%, rgba(86,221,234,0.12), transparent 62%)",
              }}
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
              {/* Info: etykieta + tytuł | skład + tagline */}
              <div className="flex min-w-0 flex-col gap-4 lg:flex-1 lg:flex-row lg:items-center lg:gap-7">
                <div className="lg:shrink-0">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color: "#ff8da3",
                      border: "1px solid rgba(255,71,115,0.4)",
                      background: "rgba(255,71,115,0.08)",
                    }}
                  >
                    {tickets.bestPriceLabel}
                  </span>
                  <h3 className="mt-3 text-[1.55rem] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] text-white sm:text-[1.7rem] md:whitespace-nowrap">
                    {tickets.bundleTitle}
                  </h3>
                </div>

                <div className="min-w-0 lg:border-l lg:border-white/10 lg:pl-7">
                  <p className="text-lg font-extrabold tracking-[-0.01em] sm:text-xl">
                    {options.map((o, i) => (
                      <Fragment key={o.title}>
                        {i > 0 && <span className="text-white/35"> + </span>}
                        <span style={{ color: TICKET_ACCENTS[o.accent ?? "cyan"] }}>
                          {o.title.toUpperCase()}
                        </span>
                      </Fragment>
                    ))}
                  </p>
                  <p className="mt-1 text-sm text-white/50">{tickets.bundleTagline}</p>
                </div>
              </div>

              {/* Akcje: dwie taryfy + przycisk.
                  Każda kolumna czyta się jednym przebiegiem z góry na dół:
                  etykieta taryfy → cena → ile to samo kosztuje osobno → ile zyskujesz.
                  Oszczędność jest zwykłym tekstem, a nie pigułką w kolorze cyjanu,
                  bo wcześniej wyglądała jak drugi przycisk i konkurowała z CTA. */}
              <div className="flex w-full flex-wrap items-stretch gap-3 lg:w-auto lg:shrink-0 lg:justify-end">
                {tariffs.map((tariff) => (
                  <div
                    key={tariff.key}
                    className={`flex min-w-[8.5rem] flex-1 flex-col items-start px-1 text-left sm:min-w-[9rem] lg:flex-none ${
                      tariff.lead ? "" : "border-l border-white/10 pl-5 sm:pl-6"
                    }`}
                  >
                    {/* Etykieta taryfy jako obwiedziona pigułka — czyta się jak
                        nagłówek kolumny, a nie jak kolejna linia tekstu. */}
                    <span className="inline-flex rounded-full border border-white/25 px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.16em] text-white/70">
                      {tariff.label}
                    </span>
                    <p className="mt-2 flex items-baseline gap-1">
                      <span className="text-[1.9rem] font-extrabold leading-none text-white sm:text-[2.1rem]">
                        {tariff.num}
                      </span>
                      <span className="text-sm font-bold text-white/75">
                        {promoCur}
                        {perUnit}
                      </span>
                    </p>
                    {/* Słowo „osobno" zostaje mimo wzorca z makiety: samo przekreślenie
                        czyta się jak CENA POPRZEDNIA, a to porównanie do sumy trzech
                        biletów. Bez tego rozróżnienia wchodzimy pod dyrektywę Omnibus. */}
                    <p className="mt-1.5 text-[0.68rem] text-white/40">
                      {tickets.separatelyLabel}{" "}
                      <span className="line-through">{tariff.separately}</span>
                    </p>
                    <span
                      className="mt-2 inline-flex rounded-full px-2.5 py-1 text-[0.64rem] font-semibold"
                      style={{
                        color: "#7fe9f2",
                        border: "1px solid rgba(86,221,234,0.4)",
                        background: "rgba(86,221,234,0.08)",
                      }}
                    >
                      {tariff.savings}
                    </span>
                  </div>
                ))}

                {/* Przycisk „Kup pakiet" — jedyny element w kolorze cyjanu */}
                <BookingLink
                  href={packageHref}
                  className="ticket-pill mx-auto inline-flex w-full max-w-[18rem] shrink-0 items-center justify-center self-center rounded-[var(--ap-btn-radius)] px-7 py-3 text-sm font-extrabold transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1022] sm:mx-0 sm:w-auto sm:max-w-none"
                  style={{
                    backgroundColor: "#56ddea",
                    color: "#04222a",
                    boxShadow: "0 12px 30px rgba(86,221,234,0.4)",
                  }}
                >
                  {tickets.packageCta}
                </BookingLink>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
    </ScrollMotionItem>
  );
});

const EventsPromoSection = memo(function EventsPromoSection({
  promo,
}: {
  promo: PromoTile;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState(promo.images[0] ?? "");
  const [previousImageSrc, setPreviousImageSrc] = useState<string | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [imagesReady, setImagesReady] = useState(promo.images.length <= 1);
  const sekcjaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    setActiveImageIndex(0);
    setCurrentImageSrc(promo.images[0] ?? "");
    setPreviousImageSrc(null);
    setIsCrossfading(false);
    setImagesReady(promo.images.length <= 1);

    if (promo.images.length <= 1 || typeof window === "undefined") {
      return () => {
        cancelled = true;
      };
    }

    // Obrazy dociagamy DOPIERO, gdy sekcja zbliza sie do ekranu.
    //
    // waitForImagesReady ustawia loading="eager" i wymusza pobranie od razu po
    // hydracji — a ta sekcja lezy na samym dole strony. Zmierzone: 156 KB
    // (3 pliki format-showcase) zajmowalo lacze dokladnie wtedy, gdy walczymy
    // o LCP, czyli ~780 ms pasma na tresc, ktorej uzytkownik jeszcze nie widzi.
    // rootMargin 240px — ten sam zapas co w AdaptiveVideo i FaqPreviewSection.
    const kontener = sekcjaRef.current;
    if (!kontener || typeof IntersectionObserver === "undefined") {
      void waitForImagesReady(promo.images).then(() => {
        if (!cancelled) setImagesReady(true);
      });
      return () => {
        cancelled = true;
      };
    }

    const obserwator = new IntersectionObserver(
      (wpisy) => {
        if (!wpisy.some((w) => w.isIntersecting)) return;
        obserwator.disconnect();
        void waitForImagesReady(promo.images).then(() => {
          if (!cancelled) setImagesReady(true);
        });
      },
      { rootMargin: "240px 0px" },
    );
    obserwator.observe(kontener);

    return () => {
      cancelled = true;
      obserwator.disconnect();
    };
  }, [promo.images]);

  useEffect(() => {
    if (!imagesReady || promo.images.length <= 1 || typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (document.hidden) {
        return;
      }

      setActiveImageIndex((currentIndex) => (currentIndex + 1) % promo.images.length);
    }, EVENTS_PROMO_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [imagesReady, promo.images]);

  useEffect(() => {
    const nextImageSrc = promo.images[activeImageIndex];
    if (!imagesReady || !nextImageSrc || nextImageSrc === currentImageSrc || typeof window === "undefined") {
      return;
    }

    let cancelled = false;
    let firstFrameId = 0;
    let secondFrameId = 0;
    let timeoutId: number | null = null;

    setPreviousImageSrc(currentImageSrc);
    setCurrentImageSrc(nextImageSrc);
    setIsCrossfading(false);

    firstFrameId = window.requestAnimationFrame(() => {
      if (cancelled) {
        return;
      }

      secondFrameId = window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        setIsCrossfading(true);
      });
    });

    timeoutId = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      setPreviousImageSrc(null);
      setIsCrossfading(false);
    }, EVENTS_PROMO_FADE_MS);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [activeImageIndex, currentImageSrc, imagesReady, promo.images]);

  return (
    <ScrollMotionItem strength="soft" delay={70} float={false} className="home-deferred-block">
      <div
        ref={sekcjaRef}
        className="mx-auto w-full max-w-[92rem] 2xl:max-w-[116rem] min-[1800px]:max-w-[138rem]"
      >
        <div className="relative grid items-stretch overflow-hidden rounded-[2rem] ring-1 ring-[color:var(--ap-border)] lg:grid-cols-2">
          <div className="relative min-h-[18rem] sm:min-h-[22rem] lg:min-h-[30rem]">
            {previousImageSrc ? (
              <Image
                src={previousImageSrc}
                alt={promo.imageAlt}
                fill
                sizes="(min-width: 1024px) 46rem, 100vw"
                key={previousImageSrc}
                className={`object-cover transition-opacity duration-[2400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isCrossfading ? "opacity-0" : "opacity-100"
                }`}
                loading="lazy"
                decoding="async"
              />
            ) : null}
            {currentImageSrc ? (
              <Image
                src={currentImageSrc}
                alt={promo.imageAlt}
                fill
                sizes="(min-width: 1024px) 46rem, 100vw"
                key={currentImageSrc}
                className={`object-cover transition-opacity duration-[2400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  previousImageSrc ? (isCrossfading ? "opacity-100" : "opacity-0") : "opacity-100"
                }`}
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#141830]/45 via-transparent to-[#4fcfde]/12 lg:bg-gradient-to-r lg:from-transparent lg:to-[color:var(--ap-surface)]/70"
              aria-hidden="true"
            />
          </div>
          <div className="relative flex flex-col justify-center gap-3 bg-[color:var(--ap-surface)] px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-14 lg:text-left">
            <h2 className="ap-type-section-title text-balance">{promo.title}</h2>
            <p className="ap-type-section-body mx-auto max-w-2xl lg:mx-0">{promo.description}</p>
            <div className="mt-4 flex justify-center lg:justify-start">
              <PrimaryButton
                href={promo.href}
                size="md"
                className="!bg-[linear-gradient(135deg,#2fb9cc,#5ad7e8)] !font-extrabold !text-[#04222a] !shadow-[0_8px_22px_rgba(79,207,222,0.4)] ring-[color:rgba(79,207,222,0.6)] hover:!brightness-110"
              >
                {promo.cta}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ScrollMotionItem>
  );
});
