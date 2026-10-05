import type { Locale } from "@/lib/localizedRoutes";

/* Teksty podstrony „Mars Colonization" — jeden obiekt na język, tak samo jak
   w `bistro/bistroCopy.ts` i `jak-dojechac/dojazdCopy.ts`. Dorzucenie kolejnego
   języka jest zmianą DANYCH, a nie przebudową komponentu.

   ŹRÓDŁO TREŚCI: brief „MARS COLONIZATION – ETAP 1 / PAŹDZIERNIK 2026".
   Stamtąd pochodzą obie daty (przedsprzedaż 04.11.2026, pierwsze misje
   02.01.2027), liczba ~26 robotów, czas trwania „około godziny" i cała
   warstwa fabularna (rok 2033, Colony Inspectors).

   CZEGO NIE MAMY i nie wolno dopisywać:
   — CEN biletów ani progów cenowych,
   — nazwy PARTNERA (w briefie jest tylko „[PARTNER]"), dlatego wiersz
     „ALVERNIA PLANET × … PRESENT" renderuje się bez niego, dopóki obiekt go
     nie poda — patrz `PARTNER` w `page.tsx`,
   — dokładnego rosteru robotów (brief wprost mówi, żeby go NIE ujawniać:
     „Powinno pozostać: »Co jeszcze tam będzie?«"),
   — godzin otwarcia i harmonogramu misji.

   UWAGA do `hud`: to powtarzalny pasek interfejsu z briefu (sekcja 13).
   Etykiety zostają po angielsku we WSZYSTKICH językach — to element
   scenograficzny kampanii, czytany jako terminal misji, a nie zdanie do
   przetłumaczenia. Tłumaczymy wyłącznie wartości, które niosą treść. */

export type KrokMisji = {
  /** Jedno słowo-czasownik, wersalikami — człon ciągu LAND → … → DECIDE. */
  klucz: string;
  tytul: string;
  opis: string;
};

/** Etap ekosystemu. `etap` to podpis pod punktem osi („Aktualna misja"…)
 *  — sekcja „Więcej niż jedna misja" (`Ekosystem.tsx`). */
export type Filar = { tytul: string; opis: string; etap: string };
export type Odbiorca = { tytul: string; opis: string };

export type MarsCopy = {
  meta: { tytul: string; opis: string };

  /** Pasek interfejsu misji — powtarza się w hero i w finale. */
  hud: {
    misja: string;
    status: string;
    inspektorzy: string;
    przedsprzedaz: string;
    przybycie: string;
  };

  hero: {
    /* Nadtytuł nad nazwą produktu, rozbity na DWA pola, bo brief przewiduje
       wariant z partnerem: „ALVERNIA PLANET × [PARTNER] PRESENT". Gdyby był
       jednym łańcuchem, nazwa partnera wylądowałaby po czasowniku. */
    nadtytulMarka: string;
    nadtytulCzasownik: string;
    tytul: string;
    podtytul: string;
    haslo1: string;
    haslo2: string;
    /** Dwie daty-kotwice tuż pod hasłem. */
    dataPrzedsprzedazy: { etykieta: string; wartosc: string };
    dataMisji: { etykieta: string; wartosc: string };
    /** CAŁA WYSTAWA jest czasowa — trwa tylko trzy miesiące (decyzja obiektu
        05.10.2026, „trzeba to dobrze zakomunikować"). Trzecia karta obok dat
        w hero i przypomnienie w finale przy zapisie. Bez daty końca — ta nie
        jest ustalona. */
    czasWystawy: { etykieta: string; wartosc: string };
    cta: string;
    ctaDrugi: string;
  };

  rok2035: {
    overline: string;
    tytul: string;
    /** Końcówka `tytul` wyróżniona czerwienią. MUSI być dosłownym końcem
     *  tytułu — komponent ją odcina i sprawdza, czy pasuje. Podana jawnie,
     *  a nie liczona z ostatniego słowa, bo chiński nie ma spacji i cały
     *  tytuł stawał się „ostatnim słowem". */
    tytulAkcent: string;
    akapit1: string;
    zadanie: string;
    /** Pięć zasobów, które roboty miały przygotować. */
    zasoby: string[];
    /* Cztery pola niżej NIE są dziś wyświetlane: sekcja kończy się na osi
       2031 → 2033 (decyzja z 05.10.2026). Zostają w danych, bo pytanie ma
       wrócić w innym miejscu strony, a tłumaczeń w pięciu językach nie ma
       w historii gita — usunięcie stąd oznaczałoby ich utratę. */
    akapit2: string;
    status: string;
    pytanie: string;
    /** Końcówka `pytanie` wyróżniona czerwienią — zasada jak przy tytule. */
    pytanieAkcent: string;
  };

  czym: {
    overline: string;
    zaprzeczenie: string;
    tytul: string;
    akapit1: string;
    akapit2: string;
    /** Podpis pod miejscem na zwiastun — mówi wprost, czego jeszcze nie ma. */
  };

  misja: {
    overline: string;
    statusEtykieta: string;
    statusWartosc: string;
    tytul: string;
    kroki: KrokMisji[];
    pytanie: string;
    /** Taśma filmowa z krokami (`KrokiTasma.tsx`): nazwa przewijanego
     *  regionu i opisy jej przycisków. Czyta je tylko czytnik ekranu —
     *  klatki licznika i strzałka nie mają widocznego tekstu. */
    tasma: {
      /** Nazwa regionu, który da się przewijać klawiaturą. */
      etykieta: string;
      /** Nazwa grupy klatek licznika pod taśmą. */
      grupa: string;
      /** Czasownik przed tytułem kroku w opisie klatki: „Pokaż: Wyląduj (1/5)". */
      pokaz: string;
      dalej: string;
      /** Strzałka na końcu taśmy — obraca się i wraca do pierwszego kroku. */
      poczatek: string;
    };
  };

  humanoidy: {
    overline: string;
    zaprzeczenie: string;
    tytul: string;
    liczba: string;
    liczbaOpis: string;
    akapit: string;
    wyroznienie1: string;
    wyroznienie2: string;
    /** Tekst alternatywny wycinka robota w kadrze sekcji. */
    robotAlt: string;
  };

  /** Pasek postępu scen z zaprzeczeniem („Czym jest", „Real humanoids"). */
  scena: {
    odtworz: string;
  };

  ekosystem: {
    overline: string;
    tytul: string;
    filary: Filar[];
  };

  dlaKogo: {
    overline: string;
    tytul: string;
    odbiorcy: Odbiorca[];
    /** Przycisk w panelu grupy „Firmy" — przewija do sekcji B2B tuż pod
        listą. Pozostałe cztery grupy biorą `hero.cta` (zapis na start). */
    ctaFirmy: string;
  };

  b2b: {
    overline: string;
    tytul: string;
    akapit: string;
    cta: string;
  };

  final: {
    overline: string;
    tytul: string;
    /** Etykiety jednostek odliczania — liczby podstawia komponent. */
    jednostki: { dni: string; godziny: string; minuty: string; sekundy: string };
    /** Komunikat po przekroczeniu daty startu misji. */
    poStarcie: string;
    przedsprzedazEtykieta: string;
    przedsprzedazData: string;
    tytulFormularza: string;
  };

  /* Formularz zapisu. Kształt pól jest PODYKTOWANY przez wdrożoną funkcję
     brzegową Supabase (`supabase/functions/leads/index.ts`), która wymaga
     imienia i nazwiska po min. 2 znaki — nie da się zapisać samego adresu.
     Treść zgody MUSI być dosłownie ta, którą funkcja brzegowa trzyma w mapie
     `CONSENT_TEXTS` pod odpowiednim kodem języka — i to dotyczy WSZYSTKICH
     PIĘCIU, nie tylko polskiego. Inaczej dowód zgody w bazie nie zgadza się
     z tym, co widział gość. Zmiana którejkolwiek z tych treści wymaga
     poprawienia jej RÓWNIEŻ w `supabase/functions/leads/index.ts`. */
  formularz: {
    imie: string;
    nazwisko: string;
    email: string;
    zgoda: string;
    politykaPrzed: string;
    politykaLink: string;
    /* Znak końca zdania po odnośniku — w chińskim to „。”, nie „.”. */
    politykaPo: string;
    wyslij: string;
    wysylanie: string;
    sukces: string;
    blad: string;
    wymagane: string;
    bladImie: string;
    bladNazwisko: string;
    bladEmail: string;
    bladZgoda: string;
  };

  alt: { hero: string; kolonia2035: string; habitat: string };
};

