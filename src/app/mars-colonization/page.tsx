"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";

import "./mars.css";
import "./humanoidy.css";
import { SolarIcon, type SolarIconName } from "@/app/components/SolarIcon";
import { useI18n } from "@/app/i18n-provider";
import { useUjawnianie } from "@/app/components/useUjawnianie";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import { submitLead } from "@/lib/leads";
import { MARS_COPY, type MarsCopy } from "./marsCopy";
import { KrokiTasma } from "./KrokiTasma";
import { KliszaHero } from "./KliszaHero";
import { DlaKogo } from "./DlaKogo";
import { Ekosystem } from "./Ekosystem";
import { TekstNaglowka } from "./Naglowek";
import { PostepSceny } from "./PostepSceny";
import { przewinDo } from "./przewin";

/* --- Materiał zdjęciowy -------------------------------------------------------
   Zdjęcia są PRAWDZIWE — to instalacja Mars pod kopułami Alvernia Planet,
   a nie wizualizacje. Wariantów nie policzy żaden krok budowania: projekt ma
   `images.unoptimized: true` (eksport statyczny), więc `next/image` nie
   przelicza niczego, a `srcSet` jest wpisany wprost. Robi je
   `media-src/mars-colonization/warianty.py` — po podmianie materiału trzeba
   go uruchomić ręcznie.

   Humanoid w sekcji „Real humanoids" to wycinek dostarczony przez obiekt
   05.10.2026 (`roboty/`) — do tego dnia sekcja stała na samej typografii
   i liczbie, bo materiału nie było. */
/* Pliki leżą w `public/mars-colonization/` w folderach NAZWANYCH OD SEKCJI,
   w której są użyte — przy podmianie zdjęcia od razu widać, gdzie ono stoi
   na stronie. Warianty szerokości robi `media-src/mars-colonization/warianty.py`
   i zapisuje je do tych samych folderów. */
const FOTO = {
  /* Materiał hero dostarczony przez obiekt: marsjański krajobraz i wycięty
     humanoid. To DWA osobne pliki i mają takie zostać — tło jest scenografią,
     robot bohaterem, a rozdzielenie pozwala przesuwać go i skalować niezależnie
     od kadru. */
  krajobraz: "/mars-colonization/hero/krajobraz",
  humanoid: "/mars-colonization/hero/humanoid",
  /* Klisza filmowa w dole hero ma własną listę kadrów — `KliszaHero.tsx`. */
  /* Tło sekcji „Rok 2035": kosmos z Drogą Mleczną i planetą. */
  tlo2035: "/mars-colonization/rok-2035/tlo-rok-2035",
  /* Kadr sekcji „Rok 2035": robot obserwujący przygotowaną bazę. */
  kolonia2035: "/mars-colonization/rok-2035/kolonia",
  /* Ręka robota z otwartą dłonią pod osią 2031 → 2033 (wycinek z alfą). */
  reka: "/mars-colonization/rok-2035/reka",
  habitat: "/mars-colonization/b2b/habitat-wnetrze",
  /* Humanoid sekcji „Real humanoids" (wycinek z alfą, materiał obiektu)
     i tło jego karty: moduł habitatu pod kopułą w turkusowej mgle (MARS_1). */
  robot: "/mars-colonization/roboty/robot",
  tloRobota: "/mars-colonization/roboty/modul-w-mgle",
} as const;

/** Ścieżka do wariantu o danej szerokości. */
function wariant(baza: string, szerokosc: number): string {
  return `${baza}-${szerokosc}.webp`;
}

/* Prawdziwy `srcSet` z deskryptorami `w`, a nie łańcuch elementów `<source>`
   z progami `media`. Dwa powody:
   1. `sizes` DZIAŁA tylko razem z deskryptorami — przy samych `<source>`
      przeglądarka go parsuje i wyrzuca, więc nie ma jak jej powiedzieć,
      ile miejsca obraz naprawdę zajmuje;
   2. progi `media` ignorują gęstość ekranu, więc telefon o gęstości 2 dostawał
      wariant 800 px na kadr, który rysuje 780 px fizycznych pikseli.
   Przy `w` przeglądarka sama mnoży przez gęstość i wybiera właściwy plik. */
function zestaw(baza: string, szerokosci: ReadonlyArray<number>): string {
  return szerokosci.map((w) => `${wariant(baza, w)} ${w}w`).join(", ");
}

/* Data startu misji z briefu. POCZĄTEK DOBY, nie konkretna godzina: brief podaje
   wyłącznie dzień (02.01.2027), a odliczanie celujące w 10:00 ogłaszałoby
   publicznie godzinę otwarcia, której nikt nie potwierdził — ten sam zakaz, co
   w komentarzu nad tekstami. Liczymy w strefie Europe/Warsaw (+01:00 w styczniu),
   a nie w strefie przeglądarki, żeby licznik pokazywał to samo gościowi
   w Krakowie i w Lizbonie. */
const START_MISJI = new Date("2027-01-02T00:00:00+01:00").getTime();

/* Nazwa partnera z briefu („ALVERNIA PLANET × [PARTNER] PRESENT") NIE została
   podana. Dopóki jest pusta, wiersz renderuje się bez niej — zamiast zostawiać
   gościom nawias z nazwą zmiennej. */
const PARTNER = "";

/* Ikony pięciu zasobów misji („Rok 2035"). Kolejność idzie za
   `copy.rok2035.zasoby`: woda, tlen, żywność, energia, schronienie.
   Kroplę, wiatr i sześciokąt dopisano do mapy `SolarIcon` z tej samej paczki
   Phosphor, która jest już w projekcie — nie doszła żadna nowa biblioteka. */
const IKONY_ZASOBOW: SolarIconName[] = ["drop", "wind", "leaf", "bolt", "hexagon"];

/* Zdjęcie sekcji „Rok 2035" (robot przed bazą) — WYŁĄCZONE NA RAZIE
   (05.10.2026): sekcja stoi wyśrodkowana, bez fotografii. `true` przywraca
   poprzednią kompozycję w całości: zdjęcie po prawej, kolumna tekstu po
   lewej (reguły `.mars-2035.ze-zdjeciem` w arkuszu czekają). */
const POKAZ_ZDJECIE_2035 = false;

/* Tło sekcji „Rok 2035" (kosmos z Drogą Mleczną i planetą) — WYŁĄCZONE
   (05.10.2026, decyzja obiektu): sekcja stoi na samym granacie z reguły
   `.mars-2035` — gradient, dwie poświaty i siatka techniczna zostają.
   `true` przywraca fotografię; jej reguły (`.mars-2035-tlo`) czekają
   w arkuszu, a pliki w `public/mars-colonization/rok-2035/`. */
const POKAZ_TLO_2035 = false;

/* Logo AGIBOT w wersji negatywowej. Warianty robi `warianty.py` z oryginału
   w `media-src/mars-colonization/zrodla/agibot-logo.webp`. */
