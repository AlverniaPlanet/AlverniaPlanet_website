"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useI18n } from "@/app/i18n-provider";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import Testimonials, { type Testimonial } from "@/app/components/Testimonials";
import translationsData, { NEWS_META } from "@/app/aktualnosci/aktualnosci";
import { AttractionCard } from "@/app/components/AttractionCard";

type Locale = "pl" | "en";

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

type HomeCopy = {
  heroTitle: string;
  attractions: {
    title: string;
    intro: string;
    items: AttractionItem[];
  };
  events: SectionCard;
  testimonials: {
    title: string;
    subtitle: string;
    reviews: Testimonial[];
  };
  about: SectionCard;
  tickets: SectionCard;
  news: {
    title: string;
    description: string;
    cta: string;
    href: string;
  };
  galleryTitle: string;
  galleryCta: string;
};

const HOME_COPY: Record<Locale, HomeCopy> = {
  pl: {
    heroTitle: "Witamy w Alvernia Planet",
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
    news: {
      title: "Aktualności",
      description: "Trzy najnowsze wpisy z Alvernia Planet.",
      cta: "Zobacz starsze",
      href: "/aktualnosci",
    },
    about: {
      title: "O obiekcie",
      description:
        "Alvernia Planet to unikalne centrum edukacji i rozrywki, w którym nauka spotyka się z filmową magią.",
      cta: "Poznaj nas",
      href: "/o-alvernia-planet",
    },
    tickets: {
      title: "Bilety",
      description: "Bilet normalny 35 zł, ulgowy 25 zł, grupowy 20 zł.",
      cta: "Zapytaj o bilety",
      href: "/kontakt",
    },
    galleryTitle: "Galeria",
    galleryCta: "Otwórz całą galerię",
  },
  en: {
    heroTitle: "Welcome to Alvernia Planet",
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
          name: "Mark L.",
          date: "December 2024",
          text:
            "We arrived with a school group. Flawless logistics, no rush, and clear instructions. Students loved it, teachers appreciated how helpful the crew was.",
          rating: 5,
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
    news: {
      title: "News",
      description: "The three latest updates from Alvernia Planet.",
      cta: "See older posts",
      href: "/aktualnosci",
    },
    about: {
      title: "About the venue",
      description:
        "Alvernia Planet is a unique hub of education and entertainment where science meets cinematic magic.",
      cta: "Meet us",
      href: "/o-alvernia-planet",
    },
    tickets: {
      title: "Tickets",
      description: "Standard ticket 35 PLN, concession 25 PLN, group 20 PLN.",
      cta: "Ask about tickets",
      href: "/kontakt",
    },
    galleryTitle: "Gallery",
    galleryCta: "View full gallery",
  },
};

const GOOGLE_PLACE_URL =
  "https://www.google.com/maps/place/Alvernia+Planet/@50.1022663,19.5444717,637m/data=!3m1!1e3!4m8!3m7!1s0x4716f227b90ec1a1:0xbd1dbadc60237cc3!8m2!3d50.1022629!4d19.5470466!9m1!1b1!16s%2Fg%2F1yy3vkg22?hl=pl&entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D";
const CATEGORY_COLORS: Record<string, string> = {
  "ścieżka filmowa": "from-amber-500 to-orange-500",
  "kino 360": "from-sky-500 to-blue-500",
  ogólne: "from-neutral-600 to-neutral-400",
};
const CATEGORY_LABELS: Record<string, { pl: string; en: string }> = {
  "ścieżka filmowa": { pl: "Ścieżka filmowa", en: "Film path" },
  "kino 360": { pl: "Kino 360", en: "360 cinema" },
  ogólne: { pl: "Ogólne", en: "General" },
};

type HomeNewsItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
};

function getLatestNews(loc: Locale, limit = 3): HomeNewsItem[] {
  const posts: Record<string, { title: string; excerpt: string }> = translationsData[loc]?.posts ?? {};
  return NEWS_META.slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map((meta) => ({
      id: meta.id,
      title: posts[meta.id]?.title ?? "",
      excerpt: posts[meta.id]?.excerpt ?? "",
      date: meta.date,
      category: meta.category,
    }));
}

