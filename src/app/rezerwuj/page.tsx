"use client";

import { SolarIcon } from "@/app/components/SolarIcon";
import BookingLink from "@/app/components/BookingLink";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { useI18n } from "@/app/i18n-provider";
import { bookingHomeHref } from "@/lib/booking";
import { type Locale } from "@/lib/localizedRoutes";
import { ArrowCounterClockwise, Clock, Translate } from "@phosphor-icons/react";

const COPY: Record<
  Locale,
  {
    tag: string;
    title: string;
    subtitle: string;
    intro: string;
    multiTicketQuestion: string;
    cta: string;
    multiTicketHint: string;
    notesTitle: string;
    notesHeading: string;
    notes: string[];
    refundTitle: string;
    refundBody: string;
  }
> = {
  pl: {
    cta: "Kup bilet",
    tag: "Rezerwacja",
    title: "Zarezerwuj swoją filmową przygodę",
    subtitle: "Wybierz termin i zabezpiecz miejsce online.",
    multiTicketQuestion: "Kupujesz kilka biletów?",
    multiTicketHint: "Dodaj pierwszy, kolejne dorzucisz do koszyka w następnym kroku.",
    intro:
      "Przycisk poniżej otwiera kasę biletową z pełnym kalendarzem terminów.",
    notesTitle: "Ważne przed rezerwacją",
    notesHeading: "Najważniejsze informacje przed wyborem terminu",
    notes: [
      "Kino 360 trwa około 30 minut.",
      "Oprowadzanie po trasie „FILMWORLD” oraz Kino 360 odbywają się w języku polskim.",
    ],
    refundTitle: "Anulowanie i zwroty",
    refundBody:
      "W przypadku anulowania rezerwacji zwrot środków wraca do 14 dni roboczych na numer konta podany podczas zakładania rezerwacji.",
  },
  en: {
    cta: "Buy ticket",
    tag: "Booking",
    title: "Book your visit",
    subtitle: "Pick a date and secure your slot online.",
    multiTicketQuestion: "Booking more than one ticket?",
    multiTicketHint: "Add the first one, you can add the rest to the cart in the next step.",
    intro:
      "The button below opens the ticket shop with the full calendar of dates.",
    notesTitle: "Before you book",
    notesHeading: "Key details before choosing a date",
    notes: [
      "The K360 Cinema lasts about 30 minutes.",
      "The FILMWORLD guided tour and K360 Cinema screenings are available in Polish.",
    ],
    refundTitle: "Cancellations and refunds",
    refundBody:
      "If the booking is cancelled, the refund is returned within 14 business days to the account number provided when the reservation was created.",
  },
  pt: {
    cta: "Comprar bilhete",
    tag: "Reserva",
    title: "Reserva a tua visita",
    subtitle: "Escolhe a data e garante o teu lugar online.",
    multiTicketQuestion: "Vais levar mais do que um bilhete?",
    multiTicketHint: "Adiciona o primeiro, os restantes juntas ao carrinho no passo seguinte.",
    intro:
      "O botão abaixo abre a bilheteira com o calendário completo de datas.",
    notesTitle: "Antes de reservar",
    notesHeading: "Informações principais antes de escolher a data",
    notes: [
      "O cinema K360 dura cerca de 30 minutos.",
      "A visita guiada „FILMWORLD” e as sessões do cinema K360 decorrem em polaco.",
    ],
    refundTitle: "Cancelamentos e reembolsos",
    refundBody:
      "Em caso de cancelamento da reserva, o reembolso regressa no prazo de até 14 dias úteis para o número de conta indicado durante a criação da reserva.",
  },
  de: {
    cta: "Ticket kaufen",
    tag: "Buchung",
    title: "Buchen Sie Ihren Besuch",
    subtitle: "Wählen Sie einen Termin und sichern Sie sich Ihren Platz online.",
    multiTicketQuestion: "Buchen Sie mehr als ein Ticket?",
    multiTicketHint: "Fügen Sie das erste hinzu, die weiteren legen Sie im nächsten Schritt in den Warenkorb.",
    intro:
      "Die Schaltfläche unten öffnet den Ticketshop mit dem vollständigen Terminkalender.",
    notesTitle: "Vor der Buchung",
    notesHeading: "Die wichtigsten Informationen vor der Terminwahl",
    notes: [
      "Kino 360 dauert etwa 30 Minuten.",
      "Die Führung durch FILMWORLD und die Vorstellungen im Kino 360 finden auf Polnisch statt.",
    ],
    refundTitle: "Stornierung und Rückerstattung",
    refundBody:
      "Bei einer Stornierung der Reservierung wird der Betrag innerhalb von bis zu 14 Werktagen auf das Konto zurückerstattet, das bei der Buchung angegeben wurde.",
  },
  zh: {
    cta: "购买门票",
    tag: "预订",
    title: "预订您的参观",
    subtitle: "选择日期，在线锁定您的名额。",
    multiTicketQuestion: "需要预订多张门票？",
    multiTicketHint: "先添加第一张，其余可在下一步加入购物车。",
    intro:
      "点击下方按钮进入售票页面，可查看完整的日期日历。",
    notesTitle: "预订前须知",
    notesHeading: "选择日期前的重要信息",
    notes: [
      "Kino 360 影院约 30 分钟。",
      "FILMWORLD 导览与 Kino 360 影院放映均以波兰语进行。",
    ],
    refundTitle: "取消与退款",
    refundBody:
      "如取消预订，退款将在 14 个工作日内退回至创建预订时所提供的账号。",
  },
};