const LOGO_AGIBOT = "/mars-colonization/logo-agibot/agibot-negatyw";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* --- Pasek interfejsu misji ---------------------------------------------------
   Powtarzalny element z briefu (sekcja 13): ma czytać się jak terminal misji.
   Etykiety zostają po angielsku we wszystkich językach — to scenografia, nie
   zdanie do przetłumaczenia; tłumaczone są wyłącznie wartości niosące treść. */
function PasekMisji({ copy, wariantPaska }: { copy: MarsCopy; wariantPaska?: "finalowy" }) {
  const pozycje: Array<[string, string]> = [
    ["MISSION", copy.hud.misja],
    ["STATUS", copy.hud.status],
    ["COLONY INSPECTORS", copy.hud.inspektorzy],
    ["PRE-SALE", copy.hud.przedsprzedaz],
    ["HUMAN ARRIVAL", copy.hud.przybycie],
  ];
  return (
    <ul
      role="list"
      className={wariantPaska ? "mars-hud is-finalowy" : "mars-hud"}
      /* Konieczne od Chrome 127: kontener z `overflow-x: auto` jest domyślnie
         fokusowalny, a element z `aria-hidden` w ścieżce tabulacji to błąd —
         czytnik ekranu zatrzymuje się na czymś, czego nie umie odczytać. */
      tabIndex={-1}
      /* Pasek jest scenografią, a nie treścią: wszystko, co niesie, powtarzają
         nagłówek i sekcja finałowa. Czytnik ekranu dostałby tu dziesięć
         skrótów bez kontekstu. */
      aria-hidden="true"
    >
      {pozycje.map(([klucz, wartosc]) => (
        <li key={klucz}>
          <span className="mars-hud-klucz">{klucz}</span>
          <span className="mars-hud-wartosc">
            {wartosc}
            {/* Stan misji „wczytuje się": trzy kropki odsłaniane po kolei
                i obracający się radar za nimi (animacje w arkuszu). Przy
                „ogranicz ruch" stoją w miejscu. */}
            {klucz === "STATUS" && <span className="mars-hud-kropki">...</span>}
            {klucz === "STATUS" && <span className="mars-hud-radar" />}
          </span>
        </li>
      ))}
      {/* Logo producenta humanoidów — tylko w pasku hero, za stanem misji.
          Wersja NEGATYWOWA: w oryginale napis jest ciemnoszary i na ciemnym
          kadrze ginął; znak zostaje w swoim gradiencie. Pozycja stoi na
          KOŃCU listy, bo reguły paska rozstawiają pięć pierwszych pozycji po
          numerach (`nth-child`). */}
      {!wariantPaska && (
        <li className="mars-hud-logo">
          <img
            src={`${LOGO_AGIBOT}-240.webp`}
            srcSet={`${LOGO_AGIBOT}-240.webp 240w, ${LOGO_AGIBOT}-480.webp 480w`}
            /* Najszerzej 7.25rem (116 px) na desktopie — przy gęstości 2
               przeglądarka bierze 480, przy 1 wystarcza 240. */
            sizes="(min-width: 1024px) 7.25rem, 6rem"
            alt="AGIBOT"
            width={480}
            height={100}
            decoding="async"
          />
        </li>
      )}
    </ul>
  );
}

/* --- Hero ---------------------------------------------------------------------
   Jedna fotografia na pełny ekran, pod paskiem nawigacji. Pasek jest
   „sticky", więc ZAJMUJE miejsce nad nagłówkiem — wciągamy go ujemnym
   marginesem i oddajemy tę samą wartość w dopełnieniu (patrz `--ms-naglowek`
   w arkuszu). Wysokość paska jest ZMIERZONA, nie policzona. */
/* Korzeniem hero jest `<section>`, a NIE `<header>`: wewnątrz `<main>` nagłówek
   ma rolę `generic`, dla której ARIA zabrania nazwy — przeglądarka odrzucała
   `aria-labelledby` po cichu i hero jako jedyny blok nie trafiał na listę
   obszarów. Ta sama pułapka jest opisana w `bistro/page.tsx`. */
