"use client";

import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useI18n } from "@/app/i18n-provider";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import Testimonials, { type Testimonial } from "@/app/components/Testimonials";
import translationsData, { NEWS_META } from "@/app/aktualnosci/aktualnosci";
import { AttractionCard } from "@/app/components/AttractionCard";

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
  news: {
    title: string;
    description: string;
    cta: string;
    href: string;
  };
  galleryTitle: string;
  galleryCta: string;
};

const BOOKING_URL = "https://alverniaplanet.bookero.pl";

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
    news: {
      title: "News",
      description: "The three latest updates from Alvernia Planet.",
      cta: "See older posts",
      href: "/aktualnosci",
    },
    galleryTitle: "Gallery",
    galleryCta: "View full gallery",
  },
  pt: {
    heroTitle: "Bem-vindo à Alvernia Planet",
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
    news: {
      title: "Notícias",
      description: "As três atualizações mais recentes da Alvernia Planet.",
      cta: "Ver anteriores",
      href: "/aktualnosci",
    },
    galleryTitle: "Galeria",
    galleryCta: "Ver galeria completa",
  },
};

const GOOGLE_PLACE_URL =
  "https://www.google.com/maps/place/Alvernia+Planet/@50.1022663,19.5444717,637m/data=!3m1!1e3!4m8!3m7!1s0x4716f227b90ec1a1:0xbd1dbadc60237cc3!8m2!3d50.1022629!4d19.5470466!9m1!1b1!16s%2Fg%2F1yy3vkg22?hl=pl&entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D";
const CATEGORY_COLORS: Record<string, string> = {
  "ścieżka filmowa": "from-[#f77828] to-[#f03c64]",
  "kino 360": "from-[#4fcfde] to-[#a5e6f0]",
  ogólne: "from-[#171730] to-[#aab4be]",
};
const CATEGORY_LABELS: Record<string, { pl: string; en: string; pt: string }> = {
  "ścieżka filmowa": { pl: "Ścieżka filmowa", en: "Film path", pt: "Percurso cinematográfico" },
  "kino 360": { pl: "Kino 360", en: "360 cinema", pt: "Cinema 360" },
  ogólne: { pl: "Ogólne", en: "General", pt: "Geral" },
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
  const lang = locale === "pl" ? "pl-PL" : locale === "pt" ? "pt-PT" : "en-GB";
  return new Date(iso).toLocaleDateString(lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Page() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = HOME_COPY[loc];
  const heroVideoFallback =
    loc === "en"
      ? "Your browser does not support the video element."
      : loc === "pt"
      ? "O seu navegador não suporta o elemento de vídeo."
      : "Twój browser nie wspiera elementu video.";
  const latestNews = useMemo(() => getLatestNews(loc, 3), [loc]);
  const eventPhotos = [
    {
      src: "/galeria/Wydarzenia/webp/1.webp",
      alt:
        loc === "en"
          ? "Stage setup during an event"
          : loc === "pt"
          ? "Preparação de palco durante um evento"
          : "Scenografia sceny podczas wydarzenia",
    },
    {
      src: "/galeria/Wydarzenia/webp/4.webp",
      alt:
        loc === "en"
          ? "Guests networking in the dome"
          : loc === "pt"
          ? "Convidados a fazer networking na cúpula"
          : "Goście podczas networkingu w kopule",
    },
    {
      src: "/galeria/Wydarzenia/webp/5.webp",
      alt:
        loc === "en"
          ? "Live performance in the dome"
          : loc === "pt"
          ? "Atuação ao vivo na cúpula"
          : "Występ na żywo w kopule",
    },
  ];

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

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
      video.pause();
      video.currentTime = 0;
      video.load();
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
      {/* Wideo hero w "kwadracie" jak na pozostałych podstronach */}
      <section className="relative z-10 px-4 pt-10 sm:pt-12">
        <div className="mx-auto w-full max-w-[min(86vw,120rem)]">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="relative aspect-[16/9] bg-black">
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
                onError={() => console.warn("[video] playback error — check file names/paths in /public")}
                onEnded={(e) => {
                  const vid = e.currentTarget;
                  vid.pause();
                  vid.currentTime = 0;
                  vid.load();
                  const p = vid.play();
                  if (p && typeof p.catch === "function") p.catch(() => {});
                }}
                onPause={(e) => {
                  const vid = e.currentTarget;
                  if (vid.paused) {
                    const p = vid.play();
                    if (p && typeof p.catch === "function") p.catch(() => {});
                  }
                }}
                onTimeUpdate={(e) => {
                  const vid = e.currentTarget;
                  if (vid.duration && vid.currentTime >= vid.duration - 0.2) {
                    vid.currentTime = 0;
                    const p = vid.play();
                    if (p && typeof p.catch === "function") p.catch(() => {});
                  }
                }}
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
      <section id="content-start" className="relative z-10 mt-8 sm:mt-12 px-4 py-14">
        <div className="max-w-[min(86vw,120rem)] mx-auto">
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
              title={copy.tickets.title}
              className="md:col-span-2"
              titleCentered
              titleDivider
            >
              <p className="text-center text-gray-200 max-w-3xl mx-auto">
                {copy.tickets.intro}
              </p>
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {copy.tickets.options.map((option) => (
                  <div
                    key={option.title}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[rgba(79,207,222,0.35)] bg-white/5 text-white/90 ring-1 ring-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(79,207,222,0.25)]"
                  >
                    <div className="bg-gradient-to-r from-[#4fcfde] to-[#a5e6f0] px-6 py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-white/95">
                      {option.badge}
                    </div>
                    <div className="flex h-full flex-col p-6 sm:p-8 text-center">
                      <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                        {option.title}
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-white/75">
                        {option.subtitle}
                      </p>
                      <ul className="mt-6 space-y-3 text-sm text-white/70 text-left mx-auto max-w-sm">
                        {option.details.map((detail) => (
                          <li key={detail} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#4fcfde] shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-6">
                        <p className="text-[0.7rem] uppercase tracking-[0.25em] text-white/60">
                          {copy.tickets.priceLabel}
                        </p>
                        <p className="mt-2 text-3xl sm:text-4xl font-bold text-amber-200">
                          {copy.tickets.price}
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
                    className="group relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(79,207,222,0.18)] hover:ring-[rgba(79,207,222,0.35)]"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
                    className="group relative w-full aspect-[16/10] md:aspect-[16/9] rounded-lg bg-white/5 overflow-hidden ring-1 ring-white/10 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(79,207,222,0.18)] hover:ring-[rgba(79,207,222,0.35)]"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
