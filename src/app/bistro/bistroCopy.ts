import type { Locale } from "@/lib/localizedRoutes";

/* Teksty podstrony „Bistro pod Kopułami" — jeden obiekt na język, tak samo jak
   w `jak-dojechac/dojazdCopy.ts`. Dorzucenie kolejnego języka jest zmianą
   DANYCH, a nie przebudową komponentu.

   ŹRÓDŁO TREŚCI: brief przekazany przez obiekt 2026-09-25. Stamtąd pochodzą
   godziny otwarcia, pozycje karty, informacja o wstępie bez biletu, pojemność
   parkingu i formy płatności — wcześniej nie było ich nigdzie w projekcie.

   NADAL NIE MAMY i nie wolno dopisywać: cen, dokładnego składu dań ani godzin
   wydawania obiadów. */

export type PozycjaMenu = {
  nazwa: string;
  opis: string;
  /** Zdjęcie dania — dopóki go nie ma, kafelek pokazuje neutralne miejsce. */
  zdjecie?: string;
  /** Cena „od" — np. „19 zł". Pole zostaje puste, dopóki obiekt nie poda cen;
      wiersz z ceną nie renderuje się wcale, zamiast pokazywać gościom kreski. */
  cenaOd?: string;
};
export type PytanieFaq = { pytanie: string; odpowiedz: string };

/* UWAGA do pol `overline`: od 2026-10-01 nadtytul renderuje sie WYLACZNIE nad
   karta dan („Filmowo-kosmiczne menu"). Pozostale sekcje maja go w tekstach,
   ale go nie pokazuja — pola zostaja celowo, zeby przywrocenie bylo jedna
   linia w `page.tsx`, a nie tlumaczeniem na nowo w pieciu jezykach. */
export type BistroCopy = {
  meta: { tytul: string; opis: string };
  hero: {
    overline: string;
    /* Naglowek lamie sie twardo na DWIE linie, a druga idzie w turkusie.
       Trzeciej — „pod kopulami" — juz tu nie ma: te slowa niesie znak nad
       naglowkiem, wiec w tekscie byly powtorzeniem i zjadaly miejsce. */
    tytul1: string;
    tytul2: string;
    copy: string;
    /* Trzy mikro-korzysci w jednym rzedzie pod opisem. Kolejnosc odpowiada
       kolejnosci ikon w `IKONY_ZALET` w komponencie — obie listy laczy indeks.
       Pierwsza z nich niesie to, co wczesniej bylo osobnym zdaniem pod
       opisem: do samego bistra nie trzeba biletu na Alvernia Planet. */
    zalety: [string, string, string];
    /* Jedno zdanie-haczyk miedzy mikro-korzysciami a przyciskami. Nie powtarza
       opisu — ma zrobic apetyt tuz przed klikiem w karte. */
    zacheta: string;
    ctaMenu: string;
    ctaDojazd: string;
  };
  /* Opisy strzalek karuzeli banerow pod hero — czyta je czytnik ekranu, bo
     same znaki „<" i „>" nic nie mowia. */
  baner: { poprzedni: string; nastepny: string };
  menu: {
    overline: string;
    tytul: string;
    /* Opis strzałki w kafelku z kilkoma zdjęciami — czyta ją czytnik ekranu,
       bo sam znak „>" nic nie mówi. */
    nastepne: string;
    pozycje: PozycjaMenu[];
  };
  /* Naglowki obu sekcji na granatowym pasie lamia sie na dwie czesci, a druga
     idzie w turkusie — ten sam zabieg co w drugim wierszu naglowka hero. */
  klasa: { overline: string; tytul: string; tytulAkcent: string; copy: string };
  podroz: {
    overline: string;
    tytul: string;
    tytulAkcent: string;
    copy: string;
    wyroznienie: string;
    cta: string;
    adres: string;
  };
  godziny: { tytul: string; dni: string; zakres: string };
  galeria: {
    overline: string;
    tytul: string;
    /* Opisy strzałek karuzeli — czyta je czytnik ekranu, bo same znaki „<" i
       „>" nic nie mówią. */
    poprzednie: string;
    nastepne: string;
  };
  faq: { overline: string; tytul: string; pytania: PytanieFaq[] };
  alt: { klasa: string; podroz: string; alver: string; galeria: string[] };
};

