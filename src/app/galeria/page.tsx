"use client";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useI18n } from "@/app/i18n-provider";
import { useState, useEffect } from "react";
import Card from "@/app/components/Card";

// Animations – spójne z resztą serwisu
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// helper to generate 1..n
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

// NOTE:
// Obrazy są w public/galeria/.../webp/*.webp (podfolder webp).
// Używamy bezpośredniej nazwy z polskim znakiem, żeby ścieżka odpowiadała strukturze w /public.
const GENERAL_DIR = `/galeria/Ogolne`;
const FILM_DIR = `/galeria/Sciezka_filmowa`;
const EVENTS_DIR = `/galeria/${encodeURIComponent("Wydarzenia")}`;
const EXHIBITION_DIR = `/galeria/Wystawa/HarryPotter_TheExhibition`;
const generalImages = range(8).map((n) => `${GENERAL_DIR}/webp/${n}.webp`);
const filmImages = range(8).map((n) => `${FILM_DIR}/webp/${n}.webp`);
const eventsImages = range(8).map((n) => `${EVENTS_DIR}/webp/${n}.webp`);
const harryPotterImages = range(8).map((n) => `${EXHIBITION_DIR}/webp/${n}.webp`);
const BLUR_PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAAAAACw="; // lekki placeholder dla ładowania

// ===== i18n (PL/EN lokalnie dla strony) =====
type Locale = "pl" | "en";
const COPY: Record<Locale, {
  title: string;
  subtitle: string;
  sections: {
    general: string;
    film: string;
    events: string;
    exhibitions: string;
    hpExhibition: string;
    photoLabel: string;
  };
  ui: {
    loadingImage: string;
    imageError: string;
  };
}> = {
  pl: {
    title: "Galeria",
    subtitle: "Zdjęcia z naszych przestrzeni i wydarzeń.",
    sections: {
      general: "Ogólne",
      film: "Ścieżka filmowa",
      events: "Wydarzenia",
      exhibitions: "Wystawy tematyczne",
      hpExhibition: "Harry Potter: The Exhibition 10.04 - 17.08.2025",
      photoLabel: "Zdjęcie",
    },
    ui: {
      loadingImage: "Ładowanie zdjęcia...",
      imageError: "Nie udało się wczytać",
    }
  },
  en: {
    title: "Gallery",
    subtitle: "Photos from our spaces and events.",
    sections: {
      general: "General",
      film: "Film path",
      events: "Events",
      exhibitions: "Themed exhibitions",
      hpExhibition: "Harry Potter: The Exhibition Apr 10 - Aug 17, 2025",
      photoLabel: "Photo",
    },
    ui: {
      loadingImage: "Loading image...",
      imageError: "Failed to load",
    }
  }
};

const CAPTIONS: Record<Locale, { general: string[]; film: string[]; events: string[]; exhibitions: string[] }> = {
  pl: {
    general: [
      "Kopuły z lotu ptaka",
      "Szklane łączniki między kopułami",
      "Korytarz kapsułowy",
      "Kompleks nocą z lotu ptaka",
      "Wejście do kopuły",
      "Przeszklony tunel wejściowy",
      "Domy kopułowe o zmierzchu",
      "Kompleks z drona",
    ],
    film: [
      "Stanowisko AI / VR",
      "Portal świetlny",
      "Rekwizyty i scenografia",
      "Prelekcja w studio",
      "Stanowiska interaktywne",
      "Ekrany projekcyjne",
      "Industrialne mosty i schody",
      "Instalacja neonowa",
    ],
    events: [
      "Konferencja w kopule",
      "Strefa networkingowa",
      "Bankiet w K9",
      "Gala w kopule",
      "Plan eventu i scena",
      "Catering live",
      "Strefa atrakcji na scenie",
      "Pokaz w kopule z autoshow",
    ],
    exhibitions: [
      "Wejście do wystawy",
      "Knight Bus",
      "Początek trasy – portal",
      "Sala immersyjna z mapą",
      "Strefa rejestracji",
      "Galeria portretów",
      "Autobus wystawy na zewnątrz",
      "Spotkanie z gośćmi",
    ],
  },
  en: {
    general: [
      "Domes from above",
      "Glass connectors between domes",
      "Capsule corridor",
      "Night view of the complex",
      "Dome entrance",
      "Glass entry tunnel",
      "Domes at dusk",
      "Drone view of the complex",
    ],
    film: [
      "AI / VR station",
      "Light portal",
      "Props & scenography",
      "Studio talk",
      "Interactive stations",
      "Projection screens",
      "Industrial bridges and stairs",
      "Neon installation",
    ],
    events: [
      "Conference in the dome",
      "Networking area",
      "Banquet in K9",
      "Gala in the dome",
      "Show plan & stage",
      "Live catering",
      "Attraction zone on stage",
      "Show in the dome with car reveal",
    ],
    exhibitions: [
      "Exhibition entry",
      "Knight Bus",
      "Route kickoff – portal",
      "Immersive map room",
      "Registration hall",
      "Portrait gallery",
      "Exhibition bus outside",
      "Guest meet & greet",
    ],
  },
};

