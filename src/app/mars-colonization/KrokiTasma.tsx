"use client";

import { useEffect, useRef, useState } from "react";

import { SolarIcon, type SolarIconName } from "@/app/components/SolarIcon";
import type { MarsCopy } from "./marsCopy";
import "./kroki-tasma.css";

/* --- Taśma filmowa z krokami misji ---------------------------------------------
   Pięć kroków LAND → DECIDE stoi w taśmie 35 mm: każdy krok to jedna klatka
   z prawdziwym zdjęciem instalacji, nad i pod klatkami biegną rzędy
   perforacji. Perforacje są częścią przewijanej treści, więc jadą RAZEM
   z klatkami — taśma jest przeciągana, a nie przesuwa się nad nią okno.

   Mechanika ta sama co karuzela „Rodzaje wydarzeń" na /wydarzenia
   (`useCenteredRail` + `RailPager`), przepisana na tę podstronę, bo
   tamte funkcje nie są eksportowane:
   — RĘCZNA: bez autoodtwarzania (WCAG 2.2.2), przewija gość — gestem,
     gładzikiem, klawiaturą, klatkami licznika albo strzałką;
   — telefon (< 640 px): jedna klatka na środku, sąsiednie zaglądają
     z boków i są przygaszone, jeden gest = jedna klatka;
   — od 640 px: klatki od lewej krawędzi szyny treści, przewijanie
     STRONAMI (2, 3 albo 4 klatki — liczbę podaje arkusz w `--kadry-na-strone`,
     żeby JS i punkty zaczepienia przewijania nie rozjechały się nigdy),
     a ostatnia widoczna klatka jest CELOWO ucięta przy krawędzi okna.

   LICZNIK pod taśmą ma zawsze pięć klatek — po jednej na krok, nie na
   stronę (dwie kropki przy pięciu krokach wyglądały przypadkowo). Świecą
   te, które są w kadrze: na telefonie jedna, na desktopie cztery, więc
   zgaszona piąta mówi wprost, że taśma ma ciąg dalszy.

   Taśma biegnie od krawędzi do krawędzi okna, a pierwsza klatka stoi
   w linii szyny treści — patrz `.mars-kadry` w arkuszu. */

/* Ikony pięciu kroków misji — kolejność odpowiada `misja.kroki` w tekstach,
   obie listy łączy indeks. */
const IKONY_KROKOW: SolarIconName[] = ["rocket", "check-circle", "map-point", "robots", "scale"];

/* Zdjęcia klatek, kolejność jak wyżej. Pliki są JUŻ przycięte do 4:5 —
   kadr każdego zdjęcia (środek i przybliżenie) ustawia `kadry_misji()`
   w `media-src/mars-colonization/warianty.py`, tam też uzasadnienie wyboru.
   Po podmianie materiału trzeba ją uruchomić ręcznie. */
const KADRY = [
  "/mars-colonization/misja/modul-habitatu", // LAND — baza w turkusowej mgle
  "/mars-colonization/misja/zbiorniki", // SURVIVE — zbiorniki wody i tlenu
  "/mars-colonization/misja/lazik", // EXPLORE — łazik na czerwonym gruncie
  "/mars-colonization/misja/spotkanie", // EXPERIENCE — humanoid i roboty pod kopułą (materiał obiektu)
  "/mars-colonization/misja/inauguracja", // DECIDE — goście i roboty na scenie (materiał obiektu)
] as const;
const SZEROKOSCI_KADRU = [480, 720, 960] as const;

/* Szerokość klatki dla wyboru pliku — MUSI iść za `--kadr-w` w arkuszu.
   Bez `min()` i `clamp()`: przeglądarka, która ich w `sizes` nie zna, uznaje
   cały wpis za błędny i przyjmuje 100vw, czyli pobiera największy plik.
   445 px to szerokość, przy której 72vw dochodzi do 20rem. Od 1280 px klatka
   to 1/4,35 pasa widoku, czyli ok. 11,5vw + 119 px (1512 px: 293 px). */
const ROZMIAR_KADRU =
  "(min-width: 1280px) calc(11.5vw + 119px), (min-width: 1024px) 21rem, (min-width: 640px) 38vw, (min-width: 445px) 20rem, 72vw";

/** Ścieżka do wariantu o danej szerokości (jak `wariant()` w `page.tsx`). */
function wariant(baza: string, szerokosc: number): string {
  return `${baza}-${szerokosc}.webp`;
}