export const BISTRO_COPY: Record<Locale, BistroCopy> = {
  pl: {
    meta: {
      tytul: "Bistro pod Kopułami, Alvernia Planet",
      opis:
        "Bistro pod Kopułami w Alvernia Planet: naleśniki, gofry, zapiekanki, stripsy i obiady dnia. Otwarte codziennie 11:00–18:00, wstęp bez biletu do Alvernia Planet.",
    },
    hero: {
      overline: "Bistro",
      tytul1: "Kosmicznie",
      tytul2: "dobre jedzenie",
      copy:
        "Naleśniki, gofry, zapiekanki i obiady dnia w wyjątkowej, filmowo-kosmicznej atmosferze Alvernia Planet.",
      zalety: ["Bez biletu.", "Rodziny i grupy.", "Lunche, przekąski, desery."],
      zacheta: "Filmowe emocje zaostrzają apetyt",
      ctaMenu: "Zobacz menu",
      ctaDojazd: "Jak dojechać",
    },
    baner: { poprzedni: "Poprzedni baner", nastepny: "Następny baner" },
    menu: {
      overline: "Filmowo-kosmiczne menu",
      tytul: "Co zjesz pod kopułami?",
      nastepne: "Następne zdjęcie",
      pozycje: [
        { nazwa: "Naleśniki na słodko", opis: "Czekolada, maliny, truskawki." },
        { nazwa: "Naleśniki na słono", opis: "Szpinak albo szynka z serem." },
        { nazwa: "Gofry", opis: "Chrupiące, przygotowywane na miejscu." },
        { nazwa: "Zapiekanki", opis: "Na szybką przerwę między przygodami." },
        { nazwa: "Stripsy i frytki", opis: "Konkretniejsza opcja dla małych i dużych odkrywców." },
        { nazwa: "Pyszna kawa oraz herbata", opis: "Napoje i deser na zakończenie misji." },
      ],
    },
    klasa: {
      overline: "Grupy i szkoły",
      tytul: "Przyjedź ",
      tytulAkcent: "z klasą",
      copy:
        "Dedykowana oferta dla grup, przedszkoli i szkół. Uśmiechnięte buzie, pełne brzuszki, energia na kolejną przygodę.",
    },
    podroz: {
      overline: "Po drodze",
      tytul: "Głodny w trasie? ",
      tytulAkcent: "Wpadnij pod kopuły",
      copy:
        "Jedziesz w kierunku Krakowa albo w góry? Zamiast kolejnego postoju na stacji benzynowej — naleśnik, kawa albo obiad pod kopułami.",
      wyroznienie: "Wstęp do Bistro nie wymaga zakupu biletu do Alvernia Planet.",
      cta: "Wyznacz trasę",
      adres: "Alvernia Planet, ul. Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
    },
    godziny: { tytul: "Godziny otwarcia", dni: "Poniedziałek – niedziela", zakres: "11:00–18:00" },
    galeria: {
      overline: "Galeria",
      tytul: "Zobacz, jak u nas jest",
      poprzednie: "Poprzednie zdjęcia",
      nastepne: "Następne zdjęcia",
    },
    faq: {
      overline: "Dobrze wiedzieć",
      tytul: "Najczęściej zadawane pytania",
      pytania: [
        {
          pytanie: "Czy do Bistro pod Kopułami można wejść bez biletu do Alvernia Planet?",
          odpowiedz:
            "Tak. Bistro jest dostępne również dla osób, które nie odwiedzają atrakcji Alvernia Planet.",
        },
        {
          pytanie: "Czy Bistro jest odpowiednie dla rodzin z dziećmi?",
          odpowiedz:
            "Tak. W menu znajdziesz między innymi naleśniki, gofry, zapiekanki i dania odpowiednie na rodzinny posiłek.",
        },
        {
          pytanie: "Czy można zjeść obiad?",
          odpowiedz: "Tak. W Bistro dostępne są również obiady dnia — codziennie coś innego.",
        },
        {
          pytanie: "W jakich godzinach otwarte jest Bistro?",
          odpowiedz: "Od poniedziałku do niedzieli, w godzinach 11:00–18:00.",
        },
        {
          pytanie: "Czy przy Alvernia Planet jest parking?",
          odpowiedz: "Tak, dysponujemy pojemnym parkingiem na 250+ osób.",
        },
        {
          pytanie: "Czy można płacić kartą lub BLIK-iem?",
          odpowiedz: "Tak, przyjmujemy płatności kartą i BLIK-iem.",
        },
      ],
    },
    alt: {
      klasa: "Grupa szkolna przy stolikach pod kopułą Alvernia Planet",
      podroz: "Wjazd na teren Alvernia Planet i parking dla gości",
      alver: "Alvernia, maskotka Alvernia Planet, w stroju kucharki z talerzem naleśników",
      galeria: [
        "Uczniowie przy stolikach pod kopułą Alvernia Planet",
        "Lodówki z napojami w bistrze Alvernia Planet",
        "Witryna z przekąskami przy ladzie bistra",
        "Kopuły Alvernia Planet od zewnątrz",
        "Wjazd na teren Alvernia Planet",
        "Scenograficzne wnętrze kopuły Alvernia Planet w nocnym oświetleniu",
      ],
    },
  },

  en: {
    meta: {
      tytul: "Bistro pod Kopułami, Alvernia Planet",
      opis:
        "Bistro pod Kopułami at Alvernia Planet: pancakes, waffles, baked baguettes, chicken strips and daily lunches. Open every day 11:00–18:00, no Alvernia Planet ticket required.",
    },
    hero: {
      overline: "Bistro",
      tytul1: "Cosmically",
      tytul2: "good food",
      copy:
        "Pancakes, waffles, baked baguettes and daily specials in the one-of-a-kind cinematic, cosmic atmosphere of Alvernia Planet.",
      zalety: ["No ticket.", "Families and groups.", "Lunches, snacks, desserts."],
      zacheta: "Cinematic thrills work up an appetite",
      ctaMenu: "See the menu",
      ctaDojazd: "Getting here",
    },
    baner: { poprzedni: "Previous banner", nastepny: "Next banner" },
    menu: {
      overline: "A cinematic, cosmic menu",
      tytul: "What can you eat under the domes?",
      nastepne: "Next photo",
      pozycje: [
        { nazwa: "Sweet pancakes", opis: "Chocolate, raspberries, strawberries." },
        { nazwa: "Savoury pancakes", opis: "Spinach, or ham and cheese." },
        { nazwa: "Waffles", opis: "Crisp, made on the spot." },
        { nazwa: "Baked baguettes", opis: "For a quick break between adventures." },
        { nazwa: "Chicken strips and fries", opis: "A heartier option for explorers big and small." },
        { nazwa: "Great coffee and tea", opis: "Drinks and dessert to end the mission." },
      ],
    },
    klasa: {
      overline: "Groups and schools",
      tytul: "Bring the whole ",
      tytulAkcent: "class",
      copy:
        "A dedicated offer for groups, nurseries and schools. Smiling faces, full stomachs, energy for the next adventure.",
    },
    podroz: {
      overline: "On the way",
      tytul: "Hungry on the road? ",
      tytulAkcent: "Drop in under the domes",
      copy:
        "Heading towards Kraków or the mountains? Instead of another petrol-station stop — a pancake, a coffee or lunch under the domes.",
      wyroznienie: "Entry to the bistro does not require an Alvernia Planet ticket.",
      cta: "Get directions",
      adres: "Alvernia Planet, ul. Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
    },
    godziny: { tytul: "Opening hours", dni: "Monday – Sunday", zakres: "11:00–18:00" },
    galeria: {
      overline: "Gallery",
      tytul: "See what it looks like",
      poprzednie: "Previous photos",
      nastepne: "Next photos",
    },
    faq: {
      overline: "Good to know",
      tytul: "Frequently asked questions",
      pytania: [
        {
          pytanie: "Can I enter Bistro pod Kopułami without an Alvernia Planet ticket?",
          odpowiedz: "Yes. The bistro is open to people who are not visiting the Alvernia Planet attractions.",
        },
        {
          pytanie: "Is the bistro suitable for families with children?",
          odpowiedz:
            "Yes. The menu includes pancakes, waffles, baked baguettes and dishes that work well for a family meal.",
        },
        {
          pytanie: "Can I have lunch there?",
          odpowiedz: "Yes. Daily lunches are available — something different every day.",
        },
        {
          pytanie: "What are the bistro's opening hours?",
          odpowiedz: "Monday to Sunday, 11:00–18:00.",
        },
        {
          pytanie: "Is there parking at Alvernia Planet?",
          odpowiedz: "Yes, we have a large car park for 250+ people.",
        },
        {
          pytanie: "Can I pay by card or BLIK?",
          odpowiedz: "Yes, we accept both card and BLIK payments.",
        },
      ],
    },
    alt: {
      klasa: "A school group at the tables under the Alvernia Planet dome",
      podroz: "The entrance to the Alvernia Planet grounds and the visitor car park",
      alver: "Alvernia, the Alvernia Planet mascot, dressed as a chef holding a plate of pancakes",
      galeria: [
        "Pupils at the tables under the Alvernia Planet dome",
        "Drinks fridges at the Alvernia Planet bistro",
        "A snack display at the bistro counter",
        "The Alvernia Planet domes from outside",
        "The entrance to the Alvernia Planet grounds",
        "Scenographic interior of an Alvernia Planet dome under night lighting",
      ],
    },
  },

  de: {
    meta: {
      tytul: "Bistro pod Kopułami, Alvernia Planet",
      opis:
        "Bistro pod Kopułami im Alvernia Planet: Pfannkuchen, Waffeln, überbackene Baguettes, Chicken Strips und Tagesgerichte. Täglich 11:00–18:00, ohne Eintrittskarte.",
    },
    hero: {
      overline: "Bistro",
      /* Inny podział niż w pozostałych językach: „unter den Kuppeln" to 17
         znaków i przy tym stopniu pisma nie mieści się w kolumnie nagłówka na
         ŻADNEJ szerokości — niemiecki wiersz był o 27% szerszy od polskiego
         i sam wymuszałby zmniejszenie nagłówka wszystkim. Ten podział ma
         najdłuższy wiersz na 14 znakach, czyli tyle co polski. */
      tytul1: "Kosmisch gutes",
      tytul2: "Essen",
      copy:
        "Pfannkuchen, Waffeln, überbackene Baguettes und Tagesgerichte in der einzigartigen, filmreif-kosmischen Atmosphäre von Alvernia Planet.",
      zalety: ["Ohne Ticket.", "Familien und Gruppen.", "Mittagessen, Snacks, Desserts."],
      zacheta: "Filmreife Erlebnisse machen Appetit",
      ctaMenu: "Zur Karte",
      ctaDojazd: "Anfahrt",
    },
    baner: { poprzedni: "Vorheriges Banner", nastepny: "Nächstes Banner" },
    menu: {
      overline: "Filmreif-kosmische Karte",
      tytul: "Was gibt es unter den Kuppeln?",
      nastepne: "Nächstes Foto",
      pozycje: [
        { nazwa: "Süße Pfannkuchen", opis: "Schokolade, Himbeeren, Erdbeeren." },
        { nazwa: "Herzhafte Pfannkuchen", opis: "Spinat oder Schinken mit Käse." },
        { nazwa: "Waffeln", opis: "Knusprig, frisch zubereitet." },
        { nazwa: "Überbackene Baguettes", opis: "Für die kurze Pause zwischen zwei Abenteuern." },
        { nazwa: "Chicken Strips und Pommes", opis: "Die kräftigere Wahl für kleine und große Entdecker." },
        { nazwa: "Guter Kaffee und Tee", opis: "Getränke und Dessert zum Abschluss der Mission." },
      ],
    },
    klasa: {
      overline: "Gruppen und Schulen",
      tytul: "Kommen Sie mit der ",
      tytulAkcent: "ganzen Klasse",
      copy:
        "Ein eigenes Angebot für Gruppen, Kindergärten und Schulen. Zufriedene Gesichter, volle Bäuche, Energie für das nächste Abenteuer.",
    },
    podroz: {
      overline: "Auf dem Weg",
      tytul: "Hungrig unterwegs? ",
      tytulAkcent: "Kommen Sie unter die Kuppeln",
      copy:
        "Unterwegs Richtung Krakau oder in die Berge? Statt des nächsten Tankstellenstopps — ein Pfannkuchen, ein Kaffee oder ein Mittagessen unter den Kuppeln.",
      wyroznienie: "Der Eintritt ins Bistro erfordert keine Eintrittskarte für Alvernia Planet.",
      cta: "Route berechnen",
      adres: "Alvernia Planet, ul. Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
    },
    godziny: { tytul: "Öffnungszeiten", dni: "Montag – Sonntag", zakres: "11:00–18:00" },
    galeria: {
      overline: "Galerie",
      tytul: "So sieht es bei uns aus",
      poprzednie: "Vorherige Fotos",
      nastepne: "Nächste Fotos",
    },
    faq: {
      overline: "Gut zu wissen",
      tytul: "Häufige Fragen",
      pytania: [
        {
          pytanie: "Kann ich das Bistro pod Kopułami ohne Eintrittskarte für Alvernia Planet betreten?",
          odpowiedz: "Ja. Das Bistro steht auch Gästen offen, die die Attraktionen nicht besuchen.",
        },
        {
          pytanie: "Ist das Bistro für Familien mit Kindern geeignet?",
          odpowiedz:
            "Ja. Auf der Karte stehen unter anderem Pfannkuchen, Waffeln, überbackene Baguettes und Gerichte für eine Familienmahlzeit.",
        },
        {
          pytanie: "Kann man dort zu Mittag essen?",
          odpowiedz: "Ja. Es gibt Tagesgerichte — jeden Tag etwas anderes.",
        },
        {
          pytanie: "Wann hat das Bistro geöffnet?",
          odpowiedz: "Montag bis Sonntag, 11:00–18:00 Uhr.",
        },
        {
          pytanie: "Gibt es am Alvernia Planet einen Parkplatz?",
          odpowiedz: "Ja, wir haben einen großen Parkplatz für 250+ Personen.",
        },
        {
          pytanie: "Kann man mit Karte oder BLIK zahlen?",
          odpowiedz: "Ja, wir akzeptieren Karten- und BLIK-Zahlungen.",
        },
      ],
    },
    alt: {
      klasa: "Eine Schulgruppe an den Tischen unter der Kuppel des Alvernia Planet",
      podroz: "Die Einfahrt zum Gelände des Alvernia Planet und der Besucherparkplatz",
      alver: "Alvernia, das Maskottchen des Alvernia Planet, als Köchin mit einem Teller Pfannkuchen",
      galeria: [
        "Schülerinnen und Schüler an den Tischen unter der Kuppel des Alvernia Planet",
        "Getränkekühlschränke im Bistro des Alvernia Planet",
        "Eine Snack-Vitrine an der Bistrotheke",
        "Die Kuppeln des Alvernia Planet von außen",
        "Die Einfahrt zum Gelände des Alvernia Planet",
        "Szenografisches Inneres einer Alvernia-Planet-Kuppel in nächtlicher Beleuchtung",
      ],
    },
  },

  pt: {
    meta: {
      tytul: "Bistro pod Kopułami, Alvernia Planet",
      opis:
        "Bistro pod Kopułami no Alvernia Planet: panquecas, waffles, tostas, tiras de frango e pratos do dia. Aberto todos os dias das 11:00 às 18:00, sem bilhete.",
    },
    hero: {
      overline: "Bistro",
      tytul1: "Comida",
      /* Krótsze niż „cosmicamente boa": tamten wiersz nie mieścił się w kolumnie
         nagłówka i łamał się na dwa, więc zamiast trzech linii wychodziły
         cztery. */
      tytul2: "cósmica e boa",
      copy:
        "Panquecas, waffles, tostas e pratos do dia na atmosfera cinematográfica e cósmica única do Alvernia Planet.",
      zalety: ["Sem bilhete.", "Famílias e grupos.", "Almoços, snacks, sobremesas."],
      zacheta: "As emoções do cinema abrem o apetite",
      ctaMenu: "Ver o menu",
      ctaDojazd: "Como chegar",
    },
    baner: { poprzedni: "Banner anterior", nastepny: "Banner seguinte" },
    menu: {
      overline: "Um menu cinematográfico e cósmico",
      tytul: "O que come sob as cúpulas?",
      nastepne: "Foto seguinte",
      pozycje: [
        { nazwa: "Panquecas doces", opis: "Chocolate, framboesas, morangos." },
        { nazwa: "Panquecas salgadas", opis: "Espinafres, ou fiambre com queijo." },
        { nazwa: "Waffles", opis: "Estaladiços, feitos na hora." },
        { nazwa: "Tostas", opis: "Para a pausa rápida entre aventuras." },
        { nazwa: "Tiras de frango e batatas", opis: "A opção mais substancial para exploradores de todas as idades." },
        { nazwa: "Bom café e chá", opis: "Bebidas e sobremesa para terminar a missão." },
      ],
    },
    klasa: {
      overline: "Grupos e escolas",
      tytul: "Venha com ",
      tytulAkcent: "a turma",
      copy:
        "Uma oferta dedicada a grupos, infantários e escolas. Caras sorridentes, barrigas cheias, energia para a próxima aventura.",
    },
    podroz: {
      overline: "A caminho",
      tytul: "Com fome a caminho? ",
      tytulAkcent: "Passe pelas cúpulas",
      copy:
        "Segue para Cracóvia ou para as montanhas? Em vez de mais uma paragem na bomba de gasolina — uma panqueca, um café ou um almoço sob as cúpulas.",
      wyroznienie: "A entrada no bistro não exige bilhete do Alvernia Planet.",
      cta: "Traçar rota",
      adres: "Alvernia Planet, ul. Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
    },
    godziny: { tytul: "Horário", dni: "Segunda – domingo", zakres: "11:00–18:00" },
    galeria: {
      overline: "Galeria",
      tytul: "Veja como é por cá",
      poprzednie: "Fotos anteriores",
      nastepne: "Fotos seguintes",
    },
    faq: {
      overline: "É bom saber",
      tytul: "Perguntas frequentes",
      pytania: [
        {
          pytanie: "Posso entrar no Bistro pod Kopułami sem bilhete do Alvernia Planet?",
          odpowiedz: "Sim. O bistro está aberto também a quem não visita as atrações do Alvernia Planet.",
        },
        {
          pytanie: "O bistro é adequado para famílias com crianças?",
          odpowiedz:
            "Sim. O menu inclui panquecas, waffles, tostas e pratos adequados a uma refeição em família.",
        },
        {
          pytanie: "É possível almoçar?",
          odpowiedz: "Sim. Há pratos do dia — todos os dias algo diferente.",
        },
        {
          pytanie: "Qual é o horário do bistro?",
          odpowiedz: "De segunda a domingo, das 11:00 às 18:00.",
        },
        {
          pytanie: "Há estacionamento no Alvernia Planet?",
          odpowiedz: "Sim, temos um estacionamento amplo para 250+ pessoas.",
        },
        {
          pytanie: "Posso pagar com cartão ou BLIK?",
          odpowiedz: "Sim, aceitamos pagamentos com cartão e BLIK.",
        },
      ],
    },
    alt: {
      klasa: "Um grupo escolar às mesas sob a cúpula do Alvernia Planet",
      podroz: "A entrada do recinto do Alvernia Planet e o estacionamento",
      alver: "Alvernia, a mascote do Alvernia Planet, vestida de chef com um prato de panquecas",
      galeria: [
        "Alunos às mesas sob a cúpula do Alvernia Planet",
        "Frigoríficos de bebidas no bistrô do Alvernia Planet",
        "Uma vitrine de snacks no balcão do bistrô",
        "As cúpulas do Alvernia Planet vistas de fora",
        "A entrada do recinto do Alvernia Planet",
        "Interior cenográfico de uma cúpula do Alvernia Planet sob iluminação noturna",
      ],
    },
  },

  zh: {
    meta: {
      tytul: "Bistro pod Kopułami，Alvernia Planet",
      opis:
        "Alvernia Planet 的 Bistro pod Kopułami：可丽饼、华夫饼、焗烤面包、炸鸡条和每日午餐。每天 11:00–18:00 营业，无需门票即可进入。",
    },
    hero: {
      overline: "Bistro",
      tytul1: "宇宙级",
      tytul2: "的美味",
      copy:
        "可丽饼、华夫饼、焗烤面包和每日午餐，尽在 Alvernia Planet 独一无二的电影宇宙氛围中。",
      zalety: ["无需门票。", "家庭与团体。", "午餐、点心、甜点。"],
      zacheta: "电影般的刺激，最能勾起食欲",
      ctaMenu: "查看菜单",
      ctaDojazd: "交通方式",
    },
    baner: { poprzedni: "上一张横幅", nastepny: "下一张横幅" },
    menu: {
      overline: "电影与宇宙风味菜单",
      tytul: "在穹顶下能吃到什么？",
      nastepne: "下一张照片",
      pozycje: [
        { nazwa: "甜味可丽饼", opis: "巧克力、覆盆子、草莓。" },
        { nazwa: "咸味可丽饼", opis: "菠菜，或火腿芝士。" },
        { nazwa: "华夫饼", opis: "现做，外皮酥脆。" },
        { nazwa: "焗烤面包", opis: "适合两段冒险之间的快速小憩。" },
        { nazwa: "炸鸡条配薯条", opis: "给大小探险家更实在的一份。" },
        { nazwa: "香浓咖啡与茶", opis: "饮料和甜点，为任务收尾。" },
      ],
    },
    klasa: {
      overline: "团体与学校",
      tytul: "带着全班",
      tytulAkcent: "一起来",
      copy: "为团体、幼儿园和学校准备的专属方案。笑脸、饱肚子，还有继续冒险的精力。",
    },
    podroz: {
      overline: "顺路",
      tytul: "路上饿了？",
      tytulAkcent: "来穹顶下坐坐",
      copy:
        "正前往克拉科夫或山区？与其再停一次加油站，不如在穹顶下吃份可丽饼、喝杯咖啡或用顿午餐。",
      wyroznienie: "进入餐吧无需购买 Alvernia Planet 门票。",
      cta: "规划路线",
      adres: "Alvernia Planet, ul. Ferdynanda Wspaniałego 1, 32-566 Nieporaz",
    },
    godziny: { tytul: "营业时间", dni: "周一至周日", zakres: "11:00–18:00" },
    galeria: {
      overline: "图集",
      tytul: "看看我们这里",
      poprzednie: "上一组照片",
      nastepne: "下一组照片",
    },
    faq: {
      overline: "实用信息",
      tytul: "常见问题",
      pytania: [
        {
          pytanie: "没有 Alvernia Planet 门票，可以进 Bistro pod Kopułami 吗？",
          odpowiedz: "可以。不参观园区项目的客人同样可以来餐吧。",
        },
        {
          pytanie: "餐吧适合带孩子的家庭吗？",
          odpowiedz: "适合。菜单上有可丽饼、华夫饼、焗烤面包，以及适合全家一起吃的餐点。",
        },
        {
          pytanie: "可以在这里吃午餐吗？",
          odpowiedz: "可以。我们提供每日午餐，每天都不一样。",
        },
        {
          pytanie: "餐吧的营业时间是？",
          odpowiedz: "周一至周日，11:00–18:00。",
        },
        {
          pytanie: "Alvernia Planet 有停车场吗？",
          odpowiedz: "有，我们的停车场可容纳 250+ 人。",
        },
        {
          pytanie: "可以刷卡或用 BLIK 付款吗？",
          odpowiedz: "可以，我们接受刷卡和 BLIK 付款。",
        },
      ],
    },
    alt: {
      klasa: "Alvernia Planet 穹顶下餐桌旁的学生团体",
      podroz: "Alvernia Planet 园区入口与访客停车场",
      alver: "Alvernia Planet 的吉祥物 Alvernia 身穿厨师装，端着一盘可丽饼",
      galeria: [
        "穹顶下餐桌旁的学生",
        "Alvernia Planet 小餐馆的饮料冷藏柜",
        "餐台旁的零食展示柜",
        "从外面看 Alvernia Planet 的穹顶",
        "Alvernia Planet 园区入口",
        "夜间灯光下 Alvernia Planet 穹顶的布景内部",
      ],
    },
  },
};
