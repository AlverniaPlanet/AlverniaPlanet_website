"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/app/i18n-provider";

type Locale = "pl" | "en" | "pt";

type ChatAction = {
  label: string;
  href: string;
  external?: boolean;
};

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
  actions?: ChatAction[];
};

type Intent =
  | "hours"
  | "prices"
  | "directions"
  | "contact"
  | "events"
  | "attractions"
  | "gallery"
  | "booking";

const BOOKING_URL = "https://alverniaplanet.bookero.pl";

const CHAT_COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    greeting: string;
    placeholder: string;
    send: string;
    quick: string[];
    fallback: string;
    actionLabels: {
      contact: string;
      directions: string;
      tickets: string;
      events: string;
      attractions: string;
      gallery: string;
      booking: string;
    };
    answers: {
      hours: string;
      prices: string;
      directions: string;
      contact: string;
      events: string;
      attractions: string;
      gallery: string;
      booking: string;
    };
  }
> = {
  pl: {
    title: "Asystent Alvernia",
    subtitle: "Szybkie odpowiedzi",
    greeting:
      "Cześć! Mogę pomóc w podstawowych pytaniach: bilety, dojazd, kontakt, wydarzenia.",
    placeholder: "Napisz wiadomość...",
    send: "Wyślij",
    quick: ["Cennik", "Jak dojechać?", "Kontakt", "Wydarzenia"],
    fallback:
      "Jasne. W tej wersji odpowiadam na podstawowe pytania. Napisz np.: cennik, dojazd, kontakt albo wydarzenia.",
    actionLabels: {
      contact: "Kontakt",
      directions: "Jak dojechać",
      tickets: "Bilety",
      events: "Wydarzenia",
      attractions: "Atrakcje",
      gallery: "Galeria",
      booking: "Rezerwacja",
    },
    answers: {
      hours:
        "Infolinia działa od poniedziałku do piątku w godz. 9:00-16:00. Projekcja K360: pon.-czw. 11:00-17:00, pt. 11:00-18:00, sob.-niedz. 11:00-19:30. Ścieżka filmowa: pon.-sob. 8:00-17:00, niedziela: zamknięte.",
      prices:
        "Na stronie: bilet normalny na ścieżkę edukacyjną to 79 zł/os., ulgowy 69 zł/os., a dla grup szkolnych 30-50 osób: 2 070-3 450 zł/grupa.",
      directions: "Szczegółowy dojazd i mapa są na podstronie „Jak dojechać”.",
      contact:
        "Kontakt: +48 12 344 40 00, rezerwacje@alverniaplanet.com. Możesz też wysłać formularz na stronie kontaktu.",
      events:
        "Informacje o wynajmie przestrzeni i eventach znajdziesz na podstronie „Wydarzenia”.",
      attractions:
        "Najważniejsze atrakcje to: Projekcja K360, Ścieżka filmowa i Wystawa tematyczna.",
      gallery: "Pełna galeria zdjęć jest dostępna na osobnej podstronie „Galeria”.",
      booking: "Rezerwację najwygodniej zrobić bezpośrednio przez system Bookero.",
    },
  },
  en: {
    title: "Alvernia Assistant",
    subtitle: "Quick answers",
    greeting:
      "Hi! I can help with basic questions: tickets, directions, contact and events.",
    placeholder: "Type a message...",
    send: "Send",
    quick: ["Ticket prices", "How to get there?", "Contact", "Events"],
    fallback:
      "Sure. In this version I answer basic questions. Try: tickets, directions, contact or events.",
    actionLabels: {
      contact: "Contact",
      directions: "Getting there",
      tickets: "Tickets",
      events: "Events",
      attractions: "Attractions",
      gallery: "Gallery",
      booking: "Booking",
    },
    answers: {
      hours:
        "The info line is open Monday to Friday from 9:00 to 16:00. K360 projection: Mon-Thu 11:00-17:00, Fri 11:00-18:00, Sat-Sun 11:00-19:30. Film Path: Mon-Sat 8:00-17:00, Sunday closed.",
      prices:
        "On the website: the standard educational path ticket is 79 PLN/person, the reduced ticket is 69 PLN/person, and school groups (30-50 people) cost 2,070-3,450 PLN/group.",
      directions: "Detailed directions and map are available on the “Getting there” page.",
      contact:
        "Contact: +48 12 344 40 00, rezerwacje@alverniaplanet.com. You can also use the contact form.",
      events: "Venue rental and event details are on the “Events” page.",
      attractions:
        "Main attractions: K360 projection, Film Path and Themed Exhibition.",
      gallery: "The full photo gallery is available on the separate “Gallery” page.",
      booking: "The easiest way to book is via Bookero.",
    },
  },
  pt: {
    title: "Assistente Alvernia",
    subtitle: "Respostas rápidas",
    greeting:
      "Olá! Posso ajudar com perguntas básicas: bilhetes, como chegar, contacto e eventos.",
    placeholder: "Escreve a tua mensagem...",
    send: "Enviar",
    quick: ["Preços", "Como chegar?", "Contacto", "Eventos"],
    fallback:
      "Claro. Nesta versão respondo a perguntas básicas. Tenta: bilhetes, como chegar, contacto ou eventos.",
    actionLabels: {
      contact: "Contacto",
      directions: "Como chegar",
      tickets: "Bilhetes",
      events: "Eventos",
      attractions: "Atrações",
      gallery: "Galeria",
      booking: "Reserva",
    },
    answers: {
      hours:
        "A linha de informação funciona de segunda a sexta das 9:00 às 16:00. Projeção K360: seg.-qui. 11:00-17:00, sex. 11:00-18:00, sáb.-dom. 11:00-19:30. Percurso de filmagem: seg.-sáb. 8:00-17:00, domingo encerrado.",
      prices:
        "No site: o bilhete normal do percurso educativo custa 79 PLN/pessoa, o bilhete reduzido 69 PLN/pessoa, e os grupos escolares (30-50 pessoas) custam 2 070-3 450 PLN/grupo.",
      directions: "As indicações e o mapa estão na página “Como chegar”.",
      contact:
        "Contacto: +48 12 344 40 00, rezerwacje@alverniaplanet.com. Também podes usar o formulário de contacto.",
      events:
        "Informações sobre aluguer de espaço e eventos estão na página “Eventos”.",
      attractions:
        "Atrações principais: Projeção K360, Percurso de filmagem e Exposição temática.",
      gallery: "A galeria completa está disponível na página “Galeria”.",
      booking: "A forma mais rápida de reservar é pelo Bookero.",
    },
  },
};

