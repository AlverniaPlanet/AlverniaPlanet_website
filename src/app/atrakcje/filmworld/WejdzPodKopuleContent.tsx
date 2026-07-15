"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  FILM_PATH_BOOKING_CATEGORY,
  FILM_PATH_BOOKING_SERVICES,
} from "@/lib/booking";
import { PROMO_PACKAGES } from "@/lib/promoPackages";
import { AllAttractionsPromoCard } from "@/app/components/AllAttractionsPromoCard";
import { HeroMarquee } from "@/app/components/HeroMarquee";

// Wspólny styl „odcinka biletu" z perforacją po bokach (maska radialna).
const TICKET_STUB_STYLE: CSSProperties = {
  backgroundColor: "#0a0d18",
  border: "2px solid #4fcfde",
  boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 28px rgba(79,207,222,0.35)",
  WebkitMask:
    "radial-gradient(circle 14px at 0 66%, transparent 14px, #000 14.5px) left center / 100% 100% no-repeat, radial-gradient(circle 14px at 100% 66%, transparent 14px, #000 14.5px) right center / 100% 100% no-repeat",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

type Locale = "pl" | "en" | "pt";

type Scene = { num: string; label: string; title: string; place: string; body: string };

// Zdjęcia są wspólne dla wszystkich języków, tekst (alt) trzymamy krótki.
const SCENE_MEDIA: Record<string, { image: string; alt: string }> = {
  "01": { image: "/galeria/Sciezka_filmowa/webp/era_niema.webp", alt: "Korytarz historii filmu" },
  "02": { image: "/galeria/Sciezka_filmowa/webp/K7.webp", alt: "Studio postprodukcji dźwięku" },
  "03": { image: "/galeria/Sciezka_filmowa/webp/dzwieku.webp", alt: "Studio muzyki filmowej" },
  "04": { image: "/galeria/Sciezka_filmowa/webp/APKACZMAREK.webp", alt: "Pokój pamięci Jana A.P. Kaczmarka" },
  "05": { image: "/galeria/Sciezka_filmowa/webp/K10_ozdoby.webp", alt: "Kopuła z blue screenem" },
  "06": { image: "/galeria/Sciezka_filmowa/webp/slawy.webp", alt: "Galeria sław" },
};

// Hero = jedno duże zdjęcie na cały ekran, płynna zmiana (cross-fade) między
// dwoma kadrami kopuły. Kropki na dole pokazują, ile jest zdjęć.
const HERO_IMAGES = [
  "/galeria/Ogolne/webp/kopuly_1.webp",
  "/galeria/Ogolne/webp/6.webp",
];

type Copy = {
  heroKicker: string;
  heroTitle: string;
  heroTagline: string;
  heroStart: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  discoverBadge: string;
  heroScroll: string;

  infoBar: string[];

  discoverTitleLead: string;
  discoverTitleAccent: string;
  discoverLead: string;
  discoverBody: string;
  discoverHighlights: string[];

  lightTitle: string;
  lightMicro: string;

  mapTitle: string;
  mapIntro: string;

  scenes: Scene[];

  ticketsTitle: string;
  ticketsTagline: string;
  ticketBadge: string;
  ticketIncludes: string[];
  priceNormalLabel: string;
  priceNormalValue: string;
  priceReducedLabel: string;
  priceReducedValue: string;
  ticketCta: string;

  finalKicker: string;
  finalTitle: string;
  finalBody: string;
  finalCtaPrimary: string;
  finalCtaSecondary: string;
};

const COPY: Record<Locale, Copy> = {
  pl: {
    heroKicker: "Free Flow • Zwiedzanie bez przewodnika",
    heroTitle: "FILMWORLD",
    heroTagline: "Zwiedź tajemnicze kopuły i odkryj, co naprawdę kryją kulisy filmu i muzyki.",
    heroStart: "Start trasy",
    heroCtaPrimary: "Kup bilet",
    heroCtaSecondary: "Zobacz przebieg trasy",
    discoverBadge: "Poznaj",
    heroScroll: "Przewiń w dół",

    infoBar: ["30–60 minut", "Bez przewodnika", "Własne tempo"],

    discoverTitleLead: "Nie zwiedzasz.",
    discoverTitleAccent: "Odkrywasz.",
    discoverLead: "Sześć tematycznych przystanków o filmie, dźwięku i muzyce.",
    discoverBody:
      "Na trasie poznasz historię kina, kulisy dźwięku i muzyki filmowej, techniki efektów specjalnych z blue screenem oraz twórców związanych z obiektem, w tym Jana A.P. Kaczmarka, laureata Oscara. Zwiedzasz bez przewodnika, w 30–60 minut, we własnym tempie.",
    discoverHighlights: ["6 przystanków", "30–60 minut", "Bez przewodnika"],

    lightTitle: "Podążaj za niebieskim światłem",
    lightMicro: "Gdy zobaczysz niebieskie światło, idź dalej.",

    mapTitle: "Przebieg trasy",
    mapIntro: "Sześć przystanków na trasie. Zobacz, co czeka na Ciebie po drodze, i wybierz, gdzie zatrzymasz się dłużej.",

    scenes: [
      {
        num: "01",
        label: "Scena 01",
        title: "Tam, gdzie zaczyna się kino",
        place: "Korytarz Historii Filmu",
        body: "Przekrój przez historię kina: od pierwszych kamer i taśmy światłoczułej, przez erę niemą i analogową, po projekcję cyfrową. Zobaczysz, jak zmieniały się nośniki, technika zdjęć i sposób opowiadania obrazem.",
      },
      {
        num: "02",
        label: "Scena 02",
        title: "Usłysz obraz",
        place: "Studio Postprodukcji Dźwięku",
        body: "Z czego składa się filmowy dźwięk: dialogi, foley (efekty nagrywane ręcznie), tła i finalny miks. Zobaczysz sprzęt do nagrań i montażu oraz to, jak ta sama scena zmienia wymowę zależnie od warstwy dźwiękowej.",
      },
      {
        num: "03",
        label: "Scena 03",
        title: "Muzyka, która porusza ekran",
        place: "Studio Muzyki Filmowej",
        body: "Rola kompozytora i ścieżki dźwiękowej: jak motyw muzyczny prowadzi emocje, jak nagrywa się instrumenty i jak muzyka synchronizuje się z obrazem. Zobaczysz na przykładach, jak zmiana tematu potrafi odwrócić sens sceny.",
      },
      {
        num: "04",
        label: "Scena 04",
        title: "Oscarowa pamięć",
        place: "Pokój Pamięci Jana A.P. Kaczmarka",
        body: "Przestrzeń poświęcona Janowi A.P. Kaczmarkowi, polskiemu kompozytorowi, laureatowi Oscara za muzykę do filmu „Marzyciel” (2005). Poznasz jego drogę i najważniejsze produkcje, przy których pracował.",
      },
      {
        num: "05",
        label: "Scena 05",
        title: "Magia efektów specjalnych",
        place: "Kopuła z Blue Screenem",
        body: "Jak działa blue/green screen i kluczowanie: wycinanie jednolitego tła i wstawianie w jego miejsce dowolnej scenografii. Dowiesz się, czym różni się efekt praktyczny od cyfrowego i jak składa się kadr warstwa po warstwie.",
      },
      {
        num: "06",
        label: "Scena 06",
        title: "Ślady wielkich nazwisk",
        place: "Galeria Sław",
        body: "Postacie filmu i muzyki związane z obiektem: twórcy, którzy tu pracowali lub gościli, oraz produkcje powstałe w kompleksie. Zobaczysz, kto realnie tworzył w tych kopułach i jakie tytuły mają z nimi wspólną historię.",
      },
    ],

    ticketsTitle: "Bilety",
    ticketsTagline: "Jeden bilet. Sześć kopuł. Własne tempo.",
    ticketBadge: "Przepustka za kulisy",
    ticketIncludes: [
      "Zwiedzanie bez przewodnika, we własnym tempie",
      "Czas: 30–60 minut",
      "6 przystanków: film, dźwięk, muzyka, efekty",
      "Trasa: numery i niebieskie światło",
    ],
    priceNormalLabel: "Normalny",
    priceNormalValue: "79 zł/os.",
    priceReducedLabel: "Ulgowy",
    priceReducedValue: "69 zł/os.",
    ticketCta: "Kup bilet",

    finalKicker: "Koniec zapowiedzi",
    finalTitle: "Światło już prowadzi. Wejdź pod kopułę.",
    finalBody: "Reszta wydarzy się, gdy ruszysz w trasę. Twoja scena czeka. Wystarczy pierwszy krok.",
    finalCtaPrimary: "Kup bilet",
    finalCtaSecondary: "Jak dojechać",
  },

  en: {
    heroKicker: "Free Flow • Self-guided visit",
    heroTitle: "FILMWORLD",
    heroTagline: "Explore the mysterious domes and discover the secrets behind film and music.",
    heroStart: "Start the route",
    heroCtaPrimary: "Buy ticket",
    heroCtaSecondary: "See the route",
    discoverBadge: "Discover",
    heroScroll: "Scroll down",

    infoBar: ["30–60 minutes", "No guide", "Your own pace"],

    discoverTitleLead: "You don't tour.",
    discoverTitleAccent: "You discover.",
    discoverLead: "Six themed stops on film, sound and music.",
    discoverBody:
      "You enter when you like and stay where you really want to. The route is marked by numbers and a trail of blue light, from the first dome to the finale. 30 to 60 minutes just for you and your people.",
    discoverHighlights: ["6 stops", "30–60 minutes", "No guide"],

    lightTitle: "Follow the blue light",
    lightMicro: "When you see the blue light, keep going.",

    mapTitle: "The route",
    mapIntro: "Six stops on the route. See what's waiting along the way and choose where to linger.",

    scenes: [
      { num: "01", label: "Scene 01", title: "Where cinema begins", place: "Corridor of Film History", body: "A cross-section of film history: from the first cameras and photographic film, through the silent and analog eras, to digital projection. See how formats, shooting technology and visual storytelling changed." },
      { num: "02", label: "Scene 02", title: "Hear the picture", place: "Sound Post-Production Studio", body: "What film sound is made of: dialogue, foley (effects recorded by hand), ambience and the final mix. See the recording and editing gear, and how the same scene changes meaning depending on its sound layer." },
      { num: "03", label: "Scene 03", title: "Music that moves the screen", place: "Film Music Studio", body: "The role of the composer and the score: how a musical theme drives emotion, how instruments are recorded, and how music syncs to the picture. Examples show how changing a theme can flip a scene's meaning." },
      { num: "04", label: "Scene 04", title: "An Oscar-winning memory", place: "Jan A.P. Kaczmarek Room", body: "A space devoted to Jan A.P. Kaczmarek, the Polish composer who won an Oscar for the score to “Finding Neverland” (2005). Learn his path and the key productions he worked on." },
      { num: "05", label: "Scene 05", title: "The magic of special effects", place: "Blue Screen Dome", body: "How blue/green screen and keying work: cutting out a uniform background and replacing it with any set. Learn the difference between practical and digital effects and how a shot is built layer by layer." },
      { num: "06", label: "Scene 06", title: "Traces of great names", place: "Hall of Fame", body: "Film and music figures connected to the venue: creators who worked or were hosted here, and productions made in the complex. See who actually created in these domes and which titles share their story." },
    ],

    ticketsTitle: "Tickets",
    ticketsTagline: "One ticket. Six domes. Your own pace.",
    ticketBadge: "Backstage pass",
    ticketIncludes: [
      "Self-guided visit, at your own pace",
      "Duration: 30–60 minutes",
      "6 stops: film, sound, music, effects",
      "Route: numbers and blue light",
    ],
    priceNormalLabel: "Standard",
    priceNormalValue: "79 PLN/person",
    priceReducedLabel: "Reduced",
    priceReducedValue: "69 PLN/person",
    ticketCta: "Buy ticket",

    finalKicker: "End of the trailer",
    finalTitle: "The light is already leading. Step under the dome.",
    finalBody: "The rest happens once you set off. Your scene is waiting. All it takes is the first step.",
    finalCtaPrimary: "Buy ticket",
    finalCtaSecondary: "Getting here",
  },

  pt: {
    heroKicker: "Free Flow • Visita sem guia",
    heroTitle: "FILMWORLD",
    heroTagline: "Explora as cúpulas misteriosas e descobre os segredos do cinema e da música.",
    heroStart: "Iniciar o percurso",
    heroCtaPrimary: "Comprar bilhete",
    heroCtaSecondary: "Ver o percurso",
    discoverBadge: "Descobre",
    heroScroll: "Desliza para baixo",

    infoBar: ["30–60 minutos", "Sem guia", "Ao teu ritmo"],

    discoverTitleLead: "Não visitas.",
    discoverTitleAccent: "Descobres.",
    discoverLead: "Seis paragens temáticas sobre cinema, som e música.",
    discoverBody:
      "No percurso vais conhecer a história do cinema, os bastidores do som e da música de cinema, técnicas de efeitos especiais com blue screen e criadores ligados ao espaço, incluindo Jan A.P. Kaczmarek, vencedor de um Óscar. Sem guia, em 30–60 minutos, ao teu ritmo.",
    discoverHighlights: ["6 paragens", "30–60 minutos", "Sem guia"],

    lightTitle: "Segue a luz azul",
    lightMicro: "Quando vires a luz azul, continua.",

    mapTitle: "O percurso",
    mapIntro: "Seis paragens no percurso. Vê o que te espera pelo caminho e escolhe onde ficar mais tempo.",

    scenes: [
      { num: "01", label: "Cena 01", title: "Onde nasce o cinema", place: "Corredor da História do Cinema", body: "Um corte transversal pela história do cinema: das primeiras câmaras e da película fotográfica, pela era muda e analógica, até à projeção digital. Vê como mudaram os suportes, a técnica de filmagem e a forma de contar com imagem." },
      { num: "02", label: "Cena 02", title: "Ouve a imagem", place: "Estúdio de Pós-Produção de Som", body: "De que é feito o som de cinema: diálogos, foley (efeitos gravados à mão), ambientes e a mistura final. Vês o equipamento de gravação e montagem e como a mesma cena muda de sentido conforme a camada sonora." },
      { num: "03", label: "Cena 03", title: "Música que move o ecrã", place: "Estúdio de Música de Cinema", body: "O papel do compositor e da banda sonora: como um tema musical conduz a emoção, como se gravam instrumentos e como a música sincroniza com a imagem. Exemplos mostram como mudar um tema pode inverter o sentido de uma cena." },
      { num: "04", label: "Cena 04", title: "Memória com um Óscar", place: "Sala Jan A.P. Kaczmarek", body: "Um espaço dedicado a Jan A.P. Kaczmarek, o compositor polaco que ganhou um Óscar pela banda sonora de “À Procura da Terra do Nunca” (2005). Conhece o seu percurso e as principais produções em que trabalhou." },
      { num: "05", label: "Cena 05", title: "A magia dos efeitos especiais", place: "Cúpula com Blue Screen", body: "Como funciona o blue/green screen e o keying: recortar um fundo uniforme e substituí-lo por qualquer cenário. Descobre a diferença entre efeitos práticos e digitais e como se compõe um plano camada a camada." },
      { num: "06", label: "Cena 06", title: "Rastos de grandes nomes", place: "Galeria da Fama", body: "Figuras do cinema e da música ligadas ao espaço: criadores que aqui trabalharam ou passaram, e produções feitas no complexo. Vês quem realmente criou nestas cúpulas e que títulos partilham a sua história." },
    ],

    ticketsTitle: "Bilhetes",
    ticketsTagline: "Um bilhete. Seis cúpulas. Ao teu ritmo.",
    ticketBadge: "Passe de bastidores",
    ticketIncludes: [
      "Visita sem guia, ao teu ritmo",
      "Duração: 30–60 minutos",
      "6 paragens: cinema, som, música, efeitos",
      "Percurso: números e luz azul",
    ],
    priceNormalLabel: "Normal",
    priceNormalValue: "79 PLN/pessoa",
    priceReducedLabel: "Reduzido",
    priceReducedValue: "69 PLN/pessoa",
    ticketCta: "Comprar bilhete",

    finalKicker: "Fim do trailer",
    finalTitle: "A luz já te guia. Entra na cúpula.",
    finalBody: "O resto acontece quando avanças. A tua cena espera. Basta o primeiro passo.",
    finalCtaPrimary: "Comprar bilhete",
    finalCtaSecondary: "Como chegar",
  },
};

function BlueDivider() {
  return (
    <div className="relative mx-auto h-px w-full max-w-5xl" aria-hidden="true">
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-[#4fcfde]/60 to-transparent"
        style={{ boxShadow: "0 0 16px rgba(79,207,222,0.45)" }}
      />
    </div>
  );
}

export default function WejdzPodKopuleContent() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];

  // Hero slideshow: jedno zdjęcie naraz, cross-fade między dwoma kadrami.
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.classList.add("film-path-route-active");
    return () => {
      document.body.classList.remove("film-path-route-active");
    };
  }, []);

  // Scroll-reveal: elementy z klasą .wpk-reveal pojawiają się przy wjeżdżaniu w kadr.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".wpk-reveal"));
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loc]);

  const bookingHref = buildBookingPath(loc, {
    category: FILM_PATH_BOOKING_CATEGORY,
    service: FILM_PATH_BOOKING_SERVICES.normal,
  });

  const promo = PROMO_PACKAGES[loc][0];

  const routeMapRef = useRef<HTMLDivElement | null>(null);
  const scrollRouteMap = (dir: number) => {
    const el = routeMapRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.7, 180), behavior: "smooth" });
  };

  return (
    <main className="film-path-page relative z-10 min-h-screen overflow-x-clip">
      {/* ===== HERO: wejście do doświadczenia (pełny ekran, pod navbar) ===== */}
      <section className="relative -mt-[84px] min-h-[100svh] w-full sm:-mt-[96px]">
        {HERO_IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Wnętrze kopuły Alvernia Planet w niebieskiej poświacie"
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1400ms] ease-in-out ${
              i === heroIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,17,0.6)_0%,rgba(5,8,17,0.32)_42%,rgba(5,8,17,0.94)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(79,207,222,0.34),transparent_55%)]" />

        <div className="ap-page-intro-stagger relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-end px-4 pb-28 pt-24 text-center sm:pb-[11rem] lg:pb-[15rem]">
          <span className="mb-5 inline-flex items-center rounded-full bg-[linear-gradient(135deg,#1ea6b7,#4fcfde,#7ef6ff)] px-4 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#062a33] shadow-[0_6px_18px_rgba(79,207,222,0.45),0_0_16px_rgba(79,207,222,0.4)] ring-1 ring-white/25 sm:px-5 sm:py-2 sm:text-[0.8rem] sm:tracking-[0.24em]">
            {t.discoverBadge}
          </span>
          <h1 className="ap-type-hero-title force-overlay mt-3 drop-shadow-[0_0_30px_rgba(0,0,0,0.65)] [text-shadow:0_3px_16px_rgba(0,0,0,0.55)] lg:!text-[clamp(3.5rem,2rem+3vw,5.2rem)]">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] sm:text-lg lg:max-w-none lg:whitespace-nowrap lg:text-[1.3rem]">
            {t.heroTagline}
          </p>

          <div className="mt-5 flex w-full flex-row flex-wrap items-center justify-center gap-2 sm:mt-9 sm:gap-3">
            <PrimaryButton
              href={bookingHref}
              size="lg"
              className="ticket-pill whitespace-nowrap !px-5 !py-1.5 !text-xs !bg-[linear-gradient(135deg,#1ea6b7,#4fcfde,#7ef6ff)] !font-extrabold ring-[color:rgba(79,207,222,0.6)] hover:!brightness-110 sm:!px-6 sm:!py-2.5 sm:!text-base sm:min-w-[12rem]"
            >
              {t.heroCtaPrimary}
            </PrimaryButton>
            <a
              href="#trasa"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:border-[#7ef6ff]/60 hover:bg-white/12 sm:gap-2 sm:px-6 sm:py-2.5 sm:text-sm"
            >
              {t.heroCtaSecondary}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        {/* Kropki slideshow, pokazują liczbę zdjęć i aktywne (klikalne) */}
        <div className="absolute inset-x-0 bottom-[4.75rem] z-20 flex justify-center gap-2.5 sm:bottom-[5.75rem]">
          {HERO_IMAGES.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setHeroIndex(i)}
              aria-label={`Pokaż zdjęcie ${i + 1}`}
              aria-current={i === heroIndex}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === heroIndex
                  ? "w-7 bg-[#4fcfde] shadow-[0_0_12px_rgba(79,207,222,0.75)]"
                  : "w-2 bg-white/45 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Fakty (nad) + przewijany ticker (pod), przyklejone do dołu hero */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="ap-shell flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-3 py-1.5 text-center sm:gap-x-9 sm:py-2">
              {t.infoBar.map((item, index) => (
                <span key={item} className="flex items-center gap-3 sm:gap-5">
                  {index > 0 && <span className="hidden h-1 w-1 rounded-full bg-[#4fcfde]/70 sm:inline-block" aria-hidden="true" />}
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/85 sm:text-sm sm:tracking-[0.16em]">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <HeroMarquee verb="POZNAJ" word="FILM" accent="#4fcfde" />
        </div>
      </section>

      <div className="space-y-16 px-5 py-14 sm:space-y-24 sm:px-6 sm:py-20 lg:px-12">
        {/* ===== NIE ZWIEDZASZ. ODKRYWASZ. ===== */}
        <ScrollMotionItem strength="soft" delay={40} float={false} className="wpk-reveal">
          <section className="ap-shell grid items-center gap-8 text-center lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:text-left">
            <h2 className="text-[clamp(1.85rem,5vw,4rem)] font-black leading-[1.0] tracking-[-0.04em] text-white">
              <span className="block whitespace-nowrap">{t.discoverTitleLead}</span>
              <span className="block whitespace-nowrap text-[1.3em] leading-[0.95] bg-[linear-gradient(120deg,#4fcfde,#7ef6ff)] bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text" }}>
                {t.discoverTitleAccent}
              </span>
            </h2>
            <div className="space-y-5">
              <p className="text-lg font-semibold text-white sm:text-xl">{t.discoverLead}</p>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-white/72 sm:text-lg lg:mx-0">{t.discoverBody}</p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-1 lg:justify-start">
                {t.discoverHighlights.map((h) => (
                  <span key={h} className="inline-flex items-center gap-2 text-sm font-semibold text-[#9ff0fb] sm:text-base">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4fcfde] shadow-[0_0_10px_rgba(79,207,222,0.7)]" />
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </ScrollMotionItem>

        {/* ===== PRZEBIEG TRASY: w kafelku z poświatą (dawniej „Podążaj za światłem") ===== */}
        <section id="trasa" className="wpk-reveal relative overflow-hidden scroll-mt-24">
          <div className="ap-shell relative rounded-[2rem] border border-[#4fcfde]/25 bg-[radial-gradient(circle_at_50%_-20%,rgba(79,207,222,0.22),transparent_60%),linear-gradient(140deg,rgba(18,22,44,0.9),rgba(9,11,24,0.95))] px-5 py-10 sm:px-8 sm:py-14">
            <div className="relative text-center">
              <h2 className="text-pretty text-[clamp(1.9rem,6vw,3.8rem)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
                {t.mapTitle}
              </h2>
              <div className="mx-auto mt-4 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#4fcfde] to-[#7ef6ff]" />
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{t.mapIntro}</p>
            </div>

          <div ref={routeMapRef} className="mt-8 overflow-x-auto px-2 py-6" style={{ scrollbarWidth: "none" }}>
            <div className="relative mx-auto min-w-max px-2">
              <span
                aria-hidden="true"
                className="absolute left-6 right-6 top-7 h-px bg-gradient-to-r from-[#4fcfde]/15 via-[#4fcfde]/70 to-[#4fcfde]/15"
                style={{ boxShadow: "0 0 16px rgba(79,207,222,0.5)" }}
              />
              <ol className="relative flex items-start gap-1">
                {t.scenes.map((s) => (
                  <li key={s.num} className="flex w-[8.5rem] flex-col items-center text-center sm:w-[11rem]">
                    <a
                      href={`#scene-${s.num}`}
                      aria-label={`${s.label}: ${s.place}`}
                      className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#7ef6ff]/45 bg-[#06121a] text-lg font-bold text-[#7ef6ff] shadow-[0_0_22px_rgba(126,246,255,0.35)] transition hover:scale-105 hover:border-[#7ef6ff] hover:shadow-[0_0_30px_rgba(126,246,255,0.6)]"
                    >
                      {s.num}
                    </a>
                    <span className="mt-3 px-1 text-[0.72rem] font-medium leading-tight text-white/72 sm:text-xs">{s.place}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Strzałki przewijania, tylko mobile */}
          <div className="mt-1 flex items-center justify-center gap-5 sm:hidden">
            <button
              type="button"
              onClick={() => scrollRouteMap(-1)}
              aria-label="Przewiń trasę w lewo"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#7ef6ff]/35 bg-white/[0.05] text-[#7ef6ff] backdrop-blur-sm transition active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/45">Przesuń</span>
            <button
              type="button"
              onClick={() => scrollRouteMap(1)}
              aria-label="Przewiń trasę w prawo"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#7ef6ff]/35 bg-white/[0.05] text-[#7ef6ff] backdrop-blur-sm transition active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          </div>
        </section>

        {/* ===== SCENY (split-screen, na zmianę) ===== */}
        <div className="ap-shell space-y-14 sm:space-y-20">
          {t.scenes.map((s, index) => {
            const media = SCENE_MEDIA[s.num];
            const imageRight = index % 2 === 1;
            return (
              <ScrollMotionItem key={s.num} strength="soft" delay={30} float={false} className="wpk-reveal">
                <section id={`scene-${s.num}`} className="scroll-mt-24">
                  <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                    {/* obraz sceny */}
                    <div className={`relative ${imageRight ? "lg:order-2" : ""}`}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] ring-1 ring-[#4fcfde]/30 shadow-[0_26px_70px_rgba(0,0,0,0.55),0_0_34px_rgba(79,207,222,0.22)]">
                        <Image
                          src={media.image}
                          alt={media.alt}
                          fill
                          sizes="(min-width: 1024px) 540px, 100vw"
                          className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/25" />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_120%,rgba(79,207,222,0.35),transparent_45%)]" />
                        <span className="absolute left-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#7ef6ff]/50 bg-black/55 text-base font-bold text-[#7ef6ff] shadow-[0_0_20px_rgba(126,246,255,0.45)] backdrop-blur-sm">
                          {s.num}
                        </span>
                      </div>
                    </div>

                    {/* treść sceny */}
                    <div className={`relative ${imageRight ? "lg:order-1" : ""}`}>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-12 left-0 select-none text-[6.5rem] font-black leading-none text-white/[0.05] sm:text-[9rem] lg:-top-16 lg:text-[11rem]"
                      >
                        {s.num}
                      </span>
                      <div className="relative">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#7ef6ff]/80 sm:text-xs">{s.label}</p>
                        <h3 className="mt-3 text-pretty text-[clamp(1.6rem,4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-white/45 sm:text-[0.95rem]">{s.place}</p>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/74 sm:text-lg">{s.body}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </ScrollMotionItem>
            );
          })}
        </div>

        <BlueDivider />

        {/* ===== BILETY: przepustka za kulisy ===== */}
        <section className="wpk-reveal ap-shell">
          <div className="text-center">
            <h2 className="text-pretty text-[clamp(1.9rem,6vw,3.8rem)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
              {t.ticketsTitle}
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#4fcfde] to-[#7ef6ff]" />
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/72 sm:text-lg">{t.ticketsTagline}</p>
          </div>

          <div className="mx-auto mt-9 flex max-w-5xl flex-col gap-6">
            {/* Bilet „Wejdź pod kopułę", na górze */}
            <div className="relative w-full overflow-hidden rounded-[1.75rem]" style={TICKET_STUB_STYLE}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,207,222,0.2),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(79,207,222,0.12),transparent_38%)]" />
              <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                <div className="space-y-4 text-center lg:text-left">
                  <span className="ticket-card-badge mx-auto lg:mx-0 !text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]">
                    {t.ticketBadge}
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">{t.heroTitle}</h3>
                  <ul className="mx-auto max-w-md space-y-2 text-left lg:mx-0">
                    {t.ticketIncludes.map((inc) => (
                      <li key={inc} className="flex gap-2.5 text-sm text-white/78 sm:text-base">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4fcfde] shadow-[0_0_10px_rgba(79,207,222,0.6)]" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="h-px w-full lg:hidden"
                  style={{ backgroundImage: "repeating-linear-gradient(to right, rgba(255,255,255,0.3) 0 6px, transparent 6px 12px)" }}
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute bottom-8 top-8 hidden lg:block"
                  style={{
                    left: "calc(100% - 18.5rem)",
                    width: "1px",
                    backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.28) 0 6px, transparent 6px 12px)",
                  }}
                  aria-hidden="true"
                />

                <div className="flex w-full flex-col items-center gap-4 lg:w-[15.5rem]">
                  <div className="grid w-full grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-[0.58rem] uppercase tracking-[0.16em] text-white/55">{t.priceNormalLabel}</p>
                      <p className="mt-1 text-lg font-extrabold leading-tight text-white sm:text-xl">{t.priceNormalValue}</p>
                    </div>
                    <div className="border-l border-white/10 pl-3 text-center">
                      <p className="text-[0.58rem] uppercase tracking-[0.16em] text-white/55">{t.priceReducedLabel}</p>
                      <p className="mt-1 text-lg font-extrabold leading-tight text-[#9ff0fb] sm:text-xl">{t.priceReducedValue}</p>
                    </div>
                  </div>
                  <PrimaryButton
                    href={bookingHref}
                    size="lg"
                    className="ticket-pill w-full whitespace-nowrap !bg-[linear-gradient(135deg,#1ea6b7,#4fcfde,#7ef6ff)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] ring-[color:rgba(79,207,222,0.6)] hover:!brightness-110"
                  >
                    {t.ticketCta}
                  </PrimaryButton>
                </div>
              </div>
            </div>

            {/* Bilet na wszystkie atrakcje, wspólny komponent (1:1 jak na home), pod spodem */}
            <AllAttractionsPromoCard promo={promo} locale={loc} />
          </div>
        </section>
      </div>
    </main>
  );
}
