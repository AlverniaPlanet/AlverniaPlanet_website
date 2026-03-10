"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import { getLocalizedPath, mapToPolishRoute, normalizePathname, type Locale } from "@/lib/localizedRoutes";

type LangOption = { code: Locale; label: string };

const OPTIONS: LangOption[] = [
  { code: "pl", label: "Polski" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
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
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const active = OPTIONS.find((opt) => opt.code === locale) ?? OPTIONS[0];

  const switchLocale = (target: LangOption["code"]) => {
    const current = normalizePathname(pathname);
    const nextPath = getLocalizedPath(mapToPolishRoute(current), target);
    setLocale(target);
    router.push(nextPath);
  };

  return (
    <div className="inline-flex items-center gap-2">
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
  );
}
