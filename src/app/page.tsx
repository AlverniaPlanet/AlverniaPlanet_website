"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { AttractionCard } from "@/app/components/AttractionCard";
import { NEWS_COPY, NewsSectionBlock, type NewsSection } from "@/app/components/newsContent";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import TicketFaqWidget, { type TicketFaqCopy } from "@/app/components/TicketFaqWidget";
import { waitForImagesReady } from "@/app/components/waitForImagesReady";
import {
  buildBookingPath,
  COMBINED_PROMO_BOOKING_CATEGORY,
  FILM_PATH_BOOKING_CATEGORY,
  FILM_PATH_BOOKING_SERVICES,
} from "@/lib/booking";

type Locale = "pl" | "en" | "pt";

type AttractionItem = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
};

type TicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  priceLabel?: string;
  price?: string;
  bookingServiceName?: string;
  bookingQuantity?: number;
};

type PromoTicketOption = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  priceLabel: string;
  price: string;
  savings: string;
  savingsBadge: string;
  button: string;
};

type TicketSection = {
  title: string;
  intro: string;
  headerCta: string;
  headerCtaSub: string;
  priceLabel: string;
  price: string;
  cta: string;
  ctaHref: string;
  promoTicket: PromoTicketOption;
  options: TicketOption[];
};

type PromoTile = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  images: string[];
  imageAlt: string;
};

type HeroPromo = {
  message: string;
  cta: string;
  href: string;
  tone: "cool" | "hot";
  previewMedia?: "k360";
};

type HomeCopy = {
  heroTitle: string;
  heroPromos: HeroPromo[];
  attractions: {
    title: string;
    intro: string;
    items: AttractionItem[];
  };
  tickets: TicketSection;
  eventsPromo: PromoTile;
  news: NewsSection;
  faq: TicketFaqCopy;
};

