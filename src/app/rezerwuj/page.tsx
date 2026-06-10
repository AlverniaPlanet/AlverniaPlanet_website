"use client";

import Card from "@/app/components/Card";
import BookeroEmbed from "@/app/components/BookeroEmbed";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { useI18n } from "@/app/i18n-provider";
import {
  BOOKING_AUTOPICK_PARAM,
  BOOKING_CATEGORY_PARAM,
  BOOKING_QUANTITY_PARAM,
  BOOKING_SERVICE_PARAM,
} from "@/lib/booking";
import { useSearchParams } from "next/navigation";
import { FaClock, FaLanguage, FaRoute, FaRotateLeft } from "react-icons/fa6";

const BOOKERO_PLUGIN_ID = "8iWKMAEWtI0P";

type Locale = "pl" | "en" | "pt";

const COPY: Record<
  Locale,
  {
    tag: string;
    title: string;
    subtitle: string;
    intro: string;
    notesTitle: string;
    notesHeading: string;
    notes: string[];
    refundTitle: string;
    refundBody: string;
  }
> = {
  pl: {
    tag: "Rezerwacja",
    title: "Zarezerwuj swoją filmową przygodę",
    subtitle: "Wybierz termin i zabezpiecz miejsce online.",
    intro:
      "Poniżej znajdziesz formularz Bookero z pełnym kalendarzem. Rezerwację możesz zrobić od razu, bez czekania na kontakt zwrotny.",
    notesTitle: "Ważne przed rezerwacją",
    notesHeading: "Najważniejsze informacje przed wyborem terminu",
    notes: [
      "Kino K360 trwa około 30 minut.",
      "Oprowadzanie Ścieżki filmowej oraz projekcje K360 odbywają się w języku polskim.",
      "Zwiedzanie Ścieżki filmowej trwa około 2,5 godziny.",
    ],
    refundTitle: "Anulowanie i zwroty",
    refundBody:
      "W przypadku anulowania rezerwacji zwrot środków wraca do 14 dni roboczych na numer konta podany podczas zakładania rezerwacji.",
  },
  en: {
    tag: "Booking",
    title: "Book your visit",
    subtitle: "Pick a date and secure your slot online.",
    intro:
      "Use the Bookero form below with the full calendar view. You can complete the reservation immediately.",
    notesTitle: "Before you book",
    notesHeading: "Key details before choosing a date",
    notes: [
      "The K360 Cinema lasts about 30 minutes.",
      "The Film Path guided tour and K360 Cinema screenings are available in Polish.",
      "The Film Path visit lasts about 2.5 hours.",
    ],
    refundTitle: "Cancellations and refunds",
    refundBody:
      "If the booking is cancelled, the refund is returned within 14 business days to the account number provided when the reservation was created.",
  },
  pt: {
    tag: "Reserva",
    title: "Reserva a tua visita",
    subtitle: "Escolhe a data e garante o teu lugar online.",
    intro:
      "Abaixo tens o formulário Bookero com calendário completo. Podes finalizar a reserva imediatamente.",
    notesTitle: "Antes de reservar",
    notesHeading: "Informações principais antes de escolher a data",
    notes: [
      "A cinema K360 dura cerca de 30 minutos.",
      "A visita guiada do Percurso de filmagem e as sessões da cinema K360 decorrem em polaco.",
      "A visita ao Percurso de filmagem dura cerca de 2,5 horas.",
    ],
    refundTitle: "Cancelamentos e reembolsos",
    refundBody:
      "Em caso de cancelamento da reserva, o reembolso regressa no prazo de até 14 dias úteis para o número de conta indicado durante a criação da reserva.",
  },
};

const noteIcons = [FaClock, FaLanguage, FaRoute];

export default function BookingPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const bookeroLang = loc === "en" ? "en" : "pl";
  const copy = COPY[loc];
  const searchParams = useSearchParams();
  const preselectCategory = searchParams.get(BOOKING_CATEGORY_PARAM) ?? "";
  const preselectService = searchParams.get(BOOKING_SERVICE_PARAM) ?? "";
  const preselectQuantityValue = Number.parseInt(searchParams.get(BOOKING_QUANTITY_PARAM) ?? "", 10);
  const preselectQuantity = Number.isFinite(preselectQuantityValue) ? preselectQuantityValue : undefined;
  const autoPickEarliestSlot = searchParams.get(BOOKING_AUTOPICK_PARAM) === "1";

  return (
    <main className="relative min-h-screen text-white px-4 py-12 sm:py-16 ap-page-intro-stagger">
      <div className="ap-shell ap-page-stack">
        <header className="text-center space-y-5">
          <p className="ap-type-kicker">{copy.tag}</p>
          <h1 className="ap-type-hero-title">{copy.title}</h1>
          <p className="ap-type-hero-subtitle max-w-5xl mx-auto">
            {copy.subtitle} {copy.intro}
          </p>
          <div className="h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </header>

        <ScrollMotionItem strength="soft" delay={40} className="ap-deferred-section" float={false}>
          <Card
            id="bookero-form"
            variant="solid"
            className="relative overflow-hidden !bg-white !ring-black/10"
            motion="off"
          >
            <BookeroEmbed
              pluginId={BOOKERO_PLUGIN_ID}
              containerId="bookero"
              type="calendar"
              position=""
              pluginCss
              lang={bookeroLang}
              preselectCategory={preselectCategory}
              preselectService={preselectService}
              preselectQuantity={preselectQuantity}
              autoPickEarliestSlot={autoPickEarliestSlot}
              className="w-full min-h-[980px] overflow-hidden rounded-2xl bg-white ring-1 ring-black/10"
            />
          </Card>
        </ScrollMotionItem>

        <ScrollMotionItem strength="soft" delay={90} className="ap-deferred-section" float={false}>
          <section
            aria-labelledby="booking-notes-title"
            className="relative overflow-hidden rounded-[2rem] border border-[#4fcfde]/28 bg-[radial-gradient(circle_at_12%_0%,rgba(79,207,222,0.18),transparent_30%),linear-gradient(135deg,rgba(31,35,62,0.96),rgba(18,20,42,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-white/8 sm:p-6 lg:p-7"
          >
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#4fcfde]/70 to-transparent" />
            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.55fr)] lg:items-stretch">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#4fcfde]">
                  {copy.notesTitle}
                </p>
                <h2 id="booking-notes-title" className="mt-2 max-w-3xl text-2xl font-bold leading-tight text-white sm:text-3xl">
                  {copy.notesHeading}
                </h2>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {copy.notes.map((note, index) => {
                    const NoteIcon = noteIcons[index] ?? FaClock;

                    return (
                      <div
                        key={note}
                        className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-inner shadow-white/[0.03]"
                      >
                        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#4fcfde]/14 text-[#67e7f1] ring-1 ring-[#4fcfde]/28">
                          <NoteIcon aria-hidden="true" />
                        </span>
                        <p className="text-sm leading-relaxed text-white/84">{note}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="relative overflow-hidden rounded-3xl border border-[#f03c64]/34 bg-[#f03c64]/12 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f03c64]/18 blur-2xl" />
                <span className="relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f03c64]/18 text-[#ff9ab0] ring-1 ring-[#f03c64]/35">
                  <FaRotateLeft aria-hidden="true" />
                </span>
                <p className="relative text-sm font-semibold uppercase tracking-[0.24em] text-[#ff9ab0]">
                  {copy.refundTitle}
                </p>
                <p className="relative mt-3 text-sm leading-relaxed text-white/84">{copy.refundBody}</p>
              </aside>
            </div>
          </section>
        </ScrollMotionItem>
      </div>
    </main>
  );
}
