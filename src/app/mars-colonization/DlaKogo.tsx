"use client";

import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";

import { SolarIcon, type SolarIconName } from "@/app/components/SolarIcon";
import type { MarsCopy } from "./marsCopy";
import { TekstNaglowka } from "./Naglowek";
import { przewinDo, type CelPrzewiniecia } from "./przewin";
import "./dla-kogo.css";

/* --- Dla kogo: lista grup + klatka w taśmie filmowej ---------------------------
   Decyzja obiektu (05.10.2026): „wybierasz i obok pojawia się zdjęcie",
   a zdjęcie stoi w TEJ SAMEJ kliszy 35 mm co „Pięć kroków misji" — „na te
   zdjęcia trzeba dodać taśmę filmową, a nie taki kafelek". Karty ze zdjęciem
   w tle już nie ma. Ciemna sekcja: po lewej nagłówek i pięć wierszy-przycisków,
   po prawej odcinek taśmy z klatką wybranej grupy, a pod taśmą jej zdanie
   i przycisk.

   JEDEN DOM NA KAŻDĄ SZEROKOŚĆ — te same elementy rozstawia siatka w arkuszu
   (`dla-kogo.css`, tam też uzasadnienie progów i mechanika taśmy):
   — od 768 px dwie kolumny, wszystkie panele w JEDNEJ komórce prawej kolumny.
     Każdy panel przesuwa swoją klatkę o (i − aktywny) kroków, więc pięć
     klatek staje obok siebie w jednej taśmie (`.mars-kto-tasma` pod nimi),
     a zmiana grupy przewija taśmę jak film w projektorze. Taśma biegnie od
     szczeliny między kolumnami do PRAWEJ KRAWĘDZI OKNA (jak „Pięć kroków"),
     wybrana klatka stoi przy lewej krawędzi kolumny, a następne biegną
     w prawo, aż utnie je krawędź okna. To zdjęcia, które ich panele i tak
     mają, więc nic nie pobiera się dwa razy;
   — poniżej jedna kolumna i panel tuż POD swoim wierszem (akordeon) — „obok"
     na telefonie fizycznie się nie mieści. Panel to odcinek taśmy z jedną
     klatką, która wjeżdża z kierunku przewijania.
   Nic nie stoi więc w drzewie dostępności dwa razy.

   SEMANTYKA: akordeon z APG — nagłówek h3 z przyciskiem `aria-expanded`
   + `aria-controls`, panel `role="region"` nazwany tym przyciskiem. Zakładki
   (`tablist`) odpadły: ról nie da się przełączać progiem, a na telefonie to
   jest akordeon. Otwarty jest ZAWSZE dokładnie jeden panel, więc przycisk
   otwartego ma `aria-disabled` (APG: „panelu nie da się zwinąć") — kliknięcie
   w niego nic nie robi. Nieaktywne panele mają `inert`: fokus nie wejdzie do
   ukrytego panelu ani na telefonie (tam i tak `display: none`), ani od 768 px
   (tam `visibility: hidden` — widać tylko ich klatkę z `aria-hidden`, a tekst
   starego panelu jeszcze chwilę gaśnie, choć panel jest już nieaktywny).

   Bez autoodtwarzania i bez wyboru najechaniem — wybiera wyłącznie kliknięcie
   (albo Enter / spacja). Stan startowy = pierwsza grupa, ten sam na serwerze
   i w przeglądarce; render nie pyta o okno, więc hydracja dostaje identyczny
   HTML.

   STAN TAŚMY idzie do arkusza zmiennymi w stylu inline sekcji (`--kto-
   aktywny`, `--kto-skok`, `--kto-kierunek`) i atrybutem `data-wybrano`,
   NIGDY przez `className` sekcji: `useUjawnianie` dopisuje jej klasę
   `jest-widoczny` prosto w DOM, a React przy zmianie `className` nadpisałby
   cały atrybut i sekcja wróciłaby do stanu ukrytego. */

/* Ikony pięciu grup — kolejność odpowiada `dlaKogo.odbiorcy` w tekstach, listy
   łączy indeks. „Fani technologii" mają robota zamiast koła zębatego: ich
   zdanie to „Spotkaj prawdziwe humanoidy". */
const IKONY_ODBIORCOW: SolarIconName[] = ["guests", "star", "document", "robots", "company"];

