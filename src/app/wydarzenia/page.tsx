"use client";
import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { useI18n } from "@/app/i18n-provider";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import Image from "next/image";

// ===== Lokalny słownik (PL/EN) =====
type Locale = "pl" | "en" | "pt";
const FORMAT_SHOWCASE_IMAGES = [
  "/galeria/Wydarzenia/webp/8.webp",
  "/galeria/Wydarzenia/webp/6.webp",
  "/galeria/Wydarzenia/webp/5.webp",
];
type DomeKey = "k3" | "k4" | "k7" | "k10k12";

const DOME_IMAGE_BY_KEY: Record<DomeKey, string> = {
  k3: "/galeria/Wydarzenia/webp/1.webp",
  k4: "/galeria/Wydarzenia/webp/3.webp",
  k7: "/galeria/Wydarzenia/webp/4.webp",
  k10k12: "/galeria/Wydarzenia/webp/2.webp",
};

const COPY: Record<
  Locale,
  {
    title: string;
    tag: string;
    venueLabel: string;
    intro: string;
    bullets: string[];
  }
> = {
  pl: {
    title: "Wydarzenia w Alvernia Planet",
    tag: "wydarzenia",
    venueLabel: "Alvernia Planet",
    intro:
      "Przestrzeń dla marek i organizatorów, którzy chcą zrobić event z realnym efektem wow.",
    bullets: [
      "Ikoniczna architektura i scenografia gotowa pod formaty premium",
      "Dwie kopuły eventowe po 2 000 m² + dodatkowe strefy wsparcia",
      "Prywatna lokalizacja i bezpieczny, wygodny dojazd z A4",
      "Wsparcie zespołu sprzedażowego od briefu po dzień realizacji",
    ],
  },
  en: {
    title: "Events at Alvernia Planet",
    tag: "events",
    venueLabel: "Alvernia Planet",
    intro:
      "A destination for brands and organizers who want a memorable event with a true wow factor.",
    bullets: [
      "Iconic architecture and scenery suited for premium formats",
      "Two event domes, 2,000 m² each, plus supporting spaces",
      "Private location with easy and secure access from the A4 highway",
      "Sales team support from initial brief to event day delivery",
    ],
  },
  pt: {
    title: "Eventos na Alvernia Planet",
    tag: "eventos",
    venueLabel: "Alvernia Planet",
    intro:
      "Um espaço para marcas e organizadores que querem um evento memorável e com impacto.",
    bullets: [
      "Arquitetura icónica e cenografia pronta para formatos premium",
      "Duas cúpulas de 2 000 m² cada + áreas de apoio",
      "Localização privada com acesso cómodo e seguro pela A4",
      "Acompanhamento comercial desde o brief até ao dia do evento",
    ],
  },
};

const SECOND: Record<Locale, { title: string; bullets: string[] }> = {
  pl: {
    title: "Jakie wydarzenia organizujemy",
    bullets: [
      "Eventy korporacyjne i spotkania strategiczne",
      "Konferencje prasowe, szkolenia i wykłady",
      "Gale, bankiety i kolacje biznesowe",
      "Koncerty, premiery i formaty muzyczne",
      "Pokazy mody i premiery produktów",
      "Targi oraz prezentacje branżowe",
    ],
  },
  en: {
    title: "Event formats we host",
    bullets: [
      "Corporate events and strategic client meetings",
      "Press conferences, trainings, and talks",
      "Galas, banquets, and formal dinners",
      "Concerts, premieres, and music formats",
      "Fashion shows and product launches",
      "Trade fairs and industry presentations",
    ],
  },
  pt: {
    title: "Formatos de evento que realizamos",
    bullets: [
      "Eventos corporativos e reuniões estratégicas",
      "Conferências de imprensa, formações e palestras",
      "Galas, banquetes e jantares empresariais",
      "Concertos, estreias e formatos musicais",
      "Desfiles de moda e lançamentos de produto",
      "Feiras e apresentações do setor",
    ],
  },
};

type VideoItem = { title: string; body: string; src: string; poster: string; embed?: boolean };

const VIDEO_SHOWCASE: Record<
  Locale,
  {
    title: string;
    items: VideoItem[];
  }
