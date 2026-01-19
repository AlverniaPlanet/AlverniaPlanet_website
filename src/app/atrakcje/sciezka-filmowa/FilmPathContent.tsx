"use client";

import Card from "@/app/components/Card";
import TourLineAccentTitle from "@/app/components/TourLineAccentTitle";
import TourLineGalleryRow from "@/app/components/TourLineGalleryRow";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";

type Locale = "pl" | "en";

type Section = { title: string; body: string };

type K9Item = { title: string; body: string; image: string };

const COPY: Record<
  Locale,
  {
    heroTag: string;
    heroTitle: string;
    heroLead: string;
    story: Section[];
    k9Title: string;
    k9Body: string;
    bookingTitle: string;
    bookingBody: string;
    bookingButton: string;
    bookingFrameTitle: string;
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
    bookingTitle: "Zarezerwuj termin",
    bookingBody: "Wybierz dogodny termin wizyty i zarezerwuj online w kalendarzu Bookero.",
    bookingButton: "Otwórz rezerwację w nowej karcie",
    bookingFrameTitle: "Rezerwacja Bookero",
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
    bookingTitle: "Book your visit",
    bookingBody: "Pick a convenient date and reserve online in the Bookero calendar.",
    bookingButton: "Open booking in a new tab",
    bookingFrameTitle: "Bookero booking",
    videoFallback: "Your browser does not support the video element.",
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
};

const BOOKING_URL = "https://alverniaplanet.bookero.pl";

export default function FilmPathContent() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];
  const k9 = K9_ITEMS[loc];

  return (
    <main className="relative z-10 min-h-screen">
      {/* Hero wideo (jak na /wydarzenia) */}
      <section className="relative z-10 px-4 pt-12 sm:pt-16">
        <div className="mx-auto w-full max-w-6xl mb-10 sm:mb-12">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="relative aspect-[16/9] bg-black">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/wycieczka/APE_sciezafilmowa_poster.webp"
                onEnded={(e) => {
                  e.currentTarget.currentTime = 0;
                  e.currentTarget.play();
                }}
              >
                <source src="/wycieczka/APE_sciezafilmowa.webm" type="video/webm" />
                <source src="/wycieczka/APE_sciezafilmowa.mp4" type="video/mp4" />
                {t.videoFallback}
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />
              <div className="relative flex h-full items-center justify-center p-6 sm:p-10 text-center force-overlay">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] force-overlay-muted">
                    {t.heroTag}
                  </p>
                  <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {t.heroTitle}
                  </h1>
                  <p className="force-overlay-dim text-base sm:text-lg max-w-3xl mx-auto">
                    {t.heroLead}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.story.map((section) => (
              <Card key={section.title} className="text-center space-y-4 h-full">
                <TourLineAccentTitle>{section.title}</TourLineAccentTitle>
                <p className="text-lg text-gray-100 leading-relaxed">{section.body}</p>
              </Card>
            ))}
          </div>

          <Card className="space-y-6">
            <div className="text-center space-y-3">
              <TourLineAccentTitle>{t.k9Title}</TourLineAccentTitle>
              <p className="text-base text-gray-100 leading-relaxed max-w-3xl mx-auto">
                {t.k9Body}
              </p>
            </div>

            <TourLineGalleryRow items={k9} />
          </Card>

          <Card title={t.bookingTitle} titleCentered titleDivider>
            <p className="text-gray-100 text-center max-w-3xl mx-auto">{t.bookingBody}</p>
            <div className="mt-6">
              <div className="w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5">
                <iframe
                  src={BOOKING_URL}
                  title={t.bookingFrameTitle}
                  loading="lazy"
                  className="w-full h-[900px] border-0"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <PrimaryButton href={BOOKING_URL} target="_blank" rel="noopener noreferrer" size="lg">
                {t.bookingButton}
              </PrimaryButton>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
