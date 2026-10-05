"use client";

import { useEffect, useRef, useState } from "react";

/* --- Klisza filmowa w hero -----------------------------------------------------
   Od 05.10.2026 klisza NIE jest gotowym rastrem (`tasma-filmowa.png` miał
   wtopione kadry, mocną pomarańczową poświatę i zawinięty koniec — nie dało się
   zmienić ani długości, ani kadrowania, ani blasku). Jest komponentem: każdy
   kadr to osobny odcinek taśmy (podkład, perforacje, okno ze zdjęciem),
   ułożony na łagodnej krzywej szerszej niż okno — oba końce leżą za
   krawędziami ekranu, więc taśma „ciągnie się dalej".

   PODZIAŁ RÓL:
   - ARKUSZ decyduje o wszystkim, co jest kompozycją: wysokość taśmy
     (`--ms-klisza-wys`), przebieg krzywej (`--ms-klisza-fala`), perspektywa
     (`--ms-klisza-skala`), głębia ostrości (`--ms-klisza-rozmycie`) i tempo
     (`--ms-klisza-petla`) — osobno dla każdego progu, w bloku progów
     `mars.css`. Ten plik tych liczb nie zna.
   - TEN PLIK tylko je czyta, liczy z nich położenie odcinków i przesuwa je.

   Krzywa to punkty „x y": x jako ułamek szerokości hero, y jako wielokrotność
   wysokości taśmy, mierzona od DOŁU hero do osi taśmy. Między punktami idzie
   monotoniczny splajn sześcienny — nie przestrzeliwuje, więc najniższy punkt
   krzywej jest dokładnie tym, który podano.

   RUCH: bardzo wolny przesuw w prawo (ku postaci), jedna pełna sekwencja
   zdjęć na `--ms-klisza-petla` sekund. Bezszwowy, bo liczba odcinków jest
   wielokrotnością liczby zdjęć: odcinek, który znika za prawą krawędzią,
   wraca za lewą jako następny w kolejce. Stoi przy „ogranicz ruch", poza
   kadrem (obserwator przecięć) i w ukrytej karcie (`requestAnimationFrame`
   wtedy nie tyka). Warstwy kompozytora (`will-change`) tylko na czas ruchu.

   BEZ JS-a taśmy nie ma (odcinki czekają ukryte na pierwsze ułożenie) — to
   ozdoba, a treść hero nie zależy od niej ani trochę. */

/* Prawdziwe zdjęcia instalacji Mars pod kopułami (warianty: `klisza()`
   w `media-src/mars-colonization/warianty.py`). Kadrowanie robi
   `object-fit: cover`, a `pozycja` trzyma w oknie to, co na zdjęciu ważne.
   Kolejność to rytm barw: biel → zieleń z czerwienią → czerwień → błękit
   → zieleń z bielą → turkus; żadne dwa sąsiednie kadry nie mają tej samej
   dominanty. */
const KADRY = [
  { baza: "/mars-colonization/hero/klisza-szklarnia", pozycja: "30% 66%" },
  { baza: "/mars-colonization/hero/klisza-antena", pozycja: "40% 62%" },
  { baza: "/mars-colonization/hero/klisza-lazik", pozycja: "54% 64%" },
  { baza: "/mars-colonization/hero/klisza-zbiorniki", pozycja: "50% 48%" },
  { baza: "/mars-colonization/hero/klisza-sluza", pozycja: "58% 60%" },
  { baza: "/mars-colonization/hero/klisza-modul", pozycja: "56% 52%" },
] as const;

const ZDJEC = KADRY.length;

/* Tyle odcinków renderuje serwer. Klient po pierwszym pomiarze dobiera
   liczbę do szerokości okna (6 na telefonie, 12 przy 1920 px, 18 przy
   2560 px) — zawsze wielokrotność liczby zdjęć, inaczej sekwencja
   rwałaby się w miejscu, w którym odcinek wraca z prawej na lewą. Sufit 36
   wystarcza do ok. 7000 px szerokości; dalej koniec taśmy byłby widać. */
const LICZBA_STARTOWA = 18;
const LICZBA_MAX = 36;

/* Rozdzielczość tablicy położeń: co 1/20 odcinka. Gęściej nic nie daje —
   pośrednie położenia i tak interpoluje się liniowo. */
const KROK_TABLICY = 0.05;

type Ustawienia = {
  punkty: Array<[number, number]>;
  skala: [number, number, number];
  rozmycie: [number, number, number, number];
  petla: number;
};

