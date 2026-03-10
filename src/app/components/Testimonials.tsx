"use client";

import { memo } from "react";
import { useI18n } from "@/app/i18n-provider";

export type Testimonial = {
  name: string;
  date: string;
  text: string;
  url?: string;
  rating?: number;
};

function AvatarBadge({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "•";
  return (
    <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#f03c64] via-[#f77828] to-[#4fcfde] text-[#171730] font-semibold shadow-[0_0_0_2px_rgba(255,255,255,0.15)]">
      {initial}
    </span>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="m12 2.2 3 6.08 6.7.97-4.85 4.73 1.14 6.68L12 17.5 6.01 20.66l1.14-6.68L2.3 9.25 9 8.28 12 2.2Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        d="M21.8 12.23c0-.76-.07-1.49-.2-2.2H12v4.16h5.5a4.7 4.7 0 0 1-2.05 3.08v2.56h3.3c1.93-1.78 3.05-4.4 3.05-7.6Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.07-.91 6.76-2.47l-3.3-2.56c-.91.61-2.08.97-3.46.97-2.66 0-4.92-1.8-5.73-4.22H2.86v2.64A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.27 13.72A5.99 5.99 0 0 1 5.95 12c0-.6.1-1.18.32-1.72V7.64H2.86A10 10 0 0 0 2 12c0 1.61.38 3.14 1.06 4.36l3.21-2.64Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.06c1.5 0 2.84.52 3.89 1.53l2.91-2.9C17.06 3.07 14.75 2 12 2A10 10 0 0 0 2.86 7.64l3.41 2.64C7.08 7.86 9.34 6.06 12 6.06Z"
        fill="#EA4335"
      />
    </svg>
  );
}

type TestimonialsProps = {
  reviews: Testimonial[];
  sourceUrl?: string;
};

const Testimonials = memo(function Testimonials({
  reviews,
  sourceUrl,
}: TestimonialsProps) {
  const { locale } = useI18n();
  const googleLabel =
    locale === "en"
      ? "View review on Google"
      : locale === "pt"
      ? "Ver avaliação no Google"
      : "Zobacz opinię w Google";
  const googleFallback =
    locale === "en" ? "Google review" : locale === "pt" ? "Avaliação no Google" : "Google review";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <article
          key={`${review.name}-${review.date}`}
          className="ap-tile flex h-full flex-col gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.45)] sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1 text-[#f77828]">
              {Array.from({ length: review.rating ?? 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            {review.url || sourceUrl ? (
              <a
                href={review.url || sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/15 hover:ring-white/25"
                aria-label={googleLabel}
              >
                <GoogleIcon />
              </a>
            ) : (
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"
                aria-label={googleFallback}
              >
                <GoogleIcon />
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-white/80">{review.text}</p>

          <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-3">
            <AvatarBadge name={review.name} />
            <div>
              <p className="font-semibold text-white">{review.name}</p>
              <p className="text-xs text-white/60">{review.date}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
});

export default Testimonials;