> = {
  pl: {
    title: "Zobacz wideo z wydarzeń",
    items: [
      {
        title: "Koncert w kopule",
        body: "Atmosfera live w sferycznej scenie.",
        src: "https://www.youtube.com/watch?v=jt6zh-vaFNc&t=12s",
        poster: "https://i.ytimg.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Bankiet i gala",
        body: "Wieczorna aranżacja z elegancką oprawą.",
        src: "https://www.youtube.com/watch?v=PWtTaxqxufE",
        poster: "https://i.ytimg.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Club / afterparty",
        body: "Światła i dźwięk w klubowym wydaniu.",
        src: "https://www.youtube.com/watch?v=BkdKk5Jc_RA",
        poster: "https://i.ytimg.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
        embed: true,
      },
    ],
  },
  en: {
    title: "Event video highlights",
    items: [
      {
        title: "Concert in the dome",
        body: "Live atmosphere on a spherical stage.",
        src: "https://www.youtube.com/watch?v=jt6zh-vaFNc&t=12s",
        poster: "https://i.ytimg.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Banquet and gala",
        body: "Evening setup with elegant styling.",
        src: "https://www.youtube.com/watch?v=PWtTaxqxufE",
        poster: "https://i.ytimg.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Club / afterparty",
        body: "Lights and sound in a club vibe.",
        src: "https://www.youtube.com/watch?v=BkdKk5Jc_RA",
        poster: "https://i.ytimg.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
        embed: true,
      },
    ],
  },
  pt: {
    title: "Vídeos de eventos",
    items: [
      {
        title: "Concerto na cúpula",
        body: "Atmosfera ao vivo num palco esférico.",
        src: "https://www.youtube.com/watch?v=jt6zh-vaFNc&t=12s",
        poster: "https://i.ytimg.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Banquete e gala",
        body: "Cenário noturno com um toque elegante.",
        src: "https://www.youtube.com/watch?v=PWtTaxqxufE",
        poster: "https://i.ytimg.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Club / afterparty",
        body: "Luzes e som em ambiente de clube.",
        src: "https://www.youtube.com/watch?v=BkdKk5Jc_RA",
        poster: "https://i.ytimg.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
        embed: true,
      },
    ],
  },
};

// ===== UI tekst (loadery, kontakt, adres, przycisk mapy) =====
const UI_TEXT: Record<
  Locale,
  {
    loadingVideo: string;
    playVideo: string;
    videoFallback: string;
  }
> = {
  pl: {
    loadingVideo: "Ładowanie wideo...",
    playVideo: "Odtwórz",
    videoFallback: "Twoja przeglądarka nie obsługuje elementu wideo.",
  },
  en: {
    loadingVideo: "Loading video...",
    playVideo: "Play",
    videoFallback: "Your browser does not support the video element.",
  },
  pt: {
    loadingVideo: "A carregar vídeo...",
    playVideo: "Reproduzir",
    videoFallback: "O seu navegador não suporta o elemento de vídeo.",
  },
};

const SECTION_UI: Record<
  Locale,
  {
    highlightsLabel: string;
    offerLabel: string;
    domesLabel: string;
    domesIntro: string;
    domesCardLabel: string;
    domeImageAltSuffix: string;
    salesTeamLabel: string;
    contactCta: string;
  }
> = {
  pl: {
    highlightsLabel: "Najważniejsze atuty",
    offerLabel: "Formaty wydarzeń",
    domesLabel: "Obiekty dostępne pod wynajem",
    domesIntro:
      "To nasze realne przestrzenie eventowe, które możesz wynająć. Poniżej znajdziesz kluczowe parametry każdej z nich.",
    domesCardLabel: "Wynajem",
    domeImageAltSuffix: "podgląd obiektu",
    salesTeamLabel: "Zespół sprzedaży",
    contactCta: "Zapytaj o termin",
  },
  en: {
    highlightsLabel: "Key highlights",
    offerLabel: "Event formats",
    domesLabel: "Rentable venue spaces",
    domesIntro:
      "These are real event spaces available for rent. Below are the key parameters of each venue.",
    domesCardLabel: "For rent",
    domeImageAltSuffix: "venue preview",
    salesTeamLabel: "Sales team",
    contactCta: "Ask about dates",
  },
  pt: {
    highlightsLabel: "Destaques principais",
    offerLabel: "Formatos de evento",
    domesLabel: "Espaços disponíveis para aluguer",
    domesIntro:
      "Estes são espaços reais para eventos disponíveis para aluguer. Abaixo estão os principais parâmetros de cada espaço.",
    domesCardLabel: "Para aluguer",
    domeImageAltSuffix: "pré-visualização do espaço",
    salesTeamLabel: "Equipa comercial",
    contactCta: "Pedir disponibilidade",
  },
};

