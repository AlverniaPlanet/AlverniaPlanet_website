"use client";

import { memo, type CSSProperties } from "react";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import Image from "next/image";
import AdaptiveVideo from "@/app/components/AdaptiveVideo";

type Accent = "red" | "orange" | "cyan";

type AttractionCardProps = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  accent?: Accent;
  highlightLabel?: string;
  cornerLabel?: string;
  featured?: boolean;
  videoMp4?: string;
  videoWebm?: string;
  videoPoster?: string;
};

const ACCENT_HEX: Record<Accent, { bg: string; text: string; glow: string }> = {
  red: { bg: "#f7486c", text: "#ffffff", glow: "rgba(247,72,108,0.45)" },
  orange: { bg: "#f77828", text: "#ffffff", glow: "rgba(247,120,40,0.45)" },
  cyan: { bg: "#4fcfde", text: "#ffffff", glow: "rgba(79,207,222,0.45)" },
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
      "ticket-pill !bg-[linear-gradient(135deg,#e2580c,#f59044)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_0_10px_rgba(0,0,0,0.35)] !shadow-[0_8px_18px_rgba(247,120,40,0.45)] ring-[color:rgba(247,120,40,0.6)] hover:!brightness-110",
  },
  cyan: {
    glow: "radial-gradient(circle at bottom left, rgba(79,207,222,0.18), transparent 38%), radial-gradient(circle at top right, rgba(79,207,222,0.08), transparent 32%)",
    border: "border-[rgba(79,207,222,0.32)]",
    ring: "ring-[rgba(79,207,222,0.24)]",
    buttonClass:
      "ticket-pill !bg-[linear-gradient(135deg,#1ea6b7,#4fcfde)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_0_10px_rgba(0,0,0,0.35)] !shadow-[0_8px_18px_rgba(79,207,222,0.45)] ring-[color:rgba(79,207,222,0.6)] hover:!brightness-110",
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
  highlightLabel,
  cornerLabel,
  featured = false,
  videoMp4,
  videoWebm,
  videoPoster,
}: AttractionCardProps) {
  const tokens = ACCENT_TOKENS[accent];
  const accentColors = ACCENT_HEX[accent];

  return (
    <Card
      variant="solid"
      dense
      motion="off"
      className={`group ap-interactive-surface relative overflow-hidden text-white/90 border ${tokens.border} ring-1 ${tokens.ring} ${
        featured
          ? "h-full bg-white/[0.1] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_28px_60px_rgba(0,0,0,0.5)] lg:-translate-y-2"
          : "h-full bg-white/8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] lg:h-auto"
      }`}
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
      <div className={`relative flex h-full flex-col items-center text-center ${featured ? "gap-5" : "gap-4"}`}>
        <div
          className={`relative w-full overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.35)] ${
            featured ? "aspect-[16/11]" : "aspect-[16/10]"
          }`}
        >
          {videoMp4 ? (
            <AdaptiveVideo
              mp4Src={videoMp4}
              webmSrc={videoWebm}
              poster={videoPoster ?? image}
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              sizes="(min-width: 1280px) 460px, (min-width: 640px) 360px, 300px"
              preferPosterOnLowPower
            />
          ) : (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 420px, (min-width: 640px) 332px, 300px"
              quality={70}
              fetchPriority="low"
              loading="lazy"
              decoding="async"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              priority={false}
            />
          )}
          {cornerLabel ? (
            <span
              className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full px-2.5 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.22em] shadow-[0_4px_14px_rgba(0,0,0,0.45)] ring-1 ring-white/30 sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[0.64rem] sm:tracking-[0.24em]"
              style={{
                backgroundColor: accentColors.bg,
                color: accentColors.text,
                boxShadow: `0 6px 18px ${accentColors.glow}, 0 0 16px ${accentColors.glow}`,
              }}
            >
              {cornerLabel}
            </span>
          ) : null}
          {highlightLabel ? (
            <span className="absolute left-1/2 bottom-3 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#f5b301,#fcd34d)] px-2.5 py-1 text-[0.56rem] font-extrabold uppercase tracking-[0.16em] text-[#231903] shadow-[0_6px_18px_rgba(251,191,36,0.45)] ring-1 ring-black/10 sm:px-3.5 sm:py-1.5 sm:text-[0.64rem] sm:tracking-[0.2em] lg:bottom-auto lg:top-4">
              <svg
                width="11"
                height="11"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
                className="text-[#7a5c00] sm:h-3 sm:w-3"
              >
                <path d="M1.5 5.2 4.4 7l1.9-4.6L8 5l1.7-2.6L11.6 7l2.9-1.8L13 12.7H3L1.5 5.2zM3 14h10v1.2H3V14z" />
              </svg>
              {highlightLabel}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <h3
            className={`font-bold leading-tight tracking-[-0.02em] text-white ${
              featured ? "text-[1.7rem] sm:text-[2rem] lg:text-[2.25rem]" : "text-2xl sm:text-[1.7rem]"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-gray-200 ${
              featured ? "text-sm sm:text-base lg:text-[1.05rem] max-w-[38ch]" : "text-sm sm:text-base max-w-[34ch]"
            }`}
          >
            {description}
          </p>
        </div>
        <div className="mt-auto flex w-full justify-center pt-2">
          <PrimaryButton
            href={href}
            size={featured ? "md" : "sm"}
            className={`w-full whitespace-nowrap ${tokens.buttonClass}`}
          >
            {cta}
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
});
