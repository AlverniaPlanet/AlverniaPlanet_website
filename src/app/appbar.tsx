"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import LangSwitcher from "@/app/components/LangSwitcher";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { bookingHomeHref } from "@/lib/booking";
import { OBIEKT } from "@/app/jak-dojechac/dojazdData";
import BrandLogo from "@/app/components/BrandLogo";
import {
  getSitePaths,
  isBareChromeRoute,
  mapToPolishRoute,
  normalizePathname,
  type Locale,
} from "@/lib/localizedRoutes";
import { SolarIcon, type SolarIconName } from "@/app/components/SolarIcon";

type SekcjaMenu = "wizyta" | "onas" | null;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* Mały żółty dzwonek przy zakładce „Grupy" — sygnał, że na tej podstronie
   trwa wydarzenie (Dni otwarte dla nauczycieli, 27–28.08.2026). Żółty jest ten
   sam co data na karcie w hero /grupy (#f6cf3f). Ikona jest dekoracyjna —
   informację niesie sam tekst linku, dlatego aria-hidden. Po zakończeniu
   wydarzenia wystarczy usunąć <EventBell /> z obu linków poniżej. */
function EventBell({ className }: { className?: string }) {
  return (
    <SolarIcon
      name="bell"
      weight="fill"
      className={cx("ap-event-bell h-[1.25em] w-[1.25em] shrink-0 text-[#f6cf3f]", className)}
    />
  );
}

/* Rozwijana pozycja paska.
   Jeden komponent obsługuje wszystkie trzy menu (Atrakcje, Zaplanuj wizytę,
   O nas) — wcześniej ta sama logika timera i najechania była przepisana dwa
   razy, co przy trzecim menu znaczyłoby trzecią kopię.

   Wzorzec „disclosure": przycisk z `aria-expanded` steruje panelem o znanym
   `id`. Panel nie znika w chwili zjechania kursorem — 220 ms zapasu sprawia,
   że przejście myszą z przycisku na listę go nie zamyka. Zamknięty panel jest
   `visibility: hidden` (patrz arkusz), więc nie łapie fokusu tabulatorem. */
function MenuRozwijane({
  etykieta,
  aktywne,
  wyrownanie = "start",
  children,
}: {
  etykieta: string;
  aktywne: boolean;
  wyrownanie?: "start" | "end";
  children: React.ReactNode;
}) {
  const [otwarte, setOtwarte] = useState(false);
  const timer = useRef<number | null>(null);
  const id = useId();
  const sciezka = usePathname();
  /* Czy ostatni wskaźnik był palcem. Decyduje o tym, czy najechanie ma w ogóle
     otwierać panel — patrz komentarz przy `onPointerEnter`. */
  const dotyk = useRef(false);

  const anuluj = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  useEffect(() => anuluj, []);

  /* Panel zamyka się po przejściu na inną stronę. Na myszy robi to `mouseleave`,
     ale na dotyku go nie ma: stuknięcie w pozycję menu przenosi na nową stronę,
     a panel zostawałby otwarty. Nawigacja desktopowa pokazuje się od 1280 px,
     a w tym paśmie są też ekrany dotykowe. */
  useEffect(() => {
    setOtwarte(false);
  }, [sciezka]);

  return (
    <div
      className="relative"
      /* `pointerenter`, nie `mouseenter`: przeglądarki wysyłają po dotknięciu
         także zgodnościowe zdarzenia myszy, więc stuknięcie w pozycję menu
         dawało najpierw `mouseenter` (panel się otwierał), a zaraz potem
         `click` (przełącznik go zamykał) — na ekranie dotykowym panelu nie
         dało się otworzyć w ogóle. Tutaj znamy rodzaj wskaźnika: palec nie
         otwiera niczym najechaniem, od tego ma przełącznik. */
      onPointerEnter={(e) => {
        dotyk.current = e.pointerType === "touch";
        if (dotyk.current) return;
        anuluj();
        setOtwarte(true);
      }}
      onMouseLeave={() => {
        if (dotyk.current) return;
        anuluj();
        timer.current = window.setTimeout(() => setOtwarte(false), 220);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOtwarte(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && otwarte) {
          setOtwarte(false);
          (e.currentTarget.querySelector("button") as HTMLButtonElement | null)?.focus();
        }
      }}
    >
      <button
        type="button"
        className={cx("ap-nav-link ap-nav-link-button inline-flex items-center gap-1.5", aktywne && "is-active")}
        aria-expanded={otwarte}
        aria-controls={id}
        onClick={() => setOtwarte((v) => !v)}
      >
        {etykieta}
        <SolarIcon
          name="chevron-down"
          weight="bold"
          className={cx("h-3.5 w-3.5 transition-transform duration-200", otwarte && "rotate-180")}
        />
      </button>
      <div
        id={id}
        className={cx("ap-nav-panel-wrap", wyrownanie === "end" ? "right-0" : "left-0", otwarte && "is-otwarte")}
      >
        <div className="ap-nav-panel">{children}</div>
      </div>
    </div>
  );
}

/* Pozycja w rozwijanym menu. Opis pod tytułem dokładamy tam, gdzie naprawdę
   pomaga w skanowaniu (menu wizyty); przy samych nazwach atrakcji byłby
   szumem, więc jest opcjonalny. */
function PozycjaPanelu({
  href,
  tytul,
  opis,
  ikona,
  obrazek,
  aktywne,
}: {
  href: string;
  tytul: string;
  opis?: string;
  ikona?: SolarIconName;
  /** Własny znak atrakcji (plik) zamiast ikony z paczki. */
  obrazek?: string;
  aktywne: boolean;
}) {
  return (
    <Link
      href={href}
      /* Pozycje rozwijanych paneli sa w DOM-ie od pierwszej klatki, tylko
         ukryte — a Next traktuje je jak widoczne i pobiera z gory ich trasy.
         Zmierzone: na desktopie dawalo to 14 pobranych tras i 22 dodatkowe
         paczki JS przed zdarzeniem `load`, dla stron, ktorych gosc moze nigdy
         nie odwiedzic. Osiem najwazniejszych tras i tak pobiera z wyprzedzeniem
         `RoutePrefetcher` — swiadomie, w bezczynnosci i z pominieciem trybu
         oszczedzania danych. Tu wylaczamy tylko to dublowanie. */
      prefetch={false}
      className={cx("ap-nav-panel-item", !opis && "is-jednowierszowa", aktywne && "is-active")}
      aria-current={aktywne ? "page" : undefined}
    >
      {obrazek ? (
        /* `alt=""`, bo znaczenie niesie etykieta obok — czytnik ekranu nie ma
           powtarzać nazwy atrakcji dwa razy. */
        <img
          src={obrazek}
          alt=""
          width={96}
          height={96}
          decoding="async"
          className="ap-nav-panel-ikona h-[1.15rem] w-[1.15rem]"
        />
      ) : ikona ? (
        <SolarIcon name={ikona} className="ap-nav-panel-ikona h-[1.15rem] w-[1.15rem]" />
      ) : null}
      <span className="min-w-0">
        <span className="ap-nav-panel-tytul">{tytul}</span>
        {opis ? <span className="ap-nav-panel-opis">{opis}</span> : null}
      </span>
    </Link>
  );
}

/* Rozwijana sekcja menu mobilnego (akordeon).
   Otwarty jest najwyżej jeden — stan trzyma rodzic, więc kliknięcie w drugą
   sekcję zamyka pierwszą i lista nie rozjeżdża się poza ekran. Wysokość
   animujemy siatką `0fr → 1fr`, bo `height: auto` nie da się animować. */
function SekcjaMobilna({
  klucz,
  etykieta,
  ikona,
  aktywne,
  otwarta,
  przelacz,
  children,
}: {
  klucz: SekcjaMenu;
  etykieta: string;
  ikona: SolarIconName;
  aktywne: boolean;
  otwarta: boolean;
  przelacz: (k: SekcjaMenu) => void;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <>
      <button
        type="button"
        className={cx("ap-mobile-wiersz ap-mobile-wiersz-przycisk", (otwarta || aktywne) && "is-otwarta")}
        aria-expanded={otwarta}
        aria-controls={id}
        onClick={() => przelacz(klucz)}
      >
        <SolarIcon name={ikona} className="ap-mobile-ikona" />
        <span className="ap-mobile-etykieta">{etykieta}</span>
        <SolarIcon
          name="chevron-down"
          weight="bold"
          className={cx("ap-mobile-strzalka", otwarta && "is-otwarta")}
        />
      </button>
      <div id={id} className={cx("ap-mobile-rozwiniecie", otwarta && "is-otwarte")}>
        <div className="min-h-0 overflow-hidden">
          <ul role="list" className="ap-mobile-podlista">{children}</ul>
        </div>
      </div>
    </>
  );
}

/** Pozycja wewnątrz rozwiniętej sekcji — te same treści co w menu desktopowym. */
function PozycjaMobilna({
  href,
  tytul,
  opis,
  ikona,
  aktywne,
  zamknij,
}: {
  href: string;
  tytul: string;
  opis?: string;
  ikona: SolarIconName;
  aktywne: boolean;
  zamknij: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={zamknij}
        className={cx("ap-mobile-podpozycja", aktywne && "is-active")}
        aria-current={aktywne ? "page" : undefined}
      >
        <SolarIcon name={ikona} className="ap-mobile-ikona" />
        <span className="min-w-0">
          <span className="ap-mobile-podtytul">{tytul}</span>
          {opis ? <span className="ap-mobile-podopis">{opis}</span> : null}
        </span>
      </Link>
    </li>
  );
}

export function AppBar() {
  const [open, setOpen] = useState(false);
  /* Najwyżej jedna sekcja menu mobilnego otwarta naraz. */
  const [otwartaSekcja, setOtwartaSekcja] = useState<SekcjaMenu>(null);
  const przelaczSekcje = (k: SekcjaMenu) => setOtwartaSekcja((b) => (b === k ? null : k));
  const zamknijMenu = () => setOpen(false);
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const loc: Locale = (locale as Locale) ?? "pl";
  const paths = getSitePaths(loc);
  const canonicalPath = mapToPolishRoute(normalizePathname(pathname));
  // Trasy bez chrome'u serwisu (samodzielna aplikacja leadowa), bez headera.
  const hideChrome = isBareChromeRoute(pathname);
  const logoFrameClass = "inline-flex items-center justify-center rounded-2xl px-0 py-0";

  const isCurrentPath = (...targets: string[]) =>
    targets.some((target) => canonicalPath === mapToPolishRoute(target));
  const isCurrentSection = (sectionRoot: string) =>
    canonicalPath === sectionRoot || canonicalPath.startsWith(`${sectionRoot}/`);

  const isAttractionsActive = isCurrentSection("/atrakcje");
  const isEventsActive = isCurrentPath("/wydarzenia");
  const isGettingThereActive = isCurrentPath("/jak-dojechac");
  const isGroupsActive = isCurrentPath("/grupy");
  const isAboutActive = isCurrentPath("/o-alvernia-planet", "/galeria", "/wydarzenia/vr", "/aktualnosci");
  const isContactActive = isCurrentPath("/kontakt");
  const isExhibitionActive = isCurrentPath("/harry-potter-the-exhibition");
  const isFilmPathActive = isCurrentPath("/atrakcje/filmworld");
  const isK360Active = isCurrentPath("/atrakcje/kino-360");
  const isMarsActive = isCurrentPath("/atrakcje/mars");
  const isBistroActive = isCurrentPath("/bistro");
  const isMarsColonizationActive = isCurrentPath("/mars-colonization");
  /* „Zaplanuj wizytę" jest aktywne, gdy gość stoi na którejkolwiek z jego
     pozycji — inaczej marker aktywnej strony znikałby po wejściu w menu. */
  const isPlanVisitActive = isCurrentPath("/jak-dojechac", "/faq");

  /* CTA zależne od sekcji. Strona wydarzeń jest sprzedażą B2B, więc „Kup
     bilety" byłoby tam mylące — pasek ma wspierać lejek eventowy i prowadzić
     do ISTNIEJĄCEJ sekcji kontaktowej `#zapytanie` (src/app/wydarzenia/page.tsx).
     Etykieta krótka jest dla telefonu, gdzie na pełną nie ma miejsca obok
     logo i hamburgera. */
  const ctaHref = isEventsActive ? "#zapytanie" : bookingHomeHref(loc);
  const ctaLabel = isEventsActive ? t("cta.ask_date") : t("cta.tickets");
  const ctaLabelShort = isEventsActive ? t("cta.ask_date_short") : t("cta.tickets_short");
  const isAboutPageActive = isCurrentPath("/o-alvernia-planet");
  const isGalleryActive = isCurrentPath("/galeria");
  const isVrTourActive = isCurrentPath("/wydarzenia/vr");
  const isNewsActive = isCurrentPath("/aktualnosci");
  const isFaqActive = isCurrentPath("/faq");

  useEffect(() => {
    setOpen(false);
    setOtwartaSekcja(null);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Stan menu czytany w nasłuchu przewijania. Ref, a nie zależność efektu:
     nasłuch ma zostać podpięty raz, a nie przepinać się przy każdym otwarciu. */
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;
    const SHOW_THRESHOLD = 8;
    const HIDE_THRESHOLD = 12;
    const TOP_AREA = 32;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      /* Przy rozwiniętym menu pasek zostaje na miejscu — schowanie go zabrałoby
         z ekranu całą nawigację razem z przyciskiem zamykania. Zapamiętujemy
         bieżącą pozycję, żeby po zamknięciu menu pasek nie zniknął od razu
         z powodu drogi przewiniętej w międzyczasie. */
      if (openRef.current) {
        lastScrollY.current = y;
        setHidden(false);
        ticking = false;
        return;
      }

      if (y <= TOP_AREA) {
        setHidden(false);
      } else if (delta > HIDE_THRESHOLD) {
        setHidden(true);
        lastScrollY.current = y;
      } else if (delta < -SHOW_THRESHOLD) {
        setHidden(false);
        lastScrollY.current = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

  /* Przy otwartym menu strona pod spodem nie może się przewijać — inaczej gest
     na liście „przechodzi" na treść i menu ucieka spod palca. Klasa na <body>,
     bo panel jest w toku dokumentu, a nie w nakładce na całą stronę. */
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("ap-menu-otwarte");
    return () => document.body.classList.remove("ap-menu-otwarte");
  }, [open]);

  // Bez headera na trasach bare (np. /aplikacje/identyfikacja).
  if (hideChrome) return null;

  return (
    <>
      <header
        data-ap-nav
        data-hidden={hidden ? "true" : "false"}
        className={cx(
          "sticky top-2 md:top-4 z-30 px-2 md:px-4 transition-transform duration-300 ease-out will-change-transform",
          hidden ? "-translate-y-[140%]" : "translate-y-0",
        )}
      >
        {/* grid 3 kolumny: [lewo] [logo] [prawo] */}
        <div className="ap-nav-banner mx-auto grid w-full max-w-[min(94vw,96rem)] grid-cols-[1fr_auto_1fr] items-center gap-[0.575rem] md:gap-[0.86rem] px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-[color:var(--ap-nav-krawedz)] bg-[var(--ap-nav-bg)] supports-[backdrop-filter]:bg-[var(--ap-nav-tlo)] supports-[backdrop-filter]:backdrop-blur-xl">
          {/* LEWO: burger (mobile) + linki (desktop) */}
          <div className="ap-nav-lewa flex items-center gap-[0.72rem] md:gap-[0.86rem] min-w-0">
            {/* burger tylko na mobile */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("aria.close_menu") : t("aria.open_menu")}
              aria-expanded={open}
              className="ap-icon-button min-[1280px]:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"
            >
              <SolarIcon
                name={open ? "close" : "menu"}
                weight="bold"
                className="h-[1.15rem] w-[1.15rem] text-white"
              />
            </button>

            {/* linki desktop po LEWEJ */}
            {/* `gap-1.5` do 1280 px: po dołożeniu pozycji „Bistro" pasek przy 1024 px
                nachodził na logo o 14 px (zmierzone). Węższe odstępy odzyskują
                ok. 32 px i mieszczą całość z zapasem, bez ruszania progu,
                od którego menu zwija się do hamburgera. */}
            {/* PRÓG 1280 px (05.10.2026, decyzja obiektu: „ten bar musi mieć
                informacje na sobie"). Do 1599 px pasek jest KOMPAKTOWY — mniejsze
                dopełnienia i odstępy, pismo 13 px, bez kreski separatora, a od
                1280 do 1439 px przycisk akcji z krótką etykietą („Bilety").
                Reguły i pomiary: „PASMO KOMPAKTOWE PASKA" w `globals.css`.

                Historia: przy pięciu pozycjach próg wynosił 1100 px (szósta
                pozycja „Bistro" nie mieściła się niżej w NIEMIECKIM). Dołożenie
                „Mars Colonization" — wyróżnionej zapowiedzi nowego produktu —
                przesunęło go 2026-10-02 na 1600, bo prawa grupa zderzała się
                z wyśrodkowanym znakiem (przy 1440 px brakowało do 46 px
                w portugalskim). Obiekt odrzucił wtedy skrócenie nazwy produktu
                („MARS 2027") i zdjęcie plakietki — pasek kompaktowy zostawia
                jedno i drugie w pełnym brzmieniu.

                Niżej niż 1280 px się nie da bez skracania nazwy: przy 1240 px
                polski ma po prawej tylko 13 px zapasu. Poniżej progu działa
                pełne menu w hamburgerze, w którym „Mars Colonization" jest
                pierwszym wierszem. */}
            {/* „Jak dojechać" i „FAQ" zostają w menu „Zaplanuj wizytę", bo obie
                odpowiadają na to samo pytanie gościa: jak i kiedy tu być.
                „Bistro" wróciło na pasek jako osobna pozycja (decyzja obiektu,
                2026-10-02) — stoi MIĘDZY zwykłymi linkami a tym menu, żeby oba
                rozwijane zostały na końcach paska, a pozycje bez panelu
                w środku. Grupowanie niesie ODSTĘP, nie kreski — pionowe
                separatory między zwykłymi pozycjami zniknęły. */}
            <nav
              aria-label={t("aria.primary_nav")}
              className="ap-nav-grupa hidden min-[1280px]:flex items-center gap-[0.14rem] xl:gap-[0.43rem] whitespace-nowrap"
            >
              {/* Atrakcje mają własne znaki (kopuła, planeta, kamera) dostarczone
                  przez właściciela, już w barwie marki. Wycięte do treści
                  i osadzone na kwadratowym płótnie, żeby wszystkie trzy miały
                  tę samą wielkość optyczną — kopuła jest dwa razy szersza niż
                  wysoka i bez tego wyglądałaby na większą. */}
              <MenuRozwijane etykieta={t("nav.attraction")} aktywne={isAttractionsActive}>
                <PozycjaPanelu
                  href={paths.attractions.k360}
                  tytul={t("menu.attractions.k360")}
                  obrazek="/wspolne/ikony-atrakcji/kino360.webp"
                  aktywne={isK360Active}
                />
                <PozycjaPanelu
                  href={paths.attractions.mars}
                  tytul={t("menu.attractions.mars")}
                  obrazek="/wspolne/ikony-atrakcji/mars.webp"
                  aktywne={isMarsActive}
                />
                <PozycjaPanelu
                  href={paths.attractions.filmPath}
                  tytul={t("menu.attractions.film_path")}
                  obrazek="/wspolne/ikony-atrakcji/filmworld.webp"
                  aktywne={isFilmPathActive}
                />
              </MenuRozwijane>

              <Link
                href={paths.events}
                className={cx("ap-nav-link", isEventsActive && "is-active")}
                aria-current={isEventsActive ? "page" : undefined}
                suppressHydrationWarning
              >
                {t("nav.events")}
              </Link>

              <Link
                href={paths.groups}
                className={cx("ap-nav-link", isGroupsActive && "is-active")}
                aria-current={isGroupsActive ? "page" : undefined}
                suppressHydrationWarning
              >
                <span className="inline-flex items-center gap-1.5">
                  {t("nav.groups")}
                  <EventBell />
                </span>
              </Link>

              <Link
                href={paths.attractions.bistro}
                className={cx("ap-nav-link", isBistroActive && "is-active")}
                aria-current={isBistroActive ? "page" : undefined}
                suppressHydrationWarning
              >
                {t("menu.attractions.bistro")}
              </Link>

              {/* Menu wizyty zbiera to, co istnieje w serwisie. Pozycji „Godziny
                  otwarcia" i „Parking" z makiety NIE MA — nie istnieje ani
                  strona, ani kotwica, która by je niosła, a wymyślanie celu
                  linku byłoby gorsze niż jego brak. */}
              <MenuRozwijane etykieta={t("nav.plan_visit")} aktywne={isPlanVisitActive}>
                <PozycjaPanelu
                  href={paths.gettingThere}
                  tytul={t("nav.getting_there")}
                  opis={t("nav.getting_there_desc")}
                  ikona="car"
                  aktywne={isGettingThereActive}
                />
                <PozycjaPanelu
                  href={paths.faq}
                  tytul={t("nav.faq_short")}
                  opis={t("nav.faq_desc")}
                  ikona="info"
                  aktywne={isFaqActive}
                />
              </MenuRozwijane>
            </nav>
          </div>

          {/* ŚRODEK: logo */}
          <div className="flex items-center justify-center px-1">
            <Link href={paths.home} aria-label={t("aria.home")} className="block">
              <span className={logoFrameClass}>
                <BrandLogo variant="dark" />
              </span>
            </Link>
          </div>

          {/* PRAWO: O nas + Kontakt (desktop) + akcja zawsze widoczna + język.
              `gap-2` do 1280 px: przy 1024 px prawa kolumna wchodziła logo
              na 2 px (zmierzone), a cztery elementy razy 4 px odzyskują 12 px. */}
          <div className="ap-nav-prawa flex items-center justify-end gap-[0.575rem] xl:gap-[0.86rem] min-w-0">
            {/* linki desktop po PRAWEJ */}
            <nav
              aria-label={t("aria.secondary_nav")}
              className="ap-nav-grupa hidden min-[1280px]:flex items-center gap-[0.14rem] xl:gap-[0.43rem] whitespace-nowrap"
            >
              {/* Pozycja wyróżniona, nie zwykły link: to zapowiedź nowego
                  produktu, a nie kolejna zakładka. Stoi w PRAWEJ grupie
                  (decyzja obiektu, 2026-10-02) i to jest zarazem jedyne
                  miejsce, gdzie się mieści — zmierzone: lewa grupa ma
                  w niemieckim 12 px zapasu od wyśrodkowanego znaku, prawa
                  od 83 px wzwyż. */}
              <Link
                href={paths.attractions.marsColonization}
                className={cx("ap-nav-link ap-nav-mars", isMarsColonizationActive && "is-active")}
                aria-current={isMarsColonizationActive ? "page" : undefined}
                suppressHydrationWarning
              >
                {t("nav.mars_colonization")}
                {/* Plakietka niesie TREŚĆ („nowość"), więc nie jest ukryta
                    przed czytnikiem ekranu — inaczej niż dekoracyjny dzwonek
                    przy „Dla grup". */}
                <span className="ap-nav-mars-plakietka">{t("nav.mars_colonization_badge")}</span>
              </Link>

              <MenuRozwijane etykieta={t("nav.about")} aktywne={isAboutActive} wyrownanie="end">
                {/* `globe`, a nie `planet`: planeta z pierścieniem to znak, którym
                    w menu atrakcji oznaczony jest MARS — ten sam rysunek dwa
                    razy w jednym pasku przestaje cokolwiek rozróżniać. */}
                <PozycjaPanelu
                  href={paths.about}
                  tytul={t("nav.about_alvernia")}
                  ikona="globe"
                  aktywne={isAboutPageActive}
                />
                <PozycjaPanelu
                  href={paths.attractions.exhibition}
                  tytul={t("menu.attractions.exhibition")}
                  ikona="star"
                  aktywne={isExhibitionActive}
                />
                <PozycjaPanelu href={paths.gallery} tytul={t("nav.gallery")} ikona="gallery" aktywne={isGalleryActive} />
                <PozycjaPanelu href={paths.vrTour} tytul={t("nav.virtual_walk")} ikona="walking" aktywne={isVrTourActive} />
                <PozycjaPanelu href={paths.news} tytul={t("nav.news")} ikona="document" aktywne={isNewsActive} />
              </MenuRozwijane>

              <Link
                href={paths.contact}
                className={cx("ap-nav-link", isContactActive && "is-active")}
                aria-current={isContactActive ? "page" : undefined}
                suppressHydrationWarning
              >
                {t("nav.contact")}
              </Link>
            </nav>

            {/* Jedyny separator, jaki zostaje: oddziela nawigację od narzędzi
                (język + akcja). Między samymi pozycjami menu grupuje odstęp.
                Dopiero od 1600 px — w pasku kompaktowym (1280–1599) kreska
                i jej dwa odstępy to miejsce, którego brakuje prawej grupie. */}
            <span className="ap-nav-separator hidden min-[1600px]:block" aria-hidden="true" />

            <div className="hidden md:block">
              <LangSwitcher />
            </div>

            {/* Jedyny mocny wizualnie element paska. Etykieta i cel zależą od
                sekcji: na stronie wydarzeń to lejek eventowy (kotwica do
                istniejącej sekcji „zapytanie"), wszędzie indziej kasa biletowa.
                Rozstrzyga o tym ścieżka, więc header zostaje jednym
                komponentem globalnym. */}
            <PrimaryButton
              href={ctaHref}
              size="sm"
              suppressHydrationWarning
              className="shrink-0 gap-1.5 px-3 xl:px-3.5 py-2 text-[0.8125rem] xl:text-sm min-h-[2.75rem]"
            >
              {/* Krótka etykieta także w paśmie 1280–1439 px — reguła
                  `.ap-cta-dluga` / `.ap-cta-krotka` w `globals.css`. */}
              <span className="ap-cta-dluga hidden sm:inline">{ctaLabel}</span>
              <span className="ap-cta-krotka sm:hidden">{ctaLabelShort}</span>
              <SolarIcon name="ticket" weight="bold" className="ap-cta-ikona h-3.5 w-3.5" />
            </PrimaryButton>
          </div>
        </div>

        {/* MENU MOBILNE — pełna nawigacja po rozwinięciu hamburgera.
            Pozycje i adresy pochodzą z tych samych `paths` i kluczy `t()`, co
            wersja desktopowa: jedna prawda, dwa układy. */}
        <div
          className={`min-[1280px]:hidden mx-auto w-full max-w-[min(94vw,96rem)] mt-2 grid transition-[grid-template-rows,opacity] duration-300 overflow-hidden ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!open}
        >
          <nav
            aria-label={t("aria.primary_nav")}
            className="ap-mobile-panel min-h-0 max-h-[calc(100svh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border border-[color:var(--ap-nav-krawedz)] bg-[var(--ap-nav-bg)] supports-[backdrop-filter]:bg-[var(--ap-nav-tlo)] supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_18px_38px_rgba(3,5,14,0.42)]"
          >
            {/* --- Atrakcje: trzy kafelki w jednym rzędzie ------------------ */}
            <p className="ap-mobile-naglowek">{t("nav.attraction")}</p>
            <ul className="ap-mobile-kafelki" role="list">
              {[
                { href: paths.attractions.k360, tytul: t("menu.attractions.k360"), obrazek: "/wspolne/ikony-atrakcji/kino360.webp", aktywne: isK360Active },
                { href: paths.attractions.mars, tytul: t("menu.attractions.mars"), obrazek: "/wspolne/ikony-atrakcji/mars.webp", aktywne: isMarsActive },
                { href: paths.attractions.filmPath, tytul: t("menu.attractions.film_path"), obrazek: "/wspolne/ikony-atrakcji/filmworld.webp", aktywne: isFilmPathActive },
              ].map((a) => (
                <li key={a.href}>
                  <Link
                    href={a.href}
                    onClick={zamknijMenu}
                    className={cx("ap-mobile-kafelek", a.aktywne && "is-active")}
                    aria-current={a.aktywne ? "page" : undefined}
                  >
                    <img src={a.obrazek} alt="" width={96} height={96} decoding="async" />
                    <span>{a.tytul}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* --- Pozycje główne ------------------------------------------ */}
            <ul className="ap-mobile-lista" role="list">
              <li>
                <Link
                  href={paths.attractions.marsColonization}
                  onClick={zamknijMenu}
                  className={cx("ap-mobile-wiersz", isMarsColonizationActive && "is-active")}
                  aria-current={isMarsColonizationActive ? "page" : undefined}
                  suppressHydrationWarning
                >
                  <SolarIcon name="planet" className="ap-mobile-ikona" />
                  <span className="ap-mobile-etykieta">{t("nav.mars_colonization")}</span>
                  <span className="ap-mobile-plakietka">{t("nav.mars_colonization_badge")}</span>
                </Link>
              </li>

              <li>
                <Link
                  href={paths.events}
                  onClick={zamknijMenu}
                  className={cx("ap-mobile-wiersz", isEventsActive && "is-active")}
                  aria-current={isEventsActive ? "page" : undefined}
                  suppressHydrationWarning
                >
                  <SolarIcon name="calendar" className="ap-mobile-ikona" />
                  <span className="ap-mobile-etykieta">{t("nav.events")}</span>
                </Link>
              </li>

              <li>
                <Link
                  href={paths.groups}
                  onClick={zamknijMenu}
                  className={cx("ap-mobile-wiersz", isGroupsActive && "is-active")}
                  aria-current={isGroupsActive ? "page" : undefined}
                  suppressHydrationWarning
                >
                  <SolarIcon name="guests" className="ap-mobile-ikona" />
                  <span className="ap-mobile-etykieta">{t("nav.groups")}</span>
                  {/* Plakietka zastępuje żółty dzwonek z wersji desktopowej.
                      UWAGA: oznacza Dni otwarte dla nauczycieli z 27–28.08.2026,
                      czyli wydarzenie, które już się odbyło. */}
                  <span className="ap-mobile-plakietka">{t("nav.groups_badge")}</span>
                </Link>
              </li>

              <li>
                <Link
                  href={paths.attractions.bistro}
                  onClick={zamknijMenu}
                  className={cx("ap-mobile-wiersz", isBistroActive && "is-active")}
                  aria-current={isBistroActive ? "page" : undefined}
                  suppressHydrationWarning
                >
                  <SolarIcon name="fork-knife" className="ap-mobile-ikona" />
                  <span className="ap-mobile-etykieta">{t("menu.attractions.bistro")}</span>
                </Link>
              </li>

              <li>
                <SekcjaMobilna
                  klucz="wizyta"
                  etykieta={t("nav.plan_visit")}
                  ikona="point-map"
                  aktywne={isPlanVisitActive}
                  otwarta={otwartaSekcja === "wizyta"}
                  przelacz={przelaczSekcje}
                >
                  <PozycjaMobilna href={paths.gettingThere} tytul={t("nav.getting_there")} opis={t("nav.getting_there_desc")} ikona="car" aktywne={isGettingThereActive} zamknij={zamknijMenu} />
                  <PozycjaMobilna href={paths.faq} tytul={t("nav.faq_short")} opis={t("nav.faq_desc")} ikona="info" aktywne={isFaqActive} zamknij={zamknijMenu} />
                </SekcjaMobilna>
              </li>

              <li>
                <SekcjaMobilna
                  klucz="onas"
                  etykieta={t("nav.about")}
                  ikona="buildings"
                  aktywne={isAboutActive}
                  otwarta={otwartaSekcja === "onas"}
                  przelacz={przelaczSekcje}
                >
                  <PozycjaMobilna href={paths.about} tytul={t("nav.about_alvernia")} ikona="globe" aktywne={isAboutPageActive} zamknij={zamknijMenu} />
                  <PozycjaMobilna href={paths.attractions.exhibition} tytul={t("menu.attractions.exhibition")} ikona="star" aktywne={isExhibitionActive} zamknij={zamknijMenu} />
                  <PozycjaMobilna href={paths.gallery} tytul={t("nav.gallery")} ikona="gallery" aktywne={isGalleryActive} zamknij={zamknijMenu} />
                  <PozycjaMobilna href={paths.vrTour} tytul={t("nav.virtual_walk")} ikona="walking" aktywne={isVrTourActive} zamknij={zamknijMenu} />
                  <PozycjaMobilna href={paths.news} tytul={t("nav.news")} ikona="document" aktywne={isNewsActive} zamknij={zamknijMenu} />
                </SekcjaMobilna>
              </li>

              <li>
                <Link
                  href={paths.contact}
                  onClick={zamknijMenu}
                  className={cx("ap-mobile-wiersz", isContactActive && "is-active")}
                  aria-current={isContactActive ? "page" : undefined}
                  suppressHydrationWarning
                >
                  <SolarIcon name="letter" className="ap-mobile-ikona" />
                  <span className="ap-mobile-etykieta">{t("nav.contact")}</span>
                </Link>
              </li>
            </ul>

            {/* --- Szybkie akcje: nawigacja i telefon ----------------------- */}
            <div className="ap-mobile-akcje">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(OBIEKT.celNawigacji)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={zamknijMenu}
                className="ap-mobile-akcja"
              >
                <SolarIcon name="navigation" className="ap-mobile-ikona" />
                {t("nav.quick_navigate")}
              </a>
              <a
                href={`tel:${OBIEKT.telefon.replace(/\s/g, "")}`}
                onClick={zamknijMenu}
                className="ap-mobile-akcja"
              >
                <SolarIcon name="phone" className="ap-mobile-ikona" />
                {t("nav.quick_call")}
              </a>
            </div>

            {/* --- Język: pięć wersji, więc rząd pigułek z kodami ----------- */}
            <div className="ap-mobile-jezyk">
              <LangSwitcher wariant="kody" />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
export default AppBar;
