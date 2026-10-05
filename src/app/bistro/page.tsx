"use client";

/* Style tej podstrony — wycięte z globals.css.
   Wspólne zmienne (.dojazd-page, .bistro-page) zostały w arkuszu globalnym. */
import "./bistro.css";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { Rozwijane } from "@/app/components/Rozwijane";
import { SolarIcon, type SolarIconName } from "@/app/components/SolarIcon";
import { useUjawnianie } from "@/app/components/useUjawnianie";
import { useI18n } from "@/app/i18n-provider";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import { linkTrasy } from "@/app/jak-dojechac/dojazdData";

import { BISTRO_COPY, type BistroCopy } from "./bistroCopy";

/* --- Czego NIE MA i czego nie wolno dopisywać -------------------------------
   Cen, składu dań i godzin wydawania obiadów nie ma w żadnych danych obiektu.
   Godziny otwarcia, wstęp bez biletu, pojemność parkingu i formy płatności
   pochodzą z briefu z 2026-09-25 i siedzą w `bistroCopy`.

   Karta dań jako PDF albo osobna podstrona NADAL NIE ISTNIEJE. Dopóki nie
   powstanie, „Zobacz menu" prowadzi do sekcji „Co zjesz pod kopułami?" na tej
   samej stronie — to jedyne miejsce, w którym oferta jest naprawdę opisana,
   więc przycisk nie kłamie. Gdy obiekt przekaże kartę, wystarczy podmienić
   ten jeden adres na zewnętrzny; reszta kodu zostaje bez zmian. */
const ADRES_MENU = "#bistro-menu-tytul";

/* --- Zdjęcia ----------------------------------------------------------------
   Same prawdziwe kadry: wnętrze bistra, jego lodówki i witryna z przekąskami
   oraz zdjęcia terenu Alvernia Planet. Nie ma jeszcze zdjęć dań ani gości przy
   stolikach — dopóki nie ma, nie udajemy ich niczym zastępczym.
   Po sesji zdjęciowej wystarczy podmienić ścieżki w tym jednym miejscu. */
const FOTO = {
  /* Prawdziwy taras bistra: drewniany luk z lampkami, stol na pierwszym planie
     i widok na teren Alvernia Planet. Zrodlo lezy w `media-src/bistro/zrodla`. */
  hero: { duze: "/bistro/hero.webp", male: "/bistro/hero-900.webp" },
  /* Grupa szkolna przy stolikach pod kopula — dokladnie to, o czym mowi tekst
     sekcji. Do czasu dostarczenia tego kadru stala tu witryna z przekaskami. */
  klasa: { duze: "/bistro/klasa.webp", male: "/bistro/klasa-900.webp" },
  podroz: { duze: "/jak-dojechac/dojazd-wjazd.webp", male: "/jak-dojechac/dojazd-wjazd-900.webp" },
} as const;

/* Kolejnosc kadrow musi odpowiadac kolejnosci opisow w `copy.alt.galeria` —
   obie listy sa laczone po indeksie.

   To osobne pliki, a nie te same zdjecia co w sekcjach wyzej: kafelek ma
   najwyzej 369 px szerokosci, wiec kazdy kadr jest przyciety do 4:3 i zapisany
   w 760 px. Wczesniej siatka ciagnela pelnowymiarowe pliki 1100–1600 px —
   1175 kB zamiast 404 kB — a zdjecie wjazdu pobieralo sie na telefonie drugi
   raz, w innej rozdzielczosci niz w sekcji „po drodze". */
const GALERIA = [
  "/bistro/galeria-klasa.webp",
  "/bistro/galeria-napoje.webp",
  "/bistro/galeria-przekaski.webp",
  "/bistro/galeria-kopuly.webp",
  "/bistro/galeria-wjazd.webp",
  "/bistro/galeria-kopula-wnetrze.webp",
] as const;

/* Alver w stroju kucharza — stoi przy kafelku z godzinami. To ten sam plik,
   który wcześniej był w hero: ma wygaszony dół (bez płomieni rakiety), więc
   postać wtapia się w kafelek zamiast kończyć ostrą kreską. */
/* Nazwa własna lokalu — nie tłumaczy się, tak samo jak `meta.tytul` we
   wszystkich pięciu językach. Stąd jeden napis, a nie pole w tekstach. */
const ZNAK_ALT = "Bistro pod Kopułami";

const ALVER = {
  duzy: "/bistro/alvernia-kucharka.webp",
  maly: "/bistro/alvernia-kucharka-560.webp",
} as const;

