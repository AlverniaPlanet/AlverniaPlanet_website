import type { Locale } from "@/lib/localizedRoutes";

/* ---------------------------------------------------------------------------
   Treści landing page'a /wydarzenia. Osobny plik, bo page.tsx i tak trzyma już
   dane kopuł, kontakty i wideo — trzymanie tu jeszcze kilkuset linii copy
   zrobiłoby z niego plik nie do czytania.
   --------------------------------------------------------------------------- */

export type LandingCopy = {
  /** title — duża linia; titleSub — dopowiedzenie w jednym wierszu pod spodem, mniejszym stopniem. */
  hero: { eyebrow: string; title: string; titleSub: string; lead: string; scrollHint: string };
  cta: { primary: string; spaces: string; offer: string; talk: string; similar: string };
  stats: { label: string; items: { value: string; label: string }[] };
  why: { title: string; items: { title: string; body: string }[] };
  formats: { title: string; lead: string; items: { title: string; body: string }[] };
  cases: { title: string; lead: string; formatLabel: string };
  /** Pasek logotypów firm, które zorganizowały u nas wydarzenie. */
  trusted: { title: string; lead: string };
  spaces: {
    label: string;
    title: string;
    lead: string;
    detailsCta: string;
    activeLabel: string;
    specsLabel: string;
    featuresLabel: string;
    /** Hasło na zdjęciu — każdy element to osobny wiersz. */
    domeTaglines: { k3: string[]; k7: string[]; k10: string[]; k12: string[] };
  };
  vr: { label: string; title: string; lead: string; cta: string };
  map: { title: string };
  form: {
    /* Nadtytuł nad nagłówkiem sekcji kontaktowej. */
    eyebrow: string;
    /* Kafelek pod wizytówkami — dla osób, które nie mają jeszcze briefu. */
    title: string;
    lead: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    type: string;
    guests: string;
    date: string;
    message: string;
    optional: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    note: string;
  };
};

