"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import Card from "@/app/components/Card";
import TourLineAccentTitle from "@/app/components/TourLineAccentTitle";
import TourLineGalleryRow from "@/app/components/TourLineGalleryRow";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  CINEMA_360_BOOKING_CATEGORY,
  CINEMA_360_BOOKING_SERVICES,
} from "@/lib/booking";

type Locale = "pl" | "en" | "pt";

type HeroMoment = {
  title: string;
  lines: string[];
};
type Feature = { badge: string; title: string; body: string };
type GalleryItem = { title: string; body: string; image: string };
type FeatureStat = { value: string; label: string };
type TicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  price: string;
  bookingServiceName: string;
};

const HERO_MOMENT_ROTATION_MS = 8200;
const HERO_MOMENT_SWAP_DELAY_MS = 520;

const COPY: Record<
  Locale,
  {
    heroMoments: HeroMoment[];
    heroTag: string;
    heroTitle: string;
    videoFallback: string;
    featuresTitle: string;
    featuresIntro: string;
    featureStats: FeatureStat[];
    features: Feature[];
    galleryTitle: string;
    galleryItems: GalleryItem[];
    ticketsTitle: string;
    ticketsIntro: string;
    ticketsPriceLabel: string;
    ticketsButton: string;
    ticketsOptions: TicketOption[];
  }
