"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import TourLineAccentTitle from "@/app/components/TourLineAccentTitle";
import TourLineGalleryRow from "@/app/components/TourLineGalleryRow";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  K360_BOOKING_CATEGORY,
  K360_BOOKING_SERVICES,
} from "@/lib/booking";
import { PROMO_PACKAGES } from "@/lib/promoPackages";

type Locale = "pl" | "en" | "pt";

type HeroMoment = {
  title: string;
  lines: string[];
};
type Feature = { badge: string; title: string; body: string };
type GalleryItem = { title: string; body: string; image: string };
type FeatureStat = { value: string; label: string };
type TicketEligibilityItem = {
  label: string;
  body: string;
};
type TicketEligibilityInfo = {
  triggerLabel: string;
  title: string;
  intro: string;
  items: TicketEligibilityItem[];
};
type TicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  price: string;
  priceLabel?: string;
  bookingServiceName: string;
  bookingQuantity?: number;
  eligibilityInfo?: TicketEligibilityInfo;
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

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function TicketEligibilityPopover({
  detail,
  info,
  isOpen,
  onToggle,
  onClose,
}: {
  detail: string;
  info: TicketEligibilityInfo;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="w-full max-w-sm">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={`${detail}. ${info.triggerLabel}`}
        className={cx(
          "ticket-list-panel flex w-full items-center gap-3 text-left text-white/78 transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ap-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ap-bg)]",
          isOpen &&
            "border-[color:var(--ap-accent)] bg-[color:var(--ap-surface-strong)] shadow-[0_0_0_1px_rgba(79,207,222,0.15),0_18px_34px_rgba(0,0,0,0.2)]",
        )}
        onClick={onToggle}
      >
        <span className="ticket-detail-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#4fcfde]" />
        <span className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-current">
          {detail}
        </span>
        <span
          className={cx(
            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/14 bg-white/8 text-[0.9rem] font-semibold leading-none text-white/82 transition-transform duration-200 ease-out",
            isOpen && "scale-105 border-[color:var(--ap-accent)] text-[color:var(--ap-accent)]",
          )}
          aria-hidden="true"
        >
          i
        </span>
      </button>

      <div
        id={panelId}
        className={cx(
          "grid transition-[grid-template-rows,opacity,margin-top] duration-200 ease-out",
          isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="relative mx-auto w-full rounded-[1.4rem] border border-[color:var(--ap-border)] bg-[color:var(--ap-surface-contrast)] px-4 py-4 text-left shadow-[0_22px_48px_rgba(0,0,0,0.2)] sm:max-w-[22rem] sm:px-5">
            <span
              className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-[color:var(--ap-border)] bg-[color:var(--ap-surface-contrast)]"
              aria-hidden="true"
            />
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--ap-accent-soft)] text-[color:var(--ap-accent-contrast)]">
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
                  <path
                    d="M10 5.25a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Zm-1 4.1h1.35v5.4H9z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--ap-accent)]">
                  {info.triggerLabel}
                </p>
                <h4 className="mt-2 text-base font-semibold leading-tight text-[color:var(--ap-text-strong)]">
                  {info.title}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--ap-text-dim)]">
                  {info.intro}
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {info.items.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="mt-2 inline-flex h-2 w-2 shrink-0 rounded-full bg-[color:var(--ap-accent)] shadow-[0_0_10px_rgba(79,207,222,0.4)]" />
                  <div>
                    <p className="text-sm font-semibold leading-snug text-[color:var(--ap-text)]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--ap-text-dim)]">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const COPY: Record<
  Locale,
  {
    heroMoment: HeroMoment;
    heroTag: string;
    heroTitle: string;
    videoFallback: string;
    featuresTitle: string;
    featuresIntro: string;
    featuresIntroHighlight: string;
    featureStats: FeatureStat[];
    features: Feature[];
    galleryTitle: string;
    galleryItems: GalleryItem[];
    promoTicket: PromoTicketOption;
    legacyCombinedPromoTicket?: PromoTicketOption;
    ticketsTitle: string;
    ticketsIntro: string;
    ticketsPriceLabel: string;
    ticketsButton: string;
    ticketsOptions: TicketOption[];
  }
> = {
  pl: {
    heroMoment: {
      title: "Bilety już dostępne!",
      lines: ["Kup bilety już teraz na „One Step Beyond: A Journey to Mars”."],
    },
    heroTag: "Atrakcje",
    heroTitle: "Projekcja K360",
    videoFallback: "Twój browser nie wspiera elementu video.",
    featuresTitle: "PRZEŻYJ projekcję",
    featuresIntro:
      "Projekcja K360 działa skalą, przestrzenią i pełnym zanurzeniem zamiast klasycznej projekcji salowej.",
    featuresIntroHighlight:
      "Aktualnym seansem jest „One Step Beyond: A Journey to Mars” — trwa około 30 minut i odbywa się w języku polskim.",
    featureStats: [
      { value: "15 m", label: "wysokość kopuły" },
      { value: "30 min", label: "czas trwania seansu" },
      { value: "48 m", label: "średnica przestrzeni" },
    ],
    features: [
      {
        badge: "Fulldome",
        title: "Format fulldome 360°",
        body: "Film został przygotowany z myślą o kopułach i otacza widza obrazem, który wypełnia całe pole widzenia.",
      },
      {
        badge: "Mars",
        title: "Podróż na Marsa",
        body: "To krótka, immersyjna opowieść o przyszłości misji kosmicznych i drodze, która prowadzi dalej niż Księżyc.",
      },
      {
        badge: "Głos",
        title: "Narracja Richarda Armitage’a",
        body: "Znany, filmowy głos prowadzi widza przez kolejne etapy wyprawy i buduje skalę całej opowieści.",
      },
      {
        badge: "Ziggy",
        title: "Perspektywa Ziggy’ego",
        body: "Historię oglądamy także oczami maskotki astronauty, co nadaje kosmicznej technologii bardziej ludzki wymiar.",
      },
      {
        badge: "Audio",
        title: "Mars, obraz i dźwięk",
        body: "Surowa estetyka Marsa, klaustrofobiczna podróż i ścieżka dźwiękowa składają się na mocne, pełne zanurzenie.",
      },
      {
        badge: "Doświadczenie",
        title: "Największa przestrzeń fulldome w Europie",
        body: "Projekcja K360 to największy obiekt tego typu w Europie i skaluje projekcję do poziomu, którego nie da się osiągnąć tradycyjnie.",
      },
    ],
    galleryTitle: "Zobacz przestrzeń",
    galleryItems: [
      {
        title: "Kadr z projekcji",
        body: "Światło i dźwięk otaczają widza ze wszystkich stron.",
        image: "/galeria/K360/1.webp",
      },
      {
        title: "Kadr z projekcji",
        body: "Fulldome na całej kopule — największa przestrzeń tego typu w Europie.",
        image: "/galeria/K360/2.webp",
      },
      {
        title: "Kadr z projekcji",
        body: "Obraz 360° wypełnia całe pole widzenia widowni.",
        image: "/galeria/K360/3.webp",
      },
      {
        title: "Kadr z projekcji",
        body: "Surowa estetyka Marsa — projekcja działa skalą i kolorem.",
        image: "/galeria/K360/4.webp",
      },
      {
        title: "Wnętrze kopuły",
        body: "Pełna skala konstrukcji widziana od wewnątrz.",
        image: "/galeria/K360/K360_1.webp",
      },
      {
        title: "Pod kopułą",
        body: "Architektura przestrzeni przygotowanej pod immersję 360°.",
        image: "/galeria/K360/K360_2.webp",
      },
    ],
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
    legacyCombinedPromoTicket: {
      badge: "Pakiet",
      title: "K360 + Projekt: MARS",
      subtitle:
        "Pakiet promocyjny łączący projekcję K360 z Projektem MARS — dwie atrakcje w jednej cenie.",
      details: ["Dwie atrakcje w jednym dniu"],
      priceLabel: "Cena normalna",
      price: "89,00 zł",
      savings: "Oszczędzasz 29,00 zł",
      savingsPercent: "25%",
      reducedPriceLabel: "Cena ulgowa",
      reducedPrice: "79,00 zł",
      reducedSavings: "Oszczędzasz 19,00 zł",
      reducedSavingsPercent: "19%",
      button: "Wybierz pakiet",
    },
    ticketsTitle: "Bilety na projekcję K360",
    ticketsIntro:
      "Najpierw wybierz pakiet albo wariant biletu. Po kliknięciu formularz otworzy od razu właściwą opcję. Seans odbywa się w języku polskim i trwa około 30 minut.",
    ticketsPriceLabel: "Cena za osobę",
    ticketsButton: "Kup bilet",
    ticketsOptions: [
      {
        badge: "Normalny",
        title: "Bilet normalny",
        subtitle: "Projekcja K360",
        details: ["Cena regularna za osobę"],
        price: "49 zł",
        bookingServiceName: K360_BOOKING_SERVICES.normal,
      },
      {
        badge: "Ulgowy",
        title: "Bilet ulgowy",
        subtitle: "Projekcja K360",
        details: ["Cena ulgowa za osobę"],
        price: "39 zł",
        bookingServiceName: K360_BOOKING_SERVICES.reduced,
        eligibilityInfo: {
          triggerLabel: "Wymagania biletów ulgowych",
          title: "Komu przysługuje bilet ulgowy?",
          intro: "Przy wejściu wymagany jest dokument potwierdzający uprawnienie do ulgi.",
          items: [
            {
              label: "Dzieci i młodzież szkolna",
              body: "Dzieci od 3. roku życia i młodzież szkolna do 19. roku życia po okazaniu legitymacji szkolnej.",
            },
            {
              label: "Studenci i doktoranci",
              body: "Do ukończenia 26. roku życia po okazaniu ważnej legitymacji studenckiej lub doktoranckiej.",
            },
            {
              label: "Emeryci i renciści",
              body: "Po okazaniu legitymacji ze zdjęciem lub, jeśli legitymacja nie ma zdjęcia, wraz z dokumentem tożsamości.",
            },
            {
              label: "Osoby z niepełnosprawnością",
              body: "Po okazaniu orzeczenia o niepełnosprawności oraz dokumentu ze zdjęciem lub legitymacji osoby niepełnosprawnej. Ulga obejmuje także opiekuna.",
            },
          ],
        },
      },
      {
        badge: "Grupowy",
        title: "Bilet grupowy/szkolny",
        subtitle: "30-50 osób w grupie",
        details: ["Dla szkół i grup zorganizowanych", "39 zł za każdą osobę"],
        price: "1 170 - 1 950 zł",
        priceLabel: "Cena grupowa",
        bookingServiceName: K360_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
  },
  en: {
    heroMoment: {
      title: "Tickets available now",
      lines: ["Get your tickets now for “One Step Beyond: A Journey to Mars”."],
    },
    heroTag: "Attractions",
    heroTitle: "K360 projection",
    videoFallback: "Your browser does not support the video element.",
    featuresTitle: "EXPERIENCE the projection",
    featuresIntro:
      "K360 works through scale, space, and full immersion instead of a standard auditorium setup.",
    featuresIntroHighlight:
      "The current screening is “One Step Beyond: A Journey to Mars” — about 30 minutes, in Polish.",
    featureStats: [
      { value: "15 m", label: "dome height" },
      { value: "30 min", label: "screening duration" },
      { value: "48 m", label: "space diameter" },
    ],
    features: [
      {
        badge: "Fulldome",
        title: "Fulldome 360° format",
        body: "The film was created for dome venues and surrounds the audience with an image that fills the entire field of view.",
      },
      {
        badge: "Mars",
        title: "Journey to Mars",
        body: "It is a short immersive story about the future of space missions and the route that leads beyond the Moon.",
      },
      {
        badge: "Voice",
        title: "Narrated by Richard Armitage",
        body: "A familiar voice guides viewers through the next stages of the voyage and gives the story scale.",
      },
      {
        badge: "Ziggy",
        title: "Ziggy's perspective",
        body: "Part of the story is seen through the astronaut mascot, giving the space technology a more human dimension.",
      },
      {
        badge: "Audio",
        title: "Mars, image, and sound",
        body: "The raw visuals of Mars, the confined journey, and the soundtrack combine into a strong immersive experience.",
      },
      {
        badge: "Experience",
        title: "The largest fulldome space in Europe",
        body: "The K360 projection is the largest fulldome space in Europe, giving the projection a scale impossible to match in a standard auditorium.",
      },
    ],
    galleryTitle: "See the venue",
    galleryItems: [
      {
        title: "Frame from the projection",
        body: "Light and sound wrap around the audience from every side.",
        image: "/galeria/K360/1.webp",
      },
      {
        title: "Frame from the projection",
        body: "Fulldome across the entire ceiling — Europe's largest space of its kind.",
        image: "/galeria/K360/2.webp",
      },
      {
        title: "Frame from the projection",
        body: "A 360° image filling the audience's entire field of view.",
        image: "/galeria/K360/3.webp",
      },
      {
        title: "Frame from the projection",
        body: "The raw aesthetic of Mars — the projection works through scale and color.",
        image: "/galeria/K360/4.webp",
      },
      {
        title: "Inside the dome",
        body: "The full scale of the structure seen from within.",
        image: "/galeria/K360/K360_1.webp",
      },
      {
        title: "Under the dome",
        body: "Architecture built for full 360° immersion.",
        image: "/galeria/K360/K360_2.webp",
      },
    ],
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
    legacyCombinedPromoTicket: {
      badge: "Package",
      title: "K360 + Mars Project",
      subtitle:
        "Promotional package combining the K360 projection with the Mars Project — two attractions at one price.",
      details: ["Two attractions in a single day"],
      priceLabel: "Standard price",
      price: "89.00 PLN",
      savings: "You save 29.00 PLN",
      savingsPercent: "25%",
      reducedPriceLabel: "Reduced price",
      reducedPrice: "79.00 PLN",
      reducedSavings: "You save 19.00 PLN",
      reducedSavingsPercent: "19%",
      button: "Choose package",
    },
    ticketsTitle: "Tickets for K360 projection",
    ticketsIntro:
      "Choose the package or ticket type first. After clicking, the booking form will open with the matching option selected. The screening is available in Polish and lasts about 30 minutes.",
    ticketsPriceLabel: "Price per person",
    ticketsButton: "Buy tickets",
    ticketsOptions: [
      {
        badge: "Standard",
        title: "Standard ticket",
        subtitle: "K360 projection",
        details: ["Regular price per person"],
        price: "49 PLN",
        bookingServiceName: K360_BOOKING_SERVICES.normal,
      },
      {
        badge: "Reduced",
        title: "Reduced ticket",
        subtitle: "K360 projection",
        details: ["Reduced price per person"],
        price: "39 PLN",
        bookingServiceName: K360_BOOKING_SERVICES.reduced,
        eligibilityInfo: {
          triggerLabel: "Reduced ticket requirements",
          title: "Who can use a reduced ticket?",
          intro: "A valid document confirming the discount eligibility is required at entry.",
          items: [
            {
              label: "Children and school students",
              body: "Children from age 3 and school students up to age 19 with a valid school ID.",
            },
            {
              label: "University students and doctoral students",
              body: "Up to age 26 with a valid student or doctoral ID.",
            },
            {
              label: "Retirees and pensioners",
              body: "With a photo ID card or, if the card has no photo, together with an identity document.",
            },
            {
              label: "People with disabilities",
              body: "With a disability certificate and a photo ID, or with a disability ID card. The discount also applies to one caregiver.",
            },
          ],
        },
      },
      {
        badge: "Group",
        title: "Group / school ticket",
        subtitle: "30-50 people in a group",
        details: ["For schools and organized groups", "39 PLN per person"],
        price: "1,170 - 1,950 PLN",
        priceLabel: "Group price",
        bookingServiceName: K360_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
  },
  pt: {
    heroMoment: {
      title: "Bilhetes já disponíveis!",
      lines: ["Compra já os teus bilhetes para “One Step Beyond: A Journey to Mars”."],
    },
    heroTag: "Atrações",
    heroTitle: "Projeção K360",
    videoFallback: "O seu navegador não suporta o elemento de vídeo.",
    featuresTitle: "VIVE a projeção",
    featuresIntro:
      "O K360 funciona pela escala, espaço e imersão total em vez de uma sala de cinema clássica.",
    featuresIntroHighlight:
      "A sessão atual é “One Step Beyond: A Journey to Mars” — cerca de 30 minutos, em polaco.",
    featureStats: [
      { value: "15 m", label: "altura da cúpula" },
      { value: "30 min", label: "duração da sessão" },
      { value: "48 m", label: "diâmetro do espaço" },
    ],
    features: [
      {
        badge: "Fulldome",
        title: "Formato fulldome 360°",
        body: "O filme foi criado para cúpulas e envolve o público com uma imagem que ocupa todo o campo de visão.",
      },
      {
        badge: "Marte",
        title: "Viagem até Marte",
        body: "É uma história curta e imersiva sobre o futuro das missões espaciais e o caminho que vai além da Lua.",
      },
      {
        badge: "Voz",
        title: "Narração de Richard Armitage",
        body: "Uma voz marcante conduz o público pelas várias etapas da viagem e amplia a escala da narrativa.",
      },
      {
        badge: "Ziggy",
        title: "Perspetiva de Ziggy",
        body: "Parte da história é vista pelos olhos da mascote astronauta, dando uma dimensão mais humana à tecnologia espacial.",
      },
      {
        badge: "Áudio",
        title: "Marte, imagem e som",
        body: "A estética crua de Marte, a viagem confinada e a banda sonora criam uma experiência de forte imersão.",
      },
      {
        badge: "Experiência",
        title: "O maior espaço fulldome da Europa",
        body: "A projeção K360 é o maior espaço fulldome da Europa, dando à experiência uma escala impossível de reproduzir de forma tradicional.",
      },
    ],
    galleryTitle: "Ver o espaço",
    galleryItems: [
      {
        title: "Imagem da projeção",
        body: "Luz e som envolvem o público por todos os lados.",
        image: "/galeria/K360/1.webp",
      },
      {
        title: "Imagem da projeção",
        body: "Fulldome em toda a cúpula — o maior espaço deste tipo na Europa.",
        image: "/galeria/K360/2.webp",
      },
      {
        title: "Imagem da projeção",
        body: "Imagem 360° preenche todo o campo de visão da plateia.",
        image: "/galeria/K360/3.webp",
      },
      {
        title: "Imagem da projeção",
        body: "A estética crua de Marte — a projeção funciona pela escala e pela cor.",
        image: "/galeria/K360/4.webp",
      },
      {
        title: "Interior da cúpula",
        body: "A escala total da estrutura vista por dentro.",
        image: "/galeria/K360/K360_1.webp",
      },
      {
        title: "Sob a cúpula",
        body: "Arquitetura concebida para imersão total a 360°.",
        image: "/galeria/K360/K360_2.webp",
      },
    ],
    promoTicket: {
      badge: "Pacote",
      title: "Percurso + Projeção K360",
      subtitle:
        "Um grande pacote promocional que junta a visita aos bastidores com a projeção no K360.",
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
    legacyCombinedPromoTicket: {
      badge: "Pacote",
      title: "K360 + Projeto MARS",
      subtitle:
        "Pacote promocional que combina a projeção K360 com o Projeto Mars — duas atrações num só preço.",
      details: ["Duas atrações no mesmo dia"],
      priceLabel: "Preço normal",
      price: "89,00 PLN",
      savings: "Poupa 29,00 PLN",
      savingsPercent: "25%",
      reducedPriceLabel: "Preço reduzido",
      reducedPrice: "79,00 PLN",
      reducedSavings: "Poupa 19,00 PLN",
      reducedSavingsPercent: "19%",
      button: "Escolher pacote",
    },
    ticketsTitle: "Bilhetes para a projeção K360",
    ticketsIntro:
      "Escolha primeiro o pacote ou o tipo de bilhete. Após o clique, o formulário abre com a opção certa já selecionada. A sessão decorre em polaco e dura cerca de 30 minutos.",
    ticketsPriceLabel: "Preço por pessoa",
    ticketsButton: "Comprar bilhete",
    ticketsOptions: [
      {
        badge: "Normal",
        title: "Bilhete normal",
        subtitle: "Projeção K360",
        details: ["Preço normal por pessoa"],
        price: "49 PLN",
        bookingServiceName: K360_BOOKING_SERVICES.normal,
      },
      {
        badge: "Reduzido",
        title: "Bilhete reduzido",
        subtitle: "Projeção K360",
        details: ["Preço reduzido por pessoa"],
        price: "39 PLN",
        bookingServiceName: K360_BOOKING_SERVICES.reduced,
        eligibilityInfo: {
          triggerLabel: "Requisitos do bilhete reduzido",
          title: "Quem pode usar o bilhete reduzido?",
          intro: "À entrada é necessário apresentar um documento válido que confirme o direito ao desconto.",
          items: [
            {
              label: "Crianças e estudantes",
              body: "Crianças a partir dos 3 anos e estudantes até aos 19 anos mediante apresentação de cartão escolar.",
            },
            {
              label: "Estudantes universitários e doutorandos",
              body: "Até aos 26 anos mediante apresentação de cartão de estudante ou de doutorando válido.",
            },
            {
              label: "Reformados e pensionistas",
              body: "Mediante apresentação de cartão com fotografia ou, se o cartão não tiver fotografia, juntamente com documento de identificação.",
            },
            {
              label: "Pessoas com deficiência",
              body: "Mediante apresentação de comprovativo de deficiência e documento com fotografia, ou cartão de pessoa com deficiência. O desconto também inclui um acompanhante.",
            },
          ],
        },
      },
      {
        badge: "Grupo",
        title: "Bilhete grupo/escola",
        subtitle: "30-50 pessoas no grupo",
        details: ["Para escolas e grupos organizados", "39 PLN por pessoa"],
        price: "1 170 - 1 950 PLN",
        priceLabel: "Preço de grupo",
        bookingServiceName: K360_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
  },
};

export default function K360Content() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];
  const [openEligibilityTicket, setOpenEligibilityTicket] = useState<string | null>(null);
  const activeHero = copy.heroMoment;
  const regularFeatures = copy.features;
  const promoPackages = PROMO_PACKAGES[loc];

  useEffect(() => {
    document.body.classList.add("k360-route-active");

    return () => {
      document.body.classList.remove("k360-route-active");
    };
  }, []);

  return (
    <main className="k360-page relative z-10 min-h-screen overflow-hidden">
      <section className="relative z-10 px-3 pt-6 sm:px-6 sm:pt-12 lg:px-12 lg:pt-14">
        <div className="ap-shell mb-6 sm:mb-10 lg:mb-12">
          <div className="k360-hero-shell relative overflow-hidden rounded-2xl sm:rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="k360-hero-stage relative aspect-[4/5] sm:aspect-[16/9] bg-[#071020]">
              <AdaptiveVideo
                mp4Src="/k360/one_step_beyond.mp4"
                webmSrc="/k360/one_step_beyond.webm"
                poster="/k360/K360_poster.webp"
                className="absolute inset-0 h-full w-full object-cover"
                sizes="(min-width: 1200px) 72rem, 100vw"
                fallbackText={copy.videoFallback}
                priority
                rootMargin="320px 0px"
                preferPosterOnLowPower
              />
              <div className="k360-hero-overlay absolute inset-0 bg-gradient-to-b from-[#071524]/85 via-[#0b2340]/60 to-black/78" />
              <div className="absolute inset-0 opacity-60 mix-blend-soft-light bg-[radial-gradient(circle_at_20%_25%,rgba(76,153,255,0.25),transparent_45%),radial-gradient(circle_at_75%_20%,rgba(24,103,201,0.22),transparent_42%),radial-gradient(circle_at_50%_75%,rgba(7,48,108,0.28),transparent_46%)]" />
              <div className="relative flex h-full items-center justify-center p-4 sm:p-8 md:p-10 text-center force-overlay">
                <div className="space-y-3 sm:space-y-4 ap-page-intro-stagger">
                  <div className="relative mx-auto flex min-h-[5.5rem] max-w-5xl items-center justify-center sm:min-h-[9rem]">
                    <div
                      className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-[min(90vw,42rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,72,108,0.22)_0%,rgba(247,72,108,0.08)_42%,rgba(247,72,108,0)_74%)] opacity-80 blur-2xl"
                      aria-hidden="true"
                    />
                    <div className="relative max-w-5xl px-2 sm:px-6">
                      <p className="k360-hero-highlight text-balance text-[clamp(1.6rem,6.2vw,5rem)] font-black leading-[0.92] tracking-[-0.05em] sm:tracking-[-0.065em] text-white drop-shadow-[0_10px_34px_rgba(0,0,0,0.55)]">
                        {activeHero.title}
                      </p>
                      <div
                        className="k360-hero-divider mx-auto mt-3 sm:mt-4 h-[3px] w-20 sm:w-24 rounded-full bg-[linear-gradient(90deg,rgba(247,72,108,0),rgba(247,72,108,0.95),rgba(247,72,108,0))]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <p className="ap-type-kicker force-overlay-muted">
                    {copy.heroTag}
                  </p>
                  <h1 className="ap-type-hero-title force-overlay text-[clamp(2.4rem,8vw,5.9rem)] font-black tracking-[-0.045em] sm:tracking-[-0.06em] drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {copy.heroTitle}
                  </h1>
                  <div className="mx-auto min-h-[4.5rem] sm:min-h-[6.2rem] max-w-3xl">
                    <p className="ap-type-hero-subtitle force-overlay-dim mx-auto max-w-3xl text-[clamp(0.95rem,0.9rem+0.85vw,1.72rem)] font-medium leading-[1.4] sm:leading-[1.45] text-white/86">
                      {activeHero.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 pb-10 sm:px-6 sm:pb-16 lg:px-12">
        <div className="ap-shell ap-page-stack">
          <ScrollMotionItem strength="strong" delay={110} className="ap-deferred-section">
            <div className="py-2 sm:py-4">
              <div className="space-y-4 sm:space-y-6 text-center">
                {(() => {
                  const trimmed = copy.featuresTitle.trim();
                  const firstSpace = trimmed.indexOf(" ");
                  const accent = firstSpace > 0 ? trimmed.slice(0, firstSpace) : trimmed;
                  const rest = firstSpace > 0 ? trimmed.slice(firstSpace) : "";
                  return (
                    <h3 className="mx-auto max-w-5xl text-pretty text-[clamp(1.85rem,7vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] sm:tracking-[-0.04em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.55)]">
                      <span className="font-bold text-[#ff7a92]">{accent}</span>
                      {rest}
                    </h3>
                  );
                })()}
                <div className="mx-auto h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,rgba(247,72,108,0),rgba(247,72,108,0.95),rgba(247,72,108,0))]" />
                <p className="mx-auto max-w-4xl text-base sm:text-lg leading-relaxed text-white/72">
                  {copy.featuresIntro}
                </p>
                <p className="mx-auto max-w-4xl text-base sm:text-lg font-semibold leading-relaxed text-[#ff7a92]">
                  {copy.featuresIntroHighlight}
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-4 lg:mt-16 sm:grid-cols-2 xl:grid-cols-3 xl:auto-rows-fr">
                {regularFeatures.map((item, index) => (
                  <article
                    key={item.title}
                    className="k360-feature-card ap-tile ap-tile-sm ap-tile-interactive group relative flex flex-col items-center overflow-hidden rounded-2xl px-4 py-5 text-center transition-all duration-300 ease-out sm:px-5 sm:py-5 !border-[rgba(247,72,108,0.22)] hover:!border-[rgba(247,72,108,0.45)] focus-visible:!border-[rgba(247,72,108,0.45)]"
                    style={{ "--tour-delay": `${(index % 6) * 0.18}s` } as CSSProperties}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,72,108,0.08),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(247,72,108,0.04),transparent_32%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex w-full items-center justify-between gap-2.5">
                      <span className="inline-flex rounded-full border border-rose-400/35 bg-rose-500/15 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-rose-100 sm:text-[9px]">
                        {item.badge}
                      </span>
                      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/30 sm:text-[0.65rem]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="relative mt-3 flex w-full flex-col items-center gap-2.5 sm:gap-3">
                      <h4 className="text-pretty text-[clamp(1.05rem,1.5vw,1.35rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
                        {item.title}
                      </h4>
                      <p className="text-[0.82rem] leading-[1.55] text-white/70 sm:text-[0.86rem]">
                        {item.body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </ScrollMotionItem>

          <ScrollMotionItem strength="soft" delay={170} className="ap-deferred-section">
            <div className="space-y-6">
              <TourLineAccentTitle variant="red">{copy.galleryTitle}</TourLineAccentTitle>
              <TourLineGalleryRow items={copy.galleryItems} />
            </div>
          </ScrollMotionItem>

          <ScrollMotionItem strength="strong" delay={220} className="ap-deferred-section">
            <div id="k360-tickets">
              <div className="space-y-3 text-center">
                <h2 className="ap-type-section-title text-white">{copy.ticketsTitle}</h2>
                <div className="mx-auto h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,rgba(247,72,108,0),rgba(247,72,108,0.95),rgba(247,72,108,0))]" />
              </div>
              <div className="mt-8 space-y-6 sm:space-y-8">
                {promoPackages.map((promo) => (
                  <article
                    key={promo.title}
                    className="ap-tile ap-tile-lg ap-tile-accent relative overflow-hidden px-4 py-5 sm:px-7 sm:py-7"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,72,108,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(247,72,108,0.10),transparent_32%)]" />
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
                        <div className="ap-tile ap-tile-sm w-full max-w-[27rem] px-4 py-3.5 text-center sm:px-5 sm:py-4 lg:text-right">
                          <div className="grid grid-cols-2 gap-0 lg:text-right">
                            <div className="pr-3 sm:pr-4">
                              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/55 sm:text-xs">
                                {promo.priceLabel}
                              </p>
                              <p className="mt-1 text-xl font-semibold leading-none tracking-[-0.03em] text-white sm:text-2xl lg:text-[1.75rem]">
                                {promo.price}
                              </p>
                              <p className="mt-1.5 inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap text-[0.65rem] font-semibold leading-tight text-[#ff96aa] sm:text-[0.72rem]">
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
                              <p className="mt-1.5 inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap text-[0.65rem] font-semibold leading-tight text-[#ff96aa] sm:text-[0.72rem]">
                                <span>−{promo.reducedSavingsPercent}</span>
                                <span className="text-white/55">{promo.reducedSavings}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <PrimaryButton
                          href={buildBookingPath(loc, { category: promo.category })}
                          size="lg"
                          className="ticket-pill w-full whitespace-nowrap ring-[color:rgba(240,60,100,0.55)] sm:w-auto sm:min-w-[13rem]"
                        >
                          {promo.button}
                        </PrimaryButton>
                      </div>
                    </div>
                  </article>
                ))}

                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
                  {copy.ticketsOptions.map((option) => (
                    <article
                      key={option.title}
                      className="ap-tile ap-tile-lg relative flex flex-col overflow-hidden px-4 py-5 sm:px-7 sm:py-7"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,72,108,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(247,72,108,0.10),transparent_32%)]" />
                      <div className="relative flex h-full flex-col gap-4 sm:gap-5 text-center lg:text-left">
                        <span className="ticket-card-badge mx-auto lg:mx-0">{option.badge}</span>
                        <div className="space-y-2 sm:space-y-3">
                          <h3 className="text-pretty text-lg font-semibold leading-tight tracking-[-0.03em] text-white sm:text-xl lg:text-2xl">
                            {option.title}
                          </h3>
                          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/76 sm:text-base lg:mx-0 lg:text-lg">
                            {option.subtitle}
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:justify-start">
                          {option.details.map((detail, detailIndex) =>
                            detailIndex === 0 && option.eligibilityInfo ? (
                              <TicketEligibilityPopover
                                key={detail}
                                detail={detail}
                                info={option.eligibilityInfo}
                                isOpen={openEligibilityTicket === option.bookingServiceName}
                                onToggle={() =>
                                  setOpenEligibilityTicket((current) =>
                                    current === option.bookingServiceName ? null : option.bookingServiceName,
                                  )
                                }
                                onClose={() => setOpenEligibilityTicket(null)}
                              />
                            ) : (
                              <div
                                key={detail}
                                className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs text-white/72 sm:px-4 sm:py-2 sm:text-sm"
                              >
                                {detail}
                              </div>
                            ),
                          )}
                        </div>

                        <div className="mt-auto flex flex-col items-center gap-3 pt-2 sm:gap-4 lg:items-stretch">
                          <div className="ap-tile ap-tile-sm w-full px-4 py-3 text-center sm:px-5 sm:py-4">
                            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/60 sm:text-[0.7rem] sm:tracking-[0.25em]">{option.priceLabel ?? copy.ticketsPriceLabel}</p>
                            <p className="mt-1 text-2xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-[1.9rem] lg:text-[2.1rem]">
                              {option.price}
                            </p>
                          </div>

                          <PrimaryButton
                            href={buildBookingPath(loc, {
                              category: K360_BOOKING_CATEGORY,
                              service: option.bookingServiceName,
                              quantity: option.bookingQuantity,
                            })}
                            size="lg"
                            className="ticket-pill w-full whitespace-nowrap ring-[color:rgba(240,60,100,0.55)]"
                          >
                            {copy.ticketsButton}
                          </PrimaryButton>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </ScrollMotionItem>
        </div>
      </section>
    </main>
  );
}
