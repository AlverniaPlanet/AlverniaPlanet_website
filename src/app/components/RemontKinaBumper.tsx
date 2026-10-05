"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/i18n-provider";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import { readConsent, CONSENT_CHANGE_EVENT } from "@/lib/consent";
import { SolarIcon } from "@/app/components/SolarIcon";

// Komunikat serwisowy: Kino 360 nieczynne 1–4 września 2026 (modernizacja).
// Kolorystyka 1:1 z plakatem kampanii: żółć „budowlana" + cyan na słowo
// ZMIENIAMY + pas ostrzegawczy u góry karty.
//
// ⚠️ DATA KOŃCA: karta znika SAMA po REMONT_KONIEC — nie trzeba jej usuwać
// ręcznie. Po tej dacie komponent nie renderuje niczego.
const REMONT_KONIEC = new Date("2026-09-04T23:59:59+02:00").getTime();
// Zamknięcie trzymamy w sessionStorage, NIE w localStorage: to komunikat
// serwisowy ważny tylko cztery dni, więc ma wracać przy kolejnej wizycie.
// Przy localStorage jedno kliknięcie krzyżyka chowało go na zawsze — łącznie
// z osobami, które zamknęły go przypadkiem.
const DISMISS_KEY = "ap-remont-kina-2026-09-dismissed";

// Maskotki w kaskach na przezroczystym tle.
// Gdy plik trafi do public/wspolne/bumpery/, wpisz tu jego ścieżkę — np.
// "/wspolne/bumpery/maskotki-remont.png" — a grafika pojawi się w karcie automatycznie.
// null = karta renderuje się bez ilustracji (nie ma wtedy pustego miejsca).
const MASKOTKI_SRC: string | null = null;

// Strony, na których karta przeszkadza (formularze, ekrany aplikacji).
const UKRYTE = new Set([
  "/rezerwuj",
  "/en/reserve",
  "/pt/reservar",
  "/aplikacje/identyfikacja",
  "/aplikacje/identyfikacja-online",
  "/aplikacje/mars-brief",
]);

const ZOLTY = "#f6cf3f";
const CYAN = "#3fc8ea";
// Pas ostrzegawczy jak na plakacie — czysty CSS, zero grafiki.
const PAS_OSTRZEGAWCZY =
  "repeating-linear-gradient(45deg,#f6cf3f 0 12px,#12100a 12px 24px)";

type Atrakcja = { nazwa: string; opis: string; href: string };

type Tresc = {
  daty: string;
  nadtytul: string;
  tytul: string;
  podtytul: string;
  dlaWas: string;
  zaproszenie: string;
  atrakcje: [Atrakcja, Atrakcja];
  zamknij: string;
};

const TRESC: Record<Locale, Tresc> = {
  pl: {
    daty: "1–4 września 2026",
    nadtytul: "Przerwa w otwarciu kina",
    tytul: "Zmieniamy",
    podtytul: "największe Kino 360 Fulldome w Europie!",
    dlaWas: "dla Was",
    zaproszenie: "W tym czasie zapraszamy na inne atrakcje!",
    atrakcje: [
      {
        nazwa: "Filmworld",
        opis: "Interaktywna podróż przez świat filmu",
        href: "/atrakcje/filmworld",
      },
      {
        nazwa: "Mars",
        opis: "Nakręć własny film na prawdziwym planie",
        href: "/atrakcje/mars",
      },
    ],
    zamknij: "Zamknij komunikat",
  },
  en: {
    daty: "1–4 September 2026",
    nadtytul: "The cinema is closed",
    tytul: "We're upgrading",
    podtytul: "the largest 360° Fulldome cinema in Europe!",
    dlaWas: "for you",
    zaproszenie: "Meanwhile, our other attractions are open!",
    atrakcje: [
      {
        nazwa: "Filmworld",
        opis: "An interactive journey through the world of film",
        href: "/atrakcje/filmworld",
      },
      {
        nazwa: "Mars",
        opis: "Shoot your own film on a real set",
        href: "/atrakcje/mars",
      },
    ],
    zamknij: "Close notice",
  },
  pt: {
    daty: "1–4 de setembro de 2026",
    nadtytul: "O cinema está fechado",
    tytul: "Estamos a renovar",
    podtytul: "o maior cinema 360° Fulldome da Europa!",
    dlaWas: "para si",
    zaproszenie: "Entretanto, as outras atrações estão abertas!",
    atrakcje: [
      {
        nazwa: "Filmworld",
        opis: "Uma viagem interativa pelo mundo do cinema",
        href: "/atrakcje/filmworld",
      },
      {
        nazwa: "Mars",
        opis: "Filme o seu próprio filme num cenário real",
        href: "/atrakcje/mars",
      },
    ],
    zamknij: "Fechar aviso",
  },
  de: {
    daty: "1.–4. September 2026",
    nadtytul: "Das Kino ist geschlossen",
    tytul: "Wir modernisieren",
    podtytul: "das größte 360°-Fulldome-Kino Europas!",
    dlaWas: "für Sie",
    zaproszenie: "In der Zwischenzeit sind unsere anderen Attraktionen geöffnet!",
    atrakcje: [
      {
        nazwa: "Filmworld",
        opis: "Eine interaktive Reise durch die Welt des Films",
        href: "/atrakcje/filmworld",
      },
      {
        nazwa: "Mars",
        opis: "Drehen Sie Ihren eigenen Film an einem echten Set",
        href: "/atrakcje/mars",
      },
    ],
    zamknij: "Hinweis schließen",
  },
  zh: {
    daty: "2026年9月1日–4日",
    nadtytul: "影院暂停开放",
    tytul: "全新升级",
    podtytul: "欧洲最大的 360° 全景穹幕影院！",
    dlaWas: "只为您",
    zaproszenie: "这段时间，其他景点照常开放！",
    atrakcje: [
      {
        nazwa: "Filmworld",
        opis: "穿越电影世界的互动之旅",
        href: "/atrakcje/filmworld",
      },
      {
        nazwa: "Mars",
        opis: "在真实片场拍摄自己的电影",
        href: "/atrakcje/mars",
      },
    ],
    zamknij: "关闭提示",
  },
};