/* ZDJĘCIA GRUP — jedna mapa: plik i punkt zaczepienia kadru (`object-position`),
   kolejność jak wyżej. Warianty robi `dla_kogo()` w `media-src/mars-colonization/
   warianty.py` (nazwy plików umówione z obiektem; nowe zdjęcie wrzuca się do
   `public/mars-colonization/dla-kogo/<nazwa>.<rozszerzenie>` i uruchamia
   skrypt — oryginał sam wyjedzie do `media-src/`).
   Okno klatki ma na każdym progu 3:2 — tak jak klatka małoobrazkowa i jak
   same zdjęcia (1440 × 960), więc `cover` przy nich niczego nie tnie i punkt
   zaczepienia ma znaczenie tylko dla zdjęć o innej proporcji: pionowe
   „Szukający wrażeń" traci górę i dół, więc liczy się DRUGA liczba. Na
   klatce nie leży żaden napis (tekst stoi pod taśmą), więc bohater zdjęcia
   może stać gdziekolwiek. Po podmianie zdjęcia poprawia się go TUTAJ,
   skryptu nie trzeba uruchamiać. */
const KADRY = [
  { plik: "rodziny", pozycja: "40% 55%" }, // rodzina w skafandrach, po prawej kolonia
  { plik: "wrazenia", pozycja: "50% 34%" }, // pokaz humanoidów, ktoś filmuje telefonem
  { plik: "szkoly", pozycja: "30% 45%" }, // robot uczy przy ekranie, uczniowie z plecakami
  { plik: "technologia", pozycja: "50% 45%" }, // przybicie piątki z robotem
  { plik: "firmy", pozycja: "38% 50%" }, // zarząd patrzy na roboty w kolonii
] as const;
const FOLDER_KADROW = "/mars-colonization/dla-kogo";
const SZEROKOSCI_KADRU = [640, 960, 1440] as const;

/* Szerokość OKNA KLATKI dla wyboru pliku — MUSI iść za `--kto-kadr-w`
   w `dla-kogo.css`. Telefon: cała szyna treści. Od 768 px klatka ma stałą
   miarę (18,5 rem, od 1024 px 20 rem) — dobraną tak, żeby taśma z podpisem
   i przyciskiem kończyła się równo z listą obok (tam uzasadnienie). Bez
   `min()` i `clamp()` (przeglądarka, która ich w `sizes` nie zna, odrzuca
   cały wpis i bierze 100vw). */
const ROZMIAR_KADRU = "(min-width: 1024px) 20rem, (min-width: 768px) 18.5rem, calc(100vw - 2.5rem)";

/* Dokąd prowadzi przycisk w panelu. Cztery grupy idą do zapisu na start
   przedsprzedaży (etykieta ta sama co główny przycisk hero), „Firmy" — do
   sekcji B2B tuż pod listą. Przewijanie bez kotwic w adresie (`przewinDo`). */
const CELE: CelPrzewiniecia[] = ["zapis", "zapis", "zapis", "zapis", "b2b"];

/** Ścieżka do wariantu o danej szerokości (jak `wariant()` w `page.tsx`). */
function wariant(plik: string, szerokosc: number): string {
  return `${FOLDER_KADROW}/${plik}-${szerokosc}.webp`;
}

/** `srcSet` z deskryptorami `w` (jak `zestaw()` w `page.tsx` — tam też dlaczego).
 *  `dopisek` to parametr ponowienia (`?p=1`) — patrz `ZdjecieKlatki`. */
function zestaw(plik: string, dopisek = ""): string {
  return SZEROKOSCI_KADRU.map((w) => `${wariant(plik, w)}${dopisek} ${w}w`).join(", ");
}

/* Ile razy ponawiamy pobranie zdjęcia po błędzie (po 0,9 s, 1,8 s i 2,7 s),
   zanim w oknie zostanie pusta, nienaświetlona klatka. */
const PONOWIENIA = 3;

/** Zdjęcie w oknie klatki — z ponowieniem po nieudanym pobraniu.
 *
 *  BŁĄD „?" W SAFARI (05.10.2026, panel „Firmy"): jedno nieudane pobranie
 *  zostawiało `<img>` zepsuty NA ZAWSZE — adres się nie zmienia, więc
 *  przeglądarka sama go nie ponawia, a Safari rysuje w kadrze niebieski znak
 *  zapytania (odtworzone w WebKicie: pusta odpowiedź 200, 404 i zerwane
 *  połączenie dają ten sam obraz i jedno żądanie mimo kolejnych kliknięć).
 *  Takie pobranie zdarza się na serwerze deweloperskim: `warianty.py`
 *  zapisuje warianty przez PIL, który najpierw OBCINA plik, a potem koduje
 *  obraz — przez ok. 110 ms na plik serwer oddaje 200 z pustą treścią,
 *  a „firmy" idzie w skrypcie ostatnie. To samo robi restart serwera.
 *  Dlatego po błędzie pytamy jeszcze raz pod nowym adresem (`?p=1`, `?p=2`…
 *  — ten sam plik, ale nowe żądanie zamiast zepsutego wpisu w pamięci
 *  podręcznej), a do udanego wczytania obraz jest schowany (`data-blad`):
 *  w oknie stoi ciemna klatka, nigdy ikona błędu. */
