"use client";

import { FaGoogle, FaStar } from "react-icons/fa";

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
    <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-rose-500 text-black font-semibold shadow-[0_0_0_2px_rgba(255,255,255,0.15)]">
      {initial}
    </span>
  );
}

type TestimonialsProps = {
  reviews: Testimonial[];
  sourceUrl?: string;
};

export default function Testimonials({ reviews, sourceUrl }: TestimonialsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <article
          key={`${review.name}-${review.date}`}
          className="flex h-full flex-col gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.45)] sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1 text-amber-300">
              {Array.from({ length: review.rating ?? 5 }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            {review.url || sourceUrl ? (
              <a
                href={review.url || sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/15 hover:ring-white/25 transition"
                aria-label="Zobacz opinię w Google"
              >
                <FaGoogle className="text-xl text-white/80" />
              </a>
            ) : (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <FaGoogle className="text-xl text-white/80" aria-label="Google review" />
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
}