const pl: LandingCopy = {
  "hero": {
    "eyebrow": "EVENTY\u00a0• KONFERENCJE\u00a0• GALE\u00a0• PREMIERY",
    "title": "Zorganizuj wydarzenie,",
    "titleSub": "którego nie da się pomylić z żadnym innym.",
    "lead": "Wynajmij futurystyczną przestrzeń na konferencję, galę lub premierę produktu. Alvernia Planet w Nieporazie, przy autostradzie A4.",
    "scrollHint": "Przestrzenie do wynajęcia"
  },
  "cta": {
    "primary": "Zapytaj o termin",
    "spaces": "Zobacz przestrzenie",
    "offer": "Poproś o ofertę",
    "talk": "Porozmawiaj z opiekunem",
    "similar": "Zorganizuj podobne wydarzenie"
  },
  "stats": {
    "label": "Kluczowe parametry",
    "items": [
      {
        "value": "2 × 2 000 m²",
        "label": "Kopuły eventowe"
      },
      {
        "value": "do 15 m",
        "label": "Wysokość przestrzeni (K3)"
      },
      {
        "value": "do 1 MW",
        "label": "Przyłącza elektryczne (K3)"
      },
      {
        "value": "A4",
        "label": "Między Krakowem a Katowicami"
      }
    ]
  },
  "why": {
    "title": "Miejsce, które pracuje na *efekt wydarzenia*.",
    "items": [
      {
        "title": "Architektura z charakterem",
        "body": "Futurystyczne kopuły tworzą wyrazistą oprawę wydarzenia."
      },
      {
        "title": "Zaplecze techniczne",
        "body": "Sprawdź wyposażenie, zasilanie i dostęp techniczny kopuły."
      },
      {
        "title": "Przestrzeń do aranżacji",
        "body": "Poznaj możliwości dopasowania wnętrza do formatu wydarzenia."
      },
      {
        "title": "Kontakt z zespołem",
        "body": "Porozmawiaj o dostępności przestrzeni i warunkach wynajmu."
      }
    ]
  },
  "formats": {
    "title": "Rodzaje wydarzeń",
    "lead": "Zobacz przykłady wydarzeń w kopułach Alvernia Planet.",
    "items": [
      {
        "title": "Gale i bankiety",
        "body": "Uroczyste kolacje, bankiety i gale wręczenia nagród w futurystycznej scenerii."
      },
      {
        "title": "Konferencje",
        "body": "Przestrzeń na wystąpienia, prezentacje i spotkania branżowe."
      },
      {
        "title": "Koncerty",
        "body": "Koncerty i występy na żywo w industrialnej scenerii kopuł."
      },
      {
        "title": "Premiery produktów",
        "body": "Miejsce, w którym Twój produkt staje się głównym bohaterem wydarzenia."
      },
      {
        "title": "Eventy firmowe",
        "body": "Spotkania zespołów, jubileusze firm i wydarzenia dla partnerów biznesowych."
      },
      {
        "title": "Pokazy i targi",
        "body": "Przestrzeń na stoiska, ekspozycje i prezentacje branżowe."
      }
    ]
  },
  "cases": {
    "title": "Zobacz, jak może wyglądać Twój event",
    "lead": "Materiały z wydarzeń, które odbyły się w Alvernia Planet.",
    "formatLabel": "Format"
  },
  "trusted": {
    "title": "Zaufali nam",
    "lead": "Firmy, które zorganizowały u nas wydarzenie."
  },
  "spaces": {
    "label": "Przestrzenie",
    "title": "Wybierz przestrzeń dla swojego wydarzenia",
    "lead": "Przestrzenie dostępne pod wynajem. Wybierz kopułę, aby poznać jej parametry.",
    "detailsCta": "Zobacz szczegóły",
    "activeLabel": "Wybrana przestrzeń",
    "specsLabel": "Parametry techniczne",
    "featuresLabel": "Szczegóły",
    "domeTaglines": {
      "k3": [
        "Imponująca skala.",
        "Przestrzeń na Twój pomysł."
      ],
      "k7": [
        "Kinowy obraz 4K.",
        "Certyfikat Dolby Premier."
      ],
      "k10": [
        "Dwa poziomy.",
        "600 m² do zagospodarowania."
      ],
      "k12": [
        "Dwa poziomy.",
        "600 m² do zagospodarowania."
      ]
    }
  },
  "vr": {
    "label": "Spacer 360°",
    "title": "Wejdź do przestrzeni bez wychodzenia z biura",
    "lead": "Rozejrzyj się po kopule i oceń jej skalę jeszcze przed wizją lokalną.",
    "cta": "Uruchom spacer 360°"
  },
  "map": {
    "title": "Znajdź *przestrzeń*\nna wydarzenie"
  },
  "form": {
    "eyebrow": "TWÓJ EVENT ZACZYNA SIĘ TUTAJ",
    "title": "Planujesz wydarzenie?",
    "lead": "Opowiedz nam o nim.",
    "name": "Imię i nazwisko",
    "company": "Firma",
    "email": "E-mail",
    "phone": "Telefon",
    "type": "Rodzaj wydarzenia",
    "guests": "Planowana liczba uczestników",
    "date": "Planowany termin",
    "message": "Dodatkowe informacje",
    "optional": "opcjonalnie",
    "submit": "Sprawdź dostępność i poproś o ofertę",
    "sending": "Wysyłanie...",
    "success": "Dziękujemy. Odezwiemy się najszybciej, jak to możliwe.",
    "error": "Nie udało się wysłać wiadomości. Zadzwoń do nas lub napisz na adres e-mail.",
    "note": "Podaj rodzaj wydarzenia, liczbę gości i orientacyjny termin. Odezwiemy się z propozycją dopasowaną do Twoich potrzeb."
  },
};

