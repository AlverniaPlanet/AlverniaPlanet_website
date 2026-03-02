"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/app/i18n-provider";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import Testimonials, { type Testimonial } from "@/app/components/Testimonials";
import { AttractionCard } from "@/app/components/AttractionCard";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";

type Locale = "pl" | "en" | "pt";

type AttractionItem = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
};

type SectionCard = {
  title: string;
  description: string;
  cta: string;
  href: string;
};

type TicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  priceLabel?: string;
  price?: string;
};

type TicketSection = {
  title: string;
  intro: string;
  priceLabel: string;
  price: string;
  cta: string;
  ctaHref: string;
  options: TicketOption[];
};

type HomeCopy = {
  heroTitle: string;
  heroPromo: {
    message: string;
    cta: string;
    href: string;
  };
  attractions: {
    title: string;
    intro: string;
    items: AttractionItem[];
  };
  tickets: TicketSection;
  events: SectionCard;
  testimonials: {
    title: string;
    subtitle: string;
    reviews: Testimonial[];
  };
};

const BOOKING_URL = "https://alverniaplanet.bookero.pl";

const HOME_COPY: Record<Locale, HomeCopy> = {
  pl: {
    heroTitle: "Witamy w Alvernia Planet",
    heroPromo: {
      message: "Nowe otwarcie ścieżki edukacyjnej",
      cta: "Zobacz i kup bilet",
      href: "/atrakcje/sciezka-filmowa",
    },
    attractions: {
      title: "Atrakcje",
      intro: "Wejdź do świata kopuł i zacznij od naszych trzech flagowych doświadczeń.",
      items: [
        {
          title: "Kino 360°",
          description:
            "Immersyjne projekcje sferyczne w jednej z najbardziej zaawansowanych kopuł w Europie.",
          cta: "Zobacz kino 360°",
          href: "/atrakcje/kino-360",
          image: "/galeria/Ogolne/webp/4.webp",
          imageAlt: "Wnętrze kopuły z ekranem 360°",
        },
        {
          title: "Ścieżka filmowa",
          description:
            "Zakulisowa trasa przez plany zdjęciowe, rekwizyty i technologię używaną w produkcjach filmowych.",
          cta: "Poznaj ścieżkę filmową",
          href: "/atrakcje/sciezka-filmowa",
          image: "/galeria/Sciezka_filmowa/webp/4.webp",
          imageAlt: "Elementy scenografii na ścieżce filmowej",
        },
        {
          title: "Wystawy tematyczne",
          description:
            "Stała ekspozycja inspirowana światem filmu i nauki, idealna dla grup i rodzin.",
          cta: "Odkryj wystawę",
          href: "/atrakcje/wystawa",
          image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/1.webp",
          imageAlt: "Eksponat na wystawie tematycznej",
        },
      ],
    },
    tickets: {
      title: "Bilety na ścieżkę edukacyjną",
      intro: "Cena jest taka sama dla obu opcji: 69 zł za osobę. Wybierz wariant rezerwacji.",
      priceLabel: "Cena za osobę",
      price: "69 zł/os.",
      cta: "Kup bilet",
      ctaHref: BOOKING_URL,
      options: [
        {
          badge: "Indywidualne",
          title: "Bilet indywidualny",
          subtitle: "1-10 osób na jednym bilecie",
          details: ["Dla osób indywidualnych i rodzin", "Płatność za osoby"],
        },
        {
          badge: "Grupowe",
          title: "Bilet grupowy (szkolny)",
          subtitle: "30-50 osób w grupie",
          details: ["Dla szkół i grup zorganizowanych", "Płatność za całą grupę"],
          priceLabel: "Cena za min. 30 osób",
          price: "2 070 zł/grupa",
        },
      ],
    },
    events: {
      title: "Wyjątkowe miejsce na Twój event!",
      description:
        "Wyjątkowe przestrzenie do konferencji, gal i premier. Sprawdź możliwości organizacji eventów w Alvernia Planet.",
      cta: "Odkryj wydarzenia",
      href: "/wydarzenia",
    },
    testimonials: {
      title: "Opinie gości",
      subtitle: "Kilka świeżych recenzji z wizyt w Alvernia Planet.",
      reviews: [
        {
          name: "Joke Peulen",
          date: "styczeń 2025",
          text:
            "Niesamowity i futurystyczny kompleks. Zagrałem tu wydarzenie wynajęte przez organizację i klimat był idealny. Nie chciałem stąd wyjeżdżać, chętnie bym tu zamieszkał. Jeśli szukasz miejsca na event, to jest to.",
          rating: 5,
          url: "https://maps.app.goo.gl/QqgR4n5zPU8iRNxf6",
        },
        {
          name: "Anna Potocka - Zbryyt",
          date: "sierpień 2024",
          text:
            "Nasza klasa brała udział w edukacyjnej lekcji „Nie wszystko co widzisz i słyszysz jest prawdą”. Świetna lekcja dla kinomanów, prowadząca potrafiła zaciekawić dzieci i była pełna pasji. Polecamy!",
          rating: 5,
          url: "https://maps.app.goo.gl/wBwEfrYd8ecH5Bac7",
        },
        {
          name: "Cagatay Sen",
          date: "grudzień 2024",
          text:
            "Wystawa Harry'ego Pottera była fantastyczna, z prawdziwymi eksponatami i świetną organizacją. Interaktywna atrakcja, dzieci i dorośli byli zachwyceni. Jedyny minus: brak toalety w namiocie, trzeba przejść do jadalni.",
          rating: 5,
          url: "https://maps.app.goo.gl/1B5sisSJGhTiLKrv6",
        },
      ],
    },
  },
  en: {
    heroTitle: "Welcome to Alvernia Planet",
    heroPromo: {
      message: "New opening of the educational path",
      cta: "See and buy tickets",
      href: "/atrakcje/sciezka-filmowa",
    },
    attractions: {
      title: "Attractions",
      intro: "Start with our signature experiences inside the domes.",
      items: [
        {
          title: "360° Cinema",
          description: "Immersive dome screenings with the picture all around you.",
          cta: "See the 360° cinema",
          href: "/atrakcje/kino-360",
          image: "/galeria/Ogolne/webp/4.webp",
          imageAlt: "Dome interior prepared for 360° projection",
        },
        {
          title: "Film Path",
          description:
            "A behind-the-scenes walk through sets, props, and the technology that powers productions.",
          cta: "Explore the film path",
          href: "/atrakcje/sciezka-filmowa",
          image: "/galeria/Sciezka_filmowa/webp/4.webp",
          imageAlt: "Film set elements on the film path",
        },
        {
          title: "Curated Exhibition",
          description:
            "A thematic exhibition inspired by film and science—great for families and groups.",
          cta: "Discover the exhibition",
          href: "/atrakcje/wystawa",
          image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/1.webp",
          imageAlt: "Exhibit piece at the thematic exhibition",
        },
      ],
    },
    tickets: {
      title: "Educational path tickets",
      intro: "Same price for both options: 69 PLN per person. Choose the booking type.",
      priceLabel: "Price per person",
      price: "69 PLN/person",
      cta: "Buy tickets",
      ctaHref: BOOKING_URL,
      options: [
        {
          badge: "Individual",
          title: "Individual ticket",
          subtitle: "1-10 people on one ticket",
          details: ["For individuals and families", "Pay per person"],
        },
        {
          badge: "Group",
          title: "Group ticket (schools)",
          subtitle: "30-50 people in a group",
          details: ["For schools and organized groups", "Pay for the whole group"],
        },
      ],
    },
    events: {
      title: "A unique venue for your event!",
      description:
        "Exceptional spaces for conferences, galas, and premieres. Discover what events you can host at Alvernia Planet.",
      cta: "Explore events",
      href: "/wydarzenia",
    },
    testimonials: {
      title: "What visitors say",
      subtitle: "Recent reviews from guests exploring Alvernia Planet.",
      reviews: [
        {
          name: "Joke Peulen",
          date: "January 2025",
          text:
            "Amazing, futuristic complex. I played an event there for a group that rented the venue and it set the perfect vibe. I almost didn’t want to leave—would happily live here! If you need a place for an event, this is it.",
          rating: 5,
          url: "https://maps.app.goo.gl/QqgR4n5zPU8iRNxf6",
        },
        {
          name: "Anna Potocka - Zbryyt",
          date: "August 2024",
          text:
            "Our class joined an educational lesson “Not everything you see and hear is true.” Fantastic session for movie fans; the guide kept kids engaged with passion and clarity. Highly recommended!",
          rating: 5,
          url: "https://maps.app.goo.gl/wBwEfrYd8ecH5Bac7",
        },
        {
          name: "Cagatay Sen",
          date: "December 2024",
          text:
            "The Harry Potter exhibition was fantastic—real props and well-thought organization. Very interactive, kids and adults were thrilled. Only minus: no restroom in the tent; you need to walk to the dining area.",
          rating: 5,
          url: "https://maps.app.goo.gl/1B5sisSJGhTiLKrv6",
        },
      ],
    },
  },
  pt: {
    heroTitle: "Bem-vindo à Alvernia Planet",
    heroPromo: {
      message: "Nova abertura do percurso educativo",
      cta: "Ver e comprar bilhete",
      href: "/atrakcje/sciezka-filmowa",
    },
    attractions: {
      title: "Atrações",
      intro: "Entre no mundo das cúpulas e comece pelas nossas três experiências emblemáticas.",
      items: [
        {
          title: "Cinema 360°",
          description:
            "Projeções imersivas em cúpula com imagem a 360° numa das estruturas mais avançadas da Europa.",
          cta: "Ver o cinema 360°",
          href: "/atrakcje/kino-360",
          image: "/galeria/Ogolne/webp/4.webp",
          imageAlt: "Interior da cúpula preparado para projeção 360°",
        },
        {
          title: "Percurso cinematográfico",
          description:
            "Uma visita aos bastidores com cenários, adereços e tecnologia usada nas produções.",
          cta: "Conheça o percurso",
          href: "/atrakcje/sciezka-filmowa",
          image: "/galeria/Sciezka_filmowa/webp/4.webp",
          imageAlt: "Elementos de cenário no percurso cinematográfico",
        },
        {
          title: "Exposições temáticas",
          description:
            "Exposição inspirada no mundo do cinema e da ciência, ideal para famílias e grupos.",
          cta: "Descobrir a exposição",
          href: "/atrakcje/wystawa",
          image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/1.webp",
          imageAlt: "Peça de exposição na mostra temática",
        },
      ],
    },
    tickets: {
      title: "Bilhetes para o percurso educativo",
      intro: "Preço igual nas duas opções: 69 PLN por pessoa. Escolha o tipo de reserva.",
      priceLabel: "Preço por pessoa",
      price: "69 PLN/pessoa",
      cta: "Comprar bilhetes",
      ctaHref: BOOKING_URL,
      options: [
        {
          badge: "Individual",
          title: "Bilhete individual",
          subtitle: "1-10 pessoas por bilhete",
          details: ["Para indivíduos e famílias", "Pagamento por pessoa"],
        },
        {
          badge: "Grupo",
          title: "Bilhete de grupo (escolas)",
          subtitle: "30-50 pessoas no grupo",
          details: ["Para escolas e grupos organizados", "Pagamento pelo grupo inteiro"],
        },
      ],
    },
    events: {
      title: "Um espaço único para o seu evento!",
      description:
        "Espaços excepcionais para conferências, galas e estreias. Descubra o potencial da Alvernia Planet para eventos.",
      cta: "Explorar eventos",
      href: "/wydarzenia",
    },
    testimonials: {
      title: "Opiniões dos visitantes",
      subtitle: "Algumas avaliações recentes de quem visitou a Alvernia Planet.",
      reviews: [
        {
          name: "Joke Peulen",
          date: "janeiro 2025",
          text:
            "Complexo incrível e futurista. Toquei num evento para uma organização que alugou o espaço e o ambiente foi perfeito. Quase não queria sair daqui. Se procura um lugar para um evento, é este.",
          rating: 5,
          url: "https://maps.app.goo.gl/QqgR4n5zPU8iRNxf6",
        },
        {
          name: "Anna Potocka - Zbryyt",
          date: "agosto 2024",
          text:
            "A nossa turma participou na aula educativa “Nem tudo o que vês e ouves é verdade”. Uma ótima sessão para fãs de cinema; a guia envolveu as crianças com paixão e clareza. Recomendamos!",
          rating: 5,
          url: "https://maps.app.goo.gl/wBwEfrYd8ecH5Bac7",
        },
        {
          name: "Cagatay Sen",
          date: "dezembro 2024",
          text:
            "A exposição de Harry Potter foi fantástica, com adereços reais e excelente organização. Muito interativa — crianças e adultos ficaram encantados. Único ponto negativo: não havia WC na tenda, foi preciso ir até à área de refeições.",
          rating: 5,
          url: "https://maps.app.goo.gl/1B5sisSJGhTiLKrv6",
        },
      ],
    },
  },
};

