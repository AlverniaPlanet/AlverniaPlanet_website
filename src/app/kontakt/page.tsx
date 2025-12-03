"use client";

import { motion, type Variants } from "framer-motion";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";

const PHONE_BOOKING = "+48 723 999 099";
const MAIL_BOOKING = "b.jacon@gremi.pl";
const PHONE_INFO = "+48 12 344 40 00";
const MAIL_INFO = "rezerwacjeap@gremi.pl";
const MAIL_CEO = "j.wisniowska@gremi.pl";
const MAIL_MOB = "g.sitko@gremi.pl";
const MAIL_EVENTS = "b.jacon@gremi.pl";
const MAIL_EVENTS_SECOND = "k.krukowski@gremi.pl";
const PHONE_EVENTS_SECOND = "+48 535 944 904";
const BOOKING_URL = "https://alverniaplanet.bookero.pl";

type Locale = "pl" | "en";

const COPY: Record<
  Locale,
  {
    heroTitle: string;
    info: { title: string; description: string; phoneLabel: string; hoursLabel: string; emailLabel: string };
    booking: {
      title: string;
      description: string;
      caretakerLabel: string;
      caretakerName: string;
      onlineTitle: string;
      onlineDescription: string;
      button: string;
    };
    events: {
      title: string;
      description: string;
      contactLabel: string;
      primaryName: string;
      secondaryName: string;
    };
    board: {
      title: string;
      ceoLabel: string;
      mobLabel: string;
    };
    map: {
      title: string;
      subtitle: string;
    };
  }
> = {
  pl: {
    heroTitle: "Skontaktuj się z nami",
    info: {
      title: "Infolinia",
      description: "Aktualne informacje o godzinach otwarcia, dostępności atrakcji i biletach.",
      phoneLabel: "Telefon",
      hoursLabel: "Godziny: 8:00 – 16:00",
      emailLabel: "Email",
    },
    booking: {
      title: "Rezerwacje i grupy",
      description: "Planowanie wizyty, bilety grupowe oraz program dnia.",
      caretakerLabel: "Opiekun",
      caretakerName: "Bartłomiej Jacoń",
      onlineTitle: "Rezerwacja online",
      onlineDescription: "Wybierz termin i liczbę osób — potwierdzimy rezerwację na maila.",
      button: "Otwórz kalendarz rezerwacji",
    },
    events: {
      title: "Eventy i produkcje",
      description: "Wsparcie przy eventach, produkcjach i sesjach zdjęciowych.",
      contactLabel: "Kontakt",
      primaryName: "Bartłomiej Jacoń",
      secondaryName: "Krzysztof Krukowski",
    },
    board: {
      title: "Zarząd",
      ceoLabel: "CEO",
      mobLabel: "MOB",
    },
    map: {
      title: "Jak nas znaleźć",
      subtitle: "Sprawdź lokalizację Alvernia Planet na mapie Google.",
    },
  },
  en: {
    heroTitle: "Contact us",
    info: {
      title: "Info line",
      description: "Current details on opening hours, attraction availability, and tickets.",
      phoneLabel: "Phone",
      hoursLabel: "Hours: 8:00 – 16:00",
      emailLabel: "Email",
    },
    booking: {
      title: "Bookings and groups",
      description: "Visit planning, group tickets, and day schedules.",
      caretakerLabel: "Coordinator",
      caretakerName: "Bartłomiej Jacoń",
      onlineTitle: "Online booking",
      onlineDescription: "Pick a date and headcount—we’ll confirm your reservation by email.",
      button: "Open booking calendar",
    },
    events: {
      title: "Events and productions",
      description: "Support for events, productions, and photo shoots.",
      contactLabel: "Contact",
      primaryName: "Bartłomiej Jacoń",
      secondaryName: "Krzysztof Krukowski",
    },
    board: {
      title: "Management",
      ceoLabel: "CEO",
      mobLabel: "MOB",
    },
    map: {
      title: "Find us",
      subtitle: "See Alvernia Planet’s location on Google Maps.",
    },
  },
};

// Animations (spójne z resztą)
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.7408423639026!2d19.54447167658207!3d50.10226631237267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716f227b90ec1a1%3A0xbd1dbadc60237cc3!2sAlvernia%20Planet!5e1!3m2!1spl!2spl!4v1764111356358!5m2!1spl!2spl";