const INTENT_KEYWORDS: Record<Intent, string[]> = {
  hours: ["godzin", "otwarc", "open", "hours", "horario", "horario", "aberto"],
  prices: ["cena", "cennik", "koszt", "price", "ticket price", "preco", "bilhet"],
  directions: ["dojazd", "jak dojechac", "mapa", "directions", "getting there", "como chegar"],
  contact: ["kontakt", "telefon", "email", "contact", "phone", "mail", "whatsapp", "messenger", "contacto"],
  events: ["wydarzen", "event", "wynajem", "konferenc", "gala", "eventos"],
  attractions: ["atrakc", "k360", "sciezka", "wystaw", "attraction", "film path", "atracoes", "percurso"],
  gallery: ["galeria", "gallery", "zdjec", "photos", "fotos"],
  booking: ["rezerw", "book", "bookero", "kup", "bilet", "reservation", "reserva"],
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/\s+/g, " ")
    .trim();
}

function detectIntent(input: string): Intent | undefined {
  const normalized = normalizeText(input);
  const intents = Object.keys(INTENT_KEYWORDS) as Intent[];
  for (const intent of intents) {
    if (INTENT_KEYWORDS[intent].some((keyword) => normalized.includes(normalizeText(keyword)))) {
      return intent;
    }
  }
  return undefined;
}

