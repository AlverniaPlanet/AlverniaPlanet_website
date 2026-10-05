"use client";

import Image from "next/image";
import BookingLink from "@/app/components/BookingLink";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { useI18n } from "@/app/i18n-provider";
import { type Locale } from "@/lib/localizedRoutes";
import { readConsent, CONSENT_CHANGE_EVENT } from "@/lib/consent";
import { buildBookingPath, FILM_NIGHT_BOOKING_SERVICE } from "@/lib/booking";
import { SolarIcon } from "./SolarIcon";

// „Wieczór Filmożerców" (14–15.08.2026) — pływająca karta plakatowa przy hero.
// Tło to zdjęcie kopuł Alvernii (public/wspolne/bumpery/promo-days-kino360.webp), a
// NAPISY (tytuł + oferta + sloty + CTA) są renderowane na żywo na wierzchu —
// dzięki temu są ostre na każdym ekranie, edytowalne i lekkie. Kolory 1:1 z
// plakatem kampanii: biel + cyan (zamiast złota z „Promo Days").
//
// ⚠️ DATA KOŃCA: karta znika sama po EVENT_PROMO_END (po ostatnim slocie 15.08).
// CTA otwiera rezerwację od razu na usłudze Bookero „Noc Filmożerców (49,00 zł)"
// (kategoria „Bilet indywidualny"), która udostępnia tylko daty wydarzenia i
// sloty 18:00 / 20:00. CZYTELNOŚĆ: pod tekstem mocny ciemny scrim.
const EVENT_PROMO_END = new Date("2026-08-15T23:59:59+02:00").getTime();
const DISMISS_KEY = "ap-filmnight-promo-dismissed";
const BG_SRC = "/wspolne/bumpery/promo-days-kino360.webp";

const HIDDEN_PATHS = new Set([
  "/rezerwuj",
  "/en/reserve",
  "/pt/reservar",
  "/aplikacje/identyfikacja",
  "/aplikacje/identyfikacja-online",
  "/aplikacje/mars-brief",
]);

// Kolory z plakatu: cyan na akcenty, biel na resztę.
const CYAN = "#3fc8ea";
const CYAN_GRADIENT = "linear-gradient(180deg,#9fe9fb 0%,#3fc8ea 55%,#17b0d6 100%)";
// Sam wyraz „Filmożerców" na jasny czerwony (życzenie kampanii); reszta cyan.
const RED_GRADIENT = "linear-gradient(180deg,#ff8a97 0%,#ff4658 52%,#f0223c 100%)";

type Slot = { label: string; time: string };

type EventCopy = {
  dates: string;
  titleTop: string; // biały wiersz
  titleBottom: string; // cyanowy wiersz
  offer: string;
  priceLead: string;
  price: string;
  currency: string;
  slots: [Slot, Slot];
  venue: string;
  cta: string;
  fine: string;
  close: string;
};

const COPY: Record<Locale, EventCopy> = {
  pl: {
    dates: "14–15 sierpnia 2026",
    titleTop: "Wieczór",
    titleBottom: "Filmożerców",
    offer: "3 filmy w cenie 1 filmu",
    priceLead: "Tylko",
    price: "49",
    currency: "zł",
    slots: [
      { label: "I slot", time: "18:00 – 19:45" },
      { label: "II slot", time: "20:00 – 21:45" },
    ],
    venue: "Największe Kino 360° fulldome w Europie",
    cta: "Kup bilet",
    fine: "Liczba miejsc ograniczona.",
    close: "Zamknij",
  },
  en: {
    dates: "14–15 August 2026",
    titleTop: "Movie Lovers'",
    titleBottom: "Night",
    offer: "3 films for the price of 1",
    priceLead: "Only",
    price: "49",
    currency: "PLN",
    slots: [
      { label: "Slot 1", time: "18:00 – 19:45" },
      { label: "Slot 2", time: "20:00 – 21:45" },
    ],
    venue: "Europe's largest 360° fulldome cinema",
    cta: "Buy a ticket",
    fine: "Limited seats available.",
    close: "Close",
  },
  pt: {
    dates: "14–15 de agosto de 2026",
    titleTop: "Noite dos",
    titleBottom: "Cinéfilos",
    offer: "3 filmes pelo preço de 1",
    priceLead: "Apenas",
    price: "49",
    currency: "PLN",
    slots: [
      { label: "Slot 1", time: "18:00 – 19:45" },
      { label: "Slot 2", time: "20:00 – 21:45" },
    ],
    venue: "O maior cinema 360° fulldome da Europa",
    cta: "Comprar bilhete",
    fine: "Lugares limitados.",
    close: "Fechar",
  },
  de: {
    dates: "14.–15. August 2026",
    titleTop: "Nacht der",
    titleBottom: "Filmfans",
    offer: "3 Filme zum Preis von 1",
    priceLead: "Nur",
    price: "49",
    currency: "PLN",
    slots: [
      { label: "1. Slot", time: "18:00 – 19:45" },
      { label: "2. Slot", time: "20:00 – 21:45" },
    ],
    venue: "Europas größtes 360°-Fulldome-Kino",
    cta: "Ticket kaufen",
    fine: "Begrenzte Platzzahl.",
    close: "Schließen",
  },
  zh: {
    dates: "2026年8月14–15日",
    titleTop: "影迷",
    titleBottom: "之夜",
    offer: "三部电影，只付一部的票价",
    priceLead: "仅需",
    price: "49",
    currency: "PLN",
    slots: [
      { label: "第一场", time: "18:00 – 19:45" },
      { label: "第二场", time: "20:00 – 21:45" },
    ],
    venue: "欧洲最大的 360° 全景穹幕影院",
    cta: "购买门票",
    fine: "座位有限。",
    close: "关闭",
  },
};

