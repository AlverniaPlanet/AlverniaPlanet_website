import type { Locale } from "./films";
import { FILM_LANGUAGE_COPY } from "./films";

// Plakietka „seans w wersji polskiej" — flaga + krótki podpis.
// Dla gości z zagranicy to informacja, którą trzeba znać PRZED kupnem biletu,
// dlatego pokazujemy ją zarówno na kartach repertuaru, jak i na podstronie filmu.
// Flaga niesie skojarzenie od razu, tekst niesie właściwe znaczenie (flaga jest
// dekoracyjna i ukryta przed czytnikami ekranu).

function PolishFlag({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 18 12"
      className={className}
      style={{ borderRadius: 2 }}
    >
      <rect width="18" height="12" fill="#ffffff" />
      <rect y="6" width="18" height="6" fill="#dc2626" />
      <rect width="18" height="12" fill="none" stroke="#0f172a" strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

export default function LanguageBadge({
  locale,
  size = "sm",
  className = "",
}: {
  locale: Locale;
  /** "sm" = karta repertuaru, "md" = hero podstrony filmu */
  size?: "sm" | "md";
  className?: string;
}) {
  const label = FILM_LANGUAGE_COPY[locale].badge;
  const isMd = size === "md";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] font-semibold uppercase text-white/85 ${
        isMd ? "px-3 py-1 text-[0.62rem] tracking-[0.1em]" : "px-2 py-0.5 text-[0.56rem] tracking-[0.1em]"
      } ${className}`}
    >
      <PolishFlag className={isMd ? "h-[0.72rem] w-[1.08rem]" : "h-[0.62rem] w-[0.93rem]"} />
      {label}
    </span>
  );
}
