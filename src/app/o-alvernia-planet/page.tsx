"use client";

import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";
import Image from "next/image";

type Locale = "pl" | "en" | "pt";

const COPY: Record<
  Locale,
  {
    tag: string;
    heroTitle: string;
    heroSubtitle: string;
    intro: string;
    bullets: string[];
    wikiLabel: string;
    wikiHref: string;
    galleryTitle: string;
    galleryCta: string;
    highlightTitle: string;
    highlightSections: { title: string; summary: string; points: string[] }[];
  }
> = {
  pl: {
    tag: "O nas",
    heroTitle: "O Alvernia Planet",
    heroSubtitle: "Unikalny kompleks kopuł filmowych i centrum wydarzeń.",
    intro:
      "Alvernia Planet łączy świat filmu, technologii i edukacji. Nasze kopuły goszczą eventy, produkcje filmowe i immersyjne atrakcje dla odwiedzających.",
    bullets: [
      "Trzynaście kopuł – gotowe na eventy i produkcje",
      "Strefy multimedialne, kino 360° i ścieżka filmowa",
      "Zespół z doświadczeniem w produkcjach i obsłudze wydarzeń",
      "Lokalizacja zapewniająca prywatność, dojazd i parking",
    ],
    wikiLabel: "Źródło: Wikipedia",
    wikiHref: "https://pl.wikipedia.org/wiki/Alvernia_Studios",
    galleryTitle: "Zobacz galerię",
    galleryCta: "Otwórz galerię",
    highlightTitle: "Wyjątkowe miejsce w środku Europy",
    highlightSections: [
      {
        title: "Lokalizacja i dojazd",
        summary: "Tuż przy A4 między Krakowem a Katowicami.",
        points: [
          "Nieporaz, ul. Ferdynanda Wspaniałego 1",
          "30 km od Krakowa, 10 km od lotniska Balice",
        ],
      },
      {
        title: "Wydarzenia immersyjne",
        summary: "Scena dla prestiżowych wydarzeń i produkcji.",
        points: [
          "Wystawy, premiery, gale, koncerty, pokazy mody",
          "Możliwości pełnej immersji i multimediów",
        ],
      },
      {
        title: "Architektura i funkcje",
        summary: "Futurystyczne kopuły i szklane pasaże.",
        points: [
          "Rozrywka, edukacja, ekspozycje i multimedia",
          "Rozpoznawalny styl architektoniczny",
        ],
      },
      {
        title: "Skala i infrastruktura",
        summary: "Duży teren i zaplecze dla gości.",
        points: [
          "17 425 m² zabudowy i 14,21 ha terenu",
          "Parking 300+ miejsc z opcją rozbudowy",
        ],
      },
      {
        title: "Edukacja i film",
        summary: "Autorska ścieżka edukacyjna od 2023.",
        points: [
          "Proces powstawania filmu i scenografii",
          "Iluzja obrazu, dźwięk i narracja",
        ],
      },
      {
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
    bullets: [
      "Thirteen domes – ready for events and productions",
      "Multimedia zones, 360° cinema, and the film path",
      "A team experienced in productions and event delivery",
      "Location offering privacy, access, and parking",
    ],
    wikiLabel: "Source: Wikipedia",
    wikiHref: "https://pl.wikipedia.org/wiki/Alvernia_Studios",
    galleryTitle: "See the gallery",
    galleryCta: "Open gallery",
    highlightTitle: "A unique place in the heart of Europe",
    highlightSections: [
      {
        title: "Location and access",
        summary: "Right by the A4 between Krakow and Katowice.",
        points: [
          "Nieporaz, Ferdynanda Wspaniałego 1",
          "30 km from Krakow, 10 km from Krakow Airport",
        ],
      },
      {
        title: "Immersive events",
        summary: "A stage for premium events and productions.",
        points: [
          "Exhibitions, premieres, galas, concerts, fashion shows",
          "Immersive and multimedia-ready setups",
        ],
      },
      {
        title: "Architecture and functions",
        summary: "Futuristic domes with glass corridors.",
        points: [
          "Entertainment, education, exhibitions, multimedia",
          "A distinctive architectural signature",
        ],
      },
      {
        title: "Scale and infrastructure",
        summary: "Large footprint and guest facilities.",
        points: [
          "17,425 m² built area and 14.21 ha site",
          "Parking for 300+ cars, expandable",
        ],
      },
      {
        title: "Education and film",
        summary: "In-house educational path since 2023.",
        points: [
          "How films are made and scenography",
          "Image & sound illusion, audiovisual storytelling",
        ],
      },
      {
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
    bullets: [
      "Treze cúpulas — prontas para eventos e produções",
      "Zonas multimédia, cinema 360° e percurso cinematográfico",
      "Equipa com experiência em produções e organização de eventos",
      "Localização com privacidade, acesso e estacionamento",
    ],
    wikiLabel: "Fonte: Wikipedia",
    wikiHref: "https://pl.wikipedia.org/wiki/Alvernia_Studios",
    galleryTitle: "Ver galeria",
    galleryCta: "Abrir galeria",
    highlightTitle: "Um lugar único no coração da Europa",
    highlightSections: [
      {
        title: "Localização e acesso",
        summary: "Junto à A4 entre Cracóvia e Katowice.",
        points: [
          "Nieporaz, Ferdynanda Wspaniałego 1",
          "30 km de Cracóvia, 10 km do aeroporto",
        ],
      },
      {
        title: "Eventos imersivos",
        summary: "Palco para eventos e produções de prestígio.",
        points: [
          "Exposições, estreias, galas, concertos, desfiles",
          "Configurações imersivas e multimédia",
        ],
      },
      {
        title: "Arquitetura e funções",
        summary: "Cúpulas futuristas e corredores envidraçados.",
        points: [
          "Entretenimento, educação, exposições, multimédia",
          "Assinatura arquitetónica marcante",
        ],
      },
      {
        title: "Escala e infraestrutura",
        summary: "Grande área e apoio ao visitante.",
        points: [
          "17 425 m² construídos e 14,21 ha",
          "Estacionamento para 300+ carros, com expansão",
        ],
      },
      {
        title: "Educação e cinema",
        summary: "Percurso educativo próprio desde 2023.",
        points: [
          "Como o cinema é feito e a cenografia",
          "Ilusão de imagem e som, narrativa audiovisual",
        ],
      },
      {
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

const GALLERY_IMAGES = [
  { src: "/galeria/Ogolne/webp/1.webp", alt: "Kopuły kompleksu – widok z góry" },
  { src: "/galeria/Ogolne/webp/2.webp", alt: "Przeszklony łącznik" },
  { src: "/galeria/Ogolne/webp/3.webp", alt: "Industrialne wnętrze kopuły" },
  { src: "/galeria/Ogolne/webp/4.webp", alt: "Strefa eventowa w kopule" },
];

export default function AboutAlverniaPage() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = COPY[loc];

  return (
    <main className="relative min-h-screen text-white px-4 py-12 sm:py-16">
      <div className="max-w-[min(86vw,120rem)] mx-auto space-y-10 sm:space-y-12">
        <header className="text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">{copy.tag}</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold">{copy.heroTitle}</h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">{copy.heroSubtitle}</p>
        </header>

        <Card variant="solid" className="space-y-6">
          <p className="text-white/85 text-lg leading-relaxed">{copy.intro}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {copy.bullets.map((line) => (
              <div
                key={line}
                className="flex items-start gap-3 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4"
              >
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4fcfde] text-[#171730] font-bold shadow-[0_0_16px_rgba(79,207,222,0.35)] ring-1 ring-black/15">
                  ✓
                </span>
                <p className="text-gray-100">{line}</p>
              </div>
            ))}
          </div>
        </Card>

        <section className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {copy.highlightTitle}
            </h2>
            <div className="h-[1px] w-24 mx-auto bg-white/15" />
            <div className="flex justify-center">
              <a
                href={copy.wikiHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/60 underline decoration-white/25 transition hover:text-white hover:decoration-white/60"
              >
                {copy.wikiLabel}
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.highlightSections.map((section) => (
              <Card
                key={section.title}
                variant="solid"
                className="bg-white/5 ring-1 ring-white/10"
                dense
              >
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm text-white/70">{section.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#4fcfde] shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <Card
          title={copy.galleryTitle}
          titleCentered
          titleDivider
          className="text-center"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
            {GALLERY_IMAGES.map((img) => (
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
    </main>
  );
}
