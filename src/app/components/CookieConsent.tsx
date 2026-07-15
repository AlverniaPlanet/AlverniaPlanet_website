"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import {
  OPEN_SETTINGS_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/consent";

type Loc = "pl" | "en" | "pt";

const COOKIE_POLICY_HREF = "/legal/polityka-cookies.pdf";

type Copy = {
  title: string;
  body: string;
  policy: string;
  acceptAll: string;
  rejectAll: string;
  settings: string;
  save: string;
  alwaysOn: string;
  categories: { key: "necessary" | "analytics" | "marketing"; name: string; desc: string }[];
};

const COPY: Record<Loc, Copy> = {
  pl: {
    title: "Szanujemy Twoją prywatność",
    body: "Używamy plików cookie niezbędnych do działania strony oraz — za Twoją zgodą — do analityki i marketingu. Możesz zaakceptować wszystkie, odrzucić opcjonalne albo wybrać kategorie.",
    policy: "Polityka cookies",
    acceptAll: "Akceptuję wszystkie",
    rejectAll: "Odrzucam",
    settings: "Ustawienia",
    save: "Zapisz wybór",
    alwaysOn: "Zawsze aktywne",
    categories: [
      { key: "necessary", name: "Niezbędne", desc: "Wymagane do działania strony i zapamiętania Twojego wyboru. Zawsze aktywne." },
      { key: "analytics", name: "Analityczne", desc: "Pomagają zrozumieć, jak korzystasz ze strony (Google Analytics)." },
      { key: "marketing", name: "Marketingowe", desc: "Personalizacja i pomiar reklam (Meta Pixel)." },
    ],
  },
  en: {
    title: "We respect your privacy",
    body: "We use cookies that are necessary for the site to work and — with your consent — for analytics and marketing. You can accept all, reject optional ones, or choose categories.",
    policy: "Cookie policy",
    acceptAll: "Accept all",
    rejectAll: "Reject",
    settings: "Settings",
    save: "Save choices",
    alwaysOn: "Always on",
    categories: [
      { key: "necessary", name: "Necessary", desc: "Required for the site to work and to remember your choice. Always on." },
      { key: "analytics", name: "Analytics", desc: "Help us understand how you use the site (Google Analytics)." },
      { key: "marketing", name: "Marketing", desc: "Ad personalization and measurement (Meta Pixel)." },
    ],
  },
  pt: {
    title: "Respeitamos a sua privacidade",
    body: "Usamos cookies necessários ao funcionamento do site e — com o seu consentimento — para análise e marketing. Pode aceitar todos, rejeitar os opcionais ou escolher categorias.",
    policy: "Política de cookies",
    acceptAll: "Aceitar todos",
    rejectAll: "Rejeitar",
    settings: "Definições",
    save: "Guardar opções",
    alwaysOn: "Sempre ativo",
    categories: [
      { key: "necessary", name: "Necessários", desc: "Necessários ao funcionamento do site e para memorizar a sua escolha. Sempre ativos." },
      { key: "analytics", name: "Análise", desc: "Ajudam a perceber como utiliza o site (Google Analytics)." },
      { key: "marketing", name: "Marketing", desc: "Personalização e medição de anúncios (Meta Pixel)." },
    ],
  },
};

export default function CookieConsent() {
  const { locale } = useI18n();
  const loc: Loc = (locale as Loc) ?? "pl";
  const t = COPY[loc];

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = readConsent();
    if (!stored) {
      setVisible(true);
    } else {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
    }
    const openSettings = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
  }, []);

  if (!mounted || !visible) return null;

  const close = () => {
    setVisible(false);
    setShowSettings(false);
  };
  const acceptAll = () => {
    writeConsent({ analytics: true, marketing: true });
    close();
  };
  const rejectAll = () => {
    writeConsent({ analytics: false, marketing: false });
    close();
  };
  const savePrefs = () => {
    writeConsent({ analytics, marketing });
    close();
  };

  const btnPrimary =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition hover:brightness-110";
  const btnNeutral =
    "inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.12]";
  const btnGhost =
    "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-white/70 underline decoration-white/30 underline-offset-2 transition hover:text-white";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-4 sm:pb-4"
      role="dialog"
      aria-modal="false"
      aria-label={t.title}
    >
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[#7ef6ff]/22 bg-[#0b0e1c]/95 p-4 text-white shadow-[0_-6px_40px_rgba(4,8,20,0.55)] backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-base font-bold sm:text-lg">{t.title}</p>
            <p className="mt-1.5 text-[0.82rem] leading-relaxed text-white/70 sm:text-sm">
              {t.body}{" "}
              <Link href={COOKIE_POLICY_HREF} className="font-semibold text-[#7ef6ff] underline underline-offset-2 hover:brightness-110">
                {t.policy}
              </Link>
              .
            </p>
          </div>

          {showSettings ? (
            <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
              {t.categories.map((cat) => {
                const locked = cat.key === "necessary";
                const checked = locked ? true : cat.key === "analytics" ? analytics : marketing;
                const onToggle = () => {
                  if (locked) return;
                  if (cat.key === "analytics") setAnalytics((v) => !v);
                  else setMarketing((v) => !v);
                };
                return (
                  <div key={cat.key} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{cat.name}</p>
                      <p className="mt-0.5 text-[0.78rem] leading-snug text-white/60">{cat.desc}</p>
                    </div>
                    {locked ? (
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-[#7ef6ff]/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#7ef6ff]">
                        {t.alwaysOn}
                      </span>
                    ) : (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={checked}
                        aria-label={cat.name}
                        onClick={onToggle}
                        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
                          checked ? "bg-[#4fcfde]" : "bg-white/15"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                            checked ? "left-[1.375rem]" : "left-0.5"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button type="button" onClick={acceptAll} className={btnPrimary} style={{ background: "linear-gradient(135deg,#4fcfde,#7ef6ff)", color: "#05070e" }}>
              {t.acceptAll}
            </button>
            <button type="button" onClick={rejectAll} className={btnNeutral}>
              {t.rejectAll}
            </button>
            {showSettings ? (
              <button type="button" onClick={savePrefs} className={btnNeutral}>
                {t.save}
              </button>
            ) : (
              <button type="button" onClick={() => setShowSettings(true)} className={btnGhost}>
                {t.settings}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
