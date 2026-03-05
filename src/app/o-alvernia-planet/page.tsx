"use client";

import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Locale = "pl" | "en" | "pt";

const COPY: Record<
  Locale,
  {
    tag: string;
    heroTitle: string;
    heroSubtitle: string;
    intro: string;
    galleryCta: string;
    bullets: { title: string; body: string; image: string; alt: string }[];
    metrics: { value: string; label: string }[];
    highlightTitle: string;
    highlightSubtitle: string;
    highlightSections: { title: string; summary: string; points: string[]; tag: string }[];
  }
> = {
  pl: {
    tag: "O nas",
    heroTitle: "O Alvernia Planet",
    heroSubtitle: "Unikalny w skali świata kompleks kopuł filmowych i centrum wydarzeń.",
    intro:
      "Alvernia Planet łączy świat filmu, technologii i edukacji. Nasze kopuły goszczą eventy, produkcje filmowe i immersyjne atrakcje dla odwiedzających.",
    galleryCta: "Przejdź do galerii",
    bullets: [
      {
        title: "Architektura industrialna",
        body: "Stalowe mosty, antresole, futurystyczne wnętrza i szklane łączniki między kopułami.",
        image: "/galeria/Sciezka_filmowa/webp/7.webp",
        alt: "Industrialne wnętrze kopuły z metalowymi konstrukcjami",
      },
      {
        title: "Lokalizacja",
        body: "Otoczona terenami zielonymi, z wygodnym dojazdem i parkingiem.",
        image: "/galeria/Ogolne/webp/8.webp",
        alt: "Widok kompleksu Alvernia Planet z drona",
      },
    ],
    metrics: [
      { value: "13", label: "kopuł gotowych na eventy, produkcje i scenografie" },
      { value: "17 425 m²", label: "powierzchni zabudowy" },
      { value: "300+", label: "miejsc parkingowych" },
    ],
    highlightTitle: "Wyjątkowe miejsce w środku Europy",
    highlightSubtitle:
      "Skala obiektu, infrastruktura i otoczenie tworzą przestrzeń gotową na duże wydarzenia i codziennych gości.",
    highlightSections: [
      {
        tag: "Dojazd",
        title: "Lokalizacja i dojazd",
        summary: "Tuż przy A4 między Krakowem a Katowicami.",
        points: [
          "Nieporaz, ul. Ferdynanda Wspaniałego 1",
          "30 km od Krakowa, 10 km od lotniska Balice",
        ],
      },
      {
        tag: "Eventy",
        title: "Wydarzenia immersyjne",
        summary: "Scena dla prestiżowych wydarzeń i produkcji.",
        points: [
          "Wystawy, premiery, gale, koncerty, pokazy mody",
          "Możliwości pełnej immersji i multimediów",
        ],
      },
      {
        tag: "Architektura",
        title: "Architektura i funkcje",
        summary: "Futurystyczne kopuły i szklane pasaże.",
        points: [
          "Rozrywka, edukacja, ekspozycje i multimedia",
          "Rozpoznawalny styl architektoniczny",
        ],
      },
      {
        tag: "Skala",
        title: "Skala i infrastruktura",
        summary: "Duży teren i zaplecze dla gości.",
        points: [
          "17 425 m² zabudowy i 14,21 ha terenu",
          "Parking 300+ miejsc z opcją rozbudowy",
        ],
      },
      {
        tag: "Edukacja",
        title: "Edukacja i film",
        summary: "Autorska ścieżka edukacyjna od 2023.",
        points: [
          "Proces powstawania filmu i scenografii",
          "Iluzja obrazu, dźwięk i narracja",
        ],
      },
      {
        tag: "Okolica",
        title: "Okolica i atrakcje",
        summary: "Idealne na całodniową wycieczkę.",
        points: [
          "Zamek Tenczyn i Muzeum Agatów w Rudnie",
          "Muzeum Pożarnictwa w Alwerni",
          "Teńczyński Park Krajobrazowy",
        ],
      },
    ],
  },
  en: {
    tag: "About us",
    heroTitle: "About Alvernia Planet",
    heroSubtitle: "A unique dome complex for film, events, and immersive experiences.",
    intro:
      "Alvernia Planet blends film, technology, and education. Our domes host events, film productions, and immersive attractions for visitors.",
    galleryCta: "Go to gallery",
    bullets: [
      {
        title: "Industrial architecture",
        body: "Steel bridges, mezzanines, futuristic interiors, and glass connectors between domes.",
        image: "/galeria/Sciezka_filmowa/webp/7.webp",
        alt: "Industrial-style interior with steel structures inside a dome",
      },
      {
        title: "Location",
        body: "Surrounded by greenery, with convenient road access and parking.",
        image: "/galeria/Ogolne/webp/8.webp",
        alt: "Aerial drone view of the Alvernia Planet complex",
      },
    ],
    metrics: [
      { value: "13", label: "domes ready for events, productions, and scenography" },
      { value: "17,425 m²", label: "built-up area" },
      { value: "300+", label: "parking spaces" },
    ],
    highlightTitle: "A unique place in the heart of Europe",
    highlightSubtitle:
      "Scale, infrastructure, and surroundings make this venue ready for both large productions and everyday visitors.",
    highlightSections: [
      {
        tag: "Access",
        title: "Location and access",
        summary: "Right by the A4 between Krakow and Katowice.",
        points: [
          "Nieporaz, Ferdynanda Wspaniałego 1",
          "30 km from Krakow, 10 km from Krakow Airport",
        ],
      },
      {
        tag: "Events",
        title: "Immersive events",
        summary: "A stage for premium events and productions.",
        points: [
          "Exhibitions, premieres, galas, concerts, fashion shows",
          "Immersive and multimedia-ready setups",
        ],
      },
      {
        tag: "Architecture",
        title: "Architecture and functions",
        summary: "Futuristic domes with glass corridors.",
        points: [
          "Entertainment, education, exhibitions, multimedia",
          "A distinctive architectural signature",
        ],
      },
      {
        tag: "Scale",
        title: "Scale and infrastructure",
        summary: "Large footprint and guest facilities.",
        points: [
          "17,425 m² built area and 14.21 ha site",
          "Parking for 300+ cars, expandable",
        ],
      },
      {
        tag: "Education",
        title: "Education and film",
        summary: "In-house educational path since 2023.",
        points: [
          "How films are made and scenography",
          "Image & sound illusion, audiovisual storytelling",
        ],
      },
      {
        tag: "Nearby",
        title: "Nearby attractions",
        summary: "Great for a full-day visit.",
        points: [
          "Tenczyn Castle and the Agate Museum in Rudno",
          "Małopolska Museum of Firefighting in Alwernia",
          "Tenczyn Landscape Park for a post-visit walk",
        ],
      },
    ],
  },
  pt: {
    tag: "Sobre nós",
    heroTitle: "Sobre a Alvernia Planet",
    heroSubtitle: "Um complexo único de cúpulas e um centro de eventos.",
    intro:
      "A Alvernia Planet combina cinema, tecnologia e educação. As nossas cúpulas recebem eventos, produções e atrações imersivas para visitantes.",
    galleryCta: "Ir para a galeria",
    bullets: [
      {
        title: "Arquitetura industrial",
        body: "Com pontes metálicas, mezaninos, interiores futuristas e ligações envidraçadas entre cúpulas.",
        image: "/galeria/Sciezka_filmowa/webp/7.webp",
        alt: "Interior industrial da cúpula com estruturas metálicas",
      },
      {
        title: "Localização",
        body: "Rodeada de áreas verdes, com acesso fácil e estacionamento.",
        image: "/galeria/Ogolne/webp/8.webp",
        alt: "Vista aérea por drone do complexo da Alvernia Planet",
      },
    ],
    metrics: [
      { value: "13", label: "cúpulas prontas para eventos, produções e cenografia" },
      { value: "17 425 m²", label: "de área construída" },
      { value: "300+", label: "lugares de estacionamento" },
    ],
    highlightTitle: "Um lugar único no coração da Europa",
    highlightSubtitle:
      "A escala do complexo, a infraestrutura e os arredores criam um espaço pronto para grandes eventos e visitas diárias.",
    highlightSections: [
      {
        tag: "Acesso",
        title: "Localização e acesso",
        summary: "Junto à A4 entre Cracóvia e Katowice.",
        points: [
          "Nieporaz, Ferdynanda Wspaniałego 1",
          "30 km de Cracóvia, 10 km do aeroporto",
        ],
      },
      {
        tag: "Eventos",
        title: "Eventos imersivos",
        summary: "Palco para eventos e produções de prestígio.",
        points: [
          "Exposições, estreias, galas, concertos, desfiles",
          "Configurações imersivas e multimédia",
        ],
      },
      {
        tag: "Arquitetura",
        title: "Arquitetura e funções",
        summary: "Cúpulas futuristas e corredores envidraçados.",
        points: [
          "Entretenimento, educação, exposições, multimédia",
          "Assinatura arquitetónica marcante",
        ],
      },
      {
        tag: "Escala",
        title: "Escala e infraestrutura",
        summary: "Grande área e apoio ao visitante.",
        points: [
          "17 425 m² construídos e 14,21 ha",
          "Estacionamento para 300+ carros, com expansão",
        ],
      },
      {
        tag: "Educação",
        title: "Educação e cinema",
        summary: "Percurso educativo próprio desde 2023.",
        points: [
          "Como o cinema é feito e a cenografia",
          "Ilusão de imagem e som, narrativa audiovisual",
        ],
      },
      {
        tag: "Arredores",
        title: "Arredores e atrações",
        summary: "Perfeito para uma visita de dia inteiro.",
        points: [
          "Castelo de Tenczyn e Museu das Ágatas em Rudno",
          "Museu de Bombeiros da Pequena Polónia em Alwernia",
          "Parque Paisagístico de Tenczyn para passeios",
        ],
      },
    ],
  },
};