/** `srcSet` z deskryptorami `w` (jak `zestaw()` w `page.tsx` — tam też dlaczego). */
function zestaw(baza: string): string {
  return SZEROKOSCI_KADRU.map((w) => `${wariant(baza, w)} ${w}w`).join(", ");
}

/* Stan startowy = to, co renderuje serwer: tryb telefonu, jedna klatka na
   stronę. Przestawia go dopiero pierwszy pomiar w efekcie — render nie może
   pytać o `window`, bo hydracja dostałaby inny HTML niż serwer. */
const STRONY_STARTOWE = [0, 1, 2, 3, 4];
const WIDOCZNE_STARTOWE = [true, false, false, false, false];

/* Klatka „jest w kadrze", gdy widać co najmniej 60% jej szerokości. Ucięta
   klatka przy krawędzi okna ma celowo ok. 30–50% (patrz progi w arkuszu),
   więc zostaje zgaszona — i to ona mówi, że taśma ma ciąg dalszy. */
const PROG_WIDOCZNOSCI = 0.6;

function useTasmaKadrow(liczba: number) {
  const szynaRef = useRef<HTMLDivElement | null>(null);
  const klatkiRef = useRef<(HTMLLIElement | null)[]>([]);
  /** Strona, do której jedzie płynne przewijanie (null = brak). */
  const celRef = useRef<number | null>(null);
  /** scrollLeft każdej strony z ostatniego pomiaru (już przycięte do zakresu). */
  const celeRef = useRef<number[]>([]);
  /** Pierwsza klatka każdej strony z ostatniego pomiaru (jak `strony`, ale bez
      czekania na render — czyta to kliknięcie w licznik). */
  const pierwszeRef = useRef<number[]>(STRONY_STARTOWE);
  /** Jaka część szerokości każdej klatki jest w oknie (0–1). */
  const ulamkiRef = useRef<number[]>([]);
  /** Ostatnio zapisane `--dist` każdej klatki — żeby nie pisać tego samego. */
  const ostatnieDist = useRef<string[]>([]);
  const pomiarRef = useRef<() => void>(() => {});
  const [aktywna, ustawAktywna] = useState(0);
  /** Pierwsza klatka każdej strony. Długość = liczba kropek. */
  const [strony, ustawStrony] = useState<number[]>(STRONY_STARTOWE);
  /** Taśma faktycznie się przewija (zakres > 1 px). */
  const [przewija, ustawPrzewija] = useState(true);
  /** Które klatki są w kadrze — świecą w liczniku pod taśmą. */
  const [widoczne, ustawWidoczne] = useState<boolean[]>(WIDOCZNE_STARTOWE);

  useEffect(() => {
    const szyna = szynaRef.current;
    if (!szyna) return;
    const ograniczRuch = window.matchMedia("(prefers-reduced-motion: reduce)");
    let klatka = 0;

    /* Raz na klatkę animacji: najpierw WSZYSTKIE odczyty układu, potem zapisy —
       przeplatane wymuszałyby przeliczenie układu w pętli. */
    const pomiar = () => {
      klatka = 0;
      /* Szerokość okna BEZ klasycznego paska przewijania (Windows: ~15 px).
         Arkusz zaczyna od `100vw`, które pasek wlicza — wtedy przy oknie
         węższym niż szyna treści pierwsza klatka stała o pół paska na lewo
         od krawędzi treści. Zapis tylko przy zmianie i PRZED odczytami
         niżej, żeby pomiar widział już nowy układ. */
      const okno = `${document.documentElement.clientWidth}px`;
      const opakowanie = szyna.parentElement;
      if (opakowanie && opakowanie.style.getPropertyValue("--kadry-okno") !== okno) {
        opakowanie.style.setProperty("--kadry-okno", okno);
      }
      const styl = getComputedStyle(szyna);
      const naStrone = Math.max(1, Number.parseInt(styl.getPropertyValue("--kadry-na-strone"), 10) || 1);
      const maks = Math.max(0, szyna.scrollWidth - szyna.clientWidth);
      const rSzyny = szyna.getBoundingClientRect();
      const srodek = rSzyny.left + rSzyny.width / 2;
      /* Od 640 px klatka staje przy lewej krawędzi szyny treści, czyli
         `scroll-padding-left` od krawędzi taśmy (arkusz liczy go tak samo
         jak dopełnienie listy). */
      const lewa = rSzyny.left + (Number.parseFloat(styl.scrollPaddingLeft) || 0);
      const x = szyna.scrollLeft;
      const prostokaty = klatkiRef.current.map((li) => li?.getBoundingClientRect() ?? null);

      /* Cel każdej strony = scrollLeft, przy którym jej pierwsza klatka stoi na
         środku (telefon) albo przy lewej krawędzi szyny (szerzej). Przycięty
         do zakresu: ostatnia strona często nie dojedzie do lewej krawędzi, bo
         taśma się kończy. Dwie strony w tym samym miejscu liczymy raz —
         tytuły drugiej dopisują się wtedy do pierwszej. */
      const cele: number[] = [];
      const pierwsze: number[] = [];
      for (let i = 0; i < liczba; i += naStrone) {
        const r = prostokaty[i];
        if (!r) continue;
        const surowy = naStrone === 1 ? x + r.left + r.width / 2 - srodek : x + r.left - lewa;
        const cel = Math.min(Math.max(Math.round(surowy), 0), Math.round(maks));
        if (cele.length && Math.abs(cel - cele[cele.length - 1]) < 2) continue;
        cele.push(cel);
        pierwsze.push(i);
      }
      celeRef.current = cele;
      pierwszeRef.current = pierwsze;

      /* Część każdej klatki w oknie — dla licznika. Z tych samych prostokątów
         co reszta pomiaru, więc bez dodatkowego odczytu układu. */
      const ulamki = prostokaty.map((r) =>
        r ? Math.max(0, Math.min(r.right, rSzyny.right) - Math.max(r.left, rSzyny.left)) / Math.max(r.width, 1) : 0
      );
      ulamkiRef.current = ulamki;
      const swieca = ulamki.map((u) => u >= PROG_WIDOCZNOSCI);

      let najblizsza = 0;
      cele.forEach((cel, i) => {
        if (Math.abs(cel - x) < Math.abs(cele[najblizsza] - x)) najblizsza = i;
      });

      /* Przygaszenie sąsiadów tylko na telefonie i bez „ogranicz ruch":
         od 640 px widać kilka klatek naraz i żadna nie jest „w okienku
         projektora". Dwa miejsca po przecinku — krok 0,01 to różnica
         krycia niewidoczna gołym okiem, a większość klatek przestaje
         ruszać style w ogóle. */
      const plasko = naStrone > 1 || ograniczRuch.matches;
      klatkiRef.current.forEach((li, i) => {
        const r = prostokaty[i];
        if (!li || !r) return;
        const dist = plasko
          ? "0"
          : Math.min(Math.abs(r.left + r.width / 2 - srodek) / Math.max(r.width, 1), 1).toFixed(2);
        if (ostatnieDist.current[i] === dist) return;
        ostatnieDist.current[i] = dist;
        li.style.setProperty("--dist", dist);
      });

      if (najblizsza === celRef.current) celRef.current = null;
      ustawStrony((poprzednie) =>
        poprzednie.length === pierwsze.length && poprzednie.every((v, i) => v === pierwsze[i])
          ? poprzednie
          : pierwsze
      );
      ustawWidoczne((poprzednie) =>
        poprzednie.length === swieca.length && poprzednie.every((v, i) => v === swieca[i]) ? poprzednie : swieca
      );
      ustawPrzewija(maks > 1);
      ustawAktywna(najblizsza);
    };
    pomiarRef.current = pomiar;

    const zaplanuj = () => {
      if (!klatka) klatka = requestAnimationFrame(pomiar);
    };
    /* Gość sam złapał taśmę albo przewijanie się skończyło — cel nieaktualny. */
    const wyczyscCel = () => {
      celRef.current = null;
    };

    pomiar();
    szyna.addEventListener("scroll", zaplanuj, { passive: true });
    szyna.addEventListener("scrollend", wyczyscCel);
    szyna.addEventListener("pointerdown", wyczyscCel, { passive: true });
    szyna.addEventListener("wheel", wyczyscCel, { passive: true });
    window.addEventListener("resize", zaplanuj);
    ograniczRuch.addEventListener("change", zaplanuj);
    /* Szerokość szyny zmienia też pojawienie się paska przewijania strony,
       którego `resize` okna nie zgłasza. */
    const obserwator = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(zaplanuj);
    obserwator?.observe(szyna);
    return () => {
      if (klatka) cancelAnimationFrame(klatka);
      szyna.removeEventListener("scroll", zaplanuj);
      szyna.removeEventListener("scrollend", wyczyscCel);
      szyna.removeEventListener("pointerdown", wyczyscCel);
      szyna.removeEventListener("wheel", wyczyscCel);
      window.removeEventListener("resize", zaplanuj);
      ograniczRuch.removeEventListener("change", zaplanuj);
      obserwator?.disconnect();
    };
  }, [liczba]);

  const idzDo = (strona: number) => {
    const szyna = szynaRef.current;
    if (!szyna) return;
    /* Świeży pomiar przed ruchem — cele mogły się zmienić od ostatniego
       przewinięcia (obrót telefonu, zmiana rozmiaru okna). */
    pomiarRef.current();
    const cel = celeRef.current[strona];
    if (cel === undefined) return;
    const plynnie = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    celRef.current = plynnie && Math.abs(cel - szyna.scrollLeft) > 1 ? strona : null;
    szyna.scrollTo({ left: cel, behavior: plynnie ? "smooth" : "auto" });
  };

  /* Liczymy od strony docelowej, a nie od tej, obok której akurat przejeżdża
     animacja — inaczej szybkie kliknięcia „dalej" giną. Po ostatniej stronie
     wraca na początek, tak jak na /wydarzenia. */
  const dalej = () => {
    const ile = Math.max(celeRef.current.length, 1);
    idzDo(((celRef.current ?? aktywna) + 1) % ile);
  };

  /* Klatka licznika. Klatka już cała w kadrze zostaje tam, gdzie jest —
     przewinięcie zabrałoby z kadru inne, a nie pokazało nic nowego.
     Pozostałe: strona, na której ta klatka leży (ostatnia, która zaczyna
     się na niej albo przed nią). */
  const idzDoKlatki = (indeks: number) => {
    pomiarRef.current();
    if ((ulamkiRef.current[indeks] ?? 0) > 0.98) return;
    let strona = 0;
    pierwszeRef.current.forEach((pierwsza, s) => {
      if (pierwsza <= indeks) strona = s;
    });
    idzDo(strona);
  };

  const ustawKlatke = (indeks: number) => (element: HTMLLIElement | null) => {
    klatkiRef.current[indeks] = element;
  };

  /** Ostatnia strona: strzałka obraca się i wraca na początek. */
  const naKoncu = strony.length > 1 && aktywna === strony.length - 1;

  return { szynaRef, ustawKlatke, przewija, widoczne, naKoncu, idzDoKlatki, dalej };
}

