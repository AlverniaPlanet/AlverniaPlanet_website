"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import {
  buildBookingPath,
  K360_BOOKING_CATEGORY,
  k360FilmService,
} from "@/lib/booking";
import { getLocalizedPath } from "@/lib/localizedRoutes";
import {
  findFilm,
  FILMS_COPY,
  FILM_DETAILS,
  FILM_DETAILS_COPY,
  SUBPAGE_COPY,
  DAY_GROUPS,
  daySchedule,
  filmShowtimes,
  dayGroupForWeekday,
  type Locale,
  type DayGroupKey,
} from "../films";

export default function FilmContent({ slug }: { slug: string }) {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";

  // Wybór przedziału dni grafiku. Domyślnie „Czw-Pt" (pełny repertuar), po stronie
  // klienta ustawiamy na dzisiejszy przedział, żeby uniknąć niezgodności hydratacji.
  const [selectedGroup, setSelectedGroup] = useState<DayGroupKey>("thu-fri");
  const [todayGroup, setTodayGroup] = useState<DayGroupKey | null>(null);
  useEffect(() => {
    const g = dayGroupForWeekday(new Date().getDay());
    setTodayGroup(g);
    setSelectedGroup(g);
  }, []);

  // Scroll-reveal: elementy z klasą .wpk-reveal pojawiają się przy wjeżdżaniu w kadr.
  // (Hero jest w kadrze od razu, więc odsłania się natychmiast po mount.)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".wpk-reveal"));
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loc, slug]);

  const film = findFilm(slug);
  if (!film) return null;

  const fc = FILMS_COPY[loc][slug];
  const detail = FILM_DETAILS[slug];
  const dc = FILM_DETAILS_COPY[loc][slug];
  const s = SUBPAGE_COPY[loc];
  const accent = detail.accent;
  const accentSoft = detail.accentSoft;
  const schedule = daySchedule(selectedGroup);
  const myTimes = filmShowtimes(slug, selectedGroup);

  const bookingHref = buildBookingPath(loc, {
    category: K360_BOOKING_CATEGORY,
    service: k360FilmService(slug),
    autopick: true,
  });
  const repertoireHref = `${getLocalizedPath("/atrakcje/kino-360", loc)}#repertuar`;

  const BackLink = ({ className = "" }: { className?: string }) => (
    <Link
      href={repertoireHref}
      className={`group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white ${className}`}
    >
      <span
        aria-hidden="true"
        className="transition-transform group-hover:-translate-x-0.5"
      >
        ←
      </span>
      {s.back}
    </Link>
  );

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Rozmyty plakat w tle + poświata w kolorze filmu */}
        <Image
          src={film.poster}
          alt=""
          fill
          aria-hidden="true"
          sizes="100vw"
          className="scale-110 object-cover opacity-25 blur-2xl"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 18% 8%, ${accent}33, transparent 55%), linear-gradient(180deg, rgba(6,4,12,0.72) 0%, #05030a 58%, var(--ap-bg) 100%)`,
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
          <BackLink />

          <div className="mt-8 grid items-center gap-8 lg:mt-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12">
            {/* Plakat */}
            <ScrollMotionItem strength="soft" float={false} className="wpk-reveal">
              <div
                className="relative mx-auto aspect-[2/3] w-full max-w-[20rem] overflow-hidden rounded-[1.6rem] border lg:mx-0"
                style={{
                  boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 44px ${accent}55`,
                  borderColor: `${accent}88`,
                }}
              >
                <Image
                  src={film.poster}
                  alt={film.title}
                  fill
                  sizes="(min-width:1024px) 20rem, (min-width:640px) 60vw, 80vw"
                  className="object-cover"
                  priority
                />
                {film.nowShowing && (
                  <span
                    className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-white"
                    style={{
                      backgroundColor: "#f7486c",
                      boxShadow: "0 0 16px rgba(247,72,108,0.75)",
                    }}
                  >
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/85 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    {s.nowShowing}
                  </span>
                )}
              </div>
            </ScrollMotionItem>

            {/* Informacje */}
            <ScrollMotionItem strength="soft" delay={60} float={false} className="wpk-reveal">
              <div>
                <p
                  className="text-[0.7rem] font-bold uppercase tracking-[0.24em]"
                  style={{ color: accentSoft }}
                >
                  Kino 360
                </p>
                <h1 className="mt-2 text-pretty text-[clamp(2.2rem,7vw,4.4rem)] font-black leading-[1.02] tracking-[-0.035em] text-white">
                  {film.title}
                </h1>
                <p
                  className="mt-3 text-lg font-bold sm:text-xl"
                  style={{ color: accentSoft }}
                >
                  {fc.tagline}
                </p>

                {/* Format + grupa docelowa */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {film.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/90"
                      style={{ borderColor: `${accent}66`, backgroundColor: `${accent}1f` }}
                    >
                      {b}
                    </span>
                  ))}
                  <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/70">
                    {fc.audience}
                  </span>
                </div>

                {/* Produkcja + nagrody */}
                {(detail.studio || dc.awardsNote) && (
                  <div className="mt-4 space-y-1.5 text-sm text-white/70">
                    {detail.studio && (
                      <p>
                        <span className="font-semibold text-white/85">{s.studioLabel}:</span>{" "}
                        {detail.studio}
                      </p>
                    )}
                    {dc.awardsNote && (
                      <p className="flex items-start gap-2">
                        <span aria-hidden="true" style={{ color: accentSoft }}>
                          ★
                        </span>
                        <span>{dc.awardsNote}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <PrimaryButton
                    href={bookingHref}
                    size="lg"
                    className="ticket-pill whitespace-nowrap !bg-[linear-gradient(135deg,#f03c64,#f7486c,#ff96aa)] !font-extrabold !text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] ring-[color:rgba(240,60,100,0.6)] hover:!brightness-110"
                  >
                    {s.cta}
                  </PrimaryButton>
                  <BackLink className="rounded-full border border-white/25 bg-white/[0.06] px-5 py-2.5 backdrop-blur-md hover:border-white/50 hover:bg-white/12" />
                </div>
              </div>
            </ScrollMotionItem>
          </div>
        </div>
      </section>

      {/* ===== TREŚĆ ===== */}
      <div className="mx-auto w-full max-w-6xl space-y-16 px-4 py-14 sm:space-y-20 sm:px-6 sm:py-20">
        {/* Zwiastun */}
        {detail.trailer && (
          <ScrollMotionItem strength="soft" float={false} className="wpk-reveal">
            <section>
              <SectionHeading label={s.trailer} accent={accent} accentSoft={accentSoft} centered />
              <div
                className="mx-auto mt-8 aspect-video w-full max-w-4xl overflow-hidden rounded-[1.4rem] border bg-black"
                style={{
                  borderColor: `${accent}55`,
                  boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 40px ${accent}44`,
                }}
              >
                <iframe
                  src={detail.trailer}
                  title={`${film.title} — ${s.trailer}`}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                />
              </div>
            </section>
          </ScrollMotionItem>
        )}

        {/* Godziny seansów */}
        <ScrollMotionItem strength="soft" float={false} className="wpk-reveal">
          <section>
            <SectionHeading label={s.showtimes} accent={accent} accentSoft={accentSoft} />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
              {s.showtimesIntro}
            </p>

            {/* Wybór przedziału dni */}
            <div className="mt-6 inline-flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
              {DAY_GROUPS.map((g) => {
                const isSel = g.key === selectedGroup;
                const isToday = g.key === todayGroup;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setSelectedGroup(g.key)}
                    aria-pressed={isSel}
                    className="rounded-xl px-4 py-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    style={
                      isSel
                        ? { background: `linear-gradient(135deg, ${accent}, ${accentSoft})`, color: "#fff", boxShadow: `0 6px 18px ${accent}4d` }
                        : { color: "rgba(255,255,255,0.7)" }
                    }
                  >
                    {g.label[loc]}
                    {isToday && (
                      <span className="ml-1.5 align-middle rounded-full bg-black/25 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wide">
                        {s.today}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Ten film gra o */}
            <div className="mt-6">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em]" style={{ color: accentSoft }}>
                {s.thisFilmAt}
              </p>
              {myTimes.length ? (
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {myTimes.map((t) => (
                    <span
                      key={t}
                      className="rounded-xl px-4 py-2.5 text-lg font-black tabular-nums text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
                      style={{ background: `linear-gradient(135deg, ${accent}, ${accentSoft})`, boxShadow: `0 8px 22px ${accent}4d` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
                  {s.notPlaying}
                </p>
              )}
            </div>

            {/* Pełny grafik dnia */}
            <div className="mt-8">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/50">
                {s.fullSchedule}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {schedule.map((entry) => {
                  const mine = entry.slug === slug;
                  const slotFilm = findFilm(entry.slug);
                  return (
                    <div
                      key={entry.time}
                      className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5"
                      style={
                        mine
                          ? { borderColor: `${accent}88`, backgroundColor: `${accent}1f` }
                          : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)" }
                      }
                    >
                      <span
                        className="shrink-0 text-base font-black tabular-nums"
                        style={{ color: mine ? accentSoft : "rgba(255,255,255,0.9)" }}
                      >
                        {entry.time}
                      </span>
                      <span className={`truncate text-sm ${mine ? "font-bold text-white" : "text-white/55"}`}>
                        {slotFilm?.title ?? entry.slug}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollMotionItem>

        {/* O filmie + Czego się dowiesz */}
        <ScrollMotionItem strength="soft" float={false} className="wpk-reveal">
          <section className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
            <div>
              <SectionHeading label={s.about} accent={accent} accentSoft={accentSoft} />
              <div className="mt-5 space-y-4">
                {dc.about.map((para, i) => (
                  <p key={i} className="text-base leading-relaxed text-white/75 sm:text-lg">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading label={s.learn} accent={accent} accentSoft={accentSoft} />
              <ul className="mt-5 space-y-3">
                {dc.learn.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
                    />
                    <span className="text-base text-white/80 sm:text-[1.05rem]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </ScrollMotionItem>

        {/* Galeria */}
        <ScrollMotionItem strength="soft" float={false} className="wpk-reveal">
          <section>
            <SectionHeading label={s.gallery} accent={accent} accentSoft={accentSoft} centered />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {detail.gallery.map((src, i) => (
                <div
                  key={src}
                  className="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-500 hover:ring-2 hover:ring-white/30"
                >
                  <Image
                    src={src}
                    alt={`${film.title} — ${i + 1}`}
                    fill
                    sizes="(min-width:1024px) 22vw, 46vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `linear-gradient(to top, ${accent}44, transparent 60%)` }}
                  />
                </div>
              ))}
            </div>
          </section>
        </ScrollMotionItem>

        {/* Dolny CTA */}
        <ScrollMotionItem strength="soft" float={false} className="wpk-reveal">
          <section
            className="relative overflow-hidden rounded-[1.75rem] border px-6 py-9 text-center sm:px-10 sm:py-11"
            style={{
              borderColor: `${accent}55`,
              background: `radial-gradient(120% 130% at 50% 0%, ${accent}26, rgba(10,6,18,0.5) 60%)`,
            }}
          >
            <h2 className="text-pretty text-2xl font-black tracking-[-0.02em] text-white sm:text-3xl">
              {film.title}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/72 sm:text-base">
              {fc.tagline}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton
                href={bookingHref}
                size="lg"
                className="ticket-pill whitespace-nowrap !bg-[linear-gradient(135deg,#f03c64,#f7486c,#ff96aa)] !font-extrabold !text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] ring-[color:rgba(240,60,100,0.6)] hover:!brightness-110"
              >
                {s.cta}
              </PrimaryButton>
              <BackLink className="rounded-full border border-white/25 bg-white/[0.06] px-5 py-2.5 backdrop-blur-md hover:border-white/50 hover:bg-white/12" />
            </div>
          </section>
        </ScrollMotionItem>
      </div>
    </main>
  );
}

function SectionHeading({
  label,
  accent,
  accentSoft,
  centered = false,
}: {
  label: string;
  accent: string;
  accentSoft: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : ""}>
      <h2 className="text-[clamp(1.5rem,4vw,2.4rem)] font-black leading-tight tracking-[-0.03em] text-white">
        {label}
      </h2>
      <div
        className={`mt-3 h-[3px] w-16 rounded-full ${centered ? "mx-auto" : ""}`}
        style={{
          background: `linear-gradient(90deg, ${accent}, ${accentSoft})`,
          boxShadow: `0 0 12px ${accent}88`,
        }}
      />
    </div>
  );
}
