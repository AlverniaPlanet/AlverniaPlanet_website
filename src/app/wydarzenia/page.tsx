"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, type Variants } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/app/i18n-provider";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import Image from "next/image";
import Link from "next/link";

// ===== Animations (spójne z resztą serwisu) =====
const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

// ===== Lokalny słownik (PL/EN) =====
type Locale = "pl" | "en" | "pt";

const COPY: Record<
  Locale,
  {
    title: string;
    tag: string;
    venueLabel: string;
    bullets: string[];
  }
> = {
  pl: {
    title: "Wyjątkowe miejsce na event",
    tag: "wydarzenia",
    venueLabel: "Alvernia Planet",
    bullets: [
      "To idealne miejsce na organizację wyszukanego eventu",
      "Przyciąga uwagę nawet najbardziej wymagającego klienta",
      "Wyjątkowe miejsce na skalę światową",
      "Unikatowa infrastruktura",
      "Odosobniona lokalizacja zapewniająca prywatność i bezpieczeństwo",
    ],
  },
  en: {
    title: "A one-of-a-kind venue for events",
    tag: "events",
    venueLabel: "Alvernia Planet",
    bullets: [
      "A perfect place to host a refined event",
      "Captures the attention of even the most demanding clients",
      "A unique venue of world-class scale",
      "Truly distinctive infrastructure",
      "Secluded location providing privacy and security",
    ],
  },
  pt: {
    title: "Um lugar único para eventos",
    tag: "eventos",
    venueLabel: "Alvernia Planet",
    bullets: [
      "Um lugar ideal para organizar um evento sofisticado",
      "Atrai a atenção até dos clientes mais exigentes",
      "Um espaço único à escala mundial",
      "Infraestrutura verdadeiramente distinta",
      "Localização isolada que garante privacidade e segurança",
    ],
  },
};

const SECOND: Record<Locale, { title: string; bullets: string[] }> = {
  pl: {
    title: "Nieograniczone możliwości zorganizowania:",
    bullets: [
      "Ekskluzywnych eventów korporacyjnych",
      "Spotkań kluczowych klientów",
      "Targów branżowych",
      "Konferencji prasowej",
      "Szkoleń i wykładów",
      "Pokazów mody",
      "Koncertów",
      "Prezentacji",
    ],
  },
  en: {
    title: "Unlimited possibilities to host",
    bullets: [
      "Exclusive corporate events",
      "Key client meetings",
      "Industry trade fairs",
      "Press conferences",
      "Trainings and lectures",
      "Fashion shows",
      "Concerts",
      "Product presentations",
    ],
  },
  pt: {
    title: "Possibilidades ilimitadas para organizar:",
    bullets: [
      "Eventos corporativos exclusivos",
      "Reuniões com clientes‑chave",
      "Feiras do setor",
      "Conferências de imprensa",
      "Formações e palestras",
      "Desfiles de moda",
      "Concertos",
      "Apresentações de produto",
    ],
  },
};