export function KrokiTasma({ copy }: { copy: MarsCopy }) {
  const kroki = copy.misja.kroki;
  const t = copy.misja.tasma;
  const { szynaRef, ustawKlatke, przewija, widoczne, naKoncu, idzDoKlatki, dalej } = useTasmaKadrow(kroki.length);

  /* Klatki poza poziomym kadrem taśmy przy `loading="lazy"` nie zostałyby
     pobrane NIGDY — przeglądarka nie uznaje ich za bliskie widoku, nawet gdy
     gość do nich przewinie (ta pułapka wystąpiła już w karuzeli na
     /wydarzenia). Gdy taśma zbliża się do widoku, wszystkie pięć przechodzi
     na pobieranie natychmiastowe: pierwszy ekran strony nie drożeje,
     a klatki są gotowe, zanim ktoś je przewinie. */
  const [zaladuj, ustawZaladuj] = useState(false);
  useEffect(() => {
    const szyna = szynaRef.current;
    if (!szyna || typeof IntersectionObserver === "undefined") {
      ustawZaladuj(true);
      return;
    }
    const obserwator = new IntersectionObserver(
      ([wpis]) => {
        if (!wpis.isIntersecting) return;
        ustawZaladuj(true);
        obserwator.disconnect();
      },
      { rootMargin: "300px 0px" }
    );
    obserwator.observe(szyna);
    return () => obserwator.disconnect();
  }, [szynaRef]);

  /* `aria-current` dostaje pierwsza klatka w kadrze — tam zaczyna się to,
     co gość widzi. Kilka „bieżących" naraz czytnik ogłaszałby kilka razy. */
  const pierwszaWidoczna = widoczne.indexOf(true);

  return (
    <div className="mars-kadry">
      {/* Region z `tabIndex` tylko wtedy, gdy taśma faktycznie się przewija:
          bez tego byłaby dla klawiatury nieosiągalna, a nieruchoma dawałaby
          zbędny przystanek. */}
      <div
        ref={szynaRef}
        className="mars-kadry-szyna"
        role={przewija ? "region" : undefined}
        aria-label={przewija ? t.etykieta : undefined}
        tabIndex={przewija ? 0 : undefined}
      >
        {/* role="list": Safari/VoiceOver gubi rolę listy przy list-style: none.
            Lista UPORZĄDKOWANA — kolejność kroków jest treścią. */}
        <ol role="list" className="mars-kadry-tasma">
          {kroki.map((krok, i) => (
            <li key={krok.klucz} ref={ustawKlatke(i)} className="mars-kadry-klatka">
              {/* Zdjęcie dekoracyjne — krok nazywa podpis poniżej. Pusty opis
                  RAZEM z `aria-hidden`: test `mc1-landing` pilnuje, żeby
                  obraz z `alt=""` siedział poza drzewem dostępności. */}
              <img
                aria-hidden="true"
                className="mars-kadry-foto"
                src={wariant(KADRY[i], 720)}
                srcSet={zestaw(KADRY[i])}
                sizes={ROZMIAR_KADRU}
                width={720}
                height={900}
                alt=""
                loading={zaladuj ? "eager" : "lazy"}
                decoding="async"
              />
              <span className="mars-kadry-cien" aria-hidden="true" />
              {/* Przygaszenie klatek obok środkowej (telefon) — krycie liczy
                  się z `--dist`, które ustawia `useTasmaKadrow`. Leży POD
                  ikoną i podpisem: gaśnie samo zdjęcie, a tekst sąsiada
                  ma pełny kontrast (zmierzone: nakładka nad tekstem
                  o kryciu 0,38 zbijała klucz kroku do 3,5:1). */}
              <span className="mars-kadry-przygas" aria-hidden="true" />

              {/* BEZ numeru klatki („01 / 05") — usunięty 05.10.2026 na życzenie
                  obiektu. Kolejność niesie sama taśma, a czytnik ekranu
                  i tak ogłasza pozycję na liście. Zostaje ikona kroku. */}
              <span className="mars-kadry-gora" aria-hidden="true">
                <span className="mars-kadry-ikona">
                  <SolarIcon name={IKONY_KROKOW[i] ?? "rocket"} size="1.15rem" />
                </span>
              </span>

              <span className="mars-kadry-podpis">
                {/* BEZ `aria-hidden`: te pięć słów (LAND → DECIDE) to oś sekcji
                    z briefu, a nie ozdoba. `lang="en"` we wszystkich językach,
                    bo klucze zostają po angielsku — czytnik przeczyta je
                    angielską wymową, a nie polską. */}
                <span className="mars-kadry-klucz" lang="en">
                  {krok.klucz}
                </span>
                <span className="mars-kadry-tytul">{krok.tytul}</span>
                <span className="mars-kadry-opis">{krok.opis}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Licznik i strzałka. Na telefonie strzałka stoi w tym rzędzie przy
          prawej krawędzi; od 640 px arkusz kładzie ją NA taśmie, przy prawej
          krawędzi okna, w połowie wysokości klatek. */}
      <div className="mars-kadry-nawigacja" hidden={!przewija}>
        <div role="group" aria-label={t.grupa} className="mars-kadry-licznik">
          {kroki.map((krok, i) => (
            <button
              key={krok.klucz}
              type="button"
              onClick={() => idzDoKlatki(i)}
              aria-label={`${t.pokaz}: ${krok.tytul} (${i + 1}/${kroki.length})`}
              aria-current={i === pierwszaWidoczna ? "true" : undefined}
              className={`mars-kadry-segment${widoczne[i] ? " is-widoczny" : ""}`}
            >
              <span className="mars-kadry-segment-znak" aria-hidden="true" />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={dalej}
          aria-label={naKoncu ? t.poczatek : t.dalej}
          className={`mars-kadry-dalej${naKoncu ? " is-wstecz" : ""}`}
        >
          <SolarIcon name="arrow-right" size="1.15rem" className="mars-kadry-dalej-ikona" />
        </button>
      </div>
    </div>
  );
}
