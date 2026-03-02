"use client";

import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";
import { useSearchParams } from "next/navigation";

const BASESYSTEM_TOKEN = "37fd382d23224b8c89484d9efec1bd70";
const BASESYSTEM_ENDPOINT = "https://sklep.homelinux.net";
const ACCESS_PARAM = "access";
const TICKETS_ACCESS_CODE = "alvernia-planet-2026";

type Locale = "pl" | "en" | "pt";

type Copy = {
  tag: string;
  title: string;
  subtitle: string;
  embedTitle: string;
  embedHint: string;
  embedButton: string;
  lockedTitle: string;
  lockedBody: string;
  lockedHint: string;
};

const COPY: Record<Locale, Copy> = {
  pl: {
    tag: "Bilety",
    title: "Bilety",
    subtitle: "Kup bilety online i zaplanuj wizytę w Alvernia Planet.",
    embedTitle: "Kalendarz rezerwacji",
    embedHint: "Jeśli okno nie ładuje się poprawnie, otwórz rezerwacje w nowej karcie.",
    embedButton: "Otwórz rezerwację w nowej karcie",
    lockedTitle: "Rezerwacje chwilowo wyłączone",
    lockedBody: "Sprzedaż biletów online jest obecnie niedostępna.",
    lockedHint: "Jeśli masz link z kodem dostępu, otwórz go bezpośrednio.",
  },
  en: {
    tag: "Tickets",
    title: "Tickets",
    subtitle: "Book online and plan your visit to Alvernia Planet.",
    embedTitle: "Booking calendar",
    embedHint: "If the embed doesn’t load, open the booking page in a new tab.",
    embedButton: "Open booking in a new tab",
    lockedTitle: "Bookings temporarily disabled",
    lockedBody: "Online ticket sales are currently unavailable.",
    lockedHint: "If you have an access link, open it directly.",
  },
  pt: {
    tag: "Bilhetes",
    title: "Bilhetes",
    subtitle: "Compre online e planeie a sua visita à Alvernia Planet.",
    embedTitle: "Calendário de reservas",
    embedHint: "Se o formulário não carregar corretamente, abra a reserva num novo separador.",
    embedButton: "Abrir reserva num novo separador",
    lockedTitle: "Reservas temporariamente desativadas",
    lockedBody: "A venda de bilhetes online está atualmente indisponível.",
    lockedHint: "Se tiver um link de acesso, abra-o diretamente.",
  },
};

export default function TicketsPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];
  const searchParams = useSearchParams();
  const accessCode = searchParams.get(ACCESS_PARAM) ?? "";
  const hasAccess = TICKETS_ACCESS_CODE.length > 0 && accessCode === TICKETS_ACCESS_CODE;

  return (
    <main className="relative min-h-screen text-white px-4 py-10 sm:py-12 ap-page-intro-stagger">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">{copy.tag}</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold">{copy.title}</h1>
          <p className="text-white/80 text-lg">{copy.subtitle}</p>
        </header>

        {hasAccess ? (
          <>
            <Card variant="solid" noPad className="overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10">
                <h2 className="text-xl sm:text-2xl font-semibold">{copy.embedTitle}</h2>
              </div>
              <div className="basesystem-embed bg-white text-slate-900">
                <div className="w-full min-h-[520px] sm:min-h-[600px]">
                  <basesystem-shop
                    token={BASESYSTEM_TOKEN}
                    endpoint={BASESYSTEM_ENDPOINT}
                    className="block w-full min-h-[520px] sm:min-h-[600px] text-slate-900"
                  ></basesystem-shop>
                </div>
              </div>
            </Card>

            <div className="text-center space-y-3">
              <p className="text-white/70 text-sm">{copy.embedHint}</p>
              <div className="flex justify-center">
                <PrimaryButton
                  href={BASESYSTEM_ENDPOINT}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="md"
                  className="ticket-pill text-white ring-[color:rgba(240,60,100,0.55)]"
                >
                  {copy.embedButton}
                </PrimaryButton>
              </div>
            </div>
          </>
        ) : (
          <Card variant="solid" className="text-center space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold">{copy.lockedTitle}</h2>
            <p className="text-white/80">{copy.lockedBody}</p>
            <p className="text-white/60 text-sm">{copy.lockedHint}</p>
          </Card>
        )}

      </div>
    </main>
  );
}