function ZdjecieKlatki({ plik, pozycja, zaladuj }: { plik: string; pozycja: string; zaladuj: boolean }) {
  const obraz = useRef<HTMLImageElement | null>(null);
  /** Ile pobrań tego zdjęcia się nie udało. */
  const [bledy, ustawBledy] = useState(0);
  /** Numer próby w adresie; 0 = zwykły adres, taki jak w HTML-u z serwera. */
  const [proba, ustawProbe] = useState(0);
  /** Bieżący adres się nie wczytał — obraz schowany do następnej próby. */
  const [zepsuty, ustawZepsuty] = useState(false);

  useEffect(() => {
    if (bledy === 0 || bledy > PONOWIENIA) return;
    const zegar = window.setTimeout(() => ustawProbe(bledy), 900 * bledy);
    return () => window.clearTimeout(zegar);
  }, [bledy]);

  /* Błąd sprzed hydracji: React podpina `onError` dopiero przy hydracji, więc
     obraz, który zepsuł się wcześniej, rozpoznajemy po stanie. Pusty
     `currentSrc` znaczy, że leniwy obraz jeszcze niczego nie pobierał — to
     nie błąd. */
  useEffect(() => {
    const img = obraz.current;
    if (!img || !img.complete || img.naturalWidth > 0 || !img.currentSrc) return;
    ustawZepsuty(true);
    ustawBledy((b) => b + 1);
  }, []);

  const dopisek = proba ? `?p=${proba}` : "";
  /* `srcSet` PRZED `src`: React zmienia atrybuty w tej kolejności, a WebKit
     po zmianie samego `src` wybierał jeszcze ze starego zestawu i ponawiał
     stary, zepsuty adres (zmierzone: 7 żądań zamiast 4 przy stałej awarii). */
  return (
    <img
      ref={obraz}
      className="mars-kto-foto"
      srcSet={zestaw(plik, dopisek)}
      sizes={ROZMIAR_KADRU}
      src={`${wariant(plik, 960)}${dopisek}`}
      width={1440}
      height={960}
      alt=""
      loading={zaladuj ? "eager" : "lazy"}
      decoding="async"
      data-blad={zepsuty || undefined}
      onError={() => {
        ustawZepsuty(true);
        ustawBledy((b) => b + 1);
      }}
      onLoad={() => ustawZepsuty(false)}
      style={{ objectPosition: pozycja }}
    />
  );
}