export default function SimpleChatWidget() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = CHAT_COPY[loc];
  const prefix = loc === "en" || loc === "pt" ? `/${loc}` : "";

  const routes = useMemo(
    () => ({
      contact: prefix + (loc === "pl" ? "/kontakt" : "/contact"),
      directions: prefix + (loc === "pl" ? "/jak-dojechac" : "/getting-there"),
      tickets: prefix + (loc === "pl" ? "/rezerwuj" : loc === "en" ? "/reserve" : "/reservar"),
      events: prefix + (loc === "pl" ? "/wydarzenia" : "/events"),
      gallery: prefix + (loc === "pl" ? "/galeria" : "/gallery"),
      attractions: prefix + (loc === "pl" ? "/atrakcje/wystawa" : "/attractions/exhibition"),
    }),
    [loc, prefix],
  );

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "bot", text: copy.greeting },
  ]);
  const nextIdRef = useRef(2);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([{ id: 1, role: "bot", text: copy.greeting }]);
    nextIdRef.current = 2;
  }, [copy.greeting]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [messages, open]);

  const buildBotReply = (intent?: Intent): { text: string; actions?: ChatAction[] } => {
    if (!intent) {
      return {
        text: copy.fallback,
        actions: [
          { label: copy.actionLabels.tickets, href: routes.tickets },
          { label: copy.actionLabels.directions, href: routes.directions },
          { label: copy.actionLabels.contact, href: routes.contact },
        ],
      };
    }

    if (intent === "hours") {
      return {
        text: copy.answers.hours,
        actions: [
          { label: copy.actionLabels.contact, href: routes.contact },
          { label: copy.actionLabels.booking, href: BOOKING_URL, external: true },
        ],
      };
    }
    if (intent === "prices") {
      return {
        text: copy.answers.prices,
        actions: [
          { label: copy.actionLabels.tickets, href: routes.tickets },
          { label: copy.actionLabels.booking, href: BOOKING_URL, external: true },
        ],
      };
    }
    if (intent === "directions") {
      return {
        text: copy.answers.directions,
        actions: [{ label: copy.actionLabels.directions, href: routes.directions }],
      };
    }
    if (intent === "contact") {
      return {
        text: copy.answers.contact,
        actions: [{ label: copy.actionLabels.contact, href: routes.contact }],
      };
    }
    if (intent === "events") {
      return {
        text: copy.answers.events,
        actions: [{ label: copy.actionLabels.events, href: routes.events }],
      };
    }
    if (intent === "attractions") {
      return {
        text: copy.answers.attractions,
        actions: [{ label: copy.actionLabels.attractions, href: routes.attractions }],
      };
    }
    if (intent === "gallery") {
      return {
        text: copy.answers.gallery,
        actions: [{ label: copy.actionLabels.gallery, href: routes.gallery }],
      };
    }
    return {
      text: copy.answers.booking,
      actions: [{ label: copy.actionLabels.booking, href: BOOKING_URL, external: true }],
    };
  };

  const pushUserMessage = (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;

    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "user",
      text: cleaned,
    };
    setMessages((prev) => [...prev, userMessage]);

    const intent = detectIntent(cleaned);
    const reply = buildBotReply(intent);

    window.setTimeout(() => {
      const botMessage: ChatMessage = {
        id: nextIdRef.current++,
        role: "bot",
        text: reply.text,
        actions: reply.actions,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 220);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    pushUserMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[80]">
      {open ? (
        <div className="w-[min(92vw,360px)] overflow-hidden rounded-2xl bg-[color:var(--ap-surface-contrast)] text-[color:var(--ap-text)] ring-1 ring-[color:var(--ap-border)] shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="flex items-start justify-between gap-3 border-b border-[color:var(--ap-border)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold">{copy.title}</p>
              <p className="text-xs text-[color:var(--ap-text-muted)]">{copy.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--ap-surface-strong)] text-[color:var(--ap-text-muted)] ring-1 ring-[color:var(--ap-border)] transition hover:text-[color:var(--ap-text)]"
              aria-label="Zamknij czat"
            >
              ✕
            </button>
          </div>

          <div
            ref={viewportRef}
            className="max-h-[320px] space-y-3 overflow-y-auto px-3 py-3"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[color:var(--ap-accent)] text-[color:var(--ap-accent-contrast)]"
                      : "bg-[color:var(--ap-surface)] text-[color:var(--ap-text)] ring-1 ring-[color:var(--ap-border)]"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.actions?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {message.actions.map((action) =>
                        action.external ? (
                          <a
                            key={action.label}
                            href={action.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full bg-[color:var(--ap-surface-strong)] px-2.5 py-1 text-xs font-medium text-[color:var(--ap-text)] ring-1 ring-[color:var(--ap-border)] transition hover:bg-[color:var(--ap-surface)]"
                          >
                            {action.label}
                          </a>
                        ) : (
                          <Link
                            key={action.label}
                            href={action.href}
                            className="inline-flex items-center rounded-full bg-[color:var(--ap-surface-strong)] px-2.5 py-1 text-xs font-medium text-[color:var(--ap-text)] ring-1 ring-[color:var(--ap-border)] transition hover:bg-[color:var(--ap-surface)]"
                          >
                            {action.label}
                          </Link>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[color:var(--ap-border)] px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {copy.quick.map((quickQuestion) => (
                <button
                  key={quickQuestion}
                  type="button"
                  onClick={() => pushUserMessage(quickQuestion)}
                  className="rounded-full bg-[color:var(--ap-surface-strong)] px-2.5 py-1 text-xs text-[color:var(--ap-text-muted)] ring-1 ring-[color:var(--ap-border)] transition hover:text-[color:var(--ap-text)]"
                >
                  {quickQuestion}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={copy.placeholder}
                className="h-10 flex-1 rounded-full border border-[color:var(--ap-border)] bg-[color:var(--ap-surface)] px-3 text-sm outline-none transition focus:border-[color:var(--ap-accent)]"
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--ap-accent)] px-3 text-sm font-semibold text-[color:var(--ap-accent-contrast)] transition hover:brightness-95"
              >
                {copy.send}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--ap-accent)] text-[color:var(--ap-accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.35)] ring-1 ring-[color:var(--ap-accent-ring)] transition hover:translate-y-[-1px] hover:brightness-95"
          aria-label="Otwórz czat"
        >
          💬
        </button>
      )}
    </div>
  );
}
