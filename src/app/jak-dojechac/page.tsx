"use client";

/* Style tej podstrony — wycięte z globals.css (317 reguł, 66 kB).
   Wspólne zmienne (.dojazd-page, .bistro-page) zostały w arkuszu globalnym,
   bo dzielą je dwie podstrony. */
import "./dojazd.css";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { SolarIcon } from "@/app/components/SolarIcon";
import { Rozwijane } from "@/app/components/Rozwijane";
import { useUjawnianie } from "@/app/components/useUjawnianie";
import { useI18n } from "@/app/i18n-provider";
import { trackEvent } from "@/lib/analytics";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";

import { DOJAZD_COPY, type DojazdCopy, type TrybDojazdu } from "./dojazdCopy";
import {
  ATRAKCJE_OKOLICY,
  BUS,
  type ChwilaObiektu,
  linkTrasy,
  linkTrasyDoPrzystanku,
  MAPA_OBIEKTU_EMBED,
  MAPA_FLIXBUS_EMBED,
  MAPA_PRZYSTANKU_EMBED,
  ROZKLAD_POCIAGOW_URL,
  najblizszyOdjazd,
  naMinuty,
  dzienTygodnia,
  OBIEKT,
  PRZEWOZNICY,
  PRZYSTANKI,
  PUNKTY_STARTOWE,
  terazWObiekcie,
} from "./dojazdData";

/* Dane kontaktowe: te same, potwierdzone wartości co w stopce i na /kontakt. */
const TELEFON = "+48 510 831 277";
const EMAIL = "rezerwacje@alverniaplanet.com";

/* --- Wspólne drobiazgi ----------------------------------------------------- */

/* --- Mapa na żądanie -------------------------------------------------------- */

function MapaObiektu({ copy }: { copy: DojazdCopy }) {
  const [gotowa, setGotowa] = useState(false);
  return (
    <div className="dojazd-mapa">
      <div className="dojazd-mapa-ramka">
        {!gotowa ? <span className="dojazd-mapa-ladowanie">{copy.mapa.ladowanie}</span> : null}
        <iframe
          title={copy.mapa.ramkaTytul}
          src={MAPA_OBIEKTU_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setGotowa(true)}
          allowFullScreen
        />
      </div>
      {/* Adres i odnośnik są POZA ramką, więc działają nawet wtedy, gdy mapa się
          nie wczyta albo zablokuje ją rozszerzenie przeglądarki. */}
      <p className="dojazd-mapa-stopka">
        <span>{copy.mapa.opis}</span>
        <a
          className="dojazd-link"
          href={linkTrasy()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("directions_open", { mode: "map", from: "panel_mapy" })}
        >
          {copy.mapa.otworz}
        </a>
      </p>
    </div>
  );
}

/* --- Panel: AUTO ----------------------------------------------------------- */

function PanelAuto({ copy }: { copy: DojazdCopy }) {
  const [skopiowano, setSkopiowano] = useState(false);
  const [mapa, setMapa] = useState(false);
  const licznik = useRef<number | null>(null);
  const idMapy = useId();

  useEffect(
    () => () => {
      if (licznik.current) window.clearTimeout(licznik.current);
    },
    []
  );

  const kopiuj = async () => {
    try {
      await navigator.clipboard.writeText(OBIEKT.adres);
      setSkopiowano(true);
      trackEvent("address_copy", { location: "jak_dojechac" });
      if (licznik.current) window.clearTimeout(licznik.current);
      licznik.current = window.setTimeout(() => setSkopiowano(false), 2200);
    } catch {
      /* Brak dostępu do schowka — adres stoi obok jako tekst do zaznaczenia. */
    }
  };

  return (
    <div className="dojazd-panel-tresc">
      <h2 className="dojazd-panel-tytul">{copy.auto.title}</h2>

      {/* Dwa fakty w jednym rzędzie, każdy z ikoną — bez pudełka. */}
      <ul role="list" className="dojazd-fakty">
        {copy.auto.fakty.map((fakt, i) => (
          <li key={fakt} className="dojazd-fakt">
            <SolarIcon name={i === 0 ? "road" : "parking"} size="1.5em" className="dojazd-fakt-ikona" />
            {fakt}
          </li>
        ))}
      </ul>

      <div className="dojazd-adres">
        <div className="dojazd-adres-tekst">
          <span className="dojazd-adres-etykieta">{copy.auto.adresLabel}</span>
          <p className="dojazd-adres-wartosc">
            {OBIEKT.ulica}
            <span>{`${OBIEKT.kod} ${OBIEKT.miejscowosc}`}</span>
          </p>
        </div>
        <button
          type="button"
          className="dojazd-ikona-przycisk"
          onClick={kopiuj}
          aria-label={skopiowano ? copy.auto.skopiowano : `${copy.auto.kopiuj}: ${OBIEKT.adres}`}
        >
          <SolarIcon name={skopiowano ? "star" : "copy"} size="1.25em" />
        </button>
        <span className="dojazd-sr" role="status">
          {skopiowano ? copy.auto.skopiowano : ""}
        </span>
      </div>

      <a
        className="dojazd-przycisk-glowny"
        href={linkTrasy()}
        target="_blank"
        rel="noopener noreferrer"
        data-dojazd-cta="auto"
        onClick={() => trackEvent("directions_open", { mode: "auto", from: "moja_lokalizacja" })}
      >
        <SolarIcon name="navigation" size="1.15em" />
        {copy.auto.nawiguj}
        <SolarIcon name="arrow-right" size="1.05em" className="dojazd-przycisk-strzalka" />
      </a>


    </div>
  );
}

/* --- Panel: AUTOBUSEM (przewoźnicy dalekobieżni) --------------------------- */