const THIRD: Record<Locale, { title: string; bullets: string[] }> = {
  pl: {
    title: "Co nas wyróżnia?",
    bullets: [
      "Niespotykana architektura",
      "Dwa studia – kopuły, każde o powierzchni 2 000 m²",
      "Ponadnormatywne wjazdy do wnętrza kopuł przez naprzeciwległe bramy",
      "Każda z kopuł może pomieścić 1 200 osób",
      "Sklepienie centralne ponad 16 m",
      "Spektakularna akustyka",
      "Parking na ponad 200 samochodów i autobusów oraz lądowisko dla helikopterów",
      "Zaplecze: gastronomiczne, garderoby, charakteryzatornie",
    ],
  },
  en: {
    title: "What makes us unique?",
    bullets: [
      "Unconventional architecture",
      "Two studios – domes, each with 2,000 m² of floor space",
      "Oversized drive-through access via opposite gates",
      "Each dome can host up to 1,200 people",
      "Central dome height over 16 m",
      "Spectacular acoustics",
      "Parking for 200+ cars & buses plus a helipad",
      "Back-of-house: catering, dressing rooms, make-up rooms",
    ],
  },
  pt: {
    title: "O que nos distingue?",
    bullets: [
      "Arquitetura pouco comum",
      "Dois estúdios — cúpulas, cada uma com 2 000 m²",
      "Acesso de grandes dimensões por portões opostos",
      "Cada cúpula pode receber até 1 200 pessoas",
      "Altura central superior a 16 m",
      "Acústica espetacular",
      "Estacionamento para mais de 200 carros e autocarros e heliponto",
      "Backstage: catering, camarins e salas de maquilhagem",
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
        src: "https://www.youtube.com/embed/jt6zh-vaFNc",
        poster: "https://img.youtube.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Bankiet i gala",
        body: "Wieczorna aranżacja z elegancką oprawą.",
        src: "https://www.youtube.com/embed/PWtTaxqxufE",
        poster: "https://img.youtube.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Club / afterparty",
        body: "Światła i dźwięk w klubowym wydaniu.",
        src: "https://www.youtube.com/embed/BkdKk5Jc_RA",
        poster: "https://img.youtube.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
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
        src: "https://www.youtube.com/embed/jt6zh-vaFNc",
        poster: "https://img.youtube.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Banquet and gala",
        body: "Evening setup with elegant styling.",
        src: "https://www.youtube.com/embed/PWtTaxqxufE",
        poster: "https://img.youtube.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Club / afterparty",
        body: "Lights and sound in a club vibe.",
        src: "https://www.youtube.com/embed/BkdKk5Jc_RA",
        poster: "https://img.youtube.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
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
        src: "https://www.youtube.com/embed/jt6zh-vaFNc",
        poster: "https://img.youtube.com/vi/jt6zh-vaFNc/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Banquete e gala",
        body: "Cenário noturno com um toque elegante.",
        src: "https://www.youtube.com/embed/PWtTaxqxufE",
        poster: "https://img.youtube.com/vi/PWtTaxqxufE/hqdefault.jpg",
        embed: true,
      },
      {
        title: "Club / afterparty",
        body: "Luzes e som em ambiente de clube.",
        src: "https://www.youtube.com/embed/BkdKk5Jc_RA",
        poster: "https://img.youtube.com/vi/BkdKk5Jc_RA/hqdefault.jpg",
        embed: true,
      },
    ],
  },
};

const PREVIEW_IMG: Record<Locale, { src: string; alt: string }>[] = [
  {
    pl: { src: "/wydarzenia/Koncert_poster.webp", alt: "Kopuły z lotu ptaka" },
    en: { src: "/wydarzenia/Koncert_poster.webp", alt: "Domes – aerial view" },
    pt: { src: "/wydarzenia/Koncert_poster.webp", alt: "Cúpulas vistas de cima" },
  } as any,
  {
    pl: {
      src: "/wydarzenia/Bankiet_poster.webp",
      alt: "Wnętrza ścieżki filmowej",
    },
    en: {
      src: "/wydarzenia/Bankiet_poster.webp",
      alt: "Film path interiors",
    },
    pt: {
      src: "/wydarzenia/Bankiet_poster.webp",
      alt: "Interiores do percurso cinematográfico",
    },
  } as any,
  {
    pl: { src: "/wydarzenia/Club_poster.webp", alt: "Scena wydarzenia" },
    en: { src: "/wydarzenia/Club_poster.webp", alt: "Event scene" },
    pt: { src: "/wydarzenia/Club_poster.webp", alt: "Palco do evento" },
  } as any,
];

// ===== UI tekst (loadery, kontakt, adres, przycisk mapy) =====
const UI_TEXT: Record<
  Locale,
  {
    loadingVideo: string;
    loadingMap: string;
    loadMapAction: string;
    playVideo: string;
    contactHeading: string;
    addressHeading: string;
    mapButton: string;
    mapTitle: string;
    videoFallback: string;
  }
> = {
  pl: {
    loadingVideo: "Ładowanie wideo...",
    loadingMap: "Ładowanie mapy...",
    loadMapAction: "Załaduj mapę",
    playVideo: "Odtwórz",
    contactHeading: "Kontakt",
    addressHeading: "Adres",
    mapButton: "Zobacz na mapie",
    mapTitle: "Mapa Alvernia Planet",
    videoFallback: "Twoja przeglądarka nie obsługuje elementu wideo.",
  },
  en: {
    loadingVideo: "Loading video...",
    loadingMap: "Loading map...",
    loadMapAction: "Load map",
    playVideo: "Play",
    contactHeading: "Contact",
    addressHeading: "Address",
    mapButton: "View on map",
    mapTitle: "Map – Alvernia Planet",
    videoFallback: "Your browser does not support the video element.",
  },
  pt: {
    loadingVideo: "A carregar vídeo...",
    loadingMap: "A carregar mapa...",
    loadMapAction: "Carregar mapa",
    playVideo: "Reproduzir",
    contactHeading: "Contacto",
    addressHeading: "Morada",
    mapButton: "Ver no mapa",
    mapTitle: "Mapa – Alvernia Planet",
    videoFallback: "O seu navegador não suporta o elemento de vídeo.",
  },
};

