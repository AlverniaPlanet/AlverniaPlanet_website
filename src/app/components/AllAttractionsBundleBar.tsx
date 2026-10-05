"use client";

import { Fragment } from "react";
import { buildBookingPath } from "@/lib/booking";
import type { Locale } from "@/lib/localizedRoutes";
import type { PromoPackage } from "@/lib/promoPackages";

/**
 * Pasek pakietu „Zgarnij całą trójkę" — JEDEN wygląd na stronie głównej
 * i na podstronach atrakcji.
 *
 * Zastępuje starszy AllAttractionsPromoCard, który pokazywał gołe „−40%".
 * Procent bez podanej bazy czytał się jak czasowa obniżka, a to jest
 * porównanie pakietu do zakupu trzech biletów osobno — dlatego zamiast
 * procentu podajemy wprost kwotę „osobno".
 */

// Skład pakietu. Zestaw jest stały (trzy atrakcje), a kolory odpowiadają
// akcentom używanym w całym serwisie.
//
// Nazwy są PER JĘZYK i celowo zgodne ze słownikiem w src/app/i18n-provider.tsx
// (klucze menu.attractions.*). Wcześniej były zakodowane po polsku, więc na
// stronach /zh i /de w pasku pakietu świeciło „KINO 360" pośród chińskiego
// i niemieckiego tekstu. FILMWORLD zostaje wszędzie — to nazwa własna, tak samo
// traktowana w menu i w treściach.
const KOLORY = ["#ff7092", "#ff843d", "#56ddea"];

const SKLAD_NAZWY: Record<Locale, [string, string, string]> = {
  pl: ["Kino 360", "MARS", "FILMWORLD"],
  en: ["K360 Cinema", "Mars mission", "FILMWORLD"],
  pt: ["Cinema K360", "Missão Marte", "FILMWORLD"],
  de: ["Kino 360", "Mars-Mission", "FILMWORLD"],
  zh: ["Kino 360 全景影院", "火星任务", "FILMWORLD"],
};

const COPY: Record<Locale, {
  bestPrice: string;
  title: string;
  tagline: string;
  normal: string;
  reduced: string;
  separately: string;
  cta: string;
  /** Sufiks przy cenie („za osobę"). Wcześniej zakodowany jako „/os." dla wszystkich języków. */
  unit: string;
}> = {
  pl: {
    bestPrice: "Najlepsza cena",
    title: "Zgarnij całą trójkę!",
    tagline: "jeden dzień • jeden bilet",
    normal: "normalny",
    reduced: "ulgowy",
    separately: "osobno",
    cta: "Kup pakiet",
    unit: "/os."
  },
  en: {
    bestPrice: "Best price",
    title: "Get all three!",
    tagline: "one day • one ticket",
    normal: "standard",
    reduced: "reduced",
    separately: "separately",
    cta: "Buy the bundle",
    unit: "/person"
  },
  pt: {
    bestPrice: "Melhor preço",
    title: "Leva as três!",
    tagline: "um dia • um bilhete",
    normal: "normal",
    reduced: "reduzido",
    separately: "em separado",
    cta: "Comprar pacote",
    unit: "/pessoa"
  },
  de: {
    bestPrice: "Bester Preis",
    title: "Alle drei sichern!",
    tagline: "ein Tag • ein Ticket",
    normal: "regulär",
    reduced: "ermäßigt",
    separately: "einzeln",
    cta: "Paket kaufen",
    unit: "/Pers."
  },
  zh: {
    bestPrice: "最佳价格",
    title: "三大项目一次玩遍！",
    tagline: "一天 • 一张票",
    normal: "全价票",
    reduced: "优惠票",
    separately: "单独购买",
    cta: "购买套票",
    unit: "/人"
  },
};

/** Liczba z ciągu typu „119,00 zł" albo „Oszczędzasz 78,00 zł". */
const liczba = (v: string) => parseInt((v.replace(/^\D+/, "").match(/\d+/) ?? ["0"])[0], 10);
/** Waluta z ciągu ceny: „119,00 zł" → „zł". */
const waluta = (v: string) => v.replace(/[\d.,\s]/g, "") || "zł";

