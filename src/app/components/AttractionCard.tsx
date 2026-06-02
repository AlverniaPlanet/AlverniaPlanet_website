"use client";

import { memo, type CSSProperties } from "react";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import Image from "next/image";

type Accent = "red" | "orange" | "cyan";

type AttractionCardProps = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  accent?: Accent;
};

const ACCENT_TOKENS: Record<
  Accent,
  {
    glow: string;
    border: string;
    ring: string;
    buttonClass: string;
  }
> = {
  red: {
    glow: "radial-gradient(circle at bottom left, rgba(247,72,108,0.18), transparent 38%), radial-gradient(circle at top right, rgba(247,72,108,0.08), transparent 32%)",
    border: "border-[rgba(247,72,108,0.32)]",
    ring: "ring-[rgba(247,72,108,0.24)]",
    buttonClass:
      "ticket-pill !bg-[#f7486c] ring-[color:rgba(247,72,108,0.55)] hover:!brightness-110",
  },
  orange: {
    glow: "radial-gradient(circle at bottom left, rgba(247,120,40,0.18), transparent 38%), radial-gradient(circle at top right, rgba(247,120,40,0.08), transparent 32%)",
    border: "border-[rgba(247,120,40,0.32)]",
    ring: "ring-[rgba(247,120,40,0.24)]",
    buttonClass:
      "ticket-pill !bg-[linear-gradient(135deg,#f77828,#ffb585)] !text-[#2a0f04] !shadow-[0_8px_18px_rgba(247,120,40,0.32)] ring-[color:rgba(247,120,40,0.55)] hover:!brightness-110",
  },
  cyan: {
    glow: "radial-gradient(circle at bottom left, rgba(79,207,222,0.18), transparent 38%), radial-gradient(circle at top right, rgba(79,207,222,0.08), transparent 32%)",
    border: "border-[rgba(79,207,222,0.32)]",
    ring: "ring-[rgba(79,207,222,0.24)]",
    buttonClass:
      "ticket-pill !bg-[linear-gradient(135deg,#4fcfde,#7ef6ff)] !text-[#062a33] !shadow-[0_8px_18px_rgba(79,207,222,0.32)] ring-[color:rgba(79,207,222,0.55)] hover:!brightness-110",
  },
};

export const AttractionCard = memo(function AttractionCard({
  title,
  description,
  cta,
  href,
  image,
  imageAlt,
  accent = "red",
}: AttractionCardProps) {
  const tokens = ACCENT_TOKENS[accent];

  return (
    <Card
      variant="solid"
      dense
      motion="off"
      className={`group ap-interactive-surface relative h-full overflow-hidden bg-white/8 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] border ${tokens.border} ring-1 ${tokens.ring}`}
      style={
        {
          "--ap-card-hover-base-shadow":
            "var(--ap-shadow), inset 0 0 0 1px rgba(255,255,255,0.04)",
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundImage: tokens.glow }}
        aria-hidden="true"
      />
      <div className="relative flex h-full flex-col items-center gap-4 text-center">
        <div className="relative w-full overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.35)] aspect-[16/10]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 352px, (min-width: 640px) 332px, 300px"
            quality={70}
            fetchPriority="low"
            loading="lazy"
            decoding="async"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            priority={false}
          />
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <h3 className="text-2xl sm:text-[1.7rem] font-bold leading-tight tracking-[-0.02em] text-white">
            {title}
          </h3>
          <p className="text-gray-200 text-sm sm:text-base max-w-[34ch]">{description}</p>
        </div>
        <div className="mt-auto flex w-full justify-center pt-2">
          <PrimaryButton
            href={href}
            size="sm"
            className={`w-full whitespace-nowrap ${tokens.buttonClass}`}
          >
            {cta}
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
});