export default function GalleryPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];
  const captions = CAPTIONS[loc];
  const ui = t.ui;

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [lightboxCaption, setLightboxCaption] = useState<string>("");

  function openLightbox(items: string[], index: number, caption: string) {
    setLightboxItems(items);
    setLightboxIndex(index);
    setLightboxCaption(caption);
    setIsLightboxOpen(true);
  }

  // Lock body scroll while the lightbox is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isLightboxOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isLightboxOpen]);

  return (
    <main className="relative min-h-screen text-white">
      <motion.div initial="hidden" animate="show" variants={fade} className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        {/* Nagłówek strony */}
        <header className="text-center mb-10 sm:mb-12">
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            {t.title}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-2 text-white/70">
            {t.subtitle}
          </motion.p>
        </header>

        {/* Sekcja: Ogólne */}
        <section aria-labelledby="gallery-general">
          <motion.div variants={fade}>
            <Card variant="solid">
            <div className="mb-4 flex items-center gap-4">
              <motion.h2
                variants={fadeUp}
                id="gallery-general"
                className="text-xl sm:text-2xl font-semibold tracking-tight"
              >
                {t.sections.general}
              </motion.h2>
              <div className="h-px flex-1 bg-white/10" />
              {/* mała „pigułka” z liczbą */}
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold leading-none text-white/80 ring-1 ring-white/10">
                {generalImages.length}
              </span>
            </div>

            <motion.ul variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {generalImages.map((src, i) => {
                const caption = captions.general[i] ?? `${t.sections.general} • ${t.sections.photoLabel} ${i + 1}`;
                return (
                  <motion.li key={src} className="group" variants={fadeUp}>
                    <GalleryTile
                      src={src}
                      alt={caption}
                      caption={caption}
                      loadingText={ui.loadingImage}
                      errorText={ui.imageError}
                      onClick={() => openLightbox(generalImages, i, caption)}
                      priority={i === 0}
                    />
                  </motion.li>
                );
              })}
            </motion.ul>
            </Card>
          </motion.div>
        </section>

        {/* Sekcja: Ścieżka filmowa */}
        <section aria-labelledby="gallery-film" className="mt-12 sm:mt-14 md:mt-16">
          <motion.div variants={fade}>
            <Card variant="solid">
            <div className="mb-4 flex items-center gap-4">
              <motion.h2
                variants={fadeUp}
                id="gallery-film"
                className="text-xl sm:text-2xl font-semibold tracking-tight"
              >
                {t.sections.film}
              </motion.h2>
              <div className="h-px flex-1 bg-white/10" />
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold leading-none text-white/80 ring-1 ring-white/10">
                {filmImages.length}
              </span>
            </div>

            <motion.ul variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filmImages.map((src, i) => {
                const caption = captions.film[i] ?? `${t.sections.film} • ${t.sections.photoLabel} ${i + 1}`;
                return (
                  <motion.li key={src} className="group" variants={fadeUp}>
                    <GalleryTile
                      src={src}
                      alt={caption}
                      caption={caption}
                      loadingText={ui.loadingImage}
                      errorText={ui.imageError}
                      onClick={() => openLightbox(filmImages, i, caption)}
                    />
                  </motion.li>
                );
              })}
            </motion.ul>
            </Card>
          </motion.div>
        </section>

        {/* Sekcja: Wystawy tematyczne */}
        <section aria-labelledby="gallery-exhibitions" className="mt-12 sm:mt-14 md:mt-16">
          <motion.div variants={fade}>
            <Card variant="solid">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <motion.div variants={fadeUp} className="flex-1">
                  <h2
                    id="gallery-exhibitions"
                    className="text-xl sm:text-2xl font-semibold tracking-tight"
                  >
                    {t.sections.exhibitions}
                  </h2>
                  <p className="mt-1 text-sm text-white/70">{t.sections.hpExhibition}</p>
                </motion.div>
                <div className="hidden h-px flex-1 bg-white/10 sm:block" />
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold leading-none text-white/80 ring-1 ring-white/10">
                  {harryPotterImages.length}
                </span>
              </div>

              <motion.ul variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {harryPotterImages.map((src, i) => {
                  const caption = captions.exhibitions[i] ?? `${t.sections.hpExhibition} • ${t.sections.photoLabel} ${i + 1}`;
                  return (
                    <motion.li key={src} className="group" variants={fadeUp}>
                      <GalleryTile
                        src={src}
                        alt={caption}
                        caption={caption}
                        loadingText={ui.loadingImage}
                        errorText={ui.imageError}
                        onClick={() => openLightbox(harryPotterImages, i, caption)}
                      />
                    </motion.li>
                  );
                })}
              </motion.ul>
            </Card>
          </motion.div>
        </section>

        {/* Sekcja: Wydarzenia */}
        <section aria-labelledby="gallery-events" className="mt-12 sm:mt-14 md:mt-16">
          <motion.div variants={fade}>
            <Card variant="solid">
            <div className="mb-4 flex items-center gap-4">
              <motion.h2
                variants={fadeUp}
                id="gallery-events"
                className="text-xl sm:text-2xl font-semibold tracking-tight"
              >
                {t.sections.events}
              </motion.h2>
              <div className="h-px flex-1 bg-white/10" />
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold leading-none text-white/80 ring-1 ring-white/10">
                {eventsImages.length}
              </span>
            </div>

            <motion.ul variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {eventsImages.map((src, i) => {
                const caption = captions.events[i] ?? `${t.sections.events} • ${t.sections.photoLabel} ${i + 1}`;
                return (
                  <motion.li key={src} className="group" variants={fadeUp}>
                    <GalleryTile
                      src={src}
                      alt={caption}
                      caption={caption}
                      loadingText={ui.loadingImage}
                      errorText={ui.imageError}
                      onClick={() => openLightbox(eventsImages, i, caption)}
                    />
                  </motion.li>
                );
              })}
            </motion.ul>
            </Card>
          </motion.div>
        </section>
      </motion.div>
      {isLightboxOpen && (
        <Lightbox
          items={lightboxItems}
          index={lightboxIndex}
          caption={lightboxCaption}
          onClose={() => setIsLightboxOpen(false)}
          onChange={(i) => setLightboxIndex(i)}
        />
      )}
    </main>
  );
}

