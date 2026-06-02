"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  K360_BOOKING_CATEGORY,
  K360_BOOKING_SERVICES,
} from "@/lib/booking";

type Locale = "pl" | "en" | "pt";

const HIDDEN_PATHS = new Set([
  "/rezerwuj",
  "/en/reserve",
  "/pt/reservar",
]);

const COPY: Record<Locale, { buy: string; alt: string }> = {
  pl: { buy: "Kup bilet", alt: "Maskotki Alver i Avlernia" },
  en: { buy: "Buy ticket", alt: "Mascots Alver and Avlernia" },
  pt: { buy: "Comprar bilhete", alt: "Mascotes Alver e Avlernia" },
};

export default function FloatingMascotCta() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];
  const pathname = usePathname();
  const isHiddenPath = HIDDEN_PATHS.has((pathname ?? "/").replace(/\/+$/, "") || "/");
  const bookingHref = buildBookingPath(loc, {
    category: K360_BOOKING_CATEGORY,
    service: K360_BOOKING_SERVICES.reduced,
    autopick: true,
  });

  const [visible, setVisible] = useState(false);
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const raf = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible || isHiddenPath) return null;

  return (
    <aside
      className={`pointer-events-none fixed right-4 top-1/2 z-[1140] hidden -translate-y-1/2 transition-all duration-700 ease-out lg:right-6 lg:block ${
        enter ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
      }`}
      aria-label={t.alt}
    >
      <div className="pointer-events-auto flex flex-col items-center gap-2 sm:gap-3">
        <Link
          href={bookingHref}
          className="group relative block transition-transform duration-300 hover:-translate-y-1"
          aria-label={t.buy}
        >
          <div className="ap-mascot-float relative h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40">
            <Image
              src="/Maskotki/Alver_avlernia.webp"
              alt={t.alt}
              fill
              sizes="(min-width: 1024px) 10rem, (min-width: 640px) 8rem, 6rem"
              className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.04]"
              priority={false}
            />
          </div>
        </Link>
        <Link
          href={bookingHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#ff7a3c] via-[#ff5544] to-[#ff3960] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_28px_rgba(255,90,60,0.45),0_0_18px_rgba(255,90,60,0.35)] transition hover:scale-[1.04] hover:brightness-110 sm:gap-2 sm:px-4 sm:py-2 sm:text-[0.72rem] lg:px-5 lg:py-2.5 lg:text-xs"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M9 5v14" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2" />
          </svg>
          {t.buy}
        </Link>
      </div>
    </aside>
  );
}