export default function KontaktPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];

  return (
    <main className="relative z-10 text-white px-4 py-12 flex-1 flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col gap-12">
        {/* Nagłówek */}
        <section className="mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.h1
              className="text-5xl sm:text-6xl font-extrabold tracking-tight"
              variants={fadeUp}
            >
              {copy.heroTitle}
            </motion.h1>
          </motion.div>
        </section>

        {/* Karty kontaktowe 3 kolumny */}
        <section className="mx-auto w-full max-w-6xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            {/* Infolinia */}
            <motion.div variants={fadeUp}>
              <Card variant="solid" className="h-full flex flex-col gap-4 text-center items-center">
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-2xl font-semibold">{copy.info.title}</h2>
                </div>
                <div className="h-[1px] w-full bg-white/15" />
                <p className="text-sm text-gray-300">
                  {copy.info.description}
                </p>
                <div className="w-full space-y-2 rounded-2xl bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.info.phoneLabel}</p>
                  <p className="text-lg font-semibold">{formatPhone(PHONE_INFO)}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">{copy.info.hoursLabel}</p>
                </div>
                <div className="w-full space-y-2 rounded-2xl border border-white/10 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.info.emailLabel}</p>
                  <p className="font-semibold text-amber-200">{MAIL_INFO}</p>
                </div>
              </Card>
            </motion.div>

            {/* Rezerwacje i grupy */}
            <motion.div variants={fadeUp}>
              <Card variant="solid" className="h-full flex flex-col gap-4 text-center items-center">
                <h2 className="text-2xl font-semibold">{copy.booking.title}</h2>
                <div className="h-[1px] w-full bg-white/15" />
                <p className="text-sm text-gray-300">
                  {copy.booking.description}
                </p>
                <div className="w-full space-y-3 rounded-2xl bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.booking.caretakerLabel}</p>
                  <div>
                    <p className="font-semibold">{copy.booking.caretakerName}</p>
                    <p className="text-gray-300">{formatPhone(PHONE_BOOKING)}</p>
                    <p className="text-amber-200">{MAIL_BOOKING}</p>
                  </div>
                </div>
                <div className="w-full rounded-2xl border border-violet-300/30 bg-violet-500/10 p-4">
                  <p className="text-sm font-semibold text-violet-100">{copy.booking.onlineTitle}</p>
                  <p className="text-sm text-gray-200">
                    {copy.booking.onlineDescription}
                  </p>
                  <PrimaryButton
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    className="mt-3 w-full justify-center bg-violet-500 hover:bg-violet-400 text-white"
                  >
                    {copy.booking.button}
                  </PrimaryButton>
                </div>
              </Card>
            </motion.div>

            {/* Eventy i produkcje */}
            <motion.div variants={fadeUp}>
              <Card variant="solid" className="h-full flex flex-col gap-4 text-center items-center">
                <h2 className="text-2xl font-semibold">{copy.events.title}</h2>
                <div className="h-[1px] w-full bg-white/15" />
                <p className="text-sm text-gray-300">
                  {copy.events.description}
                </p>
                <div className="w-full space-y-3 rounded-2xl bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.events.contactLabel}</p>
                  <div className="space-y-1">
                    <p className="font-semibold">{copy.events.primaryName}</p>
                    <p className="text-gray-300">{formatPhone(PHONE_BOOKING)}</p>
                    <p className="text-amber-200">{MAIL_EVENTS}</p>
                  </div>
                  <hr className="border-white/10" />
                  <div className="space-y-1">
                    <p className="font-semibold">{copy.events.secondaryName}</p>
                    <p className="text-gray-300">{formatPhone(PHONE_EVENTS_SECOND)}</p>
                    <p className="text-amber-200">{MAIL_EVENTS_SECOND}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Zarząd */}
        <section className="mx-auto w-full max-w-6xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <Card className="bg-black/60">
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-semibold text-center">{copy.board.title}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center sm:text-left">
                    <p className="text-sm uppercase tracking-[0.18em] text-white/60">{copy.board.ceoLabel}</p>
                    <p className="font-semibold text-white">Jadwiga Wiśniowska</p>
                    <p className="text-amber-200">{MAIL_CEO}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center sm:text-left">
                    <p className="text-sm uppercase tracking-[0.18em] text-white/60">{copy.board.mobLabel}</p>
                    <p className="font-semibold text-white">Grzegorz Sitko</p>
                    <p className="text-amber-200">{MAIL_MOB}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Mapa */}
        <section className="mx-auto w-full max-w-6xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <Card title={copy.map.title} titleCentered titleDivider>
              <p className="text-center text-gray-300">{copy.map.subtitle}</p>
              <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/40">
                <div className="relative w-full pb-[56.25%] sm:pb-[45%]">
                  <iframe
                    title={copy.map.title}
                    src={MAP_EMBED_SRC}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full border-0"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");

  if (/^48\d{9}$/.test(digits)) {
    const local = digits.slice(2);
    return `+48 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 9)}`;
  }

  if (/^\d{9}$/.test(digits)) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }

  return raw.trim();
}
