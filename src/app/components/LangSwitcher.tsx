"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/app/i18n-provider";

type LangOption = { code: "pl" | "en"; label: string };

const OPTIONS: LangOption[] = [
  { code: "pl", label: "Polski" },
  { code: "en", label: "English" },
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

export default function LangSwitcher() {
  const { locale, setLocale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!mounted) return null;

  const active = OPTIONS.find((opt) => opt.code === locale) ?? OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center rounded-full bg-[color:var(--ap-surface-strong)] ring-1 ring-[color:var(--ap-border)] px-2.5 py-1.5 hover:bg-[color:var(--ap-surface-contrast)] transition"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch language"
      >
        <Flag code={active.code} />
        <svg
          aria-hidden="true"
          className={`ml-2 h-3 w-3 text-[color:var(--ap-text)] transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.085l3.71-3.855a.75.75 0 1 1 1.08 1.04l-4.24 4.41a.75.75 0 0 1-1.08 0l-4.24-4.41a.75.75 0 0 1 .02-1.06z" />
        </svg>
      </button>

      <div
        className={`absolute right-0 top-full mt-1 w-24 origin-top overflow-hidden rounded-xl bg-[color:var(--ap-surface-contrast)] ring-1 ring-[color:var(--ap-border)] shadow-lg transition-all duration-150 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <ul role="listbox" aria-label="Available languages" className="py-2 text-sm text-[color:var(--ap-text)]">
          {OPTIONS.map((opt) => (
            <li key={opt.code}>
              <button
                type="button"
                onClick={() => {
                  setLocale(opt.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 hover:bg-[color:var(--ap-surface-strong)] transition text-left ${
                  opt.code === active.code ? "opacity-100" : "opacity-80"
                }`}
                role="option"
                aria-selected={opt.code === active.code}
              >
                <Flag code={opt.code} />
                <span className="sr-only">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