type ContactItem = {
  name: string;
  role: string;
  phone: string;
  email: string;
  accentClass: string;
};

const CONTACTS: Record<Locale, ContactItem[]> = {
  pl: [
    {
      name: "PIOTR KOZOŁUB",
      role: "Specjalista ds. sprzedaży",
      phone: "+48 452 432 315",
      email: "p.kozolub@gremi.pl",
      accentClass: "text-[#f03c64] hover:text-[#f77828]",
    },
    {
      name: "BARTEK JACOŃ",
      role: "Specjalista ds. sprzedaży",
      phone: "+48 723 999 099",
      email: "b.jacon@gremi.pl",
      accentClass: "text-[#f77828] hover:text-[#f03c64]",
    },
  ],
  en: [
    {
      name: "PIOTR KOZOŁUB",
      role: "Sales specialist",
      phone: "+48 452 432 315",
      email: "p.kozolub@gremi.pl",
      accentClass: "text-[#f03c64] hover:text-[#f77828]",
    },
    {
      name: "BARTEK JACOŃ",
      role: "Sales specialist",
      phone: "+48 723 999 099",
      email: "b.jacon@gremi.pl",
      accentClass: "text-[#f77828] hover:text-[#f03c64]",
    },
  ],
  pt: [
    {
      name: "PIOTR KOZOŁUB",
      role: "Especialista de vendas",
      phone: "+48 452 432 315",
      email: "p.kozolub@gremi.pl",
      accentClass: "text-[#f03c64] hover:text-[#f77828]",
    },
    {
      name: "BARTEK JACOŃ",
      role: "Especialista de vendas",
      phone: "+48 723 999 099",
      email: "b.jacon@gremi.pl",
      accentClass: "text-[#f77828] hover:text-[#f03c64]",
    },
  ],
};

type DomeContent = { title: string; bullets: string[] };

const DOMES: Record<
  Locale,
  {
    k3: DomeContent;
    k4: DomeContent;
    k7: DomeContent;
    k10k12: DomeContent;
  }
