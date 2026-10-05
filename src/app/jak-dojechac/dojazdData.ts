import type { SolarIconName } from "@/app/components/SolarIcon";
import type { Locale } from "@/lib/localizedRoutes";

/* ===========================================================================
   JEDNO ŹRÓDŁO DANYCH PODSTRONY „JAK DOJECHAĆ"
   ---------------------------------------------------------------------------
   Wszystko, co strona twierdzi o dojeździe, stoi w tym pliku razem z informacją,
   SKĄD to wiemy i KIEDY było weryfikowane. Komponenty nie mają własnych kopii
   godzin ani adresów. Pole `status` decyduje o tym, jak strona podaje daną
   informację:
     "potwierdzone"  — publikujemy wprost,
     "orientacyjne"  — publikujemy z wyraźną etykietą (np. odległości w km),
     "niepotwierdzone" — NIE publikujemy; zostaje tylko odnośnik do źródła.
   =========================================================================== */

export type StatusDanych = "potwierdzone" | "orientacyjne" | "niepotwierdzone";

/* --- Obiekt ---------------------------------------------------------------- */

export const OBIEKT = {
  nazwa: "Alvernia Planet",
  ulica: "Ferdynanda Wspaniałego 1",
  kod: "32-566",
  miejscowosc: "Nieporaz",
  /** Pełny adres w jednej linii — ten sam zapis co w stopce i na /kontakt. */
  adres: "Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
  /** Cel nawigacji: nazwa + adres. Mapy radzą sobie z tym lepiej niż same współrzędne. */
  celNawigacji: "Alvernia Planet, Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
  /** Infolinia dla gości — ten sam numer, który /kontakt pokazuje jako „Informacja".
      UWAGA: /kontakt trzyma go nadal we własnej stałej PHONE_INFO; przy okazji
      porządków w danych kontaktowych warto go stamtąd wskazać tutaj. */
  telefon: "+48 510 831 277",
  status: "potwierdzone" as StatusDanych,
} as const;

/* --- Bus wahadłowy Krzeszowice ↔ Alvernia Planet --------------------------- */

export type KierunekBusa = "doObiektu" | "doKrzeszowic";
/** 0 = niedziela … 6 = sobota (jak Date#getUTCDay). */
export type DzienTygodnia = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const BUS = {
  zrodlo: "Rozkład przekazany przez obiekt",
  /** Data, w której obiekt przekazał ten rozkład. */
  zweryfikowano: "2026-09-25",
  /** Okres obowiązywania — DO POTWIERDZENIA przez obiekt (null = nieznany). */
  obowiazujeOd: null as string | null,
  obowiazujeDo: null as string | null,
  /** Potwierdzone wyjątki (święta, przerwy) — pusta lista znaczy „brak potwierdzonych”, nie „kursuje zawsze”. */
  wyjatki: [] as { data: string; powod?: string }[],
  /** Dni kursowania: piątek, sobota, niedziela. */
  dniKursowania: [5, 6, 0] as DzienTygodnia[],
  kursy: {
    doObiektu: {
      5: ["15:00", "16:00", "17:00", "18:00", "19:00"],
      6: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
      0: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    },
    doKrzeszowic: {
      5: ["15:30", "16:30", "17:30", "18:30", "19:30"],
      6: ["10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30"],
      0: ["10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30"],
    },
  } as Record<KierunekBusa, Partial<Record<DzienTygodnia, string[]>>>,
  /* NIE WIEMY i nie wolno dopisywać: ceny ani bezpłatności, przewoźnika, czasu
     przejazdu, konieczności rezerwacji, kursów w święta, udogodnień. */
} as const;

export type Przystanek = {
  id: "krzeszowice" | "obiekt";
  lat: number;
  lng: number;
  /** Krótki odnośnik Google Maps przekazany przez obiekt. */
  mapsUrl: string;
  icon: SolarIconName;
  status: StatusDanych;
};

export const PRZYSTANKI: Record<Przystanek["id"], Przystanek> = {
  krzeszowice: {
    id: "krzeszowice",
    lat: 50.13113,
    lng: 19.633481,
    mapsUrl: "https://maps.app.goo.gl/rNkH5dhaR7hZNwdM7",
    icon: "train",
    /* Współrzędne odczytane z pinezki przekazanej przez obiekt; obiekt
       zapowiedział osobiste sprawdzenie dokładności punktu. */
    status: "orientacyjne",
  },
  obiekt: {
    id: "obiekt",
    lat: 50.102804,
    lng: 19.545194,
    mapsUrl: "https://maps.app.goo.gl/9w8a6PE8PuWzUSgi6",
    icon: "garage",
    status: "potwierdzone",
  },
};

/* --- Zegar i kalendarz obiektu --------------------------------------------- */
/* Statyczny eksport: „teraz” zna wyłącznie przeglądarka. Gość może być w innej
   strefie (mamy 5 wersji językowych), a bus jeździ według czasu polskiego —
   dlatego datę i godzinę wyciągamy przez Intl z wymuszoną strefą Europe/Warsaw. */

