"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { submitLead } from "@/lib/leads";

// ------------------------------------------------------------------
// /aplikacje/identyfikacja. Kioskowa aplikacja wejścia na obiekt.
// Gość wybiera WEJŚCIE (Kino 360 / Mars / Filmworld / VIP = wszystkie),
// podaje dane, akceptuje wejście, przykłada i przytrzymuje palec (skan),
// a na końcu ekran potwierdza typ wejścia (nazwa + zasady wizyty)
// w kolorze wybranego wejścia. Nie generujemy żadnego kodu identyfikatora.
//
// Język: samodzielny przełącznik w rogu (PL/EN/PT) + lokalny słownik TR.
// Nie używamy systemowego routingu i18n, bo ta trasa nie ma wariantów /en, /pt.
//
// Motyw całej strony (tło + liquid glass) podąża za kolorem wejścia.
// UWAGA: to symulacja. Nie pobieramy ani nie przechowujemy danych biometrycznych.
// ------------------------------------------------------------------

type Step = "form" | "scanning" | "result";
type Lang = "pl" | "en" | "pt";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  consent: boolean; // A: wymagana zgoda na wejście na obiekt (flow identyfikacji)
  consentContact: boolean; // B: opcjonalna zgoda na kontakt (zapis leada)
};

type FieldKey = keyof FormState;
type FieldErrors = Partial<Record<FieldKey, string>>;

const NEUTRAL = { rgb: "126, 246, 255", text: "#7ef6ff" };

// Kod rabatowy pokazywany na ekranie wyniku (online, bez wyboru wejścia).
const DISCOUNT_CODE = "PartnerAlvernia20";
const BOOKING_URL = "https://alverniaplanet.bookero.pl";
const DISCOUNT_COPY: Record<
  Lang,
  { badge: string; headline: string; desc: string; copy: string; copied: string; buy: string; reset: string }
> = {
  pl: {
    badge: "Twój kod rabatowy",
    headline: "20% na wszystko",
    desc: "20% zniżki na wszystkie atrakcje oraz pojedyncze bilety. Zniżka obejmuje wszystko. Podaj ten kod przy zakupie biletu.",
    copy: "Skopiuj kod",
    copied: "Skopiowano!",
    buy: "Kup bilet",
    reset: "Od nowa",
  },
  en: {
    badge: "Your discount code",
    headline: "20% off everything",
    desc: "20% off all attractions and single tickets. The discount applies to everything. Enter this code when buying a ticket.",
    copy: "Copy code",
    copied: "Copied!",
    buy: "Buy ticket",
    reset: "Start over",
  },
  pt: {
    badge: "O teu código de desconto",
    headline: "20% em tudo",
    desc: "20% de desconto em todas as atrações e bilhetes individuais. O desconto aplica-se a tudo. Introduz este código ao comprar o bilhete.",
    copy: "Copiar código",
    copied: "Copiado!",
    buy: "Comprar bilhete",
    reset: "Recomeçar",
  },
};

