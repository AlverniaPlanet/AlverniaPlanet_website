"use client";

import Image from "next/image";
import BookingLink from "@/app/components/BookingLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/i18n-provider";
import {
  ALL_ATTRACTIONS_BOOKING_SERVICES,
  buildBookingPath,
} from "@/lib/booking";
import { type Locale } from "@/lib/localizedRoutes";
import { SolarIcon } from "./SolarIcon";

const HIDDEN_PATHS = new Set([
  "/rezerwuj",
  "/en/reserve",
  "/pt/reservar",
  "/de/reserve",
  "/zh/reserve",
  "/aplikacje/identyfikacja",
  "/aplikacje/mars-brief",
]);

const COPY: Record<Locale, { buy: string; alt: string }> = {
  pl: { buy: "Rozpocznij przygodę", alt: "Maskotki Alver i Avlernia" },
  en: { buy: "Start the adventure", alt: "Mascots Alver and Avlernia" },
  pt: { buy: "Começa a aventura", alt: "Mascotes Alver e Avlernia" },
  de: { buy: "Abenteuer starten", alt: "Maskottchen Alver und Avlernia" },
  zh: { buy: "开启冒险之旅", alt: "吉祥物 Alver 和 Avlernia" },
};

export default function FloatingMascotCta() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = COPY[loc];
  const pathname = usePathname();
  const isHiddenPath = HIDDEN_PATHS.has((pathname ?? "/").replace(/\/+$/, "") || "/");
  const bookingHref = buildBookingPath(loc, {
    service: ALL_ATTRACTIONS_BOOKING_SERVICES.reduced,
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
        <BookingLink
          href={bookingHref}
          className="group relative block transition-transform duration-300 hover:-translate-y-1"
          aria-label={t.buy}
        >
          <div className="ap-mascot-float relative h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40">
            <Image
              src="/wspolne/maskotki/Alver_avlernia.webp"
              alt={t.alt}
              fill
              sizes="(min-width: 1024px) 10rem, (min-width: 640px) 8rem, 6rem"
              className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.04]"
              priority={false}
            />
          </div>
        </BookingLink>
        <BookingLink
          href={bookingHref}
          className="inline-flex items-center gap-1.5 rounded-[var(--ap-btn-radius)] bg-gradient-to-br from-[#ff7a3c] via-[#ff5544] to-[#ff3960] px-3 py-1.5 text-[0.65rem] font-bold uppercase leading-tight tracking-[0.11em] text-white shadow-[0_12px_28px_rgba(255,90,60,0.45),0_0_18px_rgba(255,90,60,0.35)] transition hover:scale-[1.04] hover:brightness-110 sm:gap-2 sm:px-4 sm:py-2 sm:text-[0.72rem] lg:px-4 lg:py-2.5 lg:text-xs"
        >
          <SolarIcon name="ticket" size={14} />
          <span className="max-w-[5.5rem] text-center">{t.buy}</span>
        </BookingLink>
      </div>
    </aside>
  );
}
