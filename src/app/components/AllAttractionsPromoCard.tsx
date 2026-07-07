"use client";

import { PrimaryButton } from "@/app/components/PrimaryButton";
import { buildBookingPath } from "@/lib/booking";
import type { Locale } from "@/lib/localizedRoutes";
import type { PromoPackage } from "@/lib/promoPackages";

// Pakietowy bilet „Wszystkie atrakcje", JEDEN kanoniczny wygląd (jak na home,
// cyjanowy). Używany 1:1 na home oraz na podstronach atrakcji. Motyw strony
// (k360 / film-path / mars) nie przemalowuje go, patrz override w globals.css
// dla `.home-ticket-promo .ticket-card-badge` / `.ticket-pill`.
export function AllAttractionsPromoCard({
  promo,
  locale,
}: {
  promo: PromoPackage;
  locale: Locale;
}) {
  return (
    <article
      className="home-ticket-promo relative overflow-hidden rounded-[1.75rem] border-2 border-[#4fcfde] px-4 py-5 shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_28px_rgba(79,207,222,0.35)] sm:px-7 sm:py-7"
      style={{
        backgroundColor: "#0a0d18",
        WebkitMask:
          "radial-gradient(circle 14px at 0 50%, transparent 14px, #000 14.5px) left center / 100% 100% no-repeat, radial-gradient(circle 14px at 100% 50%, transparent 14px, #000 14.5px) right center / 100% 100% no-repeat",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,207,222,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(247,120,40,0.16),transparent_38%),radial-gradient(circle_at_bottom_center,rgba(247,72,108,0.14),transparent_42%)]" />

      {/* Pionowa „dziurkowana" linia w środku, jak na bilecie */}
      <div
        className="pointer-events-none absolute top-6 bottom-6 hidden lg:block"
        style={{
          left: "calc(100% - 23rem)",
          width: "1px",
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.28) 0 6px, transparent 6px 12px)",
        }}
        aria-hidden="true"
      />

      <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
        <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
          <span className="ticket-card-badge mx-auto lg:mx-0 !text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
            {promo.badge}
          </span>
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-2xl font-extrabold leading-[1.02] tracking-[-0.03em] text-[color:var(--ap-text-strong)] sm:text-3xl lg:text-4xl">
              {promo.heroLead}{" "}
              <span
                className="block whitespace-nowrap bg-[linear-gradient(90deg,#4fcfde_0%,#a855f7_45%,#f7486c_65%,#f77828_100%)] bg-clip-text uppercase font-black text-transparent sm:inline"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {promo.heroHighlight}
              </span>
            </h3>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[color:var(--ap-text-dim)] sm:text-base lg:mx-0 lg:text-lg">
              {promo.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:justify-start">
            {promo.details.map((detail) => (
              <div
                key={detail}
                className="home-ticket-promo-detail rounded-full border border-[color:var(--ap-border)] bg-[color:var(--ap-surface-strong)] px-3 py-1.5 text-xs text-[color:var(--ap-text-dim)] sm:px-4 sm:py-2 sm:text-sm"
              >
                {detail}
              </div>
            ))}
          </div>
        </div>

        {/* Pozioma perforacja, tylko mobile/tablet (pod lg) */}
        <div
          className="h-px w-full lg:hidden"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.32) 0 6px, transparent 6px 12px)",
          }}
          aria-hidden="true"
        />

        <div className="flex w-full flex-col items-center gap-3 sm:gap-4 lg:w-[20rem] lg:items-stretch">
          {/* Dwie ceny: normalna + ulgowa */}
          <div className="home-ticket-promo-price ap-tile ap-tile-sm w-full px-3 py-3.5 text-center sm:px-5 sm:py-4">
            <p className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-[color:var(--ap-text-muted)] sm:text-[0.64rem] sm:tracking-[0.22em]">
              {promo.promoStripLabel}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-0">
              <div className="pr-2 sm:pr-4">
                <p className="text-[0.54rem] uppercase tracking-[0.12em] text-[color:var(--ap-text-muted)] sm:text-[0.66rem] sm:tracking-[0.18em]">
                  {promo.priceLabel}
                </p>
                <p className="mt-1 text-lg font-extrabold leading-none tracking-[-0.03em] text-[color:var(--ap-text-strong)] sm:text-2xl">
                  {promo.price}
                </p>
                <p className="mt-1.5 inline-flex flex-wrap items-center justify-center gap-1.5 text-[0.55rem] font-semibold leading-tight text-[color:var(--ap-breeze-strong)] sm:text-[0.68rem]">
                  <span>−{promo.savingsPercent}</span>
                  <span className="text-[color:var(--ap-text-muted)]">{promo.savings}</span>
                </p>
              </div>
              <div className="border-l border-[color:var(--ap-border)] pl-2 sm:pl-4">
                <p className="text-[0.54rem] uppercase tracking-[0.12em] text-[color:var(--ap-text-muted)] sm:text-[0.66rem] sm:tracking-[0.18em]">
                  {promo.reducedPriceLabel}
                </p>
                <p className="mt-1 text-lg font-extrabold leading-none tracking-[-0.03em] text-[color:var(--ap-text-strong)] sm:text-2xl">
                  {promo.reducedPrice}
                </p>
                <p className="mt-1.5 inline-flex flex-wrap items-center justify-center gap-1.5 text-[0.55rem] font-semibold leading-tight text-[color:var(--ap-breeze-strong)] sm:text-[0.68rem]">
                  <span>−{promo.reducedSavingsPercent}</span>
                  <span className="text-[color:var(--ap-text-muted)]">{promo.reducedSavings}</span>
                </p>
              </div>
            </div>
          </div>

          <PrimaryButton
            href={buildBookingPath(locale, { category: promo.category, service: promo.service, autopick: promo.autopick })}
            size="lg"
            className="ticket-pill w-full whitespace-nowrap !bg-[linear-gradient(135deg,#1ea6b7,#4fcfde,#7ef6ff)] !text-white !font-extrabold [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] !shadow-[0_10px_30px_rgba(79,207,222,0.45),0_0_24px_rgba(79,207,222,0.35)] ring-[color:rgba(79,207,222,0.6)] hover:!brightness-110"
          >
            {promo.button}
          </PrimaryButton>
        </div>
      </div>
    </article>
  );
}
