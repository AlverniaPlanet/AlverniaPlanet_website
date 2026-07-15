"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import {
  buildBookingPath,
  K360_BOOKING_CATEGORY,
  k360FilmService,
} from "@/lib/booking";
import { getLocalizedPath } from "@/lib/localizedRoutes";
import { SolarIcon, type SolarIconName } from "@/app/components/SolarIcon";
import {
  FILMS,
  FILMS_COPY,
  FILM_DETAILS,
  REPERTOIRE_COPY,
  type Locale,
} from "./films";

// Jedna ikona najlepiej pasująca do każdego filmu (boczne kolumny panelu).
const FILM_ICONS: Record<string, SolarIconName> = {
  "one-step-beyond": "planet",
  time: "clock",
  explore: "rocket",
  "the-stellars": "alien",
};

// Sekcja repertuaru Kina 360 — akordeon 4 filmów: wybrany rozwija się na szerokość
// (z opisem), reszta jako plakaty. Używana na stronie kina (/atrakcje/kino-360)
// oraz na stronie głównej pod hero.
export default function RepertoireSection({ className = "" }: { className?: string }) {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = REPERTOIRE_COPY[loc];

  const defaultFilm = Math.max(0, FILMS.findIndex((f) => f.nowShowing));
  const [activeFilm, setActiveFilm] = useState(defaultFilm);
  // Kolor „glassa" podąża za akcentem aktualnie wybranego filmu.
  const activeAccent = FILM_DETAILS[FILMS[activeFilm].slug].accent;

  // Boczne ikony filmów: wybrany świeci na cyjanowo (z poświatą), pozostałe białe.
  const renderFilmIcons = () =>
    FILMS.map((film, i) => {
      const isActive = i === activeFilm;
      return (
        <span
          key={film.slug}
          className="inline-flex"
          style={{
            color: isActive ? "#4fcfde" : "#ffffff",
            opacity: isActive ? 1 : 0.5,
            filter: isActive ? "drop-shadow(0 0 12px rgba(79,207,222,0.75))" : "none",
            transition: "color 300ms ease, filter 300ms ease, opacity 300ms ease",
          }}
        >
          <SolarIcon name={FILM_ICONS[film.slug]} size="2.15rem" />
        </span>
      );
    });

  // Lekki reveal wjazdowy (transform+opacity = kompozytor GPU, bez bibliotek/zasobów).
  // Sterowany STANEM Reacta (nie classList.add), bo className kafli jest dynamiczny.
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      setSettled(true);
      return;
    }
    const root = sectionRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!revealed || settled) return;
    const id = window.setTimeout(() => setSettled(true), 1300);
    return () => window.clearTimeout(id);
  }, [revealed, settled]);
  const revealCls = settled ? "" : `wpk-reveal${revealed ? " is-visible" : ""}`;

  return (
    <section ref={sectionRef} id="repertuar" className={`mx-auto w-full max-w-[88rem] scroll-mt-24 2xl:max-w-[104rem] ${className}`}>
      {/* Panel repertuaru — ciemna, mniej przezroczysta baza; poświata w kolorze
          wybranego filmu w osobnej warstwie (kolor przenika wolno, @property --rep-accent). */}
      <div
        className="rep-glass relative overflow-hidden rounded-[1rem] border px-5 py-12 sm:rounded-[1.25rem] sm:px-10 sm:py-16"
        style={{
          ["--rep-accent" as string]: activeAccent,
          borderColor: `${activeAccent}55`,
          background:
            "linear-gradient(180deg, rgba(9,5,13,0.72) 0%, rgba(6,4,10,0.72) 52%, rgba(3,2,6,0.88) 100%)",
        }}
      >
        {/* Poświata + tint w kolorze filmu (dziedziczy --rep-accent). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 95% at 50% -8%, color-mix(in srgb, var(--rep-accent) 34%, transparent), transparent 58%), linear-gradient(180deg, color-mix(in srgb, var(--rep-accent) 16%, transparent) 0%, transparent 52%)",
          }}
        />
        {/* Delikatna ramka na glassie (w kolorze filmu), za treścią — jakby obraz w ramce. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2.5 rounded-[0.7rem] border sm:inset-4 sm:rounded-[0.95rem]"
          style={{
            borderColor: "color-mix(in srgb, var(--rep-accent) 22%, transparent)",
            boxShadow: "inset 0 1px 26px color-mix(in srgb, var(--rep-accent) 9%, transparent)",
          }}
        />
        {/* Boczne kolumny — jedna ikona na film; wybrany świeci na cyjanowo, reszta biała (tylko 2xl+). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[calc((100%-72rem)/2)] flex-col items-center justify-center gap-16 2xl:flex"
        >
          {renderFilmIcons()}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[calc((100%-72rem)/2)] flex-col items-center justify-center gap-16 2xl:flex"
        >
          {renderFilmIcons()}
        </div>
        {/* Treść (nagłówek + kafle) w oryginalnej szerokości, wyśrodkowana — szersze jest tylko tło */}
        <div className="relative z-10 mx-auto w-full max-w-[72rem]">
          <div className={`text-center ${revealCls}`}>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#ff96aa]/90 sm:text-[0.72rem] sm:tracking-[0.28em]">
              {t.kicker}
            </p>
            <h2 className="mt-2 text-pretty text-[clamp(1.9rem,6vw,3.8rem)] font-black leading-[1.03] tracking-[-0.035em] text-white">
              {t.title}
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,#f7486c,#ff96aa)] shadow-[0_0_14px_rgba(247,72,108,0.6)]" />
            <p className="mx-auto mt-5 text-base leading-relaxed text-white/72 sm:text-lg lg:whitespace-nowrap">
              {t.intro}
            </p>
          </div>

          {/* Akordeon-zakładki: wybrany rozwija się na szerokość, reszta jako mniejsze plakaty.
              Rozwijanie po KLIKNIĘCIU. Na mobile układ pionowy (rozwijanie w wysokość).
              [overflow-anchor:none] — kontener ma stałą wysokość; blokujemy scroll anchoring,
              żeby zmiana rozmiaru kafli nie wywoływała mikroprzewinięć strony (drżenie). */}
          <div className="mt-9 flex h-[38rem] flex-col gap-2.5 [overflow-anchor:none] sm:h-[32rem] sm:flex-row sm:items-center sm:gap-3 lg:h-[34rem]">
            {FILMS.map((film, index) => {
              const fc = FILMS_COPY[loc][film.slug];
              const detail = FILM_DETAILS[film.slug];
              const accent = detail.accent;
              const accentSoft = detail.accentSoft;
              const isActive = index === activeFilm;
              // „Kup bilet" prowadzi do rezerwacji z automatycznie wybranym biletem TEGO filmu.
              const filmBookingHref = buildBookingPath(loc, {
                category: K360_BOOKING_CATEGORY,
                service: k360FilmService(film.slug),
                autopick: true,
              });
              // Ramka (ring) + poświata kafla w kolorze danego filmu; mocniejsza gdy aktywny.
              const tileShadow = isActive
                ? `0 0 0 1px ${accent}b3, 0 22px 60px rgba(0,0,0,0.5), 0 0 28px ${accent}47`
                : `0 0 0 1px ${accent}66`;
              return (
                <div
                  key={film.slug}
                  style={{ "--wpk-reveal-delay": `${120 + index * 90}ms`, "--rep-active": isActive ? 1 : 0, boxShadow: tileShadow } as CSSProperties}
                  className={`rep-tile ${settled ? "rep-tile-anim " : ""}${revealCls} group relative min-h-0 min-w-0 overflow-hidden rounded-2xl bg-[#0a0612] sm:rounded-[1.4rem] ${
                    isActive
                      ? "sm:h-full"
                      : "sm:h-[13rem] md:h-[16rem] lg:h-[20rem]"
                  }`}
                >
                  <Image
                    src={film.poster}
                    alt={film.title}
                    fill
                    sizes="(min-width:640px) 40vw, 92vw"
                    style={detail.posterPos ? { objectPosition: detail.posterPos } : undefined}
                    className={`object-cover transition-transform duration-500 ease-out ${
                      isActive ? "scale-[1.02]" : "scale-100 sm:group-hover:scale-[1.04]"
                    }`}
                  />
                  {/* Fade od dołu: mocny pod tekstem na rozwiniętym, lżejszy pod tytułem na zakładce */}
                  <div
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                      isActive
                        ? "bg-[linear-gradient(to_top,#0a0612_0%,rgba(10,6,18,0.82)_30%,rgba(10,6,18,0.25)_56%,transparent_78%)]"
                        : "bg-[linear-gradient(to_top,#0a0612_0%,rgba(10,6,18,0.6)_22%,transparent_52%)]"
                    }`}
                  />

                  {/* Wyzwalacz rozwinięcia. Tylko onClick (Enter/Space działa natywnie na
                      <button>) — NIE onFocus: focus podczas resize'u dublował zmianę stanu
                      i mógł powodować przewijanie do elementu. Klik już aktywnego = no-op. */}
                  <button
                    type="button"
                    onClick={() => {
                      if (index !== activeFilm) setActiveFilm(index);
                    }}
                    aria-expanded={isActive}
                    aria-label={`${film.title} — ${fc.tagline}`}
                    className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff96aa]"
                  />

                  {/* Tytuł na dole zwiniętej zakładki (nad fade), na wszystkich szerokościach */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 transition-opacity duration-300 sm:p-4 ${
                      isActive ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <h3 className="line-clamp-2 text-sm font-black leading-tight tracking-[-0.01em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.85)] sm:text-base">
                      {film.title}
                    </h3>
                  </div>

                  {/* Treść (stan rozwinięty) */}
                  <div
                    className={`pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-4 transition-opacity duration-500 sm:p-6 ${
                      isActive ? "opacity-100 delay-150" : "opacity-0"
                    }`}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {film.badges.map((b) => (
                        <span
                          key={b}
                          className="rounded-full border px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-white/90"
                          style={{ borderColor: `${accent}66`, backgroundColor: `${accent}30` }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-2.5 text-pretty text-2xl font-black leading-[1.05] tracking-[-0.02em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.75)] sm:text-3xl">
                      {film.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-bold [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:text-base" style={{ color: accentSoft }}>
                      {fc.tagline}
                    </p>
                    <p className="mt-1.5 line-clamp-3 max-w-md text-[0.85rem] leading-relaxed text-white/78 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] max-sm:hidden">
                      {fc.desc}
                    </p>
                    <p className="mt-2 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-white/55">
                      {fc.audience}
                    </p>
                    <div className={`mt-3.5 flex flex-wrap items-center gap-2 ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}>
                      <Link
                        href={filmBookingHref}
                        tabIndex={isActive ? 0 : -1}
                        aria-hidden={!isActive}
                        className="inline-flex items-center whitespace-nowrap rounded-[var(--ap-btn-radius)] px-5 py-2 text-sm font-extrabold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accentSoft})`, boxShadow: `0 10px 26px ${accent}59` }}
                      >
                        {t.cta}
                      </Link>
                      <Link
                        href={getLocalizedPath(`/atrakcje/kino-360/${film.slug}`, loc)}
                        tabIndex={isActive ? 0 : -1}
                        aria-hidden={!isActive}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--ap-btn-radius)] border bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        style={{ borderColor: `${accent}99` }}
                      >
                        {t.more}
                        <span aria-hidden="true" style={{ color: accentSoft }}>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
