import type { Locale } from "@/lib/localizedRoutes";

/* Teksty podstrony „Jak dojechać" w pięciu językach.
   Gwiazdki w tytule (*tak*) wycina `tytulZAkcentem` i zamienia na akcent
   kolorystyczny — ten sam zapis co na /wydarzenia.
   Żaden tekst nie twierdzi niczego, czego nie ma w `dojazdData.ts`. */

export type TrybDojazdu = "auto" | "bus" | "flix";

export type DojazdCopy = {
  meta: { locale: string };
  hero: { eyebrow: string; title: string; titleLacznik: string; titleAkcent: string; lead: string };
  planer: {
    label: string;
    pytanie: string;
    tryby: Record<TrybDojazdu, string>;
    trybyOpis: Record<TrybDojazdu, string>;
  };
  auto: {
    title: string;
    lead: string;
    fakty: string[];
    adresLabel: string;
    kopiuj: string;
    skopiowano: string;
    nawiguj: string;
    lokalizacja: string;
    ukryjLokalizacje: string;
    innyStart: string;
    innyStartOpis: string;
    orientacyjne: string;
    trasaZ: string;
  };
  pociag: {
    title: string;
    lead: string;
    etapy: [{ nazwa: string; opis: string }, { nazwa: string; opis: string }];
    glownaAkcja: string;
    naMiejscu: string;
    naMiejscuOpis: string;
    stacja: string;
    stacjaLead: string;
    rozkladPociagow: string;
    rozkladTytul: string;
    mapaPrzystanku: string;
    zaMin: (minut: number) => string;
    kierunekLabel: string;
    kierunki: { doObiektu: string; doKrzeszowic: string };
    dzienLabel: string;
    dzis: string;
    najblizszy: string;
    pierwszyWDniu: string;
    dni: { piatek: string; weekend: string };
    odjazdZ: { krzeszowice: string; obiekt: string };
    kurs: string;
    zPrzystanku: string;
    kolejne: string;
    pelnyRozklad: string;
    brakKursow: string;
    rozkladWygasl: string;
    zrodlo: (data: string) => string;
    przystanekKrzeszowice: string;
    przystanekObiekt: string;
    /* Te same dwa przystanki rozbite na nazwę i dopisek — kafel najbliższego
       odjazdu pokazuje je w dwóch wierszach, a nie jednym ciągiem z przecinkiem. */
    punkty: Record<"krzeszowice" | "obiekt", { nazwa: string; opis: string }>;
    trasaDoPrzystanku: string;
    pinDoPotwierdzenia: string;
    czegoNieWiemy: string;
  };
  autobus: {
    title: string;
    lead: string;
    dowozi: string;
    ostatniOdcinek: string;
    rozkladLink: string;
    szczegoly: string;
    brakGodzin: string;
    przewoznicy: Record<"flixbus" | "mbus" | "magoma", { nazwa: string; skad: string; dokad: string; uwaga: string }>;
  };
  mapa: {
    naglowek: string;
    opis: string;
    pokaz: string;
    ladowanie: string;
    /* Napis widoczny w szkielecie mapy; `ladowanie` zostaje dla czytników
       ekranu, bo mówi wprost, co się wczytuje. */
    ladowanieHaslo: string;
    blad: string;
    ponow: string;
    otworz: string;
    ramkaTytul: string;
    informacja: string;
  };
  miejsce: {
    title: string;
    lead: string;
    punkty: Record<"wjazd" | "wejscie" | "przystanek", { nazwa: string; opis: string }>;
    /* Pierwsze zdanie opisu wjazdu, osobno: w podpisie na zdjęciu pełny opis
       zajmował cztery wiersze i przykrywał kadr. Ta sama treść, krótszy wycinek. */
    wjazdKrotko: string;
    powieksz: string;
    zamknij: string;
    zdjecieAlt: string;
  };
  okolica: {
    title: string;
    pokaz: string;
    ukryj: string;
    unit: string;
    orientacyjne: string;
    poprzednie: string;
    nastepne: string;
    nazwy: Record<string, string>;
  };
  pomoc: { title: string; lead: string; telefon: string; email: string };
  atrakcje: { title: string };
  faq: { title: string; pytania: { dni: string; skad: string; parking: string; inne: string } };
  pasek: { nawiguj: string; rozklad: string };
  punkty: Record<string, string>;
};