type Uklad = {
  /** Liczba odcinków (wielokrotność liczby zdjęć). */
  n: number;
  szer: number;
  wys: number;
  /** Tablice próbek co KROK_TABLICY odcinka: środek, kąt, skala, rozmycie. */
  x: Float32Array;
  y: Float32Array;
  kat: Float32Array;
  skala: Float32Array;
  rozmycie: Float32Array;
};

function liczby(tekst: string): number[] {
  return tekst
    .split(/[\s,]+/)
    .map((s) => parseFloat(s))
    .filter((v) => Number.isFinite(v));
}

function czytajUstawienia(el: HTMLElement): Ustawienia | null {
  const styl = getComputedStyle(el);
  const surowe = liczby(styl.getPropertyValue("--ms-klisza-fala"));
  if (surowe.length < 4 || surowe.length % 2) return null;
  const punkty: Array<[number, number]> = [];
  for (let i = 0; i < surowe.length; i += 2) punkty.push([surowe[i], surowe[i + 1]]);
  punkty.sort((a, b) => a[0] - b[0]);
  const skala = liczby(styl.getPropertyValue("--ms-klisza-skala"));
  const rozmycie = liczby(styl.getPropertyValue("--ms-klisza-rozmycie"));
  const petla = parseFloat(styl.getPropertyValue("--ms-klisza-petla"));
  return {
    punkty,
    skala: [skala[0] ?? 1, skala[1] ?? 1, skala[2] ?? 1],
    rozmycie: [rozmycie[0] ?? 0, rozmycie[1] ?? 0.35, rozmycie[2] ?? 0, rozmycie[3] ?? 0.9],
    petla: Number.isFinite(petla) && petla > 0 ? petla : 36,
  };
}

/* Monotoniczny splajn sześcienny (Fritsch–Carlson): przechodzi przez każdy
   punkt i NIE przestrzeliwuje między nimi — zwykły splajn przy płaskim dnie
   fali dorysowałby dołek głębszy niż zadany. Poza zakresem punktów — prosta
   styczna do końca krzywej. Zwraca wartość i pochodną (w jednostkach
   punktów: y na ułamek szerokości). */
function splajn(punkty: Array<[number, number]>) {
  const n = punkty.length;
  const xs = punkty.map((p) => p[0]);
  const ys = punkty.map((p) => p[1]);
  const d: number[] = [];
  for (let k = 0; k < n - 1; k++) d.push((ys[k + 1] - ys[k]) / (xs[k + 1] - xs[k]));
  const m: number[] = new Array(n).fill(0);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let k = 1; k < n - 1; k++) m[k] = d[k - 1] * d[k] > 0 ? (d[k - 1] + d[k]) / 2 : 0;
  for (let k = 0; k < n - 1; k++) {
    if (d[k] === 0) {
      m[k] = 0;
      m[k + 1] = 0;
      continue;
    }
    const a = m[k] / d[k];
    const b = m[k + 1] / d[k];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[k] = t * a * d[k];
      m[k + 1] = t * b * d[k];
    }
  }
  return (x: number): [number, number] => {
    if (x <= xs[0]) return [ys[0] + m[0] * (x - xs[0]), m[0]];
    if (x >= xs[n - 1]) return [ys[n - 1] + m[n - 1] * (x - xs[n - 1]), m[n - 1]];
    let k = 0;
    while (x > xs[k + 1]) k++;
    const h = xs[k + 1] - xs[k];
    const t = (x - xs[k]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    const y =
      (2 * t3 - 3 * t2 + 1) * ys[k] +
      (t3 - 2 * t2 + t) * h * m[k] +
      (-2 * t3 + 3 * t2) * ys[k + 1] +
      (t3 - t2) * h * m[k + 1];
    const dy =
      ((6 * t2 - 6 * t) * ys[k] +
        (3 * t2 - 4 * t + 1) * h * m[k] +
        (-6 * t2 + 6 * t) * ys[k + 1] +
        (3 * t2 - 2 * t) * h * m[k + 1]) /
      h;
    return [y, dy];
  };
}

/* Perspektywa: odcinek po lewej jest BLIŻEJ widza (większy), w środku ma
   skalę wzorcową, po prawej — za postacią — oddala się. Trzy wartości
   z arkusza: lewa krawędź, środek (x = 0,5), prawa krawędź; poza oknem
   skala już nie rośnie. */
function skalaW(x: number, [l, s, p]: [number, number, number]): number {
  const u = Math.min(1, Math.max(0, x));
  return u < 0.5 ? l + (s - l) * (u / 0.5) : s + (p - s) * ((u - 0.5) / 0.5);
}