function normalizuj(path: string | null | undefined) {
  if (!path) return "/";
  // Ucinamy też końcówkę „.html": przy output:"export" strona bywa serwowana
  // wprost jako /rezerwuj.html (np. z podglądu katalogu out/ albo gdy serwer
  // nie przepisuje rozszerzeń) i wtedy dopasowanie do listy UKRYTE nie działało.
  const bez = path.replace(/\.html$/i, "").replace(/\/+$/, "");
  return bez === "" ? "/" : bez;
}

export default function RemontKinaBumper() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const pathname = usePathname();
  const [widoczny, setWidoczny] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (Date.now() > REMONT_KONIEC) return;
    if (UKRYTE.has(normalizuj(pathname))) return;
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      // prywatne okno albo zablokowane dane witryny — pokazujemy kartę
    }

    // Baner zgód cookie jest przypięty do tego samego dołu ekranu i ma
    // pierwszeństwo (wymóg prawny). Czekamy, aż użytkownik rozstrzygnie zgodę,
    // i dopiero wtedy pokazujemy komunikat — inaczej karty nachodzą na siebie.
    let timer = 0;
    const pokaz = () => {
      timer = window.setTimeout(() => setWidoczny(true), 900);
    };

    if (readConsent() !== null) {
      pokaz();
      return () => window.clearTimeout(timer);
    }

    const naZgode = () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, naZgode);
      pokaz();
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, naZgode);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, naZgode);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  const zamknij = () => {
    setWidoczny(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // brak localStorage nie może wywalić zamykania
    }
  };

  if (!widoczny) return null;

  const t = TRESC[loc];

  return (
    <aside
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-3 pb-3 sm:inset-y-0 sm:items-center sm:justify-end sm:px-5 sm:pb-0 sm:pt-[20vh]"
    >
      <div className="pointer-events-auto relative w-full max-w-[26rem] overflow-hidden rounded-2xl bg-[#0d0b14] shadow-[0_18px_48px_rgba(0,0,0,0.6)] ring-1 ring-white/10 sm:max-w-[30rem]">
        {/* Pas ostrzegawczy */}
        <div className="h-2 w-full" style={{ backgroundImage: PAS_OSTRZEGAWCZY }} aria-hidden="true" />

        <button
          type="button"
          onClick={zamknij}
          aria-label={t.zamknij}
          className="absolute right-2.5 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white/80 ring-1 ring-white/20 transition hover:bg-black/75 hover:text-white"
        >
          <SolarIcon name="close" className="h-4 w-4" weight="bold" />
        </button>

        <div className="flex gap-3 px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5">
          {MASKOTKI_SRC ? (
            <div className="relative hidden w-[6.5rem] shrink-0 sm:block">
              <Image
                src={MASKOTKI_SRC}
                alt=""
                fill
                sizes="6.5rem"
                className="object-contain object-bottom"
                aria-hidden="true"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <p
              className="inline-block rounded border px-2 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-[0.1em]"
              style={{ borderColor: ZOLTY, color: ZOLTY }}
            >
              {t.daty}
            </p>

            <p
              className="mt-2 text-[0.7rem] font-extrabold uppercase leading-tight tracking-[0.06em]"
              style={{ color: ZOLTY }}
            >
              {t.nadtytul}
            </p>

            <h2 className="mt-0.5 text-[1.55rem] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-[1.85rem]" style={{ color: CYAN }}>
              {t.tytul}
            </h2>

            <p className="mt-1 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.02em] text-white sm:text-[0.78rem]">
              {t.podtytul}{" "}
              <span className="italic" style={{ color: ZOLTY }}>
                {t.dlaWas}
              </span>
            </p>

            <p className="mt-3 text-[0.7rem] font-bold uppercase leading-snug tracking-[0.05em] text-white/85">
              {t.zaproszenie}
            </p>

            <div className="mt-2.5 grid gap-2">
              {t.atrakcje.map((a) => (
                <Link
                  key={a.href}
                  href={getLocalizedPath(a.href, loc)}
                  onClick={zamknij}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-white/12 bg-white/[0.05] px-3 py-2 transition hover:border-[#3fc8ea]/60 hover:bg-white/[0.09]"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.82rem] font-extrabold uppercase leading-none text-white">
                      {a.nazwa}
                    </span>
                    <span className="mt-1 block truncate text-[0.62rem] leading-snug text-white/65">
                      {a.opis}
                    </span>
                  </span>
                  <SolarIcon
                    name="arrow-right"
                    weight="bold"
                    className="h-4 w-4 shrink-0 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-[#3fc8ea]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