> = {
  pl: {
    heroMoments: [
      {
        title: "Bilety już dostępne!",
        lines: [
          "Pierwszy seans już 18 kwietnia.",
          "Kup bilety już teraz na „One Step Beyond: A Journey to Mars”.",
        ],
      },
      {
        title: "Nowy wymiar seansu",
        lines: [
          "Zobacz projekcję, która wypełnia całą kopułę i otacza widza z każdej strony.",
          "Kino 360° łączy skalę przestrzeni, obraz i dźwięk w jedno immersyjne doświadczenie.",
        ],
      },
      {
        title: "Największe kino 360° w Europie",
        lines: [
          "Pełnokopułowy obraz i dźwięk zaprojektowane dla pełnej immersji.",
          "Seans otacza widza w całości i działa w skali, której nie da się pomylić z klasycznym kinem.",
        ],
      },
    ],
    heroTag: "Atrakcje",
    heroTitle: "Kino 360°",
    videoFallback: "Twój browser nie wspiera elementu video.",
    featuresTitle: "Pierwszy seans: One Step Beyond",
    featuresIntro:
      "Premierowy pokaz otwiera Kino 360° formatem, który ma działać skalą, przestrzenią i pełnym zanurzeniem, a nie zwykłym ekranem w sali.",
    featureStats: [
      { value: "15 m", label: "wysokość kopuły" },
      { value: "2 000 m²", label: "powierzchnia kopuły" },
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
        title: "Seans na otwarcie",
        body: "„One Step Beyond: A Journey to Mars” otwiera repertuar Kina 360° jako pierwszy pokaz dostępny od 18 kwietnia.",
      },
      {
        badge: "Doświadczenie",
        title: "Największe kino 360° w Europie",
        body: "Kino 360° to największe kino tego typu w Europie i skaluje pokaz do poziomu, którego nie da się osiągnąć w tradycyjnej sali.",
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
        body: "Po seansie widzowie mogą eksplorować pozostałe strefy Alvernia Planet.",
        image: "/galeria/Ogolne/webp/1.webp",
      },
    ],
    ticketsTitle: "Bilety do Kina 360°",
    ticketsIntro:
      "Wybierz wariant biletu. Po kliknięciu formularz otworzy od razu dokładnie ten bilet.",
    ticketsPriceLabel: "Cena za osobę",
    ticketsButton: "Kup bilet",
    ticketsOptions: [
      {
        badge: "Normalny",
        title: "Bilet normalny",
        subtitle: "Seans w Kinie 360°",
        details: ["Cena regularna za osobę"],
        price: "49 zł",
        bookingServiceName: CINEMA_360_BOOKING_SERVICES.normal,
      },
      {
        badge: "Ulgowy",
        title: "Bilet ulgowy",
        subtitle: "Seans w Kinie 360°",
        details: ["Cena ulgowa za osobę"],
        price: "39 zł",
        bookingServiceName: CINEMA_360_BOOKING_SERVICES.reduced,
      },
    ],
  },
  en: {
    heroMoments: [
      {
        title: "Tickets available now",
        lines: [
          "The first screening starts on April 18.",
          "Get your tickets now for “One Step Beyond: A Journey to Mars”.",
        ],
      },
      {
        title: "A new dimension of cinema",
        lines: [
          "See what a screening feels like when the dome fills your entire field of view.",
          "360° Cinema brings scale, image, and sound together in one immersive experience.",
        ],
      },
      {
        title: "The largest 360° cinema in Europe",
        lines: [
          "A full-dome image and sound system designed for total immersion.",
          "The show surrounds the audience completely and feels nothing like a conventional cinema room.",
        ],
      },
    ],
    heroTag: "Attractions",
    heroTitle: "360° cinema",
    videoFallback: "Your browser does not support the video element.",
    featuresTitle: "First screening: One Step Beyond",
    featuresIntro:
      "The opening show launches the 360° cinema with a format built around scale, immersion, and a full-dome image rather than a standard auditorium screen.",
    featureStats: [
      { value: "15 m", label: "dome height" },
      { value: "2,000 m²", label: "dome floor area" },
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
        body: "A familiar cinematic voice guides viewers through the next stages of the voyage and gives the story scale.",
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
        title: "Opening screening",
        body: "“One Step Beyond: A Journey to Mars” opens the 360° Cinema program as the first show available from April 18.",
      },
      {
        badge: "Experience",
        title: "The largest 360° cinema in Europe",
        body: "The 360° cinema is the largest venue of its kind in Europe, giving the show a scale impossible to match in a standard auditorium.",
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
        body: "After the screening, guests can explore other Alvernia Planet zones.",
        image: "/galeria/Ogolne/webp/1.webp",
      },
    ],
    ticketsTitle: "360° cinema tickets",
    ticketsIntro:
      "Choose a ticket type. After clicking, the booking form will open with that exact ticket selected.",
    ticketsPriceLabel: "Price per person",
    ticketsButton: "Buy tickets",
    ticketsOptions: [
      {
        badge: "Standard",
        title: "Standard ticket",
        subtitle: "360° cinema screening",
        details: ["Regular price per person"],
        price: "49 PLN",
        bookingServiceName: CINEMA_360_BOOKING_SERVICES.normal,
      },
      {
        badge: "Reduced",
        title: "Reduced ticket",
        subtitle: "360° cinema screening",
        details: ["Reduced price per person"],
        price: "39 PLN",
        bookingServiceName: CINEMA_360_BOOKING_SERVICES.reduced,
      },
    ],
  },
  pt: {
    heroMoments: [
      {
        title: "Bilhetes já disponíveis!",
        lines: [
          "A primeira sessão é já a 18 de abril.",
          "Compra já os teus bilhetes para “One Step Beyond: A Journey to Mars”.",
        ],
      },
      {
        title: "Uma nova dimensão de cinema",
        lines: [
          "Descobre uma projeção que ocupa toda a cúpula e envolve o público por completo.",
          "O Cinema 360° junta escala, imagem e som numa experiência verdadeiramente imersiva.",
        ],
      },
      {
        title: "O maior cinema 360° da Europa",
        lines: [
          "Imagem e som fulldome desenhados para uma imersão total.",
          "A sessão envolve o público por completo e tem uma escala impossível de confundir com uma sala tradicional.",
        ],
      },
    ],
    heroTag: "Atrações",
    heroTitle: "Cinema 360°",
    videoFallback: "O seu navegador não suporta o elemento de vídeo.",
    featuresTitle: "Primeira sessão: One Step Beyond",
    featuresIntro:
      "A sessão de estreia lança o Cinema 360° com um formato feito para impressionar pela escala, pela imersão e pela imagem fulldome em toda a cúpula.",
    featureStats: [
      { value: "15 m", label: "altura da cúpula" },
      { value: "2 000 m²", label: "área da cúpula" },
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
        body: "Uma voz cinematográfica conhecida conduz o público pelas várias etapas da viagem e amplia a escala da narrativa.",
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
        title: "Sessão de abertura",
        body: "“One Step Beyond: A Journey to Mars” inaugura a programação do Cinema 360° como primeira sessão disponível a partir de 18 de abril.",
      },
      {
        badge: "Experiência",
        title: "O maior cinema 360° da Europa",
        body: "O Cinema 360° é o maior espaço deste tipo na Europa, dando à experiência uma escala impossível de reproduzir numa sala tradicional.",
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
        body: "Depois da sessão, os visitantes podem explorar outras zonas da Alvernia Planet.",
        image: "/galeria/Ogolne/webp/1.webp",
      },
    ],
    ticketsTitle: "Bilhetes para o Cinema 360°",
    ticketsIntro:
      "Escolha o tipo de bilhete. Após o clique, o formulário abre com esse bilhete já selecionado.",
    ticketsPriceLabel: "Preço por pessoa",
    ticketsButton: "Comprar bilhete",
    ticketsOptions: [
      {
        badge: "Normal",
        title: "Bilhete normal",
        subtitle: "Sessão no Cinema 360°",
        details: ["Preço normal por pessoa"],
        price: "49 PLN",
        bookingServiceName: CINEMA_360_BOOKING_SERVICES.normal,
      },
      {
        badge: "Reduzido",
        title: "Bilhete reduzido",
        subtitle: "Sessão no Cinema 360°",
        details: ["Preço reduzido por pessoa"],
        price: "39 PLN",
        bookingServiceName: CINEMA_360_BOOKING_SERVICES.reduced,
      },
    ],
  },
};