const GOOGLE_PLACE_URL =
  "https://www.google.com/maps/place/Alvernia+Planet/@50.1022663,19.5444717,637m/data=!3m1!1e3!4m8!3m7!1s0x4716f227b90ec1a1:0xbd1dbadc60237cc3!8m2!3d50.1022629!4d19.5470466!9m1!1b1!16s%2Fg%2F1yy3vkg22?hl=pl&entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D";

const EVENT_GALLERY_IMAGES = Array.from(
  { length: 8 },
  (_, idx) => `/galeria/Wydarzenia/webp/${idx + 1}.webp`,
);

const EVENT_COLUMN_CARD_HEIGHTS = [
  "h-28 sm:h-32 lg:h-36",
  "h-36 sm:h-40 lg:h-44",
  "h-32 sm:h-36 lg:h-40",
  "h-40 sm:h-44 lg:h-48",
];

export default function Page() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = HOME_COPY[loc];
  const [heroIntroVisible, setHeroIntroVisible] = useState(false);
  const [heroPromoVisible, setHeroPromoVisible] = useState(false);
  const [contentIntroVisible, setContentIntroVisible] = useState(false);
  const heroVideoFallback =
    loc === "en"
      ? "Your browser does not support the video element."
      : loc === "pt"
      ? "O seu navegador não suporta o elemento de vídeo."
      : "Twój browser nie wspiera elementu video.";
  const eventPhotoLabel =
    loc === "en"
      ? "Event photo"
      : loc === "pt"
      ? "Foto do evento"
      : "Zdjęcie z wydarzenia";
  const eventPhotos = EVENT_GALLERY_IMAGES.map((src, index) => ({
    src,
    alt: `${eventPhotoLabel} ${index + 1}`,
  }));

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const shouldKeepHeroPlayingRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHeroIntroVisible(true);
      setHeroPromoVisible(true);
      setContentIntroVisible(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setHeroIntroVisible(true);
    });
    const promoTimer = window.setTimeout(() => {
      setHeroPromoVisible(true);
    }, 1000);
    const timer = window.setTimeout(() => {
      setContentIntroVisible(true);
    }, 260);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(promoTimer);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const section = heroSectionRef.current;
    const video = heroVideoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const keepPlaying = Boolean(entry?.isIntersecting);
        shouldKeepHeroPlayingRef.current = keepPlaying;

        if (keepPlaying) {
          const p = video.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "120px 0px -10% 0px",
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Safari: wymuś loop/autoplay inline nawet po zakończeniu
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const ensurePlay = () => {
      if (!shouldKeepHeroPlayingRef.current) return;
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    };

    const handleEnded = () => {
      if (!shouldKeepHeroPlayingRef.current) return;
      video.currentTime = 0;
      ensurePlay();
    };
    const handlePause = () => {
      if (video.paused && shouldKeepHeroPlayingRef.current) ensurePlay();
    };

    ensurePlay();
    const handleWebkitEndFullscreen = () => ensurePlay();

    video.addEventListener("ended", handleEnded);
    video.addEventListener("pause", handlePause);
    video.addEventListener("webkitendfullscreen", handleWebkitEndFullscreen as EventListener);
    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("webkitendfullscreen", handleWebkitEndFullscreen as EventListener);
    };
  }, []);

  const reviewsToShow = copy.testimonials.reviews;

  return (
    <main className="relative min-h-screen px-4 py-12 sm:py-16 text-white">
      {/* Wideo hero w "kwadracie" jak na pozostałych podstronach */}
      <section
        ref={heroSectionRef}
        className={`relative z-10 transition-[opacity,transform] duration-[1300ms] will-change-[opacity,transform] ${
          heroIntroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="relative aspect-[16/9] bg-black">
              <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center px-4 sm:top-5">
                <a
                  href={copy.heroPromo.href}
                  className={`hero-film-alert pointer-events-auto inline-flex max-w-full items-center gap-2.5 rounded-full px-3.5 py-2.5 text-xs sm:gap-3.5 sm:px-5 sm:py-3 sm:text-base transition-[opacity,transform] duration-[900ms] ${
                    heroPromoVisible
                      ? "hero-film-alert-intro opacity-100 translate-y-0 scale-100"
                      : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
                  }`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.28, 1)" }}
                >
                  <span
                    className="hero-film-alert-dot mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#4fcfde] sm:h-3 sm:w-3"
                    aria-hidden="true"
                  />
                  <span className="hero-film-alert-copy leading-tight font-medium">
                    <span>{copy.heroPromo.message}</span>
                    <span className="hero-film-alert-cta ml-2 whitespace-nowrap font-semibold sm:ml-3">
                      {copy.heroPromo.cta} →
                    </span>
                  </span>
                </a>
              </div>
              <video
                ref={heroVideoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/home/AP_ogolne_poster.webp"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
                disablePictureInPicture
                tabIndex={-1}
                onContextMenu={(e) => e.preventDefault()}
                onError={() =>
                  console.warn("[video] playback error — check file names/paths in /public")
                }
              >
                <source src="/home/AP_ogolne.webm" type="video/webm" />
                <source src="/home/AP_ogolne.mp4" type="video/mp4" />
                {heroVideoFallback}
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Content below the hero video */}
      <section
        id="content-start"
        className={`relative z-10 mt-16 sm:mt-20 transition-[opacity,transform] duration-[1200ms] will-change-[opacity,transform] ${
          contentIntroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: "180ms",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <ScrollMotionItem strength="strong">
            <div className="mb-10 text-center">
              <h2 className="text-4xl sm:text-5xl font-extrabold">
                {copy.heroTitle}
              </h2>
              <div className="mt-4 mx-auto h-[1px] w-full max-w-md bg-white/20" />
            </div>
          </ScrollMotionItem>
          <div className="grid grid-cols-1 gap-20 sm:gap-24">
            <ScrollMotionItem strength="strong" delay={40}>
              <Card title={copy.attractions.title} titleCentered titleDivider dense motion="off">
                <p className="text-center text-gray-200 max-w-3xl mx-auto">{copy.attractions.intro}</p>
                <AttractionsScroller items={copy.attractions.items} />
              </Card>
            </ScrollMotionItem>

            <ScrollMotionItem strength="soft" delay={30} float={false}>
              <Card title={copy.tickets.title} titleCentered titleDivider dense motion="off">
                <p className="text-center text-gray-200 max-w-3xl mx-auto">{copy.tickets.intro}</p>
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
                  {copy.tickets.options.map((option) => (
                    <div
                      key={option.title}
                      className="ticket-card group flex h-full flex-col rounded-3xl text-white/90 transition duration-300 ease-out hover:-translate-y-1"
                    >
                      <div className="ticket-card-top">
                        <span className="ticket-card-badge">{option.badge}</span>
                      </div>
                      <div className="ticket-card-content flex h-full flex-col p-6 sm:p-8 text-center">
                        <h3 className="ticket-card-title text-2xl sm:text-3xl font-semibold text-white">
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
                            {option.priceLabel ?? copy.tickets.priceLabel}
                          </p>
                          <p className="ticket-price mt-2 text-3xl sm:text-4xl font-bold text-amber-200">
                            {option.price ?? copy.tickets.price}
                          </p>
                          <div className="mt-6 flex justify-center">
                            <PrimaryButton
                              href={copy.tickets.ctaHref}
                              size="md"
                              className="ticket-pill ring-[color:rgba(240,60,100,0.55)]"
                            >
                              {copy.tickets.cta}
                            </PrimaryButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </ScrollMotionItem>

            <ScrollMotionItem strength="strong" delay={130}>
              <Card title={copy.events.title} className="text-center" titleCentered titleDivider dense motion="off">
                <p className="text-gray-200 text-lg">{copy.events.description}</p>
                <EventsVerticalShowcase photos={eventPhotos} />
                <div className="mt-6 flex justify-center">
                  <PrimaryButton href={copy.events.href} size="lg">
                    {copy.events.cta}
                  </PrimaryButton>
                </div>
              </Card>
            </ScrollMotionItem>

            <ScrollMotionItem strength="strong" delay={170}>
              <Card title={copy.testimonials.title} titleCentered titleDivider dense motion="off">
                <p className="text-center text-gray-200">{copy.testimonials.subtitle}</p>
                <div className="mt-6">
                  <Testimonials reviews={reviewsToShow} sourceUrl={GOOGLE_PLACE_URL} />
                </div>
              </Card>
            </ScrollMotionItem>

          </div>
        </div>
      </section>
    </main>
  );
}

function AttractionsScroller({ items }: { items: AttractionItem[] }) {
  const loopItems = [...items, ...items];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let frameId: number | null = null;
    let halfWidth = 0;
    let offset = 0;
    let boostVelocity = 0;
    let lastTime = 0;
    let lastPaintTime = 0;
    let isVisible = false;
    const baseSpeed = window.matchMedia("(max-width: 640px)").matches ? 22 : 18;
    const minFrameMs = 1000 / 45;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const normalizeOffset = () => {
      if (halfWidth <= 0) {
        return;
      }
      offset = ((offset % halfWidth) + halfWidth) % halfWidth;
    };

    const recalculateWidth = () => {
      halfWidth = track.scrollWidth / 2;
      normalizeOffset();
    };

    const animate = (time: number) => {
      if (!isVisible) {
        frameId = null;
        return;
      }

      if (lastPaintTime && time - lastPaintTime < minFrameMs) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }
      lastPaintTime = time;

      if (!lastTime) {
        lastTime = time;
      }
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      offset += (baseSpeed + boostVelocity) * deltaSeconds;
      normalizeOffset();
      track.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`;

      boostVelocity *= Math.pow(0.94, deltaSeconds * 60);
      if (Math.abs(boostVelocity) < 0.2) {
        boostVelocity = 0;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (frameId !== null || !isVisible) return;
      lastTime = 0;
      lastPaintTime = 0;
      frameId = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!isVisible) return;

      const horizontalDelta = event.deltaX;
      const absX = Math.abs(horizontalDelta);
      const absY = Math.abs(event.deltaY);

      // React only to near-pure horizontal gestures; never block normal page scroll.
      if (absX < 1.2 || absY > 0.6 || absX <= absY * 2) {
        return;
      }

      boostVelocity = clamp(boostVelocity + horizontalDelta * 0.48, -640, 640);
    };

    recalculateWidth();
    const resizeObserver = new ResizeObserver(recalculateWidth);
    resizeObserver.observe(track);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "160px 0px",
      },
    );
    visibilityObserver.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
        return;
      }

      if (isVisible) {
        startAnimation();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("wheel", handleWheel);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
    };
  }, [items.length]);

  return (
    <div
      ref={containerRef}
      className="attractions-carousel relative mt-10 overflow-hidden rounded-2xl"
    >
      <div
        className="attractions-edge-fade attractions-edge-fade-left pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#1a1f36] to-transparent sm:w-16"
        aria-hidden="true"
      />
      <div
        className="attractions-edge-fade attractions-edge-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#1a1f36] to-transparent sm:w-16"
        aria-hidden="true"
      />

      <div
        ref={trackRef}
        className="attractions-track flex min-w-max gap-5 py-2 sm:gap-6 will-change-transform"
      >
        {loopItems.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="w-[336px] shrink-0 sm:w-[372px] lg:w-[392px]"
          >
            <AttractionCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsVerticalShowcase({
  photos,
}: {
  photos: { src: string; alt: string }[];
}) {
  if (photos.length === 0) {
    return null;
  }

  const columnsCount = 3;
  const minPerColumn = Math.min(4, photos.length);
  const columns = Array.from({ length: columnsCount }, () => [] as { src: string; alt: string }[]);

  // Stały podział: kolejne zdjęcia trafiają kolejno do lewej, środkowej i prawej kolumny.
  photos.forEach((photo, index) => {
    columns[index % columnsCount].push(photo);
  });

  // Uzupełniamy kolumny do podobnej długości bez duplikatów w tej samej kolumnie.
  columns.forEach((column, columnIndex) => {
    let guard = 0;
    while (column.length < minPerColumn && guard < photos.length * 3) {
      const candidate = photos[(columnIndex + guard) % photos.length];
      if (!column.some((item) => item.src === candidate.src)) {
        column.push(candidate);
      }
      guard += 1;
    }
  });
  const columnVisibility = ["", "hidden sm:block", "hidden lg:block"];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsAnimating(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAnimating(Boolean(entry?.isIntersecting) && !document.hidden);
      },
      {
        threshold: 0.08,
        rootMargin: "120px 0px",
      },
    );
    observer.observe(container);

    const handleVisibility = () => {
      if (document.hidden) {
        setIsAnimating(false);
        return;
      }

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;
      const inView = rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;
      setIsAnimating(inView);
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="events-showcase relative mt-10 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] p-2.5 sm:p-3.5"
    >
      <div
        className="events-showcase-fade events-showcase-fade-top pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-[#1a1f36] via-[#1a1f36]/70 to-transparent"
        aria-hidden="true"
      />
      <div
        className="events-showcase-fade events-showcase-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-[#1a1f36] via-[#1a1f36]/70 to-transparent"
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {columns.map((column, columnIndex) => {
          const reverse = columnIndex % 2 === 1;
          return (
            <div
              key={`events-column-${columnIndex}`}
              className={`${columnVisibility[columnIndex]} events-showcase-column h-[300px] overflow-hidden rounded-xl border border-white/10 bg-[#0f1328]/70 p-2 sm:h-[360px] lg:h-[420px]`}
            >
              <div
                className="flex flex-col will-change-transform"
                style={{
                  animationName: reverse ? "eventsColumnDown" : "eventsColumnUp",
                  animationDuration: `${reverse ? 42 : 36}s`,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  animationPlayState: isAnimating ? "running" : "paused",
                }}
              >
                {[0, 1].map((loopIndex) => (
                  <div
                    key={`events-loop-${columnIndex}-${loopIndex}`}
                    className="flex flex-col gap-3 pb-3"
                  >
                    {column.map((photo, imageIndex) => (
                      <div
                        key={`${photo.src}-${columnIndex}-${loopIndex}-${imageIndex}`}
                        className={`group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 ${
                          EVENT_COLUMN_CARD_HEIGHTS[
                            (imageIndex + columnIndex) % EVENT_COLUMN_CARD_HEIGHTS.length
                          ]
                        }`}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes eventsColumnUp {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }

        @keyframes eventsColumnDown {
          from {
            transform: translateY(-50%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