> = {
  pl: {
    k3: {
      title: "Kopuła K3",
      bullets: [
        "Powierzchnia 2 000 m²",
        "Wysokość 16 m",
        "Przyłącza elektryczne do 1 MW",
        "Klimatyzowane garderoby z prysznicami",
        "Klimatyzacja",
        "Dwie bramy 4m × 4,5m (swobodny przejazd TIR)",
        "Dopuszczalne obciążenie posadzki dla form scenograficznych",
      ],
    },
    k4: {
      title: "Kopuła K4",
      bullets: [
        "Powierzchnia 2 000 m²",
        "Wysokość 16 m",
        "Przyłącza elektryczne do 1 MW",
        "Stanowiska do charakteryzacji",
        "Klimatyzacja",
        "Kratownica o udźwigu do 2 ton",
        "Dwie bramy 4m × 4,5m (swobodny przejazd TIR)",
        "Dopuszczalne obciążenie posadzki dla form scenograficznych",
      ],
    },
    k7: {
      title: "Kopuła K7",
      bullets: [
        "Ekran 10.2 × 4.2 m",
        "Projektor 4K",
        "Certyfikat Dolby Premier",
        "76 foteli",
      ],
    },
    k10k12: {
      title: "Kopuły K10 i K12",
      bullets: ["Kopuły dwupoziomowe", "Powierzchnia 600 m²"],
    },
  },
  en: {
    k3: {
      title: "Dome K3",
      bullets: [
        "Floor area 2,000 m²",
        "Height 16 m",
        "Electrical connections up to 1 MW",
        "Air-conditioned dressing rooms with showers",
        "Air conditioning",
        "Two gates 4 m × 4.5 m (truck drive-through)",
        "Floor load capacity suitable for scenic structures",
      ],
    },
    k4: {
      title: "Dome K4",
      bullets: [
        "Floor area 2,000 m²",
        "Height 16 m",
        "Electrical connections up to 1 MW",
        "Make-up stations",
        "Air conditioning",
        "Truss with up to 2-ton capacity",
        "Two gates 4 m × 4.5 m (truck drive-through)",
        "Floor load capacity suitable for scenic structures",
      ],
    },
    k7: {
      title: "Dome K7",
      bullets: [
        "Screen 10.2 × 4.2 m",
        "4K projector",
        "Dolby Premier certificate",
        "76 seats",
      ],
    },
    k10k12: {
      title: "Domes K10 and K12",
      bullets: ["Two-level domes", "Floor area 600 m²"],
    },
  },
  pt: {
    k3: {
      title: "Cúpula K3",
      bullets: [
        "Área 2 000 m²",
        "Altura 16 m",
        "Ligações elétricas até 1 MW",
        "Camarins climatizados com chuveiros",
        "Ar condicionado",
        "Duas portas 4 m × 4,5 m (passagem de camiões)",
        "Capacidade de carga do piso adequada a estruturas cenográficas",
      ],
    },
    k4: {
      title: "Cúpula K4",
      bullets: [
        "Área 2 000 m²",
        "Altura 16 m",
        "Ligações elétricas até 1 MW",
        "Postos de maquilhagem",
        "Ar condicionado",
        "Treliça com capacidade até 2 toneladas",
        "Duas portas 4 m × 4,5 m (passagem de camiões)",
        "Capacidade de carga do piso adequada a estruturas cenográficas",
      ],
    },
    k7: {
      title: "Cúpula K7",
      bullets: [
        "Ecrã 10,2 × 4,2 m",
        "Projetor 4K",
        "Certificado Dolby Premier",
        "76 lugares",
      ],
    },
    k10k12: {
      title: "Cúpulas K10 e K12",
      bullets: ["Cúpulas de dois níveis", "Área 600 m²"],
    },
  },
};

// ===== Komponenty pomocnicze: EventVideo =====
interface EventVideoProps {
  src: string;
  srcWebm?: string;
  poster?: string;
  className?: string;
  loadingLabel: string;
  fallbackText: string;
  preload?: "auto" | "metadata" | "none";
}

function EventVideo({
  src,
  srcWebm,
  poster,
  className,
  loadingLabel,
  fallbackText,
  preload = "none",
}: EventVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Jeśli wideo zdążyło się załadować zanim React podpiął zdarzenia,
  // sprawdzamy jego stan po zamontowaniu komponentu.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // readyState >= 2 oznacza, że metadane są załadowane,
    // >= 3 że mamy już dane do odtwarzania.
    if (video.readyState >= 2) {
      setIsLoaded(true);
    }

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    video.addEventListener("canplay", handleCanPlay);
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Wstrzymuj poza viewportem, wznawiaj gdy widać (odciążenie CPU)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Safari: dopilnuj loop/autoplay inline
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const ensurePlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    };

    const handleEnded = () => {
      video.currentTime = 0;
      ensurePlay();
    };
    const handlePause = () => {
      if (video.paused && isVisible) ensurePlay();
    };
    const handleWebkitEndFullscreen = () => ensurePlay();

    ensurePlay();
    video.addEventListener("ended", handleEnded);
    video.addEventListener("pause", handlePause);
    video.addEventListener("webkitendfullscreen", handleWebkitEndFullscreen as EventListener);
    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("webkitendfullscreen", handleWebkitEndFullscreen as EventListener);
    };
  }, [isVisible]);

  // Jeśli właśnie weszło w viewport, spróbuj wystartować (muted autoplay powinien przejść)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isVisible) {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    }
  }, [isVisible]);

  return (
    <div
      className={`relative h-56 md:h-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/20 ${
        className ?? ""
      }`}
      aria-busy={!isLoaded}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
        preload={preload}
        {...(poster ? { poster } : {})}
        onLoadedData={() => setIsLoaded(true)}
        onCanPlay={() => setIsLoaded(true)}
      >
        {srcWebm ? <source src={srcWebm} type="video/webm" /> : null}
        <source src={src} type="video/mp4" />
        {fallbackText}
      </video>
      {!isLoaded ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-xs sm:text-sm force-overlay-dim bg-black/50 backdrop-blur-[2px] animate-pulse pointer-events-none">
          {loadingLabel}
        </div>
      ) : null}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/70"
        aria-hidden
      />
    </div>
  );
}

