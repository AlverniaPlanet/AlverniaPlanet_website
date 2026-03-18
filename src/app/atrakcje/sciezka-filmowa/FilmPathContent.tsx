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
  FILM_PATH_BOOKING_CATEGORY,
  FILM_PATH_BOOKING_SERVICES,
} from "@/lib/booking";

type Locale = "pl" | "en" | "pt";

type Section = { title: string; body: string };

type K9Item = { title: string; body: string; image: string };

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

const COPY: Record<
  Locale,
  {
    heroTag: string;
    heroTitle: string;
    heroLead: string;
    story: Section[];
    k9Title: string;
    k9Body: string;
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
    story: [
      {
        title: "Jak tworzy się film?",
        body: "Podczas tej wycieczki odkryjesz, jak powstają sceny, jak nagrywa się dźwięk, jak działa green screen i czym zajmuje się scenografia.",
      },
      {
        title: "Zobacz i dotknij rekwizytów",
        body: "To nie repliki, ale autentyczne rekwizyty używane na prawdziwych planach filmowych.",
      },
      {
        title: "Odkryj magię filmowego dźwięku",
        body: "W sali postprodukcji zobaczysz, jak powstaje dźwięk do filmu — od dialogów, przez efekty specjalne, aż po miks i nagrania foley.",
      },
      {
        title: "Odkryj filmową scenografię",
        body: "Wejdź między ściany stworzone z myślą o filmowej opowieści. Poczuj klimat scen, które wcześniej istniały tylko w kadrze.",
      },
      {
        title: "Zostań częścią planu filmowego",
        body: "Weź udział w warsztatach i krok po kroku zobacz, jak powstaje scena filmu kręconego właśnie tutaj.",
      },
      {
        title: "Jakie role są na planie filmowym?",
        body: "Kim jest reżyser, a kto naprawdę „trzyma kamerę”? Kto zajmuje się scenografią, a kto dba o dźwięk? Poznasz kulisy pracy filmowej ekipy.",
      },
    ],
    k9Title: "Kopuła K9 — interaktywne strefy do eksploracji po trasie",
    k9Body:
      "Po głównej trasie odpocznij i poznaj strefy, które możesz swobodnie eksplorować: instalacje świetlne, fotobudki i interaktywne punkty przygotowane w kopule K9.",
    ticketsTitle: "Bilety na ścieżkę edukacyjną",
    ticketsIntro: "Cena jest taka sama dla obu opcji: 69 zł za osobę. Wybierz wariant rezerwacji.",
    ticketsPriceLabel: "Cena za osobę",
    ticketsPrice: "69 zł/os.",
    ticketsButton: "Kup bilet",
    ticketsOptions: [
      {
        badge: "Indywidualne",
        title: "Bilet indywidualny",
        subtitle: "1-10 osób na jednym bilecie",
        details: ["Dla osób indywidualnych i rodzin", "Płatność za osoby"],
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
      },
      {
        badge: "Grupowe",
        title: "Bilet grupowy (szkolny)",
        subtitle: "30-50 osób w grupie",
        details: ["Dla szkół i grup zorganizowanych", "Płatność za całą grupę"],
        priceLabel: "Cena za min. 30 osób",
        price: "2 070 zł/grupa",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
    videoFallback: "Twoja przeglądarka nie obsługuje elementu wideo.",
  },
  en: {
    heroTag: "Attractions",
    heroTitle: "Film path",
    heroLead: "Walk the tour that reveals how cinematic worlds are created.",
    story: [
      {
        title: "How is a film made?",
        body: "On this tour you'll discover how scenes are built, how sound is recorded, how green screen works, and what production design does.",
      },
      {
        title: "See and touch the props",
        body: "These aren't replicas—they are real props used on actual film sets.",
      },
      {
        title: "Explore the magic of film sound",
        body: "In the post-production room you'll see how film sound is created—from dialogue and special effects to the mix and foley recordings.",
      },
      {
        title: "Step into production design",
        body: "Walk through walls built for a film story. Feel the mood of scenes that previously lived only on screen.",
      },
      {
        title: "Join the film set",
        body: "Take part in workshops and see step by step how a scene is created right here.",
      },
      {
        title: "Who does what on set?",
        body: "Who's the director and who actually holds the camera? Who handles production design and who takes care of sound? Get the inside view of the crew at work.",
      },
    ],
    k9Title: "K9 dome — interactive zones to explore after the tour",
    k9Body:
      "After the main route, take a break and explore the zones freely: light installations, photo booths, and interactive spots prepared in the K9 dome.",
    ticketsTitle: "Educational path tickets",
    ticketsIntro: "Same price for both options: 69 PLN per person. Choose the booking type.",
    ticketsPriceLabel: "Price per person",
    ticketsPrice: "69 PLN/person",
    ticketsButton: "Buy tickets",
    ticketsOptions: [
      {
        badge: "Individual",
        title: "Individual ticket",
        subtitle: "1-10 people on one ticket",
        details: ["For individuals and families", "Pay per person"],
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
      },
      {
        badge: "Group",
        title: "Group ticket (schools)",
        subtitle: "30-50 people in a group",
        details: ["For schools and organized groups", "Pay for the whole group"],
        priceLabel: "Price for min. 30 people",
        price: "2,070 PLN/group",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
    videoFallback: "Your browser does not support the video element.",
  },
  pt: {
    heroTag: "Atrações",
    heroTitle: "Percurso cinematográfico",
    heroLead: "Percorra a visita que revela como se criam mundos cinematográficos.",
    story: [
      {
        title: "Como se faz um filme?",
        body: "Nesta visita vais descobrir como se constroem as cenas, como se grava o som, como funciona o chroma key e o que faz a direção de arte.",
      },
      {
        title: "Veja e toque nos adereços",
        body: "Não são réplicas — são adereços reais usados em filmagens.",
      },
      {
        title: "Descubra a magia do som do cinema",
        body: "Na sala de pós‑produção vais ver como nasce o som do filme — dos diálogos e efeitos especiais à mistura e gravações foley.",
      },
      {
        title: "Entre na cenografia do filme",
        body: "Caminhe entre paredes criadas para a história. Sinta o ambiente de cenas que antes existiam apenas no ecrã.",
      },
      {
        title: "Faça parte do set",
        body: "Participe em workshops e veja, passo a passo, como se cria uma cena filmada aqui mesmo.",
      },
      {
        title: "Quem faz o quê no set?",
        body: "Quem é o realizador e quem segura realmente a câmara? Quem trata da cenografia e quem cuida do som? Conheça os bastidores da equipa.",
      },
    ],
    k9Title: "Cúpula K9 — zonas interativas para explorar após o percurso",
    k9Body:
      "Depois do percurso principal, descanse e explore livremente: instalações de luz, cabines de fotos e pontos interativos na cúpula K9.",
    ticketsTitle: "Bilhetes para o percurso educativo",
    ticketsIntro: "Preço igual nas duas opções: 69 PLN por pessoa. Escolha o tipo de reserva.",
    ticketsPriceLabel: "Preço por pessoa",
    ticketsPrice: "69 PLN/pessoa",
    ticketsButton: "Comprar bilhete",
    ticketsOptions: [
      {
        badge: "Individual",
        title: "Bilhete individual",
        subtitle: "1-10 pessoas por bilhete",
        details: ["Para indivíduos e famílias", "Pagamento por pessoa"],
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
      },
      {
        badge: "Grupo",
        title: "Bilhete de grupo (escolas)",
        subtitle: "30-50 pessoas no grupo",
        details: ["Para escolas e grupos organizados", "Pagamento pelo grupo inteiro"],
        priceLabel: "Preço mín. 30 pessoas",
        price: "2 070 PLN/grupo",
        bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
        bookingQuantity: 30,
      },
    ],
    videoFallback: "O seu navegador não suporta o elemento de vídeo.",
  },
};

const K9_ITEMS: Record<Locale, K9Item[]> = {
  pl: [
    {
      title: "Sztuczna inteligencja",
      body: "Porozmawiaj z AI o trasie, filmach i kulisach planu.",
      image: "/galeria/Sciezka_filmowa/webp/1.webp",
    },
    {
      title: "Wrota wymiarów",
      body: "Przekrocz świetlne wrota i zajrzyj do innych światów scenografii.",
      image: "/galeria/Sciezka_filmowa/webp/2.webp",
    },
    {
      title: "Scenografia filmowa",
      body: "Wejdź w aranżację planu i odkryj rekwizyty z opowieści SF.",
      image: "/galeria/Sciezka_filmowa/webp/3.webp",
    },
    {
      title: "Przystanek na trasie",
      body: "Zobacz fragment wycieczki: prelekcję i pokaz zza kulis.",
      image: "/galeria/Sciezka_filmowa/webp/4.webp",
    },
    {
      title: "Quiz filmowy",
      body: "Sprawdź, ile zapamiętałeś, i dokończ trasę interaktywnym quizem.",
      image: "/galeria/Sciezka_filmowa/webp/5.webp",
    },
  ],
  en: [
    {
      title: "AI guide",
      body: "Chat with AI about the tour, movies, and behind-the-scenes facts.",
      image: "/galeria/Sciezka_filmowa/webp/1.webp",
    },
    {
      title: "Portals to other dimensions",
      body: "Step through luminous gates and peek into other scenic worlds.",
      image: "/galeria/Sciezka_filmowa/webp/2.webp",
    },
    {
      title: "Film set scenery",
      body: "Enter a staged set and explore sci‑fi props up close.",
      image: "/galeria/Sciezka_filmowa/webp/3.webp",
    },
    {
      title: "Tour stop",
      body: "Catch a slice of the tour: a talk and behind-the-scenes demo.",
      image: "/galeria/Sciezka_filmowa/webp/4.webp",
    },
    {
      title: "Film quiz",
      body: "See what you remember and wrap up the route with an interactive quiz.",
      image: "/galeria/Sciezka_filmowa/webp/5.webp",
    },
  ],
  pt: [
    {
      title: "Guia de IA",
      body: "Converse com a IA sobre o percurso, os filmes e os bastidores do set.",
      image: "/galeria/Sciezka_filmowa/webp/1.webp",
    },
    {
      title: "Portais para outras dimensões",
      body: "Atravesse portais luminosos e espreite outros mundos cenográficos.",
      image: "/galeria/Sciezka_filmowa/webp/2.webp",
    },
    {
      title: "Cenografia de filme",
      body: "Entre num set e explore adereços de ficção científica de perto.",
      image: "/galeria/Sciezka_filmowa/webp/3.webp",
    },
    {
      title: "Paragem no percurso",
      body: "Veja um excerto da visita: uma apresentação e demonstração dos bastidores.",
      image: "/galeria/Sciezka_filmowa/webp/4.webp",
    },
    {
      title: "Quiz de cinema",
      body: "Veja quanto se recorda e termine o percurso com um quiz interativo.",
      image: "/galeria/Sciezka_filmowa/webp/5.webp",
    },
  ],
};

export default function FilmPathContent() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];
  const k9 = K9_ITEMS[loc];

  return (
    <main className="relative z-10 min-h-screen">
      {/* Hero wideo (jak na /wydarzenia) */}
      <section className="relative z-10 px-4 pt-12 sm:pt-16">
        <div className="ap-shell mb-10 sm:mb-12">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
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
              <div className="relative flex h-full items-center justify-center p-6 sm:p-10 text-center force-overlay">
                <div className="space-y-2 ap-page-intro-stagger">
                  <p className="ap-type-kicker force-overlay-muted">
                    {t.heroTag}
                  </p>
                  <h1 className="ap-type-hero-title force-overlay drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {t.heroTitle}
                  </h1>
                  <p className="ap-type-hero-subtitle force-overlay-dim max-w-3xl mx-auto">
                    {t.heroLead}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-20">
        <div className="ap-shell ap-page-stack">
          <ScrollMotionItem strength="strong" delay={40} className="ap-deferred-section">
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {t.story.map((section, index) => (
                <Card
                  key={section.title}
                  motion="off"
                  className="tour-info-card ap-tile text-center space-y-4 h-full group"
                  style={{ "--tour-delay": `${(index % 6) * 0.24}s` } as React.CSSProperties}
                >
                  <TourLineAccentTitle>{section.title}</TourLineAccentTitle>
                  <p className="ap-type-section-body text-gray-100">{section.body}</p>
                </Card>
              ))}
            </div>
          </ScrollMotionItem>

          <ScrollMotionItem strength="soft" delay={110} className="ap-deferred-section">
            <Card className="space-y-6" motion="off">
              <div className="text-center space-y-3">
                <TourLineAccentTitle>{t.k9Title}</TourLineAccentTitle>
                <p className="ap-type-section-body text-gray-100 max-w-3xl mx-auto">
                  {t.k9Body}
                </p>
              </div>

              <TourLineGalleryRow items={k9} />
            </Card>
          </ScrollMotionItem>

          <ScrollMotionItem strength="strong" delay={170} className="ap-deferred-section">
            <Card title={t.ticketsTitle} titleCentered titleDivider dense motion="off">
              <p className="ap-type-section-body text-center max-w-3xl mx-auto">{t.ticketsIntro}</p>
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10">
                {t.ticketsOptions.map((option) => (
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
                          {option.priceLabel ?? t.ticketsPriceLabel}
                        </p>
                        <p className="ticket-price mt-2 text-2xl sm:text-3xl font-bold text-amber-200">
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
          </ScrollMotionItem>
        </div>
      </section>
    </main>
  );
}