function formatDate(locale: Locale, iso: string) {
  const lang = locale === "pl" ? "pl-PL" : "en-GB";
  return new Date(iso).toLocaleDateString(lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Page() {
  const [showGifHint, setShowGifHint] = useState(false);
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = HOME_COPY[loc];
  const hintText = locale === "en" ? "Scroll down" : "Przewiń w dół";
  const heroVideoFallback = loc === "en" ? "Your browser does not support the video element." : "Twój browser nie wspiera elementu video.";
  const latestNews = useMemo(() => getLatestNews(loc, 3), [loc]);
  const eventPhotos = [
    {
      src: "/galeria/Wydarzenia/webp/1.webp",
      alt: loc === "en" ? "Stage setup during an event" : "Scenografia sceny podczas wydarzenia",
    },
    {
      src: "/galeria/Wydarzenia/webp/4.webp",
      alt: loc === "en" ? "Guests networking in the dome" : "Goście podczas networkingu w kopule",
    },
    {
      src: "/galeria/Wydarzenia/webp/5.webp",
      alt: loc === "en" ? "Live performance in the dome" : "Występ na żywo w kopule",
    },
  ];

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const cycleRef = useRef<number | null>(null);
  useEffect(() => {
    const steps: Array<{ show: boolean; dur: number }> = [
      { show: false, dur: 5000 }, // start: czekaj 5s
      { show: true,  dur: 5000 }, // pokaż 6s (BYŁO 3s)
      { show: false, dur: 5000 }, // ukryj 5s
      { show: true,  dur: 5000 }, // 
      { show: false, dur: 5000 }, // ukryj 5s
    ];
    const run = (i: number) => {
      // Po trzech pierwszych krokach zapętlamy: pokaż 5s / ukryj 5s
      const idx = i < steps.length ? i : 3 + ((i - 3) % 2);
      const { show, dur } = steps[idx];
      setShowGifHint(show);
      cycleRef.current = window.setTimeout(() => run(i + 1), dur);
    };
    run(0);
    return () => {
      if (cycleRef.current) clearTimeout(cycleRef.current);
    };
  }, []);

  // Safari: wymuś loop/autoplay inline nawet po zakończeniu
  useEffect(() => {
    const video = heroVideoRef.current;
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
      if (video.paused) ensurePlay();
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
    <main className="relative min-h-screen text-white">
      {/* Wideo jako tło pełnoekranowe pod AppBar */}
      <section className="relative z-0 -mt-[64px] sm:-mt-[72px]">
        <video
          ref={heroVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/home/AP_ogolne_poster.webp"
          className="block w-full h-[calc(100svh+64px)] sm:h-[calc(100svh+72px)] object-cover pointer-events-none"
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
          disablePictureInPicture
          tabIndex={-1}
          onContextMenu={(e) => e.preventDefault()}
          onError={() => console.warn("[video] playback error — check file names/paths in /public")}
        >
          {/* Prefer WEBM, then fall back to MP4 */}
          <source src="/home/AP_ogolne.webm" type="video/webm" />
          <source src="/home/AP_ogolne.mp4" type="video/mp4" />
          {heroVideoFallback}
        </video>
        <div
          className={`absolute inset-0 z-[1000] flex items-center justify-center transition-opacity ${
            showGifHint
              ? 'opacity-100 duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
              : 'opacity-0 duration-[1200ms] ease-[cubic-bezier(0.7,0,0.84,0)]'
          } pointer-events-none`}
          aria-hidden={!showGifHint}
        >
          <div
            className={`pointer-events-none flex flex-col items-center transform transition-transform force-overlay ${
              showGifHint
                ? 'translate-y-0 scale-100 duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
                : 'translate-y-2 scale-95 duration-[900ms] ease-[cubic-bezier(0.7,0,0.84,0)]'
            }`}
          >
            <button
              type="button"
              aria-label={hintText}
              className={`h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/18 ring-1 ring-white/35 backdrop-blur flex items-center justify-center shadow-lg animate-bounce ${showGifHint ? 'pointer-events-auto' : 'pointer-events-none'}`}
              onClick={() => {
                document.getElementById('content-start')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="mt-3 text-base md:text-lg font-semibold text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {hintText}
            </div>
          </div>
        </div>

        {/* Soft bottom glow & fade under the video */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-36"
        >
          {/* smooth fade to black */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
          {/* subtle glow like footer aura */}
          <div className="absolute inset-x-0 bottom-0 h-full opacity-20 mix-blend-screen bg-[radial-gradient(80%_120%_at_50%_100%,rgba(255,255,255,0.35),rgba(0,0,0,0)_60%)]" />
          {/* subtle white separator, same as footer line */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <div className="h-px w-full max-w-4xl bg-white/10" />
          </div>
        </div>
      </section>

      {/* Content below the hero video */}
      <section id="content-start" className="relative z-10 mt-8 sm:mt-12 px-4 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
              {copy.heroTitle}
            </h2>
            <div className="mt-4 h-[1px] w-full max-w-md mx-auto bg-white/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              title={copy.attractions.title}
              className="md:col-span-2"
              titleCentered
              titleDivider
            >
              <p className="text-center text-gray-200 max-w-3xl mx-auto">
                {copy.attractions.intro}
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {copy.attractions.items.map((item) => (
                  <AttractionCard key={item.title} {...item} />
                ))}
              </div>
            </Card>

            <Card
              title={copy.events.title}
              className="md:col-span-2 text-center"
              titleCentered
              titleDivider
            >
              <p className="text-gray-200 text-lg">{copy.events.description}</p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {eventPhotos.map((photo) => (
                  <div
                    key={photo.src}
                    className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <PrimaryButton href={copy.events.href} size="lg">
                  {copy.events.cta}
                </PrimaryButton>
              </div>
            </Card>

            <Card
              title={copy.testimonials.title}
              className="md:col-span-2"
              titleCentered
              titleDivider
            >
              <p className="text-center text-gray-200">{copy.testimonials.subtitle}</p>
              <div className="mt-6">
                <Testimonials reviews={reviewsToShow} sourceUrl={GOOGLE_PLACE_URL} />
              </div>
            </Card>

            <Card title={copy.about.title} titleCentered titleDivider className="md:col-span-2">
              <p className="text-gray-300">{copy.about.description}</p>
              <div className="mt-6 flex justify-center">
                <PrimaryButton href={copy.about.href} size="lg">
                  {copy.about.cta}
                </PrimaryButton>
              </div>
            </Card>

            <Card
              title={copy.news.title}
              className="md:col-span-2 text-center"
              titleCentered
              titleDivider
            >
              <p className="text-gray-200 text-lg">{copy.news.description}</p>
              <div className="mt-6 space-y-4 text-left">
                {latestNews.map((item) => {
                  const categoryLabel = CATEGORY_LABELS[item.category]?.[loc] ?? item.category;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex flex-col gap-2"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
                          {formatDate(loc, item.date)}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full bg-gradient-to-r ${
                            CATEGORY_COLORS[item.category] || "from-gray-600 to-gray-400"
                          } px-3 py-1 font-semibold text-white shadow-[0_0_10px_rgba(0,0,0,0.3)] text-[12px]`}
                        >
                          {categoryLabel}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-200">{item.excerpt}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-center">
                <PrimaryButton href={copy.news.href} size="lg">
                  {copy.news.cta}
                </PrimaryButton>
              </div>
            </Card>

            <Card
              title={copy.galleryTitle}
              className="md:col-span-2 text-center"
              titleClassName="mb-2"
              titleCentered
              titleDivider
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
                {[
                  { src: "/galeria/Ogolne/webp/1.webp", alt: "Kopuły kompleksu – widok z góry" },
                  { src: "/galeria/Ogolne/webp/2.webp", alt: "Przeszklony łącznik" },
                  { src: "/galeria/Ogolne/webp/3.webp", alt: "Industrialne wnętrze kopuły" },
                  { src: "/galeria/Ogolne/webp/4.webp", alt: "Strefa eventowa w kopule" },
                ].map((img) => (
                  <div
                    key={img.src}
                    className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-lg bg-white/5 overflow-hidden"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <PrimaryButton href="/galeria" size="lg">
                  {copy.galleryCta}
                </PrimaryButton>
              </div>
            </Card>
          </div>
        </div>
      </section>

    </main>
  );
}