const LANGS: readonly { code: Lang; label: string }[] = [
  { code: "pl", label: "Polski" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

type DeclarationSection = { title: string; paragraphs: readonly string[] };

type Translation = {
  pill: string;
  title: string;
  subtitle1: string;
  subtitle2: string;
  entranceLabel: string;
  vipNote: string;
  fieldFirst: string;
  fieldLast: string;
  fieldEmail: string;
  consentA: string;
  consentB: string;
  submit: string;
  formNote: string;
  scanPrompt: string;
  scanStages: readonly string[];
  holdingProgress: string;
  pressHint: string;
  simNote: string;
  guestId: string;
  vipAccess: string;
  accessGranted: string;
  visitRules: readonly string[];
  newId: string;
  declarationTitle: string;
  declarationHint: string;
  declarationSections: readonly DeclarationSection[];
  err: {
    firstName: string;
    lastName: string;
    emailRequired: string;
    emailInvalid: string;
    consent: string;
    entrance: string;
  };
};

const TR: Record<Lang, Translation> = {
  pl: {
    pill: "Punkt kontroli dostępu",
    title: "Przekrocz próg obiektu",
    subtitle1: "Za tą bramą zaczyna się Alvernia Planet. Obiekt, o którym wiadomo niewiele.",
    subtitle2: "Podaj swoje dane i potwierdź je skanem, aby odebrać kod rabatowy.",
    entranceLabel: "Twoje wejście (zakupiony pakiet)",
    vipNote: "wszystkie atrakcje",
    fieldFirst: "Imię",
    fieldLast: "Nazwisko",
    fieldEmail: "Adres email",
    consentA: "Akceptuję wejście na teren obiektu Alvernia Planet i obowiązujące na nim oświadczenie.",
    consentB:
      "Wyrażam zgodę na kontakt ze strony Alvernia Planet w celu przedstawienia informacji o ofercie Alvernia Planet. Wiem, że zgodę mogę wycofać w dowolnym momencie.",
    submit: "Autoryzuj wejście",
    formNote: "Nie pobieramy hasła ani danych biometrycznych. To symulacja identyfikacji.",
    scanPrompt: "Przyłóż i przytrzymaj palec, aby zeskanować",
    scanStages: [
      "Inicjalizacja procesu…",
      "Analiza danych użytkownika…",
      "Generowanie identyfikatora…",
      "Zakończono.",
    ],
    holdingProgress: "Trzymaj palec…",
    pressHint: "Naciśnij i przytrzymaj pole z odciskiem",
    simNote: "To jest symulacja identyfikacji. Aplikacja nie pobiera ani nie przechowuje danych biometrycznych.",
    guestId: "Identyfikator gościa",
    vipAccess: "Wejście na wszystkie atrakcje.",
    accessGranted: "Dostęp przyznany.",
    visitRules: [
      "Start i koniec zwiedzania: Terminal.",
      "Zwiedzanie wyłącznie wyznaczoną trasą.",
      "Obowiązek noszenia identyfikatora przez cały czas wizyty.",
      "Zwrot identyfikatora przy wyjściu.",
    ],
    newId: "Nowy identyfikator",
    declarationTitle: "Oświadczenie",
    declarationHint: "Przewiń, aby przeczytać całość.",
    declarationSections: [
      {
        title: "Zasady odbioru i korzystania z karty dostępu",
        paragraphs: [
          "Karta dostępu wydawana jest osobiście i uprawnia do wejścia wyłącznie do wybranych przestrzeni obiektu, zgodnie z nadanymi uprawnieniami.",
          "Za wydanie karty dostępu pobierana jest opłata w wysokości 10 zł.",
          "Po zakończeniu pobytu na terenie obiektu karta dostępu musi zostać zwrócona osobiście w miejscu wskazanym przez obsługę.",
        ],
      },
      {
        title: "Oświadczenie",
        paragraphs: [
          "Oświadczam, że zapoznałem/am się z informacją, iż wchodzę na teren studia filmowego, na którym obowiązują określone zasady bezpieczeństwa i organizacji pobytu, oraz akceptuję obowiązujący regulamin obiektu.",
          "Oświadczam również, że zapoznałem/am się z zasadami odbioru i korzystania z karty dostępu, przyjmuję do wiadomości opłatę w wysokości 10 zł za jej wydanie oraz zobowiązuję się do osobistego zwrotu karty po zakończeniu pobytu na terenie obiektu.",
        ],
      },
    ],
    err: {
      firstName: "Podaj imię.",
      lastName: "Podaj nazwisko.",
      emailRequired: "Podaj adres email.",
      emailInvalid: "Podaj poprawny adres email.",
      consent: "Akceptacja wejścia na obiekt jest wymagana.",
      entrance: "Wybierz swoje wejście.",
    },
  },
  en: {
    pill: "Access control point",
    title: "Cross the threshold",
    subtitle1: "Beyond this gate begins Alvernia Planet. A place about which little is known.",
    subtitle2: "Enter your details and confirm them with a scan to receive your discount code.",
    entranceLabel: "Your entrance (purchased package)",
    vipNote: "all attractions",
    fieldFirst: "First name",
    fieldLast: "Last name",
    fieldEmail: "Email address",
    consentA: "I accept entry to the Alvernia Planet premises and the applicable declaration.",
    consentB:
      "I consent to being contacted by Alvernia Planet in order to present information about Alvernia Planet's offerings. I know that I can withdraw this consent at any time.",
    submit: "Authorize entry",
    formNote: "We do not collect passwords or biometric data. This is an identification simulation.",
    scanPrompt: "Place and hold your finger to scan",
    scanStages: [
      "Initializing process…",
      "Analyzing user data…",
      "Generating access pass…",
      "Completed.",
    ],
    holdingProgress: "Hold your finger…",
    pressHint: "Press and hold the fingerprint area",
    simNote: "This is an identification simulation. The app does not collect or store any biometric data.",
    guestId: "Guest pass",
    vipAccess: "Access to all attractions.",
    accessGranted: "Access granted.",
    visitRules: [
      "Start and end of the tour: Terminal.",
      "Touring only along the designated route.",
      "The pass must be worn at all times during the visit.",
      "Return the pass on your way out.",
    ],
    newId: "New pass",
    declarationTitle: "Declaration",
    declarationHint: "Scroll to read in full.",
    declarationSections: [
      {
        title: "Rules for collecting and using the access card",
        paragraphs: [
          "The access card is issued in person and entitles the holder to enter only selected areas of the facility, in accordance with the permissions granted.",
          "A fee of PLN 10 is charged for issuing the access card.",
          "After the visit ends, the access card must be returned in person at the place indicated by the staff.",
        ],
      },
      {
        title: "Declaration",
        paragraphs: [
          "I declare that I have read the information that I am entering a film studio, where specific rules on safety and the organization of the visit apply, and I accept the facility's applicable regulations.",
          "I also declare that I have read the rules for collecting and using the access card, I acknowledge the fee of PLN 10 for issuing it, and I undertake to return the card in person after the visit ends.",
        ],
      },
    ],
    err: {
      firstName: "Enter your first name.",
      lastName: "Enter your last name.",
      emailRequired: "Enter your email address.",
      emailInvalid: "Enter a valid email address.",
      consent: "You must accept entry to the facility.",
      entrance: "Choose your entrance.",
    },
  },
  pt: {
    pill: "Ponto de controlo de acesso",
    title: "Atravesse o limiar",
    subtitle1: "Para além deste portão começa o Alvernia Planet. Um lugar sobre o qual pouco se sabe.",
    subtitle2:
      "Introduza os seus dados e confirme-os com uma leitura para receber o seu código de desconto.",
    entranceLabel: "A sua entrada (pacote adquirido)",
    vipNote: "todas as atrações",
    fieldFirst: "Nome",
    fieldLast: "Apelido",
    fieldEmail: "Endereço de email",
    consentA: "Aceito a entrada no recinto do Alvernia Planet e a respetiva declaração.",
    consentB:
      "Autorizo o contacto por parte do Alvernia Planet para apresentar informações sobre a oferta do Alvernia Planet. Sei que posso retirar este consentimento a qualquer momento.",
    submit: "Autorizar entrada",
    formNote: "Não recolhemos palavras-passe nem dados biométricos. Isto é uma simulação de identificação.",
    scanPrompt: "Coloque e mantenha o dedo para digitalizar",
    scanStages: [
      "A iniciar o processo…",
      "A analisar os dados do utilizador…",
      "A gerar o cartão de acesso…",
      "Concluído.",
    ],
    holdingProgress: "Mantenha o dedo…",
    pressHint: "Prima e mantenha a área da impressão digital",
    simNote: "Isto é uma simulação de identificação. A aplicação não recolhe nem armazena quaisquer dados biométricos.",
    guestId: "Cartão de visitante",
    vipAccess: "Acesso a todas as atrações.",
    accessGranted: "Acesso concedido.",
    visitRules: [
      "Início e fim da visita: Terminal.",
      "Visita apenas pelo percurso designado.",
      "É obrigatório usar o cartão durante toda a visita.",
      "Devolução do cartão à saída.",
    ],
    newId: "Novo cartão",
    declarationTitle: "Declaração",
    declarationHint: "Deslize para ler na íntegra.",
    declarationSections: [
      {
        title: "Regras de levantamento e utilização do cartão de acesso",
        paragraphs: [
          "O cartão de acesso é entregue pessoalmente e dá direito a entrar apenas em espaços selecionados do recinto, de acordo com as permissões atribuídas.",
          "Pela emissão do cartão de acesso é cobrada uma taxa de 10 zł.",
          "Após o fim da permanência no recinto, o cartão de acesso deve ser devolvido pessoalmente no local indicado pela equipa.",
        ],
      },
      {
        title: "Declaração",
        paragraphs: [
          "Declaro que tomei conhecimento de que estou a entrar num estúdio de cinema, onde se aplicam regras específicas de segurança e organização da permanência, e aceito o regulamento em vigor do recinto.",
          "Declaro ainda que tomei conhecimento das regras de levantamento e utilização do cartão de acesso, aceito a taxa de 10 zł pela sua emissão e comprometo-me a devolver o cartão pessoalmente após o fim da permanência no recinto.",
        ],
      },
    ],
    err: {
      firstName: "Introduza o seu nome.",
      lastName: "Introduza o seu apelido.",
      emailRequired: "Introduza o seu endereço de email.",
      emailInvalid: "Introduza um endereço de email válido.",
      consent: "A aceitação da entrada no recinto é obrigatória.",
      entrance: "Escolha a sua entrada.",
    },
  },
};

const HOLD_MS = 2800;
const RING_RADIUS = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(state: FormState, t: Translation): FieldErrors {
  const errors: FieldErrors = {};
  if (!state.firstName.trim()) errors.firstName = t.err.firstName;
  if (!state.lastName.trim()) errors.lastName = t.err.lastName;
  const email = state.email.trim();
  if (!email) errors.email = t.err.emailRequired;
  else if (!EMAIL_RE.test(email)) errors.email = t.err.emailInvalid;
  if (!state.consent) errors.consent = t.err.consent;
  return errors;
}

function Flag({ code }: { code: Lang }) {
  if (code === "pl") {
    return (
      <svg aria-hidden="true" width="22" height="15" viewBox="0 0 18 12" className="rounded-[3px]">
        <rect width="18" height="12" fill="#ffffff" />
        <rect y="6" width="18" height="6" fill="#dc2626" />
        <rect width="18" height="12" fill="none" stroke="#0f172a" strokeWidth="0.35" opacity="0.2" />
      </svg>
    );
  }
  if (code === "pt") {
    return (
      <svg aria-hidden="true" width="22" height="15" viewBox="0 0 18 12" className="overflow-hidden rounded-[3px]">
        <rect width="18" height="12" fill="#da291c" />
        <rect width="7" height="12" fill="#046a38" />
        <circle cx="7" cy="6" r="2.5" fill="#f5c542" opacity="0.95" />
        <circle cx="7" cy="6" r="1.4" fill="#da291c" opacity="0.9" />
        <rect width="18" height="12" fill="none" stroke="#0f172a" strokeWidth="0.35" opacity="0.25" />
      </svg>
    );
  }
  // Uproszczony Union Jack (EN)
  return (
    <svg aria-hidden="true" width="22" height="15" viewBox="0 0 18 12" className="overflow-hidden rounded-[3px]">
      <rect width="18" height="12" fill="#0b3f8c" />
      <path d="M0 0l6.5 4H5L0 1v-1zM18 0l-6.5 4H13L18 1V0zM0 12l6.5-4H5L0 11v1zM18 12l-6.5-4H13l5 3v1z" fill="#ffffff" />
      <path d="M7.5 4L0 0v1l5 3h2.5zm3 0L18 0v1l-5 3h-2.5zm-3 4L0 12v-1l5-3h2.5zm3 0L18 12v-1l-5-3h-2.5z" fill="#d91c1c" />
      <path d="M0 4.5h7v-4.5h4v4.5h7v3h-7v4.5h-4v-4.5H0z" fill="#ffffff" />
      <path d="M0 5.25h7.5V0h3V5.25H18v1.5h-7.5V12h-3V6.75H0z" fill="#d91c1c" />
      <rect width="18" height="12" fill="none" stroke="#0f172a" strokeWidth="0.35" opacity="0.3" />
    </svg>
  );
}

function FingerprintIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 78" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2">
        <path d="M12 30a20 20 0 0 1 40 0v5" />
        <path d="M19 30a13 13 0 0 1 26 0v11a9 9 0 0 1-1 4" />
        <path d="M26 31a6 6 0 0 1 12 0v13" />
        <path d="M32 31v18" />
        <path d="M12 40v6a25 25 0 0 0 6 16" />
        <path d="M52 40v4a30 30 0 0 1-4 17" />
        <path d="M19 46a20 20 0 0 0 5 15" />
        <path d="M45 46a22 22 0 0 1-3 16" />
        <path d="M26 49v5a14 14 0 0 0 3 10" />
        <path d="M38 49v4a16 16 0 0 1-2 12" />
      </g>
    </svg>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  error,
  autoComplete,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-[0.95rem] text-white placeholder-white/35 outline-none transition focus:bg-white/[0.06] focus:ring-2 focus:ring-[#7ef6ff]/25 ${
          error ? "border-[#ff8da3]/60 focus:border-[#ff8da3]/70" : "border-white/10 focus:border-[#7ef6ff]/55"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-[#ff8da3]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function IdentyfikacjaOnlinePage() {
  const [lang, setLang] = useState<Lang>("pl");
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", email: "", consent: false, consentContact: false });
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [copied, setCopied] = useState(false);
  const rafRef = useRef<number | null>(null);
  const copyTimer = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const t = TR[lang];
  const errors = useMemo(() => validate(form, t), [form, t]);
  const isFormValid = Object.keys(errors).length === 0;

  // Ile komunikatów błędu jest aktualnie widocznych (zmienia wysokość -> re-fit).
  const shownErrorCount =
    (touched.firstName && errors.firstName ? 1 : 0) +
    (touched.lastName && errors.lastName ? 1 : 0) +
    (touched.email && errors.email ? 1 : 0) +
    (touched.consent && errors.consent ? 1 : 0);

  const d = DISCOUNT_COPY[lang];
  // Bez wyboru wejścia — stały neutralny akcent (cyan).
  const accent = NEUTRAL;
  const glassAccentStyle = { "--ap-glass-accent": accent.rgb } as React.CSSProperties;

  const stageIndex = progress >= 0.92 ? 3 : progress >= 0.58 ? 2 : progress >= 0.28 ? 1 : 0;

  const cancelRaf = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (copyTimer.current != null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  // Auto-dopasowanie: dobierz zoom tak, aby treść wypełniła wysokość ekranu
  // BEZ scrolla (mierzymy naturalną wysokość przy zoom=1, potem skalujemy).
  // Nie zmniejszamy poniżej 1 (na telefonach zostaje czytelnie i się przewija).
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let raf = 0;
    const fit = () => {
      el.style.setProperty("zoom", "1");
      const natural = el.offsetHeight;
      if (natural > 0) {
        const available = window.innerHeight - 96; // margines na padding main + zapas
        const z = Math.min(1.5, Math.max(1, available / natural));
        el.style.setProperty("zoom", String(z));
      }
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    fit();
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    return () => {
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      cancelAnimationFrame(raf);
    };
  }, [step, lang, shownErrorCount]);

  const setField = useCallback(<K extends FieldKey>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const markTouched = useCallback((key: FieldKey) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      setCopied(true);
      if (copyTimer.current != null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTouched({ firstName: true, lastName: true, email: true, consent: true });
      if (!isFormValid) return;

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        consent: form.consent,
      };
      console.log("[identyfikacja-online] dane formularza:", payload);

      // Lead zapisujemy TYLKO przy zgodzie na kontakt (checkbox B). Flow działa dalej
      // niezależnie. Źródło „online" rozpoznasz po page_url (/aplikacje/identyfikacja-online).
      if (form.consentContact) {
        void submitLead({
          source: "identyfikacja",
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: payload.email,
          consent_contact: true,
          page_url: typeof window !== "undefined" ? window.location.href : undefined,
        }).then((result) => {
          if (!result.ok) console.warn("[identyfikacja-online] zapis leada nieudany (pomijam):", result.error);
        });
      }

      cancelRaf();
      setProgress(0);
      setHolding(false);
      setStep("scanning");
    },
    [form, isFormValid, cancelRaf],
  );

  const completeScan = useCallback(() => {
    cancelRaf();
    setHolding(false);
    setProgress(1);
    setStep("result");
  }, [cancelRaf]);

  const handleHoldStart = useCallback(() => {
    cancelRaf();
    setHolding(true);
    const start = performance.now();
    const loop = (now: number) => {
      const value = Math.min((now - start) / HOLD_MS, 1);
      setProgress(value);
      if (value >= 1) {
        rafRef.current = null;
        completeScan();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [cancelRaf, completeScan]);

  const handleHoldEnd = useCallback(() => {
    if (rafRef.current == null) return;
    cancelRaf();
    setHolding(false);
    setProgress(0);
  }, [cancelRaf]);

  const handleReset = useCallback(() => {
    cancelRaf();
    setStep("form");
    setForm({ firstName: "", lastName: "", email: "", consent: false, consentContact: false });
    setTouched({});
    setProgress(0);
    setHolding(false);
    setCopied(false);
  }, [cancelRaf]);

  return (
    <main className="relative isolate flex min-h-screen [min-height:100svh] flex-col justify-center overflow-hidden bg-[#05070e] px-4 py-8 text-white sm:px-6 sm:py-10">
      {/* Przełącznik języka — róg (PL / EN / PT), kolor akcentu strony */}
      <div className="absolute right-4 top-4 z-30 flex items-center gap-2 sm:right-6 sm:top-6">
        {LANGS.map((option) => {
          const isActive = option.code === lang;
          return (
            <button
              key={option.code}
              type="button"
              onClick={() => setLang(option.code)}
              aria-pressed={isActive}
              aria-label={option.label}
              title={option.label}
              className={`inline-flex items-center justify-center rounded-full border p-2 transition hover:brightness-110 ${
                isActive ? "" : "opacity-55 hover:opacity-100"
              }`}
              style={{
                borderColor: isActive ? `rgba(${accent.rgb}, 0.9)` : "rgba(255,255,255,0.15)",
                backgroundColor: isActive ? `rgba(${accent.rgb}, 0.16)` : "rgba(255,255,255,0.04)",
                boxShadow: isActive ? `0 0 18px -6px rgba(${accent.rgb}, 0.7)` : "none",
              }}
            >
              <Flag code={option.code} />
            </button>
          );
        })}
      </div>

      {/* Tło — neutralne poświaty */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(126,246,255,0.15),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-18%] right-[-12%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(79,207,222,0.11),transparent_60%)] blur-2xl" />
      </div>

      <div ref={contentRef} className="mx-auto w-full max-w-xl [zoom:1.15] lg:max-w-2xl">
        {/* Nagłówek */}
        <div className="mb-5 text-center">
          <Image
            src="/Loga/Logo_negatyw.svg"
            alt="Alvernia Planet"
            width={841}
            height={295}
            priority
            className="apid-in mx-auto mb-4 h-auto w-[8.5rem] sm:w-[10.5rem]"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="apid-in ap-glass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-500"
            style={{ ...glassAccentStyle, color: accent.text, animationDelay: "90ms" }}
          >
            <span className="relative inline-flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                style={{ backgroundColor: accent.text }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: accent.text }} />
            </span>
            {t.pill}
          </span>
          <h1
            className="apid-in mt-4 text-[clamp(1.7rem,1.3rem+2.1vw,2.6rem)] font-black leading-[1.05] tracking-[-0.03em]"
            style={{ animationDelay: "180ms" }}
          >
            {t.title}
          </h1>
          <div
            className="apid-in mx-auto mt-3 max-w-xl space-y-1.5 italic leading-relaxed"
            style={{ animationDelay: "280ms" }}
          >
            <p className="text-balance text-[0.85rem] text-white/70 sm:text-[0.92rem]">{t.subtitle1}</p>
            <p className="text-balance text-[0.76rem] text-white/50 sm:text-[0.82rem]">{t.subtitle2}</p>
          </div>
        </div>

        {/* Karta — liquid glass */}
        <div
          className="apid-in ap-glass rounded-[1.75rem] p-5 transition-colors duration-500 sm:p-7"
          style={{ ...glassAccentStyle, animationDelay: "380ms" }}
        >
          {step === "form" ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              {/* Oświadczenie — pełna treść na górze, przewijana w środku boksu (bez okna dialogowego) */}
              <div
                className="rounded-2xl border p-3"
                style={{
                  ...glassAccentStyle,
                  borderColor: `rgba(${accent.rgb}, 0.35)`,
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              >
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <h2 className="text-[0.8rem] font-bold uppercase tracking-[0.14em]" style={{ color: accent.text }}>
                    {t.declarationTitle}
                  </h2>
                  <span className="text-[0.64rem] text-white/40">{t.declarationHint}</span>
                </div>
                <div className="max-h-[7rem] space-y-2.5 overflow-y-auto pr-1.5 text-left">
                  {t.declarationSections.map((section) => (
                    <section key={section.title}>
                      <h3 className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-white/75">
                        {section.title}
                      </h3>
                      <div className="mt-1 space-y-1.5">
                        {section.paragraphs.map((paragraph, index) => (
                          <p key={index} className="text-[0.82rem] leading-snug text-white/60">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>

              <Field
                id="firstName"
                label={t.fieldFirst}
                autoComplete="given-name"
                value={form.firstName}
                error={touched.firstName ? errors.firstName : undefined}
                onChange={(value) => setField("firstName", value)}
                onBlur={() => markTouched("firstName")}
              />
              <Field
                id="lastName"
                label={t.fieldLast}
                autoComplete="family-name"
                value={form.lastName}
                error={touched.lastName ? errors.lastName : undefined}
                onChange={(value) => setField("lastName", value)}
                onBlur={() => markTouched("lastName")}
              />
              <Field
                id="email"
                label={t.fieldEmail}
                type="email"
                autoComplete="email"
                value={form.email}
                error={touched.email ? errors.email : undefined}
                onChange={(value) => setField("email", value)}
                onBlur={() => markTouched("email")}
              />

              <div className="space-y-3">
                {/* A — WYMAGANA zgoda na wejście na obiekt (steruje flow identyfikacji) */}
                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      aria-invalid={Boolean(touched.consent && errors.consent)}
                      onChange={(event) => {
                        setField("consent", event.target.checked);
                        markTouched("consent");
                      }}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-white/20 bg-white/5 accent-[#4fcfde]"
                    />
                    <span className="text-sm leading-snug text-white/70">{t.consentA}</span>
                  </label>
                  {touched.consent && errors.consent ? (
                    <p className="mt-1.5 text-xs font-medium text-[#ff8da3]">{errors.consent}</p>
                  ) : null}
                </div>

                {/* B — OPCJONALNA zgoda na kontakt (steruje zapisem leada do tabeli Lead) */}
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.consentContact}
                    onChange={(event) => setField("consentContact", event.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-white/20 bg-white/5 accent-[#4fcfde]"
                  />
                  <span className="text-sm leading-snug text-white/55">{t.consentB}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className="mt-1 w-full rounded-full px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.14em] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                style={{
                  background: `linear-gradient(135deg, rgba(${accent.rgb},0.85), rgba(${accent.rgb},1))`,
                  color: "#05070e",
                  boxShadow: `0 12px 34px rgba(${accent.rgb},0.4)`,
                }}
              >
                {t.submit}
              </button>

              <p className="text-center text-[0.7rem] leading-relaxed text-white/35">{t.formNote}</p>
            </form>
          ) : null}

          {step === "scanning" ? (
            <div className="flex select-none flex-col items-center py-2 text-center">
              <p className="mb-6 min-h-[1.75rem] text-base font-semibold text-white" aria-live="polite">
                {holding ? t.scanStages[stageIndex] : t.scanPrompt}
              </p>

              <button
                type="button"
                aria-label={t.scanPrompt}
                onPointerDown={(event) => {
                  event.preventDefault();
                  try {
                    event.currentTarget.setPointerCapture(event.pointerId);
                  } catch {
                    /* setPointerCapture może rzucić na starszych przeglądarkach */
                  }
                  handleHoldStart();
                }}
                onPointerUp={handleHoldEnd}
                onPointerCancel={handleHoldEnd}
                onContextMenu={(event) => event.preventDefault()}
                style={{ WebkitTapHighlightColor: "transparent" }}
                className={`relative flex h-52 w-52 touch-none items-center justify-center rounded-full outline-none transition-transform duration-200 ${
                  holding ? "scale-[0.97]" : "scale-100"
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                    holding ? "opacity-100" : "opacity-60"
                  }`}
                  style={{ background: `radial-gradient(circle at center, rgba(${accent.rgb},0.18), transparent 68%)` }}
                />
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3" />
                  <circle
                    cx="50"
                    cy="50"
                    r={RING_RADIUS}
                    fill="none"
                    stroke={accent.text}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
                    style={{ transition: holding ? "none" : "stroke-dashoffset 0.35s ease" }}
                  />
                </svg>
                <FingerprintIcon className="pointer-events-none absolute h-24 w-24 text-white/20" />
                <span
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  style={{ clipPath: `inset(${(1 - progress) * 100}% 0 0 0)`, color: accent.text }}
                >
                  <FingerprintIcon className="h-24 w-24" />
                </span>
                {holding ? (
                  <span
                    className="pointer-events-none absolute inset-x-10 h-px"
                    style={{
                      top: `${(1 - progress) * 100}%`,
                      backgroundColor: accent.text,
                      boxShadow: `0 0 14px 2px rgba(${accent.rgb},0.9)`,
                    }}
                  />
                ) : null}
              </button>

              <div className="mt-6 flex items-center gap-2" aria-hidden="true">
                {t.scanStages.map((stage, index) => (
                  <span
                    key={index}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: holding && index <= stageIndex ? "1.5rem" : "0.375rem",
                      backgroundColor: holding && index <= stageIndex ? accent.text : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>

              <p className="mt-6 text-xs font-medium text-white/50">
                {holding ? `${t.holdingProgress} ${Math.round(progress * 100)}%` : t.pressHint}
              </p>

              <p className="mt-6 max-w-sm text-xs leading-relaxed text-white/40">{t.simNote}</p>
            </div>
          ) : null}

          {step === "result" ? (
            <div className="flex flex-col items-center py-2 text-center">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-[0.2em]"
                style={{
                  backgroundColor: `rgba(${accent.rgb},0.16)`,
                  color: accent.text,
                  boxShadow: `0 0 22px -8px rgba(${accent.rgb},0.7)`,
                }}
              >
                {d.badge}
              </span>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.02em] sm:text-3xl" style={{ color: accent.text }}>
                {d.headline}
              </h2>

              {/* Kod rabatowy */}
              <div
                className="ap-glass-pill mt-5 flex w-full items-center justify-center rounded-2xl px-5 py-4"
                style={glassAccentStyle}
              >
                <span className="font-mono text-2xl font-bold tracking-[0.06em] sm:text-3xl" style={{ color: accent.text }}>
                  {DISCOUNT_CODE}
                </span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{d.desc}</p>

              <div className="mt-6 flex w-full flex-col gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full rounded-full px-6 py-3.5 text-sm font-extrabold transition hover:brightness-110"
                  style={{
                    background: `linear-gradient(135deg, rgba(${accent.rgb},0.85), rgba(${accent.rgb},1))`,
                    color: "#05070e",
                    boxShadow: `0 12px 34px rgba(${accent.rgb},0.4)`,
                  }}
                >
                  {copied ? d.copied : d.copy}
                </button>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full border border-white/20 bg-white/[0.04] px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.1]"
                >
                  {d.buy}
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full rounded-full px-6 py-2.5 text-sm font-medium text-white/55 underline decoration-white/25 underline-offset-2 transition hover:text-white"
                >
                  {d.reset}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Animacje wejścia (stagger) — z poszanowaniem prefers-reduced-motion */}
      <style>{`
        @keyframes apid-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .apid-in { animation: apid-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .apid-in { animation: none; }
        }
      `}</style>
    </main>
  );
}