/* Głębia ostrości: najbliższy (lewy) fragment taśmy lekko rozmyty, środek
   ostry, a fragment za postacią — dalej od widza niż ona — ledwie miękki.
   Cztery liczby z arkusza: rozmycie przy lewej krawędzi [px], ułamek
   szerokości, na którym wygasa; rozmycie przy prawej krawędzi [px], ułamek,
   od którego narasta. */
function rozmycieW(x: number, [lMax, lKoniec, pMax, pStart]: [number, number, number, number]): number {
  const lewe = lKoniec > 0 ? Math.min(1, Math.max(0, (lKoniec - x) / lKoniec)) : 0;
  const prawe = pStart < 1 ? Math.min(1, Math.max(0, (x - pStart) / (1 - pStart))) : 0;
  return lMax * lewe ** 1.4 + pMax * prawe;
}

function zbudujUklad(szer: number, wys: number, skok: number, u: Ustawienia): Uklad {
  const krzywa = splajn(u.punkty);
  /* Start na tyle daleko za lewą krawędzią, żeby obrócony i powiększony
     odcinek był w chwili powrotu CAŁY poza ekranem. */
  const zapas = skok * u.skala[0] * 0.75 + wys * 0.15;
  const x: number[] = [];
  const y: number[] = [];
  const kat: number[] = [];
  const skala: number[] = [];
  const rozmycie: number[] = [];
  let px = -zapas;
  let f = 0;
  let koniec = Infinity;
  /* Całkowanie po taśmie: odcinek o skali s zajmuje na ekranie s × skok
     wzdłuż krzywej, więc z lewej (bliżej) taśma przesuwa się szybciej —
     tak, jak wygląda ruch w perspektywie. */
  for (;;) {
    const ux = px / szer;
    const [yy, dy] = krzywa(ux);
    const nachylenie = (dy * wys) / szer;
    const s = skalaW(ux, u.skala);
    x.push(px);
    y.push(yy * wys);
    kat.push(-Math.atan(nachylenie));
    skala.push(s);
    rozmycie.push(rozmycieW(ux, u.rozmycie));
    if (koniec === Infinity && px >= szer + zapas) {
      koniec = Math.min(LICZBA_MAX, Math.max(ZDJEC, Math.ceil(f / ZDJEC) * ZDJEC));
    }
    if (f >= koniec + KROK_TABLICY * 2) break;
    /* Bezpiecznik: przy zerowej skali w arkuszu taśma nie posuwałaby się
       w prawo i pętla nie skończyłaby się nigdy. */
    if (f > LICZBA_MAX + 1) {
      if (koniec === Infinity) koniec = LICZBA_MAX;
      break;
    }
    px += (skok * s * KROK_TABLICY) / Math.sqrt(1 + nachylenie * nachylenie);
    f += KROK_TABLICY;
  }
  return {
    n: koniec,
    szer,
    wys,
    x: Float32Array.from(x),
    y: Float32Array.from(y),
    kat: Float32Array.from(kat),
    skala: Float32Array.from(skala),
    rozmycie: Float32Array.from(rozmycie),
  };
}

/* Obrys wstęgi — GŁADKI kształt taśmy, liczony z tej samej krzywej co
   odcinki. Odcinki to sztywne prostokąty, więc na zgięciu i przy zmianie
   skali (perspektywa) ich krawędzie łamałyby się na łączeniach o 2–4 px:
   po zewnętrznej stronie zgięcia klin, po wewnętrznej ząbek. Obrys robi
   z tego jedną taśmę na trzy sposoby:
   - przycina odcinki (`clip-path`) — ząbki znikają,
   - leży pod nimi w kolorze podkładu — kliny się wypełniają,
   - rozmyty robi cień taśmy na scenie.
   Krawędzie (górna i dolna) idą osobno: po nich biegnie jasny włos światła. */
function obrysWstegi(uklad: Uklad, wysWarstwy: number) {
  const gora: string[] = [];
  const dol: string[] = [];
  const krok = 4;
  for (let i = 0; i < uklad.x.length; i += krok) {
    const cx = uklad.x[i];
    if (cx > uklad.szer + uklad.wys * 2) break;
    const cy = wysWarstwy - uklad.y[i];
    const pol = (uklad.wys / 2) * uklad.skala[i];
    /* Kąt w układzie ekranu (oś y w dół): normalna do osi taśmy. */
    const a = uklad.kat[i];
    const nx = Math.sin(a) * pol;
    const ny = Math.cos(a) * pol;
    gora.push(`${(cx + nx).toFixed(1)},${(cy - ny).toFixed(1)}`);
    dol.push(`${(cx - nx).toFixed(1)},${(cy + ny).toFixed(1)}`);
  }
  return {
    obrys: `M${gora.join("L")}L${[...dol].reverse().join("L")}Z`,
    krawedzie: `M${gora.join("L")}M${dol.join("L")}`,
  };
}