const noteIcons = [Clock, Translate];


export default function BookingPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];

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

          {/* Wskazówka o wielu biletach — pod kreską, NAD formularzem, bo dotyczy
              tego, co użytkownik zaraz zrobi. Wyróżniona obrysem w kolorze akcji,
              żeby nie zginęła w akapicie, ale bez wagi ostrzeżenia. */}
          <p className="mx-auto flex max-w-2xl items-start gap-2.5 rounded-2xl border border-[#4fcfde]/35 bg-[#4fcfde]/[0.07] px-4 py-3.5 text-left text-sm leading-relaxed text-white/85 sm:items-center">
            <span aria-hidden="true" className="mt-0.5 shrink-0 text-[#7ef6ff] sm:mt-0">
              <SolarIcon name="info" size="1.15em" />
            </span>
            <span>
              <span className="block font-semibold text-white">{copy.multiTicketQuestion}</span>
              <span className="block">{copy.multiTicketHint}</span>
            </span>
          </p>
        </header>

        {/* Osadzony formularz Bookero usunięty — sprzedaż przeszła do Iksorisa
            (bilety.alverniaplanet.com), który jest osobnym serwisem i nie da się
            go zagnieździć. Zamiast martwego kalendarza kierujemy tam wprost,
            tym samym przyciskiem co w nagłówku. */}
        <ScrollMotionItem strength="soft" delay={40} className="ap-deferred-section" float={false}>
          <div className="flex justify-center">
            <BookingLink
              href={bookingHomeHref(loc)}
              className="ticket-pill inline-flex h-[3.75rem] items-center justify-center gap-2.5 rounded-[var(--ap-btn-radius)] px-10 text-sm font-extrabold uppercase tracking-[0.16em] transition hover:-translate-y-px"
              style={{
                backgroundColor: "#56ddea",
                color: "#04222a",
                boxShadow: "0 6px 22px rgba(86,221,234,0.32)",
                borderColor: "transparent",
              }}
            >
              <SolarIcon name="ticket" size="1.3em" />
              {copy.cta}
            </BookingLink>
          </div>
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
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {copy.notes.map((note, index) => {
                    const NoteIcon = noteIcons[index] ?? Clock;

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
                  <ArrowCounterClockwise aria-hidden="true" />
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