function Hero({ copy }: { copy: MarsCopy }) {
  return (
    <section className="mars-hero" aria-labelledby="mars-hero-tytul">
      <div className="mars-hero-foto">
        <img
          src={wariant(FOTO.krajobraz, 1671)}
          srcSet={zestaw(FOTO.krajobraz, [800, 1200, 1671])}
          /* Kadr jest tłem nagłówka na pełną szerokość okna. UWAGA: materiał ma
             natywne 1671 px, więc na szerszym oknie przeglądarka go rozciąga —
             przy fotografii pod warstwami przyciemnień jest to niewidoczne,
             ale szerszego pliku po prostu nie mamy. */
          sizes="100vw"
          alt={copy.alt.hero}
          width={1671}
          height={941}
          /* Największy element kadru — bez `loading`, z wysokim priorytetem.
             `loading="lazy"` zepsułoby tu pomiar LCP. */
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Humanoid jest OSOBNĄ warstwą nad kadrem, a nie częścią fotografii —
          dzięki temu można go przesuwać, skalować i chować niezależnie od tła.
          Opis alternatywny pusty: postać nie niesie informacji, której nie ma
          w nagłówku i w sekcji „Real humanoids", a jej opisywanie dublowałoby
          treść czytnikowi ekranu. */}
      <div className="mars-hero-humanoid" aria-hidden="true">
        <img
          src={wariant(FOTO.humanoid, 988)}
          srcSet={zestaw(FOTO.humanoid, [500, 760, 988])}
          /* Miara z arkusza, trzy pasma — i ani jedno nie jest zgadywane:
             od 1024 px szerokość bierze się z WYSOKOŚCI (`clamp(…, 58rem)`),
             więc na piksele wychodzi najwyżej 576 px i tyle tu stoi; podanie
             tam vw kazałoby przeglądarce pobierać plik pod 46% okna 1920,
             czyli dwa razy większy, niż cokolwiek się wyświetli.
             768–1023 px to 62vw, poniżej 72vw — dokładnie szerokości
             z arkusza (`.mars-hero-humanoid`). Wcześniej stało tu 58vw
             i 94vw po starszym układzie; na wybór pliku dziś to nie wpływało,
             ale przy każdej zmianie progów kłamałoby przeglądarce. */
          sizes="(min-width: 1024px) 576px, (min-width: 768px) 62vw, 72vw"
          alt=""
          width={988}
          height={1592}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Klisza filmowa z kadrami z instalacji. Warstwa POD postacią (robot
          ją przesłania, nie odwrotnie) i nad przesłoną zdjęcia — kolejność
          warstw i geometria w arkuszu przy `.mars-klisza`. Ozdoba: kadry
          nie niosą treści, której nie ma niżej na stronie. */}
      <KliszaHero />

      <div className="mars-shell mars-hero-tresc">
        <PasekMisji copy={copy} />

        <p className="mars-hero-nadtytul">
          {PARTNER
            ? `${copy.hero.nadtytulMarka} × ${PARTNER} ${copy.hero.nadtytulCzasownik}`
            : `${copy.hero.nadtytulMarka} ${copy.hero.nadtytulCzasownik}`}
        </p>

        <h1 className="mars-hero-tytul" id="mars-hero-tytul">
          {/* Nazwa produktu rozbita na DWA elementy, bo na telefonie oba słowa
              mają różny stopień pisma. Podział liczony z treści (pierwsza
              spacja), a nie wpisany na sztywno — przy zmianie nazwy nic się
              nie rozjedzie. Łamanie wiersza nadal wymusza miara kolumny,
              nie znacznik. */}
          <span className="mars-hero-tytul-glowny">
            <span className="mars-tytul-a">{copy.hero.tytul.split(" ")[0]}</span>{" "}
            <span className="mars-tytul-b">{copy.hero.tytul.split(" ").slice(1).join(" ")}</span>
          </span>
          <span className="mars-hero-tytul-drugi">{copy.hero.podtytul}</span>
        </h1>

        <p className="mars-hero-haslo">
          <strong>{copy.hero.haslo1}</strong>
          <span>{copy.hero.haslo2}</span>
        </p>

        <ul role="list" className="mars-daty">
          <li>
            <span className="mars-daty-etykieta">{copy.hero.dataPrzedsprzedazy.etykieta}</span>
            <span className="mars-daty-wartosc">{copy.hero.dataPrzedsprzedazy.wartosc}</span>
          </li>
          <li>
            <span className="mars-daty-etykieta">{copy.hero.dataMisji.etykieta}</span>
            <span className="mars-daty-wartosc">{copy.hero.dataMisji.wartosc}</span>
          </li>
          {/* Cała wystawa trwa TYLKO 3 MIESIĄCE — trzecia karta, a nie dopisek:
              czas trwania ma tę samą wagę co obie daty (decyzja obiektu
              05.10.2026, „trzeba to dobrze zakomunikować"). Od 1024 px stoi
              w rzędzie z datami, poniżej — pasek na całą szerokość pod nimi,
              tuż nad przyciskiem zapisu (arkusz). */}
          <li className="mars-daty-czas">
            <span className="mars-daty-etykieta">
              <SolarIcon name="clock" size="1.15em" className="mars-daty-czas-ikona" />
              {copy.hero.czasWystawy.etykieta}
            </span>
            <span className="mars-daty-wartosc">{copy.hero.czasWystawy.wartosc}</span>
          </li>
        </ul>

        <div className="mars-hero-akcje">
          {/* Przycisk, a nie kotwica: formularz stoi na tej samej stronie,
              w finale, ale adres strony ma zostać czysty (patrz `przewinDo`). */}
          <button type="button" className="mars-przycisk-glowny" onClick={() => przewinDo("zapis")}>
            <SolarIcon name="bell" size="1.05em" />
            {/* Etykieta w osobnym elemencie, bo przycisk jest na telefonie
                trójdzielny: dzwonek z lewej, napis na środku, strzałka z prawej.
                Goły węzeł tekstowy nie da się rozciągnąć w siatce flex. */}
            <span className="mars-cta-etykieta">{copy.hero.cta}</span>
            <SolarIcon name="arrow-right" size="1em" className="mars-cta-strzalka" />
          </button>
          <button type="button" className="mars-przycisk-drugi" onClick={() => przewinDo("misja")}>
            {copy.hero.ctaDrugi}
            <SolarIcon name="arrow-down" size="1em" />
          </button>
        </div>
      </div>

      <LukPrzejscia />
    </section>
  );
}

/* Łuk przejścia hero → ciemna sekcja. Ten sam kształt co na /jak-dojechac
   i /bistro, żeby landing czytał się jako część tego samego serwisu. */
function LukPrzejscia() {
  return (
    <svg
      className="mars-fala"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="mars-fala-ksztalt"
        d="M0,20 C300,2 520,64 760,78 C1020,92 1240,36 1440,46 L1440,96 L0,96 Z"
      />
      <path
        className="mars-orbita"
        vectorEffect="non-scaling-stroke"
        d="M0,8 C300,-10 520,52 760,66 C1020,80 1240,24 1440,34"
      />
    </svg>
  );
}

/** Dzieli tekst na część zwykłą i wyróżnioną końcówkę. Spacja zostaje przy
 *  części zwykłej, więc łamanie wiersza działa jak w zwykłym zdaniu. Gdy
 *  końcówka nie pasuje (literówka w tłumaczeniu), tekst idzie w całości bez
 *  wyróżnienia — zamiast uciąć zdanie w złym miejscu. */
function odetnijAkcent(tekst: string, akcent: string): [string, string] {
  if (!akcent || !tekst.endsWith(akcent)) return [tekst, ""];
  return [tekst.slice(0, tekst.length - akcent.length), akcent];
}

/* --- Rok 2035 -----------------------------------------------------------------
   Sekcja narracyjna na ciemnym granacie, zaraz po hero. Trzy warstwy i nic
   więcej: HISTORIA (rok → roboty przybyły pierwsze → po co) → CELE MISJI
   (pięć zasobów) → OŚ 2031 → 2033. Na osi sekcja się kończy — bez panelu
   z pytaniem i bez dodatkowych akapitów.

   Akcent kolorystyczny nagłówka podają teksty (`tytulAkcent`). Wcześniej brał
   się z ostatniego słowa, ale chiński nie ma spacji — cały tytuł był wtedy
   jednym „słowem" i szedł w czerwień.

   `data-ujawnij` stoi na DWÓCH blokach wewnątrz, a nie na sekcji: sekcja jest
   ciemna i leży tuż pod ciemnym hero, więc zanikanie całości odsłaniałoby
   jasne tło strony — pod falą błyskałby biały pas. Tło zostaje na miejscu,
   wchodzi tylko treść. */