/* Jeden obrys na stronę — identyfikator stały, a nie z `useId`, bo trafia
   do `clip-path: url(#…)`, gdzie dwukropki i znaki spoza ASCII trzeba by
   ucieczkować. */
const ID_OBRYSU = "mars-klisza-obrys";

export function KliszaHero() {
  const korzen = useRef<HTMLDivElement | null>(null);
  const odcinki = useRef<(HTMLDivElement | null)[]>([]);
  const wstega = useRef<SVGSVGElement | null>(null);
  const swiatlo = useRef<SVGSVGElement | null>(null);
  const [liczba, ustawLiczbe] = useState(LICZBA_STARTOWA);

  useEffect(() => {
    const el = korzen.current;
    if (!el) return;
    const hero = el.parentElement ?? el;
    const ograniczRuch = window.matchMedia("(prefers-reduced-motion: reduce)");

    let uklad: Uklad | null = null;
    let ustawienia: Ustawienia | null = null;
    /* Wymiary odcinka czytane RAZ, przy układaniu. Odczyt `offsetWidth`
       w pętli klatki, zaraz po zapisie transformacji poprzedniego odcinka,
       wymuszałby przeliczenie układu przy każdym odcinku w każdej klatce. */
    let szerOdcinka = 0;
    let wysOdcinka = 0;
    /* Faza w odcinkach taśmy, nie w pikselach — po zmianie szerokości okna
       taśma zostaje w tym samym miejscu sekwencji, zamiast skakać. */
    let faza = 0;
    let klatka = 0;
    let ostatni = 0;
    let widoczna = true;
    const ostatnieRozmycie: number[] = [];

    const rysuj = () => {
      if (!uklad) return;
      const { n, x, y, kat, skala, rozmycie } = uklad;
      const ostatniIndeks = x.length - 1;
      for (let i = 0; i < n; i++) {
        const odcinek = odcinki.current[i];
        if (!odcinek) continue;
        const f = (((i + faza) % n) + n) % n;
        const k = f / KROK_TABLICY;
        const j = Math.min(ostatniIndeks - 1, Math.floor(k));
        const t = k - j;
        const cx = x[j] + (x[j + 1] - x[j]) * t;
        const cy = y[j] + (y[j + 1] - y[j]) * t;
        const a = kat[j] + (kat[j + 1] - kat[j]) * t;
        const s = skala[j] + (skala[j + 1] - skala[j]) * t;
        odcinek.style.transform =
          `translate3d(${(cx - szerOdcinka / 2).toFixed(2)}px,` +
          `${(wysOdcinka / 2 - cy).toFixed(2)}px,0) rotate(${a.toFixed(4)}rad) scale(${s.toFixed(4)})`;
        /* Rozmycie zmienia się skokami co 0,05 px — inaczej każdy odcinek
           dostawałby nowy filtr w każdej klatce. */
        const r = Math.round((rozmycie[j] + (rozmycie[j + 1] - rozmycie[j]) * t) * 20) / 20;
        if (ostatnieRozmycie[i] !== r) {
          ostatnieRozmycie[i] = r;
          odcinek.style.filter = r > 0 ? `blur(${r}px)` : "";
        }
      }
    };

    const uloz = () => {
      const pierwszy = odcinki.current[0];
      ustawienia = czytajUstawienia(el);
      if (!pierwszy || !ustawienia) return;
      const wys = pierwszy.offsetHeight;
      const skok = pierwszy.offsetWidth;
      const szer = hero.clientWidth;
      if (!wys || !skok || !szer) return;
      const nowy = zbudujUklad(szer, wys, skok, ustawienia);
      if (nowy.n !== liczba) {
        /* Inna liczba odcinków — React dorenderuje brakujące (albo zdejmie
           nadmiarowe), a efekt uruchomi się od nowa z nową liczbą. Do tego
           czasu pętla nie rysuje nic (`uklad` zostaje pusty). */
        uklad = null;
        ustawLiczbe(nowy.n);
        return;
      }
      szerOdcinka = skok;
      wysOdcinka = wys;
      uklad = nowy;
      const wysWarstwy = el.clientHeight;
      const { obrys, krawedzie } = obrysWstegi(uklad, wysWarstwy);
      for (const svg of [wstega.current, swiatlo.current]) {
        svg?.setAttribute("viewBox", `0 0 ${szer} ${wysWarstwy}`);
      }
      wstega.current
        ?.querySelectorAll<SVGPathElement>(".mars-klisza-cien, .mars-klisza-podklad, .mars-klisza-obrys")
        .forEach((p) => p.setAttribute("d", obrys));
      swiatlo.current?.querySelector("path")?.setAttribute("d", krawedzie);
      ostatnieRozmycie.length = 0;
      rysuj();
      el.classList.add("is-gotowa");
    };

    const tik = (czas: number) => {
      klatka = 0;
      if (!uklad || !ustawienia) return;
      /* Przy powrocie do karty albo po długiej klatce nie nadrabiamy czasu —
         taśma ma płynąć, a nie przeskoczyć. */
      const dt = ostatni ? Math.min(0.1, (czas - ostatni) / 1000) : 0;
      ostatni = czas;
      faza = (faza + (dt * ZDJEC) / ustawienia.petla) % uklad.n;
      rysuj();
      klatka = requestAnimationFrame(tik);
    };

    const start = () => {
      if (klatka || !widoczna || ograniczRuch.matches) return;
      ostatni = 0;
      el.classList.add("is-ruch");
      klatka = requestAnimationFrame(tik);
    };

    const stop = () => {
      if (klatka) cancelAnimationFrame(klatka);
      klatka = 0;
      el.classList.remove("is-ruch");
    };

    uloz();
    start();

    const obserwatorRozmiaru = new ResizeObserver(() => uloz());
    obserwatorRozmiaru.observe(hero);

    const obserwatorKadru = new IntersectionObserver(([wpis]) => {
      widoczna = wpis.isIntersecting;
      if (widoczna) start();
      else stop();
    });
    obserwatorKadru.observe(el);

    const zmianaRuchu = () => {
      if (ograniczRuch.matches) stop();
      else start();
    };
    ograniczRuch.addEventListener("change", zmianaRuchu);

    return () => {
      stop();
      obserwatorRozmiaru.disconnect();
      obserwatorKadru.disconnect();
      ograniczRuch.removeEventListener("change", zmianaRuchu);
    };
  }, [liczba]);

  return (
    <div className="mars-klisza" ref={korzen} aria-hidden="true">
      {/* Cień, podkład i maska przycięcia — jeden obrys (patrz
          `obrysWstegi`). Statyczne: przesuwają się tylko odcinki. */}
      <svg className="mars-klisza-wstega" ref={wstega} preserveAspectRatio="none" focusable="false">
        <defs>
          <clipPath id={ID_OBRYSU} clipPathUnits="userSpaceOnUse">
            <path className="mars-klisza-obrys" />
          </clipPath>
        </defs>
        <path className="mars-klisza-cien" />
        <path className="mars-klisza-podklad" />
      </svg>
      <div className="mars-klisza-tor" style={{ clipPath: `url(#${ID_OBRYSU})` }}>
      {Array.from({ length: liczba }, (_, i) => {
        const kadr = KADRY[i % ZDJEC];
        return (
          <div
            key={i}
            className="mars-klisza-odcinek"
            data-zdjecie={i % ZDJEC}
            ref={(element) => {
              odcinki.current[i] = element;
            }}
          >
            <span className="mars-klisza-okno">
              <img
                src={`${kadr.baza}-400.webp`}
                srcSet={`${kadr.baza}-400.webp 400w, ${kadr.baza}-800.webp 800w`}
                /* Okno kadru ma najwyżej ~1,04 × 11,5 rem × 1,1 (perspektywa)
                   ≈ 13 rem na desktopie i ~8 rem na telefonie. Przy gęstości 2
                   wychodzi z tego plik 400 px — 800 dostaje dopiero gęstość 3. */
                sizes="(min-width: 1024px) 12.5rem, 8rem"
                alt=""
                width={400}
                height={300}
                decoding="async"
                /* Taśma to ozdoba w dole kadru: nie może konkurować o łącze
                   z tłem i postacią (te mają `fetchPriority="high"`). */
                fetchPriority="low"
                style={{ objectPosition: kadr.pozycja }}
              />
            </span>
          </div>
        );
      })}
      </div>
      {/* Włos światła na obu krawędziach taśmy — nad odcinkami, jedną linią
          po gładkim obrysie, więc nie łamie się na łączeniach. */}
      <svg className="mars-klisza-swiatlo" ref={swiatlo} preserveAspectRatio="none" focusable="false">
        <path />
      </svg>
    </div>
  );
}