export const DOJAZD_COPY: Record<Locale, DojazdCopy> = {
  pl: {
    meta: { locale: "pl-PL" },
    hero: {
      eyebrow: "ZAPLANUJ DOJAZD",
      title: "Jak dojechać",
      titleLacznik: "do",
      titleAkcent: "Alvernia Planet?",
      lead: "Jesteśmy przy autostradzie A4, między Krakowem a Katowicami. Wybierz najwygodniejszą trasę i przyjedź do świata nauki, kosmosu i niesamowitych doznań.",
    },
    planer: {
      pytanie: "Czym do nas jedziesz?",
      label: "Jak chcesz dojechać?",
      tryby: { auto: "Samochodem", bus: "Pociąg + bus", flix: "FlixBus" },
      trybyOpis: {
        auto: "Adres, parking i trasa",
        bus: "Rozkład busa i przewoźnicy",
        flix: "Połączenia dalekobieżne",
      },
    },
    auto: {
      title: "Prosto pod kopuły",
      lead: "Zjazd z A4 i jesteś na miejscu.",
      fakty: ["Przy A4", "300+ miejsc parkingowych"],
      adresLabel: "ADRES",
      kopiuj: "Kopiuj adres",
      skopiowano: "Skopiowano",
      nawiguj: "Uruchom nawigację",
      lokalizacja: "Zobacz na mapie",
      ukryjLokalizacje: "Ukryj mapę",
      innyStart: "Trasa z innego miejsca",
      innyStartOpis: "Wybierz punkt startu, a otworzymy trasę w Twoich mapach.",
      orientacyjne: "odległości orientacyjne",
      trasaZ: "Trasa z",
    },
    pociag: {
      title: "Pociągiem do Krzeszowic, dalej naszym busem",
      lead: "Bus kursuje w piątki, soboty i niedziele.",
      etapy: [
        { nazwa: "Pociąg do PKP Krzeszowice", opis: "Dowolny pociąg do stacji Krzeszowice." },
        { nazwa: "Bus do Alvernia Planet", opis: "Bus rusza z parkingu tuż obok dworca, przy peronie 1." },
      ],
      glownaAkcja: "Sprawdź rozkład busa",
      naMiejscu: "I jesteś na miejscu",
      naMiejscuOpis: "Bus zatrzymuje się przy samym wejściu.",
      stacja: "Stacja Krzeszowice",
      stacjaLead: "To tutaj wsiądziesz w naszego busa.",
      rozkladPociagow: "Sprawdź rozkład pociągów",
      rozkladTytul: "Rozkład jazdy busa",
      mapaPrzystanku: "Pokaż przystanek na mapie",
      zaMin: (m) => `za ${m} min`,
      kierunekLabel: "Kierunek",
      kierunki: { doObiektu: "Do Alvernia Planet", doKrzeszowic: "Do Krzeszowic" },
      dzienLabel: "Dzień podróży",
      dzis: "dziś",
      najblizszy: "Najbliższy odjazd wg rozkładu",
      pierwszyWDniu: "Pierwszy odjazd w wybranym dniu",
      dni: { piatek: "Piątek", weekend: "Sobota i niedziela" },
      odjazdZ: { krzeszowice: "Odjazd z Krzeszowic", obiekt: "Odjazd z Alvernia Planet" },
      kurs: "Kurs",
      zPrzystanku: "z przystanku",
      kolejne: "Kolejne odjazdy",
      pelnyRozklad: "Pełny rozkład",
      brakKursow: "Tego dnia bus nie kursuje.",
      rozkladWygasl: "Ten rozkład stracił ważność. Zadzwoń po aktualne godziny.",
      zrodlo: (data) => `Rozkład przekazany przez obiekt, stan na ${data}.`,
      przystanekKrzeszowice: "Krzeszowice, przy dworcu PKP",
      przystanekObiekt: "Alvernia Planet, parking",
      punkty: {
        krzeszowice: { nazwa: "Krzeszowice", opis: "przy dworcu PKP" },
        obiekt: { nazwa: "Alvernia Planet", opis: "parking" },
      },
      trasaDoPrzystanku: "Trasa do przystanku w Krzeszowicach",
      pinDoPotwierdzenia: "Dokładne miejsce postoju potwierdzamy z obiektem.",
      czegoNieWiemy: "Cena przejazdu, przewoźnik i kursy w święta — zapytaj przed podróżą.",
    },
    autobus: {
      title: "Autobusem",
      lead: "Połączenia przewoźników z Krakowa i z Krzeszowic.",
      dowozi: "Dowozi pod obiekt",
      ostatniOdcinek: "Ostatni odcinek we własnym zakresie",
      rozkladLink: "Rozkład u przewoźnika",
      szczegoly: "Szczegóły",
      brakGodzin: "Godziny i ceny sprawdź u przewoźnika — zmieniają się sezonowo.",
      przewoznicy: {
        flixbus: {
          nazwa: "FlixBus",
          skad: "Kraków MDA, ul. Bosacka",
          dokad: "Alvernia Planet",
          uwaga: "Autobus zatrzymuje się bezpośrednio pod obiektem.",
        },
        mbus: {
          nazwa: "M-Bus Matysik",
          skad: "Krzeszowice, Dworzec Komunikacyjny",
          dokad: "Rudno",
          uwaga: "Z Rudna do obiektu trzeba dojechać albo dojść we własnym zakresie.",
        },
        magoma: {
          nazwa: "MAGOMA",
          skad: "Krzeszowice, Dworzec Komunikacyjny",
          dokad: "Zalas – Centrum",
          uwaga: "Z Zalasu do obiektu trzeba dojechać albo dojść we własnym zakresie. Linia nie kursuje w weekendy.",
        },
      },
    },
    mapa: {
      naglowek: "Alvernia Planet na mapie",
      opis: "Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
      pokaz: "Pokaż mapę Google",
      ladowanie: "Wczytuję mapę…",
      ladowanieHaslo: "Ładowanie wszechświata…",
      blad: "Nie udało się wczytać mapy Google.",
      ponow: "Spróbuj ponownie",
      otworz: "Otwórz w Google Maps",
      ramkaTytul: "Mapa: Alvernia Planet",
      informacja: "Mapa ładuje się z serwerów Google, które mogą zapisać pliki cookie.",
    },
    miejsce: {
      title: "Na miejscu",
      lead: "Ostatni odcinek, krok po kroku.",
      punkty: {
        wjazd: { nazwa: "Wjazd i parking", opis: "Zjazd z drogi prowadzi prosto na teren obiektu, parking dla gości jest przy samym wejściu — 300+ miejsc." },
        wejscie: { nazwa: "Wejście do obiektu", opis: "Wejście główne pod kopułami, od strony parkingu." },
        przystanek: { nazwa: "Przystanek busa", opis: "Bus z Krzeszowic zatrzymuje się na parkingu przy obiekcie." },
      },
      wjazdKrotko: "Zjazd z drogi prowadzi prosto na teren obiektu.",
      powieksz: "Powiększ",
      zamknij: "Zamknij",
      zdjecieAlt: "Wejście na teren Alvernia Planet od strony parkingu",
    },
    okolica: {
      title: "W okolicy",
      pokaz: "Pokaż atrakcje w okolicy",
      ukryj: "Ukryj atrakcje",
      unit: "km",
      orientacyjne: "Odległości orientacyjne, drogą publiczną.",
      poprzednie: "Poprzednie atrakcje",
      nastepne: "Następne atrakcje",
      nazwy: {
        tenczyn: "Zamek Tenczyn",
        wygielzow: "Muzeum Małopolski Zachodniej w Wygiełzowie",
        energylandia: "Energylandia",
        zatorland: "Zatorland",
        grodek: "Park Gródek",
        auschwitz: "Muzeum Auschwitz-Birkenau",
        wieliczka: "Kopalnia Soli w Wieliczce",
      },
    },
    pomoc: {
      title: "Potrzebujesz wskazówek?",
      lead: "Zadzwoń albo napisz — podpowiemy najszybszą trasę.",
      telefon: "Zadzwoń",
      email: "Napisz do nas",
    },
    atrakcje: { title: "Masz więcej czasu? Atrakcje w okolicy" },
    faq: {
      title: "Najczęściej zadawane pytania",
      pytania: {
        dni: "W jakie dni kursuje bus?",
        skad: "Skąd odjeżdża bus w Krzeszowicach?",
        parking: "Gdzie zaparkować przy obiekcie?",
        inne: "Czym jeszcze można dojechać?",
      },
    },
    pasek: { nawiguj: "Otwórz trasę", rozklad: "Rozkład busa" },
    punkty: {
      krakow: "Kraków",
      katowice: "Katowice",
      balice: "Lotnisko Kraków-Balice",
      pyrzowice: "Lotnisko Katowice-Pyrzowice",
      krzeszowice: "Dworzec PKP Krzeszowice",
    },
  },

  en: {
    meta: { locale: "en-GB" },
    hero: {
      eyebrow: "PLAN YOUR TRIP",
      title: "How to reach",
      titleLacznik: "",
      titleAkcent: "Alvernia Planet?",
      lead: "We sit right by the A4 motorway, between Kraków and Katowice. Pick the route that suits you best and come to a world of science, space and remarkable experiences.",
    },
    planer: {
      pytanie: "How are you travelling?",
      label: "How do you want to travel?",
      tryby: { auto: "Car", bus: "Train + shuttle", flix: "FlixBus" },
      trybyOpis: {
        auto: "Address, parking and route",
        bus: "Shuttle timetable and carriers",
        flix: "Long-distance coaches",
      },
    },
    auto: {
      title: "By car, straight to the domes",
      lead: "One exit off the A4 and you are here.",
      fakty: ["By the A4", "300+ parking spaces"],
      adresLabel: "ADDRESS",
      kopiuj: "Copy address",
      skopiowano: "Copied",
      nawiguj: "Start navigation",
      lokalizacja: "See on the map",
      ukryjLokalizacje: "Hide map",
      innyStart: "Route from somewhere else",
      innyStartOpis: "Pick a starting point and we will open the route in your maps app.",
      orientacyjne: "approximate distances",
      trasaZ: "Route from",
    },
    pociag: {
      title: "Train to Krzeszowice, then our shuttle",
      lead: "The shuttle runs on Fridays, Saturdays and Sundays.",
      etapy: [
        { nazwa: "Train to Krzeszowice station", opis: "Any train to the Krzeszowice stop." },
        { nazwa: "Shuttle to Alvernia Planet", opis: "The shuttle leaves from the car park next to the station, by platform 1." },
      ],
      glownaAkcja: "Check the shuttle timetable",
      naMiejscu: "And you have arrived",
      naMiejscuOpis: "The shuttle stops right by the entrance.",
      stacja: "Krzeszowice station",
      stacjaLead: "This is where you board our shuttle.",
      rozkladPociagow: "Check train timetables",
      rozkladTytul: "Shuttle timetable",
      mapaPrzystanku: "Show the stop on the map",
      zaMin: (m) => `in ${m} min`,
      kierunekLabel: "Direction",
      kierunki: { doObiektu: "To Alvernia Planet", doKrzeszowic: "To Krzeszowice" },
      dzienLabel: "Travel day",
      dzis: "today",
      najblizszy: "Next departure per timetable",
      pierwszyWDniu: "First departure on the selected day",
      dni: { piatek: "Friday", weekend: "Saturday and Sunday" },
      odjazdZ: { krzeszowice: "Departure from Krzeszowice", obiekt: "Departure from Alvernia Planet" },
      kurs: "Run",
      zPrzystanku: "from",
      kolejne: "Later departures",
      pelnyRozklad: "Full timetable",
      brakKursow: "The shuttle does not run on this day.",
      rozkladWygasl: "This timetable has expired. Please call for current times.",
      zrodlo: (data) => `Timetable provided by the venue, as of ${data}.`,
      przystanekKrzeszowice: "Krzeszowice, by the railway station",
      przystanekObiekt: "Alvernia Planet, car park",
      punkty: {
        krzeszowice: { nazwa: "Krzeszowice", opis: "by the railway station" },
        obiekt: { nazwa: "Alvernia Planet", opis: "car park" },
      },
      trasaDoPrzystanku: "Route to the stop in Krzeszowice",
      pinDoPotwierdzenia: "The exact boarding spot is being confirmed with the venue.",
      czegoNieWiemy: "Fare, operator and holiday services — please ask before you travel.",
    },
    autobus: {
      title: "By coach",
      lead: "Services from Kraków and from Krzeszowice.",
      dowozi: "Stops at the venue",
      ostatniOdcinek: "Last leg on your own",
      rozkladLink: "Timetable at the carrier",
      szczegoly: "Details",
      brakGodzin: "Check times and fares with the carrier — they change seasonally.",
      przewoznicy: {
        flixbus: { nazwa: "FlixBus", skad: "Kraków MDA, ul. Bosacka", dokad: "Alvernia Planet", uwaga: "The coach stops right at the venue." },
        mbus: { nazwa: "M-Bus Matysik", skad: "Krzeszowice bus station", dokad: "Rudno", uwaga: "From Rudno you need to cover the last stretch yourself." },
        magoma: { nazwa: "MAGOMA", skad: "Krzeszowice bus station", dokad: "Zalas – Centrum", uwaga: "From Zalas you need to cover the last stretch yourself. No weekend service." },
      },
    },
    mapa: {
      naglowek: "Alvernia Planet on the map",
      opis: "Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
      pokaz: "Show Google map",
      ladowanie: "Loading the map…",
      ladowanieHaslo: "Loading the universe…",
      blad: "The Google map could not be loaded.",
      ponow: "Try again",
      otworz: "Open in Google Maps",
      ramkaTytul: "Map: Alvernia Planet",
      informacja: "The map loads from Google servers, which may set cookies.",
    },
    miejsce: {
      title: "On site",
      lead: "The last stretch, step by step.",
      punkty: {
        wjazd: { nazwa: "Site entrance and parking", opis: "The turn off the road leads straight onto the grounds; visitor parking is right by the entrance — 300+ spaces." },
        wejscie: { nazwa: "Entrance to the venue", opis: "Main entrance under the domes, on the car park side." },
        przystanek: { nazwa: "Shuttle stop", opis: "The Krzeszowice shuttle stops at the car park by the venue." },
      },
      wjazdKrotko: "The turn off the road leads straight onto the grounds.",
      powieksz: "Enlarge",
      zamknij: "Close",
      zdjecieAlt: "Entrance to the Alvernia Planet grounds from the car park",
    },
    okolica: {
      title: "Nearby",
      pokaz: "Show nearby attractions",
      ukryj: "Hide attractions",
      unit: "km",
      orientacyjne: "Approximate road distances.",
      poprzednie: "Previous attractions",
      nastepne: "Next attractions",
      nazwy: {
        tenczyn: "Tenczyn Castle",
        wygielzow: "Museum of Western Małopolska (Wygiełzów)",
        energylandia: "Energylandia",
        zatorland: "Zatorland",
        grodek: "Park Gródek",
        auschwitz: "Auschwitz-Birkenau Museum",
        wieliczka: "Wieliczka Salt Mine",
      },
    },
    pomoc: {
      title: "Need directions?",
      lead: "Call or write — we will suggest the fastest route.",
      telefon: "Call",
      email: "Write to us",
    },
    atrakcje: { title: "Got more time? Attractions nearby" },
    faq: {
      title: "Frequently asked questions",
      pytania: {
        dni: "Which days does the shuttle run?",
        skad: "Where does the shuttle leave from in Krzeszowice?",
        parking: "Where do I park at the venue?",
        inne: "What other ways are there to get here?",
      },
    },
    pasek: { nawiguj: "Open route", rozklad: "Shuttle timetable" },
    punkty: {
      krakow: "Kraków",
      katowice: "Katowice",
      balice: "Kraków-Balice Airport",
      pyrzowice: "Katowice-Pyrzowice Airport",
      krzeszowice: "Krzeszowice railway station",
    },
  },

  pt: {
    meta: { locale: "pt-PT" },
    hero: {
      eyebrow: "PLANEIE A VIAGEM",
      title: "Como chegar",
      titleLacznik: "ao",
      titleAkcent: "Alvernia Planet?",
      lead: "Estamos mesmo junto à autoestrada A4, entre Cracóvia e Katowice. Escolha o percurso mais cómodo e venha até um mundo de ciência, espaço e experiências únicas.",
    },
    planer: {
      pytanie: "Como vai viajar?",
      label: "Como quer viajar?",
      tryby: { auto: "Carro", bus: "Comboio + autocarro", flix: "FlixBus" },
      trybyOpis: {
        auto: "Morada, estacionamento e rota",
        bus: "Horário do autocarro e operadores",
        flix: "Autocarros de longo curso",
      },
    },
    auto: {
      title: "De carro, direto às cúpulas",
      lead: "Uma saída da A4 e chegou.",
      fakty: ["Junto à A4", "300+ lugares de estacionamento"],
      adresLabel: "MORADA",
      kopiuj: "Copiar morada",
      skopiowano: "Copiado",
      nawiguj: "Iniciar navegação",
      lokalizacja: "Ver no mapa",
      ukryjLokalizacje: "Ocultar mapa",
      innyStart: "Rota a partir de outro local",
      innyStartOpis: "Escolha o ponto de partida e abrimos a rota na sua aplicação de mapas.",
      orientacyjne: "distâncias aproximadas",
      trasaZ: "Rota de",
    },
    pociag: {
      title: "Comboio até Krzeszowice, depois o nosso autocarro",
      lead: "O autocarro circula à sexta-feira, sábado e domingo.",
      etapy: [
        { nazwa: "Comboio até à estação de Krzeszowice", opis: "Qualquer comboio para a paragem de Krzeszowice." },
        { nazwa: "Autocarro até ao Alvernia Planet", opis: "O autocarro parte do estacionamento junto à estação, junto à plataforma 1." },
      ],
      glownaAkcja: "Ver o horário do autocarro",
      naMiejscu: "E já chegou",
      naMiejscuOpis: "O autocarro para mesmo à entrada.",
      stacja: "Estação Krzeszowice",
      stacjaLead: "É aqui que apanha o nosso autocarro.",
      rozkladPociagow: "Ver horários dos comboios",
      rozkladTytul: "Horário do autocarro",
      mapaPrzystanku: "Ver a paragem no mapa",
      zaMin: (m) => `daqui a ${m} min`,
      kierunekLabel: "Sentido",
      kierunki: { doObiektu: "Para o Alvernia Planet", doKrzeszowic: "Para Krzeszowice" },
      dzienLabel: "Dia da viagem",
      dzis: "hoje",
      najblizszy: "Próxima partida segundo o horário",
      pierwszyWDniu: "Primeira partida no dia escolhido",
      dni: { piatek: "Sexta-feira", weekend: "Sábado e domingo" },
      odjazdZ: { krzeszowice: "Partida de Krzeszowice", obiekt: "Partida do Alvernia Planet" },
      kurs: "Viagem",
      zPrzystanku: "de",
      kolejne: "Partidas seguintes",
      pelnyRozklad: "Horário completo",
      brakKursow: "Neste dia o autocarro não circula.",
      rozkladWygasl: "Este horário expirou. Ligue-nos para as horas atuais.",
      zrodlo: (data) => `Horário fornecido pelo recinto, à data de ${data}.`,
      przystanekKrzeszowice: "Krzeszowice, junto à estação",
      przystanekObiekt: "Alvernia Planet, estacionamento",
      punkty: {
        krzeszowice: { nazwa: "Krzeszowice", opis: "junto à estação" },
        obiekt: { nazwa: "Alvernia Planet", opis: "estacionamento" },
      },
      trasaDoPrzystanku: "Rota até à paragem em Krzeszowice",
      pinDoPotwierdzenia: "O local exato de embarque está a ser confirmado com o recinto.",
      czegoNieWiemy: "Preço, operador e serviços em feriados — pergunte antes de viajar.",
    },
    autobus: {
      title: "De autocarro",
      lead: "Ligações a partir de Cracóvia e de Krzeszowice.",
      dowozi: "Para junto ao recinto",
      ostatniOdcinek: "Último troço por sua conta",
      rozkladLink: "Horário do operador",
      szczegoly: "Detalhes",
      brakGodzin: "Confirme horas e preços com o operador — mudam por época.",
      przewoznicy: {
        flixbus: { nazwa: "FlixBus", skad: "Cracóvia MDA, ul. Bosacka", dokad: "Alvernia Planet", uwaga: "O autocarro para mesmo junto ao recinto." },
        mbus: { nazwa: "M-Bus Matysik", skad: "Terminal de Krzeszowice", dokad: "Rudno", uwaga: "A partir de Rudno tem de fazer o último troço por conta própria." },
        magoma: { nazwa: "MAGOMA", skad: "Terminal de Krzeszowice", dokad: "Zalas – Centrum", uwaga: "A partir de Zalas tem de fazer o último troço por conta própria. Não circula aos fins de semana." },
      },
    },
    mapa: {
      naglowek: "Alvernia Planet no mapa",
      opis: "Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
      pokaz: "Mostrar mapa Google",
      ladowanie: "A carregar o mapa…",
      ladowanieHaslo: "A carregar o universo…",
      blad: "Não foi possível carregar o mapa Google.",
      ponow: "Tentar de novo",
      otworz: "Abrir no Google Maps",
      ramkaTytul: "Mapa: Alvernia Planet",
      informacja: "O mapa carrega dos servidores da Google, que podem gravar cookies.",
    },
    miejsce: {
      title: "No local",
      lead: "O último troço, passo a passo.",
      punkty: {
        wjazd: { nazwa: "Entrada e estacionamento", opis: "A saída da estrada dá diretamente para o recinto; o estacionamento para visitantes fica junto à entrada — 300+ lugares." },
        wejscie: { nazwa: "Entrada do recinto", opis: "Entrada principal sob as cúpulas, do lado do estacionamento." },
        przystanek: { nazwa: "Paragem do autocarro", opis: "O autocarro de Krzeszowice para no estacionamento junto ao recinto." },
      },
      wjazdKrotko: "A saída da estrada dá diretamente para o recinto.",
      powieksz: "Ampliar",
      zamknij: "Fechar",
      zdjecieAlt: "Entrada no recinto do Alvernia Planet a partir do estacionamento",
    },
    okolica: {
      title: "Nas proximidades",
      pokaz: "Mostrar atrações próximas",
      ukryj: "Ocultar atrações",
      unit: "km",
      orientacyjne: "Distâncias aproximadas por estrada.",
      poprzednie: "Atrações anteriores",
      nastepne: "Próximas atrações",
      nazwy: {
        tenczyn: "Castelo de Tenczyn",
        wygielzow: "Museu da Pequena Polónia Ocidental (Wygiełzów)",
        energylandia: "Energylandia",
        zatorland: "Zatorland",
        grodek: "Parque Gródek",
        auschwitz: "Museu de Auschwitz-Birkenau",
        wieliczka: "Mina de Sal de Wieliczka",
      },
    },
    pomoc: {
      title: "Precisa de indicações?",
      lead: "Ligue ou escreva — indicamos a rota mais rápida.",
      telefon: "Ligar",
      email: "Escreva-nos",
    },
    atrakcje: { title: "Tem mais tempo? Atrações nas proximidades" },
    faq: {
      title: "Perguntas frequentes",
      pytania: {
        dni: "Em que dias circula o autocarro?",
        skad: "De onde parte o autocarro em Krzeszowice?",
        parking: "Onde estacionar no local?",
        inne: "Que outras formas de chegar existem?",
      },
    },
    pasek: { nawiguj: "Abrir rota", rozklad: "Horário do autocarro" },
    punkty: {
      krakow: "Cracóvia",
      katowice: "Katowice",
      balice: "Aeroporto de Cracóvia-Balice",
      pyrzowice: "Aeroporto de Katowice-Pyrzowice",
      krzeszowice: "Estação de Krzeszowice",
    },
  },

  de: {
    meta: { locale: "de-DE" },
    hero: {
      eyebrow: "ANFAHRT PLANEN",
      title: "Wie kommen Sie",
      titleLacznik: "zum",
      titleAkcent: "Alvernia Planet?",
      lead: "Wir liegen direkt an der Autobahn A4, zwischen Kraków und Katowice. Wählen Sie die bequemste Route und tauchen Sie ein in eine Welt aus Wissenschaft, Weltraum und besonderen Erlebnissen.",
    },
    planer: {
      pytanie: "Womit reisen Sie an?",
      label: "Wie möchten Sie anreisen?",
      tryby: { auto: "Auto", bus: "Bahn + Shuttle", flix: "FlixBus" },
      trybyOpis: {
        auto: "Adresse, Parkplatz und Route",
        bus: "Shuttle-Fahrplan und Anbieter",
        flix: "Fernbusverbindungen",
      },
    },
    auto: {
      title: "Mit dem Auto direkt zu den Kuppeln",
      lead: "Eine Ausfahrt von der A4 und Sie sind da.",
      fakty: ["An der A4", "300+ Parkplätze"],
      adresLabel: "ADRESSE",
      kopiuj: "Adresse kopieren",
      skopiowano: "Kopiert",
      nawiguj: "Navigation starten",
      lokalizacja: "Auf der Karte ansehen",
      ukryjLokalizacje: "Karte ausblenden",
      innyStart: "Route von einem anderen Ort",
      innyStartOpis: "Startpunkt wählen — die Route öffnen wir in Ihrer Karten-App.",
      orientacyjne: "ungefähre Entfernungen",
      trasaZ: "Route ab",
    },
    pociag: {
      title: "Mit der Bahn nach Krzeszowice, dann unser Shuttle",
      lead: "Das Shuttle fährt freitags, samstags und sonntags.",
      etapy: [
        { nazwa: "Bahn bis Bahnhof Krzeszowice", opis: "Jeder Zug bis zur Station Krzeszowice." },
        { nazwa: "Shuttle zum Alvernia Planet", opis: "Das Shuttle startet vom Parkplatz direkt neben dem Bahnhof, an Bahnsteig 1." },
      ],
      glownaAkcja: "Shuttle-Fahrplan ansehen",
      naMiejscu: "Und Sie sind da",
      naMiejscuOpis: "Der Shuttle hält direkt am Eingang.",
      stacja: "Bahnhof Krzeszowice",
      stacjaLead: "Hier steigen Sie in unseren Shuttle.",
      rozkladPociagow: "Zugfahrplan prüfen",
      rozkladTytul: "Shuttle-Fahrplan",
      mapaPrzystanku: "Haltestelle auf der Karte",
      zaMin: (m) => `in ${m} Min.`,
      kierunekLabel: "Richtung",
      kierunki: { doObiektu: "Zum Alvernia Planet", doKrzeszowic: "Nach Krzeszowice" },
      dzienLabel: "Reisetag",
      dzis: "heute",
      najblizszy: "Nächste Abfahrt laut Fahrplan",
      pierwszyWDniu: "Erste Abfahrt am gewählten Tag",
      dni: { piatek: "Freitag", weekend: "Samstag und Sonntag" },
      odjazdZ: { krzeszowice: "Abfahrt ab Krzeszowice", obiekt: "Abfahrt ab Alvernia Planet" },
      kurs: "Fahrt",
      zPrzystanku: "ab",
      kolejne: "Weitere Abfahrten",
      pelnyRozklad: "Vollständiger Fahrplan",
      brakKursow: "An diesem Tag fährt das Shuttle nicht.",
      rozkladWygasl: "Dieser Fahrplan ist abgelaufen. Bitte rufen Sie für aktuelle Zeiten an.",
      zrodlo: (data) => `Fahrplan vom Gelände übermittelt, Stand ${data}.`,
      przystanekKrzeszowice: "Krzeszowice, am Bahnhof",
      przystanekObiekt: "Alvernia Planet, Parkplatz",
      punkty: {
        krzeszowice: { nazwa: "Krzeszowice", opis: "am Bahnhof" },
        obiekt: { nazwa: "Alvernia Planet", opis: "Parkplatz" },
      },
      trasaDoPrzystanku: "Route zur Haltestelle in Krzeszowice",
      pinDoPotwierdzenia: "Die genaue Einstiegsstelle wird mit dem Gelände bestätigt.",
      czegoNieWiemy: "Fahrpreis, Betreiber und Feiertagsfahrten — bitte vorab erfragen.",
    },
    autobus: {
      title: "Mit dem Fernbus",
      lead: "Verbindungen aus Kraków und aus Krzeszowice.",
      dowozi: "Hält am Gelände",
      ostatniOdcinek: "Letztes Stück in Eigenregie",
      rozkladLink: "Fahrplan beim Anbieter",
      szczegoly: "Details",
      brakGodzin: "Zeiten und Preise beim Anbieter prüfen — sie ändern sich saisonal.",
      przewoznicy: {
        flixbus: { nazwa: "FlixBus", skad: "Kraków MDA, ul. Bosacka", dokad: "Alvernia Planet", uwaga: "Der Bus hält direkt am Gelände." },
        mbus: { nazwa: "M-Bus Matysik", skad: "Busbahnhof Krzeszowice", dokad: "Rudno", uwaga: "Ab Rudno müssen Sie das letzte Stück selbst zurücklegen." },
        magoma: { nazwa: "MAGOMA", skad: "Busbahnhof Krzeszowice", dokad: "Zalas – Centrum", uwaga: "Ab Zalas müssen Sie das letzte Stück selbst zurücklegen. Am Wochenende kein Verkehr." },
      },
    },
    mapa: {
      naglowek: "Alvernia Planet auf der Karte",
      opis: "Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
      pokaz: "Google-Karte anzeigen",
      ladowanie: "Karte wird geladen…",
      ladowanieHaslo: "Das Universum wird geladen…",
      blad: "Die Google-Karte konnte nicht geladen werden.",
      ponow: "Erneut versuchen",
      otworz: "In Google Maps öffnen",
      ramkaTytul: "Karte: Alvernia Planet",
      informacja: "Die Karte lädt von Google-Servern, die Cookies setzen können.",
    },
    miejsce: {
      title: "Vor Ort",
      lead: "Das letzte Stück, Schritt für Schritt.",
      punkty: {
        wjazd: { nazwa: "Einfahrt und Parkplatz", opis: "Die Abfahrt von der Straße führt direkt auf das Gelände, der Besucherparkplatz liegt am Eingang — 300+ Plätze." },
        wejscie: { nazwa: "Eingang zum Gelände", opis: "Haupteingang unter den Kuppeln, zur Parkplatzseite." },
        przystanek: { nazwa: "Shuttle-Haltestelle", opis: "Das Shuttle aus Krzeszowice hält auf dem Parkplatz am Gelände." },
      },
      wjazdKrotko: "Die Abfahrt von der Straße führt direkt auf das Gelände.",
      powieksz: "Vergrößern",
      zamknij: "Schließen",
      zdjecieAlt: "Eingang zum Gelände von Alvernia Planet vom Parkplatz aus",
    },
    okolica: {
      title: "In der Umgebung",
      pokaz: "Attraktionen in der Umgebung anzeigen",
      ukryj: "Attraktionen ausblenden",
      unit: "km",
      orientacyjne: "Ungefähre Entfernungen auf der Straße.",
      poprzednie: "Vorherige Attraktionen",
      nastepne: "Nächste Attraktionen",
      nazwy: {
        tenczyn: "Burg Tenczyn",
        wygielzow: "Museum des westlichen Małopolska (Wygiełzów)",
        energylandia: "Energylandia",
        zatorland: "Zatorland",
        grodek: "Park Gródek",
        auschwitz: "Museum Auschwitz-Birkenau",
        wieliczka: "Salzbergwerk Wieliczka",
      },
    },
    pomoc: {
      title: "Brauchen Sie eine Wegbeschreibung?",
      lead: "Rufen Sie an oder schreiben Sie — wir empfehlen die schnellste Route.",
      telefon: "Anrufen",
      email: "Schreiben Sie uns",
    },
    atrakcje: { title: "Mehr Zeit? Attraktionen in der Umgebung" },
    faq: {
      title: "Häufige Fragen",
      pytania: {
        dni: "An welchen Tagen fährt der Shuttle?",
        skad: "Wo fährt der Shuttle in Krzeszowice ab?",
        parking: "Wo parke ich am Gelände?",
        inne: "Welche anderen Anfahrtswege gibt es?",
      },
    },
    pasek: { nawiguj: "Route öffnen", rozklad: "Shuttle-Fahrplan" },
    punkty: {
      krakow: "Kraków",
      katowice: "Katowice",
      balice: "Flughafen Kraków-Balice",
      pyrzowice: "Flughafen Katowice-Pyrzowice",
      krzeszowice: "Bahnhof Krzeszowice",
    },
  },

  zh: {
    meta: { locale: "zh-CN" },
    hero: {
      eyebrow: "规划行程",
      title: "如何前往",
      titleLacznik: "",
      titleAkcent: "Alvernia Planet？",
      lead: "我们紧邻 A4 高速公路，位于 Kraków 与 Katowice 之间。选择最方便的路线，来体验科学、太空与非凡感受的世界。",
    },
    planer: {
      pytanie: "您怎么来？",
      label: "您打算怎么来？",
      tryby: { auto: "自驾", bus: "火车 + 巴士", flix: "FlixBus" },
      trybyOpis: {
        auto: "地址、停车与路线",
        bus: "巴士时刻与承运商",
        flix: "长途巴士线路",
      },
    },
    auto: {
      title: "自驾直达穹顶",
      lead: "从 A4 下高速即到。",
      fakty: ["紧邻 A4", "300+ 停车位"],
      adresLabel: "地址",
      kopiuj: "复制地址",
      skopiowano: "已复制",
      nawiguj: "开始导航",
      lokalizacja: "在地图上查看",
      ukryjLokalizacje: "隐藏地图",
      innyStart: "从其他地点出发",
      innyStartOpis: "选择出发地，我们会在您的地图应用中打开路线。",
      orientacyjne: "距离为大致值",
      trasaZ: "出发地：",
    },
    pociag: {
      title: "乘火车到 Krzeszowice，再换乘我们的巴士",
      lead: "巴士在周五、周六和周日运行。",
      etapy: [
        { nazwa: "乘火车到 Krzeszowice 站", opis: "任意一班到 Krzeszowice 的火车。" },
        { nazwa: "换乘巴士到 Alvernia Planet", opis: "巴士从车站旁的停车场发车，在 1 号站台旁。" },
      ],
      glownaAkcja: "查看巴士时刻表",
      naMiejscu: "您就到了",
      naMiejscuOpis: "巴士就停在入口处。",
      stacja: "Krzeszowice 车站",
      stacjaLead: "您在这里换乘我们的巴士。",
      rozkladPociagow: "查询火车时刻",
      rozkladTytul: "巴士时刻表",
      mapaPrzystanku: "在地图上查看站点",
      zaMin: (m) => `${m} 分钟后`,
      kierunekLabel: "方向",
      kierunki: { doObiektu: "前往 Alvernia Planet", doKrzeszowic: "前往 Krzeszowice" },
      dzienLabel: "出行日期",
      dzis: "今天",
      najblizszy: "时刻表上的最近一班",
      pierwszyWDniu: "所选日期的首班车",
      dni: { piatek: "周五", weekend: "周六与周日" },
      odjazdZ: { krzeszowice: "Krzeszowice 发车", obiekt: "Alvernia Planet 发车" },
      kurs: "班次",
      zPrzystanku: "上车地点：",
      kolejne: "后续班次",
      pelnyRozklad: "完整时刻表",
      brakKursow: "当天巴士不运行。",
      rozkladWygasl: "该时刻表已过期，请致电确认最新班次。",
      zrodlo: (data) => `时刻表由园区提供，数据截至 ${data}。`,
      przystanekKrzeszowice: "Krzeszowice 火车站旁",
      przystanekObiekt: "Alvernia Planet 停车场",
      punkty: {
        krzeszowice: { nazwa: "Krzeszowice", opis: "火车站旁" },
        obiekt: { nazwa: "Alvernia Planet", opis: "停车场" },
      },
      trasaDoPrzystanku: "前往 Krzeszowice 上车点的路线",
      pinDoPotwierdzenia: "确切上车位置正在与园区确认。",
      czegoNieWiemy: "票价、承运商以及节假日班次请出行前咨询。",
    },
    autobus: {
      title: "长途巴士",
      lead: "从 Kraków 和 Krzeszowice 出发的班车。",
      dowozi: "停靠园区",
      ostatniOdcinek: "最后一段需自行前往",
      rozkladLink: "承运商时刻表",
      szczegoly: "详情",
      brakGodzin: "班次与票价请向承运商确认，会随季节调整。",
      przewoznicy: {
        flixbus: { nazwa: "FlixBus", skad: "Kraków MDA, ul. Bosacka", dokad: "Alvernia Planet", uwaga: "巴士直接停靠园区。" },
        mbus: { nazwa: "M-Bus Matysik", skad: "Krzeszowice 长途汽车站", dokad: "Rudno", uwaga: "从 Rudno 到园区的最后一段需自行前往。" },
        magoma: { nazwa: "MAGOMA", skad: "Krzeszowice 长途汽车站", dokad: "Zalas – Centrum", uwaga: "从 Zalas 到园区的最后一段需自行前往。该线路周末停运。" },
      },
    },
    mapa: {
      naglowek: "地图上的 Alvernia Planet",
      opis: "Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
      pokaz: "显示谷歌地图",
      ladowanie: "正在加载地图…",
      ladowanieHaslo: "正在加载宇宙…",
      blad: "谷歌地图加载失败。",
      ponow: "重试",
      otworz: "在谷歌地图中打开",
      ramkaTytul: "地图：Alvernia Planet",
      informacja: "地图由谷歌服务器加载，可能会写入 Cookie。",
    },
    miejsce: {
      title: "抵达园区",
      lead: "最后一段，逐步说明。",
      punkty: {
        wjazd: { nazwa: "入口与停车场", opis: "从道路转入即进入园区，访客停车场就在入口旁，共 300+ 车位。" },
        wejscie: { nazwa: "园区入口", opis: "穹顶下的主入口，靠停车场一侧。" },
        przystanek: { nazwa: "巴士站点", opis: "Krzeszowice 接驳巴士停靠在园区旁的停车场。" },
      },
      wjazdKrotko: "从道路转入即进入园区。",
      powieksz: "放大",
      zamknij: "关闭",
      zdjecieAlt: "从停车场看向 Alvernia Planet 园区入口",
    },
    okolica: {
      title: "周边",
      pokaz: "显示周边景点",
      ukryj: "隐藏景点",
      unit: "公里",
      orientacyjne: "公路距离为大致值。",
      poprzednie: "上一批景点",
      nastepne: "下一批景点",
      nazwy: {
        tenczyn: "Tenczyn 城堡",
        wygielzow: "Małopolska 西部博物馆（Wygiełzów）",
        energylandia: "Energylandia",
        zatorland: "Zatorland",
        grodek: "Gródek 公园",
        auschwitz: "Auschwitz-Birkenau 博物馆",
        wieliczka: "Wieliczka 盐矿",
      },
    },
    pomoc: {
      title: "需要路线指引？",
      lead: "来电或来信，我们会推荐最快的路线。",
      telefon: "致电",
      email: "写信给我们",
    },
    atrakcje: { title: "时间充裕？周边景点" },
    faq: {
      title: "常见问题",
      pytania: {
        dni: "巴士在哪几天运营？",
        skad: "巴士从 Krzeszowice 的哪里发车？",
        parking: "在园区哪里停车？",
        inne: "还有哪些到达方式？",
      },
    },
    pasek: { nawiguj: "打开路线", rozklad: "巴士时刻" },
    punkty: {
      krakow: "Kraków",
      katowice: "Katowice",
      balice: "Kraków-Balice 机场",
      pyrzowice: "Katowice-Pyrzowice 机场",
      krzeszowice: "Krzeszowice 火车站",
    },
  },
};