export const MARS_COPY: Record<Locale, MarsCopy> = {
  pl: {
    meta: {
      tytul: "Mars Colonization — humanoidy i filmowa misja, Alvernia Planet",
      opis:
        "Wystawa czasowa — tylko 3 miesiące. Mars Colonization w Alvernia Planet: filmowa misja z prawdziwymi robotami humanoidalnymi. Przedsprzedaż 4.11.2026, pierwsze misje 2.01.2027.",
    },
    hud: {
      misja: "MARS COLONIZATION",
      status: "PREPARING",
      inspektorzy: "REQUIRED",
      przedsprzedaz: "04.11.2026",
      przybycie: "02.01.2027",
    },
    hero: {
      nadtytulMarka: "Alvernia Planet",
      nadtytulCzasownik: "przedstawia",
      tytul: "Mars Colonization",
      podtytul: "Cinematic & Humanoids Experience",
      haslo1: "Science fiction staje się rzeczywistością.",
      haslo2: "Ludzie i humanoidy kolonizują Marsa ramię w ramię.",
      dataPrzedsprzedazy: { etykieta: "Przedsprzedaż", wartosc: "04.11.2026" },
      dataMisji: { etykieta: "Pierwsze misje", wartosc: "02.01.2027" },
      czasWystawy: { etykieta: "Wystawa czasowa", wartosc: "Tylko 3 miesiące" },
      cta: "Powiadom mnie o starcie przedsprzedaży",
      ctaDrugi: "Odkryj misję",
    },
    rok2035: {
      overline: "Rok 2033",
      tytul: "Roboty przybyły pierwsze.",
      tytulAkcent: "pierwsze.",
      akapit1:
        "Dwa lata wcześniej humanoidalne roboty zostały wysłane na Marsa. Ich zadanie było jedno:",
      zadanie: "Przygotować planetę na przybycie człowieka.",
      zasoby: ["Woda", "Tlen", "Żywność", "Energia", "Schronienie"],
      akapit2: "Teraz na Marsa przybywają ludzie. Nie jako turyści.",
      status: "Jako Colony Inspectors",
      pytanie: "Czy Mars jest gotowy na człowieka?",
      pytanieAkcent: "na człowieka?",
    },
    czym: {
      overline: "Czym jest Mars Colonization?",
      zaprzeczenie: "To nie jest wystawa robotów.",
      tytul: "To filmowa misja, której stajesz się bohaterem",
      akapit1:
        "Wchodzisz do immersyjnego świata Marsa i razem z humanoidalnymi robotami odkrywasz stworzoną przez nie kolonię. Całość trwa około godziny.",
      akapit2:
        "Będziesz eksplorować, wykonywać zadania, podejmować decyzje i wchodzić w interakcje z robotami — sprawdzając, czy naprawdę przygotowały Marsa na przybycie człowieka.",
    },
    misja: {
      overline: "Twoja misja",
      statusEtykieta: "Twój status",
      statusWartosc: "Colony Inspector",
      tytul: "Pięć kroków misji",
      kroki: [
        { klucz: "LAND", tytul: "Wyląduj", opis: "na Marsie." },
        { klucz: "SURVIVE", tytul: "Sprawdź", opis: "czy roboty stworzyły warunki do życia." },
        { klucz: "EXPLORE", tytul: "Eksploruj", opis: "nowy świat." },
        { klucz: "EXPERIENCE", tytul: "Spotkaj", opis: "jego robotycznych mieszkańców." },
        { klucz: "DECIDE", tytul: "Zdecyduj", opis: "czy człowiek jest gotowy zamieszkać na Marsie." },
      ],
      pytanie: "Czy człowiek jest gotowy zamieszkać na Marsie?",
      tasma: {
        etykieta: "Kroki misji",
        grupa: "Przewijanie kroków misji",
        pokaz: "Pokaż",
        dalej: "Następny krok misji",
        poczatek: "Wróć do pierwszego kroku misji",
      },
    },
    humanoidy: {
      overline: "Real humanoids",
      zaprzeczenie: "To nie są filmowe rekwizyty.",
      tytul: "To prawdziwe roboty humanoidalne",
      liczba: "~26",
      liczbaOpis: "robotów w całym ekosystemie",
      akapit:
        "Roboty humanoidalne, eksploracyjne i użytkowe staną się częścią świata tworzonego w Alvernia Planet.",
      wyroznienie1: "Nie tylko je zobaczysz.",
      wyroznienie2: "Będziesz z nimi wchodzić w interakcję.",
      robotAlt: "Humanoidalny robot w białej obudowie, z ekranem w miejscu twarzy",
    },
    scena: {
      odtworz: "Odtwórz ponownie",
    },
    ekosystem: {
      overline: "Więcej niż jedna misja",
      tytul: "Mars to dopiero początek",
      filary: [
        { tytul: "Mars Colonization", opis: "Filmowa misja kolonizacji Marsa.", etap: "Aktualna misja" },
        { tytul: "Humanoids Lab", opis: "Poznaj roboty, eksperymentuj i wejdź z nimi w interakcję.", etap: "Kolejny etap" },
        { tytul: "Robotics Showroom", opis: "Zobacz, jak roboty mogą zmieniać codzienne życie i biznes.", etap: "Technologia w praktyce" },
      ],
    },
    dlaKogo: {
      overline: "Dla kogo",
      tytul: "Kto wejdzie na Marsa",
      odbiorcy: [
        { tytul: "Rodziny", opis: "Przeżyjcie razem misję na Marsie." },
        { tytul: "Szukający wrażeń", opis: "Film, technologia, roboty i świat, który warto pokazać innym." },
        { tytul: "Szkoły", opis: "Edutainment: robotyka, sztuczna inteligencja, kosmos, biologia i energia." },
        { tytul: "Fani technologii", opis: "Spotkaj prawdziwe humanoidy." },
        { tytul: "Firmy", opis: "Zobacz zastosowania robotów i poznaj możliwości ich wykorzystania w biznesie." },
      ],
      ctaFirmy: "Poznaj ofertę dla firm",
    },
    b2b: {
      overline: "Robotics Showroom",
      tytul: "Z Marsa do Twojej firmy",
      akapit:
        "Robotyka humanoidalna przestaje być wyłącznie science fiction. W Alvernia Planet przedsiębiorcy będą mogli zobaczyć roboty w działaniu, poznać ich zastosowania oraz porozmawiać o możliwościach wdrożenia ich we własnej firmie.",
      cta: "Jestem zainteresowany rozwiązaniami dla biznesu",
    },
    final: {
      overline: "Odliczanie",
      tytul: "Misja rozpoczyna się 02.01.2027",
      jednostki: { dni: "dni", godziny: "godzin", minuty: "minut", sekundy: "sekund" },
      poStarcie: "Misja wystartowała.",
      przedsprzedazEtykieta: "Przedsprzedaż biletów",
      przedsprzedazData: "04.11.2026",
      tytulFormularza: "Powiadom mnie, gdy ruszy sprzedaż",
    },
    formularz: {
      imie: "Imię",
      nazwisko: "Nazwisko",
      email: "Twój e-mail",
      zgoda:
        "Wyrażam zgodę na kontakt ze strony Alvernia Planet w celu przedstawienia informacji o ofercie Alvernia Planet. Wiem, że zgodę mogę wycofać w dowolnym momencie.",
      politykaPrzed: "Szczegóły w",
      politykaLink: "polityce prywatności",
      politykaPo: ".",
      wyslij: "Chcę wiedzieć pierwszy",
      wysylanie: "Wysyłanie…",
      sukces: "Gotowe. Odezwiemy się, gdy ruszy przedsprzedaż.",
      blad: "Nie udało się wysłać. Spróbuj ponownie za chwilę.",
      wymagane: "Pola wymagane",
      bladImie: "Podaj imię.",
      bladNazwisko: "Podaj nazwisko.",
      bladEmail: "Podaj poprawny adres e-mail.",
      bladZgoda: "Zgoda jest wymagana, żebyśmy mogli się odezwać.",
    },
    alt: {
      hero: "Kolonia kopuł na czerwonej równinie Marsa, nad nią ogromna tarcza planety i rozgwieżdżone niebo",
      kolonia2035: "Humanoidalny robot obserwuje przygotowaną bazę marsjańską w czerwonym i turkusowym świetle",
      habitat: "Wnętrze habitatu z uprawą hydroponiczną na pokładzie kolonii",
    },
  },

  en: {
    meta: {
      tytul: "Mars Colonization — humanoids and a cinematic mission, Alvernia Planet",
      opis:
        "Limited-run exhibition — only 3 months. Mars Colonization at Alvernia Planet: an hour-long cinematic mission with real humanoid robots. Pre-sale 4 November 2026, first missions 2 January 2027.",
    },
    hud: {
      misja: "MARS COLONIZATION",
      status: "PREPARING",
      inspektorzy: "REQUIRED",
      przedsprzedaz: "04.11.2026",
      przybycie: "02.01.2027",
    },
    hero: {
      nadtytulMarka: "Alvernia Planet",
      nadtytulCzasownik: "presents",
      tytul: "Mars Colonization",
      podtytul: "Cinematic & Humanoids Experience",
      haslo1: "Science fiction becomes reality.",
      haslo2: "Humans and humanoids colonise Mars side by side.",
      dataPrzedsprzedazy: { etykieta: "Pre-sale", wartosc: "4 Nov 2026" },
      dataMisji: { etykieta: "First missions", wartosc: "2 Jan 2027" },
      czasWystawy: { etykieta: "Limited-run exhibition", wartosc: "Only 3 months" },
      cta: "Notify me when the pre-sale starts",
      ctaDrugi: "Discover the mission",
    },
    rok2035: {
      overline: "The year 2033",
      tytul: "The robots arrived first.",
      tytulAkcent: "first.",
      akapit1:
        "Two years earlier, humanoid robots were sent to Mars. They had a single task:",
      zadanie: "Prepare the planet for the arrival of humans.",
      zasoby: ["Water", "Oxygen", "Food", "Energy", "Shelter"],
      akapit2: "Now humans are arriving on Mars. Not as tourists.",
      status: "As Colony Inspectors",
      pytanie: "Is Mars ready for humans?",
      pytanieAkcent: "for humans?",
    },
    czym: {
      overline: "What is Mars Colonization?",
      zaprzeczenie: "This is not a robot exhibition.",
      tytul: "It is a cinematic mission and you are its hero",
      akapit1:
        "You step into an immersive world of Mars and, together with humanoid robots, explore the colony they built. The whole mission takes about an hour.",
      akapit2:
        "You will explore, carry out tasks, make decisions and interact with the robots — checking whether they really did prepare Mars for the arrival of humans.",
    },
    misja: {
      overline: "Your mission",
      statusEtykieta: "Your status",
      statusWartosc: "Colony Inspector",
      tytul: "Five steps of the mission",
      kroki: [
        { klucz: "LAND", tytul: "Land", opis: "on Mars." },
        { klucz: "SURVIVE", tytul: "Check", opis: "whether the robots created conditions for life." },
        { klucz: "EXPLORE", tytul: "Explore", opis: "a new world." },
        { klucz: "EXPERIENCE", tytul: "Meet", opis: "its robotic inhabitants." },
        { klucz: "DECIDE", tytul: "Decide", opis: "whether humans are ready to live on Mars." },
      ],
      pytanie: "Are humans ready to live on Mars?",
      tasma: {
        etykieta: "Mission steps",
        grupa: "Mission steps carousel",
        pokaz: "Show",
        dalej: "Next mission step",
        poczatek: "Back to the first mission step",
      },
    },
    humanoidy: {
      overline: "Real humanoids",
      zaprzeczenie: "These are not film props.",
      tytul: "These are real humanoid robots",
      liczba: "~26",
      liczbaOpis: "robots across the whole ecosystem",
      akapit:
        "Humanoid, exploration and utility robots will become part of the world being built at Alvernia Planet.",
      wyroznienie1: "You will not just see them.",
      wyroznienie2: "You will interact with them.",
      robotAlt: "A humanoid robot in a white shell, with a screen where its face would be",
    },
    scena: {
      odtworz: "Replay",
    },
    ekosystem: {
      overline: "More than one mission",
      tytul: "Mars is only the beginning",
      filary: [
        { tytul: "Mars Colonization", opis: "A cinematic mission to colonise Mars.", etap: "Current mission" },
        { tytul: "Humanoids Lab", opis: "Get to know the robots, experiment and interact with them.", etap: "Next stage" },
        { tytul: "Robotics Showroom", opis: "See how robots can change everyday life and business.", etap: "Technology in practice" },
      ],
    },
    dlaKogo: {
      overline: "Who it is for",
      tytul: "Who will set foot on Mars",
      odbiorcy: [
        { tytul: "Families", opis: "Live through a mission on Mars together." },
        { tytul: "Experience seekers", opis: "Film, technology, robots and a world worth showing others." },
        { tytul: "Schools", opis: "Edutainment: robotics, artificial intelligence, space, biology and energy." },
        { tytul: "Technology fans", opis: "Meet real humanoids." },
        { tytul: "Companies", opis: "See robots in action and explore how they could work in your business." },
      ],
      ctaFirmy: "Explore the offer for companies",
    },
    b2b: {
      overline: "Robotics Showroom",
      tytul: "From Mars to your company",
      akapit:
        "Humanoid robotics is no longer only science fiction. At Alvernia Planet, business owners will be able to see robots in action, learn what they can do and talk about putting them to work in their own company.",
      cta: "I am interested in solutions for business",
    },
    final: {
      overline: "Countdown",
      tytul: "The mission begins on 2 January 2027",
      jednostki: { dni: "days", godziny: "hours", minuty: "minutes", sekundy: "seconds" },
      poStarcie: "The mission has launched.",
      przedsprzedazEtykieta: "Ticket pre-sale",
      przedsprzedazData: "4 November 2026",
      tytulFormularza: "Notify me when tickets go on sale",
    },
    formularz: {
      imie: "First name",
      nazwisko: "Last name",
      email: "Your e-mail",
      zgoda:
        "I consent to being contacted by Alvernia Planet in order to present information about Alvernia Planet's offerings. I know that I can withdraw this consent at any time.",
      politykaPrzed: "Details in the",
      politykaLink: "privacy policy",
      politykaPo: ".",
      wyslij: "I want to know first",
      wysylanie: "Sending…",
      sukces: "Done. We will be in touch when the pre-sale starts.",
      blad: "Sending failed. Please try again in a moment.",
      wymagane: "Required fields",
      bladImie: "Please enter your first name.",
      bladNazwisko: "Please enter your last name.",
      bladEmail: "Please enter a valid e-mail address.",
      bladZgoda: "Consent is required so that we can contact you.",
    },
    alt: {
      hero: "A colony of domes on the red plains of Mars beneath a vast planet and a starry sky",
      kolonia2035: "A humanoid robot watches over the prepared Martian base in red and turquoise light",
      habitat: "Interior of a habitat with hydroponic crops aboard the colony",
    },
  },

  de: {
    meta: {
      tytul: "Mars Colonization — Humanoide und eine filmreife Mission, Alvernia Planet",
      opis:
        "Sonderausstellung — nur 3 Monate. Mars Colonization im Alvernia Planet: eine rund einstündige filmreife Mission mit echten humanoiden Robotern. Vorverkauf ab 4. November 2026, erste Missionen ab 2. Januar 2027.",
    },
    hud: {
      misja: "MARS COLONIZATION",
      status: "PREPARING",
      inspektorzy: "REQUIRED",
      przedsprzedaz: "04.11.2026",
      przybycie: "02.01.2027",
    },
    hero: {
      nadtytulMarka: "Alvernia Planet",
      nadtytulCzasownik: "präsentiert",
      tytul: "Mars Colonization",
      podtytul: "Cinematic & Humanoids Experience",
      haslo1: "Science-Fiction wird Wirklichkeit.",
      haslo2: "Menschen und Humanoide besiedeln den Mars Seite an Seite.",
      dataPrzedsprzedazy: { etykieta: "Vorverkauf", wartosc: "04.11.2026" },
      dataMisji: { etykieta: "Erste Missionen", wartosc: "02.01.2027" },
      czasWystawy: { etykieta: "Sonderausstellung", wartosc: "Nur 3 Monate" },
      cta: "Benachrichtigen Sie mich zum Vorverkaufsstart",
      ctaDrugi: "Mission entdecken",
    },
    rok2035: {
      overline: "Das Jahr 2033",
      tytul: "Die Roboter kamen zuerst.",
      tytulAkcent: "zuerst.",
      akapit1:
        "Zwei Jahre zuvor wurden humanoide Roboter zum Mars geschickt. Sie hatten eine einzige Aufgabe:",
      zadanie: "Den Planeten auf die Ankunft des Menschen vorbereiten.",
      zasoby: ["Wasser", "Sauerstoff", "Nahrung", "Energie", "Unterkunft"],
      akapit2: "Jetzt kommen die Menschen auf dem Mars an. Nicht als Touristen.",
      status: "Als Colony Inspectors",
      pytanie: "Ist der Mars bereit für den Menschen?",
      pytanieAkcent: "für den Menschen?",
    },
    czym: {
      overline: "Was ist Mars Colonization?",
      zaprzeczenie: "Das ist keine Roboterausstellung.",
      tytul: "Es ist eine filmreife Mission und Sie sind ihr Held",
      akapit1:
        "Sie betreten eine immersive Marswelt und erkunden gemeinsam mit humanoiden Robotern die Kolonie, die sie errichtet haben. Die ganze Mission dauert etwa eine Stunde.",
      akapit2:
        "Sie erkunden, erfüllen Aufgaben, treffen Entscheidungen und interagieren mit den Robotern — und prüfen, ob sie den Mars wirklich auf die Ankunft des Menschen vorbereitet haben.",
    },
    misja: {
      overline: "Ihre Mission",
      statusEtykieta: "Ihr Status",
      statusWartosc: "Colony Inspector",
      tytul: "Fünf Schritte der Mission",
      kroki: [
        /* Rzeczowniki w nagłówku i PEŁNE zdania w opisie: układ rozbija te dwa
           pola na osobne wiersze, więc tryb rozkazujący z „Sie" zostawiał
           w każdym opisie sierocy zaimek, który nie jest zdaniem. */
        { klucz: "LAND", tytul: "Landung", opis: "Sie landen auf dem Mars." },
        { klucz: "SURVIVE", tytul: "Prüfung", opis: "Sie prüfen, ob die Roboter Lebensbedingungen geschaffen haben." },
        { klucz: "EXPLORE", tytul: "Erkundung", opis: "Sie erkunden eine neue Welt." },
        { klucz: "EXPERIENCE", tytul: "Begegnung", opis: "Sie begegnen den robotischen Bewohnern." },
        { klucz: "DECIDE", tytul: "Entscheidung", opis: "Sie entscheiden, ob der Mensch auf dem Mars leben kann." },
      ],
      pytanie: "Ist der Mensch bereit, auf dem Mars zu leben?",
      tasma: {
        etykieta: "Missionsschritte",
        grupa: "Karussell der Missionsschritte",
        pokaz: "Anzeigen",
        dalej: "Nächster Missionsschritt",
        poczatek: "Zurück zum ersten Missionsschritt",
      },
    },
    humanoidy: {
      overline: "Real humanoids",
      zaprzeczenie: "Das sind keine Filmrequisiten.",
      tytul: "Das sind echte humanoide Roboter",
      liczba: "~26",
      liczbaOpis: "Roboter im gesamten Ökosystem",
      akapit:
        "Humanoide, Erkundungs- und Nutzroboter werden Teil der Welt, die im Alvernia Planet entsteht.",
      wyroznienie1: "Sie werden sie nicht nur sehen.",
      wyroznienie2: "Sie werden mit ihnen interagieren.",
      robotAlt: "Humanoider Roboter mit weißem Gehäuse und einem Bildschirm als Gesicht",
    },
    scena: {
      odtworz: "Erneut abspielen",
    },
    ekosystem: {
      overline: "Mehr als eine Mission",
      tytul: "Der Mars ist erst der Anfang",
      filary: [
        { tytul: "Mars Colonization", opis: "Eine filmreife Mission zur Besiedlung des Mars.", etap: "Aktuelle Mission" },
        { tytul: "Humanoids Lab", opis: "Lernen Sie die Roboter kennen, experimentieren und interagieren Sie.", etap: "Nächste Etappe" },
        { tytul: "Robotics Showroom", opis: "Sehen Sie, wie Roboter Alltag und Geschäft verändern können.", etap: "Technologie in der Praxis" },
      ],
    },
    dlaKogo: {
      overline: "Für wen",
      tytul: "Wer den Mars betritt",
      odbiorcy: [
        { tytul: "Familien", opis: "Erleben Sie gemeinsam eine Mission auf dem Mars." },
        { tytul: "Erlebnishungrige", opis: "Film, Technik, Roboter und eine Welt, die man zeigen will." },
        { tytul: "Schulen", opis: "Edutainment: Robotik, künstliche Intelligenz, Weltraum, Biologie und Energie." },
        { tytul: "Technikfans", opis: "Begegnen Sie echten Humanoiden." },
        { tytul: "Unternehmen", opis: "Sehen Sie Roboter im Einsatz und entdecken Sie Möglichkeiten für Ihr Geschäft." },
      ],
      ctaFirmy: "Angebot für Unternehmen entdecken",
    },
    b2b: {
      overline: "Robotics Showroom",
      tytul: "Vom Mars in Ihr Unternehmen",
      akapit:
        "Humanoide Robotik ist längst nicht mehr nur Science-Fiction. Im Alvernia Planet können Unternehmen die Roboter im Einsatz sehen, ihre Anwendungen kennenlernen und über den Einsatz im eigenen Betrieb sprechen.",
      cta: "Ich interessiere mich für Lösungen für Unternehmen",
    },
    final: {
      overline: "Countdown",
      tytul: "Die Mission beginnt am 02.01.2027",
      jednostki: { dni: "Tage", godziny: "Stunden", minuty: "Minuten", sekundy: "Sekunden" },
      poStarcie: "Die Mission ist gestartet.",
      przedsprzedazEtykieta: "Ticket-Vorverkauf",
      przedsprzedazData: "04.11.2026",
      tytulFormularza: "Benachrichtigen Sie mich zum Verkaufsstart",
    },
    formularz: {
      imie: "Vorname",
      nazwisko: "Nachname",
      email: "Ihre E-Mail",
      zgoda:
        "Ich willige ein, von Alvernia Planet kontaktiert zu werden, um Informationen über das Angebot von Alvernia Planet zu erhalten. Ich weiß, dass ich diese Einwilligung jederzeit widerrufen kann.",
      politykaPrzed: "Details in der",
      politykaLink: "Datenschutzerklärung",
      politykaPo: ".",
      wyslij: "Ich will es zuerst wissen",
      wysylanie: "Wird gesendet…",
      sukces: "Fertig. Wir melden uns, sobald der Vorverkauf startet.",
      blad: "Senden fehlgeschlagen. Bitte versuchen Sie es gleich noch einmal.",
      wymagane: "Pflichtfelder",
      bladImie: "Bitte geben Sie Ihren Vornamen an.",
      bladNazwisko: "Bitte geben Sie Ihren Nachnamen an.",
      bladEmail: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
      bladZgoda: "Die Einwilligung ist nötig, damit wir uns melden dürfen.",
    },
    alt: {
      hero: "Eine Kuppelkolonie auf der roten Ebene des Mars unter einem riesigen Planeten und einem Sternenhimmel",
      kolonia2035: "Ein humanoider Roboter überwacht die vorbereitete Marsbasis in rotem und türkisem Licht",
      habitat: "Inneres eines Habitats mit hydroponischem Anbau an Bord der Kolonie",
    },
  },

  pt: {
    meta: {
      tytul: "Mars Colonization — humanoides e uma missão cinematográfica, Alvernia Planet",
      opis:
        "Exposição temporária — só 3 meses. Mars Colonization no Alvernia Planet: uma missão cinematográfica de cerca de uma hora com robôs humanoides reais. Pré-venda a 4 de novembro de 2026, primeiras missões a 2 de janeiro de 2027.",
    },
    hud: {
      misja: "MARS COLONIZATION",
      status: "PREPARING",
      inspektorzy: "REQUIRED",
      przedsprzedaz: "04.11.2026",
      przybycie: "02.01.2027",
    },
    hero: {
      nadtytulMarka: "Alvernia Planet",
      nadtytulCzasownik: "apresenta",
      tytul: "Mars Colonization",
      podtytul: "Cinematic & Humanoids Experience",
      haslo1: "A ficção científica torna-se realidade.",
      haslo2: "Humanos e humanoides colonizam Marte lado a lado.",
      dataPrzedsprzedazy: { etykieta: "Pré-venda", wartosc: "04.11.2026" },
      dataMisji: { etykieta: "Primeiras missões", wartosc: "02.01.2027" },
      czasWystawy: { etykieta: "Exposição temporária", wartosc: "Só 3 meses" },
      cta: "Avisem-me quando começar a pré-venda",
      ctaDrugi: "Descobrir a missão",
    },
    rok2035: {
      overline: "O ano de 2033",
      tytul: "Os robôs chegaram primeiro.",
      tytulAkcent: "primeiro.",
      akapit1:
        "Dois anos antes, robôs humanoides foram enviados para Marte. Tinham uma única tarefa:",
      zadanie: "Preparar o planeta para a chegada do ser humano.",
      zasoby: ["Água", "Oxigénio", "Alimento", "Energia", "Abrigo"],
      akapit2: "Agora chegam os humanos a Marte. Não como turistas.",
      status: "Como Colony Inspectors",
      pytanie: "Marte está pronto para o ser humano?",
      pytanieAkcent: "para o ser humano?",
    },
    czym: {
      overline: "O que é o Mars Colonization?",
      zaprzeczenie: "Isto não é uma exposição de robôs.",
      tytul: "É uma missão cinematográfica e o herói é você",
      akapit1:
        "Entra num mundo imersivo de Marte e, juntamente com robôs humanoides, descobre a colónia que eles construíram. A missão dura cerca de uma hora.",
      akapit2:
        "Vai explorar, cumprir tarefas, tomar decisões e interagir com os robôs — verificando se prepararam mesmo Marte para a chegada do ser humano.",
    },
    misja: {
      overline: "A sua missão",
      statusEtykieta: "O seu estatuto",
      statusWartosc: "Colony Inspector",
      tytul: "Cinco passos da missão",
      kroki: [
        { klucz: "LAND", tytul: "Aterre", opis: "em Marte." },
        { klucz: "SURVIVE", tytul: "Verifique", opis: "se os robôs criaram condições de vida." },
        { klucz: "EXPLORE", tytul: "Explore", opis: "um mundo novo." },
        { klucz: "EXPERIENCE", tytul: "Conheça", opis: "os seus habitantes robóticos." },
        { klucz: "DECIDE", tytul: "Decida", opis: "se o ser humano está pronto para viver em Marte." },
      ],
      pytanie: "O ser humano está pronto para viver em Marte?",
      tasma: {
        etykieta: "Passos da missão",
        grupa: "Carrossel dos passos da missão",
        pokaz: "Mostrar",
        dalej: "Próximo passo da missão",
        poczatek: "Voltar ao primeiro passo da missão",
      },
    },
    humanoidy: {
      overline: "Real humanoids",
      zaprzeczenie: "Não são adereços de cinema.",
      tytul: "São robôs humanoides reais",
      liczba: "~26",
      liczbaOpis: "robôs em todo o ecossistema",
      akapit:
        "Robôs humanoides, de exploração e utilitários passarão a fazer parte do mundo criado no Alvernia Planet.",
      wyroznienie1: "Não vai apenas vê-los.",
      wyroznienie2: "Vai interagir com eles.",
      robotAlt: "Robô humanoide de carcaça branca, com um visor no lugar do rosto",
    },
    scena: {
      odtworz: "Repetir",
    },
    ekosystem: {
      overline: "Mais do que uma missão",
      tytul: "Marte é apenas o começo",
      filary: [
        { tytul: "Mars Colonization", opis: "Uma missão cinematográfica de colonização de Marte.", etap: "Missão atual" },
        { tytul: "Humanoids Lab", opis: "Conheça os robôs, experimente e interaja com eles.", etap: "Próxima etapa" },
        { tytul: "Robotics Showroom", opis: "Veja como os robôs podem mudar o dia a dia e os negócios.", etap: "Tecnologia na prática" },
      ],
    },
    dlaKogo: {
      overline: "Para quem",
      tytul: "Quem vai pisar Marte",
      odbiorcy: [
        { tytul: "Famílias", opis: "Vivam juntos uma missão em Marte." },
        { tytul: "Em busca de emoções", opis: "Cinema, tecnologia, robôs e um mundo que vale a pena mostrar." },
        { tytul: "Escolas", opis: "Edutainment: robótica, inteligência artificial, espaço, biologia e energia." },
        { tytul: "Fãs de tecnologia", opis: "Conheça humanoides a sério." },
        { tytul: "Empresas", opis: "Veja os robôs em ação e descubra o que podem fazer pelo seu negócio." },
      ],
      ctaFirmy: "Conheça a oferta para empresas",
    },
    b2b: {
      overline: "Robotics Showroom",
      tytul: "De Marte para a sua empresa",
      akapit:
        "A robótica humanoide deixou de ser apenas ficção científica. No Alvernia Planet, as empresas poderão ver os robôs em ação, conhecer as suas aplicações e falar sobre como os usar no seu próprio negócio.",
      cta: "Tenho interesse em soluções para empresas",
    },
    final: {
      overline: "Contagem decrescente",
      tytul: "A missão começa a 02.01.2027",
      jednostki: { dni: "dias", godziny: "horas", minuty: "minutos", sekundy: "segundos" },
      poStarcie: "A missão já arrancou.",
      przedsprzedazEtykieta: "Pré-venda de bilhetes",
      przedsprzedazData: "04.11.2026",
      tytulFormularza: "Avisem-me quando os bilhetes estiverem à venda",
    },
    formularz: {
      imie: "Nome",
      nazwisko: "Apelido",
      email: "O seu e-mail",
      zgoda:
        "Autorizo o contacto por parte do Alvernia Planet para apresentação de informações sobre a oferta do Alvernia Planet. Sei que posso retirar este consentimento a qualquer momento.",
      politykaPrzed: "Detalhes na",
      politykaLink: "política de privacidade",
      politykaPo: ".",
      wyslij: "Quero saber primeiro",
      wysylanie: "A enviar…",
      sukces: "Pronto. Entraremos em contacto quando a pré-venda começar.",
      blad: "Não foi possível enviar. Tente novamente dentro de instantes.",
      wymagane: "Campos obrigatórios",
      bladImie: "Indique o seu nome.",
      bladNazwisko: "Indique o seu apelido.",
      bladEmail: "Indique um endereço de e-mail válido.",
      bladZgoda: "O consentimento é necessário para podermos contactá-lo.",
    },
    alt: {
      hero: "Uma colónia de cúpulas na planície vermelha de Marte, sob um planeta imenso e um céu estrelado",
      kolonia2035: "Um robô humanoide observa a base marciana preparada sob luz vermelha e turquesa",
      habitat: "Interior de um habitat com cultura hidropónica a bordo da colónia",
    },
  },

  zh: {
    meta: {
      tytul: "Mars Colonization — 人形机器人与电影级任务，Alvernia Planet",
      opis:
        "限时展览，仅限 3 个月。Alvernia Planet 的 Mars Colonization：约一小时的电影级任务，与真实的人形机器人同行。2026 年 11 月 4 日开启预售，2027 年 1 月 2 日首批任务启程。",
    },
    hud: {
      misja: "MARS COLONIZATION",
      status: "PREPARING",
      inspektorzy: "REQUIRED",
      przedsprzedaz: "04.11.2026",
      przybycie: "02.01.2027",
    },
    hero: {
      nadtytulMarka: "Alvernia Planet",
      nadtytulCzasownik: "呈现",
      tytul: "Mars Colonization",
      podtytul: "Cinematic & Humanoids Experience",
      haslo1: "科幻正在成为现实。",
      haslo2: "人类与人形机器人并肩殖民火星。",
      dataPrzedsprzedazy: { etykieta: "预售", wartosc: "2026年11月4日" },
      dataMisji: { etykieta: "首批任务", wartosc: "2027年1月2日" },
      czasWystawy: { etykieta: "限时展览", wartosc: "仅限 3 个月" },
      cta: "预售开始时通知我",
      ctaDrugi: "了解任务",
    },
    rok2035: {
      overline: "2033 年",
      tytul: "机器人先行抵达",
      tytulAkcent: "先行抵达",
      akapit1: "两年前，人形机器人被送往火星。它们只有一项任务：",
      zadanie: "为人类的到来准备好这颗行星。",
      zasoby: ["水", "氧气", "食物", "能源", "居所"],
      akapit2: "如今人类抵达火星。不是作为游客。",
      status: "而是作为 Colony Inspectors",
      pytanie: "火星准备好迎接人类了吗？",
      pytanieAkcent: "迎接人类了吗？",
    },
    czym: {
      overline: "什么是 Mars Colonization？",
      zaprzeczenie: "这不是机器人展览。",
      tytul: "这是一场电影级任务，而你就是主角",
      akapit1:
        "你将走进沉浸式的火星世界，与人形机器人一起探索它们建成的殖民地。整场任务约一小时。",
      akapit2:
        "你将探索、完成任务、做出决定，并与机器人互动——亲自查验它们是否真的为人类的到来做好了准备。",
    },
    misja: {
      overline: "你的任务",
      statusEtykieta: "你的身份",
      statusWartosc: "Colony Inspector",
      tytul: "任务的五个步骤",
      kroki: [
        { klucz: "LAND", tytul: "着陆", opis: "降落火星。" },
        { klucz: "SURVIVE", tytul: "查验", opis: "机器人是否创造了可供生存的条件。" },
        { klucz: "EXPLORE", tytul: "探索", opis: "一个全新的世界。" },
        { klucz: "EXPERIENCE", tytul: "相遇", opis: "与它的机器人居民见面。" },
        { klucz: "DECIDE", tytul: "决定", opis: "人类是否已准备好在火星生活。" },
      ],
      pytanie: "人类已准备好在火星生活了吗？",
      tasma: {
        etykieta: "任务步骤",
        grupa: "任务步骤轮播",
        pokaz: "查看",
        dalej: "下一个任务步骤",
        poczatek: "返回第一个任务步骤",
      },
    },
    humanoidy: {
      overline: "Real humanoids",
      zaprzeczenie: "它们不是电影道具。",
      tytul: "它们是真实的人形机器人",
      liczba: "~26 台",
      liczbaOpis: "机器人构成整个生态",
      akapit: "人形机器人、探索机器人与功能机器人，将成为 Alvernia Planet 所构建世界的一部分。",
      wyroznienie1: "你不只是看见它们。",
      wyroznienie2: "你将与它们互动。",
      robotAlt: "白色外壳、以屏幕作脸的人形机器人",
    },
    scena: {
      odtworz: "重新播放",
    },
    ekosystem: {
      overline: "不止一场任务",
      tytul: "火星只是开始",
      filary: [
        { tytul: "Mars Colonization", opis: "一场殖民火星的电影级任务。", etap: "当前任务" },
        { tytul: "Humanoids Lab", opis: "认识机器人，动手实验，与它们互动。", etap: "下一阶段" },
        { tytul: "Robotics Showroom", opis: "看看机器人如何改变日常生活与商业。", etap: "技术实践" },
      ],
    },
    dlaKogo: {
      overline: "适合谁",
      tytul: "谁将踏上火星",
      odbiorcy: [
        { tytul: "家庭", opis: "一起经历一场火星任务。" },
        { tytul: "体验爱好者", opis: "电影、科技、机器人，还有值得分享的世界。" },
        { tytul: "学校", opis: "寓教于乐：机器人、人工智能、太空、生物与能源。" },
        { tytul: "科技迷", opis: "与真正的人形机器人见面。" },
        { tytul: "企业", opis: "看机器人如何工作，了解它们能为业务带来什么。" },
      ],
      ctaFirmy: "了解企业方案",
    },
    b2b: {
      overline: "Robotics Showroom",
      tytul: "从火星到你的公司",
      akapit:
        "人形机器人不再只是科幻。在 Alvernia Planet，企业可以看到机器人实际运作，了解它们的应用，并探讨在自己公司中落地的可能。",
      cta: "我对面向企业的方案感兴趣",
    },
    final: {
      overline: "倒计时",
      tytul: "任务将于 2027 年 1 月 2 日开始",
      jednostki: { dni: "天", godziny: "小时", minuty: "分", sekundy: "秒" },
      poStarcie: "任务已经启程。",
      przedsprzedazEtykieta: "门票预售",
      przedsprzedazData: "2026 年 11 月 4 日",
      tytulFormularza: "门票开售时通知我",
    },
    formularz: {
      imie: "名",
      nazwisko: "姓",
      email: "你的电子邮箱",
      zgoda:
        "我同意 Alvernia Planet 与我联系，以介绍 Alvernia Planet 的相关信息。我知道可以随时撤回此同意。",
      politykaPrzed: "详见",
      politykaLink: "隐私政策",
      politykaPo: "。",
      wyslij: "我要第一个知道",
      wysylanie: "发送中…",
      sukces: "完成。预售开始时我们会与你联系。",
      blad: "发送失败，请稍后再试。",
      wymagane: "必填项",
      bladImie: "请填写名。",
      bladNazwisko: "请填写姓。",
      bladEmail: "请填写有效的电子邮箱地址。",
      bladZgoda: "需要你的同意，我们才能与你联系。",
    },
    alt: {
      hero: "火星红色平原上的穹顶殖民地，上方是巨大的行星和满天繁星",
      kolonia2035: "类人机器人在红色与青色光线中注视着已准备好的火星基地",
      habitat: "殖民地居住舱内部的水培种植区",
    },
  },
};