export type ChwilaObiektu = {
  /** Data w strefie obiektu, format YYYY-MM-DD. */
  data: string;
  dzien: DzienTygodnia;
  /** Minuty od północy. */
  minuty: number;
};

export function terazWObiekcie(teraz: Date = new Date()): ChwilaObiektu {
  const czesci = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(teraz);
  const p = (typ: Intl.DateTimeFormatPartTypes) => czesci.find((c) => c.type === typ)?.value ?? "";
  const dni: Record<string, DzienTygodnia> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    data: `${p("year")}-${p("month")}-${p("day")}`,
    dzien: dni[p("weekday")] ?? 0,
    // hourCycle h23 potrafi zwrócić „24” o północy — sprowadzamy do 0–23.
    minuty: (Number(p("hour")) % 24) * 60 + Number(p("minute")),
  };
}

export function naMinuty(godzina: string) {
  const [g, m] = godzina.split(":");
  return Number(g) * 60 + Number(m);
}

/** Data YYYY-MM-DD przesunięta o `dni` dni. Liczone w UTC, więc bez pułapek zmiany czasu. */
export function przesunDate(data: string, dni: number) {
  const [r, m, d] = data.split("-").map(Number);
  const t = Date.UTC(r, m - 1, d) + dni * 86400000;
  const dt = new Date(t);
  const dwucyfrowo = (n: number) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${dwucyfrowo(dt.getUTCMonth() + 1)}-${dwucyfrowo(dt.getUTCDate())}`;
}

export function dzienTygodnia(data: string): DzienTygodnia {
  const [r, m, d] = data.split("-").map(Number);
  return new Date(Date.UTC(r, m - 1, d)).getUTCDay() as DzienTygodnia;
}

/** Czy tego dnia bus kursuje: dzień tygodnia z rozkładu, okno obowiązywania i wyjątki. */
export function busKursuje(data: string) {
  if (BUS.obowiazujeOd && data < BUS.obowiazujeOd) return false;
  if (BUS.obowiazujeDo && data > BUS.obowiazujeDo) return false;
  if (BUS.wyjatki.some((w) => w.data === data)) return false;
  return BUS.dniKursowania.includes(dzienTygodnia(data));
}

export function kursyDnia(kierunek: KierunekBusa, data: string): string[] {
  if (!busKursuje(data)) return [];
  return BUS.kursy[kierunek][dzienTygodnia(data)] ?? [];
}

/** Kolejne dni kursowania, począwszy od `od` (włącznie). */
export function najblizszeDniKursowania(od: string, ile: number, maksSzukania = 21): string[] {
  const dni: string[] = [];
  for (let i = 0; i < maksSzukania && dni.length < ile; i += 1) {
    const data = przesunDate(od, i);
    if (busKursuje(data)) dni.push(data);
  }
  return dni;
}

export type Odjazd = {
  data: string;
  godzina: string;
  /** true = kurs jeszcze dziś; false = pierwszy kurs w kolejnym dniu kursowania. */
  dzis: boolean;
};

/**
 * Najbliższy odjazd WEDŁUG ROZKŁADU (nie dane na żywo — nie znamy opóźnień).
 * Zwraca null, gdy rozkład wygasł albo w oknie 21 dni nie ma żadnego kursu.
 */
export function najblizszyOdjazd(kierunek: KierunekBusa, chwila: ChwilaObiektu): Odjazd | null {
  if (BUS.obowiazujeDo && chwila.data > BUS.obowiazujeDo) return null;
  const dzisiejsze = kursyDnia(kierunek, chwila.data);
  const jeszczeDzis = dzisiejsze.find((g) => naMinuty(g) > chwila.minuty);
  if (jeszczeDzis) return { data: chwila.data, godzina: jeszczeDzis, dzis: true };
  const kolejny = najblizszeDniKursowania(przesunDate(chwila.data, 1), 1);
  if (!kolejny.length) return null;
  const godziny = kursyDnia(kierunek, kolejny[0]);
  if (!godziny.length) return null;
  return { data: kolejny[0], godzina: godziny[0], dzis: false };
}

/* --- Punkty startowe (trasa z innego miejsca) ------------------------------ */

export type PunktStartowy = {
  id: string;
  /** Zapytanie do map — wspólne dla wszystkich języków, żeby trasa się zgadzała. */
  zapytanie: string;
  /** Odległość orientacyjna, podawana zawsze z etykietą „ok.”. */
  km: number;
  icon: SolarIconName;
};

export const PUNKTY_STARTOWE: PunktStartowy[] = [
  { id: "krakow", zapytanie: "Kraków", km: 25, icon: "city" },
  { id: "katowice", zapytanie: "Katowice", km: 47, icon: "city" },
  { id: "balice", zapytanie: "Kraków Airport, Balice", km: 15, icon: "plane" },
  { id: "pyrzowice", zapytanie: "Katowice Airport, Pyrzowice", km: 73, icon: "plane" },
  { id: "krzeszowice", zapytanie: "Dworzec PKP Krzeszowice", km: 9, icon: "train" },
];

/* --- Przewoźnicy autobusowi ------------------------------------------------ */

export type Przewoznik = {
  id: "flixbus" | "mbus" | "magoma";
  url: string;
  /** Czy kurs kończy się przy obiekcie, czy trzeba pokonać ostatni odcinek. */
  dowozPodObiekt: boolean;
  /** Status godzin i cen u tego przewoźnika — decyduje, czy w ogóle je pokazujemy. */
  statusRozkladu: StatusDanych;
};

export const PRZEWOZNICY: Przewoznik[] = [
  {
    id: "flixbus",
    url: "https://shop.flixbus.pl/search?departureCity=40de7eb5-8646-11e6-9066-549f350fcb0c&arrivalCity=dcc38757-f8af-4d9b-a71f-a1c7d5d3c269&route=Kraków-Nieporaz&adult=1&_locale=pl",
    dowozPodObiekt: true,
    /* Godziny 07:45/14:20 i cena „od 28 zł" siedziały na stronie bez źródła
       i bez daty weryfikacji — rozkłady FlixBusa zmieniają się sezonowo,
       więc zamiast pozornej precyzji zostaje odnośnik do wyszukiwarki. */
    statusRozkladu: "niepotwierdzone",
  },
  {
    id: "mbus",
    url: "https://www.matysikserwis.pl/m-bus/",
    dowozPodObiekt: false,
    statusRozkladu: "niepotwierdzone",
  },
  {
    id: "magoma",
    url: "https://www.alwernia.pl/mieszkaniec/kominukacja-w-gminie-alwernia/rozklady-jazdy-do-krzeszowic.html",
    dowozPodObiekt: false,
    statusRozkladu: "niepotwierdzone",
  },
];

/* --- W okolicy (sekcja drugorzędna, domyślnie zwinięta) -------------------- */

export type AtrakcjaOkolicy = { id: string; km: number };

export const ATRAKCJE_OKOLICY: AtrakcjaOkolicy[] = [
  { id: "tenczyn", km: 3 },
  { id: "wygielzow", km: 12 },
  { id: "energylandia", km: 20 },
  { id: "zatorland", km: 22 },
  { id: "grodek", km: 28 },
  { id: "auschwitz", km: 37 },
  { id: "wieliczka", km: 49 },
];

/* --- Odnośniki do map ------------------------------------------------------ */

/** Trasa do obiektu; bez `origin` mapy wezmą bieżące położenie użytkownika. */
export function linkTrasy(skad?: string) {
  const cel = `destination=${encodeURIComponent(OBIEKT.celNawigacji)}`;
  return skad
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(skad)}&${cel}`
    : `https://www.google.com/maps/dir/?api=1&${cel}`;
}

