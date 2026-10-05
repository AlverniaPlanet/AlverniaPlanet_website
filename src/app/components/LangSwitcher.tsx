"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import { getLocalizedPath, mapToPolishRoute, normalizePathname, type Locale } from "@/lib/localizedRoutes";
import { SolarIcon } from "@/app/components/SolarIcon";

type LangOption = { code: Locale; label: string };

const OPTIONS: LangOption[] = [
  { code: "pl", label: "Polski" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
];

function Flag({ code }: { code: LangOption["code"] }) {
  if (code === "pl") {
    return (
      <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" className="rounded-[3px]">
        <rect width="18" height="12" fill="#ffffff" />
        <rect y="6" width="18" height="6" fill="#dc2626" />
        <rect width="18" height="12" fill="none" stroke="#0f172a" strokeWidth="0.35" opacity="0.2" />
      </svg>
    );
  }
  if (code === "pt") {
    return (
      <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" className="rounded-[3px] overflow-hidden">
        <rect width="18" height="12" fill="#da291c" />
        <rect width="7" height="12" fill="#046a38" />
        <circle cx="7" cy="6" r="2.5" fill="#f5c542" opacity="0.95" />
        <circle cx="7" cy="6" r="1.4" fill="#da291c" opacity="0.9" />
        <rect width="18" height="12" fill="none" stroke="#0f172a" strokeWidth="0.35" opacity="0.25" />
      </svg>
    );
  }
  if (code === "de") {
    return (
      <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" className="rounded-[3px] overflow-hidden">
        <rect width="18" height="4" fill="#000000" />
        <rect y="4" width="18" height="4" fill="#dd0000" />
        <rect y="8" width="18" height="4" fill="#ffce00" />
        <rect width="18" height="12" fill="none" stroke="#0f172a" strokeWidth="0.35" opacity="0.25" />
      </svg>
    );
  }
  if (code === "zh") {
    return (
      <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" className="rounded-[3px] overflow-hidden">
        <rect width="18" height="12" fill="#de2910" />
        <path d="M3.4 1.6l.62 1.9-1.62-1.18h2l-1.62 1.18z" fill="#ffde00" />
        <circle cx="6.6" cy="1.5" r="0.42" fill="#ffde00" />
        <circle cx="7.8" cy="2.7" r="0.42" fill="#ffde00" />
        <circle cx="7.8" cy="4.4" r="0.42" fill="#ffde00" />
        <circle cx="6.6" cy="5.6" r="0.42" fill="#ffde00" />
        <rect width="18" height="12" fill="none" stroke="#0f172a" strokeWidth="0.35" opacity="0.25" />
      </svg>
    );
  }
  // Simplified Union Jack (blue/white/red)
  return (
    <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" className="rounded-[3px] overflow-hidden">
      <rect width="18" height="12" fill="#0b3f8c" />
      <path d="M0 0l6.5 4H5L0 1v-1zM18 0l-6.5 4H13L18 1V0zM0 12l6.5-4H5L0 11v1zM18 12l-6.5-4H13l5 3v1z" fill="#ffffff" />
      <path d="M7.5 4L0 0v1l5 3h2.5zm3 0L18 0v1l-5 3h-2.5zm-3 4L0 12v-1l5-3h2.5zm3 0L18 12v-1l-5-3h-2.5z" fill="#d91c1c" />
      <path d="M0 4.5h7v-4.5h4v4.5h7v3h-7v4.5h-4v-4.5H0z" fill="#ffffff" />
      <path d="M0 5.25h7.5V0h3V5.25H18v1.5h-7.5V12h-3V6.75H0z" fill="#d91c1c" />
      <rect width="18" height="12" fill="none" stroke="#0f172a" strokeWidth="0.35" opacity="0.3" />
    </svg>
  );
}

/* `wariant`:
   - "pasek"   — dotychczasowy wygląd (flagi w pasku i rozwijana lista),
   - "kody"    — rząd pigułek z kodami języków, bez flag; używany w menu
                 mobilnym. Logika przełączania jest ta sama (switchLocale),
                 zmienia się wyłącznie warstwa wizualna. */
export default function LangSwitcher({ wariant = "pasek" }: { wariant?: "pasek" | "kody" } = {}) {
  const { locale, setLocale, t: etykieta } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!mounted) return null;

  const etykietaJezyka = etykieta("aria.language");
  const active = OPTIONS.find((opt) => opt.code === locale) ?? OPTIONS[0];
  const others = OPTIONS.filter((opt) => opt.code !== active.code);

  const switchLocale = (target: LangOption["code"]) => {
    const current = normalizePathname(pathname);
    const nextPath = getLocalizedPath(mapToPolishRoute(current), target);
    setLocale(target);
    router.push(nextPath);
    setOpen(false);
  };

  if (wariant === "kody") {
    return (
      <div className="flex items-center gap-1.5" role="group" aria-label={etykietaJezyka}>
        {OPTIONS.map((opt) => {
          const isActive = opt.code === active.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => switchLocale(opt.code)}
              aria-pressed={isActive}
              lang={opt.code}
              className={`ap-lang-kod ${isActive ? "is-active" : ""}`}
            >
              {opt.code.toUpperCase()}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: 3 flags side by side */}
      <div className="inline-flex items-center gap-2 md:hidden">
        {OPTIONS.map((opt) => {
          const isActive = opt.code === active.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => switchLocale(opt.code)}
              className={`ap-lang-pill inline-flex items-center justify-center rounded-full ring-1 px-2.5 py-1.5 transition ${
                isActive
                  ? "is-active bg-[color:var(--ap-surface-contrast)] ring-[color:var(--ap-border)]"
                  : "bg-[color:var(--ap-surface-strong)] ring-[color:var(--ap-border)] opacity-88 hover:opacity-100"
              }`}
              aria-pressed={isActive}
              aria-label={opt.label}
              title={opt.label}
            >
              <Flag code={opt.code} />
            </button>
          );
        })}
      </div>

      {/* Desktop: dropdown */}
      <div ref={containerRef} className="relative hidden md:inline-flex">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="ap-lang-pill is-active inline-flex items-center gap-1.5 rounded-full ring-1 bg-[color:var(--ap-surface-contrast)] ring-[color:var(--ap-border)] px-2.5 py-1.5 transition"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`${active.label}, zmień język`}
          title={active.label}
        >
          <Flag code={active.code} />
          <SolarIcon
            name="chevron-down"
            size={10}
            weight="bold"
            className={`text-[color:var(--ap-text-dim)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open ? (
          <div
            role="listbox"
            className="absolute right-0 top-full z-40 mt-2 flex min-w-max flex-col gap-1 rounded-2xl border border-[color:var(--ap-border)] bg-[color:var(--ap-surface-contrast)] p-1.5 shadow-[0_18px_42px_rgba(0,0,0,0.32)]"
          >
            {others.map((opt) => (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => switchLocale(opt.code)}
                className="ap-lang-pill inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-left text-xs text-[color:var(--ap-text)] transition hover:bg-[color:var(--ap-surface-strong)]"
                title={opt.label}
              >
                <Flag code={opt.code} />
                <span className="whitespace-nowrap">{opt.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