/* Bohater hero: talerze jako OSOBNE pliki z przezroczystym tłem, a nie elementy
   wtopione w fotografię. Dzięki temu da się je przesuwać, skalować i obracać
   niezależnie od tła, a tło zostaje samą scenografią.

   Dwa dania, a nie cztery: naleśnik szpinakowy i gofr zeszły z hero na
   życzenie obiektu. Zostają te, które w kadrze czytają się jako konkretny
   posiłek. 1200 px wystarcza na 688 px szerokości przy gęstości 2. */
const TALERZE_HERO = [
  "/bistro/dania/hero-stripsy.webp",
  "/bistro/dania/hero-zapiekanka.webp",
] as const;

/* Talerz hero zmienia się co 5 s. Dwie rzeczy są tu ważniejsze niż sam efekt:

   1. do DOM-u wchodzą tylko te zdjęcia, które są już potrzebne. Wszystkie
      leżą w pierwszym kadrze, więc `loading="lazy"` nic by nie dało —
      przeglądarka pobrałaby je od razu i 740 kB konkurowałoby z pomiarem
      największego elementu kadru. Zamiast tego kolejny plik dochodzi dopiero
      wtedy, gdy zbliża się jego kolej; kto zamknie stronę po dwóch sekundach,
      pobierze jeden talerz zamiast czterech.
   2. przy „ogranicz ruch" nic się nie przełącza i zostaje pierwsze danie. */
