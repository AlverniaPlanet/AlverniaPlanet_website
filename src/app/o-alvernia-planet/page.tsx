"use client";

import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";
import Image from "next/image";

type Locale = "pl" | "en";

const COPY: Record<
  Locale,
  {
    tag: string;
    heroTitle: string;
    heroSubtitle: string;
    intro: string;
    bullets: string[];
    galleryTitle: string;
    galleryCta: string;
    highlightTitle: string;
    highlightBody: string[];
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
    galleryTitle: "Zobacz galerię",
    galleryCta: "Otwórz galerię",
    highlightTitle: "Wyjątkowe miejsce w środku Europy",
    highlightBody: [
      "Główny kompleks Alvernia Planet składa się z budynków o łącznej powierzchni 17 425 m², w tym 13 kopuł połączonych przeszklonymi pasażami i drugim kompleksem budynków. Łączna powierzchnia terenu Alvernia Planet wynosi 14,21 ha. W pobliżu budynków znajduje się parking z 180 miejscami, z możliwością rozbudowy do 1000 miejsc.",
      "To niezwykłe miejsce znajduje się pomiędzy Krakowem a Katowicami, w pobliżu granicy dwóch województw – małopolskiego i śląskiego – zamieszkałego przez 8 mln osób w promieniu 100 km, w bliskim sąsiedztwie Krakowa odwiedzanego przez 12 mln turystów rocznie.",
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
    galleryTitle: "See the gallery",
    galleryCta: "Open gallery",
    highlightTitle: "A unique place in the heart of Europe",
    highlightBody: [
      "The main Alvernia Planet complex has a total floor area of 17,425 m², including 13 domes connected by glass passages and an additional building complex. The site covers 14.21 hectares. Nearby is parking for 180 cars, expandable to 1,000 spaces.",
      "This extraordinary venue sits between Kraków and Katowice, near the border of two provinces—Małopolska and Silesia—home to 8 million people within a 100 km radius, and close to Kraków, a city visited by 12 million tourists annually.",
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
    <main className="relative min-h-screen text-white px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
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
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/90 text-black font-bold shadow-[0_0_16px_rgba(251,191,36,0.35)] ring-1 ring-black/15">
                  ✓
                </span>
                <p className="text-gray-100">{line}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title={copy.highlightTitle} titleCentered titleDivider>
          <div className="space-y-4 text-gray-100 text-base leading-relaxed">
            {copy.highlightBody.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Card>

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
