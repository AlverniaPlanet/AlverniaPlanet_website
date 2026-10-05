"use client";

import { useState, type FormEvent } from "react";
import { bookingPortalHref } from "@/lib/booking";
import { type Locale } from "@/lib/localizedRoutes";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { useI18n } from "@/app/i18n-provider";

const PHONE_BOOKING = "+48 723 999 099";
const MAIL_BOOKING = "b.jacon@gremi.pl";
// Telefon stacjonarny został całkowicie wycofany — infolinia korzysta z numeru
// komórkowego 510 831 277.
const PHONE_INFO = "+48 510 831 277";
const MAIL_INFO = "rezerwacje@alverniaplanet.com";
const PHONE_EVENTS_SECOND = "+48 452 432 315";
const MAIL_EVENTS_SECOND = "p.kozolub@gremi.pl";
const CONTACT_FORM_EMAIL = "rezerwacje@alverniaplanet.com";
const CONTACT_FORM_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";
// Sprzedaż przeniesiona z Bookero do Iksorisa (wrzesień 2026).

// Opiekunowie kontaktu telefonicznego: rezerwacje indywidualne, grupy, eventy
// i sesje zdjęciowe. Stanowiska i ich tłumaczenia 1:1 z sekcją „Zespół
// sprzedaży" na /wydarzenia (rola renderowana pod nazwiskiem).
const CONTACT_PEOPLE: {
  name: string;
  role: Record<Locale, string>;
  phone: string;
  email: string;
  emailClass: string;
}[] = [
  {
    name: "Bartłomiej Jacoń",
    role: {
      pl: "Starszy specjalista ds. sprzedaży",
      en: "Senior sales specialist",
      pt: "Especialista sénior de vendas",
      de: "Senior-Vertriebsspezialist",
      zh: "高级销售专员",
    },
    phone: PHONE_BOOKING,
    email: MAIL_BOOKING,
    emailClass: "text-[#f77828] hover:text-[#ffa15a]",
  },
  {
    name: "Piotr Kozołub",
    role: {
      pl: "Specjalista ds. sprzedaży",
      en: "Sales specialist",
      pt: "Especialista de vendas",
      de: "Vertriebsspezialist",
      zh: "销售专员",
    },
    phone: PHONE_EVENTS_SECOND,
    email: MAIL_EVENTS_SECOND,
    emailClass: "text-[#ff6b8a] hover:text-[#ffa0b6]",
  },
];