function PanelFlix({ copy }: { copy: DojazdCopy }) {
  return (
    <div className="dojazd-panel-tresc">
      <h2 className="dojazd-panel-tytul">{copy.planer.tryby.flix}</h2>
      <p className="dojazd-panel-lead">{copy.autobus.lead}</p>

      <ul role="list" className="dojazd-flix">
        {PRZEWOZNICY.filter((przewoznik) => przewoznik.id === "flixbus").map((przewoznik) => {
          const t = copy.autobus.przewoznicy[przewoznik.id];
          return (
            <li key={przewoznik.id} className={`dojazd-flix-poz ${przewoznik.id === "flixbus" ? "is-flix" : ""}`}>
              <div className="dojazd-flix-glowa">
                <span className="dojazd-flix-nazwa">{t.nazwa}</span>
                <span className={`dojazd-plakietka ${przewoznik.dowozPodObiekt ? "is-bezposrednio" : ""}`}>
                  {przewoznik.dowozPodObiekt ? copy.autobus.dowozi : copy.autobus.ostatniOdcinek}
                </span>
              </div>
              <p className="dojazd-flix-trasa">
                {t.skad}
                <SolarIcon name="arrow-right" size="0.85em" />
                {t.dokad}
              </p>
              <p className="dojazd-podpis">{t.uwaga}</p>
              <a
                className="dojazd-przycisk-drugi"
                href={przewoznik.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("carrier_timetable_open", { carrier: przewoznik.id })}
              >
                <SolarIcon name="arrow-up-right" size="1.05em" />
                {copy.autobus.rozkladLink}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Godzin i cen tych przewoźników nie znamy — mówimy to wprost, zamiast
          podawać liczby bez źródła. */}
      <p className="dojazd-podpis">{copy.autobus.brakGodzin}</p>
    </div>
  );
}

/* --- Panel boczny: stacja Krzeszowice i mapa przystanku -------------------- */

function StacjaPanel({ copy, tryb }: { copy: DojazdCopy; tryb: TrybDojazdu }) {
  /* Panel pokazuje to, co gość zobaczy jako pierwsze: jadącym pociągiem —
     stację w Krzeszowicach, jadącym autem i FlixBusem — wjazd na teren obiektu
     (FlixBus też zatrzymuje się pod kopułami). Mapa pod zdjęciem pokazuje za to
     miejsce, z którego się wyrusza, dlatego przy FlixBusie wskazuje Kraków MDA. */
  /* Podpis ma trzy piętra: nazwa miejsca, jedno zdanie po co tu jesteś i biała
     plakietka z konkretem. Wszystkie teksty pochodzą z tego, co już stoi w
     `dojazdCopy` — plakietka niczego nie dopowiada, tylko wyciąga na wierzch
     zdanie, które dotąd leżało głębiej na stronie. */
  const foto =
    tryb === "bus"
      ? {
          duze: "/jak-dojechac/dojazd-dworzec.webp",
          male: "/jak-dojechac/dojazd-dworzec-900.webp",
          tytul: copy.pociag.stacja,
          lead: copy.pociag.stacjaLead,
          plakietka: {
            ikona: "walking" as const,
            tytul: copy.pociag.przystanekKrzeszowice,
            opis: copy.pociag.etapy[1].opis,
          },
        }
      : tryb === "flix"
        ? {
            duze: "/jak-dojechac/dojazd-wjazd.webp",
            male: "/jak-dojechac/dojazd-wjazd-900.webp",
            tytul: copy.miejsce.punkty.wjazd.nazwa,
            lead: copy.autobus.przewoznicy.flixbus.uwaga,
            plakietka: {
              ikona: "bus" as const,
              tytul: copy.miejsce.punkty.wejscie.nazwa,
              opis: copy.miejsce.punkty.wejscie.opis,
            },
          }
        : {
            duze: "/jak-dojechac/dojazd-wjazd.webp",
            male: "/jak-dojechac/dojazd-wjazd-900.webp",
            tytul: copy.miejsce.punkty.wjazd.nazwa,
            lead: copy.miejsce.wjazdKrotko,
            plakietka: {
              ikona: "parking" as const,
              tytul: copy.miejsce.punkty.wejscie.nazwa,
              opis: copy.miejsce.punkty.wejscie.opis,
            },
          };

  const zrodloMapy =
    tryb === "bus"
      ? MAPA_PRZYSTANKU_EMBED
      : tryb === "flix"
        ? MAPA_FLIXBUS_EMBED
        : MAPA_OBIEKTU_EMBED;

  /* Ramka z Google potrafi wstawać kilka sekund, a `loading="lazy"` odkłada
     pobranie do chwili, gdy kafel zbliży się do kadru — do tego czasu w kafelku
     nie ma nic. Szkielet zajmuje to miejsce od pierwszej klatki (jest już
     w statycznym HTML-u, więc nic nie przeskakuje po hydracji) i znika na
     zdarzenie `load`. `load` przychodzi nawet wtedy, gdy ramkę zablokuje
     rozszerzenie — czyli szkielet może zniknąć za wcześnie, ale nigdy nie
     zostanie na ekranie na zawsze. */
  const [mapaGotowa, setMapaGotowa] = useState(false);
  useEffect(() => {
    setMapaGotowa(false);
  }, [zrodloMapy]);

  /* Ramka wchodzi do drzewa dopiero, gdy kafel mapy zbliży się do kadru.
     `loading="lazy"` samo NIE wystarcza: przy ramkach próg jest bardzo luźny
     i przeglądarka pobiera je z dużym wyprzedzeniem. Zmierzone — na telefonie
     mapa ściągała 1715 kB, choć leży pod zgięciem i gość mógł tam nigdy nie
     dojechać. Obserwator odłącza się po pierwszym trafieniu, a `rootMargin`
     daje 400 px zapasu, żeby mapa zdążyła się wczytać przed dojściem wzroku. */
  const kafelMapyRef = useRef<HTMLDivElement>(null);
  const [mapaPotrzebna, setMapaPotrzebna] = useState(false);
  useEffect(() => {
    const el = kafelMapyRef.current;
    if (!el || mapaPotrzebna) return;
    if (typeof IntersectionObserver === "undefined") {
      setMapaPotrzebna(true);
      return;
    }
    const obs = new IntersectionObserver(
      (wpisy) => {
        if (wpisy.some((w) => w.isIntersecting)) {
          setMapaPotrzebna(true);
          obs.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mapaPotrzebna]);

  /* Podglad zdjecia. Natywny <dialog> w trybie modalnym daje Escape, pulapke
     fokusa i przywrocenie fokusa do przycisku za darmo — recznie trzeba tylko
     zsynchronizowac stan i zablokowac przewijanie tla. */
  const podgladRef = useRef<HTMLDialogElement>(null);
  const [podglad, setPodglad] = useState(false);
  useEffect(() => {
    const d = podgladRef.current;
    if (!d) return;
    if (podglad && !d.open) d.showModal();
    if (!podglad && d.open) d.close();
    document.documentElement.classList.toggle("dojazd-bez-przewijania", podglad);
    return () => document.documentElement.classList.remove("dojazd-bez-przewijania");
  }, [podglad]);

  return (
    <div className="dojazd-stacja">
      <figure
        /* „Samochodem" i „FlixBus" pokazuja to samo zdjecie wjazdu — wczesniej
           auto mialo wlasne kadrowanie (`is-wjazd`, object-position 68%), wiec
           ten sam plik wygladal w obu zakladkach inaczej. */
        className={`dojazd-stacja-foto ${tryb === "bus" ? "" : "is-tytul-szeroki"}`}
      >
        <picture>
          <source media="(max-width: 767px)" srcSet={foto.male} />
          <img
            src={foto.duze}
            alt={foto.tytul}
            width={1366}
            height={1024}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <figcaption className="dojazd-stacja-podpis">
          <span className="dojazd-stacja-tytul">{foto.tytul}</span>
          <span className="dojazd-stacja-opis">{foto.lead}</span>
          <span className="dojazd-stacja-plakietka">
            <span className="dojazd-stacja-plakietka-ikona" aria-hidden="true">
              <SolarIcon name={foto.plakietka.ikona} size="1.075em" />
            </span>
            <span className="dojazd-stacja-plakietka-tekst">
              <span className="dojazd-stacja-plakietka-tytul">{foto.plakietka.tytul}</span>
              <span className="dojazd-stacja-plakietka-opis">{foto.plakietka.opis}</span>
            </span>
          </span>
        </figcaption>

        {/* Tylko na telefonie: tam kadr jest maly, a szczegoly (tablice,
            kierunki) nieczytelne. Na szerokim ekranie zdjecie jest juz duze. */}
        <button
          type="button"
          className="dojazd-stacja-powieksz"
          onClick={() => setPodglad(true)}
        >
          <SolarIcon name="full-screen" size="1.05em" />
          <span className="dojazd-sr">{copy.miejsce.powieksz}</span>
        </button>
      </figure>

      <dialog
        ref={podgladRef}
        className="dojazd-podglad"
        aria-label={foto.tytul}
        onClose={() => setPodglad(false)}
        onClick={(e) => {
          if (e.target === podgladRef.current) setPodglad(false);
        }}
      >
        <img className="dojazd-podglad-foto" src={foto.duze} alt={foto.tytul} />
        <button
          type="button"
          className="dojazd-podglad-zamknij"
          onClick={() => setPodglad(false)}
        >
          <SolarIcon name="close" size="1.1em" weight="bold" />
          <span className="dojazd-sr">{copy.miejsce.zamknij}</span>
        </button>
        <p className="dojazd-podglad-podpis">{foto.tytul}</p>
      </dialog>

      {/* Mapa dopiero na żądanie — ramka z obcej domeny zgłasza „load" nawet
          wtedy, gdy zablokuje ją rozszerzenie, więc odnośnik do trasy stoi
          POZA ramką i działa niezależnie od niej. */}
      {/* Mała mapa od razu, bez klikania: przy pociągu — przystanek w
          Krzeszowicach, przy samochodzie — sam obiekt. `loading="lazy"` sprawia,
          że ramka pobiera się dopiero, gdy zbliży się do kadru. Odnośnik do
          trasy stoi POZA ramką, bo ramki z obcej domeny nie da się sprawdzić —
          zgłasza „load" nawet wtedy, gdy zablokuje ją rozszerzenie. */}
      <div
        ref={kafelMapyRef}
        className={`dojazd-stacja-mapa ${mapaGotowa ? "is-gotowa" : "is-laduje"}`}
        aria-busy={mapaPotrzebna && !mapaGotowa ? true : undefined}
      >
        {/* Zarys ulic stoi zawsze; kółko i napis dopiero wtedy, gdy pobieranie
            naprawdę ruszyło — inaczej obiecywałyby ładowanie, którego nie ma. */}
        <span className="dojazd-mapa-szkielet" aria-hidden="true">
          {mapaPotrzebna ? (
            <>
              <span className="dojazd-mapa-szkielet-spinner" />
              <span className="dojazd-mapa-szkielet-napis">{copy.mapa.ladowanieHaslo}</span>
            </>
          ) : null}
        </span>
        <span className="dojazd-sr" role="status">
          {mapaPotrzebna && !mapaGotowa ? copy.mapa.ladowanie : ""}
        </span>
        {mapaPotrzebna ? (
          <iframe
            key={zrodloMapy}
            title={tryb === "bus" ? copy.pociag.mapaPrzystanku : copy.mapa.naglowek}
            src={zrodloMapy}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            onLoad={() => setMapaGotowa(true)}
          />
        ) : null}
      </div>
      {tryb === "auto" ? <p className="dojazd-stacja-adres">{OBIEKT.adres}</p> : null}
      {tryb === "flix" ? (
        <p className="dojazd-stacja-adres">{copy.autobus.przewoznicy.flixbus.skad}</p>
      ) : null}
    </div>
  );
}

/* --- FAQ + kafel kontaktowy ------------------------------------------------
   Odpowiedzi nie są pisane od nowa: każda to zdanie, które już stoi na tej
   stronie i zostało zweryfikowane. Dzięki temu FAQ nie może zacząć mówić
   czegoś innego niż reszta treści.
   --------------------------------------------------------------------------- */

function FaqKontakt({ copy, loc }: { copy: DojazdCopy; loc: Locale }) {
  const pytania = [
    { id: "dni", pytanie: copy.faq.pytania.dni, odpowiedz: copy.pociag.lead },
    { id: "skad", pytanie: copy.faq.pytania.skad, odpowiedz: copy.pociag.etapy[1].opis },
    { id: "parking", pytanie: copy.faq.pytania.parking, odpowiedz: copy.miejsce.punkty.wjazd.opis },
    { id: "inne", pytanie: copy.faq.pytania.inne, odpowiedz: copy.autobus.lead },
  ];

  return (
    <section className="dojazd-faq" aria-labelledby="dojazd-faq-tytul" data-ujawnij>
      <div className="dojazd-faq-lista">
        <h2 id="dojazd-faq-tytul" className="dojazd-faq-tytul">
          {copy.faq.title}
        </h2>
        {pytania.map((p) => (
          <Rozwijane prefiks="dojazd" key={p.id} etykieta={p.pytanie} wariant="wiersz">
            <p className="dojazd-podpis">{p.odpowiedz}</p>
          </Rozwijane>
        ))}
      </div>

      <aside className="dojazd-faq-kontakt" data-ujawnij>
        <img
          className="dojazd-faq-alver"
          src="/jak-dojechac/dojazd-bus.webp"
          alt=""
          aria-hidden="true"
          width={488}
          height={415}
          loading="lazy"
          decoding="async"
        />
        <h3 className="dojazd-faq-kontakt-tytul">{copy.pomoc.title}</h3>
        <p className="dojazd-faq-kontakt-lead">{copy.pomoc.lead}</p>
        <div className="dojazd-faq-kontakt-akcje">
          <a
            className="dojazd-przycisk-glowny"
            href={`tel:${TELEFON.replace(/\s/g, "")}`}
            onClick={() => trackEvent("contact_click", { method: "phone", location: "jak_dojechac_faq" })}
          >
            <SolarIcon name="phone" size="1.05em" />
            {copy.pomoc.telefon}
          </a>
          <a
            className="dojazd-przycisk-drugi"
            href={`mailto:${EMAIL}`}
            onClick={() => trackEvent("contact_click", { method: "email", location: "jak_dojechac_faq" })}
          >
            <SolarIcon name="letter" size="1.05em" />
            {copy.pomoc.email}
          </a>
        </div>
        <Link className="dojazd-faq-kontakt-link" href={getLocalizedPath("/kontakt", loc)}>
          {TELEFON} · {EMAIL}
        </Link>
      </aside>
    </section>
  );
}

/* --- „W okolicy": pas na pełną szerokość ekranu z karuzelą -----------------
   Zdjęć atrakcji nie ma w repozytorium, a podstawienie pod nie kopuł Alvernii
   byłoby dezinformacją — kartę niesie więc duża odległość i nazwa.
   --------------------------------------------------------------------------- */

function OkolicaSekcja({ copy }: { copy: DojazdCopy }) {
  const pas = useRef<HTMLUListElement | null>(null);

  const przesun = (kierunek: 1 | -1) => {
    const el = pas.current;
    if (!el) return;
    const karta = el.querySelector<HTMLElement>(".dojazd-okolica-karta");
    const krok = karta ? karta.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: krok * kierunek, behavior: "smooth" });
  };

  return (
    <section className="dojazd-okolica-sekcja" aria-labelledby="dojazd-atrakcje-tytul" data-ujawnij>
      <div className="dojazd-okolica-naglowek">
        <div className="dojazd-okolica-naglowek-tekst">
          <h2 id="dojazd-atrakcje-tytul" className="dojazd-okolica-tytul">
            {copy.okolica.title}
          </h2>
          <p className="dojazd-okolica-lead">{copy.atrakcje.title}</p>
        </div>
        <div className="dojazd-okolica-sterowanie">
          <button
            type="button"
            className="dojazd-okolica-strzalka-przycisk"
            aria-label={copy.okolica.poprzednie}
            onClick={() => przesun(-1)}
          >
            <SolarIcon name="arrow-left" size="1.15em" />
          </button>
          <button
            type="button"
            className="dojazd-okolica-strzalka-przycisk"
            aria-label={copy.okolica.nastepne}
            onClick={() => przesun(1)}
          >
            <SolarIcon name="arrow-right" size="1.15em" />
          </button>
        </div>
      </div>

      <ul role="list" className="dojazd-okolica-karty" ref={pas}>
        {ATRAKCJE_OKOLICY.map((a) => (
          <li key={a.id} className="dojazd-okolica-karta">
            <a
              className="dojazd-okolica-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                copy.okolica.nazwy[a.id]
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("nearby_open", { place: a.id })}
            >
              <img
                className="dojazd-okolica-foto"
                src={`/jak-dojechac/okolica-${a.id}.webp`}
                alt=""
                aria-hidden="true"
                width={640}
                height={427}
                loading="lazy"
                decoding="async"
              />
              <span className="dojazd-okolica-tresc">
                <span className="dojazd-okolica-nazwa">{copy.okolica.nazwy[a.id]}</span>
                <span className="dojazd-okolica-dystans">
                  {a.km} {copy.okolica.unit}
                </span>
              </span>
              <span className="dojazd-okolica-strzalka" aria-hidden="true">
                <SolarIcon name="arrow-right" size="1.05em" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="dojazd-okolica-nota">{copy.okolica.orientacyjne}</p>
    </section>
  );
}

/* --- Rozkład busa: pas na pełną szerokość pod kolumnami -------------------- */

function RozkladBusa({ copy, chwila }: { copy: DojazdCopy; chwila: ChwilaObiektu | null }) {
  const idRozkladu = useId();
  /* Na telefonie widać jeden dzień naraz — przełącznik poniżej. Domyślnie ten,
     w którym wypada najbliższy kurs. Zanim policzy się „teraz”, oba bloki są
     widoczne, żeby statyczny HTML był kompletny także bez JS. */
  const [dzienMobile, setDzienMobile] = useState<5 | 6>(5);
  const odjazdTam = chwila ? najblizszyOdjazd("doObiektu", chwila) : null;
  const odjazdPowrot = chwila ? najblizszyOdjazd("doKrzeszowic", chwila) : null;
  const formatDaty = useMemo(
    () => new Intl.DateTimeFormat(copy.meta.locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }),
    [copy.meta.locale]
  );
  const nazwaDaty = (iso: string) => {
    const [r, m, d] = iso.split("-").map(Number);
    return formatDaty.format(new Date(Date.UTC(r, m - 1, d)));
  };

  /* Klasyczna tabela: wiersz = kurs, kolumny = godziny odjazdu z obu krańców.
     Nie łączymy ich w „odjazd → przyjazd", bo czasu przejazdu nie znamy —
     każda kolumna mówi wprost, skąd o której odjeżdża bus. */
  /* Blok, w którym wypada najbliższy kurs: piątek ma swój, sobota i niedziela
     dzielą jeden (mają identyczne godziny). */
  const blokDnia = (o: { data: string } | null) => (o ? (dzienTygodnia(o.data) === 5 ? 5 : 6) : null);
  const blokTam = blokDnia(odjazdTam);
  const blokPowrot = blokDnia(odjazdPowrot);

  useEffect(() => {
    if (blokTam) setDzienMobile(blokTam);
  }, [blokTam]);

  /* „za N min” tylko dla kursu dzisiejszego i tylko w rozsądnym oknie —
     przy sześciu godzinach zapasu ta informacja nic nie wnosi. */
  const doOdjazdu =
    chwila && odjazdTam && odjazdTam.data === chwila.data
      ? naMinuty(odjazdTam.godzina) - chwila.minuty
      : null;
  const zaIle = doOdjazdu !== null && doOdjazdu > 0 && doOdjazdu <= 90 ? doOdjazdu : null;

  const tabela = (dzien: 5 | 6, tytul: string) => {
    const tam = BUS.kursy.doObiektu[dzien] ?? [];
    const powrot = BUS.kursy.doKrzeszowic[dzien] ?? [];
    return (
      <div
        key={tytul}
        className={`dojazd-tabela-blok ${chwila && dzienMobile !== dzien ? "is-ukryty" : ""}`}
      >
        <h3 className="dojazd-tabela-tytul">{tytul}</h3>
        <table className="dojazd-tabela">
          <caption className="dojazd-sr">
            {tytul}: {copy.pociag.odjazdZ.krzeszowice}, {copy.pociag.odjazdZ.obiekt}
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <SolarIcon name="arrow-right" size="0.85em" className="dojazd-tabela-kierunek" />
                {copy.pociag.odjazdZ.krzeszowice}
              </th>
              <th scope="col">
                <SolarIcon name="arrow-left" size="0.85em" className="dojazd-tabela-kierunek" />
                {copy.pociag.odjazdZ.obiekt}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Wierszy tyle, ile ma DLUZSZA z dwoch kolumn. Wczesniej petla szla
                po kursach do obiektu, wiec powroty ponad ich liczbe w ogole nie
                trafialy do tabeli — po dopisaniu kursu 20:30 w piatek i 18:30
                w weekend znikaly bez sladu. Brakujaca komorka dostaje „—". */}
            {Array.from({ length: Math.max(tam.length, powrot.length) }, (_, i) => {
              const godzina = tam[i];
              const dzisiaj = chwila?.dzien === dzien || (dzien === 6 && chwila?.dzien === 0);
              /* Każda komórka liczy się osobno. Wcześniej klasa „minęło" siadała
                 na całym wierszu i brała godzinę TYLKO z kolumny z Krzeszowic —
                 w sobotę o 14:20 przekreślała więc także powrót o 14:30, który
                 odjeżdża sprzed obiektu za dziesięć minut. */
              const poCzasie = (g?: string) =>
                Boolean(dzisiaj && chwila && g && naMinuty(g) <= chwila.minuty);
              const nastepnyTam = blokTam === dzien && odjazdTam?.godzina === godzina;
              const nastepnyPowrot = blokPowrot === dzien && odjazdPowrot?.godzina === powrot[i];
              const klasa = (minelo: boolean, nastepny: boolean) =>
                `${minelo ? "is-past" : ""} ${nastepny ? "is-next" : ""}`.trim();
              return (
                <tr key={`${godzina ?? "-"}|${powrot[i] ?? "-"}`}>
                  <td className={klasa(poCzasie(godzina), nastepnyTam)}>
                    {nastepnyTam ? <span className="dojazd-sr">{copy.pociag.najblizszy}: </span> : null}
                    {godzina ? <time dateTime={godzina}>{godzina}</time> : "—"}
                  </td>
                  <td className={klasa(poCzasie(powrot[i]), nastepnyPowrot)}>
                    {nastepnyPowrot ? <span className="dojazd-sr">{copy.pociag.najblizszy}: </span> : null}
                    {powrot[i] ? <time dateTime={powrot[i]}>{powrot[i]}</time> : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (BUS.obowiazujeDo && chwila && chwila.data > BUS.obowiazujeDo) return null;

  return (
    <section id={idRozkladu} className="dojazd-rozklad" aria-labelledby="dojazd-rozklad-tytul">
      <h2 id="dojazd-rozklad-tytul" className="dojazd-rozklad-tytul">
        {copy.pociag.rozkladTytul}
      </h2>

      <div className="dojazd-rozklad-uklad">
        {/* Kolumna boczna: najbliższy kurs i skąd jest jak daleko. */}
        <div className="dojazd-rozklad-bok">
          {/* Dwa kierunki: bus do obiektu i powrót do Krzeszowic. Każdy ma
              własny najbliższy kurs — po ostatnim odjeździe z Krzeszowic
              powrót zwykle jeszcze jest. */}
          <div className="dojazd-najblizszy">
            {/* Kropka zapala sie dopiero, gdy znamy „teraz" — czyli po hydracji,
                dokladnie wtedy, gdy godziny sa liczone wzgledem biezacej chwili.
                W statycznym HTML-u jej nie ma, wiec nie obiecuje swiezosci,
                ktorej w tym momencie nie ma. Sama dekoracja: informacje niesie
                tekst obok, stad `aria-hidden`. */}
            <p className="dojazd-najblizszy-etykieta">
              {chwila ? <span className="dojazd-najblizszy-lampka" aria-hidden="true" /> : null}
              {copy.pociag.najblizszy}
            </p>
            {odjazdTam || odjazdPowrot ? (
              <ul role="list" className="dojazd-najblizszy-lista">
                {/* Każdy kurs to osobna biała karta: skąd → dokąd w jednym
                    rzędzie, godzina pod spodem. Ikona przy Krzeszowicach to
                    pociąg (przystanek stoi przy dworcu PKP), przy obiekcie —
                    planeta, bo tak nazywa się miejsce docelowe. */}
                {([
                  {
                    klucz: "tam",
                    odjazd: odjazdTam,
                    skad: { ...copy.pociag.punkty.krzeszowice, ikona: "train" },
                    dokad: { ...copy.pociag.punkty.obiekt, ikona: "planet" },
                  },
                  {
                    klucz: "powrot",
                    odjazd: odjazdPowrot,
                    skad: { ...copy.pociag.punkty.obiekt, ikona: "planet" },
                    dokad: { ...copy.pociag.punkty.krzeszowice, ikona: "train" },
                  },
                ] as const).map((poz) =>
                  poz.odjazd ? (
                    <li key={poz.klucz} className="dojazd-najblizszy-poz">
                      <span className="dojazd-najblizszy-trasa">
                        {([poz.skad, poz.dokad] as const).map((punkt, i) => (
                          <Fragment key={punkt.nazwa}>
                            {i === 1 ? (
                              <SolarIcon
                                name="arrow-right"
                                size="1.1em"
                                weight="bold"
                                className="dojazd-najblizszy-strzalka"
                              />
                            ) : null}
                            <span className="dojazd-najblizszy-punkt">
                              <span className="dojazd-najblizszy-punkt-ikona" aria-hidden="true">
                                <SolarIcon name={punkt.ikona} size="1.05em" />
                              </span>
                              <span className="dojazd-najblizszy-punkt-tekst">
                                <span className="dojazd-najblizszy-punkt-nazwa">{punkt.nazwa}</span>
                                <span className="dojazd-najblizszy-punkt-opis">{punkt.opis}</span>
                              </span>
                            </span>
                          </Fragment>
                        ))}
                      </span>
                      <span className="dojazd-najblizszy-godzina">
                        <time dateTime={`${poz.odjazd.data}T${poz.odjazd.godzina}`}>{poz.odjazd.godzina}</time>
                        <span className="dojazd-najblizszy-dzien">
                          {chwila && poz.odjazd.data === chwila.data
                            ? copy.pociag.dzis
                            : nazwaDaty(poz.odjazd.data)}
                        </span>
                        {poz.klucz === "tam" && zaIle !== null ? (
                          <span className="dojazd-najblizszy-za">{copy.pociag.zaMin(zaIle)}</span>
                        ) : null}
                      </span>
                    </li>
                  ) : null
                )}
              </ul>
            ) : (
              /* Przed hydracją (i w statycznym HTML-u) nie znamy „teraz", więc
                 stoi tu zdanie niezależne od zegara. Pudełko nigdy nie jest
                 puste, więc układ nie przeskakuje. */
              <p className="dojazd-najblizszy-skad">{copy.pociag.lead}</p>
            )}

            <img
              className="dojazd-najblizszy-alver"
              src="/jak-dojechac/dojazd-bus.webp"
              alt=""
              aria-hidden="true"
              width={488}
              height={415}
              loading="lazy"
              decoding="async"
            />
          </div>

        </div>

        <div className="dojazd-rozklad-tabele">
          {/* Telefon: jeden dzień naraz. Desktop: oba obok siebie, przełącznik
              jest wtedy zbędny i znika. */}
          <div className="dojazd-rozklad-przelacznik" role="group" aria-label={copy.pociag.pelnyRozklad}>
            {([
              { dzien: 5 as const, etykieta: copy.pociag.dni.piatek },
              { dzien: 6 as const, etykieta: copy.pociag.dni.weekend },
            ]).map((d) => (
              <button
                key={d.dzien}
                type="button"
                aria-pressed={dzienMobile === d.dzien}
                className={`dojazd-rozklad-dzien ${dzienMobile === d.dzien ? "is-active" : ""}`}
                onClick={() => setDzienMobile(d.dzien)}
              >
                {d.etykieta}
              </button>
            ))}
          </div>

          {/* `key` na dniu: przy zmianie przelacznika React podmienia wezel,
              wiec animacja wejscia odtwarza sie od nowa. Bez tego zmiana dnia
              byla skokiem — ukryty dzien ma `display: none`, czego nie da sie
              przeprowadzic zadnym przejsciem. */}
          <div key={dzienMobile} className="dojazd-rozklad-dni dojazd-zmiana">
            {tabela(5, copy.pociag.dni.piatek)}
            {tabela(6, copy.pociag.dni.weekend)}
          </div>
        </div>
      </div>

    </section>
  );
}

/* --- Panel: POCIĄG + BUS --------------------------------------------------- */

function PanelBus({ copy, chwila }: { copy: DojazdCopy; chwila: ChwilaObiektu | null }) {
  const rozkladWygasl = Boolean(BUS.obowiazujeDo && chwila && chwila.data > BUS.obowiazujeDo);
  /* Trzeci krok („jesteś na miejscu") dostaje tu taki sam kształt jak dwa
     pierwsze, żeby numeracja szła 1–2–3 bez wyjątku w rozgałęzieniu. */
  const kroki = [
    ...copy.pociag.etapy,
    { nazwa: copy.pociag.naMiejscu, opis: copy.pociag.naMiejscuOpis },
  ];

  return (
    <div className="dojazd-panel-tresc">
      <h2 className="dojazd-panel-tytul">{copy.pociag.title}</h2>
      <p className="dojazd-panel-lead">{copy.pociag.lead}</p>

      {/* Łańcuch kroków: pociąg → bus → na miejscu. Kółka spina pionowa linia
          zakończona grotem, żeby było widać, że to kolejne etapy jednej drogi,
          a nie lista niezależnych punktów. Numer zamiast ikony, bo o kolejności
          mówi wprost cyfra — ikona pociągu i busa powtarzała tylko to, co i tak
          stoi w nazwie kroku. */}
      <ol className="dojazd-etapy">
        {kroki.map((krok, i) => (
          <li key={krok.nazwa} className={`dojazd-etap ${i === kroki.length - 1 ? "is-meta" : ""}`}>
            <span className="dojazd-etap-numer" aria-hidden="true">
              {i + 1}
            </span>
            <span className="dojazd-etap-tekst">
              <span className="dojazd-etap-nazwa">{krok.nazwa}</span>
              <span className="dojazd-etap-opis">{krok.opis}</span>
            </span>
          </li>
        ))}
      </ol>

      {rozkladWygasl ? (
        <p className="dojazd-uwaga">{copy.pociag.rozkladWygasl}</p>
      ) : (
        <>
          <a
            className="dojazd-przycisk-glowny"
            data-dojazd-cta="bus"
            href={linkTrasyDoPrzystanku(PRZYSTANKI.krzeszowice)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("directions_open", { mode: "shuttle", from: "doObiektu" })}
          >
            <SolarIcon name="route" size="1.05em" />
            {copy.pociag.trasaDoPrzystanku}
          </a>

          {/* Rozkład pociągów schodzi pod przycisk: to akcja poboczna, a w kroku
              pierwszym rozbijała rytm numerowanej listy. */}
          <a
            className="dojazd-przycisk-link is-lewo"
            href={ROZKLAD_POCIAGOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("train_timetable_open", {})}
          >
            {copy.pociag.rozkladPociagow}
            <SolarIcon name="external-link" size="0.9em" />
          </a>
        </>
      )}
    </div>
  );
}

/* --- Inni przewoźnicy (zwinięci wewnątrz panelu busa) ---------------------- */

function ListaPrzewoznikow({ copy }: { copy: DojazdCopy }) {
  return (
    <div>
      <p className="dojazd-podpis">{copy.autobus.lead}</p>

      <ul role="list" className="dojazd-przewoznicy">
        {PRZEWOZNICY.map((p) => {
          const t = copy.autobus.przewoznicy[p.id];
          return (
            <li key={p.id} className="dojazd-przewoznik">
              <div className="dojazd-przewoznik-glowa">
                <span className="dojazd-przewoznik-nazwa">{t.nazwa}</span>
                <span className={`dojazd-plakietka ${p.dowozPodObiekt ? "is-bezposrednio" : ""}`}>
                  {p.dowozPodObiekt ? copy.autobus.dowozi : copy.autobus.ostatniOdcinek}
                </span>
              </div>
              <p className="dojazd-przewoznik-trasa">
                {t.skad}
                <SolarIcon name="arrow-right" size="0.85em" className="dojazd-przewoznik-strzalka" />
                {t.dokad}
              </p>
              <a
                className="dojazd-przycisk-drugi"
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("carrier_timetable_open", { carrier: p.id })}
              >
                <SolarIcon name="arrow-up-right" size="1.05em" />
                {copy.autobus.rozkladLink}
              </a>
              <Rozwijane prefiks="dojazd" etykieta={copy.autobus.szczegoly} onOtwarcie={() => trackEvent("carrier_expand", { carrier: p.id })}>
                <p className="dojazd-podpis">{t.uwaga}</p>
                <p className="dojazd-podpis">{copy.autobus.brakGodzin}</p>
              </Rozwijane>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* --- Strona ---------------------------------------------------------------- */

/* Kolejność i wybór startowy: bus pierwszy — to jego rozkład jest treścią,
   po którą gość tu przychodzi. */
const TRYBY: TrybDojazdu[] = ["bus", "auto", "flix"];
const IKONY: Record<TrybDojazdu, "car" | "train" | "bus"> = {
  auto: "car",
  bus: "train",
  flix: "bus",
};

export default function JakDojechacPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = DOJAZD_COPY[loc];

  /* Domyślnie „Auto" — decyzja tego prototypu, nie wniosek z danych o ruchu. */
  const [tryb, setTryb] = useState<TrybDojazdu>("bus");
  useUjawnianie(".dojazd-page");
  const [chwila, setChwila] = useState<ChwilaObiektu | null>(null);
  const zakladkiRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const zadanieFokusu = useRef<TrybDojazdu | null>(null);

  useEffect(() => {
    const odswiez = () => setChwila(terazWObiekcie());
    odswiez();
    const zegar = window.setInterval(odswiez, 30000);
    return () => window.clearInterval(zegar);
  }, []);

  /* Bezpośredni odnośnik do wariantu: /jak-dojechac#bus albo ?tryb=pociag. */
  useEffect(() => {
    const zAdresu = () => {
      const hash = window.location.hash.replace("#", "");
      const zQuery = new URLSearchParams(window.location.search).get("tryb");
      const surowy = zQuery || hash;
      /* Stare odnośniki prowadziły do wariantów „pociag" i „autobus" — teraz
         oba mieszczą się w jednej zakładce „Bus". */
      const kandydat = (surowy === "pociag" || surowy === "autobus" ? "bus" : surowy) as TrybDojazdu;
      if (TRYBY.includes(kandydat)) setTryb(kandydat);
    };
    zAdresu();
    window.addEventListener("hashchange", zAdresu);
    return () => window.removeEventListener("hashchange", zAdresu);
  }, []);

  const wybierzTryb = useCallback((nowy: TrybDojazdu) => {
    setTryb(nowy);
    trackEvent("travel_mode_select", { mode: nowy });
  }, []);

  useEffect(() => {
    const docelowy = zadanieFokusu.current;
    if (!docelowy) return;
    zadanieFokusu.current = null;
    const przyciski = zakladkiRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    przyciski?.[TRYBY.indexOf(docelowy)]?.focus();
  }, [tryb]);

  const naKlawisz = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const zFokusem = (document.activeElement as HTMLElement | null)?.id?.replace("dojazd-tab-", "");
    const i = TRYBY.includes(zFokusem as TrybDojazdu)
      ? TRYBY.indexOf(zFokusem as TrybDojazdu)
      : TRYBY.indexOf(tryb);
    let nowy: TrybDojazdu | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") nowy = TRYBY[(i + 1) % TRYBY.length];
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") nowy = TRYBY[(i - 1 + TRYBY.length) % TRYBY.length];
    if (e.key === "Home") nowy = TRYBY[0];
    if (e.key === "End") nowy = TRYBY[TRYBY.length - 1];
    if (!nowy) return;
    e.preventDefault();
    zadanieFokusu.current = nowy;
    wybierzTryb(nowy);
  };

  return (
    <main className="dojazd-page">
      {/* --- Kompaktowy wstęp: bez zdjęcia, z delikatną poświatą marki -------- */}
      <header className="dojazd-wstep">
        {/* Warstwy nagłówka: granatowa płaszczyzna sekcji, nad nią osobny
            kontener fotografii o własnych wymiarach (na telefonie pas przy
            dolnej krawędzi, na desktopie prawa część), a napisy jeszcze wyżej.
            Fotografia nigdy nie jest tłem rozciągniętym na cały nagłówek. */}
        <div className="dojazd-wstep-foto" aria-hidden="true">
          <picture>
            <source media="(max-width: 1023px)" srcSet="/jak-dojechac/dojazd-wstep-900.webp" />
            {/* To jest element LCP tej podstrony (zmierzone). `fetchPriority`
                kaze przegladarce pobrac go przed reszta obrazow i skryptami,
                zamiast zwyklej kolejki — nic sie przez to nie zmienia
                wizualnie, tylko wczesniej sie pojawia. */}
            <img
              src="/jak-dojechac/dojazd-wstep.webp"
              alt=""
              width={1600}
              height={1200}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
        <div className="dojazd-shell dojazd-wstep-tresc">
          <h1 className="dojazd-wstep-tytul">
            {copy.hero.title}
            {/* Twarde łamanie: druga linia zawsze zaczyna się od łącznika,
                a nazwa obiektu zostaje w kolorze marki. */}
            <br />
            {copy.hero.titleLacznik ? `${copy.hero.titleLacznik} ` : ""}
            <span className="dojazd-wstep-akcent">{copy.hero.titleAkcent}</span>
          </h1>
          <p className="dojazd-wstep-lead">{copy.hero.lead}</p>
        </div>

        {/* Przejscie hero → jasna sekcja. Nalezy do naglowka (absolutnie
            pozycjonowane przy jego dolnej krawedzi), wiec nie tworzy wlasnej
            sekcji i nie przesuwa niczego ponizej. Ksztalt jest asymetryczny:
            z lewej jasne tlo zaczyna sie wyzej, srodek lagodnie opada, prawa
            strona znow sie podnosi — luk ma przypominac krawedz kopuly,
            a nie fale z generatora. `preserveAspectRatio="none"` rozciaga go
            na kazda szerokosc, a wysokosc ustawia CSS. */}
        <svg
          className="dojazd-wstep-fala"
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="dojazd-wstep-fala-ksztalt"
            d="M0,20 C300,2 520,64 760,78 C1020,92 1240,36 1440,46 L1440,96 L0,96 Z"
          />
          {/* Fragment orbity: wlos grubosci 1 px niezaleznie od rozciagniecia
              (`non-scaling-stroke`), biegnie tuz nad krawedzia jasnego tla. */}
          <path
            className="dojazd-wstep-orbita"
            vectorEffect="non-scaling-stroke"
            d="M0,8 C300,-10 520,52 760,66 C1020,80 1240,24 1440,34"
          />
          <circle className="dojazd-wstep-orbita-punkt" cx="760" cy="66" r="4" />
        </svg>
      </header>

      <div className="dojazd-planer">
        <div className="dojazd-shell">
          <div className="dojazd-uklad">
            <div className="dojazd-kolumna">
              <h2 className="dojazd-pytanie" id="dojazd-tryb-label">
                {copy.planer.pytanie}
              </h2>

              <div
                className="dojazd-zakladki"
                role="tablist"
                aria-labelledby="dojazd-tryb-label"
                ref={zakladkiRef}
                onKeyDown={naKlawisz}
              >
                {TRYBY.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    id={`dojazd-tab-${t}`}
                    aria-selected={tryb === t}
                    aria-controls={`dojazd-panel-${t}`}
                    tabIndex={tryb === t ? 0 : -1}
                    className={`dojazd-zakladka ${tryb === t ? "is-active" : ""} ${t === "flix" ? "is-flix" : ""}`}
                    onClick={() => wybierzTryb(t)}
                  >
                    <span className="dojazd-zakladka-znak">
                      <SolarIcon
                        name={IKONY[t]}
                        size="1.1em"
                        weight={tryb === t ? "bold" : "regular"}
                        className="dojazd-zakladka-ikona"
                      />
                    </span>
                    {t === "flix" ? (
                      /* Logotyp zajmuje miejsce napisu: na telefonie wypada
                         wtedy pod ikoną, tak jak etykiety sąsiednich zakładek.
                         Wariant granatowy czyta się i na bieli (16:1),
                         i na zieleni (10:1) — kolorowy miałby na bieli 1,8:1. */
                      <>
                        <img
                          className="dojazd-zakladka-logo"
                          src="/jak-dojechac/flixbus-ink.svg"
                          alt=""
                          aria-hidden="true"
                          width={1024}
                          height={192}
                        />
                        <span className="dojazd-sr">{copy.planer.tryby[t]}</span>
                      </>
                    ) : (
                      <span className="dojazd-zakladka-nazwa">{copy.planer.tryby[t]}</span>
                    )}
                  </button>
                ))}
              </div>

              <div
                className="dojazd-panel"
                role="tabpanel"
                id={`dojazd-panel-${tryb}`}
                aria-labelledby={`dojazd-tab-${tryb}`}
                tabIndex={-1}
                ref={panelRef}
              >
                {/* `key` na opakowaniu: przy zmianie zakladki React podmienia
                    wezel, wiec animacja wejscia odtwarza sie za kazdym razem.
                    Bez tego zagralaby tylko raz, przy pierwszym renderze. */}
                <div key={tryb} className="dojazd-zmiana">
                  {tryb === "auto" ? <PanelAuto copy={copy} /> : null}
                  {tryb === "bus" ? <PanelBus copy={copy} chwila={chwila} /> : null}
                  {tryb === "flix" ? <PanelFlix copy={copy} /> : null}
                </div>
              </div>
            </div>

            <div className="dojazd-kolumna-boczna">
              <div key={tryb} className="dojazd-zmiana">
                <StacjaPanel copy={copy} tryb={tryb} />
              </div>
            </div>

            {/* Rozkład jest trzecim elementem siatki i zajmuje obie kolumny —
                obok tabel mieści się wtedy kafel najbliższego kursu i lista
                miejsc, z których się przyjeżdża. Na telefonie `order` stawia go
                zaraz pod panelem, przed sekcją „Na miejscu". */}
            {tryb === "bus" ? <RozkladBusa copy={copy} chwila={chwila} /> : null}
          </div>


          {/* --- Atrakcje: zwinięte, bo to treść dla tych, którzy mają czas --- */}

        </div>

        {/* Zaraz pod paskiem pomocy — linia kontaktowa schodzi pod sekcję. */}
        <OkolicaSekcja copy={copy} />

        <div className="dojazd-shell">
          <FaqKontakt copy={copy} loc={loc} />
        </div>
      </div>
    </main>
  );
}