type LightboxProps = {
  items: string[];
  index: number;
  caption?: string;
  onClose: () => void;
  onChange: (nextIndex: number) => void;
};

function Lightbox({ items, index, caption, onClose, onChange }: LightboxProps) {
  // keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onChange]);

  const next = () => onChange((index + 1) % items.length);
  const prev = () => onChange((index - 1 + items.length) % items.length);

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl h-[80vh]"
        >
          <Image
            src={items[index]}
            alt={caption ?? "photo"}
            fill
            className="object-contain select-none"
            sizes="100vw"
            priority
          />

          {/* Caption bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white/90 text-sm px-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate">{caption}</span>
              <span className="text-white/70 text-xs">{index + 1} / {items.length}</span>
            </div>
          </div>

          {/* Controls */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 ring-1 ring-white/20"
          >
            ✕
          </button>
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 ring-1 ring-white/20"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 ring-1 ring-white/20"
          >
            ›
          </button>
        </motion.div>
      </div>
    </div>
  );
}

type GalleryTileProps = {
  src: string;
  alt: string;
  caption: string;
  loadingText: string;
  errorText: string;
  onClick: () => void;
  priority?: boolean;
};

function GalleryTile({ src, alt, caption, loadingText, errorText, onClick, priority }: GalleryTileProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <figure
      onClick={() => {
        if (!errored) onClick();
      }}
      className="group overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition cursor-zoom-in"
    >
      <div className="relative aspect-[4/3]">
        {!loaded && !errored && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/5 animate-pulse text-xs text-white/70">
            {loadingText}
          </div>
        )}

        {errored ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-amber-200">
            {errorText}
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
        )}
      </div>
      <figcaption className="px-3 py-2 text-xs text-white/70">{caption}</figcaption>
    </figure>
  );
}