export default function Kino360Content() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];
  const [activeHeroMoment, setActiveHeroMoment] = useState(0);
  const [heroMomentVisible, setHeroMomentVisible] = useState(true);
  const heroMomentTimeoutRef = useRef<number | null>(null);
  const activeHero = copy.heroMoments[activeHeroMoment] ?? copy.heroMoments[0];
  const spotlightFeature = copy.features[copy.features.length - 1];
  const regularFeatures = copy.features.slice(0, -1);

  useEffect(() => {
    setActiveHeroMoment(0);
    setHeroMomentVisible(true);
    if (heroMomentTimeoutRef.current !== null) {
      window.clearTimeout(heroMomentTimeoutRef.current);
      heroMomentTimeoutRef.current = null;
    }
  }, [loc]);

  useEffect(() => {
    if (copy.heroMoments.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setHeroMomentVisible(false);
      if (heroMomentTimeoutRef.current !== null) {
        window.clearTimeout(heroMomentTimeoutRef.current);
      }
      heroMomentTimeoutRef.current = window.setTimeout(() => {
        setActiveHeroMoment((current) => (current + 1) % copy.heroMoments.length);
        setHeroMomentVisible(true);
        heroMomentTimeoutRef.current = null;
      }, HERO_MOMENT_SWAP_DELAY_MS);
    }, HERO_MOMENT_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
      if (heroMomentTimeoutRef.current !== null) {
        window.clearTimeout(heroMomentTimeoutRef.current);
        heroMomentTimeoutRef.current = null;
      }
    };
  }, [copy.heroMoments.length]);

  const activateHeroMoment = (index: number) => {
    if (index === activeHeroMoment) {
      return;
    }

    setHeroMomentVisible(false);
    if (heroMomentTimeoutRef.current !== null) {
      window.clearTimeout(heroMomentTimeoutRef.current);
    }

    heroMomentTimeoutRef.current = window.setTimeout(() => {
      setActiveHeroMoment(index);
      setHeroMomentVisible(true);
      heroMomentTimeoutRef.current = null;
    }, HERO_MOMENT_SWAP_DELAY_MS - 80);
  };

  return (
    <main className="kino360-page relative z-10 min-h-screen">
      <section className="relative z-10 px-4 pt-12 sm:pt-16">
        <div className="ap-shell mb-10 sm:mb-12">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="relative aspect-[4/5] sm:aspect-[16/9] bg-[#071020]">
              <AdaptiveVideo
                mp4Src="/kino360/one_step_beyond.mp4"
                webmSrc="/kino360/one_step_beyond.webm"
                poster="/kino360/Kino360_poster.webp"
                className="absolute inset-0 h-full w-full object-cover"
                sizes="(min-width: 1200px) 72rem, 100vw"
                fallbackText={copy.videoFallback}
                priority
                rootMargin="320px 0px"
                preferPosterOnLowPower
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#071524]/85 via-[#0b2340]/60 to-black/78" />
              <div className="absolute inset-0 opacity-60 mix-blend-soft-light bg-[radial-gradient(circle_at_20%_25%,rgba(76,153,255,0.25),transparent_45%),radial-gradient(circle_at_75%_20%,rgba(24,103,201,0.22),transparent_42%),radial-gradient(circle_at_50%_75%,rgba(7,48,108,0.28),transparent_46%)]" />
              <div className="relative flex h-full items-center justify-center p-5 sm:p-10 text-center force-overlay">
                <div className="space-y-4 ap-page-intro-stagger">
                  <div className="relative mx-auto flex min-h-[7rem] max-w-5xl items-center justify-center sm:min-h-[9rem]">
                    <div
                      className={`pointer-events-none absolute left-1/2 top-1/2 h-28 w-[min(90vw,42rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(126,246,255,0.22)_0%,rgba(126,246,255,0.08)_42%,rgba(126,246,255,0)_74%)] transition-[opacity,transform,filter] duration-[980ms] ${
                        heroMomentVisible
                          ? "opacity-80 scale-100 blur-2xl"
                          : "opacity-0 scale-[1.28] blur-[40px]"
                      }`}
                      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                      aria-hidden="true"
                    />
                    <div
                      className={`relative max-w-5xl rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,17,33,0.52)_0%,rgba(8,17,33,0.18)_100%)] px-5 py-4 shadow-[0_26px_70px_rgba(0,0,0,0.3)] backdrop-blur-[6px] transition-[opacity,transform,filter,border-color,box-shadow] duration-[980ms] sm:px-7 sm:py-5 ${
                        heroMomentVisible
                          ? "opacity-100 translate-y-0 scale-100 blur-0"
                          : "opacity-0 -translate-y-6 scale-[1.16] blur-[18px] border-white/0 shadow-none"
                      }`}
                      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      <p className="text-balance text-[clamp(2rem,6.2vw,5rem)] font-black leading-[0.92] tracking-[-0.065em] text-white drop-shadow-[0_10px_34px_rgba(0,0,0,0.55)]">
                        {activeHero.title}
                      </p>
                      <div
                        className={`mx-auto mt-4 h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,rgba(126,246,255,0),rgba(126,246,255,0.95),rgba(126,246,255,0))] transition-[opacity,transform] duration-[980ms] ${
                          heroMomentVisible ? "opacity-100 scale-100" : "opacity-0 scale-[1.45]"
                        }`}
                        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
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
                  <div
                    className={`mx-auto min-h-[6.2rem] max-w-3xl transition-[opacity,transform,filter] duration-[980ms] ${
                      heroMomentVisible
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-5 scale-[0.88] blur-[14px]"
                    }`}
                    style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                  >
                    <p className="ap-type-hero-subtitle force-overlay-dim mx-auto max-w-3xl text-[clamp(1.08rem,0.96rem+0.85vw,1.72rem)] font-medium leading-[1.45] text-white/86">
                      {activeHero.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {copy.heroMoments.map((moment, index) => (
                      <button
                        key={moment.title}
                        type="button"
                        onClick={() => activateHeroMoment(index)}
                        aria-label={moment.title}
                        aria-pressed={activeHeroMoment === index}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          activeHeroMoment === index
                            ? "w-10 bg-[#7ef6ff] shadow-[0_0_18px_rgba(126,246,255,0.45)]"
                            : "w-2.5 bg-white/28 hover:bg-white/50"
                        }`}
                      >
                        <span className="sr-only">{moment.title}</span>
                      </button>
                    ))}
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
            <Card className="space-y-6" motion="off">
              <TourLineAccentTitle variant="cool">{copy.featuresTitle}</TourLineAccentTitle>
              <div className="grid gap-8 xl:grid-cols-[minmax(22rem,0.88fr)_minmax(0,1.12fr)] xl:items-start xl:gap-10 2xl:grid-cols-[minmax(24rem,0.82fr)_minmax(0,1.18fr)]">
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
                        <p className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-semibold leading-none tracking-[-0.03em] text-white">
                          {stat.value}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <article className="kino360-feature-hero group relative overflow-hidden rounded-[2rem] border border-[#7ef6ff]/18 bg-[linear-gradient(180deg,rgba(126,246,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] px-5 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:px-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(126,246,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(77,134,255,0.18),transparent_40%)]" />
                    <div className="relative space-y-3">
                      <div className="space-y-3">
                        <h4 className="max-w-[12ch] text-pretty text-[clamp(1.9rem,4.4vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
                          {spotlightFeature.title}
                        </h4>
                        <p className="max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                          {spotlightFeature.body}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:auto-rows-fr">
                  {regularFeatures.map((item, index) => (
                    <article
                      key={item.title}
                      className="kino360-feature-card group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] px-5 py-5 shadow-[0_18px_44px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out sm:px-6 sm:py-6"
                      style={{ "--tour-delay": `${(index % 6) * 0.18}s` } as CSSProperties}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(126,246,255,0.12),transparent_34%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
                            {item.badge}
                          </span>
                          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/28">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h4 className="max-w-[12ch] text-pretty text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
                          {item.title}
                        </h4>
                        <p className="text-base leading-relaxed text-white/70">
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
              id="kino360-tickets"
              title={copy.ticketsTitle}
              titleCentered
              titleDivider
              dense
              motion="off"
            >
              <p className="ap-type-section-body text-center max-w-3xl mx-auto">{copy.ticketsIntro}</p>
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10">
                {copy.ticketsOptions.map((option) => (
                  <div
                    key={option.title}
                    className="ticket-card ap-tile group flex h-full flex-col rounded-3xl text-white/90"
                  >
                    <div className="ticket-card-top">
                      <span className="ticket-card-badge">{option.badge}</span>
                    </div>
                    <div className="ticket-card-content flex h-full flex-col p-5 sm:p-6 text-center">
                      <h3 className="ticket-card-title text-xl sm:text-2xl font-semibold text-white">
                        {option.title}
                      </h3>
                      <p className="ticket-card-subtitle mt-2 text-sm sm:text-base text-white/75">
                        {option.subtitle}
                      </p>
                      <div className="ticket-card-divider mt-6" />
                      <ul className="ticket-list-panel mt-5 mb-8 space-y-3 text-sm text-white/75 text-left mx-auto max-w-sm">
                        {option.details.map((detail) => (
                          <li key={detail} className="ticket-detail flex gap-3">
                            <span className="ticket-detail-dot mt-2 h-1.5 w-1.5 rounded-full bg-[#4fcfde] shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="ticket-price-block mt-auto pt-7">
                        <p className="ticket-price-label text-[0.7rem] uppercase tracking-[0.25em] text-white/60">
                          {copy.ticketsPriceLabel}
                        </p>
                        <p className="ticket-price mt-2 text-2xl sm:text-3xl font-bold text-amber-200">
                          {option.price}
                        </p>
                        <div className="mt-6 flex justify-center">
                          <PrimaryButton
                            href={buildBookingPath(loc, {
                              category: CINEMA_360_BOOKING_CATEGORY,
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
            </Card>
          </ScrollMotionItem>
        </div>
      </section>
    </main>
  );
}
