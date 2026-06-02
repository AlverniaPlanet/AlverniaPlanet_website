"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  K360_MARS_PREMIERE_BOOKING_CATEGORY,
  K360_MARS_PREMIERE_BOOKING_SERVICES,
} from "@/lib/booking";

type Locale = "pl" | "en" | "pt";

// Pakiet przedpremierowy dostępny tylko w weekend 23–24.05.2026 — po niedzieli baner znika sam.
const PROMO_END = new Date("2026-05-25T00:00:00+02:00").getTime();
const MARS_PATH = "/atrakcje/mars";

const HIDDEN_PATHS = new Set([
  "/rezerwuj",
  "/en/reserve",
  "/pt/reservar",
]);

const COPY: Record<
  Locale,
  {
    live: string;
    eyebrow: string;
    tagline: string;
    pkg: string;
    desc: string;
    price: string;
    ctaBook: string;
    ctaMore: string;
  }
> = {
  pl: {
    live: "W trakcie",
    eyebrow: "Pakiet przedpremierowy",
    tagline: "Bądź pierwszy na Marsie!",
    pkg: "K360 + Projekt: MARS",
    desc: "Wersja przedpremierowa dostępna tylko w ten weekend — sobota i niedziela.",
    price: "od 64 zł",
    ctaBook: "Rezerwuj",
    ctaMore: "Dowiedz się więcej",
  },
  en: {
    live: "Live now",
    eyebrow: "Pre-release package",
    tagline: "Be the first on Mars!",
    pkg: "K360 + Mars Project",
    desc: "The pre-release version is available this weekend only — Saturday and Sunday.",
    price: "from 64 PLN",
    ctaBook: "Book now",
    ctaMore: "Learn more",
  },
  pt: {
    live: "A decorrer",
    eyebrow: "Pacote de pré-estreia",
    tagline: "Sê o primeiro em Marte!",
    pkg: "K360 + Projeto MARS",
    desc: "A versão de pré-estreia está disponível apenas neste fim de semana — sábado e domingo.",
    price: "desde 64 PLN",
    ctaBook: "Reservar",
    ctaMore: "Saber mais",
  },
};

export default function FloatingDemoPromo() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];
  const pathname = usePathname();
  const isHiddenPath = HIDDEN_PATHS.has((pathname ?? "/").replace(/\/+$/, "") || "/");

  const [visible, setVisible] = useState(false);
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    if (Date.now() > PROMO_END) return;
    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const raf = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible || isHiddenPath) return null;

  const bookingHref = buildBookingPath(loc, {
    category: K360_MARS_PREMIERE_BOOKING_CATEGORY,
    service: K360_MARS_PREMIERE_BOOKING_SERVICES.normal,
  });

  return (
    <aside
      className={`pointer-events-none fixed inset-x-3 bottom-3 z-[1150] transition-all duration-500 ease-out lg:inset-x-auto lg:bottom-auto lg:left-6 lg:top-1/2 lg:w-[25rem] lg:-translate-y-1/2 ${
        enter ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="pointer-events-auto relative origin-bottom scale-75 overflow-hidden rounded-2xl border border-[#7ef6ff]/30 bg-[#0a1622]/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-5 lg:scale-100 lg:rounded-3xl lg:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,120,40,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(247,72,108,0.10),transparent_32%)]" />

        {/* Grafika Marsa */}
        <Image
          src="/mars/Mars-planet.png"
          alt=""
          aria-hidden="true"
          width={200}
          height={200}
          className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 select-none opacity-80 drop-shadow-[0_0_26px_rgba(255,120,60,0.5)] lg:-bottom-10 lg:-right-10 lg:h-44 lg:w-44"
        />

        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff8a3c] opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#ff8a3c] shadow-[0_0_14px_rgba(255,138,60,1)]" />
            </span>
            <span className="text-[0.82rem] font-bold uppercase tracking-[0.22em] text-[#ffb27a] lg:text-[0.92rem]">
              {t.live}
            </span>
          </div>

          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#ff6f91]/45 bg-[#ff6f91]/12 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#ff9db2] lg:mt-2.5 lg:px-3 lg:py-1.5 lg:text-[0.66rem]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff6f91]" />
            {t.eyebrow}
          </span>

          <h3 className="mt-2.5 pr-2 text-[1.35rem] font-bold leading-[1.1] tracking-[-0.025em] text-white lg:mt-3 lg:text-[1.7rem]">
            {t.tagline}
          </h3>
          <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7ef6ff]/85 lg:text-[0.82rem]">
            {t.pkg}
          </p>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-white/72 lg:mt-2.5 lg:max-w-[19rem] lg:text-[0.92rem]">
            {t.desc}
          </p>
          <p className="mt-1.5 text-[0.82rem] font-semibold text-[#7ef6ff] lg:text-[0.98rem]">
            {t.price}
          </p>

          <div className="mt-3.5 flex flex-row gap-2 lg:mt-4 lg:flex-col lg:gap-2.5">
            <Link
              href={bookingHref}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-[#7ef6ff] px-3 py-2.5 text-center text-[0.8rem] font-bold text-[#06121a] shadow-[0_0_22px_rgba(126,246,255,0.35)] transition hover:bg-white lg:flex-none lg:px-4 lg:py-3 lg:text-[0.95rem]"
            >
              {t.ctaBook}
            </Link>
            <Link
              href={MARS_PATH}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-[#7ef6ff]/40 bg-white/[0.05] px-3 py-2.5 text-center text-[0.8rem] font-semibold text-[#7ef6ff] transition hover:border-[#7ef6ff]/70 hover:bg-white/[0.1] lg:flex-none lg:px-4 lg:py-3 lg:text-[0.95rem]"
            >
              {t.ctaMore}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