const SECTION_UI: Record<
  Locale,
  {
    highlightsLabel: string;
    offerLabel: string;
    differentiatorsLabel: string;
    domesLabel: string;
    domesIntro: string;
  }
> = {
  pl: {
    highlightsLabel: "Najważniejsze atuty",
    offerLabel: "Formaty wydarzeń",
    differentiatorsLabel: "Infrastruktura i zaplecze",
    domesLabel: "Specyfikacja kopuł",
    domesIntro: "Parametry i możliwości techniczne naszych kopuł eventowych.",
  },
  en: {
    highlightsLabel: "Key highlights",
    offerLabel: "Event formats",
    differentiatorsLabel: "Infrastructure and support",
    domesLabel: "Dome specifications",
    domesIntro: "Technical parameters and capabilities of our event domes.",
  },
  pt: {
    highlightsLabel: "Destaques principais",
    offerLabel: "Formatos de evento",
    differentiatorsLabel: "Infraestrutura e suporte",
    domesLabel: "Especificações das cúpulas",
    domesIntro: "Parâmetros e capacidades técnicas das nossas cúpulas para eventos.",
  },
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

// ===== Komponenty pomocnicze: EventVideo + MapFrame =====
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
  preload = "metadata",
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
  loadingLabel: string;
  fallbackText: string;
  playLabel: string;
}

function VideoTile({ item, loadingLabel, fallbackText, playLabel }: VideoTileProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  if (item.embed) {
    const poster = item.poster;
    if (!isActivated) {
      return (
        <button
          type="button"
          onClick={() => setIsActivated(true)}
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(247,120,40,0.7)]"
          aria-label={`${playLabel}: ${item.title}`}
        >
          <div
            className="relative h-48 sm:h-52 md:h-56 w-full bg-black/50"
            style={
              poster
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 100%), url(${poster})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition group-hover:bg-white/25">
              ▶ {playLabel}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3 text-left">
            <p className="text-sm font-semibold text-white drop-shadow">{item.title}</p>
          </div>
        </button>
      );
    }

    return (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-black/40">
          {!isLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center text-xs sm:text-sm force-overlay-dim bg-black/50 backdrop-blur-[2px] animate-pulse pointer-events-none">
              {loadingLabel}
            </div>
          )}
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`${item.src}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <EventVideo
        className="h-48 sm:h-52 md:h-56"
        src={item.src}
        poster={item.poster}
        loadingLabel={loadingLabel}
        fallbackText={fallbackText}
      />
    </div>
  );
}

interface MapFrameProps {
  src: string;
  loadingLabel: string;
  actionLabel: string;
  title: string;
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
      } gap-3 ${className ?? ""}`}
    >
      {items.map((line, i) => (
        <li
          key={`${line}-${i}`}
          className={`ap-tile flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${
            compact ? "px-3.5 py-2.5 text-sm" : "px-4 py-3.5 text-sm sm:text-[15px]"
          }`}
        >
          <span className="mt-[0.42rem] inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#4fcfde] shadow-[0_0_14px_rgba(79,207,222,0.45)]" />
          <span className="text-white/90 leading-relaxed">{line}</span>
        </li>
      ))}
    </ul>
  );
}

function DomeSpecBlock({ dome }: { dome: DomeContent }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 md:p-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl md:text-2xl font-bold text-center md:text-left">
          {dome.title}
        </h3>
        <div className="h-[1px] w-full bg-white/15" />
        <ReadablePoints
          items={dome.bullets}
          columns={dome.bullets.length > 4 ? 2 : 1}
          compact
        />
      </div>
    </section>
  );
}

function MapFrame({ src, loadingLabel, actionLabel, title }: MapFrameProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="mt-2 mb-4 h-64 md:h-72 rounded-2xl overflow-hidden ring-1 ring-white/10 relative bg-black/40"
    >
      {!shouldLoad ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-sm force-overlay-dim bg-black/50 backdrop-blur-[2px]">
          <span>{loadingLabel}</span>
          <button
            type="button"
            onClick={() => setShouldLoad(true)}
            className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold ring-1 ring-white/20 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(247,120,40,0.7)]"
          >
            {actionLabel}
          </button>
        </div>
      ) : !isLoaded ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-xs sm:text-sm force-overlay-dim bg-black/50 backdrop-blur-[2px] animate-pulse pointer-events-none">
          {loadingLabel}
        </div>
      ) : null}
      {shouldLoad ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full border-0"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
        />
      ) : null}
    </div>
  );
}