function SekcjaRok2035({ copy }: { copy: MarsCopy }) {
  const [tytul, akcentTytulu] = odetnijAkcent(copy.rok2035.tytul, copy.rok2035.tytulAkcent);

  return (
    <section
      className={POKAZ_ZDJECIE_2035 ? "mars-2035 mars-ciemny ze-zdjeciem" : "mars-2035 mars-ciemny"}
      aria-labelledby="mars-2035-tytul"
    >
      {/* Tło sekcji: kosmos z Drogą Mleczną i planetą. Osobna warstwa, a nie
          `background-image`, bo ma `srcSet` (telefon nie pobiera wersji
          1671 px) i ładuje się leniwie — sekcja stoi pod zgięciem. Nakładka
          w arkuszu (`::after`) wtapia górę w falę hero i przyciemnia środek
          pod tekstem. Wyłączone flagą `POKAZ_TLO_2035` — sekcja stoi na
          samym granacie. */}
      {POKAZ_TLO_2035 && (
        <div className="mars-2035-tlo" aria-hidden="true">
          <img
            src={wariant(FOTO.tlo2035, 1200)}
            srcSet={zestaw(FOTO.tlo2035, [800, 1200, 1671])}
            sizes="100vw"
            alt=""
            width={1671}
            height={941}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      {/* Historia: kolumna tekstu po lewej, fotografia wchodząca w prawą część
          kadru i wygaszająca się w granat. */}
      <div className="mars-2035-scena" data-ujawnij>
        {POKAZ_ZDJECIE_2035 && (
        <figure className="mars-2035-foto">
          <img
            src={wariant(FOTO.kolonia2035, 1919)}
            srcSet={zestaw(FOTO.kolonia2035, [800, 1200, 1919])}
            /* Od 1024 px zdjęcie zajmuje prawą część okna (od 30% szerokości
               szyny do krawędzi), czyli ok. 65% okna; niżej idzie na całą
               szerokość. */
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={copy.alt.kolonia2035}
            width={1919}
            height={1091}
            loading="lazy"
            decoding="async"
          />
          {/* Scenografia transmisji z bazy. Etykiety zostają po angielsku we
              wszystkich językach — tak samo jak pasek misji w nagłówku. */}
          <figcaption className="mars-2035-hud" aria-hidden="true">
            <span>Mars base 01</span>
            <span>Sol 1021</span>
            <span>Camera A7</span>
          </figcaption>
        </figure>
        )}

        <div className="mars-shell mars-2035-uklad">
          <div className="mars-2035-tresc">
            <p className="mars-overline">{copy.rok2035.overline}</p>
            {/* Dwa wiersze: „Roboty przybyły" i większe „pierwsze." pod spodem.
                `data-tekst` zasila kopie każdego wiersza w efekcie zakłóceń —
                rysuje je arkusz (`::before`/`::after`), więc w HTML tekst stoi
                tylko raz. Spacja na końcu pierwszego wiersza (z `odetnijAkcent`)
                zostaje w tekście, żeby nazwa nagłówka czytała się
                „Roboty przybyły pierwsze.", a nie „przybyłypierwsze.". */}
            <h2 className="mars-tytul mars-2035-tytul" id="mars-2035-tytul">
              <span className="mars-rozszczepienie mars-2035-tytul-wiersz" data-tekst={tytul.trim()}>
                {tytul}
              </span>
              <span className="mars-rozszczepienie mars-2035-akcent" data-tekst={akcentTytulu}>
                {akcentTytulu}
              </span>
            </h2>
            <p className="mars-lead mars-2035-lead">{copy.rok2035.akapit1}</p>
            <p className="mars-zadanie">{copy.rok2035.zadanie}</p>
          </div>
        </div>
      </div>

      {/* Cele misji i oś czasu — osobny blok ujawniania, żeby wchodziły dopiero,
          gdy gość do nich dojedzie, a nie razem z nagłówkiem. */}
      <div className="mars-shell mars-2035-dol" data-ujawnij>
        <div className="mars-cele">
          <p className="mars-cele-etykieta">Mission objectives</p>
          <ol role="list" className="mars-cele-lista">
            {copy.rok2035.zasoby.map((zasob, i) => (
              <li key={zasob}>
                <span className="mars-cel-numer">{String(i + 1).padStart(2, "0")}</span>
                <SolarIcon name={IKONY_ZASOBOW[i]} size="1.2em" className="mars-cel-ikona" />
                <span className="mars-cel-nazwa">{zasob}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Oś w trzech punktach: 2026 (dziś — pierwsze prototypy), 2031
            (lądują humanoidy), 2033 (ludzie). 2031 i 2033 to lata okien
            startowych na Marsa — wtedy przelot jest możliwy ze względu na
            odległość i układ planet (decyzja obiektu 05.10.2026; wcześniej
            2032 i 2035). Nadtytuł sekcji („Rok 2033") i „dwa lata wcześniej"
            w akapicie idą za tą osią — zmiana roku wymaga zmiany wszystkich
            trzech. Identyfikatory (`rok2035`, `.mars-2035`) zostały stare.
            Podpisy po angielsku jak cała scenografia misji. */}
        <div className="mars-os">
          <div className="mars-os-punkt is-poczatek">
            <span className="mars-os-rok">2026</span>
            <span className="mars-os-opis">First prototypes</span>
          </div>
          <span className="mars-os-linia is-pierwsza" aria-hidden="true" />
          <div className="mars-os-punkt is-srodek">
            <span className="mars-os-rok">2031</span>
            <span className="mars-os-opis">Humanoids arrive</span>
          </div>
          <span className="mars-os-linia" aria-hidden="true" />
          <div className="mars-os-punkt is-cel">
            <span className="mars-os-rok">2033</span>
            <span className="mars-os-opis">Humans arrive</span>
          </div>
        </div>
      </div>

      {/* Ręka robota z otwartą dłonią — domyka oś: roboty przygotowały
          planetę i „podają" ją ludziom. Poza szyną treści, bo ramię jest na
          pliku ucięte z lewej i musi wchodzić od krawędzi okna. Ozdoba, więc
          pusty opis i `aria-hidden`. */}
      <figure className="mars-2035-reka" data-ujawnij aria-hidden="true">
        <img
          src={wariant(FOTO.reka, 1200)}
          srcSet={zestaw(FOTO.reka, [800, 1200, 1875])}
          sizes="(min-width: 1024px) min(62vw, 72rem), 98vw"
          alt=""
          width={1875}
          height={472}
          loading="lazy"
          decoding="async"
        />
      </figure>
    </section>
  );
}

/* --- Pisanie litera po literze -------------------------------------------------
   Tekst „wpisuje się" na ekranie. Każda litera to osobny element z własnym
   opóźnieniem animacji (`--i` × tempo, liczone w arkuszu), a kursor wisi na
   literze, która właśnie się pojawiła.

   - Wszystkie litery od początku ZAJMUJĄ swoje miejsce (są tylko
     przezroczyste), więc wiersze łamią się od razu tak jak na końcu i nic
     pod spodem nie skacze w trakcie pisania.
   - Litery są `aria-hidden`, a pełne zdanie stoi obok w elemencie
     niewidocznym na ekranie: czytnik ekranu i wyszukiwarka dostają zdanie
     od razu, nie literę po literze.
   - Przy „ogranicz ruch" animacje gasi arkusz i tekst po prostu stoi.

   `startMs` — kiedy ruszyć (od wejścia sekcji w kadr), `krokMs` — tempo,
   `kursorDoMs` — jak długo kursor czeka na ostatniej literze (pauza przed
   następnym krokiem sceny); `kursorMruga` — kursor mruga na końcu. */
function Pisanie({
  tekst,
  startMs,
  krokMs,
  kursorDoMs,
  kursorMruga = false,
}: {
  tekst: string;
  startMs: number;
  krokMs: number;
  kursorDoMs: number;
  kursorMruga?: boolean;
}) {
  const litery = Array.from(tekst);
  return (
    <>
      <span className="mars-niewidoczny">{tekst}</span>
      <span
        className="mars-pisane"
        aria-hidden="true"
        style={
          {
            "--ms-pisanie-start": `${startMs}ms`,
            "--ms-pisanie-krok": `${krokMs}ms`,
          } as CSSProperties
        }
      >
        {litery.map((litera, i) => (
          <span
            key={i}
            className={
              i === litery.length - 1
                ? kursorMruga
                  ? "mars-litera is-ostatnia is-mruga"
                  : "mars-litera is-ostatnia"
                : "mars-litera"
            }
            style={
              i === litery.length - 1
                ? ({ "--i": i, "--ms-kursor-czas": `${kursorDoMs}ms` } as CSSProperties)
                : ({ "--i": i } as CSSProperties)
            }
          >
            {litera}
          </span>
        ))}
      </span>
    </>
  );
}

/* Scena z zaprzeczeniem („Czym jest", „Real humanoids"): najpierw wpisuje się
   zaprzeczenie, potem przekreśla je czerwona kreska, a na końcu wchodzi
   właściwy nagłówek — tym samym rozszczepieniem barw co każdy nagłówek strony
   (`TekstNaglowka`; do 05.10.2026 nagłówek też się wpisywał). Czasy w jednym
   miejscu, bo każdy krok zaczyna się tam, gdzie kończy poprzedni. */
const PISANIE = {
  start: 350,
  krokZaprzeczenia: 42,
  pauzaPrzedKreska: 380,
  kreska: 480,
  pauzaPrzedTytulem: 260,
  /* Reszta sceny rusza, gdy nagłówek jest już prawie na miejscu — jego
     wejście trwa 675 ms (`--ms-naglowek-wejscie` w arkuszu). */
  tytulDoAkapitow: 450,
  /* Wejście akapitów — MUSI zgadzać się z `.mars-po-pisaniu` w `mars.css`
     (700 ms); z niego licznik sceny liczy jej koniec. */
  akapity: 700,
} as const;

function czasySceny(zaprzeczenie: string) {
  const zaprzeczenieKoniec =
    PISANIE.start + Array.from(zaprzeczenie).length * PISANIE.krokZaprzeczenia;
  const kreskaStart = zaprzeczenieKoniec + PISANIE.pauzaPrzedKreska;
  const tytulStart = kreskaStart + PISANIE.kreska + PISANIE.pauzaPrzedTytulem;
  const akapityStart = tytulStart + PISANIE.tytulDoAkapitow;
  return {
    kreskaStart,
    tytulStart,
    akapityStart,
    /* Koniec całej sceny — długość paska postępu (`PostepSceny`). */
    koniec: akapityStart + PISANIE.akapity,
    /* Kursor czeka na ostatniej literze zaprzeczenia aż do wejścia nagłówka. */
    kursorDoMs: tytulStart - zaprzeczenieKoniec + PISANIE.krokZaprzeczenia,
  };
}

/* Zaprzeczenie sceny: wpisuje się litera po literze, a potem przekreśla je
   kreska (`.mars-zaprzeczenie.is-pisane` w arkuszu). */
function Zaprzeczenie({ tekst }: { tekst: string }) {
  const { kreskaStart, kursorDoMs } = czasySceny(tekst);
  return (
    <p
      className="mars-zaprzeczenie is-pisane"
      style={{ "--ms-kreska-start": `${kreskaStart}ms` } as CSSProperties}
    >
      <Pisanie
        tekst={tekst}
        startMs={PISANIE.start}
        krokMs={PISANIE.krokZaprzeczenia}
        kursorDoMs={kursorDoMs}
      />
    </p>
  );
}

/* --- Czym jest Mars Colonization ---------------------------------------------- */
/* `odtworzenie` to klucz animowanych elementów sceny: przycisk w pasku postępu
   podbija go o jeden, React montuje te elementy od nowa, a ich animacje CSS
   startują od zera (sekcja jest już ujawniona). */
function SekcjaCzym({ copy, loc }: { copy: MarsCopy; loc: Locale }) {
  const { tytulStart, akapityStart, koniec } = czasySceny(copy.czym.zaprzeczenie);
  const [odtworzenie, setOdtworzenie] = useState(0);

  return (
    <section className="mars-czym" aria-labelledby="mars-czym-tytul" data-ujawnij>
      <div className="mars-shell">
        <p className="mars-overline">{copy.czym.overline}</p>
        <Zaprzeczenie key={`zaprzeczenie-${odtworzenie}`} tekst={copy.czym.zaprzeczenie} />
        <h2 className="mars-tytul mars-czym-tytul" id="mars-czym-tytul">
          <TekstNaglowka key={odtworzenie} tekst={copy.czym.tytul} startMs={tytulStart} />
        </h2>
        {/* Akapity wchodzą dopiero po nagłówku — ostatni krok sceny. */}
        <div
          key={`akapity-${odtworzenie}`}
          className="mars-czym-tekst mars-po-pisaniu"
          style={{ "--ms-akapity-start": `${akapityStart}ms` } as CSSProperties}
        >
          <p className="mars-lead">{copy.czym.akapit1}</p>
          <p className="mars-lead">{copy.czym.akapit2}</p>
        </div>
        <PostepSceny
          czasMs={koniec}
          odtworzenie={odtworzenie}
          onOdtworz={() => setOdtworzenie((n) => n + 1)}
          etykieta={copy.scena.odtworz}
          loc={loc}
        />
      </div>
    </section>
  );
}

/* --- Twoja misja --------------------------------------------------------------- */
function SekcjaMisja({ copy }: { copy: MarsCopy }) {
  return (
    <section
      className="mars-misja mars-ciemny"
      aria-labelledby="mars-misja-tytul"
      data-cel-przewiniecia="misja"
      tabIndex={-1}
      data-ujawnij
    >
      <div className="mars-shell">
      {/* Status gościa stoi tuż nad nadtytułem, na osi sekcji, na każdej
          szerokości — jest częścią „Twojej misji", a nie osobnym widżetem
          (patrz arkusz). */}
      <p className="mars-odznaka">
        <span className="mars-odznaka-klucz">{copy.misja.statusEtykieta}</span>
        <span className="mars-odznaka-wartosc">{copy.misja.statusWartosc}</span>
      </p>

      <p className="mars-overline">{copy.misja.overline}</p>

      <h2 className="mars-tytul" id="mars-misja-tytul">
        <TekstNaglowka tekst={copy.misja.tytul} />
      </h2>

      <KrokiTasma copy={copy} />

      <p className="mars-pytanie">{copy.misja.pytanie}</p>
      </div>
    </section>
  );
}

/* --- Real humanoids ------------------------------------------------------------ */
/* Ta sama scena co „Czym jest" (zaprzeczenie → kreska → nagłówek → reszta),
   a obok KADR: karta ze zdjęciem kopuły, przed nią humanoid SIEDZĄCY NA
   karcie z liczbą robotów (prośba obiektu, 05.10.2026) i wychodzący głową
   ponad górną krawędź zdjęcia, za nimi cienki pierścień. Kadr wchodzi od
   razu z sekcją — gdyby czekał na koniec sceny, połowa sekcji stałaby pusta
   przez cztery sekundy pisania. Układ i ruch: `humanoidy.css`. */
function SekcjaHumanoidy({ copy, loc }: { copy: MarsCopy; loc: Locale }) {
  const { tytulStart, akapityStart, koniec } = czasySceny(copy.humanoidy.zaprzeczenie);
  /* Klucz animowanych elementów sceny — patrz `SekcjaCzym`. Zdjęcie karty
     klucza NIE dostaje: nic się na nim nie animuje, a ponowne montowanie
     obrazu mogłoby mignąć pustą kartą. */
  const [odtworzenie, setOdtworzenie] = useState(0);

  return (
    <section className="mars-humanoidy" aria-labelledby="mars-humanoidy-tytul" data-ujawnij>
      <div className="mars-shell mars-humanoidy-uklad">
        <div className="mars-humanoidy-tekst">
          <p className="mars-overline">{copy.humanoidy.overline}</p>
          <Zaprzeczenie key={`zaprzeczenie-${odtworzenie}`} tekst={copy.humanoidy.zaprzeczenie} />
          <h2 className="mars-tytul" id="mars-humanoidy-tytul">
            <TekstNaglowka key={odtworzenie} tekst={copy.humanoidy.tytul} startMs={tytulStart} />
          </h2>
          <div
            key={`akapity-${odtworzenie}`}
            className="mars-po-pisaniu"
            style={{ "--ms-akapity-start": `${akapityStart}ms` } as CSSProperties}
          >
            <p className="mars-lead">{copy.humanoidy.akapit}</p>
            <p className="mars-wyroznienie">
              <span>{copy.humanoidy.wyroznienie1}</span>
              <strong>{copy.humanoidy.wyroznienie2}</strong>
            </p>
          </div>
        </div>

        <div className="mars-humanoidy-kadr">
          <div className="mars-humanoidy-scena">
            <span key={`pierscien-${odtworzenie}`} className="mars-humanoidy-pierscien" aria-hidden="true" />
            {/* Tło karty: moduł habitatu pod kopułą — dekoracja, treść niesie robot. */}
            <span className="mars-humanoidy-karta" aria-hidden="true">
              <img
                src={wariant(FOTO.tloRobota, 800)}
                srcSet={zestaw(FOTO.tloRobota, [800, 1200, 1920])}
                sizes="(min-width: 1024px) min(40vw, 30rem), (min-width: 768px) 30rem, 86vw"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </span>
            {/* Robot SIEDZI na karcie z liczbą: oba stoją w jednym bloku, jeden
                pod drugim, więc stopy zawsze trafiają w górną krawędź karty —
                niezależnie od tego, w ilu wierszach łamie się jej opis. */}
            <div key={`cokol-${odtworzenie}`} className="mars-humanoidy-cokol">
              <img
                className="mars-humanoidy-robot"
                src={wariant(FOTO.robot, 720)}
                srcSet={zestaw(FOTO.robot, [480, 720, 960])}
                sizes="(min-width: 1024px) min(25vw, 19rem), (min-width: 768px) 19rem, 56vw"
                width={1034}
                height={1333}
                alt={copy.humanoidy.robotAlt}
                loading="lazy"
                decoding="async"
              />
              <p className="mars-licznik">
                <span className="mars-licznik-liczba">{copy.humanoidy.liczba}</span>
                <span className="mars-licznik-opis">{copy.humanoidy.liczbaOpis}</span>
              </p>
            </div>
          </div>
        </div>

        <PostepSceny
          czasMs={koniec}
          odtworzenie={odtworzenie}
          onOdtworz={() => setOdtworzenie((n) => n + 1)}
          etykieta={copy.scena.odtworz}
          loc={loc}
        />
      </div>
    </section>
  );
}

/* --- Teaser B2B ---------------------------------------------------------------- */
function SekcjaB2B({ copy, loc }: { copy: MarsCopy; loc: Locale }) {
  return (
    <section
      className="mars-b2b"
      aria-labelledby="mars-b2b-tytul"
      /* Cel przycisku „Firmy" w sekcji „Dla kogo" (`przewinDo("b2b")`). */
      data-cel-przewiniecia="b2b"
      tabIndex={-1}
      data-ujawnij
    >
      <div className="mars-shell mars-b2b-uklad">
        <div className="mars-b2b-tekst">
          <p className="mars-overline">{copy.b2b.overline}</p>
          <h2 className="mars-tytul" id="mars-b2b-tytul">
            <TekstNaglowka tekst={copy.b2b.tytul} />
          </h2>
          <p className="mars-lead">{copy.b2b.akapit}</p>

          {/* Brief mówi „kieruje do osobnego formularza leadowego". Osobnego
              formularza B2B jeszcze nie ma, a kanał Supabase nie przyjmuje ani
              telefonu, ani treści zapytania — kieruje więc na istniejący
              formularz kontaktowy, który to potrafi. Nic nie udajemy. */}
          <Link className="mars-przycisk-glowny" href={getLocalizedPath("/kontakt", loc)}>
            <SolarIcon name="buildings" size="1.05em" />
            {copy.b2b.cta}
          </Link>
        </div>

        <figure className="mars-b2b-foto">
          {/* Jedyne zdjęcie W KOLUMNIE, a nie na pełną szerokość. Miara liczona
              z arkusza: kontener ma najwyżej 73.75 rem minus 2.5 rem dopełnienia,
              a prawa kolumna bierze z tego 0.85/1.85 minus połowa odstępu 3 rem
              — czyli ok. 31 rem przy najszerszym układzie. */}
          <img
            src={wariant(FOTO.habitat, 1200)}
            srcSet={zestaw(FOTO.habitat, [800, 1200])}
            sizes="(max-width: 1023px) calc(100vw - 2.5rem), min(44vw, 31rem)"
            alt={copy.alt.habitat}
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  );
}

/* --- Odliczanie ----------------------------------------------------------------
   Liczba sekund do startu misji zmienia się co sekundę, więc NIE MOŻE wejść do
   wyeksportowanego HTML-u — serwer i przeglądarka policzyłyby ją inaczej
   i React zgłosiłby niezgodność hydracji. Dlatego stan startuje jako `null`,
   a pierwsza wartość pojawia się dopiero w efekcie, po stronie przeglądarki. */
type Pozostalo = { dni: number; godziny: number; minuty: number; sekundy: number } | null;

function policzPozostalo(teraz: number): Pozostalo {
  const roznica = START_MISJI - teraz;
  if (roznica <= 0) return null;
  return {
    dni: Math.floor(roznica / 86_400_000),
    godziny: Math.floor((roznica / 3_600_000) % 24),
    minuty: Math.floor((roznica / 60_000) % 60),
    sekundy: Math.floor((roznica / 1000) % 60),
  };
}

function Odliczanie({ copy }: { copy: MarsCopy }) {
  const [pozostalo, setPozostalo] = useState<Pozostalo>(null);
  const [policzone, setPoliczone] = useState(false);

  useEffect(() => {
    const odswiez = () => {
      setPozostalo(policzPozostalo(Date.now()));
      setPoliczone(true);
    };
    odswiez();
    const id = window.setInterval(odswiez, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (policzone && !pozostalo) return <p className="mars-odliczanie-po">{copy.final.poStarcie}</p>;

  /* Przed pierwszym tyknięciem rysujemy TĘ SAMĄ listę z zerami, tylko niewidoczną.
     Wcześniej była tu pusta ramka o wysokości wpisanej na sztywno (6.25 rem) —
     i to ona powodowała przeskok, któremu miała zapobiec, bo prawdziwa lista ma
     89 px na telefonie i 78 px wyżej. Identyczne znaczniki to identyczna
     geometria, bez żadnej liczby do pilnowania. */
  const pola: Array<[number, string]> = [
    [pozostalo?.dni ?? 0, copy.final.jednostki.dni],
    [pozostalo?.godziny ?? 0, copy.final.jednostki.godziny],
    [pozostalo?.minuty ?? 0, copy.final.jednostki.minuty],
    [pozostalo?.sekundy ?? 0, copy.final.jednostki.sekundy],
  ];

  return (
    <ul
      role="list"
      className={policzone ? "mars-odliczanie" : "mars-odliczanie is-czeka"}
      aria-hidden={policzone ? undefined : true}
    >
      {pola.map(([wartosc, etykieta]) => (
        <li key={etykieta}>
          <span className="mars-odliczanie-liczba">{String(wartosc).padStart(2, "0")}</span>
          <span className="mars-odliczanie-etykieta">{etykieta}</span>
        </li>
      ))}
    </ul>
  );
}

/* --- Zapis na powiadomienie -----------------------------------------------------
   Kształt pól jest PODYKTOWANY przez wdrożoną funkcję brzegową Supabase:
   waliduje zodem imię i nazwisko (min. 2 znaki), adres e-mail i wymaga zgody
   jako `z.literal(true)`. Brief prosił o „e-mail + checkbox" — samego adresu
   backend nie przyjmie (HTTP 400), a obejście po stronie frontu byłoby
   wysyłaniem śmieci do bazy.

   Treść zgody MUSI być dosłownie tą, którą funkcja brzegowa trzyma w mapie
   `CONSENT_TEXTS` pod kodem języka wysyłanym w `locale` — inaczej dowód zgody
   w bazie rozjedzie się z tym, co zobaczył gość. Porównanie znak po znaku
   dla wszystkich pięciu języków robi test `mc1-landing`.

   UWAGA WDROŻENIOWA: mapa per język powstała 2026-10-02 razem z tą podstroną.
   Dopóki funkcja brzegowa nie zostanie wdrożona ponownie, pole `locale` jest
   po jej stronie ignorowane (zod bez `.strict()` odrzuca nadmiarowe pola po
   cichu, więc formularz działa) i do bazy idzie polska treść. Ta podstrona
   NIE MOŻE wejść na produkcję w wersjach obcojęzycznych przed tym wdrożeniem. */
type StanWysylki = "idle" | "sending" | "success" | "error";

function FormularzZapisu({ copy, loc }: { copy: MarsCopy; loc: Locale }) {
  const id = useId();
  const [imie, setImie] = useState("");
  const [nazwisko, setNazwisko] = useState("");
  const [email, setEmail] = useState("");
  const [zgoda, setZgoda] = useState(false);
  const [dotkniete, setDotkniete] = useState<Record<string, boolean>>({});
  const [stan, setStan] = useState<StanWysylki>("idle");
  const komunikat = useRef<HTMLParagraphElement>(null);

  const bledy: Record<string, string | undefined> = {
    imie: imie.trim().length < 2 ? copy.formularz.bladImie : undefined,
    nazwisko: nazwisko.trim().length < 2 ? copy.formularz.bladNazwisko : undefined,
    email: EMAIL_RE.test(email.trim()) ? undefined : copy.formularz.bladEmail,
    zgoda: zgoda ? undefined : copy.formularz.bladZgoda,
  };
  const poprawny = Object.values(bledy).every((b) => !b);

  /* Po wysłaniu przenosimy fokus na komunikat. Bez tego osoba korzystająca
     z czytnika ekranu nie dowiaduje się, czy cokolwiek się stało — sam
     `aria-live` ogłasza tekst, ale zostawia fokus na zniknięciym przycisku. */
  useEffect(() => {
    if (stan === "success" || stan === "error") komunikat.current?.focus();
  }, [stan]);

  async function wyslij(e: React.FormEvent) {
    e.preventDefault();
    setDotkniete({ imie: true, nazwisko: true, email: true, zgoda: true });
    if (stan === "sending") return;
    if (!poprawny) {
      /* Bez tego nieudana walidacja była CAŁKIEM NIEMA: komunikaty błędów leżą
         w zwykłych `<span>` poza regionem żywym, a fokus zostawał na przycisku.
         Osoba korzystająca z czytnika ekranu klikała „wyślij" i nie dowiadywała
         się, że cokolwiek jest nie tak. Przenosimy fokus na PIERWSZE błędne
         pole — jego błąd jest podpięty przez `aria-describedby`, więc czytnik
         odczyta go razem z etykietą. */
      const pierwszy = (["imie", "nazwisko", "email", "zgoda"] as const).find((k) => bledy[k]);
      if (pierwszy) document.getElementById(`${id}-${pierwszy}`)?.focus();
      return;
    }

    setStan("sending");
    const wynik = await submitLead({
      source: "mars",
      first_name: imie.trim(),
      last_name: nazwisko.trim(),
      email: email.trim(),
      consent_contact: true,
      /* Język decyduje o tym, KTÓRĄ zatwierdzoną treść zgody zapisze baza.
         Bez tego pola do kolumny `consent_text` trafiłby polski oryginał,
         choć gość widział tłumaczenie — czyli dowód zgody nie zgadzałby się
         z ekranem. Treści NIE wysyłamy: front podaje tylko kod języka, żeby
         dowodu nie dało się podmienić z przeglądarki. */
      locale: loc,
      /* Źródło rozpoznamy po adresie — ten sam zabieg co w kioskach
         identyfikacji, gdzie wariant online odróżnia się właśnie `page_url`. */
      page_url: typeof window === "undefined" ? undefined : window.location.href,
    });
    setStan(wynik.ok ? "success" : "error");
  }

  const pole = (
    klucz: "imie" | "nazwisko" | "email",
    etykieta: string,
    wartosc: string,
    ustaw: (v: string) => void,
    typ: "text" | "email",
    autoComplete: string,
  ) => {
    const blad = dotkniete[klucz] ? bledy[klucz] : undefined;
    return (
      <p className="mars-pole">
        <label htmlFor={`${id}-${klucz}`}>
          {etykieta} <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${id}-${klucz}`}
          name={klucz}
          type={typ}
          value={wartosc}
          autoComplete={autoComplete}
          required
          aria-invalid={Boolean(blad)}
          aria-describedby={blad ? `${id}-${klucz}-blad` : undefined}
          onChange={(e) => ustaw(e.target.value)}
          onBlur={() => setDotkniete((d) => ({ ...d, [klucz]: true }))}
        />
        {blad ? (
          <span className="mars-pole-blad" id={`${id}-${klucz}-blad`}>
            {blad}
          </span>
        ) : null}
      </p>
    );
  };

  /* Po sukcesie formularz ZNIKA i zostaje sam komunikat. Kanał Supabase
     odpowiada szybko, więc samo `disabled` na przycisku słabo chroni przed
     drugim wysłaniem — brak formularza chroni skutecznie. */
  if (stan === "success") {
    return (
      <p className="mars-komunikat is-sukces" role="status" tabIndex={-1} ref={komunikat}>
        <SolarIcon name="check-circle" size="1.2em" weight="fill" />
        {copy.formularz.sukces}
      </p>
    );
  }

  return (
    <form className="mars-formularz" onSubmit={wyslij} noValidate>
      <div className="mars-formularz-pola">
        {pole("imie", copy.formularz.imie, imie, setImie, "text", "given-name")}
        {pole("nazwisko", copy.formularz.nazwisko, nazwisko, setNazwisko, "text", "family-name")}
        {pole("email", copy.formularz.email, email, setEmail, "email", "email")}
      </div>

      <p className="mars-zgoda">
        <input
          id={`${id}-zgoda`}
          type="checkbox"
          checked={zgoda}
          /* `aria-required`, a nie natywne `required`: formularz ma `noValidate`,
             więc natywna walidacja i tak nie zadziała, a atrybut ARIA niesie tę
             informację czytnikowi ekranu. */
          aria-required="true"
          aria-invalid={Boolean(dotkniete.zgoda && bledy.zgoda)}
          aria-describedby={dotkniete.zgoda && bledy.zgoda ? `${id}-zgoda-blad` : undefined}
          onChange={(e) => {
            setZgoda(e.target.checked);
            setDotkniete((d) => ({ ...d, zgoda: true }));
          }}
        />
        <label htmlFor={`${id}-zgoda`}>
          <span aria-hidden="true">*</span> {copy.formularz.zgoda}{" "}
          {copy.formularz.politykaPrzed}{" "}
          {/* Zwykłe <a>, nie <Link>: dla pliku PDF w `public/` Next próbowałby
              pobrać payload trasy (`<href>.txt`), którego nie ma — seria 404
              w konsoli. Ten sam wybór co w stopce. */}
          <a href="/stopka/polityka-prywatnosci.pdf" target="_blank" rel="noopener noreferrer">
            {copy.formularz.politykaLink}
          </a>
          {copy.formularz.politykaPo}
        </label>
        {dotkniete.zgoda && bledy.zgoda ? (
          <span className="mars-pole-blad" id={`${id}-zgoda-blad`}>
            {bledy.zgoda}
          </span>
        ) : null}
      </p>

      <button type="submit" className="mars-przycisk-glowny" disabled={stan === "sending"}>
        <SolarIcon name="bell" size="1.05em" />
        {stan === "sending" ? copy.formularz.wysylanie : copy.formularz.wyslij}
      </button>

      <p className="mars-wymagane">
        <span aria-hidden="true">*</span> {copy.formularz.wymagane}
      </p>

      {/* Wysokość zarezerwowana, żeby pojawienie się komunikatu nie przesuwało
          układu. Region żywy ogłasza go czytnikowi ekranu. */}
      <p
        className={stan === "error" ? "mars-komunikat is-blad" : "mars-komunikat"}
        role="status"
        tabIndex={-1}
        ref={komunikat}
      >
        {stan === "error" ? copy.formularz.blad : ""}
      </p>

    </form>
  );
}

/* --- Finał --------------------------------------------------------------------- */
function SekcjaFinal({ copy, loc }: { copy: MarsCopy; loc: Locale }) {
  return (
    <section
      className="mars-final mars-ciemny"
      aria-labelledby="mars-final-tytul"
      data-cel-przewiniecia="zapis"
      tabIndex={-1}
      data-ujawnij
    >
      <div className="mars-shell">
        <PasekMisji copy={copy} wariantPaska="finalowy" />

        <p className="mars-overline">{copy.final.overline}</p>
        <h2 className="mars-tytul" id="mars-final-tytul">
          <TekstNaglowka tekst={copy.final.tytul} />
        </h2>

        <Odliczanie copy={copy} />

        <p className="mars-przedsprzedaz">
          <span className="mars-przedsprzedaz-etykieta">{copy.final.przedsprzedazEtykieta}</span>
          <span className="mars-przedsprzedaz-data">{copy.final.przedsprzedazData}</span>
        </p>

        {/* Przypomnienie przy zapisie: wystawa jest czasowa. Ten sam tekst co
            trzecia karta w hero — to ostatnie miejsce przed formularzem. */}
        <p className="mars-final-czas">
          <SolarIcon name="clock" size="1.1em" className="mars-final-czas-ikona" />
          <span className="mars-final-czas-etykieta">{copy.hero.czasWystawy.etykieta}</span>
          <strong className="mars-final-czas-wartosc">{copy.hero.czasWystawy.wartosc}</strong>
        </p>

        <h3 className="mars-formularz-tytul">{copy.final.tytulFormularza}</h3>
        <FormularzZapisu copy={copy} loc={loc} />
      </div>
    </section>
  );
}

export default function MarsColonizationPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = MARS_COPY[loc] ?? MARS_COPY.pl;
  useUjawnianie(".mars-page");

  /* Stary odnośnik z kotwicą (np. `#mars-misja` sprzed 05.10.2026) nie ma już
     dokąd prowadzić — sekcje nie mają `id`. Czyścimy go z paska adresu, żeby
     podstrona miała jeden, czysty adres. `history.state` zostaje ten sam,
     bo trzyma w nim stan router Next.js. */
  useEffect(() => {
    if (!window.location.hash) return;
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search
    );
  }, []);

  return (
    <main className="mars-page">
      <Hero copy={copy} />
      <SekcjaRok2035 copy={copy} />
      <SekcjaCzym copy={copy} loc={loc} />
      <SekcjaMisja copy={copy} />
      <SekcjaHumanoidy copy={copy} loc={loc} />
      {/* Ciemny pas pod dwiema sekcjami. „Więcej niż jedna misja" NIE ma
          własnego tła (decyzja obiektu: „typografia na ciemnym tle strony"),
          a strona w tym miejscu jest jasna — granat daje więc rodzic, w kolorze
          górnej krawędzi „Dla kogo", żeby styk obu sekcji nie miał szwu.
          Reguła `.mars-pas-nocny` w `ekosystem.css`. */}
      <div className="mars-pas-nocny">
        <Ekosystem copy={copy} />
        <DlaKogo copy={copy} />
      </div>
      <SekcjaB2B copy={copy} loc={loc} />
      <SekcjaFinal copy={copy} loc={loc} />
    </main>
  );
}