function AnimatedMetricValue({
  value,
  locale,
  className,
}: {
  value: string;
  locale: Locale;
  className?: string;
}) {
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  const parsed = useMemo(() => {
    const digits = value.replace(/[^\d]/g, "");
    const target = Number(digits || "0");
    const suffix = value.replace(/^[\d\s,\.]+/, "");
    return { target, suffix };
  }, [value]);

  const numberLocale = locale === "pl" ? "pl-PL" : locale === "pt" ? "pt-PT" : "en-US";

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || parsed.target <= 0) return;
    let frame = 0;
    const duration = 3200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(parsed.target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, parsed.target]);

  const formatted = `${new Intl.NumberFormat(numberLocale).format(current)}${parsed.suffix}`;

  return (
    <span ref={valueRef} className={className}>
      {formatted}
    </span>
  );
}

export default function AboutAlverniaPage() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = COPY[loc];
  const metricTones = [
    "from-[#4fcfde]/20 via-[#4fcfde]/6 to-transparent",
    "from-[#f77828]/22 via-[#f77828]/6 to-transparent",
    "from-[#f03c64]/20 via-[#f03c64]/6 to-transparent",
  ];

  return (
    <main className="relative min-h-screen text-white px-4 py-12 sm:py-16 ap-page-intro-stagger">
      <div className="ap-shell ap-page-stack">
        <header className="text-center space-y-5">
          <p className="ap-type-kicker">{copy.tag}</p>
          <h1 className="ap-type-hero-title">{copy.heroTitle}</h1>
          <p className="ap-type-hero-subtitle max-w-5xl mx-auto">
            {copy.heroSubtitle} {copy.intro}
          </p>
          <div className="h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </header>

        <Card variant="glass" className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-16 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,207,222,0.28)_0%,rgba(79,207,222,0.06)_45%,rgba(79,207,222,0)_72%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(240,60,100,0.2)_0%,rgba(240,60,100,0.06)_38%,rgba(240,60,100,0)_72%)]"
            aria-hidden
          />
          <div className="relative grid gap-7 lg:grid-cols-[1.35fr_0.9fr] lg:gap-10">
            <div className="h-full">
              <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-2">
                {copy.bullets.map((item) => (
                  <div
                    key={item.title}
                    className="ap-tile h-full rounded-2xl bg-white/5 p-2.5 sm:p-3 ring-1 ring-white/10"
                  >
                    <div className="relative h-36 w-full overflow-hidden rounded-xl ring-1 ring-white/15 sm:h-40 lg:h-44">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="mt-3 space-y-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {copy.metrics.map((metric, index) => (
                <article
                  key={metric.value + metric.label}
                  className="ap-tile relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-4"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metricTones[index % metricTones.length]} opacity-90`}
                    aria-hidden
                  />
                  <div className="relative">
                    <p className="text-2xl sm:text-3xl font-black leading-none text-white">
                      <AnimatedMetricValue
                        value={metric.value}
                        locale={loc}
                        className="tabular-nums"
                      />
                    </p>
                    <p className="mt-2 text-sm text-white/75">{metric.label}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="relative mt-8 flex justify-center">
            <PrimaryButton href="/galeria" size="lg">
              {copy.galleryCta}
            </PrimaryButton>
          </div>
        </Card>
      </div>
    </main>
  );
}
