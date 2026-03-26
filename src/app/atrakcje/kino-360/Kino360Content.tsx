"use client";

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

type Feature = { title: string; body: string };
type GalleryItem = { title: string; body: string; image: string };
type TicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  price: string;
  bookingServiceName: string;
};

const COPY: Record<
  Locale,
  {
    heroSoon: string;
    heroTag: string;
    heroTitle: string;
    heroLeadLines: string[];
    videoFallback: string;
    featuresTitle: string;
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
    heroSoon: "Bilety już dostępne!",
    heroTag: "Atrakcje",
    heroTitle: "Kino 360°",
    heroLeadLines: [
      "Pierwszy seans już 18 kwietnia.",
      "Kup bilety już teraz na „One Step Beyond: A Journey to Mars”.",
    ],
    videoFallback: "Twój browser nie wspiera elementu video.",
    featuresTitle: "Pierwszy seans: One Step Beyond",
    features: [
      {
        title: "Format fulldome 360°",
        body: "Film został przygotowany z myślą o kopułach i otacza widza obrazem, który wypełnia całe pole widzenia.",
      },
      {
        title: "Podróż na Marsa",
        body: "To krótka, immersyjna opowieść o przyszłości misji kosmicznych i drodze, która prowadzi dalej niż Księżyc.",
      },
      {
        title: "Narracja Richarda Armitage’a",
        body: "Znany, filmowy głos prowadzi widza przez kolejne etapy wyprawy i buduje skalę całej opowieści.",
      },
      {
        title: "Perspektywa Ziggy’ego",
        body: "Historię oglądamy także oczami maskotki astronauty, co nadaje kosmicznej technologii bardziej ludzki wymiar.",
      },
      {
        title: "Mars, obraz i dźwięk",
        body: "Surowa estetyka Marsa, klaustrofobiczna podróż i ścieżka dźwiękowa składają się na mocne, pełne zanurzenie.",
      },
      {
        title: "Seans na otwarcie",
        body: "„One Step Beyond: A Journey to Mars” otwiera repertuar Kina 360° jako pierwszy pokaz dostępny od 18 kwietnia.",
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
    heroSoon: "Tickets available now",
    heroTag: "Attractions",
    heroTitle: "360° cinema",
    heroLeadLines: [
      "The first screening starts on April 18.",
      "Get your tickets now for “One Step Beyond: A Journey to Mars”.",
    ],
    videoFallback: "Your browser does not support the video element.",
    featuresTitle: "First screening: One Step Beyond",
    features: [
      {
        title: "Fulldome 360° format",
        body: "The film was created for dome venues and surrounds the audience with an image that fills the entire field of view.",
      },
      {
        title: "Journey to Mars",
        body: "It is a short immersive story about the future of space missions and the route that leads beyond the Moon.",
      },
      {
        title: "Narrated by Richard Armitage",
        body: "A familiar cinematic voice guides viewers through the next stages of the voyage and gives the story scale.",
      },
      {
        title: "Ziggy's perspective",
        body: "Part of the story is seen through the astronaut mascot, giving the space technology a more human dimension.",
      },
      {
        title: "Mars, image, and sound",
        body: "The raw visuals of Mars, the confined journey, and the soundtrack combine into a strong immersive experience.",
      },
      {
        title: "Opening screening",
        body: "“One Step Beyond: A Journey to Mars” opens the 360° Cinema program as the first show available from April 18.",
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
    heroSoon: "Bilhetes já disponíveis!",
    heroTag: "Atrações",
    heroTitle: "Cinema 360°",
    heroLeadLines: [
      "A primeira sessão é já a 18 de abril.",
      "Compra já os teus bilhetes para “One Step Beyond: A Journey to Mars”.",
    ],
    videoFallback: "O seu navegador não suporta o elemento de vídeo.",
    featuresTitle: "Primeira sessão: One Step Beyond",
    features: [
      {
        title: "Formato fulldome 360°",
        body: "O filme foi criado para cúpulas e envolve o público com uma imagem que ocupa todo o campo de visão.",
      },
      {
        title: "Viagem até Marte",
        body: "É uma história curta e imersiva sobre o futuro das missões espaciais e o caminho que vai além da Lua.",
      },
      {
        title: "Narração de Richard Armitage",
        body: "Uma voz cinematográfica conhecida conduz o público pelas várias etapas da viagem e amplia a escala da narrativa.",
      },
      {
        title: "Perspetiva de Ziggy",
        body: "Parte da história é vista pelos olhos da mascote astronauta, dando uma dimensão mais humana à tecnologia espacial.",
      },
      {
        title: "Marte, imagem e som",
        body: "A estética crua de Marte, a viagem confinada e a banda sonora criam uma experiência de forte imersão.",
      },
      {
        title: "Sessão de abertura",
        body: "“One Step Beyond: A Journey to Mars” inaugura a programação do Cinema 360° como primeira sessão disponível a partir de 18 de abril.",
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
                <div className="space-y-3 ap-page-intro-stagger">
                  <p className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {copy.heroSoon}
                  </p>
                  <p className="ap-type-kicker force-overlay-muted">
                    {copy.heroTag}
                  </p>
                  <h1 className="ap-type-hero-title force-overlay drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {copy.heroTitle}
                  </h1>
                  <p className="ap-type-hero-subtitle force-overlay-dim max-w-3xl mx-auto">
                    {copy.heroLeadLines.map((line) => (
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
      </section>

      <section className="px-4 pb-16 sm:pb-20">
        <div className="ap-shell ap-page-stack">
          <ScrollMotionItem strength="strong" delay={110} className="ap-deferred-section">
            <Card className="space-y-6" motion="off">
              <TourLineAccentTitle variant="cool">{copy.featuresTitle}</TourLineAccentTitle>
              <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {copy.features.map((item, index) => (
                  <Card
                    key={item.title}
                    dense
                    motion="off"
                    className="tour-info-card ap-tile h-full bg-white/8 ring-1 ring-white/10 text-white/90"
                    style={{ "--tour-delay": `${(index % 6) * 0.24}s` } as React.CSSProperties}
                  >
                    <div className="space-y-3">
                      <div className="inline-flex rounded-full bg-cyan-500/15 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-cyan-100 ring-1 ring-cyan-400/25">
                        360°
                      </div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="ap-type-section-body text-gray-200">{item.body}</p>
                    </div>
                  </Card>
                ))}
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