interface VideoTileProps {
  item: VideoItem;
  playLabel: string;
}

function VideoTile({ item, playLabel }: VideoTileProps) {
  const videoHref = item.src.includes("/embed/")
    ? item.src.replace("/embed/", "/watch?v=")
    : item.src;

  return (
    <a
      href={videoHref}
      target="_blank"
      rel="noopener noreferrer"
      className="events-video-tile group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(247,120,40,0.7)]"
      aria-label={`${playLabel}: ${item.title}`}
    >
      <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-black/50">
        <Image
          src={item.poster}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="events-video-tile-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <span className="events-video-play-badge absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
          ▶ {playLabel}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-sm sm:text-base font-semibold text-white">{item.title}</p>
        <p className="mt-1 text-xs sm:text-sm text-white/75">{item.body}</p>
      </div>
    </a>
  );
}

interface ReadablePointsProps {
  items: string[];
  columns?: 1 | 2;
  compact?: boolean;
  className?: string;
}

function ReadablePoints({
  items,
  columns = 1,
  compact = false,
  className,
}: ReadablePointsProps) {
  return (
    <ul
      className={`grid w-full ${
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"
      } ${compact ? "gap-x-5 gap-y-1" : "gap-x-7 gap-y-1.5"} ${className ?? ""}`}
    >
      {items.map((line, i) => (
        <li
          key={`${line}-${i}`}
          className={`group flex items-start gap-3 border-b border-white/10 ${
            compact ? "py-2 text-sm" : "py-2.5 text-sm sm:text-[15px]"
          }`}
        >
          <span className="mt-[0.48rem] inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#4fcfde] shadow-[0_0_12px_rgba(79,207,222,0.4)]" />
          <span className="text-white/90 leading-relaxed transition-transform duration-300 group-hover:translate-x-0.5">{line}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoGroup({
  label,
  separated = false,
  children,
}: {
  label: string;
  separated?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`space-y-2 ${
        separated ? "events-info-group-separated mt-4 border-t pt-4" : ""
      }`}
    >
      <p className="events-section-label text-[11px] font-semibold uppercase tracking-[0.24em]">
        {label}
      </p>
      {children}
    </section>
  );
}

type GalleryPhoto = { src: string; alt: string };

function DomePointList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul
      className={`grid ${columns === 2 ? "sm:grid-cols-2 gap-x-6" : "grid-cols-1"} gap-y-2.5`}
    >
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="events-dome-point flex items-start gap-2.5 text-sm leading-relaxed transition-transform duration-300 hover:translate-x-1 sm:text-[15px]"
        >
          <span className="mt-[0.45rem] inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#4fcfde] shadow-[0_0_10px_rgba(79,207,222,0.35)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function EventPhotoColumn({
  photos,
  animate = true,
  className = "",
}: {
  photos: GalleryPhoto[];
  animate?: boolean;
  className?: string;
}) {
  const loopPhotos = useMemo(() => [...photos, ...photos], [photos]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!animate) {
      return;
    }
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) {
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const disableContinuousScroll = window.matchMedia("(max-width: 1023px)").matches;
    if (prefersReduced || disableContinuousScroll) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let frameId: number | null = null;
    let halfHeight = 0;
    let offset = 0;
    let isVisible = false;
    let lastTime = 0;
    const speed = window.matchMedia("(min-width: 1536px)").matches ? 16 : 12;

    const normalizeOffset = () => {
      if (halfHeight <= 0) return;
      offset = ((offset % halfHeight) + halfHeight) % halfHeight;
    };

    const recalculateHeight = () => {
      halfHeight = track.scrollHeight / 2;
      normalizeOffset();
    };

    const applyTrackTransform = () => {
      track.style.transform = `translate3d(0, ${-offset.toFixed(2)}px, 0)`;
    };

    const tick = (time: number) => {
      if (!isVisible) {
        frameId = null;
        return;
      }
      if (!lastTime) {
        lastTime = time;
      }
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      offset += speed * deltaSeconds;
      normalizeOffset();
      applyTrackTransform();

      frameId = window.requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (frameId !== null || !isVisible) return;
      lastTime = 0;
      frameId = window.requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    recalculateHeight();
    const resizeObserver = new ResizeObserver(recalculateHeight);
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
        threshold: 0.08,
        rootMargin: "80px 0px",
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

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
    };
  }, [photos.length, animate]);

  return (
    <div
      ref={containerRef}
      className={`events-showcase relative h-[22rem] sm:h-[26rem] md:h-[26rem] lg:h-[27rem] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}
    >
      <div
        className="events-showcase-fade-top pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-[#1a1f36] to-transparent sm:h-14"
        aria-hidden="true"
      />
      <div
        className="events-showcase-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-[#1a1f36] to-transparent sm:h-14"
        aria-hidden="true"
      />
      <div
        ref={trackRef}
        className="events-showcase-column flex min-h-max flex-col gap-3 p-3 sm:gap-4 sm:p-4 will-change-transform"
      >
        {loopPhotos.map((photo, index) => (
          <div
            key={`${photo.src}-${index}`}
            className="events-showcase-item relative h-36 sm:h-40 md:h-48 overflow-hidden rounded-xl border border-white/10 bg-black/30"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 42vw, (min-width: 768px) 46vw, 92vw"
              className="object-cover"
              loading={index < 3 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DomeSpecBlock({
  dome,
  rentalLabel,
  locale,
  imageSrc,
  imageAlt,
}: {
  dome: DomeContent;
  rentalLabel: string;
  locale: Locale;
  imageSrc: string;
  imageAlt: string;
}) {
  const highlights = dome.bullets.slice(0, Math.min(2, dome.bullets.length));
  const details = dome.bullets.slice(highlights.length);
  const highlightsLabel =
    locale === "en" ? "Key highlights" : locale === "pt" ? "Destaques" : "Najważniejsze";
  const detailsLabel =
    locale === "en"
      ? "Technical details"
      : locale === "pt"
      ? "Detalhes técnicos"
      : "Szczegóły techniczne";

  return (
    <section className="events-dome-card rounded-2xl border p-4 transition-transform duration-300 hover:-translate-y-1 sm:p-5 md:p-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl md:text-2xl font-bold text-center md:text-left">
                {dome.title}
              </h3>
              <span className="events-rental-pill inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                {rentalLabel}
              </span>
            </div>
          </div>
          <div className="events-dome-thumb relative h-20 w-full overflow-hidden rounded-xl border sm:w-48 md:w-44">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 176px, (min-width: 640px) 192px, 100vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>
        </div>
        <div className="events-dome-divider h-[1px] w-full" />
        <div className="space-y-3">
          <p className="events-section-label text-[11px] font-semibold uppercase tracking-[0.24em]">
            {highlightsLabel}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {highlights.map((item, index) => (
              <div
                key={`${dome.title}-highlight-${index}`}
                className="events-dome-highlight rounded-lg border px-3 py-2.5 text-sm leading-relaxed transition-transform duration-300 hover:-translate-y-0.5 sm:text-[15px]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        {details.length > 0 ? (
          <details className="events-dome-details group rounded-xl border">
            <summary className="events-dome-summary flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
              <span className="events-section-label text-[11px] font-semibold uppercase tracking-[0.24em]">
                {detailsLabel}
              </span>
              <span className="events-dome-caret text-sm transition-transform duration-300 group-open:rotate-180">
                v
              </span>
            </summary>
            <div className="events-dome-details-content border-t px-4 pb-4 pt-3">
              <DomePointList items={details} columns={details.length > 3 ? 2 : 1} />
            </div>
          </details>
        ) : null}
      </div>
    </section>
  );
}

export default function EventsPage() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const t = COPY[loc];
  const ui = UI_TEXT[loc];
  const sectionUi = SECTION_UI[loc];
  const contactHref = loc === "en" ? "/en/contact" : loc === "pt" ? "/pt/contact" : "/kontakt";
  const formatShowcasePhotos = useMemo(
    () =>
      FORMAT_SHOWCASE_IMAGES.map((src, index) => ({
        src,
        alt: `${SECOND[loc].title} ${index + 1}`,
      })),
    [loc],
  );
  const domes = DOMES[loc];
  const contacts = CONTACTS[loc];
  const videoShowcase = VIDEO_SHOWCASE[loc];
  const heroRef = useRef<HTMLVideoElement | null>(null);
  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  // Hero wideo: start/pauza zależnie od viewportu
  useEffect(() => {
    const el = heroContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (isHeroVisible) {
      const p = el.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    } else {
      el.pause();
    }
  }, [isHeroVisible]);

  return (
    <main className="events-page relative min-h-screen">
      {/* Główna treść strony */}
      <section className="relative z-10 px-4 py-16 sm:py-20">
        {/* Hero video z tytułem */}
        <header className="ap-shell mb-10 sm:mb-12">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="relative aspect-[16/9] bg-black" ref={heroContainerRef}>
              <video
                ref={heroRef}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                poster="/wydarzenia/AP_wydarzenia_poster.webp"
                onEnded={(e) => {
                  e.currentTarget.currentTime = 0;
                  e.currentTarget.play();
                }}
              >
                <source src="/wydarzenia/AP_wydarzenia.webm" type="video/webm" />
                <source src="/wydarzenia/AP_wydarzenia.mp4" type="video/mp4" />
                {ui.videoFallback}
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />
              <div className="relative flex h-full items-center justify-center p-6 sm:p-10 text-center force-overlay">
                <div className="space-y-2 ap-page-intro-stagger">
                  <p className="ap-type-kicker force-overlay-muted">
                    {t.tag}
                  </p>
                  <h1 className="ap-type-hero-title force-overlay drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {t.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* LISTA KAFELKÓW */}
        <section className="ap-shell">
          <ul className="ap-page-stack">
            {/* 1. Krótki overview */}
            <li>
              <ScrollMotionItem strength="strong" delay={40} className="ap-deferred-section">
                <Card variant="solid" motion="off">
                  <div className="grid gap-6 md:gap-8 md:grid-cols-2 items-stretch">
                    <div className="md:order-2 flex flex-col items-center text-center md:items-start md:text-left">
                      <div className="w-full max-w-2xl">
                        <InfoGroup label={sectionUi.highlightsLabel}>
                          <h2 className="ap-type-section-title text-center md:text-left">
                            {t.venueLabel}
                          </h2>
                          <p className="ap-type-section-body mt-2 max-w-2xl text-center md:text-left">
                            {t.intro}
                          </p>
                          <ReadablePoints items={t.bullets} className="mt-2 max-w-2xl" />
                        </InfoGroup>
                      </div>
                    </div>
                    <EventVideo
                      className="md:order-1"
                      src="/wydarzenia/bankiet1.mp4"
                      poster="/wydarzenia/AP_wydarzenia_poster.webp"
                      loadingLabel={ui.loadingVideo}
                      fallbackText={ui.videoFallback}
                    />
                  </div>
                </Card>
              </ScrollMotionItem>
            </li>

            {/* 2. Formaty wydarzeń */}
            <li>
              <ScrollMotionItem strength="strong" delay={110} className="ap-deferred-section">
                <Card variant="solid" motion="off">
                  <div className="grid gap-6 md:gap-8 md:grid-cols-2 items-stretch">
                    <div className="md:order-1 flex flex-col items-center text-center md:items-start md:text-left">
                      <div className="w-full max-w-3xl">
                        <InfoGroup label={sectionUi.offerLabel}>
                          <h2 className="ap-type-section-title text-center md:text-left">
                            {SECOND[loc].title}
                          </h2>
                          <ReadablePoints
                            items={SECOND[loc].bullets}
                            columns={2}
                            className="mt-2 max-w-3xl"
                          />
                        </InfoGroup>
                      </div>
                    </div>
                    <EventPhotoColumn
                      className="md:order-2"
                      photos={formatShowcasePhotos}
                    />
                  </div>
                </Card>
              </ScrollMotionItem>
            </li>

            {/* 3. Specyfikacja kopuł */}
            <li>
              <ScrollMotionItem strength="strong" delay={180} className="ap-deferred-section">
                <Card variant="solid" motion="off">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="ap-type-section-title">
                        {sectionUi.domesLabel}
                      </h2>
                      <div className="events-section-divider mx-auto mt-4 h-[1px] w-full max-w-3xl" />
                      <p className="events-section-intro mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base">
                        {sectionUi.domesIntro}
                      </p>
                    </div>
                    <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
                      <div>
                        <DomeSpecBlock
                          dome={domes.k3}
                          rentalLabel={sectionUi.domesCardLabel}
                          locale={loc}
                          imageSrc={DOME_IMAGE_BY_KEY.k3}
                          imageAlt={`${domes.k3.title} - ${sectionUi.domeImageAltSuffix}`}
                        />
                      </div>
                      <div>
                        <DomeSpecBlock
                          dome={domes.k4}
                          rentalLabel={sectionUi.domesCardLabel}
                          locale={loc}
                          imageSrc={DOME_IMAGE_BY_KEY.k4}
                          imageAlt={`${domes.k4.title} - ${sectionUi.domeImageAltSuffix}`}
                        />
                      </div>
                      <div>
                        <DomeSpecBlock
                          dome={domes.k7}
                          rentalLabel={sectionUi.domesCardLabel}
                          locale={loc}
                          imageSrc={DOME_IMAGE_BY_KEY.k7}
                          imageAlt={`${domes.k7.title} - ${sectionUi.domeImageAltSuffix}`}
                        />
                      </div>
                      <div>
                        <DomeSpecBlock
                          dome={domes.k10k12}
                          rentalLabel={sectionUi.domesCardLabel}
                          locale={loc}
                          imageSrc={DOME_IMAGE_BY_KEY.k10k12}
                          imageAlt={`${domes.k10k12.title} - ${sectionUi.domeImageAltSuffix}`}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </ScrollMotionItem>
            </li>

            {/* 4. Trzy wideo obok siebie */}
            <li>
              <ScrollMotionItem strength="soft" delay={250} className="ap-deferred-section">
                <Card variant="glass" className="events-video-card" motion="off">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="ap-type-section-title">
                        {videoShowcase.title}
                      </h2>
                    </div>
                    <div className="grid gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {videoShowcase.items.map((item) => (
                        <div key={item.title} className="w-full min-w-0">
                          <VideoTile
                            item={item}
                            playLabel={ui.playVideo}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </ScrollMotionItem>
            </li>

            {/* 5. Zespół sprzedaży */}
            <li>
              <ScrollMotionItem strength="soft" delay={320} className="ap-deferred-section">
                <Card variant="solid" motion="off">
                  <div className="w-full max-w-5xl">
                    <InfoGroup label={sectionUi.salesTeamLabel}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {contacts.slice(0, 2).map((person) => (
                          <article
                            key={`event-card-${person.email}`}
                            className="events-contact-card rounded-xl border p-3 transition-transform duration-300 hover:-translate-y-0.5 sm:p-4"
                          >
                            <p className="text-base font-semibold text-white">{person.name}</p>
                            <p className="mt-1 text-xs sm:text-sm text-white/70">{person.role}</p>
                            <p className="mt-2 text-sm">
                              <a
                                href={`tel:${person.phone.replace(/\s+/g, "")}`}
                                className="events-contact-link"
                              >
                                {person.phone}
                              </a>
                            </p>
                          </article>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-center md:justify-start">
                        <PrimaryButton href={contactHref} size="md">
                          {sectionUi.contactCta}
                        </PrimaryButton>
                      </div>
                    </InfoGroup>
                  </div>
                </Card>
              </ScrollMotionItem>
            </li>

          </ul>
        </section>
      </section>
    </main>
  );
}