const COPY: Record<
  Locale,
  {
    heroTitle: string;
    info: {
      title: string;
      description: string;
      phoneLabel: string;
      hoursLabel: string;
      hotlineHours: string[];
      emailLabel: string;
    };
    contact: {
      title: string;
      description: string;
      peopleLabel: string;
      onlineTitle: string;
      onlineDescription: string;
      button: string;
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
      hoursLabel: "Godziny infolinii",
      hotlineHours: ["Poniedziałek - piątek: 10:00 - 16:00"],
      emailLabel: "Email",
    },
    contact: {
      title: "Rezerwacje, grupy i eventy",
      description: "Rezerwacje telefoniczne, bilety grupowe, program dnia oraz eventy i sesje zdjęciowe.",
      peopleLabel: "Opiekunowie",
      onlineTitle: "Rezerwacja online",
      onlineDescription: "Wybierz termin i liczbę osób. Potwierdzimy rezerwację na maila.",
      button: "Otwórz kalendarz rezerwacji",
    },
    form: {
      title: "Formularz kontaktowy",
      subtitle: "Napisz do nas. Odpowiemy jak najszybciej.",
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
      hoursLabel: "Info line hours",
      hotlineHours: ["Monday - Friday: 10:00 - 16:00"],
      emailLabel: "Email",
    },
    contact: {
      title: "Bookings, groups & events",
      description: "Phone bookings, group tickets, daily schedule, plus events and photo shoots.",
      peopleLabel: "Coordinators",
      onlineTitle: "Online booking",
      onlineDescription: "Pick a date and the number of people. We’ll confirm your reservation by email.",
      button: "Open booking calendar",
    },
    form: {
      title: "Contact form",
      subtitle: "Write to us. We’ll get back to you as soon as possible.",
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
      hoursLabel: "Horário da linha de informação",
      hotlineHours: ["Segunda - sexta: 10:00 - 16:00"],
      emailLabel: "Email",
    },
    contact: {
      title: "Reservas, grupos e eventos",
      description: "Reservas por telefone, bilhetes de grupo, programa do dia e ainda eventos e sessões fotográficas.",
      peopleLabel: "Responsáveis",
      onlineTitle: "Reserva online",
      onlineDescription: "Escolha a data e o número de pessoas. Confirmaremos por email.",
      button: "Abrir calendário de reservas",
    },
    form: {
      title: "Formulário de contacto",
      subtitle: "Escreva-nos. Responderemos o mais rápido possível.",
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
  de: {
    heroTitle: "Kontaktieren Sie uns",
    info: {
      title: "Info-Hotline",
      description: "Aktuelle Informationen zu Öffnungszeiten, Verfügbarkeit der Attraktionen und Tickets.",
      phoneLabel: "Telefon",
      hoursLabel: "Zeiten der Info-Hotline",
      hotlineHours: ["Montag - Freitag: 10:00 - 16:00"],
      emailLabel: "E-Mail",
    },
    contact: {
      title: "Buchungen, Gruppen & Events",
      description: "Telefonische Buchungen, Gruppentickets, Tagesprogramm sowie Events und Fotoshootings.",
      peopleLabel: "Ansprechpartner",
      onlineTitle: "Online-Buchung",
      onlineDescription: "Wählen Sie ein Datum und die Personenzahl. Wir bestätigen Ihre Reservierung per E-Mail.",
      button: "Buchungskalender öffnen",
    },
    form: {
      title: "Kontaktformular",
      subtitle: "Schreiben Sie uns. Wir melden uns so schnell wie möglich.",
      nameLabel: "Vor- und Nachname",
      emailLabel: "E-Mail-Adresse",
      phoneLabel: "Telefonnummer",
      messageLabel: "Nachricht",
      submit: "Senden",
      sending: "Wird gesendet…",
      requiredNote: "* Pflichtfelder",
      successTitle: "Vielen Dank! Ihre Nachricht wurde gesendet.",
      successBody: "Wir antworten Ihnen so schnell wie möglich.",
      errorTitle: "Die Nachricht konnte nicht gesendet werden.",
      errorBody: `Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt an ${CONTACT_FORM_EMAIL}.`,
    },
  },
  zh: {
    heroTitle: "联系我们",
    info: {
      title: "咨询热线",
      description: "获取开放时间、项目开放情况与门票的最新信息。",
      phoneLabel: "电话",
      hoursLabel: "热线服务时间",
      hotlineHours: ["周一至周五：10:00 - 16:00"],
      emailLabel: "电子邮箱",
    },
    contact: {
      title: "预订、团体与活动",
      description: "电话预订、团体票、当日行程安排，以及活动与拍摄服务。",
      peopleLabel: "联系人",
      onlineTitle: "在线预订",
      onlineDescription: "选择日期和人数，我们将通过电子邮件确认您的预订。",
      button: "打开预订日历",
    },
    form: {
      title: "联系表单",
      subtitle: "给我们留言，我们会尽快回复您。",
      nameLabel: "姓名",
      emailLabel: "电子邮箱地址",
      phoneLabel: "电话号码",
      messageLabel: "留言内容",
      submit: "发送",
      sending: "发送中…",
      requiredNote: "* 为必填项",
      successTitle: "感谢您！留言已发送。",
      successBody: "我们会尽快回复您。",
      errorTitle: "留言发送失败。",
      errorBody: `请稍后重试，或直接发送邮件至 ${CONTACT_FORM_EMAIL}。`,
    },
  },
};

const inputBaseClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#4fcfde] focus:outline-none focus:ring-2 focus:ring-[#4fcfde]/35";

export default function KontaktPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  // Iksoris ma tylko pl/en — wersja PT dostaje angielski interfejs kasy.
  const BOOKING_URL = bookingPortalHref(loc);
  const copy = COPY[loc];
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
            {/* Dwie karty: Infolinia + połączony kontakt telefoniczny (rezerwacje,
                grupy, eventy). ap-contact-cards wyłącza hover na wewnętrznych kaflach. */}
            <div className="ap-contact-cards mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
              {/* Infolinia */}
              <div>
                <Card variant="solid" motion="off" className="h-full flex flex-col gap-5 text-center items-center">
                  <h2 className="text-2xl font-semibold">{copy.info.title}</h2>
                  <div className="h-[1px] w-full bg-white/15 mt-1" />
                  <p className="text-sm text-gray-300 leading-relaxed px-2 md:px-4 mb-2">
                    {copy.info.description}
                  </p>
                  <div className="w-full space-y-4">
                    <div className="ap-tile ap-tile-sm space-y-4 p-4">
                      <div className="space-y-1">
                        <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.info.phoneLabel}</p>
                        <a
                          href={`tel:${PHONE_INFO.replace(/\s/g, "")}`}
                          className="inline-block text-lg font-semibold transition-colors hover:text-[#8fe6f8]"
                        >
                          {formatPhone(PHONE_INFO)}
                        </a>
                      </div>
                      <div className="space-y-1 border-t border-white/10 pt-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">{copy.info.hoursLabel}</p>
                        <ul className="space-y-1 text-sm text-gray-100">
                          {copy.info.hotlineHours.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="ap-tile ap-tile-sm w-full space-y-2 p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.info.emailLabel}</p>
                      <a
                        href={`mailto:${MAIL_INFO}`}
                        className="inline-block break-words font-semibold text-[#ff6b8a] transition-colors hover:text-[#ffa0b6]"
                      >
                        {MAIL_INFO}
                      </a>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Rezerwacje, grupy i eventy (połączone) */}
              <div>
                <Card variant="solid" motion="off" className="h-full flex flex-col gap-5 text-center items-center">
                  <h2 className="text-2xl font-semibold">{copy.contact.title}</h2>
                  <div className="h-[1px] w-full bg-white/15 mt-1" />
                  <p className="text-sm text-gray-300 leading-relaxed px-2 md:px-6 mb-1">
                    {copy.contact.description}
                  </p>
                  <div className="ap-tile ap-tile-sm w-full space-y-4 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">{copy.contact.peopleLabel}</p>
                    <div className="space-y-4">
                      {CONTACT_PEOPLE.map((person, index) => (
                        <div
                          key={person.name}
                          className={`space-y-0.5 ${index > 0 ? "border-t border-white/10 pt-4" : ""}`}
                        >
                          <p className="font-semibold">{person.name}</p>
                          <p className="text-xs text-white/55">{person.role[loc]}</p>
                          <a
                            href={`tel:${person.phone.replace(/\s/g, "")}`}
                            className="block text-gray-300 transition-colors hover:text-white"
                          >
                            {formatPhone(person.phone)}
                          </a>
                          <a
                            href={`mailto:${person.email}`}
                            className={`block break-words transition-colors ${person.emailClass}`}
                          >
                            {person.email}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="ap-tile ap-tile-sm ap-tile-accent mt-4 w-full p-4">
                    <p className="text-sm font-semibold text-[#a5e6f0]">{copy.contact.onlineTitle}</p>
                    <p className="text-sm text-gray-200">{copy.contact.onlineDescription}</p>
                    <PrimaryButton
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      className="mt-3 w-full justify-center"
                    >
                      {copy.contact.button}
                    </PrimaryButton>
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