const en: LandingCopy = {
  "hero": {
    "eyebrow": "EVENTS\u00a0• CONFERENCES\u00a0• GALAS\u00a0• LAUNCHES",
    "title": "Host an event",
    "titleSub": "no one could mistake for anything else.",
    "lead": "Rent a futuristic space for a conference, gala or product launch. Alvernia Planet in Nieporaz, right by the A4 motorway.",
    "scrollHint": "Spaces for rent"
  },
  "cta": {
    "primary": "Ask about a date",
    "spaces": "View the spaces",
    "offer": "Request a proposal",
    "talk": "Speak to an event manager",
    "similar": "Host a similar event"
  },
  "stats": {
    "label": "Key specifications",
    "items": [
      {
        "value": "2 × 2,000 m²",
        "label": "Event domes"
      },
      {
        "value": "up to 15 m",
        "label": "Interior height (K3)"
      },
      {
        "value": "up to 1 MW",
        "label": "Power supply (K3)"
      },
      {
        "value": "A4",
        "label": "Between Kraków and Katowice"
      }
    ]
  },
  "why": {
    "title": "A venue that does *half the work* for you.",
    "items": [
      {
        "title": "Architecture with character",
        "body": "The futuristic domes give the event a distinctive setting."
      },
      {
        "title": "Technical facilities",
        "body": "Check the equipment, power and technical access of a dome."
      },
      {
        "title": "Space to arrange",
        "body": "See how the interior can be adapted to your event format."
      },
      {
        "title": "Talk to the team",
        "body": "Ask about availability and rental terms."
      }
    ]
  },
  "formats": {
    "title": "Event types",
    "lead": "See examples of events held in the Alvernia Planet domes.",
    "items": [
      {
        "title": "Galas and banquets",
        "body": "Ceremonial dinners, banquets and award galas in a futuristic setting."
      },
      {
        "title": "Conferences",
        "body": "Space for talks, presentations and industry meetings."
      },
      {
        "title": "Concerts",
        "body": "Concerts and live shows in the industrial setting of the domes."
      },
      {
        "title": "Product launches",
        "body": "A place where your product becomes the main character of the event."
      },
      {
        "title": "Corporate events",
        "body": "Team meetings, company anniversaries and events for business partners."
      },
      {
        "title": "Shows and trade fairs",
        "body": "Space for stands, exhibitions and industry presentations."
      }
    ]
  },
  "cases": {
    "title": "See what your event could look like",
    "lead": "Footage from events held at Alvernia Planet.",
    "formatLabel": "Format"
  },
  "trusted": {
    "title": "Trusted by",
    "lead": "Companies that have held an event with us."
  },
  "spaces": {
    "label": "Spaces",
    "title": "Choose the space for your event",
    "lead": "Spaces available to hire. Pick a dome to see its specifications.",
    "detailsCta": "View details",
    "activeLabel": "Selected space",
    "specsLabel": "Technical specifications",
    "featuresLabel": "Details",
    "domeTaglines": {
      "k3": [
        "Impressive scale.",
        "Room for your idea."
      ],
      "k7": [
        "Cinema-grade 4K picture.",
        "Dolby Premier certified."
      ],
      "k10": [
        "Two levels.",
        "600 m² to arrange as you wish."
      ],
      "k12": [
        "Two levels.",
        "600 m² to arrange as you wish."
      ]
    }
  },
  "vr": {
    "label": "360° tour",
    "title": "Step inside the space without leaving your office",
    "lead": "Look around the dome and gauge its scale before a site visit.",
    "cta": "Launch the 360° tour"
  },
  "map": {
    "title": "Find the *space*\nfor your event"
  },
  "form": {
    "eyebrow": "YOUR EVENT STARTS HERE",
    "title": "Planning an event?",
    "lead": "Tell us about it.",
    "name": "Full name",
    "company": "Company",
    "email": "Email",
    "phone": "Phone",
    "type": "Event type",
    "guests": "Expected number of attendees",
    "date": "Preferred date",
    "message": "Additional information",
    "optional": "optional",
    "submit": "Check availability and request a proposal",
    "sending": "Sending…",
    "success": "Thank you. We'll be in touch as soon as we can.",
    "error": "Your message could not be sent. Please call or email us instead.",
    "note": "Tell us the type of event, the number of guests and an approximate date. We will come back with a proposal matched to your needs."
  },
};