function TalerzHero() {
  const [aktywne, setAktywne] = useState(0);
  const [ileWDom, setIleWDom] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = window.setInterval(() => {
      setAktywne((i) => (i + 1) % TALERZE_HERO.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  /* Drugie zdjęcie dokładamy dopiero po pierwszym kadrze — stąd opóźnienie. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = window.setTimeout(() => setIleWDom((n) => Math.max(n, 2)), 1500);
    return () => window.clearTimeout(id);
  }, []);

  /* Dalej trzymamy jedno zdjęcie zapasu przed aktywnym. */
  useEffect(() => {
    if (aktywne === 0) return;
    setIleWDom((n) => Math.max(n, Math.min(aktywne + 2, TALERZE_HERO.length)));
  }, [aktywne]);

  return (
    <div className="bistro-hero-danie">
      {TALERZE_HERO.slice(0, ileWDom).map((src, i) => (
        <img
          key={src}
          className={i === aktywne ? "is-widoczne" : undefined}
          src={src}
          srcSet={`${mniejszy(src, 800)} 800w, ${src} 1200w`}
          /* Te same liczby, co szerokość talerza w arkuszu: 88vw na telefonie,
             min(42vw, 27.5rem) na tablecie, clamp(19.75rem, 37vw, 38.7rem)
             wyżej. Telefon bierze przez to wariant 800 px zamiast 1200 px. */
          sizes="(max-width: 767px) 88vw, (max-width: 1023px) 42vw, 37vw"
          alt=""
          width={1200}
          height={1200}
          {...(i === 0 ? { fetchPriority: "high" as const } : {})}
          decoding="async"
        />
      ))}
    </div>
  );
}


/* Ikony: te same nazwy co w reszcie serwisu, czyli Phosphor przez `SolarIcon`.
   Kolejność odpowiada kolejności pozycji w `bistroCopy`. */
/* Ikona zostaje jako zapas: pokazuje się tylko wtedy, gdy pozycja nie ma
   jeszcze zdjęcia. Kolejność musi odpowiadać kolejności pozycji w `bistroCopy`. */
const IKONY_MENU: SolarIconName[] = [
  "bowl-food",
  "bowl-food",
  "cookie",
  "burger",
  "fork-knife",
  "coffee",
];

/* Ikony mikro-korzyści w hero. Kolejność musi odpowiadać kolejności pozycji
   w `copy.hero.zalety` — obie listy łączy indeks. Wszystkie są już w zestawie
   Phosphor używanym w całym serwisie; nic nowego nie dochodzi. */
const IKONY_ZALET: SolarIconName[] = ["ticket", "guests", "bowl-food"];

/* Zdjęcia dań — wycięte fotografie produktowe dostarczone przez obiekt,
   przeskalowane do 800 px (źródła 2375 px leżą w `media-src/bistro/zrodla`).
   Kolejność ta sama co w `bistroCopy.menu.pozycje`.

   KAŻDA pozycja to LISTA. Gdzie zdjęć jest więcej niż jedno, kafelek przewija
   je sam co 5 s i pokazuje strzałkę; gdzie jedno — zostaje zwykły obrazek.
   Dorzucenie kolejnego wariantu (np. drugiej zapiekanki) to dopisanie ścieżki
   do tej listy i nic więcej. Pozycja bez zdjęć dostaje ikonę zastępczą. */
const ZDJECIA_MENU: string[][] = [
  [
    "/bistro/dania/nalesnik-banan.webp",
    "/bistro/dania/nalesnik-maliny.webp",
    "/bistro/dania/nalesnik-truskawka.webp",
  ],
  ["/bistro/dania/nalesnik-szpinak.webp", "/bistro/dania/nalesnik-szynka-ser.webp"],
  ["/bistro/dania/gofr.webp", "/bistro/dania/gofr-czekolada.webp"],
  ["/bistro/dania/zapiekanka.webp"],
  ["/bistro/dania/stripsy.webp"],
  ["/bistro/dania/kawa-herbata.webp"],
];

/* Ścieżka do mniejszego wariantu tego samego zdjęcia. Warianty wytwarza
   `media-src/bistro/warianty.py` — żaden krok budowania ich nie policzy, bo
   przy eksporcie statycznym `images.unoptimized` jest włączone i `next/image`
   nie przelicza niczego. Stąd `srcSet` podany wprost. */
function mniejszy(sciezka: string, szerokosc: 400 | 800): string {
  return sciezka.replace(/\.webp$/, `-${szerokosc}.webp`);
}

/* Kadr kafelka menu. Zdjęcia leżą na sobie i przenikają się, więc wysokość
   kafelka nie drga przy zmianie. Auto-przewijanie zatrzymuje się pod kursorem
   i przy fokusie — jeśli ktoś właśnie ogląda danie, nie może mu ono uciec. */
function KadrDania({
  zdjecia,
  ikona,
  etykietaDalej,
}: {
  zdjecia: string[];
  ikona: SolarIconName;
  etykietaDalej: string;
}) {
  const [aktywne, setAktywne] = useState(0);
  const [zatrzymane, setZatrzymane] = useState(false);
  const wiele = zdjecia.length > 1;

  useEffect(() => {
    if (!wiele || zatrzymane) return undefined;
    /* Ruch, o który nikt nie prosił, bywa problemem — przy włączonym
       ograniczeniu animacji zdjęcie zmienia wyłącznie strzałka. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = window.setInterval(() => {
      setAktywne((i) => (i + 1) % zdjecia.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [wiele, zatrzymane, zdjecia.length]);

  if (zdjecia.length === 0) {
    return (
      <div className="bistro-karta-kadr">
        <SolarIcon name={ikona} size="1.7em" className="bistro-karta-ikona" />
      </div>
    );
  }

  return (
    <div
      className="bistro-karta-kadr"
      onMouseEnter={() => setZatrzymane(true)}
      onMouseLeave={() => setZatrzymane(false)}
    >
      {zdjecia.map((src, i) => (
        <img
          key={src}
          className={i === aktywne ? "is-widoczne" : undefined}
          src={src}
          srcSet={`${mniejszy(src, 400)} 400w, ${src} 800w`}
          /* Kafelek ma najwyżej 371 px (trzy kolumny w kontenerze 1180 px),
             a na telefonie ok. 160 px przy dwóch kolumnach. Bez tej miary
             przeglądarka zakładałaby 100vw i na telefonie ciągnęła plik 800 px
             pięć razy większy, niż go rysuje. */
          sizes="(max-width: 767px) 46vw, (max-width: 1203px) 31vw, 371px"
          alt=""
          loading="lazy"
          decoding="async"
        />
      ))}

      {wiele ? (
        /* Kropki są WSKAŹNIKIEM, nie przyciskami: bez nich nie widać, że kafelek
           ma więcej niż jedno zdjęcie, a gdyby każda była osobnym celem, karta
           dostałaby pięć celów dotykowych po 44 px na zdjęciu wielkości znaczka.
           Sterowanie zostaje jedno — strzałka. */
        <div className="bistro-karta-sterowanie">
          <span className="bistro-karta-kropki" aria-hidden="true">
            {zdjecia.map((src, i) => (
              <span
                key={src}
                className={i === aktywne ? "bistro-karta-kropka is-aktywna" : "bistro-karta-kropka"}
              />
            ))}
          </span>

          <button
            type="button"
            className="bistro-karta-dalej"
            aria-label={etykietaDalej}
            onClick={() => {
              setAktywne((i) => (i + 1) % zdjecia.length);
              setZatrzymane(true);
            }}
            onFocus={() => setZatrzymane(true)}
            onBlur={() => setZatrzymane(false)}
          >
            <SolarIcon name="chevron-right" size="1.05em" weight="bold" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* --- Łuk przejścia hero → jasna sekcja --------------------------------------
   Ten sam kształt co na /jak-dojechac. Nad krawędzią biegnie włos orbity —
   motyw wprost z logotypu „Bistro pod Kopułami". */
function LukPrzejscia() {
  return (
    <svg
      className="bistro-fala"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="bistro-fala-ksztalt"
        d="M0,20 C300,2 520,64 760,78 C1020,92 1240,36 1440,46 L1440,96 L0,96 Z"
      />
      <path
        className="bistro-orbita"
        vectorEffect="non-scaling-stroke"
        d="M0,8 C300,-10 520,52 760,66 C1020,80 1240,24 1440,34"
      />
      <circle className="bistro-orbita-punkt" cx="760" cy="66" r="4" />
    </svg>
  );
}

/* --- Baner zamykajacy hero ---------------------------------------------------
   Miejsce na materiał obiektu w proporcji 1310 × 360 (z briefu). Slot stoi
   POZA nagłówkiem, bo ten przycina wszystko, co wychodzi poniżej jego krawędzi
   (`overflow: hidden` — na nim opiera się przycięcie talerza). Dzięki temu
   baner może wjechać ujemnym marginesem na łuk i wystawać pod niego: hero nie
   kończy się płaską kreską, tylko kartą przeciętą falą.

   Dopisanie materiału to dopisanie POZYCJI PONIŻEJ i nic więcej: wysokość slotu
   liczy się z proporcji, a nie z obrazka, więc układ nie drgnie nawet wtedy, gdy
   nowy plik ma inne wymiary. Każdy plik ma mieć 1310 × 360 — pilnuje tego test
   `bs3-fala`, bo inaczej slot byłby w porządku, a materiał i tak by się przyciął.

   `alt` niesie TREŚĆ materiału, a nie opis pliku: to komunikat, a nie ozdoba,
   więc pustego `alt` tu nie ma. Jeśli obiekt poda adres docelowy, baner staje
   się odnośnikiem; do tego czasu jest obrazkiem, a nie linkiem donikąd. */
/* Ścieżka do wariantu o podwójnej gęstości. Oba pliki robi `warianty-baner.py`
   — żaden krok budowania ich nie policzy, bo przy eksporcie statycznym
   `images.unoptimized` jest włączone i `next/image` nie przelicza niczego. */
function podwojny(sciezka: string): string {
  return sciezka.replace(/\.webp$/, "-2620.webp");
}

const BANERY_HERO: { src: string; alt: string }[] = [
  {
    src: "/bistro/banner/filmowo-kosmiczne-smaki.webp",
    alt: "Filmowo. Kosmicznie. Dobre smaki — maskotki Alvernia Planet w strojach kucharzy z talerzem naleśników na tle kopuł",
  },
  {
    src: "/bistro/banner/festiwal-nalesnikow.webp",
    alt: "Festiwal Naleśników w Bistro pod Kopułami — naleśnikowe szaleństwo tylko od 10 do 30 października 2026",
  },
];

/* Karuzela banerów. Ta sama mechanika co w kafelkach karty dań: materiały leżą
   JEDEN NA DRUGIM i przenikają się kryciem, a nie stoją w przewijanym rzędzie.
   Układ w rzędzie byłby tu pułapką — obraz poza poziomym kadrem z `loading=lazy`
   nie pobiera się nigdy, więc drugi baner nie pokazałby się wcale.

   Automat staje pod kursorem i przy fokusie, a klik w strzałkę zatrzymuje go na
   dobre: skoro ktoś sam przewija, materiał nie ma mu uciekać spod palca. To
   zarazem wymagane „zatrzymanie" dla treści, która rusza się sama. Przy
   „ogranicz ruch" automat nie startuje wcale i zostaje pierwszy baner. */
function BanerHero({ copy }: { copy: BistroCopy }) {
  const [aktywne, setAktywne] = useState(0);
  const [zatrzymane, setZatrzymane] = useState(false);
  const wiele = BANERY_HERO.length > 1;

  useEffect(() => {
    if (!wiele || zatrzymane) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = window.setInterval(() => {
      setAktywne((i) => (i + 1) % BANERY_HERO.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [wiele, zatrzymane]);

  /* `+ dlugosc` przed resztą z dzielenia: w JavaScripcie `-1 % 2` to `-1`,
     a nie `1`, więc bez tego strzałka wstecz wyprowadzałaby poza tablicę. */
  const przesun = (krok: number) => {
    setAktywne((i) => (i + krok + BANERY_HERO.length) % BANERY_HERO.length);
    setZatrzymane(true);
  };

  return (
    <div className="bistro-baner-pas">
      {/* Rama trzyma miarę materiału (1310 px) i jest układem odniesienia dla
          strzałek. Dzięki temu te same przyciski raz leżą NA banerze, a raz pod
          nim — bez dublowania ich w znacznikach, co dałoby czytnikowi ekranu
          dwa komplety sterowania. */}
      <div
        className="bistro-baner-rama"
        onMouseEnter={() => setZatrzymane(true)}
        onMouseLeave={() => setZatrzymane(false)}
      >
      <div className="bistro-baner">
        {BANERY_HERO.map((baner, i) => (
          /* `lazy`, a nie `eager`: na telefonie baner leży daleko pod pierwszym
             kadrem, a na desktopie i tak wchodzi w okno, więc przeglądarka
             pobierze go od razu — tylko niższym priorytetem niż talerz hero,
             który jest tu największym elementem kadru.

             `aria-hidden` na nieaktywnym: oba materiały są w drzewie przez cały
             czas (przenikanie kryciem), a samo `opacity: 0` NIE wyjmuje obrazka
             z drzewa dostępności — bez tego czytnik ekranu czytałby oba opisy
             naraz. */
          <img
            key={baner.src}
            className={i === aktywne ? "is-widoczne" : undefined}
            src={baner.src}
            srcSet={`${baner.src} 1310w, ${podwojny(baner.src)} 2620w`}
            /* Dokładna miara slotu — trzy progi, bo ma trzy zachowania: od
               1350 px stoi na 1310 px, od 768 px schodzi proporcjonalnie
               w marginesie strony, a na telefonie idzie od krawędzi do
               krawędzi. Bez tego przeglądarka zakładałaby 100vw i telefon
               o podwójnej gęstości ciągnąłby plik 2620 px, rysując go na
               390 px — czyli cztery razy więcej danych, niż widać. */
            sizes="(min-width: 1350px) 1310px, (min-width: 768px) calc(100vw - 2.5rem), 100vw"
            alt={baner.alt}
            width={1310}
            height={360}
            loading="lazy"
            decoding="async"
            aria-hidden={i === aktywne ? undefined : true}
          />
        ))}
      </div>

      {wiele ? (
        /* Od tabletu w górę ten pasek leży NA materiale i strzałki idą po jego
           bokach. Na telefonie schodzi POD baner: wstążka ma tam 96 px wysokości,
           a oba banery zaczynają nagłówek tuż przy lewej krawędzi — krążek 44 px
           zjadał pierwsze litery („FILMOWO.", „FESTIWAL"). Zmierzone, nie
           oszacowane: przy 390 px strzałka zajmuje x 5–49, a tekst zaczyna się
           na 17 px. */
        <div className="bistro-baner-sterowanie">
          <button
            type="button"
            className="bistro-baner-strzalka is-wstecz"
            aria-label={copy.baner.poprzedni}
            onClick={() => przesun(-1)}
            onFocus={() => setZatrzymane(true)}
            onBlur={() => setZatrzymane(false)}
          >
            <SolarIcon name="chevron-left" size="1.05em" weight="bold" />
          </button>

          {/* Kropki są WSKAŹNIKIEM, nie przyciskami — ten sam wybór co
              w kafelkach karty dań. Mówią, ile jest materiałów i który jest
              teraz na wierzchu; gdyby każda była osobnym celem, pasek dostałby
              kolejne cele dotykowe 44 px obok dwóch, które już ma. Sterowanie
              zostaje jedno: strzałki. Dla czytnika ekranu są niewidoczne, bo
              informację o zmianie niesie opis alternatywny materiału. */}
          <span className="bistro-baner-kropki" aria-hidden="true">
            {BANERY_HERO.map((baner, i) => (
              <span
                key={baner.src}
                className={i === aktywne ? "bistro-baner-kropka is-aktywna" : "bistro-baner-kropka"}
              />
            ))}
          </span>

          <button
            type="button"
            className="bistro-baner-strzalka is-dalej"
            aria-label={copy.baner.nastepny}
            onClick={() => przesun(1)}
            onFocus={() => setZatrzymane(true)}
            onBlur={() => setZatrzymane(false)}
          >
            <SolarIcon name="chevron-right" size="1.05em" weight="bold" />
          </button>
        </div>
      ) : null}
      </div>
    </div>
  );
}

/** Przycisk do karty dań. Pojawia się dopiero, gdy znamy jej adres.

    Jedna etykieta na wszystkie szerokości: „Zobacz menu" mieści się w połowie
    rzędu nawet przy 320 px, więc telefon nie potrzebuje już własnej wersji. */
function PrzyciskMenu({
  etykieta,
  wariant,
}: {
  etykieta: string;
  wariant: "glowny" | "drugi";
}) {
  /* Kotwica na tej samej stronie nie może otwierać nowej karty; zewnętrzny
     adres — owszem. Rozpoznajemy to po pierwszym znaku. */
  const wewnetrzny = ADRES_MENU.startsWith("#");
  return (
    <a
      className={wariant === "glowny" ? "bistro-przycisk-glowny" : "bistro-przycisk-drugi"}
      href={ADRES_MENU}
      {...(wewnetrzny ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
      <SolarIcon name="fork-knife" size="1.05em" />
      {etykieta}
      <SolarIcon name="arrow-right" size="1em" className="bistro-przycisk-strzalka" />
    </a>
  );
}

/* --- Hero ------------------------------------------------------------------
   Editorial food: fotografia blatu ze składnikami jest SCENOGRAFIĄ, a jeden
   duży talerz — bohaterem. Oba są osobnymi plikami i nigdy nie zostają scalone:
   talerz da się przez to przesunąć, powiększyć i obrócić bez ruszania tła,
   a tło podmienić bez ruszania talerza.

   Czworo dzieci układu stoi w takiej kolejności w znacznikach, żeby na telefonie
   nie trzeba było dublować treści: tam `order` przestawia je na pionowy rytm
   z briefu (tekst -> CTA -> talerz -> korzyści), a na desktopie talerz wypada
   z toku na pozycję bezwzględną, więc kolejność pozostałych trzech zostaje
   taka, jak w kodzie. */
function Hero({ copy, loc }: { copy: BistroCopy; loc: Locale }) {
  return (
    <header className="bistro-hero">
      <div className="bistro-hero-foto" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet={FOTO.hero.male} />
          <img
            src={FOTO.hero.duze}
            alt=""
            width={1672}
            height={941}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>

      <div className="bistro-shell bistro-hero-uklad">
        <div className="bistro-hero-tekst">
          {/* Znak jest CZĘŚCIĄ nagłówka, a nie ozdobą nad nim. Z tekstu zeszło
              „pod kopułami", więc bez znaku H1 przestałby nieść nazwę lokalu —
              a na tę nazwę ta strona się wyszukuje. Czytnik ekranu mówi
              „Bistro pod Kopułami, Kosmicznie dobre jedzenie", czyli dokładnie
              to, co widać.

              Wersja negatywowa to ten sam plik z granatem podmienionym na biel:
              znak leży tu na ciemnej fotografii, a nie na jasnej płaszczyźnie.
              Łuk i para zostają w swoim błękicie. */}
          <h1 className="bistro-hero-tytul">
            <img
              className="bistro-hero-znak"
              src="/bistro/logo-negatyw.svg"
              alt={ZNAK_ALT}
              width={1000}
              height={500}
              fetchPriority="high"
              decoding="async"
            />
            <span className="bistro-hero-haslo">
              {copy.hero.tytul1}
              <br />
              <span className="bistro-akcent">{copy.hero.tytul2}</span>
            </span>
          </h1>
          <p className="bistro-hero-lead">{copy.hero.copy}</p>
        </div>

        {/* Mikro-korzyści, nie karty: sama ikona i jedno słowo-klucz. */}
        <ul role="list" className="bistro-hero-zalety">
          {copy.hero.zalety.map((zaleta, i) => (
            <li key={zaleta}>
              <SolarIcon name={IKONY_ZALET[i]} size="1.05em" />
              {zaleta}
            </li>
          ))}
        </ul>

        {/* Zdanie-haczyk tuż nad wyjściem z hero. Wyrasta z mikro-korzyści
            i prowadzi do przycisku — dlatego stoi między nimi, a nie w opisie. */}
        <p className="bistro-hero-zacheta">{copy.hero.zacheta}</p>

        <div className="bistro-hero-akcje">
          <PrzyciskMenu etykieta={copy.hero.ctaMenu} wariant="glowny" />
          <Link className="bistro-przycisk-drugi" href={getLocalizedPath("/jak-dojechac", loc)}>
            <SolarIcon name="route" size="1.05em" />
            {copy.hero.ctaDojazd}
          </Link>
        </div>

        <TalerzHero />
      </div>

      <LukPrzejscia />
    </header>
  );
}

/* --- Filmowo-kosmiczne menu -------------------------------------------------
   Jedna jasna powierzchnia z wewnętrzną siatką — sześć osobnych kart
   z obramowaniem robiło z tego panel administracyjny. */
function SekcjaMenu({ copy }: { copy: BistroCopy }) {
  return (
    <section className="bistro-shell bistro-menu" aria-labelledby="bistro-menu-tytul" data-ujawnij>
      <div className="bistro-menu-glowa">
        <p className="bistro-overline">{copy.menu.overline}</p>
        <h2 className="bistro-tytul" id="bistro-menu-tytul">
          {copy.menu.tytul}
        </h2>
      </div>

      {/* Kafelki z kadrem na zdjęcie. Pozycja bez zdjęć pokazuje ikonę dania
          na jasnej powierzchni — wygląda na miejsce czekające na fotografię,
          a nie na zepsuty obrazek. */}
      <ul role="list" className="bistro-karty">
        {copy.menu.pozycje.map((poz, i) => (
          <li key={poz.nazwa} className="bistro-karta">
            <KadrDania
              zdjecia={poz.zdjecie ? [poz.zdjecie] : (ZDJECIA_MENU[i] ?? [])}
              ikona={IKONY_MENU[i]}
              etykietaDalej={copy.menu.nastepne}
            />
            <div className="bistro-karta-tresc">
              <span className="bistro-karta-nazwa">{poz.nazwa}</span>
              <span className="bistro-karta-opis">{poz.opis}</span>
              {/* Wiersz ceny pojawia się dopiero z prawdziwą ceną. */}
              {poz.cenaOd ? <span className="bistro-karta-cena">{poz.cenaOd}</span> : null}
            </div>
          </li>
        ))}
      </ul>

      {/* Dopoki `ADRES_MENU` jest kotwica do naglowka TEJ sekcji, przycisk
          prowadzilby sam do siebie — klikniecie przewija w gore, do listy,
          ktora gosc wlasnie przeczytal. Wroci sam w dniu, w ktorym obiekt
          przekaze karte dan i adres przestanie byc kotwica. */}
      {!ADRES_MENU.startsWith("#") && (
        <PrzyciskMenu etykieta={copy.hero.ctaMenu} wariant="glowny" />
      )}
    </section>
  );
}

/* --- Przyjedź z klasą -------------------------------------------------------- */
function SekcjaKlasa({ copy }: { copy: BistroCopy }) {
  return (
    <section className="bistro-shell bistro-para" aria-labelledby="bistro-klasa-tytul" data-ujawnij>
      <div className="bistro-para-tekst">
        {/* Druga czesc naglowka idzie w turkusie — ten sam zabieg co w hero.
            Podzial siedzi w TEKSTACH, a nie w kodzie, bo miejsce zlamania jest
            inne w kazdym jezyku, a spacja przed akcentem nalezy do pierwszej
            czesci (inaczej znika przy zawijaniu wiersza). */}
        <h2 className="bistro-tytul" id="bistro-klasa-tytul">
          {copy.klasa.tytul}
          <span className="bistro-akcent">{copy.klasa.tytulAkcent}</span>
        </h2>
        <p className="bistro-lead">{copy.klasa.copy}</p>
      </div>

      <figure className="bistro-para-foto">
        <picture>
          <source media="(max-width: 767px)" srcSet={FOTO.klasa.male} />
          <img
            src={FOTO.klasa.duze}
            alt={copy.alt.klasa}
            width={1100}
            height={1467}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </figure>
    </section>
  );
}

/* --- Bistro nie tylko dla odwiedzających ------------------------------------ */
function SekcjaPodroz({ copy }: { copy: BistroCopy }) {
  return (
    <section
      className="bistro-shell bistro-para is-odwrocona"
      aria-labelledby="bistro-podroz-tytul"
      data-ujawnij
    >
      <figure className="bistro-para-foto">
        <picture>
          <source media="(max-width: 767px)" srcSet={FOTO.podroz.male} />
          <img
            src={FOTO.podroz.duze}
            alt={copy.alt.podroz}
            width={1366}
            height={1024}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </figure>

      <div className="bistro-para-tekst">
        <h2 className="bistro-tytul" id="bistro-podroz-tytul">
          {copy.podroz.tytul}
          <span className="bistro-akcent">{copy.podroz.tytulAkcent}</span>
        </h2>
        <p className="bistro-lead">{copy.podroz.copy}</p>

        <p className="bistro-wyroznienie">
          <SolarIcon name="check-circle" size="1.15em" weight="fill" />
          {copy.podroz.wyroznienie}
        </p>

        {/* Nawigacja celuje w nazwę i adres, nie we współrzędne — mapy radzą
            sobie z tym lepiej. Ten sam cel co przyciski na /jak-dojechac. */}
        <a
          className="bistro-przycisk-glowny"
          href={linkTrasy()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SolarIcon name="navigation" size="1.05em" />
          {copy.podroz.cta}
        </a>
        <p className="bistro-adres">{copy.podroz.adres}</p>
      </div>
    </section>
  );
}

/* --- Godziny otwarcia -------------------------------------------------------- */
function SekcjaGodziny({ copy }: { copy: BistroCopy }) {
  return (
    <section
      className="bistro-shell bistro-godziny-sekcja"
      aria-labelledby="bistro-godziny-tytul"
      data-ujawnij
    >
      {/* Nazwa musi siedziec na `<section>`, nie na `<div>`: zwykly div ma role
          `generic`, dla ktorej ARIA zabrania nazwy — przegladarka ja odrzucala,
          a sekcja godzin jako jedyna nie trafiala na liste obszarow. */}
      <div className="bistro-godziny">
        <span className="bistro-godziny-ikona" aria-hidden="true">
          <SolarIcon name="clock" size="1.5em" />
        </span>
        <h2 className="bistro-godziny-tytul" id="bistro-godziny-tytul">
          {copy.godziny.tytul}
        </h2>
        <p className="bistro-godziny-dni">{copy.godziny.dni}</p>
        <p className="bistro-godziny-zakres">{copy.godziny.zakres}</p>
      </div>

      <img
        className="bistro-godziny-alver"
        src={ALVER.duzy}
        srcSet={`${ALVER.maly} 560w, ${ALVER.duzy} 900w`}
        sizes="(max-width: 767px) 46vw, 13rem"
        alt={copy.alt.alver}
        width={900}
        height={1145}
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}

/* --- Galeria ------------------------------------------------------------------
   Sześć kadrów, bez podglądu na klik: to pas poglądowy, a nie osobna galeria.
   Pełna galeria obiektu ma własną podstronę. */
/* Galeria jako przewijany pas, a nie siatka — ta sama mechanika co „W okolicy"
   na /jak-dojechac: palcem na telefonie, strzałkami od tabletu. Dzięki temu
   kadry mogą być znacznie większe, bo nie muszą zmieścić się wszystkie naraz.

   Krok przewijania liczymy z PRAWDZIWEJ szerokości kafelka, a nie ze stałej:
   kafelek jest procentem okna, więc każda stała rozjeżdżałaby się z nim na
   innej szerokości ekranu. */
function SekcjaGaleria({ copy }: { copy: BistroCopy }) {
  const pas = useRef<HTMLUListElement | null>(null);

  const przesun = (kierunek: 1 | -1) => {
    const el = pas.current;
    if (!el) return;
    const kadr = el.querySelector<HTMLElement>(".bistro-galeria-kadr");
    const krok = kadr ? kadr.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: krok * kierunek, behavior: "smooth" });
  };

  return (
    <section className="bistro-galeria" aria-labelledby="bistro-galeria-tytul" data-ujawnij>
      <div className="bistro-shell bistro-galeria-glowa">
        <div>
          <h2 className="bistro-tytul" id="bistro-galeria-tytul">
            {copy.galeria.tytul}
          </h2>
        </div>

        <div className="bistro-galeria-sterowanie">
          <button
            type="button"
            className="bistro-galeria-strzalka"
            aria-label={copy.galeria.poprzednie}
            onClick={() => przesun(-1)}
          >
            <SolarIcon name="arrow-left" size="1.15em" />
          </button>
          <button
            type="button"
            className="bistro-galeria-strzalka"
            aria-label={copy.galeria.nastepne}
            onClick={() => przesun(1)}
          >
            <SolarIcon name="arrow-right" size="1.15em" />
          </button>
        </div>
      </div>

      <ul role="list" className="bistro-galeria-pas" ref={pas}>
        {GALERIA.map((src, i) => (
          <li key={src} className="bistro-galeria-kadr">
            <img
              src={src}
              alt={copy.alt.galeria[i]}
              width={760}
              height={570}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --- FAQ ----------------------------------------------------------------------
   Pytania są zarazem treścią dla gościa i dla wyszukiwarki — stąd pełne zdania
   w pytaniach, a nie hasła. */
function SekcjaFaq({ copy }: { copy: BistroCopy }) {
  return (
    <section className="bistro-shell bistro-faq" aria-labelledby="bistro-faq-tytul" data-ujawnij>
      <h2 className="bistro-tytul" id="bistro-faq-tytul">
        {copy.faq.tytul}
      </h2>

      <div className="bistro-faq-lista">
        {copy.faq.pytania.map((p) => (
          <Rozwijane key={p.pytanie} prefiks="bistro" etykieta={p.pytanie} wariant="wiersz">
            <p className="bistro-faq-odpowiedz">{p.odpowiedz}</p>
          </Rozwijane>
        ))}
      </div>
    </section>
  );
}

export default function BistroPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = BISTRO_COPY[loc] ?? BISTRO_COPY.pl;
  useUjawnianie(".bistro-page");

  return (
    <main className="bistro-page">
      <Hero copy={copy} loc={loc} />

      <BanerHero copy={copy} />

      <SekcjaMenu copy={copy} />

      {/* Obie sekcje stoją na jednym granatowym pasie na pełną szerokość okna —
          ten sam zabieg, co „W okolicy" na /jak-dojechac. Jasna strona dostaje
          jedno ciemne wcięcie, które oddziela kartę dań od godzin i galerii,
          a sekcje zachowują `.bistro-shell`, więc treść zostaje w tej samej
          linii co reszta strony. */}
      <div className="bistro-pas">
        <SekcjaKlasa copy={copy} />
        <SekcjaPodroz copy={copy} />
      </div>

      <SekcjaGodziny copy={copy} />
      <SekcjaGaleria copy={copy} />
      <SekcjaFaq copy={copy} />
    </main>
  );
}
