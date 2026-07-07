"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaFilm } from "react-icons/fa6";

const REGULAMIN_HREF = "/legal/regulamin-konkursu-marsa.html";

const BLOCKS = [
  {
    title: "Zadanie",
    items: [
      "Krótki film trwający 30–90 sekund",
      "Temat: Mars, misja kosmiczna, eksploracja, science-fiction lub kulisy produkcji filmowej",
      "Dowolna forma: fabularna, przygodowa, komediowa, dokument, making-of, edukacyjna lub eksperymentalna",
    ],
  },
  {
    title: "Wytyczne",
    items: [
      "Nawiąż do elementów wystawy: plan marsjański, baza, strefa wody, greenbox, światło i efekty filmowe",
      "Wciel się w filmową rolę: astronauta, naukowiec, inżynier, pilot, operator czy reżyser",
      "Film musi być autorski; muzykę, grafiki i materiały AI używaj tylko z prawami lub licencją na publiczną prezentację",
    ],
  },
  {
    title: "Kto może wziąć udział",
    items: [
      "Indywidualnie lub zespołowo (zespół wskazuje osobę kontaktową)",
      "Osoby niepełnoletnie, za zgodą opiekuna prawnego",
      "Udział jest dobrowolny i bezpłatny; można zgłosić kilka filmów",
    ],
  },
];

const ELEMENTS = [
  "Marsjański plan filmowy",
  "Powierzchnia i panorama Marsa",
  "Baza marsjańska",
  "Antena łączności",
  "Strefa wody",
  "Hydroponiczna uprawa ziemniaków",
  "Strefa energii z panelami",
  "Spadochron z sondą / łazikiem",
  "Charakteryzatornia",
  "Backstage planu filmowego",
  "Greenbox",
  "Światło, projekcje i efekty",
];

const TIMELINE = [
  { date: "do 30.09.2026", label: "Przyjmowanie zgłoszeń" },
  { date: "do 7.10.2026", label: "Ogłoszenie wyników" },
  { date: "do 12.10.2026", label: "Przekazanie wybranych filmów na FINC" },
  { date: "27–28.11.2026", label: "Festiwal FINC w Baía Formosa (Brazylia)" },
];

export default function KonkursContent() {
  useEffect(() => {
    document.body.classList.add("mars-route-active");
    return () => {
      document.body.classList.remove("mars-route-active");
    };
  }, []);

  return (
    <main className="relative z-10 min-h-screen overflow-x-clip px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-12">
      <div className="ap-shell">
        <Link
          href="/atrakcje/mars"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
        >
          <FaArrowLeft aria-hidden="true" /> Wróć do MARS
        </Link>

        <header className="mt-8 text-center">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.26em] text-[#ff9357]/85 sm:text-[0.8rem]">
            MARS • Konkurs filmowy
          </p>
          <h1 className="mt-3 text-[clamp(2.2rem,5vw,4.4rem)] font-black leading-[1.02] tracking-[-0.03em] text-white">
            „Lądowanie na Marsie”
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Wejdź na pełnoskalowy plan filmowy inspirowany powierzchnią Marsa, nakręć własny krótki film
            i zgłoś go do konkursu. Najlepsze prace ocenia jury, a wybrane filmy mogą trafić na
            międzynarodowy festiwal{" "}
            <span className="font-semibold text-white">
              Festival Internacional de Cinema de Baía Formosa (FINC)
            </span>{" "}
            w Brazylii. Celem konkursu jest rozwijanie kreatywności, edukacja filmowa i pokazanie, że
            film można nie tylko oglądać, ale i współtworzyć.
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#f77828]/35 bg-[linear-gradient(120deg,rgba(247,120,40,0.14),rgba(10,8,14,0.55))] px-6 py-6 text-center sm:px-8 sm:py-7">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#ffb585]">Nagroda główna</p>
          <p className="mt-2 text-lg font-bold leading-snug text-white sm:text-xl">
            Pokaz zwycięskiego filmu na festiwalu FINC w Brazylii i przelot do Brazylii dla autora
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
            Organizator może przyznać też wyróżnienia: pokaz wybranych filmów podczas FINC bez wyjazdu.
            Szczegółowy zakres nagrody (m.in. liczbę osób i warunki podróży) określa regulamin.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:gap-5 lg:grid-cols-3">
          {BLOCKS.map((block) => (
            <div
              key={block.title}
              className="ap-tile ap-tile-lg relative overflow-hidden px-5 py-6 sm:px-6 sm:py-7"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,120,40,0.14),transparent_42%)]" />
              <div className="relative">
                <h2 className="text-lg font-bold leading-tight text-white sm:text-xl">{block.title}</h2>
                <ul className="mt-3 space-y-2.5">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm leading-relaxed text-white/75 sm:text-[0.95rem]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f77828] shadow-[0_0_10px_rgba(247,120,40,0.6)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
            Do czego możesz nawiązać
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/65 sm:text-base">
            Film powinien odwoływać się do jednego lub kilku elementów wystawy „Lądowanie na Marsie”.
          </p>
          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2 sm:gap-3">
            {ELEMENTS.map((el) => (
              <span
                key={el}
                className="rounded-full border border-[#f77828]/25 bg-white/[0.04] px-3 py-1.5 text-xs text-white/75 sm:px-4 sm:py-2 sm:text-sm"
              >
                {el}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
            Harmonogram
          </h2>
          <div className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {TIMELINE.map((t) => (
              <div key={t.label} className="ap-tile ap-tile-sm px-4 py-4 text-center">
                <p className="text-sm font-extrabold text-[#ffb585] sm:text-base">{t.date}</p>
                <p className="mt-1 text-xs leading-snug text-white/70 sm:text-sm">{t.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 text-center">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            Pełne zasady, kryteria oceny, wymagania techniczne oraz informacje o nagrodach znajdziesz w
            regulaminie konkursu.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={REGULAMIN_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#f77828] to-[#ff9357] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#170a04] shadow-[0_12px_30px_rgba(247,120,40,0.4)] transition hover:scale-[1.03] hover:brightness-110"
            >
              <FaFilm aria-hidden="true" /> Zobacz regulamin konkursu
            </a>
            <Link
              href="/atrakcje/mars"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Kup bilet na MARS
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