/** Trasa do przystanku busa w Krzeszowicach (punkt z pinezki obiektu). */
export function linkTrasyDoPrzystanku(p: Przystanek) {
  return `https://www.google.com/maps/dir/?api=1&destination=${p.lat}%2C${p.lng}`;
}

/** Ramka z mapą przystanku w Krzeszowicach — z pinezki przekazanej przez obiekt.
    Wariant z wyrysowaną trasą wymaga płatnego klucza Embed API, więc pokazujemy
    sam punkt, a trasę otwiera odnośnik obok ramki. */
/** Oficjalna wyszukiwarka rozkładu PKP PLK. Sprawdzone: adresy tablic odjazdów
    dla pojedynczej stacji (Odjazdyprzyjazdy, Plakaty/Wyszukiwarka) zwracają
    stronę błędu, a koleo.pl/rozklad-pkp/krzeszowice przekierowuje na stronę
    główną — dlatego prowadzimy do wyszukiwarki, a nie do rzekomej tablicy. */
export const ROZKLAD_POCIAGOW_URL = "https://portalpasazera.pl/";

/** Przystanek FlixBusa w Krakowie — punkt ODJAZDU, nie przyjazdu.
    Współrzędne, nie nazwa: wariant `q=Kraków MDA, ul. Bosacka 18` bywał
    pokazywany jako widok całego świata (sprawdzone — ramka bez geokodowania
    zapytania tekstowego), więc mapa raz trafiała w cel, a raz nie.
    Punkt: Małopolski Dworzec Autobusowy, Kraków — 50.0678961, 19.9493928,
    z OpenStreetMap/Nominatim (obiekt typu `bus_station`), sprawdzone 2026-09-24. */
export const MDA_KRAKOW = { lat: 50.0678961, lng: 19.9493928 } as const;

export const MAPA_FLIXBUS_EMBED = `https://www.google.com/maps?q=${MDA_KRAKOW.lat}%2C${MDA_KRAKOW.lng}&z=15&output=embed`;

export const MAPA_PRZYSTANKU_EMBED = `https://www.google.com/maps?q=${PRZYSTANKI.krzeszowice.lat}%2C${PRZYSTANKI.krzeszowice.lng}&z=15&output=embed`;

/** Ramka z mapą pokazuje sam obiekt. Wariant z trasą wymaga płatnego klucza Embed API. */
export const MAPA_OBIEKTU_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  OBIEKT.celNawigacji
)}&output=embed`;

export type { Locale };