const pt: LandingCopy = {
  "hero": {
    "eyebrow": "EVENTOS\u00a0• CONFERÊNCIAS\u00a0• GALAS\u00a0• LANÇAMENTOS",
    "title": "Organize um evento",
    "titleSub": "impossível de confundir com qualquer outro.",
    "lead": "Alugue um espaço futurista para uma conferência, gala ou lançamento de produto. Alvernia Planet em Nieporaz, junto à autoestrada A4.",
    "scrollHint": "Espaços para alugar"
  },
  "cta": {
    "primary": "Pedir data",
    "spaces": "Ver espaços",
    "offer": "Pedir proposta",
    "talk": "Falar com o gestor de conta",
    "similar": "Organizar um evento semelhante"
  },
  "stats": {
    "label": "Parâmetros principais",
    "items": [
      {
        "value": "2 × 2000 m²",
        "label": "Cúpulas para eventos"
      },
      {
        "value": "até 15 m",
        "label": "Pé-direito (K3)"
      },
      {
        "value": "até 1 MW",
        "label": "Ligações elétricas (K3)"
      },
      {
        "value": "A4",
        "label": "Entre Kraków e Katowice"
      }
    ]
  },
  "why": {
    "title": "Um espaço que potencia o *impacto do evento*.",
    "items": [
      {
        "title": "Arquitetura com carácter",
        "body": "As cúpulas futuristas dão ao evento um cenário distinto."
      },
      {
        "title": "Infraestrutura técnica",
        "body": "Consulte equipamento, energia e acessos técnicos da cúpula."
      },
      {
        "title": "Espaço para configurar",
        "body": "Veja como adaptar o interior ao formato do seu evento."
      },
      {
        "title": "Contacto com a equipa",
        "body": "Fale sobre disponibilidade e condições de aluguer."
      }
    ]
  },
  "formats": {
    "title": "Tipos de eventos",
    "lead": "Veja exemplos de eventos realizados nas cúpulas do Alvernia Planet.",
    "items": [
      {
        "title": "Galas e banquetes",
        "body": "Jantares de gala, banquetes e entregas de prémios num cenário futurista."
      },
      {
        "title": "Conferências",
        "body": "Espaço para intervenções, apresentações e encontros do setor."
      },
      {
        "title": "Concertos",
        "body": "Concertos e espetáculos ao vivo no cenário industrial das cúpulas."
      },
      {
        "title": "Lançamentos de produtos",
        "body": "O lugar onde o seu produto se torna o protagonista do evento."
      },
      {
        "title": "Eventos corporativos",
        "body": "Encontros de equipas, aniversários de empresa e eventos para parceiros."
      },
      {
        "title": "Mostras e feiras",
        "body": "Espaço para stands, exposições e apresentações do setor."
      }
    ]
  },
  "cases": {
    "title": "Veja como pode ser o seu evento",
    "lead": "Vídeos de eventos que decorreram na Alvernia Planet.",
    "formatLabel": "Formato"
  },
  "trusted": {
    "title": "Confiaram em nós",
    "lead": "Empresas que realizaram um evento connosco."
  },
  "spaces": {
    "label": "Espaços",
    "title": "Escolha o espaço para o seu evento",
    "lead": "Espaços disponíveis para aluguer. Escolha uma cúpula para ver os seus parâmetros.",
    "detailsCta": "Ver detalhes",
    "activeLabel": "Espaço selecionado",
    "specsLabel": "Parâmetros técnicos",
    "featuresLabel": "Detalhes",
    "domeTaglines": {
      "k3": [
        "Escala impressionante.",
        "Espaço para a sua ideia."
      ],
      "k7": [
        "Imagem de cinema em 4K.",
        "Certificação Dolby Premier."
      ],
      "k10": [
        "Dois pisos.",
        "600 m² para organizar à sua medida."
      ],
      "k12": [
        "Dois pisos.",
        "600 m² para organizar à sua medida."
      ]
    }
  },
  "vr": {
    "label": "Visita 360°",
    "title": "Entre no espaço sem sair do escritório",
    "lead": "Olhe em redor da cúpula e avalie a sua escala ainda antes da visita ao local.",
    "cta": "Iniciar visita 360°"
  },
  "map": {
    "title": "Encontre o *espaço*\npara o seu evento"
  },
  "form": {
    "eyebrow": "O SEU EVENTO COMEÇA AQUI",
    "title": "Está a planear um evento?",
    "lead": "Fale-nos dele.",
    "name": "Nome completo",
    "company": "Empresa",
    "email": "E-mail",
    "phone": "Telefone",
    "type": "Tipo de evento",
    "guests": "Número previsto de participantes",
    "date": "Data prevista",
    "message": "Informações adicionais",
    "optional": "opcional",
    "submit": "Consultar disponibilidade e pedir proposta",
    "sending": "A enviar...",
    "success": "Obrigado. Entraremos em contacto assim que possível.",
    "error": "Não foi possível enviar a mensagem. Ligue-nos ou envie-nos um e-mail.",
    "note": "Indique o tipo de evento, o número de convidados e uma data aproximada. Voltaremos com uma proposta adequada às suas necessidades."
  },
};

