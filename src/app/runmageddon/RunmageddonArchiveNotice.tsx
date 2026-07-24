"use client";

import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";

// Strona archiwalna Runmageddonu renderowała się jako całkowicie pusta
// (return null) — użytkownik ze starego linku widział czarny ekran,
// a Google stronę bez H1 i treści. Minimalna notka archiwalna daje
// obu stronom coś sensownego, bez przywracania starej podstrony.
const COPY: Record<
  Locale,
  { kicker: string; title: string; body: string; cta: string }
> = {
  pl: {
    kicker: "Archiwum wydarzeń",
    title: "Runmageddon Kraków Alvernia Planet",
    body: "Wydarzenie z 09-12 kwietnia 2026 dobiegło końca. Zapisy i aktywności specjalne są zamknięte. Dziękujemy wszystkim uczestnikom!",
    cta: "Zobacz aktualne atrakcje",
  },
  en: {
    kicker: "Event archive",
    title: "Runmageddon Kraków Alvernia Planet",
    body: "The event of 09-12 April 2026 has ended. Registration and special activities are closed. Thank you to everyone who took part!",
    cta: "See current attractions",
  },
  pt: {
    kicker: "Arquivo de eventos",
    title: "Runmageddon Cracóvia Alvernia Planet",
    body: "O evento de 09 a 12 de abril de 2026 terminou. As inscrições e as atividades especiais estão encerradas. Obrigado a todos os participantes!",
    cta: "Ver as atrações atuais",
  },
};

export default function RunmageddonArchiveNotice() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const copy = COPY[loc];
  const homeHref = getLocalizedPath("/", loc);

  return (
    <main className="relative flex min-h-[70vh] items-center px-4 py-16 text-white sm:py-20">
      <div className="ap-shell max-w-3xl space-y-6 text-center">
        <p className="ap-type-kicker">{copy.kicker}</p>
        <h1 className="ap-type-hero-title">{copy.title}</h1>
        <p className="ap-type-hero-subtitle mx-auto max-w-2xl">{copy.body}</p>
        <div className="flex justify-center pt-2">
          <PrimaryButton href={homeHref}>{copy.cta}</PrimaryButton>
        </div>
      </div>
    </main>
  );
}