export function AllAttractionsBundleBar({
  promo,
  locale,
}: {
  promo: PromoPackage;
  locale: Locale;
}) {
  const t = COPY[locale] ?? COPY.pl;
  const jednostka = t.unit;

  // „Osobno" = cena pakietu + oszczędność. Obie liczby pochodzą z promoPackages.ts,
  // więc suma nie może rozjechać się z cennikiem.
  const taryfy = [
    {
      klucz: "normal",
      etykieta: t.normal,
      cena: liczba(promo.price),
      osobno: liczba(promo.price) + liczba(promo.savings),
      oszczednosc: promo.savings.replace(/,00/g, ""),
      wyrozniona: true,
    },
    {
      klucz: "reduced",
      etykieta: t.reduced,
      cena: liczba(promo.reducedPrice),
      osobno: liczba(promo.reducedPrice) + liczba(promo.reducedSavings),
      oszczednosc: promo.reducedSavings.replace(/,00/g, ""),
      wyrozniona: false,
    },
  ];

  const cur = waluta(promo.price);
  const href = buildBookingPath(locale, {
    service: promo.service,
  });

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#0b1022] px-5 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:px-7 sm:py-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 8% 0%, rgba(255,112,146,0.16), transparent 42%), radial-gradient(circle at 92% 100%, rgba(86,221,234,0.14), transparent 45%)",
        }}
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-1 lg:flex-row lg:items-center lg:gap-7">
          <div className="lg:shrink-0">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em]"
              style={{
                color: "#ff8da3",
                border: "1px solid rgba(255,71,115,0.4)",
                background: "rgba(255,71,115,0.08)",
              }}
            >
              {t.bestPrice}
            </span>
            <h3 className="mt-3 text-[1.55rem] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] text-white sm:text-[1.7rem] md:whitespace-nowrap">
              {t.title}
            </h3>
          </div>

          <div className="min-w-0 lg:border-l lg:border-white/10 lg:pl-7">
            <p className="text-lg font-extrabold tracking-[-0.01em] sm:text-xl">
              {(SKLAD_NAZWY[locale] ?? SKLAD_NAZWY.pl).map((nazwa, i) => (
                <Fragment key={nazwa}>
                  {i > 0 && <span className="text-white/35"> + </span>}
                  <span style={{ color: KOLORY[i] }}>{nazwa}</span>
                </Fragment>
              ))}
            </p>
            <p className="mt-1 text-sm text-white/50">{t.tagline}</p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-stretch gap-3 lg:w-auto lg:shrink-0 lg:justify-end">
          {taryfy.map((taryfa) => (
            <div
              key={taryfa.klucz}
              className={`flex min-w-[8.5rem] flex-1 flex-col items-start px-1 text-left sm:min-w-[9rem] lg:flex-none ${
                taryfa.wyrozniona ? "" : "border-l border-white/10 pl-5 sm:pl-6"
              }`}
            >
              <span className="inline-flex rounded-full border border-white/25 px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.16em] text-white/70">
                {taryfa.etykieta}
              </span>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-[1.9rem] font-extrabold leading-none text-white sm:text-[2.1rem]">
                  {taryfa.cena}
                </span>
                <span className="text-sm font-bold text-white/75">
                  {cur}
                  {jednostka}
                </span>
              </p>
              <p className="mt-1.5 text-[0.68rem] text-white/40">
                {t.separately}{" "}
                <span className="line-through">
                  {taryfa.osobno} {cur}
                </span>
              </p>
              <span
                className="mt-2 inline-flex rounded-full px-2.5 py-1 text-[0.64rem] font-semibold"
                style={{
                  color: "#7fe9f2",
                  border: "1px solid rgba(86,221,234,0.4)",
                  background: "rgba(86,221,234,0.08)",
                }}
              >
                {taryfa.oszczednosc}
              </span>
            </div>
          ))}

          <a
            href={href}
            className="ticket-pill mx-auto inline-flex w-full max-w-[18rem] shrink-0 items-center justify-center self-center rounded-[var(--ap-btn-radius)] px-7 py-3 text-sm font-extrabold transition hover:brightness-110 sm:mx-0 sm:w-auto sm:max-w-none"
            style={{
              backgroundColor: "#56ddea",
              color: "#04222a",
              boxShadow: "0 6px 16px rgba(86,221,234,0.3)",
            }}
          >
            {t.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
