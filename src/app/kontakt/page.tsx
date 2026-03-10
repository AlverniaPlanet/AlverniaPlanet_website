"use client";

import { useEffect, useState, type FormEvent } from "react";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { useI18n } from "@/app/i18n-provider";

const PHONE_BOOKING = "+48 723 999 099";
const MAIL_BOOKING = "b.jacon@gremi.pl";
const PHONE_BOOKING_SECOND = "+48 510 831 277";
const MAIL_BOOKING_SECOND = "s.sambor@gremi.pl";
const PHONE_INFO = "+48 12 344 40 00";
const MAIL_INFO = "rezerwacje@alverniaplanet.com";
const MAIL_EVENTS = "b.jacon@gremi.pl";
const PHONE_EVENTS_SECOND = "+48 452 432 315";
const MAIL_EVENTS_SECOND = "p.kozolub@gremi.pl";
const CONTACT_FORM_EMAIL = "rezerwacje@alverniaplanet.com";
const CONTACT_FORM_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";
const BOOKING_URL = "https://alverniaplanet.bookero.pl";
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? "";

type Locale = "pl" | "en" | "pt";

const COPY: Record<
  Locale,
  {
    heroTitle: string;
    info: {
      title: string;
      description: string;
      phoneLabel: string;
      hoursLabel: string;
      hoursLoading: string;
      hoursFallback: string;
      emailLabel: string;
    };
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
    };
    form: {
      title: string;
      subtitle: string;
      nameLabel: string;
      emailLabel: string;
      phoneLabel: string;
      messageLabel: string;
      submit: string;
      sending: string;
      requiredNote: string;
      successTitle: string;
      successBody: string;
      errorTitle: string;
      errorBody: string;
    };
  }
> = {
  pl: {
    heroTitle: "Skontaktuj się z nami",
    info: {
      title: "Infolinia",
      description: "Aktualne informacje o godzinach otwarcia, dostępności atrakcji i biletach.",
      phoneLabel: "Telefon",
      hoursLabel: "Godziny otwarcia",
      hoursLoading: "Pobieramy godziny z Google…",
      hoursFallback: "Godziny: 8:00 – 16:00",
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
      title: "Eventy",
      description: "Wsparcie przy eventach i sesjach zdjęciowych.",
      contactLabel: "Kontakt",
      primaryName: "Bartłomiej Jacoń",
    },
    form: {
      title: "Formularz kontaktowy",
      subtitle: "Napisz do nas — odpowiemy jak najszybciej.",
      nameLabel: "Imię i nazwisko",
      emailLabel: "Adres e-mail",
      phoneLabel: "Nr telefonu",
      messageLabel: "Treść wiadomości",
      submit: "Wyślij",
      sending: "Wysyłanie…",
      requiredNote: "* pola wymagane",
      successTitle: "Dziękujemy! Wiadomość została wysłana.",
      successBody: "Skontaktujemy się najszybciej, jak to możliwe.",
      errorTitle: "Nie udało się wysłać wiadomości.",
      errorBody: `Spróbuj ponownie za chwilę lub napisz bezpośrednio na ${CONTACT_FORM_EMAIL}.`,
    },
  },
  en: {
    heroTitle: "Contact us",
    info: {
      title: "Info line",
      description: "Current details on opening hours, attraction availability, and tickets.",
      phoneLabel: "Phone",
      hoursLabel: "Opening hours",
      hoursLoading: "Loading hours from Google…",
      hoursFallback: "Hours: 8:00 – 16:00",
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
      title: "Events",
      description: "Support for events and photo shoots.",
      contactLabel: "Contact",
      primaryName: "Bartłomiej Jacoń",
    },
    form: {
      title: "Contact form",
      subtitle: "Write to us — we’ll get back to you as soon as possible.",
      nameLabel: "Full name",
      emailLabel: "Email address",
      phoneLabel: "Phone number",
      messageLabel: "Message",
      submit: "Send",
      sending: "Sending…",
      requiredNote: "* required fields",
      successTitle: "Thanks! Your message has been sent.",
      successBody: "We’ll reply as soon as possible.",
      errorTitle: "Message could not be sent.",
      errorBody: `Please try again later or email us directly at ${CONTACT_FORM_EMAIL}.`,
    },
  },
  pt: {
    heroTitle: "Contacte-nos",
    info: {
      title: "Linha de informação",
      description: "Informações atuais sobre horários, disponibilidade das atrações e bilhetes.",
      phoneLabel: "Telefone",
      hoursLabel: "Horário de funcionamento",
      hoursLoading: "A carregar horários do Google…",
      hoursFallback: "Horário: 8:00 – 16:00",
      emailLabel: "Email",
    },
    booking: {
      title: "Reservas e grupos",
      description: "Planeamento da visita, bilhetes de grupo e programa do dia.",
      caretakerLabel: "Responsável",
      caretakerName: "Bartłomiej Jacoń",
      onlineTitle: "Reserva online",
      onlineDescription: "Escolha a data e o número de pessoas — confirmaremos por email.",
      button: "Abrir calendário de reservas",
    },
    events: {
      title: "Eventos",
      description: "Apoio a eventos e sessões fotográficas.",
      contactLabel: "Contacto",
      primaryName: "Bartłomiej Jacoń",
    },
    form: {
      title: "Formulário de contacto",
      subtitle: "Escreva-nos — responderemos o mais rápido possível.",
      nameLabel: "Nome e apelido",
      emailLabel: "Endereço de email",
      phoneLabel: "Número de telefone",
      messageLabel: "Mensagem",
      submit: "Enviar",
      sending: "A enviar…",
      requiredNote: "* campos obrigatórios",
      successTitle: "Obrigado! A sua mensagem foi enviada.",
      successBody: "Responderemos o mais rápido possível.",
      errorTitle: "Não foi possível enviar a mensagem.",
      errorBody: `Tente novamente mais tarde ou escreva-nos por email para ${CONTACT_FORM_EMAIL}.`,
    },
  },
};

const inputBaseClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#4fcfde] focus:outline-none focus:ring-2 focus:ring-[#4fcfde]/35";

export default function KontaktPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];
  const language = loc === "en" ? "en" : loc === "pt" ? "pt" : "pl";
  const hasGoogleConfig = Boolean(GOOGLE_MAPS_API_KEY && GOOGLE_PLACE_ID);
  const [hoursState, setHoursState] = useState<{
    status: "idle" | "loading" | "ready" | "error";
    weekdayText: string[];
  }>({ status: "idle", weekdayText: [] });
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!CONTACT_FORM_ENDPOINT) {
      setFormState("error");
      return;
    }
    setFormState("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const payload = new URLSearchParams();
    payload.set("name", name);
    payload.set("email", email);
    payload.set("phone", phone);
    payload.set("message", message);
    payload.set("locale", loc);
    payload.set("source", "contact-page");

    try {
      await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: payload.toString(),
      });
      setFormState("success");
      form.reset();
    } catch {
      setFormState("error");
    }
  };

  useEffect(() => {
    if (!hasGoogleConfig) return;
    let cancelled = false;
    setHoursState({ status: "loading", weekdayText: [] });

    loadGoogleMaps(GOOGLE_MAPS_API_KEY, language)
      .then(() => {
        if (cancelled) return;
        const w = window as unknown as {
          google?: {
            maps?: {
              places?: {
                PlacesService: new (node: HTMLElement) => {
                  getDetails: (
                    request: { placeId: string; fields: string[] },
                    callback: (place: any, status: string) => void
                  ) => void;
                };
                PlacesServiceStatus: { OK: string };
              };
            };
          };
        };
        const service = w.google?.maps?.places?.PlacesService;
        const statusOk = w.google?.maps?.places?.PlacesServiceStatus?.OK;
        if (!service || !statusOk) {
          setHoursState({ status: "error", weekdayText: [] });
          return;
        }
        const instance = new service(document.createElement("div"));
        instance.getDetails(
          { placeId: GOOGLE_PLACE_ID, fields: ["opening_hours"] },
          (place, status) => {
            if (cancelled) return;
            const weekdayText = place?.opening_hours?.weekday_text ?? [];
            if (status === statusOk && Array.isArray(weekdayText) && weekdayText.length > 0) {
              setHoursState({ status: "ready", weekdayText });
            } else {
              setHoursState({ status: "error", weekdayText: [] });
            }
          }
        );
      })
      .catch(() => {
        if (!cancelled) setHoursState({ status: "error", weekdayText: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [hasGoogleConfig, language]);

  return (
    <main className="relative z-10 text-white px-4 py-12 sm:py-16 flex-1 flex flex-col min-h-screen ap-page-intro-stagger">
      <div className="flex-1 flex flex-col ap-page-stack">
        {/* Nagłówek */}
        <section className="mx-auto max-w-3xl text-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
              {copy.heroTitle}
            </h1>
          </div>
        </section>

        {/* Karty kontaktowe */}
        <section className="ap-shell">
          <ScrollMotionItem strength="strong" delay={40} className="ap-deferred-section" float={false}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Infolinia */}
            <div>
              <Card variant="solid" motion="off" className="h-full flex flex-col gap-5 text-center items-center">
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-2xl font-semibold">{copy.info.title}</h2>
                </div>
                <div className="h-[1px] w-full bg-white/15 mt-1" />
                <p className="text-sm text-gray-300 leading-relaxed px-2 md:px-4 mb-2">
                  {copy.info.description}
                </p>
                <div className="w-full space-y-5">
                  <div className="space-y-2 rounded-2xl bg-white/5 p-4">
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.info.phoneLabel}</p>
                      <p className="text-lg font-semibold">{formatPhone(PHONE_INFO)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">{copy.info.hoursLabel}</p>
                      {!hasGoogleConfig ? (
                        <p className="text-sm text-gray-300">{copy.info.hoursFallback}</p>
                      ) : hoursState.status === "loading" ? (
                        <p className="text-sm text-gray-300">{copy.info.hoursLoading}</p>
                      ) : hoursState.status === "ready" ? (
                        <ul className="space-y-1 text-sm text-gray-100">
                          {hoursState.weekdayText.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-300">{copy.info.hoursFallback}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full space-y-2 rounded-2xl border border-white/10 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.info.emailLabel}</p>
                    <p className="font-semibold text-[#f03c64]">{MAIL_INFO}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Rezerwacje i grupy */}
            <div>
              <Card variant="solid" motion="off" className="h-full flex flex-col gap-6 text-center items-center">
                <h2 className="text-2xl font-semibold">{copy.booking.title}</h2>
                <div className="h-[1px] w-full bg-white/15 mt-1" />
                <p className="text-sm text-gray-300 leading-relaxed px-2 md:px-6 mb-3">
                  {copy.booking.description}
                </p>
                <div className="w-full space-y-3 rounded-2xl bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.booking.caretakerLabel}</p>
                  <div>
                    <p className="font-semibold">Szymon Sambor</p>
                    <p className="text-gray-300">{formatPhone(PHONE_BOOKING_SECOND)}</p>
                    <p className="text-[#f03c64]">{MAIL_BOOKING_SECOND}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">{copy.booking.caretakerName}</p>
                    <p className="text-gray-300">{formatPhone(PHONE_BOOKING)}</p>
                    <p className="text-[#f77828]">{MAIL_BOOKING}</p>
                  </div>
                </div>
                <div className="mt-4 w-full rounded-2xl border border-[#4fcfde]/30 bg-[#4fcfde]/10 p-4">
                  <p className="text-sm font-semibold text-[#a5e6f0]">{copy.booking.onlineTitle}</p>
                  <p className="text-sm text-gray-200">
                    {copy.booking.onlineDescription}
                  </p>
                  <PrimaryButton
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    className="mt-3 w-full justify-center"
                  >
                    {copy.booking.button}
                  </PrimaryButton>
                </div>
              </Card>
            </div>

            {/* Eventy i sesje zdjęciowe */}
            <div>
              <Card variant="solid" motion="off" className="h-full flex flex-col gap-6 text-center items-center">
                <h2 className="text-2xl font-semibold">{copy.events.title}</h2>
                <div className="h-[1px] w-full bg-white/15 mt-1" />
                <p className="text-sm text-gray-300 leading-relaxed px-2 md:px-6 mb-3">
                  {copy.events.description}
                </p>
                <div className="w-full space-y-3 rounded-2xl bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.events.contactLabel}</p>
                  <div className="space-y-1">
                    <p className="font-semibold">Piotr Kozołub</p>
                    <p className="text-gray-300">{formatPhone(PHONE_EVENTS_SECOND)}</p>
                    <p className="text-[#f03c64]">{MAIL_EVENTS_SECOND}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">{copy.events.primaryName}</p>
                    <p className="text-gray-300">{formatPhone(PHONE_BOOKING)}</p>
                    <p className="text-[#f77828]">{MAIL_EVENTS}</p>
                  </div>
                </div>
              </Card>
            </div>
            </div>
          </ScrollMotionItem>
        </section>

        {/* Formularz kontaktowy */}
        <section className="ap-shell">
          <ScrollMotionItem strength="soft" delay={120} className="ap-deferred-section">
            <div>
              <Card title={copy.form.title} titleCentered titleDivider motion="off">
              <p className="text-center text-gray-300">{copy.form.subtitle}</p>
              {formState === "success" ? (
                <div className="mt-6 mx-auto max-w-2xl rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-center">
                  <p className="text-sm font-semibold text-emerald-200">{copy.form.successTitle}</p>
                  <p className="text-xs text-emerald-100/80">{copy.form.successBody}</p>
                </div>
              ) : formState === "error" ? (
                <div className="mt-6 mx-auto max-w-2xl rounded-2xl border border-rose-400/40 bg-rose-400/10 p-4 text-center">
                  <p className="text-sm font-semibold text-rose-200">{copy.form.errorTitle}</p>
                  <p className="text-xs text-rose-100/80">{copy.form.errorBody}</p>
                </div>
              ) : null}
              <form
                onSubmit={handleFormSubmit}
                className="mt-6 grid gap-5"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-white/70">
                    <span>
                      {copy.form.nameLabel} <span className="text-[#f03c64]">*</span>
                    </span>
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      className={inputBaseClass}
                      placeholder={copy.form.nameLabel}
                    />
                  </label>
                  <label className="space-y-2 text-sm text-white/70">
                    <span>
                      {copy.form.emailLabel} <span className="text-[#f03c64]">*</span>
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      className={inputBaseClass}
                      placeholder={copy.form.emailLabel}
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm text-white/70">
                  <span>{copy.form.phoneLabel}</span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    className={inputBaseClass}
                    placeholder={copy.form.phoneLabel}
                  />
                </label>

                <label className="space-y-2 text-sm text-white/70">
                  <span>
                    {copy.form.messageLabel} <span className="text-[#f03c64]">*</span>
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className={`${inputBaseClass} resize-none`}
                    placeholder={copy.form.messageLabel}
                  />
                </label>

                <PrimaryButton
                  type="submit"
                  size="sm"
                  disabled={formState === "sending"}
                  className="w-full justify-center justify-self-center sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {formState === "sending" ? copy.form.sending : copy.form.submit}
                </PrimaryButton>
                <p className="text-center text-xs text-white/50">{copy.form.requiredNote}</p>
              </form>
              </Card>
            </div>
          </ScrollMotionItem>
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

function loadGoogleMaps(apiKey: string, language: string) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window is not available"));
  }

  const w = window as unknown as {
    google?: { maps?: { places?: unknown } };
    __apGoogleMapsPromise?: Promise<void>;
  };

  if (w.google?.maps?.places) {
    return Promise.resolve();
  }

  if (w.__apGoogleMapsPromise) {
    return w.__apGoogleMapsPromise;
  }

  w.__apGoogleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=${language}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return w.__apGoogleMapsPromise;
}