export default function EventsPage() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const t = COPY[loc];
  const ui = UI_TEXT[loc];
  const sectionUi = SECTION_UI[loc];
  const domes = DOMES[loc];
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
    <main className="relative min-h-screen ap-page-intro-stagger">
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
                preload="metadata"
                poster="/wydarzenia/AP_wydarzenia_poster.webp"
                onEnded={(e) => {
                  e.currentTarget.currentTime = 0;
                  e.currentTarget.play();
                }}
              >
                <source src="/wydarzenia/AP_wydarzenia.mp4" type="video/mp4" />
                <source src="/wydarzenia/AP_wydarzenia.webm" type="video/webm" />
                {ui.videoFallback}
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />
              <div className="relative flex h-full items-center justify-center p-6 sm:p-10 text-center force-overlay">
                <div className="space-y-2">
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
          <motion.ul
            initial="hidden"
            animate="show"
            variants={fade}
            className="ap-page-stack"
          >
            {/* 1. Hero card z ogólnym opisem */}
            <li>
              <Card variant="solid">
                <div className="grid gap-6 md:gap-8 md:grid-cols-2 items-stretch">
                  {/* LEFT: bullets */}
                  <div className="md:order-2 flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="mb-5 w-full max-w-2xl">
                      <p className="text-[11px] uppercase tracking-[0.26em] text-white/60">
                        {sectionUi.highlightsLabel}
                      </p>
                      <h2 className="ap-type-section-title mt-2 text-center md:text-left">
                        {t.venueLabel}
                      </h2>
                      <div className="mt-4 h-[1px] w-full bg-white/15" />
                    </div>
                    <ReadablePoints items={t.bullets} className="max-w-2xl" />
                  </div>
                  {/* RIGHT: video */}
                  <EventVideo
                    className="md:order-1"
                    src="/wydarzenia/bankiet1.mp4"
                    poster="/wydarzenia/AP_wydarzenia_poster.webp"
                    loadingLabel={ui.loadingVideo}
                    fallbackText={ui.videoFallback}
                  />
                </div>
              </Card>
            </li>

            {/* 2. Druga karta — rodzaje wydarzeń */}
            <li>
              <Card variant="solid">
                <div className="grid gap-6 md:gap-8 md:grid-cols-2 items-stretch">
                  <div className="md:order-1 flex flex-col items-center text-center md:items-start md:text-left">
                    <p className="text-[11px] uppercase tracking-[0.26em] text-white/60">
                      {sectionUi.offerLabel}
                    </p>
                    <h2 className="ap-type-section-title mb-2 text-center md:text-left">
                      {SECOND[loc].title}
                    </h2>
                    <div className="h-[1px] w-full bg-white/15 mb-6" />
                    <ReadablePoints
                      items={SECOND[loc].bullets}
                      columns={2}
                      className="max-w-3xl"
                    />
                  </div>
                  <EventVideo
                    className="md:order-2"
                    src="/wydarzenia/banket4.mp4"
                    poster="/wydarzenia/AP_wydarzenia_poster.webp"
                    loadingLabel={ui.loadingVideo}
                    fallbackText={ui.videoFallback}
                  />
                </div>
              </Card>
            </li>

            {/* 3. Trzecia karta — co nas wyróżnia */}
            <li>
              <Card variant="solid">
                <div className="grid gap-6 md:gap-8 md:grid-cols-2 items-stretch">
                  <div className="md:order-2 flex flex-col items-center text-center md:items-start md:text-left">
                    <p className="text-[11px] uppercase tracking-[0.26em] text-white/60">
                      {sectionUi.differentiatorsLabel}
                    </p>
                    <h2 className="ap-type-section-title mb-2 text-center md:text-left">
                      {THIRD[loc].title}
                    </h2>
                    <div className="h-[1px] w-full bg-white/15 mb-6" />
                    <ReadablePoints
                      items={THIRD[loc].bullets}
                      columns={2}
                      className="max-w-3xl"
                    />
                  </div>
                  <EventVideo
                    className="md:order-1"
                    src="/wydarzenia/bankiet3.mp4"
                    poster="/wydarzenia/AP_wydarzenia_poster.webp"
                    loadingLabel={ui.loadingVideo}
                    fallbackText={ui.videoFallback}
                  />
                </div>
              </Card>
            </li>

            {/* 4. Trzy wideo obok siebie */}
            <li>
              <Card variant="glass">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="ap-type-section-title">
                      {videoShowcase.title}
                    </h2>
                  </div>
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {videoShowcase.items.map((item) => (
                      <VideoTile
                        key={item.title}
                        item={item}
                        loadingLabel={ui.loadingVideo}
                        fallbackText={ui.videoFallback}
                        playLabel={ui.playVideo}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </li>

            {/* 5. Specyfikacja kopuł */}
            <li>
              <Card variant="solid">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="ap-type-section-title">
                      {sectionUi.domesLabel}
                    </h2>
                    <div className="mx-auto mt-4 h-[1px] w-full max-w-3xl bg-white/15" />
                    <p className="mt-5 text-center text-sm sm:text-base text-gray-200 max-w-3xl mx-auto">
                      {sectionUi.domesIntro}
                    </p>
                  </div>
                  <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
                    <DomeSpecBlock dome={domes.k3} />
                    <DomeSpecBlock dome={domes.k4} />
                    <DomeSpecBlock dome={domes.k7} />
                    <DomeSpecBlock dome={domes.k10k12} />
                  </div>
                </div>
              </Card>
            </li>

            {/* 6. Mapka graficzna */}
            <li>
              <Card variant="solid">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/20">
                  <Image
                    src="/wydarzenia/mapka.webp"
                    alt="Mapa obiektu Alvernia Planet"
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={false}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/70"
                    aria-hidden
                  />
                </div>
              </Card>
            </li>

            {/* 7. Kontakt + mapa Google z loaderem */}
            <li>
              <Card variant="solid">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      {ui.contactHeading}
                    </h3>
                    <div className="h-[1px] w-full bg-white/15 mb-6" />
                    <div className="space-y-6 text-gray-100">
                      <div>
                        <p className="text-lg md:text-xl font-semibold">
                          PIOTR KOZOŁUB
                        </p>
                        <p className="mt-1 text-sm text-white/80">
                          Specjalista ds. sprzedaży
                        </p>
                        <p>
                          <a
                            href="tel:+48452432315"
                            className="hover:text-white"
                          >
                            +48 452 432 315
                          </a>
                        </p>
                        <p>
                          <a
                            href="mailto:p.kozolub@gremi.pl"
                            className="text-[#f03c64] hover:text-[#f77828]"
                          >
                            p.kozolub@gremi.pl
                          </a>
                        </p>
                      </div>
                      <div>
                        <p className="text-lg md:text-xl font-semibold">
                          BARTEK JACOŃ
                        </p>
                        <p className="mt-1 text-sm text-white/80">
                          Specjalista ds. sprzedaży
                        </p>
                        <p>
                          <a
                            href="tel:+48723999099"
                            className="hover:text-white"
                          >
                            +48 723 999 099
                          </a>
                        </p>
                        <p>
                          <a
                            href="mailto:b.jacon@gremi.pl"
                            className="text-[#f77828] hover:text-[#f03c64]"
                          >
                            b.jacon@gremi.pl
                          </a>
                        </p>
                      </div>

                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-semibold mb-3">
                      {ui.addressHeading}
                    </h4>
                    <p className="text-gray-100">Alvernia Planet</p>
                    <p className="text-gray-100">
                      Nieporaz, ul. Ferdynanda Wspaniałego 1
                    </p>
                    <p className="text-gray-100 mb-4">32-566 Alwernia</p>

                    {/* Osadzona mapka Google pod adresem */}
                    <MapFrame
                      title={ui.mapTitle}
                      src="https://www.google.com/maps?q=Alvernia+Planet,+Nieporaz,+Ferdynanda+Wspania%C5%82ego+1&amp;output=embed"
                      loadingLabel={ui.loadingMap}
                      actionLabel={ui.loadMapAction}
                    />

                    <PrimaryButton
                      href="https://maps.app.goo.gl/a45HTibANAsDAi7u7"
                      target="_blank"
                      rel="noopener noreferrer"
                      size="md"
                    >
                      {ui.mapButton}
                    </PrimaryButton>
                  </div>
                </div>
              </Card>
            </li>
          </motion.ul>
        </section>
      </section>
    </main>
  );
}
