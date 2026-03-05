"use client";

import Card from "@/app/components/Card";
import BookeroEmbed from "@/app/components/BookeroEmbed";
import { useI18n } from "@/app/i18n-provider";

const BOOKERO_PLUGIN_ID = "8iWKMAEWtI0P";

type Locale = "pl" | "en" | "pt";

const COPY: Record<
  Locale,
  {
    tag: string;
    title: string;
    subtitle: string;
    intro: string;
  }
> = {
  pl: {
    tag: "Rezerwacja",
    title: "Zarezerwuj swoją filmową przygodę",
    subtitle: "Wybierz termin i zabezpiecz miejsce online.",
    intro:
      "Poniżej znajdziesz formularz Bookero z pełnym kalendarzem. Rezerwację możesz zrobić od razu, bez czekania na kontakt zwrotny.",
  },
  en: {
    tag: "Booking",
    title: "Book your cinematic adventure",
    subtitle: "Pick a date and secure your slot online.",
    intro:
      "Use the Bookero form below with the full calendar view. You can complete the reservation immediately.",
  },
  pt: {
    tag: "Reserva",
    title: "Reserva a tua aventura cinematográfica",
    subtitle: "Escolhe a data e garante o teu lugar online.",
    intro:
      "Abaixo tens o formulário Bookero com calendário completo. Podes finalizar a reserva imediatamente.",
  },
};

export default function BookingPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const bookeroLang = loc === "en" ? "en" : "pl";
  const copy = COPY[loc];

  return (
    <main className="relative min-h-screen text-white px-4 py-12 sm:py-16">
      <div className="ap-shell ap-page-stack">
        <header className="text-center space-y-5">
          <p className="ap-type-kicker">{copy.tag}</p>
          <h1 className="ap-type-hero-title">{copy.title}</h1>
          <p className="ap-type-hero-subtitle max-w-5xl mx-auto">
            {copy.subtitle} {copy.intro}
          </p>
          <div className="h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </header>

        <Card id="bookero-form" variant="solid" className="relative overflow-hidden" motion="off">
          <BookeroEmbed
            pluginId={BOOKERO_PLUGIN_ID}
            containerId="bookero"
            type="standard"
            position=""
            pluginCss
            lang={bookeroLang}
            className="w-full min-h-[980px] overflow-hidden rounded-2xl bg-white ring-1 ring-black/10"
          />
        </Card>
      </div>
    </main>
  );
}