export function DlaKogo({ copy }: { copy: MarsCopy }) {
  const odbiorcy = copy.dlaKogo.odbiorcy;
  const [aktywny, ustawAktywny] = useState(0);
  /* Ostatni przejazd taśmy: o ile klatek (arkusz liczy z tego czas — dalszy
     skok jedzie dłużej, jak przewijany film) i w którą stronę (z tej strony
     wjeżdża klatka na telefonie). `wybrano` włącza wjazd klatki dopiero po
     pierwszym wyborze — przy wczytaniu strony taśma stoi. */
  const [ruch, ustawRuch] = useState({ skok: 1, kierunek: 1, wybrano: false });
  const sekcjaRef = useRef<HTMLElement | null>(null);
  const przyciskiRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baza = useId();

  /* Zdjęcia nieaktywnych paneli przy `loading="lazy"` nie zostałyby pobrane
     NIGDY: na telefonie panel ma `display: none` i przeglądarka nie uznaje
     obrazu za bliski widoku (zmierzone w WebKicie: do przełączenia idzie
     tylko zdjęcie otwartego panelu), a od 768 px klatki sąsiadów stoją poza
     kadrem taśmy (ta pułapka wystąpiła już w karuzeli na /wydarzenia). Gdy
     sekcja zbliża się do widoku, wszystkie pięć przechodzi na pobieranie
     natychmiastowe — pierwszy ekran strony nie drożeje, a zdjęcie jest
     gotowe, zanim ktoś wybierze grupę. */
  const [zaladuj, ustawZaladuj] = useState(false);
  useEffect(() => {
    const sekcja = sekcjaRef.current;
    if (!sekcja || typeof IntersectionObserver === "undefined") {
      ustawZaladuj(true);
      return;
    }
    const obserwator = new IntersectionObserver(
      ([wpis]) => {
        if (!wpis.isIntersecting) return;
        ustawZaladuj(true);
        obserwator.disconnect();
      },
      { rootMargin: "600px 0px" }
    );
    obserwator.observe(sekcja);
    return () => obserwator.disconnect();
  }, []);

  /* SZEROKOŚĆ OKNA dla taśmy (od 768 px biegnie do prawej krawędzi okna).
     Arkusz zaczyna od `100vw`, ale to wlicza klasyczny pasek przewijania
     (Windows: ok. 15 px) — taśma wystawałaby wtedy za okno, a jej prawy
     zanik byłby ucięty w połowie. Wpisujemy zmierzone `clientWidth`, jak
     `useTasmaKadrow` w „Pięciu krokach". Zmienna w stylu sekcji obok tych,
     którymi zarządza React — React zmienia tylko własne właściwości, więc
     jej nie zdejmie. Szerokość zmienia też pojawienie się paska
     przewijania strony, którego `resize` okna nie zgłasza — stąd
     obserwator rozmiaru sekcji. */
  useEffect(() => {
    const sekcja = sekcjaRef.current;
    if (!sekcja) return;
    const zmierz = () => {
      const okno = `${document.documentElement.clientWidth}px`;
      if (sekcja.style.getPropertyValue("--kto-okno") !== okno) sekcja.style.setProperty("--kto-okno", okno);
    };
    zmierz();
    window.addEventListener("resize", zmierz);
    const obserwator = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(zmierz);
    obserwator?.observe(sekcja);
    return () => {
      window.removeEventListener("resize", zmierz);
      obserwator?.disconnect();
    };
  }, []);

  /* AKORDEON NA TELEFONIE: zamknięcie panelu NAD klikniętym wierszem
     podciąga ten wiersz o wysokość panelu (taśma z tekstem, ~410–470 px)
     — często poza ekran.
     Po przełączeniu cofamy przewinięcie dokładnie o tyle, o ile wiersz
     odjechał: zostaje pod palcem, a nowy panel otwiera się pod nim.
     `flushSync`, żeby drugi pomiar widział już nowy układ; `instant`, bo
     korzeń ma `scroll-behavior: smooth` i zwykłe `scrollBy` jechałoby
     animacją. Od 768 px wiersze się nie ruszają (panel stoi obok), więc
     różnica wynosi zero i nic się nie dzieje. */
  const wybierz = (i: number) => {
    if (i === aktywny) return;
    const przycisk = przyciskiRef.current[i];
    const przed = przycisk?.getBoundingClientRect().top ?? 0;
    flushSync(() => {
      ustawAktywny(i);
      ustawRuch({ skok: Math.abs(i - aktywny), kierunek: i > aktywny ? 1 : -1, wybrano: true });
    });
    const po = przycisk?.getBoundingClientRect().top ?? 0;
    if (Math.abs(po - przed) >= 1) window.scrollBy({ top: po - przed, behavior: "instant" });
  };

  /* Strzałki góra / dół, Home i End przenoszą fokus między wierszami (APG,
     akordeon). Samo przeniesienie fokusu niczego nie otwiera — wybór to Enter
     albo spacja, jak w każdym przycisku. */
  const klawisz = (i: number) => (zdarzenie: KeyboardEvent<HTMLButtonElement>) => {
    const ile = odbiorcy.length;
    const cel =
      zdarzenie.key === "ArrowDown"
        ? (i + 1) % ile
        : zdarzenie.key === "ArrowUp"
          ? (i - 1 + ile) % ile
          : zdarzenie.key === "Home"
            ? 0
            : zdarzenie.key === "End"
              ? ile - 1
              : null;
    if (cel === null) return;
    zdarzenie.preventDefault();
    przyciskiRef.current[cel]?.focus();
  };

  return (
    <section
      ref={sekcjaRef}
      className="mars-kto mars-ciemny"
      aria-labelledby="mars-dla-kogo-tytul"
      data-ujawnij
      data-wybrano={ruch.wybrano || undefined}
      style={
        {
          "--kto-aktywny": aktywny,
          "--kto-skok": ruch.skok,
          "--kto-kierunek": ruch.kierunek,
        } as CSSProperties
      }
    >
      <div className="mars-shell mars-kto-uklad">
        {/* Wspólna taśma pod klatkami (od 768 px): podłoże, perforacje
            i światło za nimi. Ozdoba spoza paneli — klatki leżą w panelach,
            każda przy swoim tekście, a taśma pod nimi jest jedna. Na
            telefonie taśmę rysuje sam otwarty panel. `-okna` to puste,
            nienaświetlone klatki przed pierwszym i za ostatnim zdjęciem. */}
        <div className="mars-kto-tasma" aria-hidden="true">
          <div className="mars-kto-tasma-film">
            <span className="mars-kto-tasma-okna" />
          </div>
        </div>

        <p className="mars-overline mars-kto-overline">{copy.dlaKogo.overline}</p>
        <h2 className="mars-tytul mars-kto-tytul" id="mars-dla-kogo-tytul">
          <TekstNaglowka tekst={copy.dlaKogo.tytul} />
        </h2>

        {odbiorcy.map((odbiorca, i) => {
          const otwarty = i === aktywny;
          const idPrzycisku = `${baza}-wybor-${i}`;
          const idPanelu = `${baza}-panel-${i}`;
          const kadr = KADRY[i];
          const cel = CELE[i] ?? "zapis";
          return (
            <Fragment key={odbiorca.tytul}>
              {/* `--kto-i` = pozycja na liście; arkusz liczy z niej opóźnienie
                  wejścia wiersza przy ujawnieniu sekcji. */}
              <h3 className="mars-kto-pozycja" style={{ "--kto-i": i } as CSSProperties}>
                <button
                  ref={(przycisk) => {
                    przyciskiRef.current[i] = przycisk;
                  }}
                  type="button"
                  id={idPrzycisku}
                  className={`mars-kto-wybor${otwarty ? " is-otwarty" : ""}`}
                  aria-expanded={otwarty}
                  aria-controls={idPanelu}
                  aria-disabled={otwarty || undefined}
                  onClick={() => wybierz(i)}
                  onKeyDown={klawisz(i)}
                >
                  {/* Numer wiersza to rytm listy z referencji, nie licznik
                      „01 / 05" (ten obiekt usunął z taśmy kroków). Czytnik
                      go pomija — nazwą przycisku ma być sama grupa. */}
                  <span className="mars-kto-numer" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <SolarIcon name={IKONY_ODBIORCOW[i] ?? "star"} size="1.375rem" className="mars-kto-ikona" />
                  <span className="mars-kto-etykieta">{odbiorca.tytul}</span>
                  <SolarIcon name="chevron-right" size="1rem" className="mars-kto-strzalka" />
                </button>
              </h3>

              {/* `--kto-i` = pozycja klatki w taśmie: arkusz przesuwa ją
                  o (i − aktywny) kroków. */}
              <div
                id={idPanelu}
                role="region"
                aria-labelledby={idPrzycisku}
                className={`mars-kto-panel${otwarty ? " is-otwarty" : ""}`}
                inert={!otwarty}
                style={{ "--kto-i": i } as CSSProperties}
              >
                {/* Odcinek taśmy z klatką. Zdjęcie ilustruje grupę, którą i tak
                    nazywa przycisk i zdanie pod taśmą — dla czytnika jest
                    dekoracją. Pusty `alt` RAZEM z `aria-hidden`: test
                    `mc1-landing` pilnuje, żeby taki obraz siedział poza
                    drzewem dostępności. */}
                <div className="mars-kto-klisza" aria-hidden="true">
                  <div className="mars-kto-kadr">
                    {kadr && <ZdjecieKlatki plik={kadr.plik} pozycja={kadr.pozycja} zaladuj={zaladuj} />}
                    {/* Przygaszenie klatek obok wybranej (od 768 px) — nad
                        zdjęciem, pod włosową krawędzią okna. */}
                    <span className="mars-kto-przygas" />
                  </div>
                </div>

                <div className="mars-kto-tresc">
                  {/* Nazwa grupy powtarza przycisk, który już nazywa ten panel
                      (`aria-labelledby`) — czytnik przeczytałby ją dwa razy.
                      Na telefonie znika też z widoku: wiersz stoi tuż nad. */}
                  <p className="mars-kto-nazwa" aria-hidden="true">
                    {odbiorca.tytul}
                  </p>
                  <p className="mars-kto-opis">{odbiorca.opis}</p>
                  <button type="button" className="mars-kto-cta" onClick={() => przewinDo(cel)}>
                    <span>{cel === "b2b" ? copy.dlaKogo.ctaFirmy : copy.hero.cta}</span>
                    <SolarIcon name="arrow-right" size="1.05em" className="mars-kto-cta-strzalka" />
                  </button>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