// Jeden kafel slotu: etykieta (cyan) u góry + godziny (biel) pod spodem.
function SlotTile({ slot }: { slot: Slot }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-[#3fc8ea]/45 bg-[linear-gradient(155deg,rgba(40,140,158,0.5)_0%,rgba(9,36,45,0.62)_100%)] px-2 py-2 backdrop-blur-sm">
      <span className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#8fe6f8] [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] sm:text-[0.64rem]">
        {slot.label}
      </span>
      <span className="whitespace-nowrap text-[0.82rem] font-extrabold leading-none text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)] sm:text-[0.92rem]">
        {slot.time}
      </span>
    </div>
  );
}

export default function SummerPromoBumper() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const c = COPY[loc];
  const pathname = usePathname();
  const isHiddenPath = HIDDEN_PATHS.has((pathname ?? "/").replace(/\/+$/, "") || "/");

  const [visible, setVisible] = useState(false);
  const [enter, setEnter] = useState(false);

  // Pokaż z lekkim opóźnieniem, po rozstrzygnięciu zgody na cookies (żeby na
  // telefonie nie nachodzić na baner RODO). Zamknięcie pamiętamy na czas sesji.
  useEffect(() => {
    if (Date.now() > EVENT_PROMO_END) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {}

    let timer: number | undefined;
    const start = () => {
      timer = window.setTimeout(() => setVisible(true), 1100);
    };

    if (readConsent() !== null) {
      start();
      return () => window.clearTimeout(timer);
    }

    const onConsent = () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, onConsent);
      start();
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onConsent);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, onConsent);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const raf = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible || isHiddenPath) return null;

  const dismiss = () => {
    setEnter(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    window.setTimeout(() => setVisible(false), 300);
  };

  // Klik → rezerwacja od razu na usłudze wydarzenia (Bookero pokaże daty 14–15.08
  // i sloty). autopick: widżet sam przechodzi przez kroki do wyboru terminu.
  const bookingHref = buildBookingPath(loc, {
    service: FILM_NIGHT_BOOKING_SERVICE,
  });

  const cyanTextStyle: CSSProperties = {
    color: CYAN,
    backgroundImage: CYAN_GRADIENT,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.6))",
  };

  const redTextStyle: CSSProperties = {
    color: "#ff4658",
    backgroundImage: RED_GRADIENT,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.6))",
  };

  return (
    <aside
      aria-label={`${c.titleTop} ${c.titleBottom}: ${c.offer}`}
      className={`pointer-events-none fixed inset-x-3 bottom-3 z-[1150] mx-auto max-w-[19rem] origin-bottom scale-[0.7] transition-all duration-500 ease-out sm:scale-100 lg:inset-x-auto lg:bottom-auto lg:right-6 lg:left-auto lg:top-1/2 lg:mx-0 lg:max-w-none lg:w-[21rem] lg:origin-right lg:-translate-y-1/2 lg:scale-[0.7] ${
        enter ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {/* DESKTOP (od sm): Alver po LEWEJ stronie karty, wskazuje ręką w prawo
          na treść. Poza kartą (overflow-hidden), więc jako rodzeństwo. */}
      <Image
        src="/wspolne/bumpery/alver-promodays.webp"
        alt=""
        aria-hidden="true"
        width={480}
        height={1120}
        className="pointer-events-none absolute left-0 top-1/2 z-30 hidden h-auto w-[10rem] -translate-x-[92%] -translate-y-[57%] drop-shadow-[0_12px_26px_rgba(0,0,0,0.6)] sm:block"
      />
      {/* MOBILE (do sm): Alver U GÓRY karty, wskazuje palcem w DÓŁ na treść.
          Sterczy nad kartą; palec ląduje przy górnej krawędzi. */}
      <Image
        src="/wspolne/bumpery/alver-top.webp"
        alt=""
        aria-hidden="true"
        width={520}
        height={923}
        className="pointer-events-none absolute left-1/2 top-0 z-30 h-auto w-[6.5rem] -translate-x-1/2 -translate-y-[84%] drop-shadow-[0_10px_22px_rgba(0,0,0,0.55)] sm:hidden"
      />
      <div className="pointer-events-auto relative overflow-hidden rounded-2xl border border-[#3fc8ea]/35 shadow-[0_26px_70px_rgba(0,0,0,0.6)]">
        {/* Tło: zdjęcie kopuł Alvernii */}
        <Image
          src={BG_SRC}
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width: 1024px) 21rem, 19rem"
          className="object-cover object-center"
        />
        {/* Scrim czytelności: ciemniej u góry (pod tytułem) i u dołu (pod CTA) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(2,6,14,0.84) 0%, rgba(2,6,14,0.5) 26%, rgba(2,6,14,0.52) 48%, rgba(2,6,14,0.72) 72%, rgba(2,6,14,0.92) 100%)",
          }}
        />

        {/* Zamknij */}
        <button
          type="button"
          onClick={dismiss}
          aria-label={c.close}
          className="absolute right-2.5 top-2.5 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white/75 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-black/70 hover:text-white"
        >
          <SolarIcon name="close" className="h-3.5 w-3.5" weight="bold" />
        </button>

        {/* Treść */}
        <div className="relative flex flex-col items-center px-4 pb-4 pt-4 text-center sm:px-5 sm:pb-5 sm:pt-5">
          {/* Data */}
          <p
            className="text-[0.64rem] font-bold uppercase tracking-[0.18em] sm:text-[0.72rem]"
            style={cyanTextStyle}
          >
            {c.dates}
          </p>

          {/* Tytuł: biały wiersz + cyanowy wiersz */}
          <h2 className="mt-1 flex flex-col leading-[0.9]">
            <span className="text-[1.3rem] font-extrabold uppercase tracking-[0.01em] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.7)] sm:text-[1.6rem]">
              {c.titleTop}
            </span>
            <span
              className="text-[1.6rem] font-extrabold uppercase tracking-[-0.01em] sm:text-[2rem]"
              style={redTextStyle}
            >
              {c.titleBottom}
            </span>
          </h2>

          {/* Oferta + cena */}
          <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-white [text-shadow:0_1px_5px_rgba(0,0,0,0.75)] sm:text-[0.8rem]">
            {c.offer}
          </p>
          <div className="mt-1.5 inline-flex items-baseline gap-1.5 rounded-full bg-[#3fc8ea] px-4 py-1 text-[#062430] shadow-[0_10px_24px_rgba(63,200,234,0.4)]">
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.12em]">{c.priceLead}</span>
            <span className="text-[1.35rem] font-extrabold leading-none">{c.price}</span>
            <span className="text-[0.66rem] font-extrabold uppercase">{c.currency}</span>
          </div>

          {/* Dwa sloty */}
          <div className="mt-3.5 grid w-full grid-cols-2 gap-2">
            <SlotTile slot={c.slots[0]} />
            <SlotTile slot={c.slots[1]} />
          </div>

          {/* Miejsce */}
          <p className="mt-3 text-balance text-[0.62rem] font-semibold uppercase leading-snug tracking-[0.08em] text-white/85 sm:text-[0.68rem]">
            {c.venue}
          </p>

          {/* CTA */}
          <BookingLink
            href={bookingHref}
            onClick={dismiss}
            className="mt-3 flex w-full items-center justify-center rounded-[var(--ap-btn-radius)] px-5 py-2.5 text-[0.82rem] font-extrabold uppercase tracking-[0.1em] text-[#04222c] shadow-[0_12px_28px_rgba(63,200,234,0.45)] transition hover:brightness-105"
            style={{ backgroundImage: "linear-gradient(135deg,#2fbfe0,#8fe6f8,#2fbfe0)" }}
          >
            {c.cta}
          </BookingLink>

          <p className="mt-2.5 text-[0.54rem] leading-snug text-white/55">{c.fine}</p>
        </div>
      </div>
    </aside>
  );
}