const HOME_COPY: Record<Locale, HomeCopy> = {
  pl: {
    heroTitle: "Witamy w Alvernia Planet",
    heroPromos: [
      {
        message: "Przeżyj projekcję K360",
        cta: "Zobacz K360",
        href: "/atrakcje/k360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Atrakcje",
      intro: "Wejdź do świata kopuł i zacznij od naszych trzech flagowych doświadczeń.",
      items: [
        {
          title: "K360",
          description:
            "Immersyjna projekcja fulldome w jednej z najbardziej zaawansowanych kopuł w Europie.",
          cta: "Zobacz K360",
          href: "/atrakcje/k360",
          image: "/galeria/Ogolne/webp/4.webp",
          imageAlt: "Wnętrze kopuły przygotowane do projekcji 360°",
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
      intro:
        "Bilet normalny kosztuje 79 zł za osobę, a bilet ulgowy 69 zł za osobę. Dla grup szkolnych ceny pozostają bez zmian.",
      headerCta: "Wybierz wariant rezerwacji",
      headerCtaSub: "Dla rodzin, grup i szkół - jeden krok do rezerwacji.",
      priceLabel: "Cena za osobę",
      price: "79 zł/os. lub 69 zł/os.",
      cta: "Kup bilet",
      ctaHref: "/rezerwuj",
      promoTicket: {
        badge: "Pakiet",
        title: "Ścieżka + K360",
        subtitle:
          "Jeden duży pakiet promocyjny, który łączy zwiedzanie Ścieżki filmowej z projekcją K360.",
        details: ["Około 3 godzin doświadczeń łącznie"],
        priceLabel: "Cena promocyjna",
        price: "119,00 zł",
        savings: "Oszczędzasz 9,00 zł",
        savingsBadge: "7% taniej",
        button: "Wybierz pakiet",
      },
      options: [
        {
          badge: "Normalny",
          title: "Bilet normalny",
          subtitle: "1-10 osób na jednym bilecie",
          details: ["Dla osób indywidualnych i rodzin", "Cena regularna za osobę"],
          price: "79 zł/os.",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
        },
        {
          badge: "Ulgowy",
          title: "Bilet ulgowy",
          subtitle: "1-10 osób na jednym bilecie",
          details: ["Dla osób indywidualnych i rodzin", "Cena ulgowa za osobę"],
          price: "69 zł/os.",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.reduced,
        },
        {
          badge: "Grupowe",
          title: "Bilet grupowy (szkolny)",
          subtitle: "30-50 osób w grupie",
          details: ["Dla szkół i grup zorganizowanych", "Płatność za całą grupę"],
          priceLabel: "Cena za grupę 30-50 osób",
          price: "2 070-3 450 zł/grupa",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
          bookingQuantity: 30,
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Wydarzenia",
      title: "Wyjątkowe miejsce na Twój event",
      description:
        "Wyjątkowe przestrzenie do konferencji, gal i premier. Sprawdź możliwości organizacji eventów w Alvernia Planet.",
      cta: "Odkryj wydarzenia",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Przestrzeń eventowa Alvernia Planet podczas konferencji",
    },
    news: NEWS_COPY.pl,
    faq: {
      badge: "FAQ",
      title: "Najczęstsze pytania",
      desktopLabel: "Najczęściej zadawane pytania",
      subtitle: "Szybkie odpowiedzi przed wizytą i rezerwacją.",
      mobileOpenLabel: "Pokaż FAQ",
      mobileCloseLabel: "Ukryj FAQ",
      items: [
        {
          question: "Ile trwa zwiedzanie?",
          answer:
            "Zwiedzanie ścieżki filmowej wraz z częścią edukacyjną trwa około 2-2,5 godziny.",
        },
        {
          question: "Ile kosztuje zwiedzanie?",
          answer:
            "Bilet normalny kosztuje 79 zł za osobę, a bilet ulgowy 69 zł za osobę. W cenie jest zwiedzanie przestrzeni Alvernia Planet z przewodnikiem oraz część edukacyjna.",
        },
        {
          question: "Czy jest strefa gastro?",
          answer:
            "Na miejscu nie ma restauracji, natomiast działa sklepik z pamiątkami, w którym można kupić drobne przekąski i napoje.",
        },
        {
          question: "Czy mają państwo dostępne jakieś warsztaty?",
          answer:
            "Standardowa wizyta obejmuje zwiedzanie z przewodnikiem oraz część edukacyjną o produkcji filmowej. Oddzielne warsztaty nie są obecnie prowadzone w ramach standardowego zwiedzania.",
        },
        {
          question: "Czy można wejść bez wcześniejszej rezerwacji biletów?",
          answer:
            "Nie - obowiązuje wcześniejsza rezerwacja biletów, ponieważ zwiedzanie odbywa się w określonych godzinach i z przewodnikiem.",
        },
        {
          question: "Czy jesteście otwarci w weekendy?",
          answer:
            "Tak - aktualnie zwiedzanie odbywa się w wybrane dni weekendowe, głównie w soboty, a w przyszłości planowane są również niedziele, w zależności od harmonogramu.",
        },
        {
          question: "Czy można przyjechać z rodziną lub przyjaciółmi czy tylko grupy?",
          answer:
            "Oczywiście można przyjechać zarówno indywidualnie, na przykład z rodziną lub znajomymi, jak i w grupie zorganizowanej.",
        },
        {
          question: "Jaka produkcja była tu realizowana ostatnio?",
          answer:
            "W Alvernia Planet powstawało wiele produkcji filmowych, serialowych i reklamowych - między innymi Akademia Pana Kleksa, 99 Gra o wszystko oraz inne liczne międzynarodowe projekty.",
        },
        {
          question: "Czy wejdziemy na plan zdjęciowy jakiejś produkcji?",
          answer:
            "Nie - hale zdjęciowe są miejscem pracy ekip filmowych, dlatego podczas zwiedzania nie ma możliwości wejścia na aktywny plan zdjęciowy.",
        },
      ],
    },
  },
  en: {
    heroTitle: "Welcome to Alvernia Planet",
    heroPromos: [
      {
        message: "Experience the K360 projection",
        cta: "See K360",
        href: "/atrakcje/k360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Attractions",
      intro: "Start with our signature experiences inside the domes.",
      items: [
        {
          title: "K360",
          description: "Immersive dome projection with the image all around you.",
          cta: "See K360",
          href: "/atrakcje/k360",
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
      intro:
        "The standard ticket costs 79 PLN per person and the reduced ticket costs 69 PLN per person. Group pricing stays the same.",
      headerCta: "Choose booking option",
      headerCtaSub: "For families, groups, and schools - one step to booking.",
      priceLabel: "Price per person",
      price: "79 PLN/person or 69 PLN/person",
      cta: "Buy tickets",
      ctaHref: "/en/reserve",
      promoTicket: {
        badge: "Package",
        title: "Film Path + K360",
        subtitle:
          "One large promotional package that combines the Film Path visit with a K360 projection.",
        details: ["Around 3 hours of experiences in total"],
        priceLabel: "Promo price",
        price: "119.00 PLN",
        savings: "You save 9.00 PLN",
        savingsBadge: "7% off",
        button: "Choose package",
      },
      options: [
        {
          badge: "Standard",
          title: "Standard ticket",
          subtitle: "1-10 people on one ticket",
          details: ["For individuals and families", "Regular price per person"],
          price: "79 PLN/person",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
        },
        {
          badge: "Reduced",
          title: "Reduced ticket",
          subtitle: "1-10 people on one ticket",
          details: ["For individuals and families", "Reduced price per person"],
          price: "69 PLN/person",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.reduced,
        },
        {
          badge: "Group",
          title: "Group ticket (schools)",
          subtitle: "30-50 people in a group",
          details: ["For schools and organized groups", "Pay for the whole group"],
          priceLabel: "Price for groups of 30-50 people",
          price: "2,070-3,450 PLN/group",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
          bookingQuantity: 30,
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Events",
      title: "A unique venue for your event",
      description:
        "Exceptional spaces for conferences, galas, and premieres. Discover what events you can host at Alvernia Planet.",
      cta: "Explore events",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Event space at Alvernia Planet during a conference",
    },
    news: NEWS_COPY.en,
    faq: {
      badge: "FAQ",
      title: "Popular questions",
      desktopLabel: "Frequently asked questions",
      subtitle: "Quick answers before your visit and booking.",
      mobileOpenLabel: "Show FAQ",
      mobileCloseLabel: "Hide FAQ",
      items: [
        {
          question: "How long does the tour take?",
          answer:
            "The film path tour including the educational part lasts about 2 to 2.5 hours.",
        },
        {
          question: "How much does the tour cost?",
          answer:
            "The standard ticket costs 79 PLN per person and the reduced ticket costs 69 PLN per person. The price includes a guided tour of the Alvernia Planet spaces and the educational part.",
        },
        {
          question: "Is there a food zone?",
          answer:
            "There is no restaurant on site, but there is a souvenir shop where you can buy small snacks and drinks.",
        },
        {
          question: "Do you offer any workshops?",
          answer:
            "The standard visit includes a guided tour and an educational segment about film production. Separate workshops are not currently offered as part of the standard visit.",
        },
        {
          question: "Can you enter without booking tickets in advance?",
          answer:
            "No. Advance ticket booking is required because visits take place at scheduled times and with a guide.",
        },
        {
          question: "Are you open on weekends?",
          answer:
            "Yes. Tours currently take place on selected weekend days, mainly Saturdays, and Sundays may also be added in the future depending on the schedule.",
        },
        {
          question: "Can I come with family or friends, or is it only for groups?",
          answer:
            "Of course. You can visit both individually, for example with family or friends, and as part of an organized group.",
        },
        {
          question: "What production was made here most recently?",
          answer:
            "Many film, TV and commercial productions have been created at Alvernia Planet, including Akademia Pana Kleksa, 99 Gra o wszystko and many other international projects.",
        },
        {
          question: "Will we enter an active film set during the visit?",
          answer:
            "No. Sound stages are workplaces for film crews, so there is no access to an active set during the visit.",
        },
      ],
    },
  },
  pt: {
    heroTitle: "Bem-vindo à Alvernia Planet",
    heroPromos: [
      {
        message: "Vive a projeção K360",
        cta: "Ver o K360",
        href: "/atrakcje/k360",
        tone: "hot",
        previewMedia: "k360",
      },
    ],
    attractions: {
      title: "Atrações",
      intro: "Entre no mundo das cúpulas e comece pelas nossas três experiências emblemáticas.",
      items: [
        {
          title: "K360",
          description:
            "Projeções imersivas em cúpula com imagem a 360° numa das estruturas mais avançadas da Europa.",
          cta: "Ver o K360",
          href: "/atrakcje/k360",
          image: "/galeria/Ogolne/webp/4.webp",
          imageAlt: "Interior da cúpula preparado para projeção 360°",
        },
        {
          title: "Percurso de filmagem",
          description:
            "Uma visita aos bastidores com cenários, adereços e tecnologia usada nas produções.",
          cta: "Conheça o percurso",
          href: "/atrakcje/sciezka-filmowa",
          image: "/galeria/Sciezka_filmowa/webp/4.webp",
          imageAlt: "Elementos de cenário no percurso de filmagem",
        },
        {
          title: "Exposições temáticas",
          description:
            "Exposição inspirada no mundo da imagem, do som e da ciência, ideal para famílias e grupos.",
          cta: "Descobrir a exposição",
          href: "/atrakcje/wystawa",
          image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/1.webp",
          imageAlt: "Peça de exposição na mostra temática",
        },
      ],
    },
    tickets: {
      title: "Bilhetes para o percurso educativo",
      intro:
        "O bilhete normal custa 79 PLN por pessoa e o bilhete reduzido custa 69 PLN por pessoa. O preço de grupo mantém-se.",
      headerCta: "Escolher opção de reserva",
      headerCtaSub: "Para famílias, grupos e escolas - um passo até à reserva.",
      priceLabel: "Preço por pessoa",
      price: "79 PLN/pessoa ou 69 PLN/pessoa",
      cta: "Comprar bilhetes",
      ctaHref: "/pt/reservar",
      promoTicket: {
        badge: "Pacote",
        title: "Percurso + K360",
        subtitle:
          "Um grande pacote promocional que junta a visita ao Percurso de filmagem com a projeção no K360.",
        details: ["Cerca de 3 horas de experiências no total"],
        priceLabel: "Preço promocional",
        price: "119,00 PLN",
        savings: "Poupa 9,00 PLN",
        savingsBadge: "7% menos",
        button: "Escolher pacote",
      },
      options: [
        {
          badge: "Normal",
          title: "Bilhete normal",
          subtitle: "1-10 pessoas por bilhete",
          details: ["Para indivíduos e famílias", "Preço normal por pessoa"],
          price: "79 PLN/pessoa",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.normal,
        },
        {
          badge: "Reduzido",
          title: "Bilhete reduzido",
          subtitle: "1-10 pessoas por bilhete",
          details: ["Para indivíduos e famílias", "Preço reduzido por pessoa"],
          price: "69 PLN/pessoa",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.reduced,
        },
        {
          badge: "Grupo",
          title: "Bilhete de grupo (escolas)",
          subtitle: "30-50 pessoas no grupo",
          details: ["Para escolas e grupos organizados", "Pagamento pelo grupo inteiro"],
          priceLabel: "Preço para grupos de 30-50 pessoas",
          price: "2 070-3 450 PLN/grupo",
          bookingServiceName: FILM_PATH_BOOKING_SERVICES.group,
          bookingQuantity: 30,
        },
      ],
    },
    eventsPromo: {
      eyebrow: "Eventos",
      title: "Um espaço único para o seu evento",
      description:
        "Espaços excepcionais para conferências, galas e estreias. Descubra o potencial da Alvernia Planet para eventos.",
      cta: "Explorar eventos",
      href: "/wydarzenia",
      images: [
        "/wydarzenia/format-showcase-1.webp",
        "/wydarzenia/format-showcase-2.webp",
        "/wydarzenia/format-showcase-3.webp",
      ],
      imageAlt: "Espaço de eventos da Alvernia Planet durante uma conferência",
    },
    news: NEWS_COPY.pt,
    faq: {
      badge: "FAQ",
      title: "Perguntas frequentes",
      desktopLabel: "Perguntas mais frequentes",
      subtitle: "Respostas rápidas antes da visita e da reserva.",
      mobileOpenLabel: "Mostrar FAQ",
      mobileCloseLabel: "Ocultar FAQ",
      items: [
        {
          question: "Quanto tempo dura a visita?",
          answer:
            "A visita ao percurso de filmagem com a parte educativa dura cerca de 2 a 2,5 horas.",
        },
        {
          question: "Quanto custa a visita?",
          answer:
            "O bilhete normal custa 79 PLN por pessoa e o bilhete reduzido custa 69 PLN por pessoa. O preço inclui a visita guiada aos espaços da Alvernia Planet e a parte educativa.",
        },
        {
          question: "Existe zona de restauração?",
          answer:
            "No local não existe restaurante, mas há uma loja de recordações onde é possível comprar pequenos snacks e bebidas.",
        },
        {
          question: "Têm workshops disponíveis?",
          answer:
            "A visita standard inclui uma visita guiada e uma parte educativa sobre produção audiovisual. Workshops separados não são atualmente realizados no formato standard da visita.",
        },
        {
          question: "É possível entrar sem reservar bilhetes antecipadamente?",
          answer:
            "Não. É obrigatória a reserva prévia, porque as visitas decorrem em horários definidos e com guia.",
        },
        {
          question: "Estão abertos aos fins de semana?",
          answer:
            "Sim. Atualmente as visitas decorrem em dias selecionados do fim de semana, principalmente aos sábados, e no futuro poderão incluir também domingos, dependendo do calendário.",
        },
        {
          question: "Posso visitar com família ou amigos ou é só para grupos?",
          answer:
            "Claro. Pode visitar individualmente, por exemplo com família ou amigos, e também em grupo organizado.",
        },
        {
          question: "Que produção foi realizada aqui mais recentemente?",
          answer:
            "Na Alvernia Planet foram realizadas muitas produções audiovisuais, séries e publicidade, incluindo Akademia Pana Kleksa, 99 Gra o wszystko e muitos outros projetos internacionais.",
        },
        {
          question: "Vamos entrar num set de filmagem ativo?",
          answer:
            "Não. Os estúdios são locais de trabalho das equipas de filmagem, por isso não existe acesso a um set ativo durante a visita.",
        },
      ],
    },
  },
};

const HERO_WELCOME_AUTO_HIDE_MS = 2500;
const HERO_WELCOME_FADE_DURATION_MS = 1200;
const HERO_PROMO_DELAY_MS = 2000;
const HERO_PROMO_FADE_DURATION_MS = 700;
const HERO_PREVIEW_REVEAL_DURATION_MS = 980;
const EVENTS_PROMO_ROTATION_MS = 5200;
const EVENTS_PROMO_FADE_MS = 2400;

export default function Page() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = HOME_COPY[loc];
  const [introReady, setIntroReady] = useState(false);
  const [secondaryAnimationsReady, setSecondaryAnimationsReady] = useState(false);
  const [heroWelcomeVisible, setHeroWelcomeVisible] = useState(true);
  const heroVideoFallback =
    loc === "en"
      ? "Your browser does not support the video element."
      : loc === "pt"
      ? "O seu navegador não suporta o elemento de vídeo."
      : "Twój browser nie wspiera elementu video.";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroReady(true);
      setSecondaryAnimationsReady(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIntroReady(true);
    });
    let idleTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleCallbackId: number | null = null;
    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const startSecondary = () => setSecondaryAnimationsReady(true);
    if (typeof win.requestIdleCallback === "function") {
      idleCallbackId = win.requestIdleCallback(startSecondary, { timeout: 1800 });
    } else {
      idleTimeoutId = globalThis.setTimeout(startSecondary, 1100);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      if (idleCallbackId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleCallbackId);
      }
      if (idleTimeoutId !== null) {
        window.clearTimeout(idleTimeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const timer = window.setTimeout(() => {
      setHeroWelcomeVisible(false);
    }, HERO_WELCOME_AUTO_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen px-4 py-10 sm:py-14 lg:py-12 text-white">
      <HeroSection
        heroTitle={copy.heroTitle}
        heroPromos={copy.heroPromos}
        heroVideoFallback={heroVideoFallback}
        introReady={introReady}
        heroWelcomeVisible={heroWelcomeVisible}
      />
      <HomeContent
        introReady={introReady}
        attractions={copy.attractions}
        tickets={copy.tickets}
        eventsPromo={copy.eventsPromo}
        news={copy.news}
        secondaryAnimationsReady={secondaryAnimationsReady}
        locale={loc}
      />
      <HomeFaqSlots faq={copy.faq} />
    </main>
  );
}

const HeroSection = memo(function HeroSection({
  heroTitle,
  heroPromos,
  heroVideoFallback,
  introReady,
  heroWelcomeVisible,
}: {
  heroTitle: string;
  heroPromos: HomeCopy["heroPromos"];
  heroVideoFallback: string;
  introReady: boolean;
  heroWelcomeVisible: boolean;
}) {
  const [activeHeroPromoIndex, setActiveHeroPromoIndex] = useState<number | null>(null);
  const activeHeroPromo = activeHeroPromoIndex !== null ? heroPromos[activeHeroPromoIndex] : null;
  const k360PreviewActive = activeHeroPromo?.previewMedia === "k360";

  useEffect(() => {
    setActiveHeroPromoIndex(null);
  }, [heroTitle]);

  return (
    <section
      className={`relative z-10 transition-[opacity,transform] duration-[1300ms] will-change-[opacity,transform] ${
        introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="mx-auto w-full max-w-[72rem]">
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
          <div className="relative aspect-[16/9] bg-black">
            <div className="pointer-events-none absolute inset-x-0 top-7 z-20 flex justify-center px-4 sm:top-8 lg:top-9">
              <div className="flex w-full max-w-[44rem] flex-col items-center gap-2 sm:max-w-[48rem] sm:gap-2.5 lg:max-w-[52rem]">
                {heroPromos.map((heroPromo, index) => (
                  <Link
                    key={`${heroPromo.href}-${heroPromo.message}`}
                    href={heroPromo.href}
                    onMouseEnter={() => setActiveHeroPromoIndex(index)}
                    onFocus={() => setActiveHeroPromoIndex(index)}
                    aria-label={`${heroPromo.message}. ${heroPromo.cta}`}
                    className={`hero-film-alert ${heroPromo.tone === "cool" ? "hero-film-alert--cool" : "hero-film-alert--hot"} ${
                      activeHeroPromoIndex === index ? "hero-film-alert--active" : ""
                    } pointer-events-auto inline-flex max-w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-[11px] sm:gap-2.5 sm:px-4 sm:py-2.5 sm:text-sm transition-[opacity,transform,filter] ${
                      introReady
                        ? "hero-film-alert-intro opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-8 scale-[0.88] blur-sm pointer-events-none"
                    }`}
                    style={{
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      transitionDelay: introReady ? `${HERO_PROMO_DELAY_MS + index * 120}ms` : "0ms",
                      transitionDuration: `${HERO_PROMO_FADE_DURATION_MS}ms`,
                    }}
                  >
                    <span
                      className={`hero-film-alert-dot ${heroPromo.tone === "cool" ? "hero-film-alert-dot--cool" : "hero-film-alert-dot--hot"} mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3`}
                      aria-hidden="true"
                    />
                    <span className="hero-film-alert-copy leading-tight font-medium">
                      {heroPromo.message}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div
              className={`pointer-events-none absolute inset-0 z-[6] bg-black transition-opacity ${
                heroWelcomeVisible ? "opacity-45" : "opacity-0"
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDuration: `${HERO_WELCOME_FADE_DURATION_MS}ms`,
              }}
              aria-hidden
            />
            <div
              className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 text-center transition-[opacity,transform,filter] ${
                heroWelcomeVisible
                  ? "opacity-100 translate-y-0 blur-0"
                  : "opacity-0 -translate-y-2 blur-[2px]"
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDuration: `${HERO_WELCOME_FADE_DURATION_MS}ms`,
              }}
              aria-hidden
            >
              <h1 className="ap-type-hero-title text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.65)]">
                {heroTitle}
              </h1>
            </div>
            <AdaptiveVideo
              mp4Src="/home/AP_ogolne.mp4"
              webmSrc="/home/AP_ogolne.webm"
              poster="/home/AP_ogolne_poster.webp"
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              sizes="(min-width: 1200px) 72rem, 100vw"
              fallbackText={heroVideoFallback}
              priority
              rootMargin="320px 0px"
              preferPosterOnLowPower
            />
            <div
              className={`hero-k360-preview pointer-events-none absolute inset-0 z-[2] ${
                k360PreviewActive ? "hero-k360-preview--active" : ""
              }`}
              style={{
                clipPath: k360PreviewActive ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
                transitionDuration: `${HERO_PREVIEW_REVEAL_DURATION_MS}ms`,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              aria-hidden="true"
            >
              <AdaptiveVideo
                mp4Src="/k360/one_step_beyond.mp4"
                webmSrc="/k360/one_step_beyond.webm"
                poster="/k360/K360_poster.webp"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                sizes="(min-width: 1200px) 72rem, 100vw"
                fallbackText={heroVideoFallback}
                rootMargin="320px 0px"
                preferPosterOnLowPower
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#140811]/18 via-transparent to-[#ff5f76]/12" />
            </div>
            {activeHeroPromo ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-end px-4 sm:bottom-5 sm:px-5 lg:bottom-6 lg:px-6">
                <Link
                  href={activeHeroPromo.href}
                  className={`hero-preview-cta pointer-events-auto transition-[opacity,transform,filter] ${
                    activeHeroPromoIndex !== null
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-3 scale-[0.92] blur-sm pointer-events-none"
                  }`}
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDuration: `${HERO_PROMO_FADE_DURATION_MS + 140}ms`,
                  }}
                >
                  {activeHeroPromo.cta} →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
});

const HomeContent = memo(function HomeContent({
  introReady,
  attractions,
  tickets,
  eventsPromo,
  news,
  secondaryAnimationsReady,
  locale,
}: {
  introReady: boolean;
  attractions: HomeCopy["attractions"];
  tickets: TicketSection;
  eventsPromo: PromoTile;
  news: NewsSection;
  secondaryAnimationsReady: boolean;
  locale: Locale;
}) {
  return (
    <section
      id="content-start"
      className={`relative z-10 mt-10 sm:mt-12 transition-[opacity,transform] duration-[1200ms] will-change-[opacity,transform] ${
        introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: "180ms",
      }}
    >
      <div className="mx-auto max-w-[72rem]">
        <div className="grid grid-cols-1 gap-16 sm:gap-20">
          <AttractionsSection attractions={attractions} animate={secondaryAnimationsReady} />
          <TicketsSection tickets={tickets} locale={locale} />
          <EventsPromoSection promo={eventsPromo} />
          <NewsSectionBlock news={news} />
        </div>
      </div>
    </section>
  );
});

const AttractionsSection = memo(function AttractionsSection({
  attractions,
  animate,
}: {
  attractions: HomeCopy["attractions"];
  animate: boolean;
}) {
  return (
    <ScrollMotionItem strength="strong" delay={40}>
      <Card title={attractions.title} titleCentered titleDivider dense motion="off">
        <p className="ap-type-section-body text-center max-w-3xl mx-auto">{attractions.intro}</p>
        <AttractionsScroller items={attractions.items} animate={animate} />
      </Card>
    </ScrollMotionItem>
  );
});

const TicketOptionCard = memo(function TicketOptionCard({
  option,
  defaultPriceLabel,
  defaultPrice,
  cta,
  ctaHref,
}: {
  option: TicketOption;
  defaultPriceLabel: string;
  defaultPrice: string;
  cta: string;
  ctaHref: string;
}) {
  return (
    <div className="ticket-card ap-tile group flex h-full flex-col rounded-3xl text-white/90">
      <div className="ticket-card-top">
        <span className="ticket-card-badge">{option.badge}</span>
      </div>
      <div className="ticket-card-content flex h-full flex-col p-5 sm:p-6 text-center">
        <h3 className="ticket-card-title text-xl sm:text-2xl font-semibold text-white">
          {option.title}
        </h3>
        <p className="ticket-card-subtitle mt-2 text-sm sm:text-base text-white/75">
          {option.subtitle}
        </p>
        <div className="ticket-card-divider mt-6" />
        <ul className="ticket-list-panel mt-5 mb-8 space-y-3 text-sm text-white/75 text-left mx-auto max-w-sm">
          {option.details.map((detail) => (
            <li key={detail} className="ticket-detail flex gap-3">
              <span className="ticket-detail-dot mt-2 h-1.5 w-1.5 rounded-full bg-[#4fcfde] shrink-0" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
        <div className="ticket-price-block mt-auto pt-7">
          <p className="ticket-price-label text-[0.7rem] uppercase tracking-[0.25em] text-white/60">
            {option.priceLabel ?? defaultPriceLabel}
          </p>
          <p className="ticket-price mt-2 text-2xl sm:text-3xl font-bold text-amber-200">
            {option.price ?? defaultPrice}
          </p>
          <div className="mt-6 flex justify-center">
            <PrimaryButton
              href={ctaHref}
              size="md"
              className="ticket-pill ring-[color:rgba(240,60,100,0.55)]"
            >
              {cta}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
});

const TicketsSection = memo(function TicketsSection({
  tickets,
  locale,
}: {
  tickets: TicketSection;
  locale: Locale;
}) {
  return (
    <ScrollMotionItem strength="soft" delay={30} float={false} className="home-deferred-block">
      <Card title={tickets.title} titleCentered titleDivider dense motion="off">
        <div className="mt-1 text-center">
          <p className="ap-type-cta-title">{tickets.headerCta}</p>
          <p className="mt-2 ap-type-cta-body">{tickets.headerCtaSub}</p>
        </div>
        <div className="mt-8 space-y-8">
          <article className="home-ticket-promo relative overflow-hidden rounded-[2rem] border border-[#4fcfde]/35 bg-[linear-gradient(145deg,rgba(39,47,76,0.96)_0%,rgba(26,31,54,0.98)_100%)] px-6 py-6 shadow-[0_18px_44px_rgba(0,0,0,0.28)] sm:px-7 sm:py-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,207,222,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(79,207,222,0.08),transparent_32%)]" />
            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
              <div className="space-y-5 text-center lg:text-left">
                <span className="ticket-card-badge mx-auto lg:mx-0">{tickets.promoTicket.badge}</span>
                <div className="space-y-3">
                  <h3 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                    {tickets.promoTicket.title}
                  </h3>
                  <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/76 sm:text-lg lg:mx-0">
                    {tickets.promoTicket.subtitle}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                  {tickets.promoTicket.details.map((detail) => (
                    <div
                      key={detail}
                      className="home-ticket-promo-detail rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white/72"
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col items-center gap-4 lg:w-auto lg:items-end">
                <div className="home-ticket-promo-price w-full max-w-[22rem] rounded-[1.35rem] border border-white/12 bg-white/[0.05] px-4 py-4 text-center shadow-[0_14px_34px_rgba(0,0,0,0.2)] sm:px-5 lg:text-right">
                  <p className="text-sm text-white/68">{tickets.promoTicket.priceLabel}</p>
                  <p className="mt-1 text-[1.9rem] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[2.1rem]">
                    {tickets.promoTicket.price}
                  </p>
                  <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-[#8ff3ff] lg:justify-end">
                    <span>{tickets.promoTicket.savings}</span>
                    <span className="rounded-full border border-[#8ff3ff]/25 bg-[#8ff3ff]/12 px-2.5 py-0.5 text-[0.78rem] leading-none text-[#b8f8ff]">
                      {tickets.promoTicket.savingsBadge}
                    </span>
                  </p>
                </div>

                <PrimaryButton
                  href={buildBookingPath(locale, {
                    category: COMBINED_PROMO_BOOKING_CATEGORY,
                  })}
                  size="lg"
                  className="ticket-pill min-w-[13rem] whitespace-nowrap ring-[color:rgba(240,60,100,0.55)]"
                >
                  {tickets.promoTicket.button}
                </PrimaryButton>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2 xl:grid-cols-3">
            {tickets.options.map((option) => (
              <TicketOptionCard
                key={option.title}
                option={option}
                defaultPriceLabel={tickets.priceLabel}
                defaultPrice={tickets.price}
                cta={tickets.cta}
                ctaHref={
                  option.bookingServiceName
                    ? buildBookingPath(locale, {
                        category: FILM_PATH_BOOKING_CATEGORY,
                        service: option.bookingServiceName,
                        quantity: option.bookingQuantity,
                      })
                    : tickets.ctaHref
                }
              />
            ))}
          </div>
        </div>
      </Card>
    </ScrollMotionItem>
  );
});

const EventsPromoSection = memo(function EventsPromoSection({
  promo,
}: {
  promo: PromoTile;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState(promo.images[0] ?? "");
  const [previousImageSrc, setPreviousImageSrc] = useState<string | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [imagesReady, setImagesReady] = useState(promo.images.length <= 1);

  useEffect(() => {
    let cancelled = false;

    setActiveImageIndex(0);
    setCurrentImageSrc(promo.images[0] ?? "");
    setPreviousImageSrc(null);
    setIsCrossfading(false);
    setImagesReady(promo.images.length <= 1);

    if (promo.images.length <= 1 || typeof window === "undefined") {
      return () => {
        cancelled = true;
      };
    }

    void waitForImagesReady(promo.images).then(() => {
      if (!cancelled) {
        setImagesReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [promo.images]);

  useEffect(() => {
    if (!imagesReady || promo.images.length <= 1 || typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (document.hidden) {
        return;
      }

      setActiveImageIndex((currentIndex) => (currentIndex + 1) % promo.images.length);
    }, EVENTS_PROMO_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [imagesReady, promo.images]);

  useEffect(() => {
    const nextImageSrc = promo.images[activeImageIndex];
    if (!imagesReady || !nextImageSrc || nextImageSrc === currentImageSrc || typeof window === "undefined") {
      return;
    }

    let cancelled = false;
    let firstFrameId = 0;
    let secondFrameId = 0;
    let timeoutId: number | null = null;

    setPreviousImageSrc(currentImageSrc);
    setCurrentImageSrc(nextImageSrc);
    setIsCrossfading(false);

    firstFrameId = window.requestAnimationFrame(() => {
      if (cancelled) {
        return;
      }

      secondFrameId = window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        setIsCrossfading(true);
      });
    });

    timeoutId = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      setPreviousImageSrc(null);
      setIsCrossfading(false);
    }, EVENTS_PROMO_FADE_MS);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [activeImageIndex, currentImageSrc, imagesReady, promo.images]);

  return (
    <ScrollMotionItem strength="soft" delay={70} float={false} className="home-deferred-block">
      <Card variant="solid" dense motion="off" className="ap-interactive-surface overflow-hidden">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="ap-type-kicker">{promo.eyebrow}</p>
            <h2 className="mt-2 ap-type-section-title text-balance">{promo.title}</h2>
            <p className="mt-3 ap-type-section-body max-w-2xl">{promo.description}</p>
            <div className="mt-6 flex justify-center lg:justify-start">
              <PrimaryButton href={promo.href} size="md">
                {promo.cta}
              </PrimaryButton>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black/20 ring-1 ring-white/12 shadow-[0_18px_42px_rgba(0,0,0,0.28)]">
            {previousImageSrc ? (
              <Image
                src={previousImageSrc}
                alt={promo.imageAlt}
                fill
                sizes="(min-width: 1024px) 34rem, 100vw"
                key={previousImageSrc}
                className={`object-cover transition-opacity duration-[2400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isCrossfading ? "opacity-0" : "opacity-100"
                }`}
                loading="eager"
                decoding="async"
              />
            ) : null}
            {currentImageSrc ? (
              <Image
                src={currentImageSrc}
                alt={promo.imageAlt}
                fill
                sizes="(min-width: 1024px) 34rem, 100vw"
                key={currentImageSrc}
                className={`object-cover transition-opacity duration-[2400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  previousImageSrc ? (isCrossfading ? "opacity-100" : "opacity-0") : "opacity-100"
                }`}
                loading="eager"
                decoding="async"
              />
            ) : null}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#141830]/38 via-transparent to-[#4fcfde]/12"
              aria-hidden="true"
            />
          </div>
        </div>
      </Card>
    </ScrollMotionItem>
  );
});

const HomeFaqSlots = memo(function HomeFaqSlots({
  faq,
}: {
  faq: TicketFaqCopy;
}) {
  return (
    <>
      <div className="ticket-faq-fixed-slot xl:hidden">
        <TicketFaqWidget copy={faq} mode="mobile" />
      </div>
      <div className="ticket-faq-fixed-slot hidden xl:block">
        <TicketFaqWidget copy={faq} mode="desktop" />
      </div>
    </>
  );
});

const AttractionsScroller = memo(function AttractionsScroller({
  items,
  animate: shouldAnimate = true,
}: {
  items: AttractionItem[];
  animate?: boolean;
}) {
  const loopItems = useMemo(() => [...items, ...items], [items]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !shouldAnimate) {
      setCanAnimate(false);
      return;
    }

    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
      deviceMemory?: number;
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrowViewport = window.matchMedia("(max-width: 767px)").matches;
    const saveData = Boolean(nav.connection?.saveData);
    const effectiveType = nav.connection?.effectiveType ?? "";
    const constrainedNetwork = /(^|-)2g$|3g/.test(effectiveType);
    const deviceMemory = nav.deviceMemory;
    const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 4;
    const lowCpu = (nav.hardwareConcurrency ?? 8) <= 4;

    setCanAnimate(
      !reducedMotion &&
        !saveData &&
        !constrainedNetwork &&
        !coarsePointer &&
        !(narrowViewport && (lowMemory || lowCpu)),
    );
  }, [shouldAnimate]);

  useEffect(() => {
    if (!canAnimate) {
      return;
    }
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) {
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let frameId: number | null = null;
    let halfWidth = 0;
    let offset = 0;
    let boostVelocity = 0;
    let lastTime = 0;
    let lastPaintTime = 0;
    let isVisible = false;
    let touchMode: "idle" | "pending" | "horizontal" | "vertical" = "idle";
    let touchStartX = 0;
    let touchStartY = 0;
    let touchLastX = 0;
    let touchLastTime = 0;
    const baseSpeed = window.matchMedia("(max-width: 640px)").matches ? 18 : 14;
    const minFrameMs = 1000 / 24;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const normalizeOffset = () => {
      if (halfWidth <= 0) {
        return;
      }
      offset = ((offset % halfWidth) + halfWidth) % halfWidth;
    };

    const recalculateWidth = () => {
      halfWidth = track.scrollWidth / 2;
      normalizeOffset();
    };

    const applyTrackTransform = () => {
      track.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`;
    };

    const tick = (time: number) => {
      if (!isVisible) {
        frameId = null;
        return;
      }

      if (lastPaintTime && time - lastPaintTime < minFrameMs) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }
      lastPaintTime = time;

      if (!lastTime) {
        lastTime = time;
      }
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      offset += (baseSpeed + boostVelocity) * deltaSeconds;
      normalizeOffset();
      applyTrackTransform();

      boostVelocity *= Math.pow(0.94, deltaSeconds * 60);
      if (Math.abs(boostVelocity) < 0.2) {
        boostVelocity = 0;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (frameId !== null || !isVisible) return;
      lastTime = 0;
      lastPaintTime = 0;
      frameId = window.requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!isVisible) return;

      const horizontalDelta = event.deltaX;
      const absX = Math.abs(horizontalDelta);
      const absY = Math.abs(event.deltaY);

      // React only to near-pure horizontal gestures; never block normal page scroll.
      if (absX < 1.2 || absY > 0.6 || absX <= absY * 2) {
        return;
      }

      boostVelocity = clamp(boostVelocity + horizontalDelta * 0.48, -640, 640);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!isVisible || event.touches.length !== 1) {
        return;
      }
      const touch = event.touches[0];
      touchMode = "pending";
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchLastX = touch.clientX;
      touchLastTime = performance.now();
      boostVelocity = 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchMode === "idle" || event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];

      if (touchMode === "pending") {
        const totalX = touch.clientX - touchStartX;
        const totalY = touch.clientY - touchStartY;
        if (Math.abs(totalX) < 8 && Math.abs(totalY) < 8) {
          return;
        }
        if (Math.abs(totalX) <= Math.abs(totalY)) {
          touchMode = "vertical";
          return;
        }
        touchMode = "horizontal";
        stopAnimation();
      }

      if (touchMode !== "horizontal") {
        return;
      }

      event.preventDefault();
      const now = performance.now();
      const deltaX = touch.clientX - touchLastX;
      const deltaSeconds = Math.max((now - touchLastTime) / 1000, 1 / 120);

      offset -= deltaX;
      normalizeOffset();
      applyTrackTransform();

      boostVelocity = clamp((-deltaX / deltaSeconds) * 0.18, -640, 640);
      touchLastX = touch.clientX;
      touchLastTime = now;
    };

    const handleTouchEnd = () => {
      if (touchMode === "horizontal" && isVisible) {
        startAnimation();
      }
      touchMode = "idle";
    };

    recalculateWidth();
    const resizeObserver = new ResizeObserver(recalculateWidth);
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
        threshold: 0.05,
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

    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
    };
  }, [canAnimate, items.length]);

  const renderItems = canAnimate ? loopItems : items;

  return (
    <div
      ref={containerRef}
      className={`attractions-carousel relative mt-8 rounded-2xl ${
        canAnimate ? "overflow-hidden touch-pan-y" : "overflow-x-auto pb-2 snap-x snap-mandatory touch-auto"
      }`}
      style={canAnimate ? undefined : { scrollbarWidth: "none" }}
    >
      {canAnimate ? (
        <>
          <div
            className="attractions-edge-fade attractions-edge-fade-left pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#1a1f36] to-transparent sm:w-16"
            aria-hidden="true"
          />
          <div
            className="attractions-edge-fade attractions-edge-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#1a1f36] to-transparent sm:w-16"
            aria-hidden="true"
          />
        </>
      ) : null}

      <div
        ref={trackRef}
        className={`attractions-track flex min-w-max gap-4 py-2 sm:gap-5 ${
          canAnimate ? "will-change-transform" : "pr-4"
        }`}
      >
        {renderItems.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={`w-[300px] shrink-0 sm:w-[332px] lg:w-[352px] ${
              canAnimate ? "" : "snap-start"
            }`}
          >
            <AttractionCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
});
