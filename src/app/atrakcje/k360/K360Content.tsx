"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import Card from "@/app/components/Card";
import TourLineAccentTitle from "@/app/components/TourLineAccentTitle";
import TourLineGalleryRow from "@/app/components/TourLineGalleryRow";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  COMBINED_PROMO_BOOKING_CATEGORY,
  K360_BOOKING_CATEGORY,
  K360_BOOKING_SERVICES,
} from "@/lib/booking";

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
  bookingServiceName: string;
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
    featureStats: FeatureStat[];
    features: Feature[];
    galleryTitle: string;
    galleryItems: GalleryItem[];
    promoTicket: PromoTicketOption;
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
    featuresTitle: "Pierwsza projekcja: One Step Beyond",
    featuresIntro:
      "Premierowa projekcja otwiera projekcję K360 formatem, który działa skalą, przestrzenią i pełnym zanurzeniem, zamiast klasycznej projekcji salowej. Seans odbywa się w języku polskim i trwa około 30 minut.",
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
        badge: "Premiera",
        title: "Projekcja otwarcia",
        body: "„One Step Beyond: A Journey to Mars” otwiera repertuar projekcji K360.",
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
        title: "Kompleks kopuł nocą",
        body: "Widok z lotu ptaka na wszystkie kopuły Alvernia Planet.",
        image: "/galeria/Ogolne/webp/4.webp",
      },
      {
        title: "Wejście do kopuły",
        body: "Główne lobby z charakterystycznym łukowym portalem.",
        image: "/galeria/Ogolne/webp/5.webp",
      },
      {
        title: "Tunel wejściowy",
        body: "Przeszklony korytarz prowadzący do wnętrza kompleksu.",
        image: "/galeria/Ogolne/webp/6.webp",
      },
      {
        title: "Otoczenie kompleksu",
        body: "Po projekcji goście mogą eksplorować pozostałe strefy Alvernia Planet.",
        image: "/galeria/Ogolne/webp/1.webp",
      },
    ],
    promoTicket: {
      badge: "Pakiet",
      title: "Ścieżka + Projekcja K360",
      subtitle:
        "Jeden duży pakiet promocyjny, który łączy zwiedzanie Ścieżki filmowej z projekcją K360.",
      details: ["Około 3 godzin łącznie ze zwiedzaniem i seansem"],
      priceLabel: "Cena promocyjna",
      price: "119,00 zł",
      savings: "Oszczędzasz 9,00 zł",
      savingsPercent: "7%",
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
    featuresTitle: "First projection: One Step Beyond",
    featuresIntro:
      "The opening projection introduces K360 through scale, immersion, and a full-dome image instead of a standard auditorium setup. The screening is available in Polish and lasts about 30 minutes.",
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
        badge: "Opening",
        title: "Opening projection",
        body: "“One Step Beyond: A Journey to Mars” opens the K360 projection lineup.",
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
        title: "Domes complex at night",
        body: "Aerial view of all Alvernia Planet domes after dark.",
        image: "/galeria/Ogolne/webp/4.webp",
      },
      {
        title: "Dome entrance",
        body: "Main lobby with the signature arched portal.",
        image: "/galeria/Ogolne/webp/5.webp",
      },
      {
        title: "Entrance tunnel",
        body: "A glass corridor leading into the complex interior.",
        image: "/galeria/Ogolne/webp/6.webp",
      },
      {
        title: "Around the complex",
        body: "After the projection, guests can explore other Alvernia Planet zones.",
        image: "/galeria/Ogolne/webp/1.webp",
      },
    ],
    promoTicket: {
      badge: "Package",
      title: "Film Path + K360 projection",
      subtitle:
        "One large promotional package that combines the Film Path visit with a K360 projection.",
      details: ["About 3 hours in total with the visit and screening"],
      priceLabel: "Promo price",
      price: "119.00 PLN",
      savings: "You save 9.00 PLN",
      savingsPercent: "7%",
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
    featuresTitle: "Primeira projeção: One Step Beyond",
    featuresIntro:
      "A projeção de estreia apresenta o K360 com um formato feito para impressionar pela escala, pela imersão e pela imagem fulldome em toda a cúpula. A sessão decorre em polaco e dura cerca de 30 minutos.",
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
        badge: "Estreia",
        title: "Projeção de abertura",
        body: "“One Step Beyond: A Journey to Mars” abre a programação de projeções do K360.",
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
        title: "Complexo de cúpulas à noite",
        body: "Vista aérea de todas as cúpulas da Alvernia Planet.",
        image: "/galeria/Ogolne/webp/4.webp",
      },
      {
        title: "Entrada da cúpula",
        body: "Lobby principal com o portal arqueado característico.",
        image: "/galeria/Ogolne/webp/5.webp",
      },
      {
        title: "Túnel de entrada",
        body: "Corredor envidraçado que conduz ao interior do complexo.",
        image: "/galeria/Ogolne/webp/6.webp",
      },
      {
        title: "Em torno do complexo",
        body: "Depois da projeção, os visitantes podem explorar outras zonas da Alvernia Planet.",
        image: "/galeria/Ogolne/webp/1.webp",
      },
    ],
    promoTicket: {
      badge: "Pacote",
      title: "Percurso + Projeção K360",
      subtitle:
        "Um grande pacote promocional que junta a visita aos bastidores com a projeção no K360.",
      details: ["Cerca de 3 horas no total com visita e sessão"],
      priceLabel: "Preço promocional",
      price: "119,00 PLN",
      savings: "Poupa 9,00 PLN",
      savingsPercent: "7%",
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
    ],
  },
};

