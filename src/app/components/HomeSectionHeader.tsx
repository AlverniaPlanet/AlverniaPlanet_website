import Link from "next/link";
import type { ReactNode } from "react";

// Lewa „szyna" sekcji na stronie głównej: duży cień numeru (opcjonalny) + czerwona
// kreska, tytuł, podtytuł, CTA i ewentualne dodatki (np. strzałki karuzeli).
type HomeSectionHeaderProps = {
  number?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  children?: ReactNode;
  className?: string;
};

export default function HomeSectionHeader({
  number,
  title,
  subtitle,
  cta,
  children,
  className = "",
}: HomeSectionHeaderProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-4">
        {number ? (
          <span
            className="select-none text-[clamp(2.6rem,6vw,4.6rem)] font-black leading-none tracking-[-0.04em] text-white/[0.13]"
            aria-hidden="true"
          >
            {number}
          </span>
        ) : null}
        <span className="h-[3px] w-10 rounded-full bg-[#4fcfde] shadow-[0_0_12px_rgba(79,207,222,0.6)] sm:w-12" />
      </div>

      <h2 className="mt-2 text-pretty text-[clamp(1.9rem,3.4vw,3.1rem)] font-black uppercase leading-[0.98] tracking-[-0.02em] text-white [overflow-wrap:break-word]">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-4 max-w-xs text-base leading-relaxed text-white/60 sm:text-[1.05rem]">
          {subtitle}
        </p>
      ) : null}

      {cta ? (
        <Link
          href={cta.href}
          className="group mt-6 inline-flex items-center gap-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-white transition hover:text-[#ff96aa]"
        >
          {cta.label}
          <span aria-hidden="true" className="text-[#f7486c] transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      ) : null}

      {children}
    </div>
  );
}