const de: LandingCopy = {
  "hero": {
    "eyebrow": "EVENTS\u00a0• KONFERENZEN\u00a0• GALAS\u00a0• PREMIEREN",
    "title": "Veranstalten Sie ein Event,",
    "titleSub": "das mit keinem anderen zu verwechseln ist.",
    "lead": "Mieten Sie eine futuristische Fläche für Konferenz, Gala oder Produktpremiere. Alvernia Planet in Nieporaz, direkt an der A4.",
    "scrollHint": "Flächen zu mieten"
  },
  "cta": {
    "primary": "Termin anfragen",
    "spaces": "Flächen ansehen",
    "offer": "Angebot anfordern",
    "talk": "Ansprechpartner kontaktieren",
    "similar": "Ähnliches Event planen"
  },
  "stats": {
    "label": "Die wichtigsten Eckdaten",
    "items": [
      {
        "value": "2 × 2.000 m²",
        "label": "Event-Kuppeln"
      },
      {
        "value": "bis 15 m",
        "label": "Raumhöhe (K3)"
      },
      {
        "value": "bis 1 MW",
        "label": "Stromanschlüsse (K3)"
      },
      {
        "value": "A4",
        "label": "Zwischen Kraków und Katowice"
      }
    ]
  },
  "why": {
    "title": "Ein Ort, der für Ihr *Event* arbeitet.",
    "items": [
      {
        "title": "Architektur mit Charakter",
        "body": "Futuristische Kuppeln geben dem Event einen markanten Rahmen."
      },
      {
        "title": "Technische Ausstattung",
        "body": "Prüfen Sie Ausstattung, Strom und technische Zufahrt."
      },
      {
        "title": "Fläche zum Gestalten",
        "body": "Sehen Sie, wie sich der Innenraum an Ihr Format anpassen lässt."
      },
      {
        "title": "Kontakt zum Team",
        "body": "Sprechen Sie über Verfügbarkeit und Mietbedingungen."
      }
    ]
  },
  "formats": {
    "title": "Was hier stattfindet",
    "lead": "Beispiele von Veranstaltungen in den Kuppeln von Alvernia Planet.",
    "items": [
      {
        "title": "Galas und Bankette",
        "body": "Festliche Dinner, Bankette und Preisverleihungen in futuristischer Kulisse."
      },
      {
        "title": "Konferenzen",
        "body": "Raum für Vorträge, Präsentationen und Branchentreffen."
      },
      {
        "title": "Konzerte",
        "body": "Konzerte und Live-Auftritte in der industriellen Kulisse der Kuppeln."
      },
      {
        "title": "Produktpremieren",
        "body": "Der Ort, an dem Ihr Produkt zur Hauptfigur des Abends wird."
      },
      {
        "title": "Firmenevents",
        "body": "Teamtreffen, Firmenjubiläen und Veranstaltungen für Geschäftspartner."
      },
      {
        "title": "Shows und Messen",
        "body": "Raum für Stände, Ausstellungen und Branchenpräsentationen."
      }
    ]
  },
  "cases": {
    "title": "So kann Ihr Event aussehen",
    "lead": "Videos von Veranstaltungen bei Alvernia Planet.",
    "formatLabel": "Format"
  },
  "trusted": {
    "title": "Sie vertrauen uns",
    "lead": "Unternehmen, die bei uns eine Veranstaltung ausgerichtet haben."
  },
  "spaces": {
    "label": "Flächen",
    "title": "Wählen Sie die Fläche für Ihr Event",
    "lead": "Diese Flächen stehen zur Vermietung. Wählen Sie eine Kuppel und sehen Sie ihre Daten.",
    "detailsCta": "Details ansehen",
    "activeLabel": "Ausgewählte Fläche",
    "specsLabel": "Technische Daten",
    "featuresLabel": "Details",
    "domeTaglines": {
      "k3": [
        "Beeindruckende Dimensionen.",
        "Raum für Ihre Idee."
      ],
      "k7": [
        "Kinobild in 4K.",
        "Dolby-Premier-zertifiziert."
      ],
      "k10": [
        "Zwei Ebenen.",
        "600 m² frei gestaltbar."
      ],
      "k12": [
        "Zwei Ebenen.",
        "600 m² frei gestaltbar."
      ]
    }
  },
  "vr": {
    "label": "360°-Rundgang",
    "title": "Betreten Sie den Raum, ohne Ihr Büro zu verlassen",
    "lead": "Sehen Sie sich in der Kuppel um und verschaffen Sie sich einen Eindruck von ihrer Größe – noch vor der Ortsbegehung.",
    "cta": "360°-Rundgang starten"
  },
  "map": {
    "title": "Passende *Fläche*\nfür Ihr Event"
  },
  "form": {
    "eyebrow": "IHR EVENT BEGINNT HIER",
    "title": "Planen Sie ein Event?",
    "lead": "Erzählen Sie uns davon.",
    "name": "Vor- und Nachname",
    "company": "Unternehmen",
    "email": "E-Mail",
    "phone": "Telefon",
    "type": "Art der Veranstaltung",
    "guests": "Geplante Teilnehmerzahl",
    "date": "Wunschtermin",
    "message": "Zusätzliche Informationen",
    "optional": "optional",
    "submit": "Verfügbarkeit prüfen und Angebot anfordern",
    "sending": "Wird gesendet …",
    "success": "Vielen Dank. Wir melden uns schnellstmöglich bei Ihnen.",
    "error": "Die Nachricht konnte nicht gesendet werden. Rufen Sie uns an oder schreiben Sie uns eine E-Mail.",
    "note": "Nennen Sie Art der Veranstaltung, Gästezahl und einen ungefähren Termin. Wir melden uns mit einem passenden Vorschlag."
  },
};