export default function K360Content() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];
  const [openEligibilityTicket, setOpenEligibilityTicket] = useState<string | null>(null);
  const activeHero = copy.heroMoment;
  const regularFeatures = copy.features.slice(0, -1);

  return (
    <main className="k360-page relative z-10 min-h-screen">
      <section className="relative z-10 px-4 pt-12 sm:pt-16">
        <div className="ap-shell mb-10 sm:mb-12">
          <div className="k360-hero-shell relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
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
              <div className="relative flex h-full items-center justify-center p-5 sm:p-10 text-center force-overlay">
                <div className="space-y-4 ap-page-intro-stagger">
                  <div className="relative mx-auto flex min-h-[7rem] max-w-5xl items-center justify-center sm:min-h-[9rem]">
                    <div
                      className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-[min(90vw,42rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(126,246,255,0.22)_0%,rgba(126,246,255,0.08)_42%,rgba(126,246,255,0)_74%)] opacity-80 blur-2xl"
                      aria-hidden="true"
                    />
                    <div className="relative max-w-5xl px-4 sm:px-6">
                      <p className="k360-hero-highlight text-balance text-[clamp(2rem,6.2vw,5rem)] font-black leading-[0.92] tracking-[-0.065em] text-white drop-shadow-[0_10px_34px_rgba(0,0,0,0.55)]">
                        {activeHero.title}
                      </p>
                      <div
                        className="k360-hero-divider mx-auto mt-4 h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,rgba(126,246,255,0),rgba(126,246,255,0.95),rgba(126,246,255,0))]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <p className="ap-type-kicker force-overlay-muted">
                    {copy.heroTag}
                  </p>
                  <h1 className="ap-type-hero-title force-overlay text-[clamp(3.2rem,8vw,5.9rem)] font-black tracking-[-0.06em] drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {copy.heroTitle}
                  </h1>
                  <div className="mx-auto min-h-[6.2rem] max-w-3xl">
                    <p className="ap-type-hero-subtitle force-overlay-dim mx-auto max-w-3xl text-[clamp(1.08rem,0.96rem+0.85vw,1.72rem)] font-medium leading-[1.45] text-white/86">
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

      <section className="px-4 pb-16 sm:pb-20">
        <div className="ap-shell ap-page-stack">
          <ScrollMotionItem strength="strong" delay={110} className="ap-deferred-section">
            <Card className="space-y-5 sm:space-y-6" motion="off" dense>
              <div className="grid gap-7 xl:grid-cols-[minmax(20rem,0.84fr)_minmax(0,1.16fr)] xl:items-start xl:gap-8 2xl:grid-cols-[minmax(22rem,0.78fr)_minmax(0,1.22fr)]">
                <div className="space-y-5 lg:space-y-6 xl:sticky xl:top-20">
                  <div className="space-y-4 text-center sm:text-left">
                    <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#7ef6ff]/76">
                      360°
                    </p>
                    <h3 className="mx-auto max-w-[12ch] text-pretty text-[clamp(2.1rem,6.8vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:mx-0">
                      {copy.featuresTitle}
                    </h3>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/72 sm:mx-0">
                      {copy.featuresIntro}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                    {copy.featureStats.map((stat) => (
                      <div
                        key={`${stat.value}-${stat.label}`}
                        className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] px-4 py-4 text-center sm:text-left"
                      >
                        <p className="whitespace-nowrap text-[clamp(1.3rem,2.5vw,1.8rem)] font-semibold leading-none tracking-[-0.03em] text-white">
                          {stat.value}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:auto-rows-fr">
                  {regularFeatures.map((item, index) => (
                    <article
                      key={item.title}
                      className="k360-feature-card ap-interactive-surface group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] px-3.5 py-3.5 shadow-[0_18px_44px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out sm:px-4 sm:py-4"
                      style={{ "--tour-delay": `${(index % 6) * 0.18}s` } as CSSProperties}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(126,246,255,0.12),transparent_34%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                            {item.badge}
                          </span>
                          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/28">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h4 className="max-w-[11ch] text-pretty text-[clamp(1.18rem,1.7vw,1.6rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-white">
                          {item.title}
                        </h4>
                        <p className="text-[0.88rem] leading-[1.55] text-white/70 sm:text-[0.92rem]">
                          {item.body}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Card>
          </ScrollMotionItem>

          <ScrollMotionItem strength="soft" delay={170} className="ap-deferred-section">
            <Card className="space-y-6" variant="solid" motion="off">
              <TourLineAccentTitle variant="cool">{copy.galleryTitle}</TourLineAccentTitle>
              <TourLineGalleryRow items={copy.galleryItems} />
            </Card>
          </ScrollMotionItem>

          <ScrollMotionItem strength="strong" delay={220} className="ap-deferred-section">
            <Card
              id="k360-tickets"
              title={copy.ticketsTitle}
              titleCentered
              titleDivider
              dense
              motion="off"
            >
              <div className="mt-2 space-y-8">
                <article className="relative overflow-hidden rounded-[2rem] border border-[#4fcfde]/35 bg-[linear-gradient(145deg,rgba(39,47,76,0.96)_0%,rgba(26,31,54,0.98)_100%)] px-6 py-6 shadow-[0_18px_44px_rgba(0,0,0,0.28)] sm:px-7 sm:py-7">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,207,222,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(79,207,222,0.08),transparent_32%)]" />
                  <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                    <div className="space-y-5 text-center lg:text-left">
                      <span className="ticket-card-badge mx-auto lg:mx-0">{copy.promoTicket.badge}</span>
                      <div className="space-y-3">
                        <h3 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                          {copy.promoTicket.title}
                        </h3>
                        <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/76 sm:text-lg lg:mx-0">
                          {copy.promoTicket.subtitle}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                        {copy.promoTicket.details.map((detail) => (
                          <div
                            key={detail}
                            className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white/72"
                          >
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex w-full flex-col items-center gap-4 lg:w-auto lg:items-end">
                      <div className="w-full max-w-[22rem] rounded-[1.35rem] border border-white/12 bg-white/[0.05] px-4 py-4 text-center shadow-[0_14px_34px_rgba(0,0,0,0.2)] sm:px-5 lg:text-right">
                        <p className="text-sm text-white/68">{copy.promoTicket.priceLabel}</p>
                        <p className="mt-1 text-[1.9rem] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[2.1rem]">
                          {copy.promoTicket.price}
                        </p>
                        <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-[#8ff3ff] lg:justify-end">
                          <span>{copy.promoTicket.savings}</span>
                          <span className="rounded-full border border-[#8ff3ff]/25 bg-[#8ff3ff]/12 px-2.5 py-0.5 text-[0.78rem] leading-none text-[#b8f8ff]">
                            {copy.promoTicket.savingsPercent} taniej
                          </span>
                        </p>
                      </div>

                      <PrimaryButton
                        href={buildBookingPath(loc, {
                          category: COMBINED_PROMO_BOOKING_CATEGORY,
                        })}
                        size="lg"
                        className="ticket-pill min-w-[13rem] whitespace-nowrap ring-[color:rgba(240,60,100,0.55)]"
                      >
                        {copy.promoTicket.button}
                      </PrimaryButton>
                    </div>
                  </div>
                </article>

                <div className="mx-auto grid w-full max-w-[68rem] grid-cols-1 items-start gap-x-5 gap-y-8 lg:grid-cols-2">
                  {copy.ticketsOptions.map((option) => (
                    <div
                      key={option.title}
                      className="ticket-card ap-tile group mx-auto flex w-full max-w-[32rem] self-start flex-col rounded-3xl text-white/90 [&_.ticket-card-top]:px-4 [&_.ticket-card-top]:pt-3 [&_.ticket-card-top]:pb-0.5 sm:[&_.ticket-card-top]:px-5"
                    >
                      <div className="ticket-card-top">
                        <span className="ticket-card-badge">{option.badge}</span>
                      </div>
                      <div className="ticket-card-content flex h-full flex-col px-4 py-3.5 text-center sm:px-5 sm:py-4">
                        <h3 className="ticket-card-title text-[1.65rem] sm:text-[1.9rem] font-semibold text-white">
                          {option.title}
                        </h3>
                        <p className="ticket-card-subtitle mt-1.5 text-sm sm:text-[0.98rem] text-white/75">
                          {option.subtitle}
                        </p>
                        <div className="ticket-card-divider mt-4" />
                        <div className="mt-3.5 mb-5 flex flex-col items-center gap-2">
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
                                className="ticket-list-panel w-full max-w-[28rem] px-4 py-3 text-sm text-white/75"
                              >
                                <div className="ticket-detail flex gap-3">
                                  <span className="ticket-detail-dot mt-2 h-1.5 w-1.5 rounded-full bg-[#4fcfde] shrink-0" />
                                  <span>{detail}</span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="ticket-price-block mt-5 px-3 py-4">
                          <p className="ticket-price-label text-[0.7rem] uppercase tracking-[0.25em] text-white/60">
                            {copy.ticketsPriceLabel}
                          </p>
                          <p className="ticket-price mt-2 text-[1.8rem] sm:text-[2.2rem] font-bold text-amber-200">
                            {option.price}
                          </p>
                          <div className="mt-5 flex justify-center">
                            <PrimaryButton
                              href={buildBookingPath(loc, {
                                category: K360_BOOKING_CATEGORY,
                                service: option.bookingServiceName,
                              })}
                              size="md"
                              className="ticket-pill ring-[color:rgba(240,60,100,0.55)]"
                            >
                              {copy.ticketsButton}
                            </PrimaryButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </ScrollMotionItem>
        </div>
      </section>
    </main>
  );
}