const zh: LandingCopy = {
  "hero": {
    "eyebrow": "活动\u00a0• 会议\u00a0• 盛典\u00a0• 新品发布",
    "title": "让您的活动，",
    "titleSub": "不与任何一场雷同。",
    "lead": "租用未来感空间，举办会议、晚宴或产品发布会。Alvernia Planet 位于 Nieporaz，紧邻 A4 高速公路。",
    "scrollHint": "可租用空间"
  },
  "cta": {
    "primary": "咨询档期",
    "spaces": "查看空间",
    "offer": "索取报价",
    "talk": "联系专属顾问",
    "similar": "举办同类活动"
  },
  "stats": {
    "label": "关键参数",
    "items": [
      {
        "value": "2 × 2,000 m²",
        "label": "活动穹顶"
      },
      {
        "value": "最高 15 m",
        "label": "空间高度（K3）"
      },
      {
        "value": "最高 1 MW",
        "label": "电力接入（K3）"
      },
      {
        "value": "A4 高速",
        "label": "Kraków 与Katowice 之间"
      }
    ]
  },
  "why": {
    "title": "场地本身，就是*活动效果*的一部分。",
    "items": [
      {
        "title": "有辨识度的建筑",
        "body": "未来感穹顶为活动提供鲜明的场景。"
      },
      {
        "title": "技术配套",
        "body": "查看所选穹顶的设备、供电与技术通道。"
      },
      {
        "title": "可自由布置的空间",
        "body": "了解内部如何配合您的活动形式。"
      },
      {
        "title": "与团队联系",
        "body": "咨询空间档期与租用条件。"
      }
    ]
  },
  "formats": {
    "title": "活动类型",
    "lead": "看看在 Alvernia Planet 穹顶举办过的活动示例。",
    "items": [
      {
        "title": "盛典与宴会",
        "body": "在未来感场景中举办晚宴、宴会与颁奖典礼。"
      },
      {
        "title": "会议",
        "body": "适合演讲、发布与行业交流的空间。"
      },
      {
        "title": "音乐会",
        "body": "在工业风穹顶中举办音乐会与现场演出。"
      },
      {
        "title": "新品发布",
        "body": "让您的产品成为活动主角的场地。"
      },
      {
        "title": "企业活动",
        "body": "团队聚会、公司周年庆与合作伙伴活动。"
      },
      {
        "title": "展示与展会",
        "body": "适合展位、展陈与行业展示的空间。"
      }
    ]
  },
  "cases": {
    "title": "看看您的活动可以是什么样子",
    "lead": "在 Alvernia Planet 举办过的活动影像。",
    "formatLabel": "形式"
  },
  "trusted": {
    "title": "他们信任我们",
    "lead": "曾在这里举办活动的企业。"
  },
  "spaces": {
    "label": "空间",
    "title": "为您的活动选择空间",
    "lead": "以下空间可供租用。选择一座穹顶，查看它的参数。",
    "detailsCta": "查看详情",
    "activeLabel": "已选空间",
    "specsLabel": "技术参数",
    "featuresLabel": "详情",
    "domeTaglines": {
      "k3": [
        "规模宏大。",
        "为您的创意留出空间。"
      ],
      "k7": [
        "影院级 4K 画面。",
        "Dolby Premier 认证。"
      ],
      "k10": [
        "双层空间。",
        "600 m² 自由布置。"
      ],
      "k12": [
        "双层空间。",
        "600 m² 自由布置。"
      ]
    }
  },
  "vr": {
    "label": "360° 全景漫游",
    "title": "无需离开办公室，即可走进空间",
    "lead": "在实地考察之前，先环视穹顶，感受它的尺度。",
    "cta": "开启 360° 漫游"
  },
  "map": {
    "title": "为您的活动\n找到合适的*空间*"
  },
  "form": {
    "eyebrow": "您的活动从这里开始",
    "title": "正在筹备活动？",
    "lead": "欢迎与我们聊聊。",
    "name": "姓名",
    "company": "公司名称",
    "email": "电子邮箱",
    "phone": "联系电话",
    "type": "活动类型",
    "guests": "预计参与人数",
    "date": "计划档期",
    "message": "补充信息",
    "optional": "选填",
    "submit": "查询档期并索取报价",
    "sending": "发送中……",
    "success": "感谢您的咨询。我们会尽快与您联系。",
    "error": "消息发送失败。请致电或发送电子邮件与我们联系。",
    "note": "请告诉我们活动类型、宾客人数和大致日期。我们会带着贴合您需求的方案与您联系。"
  },
};

export const LANDING_COPY: Record<Locale, LandingCopy> = { pl, en, pt, de, zh };
